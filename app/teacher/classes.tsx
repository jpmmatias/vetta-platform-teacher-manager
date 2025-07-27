import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, Chip, Menu, Divider, Badge } from 'react-native-paper';
import ClassCard from '../../components/ClassCard';
import AIInsights from '../../components/AIInsights';
import NewClassModal from '../../components/NewClassModal';

// Tipos
interface ClassCard {
  id: string;
  name: string;
  subject: string;
  period: string;
  studentsCount: number;
  institution: string;
  pendingActivities: number;
  lastActivity: string;
  participationRate: number;
  averageGrade: number;
  correctedActivities: number;
  status: 'active' | 'inactive' | 'archived';
  needsAttention: boolean;
  lastSync: string;
}

interface MetricCard {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  comparison?: string;
}

interface Insight {
  id: string;
  type: 'improvement' | 'warning' | 'recommendation';
  title: string;
  message: string;
  classId?: string;
  priority: 'high' | 'medium' | 'low';
}

// Dados mockados
const mockClasses: ClassCard[] = [
  {
    id: '1',
    name: 'Matemática - 9º Ano A',
    subject: 'Matemática',
    period: '2024.1',
    studentsCount: 32,
    institution: 'Escola Municipal São José',
    pendingActivities: 5,
    lastActivity: '2 horas atrás',
    participationRate: 87,
    averageGrade: 8.4,
    correctedActivities: 28,
    status: 'active',
    needsAttention: true,
    lastSync: '5 min atrás',
  },
  {
    id: '2',
    name: 'Português - 8º Ano B',
    subject: 'Português',
    period: '2024.1',
    studentsCount: 28,
    institution: 'Escola Municipal São José',
    pendingActivities: 0,
    lastActivity: '1 dia atrás',
    participationRate: 92,
    averageGrade: 7.8,
    correctedActivities: 15,
    status: 'active',
    needsAttention: false,
    lastSync: '1 hora atrás',
  },
  {
    id: '3',
    name: 'Ciências - 9º Ano C',
    subject: 'Ciências',
    period: '2024.1',
    studentsCount: 30,
    institution: 'Escola Municipal São José',
    pendingActivities: 12,
    lastActivity: '30 min atrás',
    participationRate: 78,
    averageGrade: 6.9,
    correctedActivities: 8,
    status: 'active',
    needsAttention: true,
    lastSync: '2 min atrás',
  },
  {
    id: '4',
    name: 'História - 8º Ano A',
    subject: 'História',
    period: '2024.1',
    studentsCount: 25,
    institution: 'Escola Municipal São José',
    pendingActivities: 3,
    lastActivity: '3 horas atrás',
    participationRate: 85,
    averageGrade: 8.1,
    correctedActivities: 22,
    status: 'active',
    needsAttention: false,
    lastSync: '10 min atrás',
  },
  {
    id: '5',
    name: 'Geografia - 9º Ano B',
    subject: 'Geografia',
    period: '2024.1',
    studentsCount: 27,
    institution: 'Escola Municipal São José',
    pendingActivities: 8,
    lastActivity: '1 hora atrás',
    participationRate: 81,
    averageGrade: 7.5,
    correctedActivities: 19,
    status: 'active',
    needsAttention: false,
    lastSync: '15 min atrás',
  },
];

const subjects = ['Todas', 'Matemática', 'Português', 'Ciências', 'História', 'Geografia'];
const periods = ['Todos', '2024.1', '2024.2', '2023.2'];
const statuses = ['Todas', 'Ativas', 'Arquivadas'];

const subjectColors = {
  Matemática: '#FF6B35',
  Português: '#2563EB',
  Ciências: '#16A34A',
  História: '#7C3AED',
  Geografia: '#0891B2',
};

// Insights da IA
const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'improvement',
    title: 'Melhoria Detectada',
    message: 'A turma 9º A melhorou 15% em álgebra nas últimas 3 semanas.',
    classId: '1',
    priority: 'high',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Atenção Necessária',
    message: '5 alunos do 8º B precisam de reforço em geometria.',
    classId: '2',
    priority: 'high',
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Sugestão de Atividade',
    message: 'Considere criar uma atividade de revisão sobre trigonometria para a turma 9º C.',
    classId: '3',
    priority: 'medium',
  },
];

