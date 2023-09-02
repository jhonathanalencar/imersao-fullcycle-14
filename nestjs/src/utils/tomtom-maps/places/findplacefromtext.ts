import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { Language, ResponseData, Place, RequestParams } from '../common';
import { defaultAxiosInstance } from '../client';

export interface FindPlaceFromTextRequest extends Partial<AxiosRequestConfig> {
  params: {
    query: string;
    language?: Language;
  } & RequestParams;
}

export interface FindPlaceFromTextResponseData extends ResponseData {
  summary: {
    query: string;
    totalResults: number;
  };
  results: Place[];
}

export interface FindPlaceFromTextResponse extends AxiosResponse {
  data: FindPlaceFromTextResponseData;
}

export const defaultUrl = 'https://api.tomtom.com/search/2/search';

export function findPlaceFromText(
  {
    params,
    method = 'get',
    url = defaultUrl,
    ...config
  }: FindPlaceFromTextRequest,
  axiosInstance: AxiosInstance = defaultAxiosInstance,
): Promise<FindPlaceFromTextResponse> {
  return axiosInstance({
    params,
    method,
    url: `${url}/${params.query}.json?key=${params.key}`,
    ...config,
  }) as Promise<FindPlaceFromTextResponse>;
}
