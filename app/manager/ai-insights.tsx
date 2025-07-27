import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Chip, ProgressBar, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface AIInsight {
  id: string;
  type: 'improvement' | 'warning' | 'opportunity' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'performance' | 'engagement' | 'efficiency' | 'quality';
  date: string;
  actionable: boolean;
  action?: string;
}

interface AIUsageData {
  professor: string;
  usage: number;
  accuracy: number;
  timeSaved: number;
  satisfaction: number;
  activities: number;
}

interface AIPerformance {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'improvement',
    title: 'Melhoria Significativa em Matemática',
    description: 'A turma 9º A melhorou 15% em álgebra nas últimas 3 semanas. A IA detectou padrões de estudo mais eficazes.',
    impact: 'high',
    category: 'performance',
    date: '2024-12-16',
    actionable: true,
    action: 'Replicar estratégias para outras turmas',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Baixo Engajamento Detectado',
    description: '5 alunos do 8º B apresentam baixo engajamento com atividades. Recomenda-se intervenção personalizada.',
    impact: 'medium',
    category: 'engagement',
    date: '2024-12-15',
    actionable: true,
    action: 'Agendar reunião com coordenador',
  },
  {
    id: '3',
    type: 'opportunity',
    title: 'Oportunidade de Otimização',
    description: 'A IA pode economizar 2 horas por semana por professor em correções. Implementação recomendada.',
    impact: 'high',
    category: 'efficiency',
    date: '2024-12-14',
    actionable: true,
    action: 'Expandir uso da IA',
  },
  {
    id: '4',
    type: 'trend',
    title: 'Tendência Positiva em Ciências',
    description: 'Notas em ciências aumentaram 8% no último mês. Padrão consistente detectado.',
    impact: 'medium',
    category: 'performance',
    date: '2024-12-13',
    actionable: false,
  },
  {
    id: '5',
    type: 'warning',
    title: 'Qualidade de Correção',
    description: '3 professores apresentam inconsistências na correção. Treinamento adicional recomendado.',
    impact: 'medium',
    category: 'quality',
    date: '2024-12-12',
    actionable: true,
    action: 'Programar workshop',
  },
];

const mockUsageData: AIUsageData[] = [
  {
    professor: 'Prof. Maria Silva',
    usage: 95,
    accuracy: 94,
    timeSaved: 12,
    satisfaction: 9.2,
    activities: 28,
  },
  {
    professor: 'Prof. João Santos',
    usage: 87,
    accuracy: 91,
    timeSaved: 8,
    satisfaction: 8.8,
    activities: 22,
  },
  {
    professor: 'Prof. Ana Costa',
    usage: 92,
    accuracy: 96,
    timeSaved: 15,
    satisfaction: 9.5,
    activities: 31,
  },
  {
    professor: 'Prof. Pedro Lima',
    usage: 78,
    accuracy: 89,
    timeSaved: 6,
    satisfaction: 8.2,
    activities: 18,
  },
];

const mockPerformance: AIPerformance[] = [
  {
    metric: 'Precisão da IA',
    current: 94.2,
    previous: 91.8,
    change: 2.4,
    trend: 'up',
  },
  {
    metric: 'Tempo de Correção',
    current: 2.3,
    previous: 3.1,
    change: -0.8,
    trend: 'up',
  },
  {
    metric: 'Satisfação dos Professores',
    current: 8.9,
    previous: 8.6,
    change: 0.3,
    trend: 'up',
  },
  {
    metric: 'Adoção da IA',
    current: 89,
    previous: 85,
    change: 4,
    trend: 'up',
  },
];

