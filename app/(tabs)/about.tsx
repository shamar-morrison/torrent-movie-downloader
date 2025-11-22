import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Film, Star, Github } from 'lucide-react-native';

export default function AboutScreen() {
  const handleRateApp = async () => {
    const appId = 'YOUR_APP_ID';
    
    if (Platform.OS === 'ios') {
      const url = `https://apps.apple.com/app/id${appId}`;
      await Linking.openURL(url);
    } else if (Platform.OS === 'android') {
      const url = `https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME`;
      await Linking.openURL(url);
    } else {
      console.log('Rating not available on web');
    }
  };

  const handleOpenYTS = async () => {
    await Linking.openURL('https://yts.lt');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'About',
          headerStyle: {
            backgroundColor: '#141414',
          },
          headerTintColor: '#ffffff',
          headerShadowVisible: false,
        }} 
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Film size={64} color="#e50914" strokeWidth={2} />
          </View>
          <Text style={styles.appName}>Movie Finder</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.description}>
            Discover and download your favorite movies from the largest collection
            of high-quality torrents. Browse by genre, search with filters, and
            access detailed information about every film.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <View style={styles.featureBadge}>
              <Film size={24} color="#e50914" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Browse Movies</Text>
              <Text style={styles.featureDescription}>
                Explore movies by genre with infinite scroll
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureBadge}>
              <Star size={24} color="#e50914" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Advanced Search</Text>
              <Text style={styles.featureDescription}>
                Filter by quality, rating, and genre
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleRateApp}
            activeOpacity={0.7}
          >
            <Star size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Rate This App</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleOpenYTS}
            activeOpacity={0.7}
          >
            <Github size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Visit YTS.lt</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by YTS API
          </Text>
          <Text style={styles.footerTextSmall}>
            All content is provided by YTS.lt
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  content: {
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  version: {
    color: '#999999',
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  description: {
    color: '#cccccc',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  featureBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  featureDescription: {
    color: '#999999',
    fontSize: 14,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e50914',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  buttonSecondary: {
    backgroundColor: '#2a2a2a',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  footerText: {
    color: '#999999',
    fontSize: 14,
    marginBottom: 4,
  },
  footerTextSmall: {
    color: '#666666',
    fontSize: 12,
  },
});
