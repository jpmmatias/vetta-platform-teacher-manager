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
import ReportExportModal from '../../components/ReportExportModal';

interface ReportData {
  id: string;
  title: string;
  type: 'performance' | 'attendance' | 'activity' | 'ai-usage' | 'comparison';
  description: string;
  icon: string;
  color: string;
  lastGenerated: string;
  status: 'ready' | 'generating' | 'error';
  dataPoints?: number;
}

interface PerformanceData {
  class: string;
  averageGrade: number;
  totalStudents: number;
  improvement: number;
  activities: number;
  submissions: number;
}

interface ActivityStats {
  total: number;
  active: number;
  completed: number;
  draft: number;
  aiGenerated: number;
  averageGrade: number;
  totalSubmissions: number;
}

const mockReports: ReportData[] = [
  {
    id: '1',
    title: 'Relatório de Performance',
    type: 'performance',
    description: 'Análise detalhada do desempenho dos alunos por turma e atividade.',
    icon: 'trending-up',
    color: '#3b82f6',
    lastGenerated: '15/12/2024 14:30',
    status: 'ready',
    dataPoints: 156,
  },
  {
    id: '2',
    title: 'Relatório de Frequência',
    type: 'attendance',
    description: 'Controle de presença e participação nas atividades.',
    icon: 'people',
    color: '#10b981',
    lastGenerated: '14/12/2024 09:15',
    status: 'ready',
    dataPoints: 89,
  },
  {
    id: '3',
    title: 'Relatório de Atividades',
    type: 'activity',
    description: 'Estatísticas sobre criação, entrega e correção de atividades.',
    icon: 'assignment',
    color: '#f59e0b',
    lastGenerated: '13/12/2024 16:45',
    status: 'ready',
    dataPoints: 234,
  },
  {
    id: '4',
    title: 'Relatório de Uso da IA',
    type: 'ai-usage',
    description: 'Análise do uso do assistente de IA na criação e correção.',
    icon: 'psychology',
    color: '#8b5cf6',
    lastGenerated: '12/12/2024 11:20',
    status: 'ready',
    dataPoints: 67,
  },
  {
    id: '5',
    title: 'Relatório Comparativo',
    type: 'comparison',
    description: 'Comparação de desempenho entre turmas e períodos.',
    icon: 'compare',
    color: '#dc2626',
    lastGenerated: '10/12/2024 08:30',
    status: 'generating',
  },
];

const mockPerformanceData: PerformanceData[] = [
  {
    class: 'Matemática 9º Ano A',
    averageGrade: 8.2,
    totalStudents: 25,
    improvement: 12.5,
    activities: 15,
    submissions: 375,
  },
  {
    class: 'História 8º Ano B',
    averageGrade: 7.8,
    totalStudents: 28,
    improvement: 8.3,
    activities: 12,
    submissions: 336,
  },
  {
    class: 'Ciências 7º Ano A',
    averageGrade: 8.5,
    totalStudents: 30,
    improvement: 15.2,
    activities: 18,
    submissions: 540,
  },
  {
    class: 'Português 9º Ano B',
    averageGrade: 7.9,
    totalStudents: 22,
    improvement: 6.7,
    activities: 14,
    submissions: 308,
  },
];

const mockActivityStats: ActivityStats = {
  total: 28,
  active: 12,
  completed: 14,
  draft: 2,
  aiGenerated: 8,
  averageGrade: 8.1,
  totalSubmissions: 1559,
};

