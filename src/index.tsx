import React, {
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DataSyncContext } from './data-sync-context';
import axios from 'axios';
import localForage from 'localforage';

import { omit } from 'underscore';
const api = axios.create();
const RETRY_LIMIT = 3;
const RETRY_DELAY_MS = 1000;
const API_REQUESTS_STORAGE_KEY = 'apiRequests';

import {
  generateUuid,
  getStoredRequests,
  clearStoredRequests,
} from './api-helper';

// Check if window object exists
const hasWindow = () => {
  return window && typeof window !== 'undefined';
};

export const OfflineSyncProvider: FC<{
  children: ReactElement;
  render?: (status: { isOffline?: boolean; isOnline: boolean }) => ReactNode;
  onStatusChange?: (status: { isOnline: boolean }) => void;
  onSyncSuccess?: (data: {config:any, data:any}) => void;
  toastConfig?: any;
}> = ({ children, render, onStatusChange, onSyncSuccess }) => {
  // Manage state for data, offline status, and online status
  const [data, setData] = useState<Record<string, any>>({});
  const [isOnline, setIsOnline] = useState<boolean>(
    window?.navigator?.onLine ?? true
  );

  useEffect(() => {
    if (!hasWindow()) {
      return;
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Event handler for online event
  const handleOnline = useCallback(() => {
    handleEvent(false);
    syncOfflineRequests();
  }, []);

  // Event handler for offline event
  const handleOffline = () => {
    handleEvent(true);
  };

  // Event handler for status change
  const handleEvent = (isOffline = true) => {
    const isOnline = !isOffline;
    onStatusChange?.({ isOnline });
    setIsOnline(isOnline);
  };

  useEffect(() => {
    syncOfflineRequests();
  }, []);

  const saveRequestToOfflineStorage = async (config: any) => {
    try {
      const storedRequests: Array<any> =
        (await localForage.getItem(API_REQUESTS_STORAGE_KEY)) || [];
      storedRequests.push(omit({ ...config }, 'onSuccess'));
      await localForage.setItem(API_REQUESTS_STORAGE_KEY, storedRequests);
    } catch (error) {
      console.error('Error saving API request for offline:', error);
    }
  };

  // Function to perform the actual API request and handle retries
  const performRequest = async (config: any): Promise<any> => {
    try {
      console.log('perform', { config });
      const response = await api.request(config);
      onSyncSuccess && onSyncSuccess({ config, data: response });
      return response.data;
    } catch (error) {
      if (config.retryCount < RETRY_LIMIT) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        config.retryCount++;
        return performRequest(config);
      } else {
        // Retry limit reached, save the request to offline storage
        await saveRequestToOfflineStorage(config);
        // throw new Error('Exceeded retry limit, request saved for offline sync.');
      }
    }
  };

  // Function to send the requests to the server and handle offline sync
  const sendRequest = async (config: any) => {
    try {
      config.retryCount = config.retryCount ?? 0;
      config.id = generateUuid();
      // Perform the API request and handle retries
      if (!navigator.onLine) {
        alert(
          'You are currently offline. We will automatically resend the request when you are back online.'
        );
      }
      return await performRequest(config);
    } catch (error) {
      throw error;
    }
  };

  const syncOfflineRequests = async () => {
    const storedRequests: any = await getStoredRequests();
    if (!storedRequests || storedRequests.length === 0) {
      return;
    }

    // alert(`Back online! Your requests will sync with the server now`);

    for (const request of storedRequests) {
      if (request) {
        try {
          await performRequest(request);
          await localForage.setItem(
            API_REQUESTS_STORAGE_KEY,
            [...storedRequests].filter((sr: any) => sr.id !== request.id)
          );
          //  await localForage.setItem(API_REQUESTS_STORAGE_KEY, [...storedRequests].splice(storedRequests.indexOf(request), [...storedRequests].filter((sr:any)=>sr.id===request.id)?.length || 1 ));
        } catch (error) {
          console.log({ error });
        }
      }
    }
  };

  return (
    <>
      <DataSyncContext.Provider
        value={{ data, setData, sendRequest, clearStoredRequests }}
      >
        {render?.({ isOnline })}
        {children}
      </DataSyncContext.Provider>
    </>
  );
};

// Custom hook to access offline sync context
export const useOfflineSyncContext = () => {
  return useContext(DataSyncContext);
};
