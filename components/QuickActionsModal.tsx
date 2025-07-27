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
import { Modal, Portal, Card, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import QuickActivityModal from './QuickActivityModal';

interface QuickActionsModalProps {
  visible: boolean;
  onDismiss: () => void;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
  badge?: string;
}

export default function QuickActionsModal({
  visible,
  onDismiss,
}: QuickActionsModalProps) {
  const [showQuickActivity, setShowQuickActivity] = useState(false);

  const handleNewActivity = () => {
    setShowQuickActivity(true);
  };

  const handleNewEvent = () => {
    Alert.alert('Novo Evento', 'Funcionalidade de novo evento será implementada');
  };

  const handleQuickCorrection = () => {
    Alert.alert('Correção Rápida', 'Funcionalidade de correção rápida será implementada');
  };

  const handleGenerateReport = () => {
    Alert.alert('Gerar Relatório', 'Funcionalidade de geração de relatório será implementada');
  };

  const handleSendMessage = () => {
    Alert.alert('Enviar Mensagem', 'Funcionalidade de envio de mensagem será implementada');
  };

  const handleScheduleMeeting = () => {
    Alert.alert('Agendar Reunião', 'Funcionalidade de agendamento de reunião será implementada');
  };

  const handleCreateQuiz = () => {
    Alert.alert('Criar Quiz', 'Funcionalidade de criação de quiz será implementada');
  };

  const handleUploadMaterial = () => {
    Alert.alert('Upload de Material', 'Funcionalidade de upload de material será implementada');
  };

  const handleGradeActivity = () => {
    Alert.alert('Corrigir Atividade', 'Funcionalidade de correção de atividade será implementada');
  };

  const quickActions: QuickAction[] = [
    {
      id: 'new-activity',
      title: 'Nova Atividade',
      description: 'Criar atividade, prova ou projeto',
      icon: 'assignment',
      color: '#3b82f6',
      action: handleNewActivity,
      badge: 'Rápido',
    },
    {
      id: 'new-event',
      title: 'Novo Evento',
      description: 'Agendar aula, reunião ou prazo',
      icon: 'event',
      color: '#10b981',
      action: handleNewEvent,
    },
    {
      id: 'quick-correction',
      title: 'Correção Rápida',
      description: 'Corrigir atividades com IA',
      icon: 'psychology',
      color: '#8b5cf6',
      action: handleQuickCorrection,
      badge: 'IA',
    },
    {
      id: 'generate-report',
      title: 'Gerar Relatório',
      description: 'Relatórios de desempenho',
      icon: 'bar-chart',
      color: '#f59e0b',
      action: handleGenerateReport,
    },
    {
      id: 'send-message',
      title: 'Enviar Mensagem',
      description: 'Comunicar com alunos/pais',
      icon: 'message',
      color: '#06b6d4',
      action: handleSendMessage,
    },
    {
      id: 'schedule-meeting',
      title: 'Agendar Reunião',
      description: 'Reunião com pais ou colegas',
      icon: 'people',
      color: '#84cc16',
      action: handleScheduleMeeting,
    },
    {
      id: 'create-quiz',
      title: 'Criar Quiz',
      description: 'Questionário interativo',
      icon: 'quiz',
      color: '#ec4899',
      action: handleCreateQuiz,
    },
    {
      id: 'upload-material',
      title: 'Upload de Material',
      description: 'Compartilhar arquivos',
      icon: 'upload',
      color: '#6366f1',
      action: handleUploadMaterial,
    },
    {
      id: 'grade-activity',
      title: 'Corrigir Atividade',
      description: 'Avaliar trabalhos pendentes',
      icon: 'grade',
      color: '#dc2626',
      action: handleGradeActivity,
      badge: '15',
    },
  ];

  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionCard}
      onPress={action.action}
    >
      <View style={styles.actionContent}>
        <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
          <MaterialIcons name={action.icon as any} size={24} color={action.color} />
        </View>
        <View style={styles.actionInfo}>
          <View style={styles.actionHeader}>
            <Text style={styles.actionTitle}>{action.title}</Text>
            {action.badge && (
              <View style={[styles.badge, { backgroundColor: action.color }]}>
                <Text style={styles.badgeText}>{action.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.actionDescription}>{action.description}</Text>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={16} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  const renderRecentActions = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Ações Recentes</Text>
        <Text style={styles.sectionDescription}>
          Continue de onde parou
        </Text>
        
        <View style={styles.recentActions}>
          <TouchableOpacity style={styles.recentAction}>
            <MaterialIcons name="assignment" size={20} color="#3b82f6" />
            <Text style={styles.recentActionText}>Lista de Matemática</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.recentAction}>
            <MaterialIcons name="grade" size={20} color="#f59e0b" />
            <Text style={styles.recentActionText}>Corrigir Provas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.recentAction}>
            <MaterialIcons name="event" size={20} color="#10b981" />
            <Text style={styles.recentActionText}>Reunião Pedagógica</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const renderQuickStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="assignment" size={20} color="#3b82f6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Atividades</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="grade" size={20} color="#f59e0b" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="event" size={20} color="#10b981" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Eventos</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Ações Rápidas</Text>
          <TouchableOpacity onPress={onDismiss}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {renderQuickStats()}
          
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Ações Principais</Text>
              <Text style={styles.sectionDescription}>
                Acesse rapidamente as funcionalidades mais usadas
              </Text>
              
              <View style={styles.actionsGrid}>
                {quickActions.map(renderQuickAction)}
              </View>
            </Card.Content>
          </Card>

          {renderRecentActions()}
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={styles.cancelButton}
          >
            Fechar
          </Button>
        </View>

        {/* Modal de Nova Atividade Rápida */}
        <QuickActivityModal
          visible={showQuickActivity}
          onDismiss={() => setShowQuickActivity(false)}
          onSave={(activityData) => {
            Alert.alert('Sucesso', 'Atividade criada com sucesso!');
            setShowQuickActivity(false);
          }}
        />
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
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    borderColor: '#d1d5db',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    gap: 8,
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
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
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  recentActions: {
    gap: 12,
  },
  recentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    gap: 12,
  },
  recentActionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
}); 