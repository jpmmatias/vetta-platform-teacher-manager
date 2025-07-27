"use client"	
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Card, Chip, List, Avatar, Divider, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import QuickActionsModal from './QuickActionsModal';

const statMeta = [
  {
    icon: 'people' as const,
    iconBg: '#e0e7ff',
    iconColor: '#3b82f6',
    label: 'Total',
    valueLabel: 'Estudantes',
  },
  {
    icon: 'check-circle' as const,
    iconBg: '#d1fae5',
    iconColor: '#10b981',
    label: 'Concluídas',
    valueLabel: 'Atividades',
  },
  {
    icon: 'schedule' as const,
    iconBg: '#fef3c7',
    iconColor: '#f59e0b',
    label: 'Pendentes',
    valueLabel: 'Correções',
  },
  {
    icon: 'trending-up' as const,
    iconBg: '#ede9fe',
    iconColor: '#8b5cf6',
    label: 'Média',
    valueLabel: 'Performance',
  },
];

export default function TeacherDashboard() {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const stats = [
    { value: '156' },
    { value: '28' },
    { value: '12' },
    { value: '8.4' },
  ];

  const aiCorrections = [
    { subject: 'Matemática - 9º A', activity: 'Equações do 2º Grau', students: 32, status: 'processing' },
    { subject: 'Matemática - 8º B', activity: 'Frações e Decimais', students: 28, status: 'completed' },
    { subject: 'Matemática - 9º C', activity: 'Geometria Plana', students: 30, status: 'pending' }
  ];

  const recentActivities = [
    { title: 'Prova - Funções Quadráticas', class: '9º A', date: 'Hoje', submissions: 28 },
    { title: 'Lista de Exercícios - Trigonometria', class: '9º B', date: 'Ontem', submissions: 30 },
    { title: 'Trabalho em Grupo - Estatística', class: '8º A', date: '2 dias', submissions: 24 }
  ];

  const schedule = [
    { time: '08:00', class: '9º A - Matemática', room: 'Sala 12' },
    { time: '10:00', class: '8º B - Matemática', room: 'Sala 15' },
    { time: '14:00', class: '9º C - Matemática', room: 'Sala 12' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return 'Processando';
      case 'completed': return 'Concluído';
      case 'pending': return 'Pendente';
      default: return '';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Bom dia, Prof. Maria! 👋</Text>
        <Text style={styles.welcomeSubtitle}>
          Você tem 12 atividades aguardando correção e 3 turmas com aulas hoje.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <View key={i} style={styles.statCardCustom}>
            <View style={styles.statCardTopRow}>
              <View style={[styles.statIconCircle, { backgroundColor: statMeta[i].iconBg }]}> 
                <MaterialIcons name={statMeta[i].icon as any} size={24} color={statMeta[i].iconColor} />
              </View>
              <Text style={styles.statLabel}>{statMeta[i].label}</Text>
            </View>
            <Text style={styles.statValueCustom}>{stat.value}</Text>
            <Text style={styles.statValueLabel}>{statMeta[i].valueLabel}</Text>
          </View>
        ))}
      </View>

      {/* AI Corrections */}
      <Card style={styles.card}>
        <Card.Title
          title="Correção Automática"
          titleStyle={styles.cardTitle}
          left={(props) => <MaterialIcons {...props} name="psychology" size={24} color="#8b5cf6" />}
          right={(props) => (
            <TouchableOpacity>
              <Text style={styles.linkText}>Ver todas</Text>
            </TouchableOpacity>
          )}
        />
        <Card.Content style={styles.cardContent}>
          {aiCorrections.map((item, index) => (
            <View key={index}>
              <View style={styles.listItem}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{item.activity}</Text>
                  <Text style={styles.listItemSubtitle}>{item.subject} • {item.students} estudantes</Text>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </View>
              {index < aiCorrections.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Recent Activities */}
      <Card style={styles.card}>
        <Card.Title
          title="Atividades Recentes"
          titleStyle={styles.cardTitle}
          right={(props) => (
            <TouchableOpacity style={styles.addButton}>
              <MaterialIcons name="add" size={20} color="white" />
              <Text style={styles.addButtonText}>Nova</Text>
            </TouchableOpacity>
          )}
        />
        <Card.Content style={styles.cardContent}>
          {recentActivities.map((activity, index) => (
            <View key={index}>
              <View style={styles.listItem}>
                <View style={styles.activityIcon}>
                  <MaterialIcons name="book" size={16} color="#6b7280" />
                </View>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{activity.title}</Text>
                  <Text style={styles.listItemSubtitle}>{activity.class} • {activity.submissions} entregas</Text>
                </View>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                  <MaterialIcons name="chevron-right" size={16} color="#9ca3af" />
                </View>
              </View>
              {index < recentActivities.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Schedule */}
      <Card style={styles.card}>
        <Card.Title
          title="Agenda de Hoje"
          titleStyle={styles.cardTitle}
          left={(props) => <MaterialIcons {...props} name="event" size={24} color="#3b82f6" />}
        />
        <Card.Content style={styles.cardContent}>
          {schedule.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>{item.time}</Text>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleClass}>{item.class}</Text>
                <Text style={styles.scheduleRoom}>{item.room}</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Insights */}
      <Card style={styles.card}>
        <Card.Title title="Insights da IA" titleStyle={styles.cardTitle} />
        <Card.Content style={styles.cardContent}>
          <View style={[styles.insightCard, { backgroundColor: '#dbeafe' }]}>
            <Text style={[styles.insightTitle, { color: '#1e40af' }]}>
              Melhoria Detectada
            </Text>
            <Text style={[styles.insightText, { color: '#1d4ed8' }]}>
              A turma 9º A melhorou 15% em álgebra nas últimas 3 semanas.
            </Text>
          </View>
          <View style={[styles.insightCard, { backgroundColor: '#fed7aa' }]}>
            <Text style={[styles.insightTitle, { color: '#c2410c' }]}>
              Atenção Necessária
            </Text>
            <Text style={[styles.insightText, { color: '#ea580c' }]}>
              5 alunos do 8º B precisam de reforço em geometria.
            </Text>
          </View>
        </Card.Content>
      </Card>
      </View>
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowQuickActions(true)}
        label="Ações Rápidas"
      />

      <QuickActionsModal
        visible={showQuickActions}
        onDismiss={() => setShowQuickActions(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    
  },
  contentContainer: {
    flex: 1,
    marginBottom: 8,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: "4%",
    paddingVertical: 16,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: "4%",
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
    gap: 16,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  statCardCustom: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    flexBasis: '47%',
    marginBottom: 16,
    padding: 18,
    minWidth: 150,
    maxWidth: '50%',
    flexGrow: 1,
    shadowColor: 'transparent',
  },
  statCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  statValueCustom: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statValueLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '400',
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
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    backgroundColor: '#f3f4f6',
    height: 1,
    marginHorizontal: 20,
  },
  addButton: {
    flexDirection: 'row',
    marginRight: 16,
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  activityIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    width: 48,
  },
  scheduleContent: {
    flex: 1,
    marginLeft: 16,
  },
  scheduleClass: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  scheduleRoom: {
    fontSize: 12,
    color: '#6b7280',
  },
  insightCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginVertical: 8,
    marginHorizontal: "2%",
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  insightText: {
    fontSize: 14,
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