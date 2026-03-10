# 🚀 Sugestões de Features & Melhorias — Laudos-Proxxima

---

## 🗺️ Fluxo Real de Trabalho

```
Equipamento Defeituoso
       ↓
   TI analisa
       ↓
  ┌───────────────────────────────────────────┐
  │            Tipo de desfecho?              │
  └───────────────────────────────────────────┘
     ↙                  ↓                ↘
 Resolvido        Precisa de Peça    Além do alcance
internamente      (reparo interno,   do TI
    ↓              mas peça falta)       ↓
Laudo de              ↓             Laudo para
histórico/       Laudo para         Assistência
compliance       Setor de Compras   Técnica Externa
    ↘                  ↓              ↙
       TI baixa o PDF e encaminha por email manualmente
```

---

## ⭐ Features Críticas para o Fluxo Real

### 1. Tipo de Desfecho: Interno / Peça / Assistência Externa
**Problema:** O sistema não distingue o resultado do laudo. Cada tipo tem destinatário, PDF e texto diferentes.
**Sugestão:** Adicionar `outcomeType: 'internal_fix' | 'parts_request' | 'external_assistance'` no `ReportData`. Com isso:
- O **PDF** usa template diferente por tipo
- O **prompt da IA** adapta o texto conforme o desfecho
- O **Dashboard** ganha filtro por tipo de desfecho

---

### 2. Campo "Peças Necessárias" com Tabela no PDF
**Problema:** Quando o setor de compras solicita um laudo para autorizar a compra de um componente, não há campo estruturado para listar as peças.
**Sugestão:** Adicionar ao `ReportData`:

```ts
partsRequested: { name: string; partNumber?: string; quantity: number }[]
```

- Renderizar uma **tabela de peças** formatada no PDF
- A IA sugere as peças com base no diagnóstico
- Aparece somente quando `outcomeType === 'parts_request'`

---

### 3. Template de Título e Corpo de Email (Só Copiar)
**Contexto:** O email é enviado manualmente pelo técnico, após baixar o PDF.
**Sugestão:** Botão **"Copiar Modelo de Email"** que copia título + corpo para a área de transferência, indicando o laudo em anexo.

Exemplos por tipo de desfecho:
- **Peça:** `Assunto: Solicitação de Peça — [Modelo] / Corpo: "... conforme laudo técnico em anexo..."`
- **Assistência:** `Assunto: Encaminhamento para Assistência Técnica — [Modelo]`
- **Interno:** `Assunto: Registro de Atendimento Técnico — [Modelo]`

---

### 4. Renomear "Cliente/Solicitante" → "Colaborador"
**Sugestão:** Renomear os labels para **"Colaborador"** em todo o sistema — formulário, dashboard, PDF e laudo público.

---

## 🤖 IA & Automação

### 5. Tom de Escrita Selecionável
**Problema:** O `aiService.ts` suporta `técnico`, `didático` e `executivo`, mas o formulário passa `'técnico'` hardcoded.
**Sugestão:** Seletor no Passo 2. Para laudos ao setor de compras, `executivo` é mais adequado.

---

### 6. Sugestão Automática de Prioridade pela IA
**Sugestão:** IA retorna `suggestedPriority` no JSON e pré-preenche o campo.

---

### 7. Histórico de Versões IA com "Regerar"
**Problema:** Clicar "Gerar com IA" sobrescreve o conteúdo anterior sem aviso.
**Sugestão:** Guardar as últimas 3 versões em estado local com opção de voltar.

---

## 🎨 UX & Fluxo de Trabalho

### 8. Rascunho Automático (Draft Recovery Real)
**Problema:** `useAutoSave.ts` existe mas o `useEffect` em `App.tsx` está vazio.
**Sugestão:** Banner de recuperação: *"Encontramos um rascunho de [Data]. Deseja continuar?"*

---

### 9. Validação de Campos Obrigatórios por Passo
**Problema:** É possível chegar ao Passo 3 sem preencher nada.
**Sugestão:** Validar `requesterName`, `model` e `deviceType` antes de avançar.

---

### 10. Drag & Drop de Imagens (Funcional)
**Problema:** "Arraste aqui" existe no texto, mas o `onDrop` da div nunca foi implementado.
**Sugestão:** Implementar handler `onDrop` real usando a mesma `processFiles()`.

