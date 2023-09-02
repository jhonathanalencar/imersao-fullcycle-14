import type { PointLike } from "@tomtom-international/web-sdk-maps";

declare global {
  type MarkerOptions = {
    element?: HTMLElement;
    anchor?: string;
    offset?: PointLike;
    rotation?: number;
    pitchAlignment?: string;
    rotationAlignment?: string;
    color?: string;
    width?: string;
    height?: string;
    draggable?: boolean;
    clickTolerance?: number;
  };

  type CalculateRouteResponseData = {
    bounds: google.maps.LatLngBounds;
    copyrights: string;
    fare?: google.maps.TransitFare;
    legs: google.maps.DirectionsLeg[];
    overview_path: google.maps.LatLng[];
    overview_polyline: string;
    summary: string;
    warnings: string[];
    waypoint_order: number[];
    routes: {
      summary: {
        lengthInMeters: number;
        travelTimeInSeconds: number;
        departureTime: string;
        arrivalTime: string;
      };
      legs: {
        points: Point[];
      }[];
      sections: {
        startPointIndex: number;
        endPointIndex: number;
        sectionType: string;
        travelMode: string;
      }[];
    }[];
  };
}

type Point = {
  latitude: number;
  longitude: number;
};
