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
import { Card, Chip, Button, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import ReportExportModal from '../../components/ReportExportModal';

interface ReportViewData {
  id: string;
  title: string;
  type: 'performance' | 'attendance' | 'activity' | 'ai-usage' | 'comparison';
  description: string;
  generatedAt: string;
  period: string;
  dataPoints: number;
  summary: ReportSummary;
  details: ReportDetails;
}

interface ReportSummary {
  totalStudents: number;
  totalActivities: number;
  averageGrade: number;
  improvement: number;
  topPerformingClass: string;
  needsAttention: string[];
}

interface ReportDetails {
  classPerformance: ClassPerformance[];
  activityStats: ActivityStat[];
  trends: Trend[];
  recommendations: string[];
}

interface ClassPerformance {
  className: string;
  averageGrade: number;
  totalStudents: number;
  improvement: number;
  activities: number;
  submissions: number;
  completionRate: number;
}

interface ActivityStat {
  activityName: string;
  type: string;
  averageGrade: number;
  submissions: number;
  totalStudents: number;
  status: string;
}

interface Trend {
  period: string;
  averageGrade: number;
  submissions: number;
  improvement: number;
}

const mockReportData: ReportViewData = {
  id: '1',
  title: 'Relatório de Performance - Dezembro 2024',
  type: 'performance',
  description: 'Análise detalhada do desempenho dos alunos por turma e atividade no período de dezembro de 2024.',
  generatedAt: '15/12/2024 14:30',
  period: 'Dezembro 2024',
  dataPoints: 156,
  summary: {
    totalStudents: 105,
    totalActivities: 28,
    averageGrade: 8.1,
    improvement: 12.5,
    topPerformingClass: 'Matemática 9º Ano A',
    needsAttention: ['História 8º Ano B', 'Português 9º Ano B'],
  },
  details: {
    classPerformance: [
      {
        className: 'Matemática 9º Ano A',
        averageGrade: 8.2,
        totalStudents: 25,
        improvement: 12.5,
        activities: 15,
        submissions: 375,
        completionRate: 94.2,
      },
      {
        className: 'História 8º Ano B',
        averageGrade: 7.8,
        totalStudents: 28,
        improvement: 8.3,
        activities: 12,
        submissions: 336,
        completionRate: 89.1,
      },
      {
        className: 'Ciências 7º Ano A',
        averageGrade: 8.5,
        totalStudents: 30,
        improvement: 15.2,
        activities: 18,
        submissions: 540,
        completionRate: 96.7,
      },
      {
        className: 'Português 9º Ano B',
        averageGrade: 7.9,
        totalStudents: 22,
        improvement: 6.7,
        activities: 14,
        submissions: 308,
        completionRate: 87.3,
      },
    ],
    activityStats: [
      {
        activityName: 'Lista de Exercícios - Equações do 2º Grau',
        type: 'assignment',
        averageGrade: 8.5,
        submissions: 23,
        totalStudents: 25,
        status: 'completed',
      },
      {
        activityName: 'Quiz - História do Brasil Colonial',
        type: 'quiz',
        averageGrade: 7.8,
        submissions: 25,
        totalStudents: 28,
        status: 'completed',
      },
      {
        activityName: 'Projeto - Sustentabilidade na Escola',
        type: 'project',
        averageGrade: 8.2,
        submissions: 18,
        totalStudents: 30,
        status: 'active',
      },
      {
        activityName: 'Prova - Literatura Brasileira - Modernismo',
        type: 'exam',
        averageGrade: 7.9,
        submissions: 22,
        totalStudents: 28,
        status: 'completed',
      },
    ],
    trends: [
      { period: 'Semana 1', averageGrade: 7.8, submissions: 45, improvement: 5.2 },
      { period: 'Semana 2', averageGrade: 8.0, submissions: 52, improvement: 8.1 },
      { period: 'Semana 3', averageGrade: 8.2, submissions: 48, improvement: 10.3 },
      { period: 'Semana 4', averageGrade: 8.1, submissions: 55, improvement: 12.5 },
    ],
    recommendations: [
      'A turma de História 8º Ano B precisa de atenção especial, com média abaixo do esperado.',
      'Implementar atividades de reforço para os alunos com dificuldades em Português.',
      'A turma de Ciências 7º Ano A está se destacando, considere atividades mais desafiadoras.',
      'O uso da IA na criação de atividades tem mostrado resultados positivos.',
    ],
  },
};

export default function ReportView() {
  const params = useLocalSearchParams();
  const reportId = params.id as string;
  
  const [report] = useState<ReportViewData>(mockReportData);
  const [selectedTab, setSelectedTab] = useState<'summary' | 'details' | 'trends' | 'recommendations'>('summary');
  const [showExportModal, setShowExportModal] = useState(false);

  const getTypeIcon = (type: ReportViewData['type']) => {
    switch (type) {
      case 'performance': return 'trending-up';
      case 'attendance': return 'people';
      case 'activity': return 'assignment';
      case 'ai-usage': return 'psychology';
      case 'comparison': return 'compare';
      default: return 'assessment';
    }
  };

  const getTypeColor = (type: ReportViewData['type']) => {
    switch (type) {
      case 'performance': return '#3b82f6';
      case 'attendance': return '#10b981';
      case 'activity': return '#f59e0b';
      case 'ai-usage': return '#8b5cf6';
      case 'comparison': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getTypeText = (type: ReportViewData['type']) => {
    switch (type) {
      case 'performance': return 'Performance';
      case 'attendance': return 'Frequência';
      case 'activity': return 'Atividades';
      case 'ai-usage': return 'Uso da IA';
      case 'comparison': return 'Comparativo';
      default: return 'Relatório';
    }
  };

  const handleExport = (options: any) => {
    Alert.alert(
      'Exportando Relatório',
      `Gerando relatório em ${options.format.toUpperCase()} com as opções selecionadas...`
    );
  };

  const handleShare = () => {
    Alert.alert('Compartilhar', 'Compartilhando relatório...');
  };

  const renderSummary = () => (
    <View style={styles.tabContent}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryTitle}>Resumo Executivo</Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatNumber}>{report.summary.totalStudents}</Text>
              <Text style={styles.summaryStatLabel}>Alunos</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatNumber}>{report.summary.totalActivities}</Text>
              <Text style={styles.summaryStatLabel}>Atividades</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatNumber}>{report.summary.averageGrade.toFixed(1)}</Text>
              <Text style={styles.summaryStatLabel}>Média Geral</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatNumber, { color: '#10b981' }]}>
                +{report.summary.improvement}%
              </Text>
              <Text style={styles.summaryStatLabel}>Melhoria</Text>
            </View>
          </View>

          <View style={styles.highlightsContainer}>
            <View style={styles.highlightItem}>
              <MaterialIcons name="star" size={20} color="#f59e0b" />
              <Text style={styles.highlightText}>
                <Text style={styles.highlightLabel}>Melhor turma:</Text> {report.summary.topPerformingClass}
              </Text>
            </View>
            
            {report.summary.needsAttention.length > 0 && (
              <View style={styles.highlightItem}>
                <MaterialIcons name="warning" size={20} color="#dc2626" />
                <Text style={styles.highlightText}>
                  <Text style={styles.highlightLabel}>Precisa atenção:</Text> {report.summary.needsAttention.join(', ')}
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.performanceCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Performance por Turma</Text>
          
          {report.details.classPerformance.map((classData, index) => (
            <View key={index} style={styles.classPerformanceItem}>
              <View style={styles.classHeader}>
                <Text style={styles.className}>{classData.className}</Text>
                <Text style={styles.classGrade}>{classData.averageGrade.toFixed(1)}</Text>
              </View>
              
              <View style={styles.classDetails}>
                <View style={styles.classDetail}>
                  <Text style={styles.classDetailLabel}>Alunos:</Text>
                  <Text style={styles.classDetailValue}>{classData.totalStudents}</Text>
                </View>
                <View style={styles.classDetail}>
                  <Text style={styles.classDetailLabel}>Atividades:</Text>
                  <Text style={styles.classDetailValue}>{classData.activities}</Text>
                </View>
                <View style={styles.classDetail}>
                  <Text style={styles.classDetailLabel}>Taxa de Conclusão:</Text>
                  <Text style={styles.classDetailValue}>{classData.completionRate}%</Text>
                </View>
              </View>
              
              <View style={styles.improvementContainer}>
                <MaterialIcons 
                  name={classData.improvement > 0 ? "trending-up" : "trending-down"} 
                  size={16} 
                  color={classData.improvement > 0 ? "#10b981" : "#dc2626"} 
                />
                <Text style={[
                  styles.improvementText, 
                  { color: classData.improvement > 0 ? "#10b981" : "#dc2626" }
                ]}>
                  {classData.improvement > 0 ? '+' : ''}{classData.improvement}%
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  const renderDetails = () => (
    <View style={styles.tabContent}>
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Atividades Detalhadas</Text>
          
          {report.details.activityStats.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityName}>{activity.activityName}</Text>
                <Chip style={styles.activityTypeChip}>
                  {activity.type === 'assignment' ? 'Lista' :
                   activity.type === 'quiz' ? 'Quiz' :
                   activity.type === 'project' ? 'Projeto' : 'Prova'}
                </Chip>
              </View>
              
              <View style={styles.activityStats}>
                <View style={styles.activityStat}>
                  <Text style={styles.activityStatLabel}>Média:</Text>
                  <Text style={styles.activityStatValue}>{activity.averageGrade.toFixed(1)}</Text>
                </View>
                <View style={styles.activityStat}>
                  <Text style={styles.activityStatLabel}>Entregas:</Text>
                  <Text style={styles.activityStatValue}>
                    {activity.submissions}/{activity.totalStudents}
                  </Text>
                </View>
                <View style={styles.activityStat}>
                  <Text style={styles.activityStatLabel}>Status:</Text>
                  <Text style={styles.activityStatValue}>
                    {activity.status === 'completed' ? 'Concluída' : 'Ativa'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  const renderTrends = () => (
    <View style={styles.tabContent}>
      <Card style={styles.trendsCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Tendências ao Longo do Período</Text>
          
          <View style={styles.trendsChart}>
            {report.details.trends.map((trend, index) => (
              <View key={index} style={styles.trendItem}>
                <Text style={styles.trendPeriod}>{trend.period}</Text>
                <View style={styles.trendBar}>
                  <View 
                    style={[
                      styles.trendBarFill, 
                      { 
                        width: `${(trend.averageGrade / 10) * 100}%`,
                        backgroundColor: trend.improvement > 0 ? '#10b981' : '#dc2626'
                      }
                    ]} 
                  />
                </View>
                <View style={styles.trendStats}>
                  <Text style={styles.trendGrade}>{trend.averageGrade.toFixed(1)}</Text>
                  <Text style={styles.trendSubmissions}>{trend.submissions} entregas</Text>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderRecommendations = () => (
    <View style={styles.tabContent}>
      <Card style={styles.recommendationsCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Recomendações</Text>
          
          {report.details.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <MaterialIcons name="lightbulb" size={20} color="#f59e0b" />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#3b82f6" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
                 <View style={styles.headerActions}>
           <TouchableOpacity onPress={() => setShowExportModal(true)} style={styles.headerAction}>
             <MaterialIcons name="download" size={20} color="#3b82f6" />
           </TouchableOpacity>
           <TouchableOpacity onPress={handleShare} style={styles.headerAction}>
             <MaterialIcons name="share" size={20} color="#3b82f6" />
           </TouchableOpacity>
         </View>
      </View>

      <View style={styles.reportHeader}>
        <View style={styles.reportInfo}>
          <View style={styles.reportIconContainer}>
            <MaterialIcons 
              name={getTypeIcon(report.type)} 
              size={32} 
              color={getTypeColor(report.type)} 
            />
          </View>
          <View style={styles.reportDetails}>
            <Text style={styles.reportTitle}>{report.title}</Text>
            <Text style={styles.reportDescription}>{report.description}</Text>
            <View style={styles.reportMeta}>
              <Text style={styles.reportMetaText}>Gerado em: {report.generatedAt}</Text>
              <Text style={styles.reportMetaText}>Período: {report.period}</Text>
              <Text style={styles.reportMetaText}>{report.dataPoints} pontos de dados</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'summary' && styles.tabActive]}
          onPress={() => setSelectedTab('summary')}
        >
          <Text style={[styles.tabText, selectedTab === 'summary' && styles.tabTextActive]}>
            Resumo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'details' && styles.tabActive]}
          onPress={() => setSelectedTab('details')}
        >
          <Text style={[styles.tabText, selectedTab === 'details' && styles.tabTextActive]}>
            Detalhes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'trends' && styles.tabActive]}
          onPress={() => setSelectedTab('trends')}
        >
          <Text style={[styles.tabText, selectedTab === 'trends' && styles.tabTextActive]}>
            Tendências
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'recommendations' && styles.tabActive]}
          onPress={() => setSelectedTab('recommendations')}
        >
          <Text style={[styles.tabText, selectedTab === 'recommendations' && styles.tabTextActive]}>
            Recomendações
          </Text>
        </TouchableOpacity>
      </View>

             {selectedTab === 'summary' && renderSummary()}
       {selectedTab === 'details' && renderDetails()}
       {selectedTab === 'trends' && renderTrends()}
       {selectedTab === 'recommendations' && renderRecommendations()}

       <ReportExportModal
         visible={showExportModal}
         onDismiss={() => setShowExportModal(false)}
         reportTitle={report.title}
         onExport={handleExport}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerAction: {
    padding: 4,
  },
  reportHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reportIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportDetails: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 12,
  },
  reportMeta: {
    gap: 4,
  },
  reportMetaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  tabActive: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#3b82f6',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  highlightsContainer: {
    gap: 12,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  highlightText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  highlightLabel: {
    fontWeight: '600',
  },
  performanceCard: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  classPerformanceItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  classGrade: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
  },
  classDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  classDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classDetailLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  classDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  improvementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  improvementText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  activityItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  activityTypeChip: {
    backgroundColor: '#f3f4f6',
  },
  activityStats: {
    flexDirection: 'row',
    gap: 16,
  },
  activityStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  trendsCard: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  trendsChart: {
    gap: 16,
  },
  trendItem: {
    gap: 8,
  },
  trendPeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  trendBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  trendBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendGrade: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  trendSubmissions: {
    fontSize: 12,
    color: '#6b7280',
  },
  recommendationsCard: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
}); 