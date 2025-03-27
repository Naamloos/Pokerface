import { ElectronAPI } from "@electron-toolkit/preload";
import { ModFetcher } from "./modfetcher";

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            modfetcher: ModFetcher;
        };
    }

    interface Mod {
        title: string;
        "requires-steamodded": boolean;
        "requires-talisman": boolean;
        categories: string[];
        author: string;
        repo: string;
        downloadURL: string;
        version?: string;
        "automatic-version-check"?: boolean;
        folderName?: string;
        installed: boolean;
        imageB64?: string;
        description?: string;
    }

    interface ModFetcher {
        modlistExists(): Promise<boolean>;
        refreshModList(): Promise<void>;
        getModList(): Promise<Mod[]>;
    }
}