---

### 11. Galeria com Lightbox nas Evidências
**Sugestão:** Aumentar limite para 10 fotos + lightbox com zoom e navegação ao clicar nas miniaturas.

---

### 12. Modo de Edição Rápida no Dashboard
**Sugestão:** Drawer lateral ao clicar na linha da tabela, editando `status`, `priority` e `recommendation` sem trocar de tela.

---

### 13. Atalhos de Teclado Expandidos
**Sugestão:** `Alt+N` (novo laudo), `Alt+P` (preview), `Alt+1/2/3` (passos), `Alt+D` (baixar PDF). Lista visível com `?`.

---

### 14. Notificações em Tempo Real (Supabase Realtime)
**Sugestão:** Badge "N novos laudos" ou atualização automática quando outro técnico atualizar um laudo.

---

## 📱 Mobile & Campo

### 15. PWA (Progressive Web App)
**Sugestão:** Transformar o app em PWA. O técnico pode abrir no celular, tirar fotos do equipamento direto no almoxarifado e até usar offline (sincroniza depois).

---

### 16. Captura de Foto Direto pela Câmera
**Sugestão:** Adicionar `capture="environment"` no input de imagem para abrir a câmera traseira diretamente no mobile, permitindo fotografar o equipamento na hora.

---

## 📄 PDF & Documentação

### 17. Marca d'Água "RASCUNHO" no Preview
**Sugestão:** Enquanto o laudo tem status `open`, o PDF exibe marca d'água "RASCUNHO" para evitar encaminhamento de laudos não finalizados.

---

### 18. Numeração Sequencial de Laudos
**Problema:** O `refId` é aleatório (`Math.random().toString(36)`). Para formalização ao setor de compras, isso não transmite rastreabilidade.
**Sugestão:** Formato sequencial tipo `LT-2026-0047` (por ano), gerado via sequence no Supabase.

---

### 19. Modelo de PDF por Tipo de Desfecho
**Sugestão:** PDF para setor de compras destaca a tabela de peças. Para assistência externa, inclui campo de "dados da assistência" e "garantia".

---

## 🔧 Gestão de Equipamentos

### 20. Histórico de um Equipamento Específico
**Sugestão:** Filtrar todos os laudos por mesmo patrimônio/S/N. Se um notebook voltou 3x, é evidência para solicitar substituição.

---

### 21. Indicador "Reincidente"
**Sugestão:** Badge automático quando um equipamento (mesmo S/N ou patrimônio) já teve laudos. Ex: ⚠️ *"3º laudo para este equipamento"*.

---

## 👥 Equipe & Colaboração

### 22. Comentários Internos no Laudo
**Sugestão:** Anotações entre técnicos: *"Já pedi orçamento para o fornecedor X"*. Visíveis só internamente, sem ir para o PDF.

---

### 23. Status "Aguardando Peça"
**Problema:** Falta um status entre "Em Análise" e "Concluído" para quando o TI está esperando a peça chegar.
**Sugestão:** Adicionar `'awaiting_parts'` ao enum de status. O Kanban ganha uma 4ª coluna.

---

## 📊 Dashboard & Analytics

### 24. Gráfico de Timeline na Aba BI *(dado já calculado, gráfico faltando)*
**Problema:** O `timelineData` é calculado em `AnalyticsDashboard.tsx` mas o `LineChart` nunca foi adicionado ao JSX.
**Sugestão:** Adicionar o gráfico de evolução diária/semanal.

---

### 25. BI por Tipo de Desfecho
**Sugestão:** Gráfico de pizza com proporção de laudos por tipo (interno / peça / externo). Útil para gestão do TI.

---

### 26. Exportar BI em CSV
**Sugestão:** Botão "Exportar CSV" na aba BI. Útil para relatórios mensais.

---

### 27. KPIs Pessoais na Aba "Meus Laudos"
**Sugestão:** Barra de KPIs no topo: total hoje, laudos em aberto, taxa de conclusão.

---

### 28. Gráfico "Peças Mais Solicitadas"
**Sugestão:** Com o campo de peças implementado, ranking das peças mais pedidas ao setor de compras. Pode justificar estoque mínimo.

---

