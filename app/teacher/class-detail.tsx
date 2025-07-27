import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Card, Chip, List, Divider, Badge, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AddStudentModal from '../../components/AddStudentModal';
import NewActivityModal from '../../components/NewActivityModal';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
  lastActivity: string;
  averageGrade: number;
  completedActivities: number;
  pendingActivities: number;
}

interface Activity {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  dueDate: string;
  status: 'draft' | 'published' | 'closed';
  submissions: number;
  totalStudents: number;
  averageGrade?: number;
  needsGrading: number;
}

interface ClassDetail {
  id: string;
  name: string;
  subject: string;
  period: string;
  institution: string;
  studentsCount: number;
  description: string;
  settings: {
    enableAICorrection: boolean;
    enableNotifications: boolean;
    enableReports: boolean;
    allowStudentUpload: boolean;
  };
  stats: {
    totalActivities: number;
    pendingCorrections: number;
    averageGrade: number;
    participationRate: number;
    activeStudents: number;
  };
}

// Dados mockados
const mockClassDetail: ClassDetail = {
  id: '1',
  name: 'Matemática - 9º Ano A',
  subject: 'Matemática',
  period: '2024.1',
  institution: 'Escola Municipal São José',
  studentsCount: 32,
  description: 'Turma focada em álgebra e geometria, com ênfase em resolução de problemas.',
  settings: {
    enableAICorrection: true,
    enableNotifications: true,
    enableReports: true,
    allowStudentUpload: true,
  },
  stats: {
    totalActivities: 15,
    pendingCorrections: 5,
    averageGrade: 8.4,
    participationRate: 87,
    activeStudents: 28,
  },
};

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    status: 'active',
    lastActivity: '2 horas atrás',
    averageGrade: 8.7,
    completedActivities: 12,
    pendingActivities: 2,
  },
  {
    id: '2',
    name: 'Bruno Santos',
    email: 'bruno.santos@email.com',
    status: 'active',
    lastActivity: '1 dia atrás',
    averageGrade: 7.9,
    completedActivities: 10,
    pendingActivities: 4,
  },
  {
    id: '3',
    name: 'Carla Oliveira',
    email: 'carla.oliveira@email.com',
    status: 'inactive',
    lastActivity: '3 dias atrás',
    averageGrade: 6.8,
    completedActivities: 8,
    pendingActivities: 6,
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Prova - Equações do 2º Grau',
    type: 'exam',
    dueDate: '2024-03-15',
    status: 'published',
    submissions: 28,
    totalStudents: 32,
    averageGrade: 8.2,
    needsGrading: 0,
  },
  {
    id: '2',
    title: 'Lista de Exercícios - Trigonometria',
    type: 'assignment',
    dueDate: '2024-03-20',
    status: 'published',
    submissions: 25,
    totalStudents: 32,
    needsGrading: 5,
  },
  {
    id: '3',
    title: 'Trabalho em Grupo - Geometria',
    type: 'project',
    dueDate: '2024-03-25',
    status: 'draft',
    submissions: 0,
    totalStudents: 32,
    needsGrading: 0,
  },
];

const subjectColors = {
  Matemática: '#FF6B35',
  Português: '#2563EB',
  Ciências: '#16A34A',
  História: '#7C3AED',
  Geografia: '#0891B2',
};

