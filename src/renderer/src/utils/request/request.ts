import axios from "axios";
import type { AxiosInstance } from "axios";
import type { MuRequestConfig, MuRequestInterceptors, downloadRes, MuInternalAxiosRequestConfig } from "./type";
import { ElLoading } from "element-plus";
import { UserStore } from "@renderer/stores";

const DEFAULT_LOADING = true;

class MuRequest {
	instance: AxiosInstance;
	interceptors?: MuRequestInterceptors;
	isLoading?: boolean;
	loadingServer?: ReturnType<typeof ElLoading.service>;

	constructor(config: MuRequestConfig) {
		this.instance = axios.create(config);
		this.interceptors = config.interceptors;
		this.isLoading = config.isLoading ?? DEFAULT_LOADING;

		this.addResponse();

		// this.instance.interceptors.request.use(
		// 	// this.interceptors?.requestInterceptor,
		// 	this.interceptors?.requestInterceptorCatch
		// );
		this.instance.interceptors.response.use(this.interceptors?.responseInterceptor, this.interceptors?.responseInterceptorCatch);

		this.addRequest();
	}

	private addRequest() {
		this.instance.interceptors.request.use(
			(config: MuInternalAxiosRequestConfig) => {
				const userStore = UserStore();
				const token = userStore.token;
				if (token && config.headers) {
					config.headers["token"] = token;
				}

				if (config.method === "post" && config.data.constructor !== URLSearchParams && config.data.constructor !== FormData) {
					// config.data
					// const b = JSON.stringify(config.data)
					// config.headers['Stiggn'] = MD5(b + MD5_KEY)
				}

				let isLoading = this.isLoading;
				const configIsLoading = config.isLoading;
				if (configIsLoading !== undefined) isLoading = configIsLoading;

				if (isLoading)
					this.loadingServer = ElLoading.service({
						lock: true,
						text: config.loadingText ?? "loading",
						background: "rgba(0, 0, 0, 0.7)",
						fullscreen: true
					});

				return config;
			},
			err => {
				throw err;
			}
		);
	}
	private addResponse() {
		this.instance.interceptors.response.use(
			res => {
				this.loadingServer?.close();

				if (res.headers["token"]) {
					const token = res.headers["token"];
					const userStore = UserStore();
					userStore.setToken(token);
				}

				if (res.request.responseType == "blob") {
					const { headers, data } = res;
					const size = Number(headers["content-length"]) / 1000;
					let name = res.headers["content-disposition"] ?? "";
					if (name) {
						const arr = name.split("filename=");
						name = arr.pop() ?? "";
						name = name.replace(/"|'/g, "");
						name = decodeURI(name);
					}

					return {
						responseType: "blob",
						size,
						name,
						data
					};
				}

				return res.data;
			},
			err => {
				// console.log(err, "err");
				this.loadingServer?.close();
				throw err.response;
			}
		);
	}

	request<T = any>(config: MuRequestConfig): Promise<T> {
		return new Promise((resolve, reject) => {
			if (config.interceptors?.requestInterceptor) {
				config = config.interceptors.requestInterceptor(config);
			}
			this.instance.request<any, T>(config).then(
				res => {
					if (config.interceptors?.responseInterceptor) {
						res = config.interceptors.responseInterceptor(res);
					}

					resolve(res);
				},
				err => {
					reject(err);
				}
			);
		});
	}

	get<T = any>(url: string, data: object = {}, config: MuRequestConfig = {}) {
		const dataF = filtersKeys(data);
		return this.request<T>({
			url: url,
			method: "GET",
			params: dataF,
			...config
		});
	}

	post<T = any>(url: string, data: object = {}, config: MuRequestConfig = {}) {
		const dataF = filtersKeys(data);
		return this.request<T>({
			url: url,
			method: "POST",
			data: dataF,
			...config
		});
	}

	download<T = downloadRes>(url: string, type: "GET" | "POST" = "GET", config: MuRequestConfig = {}) {
		return this.request<T>({
			url: url,
			method: type,
			responseType: "blob",
			...config
		});
	}
}

function filtersKeys(data: object) {
	const f = ["create_time", "update_time", "delete_time"];
	if (data instanceof FormData) {
		for (let item of f) {
			data.delete(item);
		}
		return data;
	}

	const data2 = { ...data };
	for (let item of f) {
		delete data2[item];
	}
	return data2;
}

export default MuRequest;
