"use client"	
import React from 'react';

import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Appbar, Searchbar, IconButton, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface HeaderProps {
  userType: 'teacher' | 'manager';
  onMenuClick?: () => void;
}

export default function Header({ userType, onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {onMenuClick && (
          <IconButton
            icon="menu"
            size={24}
            onPress={onMenuClick}
            style={styles.menuButton}
            iconColor="#374151"
          />
        )}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder={
              userType === 'teacher' 
                ? 'Buscar turmas, atividades...' 
                : 'Buscar relatórios, usuários...'
            }
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            iconColor="#9ca3af"
            inputStyle={styles.searchInput}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>
      <View style={styles.right}>
        <IconButton
          icon={() => <MaterialIcons name="help-outline" size={22} color="#9ca3af" />}
          size={22}
          onPress={() => {}}
          style={styles.actionButton}
        />
        <IconButton
          icon={() => <MaterialIcons name="settings" size={22} color="#9ca3af" />}
          size={22}
          onPress={() => {}}
          style={styles.actionButton}
        />
        <View style={styles.notificationWrapper}>
          <IconButton
            icon={() => <MaterialIcons name="notifications-none" size={22} color="#9ca3af" />}
            size={22}
            onPress={() => {}}
            style={styles.actionButton}
          />
          <View style={styles.notificationDot} />
        </View>
        <Avatar.Text size={32} label={userType === 'teacher' ? 'P' : 'G'} style={styles.avatar} labelStyle={styles.avatarLabel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: "4%",
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    marginRight: 8,
    marginLeft: -8,
  },
  searchContainer: {
    flex: 1,
  },
  searchbar: {
    backgroundColor: '#f9fafb',
    elevation: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 40,
  },
  searchInput: {
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    color: '#374151',
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 16,
  },
  actionButton: {
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  notificationWrapper: {
    position: 'relative',
    marginHorizontal: 2,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 4,
    zIndex: 2,
  },
  avatar: {
    backgroundColor: '#dbeafe',
    marginLeft: 8,
  },
  avatarLabel: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 16,
  },
}); 