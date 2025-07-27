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
import { Card, Button, TextInput, Chip, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface InstitutionData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  cnpj: string;
  director: string;
  founded: string;
  students: number;
  teachers: number;
  classes: number;
}

interface Department {
  id: string;
  name: string;
  coordinator: string;
  teachers: number;
  students: number;
  status: 'active' | 'inactive';
}

interface License {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  users: number;
  maxUsers: number;
  expiresAt: string;
  status: 'active' | 'expired' | 'pending';
}

const mockInstitution: InstitutionData = {
  name: 'Colégio Vetta',
  address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  phone: '(11) 9999-9999',
  email: 'contato@colegiovetta.com.br',
  website: 'www.colegiovetta.com.br',
  cnpj: '12.345.678/0001-90',
  director: 'Dr. Carlos Silva',
  founded: '2010',
  students: 1247,
  teachers: 89,
  classes: 45,
};

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Matemática',
    coordinator: 'Prof. Maria Silva',
    teachers: 12,
    students: 320,
    status: 'active',
  },
  {
    id: '2',
    name: 'Ciências Humanas',
    coordinator: 'Prof. João Santos',
    teachers: 15,
    students: 280,
    status: 'active',
  },
  {
    id: '3',
    name: 'Linguagens',
    coordinator: 'Prof. Ana Costa',
    teachers: 18,
    students: 350,
    status: 'active',
  },
  {
    id: '4',
    name: 'Ciências da Natureza',
    coordinator: 'Prof. Pedro Lima',
    teachers: 10,
    students: 220,
    status: 'active',
  },
  {
    id: '5',
    name: 'Educação Física',
    coordinator: 'Prof. Roberto Almeida',
    teachers: 8,
    students: 180,
    status: 'inactive',
  },
];

const mockLicenses: License[] = [
  {
    id: '1',
    name: 'Licença Premium',
    type: 'premium',
    users: 1500,
    maxUsers: 2000,
    expiresAt: '2024-12-31',
    status: 'active',
  },
  {
    id: '2',
    name: 'Módulo IA',
    type: 'premium',
    users: 89,
    maxUsers: 100,
    expiresAt: '2024-12-31',
    status: 'active',
  },
  {
    id: '3',
    name: 'Relatórios Avançados',
    type: 'enterprise',
    users: 0,
    maxUsers: 0,
    expiresAt: '2024-06-30',
    status: 'expired',
  },
];

