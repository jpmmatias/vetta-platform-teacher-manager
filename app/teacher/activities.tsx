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
import { Card, Chip, Button, Searchbar, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Activity {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  description: string;
  class: string;
  dueDate: string;
  status: 'draft' | 'published' | 'active' | 'closed';
  submissionCount: number;
  totalStudents: number;
  averageGrade?: number;
  createdAt: string;
  aiGenerated?: boolean;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Lista de Exercícios - Equações do 2º Grau',
    type: 'assignment',
    description: 'Atividade prática sobre equações quadráticas, incluindo resolução por fatoração, completando quadrados e fórmula de Bhaskara.',
    class: 'Matemática 9º Ano A',
    dueDate: '15/12/2024',
    status: 'active',
    submissionCount: 18,
    totalStudents: 25,
    averageGrade: 8.2,
    createdAt: '10/12/2024',
    aiGenerated: true,
  },
  {
    id: '2',
    title: 'Quiz - História do Brasil Colonial',
    type: 'quiz',
    description: 'Questionário sobre o período colonial brasileiro, desde o descobrimento até a independência.',
    class: 'História 8º Ano B',
    dueDate: '10/12/2024',
    status: 'closed',
    submissionCount: 25,
    totalStudents: 25,
    averageGrade: 7.8,
    createdAt: '05/12/2024',
    aiGenerated: true,
  },
  {
    id: '3',
    title: 'Projeto - Sustentabilidade na Escola',
    type: 'project',
    description: 'Projeto interdisciplinar sobre sustentabilidade, envolvendo ciências, geografia e matemática.',
    class: 'Ciências 7º Ano A',
    dueDate: '20/12/2024',
    status: 'published',
    submissionCount: 5,
    totalStudents: 30,
    createdAt: '12/12/2024',
    aiGenerated: false,
  },
  {
    id: '4',
    title: 'Prova - Literatura Brasileira - Modernismo',
    type: 'exam',
    description: 'Avaliação sobre o movimento modernista brasileiro, incluindo autores, obras e características literárias.',
    class: 'Português 9º Ano B',
    dueDate: '12/12/2024',
    status: 'active',
    submissionCount: 22,
    totalStudents: 28,
    averageGrade: 8.5,
    createdAt: '08/12/2024',
    aiGenerated: false,
  },
  {
    id: '5',
    title: 'Lista de Exercícios - Geometria Analítica',
    type: 'assignment',
    description: 'Exercícios sobre retas, circunferências e cônicas no plano cartesiano.',
    class: 'Matemática 3º Ano EM',
    dueDate: '18/12/2024',
    status: 'draft',
    submissionCount: 0,
    totalStudents: 20,
    createdAt: '14/12/2024',
    aiGenerated: false,
  },
  {
    id: '6',
    title: 'Quiz - Sistema Solar',
    type: 'quiz',
    description: 'Questionário sobre planetas, satélites e características do sistema solar.',
    class: 'Ciências 6º Ano A',
    dueDate: '16/12/2024',
    status: 'published',
    submissionCount: 12,
    totalStudents: 25,
    createdAt: '13/12/2024',
    aiGenerated: true,
  },
];

