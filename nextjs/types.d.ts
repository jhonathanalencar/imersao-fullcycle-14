interface ResponseData {
  status: Status;
  error_message: string;
}

declare enum Status {
  OK = "OK",
  INVALID_REQUEST = "INVALID_REQUEST",
  MAX_WAYPOINTS_EXCEEDED = "MAX_WAYPOINTS_EXCEEDED",
  MAX_ROUTE_LENGTH_EXCEEDED = "MAX_ROUTE_LENGTH_EXCEEDED",
  OVER_DAILY_LIMIT = "OVER_DAILY_LIMIT",
  OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
  REQUEST_DENIED = "REQUEST_DENIED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  ZERO_RESULTS = "ZERO_RESULTS",
  NOT_FOUND = "NOT_FOUND",
}

interface FindPlaceFromTextResponseData extends ResponseData {
  summary: {
    query: string;
    totalResults: number;
  };
  results: Place[];
  status: string;
}

type Place = Partial<PlaceData>;

interface PlaceData {
  type: PlaceType;
  id: string;
  score: number;
  address: Address;
  position: LatLngLiteral;
  viewport: {
    topLeftPoint: LatLngLiteral;
    btmRightPoint: LatLngLiteral;
  };
  entityType: string;
  poi: {
    name: string;
    categorySet: {
      id: number;
    }[];
    categories: string[];
  };
  boundingBox: {
    topLeftPoint: LatLngLiteral;
    btmRightPoint: LatLngLiteral;
  };
  dataSources: {
    geometry: {
      id: string;
    };
  };
}

declare enum PlaceType {
  geography = "Geography",
  poi = "POI",
  street = "Street",
}

type Address = {
  municipality: string;
  countrySubdivision: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  streetNumber: string;
  streetName: string;
};

interface LatLngLiteral {
  lat: number;
  lon: number;
}

interface DirectionsResponseData extends ResponseData {
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
