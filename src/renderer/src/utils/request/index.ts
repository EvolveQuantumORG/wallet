import MuRequest from "./request";
import { BASE_URL, TIME_OUT } from "./config";
import { ElMessage } from "element-plus";
import { UserStore } from "@renderer/stores";

const muRequest = new MuRequest({
	baseURL: BASE_URL,
	timeout: TIME_OUT,
	interceptors: {
		requestInterceptor: config => {
			return config;
		},
		requestInterceptorCatch: err => {
			console.log("");
			throw err;
		},
		responseInterceptor: (res: ResultTypw) => {
			if (res?.code === 200) return res.data;
			if (res?.responseType === "blob") return res;
			if (res.code === 999) {
				const userStore = UserStore();
				userStore.setToken("");
				throw res;
			}

			if (res?.code === 201) {
				ElMessage.error({
					message: res?.msg,
					grouping: true
				});
			}

			throw res;
		},
		responseInterceptorCatch: err => {
			throw err;
		}
	}
});

export default muRequest;
