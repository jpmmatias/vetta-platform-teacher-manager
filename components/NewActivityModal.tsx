import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Modal, Portal, Card, Button, Chip, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface NewActivityModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (activityData: ActivityData) => void;
  classId: string;
}

interface ActivityData {
  title: string;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  description: string;
  dueDate: string;
  dueTime: string;
  maxGrade: number;
  allowLateSubmission: boolean;
  enableAICorrection: boolean;
  requireFileUpload: boolean;
  instructions: string;
  aiGenerated?: boolean;
  aiContext?: string;
  questions?: QuestionData[];
}

interface QuestionData {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'problem';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const activityTypes = [
  {
    id: 'assignment',
    name: 'Lista de Exercícios',
    icon: 'assignment',
    color: '#3b82f6',
    description: 'Atividade com questões e problemas'
  },
  {
    id: 'quiz',
    name: 'Quiz',
    icon: 'quiz',
    color: '#10b981',
    description: 'Questionário de múltipla escolha'
  },
  {
    id: 'project',
    name: 'Projeto',
    icon: 'group-work',
    color: '#f59e0b',
    description: 'Trabalho em grupo ou individual'
  },
  {
    id: 'exam',
    name: 'Prova',
    icon: 'school',
    color: '#dc2626',
    description: 'Avaliação formal'
  },
];

const questionTypes = [
  {
    id: 'multiple-choice',
    name: 'Múltipla Escolha',
    icon: 'radio-button-checked',
    color: '#3b82f6',
    description: 'Questão com opções A, B, C, D'
  },
  {
    id: 'true-false',
    name: 'Verdadeiro/Falso',
    icon: 'check-circle',
    color: '#10b981',
    description: 'Questão verdadeiro ou falso'
  },
  {
    id: 'short-answer',
    name: 'Resposta Curta',
    icon: 'short-text',
    color: '#f59e0b',
    description: 'Resposta de uma linha'
  },
  {
    id: 'essay',
    name: 'Dissertativa',
    icon: 'article',
    color: '#8b5cf6',
    description: 'Resposta longa e detalhada'
  },
  {
    id: 'problem',
    name: 'Problema',
    icon: 'calculate',
    color: '#dc2626',
    description: 'Questão matemática ou lógica'
  },
];

export default function NewActivityModal({ visible, onDismiss, onSubmit, classId }: NewActivityModalProps) {
  const [formData, setFormData] = useState<ActivityData>({
    title: '',
    type: 'assignment',
    description: '',
    dueDate: '',
    dueTime: '23:59',
    maxGrade: 10,
    allowLateSubmission: false,
    enableAICorrection: true,
    requireFileUpload: false,
    instructions: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiContext, setAiContext] = useState('');
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuestionData[]>([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiAssistantContext, setAiAssistantContext] = useState('');
  const [isGeneratingActivity, setIsGeneratingActivity] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento é obrigatória';
    }
    if (formData.maxGrade < 1 || formData.maxGrade > 100) {
      newErrors.maxGrade = 'Nota máxima deve estar entre 1 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const finalData = {
        ...formData,
        aiGenerated: generatedQuestions.length > 0,
        aiContext: aiContext,
        questions: generatedQuestions,
      };
      onSubmit(finalData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: 'assignment',
      description: '',
      dueDate: '',
      dueTime: '23:59',
      maxGrade: 10,
      allowLateSubmission: false,
      enableAICorrection: true,
      requireFileUpload: false,
      instructions: '',
    });
    setErrors({});
    setAiContext('');
    setSelectedQuestionTypes([]);
    setQuestionCount(5);
    setDifficulty('medium');
    setGeneratedQuestions([]);
    setShowAIGenerator(false);
    setShowAIAssistant(false);
    setAiAssistantContext('');
    setIsGeneratingActivity(false);
    onDismiss();
  };

