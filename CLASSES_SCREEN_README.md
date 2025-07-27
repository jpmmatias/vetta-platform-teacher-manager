# Tela "Minhas Turmas" - Professor

## Visão Geral

Esta é a tela central onde o professor visualiza e gerencia todas as suas turmas ativas na plataforma Vetta. A interface foi desenvolvida seguindo as especificações detalhadas para proporcionar uma experiência de usuário eficiente e intuitiva.

## Funcionalidades Implementadas

### 🎯 Layout Principal
- **Cabeçalho**: Título "Minhas Turmas" + filtros rápidos + botão "Nova Turma"
- **Visualização**: Grid de cards das turmas (2-4 colunas responsivas)
- **Métricas Gerais**: Cards de resumo no topo da página
- **Busca e Filtros**: Sistema completo de filtragem e ordenação

### 📊 Cards de Turma
Cada card de turma inclui:

#### Informações Principais
- Nome da Turma (ex: "Matemática - 9º Ano A")
- Disciplina com badge colorido
- Período letivo
- Quantidade de estudantes
- Escola/Instituição

#### Métricas Visuais
- Atividades Pendentes (destacadas em vermelho quando > 0)
- Taxa de Participação com barra de progresso colorida
- Desempenho Geral (nota média)
- Atividades Corrigidas

#### Indicadores de Status
- Badges para atividades aguardando correção
- Indicador de atenção necessária
- Status visual da turma (ativa/inativa/arquivada)
- Indicador de sincronização

#### Ações Rápidas
- **Acessar Turma**: Botão primário azul (navega para tela de detalhes)
- **Correção IA**: Acesso direto quando há atividades pendentes
- **Relatórios**: Ícone para analytics
- **Menu de Contexto**: Opções avançadas (editar, duplicar, arquivar, etc.)

### 🔍 Sistema de Filtros
- **Por Disciplina**: Dropdown com todas as matérias
- **Por Período**: Semestre/ano letivo
- **Por Status**: Ativas, arquivadas, todas
- **Busca**: Campo de pesquisa por nome da turma
- **Ordenação**: Mais recentes, nome A-Z, mais atividades

### 📈 Métricas Gerais
Cards de resumo mostrando:
- Total de Turmas (com comparação período anterior)
- Estudantes Ativos
- Atividades Pendentes
- Média Geral de Performance

### 🤖 Insights da IA
- Sugestões automáticas baseadas no desempenho
- Alertas sobre turmas que precisam de atenção
- Recomendações de próximas ações
- Priorização por importância (alta, média, baixa)

### 📱 Estados da Interface
- **Estado Vazio**: Ilustração e CTA para criar primeira turma
- **Carregamento**: Skeleton com loading placeholder
- **Erro**: Mensagem de erro com botão de retry

### 🎨 Responsividade
- **Desktop (1200px+)**: 3-4 cards por linha
- **Tablet (768px-1200px)**: 2-3 cards por linha
- **Mobile (até 768px)**: Cards empilhados verticalmente

## 🆕 Novas Funcionalidades

### 📝 Modal "Nova Turma"
Modal completo em 3 etapas para criar uma nova turma:

#### Etapa 1: Informações Básicas
- **Nome da Turma**: Campo obrigatório com validação
- **Disciplina**: Seleção via chips coloridos (14 disciplinas disponíveis)
- **Período**: Seleção de semestre/ano letivo
- **Série**: Seleção de ano escolar (6º ao 3º EM)
- **Instituição**: Campo obrigatório
- **Turno**: Manhã, Tarde, Noite, Integral
- **Número Máximo de Estudantes**: Campo numérico (1-100)
- **Descrição**: Campo opcional para detalhes da turma

#### Etapa 2: Configurações
- **Correção Automática com IA**: Toggle para ativar/desativar
- **Notificações**: Toggle para alertas
- **Relatórios Automáticos**: Toggle para relatórios semanais
- **Upload de Arquivos**: Toggle para permitir envio de arquivos

#### Etapa 3: Revisão
- Resumo completo de todas as informações
- Confirmação antes de criar a turma
- Validação final de todos os campos

#### Características do Modal
- **Validação em Tempo Real**: Erros são exibidos imediatamente
- **Indicador de Progresso**: Visualização clara das etapas
- **Navegação Intuitiva**: Botões "Voltar" e "Próximo"
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessível**: Suporte a navegação por teclado

### 🏫 Tela "Acessar Turma" (Detalhes da Turma)
Tela completa de gerenciamento da turma com 3 abas:

#### Aba: Visão Geral
- **Cards de Métricas**: Atividades, pendentes, média, participação
- **Atividades Recentes**: Lista das últimas atividades com status
- **Configurações da Turma**: Toggles para funcionalidades ativas

#### Aba: Estudantes
- **Lista de Estudantes**: Nome, email, status, métricas individuais
- **Estatísticas por Estudante**: Média, atividades concluídas/pendentes
- **Status Visual**: Indicadores de atividade/inatividade
- **Botão "Adicionar Estudante"**: Para incluir novos alunos

#### Aba: Atividades
- **Lista de Atividades**: Título, tipo, data de vencimento, status
- **Progresso Visual**: Barra de progresso de entregas
- **Tipos de Atividade**: Prova, Lista, Projeto, Quiz
- **Status de Correção**: Indicadores de atividades pendentes
- **Botão "Nova Atividade"**: Para criar atividades

