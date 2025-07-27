import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Card, Button, TextInput, Chip, Divider, List } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface SettingSection {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  value: string;
  type: 'text' | 'password' | 'email';
}

const settingSections: SettingSection[] = [
  {
    id: 'general',
    title: 'Geral',
    icon: 'settings',
    color: '#3b82f6',
    description: 'Configurações básicas da instituição',
  },
  {
    id: 'notifications',
    title: 'Notificações',
    icon: 'notifications',
    color: '#10b981',
    description: 'Preferências de alertas e notificações',
  },
  {
    id: 'security',
    title: 'Segurança',
    icon: 'security',
    color: '#ef4444',
    description: 'Configurações de segurança e privacidade',
  },
  {
    id: 'ai',
    title: 'Inteligência Artificial',
    icon: 'psychology',
    color: '#8b5cf6',
    description: 'Configurações da IA e automação',
  },
  {
    id: 'integrations',
    title: 'Integrações',
    icon: 'integration-instructions',
    color: '#f59e0b',
    description: 'APIs e serviços externos',
  },
  {
    id: 'backup',
    title: 'Backup & Restauração',
    icon: 'backup',
    color: '#06b6d4',
    description: 'Configurações de backup e recuperação',
  },
];

const mockNotificationSettings: NotificationSetting[] = [
  {
    id: 'email',
    title: 'Notificações por Email',
    description: 'Receber alertas importantes por email',
    enabled: true,
  },
  {
    id: 'push',
    title: 'Notificações Push',
    description: 'Alertas em tempo real no dispositivo',
    enabled: true,
  },
  {
    id: 'reports',
    title: 'Relatórios Automáticos',
    description: 'Envio automático de relatórios semanais',
    enabled: false,
  },
  {
    id: 'alerts',
    title: 'Alertas de Performance',
    description: 'Notificações sobre baixo desempenho',
    enabled: true,
  },
  {
    id: 'maintenance',
    title: 'Manutenção do Sistema',
    description: 'Alertas sobre manutenções programadas',
    enabled: false,
  },
];

const mockSecuritySettings: SecuritySetting[] = [
  {
    id: 'admin-email',
    title: 'Email do Administrador',
    description: 'Email principal para notificações de segurança',
    value: 'admin@colegiovetta.com.br',
    type: 'email',
  },
  {
    id: 'session-timeout',
    title: 'Timeout de Sessão',
    description: 'Tempo limite de inatividade (minutos)',
    value: '30',
    type: 'text',
  },
  {
    id: 'password-policy',
    title: 'Política de Senhas',
    description: 'Requisitos mínimos de segurança',
    value: 'Forte',
    type: 'text',
  },
  {
    id: 'two-factor',
    title: 'Autenticação em Dois Fatores',
    description: 'Habilitar 2FA para administradores',
    value: 'Habilitado',
    type: 'text',
  },
];

