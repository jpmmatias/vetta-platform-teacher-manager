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
import { Modal, Portal, Card, Chip, Button, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface NewClassModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (classData: NewClassData) => void;
}

interface NewClassData {
  name: string;
  subject: string;
  period: string;
  grade: string;
  shift: string;
  description: string;
  settings: {
    enableAICorrection: boolean;
    enableNotifications: boolean;
    enableReports: boolean;
    allowStudentUpload: boolean;
  };
}

const subjects = [
  'Matemática',
  'Português',
  'Ciências',
  'História',
  'Geografia',
  'Física',
  'Química',
  'Biologia',
  'Inglês',
  'Espanhol',
  'Arte',
  'Educação Física',
  'Filosofia',
  'Sociologia',
];

const periods = [
  '2024.1',
  '2024.2',
  '2025.1',
  '2025.2',
];

const grades = [
  '6º Ano',
  '7º Ano',
  '8º Ano',
  '9º Ano',
  '1º Ano EM',
  '2º Ano EM',
  '3º Ano EM',
];

const shifts = [
  'Manhã',
  'Tarde',
  'Noite',
  'Integral',
];

const subjectColors = {
  Matemática: '#FF6B35',
  Português: '#2563EB',
  Ciências: '#16A34A',
  História: '#7C3AED',
  Geografia: '#0891B2',
  Física: '#DC2626',
  Química: '#7C2D12',
  Biologia: '#059669',
  Inglês: '#1E40AF',
  Espanhol: '#BE185D',
  Arte: '#F59E0B',
  'Educação Física': '#10B981',
  Filosofia: '#8B5CF6',
  Sociologia: '#EF4444',
};

