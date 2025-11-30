import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { Star, ThumbsDown, ThumbsUp, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PRIMARY_COLOR = '#e50914';

const STORAGE_KEYS = {
  HAS_RATED: 'rate_app_has_rated',
  HAS_DECLINED: 'rate_app_has_declined',
  LAST_REMINDED: 'rate_app_last_reminded',
  INSTALL_DATE: 'rate_app_install_date',
  LAUNCH_COUNT: 'rate_app_launch_count',
};

const ANDROID_PACKAGE_NAME = 'com.horizon.moviefindertorrent';

export const RateAppPrompt = () => {
  const [isVisible, setIsVisible] = useState(__DEV__ ? true : false); 
  const [step, setStep] = useState<'enjoying' | 'rating' | 'feedback'>('enjoying');

  useEffect(() => {
    checkShowPrompt();
  }, []);

  const checkShowPrompt = async () => {
    try {
      const [hasRated, hasDeclined, lastReminded, installDate, launchCount] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.HAS_RATED),
          AsyncStorage.getItem(STORAGE_KEYS.HAS_DECLINED),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_REMINDED),
          AsyncStorage.getItem(STORAGE_KEYS.INSTALL_DATE),
          AsyncStorage.getItem(STORAGE_KEYS.LAUNCH_COUNT),
        ]);

      if (hasRated === 'true' || hasDeclined === 'true') return;

      const currentLaunchCount = launchCount ? parseInt(launchCount, 10) + 1 : 1;
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAUNCH_COUNT,
        currentLaunchCount.toString()
      );

      const now = Date.now();
      if (!installDate) {
        await AsyncStorage.setItem(STORAGE_KEYS.INSTALL_DATE, now.toString());
        return;
      }

      // Criteria:
      // 1. Launched at least 5 times
      // 2. Installed at least 2 days ago
      // 3. Not reminded in the last 7 days
      const daysSinceInstall =
        (now - parseInt(installDate, 10)) / (1000 * 60 * 60 * 24);
      const daysSinceReminded = lastReminded
        ? (now - parseInt(lastReminded, 10)) / (1000 * 60 * 60 * 24)
        : null;

      if (currentLaunchCount >= 5 && daysSinceInstall >= 2) {
        if (daysSinceReminded === null || daysSinceReminded >= 7) {
            // Add a small delay so it doesn't pop up immediately on launch
            setTimeout(() => {
                setIsVisible(true);
            }, 4000);
        }
      }
    } catch (error) {
      console.error('Error checking rate app prompt:', error);
    }
  };

  const handleEnjoyingResponse = (isEnjoying: boolean) => {
    if (isEnjoying) {
      setStep('rating');
    } else {
      setStep('feedback');
    }
  };

  const handleRateApp = async () => {
    setIsVisible(false);
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_RATED, 'true');

    const openStoreUrl = () => {
      const url = Platform.select({
        android: `market://details?id=${ANDROID_PACKAGE_NAME}`,
        default: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`,
      });

      if (url) {
        Linking.openURL(url).catch(() => {
          Alert.alert('Error', 'Could not open store link.');
        });
      }
    };

    try {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
      } else {
        openStoreUrl();
      }
    } catch (error) {
      console.log('StoreReview failed, falling back to URL:', error);
      openStoreUrl();
    }
  };

  const handleRemindLater = async () => {
    setIsVisible(false);
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_REMINDED, Date.now().toString());
  };

  const handleNoThanks = async () => {
    setIsVisible(false);
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_DECLINED, 'true');
  };
  
  const handleClose = () => {
      // Treat closing via backdrop/X as "Remind Later" to be safe, or just close without saving state (so it checks again next time)
      // Let's treat it as "Remind Later" to avoid annoying them next launch if they just dismissed it.
      handleRemindLater();
  }

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <X size={20} color="#9CA3AF" />
            </TouchableOpacity>

          {step === 'enjoying' && (
            <>
              <View style={styles.iconContainer}>
                <ThumbsUp size={32} color={PRIMARY_COLOR} />
              </View>
              <Text style={styles.title}>Enjoying the app?</Text>
              <Text style={styles.description}>
                Are you enjoying using Movie Finder?
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => handleEnjoyingResponse(false)}
                >
                  <Text style={styles.secondaryButtonText}>Not really</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={() => handleEnjoyingResponse(true)}
                >
                  <Text style={styles.primaryButtonText}>Yes!</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 'rating' && (
            <>
              <View style={styles.iconContainer}>
                <Star size={32} color="#EAB308" fill="#EAB308" />
              </View>
              <Text style={styles.title}>Rate Us</Text>
              <Text style={styles.description}>
                Your positive rating helps us improve and reach more users.
              </Text>
              <View style={styles.verticalButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton, styles.fullWidth]}
                  onPress={handleRateApp}
                >
                  <Text style={styles.primaryButtonText}>Rate App</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton, styles.fullWidth]}
                  onPress={handleRemindLater}
                >
                  <Text style={styles.secondaryButtonText}>Remind Me Later</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.ghostButton, styles.fullWidth]}
                  onPress={handleNoThanks}
                >
                  <Text style={styles.ghostButtonText}>No Thanks</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 'feedback' && (
            <>
               <View style={styles.iconContainer}>
                <ThumbsDown size={32} color="#EF4444" />
              </View>
              <Text style={styles.title}>We're sorry!</Text>
              <Text style={styles.description}>
                We'd love to know how we can make the app better for you.
              </Text>
              <View style={styles.verticalButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton, styles.fullWidth]}
                  onPress={() => {
                      setIsVisible(false);
                      Linking.openURL('mailto:shamar.morrison2000@gmail.com?subject=App Feedback - Movie Finder');
                  }}
                >
                  <Text style={styles.primaryButtonText}>Give Feedback</Text>
                </TouchableOpacity>
                 <TouchableOpacity
                  style={[styles.button, styles.ghostButton, styles.fullWidth]}
                  onPress={handleClose}
                >
                  <Text style={styles.ghostButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  closeButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  verticalButtonContainer: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  fullWidth: {
    width: '100%',
    flex: 0,
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostButtonText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 14,
  },
});
