import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  setConfigSettings,
  setDefaults
} from '@react-native-firebase/remote-config';
import { API_BASE_URL, updateApiBaseUrl } from './api';

// Default configuration values
const defaultValues = {
  api_base_url: API_BASE_URL,
};

export const initRemoteConfig = async () => {
  try {
    const remoteConfig = getRemoteConfig();

    // Set default values
    await setDefaults(remoteConfig, defaultValues);

    // Set minimumFetchIntervalMillis to 0 during development for testing
    await setConfigSettings(remoteConfig, {
      minimumFetchIntervalMillis: __DEV__ ? 0 : 3600000,
    });

    const fetched = await fetchAndActivate(remoteConfig);
    
    if (fetched) {
      console.log('Remote config fetched and activated');
    } else {
      console.log('Remote config already activated');
    }

    // Get the value
    const apiBaseUrl = getValue(remoteConfig, 'api_base_url').asString();
    
    // Update the API service
    updateApiBaseUrl(apiBaseUrl);
    
    return apiBaseUrl;
  } catch (error) {
    console.error('Error initializing remote config:', error);
    // Return default on error
    return defaultValues.api_base_url;
  }
};
