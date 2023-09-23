import request from "@renderer/utils/request";

export function versionTestApi() {
	return request.post("/versionTest", {}, { isLoading: false });
}
