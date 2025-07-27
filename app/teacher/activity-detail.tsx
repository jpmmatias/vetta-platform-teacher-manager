import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Card, Chip, Button, Divider, ProgressBar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface ActivityDetail {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  description: string;
  class: string;
  dueDate: string;
  dueTime: string;
  status: 'draft' | 'published' | 'active' | 'closed';
  maxGrade: number;
  instructions: string;
  createdAt: string;
  aiGenerated?: boolean;
  aiContext?: string;
  allowLateSubmission: boolean;
  enableAICorrection: boolean;
  requireFileUpload: boolean;
  questions?: Question[];
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'problem';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  status: 'submitted' | 'late' | 'not-submitted';
  grade?: number;
  feedback?: string;
  files?: string[];
  answers?: Answer[];
}

interface Answer {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  points?: number;
}

const mockActivityDetail: ActivityDetail = {
  id: '1',
  title: 'Lista de Exercícios - Equações do 2º Grau',
  type: 'assignment',
  description: 'Atividade prática sobre equações quadráticas, incluindo resolução por fatoração, completando quadrados e fórmula de Bhaskara.',
  class: 'Matemática 9º Ano A',
  dueDate: '15/12/2024',
  dueTime: '23:59',
  status: 'active',
  maxGrade: 10,
  instructions: 'Resolva todas as equações mostrando o passo a passo. Use a fórmula de Bhaskara quando necessário. Verifique suas respostas substituindo os valores encontrados na equação original.',
  createdAt: '10/12/2024',
  aiGenerated: true,
  aiContext: 'Quero uma lista de exercícios sobre equações do 2º grau para alunos do 9º ano, com questões de diferentes níveis de dificuldade',
  allowLateSubmission: true,
  enableAICorrection: true,
  requireFileUpload: false,
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
  ],
};

const mockSubmissions: Submission[] = [
  {
    id: '1',
    studentName: 'Ana Silva',
    studentId: '2024001',
    submittedAt: '14/12/2024 23:45',
    status: 'submitted',
    grade: 8.5,
    feedback: 'Bom trabalho! Alguns erros de cálculo.',
    files: ['ana_silva_exercicios.pdf'],
    answers: [
      { questionId: '1', answer: 'x = 2 ou x = 3', isCorrect: true, points: 2 },
      { questionId: '2', answer: 'x = 3 ou x = 0,5', isCorrect: true, points: 3 },
      { questionId: '3', answer: 'x = 2', isCorrect: true, points: 2 },
      { questionId: '4', answer: 'Equações do 1º grau têm uma incógnita elevada ao expoente 1...', isCorrect: true, points: 1.5 },
    ],
  },
  {
    id: '2',
    studentName: 'Carlos Santos',
    studentId: '2024002',
    submittedAt: '16/12/2024 10:30',
    status: 'late',
    grade: 6.0,
    feedback: 'Entrega tardia. Respostas corretas mas sem desenvolvimento.',
    files: ['carlos_santos_exercicios.pdf'],
    answers: [
      { questionId: '1', answer: 'x = 2 ou x = 3', isCorrect: true, points: 2 },
      { questionId: '2', answer: 'x = 3 ou x = 0,5', isCorrect: true, points: 3 },
      { questionId: '3', answer: 'x = 2', isCorrect: true, points: 2 },
      { questionId: '4', answer: 'Não respondido', isCorrect: false, points: 0 },
    ],
  },
  {
    id: '3',
    studentName: 'Maria Oliveira',
    studentId: '2024003',
    submittedAt: '15/12/2024 22:15',
    status: 'submitted',
    grade: 9.0,
    feedback: 'Excelente trabalho! Demonstrou domínio do conteúdo.',
    files: ['maria_oliveira_exercicios.pdf'],
    answers: [
      { questionId: '1', answer: 'x = 2 ou x = 3', isCorrect: true, points: 2 },
      { questionId: '2', answer: 'x = 3 ou x = 0,5', isCorrect: true, points: 3 },
      { questionId: '3', answer: 'x = 2 (raiz dupla)', isCorrect: true, points: 2 },
      { questionId: '4', answer: 'Equações do 1º grau têm forma ax + b = 0...', isCorrect: true, points: 3 },
    ],
  },
  {
    id: '4',
    studentName: 'João Pereira',
    studentId: '2024004',
    submittedAt: '',
    status: 'not-submitted',
  },
];

