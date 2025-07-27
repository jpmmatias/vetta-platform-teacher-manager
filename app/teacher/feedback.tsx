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
import { Card, Chip, Button, Searchbar, FAB, ProgressBar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface FeedbackItem {
  id: string;
  type: 'class' | 'activity' | 'general';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  category: 'clarity' | 'difficulty' | 'engagement' | 'content' | 'technical' | 'other';
  submittedBy: string;
  submittedAt: string;
  class?: string;
  activity?: string;
  rating?: number;
  response?: string;
  tags: string[];
}

interface FeedbackStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  averageRating: number;
  satisfactionRate: number;
}

const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    type: 'class',
    title: 'Aula de Matemática muito clara e didática',
    description: 'A explicação sobre equações do 2º grau foi excelente! Os exemplos práticos ajudaram muito a entender o conceito.',
    status: 'resolved',
    priority: 'low',
    category: 'clarity',
    submittedBy: 'Ana Silva - 9º Ano A',
    submittedAt: '2024-12-15',
    class: 'Matemática 9º Ano A',
    rating: 5,
    tags: ['matemática', 'equações', 'positivo'],
  },
  {
    id: '2',
    type: 'activity',
    title: 'Lista de exercícios muito difícil',
    description: 'A atividade sobre geometria estava muito complexa para o nosso nível. Algumas questões precisavam de mais contexto.',
    status: 'in-progress',
    priority: 'high',
    category: 'difficulty',
    submittedBy: 'João Santos - 8º Ano B',
    submittedAt: '2024-12-14',
    class: 'Matemática 8º Ano B',
    activity: 'Lista de Exercícios - Geometria',
    tags: ['geometria', 'dificuldade', 'ajuda'],
  },
  {
    id: '3',
    type: 'class',
    title: 'Aula de História muito interessante',
    description: 'Adorei a aula sobre o período colonial! Os vídeos e imagens tornaram o conteúdo muito mais envolvente.',
    status: 'resolved',
    priority: 'low',
    category: 'engagement',
    submittedBy: 'Maria Costa - 8º Ano A',
    submittedAt: '2024-12-13',
    class: 'História 8º Ano A',
    rating: 5,
    tags: ['história', 'colonial', 'positivo'],
  },
  {
    id: '4',
    type: 'activity',
    title: 'Problemas técnicos na atividade online',
    description: 'Não consegui enviar a atividade porque o site estava travando. Tentei várias vezes mas não funcionou.',
    status: 'pending',
    priority: 'high',
    category: 'technical',
    submittedBy: 'Pedro Lima - 7º Ano A',
    submittedAt: '2024-12-12',
    class: 'Ciências 7º Ano A',
    activity: 'Quiz - Ecossistemas',
    tags: ['técnico', 'problema', 'online'],
  },
  {
    id: '5',
    type: 'general',
    title: 'Sugestão para mais atividades práticas',
    description: 'Gostaria de ter mais atividades práticas e experimentos nas aulas de Ciências. Aprendemos melhor fazendo.',
    status: 'pending',
    priority: 'medium',
    category: 'content',
    submittedBy: 'Fernanda Oliveira - 7º Ano B',
    submittedAt: '2024-12-11',
    class: 'Ciências 7º Ano B',
    response: 'Ótima sugestão! Vou incluir mais experimentos práticos nas próximas aulas.',
    tags: ['prática', 'experimentos', 'sugestão'],
  },
  {
    id: '6',
    type: 'class',
    title: 'Ritmo da aula muito acelerado',
    description: 'A aula de Português estava muito rápida. Não deu tempo de anotar tudo e alguns conceitos ficaram confusos.',
    status: 'in-progress',
    priority: 'medium',
    category: 'clarity',
    submittedBy: 'Roberto Almeida - 9º Ano B',
    submittedAt: '2024-12-10',
    class: 'Português 9º Ano B',
    tags: ['ritmo', 'velocidade', 'anotações'],
  },
];

const mockStats: FeedbackStats = {
  total: 156,
  pending: 23,
  inProgress: 8,
  resolved: 125,
  averageRating: 4.2,
  satisfactionRate: 87,
};

