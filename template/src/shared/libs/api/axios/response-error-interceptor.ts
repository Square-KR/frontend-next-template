import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { API_PATHS } from "src/shared/constants/api-paths";
import { SquareAxios } from "./index";

let isRefreshing = false;
let refreshSubscribers: Array<(ok: boolean) => void> = [];

const onRefreshed = (ok: boolean) => {
	for (const callback of refreshSubscribers) {
		callback(ok);
	}
	refreshSubscribers = [];
};

const subscribeRefresh = (callback: (ok: boolean) => void) => {
	refreshSubscribers.push(callback);
};

export const responseErrorInterceptor = async (error: AxiosError) => {
	const originalRequest =
		(error.config as AxiosRequestConfig & { _retry?: boolean }) ?? undefined;

	if (axios.isCancel(error)) {
		return Promise.resolve(null);
	}

	if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
		originalRequest._retry = true;

		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				subscribeRefresh((ok) => {
					if (!ok) {
						reject(error);
						return;
					}
					resolve(SquareAxios(originalRequest));
				});
			});
		}

		isRefreshing = true;

		try {
			await SquareAxios.post(API_PATHS.AUTH.REFRESH);

			isRefreshing = false;
			onRefreshed(true);

			return SquareAxios(originalRequest);
		} catch (refreshError) {
			isRefreshing = false;
			onRefreshed(false);

			if (typeof window !== "undefined") {
				window.location.href = "/signin";
			}

			return Promise.reject(refreshError);
		}
	}

	return Promise.reject(error);
};
