import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

interface ResponsiveGridProps {
  children: React.ReactNode;
  viewMode: 'grid' | 'list';
}

const { width } = Dimensions.get('window');

export default function ResponsiveGrid({ children, viewMode }: ResponsiveGridProps) {
  const getGridColumns = () => {
    if (viewMode === 'list') return 1;
    
    // Desktop (1200px+)
    if (width >= 1200) return 4;
    // Tablet (768px-1200px)
    if (width >= 768) return 3;
    // Mobile (até 768px)
    return 2;
  };

  const getContainerStyle = () => {
    const columns = getGridColumns();
    
    if (viewMode === 'list') {
      return styles.listContainer;
    }
    
    return [
      styles.gridContainer,
      {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: columns >= 3 ? 16 : 12,
      }
    ];
  };

  return (
    <View style={getContainerStyle()}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  listContainer: {
    flexDirection: 'column',
  },
}); 