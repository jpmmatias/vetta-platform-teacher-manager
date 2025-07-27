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
import { Modal, Portal, Card, Button, TextInput, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface QuickActivityData {
  title: string;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  description: string;
  class: string;
  dueDate: string;
  maxGrade: number;
  useAI: boolean;
}

interface QuickActivityModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (activity: QuickActivityData) => void;
}

const activityTypes = [
  {
    id: 'assignment',
    name: 'Lista de Exercícios',
    description: 'Atividade com questões e problemas',
    icon: 'assignment',
    color: '#3b82f6',
    estimatedTime: '15 min',
  },
  {
    id: 'quiz',
    name: 'Quiz',
    description: 'Questionário de múltipla escolha',
    icon: 'quiz',
    color: '#10b981',
    estimatedTime: '10 min',
  },
  {
    id: 'project',
    name: 'Projeto',
    description: 'Trabalho prático ou pesquisa',
    icon: 'work',
    color: '#f59e0b',
    estimatedTime: '45 min',
  },
  {
    id: 'exam',
    name: 'Prova',
    description: 'Avaliação formal',
    icon: 'school',
    color: '#dc2626',
    estimatedTime: '60 min',
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

const quickTemplates = [
  {
    id: 'math-exercises',
    title: 'Lista de Exercícios - Matemática',
    description: 'Problemas de equações e geometria',
    type: 'assignment',
    icon: 'functions',
    color: '#3b82f6',
  },
  {
    id: 'history-quiz',
    title: 'Quiz - História do Brasil',
    description: 'Questionário sobre período colonial',
    type: 'quiz',
    icon: 'history',
    color: '#10b981',
  },
  {
    id: 'science-project',
    title: 'Projeto - Sustentabilidade',
    description: 'Pesquisa sobre meio ambiente',
    type: 'project',
    icon: 'eco',
    color: '#f59e0b',
  },
  {
    id: 'portuguese-exam',
    title: 'Prova - Literatura',
    description: 'Avaliação sobre Modernismo',
    type: 'exam',
    icon: 'book',
    color: '#dc2626',
  },
];

export default function QuickActivityModal({
  visible,
  onDismiss,
  onSave,
}: QuickActivityModalProps) {
  const [activityData, setActivityData] = useState<QuickActivityData>({
    title: '',
    type: 'assignment',
    description: '',
    class: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias
    maxGrade: 10,
    useAI: false,
  });

  const [showClassSelector, setShowClassSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSave = () => {
    if (!activityData.title.trim()) {
      Alert.alert('Erro', 'Por favor, insira um título para a atividade.');
      return;
    }

    if (!activityData.class.trim()) {
      Alert.alert('Erro', 'Por favor, selecione uma turma.');
      return;
    }

    onSave(activityData);
    handleReset();
  };

  const handleReset = () => {
    setActivityData({
      title: '',
      type: 'assignment',
      description: '',
      class: '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxGrade: 10,
      useAI: false,
    });
    setSelectedTemplate(null);
  };

  const handleDismiss = () => {
    handleReset();
    onDismiss();
  };

  const handleTemplateSelect = (template: typeof quickTemplates[0]) => {
    setSelectedTemplate(template.id);
    setActivityData({
      ...activityData,
      title: template.title,
      type: template.type as any,
      description: template.description,
    });
  };

  const renderTemplates = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Templates Rápidos</Text>
        <Text style={styles.sectionDescription}>
          Escolha um modelo pronto para começar rapidamente
        </Text>
        
        <View style={styles.templatesContainer}>
          {quickTemplates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={[
                styles.templateOption,
                selectedTemplate === template.id && styles.templateOptionSelected,
              ]}
              onPress={() => handleTemplateSelect(template)}
            >
              <View style={styles.templateHeader}>
                <View style={[styles.templateIcon, { backgroundColor: template.color + '20' }]}>
                  <MaterialIcons name={template.icon as any} size={24} color={template.color} />
                </View>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateName}>{template.title}</Text>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                </View>
                {selectedTemplate === template.id && (
                  <MaterialIcons name="check-circle" size={24} color={template.color} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderTypeSelector = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Tipo de Atividade</Text>
        <Text style={styles.sectionDescription}>
          Escolha o tipo mais adequado
        </Text>
        
        <View style={styles.typesContainer}>
          {activityTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeOption,
                activityData.type === type.id && styles.typeOptionSelected,
              ]}
              onPress={() => setActivityData({ ...activityData, type: type.id as any })}
            >
              <View style={styles.typeHeader}>
                <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                  <MaterialIcons name={type.icon as any} size={24} color={type.color} />
                </View>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeName}>{type.name}</Text>
                  <Text style={styles.typeDescription}>{type.description}</Text>
                  <Text style={styles.typeTime}>~{type.estimatedTime}</Text>
                </View>
                {activityData.type === type.id && (
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
          label="Título da Atividade"
          value={activityData.title}
          onChangeText={(text) => setActivityData({ ...activityData, title: text })}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Descrição"
          value={activityData.description}
          onChangeText={(text) => setActivityData({ ...activityData, description: text })}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowClassSelector(true)}
        >
          <View style={styles.selectorContent}>
            <MaterialIcons name="class" size={20} color="#6b7280" />
            <Text style={styles.selectorText}>
              {activityData.class || 'Selecionar turma'}
            </Text>
          </View>
          <MaterialIcons name="arrow-drop-down" size={24} color="#6b7280" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderSettings = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Configurações</Text>
        
        <View style={styles.row}>
          <TextInput
            label="Data de Entrega"
            value={activityData.dueDate}
            onChangeText={(text) => setActivityData({ ...activityData, dueDate: text })}
            style={[styles.input, styles.halfInput]}
            mode="outlined"
            placeholder="YYYY-MM-DD"
          />
          
          <TextInput
            label="Nota Máxima"
            value={activityData.maxGrade.toString()}
            onChangeText={(text) => setActivityData({ ...activityData, maxGrade: parseInt(text) || 10 })}
            style={[styles.input, styles.halfInput]}
            mode="outlined"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.aiOption}>
          <View style={styles.aiOptionInfo}>
            <MaterialIcons name="psychology" size={20} color="#8b5cf6" />
            <View style={styles.aiOptionText}>
              <Text style={styles.aiOptionTitle}>Usar IA para gerar conteúdo</Text>
              <Text style={styles.aiOptionDescription}>
                Deixe a IA criar questões e instruções automaticamente
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.aiToggle,
              activityData.useAI && styles.aiToggleActive,
            ]}
            onPress={() => setActivityData({ ...activityData, useAI: !activityData.useAI })}
          >
            <View style={[
              styles.aiToggleHandle,
              activityData.useAI && styles.aiToggleHandleActive,
            ]} />
          </TouchableOpacity>
        </View>
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
          <Text style={styles.modalTitle}>Nova Atividade Rápida</Text>
          <TouchableOpacity onPress={handleDismiss}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {renderTemplates()}
          {renderTypeSelector()}
          {renderBasicInfo()}
          {renderSettings()}
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
            Criar Atividade
          </Button>
        </View>

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
                  setActivityData({ ...activityData, class: className });
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
  templatesContainer: {
    gap: 12,
  },
  templateOption: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  templateOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f620',
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  templateDescription: {
    fontSize: 14,
    color: '#6b7280',
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
    marginBottom: 2,
  },
  typeTime: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '500',
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
  aiOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  aiOptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  aiOptionText: {
    marginLeft: 12,
    flex: 1,
  },
  aiOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  aiOptionDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  aiToggle: {
    width: 44,
    height: 24,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 2,
  },
  aiToggleActive: {
    backgroundColor: '#8b5cf6',
  },
  aiToggleHandle: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  aiToggleHandleActive: {
    transform: [{ translateX: 20 }],
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