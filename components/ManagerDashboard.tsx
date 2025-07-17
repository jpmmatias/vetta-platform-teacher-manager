"use client"	
import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Card, Chip, List, Avatar, Divider, ProgressBar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function ManagerDashboard() {
  const stats = [
    { icon: 'people' as const, label: 'Total de Estudantes', value: '1,247', change: '+12%', color: '#3b82f6' },
    { icon: 'trending-up' as const, label: 'Média Geral', value: '8.7', change: '+8.5%', color: '#10b981' },
    { icon: 'psychology' as const, label: 'Correções IA/mês', value: '2,840', change: '+45%', color: '#8b5cf6' },
    { icon: 'schedule' as const, label: 'Tempo Economizado', value: '340h', change: '+67%', color: '#f59e0b' },
  ];

  const aiAnalytics = [
    { professor: 'Prof. Maria Silva', usage: 89, corrections: 156 },
    { professor: 'Prof. João Santos', usage: 76, corrections: 134 },
    { professor: 'Prof. Ana Costa', usage: 92, corrections: 178 }
  ];

  const alerts = [
    { type: 'error', title: 'Baixo Desempenho', message: 'Turma 8º C com média abaixo de 6.0' },
    { type: 'warning', title: 'Licenças', message: '15 licenças expiram em 30 dias' },
    { type: 'info', title: 'Atualização', message: 'Nova versão da IA disponível' }
  ];

  const topPerformers = [
    { name: '9º A - Matemática', score: 9.2, trend: 'up' },
    { name: '8º B - Português', score: 8.9, trend: 'up' },
    { name: '9º C - Ciências', score: 8.7, trend: 'down' }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' };
      case 'warning': return { bg: '#fffbeb', border: '#fed7aa', text: '#ea580c' };
      case 'info': return { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' };
      default: return { bg: '#f9fafb', border: '#e5e7eb', text: '#374151' };
    }
  };

  return (
    <ScrollView style={[styles.container, { paddingHorizontal: '2%' }]} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Dashboard Executivo 📊</Text>
        <Text style={styles.welcomeSubtitle}>
          Visão geral da performance institucional e insights estratégicos.
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <MaterialIcons name={stat.icon} size={16} color={stat.color} />
                </View>
                <View style={styles.changeContainer}>
                  <MaterialIcons name="trending-up" size={12} color="#10b981" />
                  <Text style={styles.changeText}>{stat.change}</Text>
                </View>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Performance Chart */}
      <Card style={styles.card}>
        <Card.Title
          title="Performance Institucional"
          titleStyle={styles.cardTitle}
          right={(props) => (
            <View style={styles.chartActions}>
              <TouchableOpacity style={styles.selectButton}>
                <Text style={styles.selectButtonText}>6 meses</Text>
                <MaterialIcons name="keyboard-arrow-down" size={16} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialIcons name="more-vert" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          )}
        />
        <Card.Content style={styles.cardContent}>
          <View style={styles.chartPlaceholder}>
            <MaterialIcons name="bar-chart" size={48} color="#d1d5db" />
            <Text style={styles.chartPlaceholderText}>Gráfico de Performance</Text>
            <Text style={styles.chartPlaceholderSubtext}>Média de notas por período</Text>
          </View>
        </Card.Content>
      </Card>

      {/* AI Analytics */}
      <Card style={styles.card}>
        <Card.Title
          title="Analytics de IA"
          titleStyle={styles.cardTitle}
          left={(props) => <MaterialIcons {...props} name="psychology" size={24} color="#8b5cf6" />}
        />
        <Card.Content style={styles.cardContent}>
          <View style={styles.analyticsGrid}>
            <View style={[styles.analyticsCard, { backgroundColor: '#f3e8ff' }]}>
              <Text style={[styles.analyticsValue, { color: '#7c3aed' }]}>94%</Text>
              <Text style={[styles.analyticsLabel, { color: '#6d28d9' }]}>Precisão da IA</Text>
            </View>
            <View style={[styles.analyticsCard, { backgroundColor: '#dbeafe' }]}>
              <Text style={[styles.analyticsValue, { color: '#1d4ed8' }]}>2.3s</Text>
              <Text style={[styles.analyticsLabel, { color: '#1e40af' }]}>Tempo Médio</Text>
            </View>
            <View style={[styles.analyticsCard, { backgroundColor: '#dcfce7' }]}>
              <Text style={[styles.analyticsValue, { color: '#15803d' }]}>98%</Text>
              <Text style={[styles.analyticsLabel, { color: '#166534' }]}>Satisfação</Text>
            </View>
          </View>

          {aiAnalytics.map((item, index) => (
            <View key={index}>
              <View style={styles.listItem}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{item.professor}</Text>
                  <Text style={styles.listItemSubtitle}>{item.corrections} correções este mês</Text>
                </View>
                <View style={styles.usageContainer}>
                  <View style={styles.progressContainer}>
                    <ProgressBar 
                      progress={item.usage / 100} 
                      color="#8b5cf6" 
                      style={styles.progressBar}
                    />
                  </View>
                  <Text style={styles.usageText}>{item.usage}%</Text>
                </View>
              </View>
              {index < aiAnalytics.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Alerts */}
      <Card style={styles.card}>
        <Card.Title
          title="Alertas"
          titleStyle={styles.cardTitle}
          left={(props) => <MaterialIcons {...props} name="warning" size={24} color="#f59e0b" />}
        />
        <Card.Content style={styles.cardContent}>
          {alerts.map((alert, index) => {
            const colors = getAlertColor(alert.type);
            return (
              <View key={index} style={[styles.alertCard, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                <Text style={[styles.alertTitle, { color: colors.text }]}>
                  {alert.title}
                </Text>
                <Text style={[styles.alertMessage, { color: colors.text }]}>
                  {alert.message}
                </Text>
              </View>
            );
          })}
        </Card.Content>
      </Card>

      {/* Top Performers */}
      <Card style={styles.card}>
        <Card.Title
          title="Top Performers"
          titleStyle={styles.cardTitle}
          left={(props) => <MaterialIcons {...props} name="emoji-events" size={24} color="#fbbf24" />}
        />
        <Card.Content style={styles.cardContent}>
          {topPerformers.map((performer, index) => (
            <View key={index} style={styles.performerItem}>
              <View style={styles.performerInfo}>
                <Text style={styles.performerName}>{performer.name}</Text>
                <Text style={styles.performerScore}>Média: {performer.score}</Text>
              </View>
              <MaterialIcons 
                name={performer.trend === 'up' ? 'trending-up' : 'trending-down'} 
                size={16} 
                color={performer.trend === 'up' ? '#10b981' : '#ef4444'} 
              />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Title title="Ações Rápidas" titleStyle={styles.cardTitle} />
        <Card.Content style={styles.cardContent}>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Gerar Relatório Mensal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Exportar Dados</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Configurar Alertas</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    width: '48%',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 12,
  },
  statContent: {
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10b981',
    marginLeft: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  card: {
    margin: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cardContent: {
    paddingHorizontal: 0,
  },
  chartActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#f9fafb',
  },
  selectButtonText: {
    fontSize: 12,
    color: '#374151',
    marginRight: 4,
    fontWeight: '500',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },
  chartPlaceholderSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  analyticsGrid: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
    paddingHorizontal: 20,
  },
  analyticsCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    width: 60,
    marginRight: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  usageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    width: 24,
  },
  divider: {
    backgroundColor: '#f3f4f6',
    height: 1,
    marginHorizontal: 20,
  },
  alertCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  performerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  performerScore: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
}); 