### 29. Taxa de Reincidência por Modelo
**Sugestão:** Gráfico mostrando quais modelos/marcas mais voltam para manutenção. Excelente para decisão de compra.

---

### 30. Tempo Médio "Aguardando Peça"
**Sugestão:** Medir quanto tempo o setor de compras demora para atender as solicitações.

---

## 🏗️ Arquitetura

### 31. Corrigir: Re-salvar um Laudo Cria Duplicatas *(bug)*
**Problema:** `saveReport()` sempre faz `.insert()`, mesmo ao re-salvar.
**Sugestão:** Verificar `data.id`: se existir, chamar `updateReport()`, senão `saveReport()`.

---

### 32. Tabela `collaborators` com Setor e Email
**Sugestão:** Criar tabela dedicada no Supabase com `name`, `sector`, `email` do colaborador.

---

### 33. Campo `closedAt` para Medir Tempo de Atendimento
**Sugestão:** `closed_at TIMESTAMPTZ` atualizado via trigger ao mudar para `'closed'`.

---

### 34. Paginação Real no Dashboard
**Problema:** `getAllReports()` usa `.limit(100)` hardcoded.
**Sugestão:** Paginação com `range()` do Supabase, blocos de 20.

---

## 🔒 Controle & Segurança

### 35. Laudo "Travado" Após Fechamento
**Sugestão:** Impedir edição de laudos com status `closed` sem antes reabri-los. Evita alteração acidental de laudos já formalizados e enviados.

---

### 36. Histórico de Auditoria com Diff de Campos
**Sugestão:** Trigger PostgreSQL que grava `old_values JSONB` e `new_values JSONB` ao UPDATE em `reports`. Exibir na aba Logs (admin only).

---

### 37. ~~Assinatura Digital no PDF~~ *(já implementado)*

### 38. ~~QR Code no Link Público~~ *(já implementado)*

---

## 📋 Resumo Priorizado

| # | Feature | Esforço | Impacto | Prioridade |
|---|---------|---------|---------|------------|
| 1 | Tipo de Desfecho (interno / peça / externo) | Médio | 🔥 Crítico | 🔴 Urgente |
| 2 | Campo Peças + tabela no PDF | Médio | 🔥 Crítico | 🔴 Urgente |
| 31 | Corrigir duplicação ao re-salvar | Baixo | 🔥 Crítico | 🔴 Urgente |
| 3 | Modelo de Email para Copiar | Baixo | Alto | 🔴 Urgente |
| 4 | Renomear Solicitante → Colaborador | Baixo | Alto | 🔴 Urgente |
| 23 | Status "Aguardando Peça" | Baixo | Alto | 🔴 Urgente |
| 18 | Numeração Sequencial (LT-2026-XXXX) | Médio | Alto | 🟠 Alta |
| 8 | Draft Recovery Real | Baixo | Alto | 🟠 Alta |
| 10 | Drag & Drop de Imagens | Baixo | Médio | 🟠 Alta |
| 24 | Timeline Chart no BI | Baixo | Alto | 🟠 Alta |
| 5 | Tom de Escrita Selecionável | Baixo | Alto | 🟠 Alta |
| 21 | Indicador Reincidente | Médio | Alto | 🟠 Alta |
| 17 | Marca d'Água "Rascunho" | Baixo | Médio | 🟠 Alta |
| 35 | Laudo Travado após Fechamento | Baixo | Alto | 🟠 Alta |
| 9 | Validação por Passo | Médio | Alto | 🟡 Média |
| 19 | PDF por Tipo de Desfecho | Médio | Alto | 🟡 Média |
| 22 | Comentários Internos | Médio | Médio | 🟡 Média |
| 25 | BI por Tipo de Desfecho | Médio | Alto | 🟡 Média |
| 33 | Campo `closedAt` + tempo médio | Médio | Médio | 🟡 Média |
| 15 | PWA | Alto | Alto | 🟡 Média |
| 32 | Tabela `collaborators` | Médio | Médio | 🟡 Média |
| 28 | Peças Mais Solicitadas (BI) | Médio | Médio | 🟢 Baixa |
| 29 | Reincidência por Modelo (BI) | Médio | Médio | 🟢 Baixa |
| 36 | Auditoria com Diff de Campos | Alto | Médio | 🟢 Baixa |
