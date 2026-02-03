import axios from "axios";
import { responseErrorInterceptor } from "./response-error-interceptor";

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

export const SquareAxios = axios.create({
	baseURL: GATEWAY_URL,
	withCredentials: true,
});

SquareAxios.interceptors.response.use((r) => r, responseErrorInterceptor);

export default SquareAxios;
