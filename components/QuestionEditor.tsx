import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Modal, Portal, Card, Button, Chip, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface QuestionData {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'problem';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionEditorProps {
  visible: boolean;
  onDismiss: () => void;
  questions: QuestionData[];
  onSave: (questions: QuestionData[]) => void;
  activityTitle: string;
}

const questionTypes = [
  {
    id: 'multiple-choice',
    name: 'Múltipla Escolha',
    icon: 'radio-button-checked',
    color: '#3b82f6',
  },
  {
    id: 'true-false',
    name: 'Verdadeiro/Falso',
    icon: 'check-circle',
    color: '#10b981',
  },
  {
    id: 'short-answer',
    name: 'Resposta Curta',
    icon: 'short-text',
    color: '#f59e0b',
  },
  {
    id: 'essay',
    name: 'Dissertativa',
    icon: 'article',
    color: '#8b5cf6',
  },
  {
    id: 'problem',
    name: 'Problema',
    icon: 'calculate',
    color: '#dc2626',
  },
];

export default function QuestionEditor({ 
  visible, 
  onDismiss, 
  questions, 
  onSave, 
  activityTitle 
}: QuestionEditorProps) {
  const [editedQuestions, setEditedQuestions] = useState<QuestionData[]>(questions);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const getQuestionTypeInfo = (typeId: string) => {
    return questionTypes.find(type => type.id === typeId) || questionTypes[0];
  };

  const editQuestion = (questionId: string, field: keyof QuestionData, value: any) => {
    setEditedQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, [field]: value }
          : q
      )
    );
  };

  const removeQuestion = (questionId: string) => {
    Alert.alert(
      'Remover Questão',
      'Tem certeza que deseja remover esta questão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => {
            setEditedQuestions(prev => prev.filter(q => q.id !== questionId));
          }
        },
      ]
    );
  };

  const addNewQuestion = () => {
    const newQuestion: QuestionData = {
      id: `question-${Date.now()}`,
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1,
      difficulty: 'medium',
    };
    setEditedQuestions(prev => [...prev, newQuestion]);
    setEditingQuestion(newQuestion.id);
  };

  const duplicateQuestion = (question: QuestionData) => {
    const duplicatedQuestion: QuestionData = {
      ...question,
      id: `question-${Date.now()}`,
      question: `${question.question} (cópia)`,
    };
    setEditedQuestions(prev => [...prev, duplicatedQuestion]);
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    setEditedQuestions(prev => {
      const index = prev.findIndex(q => q.id === questionId);
      if (index === -1) return prev;

      const newQuestions = [...prev];
      if (direction === 'up' && index > 0) {
        [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
      } else if (direction === 'down' && index < newQuestions.length - 1) {
        [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
      }
      return newQuestions;
    });
  };

  const handleSave = () => {
    // Validar se todas as questões têm conteúdo
    const invalidQuestions = editedQuestions.filter(q => !q.question.trim());
    if (invalidQuestions.length > 0) {
      Alert.alert('Erro', 'Todas as questões devem ter um enunciado.');
      return;
    }

    onSave(editedQuestions);
    onDismiss();
  };

  const renderQuestionCard = (question: QuestionData, index: number) => {
    const typeInfo = getQuestionTypeInfo(question.type);
    const isEditing = editingQuestion === question.id;

    return (
      <Card key={question.id} style={styles.questionCard}>
        <Card.Content>
          <View style={styles.questionHeader}>
            <View style={styles.questionInfo}>
              <View style={[styles.questionTypeIcon, { backgroundColor: typeInfo.color + '20' }]}>
                <MaterialIcons name={typeInfo.icon as any} size={16} color={typeInfo.color} />
              </View>
              <Text style={styles.questionNumber}>Questão {index + 1}</Text>
              <Chip
                mode="flat"
                textStyle={{ color: 'white', fontSize: 10 }}
                style={[
                  styles.difficultyChip,
                  { 
                    backgroundColor: 
                      question.difficulty === 'easy' ? '#10b981' :
                      question.difficulty === 'medium' ? '#f59e0b' : '#dc2626'
                  }
                ]}
              >
                {question.difficulty === 'easy' ? 'Fácil' : 
                 question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </Chip>
              <Text style={styles.pointsText}>{question.points} pts</Text>
            </View>
            <View style={styles.questionActions}>
              <TouchableOpacity
                onPress={() => moveQuestion(question.id, 'up')}
                disabled={index === 0}
                style={[styles.actionButton, index === 0 && styles.actionButtonDisabled]}
              >
                <MaterialIcons name="keyboard-arrow-up" size={20} color={index === 0 ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => moveQuestion(question.id, 'down')}
                disabled={index === editedQuestions.length - 1}
                style={[styles.actionButton, index === editedQuestions.length - 1 && styles.actionButtonDisabled]}
              >
                <MaterialIcons name="keyboard-arrow-down" size={20} color={index === editedQuestions.length - 1 ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => duplicateQuestion(question)}
                style={styles.actionButton}
              >
                <MaterialIcons name="content-copy" size={20} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEditingQuestion(isEditing ? null : question.id)}
                style={styles.actionButton}
              >
                <MaterialIcons name={isEditing ? "visibility" : "edit"} size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeQuestion(question.id)}
                style={styles.actionButton}
              >
                <MaterialIcons name="delete" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>

          {isEditing ? (
            <View style={styles.editMode}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Enunciado da Questão</Text>
                <TextInput
                  style={styles.textArea}
                  value={question.question}
                  onChangeText={(text) => editQuestion(question.id, 'question', text)}
                  multiline
                  numberOfLines={3}
                  placeholder="Digite o enunciado da questão..."
                />
              </View>

              {question.type === 'multiple-choice' && question.options && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Opções de Resposta</Text>
                  {question.options.map((option, optionIndex) => (
                    <View key={optionIndex} style={styles.optionRow}>
                      <Text style={styles.optionLabel}>
                        {String.fromCharCode(65 + optionIndex)})
                      </Text>
                      <TextInput
                        style={styles.optionInput}
                        value={option}
                        onChangeText={(text) => {
                          const newOptions = [...question.options!];
                          newOptions[optionIndex] = text;
                          editQuestion(question.id, 'options', newOptions);
                        }}
                        placeholder={`Opção ${String.fromCharCode(65 + optionIndex)}`}
                      />
                    </View>
                  ))}
                  <TextInput
                    style={styles.textInput}
                    value={question.correctAnswer || ''}
                    onChangeText={(text) => editQuestion(question.id, 'correctAnswer', text)}
                    placeholder="Resposta correta (ex: A, B, C ou D)"
                  />
                </View>
              )}

              {question.type === 'true-false' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Resposta Correta</Text>
                  <View style={styles.trueFalseSelector}>
                    {(['true', 'false'] as const).map((value) => (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.trueFalseButton,
                          question.correctAnswer === value && styles.trueFalseButtonActive
                        ]}
                        onPress={() => editQuestion(question.id, 'correctAnswer', value)}
                      >
                        <Text style={[
                          styles.trueFalseText,
                          question.correctAnswer === value && styles.trueFalseTextActive
                        ]}>
                          {value === 'true' ? 'Verdadeiro' : 'Falso'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {(question.type === 'short-answer' || question.type === 'problem') && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Resposta Esperada</Text>
                  <TextInput
                    style={styles.textInput}
                    value={question.correctAnswer || ''}
                    onChangeText={(text) => editQuestion(question.id, 'correctAnswer', text)}
                    placeholder="Resposta esperada"
                  />
                </View>
              )}

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Pontos</Text>
                  <TextInput
                    style={styles.textInput}
                    value={question.points.toString()}
                    onChangeText={(text) => editQuestion(question.id, 'points', parseInt(text) || 1)}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Dificuldade</Text>
                  <View style={styles.difficultySelector}>
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.difficultyButton,
                          question.difficulty === level && styles.difficultyButtonActive
                        ]}
                        onPress={() => editQuestion(question.id, 'difficulty', level)}
                      >
                        <Text style={[
                          styles.difficultyText,
                          question.difficulty === level && styles.difficultyTextActive
                        ]}>
                          {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Médio' : 'Difícil'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.viewMode}>
              <Text style={styles.questionText}>{question.question}</Text>
              
              {question.type === 'multiple-choice' && question.options && (
                <View style={styles.optionsList}>
                  {question.options.map((option, optionIndex) => (
                    <Text key={optionIndex} style={styles.optionText}>
                      {String.fromCharCode(65 + optionIndex)}) {option}
                    </Text>
                  ))}
                  <Text style={styles.correctAnswer}>
                    Resposta correta: {question.correctAnswer}
                  </Text>
                </View>
              )}

              {question.type === 'true-false' && (
                <Text style={styles.correctAnswer}>
                  Resposta correta: {question.correctAnswer === 'true' ? 'Verdadeiro' : 'Falso'}
                </Text>
              )}

              {(question.type === 'short-answer' || question.type === 'problem') && question.correctAnswer && (
                <Text style={styles.correctAnswer}>
                  Resposta esperada: {question.correctAnswer}
                </Text>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Editor de Questões</Text>
          <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.activityTitle}>{activityTitle}</Text>
          <Text style={styles.questionCount}>
            {editedQuestions.length} questão{editedQuestions.length !== 1 ? 'ões' : ''}
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {editedQuestions.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="quiz" size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>Nenhuma questão criada</Text>
              <Text style={styles.emptyStateSubtext}>
                Adicione questões para criar sua atividade
              </Text>
            </View>
          ) : (
            editedQuestions.map((question, index) => renderQuestionCard(question, index))
          )}
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            mode="outlined"
            onPress={addNewQuestion}
            style={styles.footerButton}
            icon="plus"
          >
            Adicionar Questão
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={[styles.footerButton, styles.primaryButton]}
          >
            Salvar Alterações
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
    width: width - 40,
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
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  headerInfo: {
    padding: 20,
    paddingBottom: 0,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  questionCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  questionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  questionTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  difficultyChip: {
    marginRight: 8,
  },
  pointsText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  questionActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  viewMode: {
    marginTop: 8,
  },
  questionText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    marginBottom: 12,
  },
  optionsList: {
    marginTop: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    paddingLeft: 16,
  },
  correctAnswer: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
    marginTop: 8,
    fontStyle: 'italic',
  },
  editMode: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
    height: 100,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
    width: 20,
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  difficultyText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  difficultyTextActive: {
    color: 'white',
  },
  trueFalseSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  trueFalseButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    alignItems: 'center',
  },
  trueFalseButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  trueFalseText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  trueFalseTextActive: {
    color: 'white',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
}); 