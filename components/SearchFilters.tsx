import { GENRES, QUALITIES } from '@/constants/genres';
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SearchFiltersProps {
  quality: string;
  onQualityChange: (quality: string) => void;
  genre: string;
  onGenreChange: (genre: string) => void;
  onClearFilters: () => void;
}

export default function SearchFilters({ 
  quality, 
  onQualityChange, 
  genre,
  onGenreChange,
  onClearFilters 
}: SearchFiltersProps) {
  const [showQuality, setShowQuality] = React.useState(false);
  const [showGenre, setShowGenre] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <View style={styles.filterItem}>
          <Text style={styles.label}>Quality:</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              setShowQuality(!showQuality);
              setShowGenre(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>{quality}</Text>
            <ChevronDown size={16} color="#999999" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.label}>Genre:</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              setShowGenre(!showGenre);
              setShowQuality(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>
              {GENRES.find(g => g.id === genre)?.label || 'All'}
            </Text>
            <ChevronDown size={16} color="#999999" />
          </TouchableOpacity>
        </View>
      </View>

      {showQuality && (
        <ScrollView 
          style={styles.optionsContainer}
          nestedScrollEnabled={true}
        >
          {QUALITIES.map((q) => (
            <TouchableOpacity
              key={q}
              style={[
                styles.option,
                quality === q && styles.optionActive,
              ]}
              onPress={() => {
                onQualityChange(q);
                setShowQuality(false);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  quality === q && styles.optionTextActive,
                ]}
              >
                {q}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {showGenre && (
        <ScrollView 
          style={styles.optionsContainer}
          nestedScrollEnabled={true}
        >
          {GENRES.map((g) => (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.option,
                genre === g.id && styles.optionActive,
              ]}
              onPress={() => {
                onGenreChange(g.id);
                setShowGenre(false);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  genre === g.id && styles.optionTextActive,
                ]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.clearButton}
        onPress={onClearFilters}
        activeOpacity={0.7}
      >
        <Text style={styles.clearButtonText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  filterItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600' as const,
    marginRight: 8,
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141414',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  dropdownText: {
    color: '#ffffff',
    fontSize: 14,
  },
  optionsContainer: {
    backgroundColor: '#141414',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 12,
    overflow: 'hidden',
    maxHeight: 250,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  optionActive: {
    backgroundColor: '#e50914',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 14,
  },
  optionTextActive: {
    fontWeight: '600' as const,
  },
  clearButton: {
    backgroundColor: '#e50914',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
