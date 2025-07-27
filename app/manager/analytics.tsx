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

interface AnalyticsData {
  period: string;
  students: number;
  activities: number;
  averageGrade: number;
  aiUsage: number;
  timeSaved: number;
}

interface PerformanceData {
  class: string;
  subject: string;
  averageGrade: number;
  improvement: number;
  students: number;
  trend: 'up' | 'down' | 'stable';
}

const mockAnalytics: AnalyticsData[] = [
  { period: 'Janeiro', students: 1247, activities: 156, averageGrade: 8.2, aiUsage: 89, timeSaved: 45 },
  { period: 'Fevereiro', students: 1289, activities: 178, averageGrade: 8.4, aiUsage: 92, timeSaved: 52 },
  { period: 'Março', students: 1312, activities: 189, averageGrade: 8.6, aiUsage: 94, timeSaved: 58 },
  { period: 'Abril', students: 1345, activities: 201, averageGrade: 8.7, aiUsage: 96, timeSaved: 64 },
  { period: 'Maio', students: 1378, activities: 215, averageGrade: 8.8, aiUsage: 97, timeSaved: 71 },
  { period: 'Junho', students: 1412, activities: 228, averageGrade: 8.9, aiUsage: 98, timeSaved: 78 },
];

const mockPerformance: PerformanceData[] = [
  { class: '9º Ano A', subject: 'Matemática', averageGrade: 9.2, improvement: 15, students: 32, trend: 'up' },
  { class: '8º Ano B', subject: 'Português', averageGrade: 8.9, improvement: 12, students: 28, trend: 'up' },
  { class: '9º Ano C', subject: 'Ciências', averageGrade: 8.7, improvement: 8, students: 30, trend: 'up' },
  { class: '8º Ano A', subject: 'História', averageGrade: 8.5, improvement: 5, students: 26, trend: 'stable' },
  { class: '7º Ano B', subject: 'Geografia', averageGrade: 8.3, improvement: 3, students: 29, trend: 'up' },
  { class: '9º Ano B', subject: 'Inglês', averageGrade: 8.1, improvement: -2, students: 31, trend: 'down' },
];

