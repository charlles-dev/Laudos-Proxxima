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
      primary: 'var(--proxxima-disco)', // #9B2071
      secondary: 'var(--proxxima-tundora)', // #444444 (Text)
      accent: 'var(--proxxima-cerise)', // #CD2784
      surface: 'var(--whitesmoke-100)',
      paper: 'var(--white-100)',
      text: 'var(--proxxima-tundora)',
      border: 'var(--lightgray-200)'
    }
  },
  {
    id: 'dark',
    name: 'Escuro',
    colors: {
      primary: 'var(--proxxima-disco)',
      secondary: '#a0a0a0', // Adjusted for dark mode readability
      accent: 'var(--proxxima-cerise)',
      surface: 'rgb(20, 10, 25)', // Deep Purple Background
      paper: '#1a1a1a',
      text: '#e0e0e0',
      border: '#333'
    }
  }
];