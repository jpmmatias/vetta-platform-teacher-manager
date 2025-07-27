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
import { Card, Chip, Button, Searchbar, FAB, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  avatar?: string;
  department?: string;
  class?: string;
  activities?: number;
  performance?: number;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Prof. Maria Silva',
    email: 'maria.silva@escola.com',
    role: 'teacher',
    status: 'active',
    lastLogin: '2024-12-16 08:30',
    department: 'Matemática',
    activities: 28,
    performance: 9.2,
  },
  {
    id: '2',
    name: 'Prof. João Santos',
    email: 'joao.santos@escola.com',
    role: 'teacher',
    status: 'active',
    lastLogin: '2024-12-16 07:45',
    department: 'História',
    activities: 22,
    performance: 8.7,
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@escola.com',
    role: 'student',
    status: 'active',
    lastLogin: '2024-12-16 09:15',
    class: '9º Ano A',
    activities: 15,
    performance: 8.9,
  },
  {
    id: '4',
    name: 'Pedro Lima',
    email: 'pedro.lima@escola.com',
    role: 'student',
    status: 'active',
    lastLogin: '2024-12-16 08:20',
    class: '8º Ano B',
    activities: 12,
    performance: 7.8,
  },
  {
    id: '5',
    name: 'Fernanda Oliveira',
    email: 'fernanda.oliveira@escola.com',
    role: 'teacher',
    status: 'pending',
    lastLogin: '2024-12-15 16:30',
    department: 'Ciências',
    activities: 0,
    performance: 0,
  },
  {
    id: '6',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@escola.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-12-16 06:00',
    activities: 0,
    performance: 0,
  },
];

export default function ManagerUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'teacher' | 'student' | 'admin'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'teacher': return 'school';
      case 'student': return 'person';
      case 'admin': return 'admin-panel-settings';
      default: return 'person';
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'teacher': return '#3b82f6';
      case 'student': return '#10b981';
      case 'admin': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getRoleText = (role: User['role']) => {
    switch (role) {
      case 'teacher': return 'Professor';
      case 'student': return 'Estudante';
      case 'admin': return 'Administrador';
      default: return 'Usuário';
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  const handleAddUser = () => {
    Alert.alert('Adicionar Usuário', 'Funcionalidade de adicionar usuário será implementada');
  };

  const handleEditUser = (user: User) => {
    Alert.alert('Editar Usuário', `Editar informações de ${user.name}`);
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Excluir Usuário',
      `Tem certeza que deseja excluir ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => Alert.alert('Excluído', 'Usuário excluído com sucesso') },
      ]
    );
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="people" size={24} color="#3b82f6" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{mockUsers.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="school" size={24} color="#10b981" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {mockUsers.filter(u => u.role === 'teacher').length}
              </Text>
              <Text style={styles.statLabel}>Professores</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="person" size={24} color="#f59e0b" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {mockUsers.filter(u => u.role === 'student').length}
              </Text>
              <Text style={styles.statLabel}>Estudantes</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialIcons name="check-circle" size={24} color="#10b981" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {mockUsers.filter(u => u.status === 'active').length}
              </Text>
              <Text style={styles.statLabel}>Ativos</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filters}>
      <Text style={styles.filtersTitle}>Filtros:</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterChip, selectedRole === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedRole('all')}
        >
          <Text style={[styles.filterText, selectedRole === 'all' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedRole === 'teacher' && styles.filterChipActive]}
          onPress={() => setSelectedRole('teacher')}
        >
          <Text style={[styles.filterText, selectedRole === 'teacher' && styles.filterTextActive]}>
            Professores
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedRole === 'student' && styles.filterChipActive]}
          onPress={() => setSelectedRole('student')}
        >
          <Text style={[styles.filterText, selectedRole === 'student' && styles.filterTextActive]}>
            Estudantes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedRole === 'admin' && styles.filterChipActive]}
          onPress={() => setSelectedRole('admin')}
        >
          <Text style={[styles.filterText, selectedRole === 'admin' && styles.filterTextActive]}>
            Administradores
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderUserCard = (user: User) => (
    <Card key={user.id} style={styles.userCard}>
      <Card.Content>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={48} 
              label={user.name.split(' ').map(n => n[0]).join('')}
              style={{ backgroundColor: getRoleColor(user.role) + '20' }}
              labelStyle={{ color: getRoleColor(user.role) }}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.userMeta}>
                <Chip 
                  style={[styles.roleChip, { backgroundColor: getRoleColor(user.role) + '20' }]}
                  textStyle={{ color: getRoleColor(user.role) }}
                >
                  {getRoleText(user.role)}
                </Chip>
                <Chip 
                  style={[styles.statusChip, { backgroundColor: getStatusColor(user.status) + '20' }]}
                  textStyle={{ color: getStatusColor(user.status) }}
                >
                  {getStatusText(user.status)}
                </Chip>
              </View>
            </View>
          </View>
          <View style={styles.userActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditUser(user)}
            >
              <MaterialIcons name="edit" size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteUser(user)}
            >
              <MaterialIcons name="delete" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.userStats}>
          {user.role === 'teacher' && (
            <View style={styles.statItem}>
              <MaterialIcons name="assignment" size={16} color="#6b7280" />
              <Text style={styles.statText}>{user.activities} atividades</Text>
            </View>
          )}
          {user.role === 'student' && (
            <View style={styles.statItem}>
              <MaterialIcons name="grade" size={16} color="#6b7280" />
              <Text style={styles.statText}>Média: {user.performance}</Text>
            </View>
          )}
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={16} color="#6b7280" />
            <Text style={styles.statText}>Último login: {user.lastLogin}</Text>
          </View>
        </View>

        {user.department && (
          <View style={styles.userDepartment}>
            <MaterialIcons name="business" size={16} color="#6b7280" />
            <Text style={styles.departmentText}>{user.department}</Text>
          </View>
        )}

        {user.class && (
          <View style={styles.userDepartment}>
            <MaterialIcons name="class" size={16} color="#6b7280" />
            <Text style={styles.departmentText}>{user.class}</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuários</Text>
        <Text style={styles.subtitle}>Gestão de usuários da instituição</Text>
      </View>

      {renderStats()}

      <Searchbar
        placeholder="Buscar usuários..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {renderFilters()}

      <View style={styles.usersSection}>
        <View style={styles.usersHeader}>
          <Text style={styles.sectionTitle}>Usuários ({filteredUsers.length})</Text>
        </View>

        <ScrollView style={styles.usersList}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(renderUserCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="people" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Nenhum usuário encontrado</Text>
              <Text style={styles.emptyText}>
                Não há usuários que correspondam aos filtros selecionados.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddUser}
        label="Adicionar Usuário"
      />
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
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  filters: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  usersSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  usersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  usersList: {
    flex: 1,
  },
  userCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    marginBottom: 0,
  },
  statusChip: {
    marginBottom: 0,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  userDepartment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  departmentText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
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