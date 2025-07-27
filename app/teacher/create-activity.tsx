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
import { Card, Chip, Button, Searchbar, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import NewActivityModal from '../../components/NewActivityModal';

interface Class {
  id: string;
  name: string;
  subject: string;
  grade: string;
  studentCount: number;
}

const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Matemática 9º Ano A',
    subject: 'Matemática',
    grade: '9º Ano',
    studentCount: 25,
  },
  {
    id: '2',
    name: 'História 8º Ano B',
    subject: 'História',
    grade: '8º Ano',
    studentCount: 28,
  },
  {
    id: '3',
    name: 'Ciências 7º Ano A',
    subject: 'Ciências',
    grade: '7º Ano',
    studentCount: 30,
  },
  {
    id: '4',
    name: 'Português 9º Ano B',
    subject: 'Português',
    grade: '9º Ano',
    studentCount: 22,
  },
  {
    id: '5',
    name: 'Matemática 3º Ano EM',
    subject: 'Matemática',
    grade: '3º Ano EM',
    studentCount: 20,
  },
];

const activityTemplates = [
  {
    id: 'template-1',
    title: 'Lista de Exercícios - Padrão',
    type: 'assignment',
    description: 'Template básico para lista de exercícios com questões de diferentes tipos.',
    icon: 'assignment',
    color: '#3b82f6',
  },
  {
    id: 'template-2',
    title: 'Quiz - Múltipla Escolha',
    type: 'quiz',
    description: 'Template para quiz com questões de múltipla escolha e verdadeiro/falso.',
    icon: 'quiz',
    color: '#10b981',
  },
  {
    id: 'template-3',
    title: 'Projeto - Interdisciplinar',
    type: 'project',
    description: 'Template para projeto que envolve múltiplas disciplinas.',
    icon: 'group-work',
    color: '#f59e0b',
  },
  {
    id: 'template-4',
    title: 'Prova - Avaliação Formal',
    type: 'exam',
    description: 'Template para prova com questões de diferentes níveis de dificuldade.',
    icon: 'school',
    color: '#dc2626',
  },
];

