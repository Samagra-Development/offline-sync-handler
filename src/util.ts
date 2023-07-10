import axios from "axios";
import localforage from "localforage";
import { toast } from "react-toastify";
import { omit, isNull } from "underscore";


export type RequestObject= {
  method?: string;
  url: string;
  data?: any ;
  headers?: any ;
  baseURL?: string ;
  params?: any ;
  timeout?:number,
  responseType?: string,
}
export const getFromLocalForage = async (key:string) => {
  return await localforage.getItem(key);
};

export const setToLocalForage = async (key:string, value:any) => {
  await localforage.setItem(key, value);
};


const performOnlineSync = async () => {
  // toast.info("App is back online ✅");
  await setToLocalForage("appOffline", false);

  let offlineSyncData: any =
    (await getFromLocalForage("offlineSyncData")) || [];

  if (offlineSyncData.length > 0) {
    while (offlineSyncData.length) {
      try {
        toast.info(`Syncing ${offlineSyncData?.[0]?.id} data with server`);
        // Make a rest call to sync with server
        const apiObject = omit(
          {
            method: offlineSyncData?.[0]?.method,
            url: offlineSyncData?.[0]?.endpoint,
            data: offlineSyncData?.[0]?.body,
            headers: offlineSyncData?.[0]?.headers,
            queryParams: offlineSyncData?.[0]?.queryParams,
            baseURL: offlineSyncData?.[0]?.baseURL,
            params: offlineSyncData?.[0]?.params,
            timeout: offlineSyncData?.[0]?.timeout,
            responseType: offlineSyncData?.[0]?.responseType || "json",
          },
          function(value) {
            return isNull(value);
          }
        );
        //@ts-ignore
        await axios.request<RequestObject>(apiObject);
      } catch (error) {
        if(axios.isAxiosError(error))
        toast.error(error.message || error.toString());
      }
      offlineSyncData.shift();
    }
    await setToLocalForage("offlineSyncData", offlineSyncData);
  }
};

export const onlineChecklist = async () => {
  if ("requestIdleCallback()" in window) {
   window?.requestIdleCallback(performOnlineSync);
  } else {
    performOnlineSync();
  }
};

export const offlineChecklist = async () => {
  toast.warn("App is now in offline mode");
  await setToLocalForage("appOffline", true);
};
