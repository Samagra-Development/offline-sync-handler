import { createContext } from "react";

type DataSyncContextType = any;

export const DataSyncContext = createContext<DataSyncContextType | null>(null);


