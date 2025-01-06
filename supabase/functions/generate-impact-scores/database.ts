import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { ApplicationData, BatchStatus, ErrorDetail } from './types.ts';

export class Database {
  private supabase;

  constructor(url: string, key: string) {
    this.supabase = createClient(url, key);
  }

  async createBatchStatus(batchSize: number): Promise<BatchStatus> {
    const { data, error } = await this.supabase
      .from('impact_score_batch_status')
      .insert([{ batch_size: batchSize }])
      .select()
      .single();

    if (error) {
      console.error('[Impact Score] Error creating batch status:', error);
      throw error;
    }

    return data;
  }

  async getApplicationsWithoutScores(limit: number): Promise<ApplicationData[]> {
    const { data: applications, error } = await this.supabase
      .from('applications')
      .select('*')
      .is('impact_score', null)
      .limit(limit);

    if (error) {
      console.error('[Impact Score] Error fetching applications:', error);
      throw error;
    }

    return applications || [];
  }

  async updateApplicationScore(
    applicationId: number, 
    score: number, 
    details: any
  ): Promise<void> {
    const { error } = await this.supabase
      .from('applications')
      .update({ 
        impact_score: score,
        impact_score_details: details
      })
      .eq('application_id', applicationId);

    if (error) {
      throw error;
    }
  }

  async updateBatchStatus(
    batchId: number, 
    status: string, 
    completedCount: number,
    errorMessage?: string
  ): Promise<void> {
    await this.supabase
      .from('impact_score_batch_status')
      .update({ 
        status,
        completed_count: completedCount,
        error_message: errorMessage
      })
      .eq('id', batchId);
  }

  async getApplicationsWithScores(): Promise<{ count: number }> {
    const { count } = await this.supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .not('impact_score', 'is', null);

    return { count: count || 0 };
  }

  async getRecentScores(limit = 5): Promise<any[]> {
    const { data } = await this.supabase
      .from('applications')
      .select('application_id, impact_score, impact_score_details')
      .not('impact_score', 'is', null)
      .order('application_id', { ascending: false })
      .limit(limit);

    return data || [];
  }
}