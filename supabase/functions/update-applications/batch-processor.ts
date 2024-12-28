import { createSupabaseClient } from '../_shared/supabase-client.ts';
import { Application, BatchProcessResult } from './types.ts';

export async function processBatch(batch: Application[]): Promise<BatchProcessResult> {
  let inserts = 0;
  let updates = 0;
  const supabase = createSupabaseClient();

  try {
    // First check which records exist
    const externalIds = batch.map(dev => dev.external_id);
    const { data: existingRecords } = await supabase
      .from('applications')
      .select('external_id, status, decision_due, consultation_end')
      .in('external_id', externalIds);

    const existingMap = new Map(existingRecords?.map(record => [record.external_id, record]));

    // Split batch into inserts and updates
    const toInsert: Application[] = [];
    // const toUpdate: ApplicationUpdate[] = [];

    for (const application of batch) {
      toInsert.push(application);
    }


    // checking for updates
    // for (const application of batch) {
    //   const existing = existingMap.get(application.external_id);
    //
    //   if (!existing) {
    //     toInsert.push(application);
    //   } else if (
    //     existing.status !== application.status ||
    //     existing.decision_due !== application.decision_due?.toISOString() ||
    //     existing.consultation_end !== application.consultation_end?.toISOString()
    //   ) {
    //     toUpdate.push(application);
    //   }
    // }

    // Process inserts
    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('applications')
        .insert(toInsert);

      if (insertError) {
        console.error('Error inserting applications:', insertError);
      } else {
        inserts = toInsert.length;
      }
    }

    // Process updates
    // if (toUpdate.length > 0) {
    //   const { error: updateError } = await supabase
    //     .from('applications')
    //     .upsert(toUpdate, {
    //       onConflict: 'external_id',
    //       ignoreDuplicates: false
    //     });
    //
    //   if (updateError) {
    //     console.error('Error updating applications:', updateError);
    //   } else {
    //     updates = toUpdate.length;
    //   }
    // }

  } catch (error) {
    console.error('Error processing batch:', error);
  }

  return { inserts, updates };
}