  const toggleSetting = (setting: keyof ActivityData) => {
    if (typeof formData[setting] === 'boolean') {
      setFormData(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    }
  };

  const toggleQuestionType = (typeId: string) => {
    setSelectedQuestionTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const generateQuestionsWithAI = async () => {
    if (!aiContext.trim()) {
      Alert.alert('Erro', 'Por favor, forneça um contexto para a IA gerar as questões.');
      return;
    }
    if (selectedQuestionTypes.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um tipo de questão.');
      return;
    }

    setIsGenerating(true);

    try {
      // Simular chamada para API de IA
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Dados mockados gerados pela IA
      const mockGeneratedQuestions: QuestionData[] = [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'Qual é a fórmula para calcular a área de um círculo?',
          options: ['A = πr²', 'A = 2πr', 'A = πd', 'A = r²'],
          correctAnswer: 'A = πr²',
          points: 2,
          difficulty: 'easy',
        },
        {
          id: '2',
          type: 'true-false',
          question: 'O número π (pi) é um número irracional.',
          correctAnswer: 'true',
          points: 1,
          difficulty: 'medium',
        },
        {
          id: '3',
          type: 'short-answer',
          question: 'Calcule o perímetro de um círculo com raio 5cm.',
          correctAnswer: '31,42 cm',
          points: 3,
          difficulty: 'medium',
        },
        {
          id: '4',
          type: 'essay',
          question: 'Explique a diferença entre circunferência e área de um círculo, e quando cada uma é utilizada.',
          points: 5,
          difficulty: 'hard',
        },
        {
          id: '5',
          type: 'problem',
          question: 'Uma pizza tem diâmetro de 30cm. Qual é a área da pizza? (Use π = 3,14)',
          correctAnswer: '706,5 cm²',
          points: 4,
          difficulty: 'medium',
        },
      ];

      setGeneratedQuestions(mockGeneratedQuestions);
      Alert.alert('Sucesso', 'Questões geradas com IA! Você pode editá-las antes de salvar.');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao gerar questões com IA. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const editQuestion = (questionId: string, field: keyof QuestionData, value: any) => {
    setGeneratedQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, [field]: value }
          : q
      )
    );
  };