export default function CreateActivity() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [creationMethod, setCreationMethod] = useState<'manual' | 'ai' | 'template'>('manual');

  const filteredClasses = mockClasses.filter(classItem => 
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classItem.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateManual = () => {
    if (!selectedClass) {
      Alert.alert('Erro', 'Selecione uma turma primeiro.');
      return;
    }
    setCreationMethod('manual');
    setShowNewActivityModal(true);
  };

  const handleCreateWithAI = () => {
    if (!selectedClass) {
      Alert.alert('Erro', 'Selecione uma turma primeiro.');
      return;
    }
    setCreationMethod('ai');
    setShowNewActivityModal(true);
  };

  const handleUseTemplate = (template: any) => {
    if (!selectedClass) {
      Alert.alert('Erro', 'Selecione uma turma primeiro.');
      return;
    }
    setCreationMethod('template');
    setShowNewActivityModal(true);
  };

  const handleActivityCreated = (activityData: any) => {
    Alert.alert(
      'Atividade Criada!',
      `A atividade "${activityData.title}" foi criada com sucesso para ${selectedClass?.name}.`,
      [
        { text: 'Ver Atividade', onPress: () => router.push('/teacher/activities') },
        { text: 'Criar Outra', onPress: () => setShowNewActivityModal(true) },
        { text: 'OK', style: 'default' },
      ]
    );
  };

  const renderClassCard = (classItem: Class) => (
    <Card 
      key={classItem.id} 
      style={[
        styles.classCard, 
        selectedClass?.id === classItem.id && styles.classCardSelected
      ]}
      onPress={() => setSelectedClass(classItem)}
    >
      <Card.Content>
        <View style={styles.classHeader}>
          <View style={styles.classInfo}>
            <Text style={styles.className}>{classItem.name}</Text>
            <Text style={styles.classSubject}>{classItem.subject} • {classItem.grade}</Text>
          </View>
          <View style={styles.classMeta}>
            <MaterialIcons name="people" size={16} color="#6b7280" />
            <Text style={styles.studentCount}>{classItem.studentCount} alunos</Text>
          </View>
        </View>
        
        {selectedClass?.id === classItem.id && (
          <View style={styles.selectedIndicator}>
            <MaterialIcons name="check-circle" size={20} color="#10b981" />
            <Text style={styles.selectedText}>Selecionada</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderCreationMethods = () => (
    <View style={styles.creationMethods}>
      <Text style={styles.sectionTitle}>Como criar sua atividade?</Text>
      
      <View style={styles.methodCards}>
        <Card style={styles.methodCard} onPress={handleCreateManual}>
          <Card.Content>
            <View style={styles.methodHeader}>
              <MaterialIcons name="edit" size={24} color="#3b82f6" />
              <Text style={styles.methodTitle}>Criar Manualmente</Text>
            </View>
            <Text style={styles.methodDescription}>
              Crie sua atividade do zero com todas as opções de personalização.
            </Text>
            <View style={styles.methodFeatures}>
              <Text style={styles.methodFeature}>• Controle total sobre questões</Text>
              <Text style={styles.methodFeature}>• Personalização completa</Text>
              <Text style={styles.methodFeature}>• Configurações avançadas</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.methodCard} onPress={handleCreateWithAI}>
          <Card.Content>
            <View style={styles.methodHeader}>
              <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
              <Text style={styles.methodTitle}>Usar Assistente IA</Text>
            </View>
            <Text style={styles.methodDescription}>
              Descreva o que você quer e a IA criará a atividade automaticamente.
            </Text>
            <View style={styles.methodFeatures}>
              <Text style={styles.methodFeature}>• Geração automática de questões</Text>
              <Text style={styles.methodFeature}>• Personalização por contexto</Text>
              <Text style={styles.methodFeature}>• Economia de tempo</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );

  const renderTemplates = () => (
    <View style={styles.templates}>
      <Text style={styles.sectionTitle}>Templates Prontos</Text>
      <Text style={styles.sectionSubtitle}>
        Use templates pré-configurados como ponto de partida
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {activityTemplates.map((template) => (
          <Card key={template.id} style={styles.templateCard} onPress={() => handleUseTemplate(template)}>
            <Card.Content>
              <View style={styles.templateHeader}>
                <MaterialIcons name={template.icon as any} size={24} color={template.color} />
                <Text style={[styles.templateTitle, { color: template.color }]}>
                  {template.title}
                </Text>
              </View>
              <Text style={styles.templateDescription}>{template.description}</Text>
              <TouchableOpacity style={[styles.useTemplateButton, { backgroundColor: template.color }]}>
                <Text style={styles.useTemplateText}>Usar Template</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#3b82f6" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Atividade</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.stepIndicator}>
          <View style={styles.step}>
            <View style={[styles.stepNumber, styles.stepActive]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={[styles.stepText, styles.stepActive]}>Selecionar Turma</Text>
          </View>
          <View style={styles.stepDivider} />
          <View style={styles.step}>
            <View style={[styles.stepNumber, selectedClass && styles.stepActive]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={[styles.stepText, selectedClass && styles.stepActive]}>Criar Atividade</Text>
          </View>
        </View>

        <View style={styles.classSelection}>
          <Text style={styles.sectionTitle}>1. Selecione a Turma</Text>
          <Text style={styles.sectionSubtitle}>
            Escolha a turma para qual você quer criar a atividade
          </Text>

          <Searchbar
            placeholder="Buscar turmas..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          <View style={styles.classesList}>
            {filteredClasses.length > 0 ? (
              filteredClasses.map(renderClassCard)
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="people" size={48} color="#9ca3af" />
                <Text style={styles.emptyTitle}>Nenhuma turma encontrada</Text>
                <Text style={styles.emptyText}>
                  Não há turmas que correspondam à busca.
                </Text>
              </View>
            )}
          </View>
        </View>

        {selectedClass && (
          <>
            {renderCreationMethods()}
            {renderTemplates()}
          </>
        )}
      </ScrollView>

      <NewActivityModal
        visible={showNewActivityModal}
        onDismiss={() => setShowNewActivityModal(false)}
        onSubmit={handleActivityCreated}
        classId={selectedClass?.id || ''}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stepActive: {
    backgroundColor: '#3b82f6',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  stepText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  stepDivider: {
    flex: 1,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  classSelection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  classesList: {
    gap: 12,
  },
  classCard: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  classCardSelected: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  classSubject: {
    fontSize: 14,
    color: '#6b7280',
  },
  classMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studentCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  selectedText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  creationMethods: {
    marginBottom: 32,
  },
  methodCards: {
    gap: 16,
  },
  methodCard: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  methodDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  methodFeatures: {
    gap: 4,
  },
  methodFeature: {
    fontSize: 12,
    color: '#6b7280',
  },
  templates: {
    marginBottom: 32,
  },
  templateCard: {
    width: 200,
    borderRadius: 12,
    backgroundColor: 'white',
    marginRight: 16,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  templateDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    marginBottom: 12,
  },
  useTemplateButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  useTemplateText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
}); 