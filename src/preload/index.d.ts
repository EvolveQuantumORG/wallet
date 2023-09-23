import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			openMain: () => void;
			getBip39: () => Promise<string>;
			appDrag: (opt: { x: number; y: number }) => void;
			openExternal: (url: string) => void;
			exitApp: () => void;
		};
	}
}
