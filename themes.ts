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
      primary: '#E32085', // Pink Proxxima
      secondary: '#2B388C', // Blue Proxxima
      accent: '#2B388C', // Using Blue as accent in Light mode
      surface: 'var(--whitesmoke-100)',
      paper: 'var(--white-100)',
      text: '#1e293b',
      border: 'var(--lightgray-200)'
    }
  },
  {
    id: 'dark',
    name: 'Escuro',
    colors: {
      primary: '#E32085', // Pink Proxxima
      secondary: '#94a3b8',
      accent: '#2B388C', // Blue Proxxima
      surface: '#0f172a',
      paper: '#1e293b',
      text: '#f1f5f9',
      border: '#334155'
    }
  }
];