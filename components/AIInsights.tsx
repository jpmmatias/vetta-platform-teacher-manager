import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface Insight {
  id: string;
  type: 'improvement' | 'warning' | 'recommendation';
  title: string;
  message: string;
  classId?: string;
  priority: 'high' | 'medium' | 'low';
}

interface AIInsightsProps {
  insights: Insight[];
  onInsightPress: (insight: Insight) => void;
}

export default function AIInsights({ insights, onInsightPress }: AIInsightsProps) {
  const getInsightStyle = (type: string, priority: string) => {
    const baseStyle = styles.insightCard;
    
    switch (type) {
      case 'improvement':
        return [
          baseStyle,
          { backgroundColor: priority === 'high' ? '#dbeafe' : '#eff6ff' }
        ];
      case 'warning':
        return [
          baseStyle,
          { backgroundColor: priority === 'high' ? '#fed7aa' : '#fef3c7' }
        ];
      case 'recommendation':
        return [
          baseStyle,
          { backgroundColor: priority === 'high' ? '#d1fae5' : '#ecfdf5' }
        ];
      default:
        return baseStyle;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return { name: 'trending-up', color: '#1e40af' };
      case 'warning':
        return { name: 'warning', color: '#c2410c' };
      case 'recommendation':
        return { name: 'lightbulb', color: '#059669' };
      default:
        return { name: 'info', color: '#6b7280' };
    }
  };

  const getInsightTextColor = (type: string, priority: string) => {
    switch (type) {
      case 'improvement':
        return priority === 'high' ? '#1e40af' : '#1d4ed8';
      case 'warning':
        return priority === 'high' ? '#c2410c' : '#ea580c';
      case 'recommendation':
        return priority === 'high' ? '#059669' : '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card style={styles.container}>
      <Card.Title
        title="Insights da IA"
        titleStyle={styles.cardTitle}
        left={(props) => <MaterialIcons {...props} name="psychology" size={24} color="#8b5cf6" />}
        right={(props) => (
          <TouchableOpacity>
            <Text style={styles.linkText}>Ver todos</Text>
          </TouchableOpacity>
        )}
      />
      <Card.Content style={styles.cardContent}>
        {insights.slice(0, 3).map((insight) => {
          const icon = getInsightIcon(insight.type);
          const textColor = getInsightTextColor(insight.type, insight.priority);
          
          return (
            <TouchableOpacity
              key={insight.id}
              style={getInsightStyle(insight.type, insight.priority)}
              onPress={() => onInsightPress(insight)}
            >
              <View style={styles.insightHeader}>
                <MaterialIcons name={icon.name as any} size={16} color={icon.color} />
                <Text style={[styles.insightTitle, { color: textColor }]}>
                  {insight.title}
                </Text>
                {insight.priority === 'high' && (
                  <View style={[styles.priorityBadge, { backgroundColor: icon.color }]}>
                    <Text style={styles.priorityText}>Alta</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.insightText, { color: textColor }]}>
                {insight.message}
              </Text>
              {insight.classId && (
                <View style={styles.insightMeta}>
                  <MaterialIcons name="class" size={12} color={textColor} />
                  <Text style={[styles.insightMetaText, { color: textColor }]}>
                    Turma {insight.classId}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  cardContent: {
    padding: 16,
  },
  insightCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  insightText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  insightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightMetaText: {
    fontSize: 12,
    marginLeft: 4,
  },
}); 