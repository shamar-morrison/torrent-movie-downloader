import remoteConfig from '@react-native-firebase/remote-config';
import { updateApiBaseUrl } from './api';

// Default configuration values
const defaultValues = {
  api_base_url: 'https://yts.lt/api/v2',
};

export const initRemoteConfig = async () => {
  try {
    // Set default values
    await remoteConfig().setDefaults(defaultValues);

    // Fetch and activate
    // Set minimumFetchIntervalMillis to 0 during development for testing
    // In production, use a higher value (e.g., 12 hours = 43200000)
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: __DEV__ ? 0 : 3600000,
    });

    const fetched = await remoteConfig().fetchAndActivate();
    
    if (fetched) {
      console.log('Remote config fetched and activated');
    } else {
      console.log('Remote config already activated');
    }

    // Get the value
    const apiBaseUrl = remoteConfig().getValue('api_base_url').asString();
    
    // Update the API service
    updateApiBaseUrl(apiBaseUrl);
    
    return apiBaseUrl;
  } catch (error) {
    console.error('Error initializing remote config:', error);
    // Return default on error
    return defaultValues.api_base_url;
  }
};