export default function ClassDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'activities'>('overview');
  const [addStudentModalVisible, setAddStudentModalVisible] = useState(false);
  const [newActivityModalVisible, setNewActivityModalVisible] = useState(false);

  useEffect(() => {
    const loadClassData = async () => {
      try {
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        setClassDetail(mockClassDetail);
        setStudents(mockStudents);
        setActivities(mockActivities);
        setLoading(false);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar dados da turma');
        setLoading(false);
      }
    };

    loadClassData();
  }, [params.id]);

  const getSubjectColor = (subject: string) => {
    return subjectColors[subject as keyof typeof subjectColors] || '#6b7280';
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return 'assignment';
      case 'quiz': return 'quiz';
      case 'project': return 'group-work';
      case 'exam': return 'school';
      default: return 'assignment';
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return '#3b82f6';
      case 'quiz': return '#10b981';
      case 'project': return '#f59e0b';
      case 'exam': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#16A34A';
      case 'inactive': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const handleAddStudents = (studentsData: any[]) => {
    // Simular adição de estudantes
    const newStudents = studentsData.map((student, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: student.name,
      email: student.email,
      status: 'active' as const,
      lastActivity: 'Agora',
      averageGrade: 0,
      completedActivities: 0,
      pendingActivities: 0,
    }));

    setStudents(prev => [...prev, ...newStudents]);
    Alert.alert('Sucesso', `${studentsData.length} estudantes adicionados com sucesso!`);
  };

  const handleCreateActivity = (activityData: any) => {
    // Simular criação de atividade
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      title: activityData.title,
      type: activityData.type,
      dueDate: activityData.dueDate,
      status: 'draft' as const,
      submissions: 0,
      totalStudents: classDetail?.studentsCount || 0,
      needsGrading: 0,
    };

    setActivities(prev => [newActivity, ...prev]);
    
    if (activityData.aiGenerated && activityData.questions) {
      Alert.alert(
        'Sucesso', 
        `Atividade criada com sucesso!\n\n${activityData.questions.length} questões geradas com IA foram incluídas.`
      );
    } else {
      Alert.alert('Sucesso', 'Atividade criada com sucesso!');
    }
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#e0e7ff' }]}>
              <MaterialIcons name="assignment" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.statValue}>{classDetail?.stats.totalActivities}</Text>
            <Text style={styles.statLabel}>Atividades</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
              <MaterialIcons name="pending" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.statValue}>{classDetail?.stats.pendingCorrections}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#d1fae5' }]}>
              <MaterialIcons name="trending-up" size={24} color="#10b981" />
            </View>
            <Text style={styles.statValue}>{classDetail?.stats.averageGrade}</Text>
            <Text style={styles.statLabel}>Média</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#ede9fe' }]}>
              <MaterialIcons name="people" size={24} color="#8b5cf6" />
            </View>
            <Text style={styles.statValue}>{classDetail?.stats.participationRate}%</Text>
            <Text style={styles.statLabel}>Participação</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Recent Activities */}
      <Card style={styles.sectionCard}>
        <Card.Title
          title="Atividades Recentes"
          titleStyle={styles.cardTitle}
          right={(props) => (
            <TouchableOpacity onPress={() => setActiveTab('activities')}>
              <Text style={styles.linkText}>Ver todas</Text>
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          {activities.slice(0, 3).map((activity, index) => (
            <View key={activity.id}>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <MaterialIcons 
                    name={getActivityTypeIcon(activity.type) as any} 
                    size={20} 
                    color={getActivityTypeColor(activity.type)} 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityMeta}>
                    {activity.submissions}/{activity.totalStudents} entregas
                    {activity.needsGrading > 0 && (
                      <Text style={styles.needsGrading}> • {activity.needsGrading} para corrigir</Text>
                    )}
                  </Text>
                </View>
                <View style={styles.activityStatus}>
                  <Chip
                    mode="flat"
                    textStyle={{ color: 'white', fontSize: 10 }}
                    style={[
                      styles.statusChip,
                      { backgroundColor: activity.status === 'published' ? '#10b981' : '#6b7280' }
                    ]}
                  >
                    {activity.status === 'published' ? 'Ativa' : 'Rascunho'}
                  </Chip>
                </View>
              </View>
              {index < Math.min(activities.length, 3) - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Class Settings */}
      <Card style={styles.sectionCard}>
        <Card.Title title="Configurações da Turma" titleStyle={styles.cardTitle} />
        <Card.Content>
          <View style={styles.settingItem}>
            <MaterialIcons name="psychology" size={20} color="#8b5cf6" />
            <Text style={styles.settingText}>Correção Automática com IA</Text>
            <View style={[
              styles.settingToggle,
              classDetail?.settings.enableAICorrection && styles.settingToggleActive
            ]} />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingItem}>
            <MaterialIcons name="notifications" size={20} color="#3b82f6" />
            <Text style={styles.settingText}>Notificações</Text>
            <View style={[
              styles.settingToggle,
              classDetail?.settings.enableNotifications && styles.settingToggleActive
            ]} />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingItem}>
            <MaterialIcons name="bar-chart" size={20} color="#10b981" />
            <Text style={styles.settingText}>Relatórios Automáticos</Text>
            <View style={[
              styles.settingToggle,
              classDetail?.settings.enableReports && styles.settingToggleActive
            ]} />
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderStudents = () => (
    <View style={styles.tabContent}>
      <View style={styles.studentsHeader}>
        <Text style={styles.studentsCount}>
          {students.length} estudantes • {students.filter(s => s.status === 'active').length} ativos
        </Text>
        <TouchableOpacity 
          style={styles.addStudentButton}
          onPress={() => setAddStudentModalVisible(true)}
        >
          <MaterialIcons name="person-add" size={20} color="white" />
          <Text style={styles.addStudentButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {students.map((student, index) => (
        <Card key={student.id} style={styles.studentCard}>
          <Card.Content>
            <View style={styles.studentHeader}>
              <View style={styles.studentInfo}>
                <View style={styles.studentAvatar}>
                  <Text style={styles.avatarText}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentEmail}>{student.email}</Text>
                </View>
              </View>
              <View style={styles.studentStatus}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(student.status) }]} />
                <Text style={styles.statusText}>
                  {student.status === 'active' ? 'Ativo' : 'Inativo'}
                </Text>
              </View>
            </View>

            <View style={styles.studentStats}>
              <View style={styles.studentStat}>
                <Text style={styles.statNumber}>{student.averageGrade}</Text>
                <Text style={styles.statLabel}>Média</Text>
              </View>
              <View style={styles.studentStat}>
                <Text style={styles.statNumber}>{student.completedActivities}</Text>
                <Text style={styles.statLabel}>Concluídas</Text>
              </View>
              <View style={styles.studentStat}>
                <Text style={styles.statNumber}>{student.pendingActivities}</Text>
                <Text style={styles.statLabel}>Pendentes</Text>
              </View>
              <View style={styles.studentStat}>
                <Text style={styles.statNumber}>{student.lastActivity}</Text>
                <Text style={styles.statLabel}>Última atividade</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  const renderActivities = () => (
    <View style={styles.tabContent}>
      <View style={styles.activitiesHeader}>
        <Text style={styles.activitiesCount}>
          {activities.length} atividades • {activities.filter(a => a.status === 'published').length} ativas
        </Text>
        <TouchableOpacity 
          style={styles.createActivityButton}
          onPress={() => setNewActivityModalVisible(true)}
        >
          <MaterialIcons name="add" size={20} color="white" />
          <Text style={styles.createActivityButtonText}>Nova Atividade</Text>
        </TouchableOpacity>
      </View>

      {activities.map((activity) => (
        <Card key={activity.id} style={styles.activityCard}>
          <Card.Content>
            <View style={styles.activityHeader}>
              <View style={styles.activityInfo}>
                <View style={[styles.activityTypeIcon, { backgroundColor: getActivityTypeColor(activity.type) + '20' }]}>
                  <MaterialIcons 
                    name={getActivityTypeIcon(activity.type) as any} 
                    size={20} 
                    color={getActivityTypeColor(activity.type)} 
                  />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>Vencimento: {activity.dueDate}</Text>
                </View>
              </View>
              <View style={styles.activityActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons name="edit" size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons name="more-vert" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.activityProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${(activity.submissions / activity.totalStudents) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {activity.submissions}/{activity.totalStudents} entregas
              </Text>
            </View>

            <View style={styles.activityFooter}>
              <Chip
                mode="flat"
                textStyle={{ color: 'white', fontSize: 10 }}
                style={[
                  styles.statusChip,
                  { backgroundColor: activity.status === 'published' ? '#10b981' : '#6b7280' }
                ]}
              >
                {activity.status === 'published' ? 'Ativa' : 'Rascunho'}
              </Chip>
              {activity.needsGrading > 0 && (
                <View style={styles.gradingBadge}>
                  <MaterialIcons name="assignment" size={12} color="white" />
                  <Text style={styles.gradingText}>{activity.needsGrading} para corrigir</Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando turma...</Text>
      </View>
    );
  }

  if (!classDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text>Turma não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#6b7280" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.className}>{classDetail.name}</Text>
          <View style={styles.headerMeta}>
            <Chip
              mode="flat"
              textStyle={{ color: 'white', fontSize: 12 }}
              style={[
                styles.subjectChip,
                { backgroundColor: getSubjectColor(classDetail.subject) }
              ]}
            >
              {classDetail.subject}
            </Chip>
            <Text style={styles.period}>{classDetail.period}</Text>
            <Text style={styles.institution}>{classDetail.institution}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <MaterialIcons name="settings" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Visão Geral
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'students' && styles.activeTab]}
          onPress={() => setActiveTab('students')}
        >
          <Text style={[styles.tabText, activeTab === 'students' && styles.activeTabText]}>
            Estudantes ({students.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
          onPress={() => setActiveTab('activities')}
        >
          <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
            Atividades ({activities.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'activities' && renderActivities()}
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="add"
        style={styles.fab}
        onPress={() => setNewActivityModalVisible(true)}
      />

      {/* Modals */}
      <AddStudentModal
        visible={addStudentModalVisible}
        onDismiss={() => setAddStudentModalVisible(false)}
        onSubmit={handleAddStudents}
        classId={classDetail.id}
      />

      <NewActivityModal
        visible={newActivityModalVisible}
        onDismiss={() => setNewActivityModalVisible(false)}
        onSubmit={handleCreateActivity}
        classId={classDetail.id}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  className: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subjectChip: {
    alignSelf: 'flex-start',
  },
  period: {
    fontSize: 14,
    color: '#6b7280',
  },
  institution: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingsButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    maxWidth: (width - 52) / 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  activityMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
  needsGrading: {
    color: '#f59e0b',
    fontWeight: '500',
  },
  activityStatus: {
    marginLeft: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  settingToggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
  },
  settingToggleActive: {
    backgroundColor: '#3b82f6',
  },
  studentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentsCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  addStudentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addStudentButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  studentCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 12,
    color: '#6b7280',
  },
  studentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
  studentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studentStat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activitiesCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  createActivityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  createActivityButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  activityCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  activityProgress: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  gradingText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
    marginLeft: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3b82f6',
  },
}); 