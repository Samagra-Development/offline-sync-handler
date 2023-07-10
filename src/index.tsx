import axios from 'axios';
import React, {
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DataSyncContext } from './data-sync-context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  RequestObject,
  getFromLocalForage,
  offlineChecklist,
  onlineChecklist,
  setToLocalForage,
} from './util';
import { isNull, omit } from 'underscore';

export const OfflineSyncProvider: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [data, setData] = useState({});

  useEffect(() => {
    window.addEventListener('offline', offlineChecklist);
    return () => {
      window.removeEventListener('offline', offlineChecklist);
    };
  }, []);

  const syncOnline = async () => {
    const appOffline = await getFromLocalForage('appOffline');
    if (appOffline && navigator.onLine) {
      onlineChecklist();
    }
  };

  useEffect(() => {
    syncOnline();
  }, []);

  const updateData = useCallback((newData: any) => {
    setData((prev: any) => [...prev, newData]);
  }, []);

  const callApi = useCallback((payload: any) => {
    if (navigator.onLine) {
      const apiObject:RequestObject = {
        url:payload.url,
        ...omit(
        {
          method: payload.method,
          data: payload.body,
          headers: payload.headers,
          queryParams: payload.queryParams,
          baseURL: payload.baseURL,
          params: payload.params,
          timeout: payload.timeout,
          responseType: payload.responseType || "json",
        },
        function(value) {
          return isNull(value);
        }
      )};
      //@ts-ignore
      return axios.request(apiObject);
    } else {
      return new Promise(resolve => {
        appendApi(payload);
        resolve('offline');
      });
    }
  }, []);

  const appendApi = useCallback(async (newApi: any) => {
    let offlineSyncData: any =
      (await getFromLocalForage('offlineSyncData')) || [];
    offlineSyncData = [...offlineSyncData, newApi];
    await setToLocalForage('offlineSyncData', offlineSyncData);
    toast.info('Your data will be sync when we are back online');
  }, []);

  return (
    <DataSyncContext.Provider value={{ data, setData, updateData, callApi }}>
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
      />
      {children}
    </DataSyncContext.Provider>
  );
};

export const useOfflineSyncContext = () => {
  return useContext(DataSyncContext);
};
