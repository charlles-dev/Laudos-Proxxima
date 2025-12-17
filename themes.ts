export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string; // Fundo da página
    paper: string;   // Fundo de cartões/sidebar
    text: string;    // Cor principal do texto
    border: string;  // Cor de bordas
  };
}

export const themes: Theme[] = [
  {
    id: 'light',
    name: 'Claro',
    colors: {
      primary: '#2B388C', // Azul Proxxima
      secondary: '#4b5563', // Gray 600
      accent: '#E32085', // Rosa Proxxima
      surface: '#f3f4f6', // Gray 100
      paper: '#ffffff',   // White
      text: '#111827',    // Gray 900
      border: '#e5e7eb'   // Gray 200
    }
  },
  {
    id: 'dark',
    name: 'Escuro',
    colors: {
      primary: '#60a5fa', // Blue 400 (Mais legível no escuro)
      secondary: '#9ca3af', // Gray 400
      accent: '#f472b6', // Pink 400
      surface: '#0f172a', // Slate 900
      paper: '#1e293b',   // Slate 800
      text: '#f3f4f6',    // Gray 100
      border: '#334155'   // Slate 700
    }
  }
];