export default function TeacherClasses() {
  const [classes, setClasses] = useState<ClassCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Todas');
  const [selectedPeriod, setSelectedPeriod] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todas');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [newClassModalVisible, setNewClassModalVisible] = useState(false);

  // Simular carregamento
  useEffect(() => {
    const loadClasses = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setClasses(mockClasses);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  // Filtrar e ordenar turmas
  const filteredClasses = classes
    .filter(cls => {
      const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'Todas' || cls.subject === selectedSubject;
      const matchesPeriod = selectedPeriod === 'Todos' || cls.period === selectedPeriod;
      const matchesStatus = selectedStatus === 'Todas' || 
        (selectedStatus === 'Ativas' && cls.status === 'active') ||
        (selectedStatus === 'Arquivadas' && cls.status === 'archived');
      
      return matchesSearch && matchesSubject && matchesPeriod && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'activities':
          return b.pendingActivities - a.pendingActivities;
        case 'recent':
        default:
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      }
    });

  // Métricas gerais
  const metrics: MetricCard[] = [
    {
      icon: 'class',
      iconBg: '#e0e7ff',
      iconColor: '#3b82f6',
      label: 'Total de Turmas',
      value: classes.length.toString(),
      comparison: '+2 este mês',
    },
    {
      icon: 'people',
      iconBg: '#d1fae5',
      iconColor: '#10b981',
      label: 'Estudantes Ativos',
      value: classes.reduce((sum, cls) => sum + cls.studentsCount, 0).toString(),
      comparison: '+15 este mês',
    },
    {
      icon: 'assignment',
      iconBg: '#fef3c7',
      iconColor: '#f59e0b',
      label: 'Atividades Pendentes',
      value: classes.reduce((sum, cls) => sum + cls.pendingActivities, 0).toString(),
      comparison: '-8 esta semana',
    },
    {
      icon: 'trending-up',
      iconBg: '#ede9fe',
      iconColor: '#8b5cf6',
      label: 'Média Geral',
      value: (classes.reduce((sum, cls) => sum + cls.averageGrade, 0) / classes.length).toFixed(1),
      comparison: '+0.3 este mês',
    },
  ];

  const getSubjectColor = (subject: string) => {
    return subjectColors[subject as keyof typeof subjectColors] || '#6b7280';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#16A34A';
      case 'inactive': return '#6B7280';
      case 'archived': return '#9CA3AF';
      default: return '#6B7280';
    }
  };

  const handleClassAction = (action: string, classId: string) => {
    setMenuVisible(null);
    Alert.alert('Ação', `${action} para turma ${classId}`);
  };

  const handleInsightPress = (insight: Insight) => {
    Alert.alert('Insight da IA', insight.message);
  };

  const handleNewClassSubmit = (classData: any) => {
    Alert.alert('Sucesso', 'Turma criada com sucesso!');
    // Aqui você integraria com a API para criar a turma
    console.log('Nova turma:', classData);
  };

  const renderClassCard = ({ item }: { item: ClassCard }) => (
    <ClassCard
      classData={item}
      onAccessClass={(classId) => Alert.alert('Acessar Turma', `Acessando turma ${classId}`)}
      onAICorrection={(classId) => Alert.alert('Correção IA', `Iniciando correção para turma ${classId}`)}
      onViewReports={(classId) => Alert.alert('Relatórios', `Abrindo relatórios da turma ${classId}`)}
      onClassAction={handleClassAction}
      menuVisible={menuVisible}
      onMenuToggle={setMenuVisible}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="class" size={80} color="#d1d5db" />
      <Text style={styles.emptyTitle}>Você ainda não possui turmas</Text>
      <Text style={styles.emptySubtitle}>
        Crie sua primeira turma para começar a usar a plataforma
      </Text>
      <TouchableOpacity style={styles.createButton}>
        <MaterialIcons name="add" size={20} color="white" />
        <Text style={styles.createButtonText}>Criar primeira turma</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={styles.loadingText}>Carregando suas turmas...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <MaterialIcons name="error-outline" size={80} color="#dc2626" />
      <Text style={styles.errorTitle}>Erro ao carregar turmas</Text>
      <Text style={styles.errorSubtitle}>
        Houve um problema ao carregar suas turmas. Tente novamente.
      </Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={() => window.location.reload()}
      >
        <MaterialIcons name="refresh" size={20} color="white" />
        <Text style={styles.retryButtonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return renderLoadingState();
  if (error) return renderErrorState();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Minhas Turmas</Text>
          <TouchableOpacity 
            style={styles.newClassButton}
            onPress={() => setNewClassModalVisible(true)}
          >
            <MaterialIcons name="add" size={20} color="white" />
            <Text style={styles.newClassButtonText}>Nova Turma</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar turmas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Disciplina:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.filterChip,
                    selectedSubject === subject && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedSubject(subject)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedSubject === subject && styles.filterChipTextActive
                  ]}>
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Período:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.filterChip,
                    selectedPeriod === period && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedPeriod === period && styles.filterChipTextActive
                  ]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {statuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    selectedStatus === status && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedStatus === status && styles.filterChipTextActive
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Sort and View Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Ordenar por:</Text>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => {
                const options = ['recent', 'name', 'activities'];
                const labels = ['Mais recentes', 'Nome A-Z', 'Mais atividades'];
                const currentIndex = options.indexOf(sortBy);
                const nextIndex = (currentIndex + 1) % options.length;
                setSortBy(options[nextIndex]);
              }}
            >
              <Text style={styles.sortButtonText}>
                {sortBy === 'recent' ? 'Mais recentes' : 
                 sortBy === 'name' ? 'Nome A-Z' : 'Mais atividades'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
              onPress={() => setViewMode('grid')}
            >
              <MaterialIcons 
                name="grid-view" 
                size={20} 
                color={viewMode === 'grid' ? '#3b82f6' : '#6b7280'} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <MaterialIcons 
                name="view-list" 
                size={20} 
                color={viewMode === 'list' ? '#3b82f6' : '#6b7280'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Metrics Cards */}
        <View style={styles.metricsContainer}>
          {metrics.map((metric, index) => (
            <Card key={index} style={styles.metricCard}>
              <Card.Content style={styles.metricCardContent}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIcon, { backgroundColor: metric.iconBg }]}>
                    <MaterialIcons name={metric.icon as any} size={24} color={metric.iconColor} />
                  </View>
                  <Text style={styles.metricCardLabel}>{metric.label}</Text>
                </View>
                <Text style={styles.metricCardValue}>{metric.value}</Text>
                {metric.comparison && (
                  <Text style={styles.metricComparison}>{metric.comparison}</Text>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>

                 {/* AI Insights */}
         <AIInsights insights={mockInsights} onInsightPress={handleInsightPress} />

         {/* Classes Grid/List */}
         {filteredClasses.length === 0 ? (
           renderEmptyState()
         ) : (
           <View style={[
             styles.classesContainer,
             viewMode === 'grid' ? styles.classesGrid : styles.classesList
           ]}>
             <FlatList
               data={filteredClasses}
               renderItem={renderClassCard}
               keyExtractor={(item) => item.id}
               numColumns={viewMode === 'grid' ? 2 : 1}
               key={viewMode}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.classesListContent}
             />
           </View>
                  )}
       </ScrollView>

       {/* New Class Modal */}
       <NewClassModal
         visible={newClassModalVisible}
         onDismiss={() => setNewClassModalVisible(false)}
         onSubmit={handleNewClassSubmit}
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
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  newClassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newClassButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterGroup: {
    marginRight: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    padding: 8,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    maxWidth: (width - 52) / 2,
  },
  metricCardContent: {
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  metricCardLabel: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  metricCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricComparison: {
    fontSize: 12,
    color: '#10b981',
  },
  classesContainer: {
    padding: 20,
  },
  classesGrid: {
    // Grid layout handled by FlatList numColumns
  },
  classesList: {
    // List layout
  },
  classesListContent: {
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 