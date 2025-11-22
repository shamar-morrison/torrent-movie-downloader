import MovieCard from '@/components/MovieCard';
import SearchFilters from '@/components/SearchFilters';
import { moviesApi } from '@/services/api';
import type { Movie } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { Search as SearchIcon } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quality, setQuality] = useState<string>('All');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', debouncedQuery, quality],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return null;
      }
      const response = await moviesApi.getMovies({
        query_term: debouncedQuery,
        quality: quality !== 'All' ? quality : undefined,
        limit: 50,
      });
      return response;
    },
    enabled: debouncedQuery.trim().length > 0,
  });

  const handleClearFilters = useCallback(() => {
    setQuality('All');
    setSearchQuery('');
  }, []);

  const handleMoviePress = useCallback((movieId: number) => {
    router.push(`/movie/${movieId}` as any);
  }, [router]);

  const renderMovie = useCallback(({ item }: { item: Movie }) => (
    <View style={styles.movieCardWrapper}>
      <MovieCard movie={item} onPress={() => handleMoviePress(item.id)} />
    </View>
  ), [handleMoviePress]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    if (!debouncedQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <SearchIcon size={64} color="#666666" />
          <Text style={styles.emptyText}>Search for your favorite movies</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {isError ? 'Failed to search. Try again.' : 'No results found'}
        </Text>
      </View>
    );
  }, [isLoading, isError, debouncedQuery]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{ 
          title: 'Search',
          headerStyle: {
            backgroundColor: '#141414',
          },
          headerTintColor: '#ffffff',
          headerShadowVisible: false,
        }} 
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <SearchIcon size={20} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <SearchFilters
        quality={quality}
        onQualityChange={setQuality}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#e50914" />
        </View>
      ) : (
        <FlatList
          data={data?.data?.movies || []}
          renderItem={renderMovie}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#1e1e1e',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    outlineStyle: 'none' as any,
  },
  listContent: {
    padding: 8,
  },
  movieCardWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
  },
});
