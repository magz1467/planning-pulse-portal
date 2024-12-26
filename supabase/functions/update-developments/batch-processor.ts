import { createSupabaseClient } from '../_shared/supabase-client.ts';
import { DevelopmentUpdate, BatchProcessResult } from './types.ts';

export async function processBatch(batch: DevelopmentUpdate[]): Promise<BatchProcessResult> {
  let inserts = 0;
  let updates = 0;
  const supabase = createSupabaseClient();

  try {
    // First check which records exist
    const externalIds = batch.map(dev => dev.external_id);
    const { data: existingRecords } = await supabase
      .from('developments')
      .select('external_id, status, decision_due, consultation_end')
      .in('external_id', externalIds);

    const existingMap = new Map(existingRecords?.map(record => [record.external_id, record]));

    // Split batch into inserts and updates
    const toInsert = [];
    const toUpdate = [];

    for (const development of batch) {
      const existing = existingMap.get(development.external_id);
      
      if (!existing) {
        toInsert.push(development);
      } else if (
        existing.status !== development.status ||
        existing.decision_due !== development.decision_due?.toISOString() ||
        existing.consultation_end !== development.consultation_end?.toISOString()
      ) {
        toUpdate.push(development);
      }
    }

    // Process inserts
    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('developments')
        .insert(toInsert);

      if (insertError) {
        console.error('Error inserting developments:', insertError);
      } else {
        inserts = toInsert.length;
      }
    }

    // Process updates
    if (toUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from('developments')
        .upsert(toUpdate, {
          onConflict: 'external_id',
          ignoreDuplicates: false
        });

      if (updateError) {
        console.error('Error updating developments:', updateError);
      } else {
        updates = toUpdate.length;
      }
    }

  } catch (error) {
    console.error('Error processing batch:', error);
  }

  return { inserts, updates };
}