import GenreTabs from '@/components/GenreTabs';
import MovieCard from '@/components/MovieCard';
import { moviesApi } from '@/services/api';
import type { Movie } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['movies', selectedGenre, page],
    queryFn: async () => {
      const response = await moviesApi.getMovies({
        genre: selectedGenre,
        page,
        limit: 20,
      });
      return response;
    },
  });

  React.useEffect(() => {
    if (data?.data?.movies) {
      if (page === 1) {
        setAllMovies(data.data.movies);
      } else {
        setAllMovies(prev => [...prev, ...data.data.movies]);
      }
    }
  }, [data, page]);

  const handleGenreChange = useCallback((genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
    setAllMovies([]);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && data?.data?.movies && data.data.movies.length >= 20) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, data]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    setAllMovies([]);
    refetch();
  }, [refetch]);

  const handleMoviePress = useCallback((movieId: number) => {
    router.push(`/movie/${movieId}`);
  }, [router]);

  const renderMovie = useCallback(({ item }: { item: Movie }) => (
    <View style={styles.movieCardWrapper}>
      <MovieCard movie={item} onPress={() => handleMoviePress(item.id)} />
    </View>
  ), [handleMoviePress]);

  const renderFooter = useCallback(() => {
    if (!isFetching) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }, [isFetching]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {isError ? 'Failed to load movies. Pull to retry.' : 'No movies found'}
        </Text>
      </View>
    );
  }, [isLoading, isError]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{ 
          title: 'Movies',
          headerStyle: {
            backgroundColor: '#141414',
          },
          headerTintColor: '#ffffff',
          headerShadowVisible: false,
        }} 
      />
      
      <GenreTabs selectedGenre={selectedGenre} onSelectGenre={handleGenreChange} />

      {isLoading && page === 1 ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#e50914" />
        </View>
      ) : (
        <FlatList
          data={allMovies}
          renderItem={renderMovie}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={handleRefresh}
              tintColor="#e50914"
              colors={['#e50914']}
            />
          }
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
  },
});
