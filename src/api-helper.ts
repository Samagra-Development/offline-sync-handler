import axios from 'axios';
import localForage from 'localforage';
import { toast } from 'react-toastify';
import { addCallBack, triggerCallback } from './callback-util';
import { omit } from 'underscore';

const RETRY_LIMIT = 3;
const RETRY_DELAY_MS = 1000;
const API_REQUESTS_STORAGE_KEY = 'apiRequests';

const api = axios.create();

// Function to generate UUID for requests
const generateUuid = function() {
  return String(Date.now().toString(32) + Math.random().toString(16)).replace(
    /\./g,
    ''
  );
};

// Function to save a failed request to offline storage
export const saveRequestToOfflineStorage = async (config: any) => {
  try {
    const storedRequests: Array<any> =
      (await localForage.getItem(API_REQUESTS_STORAGE_KEY)) || [];
    storedRequests.push(omit({ ...config }, 'onSuccess'));
    addCallBack({ name: config.id, callbackFn: config.onSuccess });
    await localForage.setItem(API_REQUESTS_STORAGE_KEY, storedRequests);
  } catch (error) {
    console.error('Error saving API request for offline:', error);
  }
};

export const getStoredRequests = async () => {
  try {
    return await localForage.getItem(API_REQUESTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error getting stored API requests:', error);
    return [];
  }
};

export const clearStoredRequests = async () => {
  try {
    await localForage.removeItem(API_REQUESTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing stored API requests:', error);
  }
};

// Function to perform the actual API request and handle retries
const performRequest = async (config: any): Promise<any> => {
  try {
    const response = await api.request(config);
    triggerCallback({ name: config.id, data: response });
    return response.data;
  } catch (error) {
    if (config.retryCount < RETRY_LIMIT) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      config.retryCount++;
      return performRequest(config);
    } else {
      // Retry limit reached, save the request to offline storage
      await saveRequestToOfflineStorage(config);
      throw new Error('Exceeded retry limit, request saved for offline sync.');
    }
  }
};

// Function to send the requests to the server and handle offline sync
export const sendRequest = async (config: any) => {
  try {
    config.retryCount = config.retryCount ?? 0;
    config.id = generateUuid();
    // Perform the API request and handle retries
    if (!navigator.onLine) {
      toast.info(
        'You are currently offline. We will automatically resend the request when you are back online.'
      );
    }
    return await performRequest(config);
  } catch (error) {
    throw error;
  }
};

export const syncOfflineRequests = async () => {
  const storedRequests: any = await getStoredRequests();
  if (!storedRequests || storedRequests.length === 0) {
    return;
  }

  toast.info(`Back online! Your requests will sync with the server now`);
  for (const request of storedRequests) {
    console.log('ddd:', { storedRequests, request });
    if (request) {
      try {
        await performRequest(request);
        await localForage.setItem(
          API_REQUESTS_STORAGE_KEY,
          [...storedRequests].splice(
            storedRequests.indexOf(request),
            [...storedRequests].filter((sr: any) => sr.id === request.id)
              ?.length || 1
          )
        );
      } catch (error) {
        console.log('venom: perform request', { error });
        // Handle failed sync if needed
      }
    }
  }
};
