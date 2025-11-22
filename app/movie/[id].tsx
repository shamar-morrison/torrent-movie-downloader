import { generateMagnetLink, moviesApi } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Download, Play, Star } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const movieId = parseInt(id || '0', 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      const response = await moviesApi.getMovieDetails(movieId);
      return response;
    },
    enabled: movieId > 0,
  });

  const movie = data?.data?.movie;

  const handleDownload = async (hash: string, title: string) => {
    const magnetLink = generateMagnetLink(hash, title);
    try {
      await Linking.openURL(magnetLink);
    } catch (error) {
      console.error('Failed to open torrent client:', error);
    }
  };

  const handlePlayTrailer = async () => {
    if (movie?.yt_trailer_code) {
      const url = `https://www.youtube.com/watch?v=${movie.yt_trailer_code}`;
      await Linking.openURL(url);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  if (isError || !movie) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Failed to load movie details</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: movie.background_image || movie.large_cover_image }}
            style={styles.backdrop}
            resizeMode="cover"
          />
          <View style={styles.backdropOverlay} />
          
          <TouchableOpacity 
            style={styles.backButtonTop}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.posterRow}>
            <Image
              source={{ uri: movie.large_cover_image }}
              style={styles.poster}
              resizeMode="cover"
            />
            
            <View style={styles.titleSection}>
              <Text style={styles.title}>{movie.title}</Text>
              
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Calendar size={16} color="#999999" />
                  <Text style={styles.metaText}>{movie.year}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Clock size={16} color="#999999" />
                  <Text style={styles.metaText}>{movie.runtime} min</Text>
                </View>
                <View style={styles.metaItem}>
                  <Star size={16} color="#FFC107" fill="#FFC107" />
                  <Text style={styles.metaText}>{movie.rating}/10</Text>
                </View>
              </View>

              <View style={styles.genres}>
                {movie.genres?.map((genre, index) => (
                  <View key={index} style={styles.genreBadge}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {movie.yt_trailer_code && (
            <TouchableOpacity 
              style={styles.trailerButton}
              onPress={handlePlayTrailer}
              activeOpacity={0.7}
            >
              <Play size={20} color="#ffffff" />
              <Text style={styles.trailerButtonText}>Watch Trailer</Text>
            </TouchableOpacity>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.description}>
              {movie.description_full || movie.synopsis || 'No description available.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Downloads</Text>
            {movie.torrents?.map((torrent, index) => (
              <View key={index} style={styles.torrentCard}>
                <View style={styles.torrentInfo}>
                  <Text style={styles.torrentQuality}>{torrent.quality}</Text>
                  <Text style={styles.torrentType}>{torrent.type}</Text>
                  <View style={styles.torrentStats}>
                    <Text style={styles.torrentSize}>{torrent.size}</Text>
                    <Text style={styles.torrentSeeds}>
                      Seeds: {torrent.seeds} | Peers: {torrent.peers}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownload(torrent.hash, movie.title)}
                  activeOpacity={0.7}
                >
                  <Download size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  scrollView: {
    flex: 1,
  },
  backdropContainer: {
    width: '100%',
    height: 300,
    position: 'relative' as const,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButtonTop: {
    position: 'absolute' as const,
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  posterRow: {
    flexDirection: 'row',
    marginBottom: 24,
    marginTop: -60,
    gap: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  titleSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 12,
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#999999',
    fontSize: 14,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreBadge: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  genreText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e50914',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  trailerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  description: {
    color: '#cccccc',
    fontSize: 15,
    lineHeight: 24,
  },
  torrentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  torrentInfo: {
    flex: 1,
  },
  torrentQuality: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  torrentType: {
    color: '#999999',
    fontSize: 14,
    marginBottom: 8,
  },
  torrentStats: {
    gap: 4,
  },
  torrentSize: {
    color: '#cccccc',
    fontSize: 13,
  },
  torrentSeeds: {
    color: '#999999',
    fontSize: 12,
  },
  downloadButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e50914',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#999999',
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