export default function NewClassModal({ visible, onDismiss, onSubmit }: NewClassModalProps) {
  const [formData, setFormData] = useState<NewClassData>({
    name: '',
    subject: '',
    period: '',
    grade: '',
    shift: '',
    description: '',
    settings: {
      enableAICorrection: true,
      enableNotifications: true,
      enableReports: true,
      allowStudentUpload: true,
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da turma é obrigatório';
    }
    if (!formData.subject) {
      newErrors.subject = 'Disciplina é obrigatória';
    }
    if (!formData.period) {
      newErrors.period = 'Período é obrigatório';
    }
    if (!formData.grade) {
      newErrors.grade = 'Série é obrigatória';
    }
    if (!formData.shift) {
      newErrors.shift = 'Turno é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      subject: '',
      period: '',
      grade: '',
      shift: '',
      description: '',
      settings: {
        enableAICorrection: true,
        enableNotifications: true,
        enableReports: true,
        allowStudentUpload: true,
      },
    });
    setCurrentStep(1);
    setErrors({});
    onDismiss();
  };

  const toggleSetting = (setting: keyof NewClassData['settings']) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting],
      },
    }));
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step ? styles.stepCircleActive : styles.stepCircleInactive
          ]}>
            <Text style={[
              styles.stepNumber,
              currentStep >= step ? styles.stepNumberActive : styles.stepNumberInactive
            ]}>
              {step}
            </Text>
          </View>
          <Text style={[
            styles.stepLabel,
            currentStep >= step ? styles.stepLabelActive : styles.stepLabelInactive
          ]}>
            {step === 1 ? 'Informações' : step === 2 ? 'Configurações' : 'Revisão'}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Informações Básicas</Text>
      
      {/* Nome da Turma */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nome da Turma *</Text>
        <TextInput
          style={[styles.textInput, errors.name && styles.inputError]}
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Ex: Matemática - 9º Ano A"
          maxLength={100}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      {/* Disciplina */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Disciplina *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject}
              onPress={() => setFormData(prev => ({ ...prev, subject }))}
            >
              <Chip
                mode={formData.subject === subject ? 'flat' : 'outlined'}
                textStyle={[
                  styles.chipText,
                  formData.subject === subject && { color: 'white' }
                ]}
                style={[
                  styles.chip,
                  formData.subject === subject && {
                    backgroundColor: subjectColors[subject as keyof typeof subjectColors] || '#6b7280'
                  }
                ]}
              >
                {subject}
              </Chip>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
      </View>

      {/* Período e Série */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Período *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => setFormData(prev => ({ ...prev, period }))}
              >
                <Chip
                  mode={formData.period === period ? 'flat' : 'outlined'}
                  textStyle={[
                    styles.chipText,
                    formData.period === period && { color: 'white' }
                  ]}
                  style={[
                    styles.chip,
                    formData.period === period && { backgroundColor: '#3b82f6' }
                  ]}
                >
                  {period}
                </Chip>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.period && <Text style={styles.errorText}>{errors.period}</Text>}
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Série *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {grades.map((grade) => (
              <TouchableOpacity
                key={grade}
                onPress={() => setFormData(prev => ({ ...prev, grade }))}
              >
                <Chip
                  mode={formData.grade === grade ? 'flat' : 'outlined'}
                  textStyle={[
                    styles.chipText,
                    formData.grade === grade && { color: 'white' }
                  ]}
                  style={[
                    styles.chip,
                    formData.grade === grade && { backgroundColor: '#10b981' }
                  ]}
                >
                  {grade}
                </Chip>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.grade && <Text style={styles.errorText}>{errors.grade}</Text>}
        </View>
      </View>

      {/* Turno */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Turno *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {shifts.map((shift) => (
            <TouchableOpacity
              key={shift}
              onPress={() => setFormData(prev => ({ ...prev, shift }))}
            >
              <Chip
                mode={formData.shift === shift ? 'flat' : 'outlined'}
                textStyle={[
                  styles.chipText,
                  formData.shift === shift && { color: 'white' }
                ]}
                style={[
                  styles.chip,
                  formData.shift === shift && { backgroundColor: '#f59e0b' }
                ]}
              >
                {shift}
              </Chip>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {errors.shift && <Text style={styles.errorText}>{errors.shift}</Text>}
      </View>

      {/* Descrição */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Descrição (Opcional)</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Descreva a turma, objetivos, metodologia..."
          multiline
          numberOfLines={4}
          maxLength={500}
        />
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Configurações da Turma</Text>
      
      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Correção Automática com IA</Text>
              <Text style={styles.settingDescription}>
                Permite que a IA corrija automaticamente as atividades dos estudantes
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              formData.settings.enableAICorrection && styles.toggleActive
            ]}
            onPress={() => toggleSetting('enableAICorrection')}
          >
            <View style={[
              styles.toggleThumb,
              formData.settings.enableAICorrection && styles.toggleThumbActive
            ]} />
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="notifications" size={24} color="#3b82f6" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notificações</Text>
              <Text style={styles.settingDescription}>
                Receba alertas sobre atividades pendentes e novidades
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              formData.settings.enableNotifications && styles.toggleActive
            ]}
            onPress={() => toggleSetting('enableNotifications')}
          >
            <View style={[
              styles.toggleThumb,
              formData.settings.enableNotifications && styles.toggleThumbActive
            ]} />
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="bar-chart" size={24} color="#10b981" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Relatórios Automáticos</Text>
              <Text style={styles.settingDescription}>
                Gera relatórios semanais de desempenho da turma
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              formData.settings.enableReports && styles.toggleActive
            ]}
            onPress={() => toggleSetting('enableReports')}
          >
            <View style={[
              styles.toggleThumb,
              formData.settings.enableReports && styles.toggleThumbActive
            ]} />
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="cloud-upload" size={24} color="#f59e0b" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Upload de Arquivos</Text>
              <Text style={styles.settingDescription}>
                Permite que estudantes enviem arquivos para atividades
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              formData.settings.allowStudentUpload && styles.toggleActive
            ]}
            onPress={() => toggleSetting('allowStudentUpload')}
          >
            <View style={[
              styles.toggleThumb,
              formData.settings.allowStudentUpload && styles.toggleThumbActive
            ]} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Revisar Informações</Text>
      
      <Card style={styles.reviewCard}>
        <Card.Content>
          <View style={styles.reviewSection}>
            <Text style={styles.reviewSectionTitle}>Informações Básicas</Text>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Nome:</Text>
              <Text style={styles.reviewValue}>{formData.name}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Disciplina:</Text>
              <Chip
                mode="flat"
                textStyle={{ color: 'white', fontSize: 12 }}
                style={[
                  styles.reviewChip,
                  { backgroundColor: subjectColors[formData.subject as keyof typeof subjectColors] || '#6b7280' }
                ]}
              >
                {formData.subject}
              </Chip>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Período:</Text>
              <Text style={styles.reviewValue}>{formData.period}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Série:</Text>
              <Text style={styles.reviewValue}>{formData.grade}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Turno:</Text>
              <Text style={styles.reviewValue}>{formData.shift}</Text>
            </View>
            {formData.description && (
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Descrição:</Text>
                <Text style={styles.reviewValue}>{formData.description}</Text>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.reviewSection}>
            <Text style={styles.reviewSectionTitle}>Configurações</Text>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Correção IA:</Text>
              <Text style={styles.reviewValue}>
                {formData.settings.enableAICorrection ? 'Ativada' : 'Desativada'}
              </Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Notificações:</Text>
              <Text style={styles.reviewValue}>
                {formData.settings.enableNotifications ? 'Ativadas' : 'Desativadas'}
              </Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Relatórios:</Text>
              <Text style={styles.reviewValue}>
                {formData.settings.enableReports ? 'Automáticos' : 'Manuais'}
              </Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Upload:</Text>
              <Text style={styles.reviewValue}>
                {formData.settings.allowStudentUpload ? 'Permitido' : 'Bloqueado'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Nova Turma</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {renderStepIndicator()}

        {renderCurrentStep()}

        <View style={styles.modalFooter}>
          {currentStep > 1 && (
            <Button
              mode="outlined"
              onPress={handleBack}
              style={styles.footerButton}
            >
              Voltar
            </Button>
          )}
          <Button
            mode="contained"
            onPress={handleNext}
            style={[styles.footerButton, styles.primaryButton]}
          >
            {currentStep === 3 ? 'Criar Turma' : 'Próximo'}
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#3b82f6',
  },
  stepCircleInactive: {
    backgroundColor: '#e5e7eb',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepNumberInactive: {
    color: '#6b7280',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  stepLabelInactive: {
    color: '#6b7280',
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
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
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
  },
  settingsContainer: {
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#3b82f6',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  divider: {
    marginVertical: 8,
  },
  reviewCard: {
    marginBottom: 16,
  },
  reviewSection: {
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#6b7280',
    width: 120,
  },
  reviewValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  reviewChip: {
    alignSelf: 'flex-start',
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