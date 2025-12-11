import * as Clipboard from 'expo-clipboard';
import { Stack } from 'expo-router';
import { Check, Copy, Film, Heart, Star, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WALLET_ADDRESSES = {
  BTC: '38A7ex8s75Gmngv5L9vSVko1Ate6avqqiG',
  ETH: '0xed72c4db6c322dc5f2263e2ac310b1b6aabf4d23',
};

export default function AboutScreen() {
  const [isDonateModalVisible, setIsDonateModalVisible] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopyAddress = async (type: 'BTC' | 'ETH') => {
    try {
      await Clipboard.setStringAsync(WALLET_ADDRESSES[type]);
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleRateApp = async () => {
    const appId = 'YOUR_APP_ID';
    const packageName = 'com.horizon.moviefindertorrent';
    
    if (Platform.OS === 'ios') {
      const url = `https://apps.apple.com/app/id${appId}`;
      await Linking.openURL(url);
    } else if (Platform.OS === 'android') {
      const url = `https://play.google.com/store/apps/details?id=${packageName}`;
      await Linking.openURL(url);
    } else {
      console.log('Rating not available on web');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
            onPress={() => setIsDonateModalVisible(true)}
            activeOpacity={0.7}
          >
            <Heart size={20} color="#e50914" />
            <Text style={styles.buttonText}>Support Development</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Donate Modal */}
      <Modal
        visible={isDonateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDonateModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsDonateModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Support Development 🙏</Text>
              <TouchableOpacity 
                onPress={() => setIsDonateModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              If you enjoy the app and want to support development and future features, please consider donating. Your support means a lot!
            </Text>

            <View style={styles.walletContainer}>
              {/* Bitcoin */}
              <View style={styles.walletItem}>
                <View style={styles.walletHeader}>
                  <View style={[styles.cryptoBadge, { backgroundColor: '#F7931A20' }]}>
                    <Text style={[styles.cryptoSymbol, { color: '#F7931A' }]}>₿</Text>
                  </View>
                  <Text style={styles.cryptoName}>Bitcoin (BTC)</Text>
                </View>
                <View style={styles.addressRow}>
                  <Text style={styles.walletAddress} numberOfLines={1} ellipsizeMode="middle">
                    {WALLET_ADDRESSES.BTC}
                  </Text>
                  <TouchableOpacity 
                    style={styles.copyButton}
                    onPress={() => handleCopyAddress('BTC')}
                  >
                    {copiedAddress === 'BTC' ? (
                      <Check size={20} color="#4ade80" />
                    ) : (
                      <Copy size={20} color="#ffffff" />
                    )}
                  </TouchableOpacity>
                </View>
                {copiedAddress === 'BTC' && (
                  <Text style={styles.copiedText}>Copied to clipboard!</Text>
                )}
              </View>

              {/* Ethereum */}
              <View style={styles.walletItem}>
                <View style={styles.walletHeader}>
                  <View style={[styles.cryptoBadge, { backgroundColor: '#627EEA20' }]}>
                    <Text style={[styles.cryptoSymbol, { color: '#627EEA' }]}>Ξ</Text>
                  </View>
                  <Text style={styles.cryptoName}>Ethereum (ETH)</Text>
                </View>
                <View style={styles.addressRow}>
                  <Text style={styles.walletAddress} numberOfLines={1} ellipsizeMode="middle">
                    {WALLET_ADDRESSES.ETH}
                  </Text>
                  <TouchableOpacity 
                    style={styles.copyButton}
                    onPress={() => handleCopyAddress('ETH')}
                  >
                    {copiedAddress === 'ETH' ? (
                      <Check size={20} color="#4ade80" />
                    ) : (
                      <Copy size={20} color="#ffffff" />
                    )}
                  </TouchableOpacity>
                </View>
                {copiedAddress === 'ETH' && (
                  <Text style={styles.copiedText}>Copied to clipboard!</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    color: '#cccccc',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  walletContainer: {
    gap: 16,
  },
  walletItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cryptoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoSymbol: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  cryptoName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 4,
  },
  walletAddress: {
    color: '#999999',
    fontSize: 13,
    flex: 1,
    fontFamily: 'monospace',
  },
  copyButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  copiedText: {
    color: '#4ade80',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});
