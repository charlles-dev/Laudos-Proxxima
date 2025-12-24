export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            audit_logs: {
                Row: {
                    id: string
                    user_id: string
                    action: string
                    details: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    action: string
                    details?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    action?: string
                    details?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "audit_logs_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            reports: {
                Row: {
                    id: string
                    user_id: string
                    model: string | null
                    serial_number: string | null
                    patrimony_id: string | null
                    device_type: string | null
                    full_description: string | null
                    reported_defect: string | null
                    technical_analysis: string | null
                    recommendation: string | null
                    technician_name: string | null
                    requester_name: string | null
                    requester_sector: string | null
                    photos: Json | null
                    status: string | null
                    priority: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    model?: string | null
                    serial_number?: string | null
                    patrimony_id?: string | null
                    device_type?: string | null
                    full_description?: string | null
                    reported_defect?: string | null
                    technical_analysis?: string | null
                    recommendation?: string | null
                    technician_name?: string | null
                    requester_name?: string | null
                    requester_sector?: string | null
                    photos?: Json | null
                    status?: string | null
                    priority?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    model?: string | null
                    serial_number?: string | null
                    patrimony_id?: string | null
                    device_type?: string | null
                    full_description?: string | null
                    reported_defect?: string | null
                    technical_analysis?: string | null
                    recommendation?: string | null
                    technician_name?: string | null
                    requester_name?: string | null
                    requester_sector?: string | null
                    photos?: Json | null
                    status?: string | null
                    priority?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reports_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            users: {
                Row: {
                    id: string
                    email: string | null
                    display_name: string | null
                    job_title: string | null
                    has_completed_onboarding: boolean | null
                    role: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    display_name?: string | null
                    job_title?: string | null
                    has_completed_onboarding?: boolean | null
                    role?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    display_name?: string | null
                    job_title?: string | null
                    has_completed_onboarding?: boolean | null
                    role?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "users_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_public_report_by_id: {
                Args: {
                    lookup_id: string
                }
                Returns: {
                    id: string
                    user_id: string
                    model: string | null
                    serial_number: string | null
                    patrimony_id: string | null
                    device_type: string | null
                    full_description: string | null
                    reported_defect: string | null
                    technical_analysis: string | null
                    recommendation: string | null
                    technician_name: string | null
                    requester_name: string | null
                    requester_sector: string | null
                    photos: Json | null
                    status: string | null
                    priority: string | null
                    created_at: string
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
