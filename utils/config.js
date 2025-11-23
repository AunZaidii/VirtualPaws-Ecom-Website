// Configuration file for client-side environment variables
// Fetches config from Netlify function which reads from environment variables

let configInstance = null;
let configPromise = null;

async function fetchConfig() {
  const response = await fetch('/.netlify/functions/getConfig');
  if (!response.ok) {
    throw new Error('Failed to fetch config');
  }
  return response.json();
}

async function initConfig() {
  if (configInstance) {
    return configInstance;
  }

  if (!configPromise) {
    configPromise = fetchConfig();
  }

  const configData = await configPromise;
  
  configInstance = {
    stripe: {
      publishableKey: configData.stripePublishableKey
    }
  };

  return configInstance;
}

// Export async function to get initialized config
export async function getConfig() {
  return await initConfig();
}

// Export config object - will be populated after initConfig() completes
export const config = {
  stripe: {
    publishableKey: null
  }
};

// Initialize config immediately
initConfig().then(cfg => {
  Object.assign(config, cfg);
}).catch(err => {
  console.error('Failed to load config:', err);
});

