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
  status?: 'open' | 'in_progress' | 'closed';
  priority?: 'low' | 'normal' | 'high' | 'critical';
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
  priority: 'normal'
};

export const generateRefId = () => Math.random().toString(36).substr(2, 9).toUpperCase();