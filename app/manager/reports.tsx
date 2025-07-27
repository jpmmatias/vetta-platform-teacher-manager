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

interface Report {
  id: string;
  title: string;
  type: 'performance' | 'financial' | 'academic' | 'operational' | 'ai';
  status: 'completed' | 'processing' | 'scheduled' | 'failed';
  date: string;
  period: string;
  size: string;
  format: 'pdf' | 'excel' | 'csv';
  generatedBy: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Relatório de Performance Institucional',
    type: 'performance',
    status: 'completed',
    date: '2024-12-16',
    period: 'Novembro 2024',
    size: '2.3 MB',
    format: 'pdf',
    generatedBy: 'Sistema Automático',
    description: 'Análise completa do desempenho acadêmico e operacional da instituição',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Relatório Financeiro Mensal',
    type: 'financial',
    status: 'completed',
    date: '2024-12-15',
    period: 'Novembro 2024',
    size: '1.8 MB',
    format: 'excel',
    generatedBy: 'Contabilidade',
    description: 'Demonstrações financeiras e análise de receitas e despesas',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Análise de Uso da IA',
    type: 'ai',
    status: 'processing',
    date: '2024-12-16',
    period: 'Dezembro 2024',
    size: 'Processando...',
    format: 'pdf',
    generatedBy: 'Sistema IA',
    description: 'Métricas de adoção e eficácia da inteligência artificial',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Relatório de Matrículas',
    type: 'operational',
    status: 'completed',
    date: '2024-12-14',
    period: 'Dezembro 2024',
    size: '956 KB',
    format: 'csv',
    generatedBy: 'Secretaria',
    description: 'Estatísticas de matrículas e evasão escolar',
    priority: 'medium',
  },
  {
    id: '5',
    title: 'Relatório de Desempenho por Turma',
    type: 'academic',
    status: 'scheduled',
    date: '2024-12-17',
    period: 'Dezembro 2024',
    size: 'Agendado',
    format: 'pdf',
    generatedBy: 'Coordenação Pedagógica',
    description: 'Análise detalhada do desempenho de cada turma',
    priority: 'low',
  },
  {
    id: '6',
    title: 'Relatório de Satisfação',
    type: 'operational',
    status: 'failed',
    date: '2024-12-13',
    period: 'Novembro 2024',
    size: 'Falhou',
    format: 'pdf',
    generatedBy: 'Marketing',
    description: 'Pesquisa de satisfação com pais e alunos',
    priority: 'medium',
  },
];

