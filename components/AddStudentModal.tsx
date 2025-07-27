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
import { Modal, Portal, Card, Button, Divider, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface AddStudentModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (students: StudentData[]) => void;
  classId: string;
}

interface StudentData {
  name: string;
  email: string;
}

export default function AddStudentModal({ visible, onDismiss, onSubmit, classId }: AddStudentModalProps) {
  const [students, setStudents] = useState<StudentData[]>([{ name: '', email: '' }]);
  const [importMode, setImportMode] = useState<'single' | 'bulk'>('single');
  const [bulkText, setBulkText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (importMode === 'single') {
      students.forEach((student, index) => {
        if (!student.name.trim()) {
          newErrors[`name_${index}`] = 'Nome é obrigatório';
        }
        if (!student.email.trim()) {
          newErrors[`email_${index}`] = 'Email é obrigatório';
        } else if (!isValidEmail(student.email)) {
          newErrors[`email_${index}`] = 'Email inválido';
        }
      });
    } else {
      if (!bulkText.trim()) {
        newErrors.bulk = 'Lista de estudantes é obrigatória';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddStudent = () => {
    setStudents([...students, { name: '', email: '' }]);
  };

  const handleRemoveStudent = (index: number) => {
    if (students.length > 1) {
      const newStudents = students.filter((_, i) => i !== index);
      setStudents(newStudents);
    }
  };

  const handleStudentChange = (index: number, field: keyof StudentData, value: string) => {
    const newStudents = [...students];
    newStudents[index][field] = value;
    setStudents(newStudents);
  };

  const parseBulkText = (text: string): StudentData[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const parsedStudents: StudentData[] = [];

    lines.forEach(line => {
      const parts = line.split(',').map(part => part.trim());
      if (parts.length >= 2) {
        parsedStudents.push({
          name: parts[0],
          email: parts[1]
        });
      }
    });

    return parsedStudents;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      let studentsToSubmit: StudentData[] = [];

      if (importMode === 'single') {
        studentsToSubmit = students.filter(student => student.name.trim() && student.email.trim());
      } else {
        studentsToSubmit = parseBulkText(bulkText);
      }

      if (studentsToSubmit.length === 0) {
        Alert.alert('Erro', 'Nenhum estudante válido encontrado');
        return;
      }

      onSubmit(studentsToSubmit);
      handleClose();
    }
  };

  const handleClose = () => {
    setStudents([{ name: '', email: '' }]);
    setBulkText('');
    setErrors({});
    setImportMode('single');
    onDismiss();
  };

  const renderSingleMode = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Adicionar Estudantes Individualmente</Text>
      
      {students.map((student, index) => (
        <Card key={index} style={styles.studentCard}>
          <Card.Content>
            <View style={styles.studentHeader}>
              <Text style={styles.studentNumber}>Estudante {index + 1}</Text>
              {students.length > 1 && (
                <TouchableOpacity
                  onPress={() => handleRemoveStudent(index)}
                  style={styles.removeButton}
                >
                  <MaterialIcons name="delete" size={20} color="#dc2626" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome Completo *</Text>
              <TextInput
                style={[styles.textInput, errors[`name_${index}`] && styles.inputError]}
                value={student.name}
                onChangeText={(text) => handleStudentChange(index, 'name', text)}
                placeholder="Nome do estudante"
                maxLength={100}
              />
              {errors[`name_${index}`] && (
                <Text style={styles.errorText}>{errors[`name_${index}`]}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={[styles.textInput, errors[`email_${index}`] && styles.inputError]}
                value={student.email}
                onChangeText={(text) => handleStudentChange(index, 'email', text)}
                placeholder="email@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                maxLength={100}
              />
              {errors[`email_${index}`] && (
                <Text style={styles.errorText}>{errors[`email_${index}`]}</Text>
              )}
            </View>
          </Card.Content>
        </Card>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddStudent}>
        <MaterialIcons name="person-add" size={20} color="#3b82f6" />
        <Text style={styles.addButtonText}>Adicionar Outro Estudante</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderBulkMode = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Importar Lista de Estudantes</Text>
      
      <Card style={styles.bulkCard}>
        <Card.Content>
          <Text style={styles.bulkInstructions}>
            Digite a lista de estudantes no formato: Nome, Email
          </Text>
          <Text style={styles.bulkExample}>
            Exemplo:{'\n'}
            João Silva, joao.silva@email.com{'\n'}
            Maria Santos, maria.santos@email.com{'\n'}
            Pedro Oliveira, pedro.oliveira@email.com
          </Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={[
                styles.textArea,
                errors.bulk && styles.inputError
              ]}
              value={bulkText}
              onChangeText={setBulkText}
              placeholder="Digite a lista de estudantes..."
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
            {errors.bulk && <Text style={styles.errorText}>{errors.bulk}</Text>}
          </View>

          <View style={styles.bulkStats}>
            <Text style={styles.bulkStatsText}>
              {bulkText ? `${parseBulkText(bulkText).length} estudantes detectados` : '0 estudantes'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Adicionar Estudantes</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Import Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              importMode === 'single' && styles.modeButtonActive
            ]}
            onPress={() => setImportMode('single')}
          >
            <MaterialIcons 
              name="person" 
              size={20} 
              color={importMode === 'single' ? '#3b82f6' : '#6b7280'} 
            />
            <Text style={[
              styles.modeButtonText,
              importMode === 'single' && styles.modeButtonTextActive
            ]}>
              Individual
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              importMode === 'bulk' && styles.modeButtonActive
            ]}
            onPress={() => setImportMode('bulk')}
          >
            <MaterialIcons 
              name="group" 
              size={20} 
              color={importMode === 'bulk' ? '#3b82f6' : '#6b7280'} 
            />
            <Text style={[
              styles.modeButtonText,
              importMode === 'bulk' && styles.modeButtonTextActive
            ]}>
              Em Lote
            </Text>
          </TouchableOpacity>
        </View>

        {importMode === 'single' ? renderSingleMode() : renderBulkMode()}

        <View style={styles.modalFooter}>
          <Button
            mode="outlined"
            onPress={handleClose}
            style={styles.footerButton}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.footerButton, styles.primaryButton]}
          >
            Adicionar Estudantes
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
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    margin: 20,
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: 'white',
  },
  modeButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#3b82f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  studentCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  removeButton: {
    padding: 4,
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
    height: 200,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  bulkCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  bulkInstructions: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  bulkExample: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  bulkStats: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  bulkStatsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
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