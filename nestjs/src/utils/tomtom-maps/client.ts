import * as rax from 'retry-axios';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpsAgent } from 'agentkeepalive';

import {
  DirectionsRequest,
  DirectionsResponse,
  directions,
} from './directions';

import {
  FindPlaceFromTextRequest,
  FindPlaceFromTextResponse,
  findPlaceFromText,
} from './places/findplacefromtext';

export const defaultHttpsAgent = new HttpsAgent({ keepAlive: true });
export const defaultTimeout = 10000;

export type Config = {
  raxConfig?: rax.RetryConfig;
} & AxiosRequestConfig;

export interface ClientOptions {
  axiosInstance?: AxiosInstance;
  config?: Config;
}

const defaultConfig: AxiosRequestConfig = {
  timeout: defaultTimeout,
  httpsAgent: defaultHttpsAgent,
};

export const defaultAxiosInstance = axios.create();

rax.attach(defaultAxiosInstance);

export class TomTomMapsClient {
  private axiosInstance: AxiosInstance;

  constructor({ axiosInstance, config }: ClientOptions = {}) {
    if (axiosInstance && config) {
      throw new Error('Provide one of axiosInstance or config.');
    }

    if (axiosInstance) {
      this.axiosInstance = axiosInstance;
      this.axiosInstance.defaults.headers = {
        ...defaultConfig.headers,
        ...this.axiosInstance.defaults.headers,
      };
    } else if (config) {
      config = { ...defaultConfig, ...config };
      config.headers = { ...defaultConfig.headers, ...(config.headers || {}) };
      this.axiosInstance = axios.create(config);
      rax.attach(this.axiosInstance);
    } else {
      this.axiosInstance = defaultAxiosInstance;
    }
  }

  directions(request: DirectionsRequest): Promise<DirectionsResponse> {
    return directions(request, this.axiosInstance);
  }
  findPlaceFromText(
    request: FindPlaceFromTextRequest,
  ): Promise<FindPlaceFromTextResponse> {
    return findPlaceFromText(request, this.axiosInstance);
  }
}

export {
  DirectionsRequest,
  DirectionsResponse,
  FindPlaceFromTextRequest,
  FindPlaceFromTextResponse,
};