export default function ManagerAIInsights() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'performance' | 'engagement' | 'efficiency' | 'quality'>('all');
  const [selectedImpact, setSelectedImpact] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredInsights = mockInsights.filter(insight => {
    const matchesCategory = selectedCategory === 'all' || insight.category === selectedCategory;
    const matchesImpact = selectedImpact === 'all' || insight.impact === selectedImpact;
    return matchesCategory && matchesImpact;
  });

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'improvement': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'opportunity': return '#3b82f6';
      case 'trend': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'improvement': return 'trending-up';
      case 'warning': return 'warning';
      case 'opportunity': return 'lightbulb';
      case 'trend': return 'analytics';
      default: return 'info';
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (trend: AIPerformance['trend']) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      case 'stable': return 'trending-flat';
      default: return 'trending-flat';
    }
  };

  const getTrendColor = (trend: AIPerformance['trend']) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      case 'stable': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>94.2%</Text>
              <Text style={styles.statLabel}>Precisão IA</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="schedule" size={24} color="#10b981" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>2.3s</Text>
              <Text style={styles.statLabel}>Tempo Médio</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="people" size={24} color="#3b82f6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>89%</Text>
              <Text style={styles.statLabel}>Adoção</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="thumb-up" size={24} color="#f59e0b" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>8.9</Text>
              <Text style={styles.statLabel}>Satisfação</Text>
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
          style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.filterText, selectedCategory === 'all' && styles.filterTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'performance' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('performance')}
        >
          <Text style={[styles.filterText, selectedCategory === 'performance' && styles.filterTextActive]}>
            Performance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'engagement' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('engagement')}
        >
          <Text style={[styles.filterText, selectedCategory === 'engagement' && styles.filterTextActive]}>
            Engajamento
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'efficiency' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('efficiency')}
        >
          <Text style={[styles.filterText, selectedCategory === 'efficiency' && styles.filterTextActive]}>
            Eficiência
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'quality' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('quality')}
        >
          <Text style={[styles.filterText, selectedCategory === 'quality' && styles.filterTextActive]}>
            Qualidade
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderInsightCard = (insight: AIInsight) => (
    <Card key={insight.id} style={styles.insightCard}>
      <Card.Content>
        <View style={styles.insightHeader}>
          <View style={styles.insightIcon}>
            <MaterialIcons
              name={getInsightIcon(insight.type)}
              size={20}
              color={getInsightColor(insight.type)}
            />
          </View>
          <View style={styles.insightMeta}>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <View style={styles.insightTags}>
              <Chip
                style={[styles.impactChip, { backgroundColor: getImpactColor(insight.impact) + '20' }]}
                textStyle={{ color: getImpactColor(insight.impact) }}
              >
                {insight.impact.toUpperCase()}
              </Chip>
              <Text style={styles.insightDate}>{insight.date}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.insightDescription}>{insight.description}</Text>

        {insight.actionable && insight.action && (
          <View style={styles.actionSection}>
            <Text style={styles.actionLabel}>Ação Recomendada:</Text>
            <Text style={styles.actionText}>{insight.action}</Text>
            <Button mode="contained" style={styles.actionButton}>
              Executar Ação
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderUsageAnalytics = () => (
    <Card style={styles.analyticsCard}>
      <Card.Content>
        <Text style={styles.cardTitle}>Uso da IA por Professor</Text>
        
        <View style={styles.usageList}>
          {mockUsageData.map((data, index) => (
            <View key={index} style={styles.usageItem}>
              <View style={styles.usageInfo}>
                <Text style={styles.professorName}>{data.professor}</Text>
                <Text style={styles.usageStats}>
                  {data.activities} atividades • {data.timeSaved}h economizadas
                </Text>
              </View>
              <View style={styles.usageMetrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Uso</Text>
                  <ProgressBar
                    progress={data.usage / 100}
                    color="#8b5cf6"
                    style={styles.metricBar}
                  />
                  <Text style={styles.metricValue}>{data.usage}%</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Precisão</Text>
                  <Text style={styles.metricValue}>{data.accuracy}%</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Satisfação</Text>
                  <Text style={styles.metricValue}>{data.satisfaction}/10</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderPerformanceMetrics = () => (
    <Card style={styles.analyticsCard}>
      <Card.Content>
        <Text style={styles.cardTitle}>Métricas de Performance</Text>
        
        <View style={styles.performanceList}>
          {mockPerformance.map((metric, index) => (
            <View key={index} style={styles.performanceItem}>
              <View style={styles.performanceInfo}>
                <Text style={styles.metricName}>{metric.metric}</Text>
                <Text style={styles.metricCurrent}>{metric.current}</Text>
              </View>
              <View style={styles.performanceTrend}>
                <MaterialIcons
                  name={getTrendIcon(metric.trend)}
                  size={16}
                  color={getTrendColor(metric.trend)}
                />
                <Text style={[styles.trendValue, { color: getTrendColor(metric.trend) }]}>
                  {metric.change > 0 ? '+' : ''}{metric.change}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>IA Insights</Text>
        <Text style={styles.subtitle}>Análises e recomendações inteligentes</Text>
      </View>

      {renderStats()}
      {renderFilters()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.insightsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Insights ({filteredInsights.length})</Text>
            <TouchableOpacity>
              <MaterialIcons name="refresh" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {filteredInsights.length > 0 ? (
            filteredInsights.map(renderInsightCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="psychology" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Nenhum insight encontrado</Text>
              <Text style={styles.emptyText}>
                Não há insights que correspondam aos filtros selecionados.
              </Text>
            </View>
          )}
        </View>

        {renderUsageAnalytics()}
        {renderPerformanceMetrics()}
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  insightsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
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
  insightCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  insightHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightMeta: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  insightTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  impactChip: {
    marginBottom: 0,
  },
  insightDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  insightDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionSection: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
  analyticsCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  usageList: {
    gap: 16,
  },
  usageItem: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  usageInfo: {
    marginBottom: 12,
  },
  professorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  usageStats: {
    fontSize: 14,
    color: '#6b7280',
  },
  usageMetrics: {
    gap: 8,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    width: 60,
  },
  metricBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    width: 40,
    textAlign: 'right',
  },
  performanceList: {
    gap: 12,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  performanceInfo: {
    flex: 1,
  },
  metricName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  metricCurrent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  performanceTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '600',
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