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
import { Card, Chip, Button, Divider, TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface SubmissionDetail {
  id: string;
  studentName: string;
  studentId: string;
  activityTitle: string;
  activityType: string;
  submittedAt: string;
  status: 'submitted' | 'late' | 'not-submitted';
  grade?: number;
  maxGrade: number;
  feedback?: string;
  files?: string[];
  answers: Answer[];
  totalPoints: number;
  earnedPoints: number;
}

interface Answer {
  questionId: string;
  question: string;
  questionType: string;
  questionPoints: number;
  answer: string;
  isCorrect?: boolean;
  points?: number;
  feedback?: string;
}

const mockSubmissionDetail: SubmissionDetail = {
  id: '1',
  studentName: 'Ana Silva',
  studentId: '2024001',
  activityTitle: 'Lista de Exercícios - Equações do 2º Grau',
  activityType: 'assignment',
  submittedAt: '14/12/2024 23:45',
  status: 'submitted',
  grade: 8.5,
  maxGrade: 10,
  feedback: 'Bom trabalho! Alguns erros de cálculo. Preste atenção aos sinais nas equações.',
  files: ['ana_silva_exercicios.pdf'],
  totalPoints: 10,
  earnedPoints: 8.5,
  answers: [
    {
      questionId: '1',
      question: 'Resolva a equação x² - 5x + 6 = 0',
      questionType: 'problem',
      questionPoints: 2,
      answer: 'x = 2 ou x = 3',
      isCorrect: true,
      points: 2,
      feedback: 'Correto!',
    },
    {
      questionId: '2',
      question: 'Determine as raízes da equação 2x² - 7x + 3 = 0 usando a fórmula de Bhaskara',
      questionType: 'problem',
      questionPoints: 3,
      answer: 'x = 3 ou x = 0,5',
      isCorrect: true,
      points: 3,
      feedback: 'Correto!',
    },
    {
      questionId: '3',
      question: 'Resolva a equação x² - 4x + 4 = 0',
      questionType: 'problem',
      questionPoints: 2,
      answer: 'x = 2',
      isCorrect: true,
      points: 2,
      feedback: 'Correto!',
    },
    {
      questionId: '4',
      question: 'Explique a diferença entre equações do 1º e 2º grau. Dê exemplos de cada tipo.',
      questionType: 'essay',
      questionPoints: 3,
      answer: 'Equações do 1º grau têm uma incógnita elevada ao expoente 1, como 2x + 3 = 7. Equações do 2º grau têm uma incógnita elevada ao expoente 2, como x² - 5x + 6 = 0.',
      isCorrect: true,
      points: 1.5,
      feedback: 'Boa explicação, mas poderia ter dado mais exemplos.',
    },
  ],
};

export default function SubmissionDetail() {
  const params = useLocalSearchParams();
  const submissionId = params.id as string;
  
  const [submission] = useState<SubmissionDetail>(mockSubmissionDetail);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGrade, setEditedGrade] = useState(submission.grade?.toString() || '');
  const [editedFeedback, setEditedFeedback] = useState(submission.feedback || '');

  const getStatusColor = (status: SubmissionDetail['status']) => {
    switch (status) {
      case 'submitted': return '#10b981';
      case 'late': return '#f59e0b';
      case 'not-submitted': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: SubmissionDetail['status']) => {
    switch (status) {
      case 'submitted': return 'Entregue';
      case 'late': return 'Tardia';
      case 'not-submitted': return 'Não Entregue';
      default: return 'Desconhecido';
    }
  };

  const getQuestionTypeText = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'Múltipla Escolha';
      case 'true-false': return 'Verdadeiro/Falso';
      case 'short-answer': return 'Resposta Curta';
      case 'essay': return 'Dissertativa';
      case 'problem': return 'Problema';
      default: return 'Questão';
    }
  };

  const handleSaveCorrection = () => {
    const newGrade = parseFloat(editedGrade);
    if (isNaN(newGrade) || newGrade < 0 || newGrade > submission.maxGrade) {
      Alert.alert('Erro', 'Nota inválida. Digite um valor entre 0 e ' + submission.maxGrade);
      return;
    }

    Alert.alert(
      'Salvar Correção',
      'Tem certeza que deseja salvar as alterações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salvar', 
          onPress: () => {
            setIsEditing(false);
            Alert.alert('Sucesso', 'Correção salva com sucesso!');
          }
        },
      ]
    );
  };

  const handleAICorrection = () => {
    Alert.alert(
      'Correção com IA',
      'Deseja usar a IA para corrigir automaticamente esta submissão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Corrigir com IA', onPress: () => {
          Alert.alert('Processando', 'IA está corrigindo a submissão...');
        }},
      ]
    );
  };

  const renderStudentInfo = () => (
    <Card style={styles.infoCard}>
      <Card.Content>
        <View style={styles.studentHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{submission.studentName}</Text>
            <Text style={styles.studentId}>{submission.studentId}</Text>
          </View>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(submission.status) + '20' }]}
            textStyle={{ color: getStatusColor(submission.status) }}
          >
            {getStatusText(submission.status)}
          </Chip>
        </View>

        <Text style={styles.activityTitle}>{submission.activityTitle}</Text>
        
        <View style={styles.submissionDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="schedule" size={16} color="#6b7280" />
            <Text style={styles.detailText}>Entregue em: {submission.submittedAt}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="grade" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              Nota: {submission.grade || 'Não corrigida'}/{submission.maxGrade}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="trending-up" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              Pontos: {submission.earnedPoints}/{submission.totalPoints}
            </Text>
          </View>
        </View>

        {submission.files && submission.files.length > 0 && (
          <View style={styles.filesContainer}>
            <Text style={styles.filesLabel}>Arquivos anexados:</Text>
            {submission.files.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <MaterialIcons name="description" size={16} color="#3b82f6" />
                <Text style={styles.fileName}>{file}</Text>
                <TouchableOpacity style={styles.downloadButton}>
                  <MaterialIcons name="download" size={16} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderGradeSection = () => (
    <Card style={styles.gradeCard}>
      <Card.Content>
        <View style={styles.gradeHeader}>
          <Text style={styles.gradeTitle}>Correção</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <MaterialIcons name="edit" size={20} color="#f59e0b" />
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <View style={styles.editingSection}>
            <View style={styles.gradeInputContainer}>
              <Text style={styles.gradeLabel}>Nota:</Text>
              <TextInput
                style={styles.gradeInput}
                value={editedGrade}
                onChangeText={setEditedGrade}
                keyboardType="numeric"
                placeholder={`0-${submission.maxGrade}`}
              />
              <Text style={styles.maxGradeText}>/ {submission.maxGrade}</Text>
            </View>
            
            <View style={styles.feedbackInputContainer}>
              <Text style={styles.feedbackLabel}>Feedback:</Text>
              <TextInput
                style={styles.feedbackInput}
                value={editedFeedback}
                onChangeText={setEditedFeedback}
                multiline
                numberOfLines={4}
                placeholder="Digite seu feedback..."
              />
            </View>

            <View style={styles.editingActions}>
              <Button 
                mode="outlined" 
                onPress={() => setIsEditing(false)}
                style={styles.cancelButton}
              >
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                onPress={handleSaveCorrection}
                style={styles.saveButton}
              >
                Salvar
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.gradeDisplay}>
            <View style={styles.gradeInfo}>
              <Text style={styles.gradeValue}>
                {submission.grade || 'Não corrigida'}/{submission.maxGrade}
              </Text>
              {submission.grade && (
                <Text style={styles.gradePercentage}>
                  {Math.round((submission.grade / submission.maxGrade) * 100)}%
                </Text>
              )}
            </View>
            
                         {submission.feedback && (
               <View style={styles.gradeFeedbackContainer}>
                 <Text style={styles.gradeFeedbackLabel}>Feedback:</Text>
                 <Text style={styles.gradeFeedbackText}>{submission.feedback}</Text>
               </View>
             )}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderAnswer = (answer: Answer, index: number) => (
    <Card key={answer.questionId} style={styles.answerCard}>
      <Card.Content>
        <View style={styles.answerHeader}>
          <Text style={styles.questionNumber}>Questão {index + 1}</Text>
          <View style={styles.questionMeta}>
            <Chip style={styles.questionTypeChip}>
              {getQuestionTypeText(answer.questionType)}
            </Chip>
            <Chip style={styles.questionPointsChip}>
              {answer.questionPoints} pts
            </Chip>
          </View>
        </View>

        <Text style={styles.questionText}>{answer.question}</Text>
        
        <View style={styles.answerSection}>
          <Text style={styles.answerLabel}>Resposta do aluno:</Text>
          <Text style={styles.answerText}>{answer.answer}</Text>
        </View>

        {answer.points !== undefined && (
          <View style={styles.correctionSection}>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsLabel}>Pontos:</Text>
              <Text style={styles.pointsValue}>
                {answer.points}/{answer.questionPoints}
              </Text>
            </View>
            
            {answer.feedback && (
              <View style={styles.answerFeedbackContainer}>
                <Text style={styles.answerFeedbackLabel}>Feedback:</Text>
                <Text style={styles.answerFeedbackText}>{answer.feedback}</Text>
              </View>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#3b82f6" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleAICorrection} style={styles.headerAction}>
            <MaterialIcons name="psychology" size={20} color="#8b5cf6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.headerAction}>
            <MaterialIcons name="edit" size={20} color="#f59e0b" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {renderStudentInfo()}
        {renderGradeSection()}

        <View style={styles.answersSection}>
          <Text style={styles.sectionTitle}>Respostas do Aluno</Text>
          {submission.answers.map((answer, index) => renderAnswer(answer, index))}
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusChip: {
    marginBottom: 0,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  submissionDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  filesContainer: {
    marginTop: 12,
  },
  filesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fileName: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 6,
    flex: 1,
  },
  downloadButton: {
    padding: 4,
  },
  gradeCard: {
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  editingSection: {
    gap: 16,
  },
  gradeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  gradeInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  maxGradeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  feedbackInputContainer: {
    gap: 8,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  feedbackInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#6b7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10b981',
  },
  gradeDisplay: {
    gap: 12,
  },
  gradeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3b82f6',
  },
  gradePercentage: {
    fontSize: 14,
    color: '#6b7280',
  },
  gradeFeedbackContainer: {
    gap: 4,
  },
  gradeFeedbackLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  gradeFeedbackText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  answersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  answerCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  answerHeader: {
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
  answerSection: {
    marginBottom: 12,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  answerText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  correctionSection: {
    gap: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  pointsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  answerFeedbackContainer: {
    gap: 4,
  },
  answerFeedbackLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  answerFeedbackText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
}); 