export default function ActivityDetail() {
  const params = useLocalSearchParams();
  const activityId = params.id as string;
  
  const [selectedTab, setSelectedTab] = useState<'overview' | 'submissions' | 'questions'>('overview');
  const [activity] = useState<ActivityDetail>(mockActivityDetail);
  const [submissions] = useState<Submission[]>(mockSubmissions);

  const getTypeIcon = (type: ActivityDetail['type']) => {
    switch (type) {
      case 'assignment': return 'assignment';
      case 'quiz': return 'quiz';
      case 'project': return 'group-work';
      case 'exam': return 'school';
      default: return 'assignment';
    }
  };

  const getTypeColor = (type: ActivityDetail['type']) => {
    switch (type) {
      case 'assignment': return '#3b82f6';
      case 'quiz': return '#10b981';
      case 'project': return '#f59e0b';
      case 'exam': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getTypeText = (type: ActivityDetail['type']) => {
    switch (type) {
      case 'assignment': return 'Lista';
      case 'quiz': return 'Quiz';
      case 'project': return 'Projeto';
      case 'exam': return 'Prova';
      default: return 'Atividade';
    }
  };

  const getStatusColor = (status: ActivityDetail['status']) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'published': return '#3b82f6';
      case 'active': return '#10b981';
      case 'closed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: ActivityDetail['status']) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'published': return 'Publicada';
      case 'active': return 'Ativa';
      case 'closed': return 'Encerrada';
      default: return 'Desconhecido';
    }
  };

  const getSubmissionStatusColor = (status: Submission['status']) => {
    switch (status) {
      case 'submitted': return '#10b981';
      case 'late': return '#f59e0b';
      case 'not-submitted': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getSubmissionStatusText = (status: Submission['status']) => {
    switch (status) {
      case 'submitted': return 'Entregue';
      case 'late': return 'Tardia';
      case 'not-submitted': return 'Não Entregue';
      default: return 'Desconhecido';
    }
  };

  const handleEditActivity = () => {
    Alert.alert('Editar Atividade', 'Abrir editor de atividade');
  };

  const handleDuplicateActivity = () => {
    Alert.alert('Duplicar Atividade', 'Criar cópia da atividade');
  };

  const handleDeleteActivity = () => {
    Alert.alert(
      'Excluir Atividade',
      'Tem certeza que deseja excluir esta atividade?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const handleViewSubmission = (submission: Submission) => {
    router.push(`/teacher/submission-detail?id=${submission.id}`);
  };

  const handleCorrectSubmission = (submission: Submission) => {
    Alert.alert('Corrigir', `Corrigir submissão de ${submission.studentName}`);
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.activityHeader}>
            <View style={styles.activityTypeContainer}>
              <MaterialIcons 
                name={getTypeIcon(activity.type)} 
                size={24} 
                color={getTypeColor(activity.type)} 
              />
              <Text style={[styles.activityType, { color: getTypeColor(activity.type) }]}>
                {getTypeText(activity.type)}
              </Text>
              {activity.aiGenerated && (
                <MaterialIcons name="psychology" size={20} color="#8b5cf6" style={styles.aiIcon} />
              )}
            </View>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(activity.status) + '20' }]}
              textStyle={{ color: getStatusColor(activity.status) }}
            >
              {getStatusText(activity.status)}
            </Chip>
          </View>

          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityClass}>{activity.class}</Text>
          
          <Text style={styles.activityDescription}>{activity.description}</Text>

          <View style={styles.activityDetails}>
            <View style={styles.detailItem}>
              <MaterialIcons name="schedule" size={16} color="#6b7280" />
              <Text style={styles.detailText}>
                Vencimento: {activity.dueDate} às {activity.dueTime}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="grade" size={16} color="#6b7280" />
              <Text style={styles.detailText}>Nota máxima: {activity.maxGrade} pontos</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="calendar-today" size={16} color="#6b7280" />
              <Text style={styles.detailText}>Criada em: {activity.createdAt}</Text>
            </View>
          </View>

          {activity.instructions && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Instruções:</Text>
              <Text style={styles.instructionsText}>{activity.instructions}</Text>
            </View>
          )}

          <View style={styles.settingsContainer}>
            <Text style={styles.settingsTitle}>Configurações:</Text>
            <View style={styles.settingItem}>
              <MaterialIcons name="schedule" size={16} color="#f59e0b" />
              <Text style={styles.settingText}>
                {activity.allowLateSubmission ? 'Permite entrega tardia' : 'Não permite entrega tardia'}
              </Text>
            </View>
            <View style={styles.settingItem}>
              <MaterialIcons name="psychology" size={16} color="#8b5cf6" />
              <Text style={styles.settingText}>
                {activity.enableAICorrection ? 'Correção automática com IA' : 'Correção manual'}
              </Text>
            </View>
            <View style={styles.settingItem}>
              <MaterialIcons name="cloud-upload" size={16} color="#3b82f6" />
              <Text style={styles.settingText}>
                {activity.requireFileUpload ? 'Upload de arquivo obrigatório' : 'Upload de arquivo opcional'}
              </Text>
            </View>
          </View>

          {activity.aiGenerated && activity.aiContext && (
            <View style={styles.aiContextContainer}>
              <Text style={styles.aiContextTitle}>Contexto da IA:</Text>
              <Text style={styles.aiContextText}>{activity.aiContext}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );

  const renderSubmissions = () => (
    <View style={styles.tabContent}>
      <View style={styles.submissionsStats}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{submissions.length}</Text>
            <Text style={styles.statLabel}>Total de Alunos</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>
              {submissions.filter(s => s.status === 'submitted' || s.status === 'late').length}
            </Text>
            <Text style={styles.statLabel}>Entregas</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>
              {submissions.filter(s => s.grade !== undefined).length}
            </Text>
            <Text style={styles.statLabel}>Corrigidas</Text>
          </Card.Content>
        </Card>
      </View>

      <ScrollView style={styles.submissionsList}>
        {submissions.map((submission) => (
          <Card key={submission.id} style={styles.submissionCard}>
            <Card.Content>
              <View style={styles.submissionHeader}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{submission.studentName}</Text>
                  <Text style={styles.studentId}>{submission.studentId}</Text>
                </View>
                <Chip 
                  style={[
                    styles.submissionStatusChip, 
                    { backgroundColor: getSubmissionStatusColor(submission.status) + '20' }
                  ]}
                  textStyle={{ color: getSubmissionStatusColor(submission.status) }}
                >
                  {getSubmissionStatusText(submission.status)}
                </Chip>
              </View>

              {submission.submittedAt && (
                <View style={styles.submissionDetails}>
                  <MaterialIcons name="schedule" size={16} color="#6b7280" />
                  <Text style={styles.submissionTime}>{submission.submittedAt}</Text>
                </View>
              )}

              {submission.grade !== undefined && (
                <View style={styles.gradeContainer}>
                  <Text style={styles.gradeLabel}>Nota:</Text>
                  <Text style={styles.gradeValue}>{submission.grade}/{activity.maxGrade}</Text>
                </View>
              )}

              {submission.feedback && (
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackLabel}>Feedback:</Text>
                  <Text style={styles.feedbackText}>{submission.feedback}</Text>
                </View>
              )}

              {submission.files && submission.files.length > 0 && (
                <View style={styles.filesContainer}>
                  <Text style={styles.filesLabel}>Arquivos:</Text>
                  {submission.files.map((file, index) => (
                    <View key={index} style={styles.fileItem}>
                      <MaterialIcons name="description" size={16} color="#3b82f6" />
                      <Text style={styles.fileName}>{file}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.submissionActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => handleViewSubmission(submission)}
                  style={styles.viewButton}
                >
                  Visualizar
                </Button>
                {submission.status !== 'not-submitted' && (
                  <Button 
                    mode="contained" 
                    onPress={() => handleCorrectSubmission(submission)}
                    style={styles.correctButton}
                  >
                    Corrigir
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );

  const renderQuestions = () => (
    <View style={styles.tabContent}>
      <ScrollView style={styles.questionsList}>
        {activity.questions?.map((question, index) => (
          <Card key={question.id} style={styles.questionCard}>
            <Card.Content>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Questão {index + 1}</Text>
                <View style={styles.questionMeta}>
                  <Chip style={styles.questionTypeChip}>
                    {question.type === 'multiple-choice' ? 'Múltipla Escolha' :
                     question.type === 'true-false' ? 'Verdadeiro/Falso' :
                     question.type === 'short-answer' ? 'Resposta Curta' :
                     question.type === 'essay' ? 'Dissertativa' : 'Problema'}
                  </Chip>
                  <Chip style={styles.questionPointsChip}>
                    {question.points} pts
                  </Chip>
                </View>
              </View>

              <Text style={styles.questionText}>{question.question}</Text>

              {question.options && (
                <View style={styles.optionsContainer}>
                  {question.options.map((option, optionIndex) => (
                    <View key={optionIndex} style={styles.optionItem}>
                      <Text style={styles.optionLetter}>
                        {String.fromCharCode(65 + optionIndex)})
                      </Text>
                      <Text style={styles.optionText}>{option}</Text>
                    </View>
                  ))}
                </View>
              )}

              {question.correctAnswer && (
                <View style={styles.correctAnswerContainer}>
                  <Text style={styles.correctAnswerLabel}>Resposta correta:</Text>
                  <Text style={styles.correctAnswerText}>{question.correctAnswer}</Text>
                </View>
              )}

              <View style={styles.questionFooter}>
                <Chip style={styles.difficultyChip}>
                  {question.difficulty === 'easy' ? 'Fácil' :
                   question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#3b82f6" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEditActivity} style={styles.headerAction}>
            <MaterialIcons name="edit" size={20} color="#f59e0b" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDuplicateActivity} style={styles.headerAction}>
            <MaterialIcons name="content-copy" size={20} color="#10b981" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteActivity} style={styles.headerAction}>
            <MaterialIcons name="delete" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'overview' && styles.tabActive]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.tabTextActive]}>
            Visão Geral
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'submissions' && styles.tabActive]}
          onPress={() => setSelectedTab('submissions')}
        >
          <Text style={[styles.tabText, selectedTab === 'submissions' && styles.tabTextActive]}>
            Submissões ({submissions.filter(s => s.status !== 'not-submitted').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'questions' && styles.tabActive]}
          onPress={() => setSelectedTab('questions')}
        >
          <Text style={[styles.tabText, selectedTab === 'questions' && styles.tabTextActive]}>
            Questões ({activity.questions?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'overview' && renderOverview()}
      {selectedTab === 'submissions' && renderSubmissions()}
      {selectedTab === 'questions' && renderQuestions()}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerAction: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  tabActive: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#3b82f6',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityType: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  aiIcon: {
    marginLeft: 8,
  },
  statusChip: {
    marginBottom: 0,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  activityClass: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  activityDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  activityDetails: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  settingsContainer: {
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  settingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  aiContextContainer: {
    backgroundColor: '#f8f7ff',
    borderRadius: 8,
    padding: 12,
  },
  aiContextTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  aiContextText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  submissionsStats: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  submissionsList: {
    flex: 1,
  },
  submissionCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: '#6b7280',
  },
  submissionStatusChip: {
    marginBottom: 0,
  },
  submissionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  submissionTime: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gradeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
  },
  gradeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  feedbackContainer: {
    marginBottom: 12,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  filesContainer: {
    marginBottom: 12,
  },
  filesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fileName: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 6,
  },
  submissionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewButton: {
    flex: 1,
    borderColor: '#3b82f6',
  },
  correctButton: {
    flex: 1,
    backgroundColor: '#10b981',
  },
  questionsList: {
    flex: 1,
  },
  questionCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  questionMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  questionTypeChip: {
    backgroundColor: '#f3f4f6',
  },
  questionPointsChip: {
    backgroundColor: '#3b82f6',
  },
  questionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 8,
    marginTop: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  correctAnswerContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  correctAnswerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 2,
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#374151',
  },
  questionFooter: {
    alignItems: 'flex-end',
  },
  difficultyChip: {
    backgroundColor: '#fef3c7',
  },
}); 