
import localForage from 'localforage';
import { API_REQUESTS_STORAGE_KEY } from './constants';



// Function to generate UUID for requests
export const generateUuid = function() {
  return String(Date.now().toString(32) + Math.random().toString(16)).replace(
    /\./g,
    ''
  );
};


export const getStoredRequests = async () => {
  try {
    return await localForage.getItem(API_REQUESTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error getting stored API requests:', error);
    return [];
  }
};

export const setStorage =async (data:any)=>{
  try {
    await localForage.setItem(API_REQUESTS_STORAGE_KEY,data);
  } catch (error) {
    console.error('Error setting store :', error);
  }
}
export const clearStoredRequests = async () => {
  try {
    await localForage.removeItem(API_REQUESTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing stored API requests:', error);
  }
};

