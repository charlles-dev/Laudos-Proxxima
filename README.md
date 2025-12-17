# Proxxima Laudos - Gerador de Laudos Técnicos

Ferramenta interna da **Proxxima Telecom** desenvolvida para padronizar e agilizar a criação de laudos técnicos de manutenção de equipamentos.

A aplicação utiliza Inteligência Artificial (Google Gemini) para gerar diagnósticos técnicos detalhados e recomendações profissionais a partir de notas breves do técnico, além de gerar PDFs formatados prontos para envio.

![Proxxima Logo](https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg)

## 🚀 Funcionalidades

- **Geração Assistida por IA**: Transforma anotações simples em um laudo técnico completo, estruturado em:
  - Defeito Relatado (Descrição técnica clara)
  - Análise Técnica (Pontos de diagnóstico)
  - Recomendação (Solução definitiva)
- **Formulário Padronizado**: Campos específicos para identificação do equipamento (Modelo, Patrimônio, Serial) e do solicitante.
- **Exportação para PDF**: Gera um arquivo PDF (`LAUDO_PROXXIMA_[MODELO]_[DATA].pdf`) formatado com o layout corporativo.
- **Design Moderno e Responsivo**: Interface limpa com suporte a **Modo Escuro (Dark Mode)** e **Modo Claro**.
- **Ações Rápidas**:
  - Envio direto por E-mail.
  - Cópia do resumo técnico para área de transferência.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **IA/LLM**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (Gemini 2.5 Flash)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Utilitários**: html2canvas / jspdf (via pacote `html2pdf`)

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Chave de API do Google Gemini (AI Studio)

## 📦 Instalação e Configuração

1. **Clone o repositório** (ou baixe os arquivos para sua máquina local):
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd proxxima-laudos
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**:
   Crie um arquivo `.env` ou `.env.local` na raiz do projeto e adicione sua chave de API do Gemini:
   ```env
   GEMINI_API_KEY=sua_chave_api_aqui
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000`.

## 📂 Estrutura do Projeto

```
proxxima-laudos/
├── components/       # Componentes React (Formulário, Preview)
├── services/         # Integrações externas (AI Service)
├── public/           # Arquivos estáticos
├── themes.ts         # Definição de temas (Cores, Variáveis CSS)
├── types.ts          # Interfaces TypeScript e definições de tipos
└── App.tsx           # Componente principal e lógica da aplicação
```

## 📝 Uso

1. Preencha os dados do solicitante e do equipamento na barra lateral esquerda.
2. No campo **Descrição do Problema**, digite suas observações técnicas (mesmo que informais).
3. Clique no botão **"🪄 Gerar Laudo com IA"**.
4. Revise o laudo gerado na visualização à direita.
5. Utilize os botões no cabeçalho para **Baixar PDF**, **Enviar por Email** ou **Copiar Texto**.

---
Desenvolvido para uso interno da Proxxima Telecom.