export default function TeacherReports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'performance' | 'attendance' | 'activity' | 'ai-usage' | 'comparison'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || report.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleGenerateReport = (report: ReportData) => {
    Alert.alert(
      'Gerar Relatório',
      `Deseja gerar o relatório "${report.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Gerar', onPress: () => {
          Alert.alert('Processando', 'Relatório está sendo gerado...');
        }},
      ]
    );
  };

  const handleViewReport = (report: ReportData) => {
    router.push(`/teacher/report-view?id=${report.id}`);
  };

  const handleExportReport = (report: ReportData) => {
    setSelectedReport(report);
    setShowExportModal(true);
  };

  const handleExport = (options: any) => {
    Alert.alert(
      'Exportando Relatório',
      `Gerando relatório "${selectedReport?.title}" em ${options.format.toUpperCase()}...`
    );
  };

  const handleDeleteReport = (report: ReportData) => {
    Alert.alert(
      'Excluir Relatório',
      `Tem certeza que deseja excluir "${report.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => Alert.alert('Excluído', 'Relatório removido.') },
      ]
    );
  };

  const renderOverviewStats = () => (
    <View style={styles.overviewStats}>
      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="description" size={24} color="#3b82f6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockActivityStats.total}</Text>
              <Text style={styles.statLabel}>Atividades</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="people" size={24} color="#10b981" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockActivityStats.totalSubmissions}</Text>
              <Text style={styles.statLabel}>Submissões</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="grade" size={24} color="#f59e0b" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockActivityStats.averageGrade.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Média Geral</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockActivityStats.aiGenerated}</Text>
              <Text style={styles.statLabel}>Com IA</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderPerformanceChart = () => (
    <Card style={styles.chartCard}>
      <Card.Content>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Performance por Turma</Text>
          <Chip style={styles.periodChip}>
            {selectedPeriod === 'week' ? 'Semana' :
             selectedPeriod === 'month' ? 'Mês' :
             selectedPeriod === 'quarter' ? 'Trimestre' : 'Ano'}
          </Chip>
        </View>

        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>
              Semana
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
              Mês
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'quarter' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('quarter')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'quarter' && styles.periodTextActive]}>
              Trimestre
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'year' && styles.periodTextActive]}>
              Ano
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mockPerformanceData.map((data, index) => (
            <View key={index} style={styles.performanceBar}>
              <View style={styles.barContainer}>
                                 <View 
                   style={[
                     styles.barFill, 
                     { 
                       height: (data.averageGrade / 10) * 120,
                       backgroundColor: data.improvement > 0 ? '#10b981' : '#dc2626'
                     }
                   ]} 
                 />
                <Text style={styles.barLabel}>{data.averageGrade.toFixed(1)}</Text>
              </View>
              <Text style={styles.barTitle}>{data.class.split(' ')[0]}</Text>
              <Text style={styles.barSubtitle}>{data.totalStudents} alunos</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>Melhoria</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#dc2626' }]} />
            <Text style={styles.legendText}>Queda</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderReportCard = (report: ReportData) => (
    <Card key={report.id} style={styles.reportCard}>
      <Card.Content>
        <View style={styles.reportHeader}>
          <View style={styles.reportInfo}>
            <View style={styles.reportIconContainer}>
              <MaterialIcons 
                name={report.icon as any} 
                size={24} 
                color={report.color} 
              />
            </View>
            <View style={styles.reportDetails}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
            </View>
          </View>
          <View style={styles.reportStatus}>
            <Chip 
              style={[
                styles.statusChip, 
                { 
                  backgroundColor: report.status === 'ready' ? '#10b98120' :
                  report.status === 'generating' ? '#f59e0b20' : '#dc262620'
                }
              ]}
              textStyle={{ 
                color: report.status === 'ready' ? '#10b981' :
                report.status === 'generating' ? '#f59e0b' : '#dc2626'
              }}
            >
              {report.status === 'ready' ? 'Pronto' :
               report.status === 'generating' ? 'Gerando' : 'Erro'}
            </Chip>
          </View>
        </View>

        <View style={styles.reportMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="schedule" size={16} color="#6b7280" />
            <Text style={styles.metaText}>Gerado: {report.lastGenerated}</Text>
          </View>
          {report.dataPoints && (
            <View style={styles.metaItem}>
              <MaterialIcons name="data-usage" size={16} color="#6b7280" />
              <Text style={styles.metaText}>{report.dataPoints} pontos</Text>
            </View>
          )}
        </View>

        <View style={styles.reportActions}>
          {report.status === 'ready' ? (
            <>
              <Button 
                mode="outlined" 
                onPress={() => handleViewReport(report)}
                style={styles.viewButton}
              >
                Visualizar
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => handleExportReport(report)}
                style={styles.exportButton}
              >
                Exportar
              </Button>
            </>
          ) : (
            <Button 
              mode="contained" 
              onPress={() => handleGenerateReport(report)}
              style={styles.generateButton}
            >
              {report.status === 'generating' ? 'Gerando...' : 'Gerar'}
            </Button>
          )}
          
          <TouchableOpacity onPress={() => handleDeleteReport(report)}>
            <MaterialIcons name="delete" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatórios</Text>
        <Text style={styles.subtitle}>Análises e insights sobre suas atividades</Text>
      </View>

      {renderOverviewStats()}

      <Searchbar
        placeholder="Buscar relatórios..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

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
            style={[styles.filterChip, selectedFilter === 'performance' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('performance')}
          >
            <Text style={[styles.filterText, selectedFilter === 'performance' && styles.filterTextActive]}>
              Performance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'attendance' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('attendance')}
          >
            <Text style={[styles.filterText, selectedFilter === 'attendance' && styles.filterTextActive]}>
              Frequência
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
            style={[styles.filterChip, selectedFilter === 'ai-usage' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('ai-usage')}
          >
            <Text style={[styles.filterText, selectedFilter === 'ai-usage' && styles.filterTextActive]}>
              IA
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'comparison' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('comparison')}
          >
            <Text style={[styles.filterText, selectedFilter === 'comparison' && styles.filterTextActive]}>
              Comparativo
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {renderPerformanceChart()}

      <View style={styles.reportsSection}>
        <Text style={styles.sectionTitle}>Relatórios Disponíveis</Text>
        
        <ScrollView style={styles.reportsList}>
          {filteredReports.length > 0 ? (
            filteredReports.map(renderReportCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="assessment" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Nenhum relatório encontrado</Text>
              <Text style={styles.emptyText}>
                Não há relatórios que correspondam aos filtros selecionados.
              </Text>
            </View>
                     )}
         </ScrollView>
       </View>

       {selectedReport && (
         <ReportExportModal
           visible={showExportModal}
           onDismiss={() => {
             setShowExportModal(false);
             setSelectedReport(null);
           }}
           reportTitle={selectedReport.title}
           onExport={handleExport}
         />
       )}
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
  overviewStats: {
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
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  periodChip: {
    backgroundColor: '#f3f4f6',
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#3b82f6',
  },
  periodText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  periodTextActive: {
    color: 'white',
  },
  performanceBar: {
    alignItems: 'center',
    marginRight: 20,
    width: 60,
  },
  barContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  barFill: {
    width: 40,
    borderRadius: 4,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  barTitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  barSubtitle: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  reportsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
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
    marginBottom: 12,
  },
  reportInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
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
    lineHeight: 20,
  },
  reportStatus: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 0,
  },
  reportMeta: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewButton: {
    flex: 1,
    borderColor: '#3b82f6',
  },
  exportButton: {
    flex: 1,
    borderColor: '#10b981',
  },
  generateButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
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
}); 