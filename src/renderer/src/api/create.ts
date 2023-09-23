import request from "@renderer/utils/request";

export function walletCreateApi(data: { bip39_has1: string; importType?: string }) {
	return request.post("/walletCreate", data);
}
