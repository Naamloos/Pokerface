import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { ModFetcher } from "./modfetcher";

// Utility function to dynamically map all methods of a class instance to an API object
function createProxy<T>(instance: T): Record<string, (...args: any[]) => any> {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
        .filter((method) => method !== "constructor") // Exclude the constructor
        .reduce((api, method) => {
            api[method] = (...args: any[]) => (instance as any)[method](...args);
            return api;
        }, {} as Record<string, (...args: any[]) => any>);
}

// Create a single instance of ModFetcher
const modFetcherInstance = new ModFetcher();

// Use the utility function to create the proxy
const modfetcherProxy = createProxy(modFetcherInstance);

// Custom APIs for renderer
const api = {
    modfetcher: modfetcherProxy,
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("electron", electronAPI);
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
