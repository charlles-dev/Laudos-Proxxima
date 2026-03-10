export enum DeviceType {
  NOTEBOOK = 'Notebook',
  DESKTOP = 'Desktop',
  MONITOR = 'Monitor',
  PERIPHERAL = 'Periférico',
  PRINTER = 'Impressora',
  SERVER = 'Servidor',
  OTHER = 'Outro'
}

export interface ReportData {
  id?: string;
  refId?: string;
  requesterName: string;
  requesterSector: string;
  deviceType: DeviceType;
  model: string;
  serialNumber: string;
  patrimonyId: string;
  reportedDefect: string;
  technicalAnalysis: string;
  recommendation: string;
  technicianName: string;
  date: string;
  fullDescription: string;
  photos?: string[];
  status?: 'open' | 'in_progress' | 'awaiting_parts' | 'closed';
  priority?: 'low' | 'normal' | 'high' | 'critical';
  outcomeType?: 'internal_fix' | 'parts_request' | 'external_assistance';
  partsRequested?: { name: string; partNumber?: string; quantity: number }[];
  aiTone?: 'técnico' | 'didático' | 'executivo';
  internalComments?: string;
  closedAt?: string;
}

export const INITIAL_DATA: ReportData = {
  requesterName: '',
  requesterSector: '',
  deviceType: DeviceType.NOTEBOOK,
  model: '',
  serialNumber: '',
  patrimonyId: '',
  reportedDefect: '',
  technicalAnalysis: '', // Filled by AI
  recommendation: '', // Filled by AI
  technicianName: '',
  date: new Date().toISOString().split('T')[0],
  fullDescription: '',
  status: 'open',
  priority: 'normal',
  aiTone: 'técnico',
  internalComments: ''
};

export const generateRefId = () => Math.random().toString(36).substr(2, 9).toUpperCase();