import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  Language,
  RequestParams,
  ResponseData,
  TravelMode,
  TravelRestriction,
} from './common';
import { defaultAxiosInstance } from './client';

export interface DirectionsRequest extends Partial<AxiosRequestConfig> {
  params: {
    locations: string;
    mode?: TravelMode;
    avoid?: TravelRestriction[];
    language?: Language;
    arriveAt?: string;
    departAt?: string;
  } & RequestParams;
}

export interface DirectionsResponseData extends ResponseData {
  routes: {
    summary: {
      lengthInMeters: number;
      travelTimeInSeconds: number;
      trafficDelayInSeconds: number;
      trafficLengthInMeters: number;
      departureTime: string;
      arrivalTime: string;
    };
    legs: {
      points: {
        latitude: number;
        longitude: number;
      }[];
    }[];
    sections: {
      startPointIndex: number;
      endPointIndex: number;
      sectionType: string;
      travelMode: TravelMode;
    }[];
  }[];
}

export interface DirectionsResponse extends AxiosResponse {
  data: DirectionsResponseData;
}

export const defaultUrl = 'https://api.tomtom.com/routing/1/calculateRoute';

export function directions(
  { params, method = 'get', url = defaultUrl, ...config }: DirectionsRequest,
  axiosInstance: AxiosInstance = defaultAxiosInstance,
): Promise<DirectionsResponse> {
  return axiosInstance({
    // params,
    method,
    url: `${url}/${params.locations}/json?key=${params.key}`,
    ...config,
  }) as Promise<DirectionsResponse>;
}
