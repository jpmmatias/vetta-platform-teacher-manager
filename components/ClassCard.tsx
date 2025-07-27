import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Chip, Menu, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ClassCardProps {
  classData: {
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
  };
  onAccessClass: (classId: string) => void;
  onAICorrection: (classId: string) => void;
  onViewReports: (classId: string) => void;
  onClassAction: (action: string, classId: string) => void;
  menuVisible: string | null;
  onMenuToggle: (classId: string | null) => void;
}

const subjectColors = {
  Matemática: '#FF6B35',
  Português: '#2563EB',
  Ciências: '#16A34A',
  História: '#7C3AED',
  Geografia: '#0891B2',
};

export default function ClassCard({
  classData,
  onAccessClass,
  onAICorrection,
  onViewReports,
  onClassAction,
  menuVisible,
  onMenuToggle,
}: ClassCardProps) {
  const router = useRouter();
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

  const getParticipationColor = (rate: number) => {
    if (rate >= 80) return '#16A34A';
    if (rate >= 60) return '#F59E0B';
    return '#DC2626';
  };

  return (
    <Card style={[styles.classCard, classData.needsAttention && styles.attentionCard]}>
      <Card.Content style={styles.cardContent}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleSection}>
            <Text style={styles.className} numberOfLines={2}>{classData.name}</Text>
            <Chip
              mode="flat"
              textStyle={[styles.subjectChip, { color: 'white' }]}
              style={[styles.subjectChip, { backgroundColor: getSubjectColor(classData.subject) }]}
            >
              {classData.subject}
            </Chip>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => onMenuToggle(menuVisible === classData.id ? null : classData.id)}
          >
            <MaterialIcons name="more-vert" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Institution and Period */}
        <View style={styles.cardMeta}>
          <Text style={styles.institution}>{classData.institution}</Text>
          <Text style={styles.period}>{classData.period}</Text>
        </View>

        {/* Students Count */}
        <View style={styles.studentsSection}>
          <MaterialIcons name="people" size={16} color="#6b7280" />
          <Text style={styles.studentsCount}>{classData.studentsCount} estudantes</Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={[
              styles.metricValue,
              classData.pendingActivities > 0 && styles.pendingMetric
            ]}>
              {classData.pendingActivities}
            </Text>
            <Text style={styles.metricLabel}>Pendentes</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{classData.participationRate}%</Text>
            <Text style={styles.metricLabel}>Participação</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{classData.averageGrade}</Text>
            <Text style={styles.metricLabel}>Média</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{classData.correctedActivities}</Text>
            <Text style={styles.metricLabel}>Corrigidas</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${classData.participationRate}%`,
                  backgroundColor: getParticipationColor(classData.participationRate)
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{classData.participationRate}% participação</Text>
        </View>

        {/* Status Indicators */}
        <View style={styles.statusIndicators}>
          {classData.pendingActivities > 0 && (
            <View style={styles.statusBadge}>
              <MaterialIcons name="assignment" size={12} color="white" />
              <Text style={styles.statusBadgeText}>{classData.pendingActivities}</Text>
            </View>
          )}
          {classData.needsAttention && (
            <View style={[styles.statusBadge, { backgroundColor: '#DC2626' }]}>
              <MaterialIcons name="warning" size={12} color="white" />
            </View>
          )}
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(classData.status) }]} />
          <Text style={styles.lastActivity}>Última atividade: {classData.lastActivity}</Text>
        </View>

        {/* Sync Indicator */}
        <View style={styles.syncIndicator}>
          <MaterialIcons name="sync" size={12} color="#10b981" />
          <Text style={styles.syncText}>Sincronizado {classData.lastSync}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push(`/teacher/class-detail?id=${classData.id}`)}
          >
            <MaterialIcons name="open-in-new" size={16} color="white" />
            <Text style={styles.primaryButtonText}>Acessar Turma</Text>
          </TouchableOpacity>
          
          {classData.pendingActivities > 0 && (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => onAICorrection(classData.id)}
            >
              <MaterialIcons name="psychology" size={16} color="#8b5cf6" />
              <Text style={styles.secondaryButtonText}>Correção IA</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => onViewReports(classData.id)}
          >
            <MaterialIcons name="bar-chart" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </Card.Content>

      {/* Context Menu */}
      <Menu
        visible={menuVisible === classData.id}
        onDismiss={() => onMenuToggle(null)}
        anchor={{ x: 0, y: 0 }}
        style={styles.contextMenu}
      >
        <Menu.Item 
          onPress={() => onClassAction('Editar', classData.id)} 
          title="Editar informações" 
          leadingIcon="edit"
        />
        <Menu.Item 
          onPress={() => onClassAction('Duplicar', classData.id)} 
          title="Duplicar turma" 
          leadingIcon="content-copy"
        />
        <Menu.Item 
          onPress={() => onClassAction('Gerenciar alunos', classData.id)} 
          title="Gerenciar alunos" 
          leadingIcon="people"
        />
        <Menu.Item 
          onPress={() => onClassAction('Configurar notificações', classData.id)} 
          title="Configurar notificações" 
          leadingIcon="notifications"
        />
        <Menu.Item 
          onPress={() => onClassAction('Exportar dados', classData.id)} 
          title="Exportar dados" 
          leadingIcon="download"
        />
        <Divider />
        <Menu.Item 
          onPress={() => onClassAction('Arquivar', classData.id)} 
          title="Arquivar turma" 
          leadingIcon="archive"
        />
      </Menu>
    </Card>
  );
}

const styles = StyleSheet.create({
  classCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  attentionCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleSection: {
    flex: 1,
    marginRight: 8,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subjectChip: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
  },
  menuButton: {
    padding: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  institution: {
    fontSize: 14,
    color: '#6b7280',
  },
  period: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  studentsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentsCount: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  pendingMetric: {
    color: '#dc2626',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    marginLeft: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  lastActivity: {
    fontSize: 12,
    color: '#6b7280',
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  syncText: {
    fontSize: 12,
    color: '#10b981',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  secondaryButtonText: {
    color: '#8b5cf6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  contextMenu: {
    marginTop: 8,
  },
}); 