  const removeQuestion = (questionId: string) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const generateActivityWithAI = async () => {
    if (!aiAssistantContext.trim()) {
      Alert.alert('Erro', 'Por favor, descreva o que você quer na atividade.');
      return;
    }

    setIsGeneratingActivity(true);

    try {
      // Simular chamada para API de IA
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock de atividades baseado no contexto
      const mockActivities = {
        assignment: {
          title: 'Lista de Exercícios - Equações do 2º Grau',
          description: 'Atividade prática sobre equações quadráticas, incluindo resolução por fatoração, completando quadrados e fórmula de Bhaskara.',
          instructions: 'Resolva todas as equações mostrando o passo a passo. Use a fórmula de Bhaskara quando necessário. Verifique suas respostas substituindo os valores encontrados na equação original.',
          maxGrade: 10,
          questions: [
            {
              id: '1',
              type: 'problem',
              question: 'Resolva a equação x² - 5x + 6 = 0',
              correctAnswer: 'x = 2 ou x = 3',
              points: 2,
              difficulty: 'easy',
            },
            {
              id: '2',
              type: 'problem',
              question: 'Determine as raízes da equação 2x² - 7x + 3 = 0 usando a fórmula de Bhaskara',
              correctAnswer: 'x = 3 ou x = 0,5',
              points: 3,
              difficulty: 'medium',
            },
            {
              id: '3',
              type: 'problem',
              question: 'Resolva a equação x² - 4x + 4 = 0',
              correctAnswer: 'x = 2 (raiz dupla)',
              points: 2,
              difficulty: 'easy',
            },
            {
              id: '4',
              type: 'essay',
              question: 'Explique a diferença entre equações do 1º e 2º grau. Dê exemplos de cada tipo.',
              points: 3,
              difficulty: 'medium',
            },
          ]
        },
        quiz: {
          title: 'Quiz - História do Brasil Colonial',
          description: 'Questionário sobre o período colonial brasileiro, desde o descobrimento até a independência.',
          instructions: 'Leia cada questão com atenção. Para questões de múltipla escolha, escolha apenas uma alternativa. Para questões verdadeiro/falso, justifique brevemente sua resposta.',
          maxGrade: 10,
          questions: [
            {
              id: '1',
              type: 'multiple-choice',
              question: 'Em que ano o Brasil foi oficialmente descoberto?',
              options: ['1492', '1500', '1501', '1499'],
              correctAnswer: '1500',
              points: 1,
              difficulty: 'easy',
            },
            {
              id: '2',
              type: 'true-false',
              question: 'O Pau-Brasil foi a primeira atividade econômica explorada pelos portugueses no Brasil.',
              correctAnswer: 'true',
              points: 1,
              difficulty: 'easy',
            },
            {
              id: '3',
              type: 'multiple-choice',
              question: 'Qual foi o primeiro sistema de governo implementado no Brasil?',
              options: ['Capitanias Hereditárias', 'Governo Geral', 'Vice-Reino', 'Monarquia'],
              correctAnswer: 'Capitanias Hereditárias',
              points: 2,
              difficulty: 'medium',
            },
            {
              id: '4',
              type: 'short-answer',
              question: 'Qual foi o principal produto de exportação do Brasil durante o período colonial?',
              correctAnswer: 'Açúcar',
              points: 2,
              difficulty: 'medium',
            },
            {
              id: '5',
              type: 'multiple-choice',
              question: 'Em que ano o Brasil se tornou independente de Portugal?',
              options: ['1815', '1822', '1825', '1831'],
              correctAnswer: '1822',
              points: 2,
              difficulty: 'easy',
            },
            {
              id: '6',
              type: 'essay',
              question: 'Descreva as principais características do sistema de capitanias hereditárias e por que ele foi implementado.',
              points: 2,
              difficulty: 'hard',
            },
          ]
        },
        project: {
          title: 'Projeto - Sustentabilidade na Escola',
          description: 'Projeto interdisciplinar sobre sustentabilidade, envolvendo ciências, geografia e matemática.',
          instructions: 'Forme grupos de 3-4 alunos. Pesquisem sobre práticas sustentáveis que podem ser implementadas na escola. Apresentem um relatório escrito e uma apresentação oral com propostas concretas.',
          maxGrade: 10,
          questions: [
            {
              id: '1',
              type: 'essay',
              question: 'Pesquise e liste 5 práticas sustentáveis que podem ser implementadas na escola. Para cada prática, explique os benefícios ambientais e econômicos.',
              points: 3,
              difficulty: 'medium',
            },
            {
              id: '2',
              type: 'essay',
              question: 'Calcule o consumo de energia elétrica da escola por mês e proponha medidas para redução de 20%. Apresente os cálculos e justifique suas propostas.',
              points: 3,
              difficulty: 'hard',
            },
            {
              id: '3',
              type: 'essay',
              question: 'Desenvolva um plano de ação para implementar coleta seletiva na escola. Inclua cronograma, responsabilidades e recursos necessários.',
              points: 4,
              difficulty: 'medium',
            },
          ]
        },
        exam: {
          title: 'Prova - Literatura Brasileira - Modernismo',
          description: 'Avaliação sobre o movimento modernista brasileiro, incluindo autores, obras e características literárias.',
          instructions: 'Leia atentamente cada questão. Para questões dissertativas, desenvolva argumentos claros e use exemplos das obras estudadas. Gerencie bem o tempo.',
          maxGrade: 10,
          questions: [
            {
              id: '1',
              type: 'multiple-choice',
              question: 'Qual evento marcou o início do Modernismo no Brasil?',
              options: ['Publicação de "Os Sertões"', 'Semana de Arte Moderna', 'Fundação da ABL', 'Independência do Brasil'],
              correctAnswer: 'Semana de Arte Moderna',
              points: 1,
              difficulty: 'easy',
            },
            {
              id: '2',
              type: 'true-false',
              question: 'Mário de Andrade foi um dos principais autores do Modernismo brasileiro.',
              correctAnswer: 'true',
              points: 1,
              difficulty: 'easy',
            },
            {
              id: '3',
              type: 'short-answer',
              question: 'Cite três características principais do Modernismo brasileiro.',
              correctAnswer: 'Ruptura com o passado, nacionalismo, liberdade formal',
              points: 2,
              difficulty: 'medium',
            },
            {
              id: '4',
              type: 'essay',
              question: 'Analise o poema "Oswald de Andrade" de Mário de Andrade, destacando elementos modernistas presentes na obra.',
              points: 3,
              difficulty: 'hard',
            },
            {
              id: '5',
              type: 'essay',
              question: 'Compare o Modernismo brasileiro com o movimento europeu, destacando as particularidades nacionais.',
              points: 3,
              difficulty: 'hard',
            },
          ]
        }
      };

      // Determinar o tipo de atividade baseado no contexto
      let activityType: ActivityData['type'] = 'assignment';
      const context = aiAssistantContext.toLowerCase();
      
      if (context.includes('quiz') || context.includes('questionário') || context.includes('múltipla escolha')) {
        activityType = 'quiz';
      } else if (context.includes('projeto') || context.includes('trabalho') || context.includes('grupo')) {
        activityType = 'project';
      } else if (context.includes('prova') || context.includes('exame') || context.includes('avaliação')) {
        activityType = 'exam';
      }

      const mockActivity = mockActivities[activityType];
      
      // Preencher o formulário com os dados gerados
      setFormData(prev => ({
        ...prev,
        type: activityType,
        title: mockActivity.title,
        description: mockActivity.description,
        instructions: mockActivity.instructions,
        maxGrade: mockActivity.maxGrade,
        aiGenerated: true,
        aiContext: aiAssistantContext,
      }));

      // Definir data de vencimento para 7 dias a partir de hoje
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      const formattedDate = dueDate.toLocaleDateString('pt-BR');

      setFormData(prev => ({
        ...prev,
        dueDate: formattedDate,
      }));

      // Definir questões geradas
      setGeneratedQuestions(mockActivity.questions as QuestionData[]);

      Alert.alert('Sucesso', 'Atividade gerada com IA! Revise os dados e faça ajustes se necessário.');
      setShowAIAssistant(false);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao gerar atividade com IA. Tente novamente.');
    } finally {
      setIsGeneratingActivity(false);
    }
  };

