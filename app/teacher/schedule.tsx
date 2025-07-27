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
import AddEventModal from '../../components/AddEventModal';

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'class' | 'activity' | 'exam' | 'meeting' | 'deadline';
  description: string;
  date: string;
  time: string;
  duration: number; // em minutos
  location: string;
  class?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'completed' | 'cancelled';
  color: string;
}

interface DaySchedule {
  date: string;
  dayName: string;
  dayNumber: string;
  events: ScheduleEvent[];
  isToday: boolean;
  isSelected: boolean;
}

const mockEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Aula - Matemática 9º Ano A',
    type: 'class',
    description: 'Equações do 2º grau - Resolução de problemas',
    date: '2024-12-16',
    time: '08:00',
    duration: 50,
    location: 'Sala 201',
    class: 'Matemática 9º Ano A',
    priority: 'medium',
    status: 'scheduled',
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Entrega - Lista de Exercícios',
    type: 'deadline',
    description: 'Prazo final para entrega da lista de equações',
    date: '2024-12-16',
    time: '23:59',
    duration: 0,
    location: 'Online',
    class: 'Matemática 9º Ano A',
    priority: 'high',
    status: 'scheduled',
    color: '#dc2626',
  },
  {
    id: '3',
    title: 'Aula - História 8º Ano B',
    type: 'class',
    description: 'História do Brasil Colonial - Economia açucareira',
    date: '2024-12-16',
    time: '10:30',
    duration: 50,
    location: 'Sala 105',
    class: 'História 8º Ano B',
    priority: 'medium',
    status: 'scheduled',
    color: '#10b981',
  },
  {
    id: '4',
    title: 'Reunião Pedagógica',
    type: 'meeting',
    description: 'Discussão sobre planejamento do próximo trimestre',
    date: '2024-12-16',
    time: '14:00',
    duration: 60,
    location: 'Sala dos Professores',
    priority: 'high',
    status: 'scheduled',
    color: '#8b5cf6',
  },
  {
    id: '5',
    title: 'Prova - Ciências 7º Ano A',
    type: 'exam',
    description: 'Avaliação sobre ecossistemas e biodiversidade',
    date: '2024-12-17',
    time: '08:00',
    duration: 80,
    location: 'Sala 203',
    class: 'Ciências 7º Ano A',
    priority: 'high',
    status: 'scheduled',
    color: '#f59e0b',
  },
  {
    id: '6',
    title: 'Aula - Português 9º Ano B',
    type: 'class',
    description: 'Literatura Brasileira - Modernismo',
    date: '2024-12-17',
    time: '13:30',
    duration: 50,
    location: 'Sala 108',
    class: 'Português 9º Ano B',
    priority: 'medium',
    status: 'scheduled',
    color: '#06b6d4',
  },
  {
    id: '7',
    title: 'Correção de Atividades',
    type: 'activity',
    description: 'Correção das atividades de Matemática',
    date: '2024-12-18',
    time: '16:00',
    duration: 90,
    location: 'Sala dos Professores',
    priority: 'low',
    status: 'scheduled',
    color: '#84cc16',
  },
];

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function TeacherSchedule() {
  const [selectedDate, setSelectedDate] = useState('2024-12-16');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'class' | 'activity' | 'exam' | 'meeting' | 'deadline'>('all');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // Gerar dados da semana atual
  const generateWeekData = (): DaySchedule[] => {
    const today = new Date('2024-12-16'); // Data fixa para demonstração
    const weekData: DaySchedule[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayName = weekDays[date.getDay()];
      const dayNumber = date.getDate().toString();
      
      const dayEvents = mockEvents.filter(event => event.date === dateString);
      
      weekData.push({
        date: dateString,
        dayName,
        dayNumber,
        events: dayEvents,
        isToday: dateString === '2024-12-16',
        isSelected: dateString === selectedDate,
      });
    }

    return weekData;
  };

  const weekData = generateWeekData();
  const selectedDayEvents = weekData.find(day => day.date === selectedDate)?.events || [];

  const filteredEvents = selectedDayEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'class': return 'school';
      case 'activity': return 'assignment';
      case 'exam': return 'quiz';
      case 'meeting': return 'people';
      case 'deadline': return 'schedule';
      default: return 'event';
    }
  };

  const getTypeText = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'class': return 'Aula';
      case 'activity': return 'Atividade';
      case 'exam': return 'Prova';
      case 'meeting': return 'Reunião';
      case 'deadline': return 'Prazo';
      default: return 'Evento';
    }
  };

  const getPriorityColor = (priority: ScheduleEvent['priority']) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleEventPress = (event: ScheduleEvent) => {
    Alert.alert(
      event.title,
      `${event.description}\n\nHorário: ${event.time}\nDuração: ${event.duration} min\nLocal: ${event.location}`,
      [
        { text: 'Editar', onPress: () => Alert.alert('Editar', 'Funcionalidade de edição será implementada') },
        { text: 'Cancelar', onPress: () => Alert.alert('Cancelar', 'Funcionalidade de cancelamento será implementada') },
        { text: 'Fechar', style: 'cancel' },
      ]
    );
  };

  const handleAddEvent = () => {
    setShowAddEventModal(true);
  };

  const handleSaveEvent = (eventData: any) => {
    // Aqui você pode adicionar a lógica para salvar o evento
    Alert.alert('Sucesso', 'Evento adicionado com sucesso!');
    setShowAddEventModal(false);
  };

  const renderWeekCalendar = () => (
    <Card style={styles.calendarCard}>
      <Card.Content>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>Esta Semana</Text>
          <View style={styles.viewModeToggle}>
            <TouchableOpacity
              style={[styles.viewModeButton, viewMode === 'week' && styles.viewModeButtonActive]}
              onPress={() => setViewMode('week')}
            >
              <Text style={[styles.viewModeText, viewMode === 'week' && styles.viewModeTextActive]}>
                Semana
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewModeButton, viewMode === 'month' && styles.viewModeButtonActive]}
              onPress={() => setViewMode('month')}
            >
              <Text style={[styles.viewModeText, viewMode === 'month' && styles.viewModeTextActive]}>
                Mês
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.weekContainer}>
          {weekData.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayColumn,
                day.isToday && styles.todayColumn,
                day.isSelected && styles.selectedColumn,
              ]}
              onPress={() => setSelectedDate(day.date)}
            >
              <Text style={[
                styles.dayName,
                day.isToday && styles.todayText,
                day.isSelected && styles.selectedText,
              ]}>
                {day.dayName}
              </Text>
              <Text style={[
                styles.dayNumber,
                day.isToday && styles.todayText,
                day.isSelected && styles.selectedText,
              ]}>
                {day.dayNumber}
              </Text>
              {day.events.length > 0 && (
                <View style={styles.eventIndicator}>
                  <Text style={styles.eventCount}>{day.events.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderEventCard = (event: ScheduleEvent) => (
    <Card key={event.id} style={[styles.eventCard, { borderLeftColor: event.color }]}>
      <Card.Content>
        <View style={styles.eventHeader}>
          <View style={styles.eventInfo}>
            <View style={styles.eventTitleRow}>
              <MaterialIcons name={getTypeIcon(event.type)} size={20} color={event.color} />
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </View>
          <View style={styles.eventMeta}>
            <Chip style={[styles.priorityChip, { backgroundColor: getPriorityColor(event.priority) + '20' }]}>
              {event.priority === 'high' ? 'Alta' : event.priority === 'medium' ? 'Média' : 'Baixa'}
            </Chip>
          </View>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <MaterialIcons name="schedule" size={16} color="#6b7280" />
            <Text style={styles.eventDetailText}>{event.time}</Text>
            {event.duration > 0 && (
              <Text style={styles.eventDetailText}> • {event.duration}min</Text>
            )}
          </View>
          <View style={styles.eventDetail}>
            <MaterialIcons name="location-on" size={16} color="#6b7280" />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
          {event.class && (
            <View style={styles.eventDetail}>
              <MaterialIcons name="class" size={16} color="#6b7280" />
              <Text style={styles.eventDetailText}>{event.class}</Text>
            </View>
          )}
        </View>

        <View style={styles.eventActions}>
          <Button
            mode="outlined"
            onPress={() => handleEventPress(event)}
            style={styles.eventActionButton}
          >
            Detalhes
          </Button>
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Editar', 'Editar evento')}
            style={styles.eventActionButton}
          >
            Editar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderFilters = () => (
    <View style={styles.filters}>
      <Text style={styles.filtersTitle}>Filtros:</Text>
      
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
          style={[styles.filterChip, selectedFilter === 'exam' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('exam')}
        >
          <Text style={[styles.filterText, selectedFilter === 'exam' && styles.filterTextActive]}>
            Provas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === 'meeting' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('meeting')}
        >
          <Text style={[styles.filterText, selectedFilter === 'meeting' && styles.filterTextActive]}>
            Reuniões
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === 'deadline' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('deadline')}
        >
          <Text style={[styles.filterText, selectedFilter === 'deadline' && styles.filterTextActive]}>
            Prazos
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="event" size={24} color="#3b82f6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{selectedDayEvents.length}</Text>
              <Text style={styles.statLabel}>Eventos Hoje</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="school" size={24} color="#10b981" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {selectedDayEvents.filter(e => e.type === 'class').length}
              </Text>
              <Text style={styles.statLabel}>Aulas</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="priority-high" size={24} color="#dc2626" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {selectedDayEvents.filter(e => e.priority === 'high').length}
              </Text>
              <Text style={styles.statLabel}>Prioridade Alta</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cronograma</Text>
        <Text style={styles.subtitle}>Organize suas aulas e atividades</Text>
      </View>

      {renderStats()}

      {renderWeekCalendar()}

      <Searchbar
        placeholder="Buscar eventos..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {renderFilters()}

      <View style={styles.eventsSection}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>
            Eventos - {new Date(selectedDate).toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          <Text style={styles.eventsCount}>{filteredEvents.length} eventos</Text>
        </View>

        <ScrollView style={styles.eventsList}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map(renderEventCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="event-busy" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Nenhum evento encontrado</Text>
              <Text style={styles.emptyText}>
                Não há eventos para o dia selecionado ou que correspondam aos filtros.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddEvent}
        label="Adicionar Evento"
      />

      <AddEventModal
        visible={showAddEventModal}
        onDismiss={() => setShowAddEventModal(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
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
  calendarCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: 'white',
  },
  viewModeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  viewModeTextActive: {
    color: '#111827',
  },
  weekContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  todayColumn: {
    backgroundColor: '#3b82f620',
  },
  selectedColumn: {
    backgroundColor: '#3b82f6',
  },
  dayName: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  todayText: {
    color: '#3b82f6',
  },
  selectedText: {
    color: 'white',
  },
  eventIndicator: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCount: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
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
  eventsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  eventsCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    borderLeftWidth: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  eventMeta: {
    alignItems: 'flex-end',
  },
  priorityChip: {
    marginBottom: 0,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },
  eventActionButton: {
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