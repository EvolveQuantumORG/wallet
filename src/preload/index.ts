import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
	openMain() {
		return ipcRenderer.send("openMain");
	},
	getBip39() {
		return ipcRenderer.invoke("getBip39");
	},
	appDrag(opt: { x: number; y: number }) {
		ipcRenderer.send("appDrag", opt);
	},
	openExternal(url: string) {
		ipcRenderer.send("openExternal", url);
	},
	exitApp() {
		ipcRenderer.send("exitApp");
	}
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
