import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Card, Chip, Button, Divider, Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Activity {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
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
}

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Lista de Exercícios - Equações do 2º Grau',
    type: 'assignment',
    dueDate: '15/12/2024',
    submittedCount: 18,
    totalStudents: 25,
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Quiz - História do Brasil Colonial',
    type: 'quiz',
    dueDate: '10/12/2024',
    submittedCount: 25,
    totalStudents: 25,
    status: 'completed',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Projeto - Sustentabilidade na Escola',
    type: 'project',
    dueDate: '20/12/2024',
    submittedCount: 5,
    totalStudents: 25,
    status: 'pending',
    priority: 'low',
  },
  {
    id: '4',
    title: 'Prova - Literatura Brasileira',
    type: 'exam',
    dueDate: '12/12/2024',
    submittedCount: 22,
    totalStudents: 25,
    status: 'in-progress',
    priority: 'high',
  },
];

const mockSubmissions: Submission[] = [
  {
    id: '1',
    studentName: 'Ana Silva',
    studentId: '2024001',
    submittedAt: '14/12/2024 23:45',
    status: 'submitted',
    grade: 8.5,
    feedback: 'Bom trabalho! Alguns erros de cálculo.',
  },
  {
    id: '2',
    studentName: 'Carlos Santos',
    studentId: '2024002',
    submittedAt: '16/12/2024 10:30',
    status: 'late',
    grade: 6.0,
    feedback: 'Entrega tardia. Respostas corretas mas sem desenvolvimento.',
  },
  {
    id: '3',
    studentName: 'Maria Oliveira',
    studentId: '2024003',
    submittedAt: '15/12/2024 22:15',
    status: 'submitted',
    grade: 9.0,
    feedback: 'Excelente trabalho! Demonstrou domínio do conteúdo.',
  },
  {
    id: '4',
    studentName: 'João Pereira',
    studentId: '2024004',
    submittedAt: '',
    status: 'not-submitted',
  },
];

export default function TeacherCorrections() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showSubmissions, setShowSubmissions] = useState(false);

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || activity.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: Activity['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em Andamento';
      case 'completed': return 'Concluída';
      default: return 'Desconhecido';
    }
  };

  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityText = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Desconhecida';
    }
  };

  const getTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'assignment': return 'assignment';
      case 'quiz': return 'quiz';
      case 'project': return 'group-work';
      case 'exam': return 'school';
      default: return 'assignment';
    }
  };

  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'assignment': return '#3b82f6';
      case 'quiz': return '#10b981';
      case 'project': return '#f59e0b';
      case 'exam': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getTypeText = (type: Activity['type']) => {
    switch (type) {
      case 'assignment': return 'Lista';
      case 'quiz': return 'Quiz';
      case 'project': return 'Projeto';
      case 'exam': return 'Prova';
      default: return 'Atividade';
    }
  };

  const handleActivityPress = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowSubmissions(true);
  };

  const handleBackToActivities = () => {
    setSelectedActivity(null);
    setShowSubmissions(false);
  };

  const handleViewSubmission = (submission: Submission) => {
    router.push(`/teacher/submission-detail?id=${submission.id}`);
  };

  const renderActivityCard = (activity: Activity) => (
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
              style={[styles.statusChip, { backgroundColor: getStatusColor(activity.status) + '20' }]}
              textStyle={{ color: getStatusColor(activity.status) }}
            >
              {getStatusText(activity.status)}
            </Chip>
            <Chip 
              style={[styles.priorityChip, { backgroundColor: getPriorityColor(activity.priority) + '20' }]}
              textStyle={{ color: getPriorityColor(activity.priority) }}
            >
              {getPriorityText(activity.priority)}
            </Chip>
          </View>
        </View>

        <View style={styles.activityDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="schedule" size={16} color="#6b7280" />
            <Text style={styles.detailText}>Vencimento: {activity.dueDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="people" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {activity.submittedCount}/{activity.totalStudents} entregas
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(activity.submittedCount / activity.totalStudents) * 100}%`,
                  backgroundColor: getStatusColor(activity.status)
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((activity.submittedCount / activity.totalStudents) * 100)}% completo
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

      <View style={styles.submissionsStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{selectedActivity?.submittedCount}</Text>
          <Text style={styles.statLabel}>Entregas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {mockSubmissions.filter(s => s.grade !== undefined).length}
          </Text>
          <Text style={styles.statLabel}>Corrigidas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {mockSubmissions.filter(s => s.grade === undefined).length}
          </Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
      </View>

      <ScrollView style={styles.submissionsList}>
        {mockSubmissions.map((submission) => (
          <Card key={submission.id} style={styles.submissionCard}>
            <Card.Content>
              <View style={styles.submissionHeader}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{submission.studentName}</Text>
                  <Text style={styles.studentId}>{submission.studentId}</Text>
                </View>
                <View style={styles.submissionStatus}>
                  {submission.status === 'submitted' && (
                    <Chip style={styles.submittedChip} textStyle={{ color: '#10b981' }}>
                      Entregue
                    </Chip>
                  )}
                  {submission.status === 'late' && (
                    <Chip style={styles.lateChip} textStyle={{ color: '#f59e0b' }}>
                      Tardia
                    </Chip>
                  )}
                  {submission.status === 'not-submitted' && (
                    <Chip style={styles.notSubmittedChip} textStyle={{ color: '#dc2626' }}>
                      Não Entregue
                    </Chip>
                  )}
                </View>
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
                  <Text style={styles.gradeValue}>{submission.grade}/10</Text>
                </View>
              )}

              {submission.feedback && (
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackLabel}>Feedback:</Text>
                  <Text style={styles.feedbackText}>{submission.feedback}</Text>
                </View>
              )}

              <View style={styles.submissionActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => handleViewSubmission(submission)}
                  style={styles.correctButton}
                >
                  Visualizar
                </Button>
                <Button 
                  mode="contained" 
                  onPress={() => handleViewSubmission(submission)}
                  style={styles.correctButton}
                >
                  Corrigir
                </Button>
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
        <Text style={styles.title}>Correções</Text>
        <Text style={styles.subtitle}>Gerencie as correções das atividades</Text>
      </View>

      <Searchbar
        placeholder="Buscar atividades..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

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
            style={[styles.filterChip, selectedFilter === 'in-progress' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('in-progress')}
          >
            <Text style={[styles.filterText, selectedFilter === 'in-progress' && styles.filterTextActive]}>
              Em Andamento
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

      <ScrollView style={styles.activitiesList}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(renderActivityCard)
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="assignment" size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nenhuma atividade encontrada</Text>
            <Text style={styles.emptyText}>
              Não há atividades que correspondam aos filtros selecionados.
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
  searchBar: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
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
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
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
    marginBottom: 12,
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
  statusChip: {
    marginBottom: 4,
  },
  priorityChip: {
    marginBottom: 0,
  },
  activityDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
  submissionsStats: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
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
  },
  submittedChip: {
    backgroundColor: '#10b98120',
  },
  lateChip: {
    backgroundColor: '#f59e0b20',
  },
  notSubmittedChip: {
    backgroundColor: '#dc262620',
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
    marginBottom: 16,
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
  submissionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  correctButton: {
    flex: 1,
    borderColor: '#3b82f6',
  },
  aiCorrectButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
  },
}); 