const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidQueries(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    if (!androidManifest.manifest.queries) {
      androidManifest.manifest.queries = [];
    }

    const queries = androidManifest.manifest.queries;
    
    // Check if magnet query already exists to avoid duplicates
    const hasMagnet = queries.some(query => 
      query.intent?.some(intent => 
        intent.data?.some(data => 
          data.$['android:scheme'] === 'magnet'
        )
      )
    );

    if (!hasMagnet) {
      queries.push({
        intent: [
          {
            action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
            data: [{ $: { 'android:scheme': 'magnet' } }],
          },
        ],
      });
    }

    return config;
  });
};