export default function TeacherFeedback() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'class' | 'activity' | 'general'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'in-progress' | 'resolved' | 'rejected'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clarity' | 'difficulty' | 'engagement' | 'content' | 'technical' | 'other'>('all');

  const filteredFeedback = mockFeedback.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const getTypeIcon = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'class': return 'school';
      case 'activity': return 'assignment';
      case 'general': return 'feedback';
      default: return 'feedback';
    }
  };

  const getTypeColor = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'class': return '#3b82f6';
      case 'activity': return '#10b981';
      case 'general': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTypeText = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'class': return 'Aula';
      case 'activity': return 'Atividade';
      case 'general': return 'Geral';
      default: return 'Feedback';
    }
  };

  const getStatusColor = (status: FeedbackItem['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'resolved': return '#10b981';
      case 'rejected': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: FeedbackItem['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em Andamento';
      case 'resolved': return 'Resolvido';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };

  const getPriorityColor = (priority: FeedbackItem['priority']) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleSubmitFeedback = () => {
    Alert.alert('Responder Feedback', 'Funcionalidade de resposta aos feedbacks será implementada');
  };

  const handleFeedbackPress = (feedback: FeedbackItem) => {
    Alert.alert(
      feedback.title,
      `${feedback.description}\n\nStatus: ${getStatusText(feedback.status)}\nPrioridade: ${feedback.priority}\nCategoria: ${feedback.category}`,
      [
        { text: 'Responder', onPress: () => Alert.alert('Responder', 'Funcionalidade de resposta será implementada') },
        { text: 'Editar', onPress: () => Alert.alert('Editar', 'Funcionalidade de edição será implementada') },
        { text: 'Fechar', style: 'cancel' },
      ]
    );
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="feedback" size={24} color="#3b82f6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockStats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="school" size={24} color="#3b82f6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockFeedback.filter(f => f.type === 'class').length}</Text>
              <Text style={styles.statLabel}>Aulas</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="assignment" size={24} color="#10b981" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockFeedback.filter(f => f.type === 'activity').length}</Text>
              <Text style={styles.statLabel}>Atividades</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="star" size={24} color="#f59e0b" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockStats.averageRating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="thumb-up" size={24} color="#10b981" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockStats.satisfactionRate}%</Text>
              <Text style={styles.statLabel}>Satisfação</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filters}>
      <Text style={styles.filtersTitle}>Filtrar por:</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === 'class' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('class')}
        >
          <Text style={[styles.filterText, selectedFilter === 'class' && styles.filterTextActive]}>
            Aulas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === 'activity' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('activity')}
        >
          <Text style={[styles.filterText, selectedFilter === 'activity' && styles.filterTextActive]}>
            Atividades
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === 'general' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('general')}
        >
          <Text style={[styles.filterText, selectedFilter === 'general' && styles.filterTextActive]}>
            Geral
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderFeedbackCard = (feedback: FeedbackItem) => (
    <Card key={feedback.id} style={styles.feedbackCard}>
      <Card.Content>
        <View style={styles.feedbackHeader}>
          <View style={styles.feedbackInfo}>
            <View style={styles.feedbackTitleRow}>
              <MaterialIcons name={getTypeIcon(feedback.type)} size={20} color={getTypeColor(feedback.type)} />
              <Text style={styles.feedbackTitle}>{feedback.title}</Text>
            </View>
            <Text style={styles.feedbackDescription}>{feedback.description}</Text>
          </View>
          <View style={styles.feedbackMeta}>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(feedback.status) + '20' }]}
              textStyle={{ color: getStatusColor(feedback.status) }}
            >
              {getStatusText(feedback.status)}
            </Chip>
          </View>
        </View>

        <View style={styles.feedbackDetails}>
          <View style={styles.feedbackDetail}>
            <MaterialIcons name="person" size={16} color="#6b7280" />
            <Text style={styles.feedbackDetailText}>{feedback.submittedBy}</Text>
          </View>
          <View style={styles.feedbackDetail}>
            <MaterialIcons name="schedule" size={16} color="#6b7280" />
            <Text style={styles.feedbackDetailText}>{feedback.submittedAt}</Text>
          </View>
          <View style={styles.feedbackDetail}>
            <MaterialIcons name="priority-high" size={16} color={getPriorityColor(feedback.priority)} />
            <Text style={[styles.feedbackDetailText, { color: getPriorityColor(feedback.priority) }]}>
              {feedback.priority === 'high' ? 'Alta' : feedback.priority === 'medium' ? 'Média' : 'Baixa'}
            </Text>
          </View>
        </View>

        {feedback.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {feedback.tags.map((tag, index) => (
              <Chip key={index} style={styles.tagChip} textStyle={styles.tagText}>
                {tag}
              </Chip>
            ))}
          </View>
        )}

        {feedback.response && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Resposta:</Text>
            <Text style={styles.responseText}>{feedback.response}</Text>
          </View>
        )}

        {feedback.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Avaliação:</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <MaterialIcons
                  key={star}
                  name={star <= feedback.rating! ? "star" : "star-border"}
                  size={16}
                  color="#f59e0b"
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.feedbackActions}>
          <Button
            mode="outlined"
            onPress={() => handleFeedbackPress(feedback)}
            style={styles.feedbackActionButton}
          >
            Detalhes
          </Button>
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Responder', 'Responder ao feedback')}
            style={styles.feedbackActionButton}
          >
            Responder
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feedback dos Alunos</Text>
        <Text style={styles.subtitle}>Avaliações e sugestões sobre suas aulas e atividades</Text>
      </View>

      {renderStats()}

      <Searchbar
        placeholder="Buscar feedback dos alunos..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {renderFilters()}

      <View style={styles.feedbackSection}>
        <View style={styles.feedbackHeader}>
          <Text style={styles.sectionTitle}>Feedback dos Alunos</Text>
          <Text style={styles.feedbackCount}>{filteredFeedback.length} itens</Text>
        </View>

        <ScrollView style={styles.feedbackList}>
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map(renderFeedbackCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="feedback" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Nenhum feedback encontrado</Text>
              <Text style={styles.emptyText}>
                Não há feedback dos alunos que corresponda aos filtros selecionados.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleSubmitFeedback}
        label="Responder"
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
  feedbackSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  feedbackCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  feedbackList: {
    flex: 1,
  },
  feedbackCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  feedbackInfo: {
    flex: 1,
    marginRight: 12,
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  feedbackDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  feedbackMeta: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 0,
  },
  feedbackDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  feedbackDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedbackDetailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tagChip: {
    backgroundColor: '#f3f4f6',
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
  },
  responseContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  feedbackActions: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackActionButton: {
    flex: 1,
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