export default function ManagerSettings() {
  const [selectedSection, setSelectedSection] = useState('general');
  const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings);
  const [securitySettings, setSecuritySettings] = useState(mockSecuritySettings);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataRetention, setDataRetention] = useState('2 anos');

  const handleSaveSettings = () => {
    Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Resetar Configurações',
      'Tem certeza que deseja resetar todas as configurações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resetar', style: 'destructive', onPress: () => Alert.alert('Resetado', 'Configurações resetadas') },
      ]
    );
  };

  const handleExportSettings = () => {
    Alert.alert('Exportar', 'Configurações exportadas com sucesso!');
  };

  const handleImportSettings = () => {
    Alert.alert('Importar', 'Funcionalidade de importação será implementada');
  };

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const renderGeneralSettings = () => (
    <View style={styles.sectionContent}>
      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>Configurações Gerais</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="language" size={20} color="#3b82f6" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Idioma</Text>
                <Text style={styles.settingDescription}>Português (Brasil)</Text>
              </View>
            </View>
            <TouchableOpacity>
              <MaterialIcons name="chevron-right" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="schedule" size={20} color="#10b981" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Fuso Horário</Text>
                <Text style={styles.settingDescription}>America/Sao_Paulo (UTC-3)</Text>
              </View>
            </View>
            <TouchableOpacity>
              <MaterialIcons name="chevron-right" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="format-list-numbered" size={20} color="#f59e0b" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Formato de Notas</Text>
                <Text style={styles.settingDescription}>0-10 (decimal)</Text>
              </View>
            </View>
            <TouchableOpacity>
              <MaterialIcons name="chevron-right" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>Configurações de Sistema</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="psychology" size={20} color="#8b5cf6" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Inteligência Artificial</Text>
                <Text style={styles.settingDescription}>Habilitar correção automática</Text>
              </View>
            </View>
            <Switch
              value={aiEnabled}
              onValueChange={setAiEnabled}
              trackColor={{ false: '#e5e7eb', true: '#8b5cf6' }}
              thumbColor={aiEnabled ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="backup" size={20} color="#06b6d4" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Backup Automático</Text>
                <Text style={styles.settingDescription}>Backup diário dos dados</Text>
              </View>
            </View>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: '#e5e7eb', true: '#06b6d4' }}
              thumbColor={autoBackup ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="storage" size={20} color="#ef4444" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Retenção de Dados</Text>
                <Text style={styles.settingDescription}>Período de armazenamento</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.settingValue}>{dataRetention}</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderNotificationSettings = () => (
    <View style={styles.sectionContent}>
      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>Preferências de Notificação</Text>
          
          {notificationSettings.map((setting) => (
            <View key={setting.id}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <MaterialIcons name="notifications" size={20} color="#10b981" />
                  <View style={styles.settingContent}>
                    <Text style={styles.settingLabel}>{setting.title}</Text>
                    <Text style={styles.settingDescription}>{setting.description}</Text>
                  </View>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleNotification(setting.id)}
                  trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                  thumbColor={setting.enabled ? '#ffffff' : '#f3f4f6'}
                />
              </View>
              {setting.id !== notificationSettings[notificationSettings.length - 1].id && (
                <Divider style={styles.divider} />
              )}
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  const renderSecuritySettings = () => (
    <View style={styles.sectionContent}>
      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>Configurações de Segurança</Text>
          
          {securitySettings.map((setting) => (
            <View key={setting.id}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <MaterialIcons name="security" size={20} color="#ef4444" />
                  <View style={styles.settingContent}>
                    <Text style={styles.settingLabel}>{setting.title}</Text>
                    <Text style={styles.settingDescription}>{setting.description}</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text style={styles.settingValue}>{setting.value}</Text>
                </TouchableOpacity>
              </View>
              {setting.id !== securitySettings[securitySettings.length - 1].id && (
                <Divider style={styles.divider} />
              )}
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>Ações de Segurança</Text>
          
          <Button mode="outlined" style={styles.actionButton}>
            Alterar Senha de Administrador
          </Button>
          
          <Button mode="outlined" style={styles.actionButton}>
            Configurar 2FA
          </Button>
          
          <Button mode="outlined" style={styles.actionButton}>
            Histórico de Acessos
          </Button>
          
          <Button mode="outlined" style={styles.actionButton}>
            Revogar Sessões
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  const renderAISettings = () => (
    <View style={styles.sectionContent}>
      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>Configurações da IA</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="psychology" size={20} color="#8b5cf6" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Correção Automática</Text>
                <Text style={styles.settingDescription}>Habilitar correção com IA</Text>
              </View>
            </View>
            <Switch
              value={aiEnabled}
              onValueChange={setAiEnabled}
              trackColor={{ false: '#e5e7eb', true: '#8b5cf6' }}
              thumbColor={aiEnabled ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="speed" size={20} color="#10b981" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Modo de Processamento</Text>
                <Text style={styles.settingDescription}>Velocidade vs Precisão</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.settingValue}>Equilibrado</Text>
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="analytics" size={20} color="#f59e0b" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Insights Automáticos</Text>
                <Text style={styles.settingDescription}>Gerar insights periodicamente</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#e5e7eb', true: '#f59e0b' }}
              thumbColor="#ffffff"
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderIntegrationsSettings = () => (
    <View style={styles.sectionContent}>
      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>Integrações Ativas</Text>
          
          <View style={styles.integrationItem}>
            <MaterialIcons name="school" size={24} color="#3b82f6" />
            <View style={styles.integrationInfo}>
              <Text style={styles.integrationName}>Sistema Acadêmico</Text>
              <Text style={styles.integrationStatus}>Conectado</Text>
            </View>
            <Chip style={styles.statusChip} textStyle={{ color: '#10b981' }}>
              Ativo
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.integrationItem}>
            <MaterialIcons name="account-balance" size={24} color="#10b981" />
            <View style={styles.integrationInfo}>
              <Text style={styles.integrationName}>Sistema Financeiro</Text>
              <Text style={styles.integrationStatus}>Conectado</Text>
            </View>
            <Chip style={styles.statusChip} textStyle={{ color: '#10b981' }}>
              Ativo
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.integrationItem}>
            <MaterialIcons name="email" size={24} color="#f59e0b" />
            <View style={styles.integrationInfo}>
              <Text style={styles.integrationName}>Sistema de Email</Text>
              <Text style={styles.integrationStatus}>Conectado</Text>
            </View>
            <Chip style={styles.statusChip} textStyle={{ color: '#10b981' }}>
              Ativo
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderBackupSettings = () => (
    <View style={styles.sectionContent}>
      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>Configurações de Backup</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="backup" size={20} color="#06b6d4" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Backup Automático</Text>
                <Text style={styles.settingDescription}>Executar backup diariamente</Text>
              </View>
            </View>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: '#e5e7eb', true: '#06b6d4' }}
              thumbColor={autoBackup ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="schedule" size={20} color="#f59e0b" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Horário do Backup</Text>
                <Text style={styles.settingDescription}>Horário preferencial</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.settingValue}>02:00</Text>
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="storage" size={20} color="#ef4444" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Retenção de Backup</Text>
                <Text style={styles.settingDescription}>Período de armazenamento</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.settingValue}>{dataRetention}</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>Ações de Backup</Text>
          
          <Button mode="outlined" style={styles.actionButton}>
            Executar Backup Manual
          </Button>
          
          <Button mode="outlined" style={styles.actionButton}>
            Restaurar de Backup
          </Button>
          
          <Button mode="outlined" style={styles.actionButton}>
            Exportar Configurações
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'ai':
        return renderAISettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Gerenciar configurações do sistema</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.sidebar}>
          {settingSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[
                styles.sectionItem,
                selectedSection === section.id && styles.sectionItemActive,
              ]}
              onPress={() => setSelectedSection(section.id)}
            >
              <View style={styles.sectionIcon}>
                <MaterialIcons
                  name={section.icon as any}
                  size={20}
                  color={selectedSection === section.id ? 'white' : section.color}
                />
              </View>
              <View style={styles.sectionInfo}>
                <Text
                  style={[
                    styles.sectionTitle,
                    selectedSection === section.id && styles.sectionTitleActive,
                  ]}
                >
                  {section.title}
                </Text>
                <Text
                  style={[
                    styles.sectionDescription,
                    selectedSection === section.id && styles.sectionDescriptionActive,
                  ]}
                >
                  {section.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          {renderSectionContent()}

          <View style={styles.actionsContainer}>
            <Button mode="contained" onPress={handleSaveSettings} style={styles.saveButton}>
              Salvar Configurações
            </Button>
            
            <View style={styles.actionButtons}>
              <Button mode="outlined" onPress={handleExportSettings} style={styles.actionButton}>
                Exportar
              </Button>
              <Button mode="outlined" onPress={handleImportSettings} style={styles.actionButton}>
                Importar
              </Button>
              <Button mode="outlined" onPress={handleResetSettings} style={styles.resetButton}>
                Resetar
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingVertical: 16,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  sectionItemActive: {
    backgroundColor: '#3b82f6',
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  sectionTitleActive: {
    color: 'white',
  },
  sectionDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionDescriptionActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  sectionContent: {
    gap: 20,
  },
  settingCard: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingValue: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  divider: {
    backgroundColor: '#f3f4f6',
    height: 1,
  },
  actionButton: {
    marginBottom: 12,
  },
  integrationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  integrationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  integrationStatus: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusChip: {
    backgroundColor: '#10b98120',
  },
  actionsContainer: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  resetButton: {
    borderColor: '#ef4444',
  },
}); 