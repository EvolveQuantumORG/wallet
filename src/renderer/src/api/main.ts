import request from "@renderer/utils/request";

export function getWalletApi() {
	return request.get("/getWallet", {}, { isLoading: false });
}

export function getAccountLisApi() {
	return request.get("/getAccountLis", {}, { isLoading: false });
}

export function addAccountApi(data: any) {
	return request.post("/addAccount", data);
}

export function changeAccountApi(data: any) {
	return request.post("/changeAccount", data);
}

export function sendApi(data: any) {
	return request.post("/send", data);
}

export function searchRecirdApi(data: any) {
	return request.post("/searchRecird", data, { isLoading: false });
}

export function getRecirdInfoApi(data: any) {
	return request.post("/getRecirdInfo", data);
}
