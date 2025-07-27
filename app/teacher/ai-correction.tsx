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
import { Card, Chip, Button, ProgressBar, Divider, Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface AICorrectionActivity {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  totalSubmissions: number;
  correctedCount: number;
  aiEnabled: boolean;
  accuracy: number;
  lastCorrection: string;
}

interface AISubmission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  status: 'pending' | 'ai-corrected' | 'manual-review' | 'completed';
  aiGrade?: number;
  aiConfidence?: number;
  aiFeedback?: string;
  manualGrade?: number;
  manualFeedback?: string;
  needsReview: boolean;
  reviewReason?: string;
}

const mockAIActivities: AICorrectionActivity[] = [
  {
    id: '1',
    title: 'Lista de Exercícios - Equações do 2º Grau',
    type: 'assignment',
    totalSubmissions: 25,
    correctedCount: 18,
    aiEnabled: true,
    accuracy: 92,
    lastCorrection: 'há 2 horas',
  },
  {
    id: '2',
    title: 'Quiz - História do Brasil Colonial',
    type: 'quiz',
    totalSubmissions: 25,
    correctedCount: 25,
    aiEnabled: true,
    accuracy: 98,
    lastCorrection: 'há 1 dia',
  },
  {
    id: '3',
    title: 'Projeto - Sustentabilidade na Escola',
    type: 'project',
    totalSubmissions: 8,
    correctedCount: 3,
    aiEnabled: false,
    accuracy: 0,
    lastCorrection: 'nunca',
  },
  {
    id: '4',
    title: 'Prova - Literatura Brasileira',
    type: 'exam',
    totalSubmissions: 22,
    correctedCount: 15,
    aiEnabled: true,
    accuracy: 87,
    lastCorrection: 'há 30 minutos',
  },
];

const mockAISubmissions: AISubmission[] = [
  {
    id: '1',
    studentName: 'Ana Silva',
    studentId: '2024001',
    submittedAt: '14/12/2024 23:45',
    status: 'ai-corrected',
    aiGrade: 8.5,
    aiConfidence: 95,
    aiFeedback: 'Excelente resolução das equações. Demonstrou domínio da fórmula de Bhaskara. Pequeno erro de cálculo na questão 3.',
    needsReview: false,
  },
  {
    id: '2',
    studentName: 'Carlos Santos',
    studentId: '2024002',
    submittedAt: '16/12/2024 10:30',
    status: 'manual-review',
    aiGrade: 6.0,
    aiConfidence: 65,
    aiFeedback: 'Respostas corretas mas desenvolvimento incompleto. Possível cópia de respostas.',
    manualGrade: 7.0,
    manualFeedback: 'Revisado manualmente. Aluno demonstrou conhecimento, mas precisa melhorar o desenvolvimento.',
    needsReview: true,
    reviewReason: 'Baixa confiança da IA',
  },
  {
    id: '3',
    studentName: 'Maria Oliveira',
    studentId: '2024003',
    submittedAt: '15/12/2024 22:15',
    status: 'completed',
    aiGrade: 9.0,
    aiConfidence: 98,
    aiFeedback: 'Trabalho excepcional. Todas as questões resolvidas corretamente com desenvolvimento completo.',
    manualGrade: 9.0,
    manualFeedback: 'Concordo com a correção da IA. Trabalho excelente.',
    needsReview: false,
  },
  {
    id: '4',
    studentName: 'João Pereira',
    studentId: '2024004',
    submittedAt: '15/12/2024 21:30',
    status: 'pending',
    needsReview: false,
  },
];

