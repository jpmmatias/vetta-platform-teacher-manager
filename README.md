# Vetta Platform - Teacher Manager

Uma aplicação React Native para gerenciamento de turmas e atividades educacionais, desenvolvida para professores da plataforma Vetta.

## 🚀 Funcionalidades

### Tela Principal - Minhas Turmas
- **Interface Responsiva**: Grid adaptativo de cards de turmas
- **Filtros Avançados**: Por matéria, período e status
- **Busca Inteligente**: Pesquisa por nome da turma
- **Métricas em Tempo Real**: Participação, notas médias, atividades pendentes
- **Insights da IA**: Recomendações personalizadas para cada turma
- **Ações Rápidas**: Acesso direto, correção IA, relatórios

### Modal Nova Turma
- **Formulário Multi-etapas**: Informações básicas, configurações e revisão
- **Validação Completa**: Campos obrigatórios e formatos
- **Configurações Avançadas**: IA, notificações, relatórios, uploads
- **Interface Intuitiva**: Progress bar e navegação clara

### Tela de Detalhes da Turma
- **Abas Organizadas**: Visão geral, estudantes e atividades
- **Métricas Detalhadas**: Estatísticas completas da turma
- **Lista de Estudantes**: Status, notas e atividades
- **Gestão de Atividades**: Criação, edição e acompanhamento

### Modal Adicionar Estudantes
- **Dois Modos de Importação**:
  - **Individual**: Adicionar estudantes um por vez
  - **Em Lote**: Importar lista completa via texto
- **Validação de Email**: Verificação automática de formato
- **Interface Flexível**: Adicionar/remover campos dinamicamente
- **Preview em Tempo Real**: Contador de estudantes detectados

### Modal Nova Atividade
- **Seleção de Tipo**: Lista de exercícios, quiz, projeto ou prova
- **Configurações Avançadas**:
  - Data e horário de vencimento
  - Nota máxima personalizável
  - Instruções detalhadas para estudantes
- **Configurações de Correção**:
  - Correção automática com IA
  - Permissão para entrega tardia
  - Obrigatoriedade de upload de arquivo
- **Interface Visual**: Cards de seleção de tipo com ícones
- **Gerador de Questões com IA**:
  - Contexto personalizado para geração
  - Seleção de tipos de questão (múltipla escolha, V/F, dissertativa, etc.)
  - Configuração de dificuldade e número de questões
  - Edição completa das questões geradas
  - Suporte a diferentes formatos de resposta

## 🎨 Design System

### Paleta de Cores
```css
/* Cores Principais */
Primary: #3b82f6 (Azul)
Success: #10b981 (Verde)
Warning: #f59e0b (Amarelo)
Error: #dc2626 (Vermelho)

/* Cores de Matérias */
Matemática: #FF6B35
Português: #2563EB
Ciências: #16A34A
História: #7C3AED
Geografia: #0891B2

/* Cores Neutras */
Gray-50: #f9fafb
Gray-100: #f3f4f6
Gray-500: #6b7280
Gray-900: #111827
```

### Componentes Reutilizáveis
- **ClassCard**: Card de turma com métricas e ações
- **AIInsights**: Componente de insights da IA
- **ResponsiveGrid**: Grid adaptativo responsivo
- **AddStudentModal**: Modal para adicionar estudantes
- **NewActivityModal**: Modal para criar atividades com IA
- **QuestionEditor**: Editor completo de questões com IA

## 📱 Microinterações

### Feedback Visual
- **Loading States**: Indicadores de carregamento
- **Error States**: Mensagens de erro claras
- **Success Feedback**: Confirmações de ações
- **Hover Effects**: Estados de hover em botões
- **Progress Indicators**: Barras de progresso

### Animações
- **Transições Suaves**: Entre telas e modais
- **Fade In/Out**: Aparição e desaparecimento
- **Scale Effects**: Botões e cards interativos
- **Slide Animations**: Navegação entre abas

## ♿ Acessibilidade

### Recursos Implementados
- **Labels Semânticos**: Para leitores de tela
- **Contraste Adequado**: Cores com boa legibilidade
- **Tamanhos de Fonte**: Escaláveis e legíveis
- **Navegação por Teclado**: Suporte completo
- **Focus Indicators**: Indicadores visuais de foco

## 🧪 Dados Mockados

### Turmas de Exemplo
```typescript
{
  id: '1',
  name: 'Matemática - 9º Ano A',
  subject: 'Matemática',
  period: '2024.1',
  studentsCount: 32,
  participationRate: 87,
  averageGrade: 8.4,
  pendingActivities: 5
}
```

### Estudantes de Exemplo
```typescript
{
  id: '1',
  name: 'Ana Silva',
  email: 'ana.silva@email.com',
  status: 'active',
  averageGrade: 8.7,
  completedActivities: 12,
  pendingActivities: 2
}
```

### Atividades de Exemplo
```typescript
{
  id: '1',
  title: 'Prova - Equações do 2º Grau',
  type: 'exam',
  dueDate: '2024-03-15',
  status: 'published',
  submissions: 28,
  totalStudents: 32,
  averageGrade: 8.2,
  aiGenerated: true,
  questions: [
    {
      id: '1',
      type: 'multiple-choice',
      question: 'Qual é a fórmula para calcular a área de um círculo?',
      options: ['A = πr²', 'A = 2πr', 'A = πd', 'A = r²'],
      correctAnswer: 'A = πr²',
      points: 2,
      difficulty: 'easy'
    }
  ]
}
```

## 🔧 Configuração

### Pré-requisitos
- Node.js 18+
- pnpm
- Expo CLI

### Instalação
```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm start

# Executar no iOS
pnpm ios

# Executar no Android
pnpm android
```

### Estrutura de Arquivos
```
vetta-platform-teacher-manager/
├── app/
│   ├── teacher/
│   │   ├── classes.tsx          # Tela principal
│   │   └── class-detail.tsx     # Detalhes da turma
│   └── manager/
│       └── dashboard.tsx        # Dashboard do gestor
├── components/
│   ├── ClassCard.tsx            # Card de turma
│   ├── AIInsights.tsx           # Insights da IA
│   ├── ResponsiveGrid.tsx       # Grid responsivo
│   ├── NewClassModal.tsx        # Modal nova turma
│   ├── AddStudentModal.tsx      # Modal adicionar estudantes
│   └── NewActivityModal.tsx     # Modal nova atividade
└── constants/
    └── Colors.ts                # Paleta de cores
```

## 🚀 Próximos Passos

### Funcionalidades Planejadas
- [ ] **Sistema de Notificações**: Push notifications para atividades
- [ ] **Relatórios Avançados**: Gráficos e análises detalhadas
- [ ] **Integração com IA**: Correção automática de atividades
- [x] **Geração de Questões com IA**: Criação automática de questões personalizadas
- [ ] **Sincronização Offline**: Funcionamento sem internet
- [ ] **Modo Escuro**: Tema dark para melhor experiência
- [ ] **Testes Automatizados**: Unit e integration tests
- [ ] **PWA**: Versão web progressiva
- [ ] **Backend Integration**: API real para persistência

### Melhorias de UX
- [ ] **Onboarding**: Tutorial para novos usuários
- [ ] **Shortcuts**: Atalhos de teclado
- [ ] **Drag & Drop**: Reorganização de turmas
- [ ] **Bulk Actions**: Ações em lote
- [ ] **Search Filters**: Filtros avançados de busca

## 📄 Licença

Este projeto é desenvolvido para a plataforma Vetta e está sob licença proprietária.

## 👥 Contribuição

Para contribuir com o projeto:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para a plataforma Vetta**