export default function TeacherActivities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'draft' | 'published' | 'active' | 'closed'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'assignment' | 'quiz' | 'project' | 'exam'>('all');

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatusFilter = selectedFilter === 'all' || activity.status === selectedFilter;
    const matchesTypeFilter = selectedType === 'all' || activity.type === selectedType;
    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

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

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'published': return '#3b82f6';
      case 'active': return '#10b981';
      case 'closed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: Activity['status']) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'published': return 'Publicada';
      case 'active': return 'Ativa';
      case 'closed': return 'Encerrada';
      default: return 'Desconhecido';
    }
  };

  const handleCreateActivity = () => {
    router.push('/teacher/create-activity');
  };

  const handleActivityPress = (activity: Activity) => {
    router.push(`/teacher/activity-detail?id=${activity.id}`);
  };

  const handleEditActivity = (activity: Activity) => {
    Alert.alert('Editar Atividade', `Editar "${activity.title}"`);
  };

  const handleDuplicateActivity = (activity: Activity) => {
    Alert.alert('Duplicar Atividade', `Duplicar "${activity.title}"`);
  };

  const handleDeleteActivity = (activity: Activity) => {
    Alert.alert(
      'Excluir Atividade',
      `Tem certeza que deseja excluir "${activity.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => console.log('Excluir atividade') },
      ]
    );
  };

  const renderActivityCard = (activity: Activity) => (
    <Card key={activity.id} style={styles.activityCard}>
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
              {activity.aiGenerated && (
                <MaterialIcons name="psychology" size={16} color="#8b5cf6" style={styles.aiIcon} />
              )}
            </View>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityClass}>{activity.class}</Text>
          </View>
          <View style={styles.activityMeta}>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(activity.status) + '20' }]}
              textStyle={{ color: getStatusColor(activity.status) }}
            >
              {getStatusText(activity.status)}
            </Chip>
          </View>
        </View>

        <Text style={styles.activityDescription} numberOfLines={2}>
          {activity.description}
        </Text>

        <View style={styles.activityStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={16} color="#6b7280" />
            <Text style={styles.statText}>Vencimento: {activity.dueDate}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="people" size={16} color="#6b7280" />
            <Text style={styles.statText}>
              {activity.submissionCount}/{activity.totalStudents} entregas
            </Text>
          </View>
          {activity.averageGrade && (
            <View style={styles.statItem}>
              <MaterialIcons name="grade" size={16} color="#6b7280" />
              <Text style={styles.statText}>Média: {activity.averageGrade.toFixed(1)}</Text>
            </View>
          )}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(activity.submissionCount / activity.totalStudents) * 100}%`,
                  backgroundColor: getStatusColor(activity.status)
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((activity.submissionCount / activity.totalStudents) * 100)}% completo
          </Text>
        </View>

        <View style={styles.activityActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleActivityPress(activity)}
          >
            <MaterialIcons name="visibility" size={16} color="#3b82f6" />
            <Text style={styles.actionText}>Visualizar</Text>
          </TouchableOpacity>

          {activity.status === 'draft' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditActivity(activity)}
            >
              <MaterialIcons name="edit" size={16} color="#f59e0b" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDuplicateActivity(activity)}
          >
            <MaterialIcons name="content-copy" size={16} color="#10b981" />
            <Text style={styles.actionText}>Duplicar</Text>
          </TouchableOpacity>

          {activity.status === 'draft' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteActivity(activity)}
            >
              <MaterialIcons name="delete" size={16} color="#dc2626" />
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="description" size={24} color="#3b82f6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockActivities.length}</Text>
              <Text style={styles.statLabel}>Total de Atividades</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {mockActivities.filter(a => a.aiGenerated).length}
              </Text>
              <Text style={styles.statLabel}>Criadas com IA</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="check-circle" size={24} color="#10b981" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {mockActivities.filter(a => a.status === 'active' || a.status === 'published').length}
              </Text>
              <Text style={styles.statLabel}>Ativas</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Atividades</Text>
        <Text style={styles.subtitle}>Gerencie suas atividades criadas</Text>
      </View>

      {renderStats()}

      <Searchbar
        placeholder="Buscar atividades..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filters}>
        <Text style={styles.filtersTitle}>Filtros:</Text>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Status:</Text>
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
              style={[styles.filterChip, selectedFilter === 'draft' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('draft')}
            >
              <Text style={[styles.filterText, selectedFilter === 'draft' && styles.filterTextActive]}>
                Rascunhos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'published' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('published')}
            >
              <Text style={[styles.filterText, selectedFilter === 'published' && styles.filterTextActive]}>
                Publicadas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'active' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('active')}
            >
              <Text style={[styles.filterText, selectedFilter === 'active' && styles.filterTextActive]}>
                Ativas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'closed' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('closed')}
            >
              <Text style={[styles.filterText, selectedFilter === 'closed' && styles.filterTextActive]}>
                Encerradas
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Tipo:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.filterChip, selectedType === 'all' && styles.filterChipActive]}
              onPress={() => setSelectedType('all')}
            >
              <Text style={[styles.filterText, selectedType === 'all' && styles.filterTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedType === 'assignment' && styles.filterChipActive]}
              onPress={() => setSelectedType('assignment')}
            >
              <Text style={[styles.filterText, selectedType === 'assignment' && styles.filterTextActive]}>
                Listas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedType === 'quiz' && styles.filterChipActive]}
              onPress={() => setSelectedType('quiz')}
            >
              <Text style={[styles.filterText, selectedType === 'quiz' && styles.filterTextActive]}>
                Quizzes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedType === 'project' && styles.filterChipActive]}
              onPress={() => setSelectedType('project')}
            >
              <Text style={[styles.filterText, selectedType === 'project' && styles.filterTextActive]}>
                Projetos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedType === 'exam' && styles.filterChipActive]}
              onPress={() => setSelectedType('exam')}
            >
              <Text style={[styles.filterText, selectedType === 'exam' && styles.filterTextActive]}>
                Provas
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <ScrollView style={styles.activitiesList}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(renderActivityCard)
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="description" size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nenhuma atividade encontrada</Text>
            <Text style={styles.emptyText}>
              Não há atividades que correspondam aos filtros selecionados.
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateActivity}
        label="Nova Atividade"
      />
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
    padding: 20,
    paddingBottom: 16,
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  filters: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
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
    paddingHorizontal: 20,
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
  aiIcon: {
    marginLeft: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 22,
    marginBottom: 4,
  },
  activityClass: {
    fontSize: 14,
    color: '#6b7280',
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 0,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  activityStats: {
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  activityActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3b82f6',
  },
}); 