# Proxxima Laudos - Sistema Inteligente de Laudos Técnicos

Ferramenta corporativa da **Proxxima Telecom** desenvolvida para padronizar, gerenciar e agilizar a criação de laudos técnicos de manutenção de equipamentos com o poder da Inteligência Artificial.

A aplicação evoluiu de um simples gerador para um **sistema web completo de gestão**, utilizando IA (Google Gemini) para gerar diagnósticos técnicos detalhados e fornecendo um ambiente robusto de administração, dashboards analíticos, autenticação de usuários e compartilhamento ágil.

![Proxxima Logo](https://www.proxxima.net/storage/app/uploads/public/5ea/1f7/af7/5ea1f7af72b2c773156463.svg)

## 🚀 Principais Funcionalidades

### 🪄 Geração Assistida por IA
- Transforma anotações simples (mesmo informais) em laudos completos e estruturados (Defeito Relatado, Análise Técnica, Recomendação).
- **Quick Edit (Edição Rápida):** Ajuste fino do laudo gerado pela IA utilizando um modal práticocom opções de reformulação, resumo ou expansão inteligente do texto.

### 📊 Gestão e Dashboard
- **Dashboard Analítico:** Visualização de métricas de laudos gerados, equipamentos mais frequentes e desempenho geral usando gráficos interativos.
- **Kanban Board:** Organização e acompanhamento intuitivo do status dos laudos por colunas (Pendente, Em Análise, Concluído, etc).
- **Histórico e Logs de Atividade:** Rastreio auditado de ações e modificações realizadas no sistema.

### 🔒 Autenticação e Usuários
- **Login e Telas de Boas-Vindas:** Autenticação segura via banco de dados (Supabase), gestão de perfis de técnicos e administradores.
- **Onboarding Interativo:** Telas de introdução guiada e "Welcome Back" para maximizar a adoção da ferramenta por novos usuários.

### 📄 Exportação e Compartilhamento
- **Visualizador Público Seguro:** Compartilhamento de laudos via link público online, ideal para clientes ou auditores que precisam validar o laudo remoto.
- **Exportação para PDF de Alto Padrão:** Gera arquivos PDF formatados com o layout corporativo com opções de compactação inteligente.
- **Envio de E-mail Descomplicado:** Modal prático de template preenchido na hora (assunto/corpo) enviando o conteúdo facilmente sem sair do foco.
- **Geração de QR Code:** Acesso instantâneo a links de laudos via escaneamento.

### 🎨 Design e UI/UX Moderno
- **Landing Page Profissional:** Apresentação elegante dos recursos aos usuários deslogados.
- **Design System Futurista:** Interface premium, responsiva, fluida com animações refinadas (Framer Motion) e acessibilidade em mente.
- **Modos Claro e Escuro (Dark Mode):** Suporte nativo, persistente e customizado com as cores da Proxxima.
- **Autocompletar de Cliente:** Busca e preenchimento inteligente e ágil de dados nas elaborações dos formulários.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/):** Interfaces declarativas com o máximo de tipagem estática e performance.
- **[Vite](https://vitejs.dev/):** Ferramenta de build/HMR com carregamento instantâneo.
- **[Tailwind CSS v4](https://tailwindcss.com/):** Estilos focados em utilitários, permitindo design complexo diretamente no markup corporativo (via `themes.ts`).
- **[Framer Motion](https://motion.dev/):** Biblioteca sólida para micro-interações e animações de montagem de página.
- **[Lucide React](https://lucide.dev/):** Iconografia SVG consistente e de fácil escala.

### Backend & Integrações 
- **[Supabase](https://supabase.com/):** Backend-as-a-Service escalável cobrindo Banco de Dados (PostgreSQL) e Autenticação robusta.
- **[Google GenAI SDK](https://ai.google.dev/):** Motor de cognição conectado ao modelo híbrido **Gemini 2.5 Flash**, altamente performático no processamento textual de telecom/manutenção.

---

## ⚙️ Pré-requisitos

Para rodar este projeto, você precisará ter em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Conta / Configurações em uma instância do **Supabase** (para BD, Auth e Policies)
- Chave válida de API do **Google Gemini** (emitida via Google AI Studio)

## 📦 Instalação e Configuração Local

1. **Clone o repositório** e entre na pasta:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd proxxima-laudos
   ```

2. **Instale as dependências** via `npm` (ou respectivo package manager):
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**:
   Crie um arquivo `.env.local` na raiz do projeto contendo as credenciais de seus parceiros de cloud:
   ```env
   VITE_GEMINI_API_KEY="AI..."
   VITE_SUPABASE_URL="https://[projeto].supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJhbG..."
   ```

4. **Inicie o servidor de desenvolvimento Vite**:
   ```bash
   npm run dev
   ```
   A aplicação geralmente estará acessível na porta padrão: `http://localhost:5173`.

---

## 📂 Estrutura Arquitetural do Projeto

```text
proxxima-laudos/
├── components/       # Interface componentizada (Dashboard, UI library, Modais, Reports)
│   └── ui/           # Radix Primitives + Tailwind Merge (Botões, Inputs, Dialogs)
├── contexts/         # React Contexts (Ex: Provedor Global de Autenticação)
├── hooks/            # Custom Hooks otimizadores de lógica repetitiva
├── lib/              # Inicialização de dependências persistentes (Ex: Supabase Client)
├── public/           # Assets públicos, imagens e manifestos estáticos
├── services/         # Handlers externos (Prompt de IA e requisições utilitárias)
├── supabase/         # Tipos e possivelmente migrations ligadas ao PostgreSQL
├── App.tsx           # Ponto central de roteamento, auth gates, e providers wrappers
├── themes.ts         # Central de cores do brand Proxxima para injetar no Tailwind
└── types.ts          # Central de Types e Interfaces (Modelagem TypeScript corporativa)
```

## 📝 Uso Prático (Workflow do Técnico)

1. **Autentique-se:** Acesse com as credenciais designadas aos técnicos. 
2. **Dashboard:** Analise um resumo ágil de seu volume de laudos. No Kanban, avance as etapas do serviço atual.
3. **Novo Laudo:** Abra a tela de preenchimento (`ReportForm`) – insira ou busque a unidade cliente (`ClientAutocomplete`) e cadastre os seriais.
4. **Acionando a IA:** Descreva os sintomas do equipamento em fala "corrida/informal" na descrição. Clique em **🪄 Gerar Laudo com IA**. 
5. **Revisando as Conclusões:** Após renderizar o texto formal, caso algo soe genérico, utilize os botões flutuantes de **Quick Edit** para lapidar a parte desejada (ex: deixar o Tom mais Técnico).
6. **Entrega Oficial:** Acione os atalhos do topo! Crie uma **URL Pública/QR Code** de visualização segura (`PublicReportViewer`), dispare pelo formato limpo de **E-mail**, ou emita o tradicional documento PDF para anexar num chamado.

---
**Desenvolvido sob medida e licenciado exclusivamente à [Proxxima Telecom](https://www.proxxima.net/).**
