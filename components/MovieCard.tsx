import type { Movie } from '@/types/movie';
import { Star } from 'lucide-react-native';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

export default function MovieCard({ movie, onPress }: MovieCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: movie.medium_cover_image }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.ratingBadge}>
          <Star size={12} color="#FFC107" fill="#FFC107" />
          <Text style={styles.ratingText}>{movie.rating.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>{movie.year}</Text>
        
        {movie.torrents && movie.torrents.length > 0 && (
          <View style={styles.qualityBadges}>
            {Array.from(new Set(movie.torrents.map(t => t.quality)))
              .slice(0, 3)
              .map((quality, index) => (
                <View key={index} style={styles.qualityBadge}>
                  <Text style={styles.qualityText}>{quality}</Text>
                </View>
              ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  posterContainer: {
    width: '100%',
    aspectRatio: 2 / 3,
    position: 'relative' as const,
  },
  poster: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
  },
  ratingBadge: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
    lineHeight: 20,
  },
  year: {
    color: '#999999',
    fontSize: 13,
    marginBottom: 8,
  },
  qualityBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  qualityBadge: {
    backgroundColor: '#e50914',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  qualityText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600' as const,
  },
});