  const renderAIAssistant = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Assistente de IA</Text>
        <TouchableOpacity
          style={styles.aiToggle}
          onPress={() => setShowAIAssistant(!showAIAssistant)}
        >
          <MaterialIcons 
            name={showAIAssistant ? 'expand-less' : 'expand-more'} 
            size={24} 
            color="#8b5cf6" 
          />
        </TouchableOpacity>
      </View>

      {!showAIAssistant && (
        <Card style={styles.aiAssistantCard}>
          <Card.Content>
            <View style={styles.aiAssistantHeader}>
              <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
              <Text style={styles.aiAssistantTitle}>Criar Atividade com IA</Text>
            </View>
            
            <Text style={styles.aiAssistantDescription}>
              Descreva o que você quer na atividade e a IA irá gerar automaticamente título, descrição, instruções e questões.
            </Text>

            <TouchableOpacity
              style={styles.expandAIAssistantButton}
              onPress={() => setShowAIAssistant(true)}
            >
              <MaterialIcons 
                name="auto-awesome" 
                size={20} 
                color="#8b5cf6" 
              />
              <Text style={styles.expandAIAssistantText}>
                Usar Assistente de IA
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      )}

      {showAIAssistant && (
        <Card style={styles.aiAssistantCard}>
          <Card.Content>
            <View style={styles.aiAssistantHeader}>
              <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
              <Text style={styles.aiAssistantTitle}>Criar Atividade com IA</Text>
            </View>
            
            <Text style={styles.aiAssistantDescription}>
              Descreva o que você quer na atividade e a IA irá gerar automaticamente título, descrição, instruções e questões.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descreva sua atividade *</Text>
              <TextInput
                style={styles.textArea}
                value={aiAssistantContext}
                onChangeText={setAiAssistantContext}
                placeholder="Ex: Quero uma lista de exercícios sobre equações do 2º grau para alunos do 9º ano, com questões de diferentes níveis de dificuldade..."
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <View style={styles.aiExamples}>
              <Text style={styles.aiExamplesTitle}>Exemplos de prompts:</Text>
              <View style={styles.aiExampleItem}>
                <Text style={styles.aiExampleText}>• "Quiz sobre história do Brasil colonial com 5 questões"</Text>
              </View>
              <View style={styles.aiExampleItem}>
                <Text style={styles.aiExampleText}>• "Projeto sobre sustentabilidade para trabalho em grupo"</Text>
              </View>
              <View style={styles.aiExampleItem}>
                <Text style={styles.aiExampleText}>• "Prova sobre literatura brasileira do modernismo"</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.generateActivityButton, isGeneratingActivity && styles.generateActivityButtonDisabled]}
              onPress={generateActivityWithAI}
              disabled={isGeneratingActivity}
            >
              <MaterialIcons 
                name="auto-awesome" 
                size={20} 
                color="white" 
              />
              <Text style={styles.generateActivityButtonText}>
                {isGeneratingActivity ? 'Gerando Atividade...' : 'Gerar Atividade Completa'}
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  const renderAIGenerator = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gerador de Questões com IA</Text>
        <TouchableOpacity
          style={styles.aiToggle}
          onPress={() => setShowAIGenerator(!showAIGenerator)}
        >
          <MaterialIcons 
            name={showAIGenerator ? 'expand-less' : 'expand-more'} 
            size={24} 
            color="#3b82f6" 
          />
        </TouchableOpacity>
      </View>