export default function TeacherAICorrection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'ai-corrected' | 'manual-review' | 'completed'>('all');
  const [selectedActivity, setSelectedActivity] = useState<AICorrectionActivity | null>(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredActivities = mockAIActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredSubmissions = mockAISubmissions.filter(submission => {
    const matchesFilter = selectedFilter === 'all' || submission.status === selectedFilter;
    return matchesFilter;
  });

  const getTypeIcon = (type: AICorrectionActivity['type']) => {
    switch (type) {
      case 'assignment': return 'assignment';
      case 'quiz': return 'quiz';
      case 'project': return 'group-work';
      case 'exam': return 'school';
      default: return 'assignment';
    }
  };

  const getTypeColor = (type: AICorrectionActivity['type']) => {
    switch (type) {
      case 'assignment': return '#3b82f6';
      case 'quiz': return '#10b981';
      case 'project': return '#f59e0b';
      case 'exam': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getTypeText = (type: AICorrectionActivity['type']) => {
    switch (type) {
      case 'assignment': return 'Lista';
      case 'quiz': return 'Quiz';
      case 'project': return 'Projeto';
      case 'exam': return 'Prova';
      default: return 'Atividade';
    }
  };

  const getStatusColor = (status: AISubmission['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'ai-corrected': return '#3b82f6';
      case 'manual-review': return '#8b5cf6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: AISubmission['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'ai-corrected': return 'IA Corrigiu';
      case 'manual-review': return 'Revisão Manual';
      case 'completed': return 'Concluída';
      default: return 'Desconhecido';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#10b981';
    if (confidence >= 70) return '#f59e0b';
    return '#dc2626';
  };

  const handleActivityPress = (activity: AICorrectionActivity) => {
    setSelectedActivity(activity);
    setShowSubmissions(true);
  };

  const handleBackToActivities = () => {
    setSelectedActivity(null);
    setShowSubmissions(false);
  };

  const handleAICorrection = async (submissionId: string) => {
    setIsProcessing(true);
    
    try {
      // Simular processamento da IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      Alert.alert(
        'Correção IA Concluída',
        'A IA analisou a resposta e gerou uma correção. Revise o resultado antes de confirmar.',
        [
          { text: 'Revisar', style: 'default' },
          { text: 'Confirmar', style: 'default' },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao processar correção com IA. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchAICorrection = async () => {
    setIsProcessing(true);
    
    try {
      // Simular processamento em lote
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      Alert.alert(
        'Correção em Lote Concluída',
        'A IA corrigiu 15 submissões pendentes. Revise os resultados.',
        [
          { text: 'Revisar Todas', style: 'default' },
          { text: 'Confirmar Todas', style: 'default' },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao processar correções em lote. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderActivityCard = (activity: AICorrectionActivity) => (
    <Card key={activity.id} style={styles.activityCard} onPress={() => handleActivityPress(activity)}>
      <Card.Content>
        <View style={styles.activityHeader}>
          <View style={styles.activityInfo}>
            <View style={styles.activityTypeContainer}>
              <MaterialIcons 
                name={getTypeIcon(activity.type)} 
                size={20} 
                color={getTypeColor(activity.type)} 
              />
              <Text style={[styles.activityType, { color: getTypeColor(activity.type) }]}>
                {getTypeText(activity.type)}
              </Text>
            </View>
            <Text style={styles.activityTitle}>{activity.title}</Text>
          </View>
          <View style={styles.activityMeta}>
            <Chip 
              style={[
                styles.aiStatusChip, 
                { 
                  backgroundColor: activity.aiEnabled ? '#10b98120' : '#dc262620' 
                }
              ]}
              textStyle={{ 
                color: activity.aiEnabled ? '#10b981' : '#dc2626' 
              }}
            >
              {activity.aiEnabled ? 'IA Ativa' : 'IA Inativa'}
            </Chip>
          </View>
        </View>

        <View style={styles.activityStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activity.correctedCount}/{activity.totalSubmissions}</Text>
            <Text style={styles.statLabel}>Corrigidas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activity.accuracy}%</Text>
            <Text style={styles.statLabel}>Precisão IA</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activity.lastCorrection}</Text>
            <Text style={styles.statLabel}>Última Correção</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={activity.correctedCount / activity.totalSubmissions} 
            color={getTypeColor(activity.type)}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {Math.round((activity.correctedCount / activity.totalSubmissions) * 100)}% completo
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSubmissionsList = () => (
    <View style={styles.submissionsContainer}>
      <View style={styles.submissionsHeader}>
        <TouchableOpacity onPress={handleBackToActivities} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#3b82f6" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.submissionsTitle}>
          {selectedActivity?.title}
        </Text>
      </View>

      <View style={styles.aiStats}>
        <View style={styles.aiStatCard}>
          <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
          <View style={styles.aiStatInfo}>
            <Text style={styles.aiStatNumber}>{selectedActivity?.accuracy}%</Text>
            <Text style={styles.aiStatLabel}>Precisão da IA</Text>
          </View>
        </View>
        <View style={styles.aiStatCard}>
          <MaterialIcons name="speed" size={24} color="#10b981" />
          <View style={styles.aiStatInfo}>
            <Text style={styles.aiStatNumber}>
              {filteredSubmissions.filter(s => s.status === 'pending').length}
            </Text>
            <Text style={styles.aiStatLabel}>Pendentes</Text>
          </View>
        </View>
      </View>

      <View style={styles.batchActions}>
        <Button 
          mode="contained" 
          onPress={handleBatchAICorrection}
          disabled={isProcessing}
          style={styles.batchButton}
          icon="auto-awesome"
        >
          {isProcessing ? 'Processando...' : 'Corrigir Todas com IA'}
        </Button>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'pending' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('pending')}
          >
            <Text style={[styles.filterText, selectedFilter === 'pending' && styles.filterTextActive]}>
              Pendentes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'ai-corrected' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('ai-corrected')}
          >
            <Text style={[styles.filterText, selectedFilter === 'ai-corrected' && styles.filterTextActive]}>
              IA Corrigiu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'manual-review' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('manual-review')}
          >
            <Text style={[styles.filterText, selectedFilter === 'manual-review' && styles.filterTextActive]}>
              Revisão Manual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'completed' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('completed')}
          >
            <Text style={[styles.filterText, selectedFilter === 'completed' && styles.filterTextActive]}>
              Concluídas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.submissionsList}>
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} style={styles.submissionCard}>
            <Card.Content>
              <View style={styles.submissionHeader}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{submission.studentName}</Text>
                  <Text style={styles.studentId}>{submission.studentId}</Text>
                </View>
                <View style={styles.submissionStatus}>
                  <Chip 
                    style={[
                      styles.statusChip, 
                      { backgroundColor: getStatusColor(submission.status) + '20' }
                    ]}
                    textStyle={{ color: getStatusColor(submission.status) }}
                  >
                    {getStatusText(submission.status)}
                  </Chip>
                  {submission.needsReview && (
                    <MaterialIcons name="warning" size={16} color="#f59e0b" style={styles.warningIcon} />
                  )}
                </View>
              </View>

              <View style={styles.submissionDetails}>
                <MaterialIcons name="schedule" size={16} color="#6b7280" />
                <Text style={styles.submissionTime}>{submission.submittedAt}</Text>
              </View>

              {submission.aiGrade !== undefined && (
                <View style={styles.aiCorrectionContainer}>
                  <View style={styles.aiGradeContainer}>
                    <Text style={styles.aiGradeLabel}>Nota IA:</Text>
                    <Text style={styles.aiGradeValue}>{submission.aiGrade}/10</Text>
                    {submission.aiConfidence && (
                      <View style={styles.confidenceContainer}>
                        <Text style={styles.confidenceLabel}>Confiança:</Text>
                        <Text style={[
                          styles.confidenceValue, 
                          { color: getConfidenceColor(submission.aiConfidence) }
                        ]}>
                          {submission.aiConfidence}%
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {submission.aiFeedback && (
                    <View style={styles.aiFeedbackContainer}>
                      <Text style={styles.aiFeedbackLabel}>Feedback IA:</Text>
                      <Text style={styles.aiFeedbackText}>{submission.aiFeedback}</Text>
                    </View>
                  )}
                </View>
              )}

              {submission.manualGrade !== undefined && (
                <View style={styles.manualCorrectionContainer}>
                  <Divider style={styles.divider} />
                  <View style={styles.manualGradeContainer}>
                    <Text style={styles.manualGradeLabel}>Nota Manual:</Text>
                    <Text style={styles.manualGradeValue}>{submission.manualGrade}/10</Text>
                  </View>
                  
                  {submission.manualFeedback && (
                    <View style={styles.manualFeedbackContainer}>
                      <Text style={styles.manualFeedbackLabel}>Feedback Manual:</Text>
                      <Text style={styles.manualFeedbackText}>{submission.manualFeedback}</Text>
                    </View>
                  )}
                </View>
              )}

              {submission.reviewReason && (
                <View style={styles.reviewReasonContainer}>
                  <MaterialIcons name="info" size={16} color="#f59e0b" />
                  <Text style={styles.reviewReasonText}>{submission.reviewReason}</Text>
                </View>
              )}

              <View style={styles.submissionActions}>
                {submission.status === 'pending' && (
                  <Button 
                    mode="contained" 
                    onPress={() => handleAICorrection(submission.id)}
                    disabled={isProcessing}
                    style={styles.aiCorrectButton}
                    icon="psychology"
                  >
                    {isProcessing ? 'Processando...' : 'Corrigir com IA'}
                  </Button>
                )}
                
                {submission.status === 'ai-corrected' && (
                  <>
                    <Button 
                      mode="outlined" 
                      onPress={() => Alert.alert('Revisar', `Revisar correção de ${submission.studentName}`)}
                      style={styles.reviewButton}
                    >
                      Revisar
                    </Button>
                    <Button 
                      mode="contained" 
                      onPress={() => Alert.alert('Confirmar', `Confirmar correção de ${submission.studentName}`)}
                      style={styles.confirmButton}
                    >
                      Confirmar
                    </Button>
                  </>
                )}
                
                {submission.status === 'manual-review' && (
                  <Button 
                    mode="contained" 
                    onPress={() => Alert.alert('Finalizar', `Finalizar revisão de ${submission.studentName}`)}
                    style={styles.finalizeButton}
                  >
                    Finalizar Revisão
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );

  const renderActivitiesList = () => (
    <View style={styles.activitiesContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Correções com IA</Text>
        <Text style={styles.subtitle}>Correção automática inteligente das atividades</Text>
      </View>

      <View style={styles.aiOverview}>
        <Card style={styles.aiOverviewCard}>
          <Card.Content>
            <View style={styles.aiOverviewHeader}>
              <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
              <Text style={styles.aiOverviewTitle}>Visão Geral da IA</Text>
            </View>
            <View style={styles.aiOverviewStats}>
              <View style={styles.aiOverviewStat}>
                <Text style={styles.aiOverviewNumber}>156</Text>
                <Text style={styles.aiOverviewLabel}>Correções Hoje</Text>
              </View>
              <View style={styles.aiOverviewStat}>
                <Text style={styles.aiOverviewNumber}>94%</Text>
                <Text style={styles.aiOverviewLabel}>Precisão Média</Text>
              </View>
              <View style={styles.aiOverviewStat}>
                <Text style={styles.aiOverviewNumber}>2.3s</Text>
                <Text style={styles.aiOverviewLabel}>Tempo Médio</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <Searchbar
        placeholder="Buscar atividades..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView style={styles.activitiesList}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(renderActivityCard)
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="psychology" size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nenhuma atividade encontrada</Text>
            <Text style={styles.emptyText}>
              Não há atividades com correção por IA que correspondam à busca.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {showSubmissions ? renderSubmissionsList() : renderActivitiesList()}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  activitiesContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  aiOverview: {
    marginBottom: 20,
  },
  aiOverviewCard: {
    borderRadius: 12,
    backgroundColor: '#f8f7ff',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  aiOverviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  aiOverviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  aiOverviewStats: {
    flexDirection: 'row',
  },
  aiOverviewStat: {
    flex: 1,
    alignItems: 'center',
  },
  aiOverviewNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  aiOverviewLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  searchBar: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  activitiesList: {
    flex: 1,
  },
  activityCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityInfo: {
    flex: 1,
    marginRight: 12,
  },
  activityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityType: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 22,
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  aiStatusChip: {
    marginBottom: 0,
  },
  activityStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  submissionsContainer: {
    flex: 1,
    padding: 20,
  },
  submissionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
    marginLeft: 4,
  },
  submissionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  aiStats: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  aiStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  aiStatInfo: {
    flex: 1,
  },
  aiStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  aiStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  batchActions: {
    marginBottom: 20,
  },
  batchButton: {
    backgroundColor: '#8b5cf6',
  },
  filters: {
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
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
  submissionStatus: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    marginBottom: 0,
  },
  warningIcon: {
    marginTop: 2,
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
  aiCorrectionContainer: {
    backgroundColor: '#f8f7ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  aiGradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiGradeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
  },
  aiGradeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b5cf6',
    marginRight: 16,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 4,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  aiFeedbackContainer: {
    marginTop: 8,
  },
  aiFeedbackLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  aiFeedbackText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  manualCorrectionContainer: {
    marginTop: 12,
  },
  divider: {
    marginVertical: 8,
  },
  manualGradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  manualGradeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
  },
  manualGradeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  manualFeedbackContainer: {
    marginTop: 8,
  },
  manualFeedbackLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  manualFeedbackText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  reviewReasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    gap: 6,
  },
  reviewReasonText: {
    fontSize: 12,
    color: '#92400e',
    flex: 1,
  },
  submissionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  aiCorrectButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
  },
  reviewButton: {
    flex: 1,
    borderColor: '#3b82f6',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#10b981',
  },
  finalizeButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
  },
}); 