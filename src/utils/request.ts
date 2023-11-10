import { Toast } from "@douyinfe/semi-ui";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const request = axios.create({
  baseURL: process.env.DEV ? "http://localhost:10001/v1" : "https://icms.jdscript.dev/v1",
  responseType: "json",
  responseEncoding: "utf-8",
  timeout: 100000,
  toastError: true,
});

const authHeader = async (config: InternalAxiosRequestConfig) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers.setAuthorization(`Bearer ${JSON.parse(token)}`);
  }
  return config;
};

const extractData = async (resp: AxiosResponse) => {
  return resp.data;
};

const formatError = async (err: AxiosError) => {
  const { response } = err;

  if (
    response &&
    response.data &&
    typeof response.data === "object" &&
    "message" in response.data &&
    typeof response.data.message === "string"
  ) {
    err.message = response.data.message;
  }

  if (err.config?.toastError) {
    Toast.error(err.message);
  }

  throw err;
};

request.interceptors.request.use(authHeader);
request.interceptors.response.use(extractData, formatError);

export default request;
