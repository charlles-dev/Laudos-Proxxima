import { supabase } from './supabaseClient';
import { ReportData } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface SavedReport extends ReportData {
    id: string;
    userId: string;
    createdAt: string;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    jobTitle: string;
    hasCompletedOnboarding: boolean;
    role: 'admin' | 'user' | 'tech';
}

export interface ActivityLog {
    id: string;
    userId: string;
    action: string;
    details: string;
    timestamp: string;
}

// --- Reports ---

export const saveReport = async (userId: string, data: ReportData) => {
    try {
        const { data: result, error } = await supabase
            .from('reports')
            .insert({
                user_id: userId,
                model: data.model,
                serial_number: data.serialNumber,
                patrimony_id: data.patrimonyId,
                device_type: data.deviceType,
                full_description: data.fullDescription,
                reported_defect: data.reportedDefect,
                technical_analysis: data.technicalAnalysis,
                recommendation: data.recommendation,
                technician_name: data.technicianName,
                requester_name: data.requesterName,
                requester_sector: data.requesterSector,
                photos: data.photos || [],
                status: data.status || 'open',
                priority: data.priority || 'normal'
            })
            .select()
            .single();

        if (error) throw error;

        await logActivity(userId, "Criou Laudo", `Modelo: ${data.model}`);
        return result.id;
    } catch (error) {
        console.error("Erro ao salvar laudo no Supabase:", error);
        throw error;
    }
};

export const updateReport = async (reportId: string, updates: Partial<ReportData>) => {
    try {
        const { error } = await supabase
            .from('reports')
            .update({
                model: updates.model,
                serial_number: updates.serialNumber,
                patrimony_id: updates.patrimonyId,
                device_type: updates.deviceType,
                full_description: updates.fullDescription,
                reported_defect: updates.reportedDefect,
                technical_analysis: updates.technicalAnalysis,
                recommendation: updates.recommendation,
                technician_name: updates.technicianName,
                requester_name: updates.requesterName,
                requester_sector: updates.requesterSector,
                photos: updates.photos,
                status: updates.status,
                priority: updates.priority
            })
            .eq('id', reportId);

        if (error) throw error;
    } catch (error) {
        console.error("Erro ao atualizar laudo:", error);
        throw error;
    }
};



export const deleteReport = async (reportId: string) => {
    try {
        const { error } = await supabase
            .from('reports')
            .delete()
            .eq('id', reportId);

        if (error) throw error;
    } catch (error) {
        console.error("Erro ao deletar laudo:", error);
        throw error;
    }
};

export const deleteReports = async (reportIds: string[]) => {
    try {
        const { error } = await supabase
            .from('reports')
            .delete()
            .in('id', reportIds);

        if (error) throw error;
    } catch (error) {
        console.error("Erro ao deletar múltiplos laudos:", error);
        throw error;
    }
};

export const getReports = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map(mapReportFromDB);
    } catch (error) {
        console.error("Erro ao buscar laudos:", error);
        return [];
    }
};

export const getAllReports = async () => {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;

        return data.map(mapReportFromDB);
    } catch (error) {
        console.error("Erro ao buscar histórico geral:", error);
        return [];
    }
};

export const getReportById = async (reportId: string) => {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .eq('id', reportId)
            .single();

        if (error) return null;

        return mapReportFromDB(data);
    } catch (error) {
        console.error("Erro ao buscar laudo por ID:", error);
        throw error;
    }
};

export const getPublicReport = async (reportId: string) => {
    try {
        const { data, error } = await supabase
            .rpc('get_public_report_by_id', { lookup_id: reportId });

        if (error) throw error;
        // RPC with table return returns an array, use first item
        if (!data || data.length === 0) return null;

        return mapReportFromDB(data[0]);
    } catch (error) {
        console.error("Erro ao buscar laudo público:", error);
        return null; // Return null gracefully so UI can show 404
    }
};

export const getClients = async (query: string) => {
    try {
        // Busca nomes distintos na tabela de reports que coincidam com a query
        // Supabase não tem SELECT DISTINCT simples via JS SDK antigo, mas podemos usar .rpc ou just raw select e filter
        // Uma abordagem melhor para scale é ter uma tabela 'clients', mas por enquanto vamos extrair dos reports

        const { data, error } = await supabase
            .from('reports')
            .select('requester_name')
            .ilike('requester_name', `%${query}%`)
            .limit(50);

        if (error) throw error;

        // Filtrar únicos no lado do cliente (simples para <1000 records, ideal seria RPC)
        const uniqueNames = Array.from(new Set(data.map(item => item.requester_name)));
        return uniqueNames.slice(0, 5); // Retorna top 5
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        return [];
    }
};

// --- Profiles ---

export const updateUserPassword = async (newPassword: string) => {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;
    } catch (error) {
        console.error("Erro ao atualizar senha:", error);
        throw error;
    }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !data) return null;

        return {
            uid: data.id,
            email: data.email || '',
            displayName: data.display_name || '',
            jobTitle: data.job_title || '',
            hasCompletedOnboarding: data.has_completed_onboarding || false,
            role: (data.role as 'admin' | 'user' | 'tech') || 'tech'
        };
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        return null;
    }
};

export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
    try {
        const updates: any = {};
        if (profile.displayName !== undefined) updates.display_name = profile.displayName;
        if (profile.jobTitle !== undefined) updates.job_title = profile.jobTitle;
        if (profile.hasCompletedOnboarding !== undefined) updates.has_completed_onboarding = profile.hasCompletedOnboarding;

        // Check if user exists first (Trigger should handle creation, but safe to check)
        // Actually, we can just upsert or update. Update is safer if triggered.
        const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        throw error;
    }
};

// --- Logs ---

export const logActivity = async (userId: string, action: string, details: string) => {
    try {
        await supabase.from('audit_logs').insert({
            user_id: userId,
            action,
            details
        });
    } catch (error) {
        console.error("Falha ao registrar log:", error);
    }
};

export const getRecentLogs = async () => {
    try {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        return data.map((log: any) => ({
            id: log.id,
            userId: log.user_id,
            action: log.action,
            details: log.details,
            timestamp: log.created_at
        }));
    } catch (error) {
        console.error("Erro ao buscar logs:", error);
        return [];
    }
}

// Helper
const mapReportFromDB = (dbItem: any): SavedReport => ({
    id: dbItem.id,
    userId: dbItem.user_id,
    createdAt: dbItem.created_at,
    model: dbItem.model,
    serialNumber: dbItem.serial_number,
    patrimonyId: dbItem.patrimony_id,
    deviceType: dbItem.device_type, // Enums vs String check might be needed if strict
    fullDescription: dbItem.full_description,
    reportedDefect: dbItem.reported_defect,
    technicalAnalysis: dbItem.technical_analysis,
    recommendation: dbItem.recommendation,
    technicianName: dbItem.technician_name,
    requesterName: dbItem.requester_name,
    requesterSector: dbItem.requester_sector || '',
    photos: (dbItem.photos as string[]) || [], // Type assertion needed for Jsonb
    status: (dbItem.status as 'open' | 'in_progress' | 'closed') || 'open',
    priority: (dbItem.priority as 'low' | 'normal' | 'high' | 'critical') || 'normal',
    date: new Date(dbItem.created_at).toISOString().split('T')[0]
});

export const uploadEvidenceImage = async (file: File): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('evidences')
            .upload(filePath, file);

        if (uploadError) {
            console.error("Supabase Storage Upload Error:", uploadError);
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('evidences')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        return null;
    }
};
