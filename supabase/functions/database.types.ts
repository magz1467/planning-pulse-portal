export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          application_id: number
          id: string
          lpa_app_no: string | null
          lpa_name: string | null
          application_type: string | null
          application_type_full: string | null
          status: string | null
          description: string | null
          bo_system: string | null
          valid_date: string | null
          decision_date: string | null
          decision_target_date: string | null
          last_updated: string | null
          last_synced: string | null
          last_date_consultation_comments: string | null
          lapsed_date: string | null
          actual_commencement_date: string | null
          actual_completion_date: string | null
          date_building_work_started_under_previous_permission: string | null
          date_building_work_completed_under_previous_permission: string | null
          borough: string | null
          ward: string | null
          site_name: string | null
          site_number: string | null
          street_name: string | null
          secondary_street_name: string | null
          locality: string | null
          postcode: string | null
          centroid_easting: string | null
          centroid_northing: string | null
          centroid: Json | null
          polygon: Json | null
          wgs84_polygon: Json | null
          pp_id: string | null
          uprn: string | null
          epc_number: string | null
          title_number: string | null
          reference_no_of_permission_being_relied_on: string | null
          decision: string | null
          decision_process: string | null
          decision_agency: string | null
          decision_conditions: Json | null
          appeal_status: string | null
          appeal_decision: string | null
          appeal_decision_date: string | null
          appeal_start_date: string | null
          development_type: string | null
          subdivision_of_building: string | null
          parking_details: Json | null
          application_details: Json | null
          url_planning_app: string | null
          cil_liability: string | null
          last_updated_by: string | null
          geom: unknown | null
          ai_title: string | null
          image_map_url: string | null
          impact_score: number | null
          impact_score_details: Json | null
        }
      }
    }
  }
}