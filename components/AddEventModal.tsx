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
import { Modal, Portal, Card, Button, TextInput, Switch, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface EventData {
  title: string;
  type: 'class' | 'activity' | 'exam' | 'meeting' | 'deadline';
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  class?: string;
  priority: 'low' | 'medium' | 'high';
  isRecurring: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly';
  recurrenceEnd?: string;
  reminder?: string;
}

interface AddEventModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (event: EventData) => void;
  selectedDate?: string;
}

const eventTypes = [
  {
    id: 'class',
    name: 'Aula',
    description: 'Horário regular de ensino',
    icon: 'school',
    color: '#3b82f6',
  },
  {
    id: 'activity',
    name: 'Atividade',
    description: 'Correções, preparações',
    icon: 'assignment',
    color: '#84cc16',
  },
  {
    id: 'exam',
    name: 'Prova',
    description: 'Avaliações e exames',
    icon: 'quiz',
    color: '#f59e0b',
  },
  {
    id: 'meeting',
    name: 'Reunião',
    description: 'Encontros pedagógicos',
    icon: 'people',
    color: '#8b5cf6',
  },
  {
    id: 'deadline',
    name: 'Prazo',
    description: 'Deadlines de entregas',
    icon: 'schedule',
    color: '#dc2626',
  },
];

const mockClasses = [
  'Matemática 9º Ano A',
  'História 8º Ano B',
  'Ciências 7º Ano A',
  'Português 9º Ano B',
  'Geografia 8º Ano A',
  'Inglês 7º Ano B',
];

const mockLocations = [
  'Sala 201',
  'Sala 105',
  'Sala 203',
  'Sala 108',
  'Sala dos Professores',
  'Laboratório de Informática',
  'Auditório',
  'Online',
];