export default function ManagerInstitution() {
  const [isEditing, setIsEditing] = useState(false);
  const [institutionData, setInstitutionData] = useState(mockInstitution);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [backupEnabled, setBackupEnabled] = useState(true);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Sucesso', 'Informações da instituição atualizadas com sucesso!');
  };

  const handleCancel = () => {
    setInstitutionData(mockInstitution);
    setIsEditing(false);
  };

  const getLicenseColor = (type: License['type']) => {
    switch (type) {
      case 'basic': return '#6b7280';
      case 'premium': return '#3b82f6';
      case 'enterprise': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getLicenseText = (type: License['type']) => {
    switch (type) {
      case 'basic': return 'Básico';
      case 'premium': return 'Premium';
      case 'enterprise': return 'Empresarial';
      default: return 'Básico';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'expired': return '#ef4444';
      case 'pending': return '#f59e0b';
      case 'inactive': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'expired': return 'Expirado';
      case 'pending': return 'Pendente';
      case 'inactive': return 'Inativo';
      default: return 'Desconhecido';
    }
  };

  const renderInstitutionInfo = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Informações da Instituição</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <MaterialIcons name="edit" size={20} color="#3b82f6" />
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              label="Nome da Instituição"
              value={institutionData.name}
              onChangeText={(text) => setInstitutionData({ ...institutionData, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Endereço"
              value={institutionData.address}
              onChangeText={(text) => setInstitutionData({ ...institutionData, address: text })}
              style={styles.input}
              multiline
            />
            <TextInput
              label="Telefone"
              value={institutionData.phone}
              onChangeText={(text) => setInstitutionData({ ...institutionData, phone: text })}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={institutionData.email}
              onChangeText={(text) => setInstitutionData({ ...institutionData, email: text })}
              style={styles.input}
            />
            <TextInput
              label="Website"
              value={institutionData.website}
              onChangeText={(text) => setInstitutionData({ ...institutionData, website: text })}
              style={styles.input}
            />
            <TextInput
              label="CNPJ"
              value={institutionData.cnpj}
              onChangeText={(text) => setInstitutionData({ ...institutionData, cnpj: text })}
              style={styles.input}
            />
            <TextInput
              label="Diretor"
              value={institutionData.director}
              onChangeText={(text) => setInstitutionData({ ...institutionData, director: text })}
              style={styles.input}
            />
            <TextInput
              label="Ano de Fundação"
              value={institutionData.founded}
              onChangeText={(text) => setInstitutionData({ ...institutionData, founded: text })}
              style={styles.input}
            />

            <View style={styles.editActions}>
              <Button mode="outlined" onPress={handleCancel} style={styles.cancelButton}>
                Cancelar
              </Button>
              <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                Salvar
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <MaterialIcons name="business" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>{institutionData.name}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="location-on" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Endereço</Text>
                <Text style={styles.infoValue}>{institutionData.address}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="phone" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{institutionData.phone}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="email" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{institutionData.email}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="language" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Website</Text>
                <Text style={styles.infoValue}>{institutionData.website}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="description" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>CNPJ</Text>
                <Text style={styles.infoValue}>{institutionData.cnpj}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="person" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Diretor</Text>
                <Text style={styles.infoValue}>{institutionData.director}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="event" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Fundação</Text>
                <Text style={styles.infoValue}>{institutionData.founded}</Text>
              </View>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="people" size={24} color="#3b82f6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{institutionData.students}</Text>
              <Text style={styles.statLabel}>Estudantes</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="school" size={24} color="#10b981" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{institutionData.teachers}</Text>
              <Text style={styles.statLabel}>Professores</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="class" size={24} color="#f59e0b" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{institutionData.classes}</Text>
              <Text style={styles.statLabel}>Turmas</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderDepartments = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Departamentos</Text>
          <TouchableOpacity>
            <MaterialIcons name="add" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <View style={styles.departmentsList}>
          {mockDepartments.map((dept) => (
            <View key={dept.id} style={styles.departmentItem}>
              <View style={styles.departmentInfo}>
                <Text style={styles.departmentName}>{dept.name}</Text>
                <Text style={styles.departmentCoordinator}>{dept.coordinator}</Text>
                <View style={styles.departmentStats}>
                  <Text style={styles.departmentStat}>{dept.teachers} professores</Text>
                  <Text style={styles.departmentStat}>•</Text>
                  <Text style={styles.departmentStat}>{dept.students} estudantes</Text>
                </View>
              </View>
              <Chip
                style={[styles.statusChip, { backgroundColor: getStatusColor(dept.status) + '20' }]}
                textStyle={{ color: getStatusColor(dept.status) }}
              >
                {getStatusText(dept.status)}
              </Chip>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderLicenses = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Licenças e Módulos</Text>
          <TouchableOpacity>
            <MaterialIcons name="add" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <View style={styles.licensesList}>
          {mockLicenses.map((license) => (
            <View key={license.id} style={styles.licenseItem}>
              <View style={styles.licenseInfo}>
                <Text style={styles.licenseName}>{license.name}</Text>
                <Chip
                  style={[styles.licenseType, { backgroundColor: getLicenseColor(license.type) + '20' }]}
                  textStyle={{ color: getLicenseColor(license.type) }}
                >
                  {getLicenseText(license.type)}
                </Chip>
              </View>
              <View style={styles.licenseDetails}>
                <Text style={styles.licenseUsers}>
                  {license.users}/{license.maxUsers} usuários
                </Text>
                <Text style={styles.licenseExpiry}>
                  Expira em: {license.expiresAt}
                </Text>
              </View>
              <Chip
                style={[styles.statusChip, { backgroundColor: getStatusColor(license.status) + '20' }]}
                textStyle={{ color: getStatusColor(license.status) }}
              >
                {getStatusText(license.status)}
              </Chip>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderSettings = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.cardTitle}>Configurações do Sistema</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="psychology" size={20} color="#8b5cf6" />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Inteligência Artificial</Text>
              <Text style={styles.settingDescription}>
                Habilitar correção automática com IA
              </Text>
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
            <MaterialIcons name="notifications" size={20} color="#3b82f6" />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notificações</Text>
              <Text style={styles.settingDescription}>
                Alertas e notificações do sistema
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
            thumbColor={notificationsEnabled ? '#ffffff' : '#f3f4f6'}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="backup" size={20} color="#10b981" />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Backup Automático</Text>
              <Text style={styles.settingDescription}>
                Backup diário dos dados
              </Text>
            </View>
          </View>
          <Switch
            value={backupEnabled}
            onValueChange={setBackupEnabled}
            trackColor={{ false: '#e5e7eb', true: '#10b981' }}
            thumbColor={backupEnabled ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Instituição</Text>
        <Text style={styles.subtitle}>Configurações e informações institucionais</Text>
      </View>

      {renderStats()}
      {renderInstitutionInfo()}
      {renderDepartments()}
      {renderLicenses()}
      {renderSettings()}
    </ScrollView>
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
  card: {
    margin: 20,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  editForm: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  departmentsList: {
    gap: 16,
  },
  departmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  departmentCoordinator: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  departmentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  departmentStat: {
    fontSize: 12,
    color: '#6b7280',
  },
  licensesList: {
    gap: 16,
  },
  licenseItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  licenseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  licenseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  licenseType: {
    marginBottom: 0,
  },
  licenseDetails: {
    marginBottom: 8,
  },
  licenseUsers: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  licenseExpiry: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusChip: {
    marginBottom: 0,
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
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  divider: {
    backgroundColor: '#f3f4f6',
    height: 1,
  },
}); 