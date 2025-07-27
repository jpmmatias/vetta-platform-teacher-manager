"use client"		
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Drawer, List, Avatar, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from './AppContext';

interface SidebarProps {
  userType: 'teacher' | 'manager';
  onUserTypeChange?: (type: 'teacher' | 'manager') => void;
  onClose?: () => void;
  visible?: boolean;
}

export default function Sidebar({ userType, onUserTypeChange, onClose, visible }: SidebarProps) {
  const { setIsAuthenticated, setUser, setUserType } = useApp();
  const teacherMenuItems = [
    { icon: 'home' as const, label: 'Dashboard', count: 0 , active: true , route: '/'},
    { icon: 'people' as const, label: 'Minhas Turmas', count: 4 , active: false , route: '/teacher/classes'},
    { icon: 'description' as const, label: 'Atividades', count: 28 , active: false , route: '/teacher/activities'},
    { icon: 'assignment' as const, label: 'Correções', count: 15 , active: false , route: '/teacher/corrections'},
    { icon: 'psychology' as const, label: 'Correção IA', count: 12 , active: false , route: '/teacher/ai-correction'},
    { icon: 'bar-chart' as const, label: 'Relatórios' , count: 0 , active: false , route: '/teacher/reports'},
    { icon: 'event' as const, label: 'Cronograma', count: 0 , active: false , route: '/teacher/schedule'},
    { icon: 'message' as const, label: 'Feedback', count: 0 , active: false , route: '/teacher/feedback'},
  ];

  const managerMenuItems = [
    { icon: 'home' as const, label: 'Dashboard', active: true, route: '/manager/dashboard'  },
    { icon: 'bar-chart' as const, label: 'Analytics', count: 3, route: '/manager/analytics'},
    { icon: 'people' as const, label: 'Usuários', count: 156, route: '/manager/users'},
    { icon: 'school' as const, label: 'Instituição', route: '/manager/institution'},
    { icon: 'psychology' as const, label: 'IA Insights', count: 0 , active: false , route: '/manager/ai-insights'},
    { icon: 'description' as const, label: 'Relatórios', count: 0 , active: false , route: '/manager/reports'},
    { icon: 'settings' as const, label: 'Configurações', count: 0 , active: false , route: '/manager/settings'},
  ];

  const menuItems = userType === 'teacher' ? teacherMenuItems : managerMenuItems;

  if (!visible) return null;

  return (
    <View style={styles.drawer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <MaterialIcons name="psychology" size={20} color="white" />
          </View>
          <Text style={styles.logoText}>Vetta</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity 
        onPress={() => {
          const newType = userType === 'teacher' ? 'manager' : 'teacher';
          setUserType(newType);
          onUserTypeChange?.(newType);
          // Navigate to the appropriate dashboard
          router.push(newType === 'teacher' ? '/' : '/manager/dashboard');
        }}
        style={styles.userTypeSelector}
      >
        <View style={styles.userTypeContent}>
          <MaterialIcons 
            name={userType === 'teacher' ? 'school' : 'bar-chart'} 
            size={16} 
            color="#374151" 
          />
          <Text style={styles.userTypeText}>
            {userType === 'teacher' ? 'Professor' : 'Gestor'}
          </Text>
        </View>
        <MaterialIcons name="keyboard-arrow-down" size={16} color="#6b7280" />
      </TouchableOpacity>

      <Divider style={styles.divider} />

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              item.active && styles.activeMenuItem
            ]}
            onPress={() => router.push(item.route )}
          >
            <View style={styles.menuItemContent}>
              <MaterialIcons 
                name={item.icon} 
                size={16} 
                color={item.active ? '#3b82f6' : '#6b7280'} 
                style={styles.menuIcon}
              />
              <Text style={[
                styles.menuItemText,
                item.active && styles.activeMenuItemText
              ]}>
                {item.label}
              </Text>
            </View>
            {item.count && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <Divider style={styles.sectionDivider} />
        
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <MaterialIcons name="add" size={16} color="#6b7280" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>
              {userType === 'teacher' ? 'Nova Atividade' : 'Novo Relatório'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Avatar.Text 
          size={32} 
          label={userType === 'teacher' ? 'P' : 'G'}
          style={styles.avatar}
          labelStyle={styles.avatarLabel}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {userType === 'teacher' ? 'Prof. Maria Silva' : 'João Santos'}
          </Text>
          <Text style={styles.userRole}>
            {userType === 'teacher' ? 'Matemática' : 'Diretor Acadêmico'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setIsAuthenticated(false);
            setUser(null);
            setUserType('teacher');
            onClose?.();
          }}
          style={styles.logoutButton}
        >
          <MaterialIcons name="logout" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
    borderRadius: 4,
  },
  userTypeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  userTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTypeText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },
  divider: {
    backgroundColor: '#e5e7eb',
    height: 1,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
  },
  activeMenuItem: {
    backgroundColor: '#f3f4f6',
  },
  activeMenuItemText: {
    color: '#111827',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  sectionDivider: {
    backgroundColor: '#e5e7eb',
    height: 1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  avatar: {
    backgroundColor: '#dbeafe',
  },
  avatarLabel: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  userRole: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
}); 