export default function ManagerAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6 meses');
  const [selectedMetric, setSelectedMetric] = useState('performance');

  const periods = ['7 dias', '30 dias', '3 meses', '6 meses', '1 ano'];
  const metrics = [
    { id: 'performance', name: 'Performance', icon: 'trending-up' },
    { id: 'engagement', name: 'Engajamento', icon: 'people' },
    { id: 'efficiency', name: 'Eficiência', icon: 'speed' },
    { id: 'ai', name: 'IA Analytics', icon: 'psychology' },
  ];

  const getTrendIcon = (trend: PerformanceData['trend']) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      case 'stable': return 'trending-flat';
      default: return 'trending-flat';
    }
  };

  const getTrendColor = (trend: PerformanceData['trend']) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      case 'stable': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const renderMetricsSelector = () => (
    <View style={styles.metricsContainer}>
      {metrics.map((metric) => (
        <TouchableOpacity
          key={metric.id}
          style={[
            styles.metricCard,
            selectedMetric === metric.id && styles.metricCardActive,
          ]}
          onPress={() => setSelectedMetric(metric.id)}
        >
          <MaterialIcons
            name={metric.icon as any}
            size={24}
            color={selectedMetric === metric.id ? '#3b82f6' : '#6b7280'}
          />
          <Text
            style={[
              styles.metricText,
              selectedMetric === metric.id && styles.metricTextActive,
            ]}
          >
            {metric.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPeriodSelector = () => (
    <View style={styles.periodContainer}>
      <Text style={styles.sectionTitle}>Período</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodChip,
              selectedPeriod === period && styles.periodChipActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive,
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPerformanceChart = () => (
    <Card style={styles.chartCard}>
      <Card.Content>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Evolução da Performance</Text>
          <Text style={styles.chartSubtitle}>Média geral de notas</Text>
        </View>
        
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {mockAnalytics.map((data, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (data.averageGrade / 10) * 120,
                        backgroundColor: index === mockAnalytics.length - 1 ? '#3b82f6' : '#e5e7eb',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{data.period}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chartStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8.9</Text>
            <Text style={styles.statLabel}>Média Atual</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>+8.5%</Text>
            <Text style={styles.statLabel}>Crescimento</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1,412</Text>
            <Text style={styles.statLabel}>Estudantes</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderPerformanceTable = () => (
    <Card style={styles.tableCard}>
      <Card.Content>
        <View style={styles.tableHeader}>
          <Text style={styles.tableTitle}>Performance por Turma</Text>
          <Button mode="outlined" compact>
            Exportar
          </Button>
        </View>

        <View style={styles.tableContainer}>
          {mockPerformance.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.cellTitle}>{item.class}</Text>
                <Text style={styles.cellSubtitle}>{item.subject}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.cellValue}>{item.averageGrade}</Text>
                <Text style={styles.cellLabel}>Média</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={[styles.cellValue, { color: getTrendColor(item.trend) }]}>
                  {item.improvement > 0 ? '+' : ''}{item.improvement}%
                </Text>
                <Text style={styles.cellLabel}>Melhoria</Text>
              </View>
              <View style={styles.tableCell}>
                <MaterialIcons
                  name={getTrendIcon(item.trend)}
                  size={16}
                  color={getTrendColor(item.trend)}
                />
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderAIUsageChart = () => (
    <Card style={styles.chartCard}>
      <Card.Content>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Uso da IA</Text>
          <Text style={styles.chartSubtitle}>Adoção por período</Text>
        </View>
        
        <View style={styles.aiUsageContainer}>
          {mockAnalytics.map((data, index) => (
            <View key={index} style={styles.aiUsageItem}>
              <View style={styles.aiUsageHeader}>
                <Text style={styles.aiUsagePeriod}>{data.period}</Text>
                <Text style={styles.aiUsageValue}>{data.aiUsage}%</Text>
              </View>
              <ProgressBar
                progress={data.aiUsage / 100}
                color="#8b5cf6"
                style={styles.aiUsageBar}
              />
            </View>
          ))}
        </View>

        <View style={styles.aiStats}>
          <View style={styles.aiStatCard}>
            <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
            <Text style={styles.aiStatValue}>98%</Text>
            <Text style={styles.aiStatLabel}>Adoção Atual</Text>
          </View>
          <View style={styles.aiStatCard}>
            <MaterialIcons name="schedule" size={24} color="#10b981" />
            <Text style={styles.aiStatValue}>78h</Text>
            <Text style={styles.aiStatLabel}>Tempo Economizado</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Métricas e insights institucionais</Text>
      </View>

      {renderMetricsSelector()}
      {renderPeriodSelector()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedMetric === 'performance' && (
          <>
            {renderPerformanceChart()}
            {renderPerformanceTable()}
          </>
        )}

        {selectedMetric === 'ai' && (
          <>
            {renderAIUsageChart()}
            {renderPerformanceTable()}
          </>
        )}

        {selectedMetric === 'engagement' && (
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text style={styles.chartTitle}>Engajamento dos Estudantes</Text>
              <View style={styles.placeholder}>
                <MaterialIcons name="people" size={48} color="#d1d5db" />
                <Text style={styles.placeholderText}>Gráfico de Engajamento</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {selectedMetric === 'efficiency' && (
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text style={styles.chartTitle}>Eficiência Operacional</Text>
              <View style={styles.placeholder}>
                <MaterialIcons name="speed" size={48} color="#d1d5db" />
                <Text style={styles.placeholderText}>Gráfico de Eficiência</Text>
              </View>
            </Card.Content>
          </Card>
        )}
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  metricCardActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f620',
  },
  metricText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 8,
  },
  metricTextActive: {
    color: '#3b82f6',
  },
  periodContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  periodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  periodChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  periodText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  periodTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chartCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  chartContainer: {
    height: 160,
    marginBottom: 20,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 20,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  tableCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  tableContainer: {
    gap: 12,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  tableCell: {
    flex: 1,
    alignItems: 'center',
  },
  cellTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  cellSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  cellValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  cellLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  aiUsageContainer: {
    gap: 16,
    marginBottom: 20,
  },
  aiUsageItem: {
    gap: 8,
  },
  aiUsageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiUsagePeriod: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  aiUsageValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  aiUsageBar: {
    height: 6,
    borderRadius: 3,
  },
  aiStats: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  aiStatCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  aiStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  aiStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  placeholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
}); 