      {showAIGenerator && (
        <Card style={styles.aiCard}>
          <Card.Content>
            <Text style={styles.aiInstructions}>
              Descreva o conteúdo, tópicos ou contexto para que a IA gere questões personalizadas.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contexto para IA *</Text>
              <TextInput
                style={styles.textArea}
                value={aiContext}
                onChangeText={setAiContext}
                placeholder="Ex: Equações do 2º grau, fórmula de Bhaskara, problemas de aplicação..."
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipos de Questão</Text>
              <View style={styles.questionTypesGrid}>
                {questionTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.questionTypeCard,
                      selectedQuestionTypes.includes(type.id) && styles.questionTypeCardActive
                    ]}
                    onPress={() => toggleQuestionType(type.id)}
                  >
                    <MaterialIcons 
                      name={type.icon as any} 
                      size={20} 
                      color={selectedQuestionTypes.includes(type.id) ? 'white' : type.color} 
                    />
                    <Text style={[
                      styles.questionTypeName,
                      selectedQuestionTypes.includes(type.id) && styles.questionTypeNameActive
                    ]}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Número de Questões</Text>
                <TextInput
                  style={styles.textInput}
                  value={questionCount.toString()}
                  onChangeText={(text) => setQuestionCount(parseInt(text) || 5)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Dificuldade</Text>
                <View style={styles.difficultySelector}>
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.difficultyButton,
                        difficulty === level && styles.difficultyButtonActive
                      ]}
                      onPress={() => setDifficulty(level)}
                    >
                      <Text style={[
                        styles.difficultyText,
                        difficulty === level && styles.difficultyTextActive
                      ]}>
                        {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Médio' : 'Difícil'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
              onPress={generateQuestionsWithAI}
              disabled={isGenerating}
            >
              <MaterialIcons 
                name="psychology" 
                size={20} 
                color="white" 
              />
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Gerando...' : 'Gerar Questões com IA'}
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  const renderGeneratedQuestions = () => {
    if (generatedQuestions.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Questões Geradas ({generatedQuestions.length})</Text>
        <Text style={styles.sectionSubtitle}>
          Edite as questões conforme necessário antes de salvar a atividade.
        </Text>

        {generatedQuestions.map((question, index) => (
          <Card key={question.id} style={styles.questionCard}>
            <Card.Content>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Questão {index + 1}</Text>
                <TouchableOpacity
                  onPress={() => removeQuestion(question.id)}
                  style={styles.removeQuestionButton}
                >
                  <MaterialIcons name="delete" size={20} color="#dc2626" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Questão</Text>
                <TextInput
                  style={styles.textArea}
                  value={question.question}
                  onChangeText={(text) => editQuestion(question.id, 'question', text)}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {question.type === 'multiple-choice' && question.options && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Opções</Text>
                  {question.options.map((option, optionIndex) => (
                    <TextInput
                      key={optionIndex}
                      style={styles.textInput}
                      value={option}
                      onChangeText={(text) => {
                        const newOptions = [...question.options!];
                        newOptions[optionIndex] = text;
                        editQuestion(question.id, 'options', newOptions);
                      }}
                      placeholder={`Opção ${String.fromCharCode(65 + optionIndex)}`}
                    />
                  ))}
                  <TextInput
                    style={styles.textInput}
                    value={question.correctAnswer || ''}
                    onChangeText={(text) => editQuestion(question.id, 'correctAnswer', text)}
                    placeholder="Resposta correta"
                  />
                </View>
              )}

              {question.type === 'true-false' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Resposta Correta</Text>
                  <View style={styles.trueFalseSelector}>
                    {(['true', 'false'] as const).map((value) => (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.trueFalseButton,
                          question.correctAnswer === value && styles.trueFalseButtonActive
                        ]}
                        onPress={() => editQuestion(question.id, 'correctAnswer', value)}
                      >
                        <Text style={[
                          styles.trueFalseText,
                          question.correctAnswer === value && styles.trueFalseTextActive
                        ]}>
                          {value === 'true' ? 'Verdadeiro' : 'Falso'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {(question.type === 'short-answer' || question.type === 'problem') && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Resposta Esperada</Text>
                  <TextInput
                    style={styles.textInput}
                    value={question.correctAnswer || ''}
                    onChangeText={(text) => editQuestion(question.id, 'correctAnswer', text)}
                    placeholder="Resposta esperada"
                  />
                </View>
              )}

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Pontos</Text>
                  <TextInput
                    style={styles.textInput}
                    value={question.points.toString()}
                    onChangeText={(text) => editQuestion(question.id, 'points', parseInt(text) || 1)}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Dificuldade</Text>
                  <View style={styles.difficultySelector}>
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.difficultyButton,
                          question.difficulty === level && styles.difficultyButtonActive
                        ]}
                        onPress={() => editQuestion(question.id, 'difficulty', level)}
                      >
                        <Text style={[
                          styles.difficultyText,
                          question.difficulty === level && styles.difficultyTextActive
                        ]}>
                          {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Médio' : 'Difícil'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  };

  const renderActivityTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tipo de Atividade</Text>
      <View style={styles.typeGrid}>
        {activityTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeCard,
              formData.type === type.id && styles.typeCardActive
            ]}
            onPress={() => setFormData(prev => ({ ...prev, type: type.id as ActivityData['type'] }))}
          >
            <View style={[
              styles.typeIcon,
              { backgroundColor: type.color + '20' }
            ]}>
              <MaterialIcons name={type.icon as any} size={24} color={type.color} />
            </View>
            <Text style={[
              styles.typeName,
              formData.type === type.id && styles.typeNameActive
            ]}>
              {type.name}
            </Text>
            <Text style={styles.typeDescription}>
              {type.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informações Básicas</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Título da Atividade *</Text>
        <TextInput
          style={[styles.textInput, errors.title && styles.inputError]}
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
          placeholder="Ex: Lista de Exercícios - Equações do 2º Grau"
          maxLength={100}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Descrição *</Text>
        <TextInput
          style={[styles.textArea, errors.description && styles.inputError]}
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Descreva a atividade, objetivos, critérios de avaliação..."
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Data de Vencimento *</Text>
          <TextInput
            style={[styles.textInput, errors.dueDate && styles.inputError]}
            value={formData.dueDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, dueDate: text }))}
            placeholder="DD/MM/AAAA"
            maxLength={10}
          />
          {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate}</Text>}
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Horário</Text>
          <TextInput
            style={styles.textInput}
            value={formData.dueTime}
            onChangeText={(text) => setFormData(prev => ({ ...prev, dueTime: text }))}
            placeholder="HH:MM"
            maxLength={5}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nota Máxima</Text>
        <TextInput
          style={[styles.textInput, errors.maxGrade && styles.inputError]}
          value={formData.maxGrade.toString()}
          onChangeText={(text) => {
            const value = parseInt(text) || 0;
            if (value >= 0) {
              setFormData(prev => ({ ...prev, maxGrade: value }));
            }
          }}
          placeholder="10"
          keyboardType="numeric"
          maxLength={3}
        />
        {errors.maxGrade && <Text style={styles.errorText}>{errors.maxGrade}</Text>}
      </View>
    </View>
  );

  const renderInstructions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Instruções para os Estudantes</Text>
      
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.textArea}
          value={formData.instructions}
          onChangeText={(text) => setFormData(prev => ({ ...prev, instructions: text }))}
          placeholder="Digite as instruções específicas para os estudantes..."
          multiline
          numberOfLines={6}
          maxLength={1000}
        />
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Configurações</Text>
      
