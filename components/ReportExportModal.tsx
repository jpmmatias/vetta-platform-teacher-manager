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
import { Modal, Portal, Card, Button, Switch, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  includeCharts: boolean;
  includeTables: boolean;
  includeRecommendations: boolean;
  includeMetadata: boolean;
  customPeriod: boolean;
  startDate?: string;
  endDate?: string;
  fileName: string;
}

interface ReportExportModalProps {
  visible: boolean;
  onDismiss: () => void;
  reportTitle: string;
  onExport: (options: ExportOptions) => void;
}

const exportFormats = [
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Documento formatado para impressão',
    icon: 'picture-as-pdf',
    color: '#dc2626',
  },
  {
    id: 'excel',
    name: 'Excel',
    description: 'Planilha com dados tabulares',
    icon: 'table-chart',
    color: '#10b981',
  },
  {
    id: 'csv',
    name: 'CSV',
    description: 'Dados em formato texto simples',
    icon: 'description',
    color: '#3b82f6',
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'Dados estruturados para APIs',
    icon: 'code',
    color: '#8b5cf6',
  },
];

export default function ReportExportModal({
  visible,
  onDismiss,
  reportTitle,
  onExport,
}: ReportExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv' | 'json'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [customPeriod, setCustomPeriod] = useState(false);
  const [fileName, setFileName] = useState(`relatorio_${reportTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`);

  const handleExport = () => {
    const options: ExportOptions = {
      format: selectedFormat,
      includeCharts,
      includeTables,
      includeRecommendations,
      includeMetadata,
      customPeriod,
      fileName,
    };

    onExport(options);
    onDismiss();
  };

  const renderFormatOption = (format: typeof exportFormats[0]) => (
    <TouchableOpacity
      key={format.id}
      style={[
        styles.formatOption,
        selectedFormat === format.id && styles.formatOptionSelected,
      ]}
      onPress={() => setSelectedFormat(format.id as any)}
    >
      <View style={styles.formatHeader}>
        <View style={[styles.formatIcon, { backgroundColor: format.color + '20' }]}>
          <MaterialIcons name={format.icon as any} size={24} color={format.color} />
        </View>
        <View style={styles.formatInfo}>
          <Text style={styles.formatName}>{format.name}</Text>
          <Text style={styles.formatDescription}>{format.description}</Text>
        </View>
        {selectedFormat === format.id && (
          <MaterialIcons name="check-circle" size={24} color={format.color} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderOptionRow = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: string,
    iconColor: string
  ) => (
    <View style={styles.optionRow}>
      <View style={styles.optionInfo}>
        <View style={styles.optionHeader}>
          <MaterialIcons name={icon as any} size={20} color={iconColor} />
          <Text style={styles.optionTitle}>{title}</Text>
        </View>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        color="#3b82f6"
      />
    </View>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Exportar Relatório</Text>
          <TouchableOpacity onPress={onDismiss}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Formato de Exportação</Text>
              <Text style={styles.sectionDescription}>
                Escolha o formato mais adequado para suas necessidades
              </Text>
              
              <View style={styles.formatsContainer}>
                {exportFormats.map(renderFormatOption)}
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Conteúdo do Relatório</Text>
              <Text style={styles.sectionDescription}>
                Selecione quais elementos incluir na exportação
              </Text>
              
              <View style={styles.optionsContainer}>
                {renderOptionRow(
                  'Gráficos e Visualizações',
                  'Incluir gráficos de performance e tendências',
                  includeCharts,
                  setIncludeCharts,
                  'bar-chart',
                  '#3b82f6'
                )}
                
                <Divider style={styles.divider} />
                
                {renderOptionRow(
                  'Tabelas de Dados',
                  'Incluir tabelas com dados detalhados',
                  includeTables,
                  setIncludeTables,
                  'table-rows',
                  '#10b981'
                )}
                
                <Divider style={styles.divider} />
                
                {renderOptionRow(
                  'Recomendações',
                  'Incluir sugestões e insights',
                  includeRecommendations,
                  setIncludeRecommendations,
                  'lightbulb',
                  '#f59e0b'
                )}
                
                <Divider style={styles.divider} />
                
                {renderOptionRow(
                  'Metadados',
                  'Incluir informações sobre geração e período',
                  includeMetadata,
                  setIncludeMetadata,
                  'info',
                  '#8b5cf6'
                )}
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Nome do Arquivo</Text>
              <Text style={styles.sectionDescription}>
                Defina um nome personalizado para o arquivo exportado
              </Text>
              
              <View style={styles.fileNameContainer}>
                <Text style={styles.fileNamePreview}>
                  {fileName}.{selectedFormat}
                </Text>
                <TouchableOpacity 
                  style={styles.editFileNameButton}
                  onPress={() => {
                    // Aqui você pode abrir um modal para editar o nome
                    Alert.alert('Editar Nome', 'Funcionalidade de edição será implementada');
                  }}
                >
                  <MaterialIcons name="edit" size={16} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.exportInfo}>
            <MaterialIcons name="info" size={16} color="#6b7280" />
            <Text style={styles.exportInfoText}>
              O arquivo será salvo na pasta de downloads do seu dispositivo
            </Text>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleExport}
            style={styles.exportButton}
            icon="download"
          >
            Exportar
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
    borderRadius: 16,
    maxHeight: '90%',
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
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    borderColor: '#d1d5db',
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
  },
  sectionCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  formatsContainer: {
    gap: 12,
  },
  formatOption: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  formatOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f620',
  },
  formatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formatIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  formatInfo: {
    flex: 1,
  },
  formatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  formatDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionsContainer: {
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionInfo: {
    flex: 1,
    marginRight: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  optionDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 28,
  },
  divider: {
    marginVertical: 8,
  },
  fileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  fileNamePreview: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'monospace',
  },
  editFileNameButton: {
    padding: 4,
  },
  exportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  exportInfoText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
}); 