export default function ManagerReports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'performance' | 'financial' | 'academic' | 'operational' | 'ai'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'processing' | 'scheduled' | 'failed'>('all');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'performance': return 'trending-up';
      case 'financial': return 'account-balance-wallet';
      case 'academic': return 'school';
      case 'operational': return 'settings';
      case 'ai': return 'psychology';
      default: return 'description';
    }
  };

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'performance': return '#3b82f6';
      case 'financial': return '#10b981';
      case 'academic': return '#f59e0b';
      case 'operational': return '#8b5cf6';
      case 'ai': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const getTypeText = (type: Report['type']) => {
    switch (type) {
      case 'performance': return 'Performance';
      case 'financial': return 'Financeiro';
      case 'academic': return 'Acadêmico';
      case 'operational': return 'Operacional';
      case 'ai': return 'IA';
      default: return 'Geral';
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'processing': return '#3b82f6';
      case 'scheduled': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'processing': return 'Processando';
      case 'scheduled': return 'Agendado';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  const getPriorityColor = (priority: Report['priority']) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getFormatIcon = (format: Report['format']) => {
    switch (format) {
      case 'pdf': return 'picture-as-pdf';
      case 'excel': return 'table-chart';
      case 'csv': return 'table-view';
      default: return 'description';
    }
  };

  const handleGenerateReport = () => {
    Alert.alert('Gerar Relatório', 'Funcionalidade de geração de relatório será implementada');
  };

  const handleViewReport = (report: Report) => {
    router.push(`/manager/report-view?id=${report.id}`);
  };

  const handleDownloadReport = (report: Report) => {
    Alert.alert('Download', `Baixando ${report.title}`);
  };

  const handleShareReport = (report: Report) => {
    Alert.alert('Compartilhar', `Compartilhando ${report.title}`);
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="description" size={24} color="#3b82f6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockReports.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
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
                {mockReports.filter(r => r.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="schedule" size={24} color="#f59e0b" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {mockReports.filter(r => r.status === 'processing').length}
              </Text>
              <Text style={styles.statLabel}>Processando</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="error" size={24} color="#ef4444" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {mockReports.filter(r => r.status === 'failed').length}
              </Text>
              <Text style={styles.statLabel}>Falharam</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filters}>
      <Text style={styles.filtersTitle}>Filtros:</Text>
      
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
          style={[styles.filterChip, selectedType === 'performance' && styles.filterChipActive]}
          onPress={() => setSelectedType('performance')}
        >
          <Text style={[styles.filterText, selectedType === 'performance' && styles.filterTextActive]}>
            Performance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'financial' && styles.filterChipActive]}
          onPress={() => setSelectedType('financial')}
        >
          <Text style={[styles.filterText, selectedType === 'financial' && styles.filterTextActive]}>
            Financeiro
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'academic' && styles.filterChipActive]}
          onPress={() => setSelectedType('academic')}
        >
          <Text style={[styles.filterText, selectedType === 'academic' && styles.filterTextActive]}>
            Acadêmico
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'operational' && styles.filterChipActive]}
          onPress={() => setSelectedType('operational')}
        >
          <Text style={[styles.filterText, selectedType === 'operational' && styles.filterTextActive]}>
            Operacional
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'ai' && styles.filterChipActive]}
          onPress={() => setSelectedType('ai')}
        >
          <Text style={[styles.filterText, selectedType === 'ai' && styles.filterTextActive]}>
            IA
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderReportCard = (report: Report) => (
    <Card key={report.id} style={styles.reportCard}>
      <Card.Content>
        <View style={styles.reportHeader}>
          <View style={styles.reportInfo}>
            <View style={styles.reportIcon}>
              <MaterialIcons
                name={getTypeIcon(report.type)}
                size={20}
                color={getTypeColor(report.type)}
              />
            </View>
            <View style={styles.reportDetails}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
              <View style={styles.reportMeta}>
                <Chip
                  style={[styles.typeChip, { backgroundColor: getTypeColor(report.type) + '20' }]}
                  textStyle={{ color: getTypeColor(report.type) }}
                >
                  {getTypeText(report.type)}
                </Chip>
                <Chip
                  style={[styles.statusChip, { backgroundColor: getStatusColor(report.status) + '20' }]}
                  textStyle={{ color: getStatusColor(report.status) }}
                >
                  {getStatusText(report.status)}
                </Chip>
                <Chip
                  style={[styles.priorityChip, { backgroundColor: getPriorityColor(report.priority) + '20' }]}
                  textStyle={{ color: getPriorityColor(report.priority) }}
                >
                  {report.priority.toUpperCase()}
                </Chip>
              </View>
            </View>
          </View>
          <View style={styles.reportActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleViewReport(report)}
            >
              <MaterialIcons name="visibility" size={20} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDownloadReport(report)}
            >
              <MaterialIcons name="download" size={20} color="#10b981" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleShareReport(report)}
            >
              <MaterialIcons name="share" size={20} color="#f59e0b" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reportFooter}>
          <View style={styles.reportStats}>
            <View style={styles.statItem}>
              <MaterialIcons name="event" size={16} color="#6b7280" />
              <Text style={styles.statText}>{report.date}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="schedule" size={16} color="#6b7280" />
              <Text style={styles.statText}>{report.period}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name={getFormatIcon(report.format)} size={16} color="#6b7280" />
              <Text style={styles.statText}>{report.format.toUpperCase()}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="storage" size={16} color="#6b7280" />
              <Text style={styles.statText}>{report.size}</Text>
            </View>
          </View>
          <Text style={styles.generatedBy}>Gerado por: {report.generatedBy}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatórios</Text>
        <Text style={styles.subtitle}>Gestão e visualização de relatórios institucionais</Text>
      </View>

      {renderStats()}

      <Searchbar
        placeholder="Buscar relatórios..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {renderFilters()}

      <View style={styles.reportsSection}>
        <View style={styles.reportsHeader}>
          <Text style={styles.sectionTitle}>Relatórios ({filteredReports.length})</Text>
        </View>

        <ScrollView style={styles.reportsList}>
          {filteredReports.length > 0 ? (
            filteredReports.map(renderReportCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="description" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Nenhum relatório encontrado</Text>
              <Text style={styles.emptyText}>
                Não há relatórios que correspondam aos filtros selecionados.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleGenerateReport}
        label="Gerar Relatório"
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
  reportsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reportsHeader: {
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
  reportsList: {
    flex: 1,
  },
  reportCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reportInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 16,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportDetails: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  reportMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    marginBottom: 0,
  },
  statusChip: {
    marginBottom: 0,
  },
  priorityChip: {
    marginBottom: 0,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  reportStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  generatedBy: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
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