      <Card style={styles.settingsCard}>
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="schedule" size={24} color="#f59e0b" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Permitir Entrega Tardia</Text>
                <Text style={styles.settingDescription}>
                  Estudantes podem entregar após o prazo (com penalidade)
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                formData.allowLateSubmission && styles.toggleActive
              ]}
              onPress={() => toggleSetting('allowLateSubmission')}
            >
              <View style={[
                styles.toggleThumb,
                formData.allowLateSubmission && styles.toggleThumbActive
              ]} />
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Correção Automática com IA</Text>
                <Text style={styles.settingDescription}>
                  Usar IA para corrigir automaticamente as respostas
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                formData.enableAICorrection && styles.toggleActive
              ]}
              onPress={() => toggleSetting('enableAICorrection')}
            >
              <View style={[
                styles.toggleThumb,
                formData.enableAICorrection && styles.toggleThumbActive
              ]} />
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="cloud-upload" size={24} color="#3b82f6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Obrigar Upload de Arquivo</Text>
                <Text style={styles.settingDescription}>
                  Estudantes devem enviar um arquivo como resposta
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                formData.requireFileUpload && styles.toggleActive
              ]}
              onPress={() => toggleSetting('requireFileUpload')}
            >
              <View style={[
                styles.toggleThumb,
                formData.requireFileUpload && styles.toggleThumbActive
              ]} />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Nova Atividade</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderAIAssistant()}
          {renderActivityTypeSelector()}
          {renderBasicInfo()}
          {renderAIGenerator()}
          {renderGeneratedQuestions()}
          {renderInstructions()}
          {renderSettings()}
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            mode="outlined"
            onPress={handleClose}
            style={styles.footerButton}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.footerButton, styles.primaryButton]}
          >
            Criar Atividade
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
    width: width - 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  aiToggle: {
    padding: 4,
  },
  aiCard: {
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  aiInstructions: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 20,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: (width - 80) / 2,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    alignItems: 'center',
  },
  typeCardActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  typeNameActive: {
    color: '#3b82f6',
  },
  typeDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  questionTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  questionTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    gap: 6,
  },
  questionTypeCardActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  questionTypeName: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  questionTypeNameActive: {
    color: 'white',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  questionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  removeQuestionButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
    height: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  difficultyText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  difficultyTextActive: {
    color: 'white',
  },
  trueFalseSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  trueFalseButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    alignItems: 'center',
  },
  trueFalseButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  trueFalseText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  trueFalseTextActive: {
    color: 'white',
  },
  settingsCard: {
    borderRadius: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#3b82f6',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  divider: {
    marginVertical: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  aiAssistantCard: {
    borderRadius: 12,
    backgroundColor: '#f8f7ff',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  aiAssistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  aiAssistantTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  aiAssistantDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 20,
  },
  aiExamples: {
    marginTop: 16,
    marginBottom: 16,
  },
  aiExamplesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  aiExampleItem: {
    marginBottom: 4,
  },
  aiExampleText: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  generateActivityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  generateActivityButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  generateActivityButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  expandAIAssistantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  expandAIAssistantText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
  },
}); 