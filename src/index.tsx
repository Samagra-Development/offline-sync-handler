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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { sendRequest, syncOfflineRequests } from './api-helper';

// Check if window object exists
const hasWindow = () => {
  return typeof window !== 'undefined';
};

export const OfflineSyncProvider: FC<{
  children: ReactElement;
  render?: (status: { isOffline?: boolean; isOnline: boolean }) => ReactNode;
  onStatusChange?: (status: { isOnline: boolean }) => void;
  toastConfig?: any;
}> = ({ children, render, onStatusChange, toastConfig }) => {
  // Manage state for data, offline status, and online status
  const [data, setData] = useState<Record<string, any>>({});
  const [isOnline, setIsOnline] = useState<boolean>(
    window.navigator.onLine ?? true
  );

  // Add event listeners for online/offline events
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
  return (
    <>
      <DataSyncContext.Provider value={{ data, setData, sendRequest }}>
        {render?.({ isOnline })}
        {children}
      </DataSyncContext.Provider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        {...toastConfig}
      />
    </>
  );
};

// Custom hook to access offline sync context
export const useOfflineSyncContext = () => {
  return useContext(DataSyncContext);
};


