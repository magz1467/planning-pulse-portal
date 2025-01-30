export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity_type: string
          application_id: number | null
          created_at: string
          id: number
          points: number
          user_id: string
        }
        Insert: {
          activity_type: string
          application_id?: number | null
          created_at?: string
          id?: number
          points: number
          user_id: string
        }
        Update: {
          activity_type?: string
          application_id?: number | null
          created_at?: string
          id?: number
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          Email: string | null
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          Email?: string | null
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          Email?: string | null
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      application_additional_details: {
        Row: {
          application_id: number | null
          committee_notes: string[] | null
          created_at: string
          description: string | null
          id: number
          last_scraped_at: string | null
          lpa_app_no: string | null
          lpa_name: string | null
          other_links: Json | null
          site_plan_link: string[] | null
          url_planning_app: string | null
        }
        Insert: {
          application_id?: number | null
          committee_notes?: string[] | null
          created_at?: string
          description?: string | null
          id?: number
          last_scraped_at?: string | null
          lpa_app_no?: string | null
          lpa_name?: string | null
          other_links?: Json | null
          site_plan_link?: string[] | null
          url_planning_app?: string | null
        }
        Update: {
          application_id?: number | null
          committee_notes?: string[] | null
          created_at?: string
          description?: string | null
          id?: number
          last_scraped_at?: string | null
          lpa_app_no?: string | null
          lpa_name?: string | null
          other_links?: Json | null
          site_plan_link?: string[] | null
          url_planning_app?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_additional_details_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      application_feedback: {
        Row: {
          application_id: number | null
          created_at: string
          feedback_type: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          application_id?: number | null
          created_at?: string
          feedback_type?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          application_id?: number | null
          created_at?: string
          feedback_type?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_feedback_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      application_impact_scores: {
        Row: {
          application_id: number | null
          final_impact_score: number | null
        }
        Insert: {
          application_id?: number | null
          final_impact_score?: number | null
        }
        Update: {
          application_id?: number | null
          final_impact_score?: number | null
        }
        Relationships: []
      }
      application_map_images: {
        Row: {
          application_id: number | null
          created_at: string
          id: number
          image_url: string
        }
        Insert: {
          application_id?: number | null
          created_at?: string
          id?: never
          image_url: string
        }
        Update: {
          application_id?: number | null
          created_at?: string
          id?: never
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_map_images_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      applications: {
        Row: {
          actual_commencement_date: string | null
          actual_completion_date: string | null
          ai_search_details: Json | null
          ai_title: string | null
          appeal_decision: string | null
          appeal_decision_date: string | null
          appeal_start_date: string | null
          appeal_status: string | null
          application_details: Json | null
          application_id: number
          application_type: string | null
          application_type_full: string | null
          bo_system: string | null
          borough: string | null
          centroid: Json | null
          centroid_easting: string | null
          centroid_northing: string | null
          cil_liability: string | null
          class_3: string | null
          classification: string | null
          date_building_work_completed_under_previous_permission: string | null
          date_building_work_started_under_previous_permission: string | null
          decision: string | null
          decision_agency: string | null
          decision_conditions: Json | null
          decision_date: string | null
          decision_process: string | null
          decision_target_date: string | null
          description: string | null
          development_type: string | null
          engaging_title: string | null
          epc_number: string | null
          est_construction_cost: string | null
          final_impact_score: number | null
          geom: unknown | null
          id: string
          image_link: Json | null
          image_map_url: string | null
          impact_score: number | null
          impact_score_details: Json | null
          impacted_services: Json | null
          lapsed_date: string | null
          last_date_consultation_comments: string | null
          last_synced: string | null
          last_updated: string | null
          last_updated_by: string | null
          locality: string | null
          lpa_app_no: string | null
          lpa_name: string | null
          parking_details: Json | null
          polygon: Json | null
          postcode: string | null
          pp_id: string | null
          reference_no_of_permission_being_relied_on: string | null
          secondary_street_name: string | null
          site_name: string | null
          site_number: string | null
          status: string | null
          street_name: string | null
          subdivision_of_building: string | null
          title_number: string | null
          uprn: string | null
          url_planning_app: string | null
          valid_date: string | null
          ward: string | null
          wgs84_polygon: Json | null
        }
        Insert: {
          actual_commencement_date?: string | null
          actual_completion_date?: string | null
          ai_search_details?: Json | null
          ai_title?: string | null
          appeal_decision?: string | null
          appeal_decision_date?: string | null
          appeal_start_date?: string | null
          appeal_status?: string | null
          application_details?: Json | null
          application_id?: number
          application_type?: string | null
          application_type_full?: string | null
          bo_system?: string | null
          borough?: string | null
          centroid?: Json | null
          centroid_easting?: string | null
          centroid_northing?: string | null
          cil_liability?: string | null
          class_3?: string | null
          classification?: string | null
          date_building_work_completed_under_previous_permission?: string | null
          date_building_work_started_under_previous_permission?: string | null
          decision?: string | null
          decision_agency?: string | null
          decision_conditions?: Json | null
          decision_date?: string | null
          decision_process?: string | null
          decision_target_date?: string | null
          description?: string | null
          development_type?: string | null
          engaging_title?: string | null
          epc_number?: string | null
          est_construction_cost?: string | null
          final_impact_score?: number | null
          geom?: unknown | null
          id: string
          image_link?: Json | null
          image_map_url?: string | null
          impact_score?: number | null
          impact_score_details?: Json | null
          impacted_services?: Json | null
          lapsed_date?: string | null
          last_date_consultation_comments?: string | null
          last_synced?: string | null
          last_updated?: string | null
          last_updated_by?: string | null
          locality?: string | null
          lpa_app_no?: string | null
          lpa_name?: string | null
          parking_details?: Json | null
          polygon?: Json | null
          postcode?: string | null
          pp_id?: string | null
          reference_no_of_permission_being_relied_on?: string | null
          secondary_street_name?: string | null
          site_name?: string | null
          site_number?: string | null
          status?: string | null
          street_name?: string | null
          subdivision_of_building?: string | null
          title_number?: string | null
          uprn?: string | null
          url_planning_app?: string | null
          valid_date?: string | null
          ward?: string | null
          wgs84_polygon?: Json | null
        }
        Update: {
          actual_commencement_date?: string | null
          actual_completion_date?: string | null
          ai_search_details?: Json | null
          ai_title?: string | null
          appeal_decision?: string | null
          appeal_decision_date?: string | null
          appeal_start_date?: string | null
          appeal_status?: string | null
          application_details?: Json | null
          application_id?: number
          application_type?: string | null
          application_type_full?: string | null
          bo_system?: string | null
          borough?: string | null
          centroid?: Json | null
          centroid_easting?: string | null
          centroid_northing?: string | null
          cil_liability?: string | null
          class_3?: string | null
          classification?: string | null
          date_building_work_completed_under_previous_permission?: string | null
          date_building_work_started_under_previous_permission?: string | null
          decision?: string | null
          decision_agency?: string | null
          decision_conditions?: Json | null
          decision_date?: string | null
          decision_process?: string | null
          decision_target_date?: string | null
          description?: string | null
          development_type?: string | null
          engaging_title?: string | null
          epc_number?: string | null
          est_construction_cost?: string | null
          final_impact_score?: number | null
          geom?: unknown | null
          id?: string
          image_link?: Json | null
          image_map_url?: string | null
          impact_score?: number | null
          impact_score_details?: Json | null
          impacted_services?: Json | null
          lapsed_date?: string | null
          last_date_consultation_comments?: string | null
          last_synced?: string | null
          last_updated?: string | null
          last_updated_by?: string | null
          locality?: string | null
          lpa_app_no?: string | null
          lpa_name?: string | null
          parking_details?: Json | null
          polygon?: Json | null
          postcode?: string | null
          pp_id?: string | null
          reference_no_of_permission_being_relied_on?: string | null
          secondary_street_name?: string | null
          site_name?: string | null
          site_number?: string | null
          status?: string | null
          street_name?: string | null
          subdivision_of_building?: string | null
          title_number?: string | null
          uprn?: string | null
          url_planning_app?: string | null
          valid_date?: string | null
          ward?: string | null
          wgs84_polygon?: Json | null
        }
        Relationships: []
      }
      applications_classification: {
        Row: {
          actual_commencement_date: string | null
          actual_completion_date: string | null
          ai_search_details: Json | null
          ai_title: string | null
          appeal_decision: string | null
          appeal_decision_date: string | null
          appeal_start_date: string | null
          appeal_status: string | null
          application_details: Json | null
          application_id: number
          application_type: string | null
          application_type_full: string | null
          bo_system: string | null
          borough: string | null
          centroid: Json | null
          centroid_easting: string | null
          centroid_northing: string | null
          cil_liability: string | null
          classification: string | null
          date_building_work_completed_under_previous_permission: string | null
          date_building_work_started_under_previous_permission: string | null
          decision: string | null
          decision_agency: string | null
          decision_conditions: Json | null
          decision_date: string | null
          decision_process: string | null
          decision_target_date: string | null
          description: string | null
          development_type: string | null
          epc_number: string | null
          geom: unknown | null
          id: string
          image_map_url: string | null
          impact_score: number | null
          impact_score_details: Json | null
          impacted_services: Json | null
          lapsed_date: string | null
          last_date_consultation_comments: string | null
          last_synced: string | null
          last_updated: string | null
          last_updated_by: string | null
          locality: string | null
          lpa_app_no: string | null
          lpa_name: string | null
          parking_details: Json | null
          polygon: Json | null
          postcode: string | null
          pp_id: string | null
          reference_no_of_permission_being_relied_on: string | null
          secondary_street_name: string | null
          site_name: string | null
          site_number: string | null
          status: string | null
          street_name: string | null
          subdivision_of_building: string | null
          title_number: string | null
          uprn: string | null
          url_planning_app: string | null
          valid_date: string | null
          ward: string | null
          wgs84_polygon: Json | null
        }
        Insert: {
          actual_commencement_date?: string | null
          actual_completion_date?: string | null
          ai_search_details?: Json | null
          ai_title?: string | null
          appeal_decision?: string | null
          appeal_decision_date?: string | null
          appeal_start_date?: string | null
          appeal_status?: string | null
          application_details?: Json | null
          application_id?: number
          application_type?: string | null
          application_type_full?: string | null
          bo_system?: string | null
          borough?: string | null
          centroid?: Json | null
          centroid_easting?: string | null
          centroid_northing?: string | null
          cil_liability?: string | null
          classification?: string | null
          date_building_work_completed_under_previous_permission?: string | null
          date_building_work_started_under_previous_permission?: string | null
          decision?: string | null
          decision_agency?: string | null
          decision_conditions?: Json | null
          decision_date?: string | null
          decision_process?: string | null
          decision_target_date?: string | null
          description?: string | null
          development_type?: string | null
          epc_number?: string | null
          geom?: unknown | null
          id: string
          image_map_url?: string | null
          impact_score?: number | null
          impact_score_details?: Json | null
          impacted_services?: Json | null
          lapsed_date?: string | null
          last_date_consultation_comments?: string | null
          last_synced?: string | null
          last_updated?: string | null
          last_updated_by?: string | null
          locality?: string | null
          lpa_app_no?: string | null
          lpa_name?: string | null
          parking_details?: Json | null
          polygon?: Json | null
          postcode?: string | null
          pp_id?: string | null
          reference_no_of_permission_being_relied_on?: string | null
          secondary_street_name?: string | null
          site_name?: string | null
          site_number?: string | null
          status?: string | null
          street_name?: string | null
          subdivision_of_building?: string | null
          title_number?: string | null
          uprn?: string | null
          url_planning_app?: string | null
          valid_date?: string | null
          ward?: string | null
          wgs84_polygon?: Json | null
        }
        Update: {
          actual_commencement_date?: string | null
          actual_completion_date?: string | null
          ai_search_details?: Json | null
          ai_title?: string | null
          appeal_decision?: string | null
          appeal_decision_date?: string | null
          appeal_start_date?: string | null
          appeal_status?: string | null
          application_details?: Json | null
          application_id?: number
          application_type?: string | null
          application_type_full?: string | null
          bo_system?: string | null
          borough?: string | null
          centroid?: Json | null
          centroid_easting?: string | null
          centroid_northing?: string | null
          cil_liability?: string | null
          classification?: string | null
          date_building_work_completed_under_previous_permission?: string | null
          date_building_work_started_under_previous_permission?: string | null
          decision?: string | null
          decision_agency?: string | null
          decision_conditions?: Json | null
          decision_date?: string | null
          decision_process?: string | null
          decision_target_date?: string | null
          description?: string | null
          development_type?: string | null
          epc_number?: string | null
          geom?: unknown | null
          id?: string
          image_map_url?: string | null
          impact_score?: number | null
          impact_score_details?: Json | null
          impacted_services?: Json | null
          lapsed_date?: string | null
          last_date_consultation_comments?: string | null
          last_synced?: string | null
          last_updated?: string | null
          last_updated_by?: string | null
          locality?: string | null
          lpa_app_no?: string | null
          lpa_name?: string | null
          parking_details?: Json | null
          polygon?: Json | null
          postcode?: string | null
          pp_id?: string | null
          reference_no_of_permission_being_relied_on?: string | null
          secondary_street_name?: string | null
          site_name?: string | null
          site_number?: string | null
          status?: string | null
          street_name?: string | null
          subdivision_of_building?: string | null
          title_number?: string | null
          uprn?: string | null
          url_planning_app?: string | null
          valid_date?: string | null
          ward?: string | null
          wgs84_polygon?: Json | null
        }
        Relationships: []
      }
      applications_duplicate: {
        Row: {
          actual_commencement_date: string | null
          actual_completion_date: string | null
          agent_address: string | null
          agent_company: string | null
          agent_name: string | null
          ai_search_details: Json | null
          ai_title: string | null
          appeal_decision: string | null
          appeal_decision_date: string | null
          appeal_start_date: string | null
          appeal_status: string | null
          application_details: Json | null
          application_id: number
          application_type: string | null
          application_type_full: string | null
          bo_system: string | null
          borough: string | null
          category: string | null
          centroid: Json | null
          centroid_easting: string | null
          centroid_northing: string | null
          cil_liability: string | null
          class_3: string | null
          classification: string | null
          date_building_work_completed_under_previous_permission: string | null
          date_building_work_started_under_previous_permission: string | null
          decision: string | null
          decision_agency: string | null
          decision_conditions: Json | null
          decision_date: string | null
          decision_process: string | null
          decision_rating: string | null
          decision_target_date: string | null
          decision_text: string | null
          description: string | null
          development_type: string | null
          distance: string | null
          endpoint: string | null
          engaging_title: string | null
          epc_number: string | null
          est_construction_cost: string | null
          final_impact_score: number | null
          geom: unknown | null
          id: string
          image_link: Json | null
          image_map_url: string | null
          impact_score: number | null
          impact_score_details: Json | null
          impacted_services: Json | null
          lapsed_date: string | null
          last_date_consultation_comments: string | null
          last_synced: string | null
          last_updated: string | null
          last_updated_by: string | null
          lat: string | null
          lng: string | null
          locality: string | null
          lpa_app_no: string | null
          lpa_name: string | null
          parking_details: Json | null
          polygon: Json | null
          postcode: string | null
          pp_id: string | null
          reference_no_of_permission_being_relied_on: string | null
          secondary_street_name: string | null
          site_name: string | null
          site_number: string | null
          status: string | null
          street_name: string | null
          subdivision_of_building: string | null
          title_number: string | null
          uprn: string | null
          url_planning_app: string | null
          valid_date: string | null
          ward: string | null
          wgs84_polygon: Json | null
        }
        Insert: {
          actual_commencement_date?: string | null
          actual_completion_date?: string | null
          agent_address?: string | null
          agent_company?: string | null
          agent_name?: string | null
          ai_search_details?: Json | null
          ai_title?: string | null
          appeal_decision?: string | null
          appeal_decision_date?: string | null
          appeal_start_date?: string | null
          appeal_status?: string | null
          application_details?: Json | null
          application_id?: number
          application_type?: string | null
          application_type_full?: string | null
          bo_system?: string | null
          borough?: string | null
          category?: string | null
          centroid?: Json | null
          centroid_easting?: string | null
          centroid_northing?: string | null
          cil_liability?: string | null
          class_3?: string | null
          classification?: string | null
          date_building_work_completed_under_previous_permission?: string | null
          date_building_work_started_under_previous_permission?: string | null
          decision?: string | null
          decision_agency?: string | null
          decision_conditions?: Json | null
          decision_date?: string | null
          decision_process?: string | null
          decision_rating?: string | null
          decision_target_date?: string | null
          decision_text?: string | null
          description?: string | null
          development_type?: string | null
          distance?: string | null
          endpoint?: string | null
          engaging_title?: string | null
          epc_number?: string | null
          est_construction_cost?: string | null
          final_impact_score?: number | null
          geom?: unknown | null
          id?: string
          image_link?: Json | null
          image_map_url?: string | null
          impact_score?: number | null
          impact_score_details?: Json | null
          impacted_services?: Json | null
          lapsed_date?: string | null
          last_date_consultation_comments?: string | null
          last_synced?: string | null
          last_updated?: string | null
          last_updated_by?: string | null
          lat?: string | null
          lng?: string | null
          locality?: string | null
          lpa_app_no?: string | null
          lpa_name?: string | null
          parking_details?: Json | null
          polygon?: Json | null
          postcode?: string | null
          pp_id?: string | null
          reference_no_of_permission_being_relied_on?: string | null
          secondary_street_name?: string | null
          site_name?: string | null
          site_number?: string | null
          status?: string | null
          street_name?: string | null
          subdivision_of_building?: string | null
          title_number?: string | null
          uprn?: string | null
          url_planning_app?: string | null
          valid_date?: string | null
          ward?: string | null
          wgs84_polygon?: Json | null
        }
        Update: {
          actual_commencement_date?: string | null
          actual_completion_date?: string | null
          agent_address?: string | null
          agent_company?: string | null
          agent_name?: string | null
          ai_search_details?: Json | null
          ai_title?: string | null
          appeal_decision?: string | null
          appeal_decision_date?: string | null
          appeal_start_date?: string | null
          appeal_status?: string | null
          application_details?: Json | null
          application_id?: number
          application_type?: string | null
          application_type_full?: string | null
          bo_system?: string | null
          borough?: string | null
          category?: string | null
          centroid?: Json | null
          centroid_easting?: string | null
          centroid_northing?: string | null
          cil_liability?: string | null
          class_3?: string | null
          classification?: string | null
          date_building_work_completed_under_previous_permission?: string | null
          date_building_work_started_under_previous_permission?: string | null
          decision?: string | null
          decision_agency?: string | null
          decision_conditions?: Json | null
          decision_date?: string | null
          decision_process?: string | null
          decision_rating?: string | null
          decision_target_date?: string | null
          decision_text?: string | null
          description?: string | null
          development_type?: string | null
          distance?: string | null
          endpoint?: string | null
          engaging_title?: string | null
          epc_number?: string | null
          est_construction_cost?: string | null
          final_impact_score?: number | null
          geom?: unknown | null
          id?: string
          image_link?: Json | null
          image_map_url?: string | null
          impact_score?: number | null
          impact_score_details?: Json | null
          impacted_services?: Json | null
          lapsed_date?: string | null
          last_date_consultation_comments?: string | null
          last_synced?: string | null
          last_updated?: string | null
          last_updated_by?: string | null
          lat?: string | null
          lng?: string | null
          locality?: string | null
          lpa_app_no?: string | null
          lpa_name?: string | null
          parking_details?: Json | null
          polygon?: Json | null
          postcode?: string | null
          pp_id?: string | null
          reference_no_of_permission_being_relied_on?: string | null
          secondary_street_name?: string | null
          site_name?: string | null
          site_number?: string | null
          status?: string | null
          street_name?: string | null
          subdivision_of_building?: string | null
          title_number?: string | null
          uprn?: string | null
          url_planning_app?: string | null
          valid_date?: string | null
          ward?: string | null
          wgs84_polygon?: Json | null
        }
        Relationships: []
      }
      automation_status: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      comment_votes: {
        Row: {
          comment_id: number
          created_at: string
          id: number
          user_id: string
          vote_type: string
        }
        Insert: {
          comment_id: number
          created_at?: string
          id?: number
          user_id: string
          vote_type: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          id?: number
          user_id?: string
          vote_type?: string
        }
        Relationships: []
      }
      Comments: {
        Row: {
          application_id: number | null
          comment: string | null
          created_at: string
          downvotes: number | null
          id: number
          parent_id: number | null
          upvotes: number | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          application_id?: number | null
          comment?: string | null
          created_at?: string
          downvotes?: number | null
          id?: never
          parent_id?: number | null
          upvotes?: number | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          application_id?: number | null
          comment?: string | null
          created_at?: string
          downvotes?: number | null
          id?: never
          parent_id?: number | null
          upvotes?: number | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Comments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "Comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "Comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comments_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          created_at: string
          email: string | null
          id: number
          message: string
          phone: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          message: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      council_contacts: {
        Row: {
          contact_name: string
          council_name: string
          created_at: string
          email: string
          id: number
          message: string | null
          phone: string | null
          status: string | null
        }
        Insert: {
          contact_name: string
          council_name: string
          created_at?: string
          email: string
          id?: number
          message?: string | null
          phone?: string | null
          status?: string | null
        }
        Update: {
          contact_name?: string
          council_name?: string
          created_at?: string
          email?: string
          id?: number
          message?: string | null
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      engaging_titles: {
        Row: {
          application_id: number | null
          engaging_title: string | null
        }
        Insert: {
          application_id?: number | null
          engaging_title?: string | null
        }
        Update: {
          application_id?: number | null
          engaging_title?: string | null
        }
        Relationships: []
      }
      hp22_applications: {
        Row: {
          address: string | null
          calculated_date_received: string | null
          calculated_decision: string | null
          created_at: string | null
          id: string
          proposal: string | null
        }
        Insert: {
          address?: string | null
          calculated_date_received?: string | null
          calculated_decision?: string | null
          created_at?: string | null
          id: string
          proposal?: string | null
        }
        Update: {
          address?: string | null
          calculated_date_received?: string | null
          calculated_decision?: string | null
          created_at?: string | null
          id?: string
          proposal?: string | null
        }
        Relationships: []
      }
      impact_criteria: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: number
          subcategory: string
          weight: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: number
          subcategory: string
          weight: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: number
          subcategory?: string
          weight?: number
        }
        Relationships: []
      }
      impact_score_batch_status: {
        Row: {
          batch_size: number
          completed_count: number | null
          created_at: string
          error_message: string | null
          id: number
          status: string | null
        }
        Insert: {
          batch_size: number
          completed_count?: number | null
          created_at?: string
          error_message?: string | null
          id?: number
          status?: string | null
        }
        Update: {
          batch_size?: number
          completed_count?: number | null
          created_at?: string
          error_message?: string | null
          id?: number
          status?: string | null
        }
        Relationships: []
      }
      petitions: {
        Row: {
          address: string | null
          application_id: number | null
          created_at: string
          id: number
          reasons: string[]
          user_email: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          application_id?: number | null
          created_at?: string
          id?: never
          reasons: string[]
          user_email: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          application_id?: number | null
          created_at?: string
          id?: never
          reasons?: string[]
          user_email?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "petitions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      planning_api: {
        Row: {
          address: string | null
          agent_address: string | null
          agent_email: string | null
          agent_name: string | null
          agent_phone: string | null
          applicant_address: string | null
          applicant_name: string | null
          created_at: string
          description: string | null
          docs_count: number | null
          external_link: string | null
          id: number
          internal_link: string | null
          keyval: string | null
          latitude: number | null
          longitude: number | null
          lpa_id: string | null
          lpa_name: string | null
          PDF_analysis: string[] | null
          PDF_links: string[] | null
          postcode: string | null
          reference: string | null
          validated_date: string | null
        }
        Insert: {
          address?: string | null
          agent_address?: string | null
          agent_email?: string | null
          agent_name?: string | null
          agent_phone?: string | null
          applicant_address?: string | null
          applicant_name?: string | null
          created_at?: string
          description?: string | null
          docs_count?: number | null
          external_link?: string | null
          id?: number
          internal_link?: string | null
          keyval?: string | null
          latitude?: number | null
          longitude?: number | null
          lpa_id?: string | null
          lpa_name?: string | null
          PDF_analysis?: string[] | null
          PDF_links?: string[] | null
          postcode?: string | null
          reference?: string | null
          validated_date?: string | null
        }
        Update: {
          address?: string | null
          agent_address?: string | null
          agent_email?: string | null
          agent_name?: string | null
          agent_phone?: string | null
          applicant_address?: string | null
          applicant_name?: string | null
          created_at?: string
          description?: string | null
          docs_count?: number | null
          external_link?: string | null
          id?: number
          internal_link?: string | null
          keyval?: string | null
          latitude?: number | null
          longitude?: number | null
          lpa_id?: string | null
          lpa_name?: string | null
          PDF_analysis?: string[] | null
          PDF_links?: string[] | null
          postcode?: string | null
          reference?: string | null
          validated_date?: string | null
        }
        Relationships: []
      }
      planning_applications: {
        Row: {
          address: Json | null
          council_reference: string
          created_at: string | null
          decision: string | null
          description: string | null
          geometry: unknown | null
          id: string
          raw_data: Json | null
          validated_date: string | null
        }
        Insert: {
          address?: Json | null
          council_reference: string
          created_at?: string | null
          decision?: string | null
          description?: string | null
          geometry?: unknown | null
          id?: string
          raw_data?: Json | null
          validated_date?: string | null
        }
        Update: {
          address?: Json | null
          council_reference?: string
          created_at?: string | null
          decision?: string | null
          description?: string | null
          geometry?: unknown | null
          id?: string
          raw_data?: Json | null
          validated_date?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      property_data_api: {
        Row: {
          address: string | null
          agent_address: string | null
          agent_company: string | null
          agent_name: string | null
          authority: string | null
          category: string | null
          created_at: string
          dates_published_at: string | null
          decision_rating: string | null
          decision_text: string | null
          distance: string | null
          endpoint: string | null
          est_construction_cost: string | null
          id: number
          lat: number | null
          lng: number | null
          postcode: string | null
          proposal: string | null
          reference: string | null
          status: string | null
          url: string | null
          url_documents: string | null
        }
        Insert: {
          address?: string | null
          agent_address?: string | null
          agent_company?: string | null
          agent_name?: string | null
          authority?: string | null
          category?: string | null
          created_at?: string
          dates_published_at?: string | null
          decision_rating?: string | null
          decision_text?: string | null
          distance?: string | null
          endpoint?: string | null
          est_construction_cost?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          postcode?: string | null
          proposal?: string | null
          reference?: string | null
          status?: string | null
          url?: string | null
          url_documents?: string | null
        }
        Update: {
          address?: string | null
          agent_address?: string | null
          agent_company?: string | null
          agent_name?: string | null
          authority?: string | null
          category?: string | null
          created_at?: string
          dates_published_at?: string | null
          decision_rating?: string | null
          decision_text?: string | null
          distance?: string | null
          endpoint?: string | null
          est_construction_cost?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          postcode?: string | null
          proposal?: string | null
          reference?: string | null
          status?: string | null
          url?: string | null
          url_documents?: string | null
        }
        Relationships: []
      }
      saved_applications: {
        Row: {
          application_id: number
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          application_id: number
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          application_id?: number
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_applications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      Searches: {
        Row: {
          created_at: string
          id: number
          load_time: number | null
          "Post Code": string | null
          Status: string | null
          User_logged_in: boolean | null
        }
        Insert: {
          created_at?: string
          id?: number
          load_time?: number | null
          "Post Code"?: string | null
          Status?: string | null
          User_logged_in?: boolean | null
        }
        Update: {
          created_at?: string
          id?: number
          load_time?: number | null
          "Post Code"?: string | null
          Status?: string | null
          User_logged_in?: boolean | null
        }
        Relationships: []
      }
      searchland_applications: {
        Row: {
          address: string | null
          agent_details: Json | null
          applicant_name: string | null
          application_reference: string | null
          application_type: string | null
          constraints: Json | null
          consultation_end_date: string | null
          created_at: string
          decision_date: string | null
          decision_details: Json | null
          description: string | null
          id: number
          location: unknown | null
          raw_data: Json | null
          source_url: string | null
          status: string | null
          submission_date: string | null
          url: string | null
          ward: string | null
        }
        Insert: {
          address?: string | null
          agent_details?: Json | null
          applicant_name?: string | null
          application_reference?: string | null
          application_type?: string | null
          constraints?: Json | null
          consultation_end_date?: string | null
          created_at?: string
          decision_date?: string | null
          decision_details?: Json | null
          description?: string | null
          id?: number
          location?: unknown | null
          raw_data?: Json | null
          source_url?: string | null
          status?: string | null
          submission_date?: string | null
          url?: string | null
          ward?: string | null
        }
        Update: {
          address?: string | null
          agent_details?: Json | null
          applicant_name?: string | null
          application_reference?: string | null
          application_type?: string | null
          constraints?: Json | null
          consultation_end_date?: string | null
          created_at?: string
          decision_date?: string | null
          decision_details?: Json | null
          description?: string | null
          id?: number
          location?: unknown | null
          raw_data?: Json | null
          source_url?: string | null
          status?: string | null
          submission_date?: string | null
          url?: string | null
          ward?: string | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      temp_updates: {
        Row: {
          application_id: number
          class_3: string | null
        }
        Insert: {
          application_id: number
          class_3?: string | null
        }
        Update: {
          application_id?: number
          class_3?: string | null
        }
        Relationships: []
      }
      trial_application_data: {
        Row: {
          address: string | null
          agent_details: Json | null
          applicant_name: string | null
          application_reference: string | null
          application_type: string | null
          constraints: Json | null
          consultation_end_date: string | null
          created_at: string
          decision_date: string | null
          decision_details: Json | null
          description: string | null
          id: number
          location: unknown | null
          raw_data: Json | null
          source_url: string | null
          status: string | null
          submission_date: string | null
          url: string | null
          ward: string | null
        }
        Insert: {
          address?: string | null
          agent_details?: Json | null
          applicant_name?: string | null
          application_reference?: string | null
          application_type?: string | null
          constraints?: Json | null
          consultation_end_date?: string | null
          created_at?: string
          decision_date?: string | null
          decision_details?: Json | null
          description?: string | null
          id?: number
          location?: unknown | null
          raw_data?: Json | null
          source_url?: string | null
          status?: string | null
          submission_date?: string | null
          url?: string | null
          ward?: string | null
        }
        Update: {
          address?: string | null
          agent_details?: Json | null
          applicant_name?: string | null
          application_reference?: string | null
          application_type?: string | null
          constraints?: Json | null
          consultation_end_date?: string | null
          created_at?: string
          decision_date?: string | null
          decision_details?: Json | null
          description?: string | null
          id?: number
          location?: unknown | null
          raw_data?: Json | null
          source_url?: string | null
          status?: string | null
          submission_date?: string | null
          url?: string | null
          ward?: string | null
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          created_at: string
          id: number
          last_login: string | null
          login_streak: number | null
          total_comments: number | null
          total_petitions: number | null
          total_points: number | null
          total_reactions: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          last_login?: string | null
          login_streak?: number | null
          total_comments?: number | null
          total_petitions?: number | null
          total_points?: number | null
          total_reactions?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          last_login?: string | null
          login_streak?: number | null
          total_comments?: number | null
          total_petitions?: number | null
          total_points?: number | null
          total_reactions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      User_data: {
        Row: {
          created_at: string
          Email: string | null
          email_verified: boolean | null
          id: number
          Marketing: boolean | null
          "Post Code": string | null
          Radius_from_pc: number | null
          Type: string | null
          verification_token: string | null
          verification_token_expires: string | null
        }
        Insert: {
          created_at?: string
          Email?: string | null
          email_verified?: boolean | null
          id?: number
          Marketing?: boolean | null
          "Post Code"?: string | null
          Radius_from_pc?: number | null
          Type?: string | null
          verification_token?: string | null
          verification_token_expires?: string | null
        }
        Update: {
          created_at?: string
          Email?: string | null
          email_verified?: boolean | null
          id?: number
          Marketing?: boolean | null
          "Post Code"?: string | null
          Radius_from_pc?: number | null
          Type?: string | null
          verification_token?: string | null
          verification_token_expires?: string | null
        }
        Relationships: []
      }
      user_postcodes: {
        Row: {
          created_at: string
          id: number
          postcode: string
          radius: string | null
          User_email: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          postcode: string
          radius?: string | null
          User_email?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          postcode?: string
          radius?: string | null
          User_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      waiting_list: {
        Row: {
          created_at: string
          email: string
          id: number
          postcode: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: never
          postcode: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: never
          postcode?: string
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: {
          oldname: string
          newname: string
          version: string
        }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: {
          tbl: unknown
          col: string
        }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: {
          tbl: unknown
          att_name: string
          geom: unknown
          mode?: string
        }
        Returns: number
      }
      _st_3dintersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      _st_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_coveredby:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      _st_covers:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      _st_crosses: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_intersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: {
          line1: unknown
          line2: unknown
        }
        Returns: number
      }
      _st_longestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      _st_orderingequals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: {
          geom: unknown
        }
        Returns: number
      }
      _st_touches: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          g1: unknown
          clip?: unknown
          tolerance?: number
          return_polygons?: boolean
        }
        Returns: unknown
      }
      _st_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      addauth: {
        Args: {
          "": string
        }
        Returns: boolean
      }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
              new_srid_in: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
      box:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box2d:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box2d_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2d_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2df_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2df_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3d:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box3d_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3d_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3dtobox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      bytea:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
              column_name: string
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
              column_name: string
            }
            Returns: string
          }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
            }
            Returns: string
          }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      fetch_searchland_mvt: {
        Args: {
          z: number
          x: number
          y: number
        }
        Returns: string
      }
      geography:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      geography_analyze: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      geography_typmod_out: {
        Args: {
          "": number
        }
        Returns: unknown
      }
      geometry:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      geometry_above: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_analyze: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      geometry_below: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_cmp: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_contained_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_eq: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_ge: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      geometry_gt: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_hash: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      geometry_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_le: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_left: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_lt: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_overabove: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overleft: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overright: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_right: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_same: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      geometry_sortsupport: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      geometry_typmod_out: {
        Args: {
          "": number
        }
        Returns: unknown
      }
      geometry_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometrytype:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      geomfromewkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      geomfromewkt: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      get_application_feedback_stats: {
        Args: {
          app_id: number
        }
        Returns: {
          feedback_type: string
          count: number
        }[]
      }
      get_applications_count_in_bounds: {
        Args: {
          sw_lng: number
          sw_lat: number
          ne_lng: number
          ne_lat: number
        }
        Returns: number
      }
      get_applications_count_within_radius: {
        Args: {
          center_lng: number
          center_lat: number
          radius_meters: number
        }
        Returns: number
      }
      get_applications_in_bounds_paginated: {
        Args: {
          sw_lng: number
          sw_lat: number
          ne_lng: number
          ne_lat: number
          page_size?: number
          page_number?: number
        }
        Returns: {
          actual_commencement_date: string | null
          actual_completion_date: string | null
          ai_search_details: Json | null
          ai_title: string | null
          appeal_decision: string | null
          appeal_decision_date: string | null
          appeal_start_date: string | null
          appeal_status: string | null
          application_details: Json | null
          application_id: number
          application_type: string | null
          application_type_full: string | null
          bo_system: string | null
          borough: string | null
          centroid: Json | null
          centroid_easting: string | null
          centroid_northing: string | null
          cil_liability: string | null
          class_3: string | null
          classification: string | null
          date_building_work_completed_under_previous_permission: string | null
          date_building_work_started_under_previous_permission: string | null
          decision: string | null
          decision_agency: string | null
          decision_conditions: Json | null
          decision_date: string | null
          decision_process: string | null
          decision_target_date: string | null
          description: string | null
          development_type: string | null
          engaging_title: string | null
          epc_number: string | null
          est_construction_cost: string | null
          final_impact_score: number | null
          geom: unknown | null
          id: string
          image_link: Json | null
          image_map_url: string | null
          impact_score: number | null
          impact_score_details: Json | null
          impacted_services: Json | null
          lapsed_date: string | null
          last_date_consultation_comments: string | null
          last_synced: string | null
          last_updated: string | null
          last_updated_by: string | null
          locality: string | null
          lpa_app_no: string | null
          lpa_name: string | null
          parking_details: Json | null
          polygon: Json | null
          postcode: string | null
          pp_id: string | null
          reference_no_of_permission_being_relied_on: string | null
          secondary_street_name: string | null
          site_name: string | null
          site_number: string | null
          status: string | null
          street_name: string | null
          subdivision_of_building: string | null
          title_number: string | null
          uprn: string | null
          url_planning_app: string | null
          valid_date: string | null
          ward: string | null
          wgs84_polygon: Json | null
        }[]
      }
      get_applications_status_counts: {
        Args: {
          center_lat: number
          center_lng: number
          radius_meters: number
        }
        Returns: {
          status: string
          count: number
        }[]
      }
      get_applications_with_counts: {
        Args: {
          center_lng: number
          center_lat: number
          radius_meters: number
          page_size?: number
          page_number?: number
        }
        Returns: {
          applications: Json
          total_count: number
          status_counts: Json
        }[]
      }
      get_applications_with_counts_optimized: {
        Args: {
          center_lng: number
          center_lat: number
          radius_meters: number
          page_size?: number
          page_number?: number
        }
        Returns: {
          applications: Json
          total_count: number
          status_counts: Json
        }[]
      }
      get_applications_within_radius: {
        Args: {
          center_lng: number
          center_lat: number
          radius_meters: number
          page_size?: number
          page_number?: number
        }
        Returns: {
          applications: Json
          total_count: number
          status_counts: Json
        }[]
      }
      get_developments_within_distance: {
        Args: {
          search_lat: number
          search_lng: number
          distance_meters: number
        }
        Returns: {
          id: number
          title: string
          address: string
          distance_in_meters: number
        }[]
      }
      get_proj4_from_srid: {
        Args: {
          "": number
        }
        Returns: string
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gidx_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      json: {
        Args: {
          "": unknown
        }
        Returns: Json
      }
      jsonb: {
        Args: {
          "": unknown
        }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      point: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      polygon: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      populate_geometry_columns:
        | {
            Args: {
              tbl_oid: unknown
              use_typmod?: boolean
            }
            Returns: number
          }
        | {
            Args: {
              use_typmod?: boolean
            }
            Returns: string
          }
      postgis_addbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: number
      }
      postgis_constraint_type: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: string
      }
      postgis_dropbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          geomname: string
          coord_dimension: number
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: {
          "": number
        }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: {
          "": number
        }
        Returns: number
      }
      postgis_typmod_type: {
        Args: {
          "": number
        }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      spheroid_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      spheroid_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3ddistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_3dintersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_3dlength: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_3dlongestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_3dperimeter: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_3dshortestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_addpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_angle:
        | {
            Args: {
              line1: unknown
              line2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              pt1: unknown
              pt2: unknown
              pt3: unknown
              pt4?: unknown
            }
            Returns: number
          }
      st_area:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_area2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_asbinary:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_asencodedpolyline: {
        Args: {
          geom: unknown
          nprecision?: number
        }
        Returns: string
      }
      st_asewkb: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_asewkt:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_asgeojson:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              r: Record<string, unknown>
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
            }
            Returns: string
          }
      st_asgml:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              version: number
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
        | {
            Args: {
              version: number
              geom: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
      st_ashexewkb: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_askml:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              nprefix?: string
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              nprefix?: string
            }
            Returns: string
          }
      st_aslatlontext: {
        Args: {
          geom: unknown
          tmpl?: string
        }
        Returns: string
      }
      st_asmarc21: {
        Args: {
          geom: unknown
          format?: string
        }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          geom: unknown
          bounds: unknown
          extent?: number
          buffer?: number
          clip_geom?: boolean
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              rel?: number
              maxdecimaldigits?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              rel?: number
              maxdecimaldigits?: number
            }
            Returns: string
          }
      st_astext:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_astwkb:
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: {
          geom: unknown
          maxdecimaldigits?: number
          options?: number
        }
        Returns: string
      }
      st_azimuth:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
      st_boundary: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: {
          geom: unknown
          fits?: boolean
        }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: {
              geom: unknown
              radius: number
              options?: string
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              radius: number
              quadsegs: number
            }
            Returns: unknown
          }
      st_buildarea: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_centroid:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      st_cleangeometry: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: {
          geom: unknown
          box: unknown
        }
        Returns: unknown
      }
      st_closestpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: {
          "": unknown[]
        }
        Returns: unknown[]
      }
      st_collect:
        | {
            Args: {
              "": unknown[]
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: unknown
          }
      st_collectionextract: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_geom: unknown
          param_pctconvex: number
          param_allow_holes?: boolean
        }
        Returns: unknown
      }
      st_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_containsproperly: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_convexhull: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_coorddim: {
        Args: {
          geometry: unknown
        }
        Returns: number
      }
      st_coveredby:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      st_covers:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      st_crosses: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_curvetoline: {
        Args: {
          geom: unknown
          tol?: number
          toltype?: number
          flags?: number
        }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: {
          g1: unknown
          tolerance?: number
          flags?: number
        }
        Returns: unknown
      }
      st_difference: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_dimension: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_disjoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_distance:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
      st_distancesphere:
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
              radius: number
            }
            Returns: number
          }
      st_distancespheroid: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_dump: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_envelope: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_expand:
        | {
            Args: {
              box: unknown
              dx: number
              dy: number
            }
            Returns: unknown
          }
        | {
            Args: {
              box: unknown
              dx: number
              dy: number
              dz?: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              dx: number
              dy: number
              dz?: number
              dm?: number
            }
            Returns: unknown
          }
      st_exteriorring: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_force2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_force3d: {
        Args: {
          geom: unknown
          zvalue?: number
        }
        Returns: unknown
      }
      st_force3dm: {
        Args: {
          geom: unknown
          mvalue?: number
        }
        Returns: unknown
      }
      st_force3dz: {
        Args: {
          geom: unknown
          zvalue?: number
        }
        Returns: unknown
      }
      st_force4d: {
        Args: {
          geom: unknown
          zvalue?: number
          mvalue?: number
        }
        Returns: unknown
      }
      st_forcecollection: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcecurve: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcerhr: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcesfs: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_generatepoints:
        | {
            Args: {
              area: unknown
              npoints: number
            }
            Returns: unknown
          }
        | {
            Args: {
              area: unknown
              npoints: number
              seed: number
            }
            Returns: unknown
          }
      st_geogfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geohash:
        | {
            Args: {
              geog: unknown
              maxchars?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxchars?: number
            }
            Returns: string
          }
      st_geomcollfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          g: unknown
          tolerance?: number
          max_iter?: number
          fail_if_not_converged?: boolean
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geometrytype: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_geomfromewkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromgeojson:
        | {
            Args: {
              "": Json
            }
            Returns: unknown
          }
        | {
            Args: {
              "": Json
            }
            Returns: unknown
          }
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
      st_geomfromgml: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: {
          marc21xml: string
        }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_gmltosql: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_hasarc: {
        Args: {
          geometry: unknown
        }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_hexagon: {
        Args: {
          size: number
          cell_i: number
          cell_j: number
          origin?: unknown
        }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: {
          size: number
          bounds: unknown
        }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: {
          line: unknown
          point: unknown
        }
        Returns: number
      }
      st_intersection: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_intersects:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      st_isclosed: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_iscollection: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isempty: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isring: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_issimple: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isvalid: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: {
          geom: unknown
          flags?: number
        }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_length:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_length2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_letters: {
        Args: {
          letters: string
          font?: Json
        }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: {
          line1: unknown
          line2: unknown
        }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: {
          txtin: string
          nprecision?: number
        }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_linefromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_linemerge: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linetocurve: {
        Args: {
          geometry: unknown
        }
        Returns: unknown
      }
      st_locatealong: {
        Args: {
          geometry: unknown
          measure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          geometry: unknown
          frommeasure: number
          tomeasure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: {
          geometry: unknown
          fromelevation: number
          toelevation: number
        }
        Returns: unknown
      }
      st_longestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_m: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_makebox2d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_makeline:
        | {
            Args: {
              "": unknown[]
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: unknown
          }
      st_makepolygon: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_makevalid:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              params: string
            }
            Returns: unknown
          }
      st_maxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: {
          "": unknown
        }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: {
          inputgeom: unknown
          segs_per_quarter?: number
        }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: {
          "": unknown
        }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multi: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_ndims: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_node: {
        Args: {
          g: unknown
        }
        Returns: unknown
      }
      st_normalize: {
        Args: {
          geom: unknown
        }
        Returns: unknown
      }
      st_npoints: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_nrings: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numgeometries: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numinteriorring: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numinteriorrings: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numpatches: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numpoints: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_offsetcurve: {
        Args: {
          line: unknown
          distance: number
          params?: string
        }
        Returns: unknown
      }
      st_orderingequals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_perimeter:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_perimeter2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_pointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_points: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonize: {
        Args: {
          "": unknown[]
        }
        Returns: unknown
      }
      st_project: {
        Args: {
          geog: unknown
          distance: number
          azimuth: number
        }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_x: number
          prec_y?: number
          prec_z?: number
          prec_m?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: {
          geom: unknown
          gridsize: number
        }
        Returns: unknown
      }
      st_relate: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: {
          geom: unknown
          tolerance?: number
        }
        Returns: unknown
      }
      st_reverse: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_segmentize: {
        Args: {
          geog: unknown
          max_segment_length: number
        }
        Returns: unknown
      }
      st_setsrid:
        | {
            Args: {
              geog: unknown
              srid: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              srid: number
            }
            Returns: unknown
          }
      st_sharedpaths: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_shortestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: {
          geom: unknown
          vertex_fraction: number
          is_outer?: boolean
        }
        Returns: unknown
      }
      st_split: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_square: {
        Args: {
          size: number
          cell_i: number
          cell_j: number
          origin?: unknown
        }
        Returns: unknown
      }
      st_squaregrid: {
        Args: {
          size: number
          bounds: unknown
        }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | {
            Args: {
              geog: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom: unknown
            }
            Returns: number
          }
      st_startpoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_subdivide: {
        Args: {
          geom: unknown
          maxvertices?: number
          gridsize?: number
        }
        Returns: unknown[]
      }
      st_summary:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_swapordinates: {
        Args: {
          geom: unknown
          ords: unknown
        }
        Returns: unknown
      }
      st_symdifference: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          zoom: number
          x: number
          y: number
          bounds?: unknown
          margin?: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_transform:
        | {
            Args: {
              geom: unknown
              from_proj: string
              to_proj: string
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              from_proj: string
              to_srid: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              to_proj: string
            }
            Returns: unknown
          }
      st_triangulatepolygon: {
        Args: {
          g1: unknown
        }
        Returns: unknown
      }
      st_union:
        | {
            Args: {
              "": unknown[]
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
              gridsize: number
            }
            Returns: unknown
          }
      st_voronoilines: {
        Args: {
          g1: unknown
          tolerance?: number
          extend_to?: unknown
        }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: {
          g1: unknown
          tolerance?: number
          extend_to?: unknown
        }
        Returns: unknown
      }
      st_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: {
          wkb: string
        }
        Returns: unknown
      }
      st_wkttosql: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_wrapx: {
        Args: {
          geom: unknown
          wrap: number
          move: number
        }
        Returns: unknown
      }
      st_x: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_xmax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_xmin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_y: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_ymax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_ymin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_z: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmflag: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      toggle_automation: {
        Args: {
          automation_name: string
          new_status: boolean
        }
        Returns: boolean
      }
      unlockrows: {
        Args: {
          "": string
        }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          schema_name: string
          table_name: string
          column_name: string
          new_srid_in: number
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
