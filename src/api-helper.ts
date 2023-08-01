import axios from 'axios';
import localForage from 'localforage';
import { toast } from 'react-toastify';

const RETRY_LIMIT = 3;
const RETRY_DELAY_MS = 5000;
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
    storedRequests.push(config);
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

  toast.info(`Syncing data with server`);
  for (const request of storedRequests) {
    if (request) {   
      try {
        await performRequest(request);
           storedRequests.splice(storedRequests.indexOf(request), storedRequests.find((sr:any)=>sr.id===request.id)?.length );
        await localForage.setItem(API_REQUESTS_STORAGE_KEY, storedRequests);
      } catch (error) {
        console.log('venom: perform request', { error });
        // Handle failed sync if needed
      }
    }
  }
};
