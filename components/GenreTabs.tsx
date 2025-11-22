import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { GENRES } from '@/constants/genres';

interface GenreTabsProps {
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
}

export default function GenreTabs({ selectedGenre, onSelectGenre }: GenreTabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {GENRES.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.tab,
              selectedGenre === genre.id && styles.tabActive,
            ]}
            onPress={() => onSelectGenre(genre.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedGenre === genre.id && styles.tabTextActive,
              ]}
            >
              {genre.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141414',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1e1e1e',
    marginRight: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  tabActive: {
    backgroundColor: '#e50914',
  },
  tabText: {
    color: '#999999',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  tabTextActive: {
    color: '#ffffff',
  },
});
