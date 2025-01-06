import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { ApplicationData } from './types.ts';

export class Database {
  private client;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  async getApplication(applicationId: number): Promise<ApplicationData> {
    const { data, error } = await this.client
      .from('applications')
      .select('*')
      .eq('application_id', applicationId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch application: ${error.message}`);
    }

    return data;
  }

  async updateImpactScore(applicationId: number, score: number, details: Record<string, any>) {
    const { error } = await this.client
      .from('applications')
      .update({ 
        impact_score: score,
        impact_score_details: details
      })
      .eq('application_id', applicationId);

    if (error) {
      throw new Error(`Failed to update impact score: ${error.message}`);
    }
  }
}