#### Funcionalidades da Tela
- **Navegação por Abas**: Interface intuitiva
- **FAB (Floating Action Button)**: Acesso rápido para nova atividade
- **Ações por Atividade**: Editar, menu de opções
- **Filtros e Busca**: Para estudantes e atividades
- **Métricas em Tempo Real**: Dados atualizados

## Componentes Criados

### 1. `ClassCard.tsx`
Componente reutilizável para os cards de turma com:
- Renderização condicional de elementos
- Sistema de cores por disciplina
- Indicadores visuais de status
- Menu de contexto com ações
- Navegação para tela de detalhes

### 2. `AIInsights.tsx`
Componente para exibir insights e recomendações da IA:
- Diferentes tipos de insights (melhoria, aviso, recomendação)
- Sistema de prioridades
- Cores e ícones contextuais

### 3. `ResponsiveGrid.tsx`
Componente para gerenciar a responsividade do grid:
- Adaptação automática do número de colunas
- Suporte a modo lista e grid

### 4. `NewClassModal.tsx` 🆕
Modal completo para criação de turmas:
- Formulário em 3 etapas
- Validação em tempo real
- Configurações avançadas
- Interface responsiva

### 5. `class-detail.tsx` 🆕
Tela de detalhes da turma:
- 3 abas principais (Visão Geral, Estudantes, Atividades)
- Métricas detalhadas
- Gerenciamento de estudantes
- Controle de atividades

## Paleta de Cores

### Disciplinas
- **Matemática**: #FF6B35 (laranja)
- **Português**: #2563EB (azul)
- **Ciências**: #16A34A (verde)
- **História**: #7C3AED (roxo)
- **Geografia**: #0891B2 (azul claro)
- **Física**: #DC2626 (vermelho)
- **Química**: #7C2D12 (marrom)
- **Biologia**: #059669 (verde escuro)
- **Inglês**: #1E40AF (azul escuro)
- **Espanhol**: #BE185D (rosa)
- **Arte**: #F59E0B (amarelo)
- **Educação Física**: #10B981 (verde)
- **Filosofia**: #8B5CF6 (roxo)
- **Sociologia**: #EF4444 (vermelho claro)

### Status
- **Ativo**: #16A34A (verde)
- **Pendente**: #EA580C (laranja)
- **Arquivado**: #6B7280 (cinza)
- **Erro**: #DC2626 (vermelho)

## Microinterações

### Hover Effects
- Cards com elevação sutil
- Botões com mudança de cor suave
- Tooltips informativos

### Animações
- Fade in dos cards durante carregamento
- Transições suaves entre estados
- Feedback visual para ações

## Acessibilidade

### Navegação por Teclado
- Sequência lógica de tab order
- Atalhos para ações principais
- Labels descritivos para screen readers

### Contraste e Legibilidade
- Contraste mínimo de 4.5:1
- Tamanhos de fonte legíveis
- Ícones sempre com labels

## Dados Mockados

A interface utiliza dados mockados para demonstração:
- 5 turmas de exemplo com diferentes disciplinas
- Métricas calculadas dinamicamente
- Insights da IA baseados no desempenho das turmas
- 3 estudantes de exemplo com dados completos
- 3 atividades de exemplo com diferentes status

## Fluxo de Navegação

1. **Tela Principal** → Lista de turmas com filtros
2. **Botão "Nova Turma"** → Modal de criação (3 etapas)
3. **"Acessar Turma"** → Tela de detalhes com 3 abas
4. **Menu de Contexto** → Ações avançadas por turma

## Próximos Passos

1. **Integração com Backend**: Conectar com APIs reais
2. **Notificações Push**: Sistema de alertas em tempo real
3. **Análise Preditiva**: Insights mais avançados da IA
4. **Ações em Lote**: Seleção múltipla de turmas
5. **Exportação de Dados**: Funcionalidade completa de export
6. **Upload de Arquivos**: Sistema de arquivos para atividades
7. **Chat em Tempo Real**: Comunicação professor-estudantes

## Tecnologias Utilizadas

- **React Native**: Framework principal
- **TypeScript**: Tipagem estática
- **React Native Paper**: Componentes de UI
- **Expo Vector Icons**: Ícones Material Design
- **React Navigation**: Navegação entre telas
- **Expo Router**: Roteamento baseado em arquivos

## Estrutura de Arquivos

```
app/teacher/classes.tsx          # Tela principal
app/teacher/class-detail.tsx     # Tela de detalhes da turma
components/ClassCard.tsx         # Card de turma
components/AIInsights.tsx        # Insights da IA
components/ResponsiveGrid.tsx    # Grid responsivo
components/NewClassModal.tsx     # Modal de nova turma
constants/Colors.ts             # Paleta de cores
```

## Como Executar

1. Instale as dependências:
```bash
pnpm install
```

2. Execute o projeto:
```bash
pnpm start
```

3. Acesse a tela "Minhas Turmas" através da navegação do professor

## Contribuição

Para contribuir com melhorias na tela:
1. Siga os padrões de código estabelecidos
2. Mantenha a responsividade em mente
3. Teste em diferentes tamanhos de tela
4. Documente novas funcionalidades
5. Mantenha a acessibilidade como prioridade 