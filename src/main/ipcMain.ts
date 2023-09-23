import { BrowserWindow, app, ipcMain, shell } from "electron";
import bip39 from "bip39";

app.whenReady().then(() => {
	ipcMain.on("openMain", async event => {
		const win = BrowserWindow.fromWebContents(event.sender);

		win?.setBounds(
			{
				width: 375,
				height: 600
			},
			true
		);
	});

	ipcMain.handle("getBip39", () => {
		return bip39.generateMnemonic(128);
	});

	ipcMain.on("appDrag", (event, opt: { x: number; y: number }) => {
		const win = BrowserWindow.fromWebContents(event.sender);
		const [x, y] = win!.getPosition();
		console.log(x, y);

		win?.setPosition(x + opt.x, y + opt.y);
	});

	// @ts-ignore
	ipcMain.on("openExternal", (event, url: string) => {
		shell.openExternal(url);
	});

	ipcMain.on("exitApp", () => {
		app.quit();
	});
});
