import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { QUALITIES } from '@/constants/genres';

interface SearchFiltersProps {
  quality: string;
  onQualityChange: (quality: string) => void;
  onClearFilters: () => void;
}

export default function SearchFilters({ quality, onQualityChange, onClearFilters }: SearchFiltersProps) {
  const [showQuality, setShowQuality] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <Text style={styles.label}>Quality:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowQuality(!showQuality)}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownText}>{quality}</Text>
          <ChevronDown size={16} color="#999999" />
        </TouchableOpacity>
      </View>

      {showQuality && (
        <View style={styles.optionsContainer}>
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
        </View>
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
    marginBottom: 12,
  },
  label: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600' as const,
    marginRight: 12,
    width: 70,
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