export default function AddEventModal({
  visible,
  onDismiss,
  onSave,
  selectedDate,
}: AddEventModalProps) {
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    type: 'class',
    description: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    time: '08:00',
    duration: 50,
    location: '',
    class: '',
    priority: 'medium',
    isRecurring: false,
  });

  const [showClassSelector, setShowClassSelector] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  const handleSave = () => {
    if (!eventData.title.trim()) {
      Alert.alert('Erro', 'Por favor, insira um título para o evento.');
      return;
    }

    if (!eventData.location.trim()) {
      Alert.alert('Erro', 'Por favor, insira um local para o evento.');
      return;
    }

    onSave(eventData);
    handleReset();
  };

  const handleReset = () => {
    setEventData({
      title: '',
      type: 'class',
      description: '',
      date: selectedDate || new Date().toISOString().split('T')[0],
      time: '08:00',
      duration: 50,
      location: '',
      class: '',
      priority: 'medium',
      isRecurring: false,
    });
  };

  const handleDismiss = () => {
    handleReset();
    onDismiss();
  };

  const renderTypeSelector = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Tipo de Evento</Text>
        <Text style={styles.sectionDescription}>
          Escolha o tipo mais adequado para o evento
        </Text>
        
        <View style={styles.typesContainer}>
          {eventTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeOption,
                eventData.type === type.id && styles.typeOptionSelected,
              ]}
              onPress={() => setEventData({ ...eventData, type: type.id as any })}
            >
              <View style={styles.typeHeader}>
                <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                  <MaterialIcons name={type.icon as any} size={24} color={type.color} />
                </View>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeName}>{type.name}</Text>
                  <Text style={styles.typeDescription}>{type.description}</Text>
                </View>
                {eventData.type === type.id && (
                  <MaterialIcons name="check-circle" size={24} color={type.color} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderBasicInfo = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        
        <TextInput
          label="Título do Evento"
          value={eventData.title}
          onChangeText={(text) => setEventData({ ...eventData, title: text })}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Descrição"
          value={eventData.description}
          onChangeText={(text) => setEventData({ ...eventData, description: text })}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />
      </Card.Content>
    </Card>
  );

  const renderDateTime = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Data e Horário</Text>
        
        <View style={styles.row}>
          <TextInput
            label="Data"
            value={eventData.date}
            onChangeText={(text) => setEventData({ ...eventData, date: text })}
            style={[styles.input, styles.halfInput]}
            mode="outlined"
            keyboardType="numeric"
            placeholder="YYYY-MM-DD"
          />
          
          <TextInput
            label="Horário"
            value={eventData.time}
            onChangeText={(text) => setEventData({ ...eventData, time: text })}
            style={[styles.input, styles.halfInput]}
            mode="outlined"
            placeholder="HH:MM"
          />
        </View>
        
        <TextInput
          label="Duração (minutos)"
          value={eventData.duration.toString()}
          onChangeText={(text) => setEventData({ ...eventData, duration: parseInt(text) || 0 })}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
        />
      </Card.Content>
    </Card>
  );

  const renderLocationAndClass = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Local e Turma</Text>
        
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowLocationSelector(true)}
        >
          <View style={styles.selectorContent}>
            <MaterialIcons name="location-on" size={20} color="#6b7280" />
            <Text style={styles.selectorText}>
              {eventData.location || 'Selecionar local'}
            </Text>
          </View>
          <MaterialIcons name="arrow-drop-down" size={24} color="#6b7280" />
        </TouchableOpacity>
        
        {eventData.type === 'class' && (
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowClassSelector(true)}
          >
            <View style={styles.selectorContent}>
              <MaterialIcons name="class" size={20} color="#6b7280" />
              <Text style={styles.selectorText}>
                {eventData.class || 'Selecionar turma'}
              </Text>
            </View>
            <MaterialIcons name="arrow-drop-down" size={24} color="#6b7280" />
          </TouchableOpacity>
        )}
      </Card.Content>
    </Card>
  );

  const renderPriority = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Prioridade</Text>
        
        <View style={styles.priorityContainer}>
          <TouchableOpacity
            style={[
              styles.priorityOption,
              eventData.priority === 'low' && styles.priorityOptionSelected,
            ]}
            onPress={() => setEventData({ ...eventData, priority: 'low' })}
          >
            <View style={[styles.priorityIndicator, { backgroundColor: '#10b981' }]} />
            <Text style={styles.priorityText}>Baixa</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.priorityOption,
              eventData.priority === 'medium' && styles.priorityOptionSelected,
            ]}
            onPress={() => setEventData({ ...eventData, priority: 'medium' })}
          >
            <View style={[styles.priorityIndicator, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.priorityText}>Média</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.priorityOption,
              eventData.priority === 'high' && styles.priorityOptionSelected,
            ]}
            onPress={() => setEventData({ ...eventData, priority: 'high' })}
          >
            <View style={[styles.priorityIndicator, { backgroundColor: '#dc2626' }]} />
            <Text style={styles.priorityText}>Alta</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const renderRecurrence = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.recurrenceHeader}>
          <Text style={styles.sectionTitle}>Recorrência</Text>
          <Switch
            value={eventData.isRecurring}
            onValueChange={(value) => setEventData({ ...eventData, isRecurring: value })}
            color="#3b82f6"
          />
        </View>
        
        {eventData.isRecurring && (
          <View style={styles.recurrenceOptions}>
            <Text style={styles.sectionDescription}>
              Configure a recorrência do evento
            </Text>
            {/* Aqui você pode adicionar opções de recorrência */}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Adicionar Evento</Text>
          <TouchableOpacity onPress={handleDismiss}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {renderTypeSelector()}
          {renderBasicInfo()}
          {renderDateTime()}
          {renderLocationAndClass()}
          {renderPriority()}
          {renderRecurrence()}
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            mode="outlined"
            onPress={handleDismiss}
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            icon="check"
          >
            Salvar Evento
          </Button>
        </View>

        {/* Modal para seleção de local */}
        <Modal
          visible={showLocationSelector}
          onDismiss={() => setShowLocationSelector(false)}
          contentContainerStyle={styles.selectorModal}
        >
          <View style={styles.selectorModalHeader}>
            <Text style={styles.selectorModalTitle}>Selecionar Local</Text>
            <TouchableOpacity onPress={() => setShowLocationSelector(false)}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {mockLocations.map((location) => (
              <TouchableOpacity
                key={location}
                style={styles.selectorOption}
                onPress={() => {
                  setEventData({ ...eventData, location });
                  setShowLocationSelector(false);
                }}
              >
                <Text style={styles.selectorOptionText}>{location}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>

        {/* Modal para seleção de turma */}
        <Modal
          visible={showClassSelector}
          onDismiss={() => setShowClassSelector(false)}
          contentContainerStyle={styles.selectorModal}
        >
          <View style={styles.selectorModalHeader}>
            <Text style={styles.selectorModalTitle}>Selecionar Turma</Text>
            <TouchableOpacity onPress={() => setShowClassSelector(false)}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {mockClasses.map((className) => (
              <TouchableOpacity
                key={className}
                style={styles.selectorOption}
                onPress={() => {
                  setEventData({ ...eventData, class: className });
                  setShowClassSelector(false);
                }}
              >
                <Text style={styles.selectorOptionText}>{className}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      </Modal>
    </Portal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    maxHeight: '90%',
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
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    borderColor: '#d1d5db',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
  },
  sectionCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  typesContainer: {
    gap: 12,
  },
  typeOption: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  typeOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f620',
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  typeDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectorText: {
    fontSize: 16,
    color: '#374151',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    gap: 8,
  },
  priorityOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f620',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  recurrenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recurrenceOptions: {
    marginTop: 16,
  },
  selectorModal: {
    backgroundColor: 'white',
    margin: 40,
    borderRadius: 16,
    maxHeight: '80%',
  },
  selectorModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectorModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  selectorOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectorOptionText: {
    fontSize: 16,
    color: '#374151',
  },
}); 