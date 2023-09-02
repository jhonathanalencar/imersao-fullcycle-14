export type RequestParams = ApiKeyParams;

export interface ApiKeyParams {
  key: string;
}

export interface ResponseData {
  status: Status;
  error_message: string;
}

export declare enum Status {
  /** indicates the response contains a valid result. */
  OK = 'OK',
  /** indicates that the provided request was invalid. */
  INVALID_REQUEST = 'INVALID_REQUEST',
  /**
   * indicates that too many `waypoints` were provided in the request. For applications using the Directions API as a web service,
   * or the [directions service in the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/directions),
   * the maximum allowed number of `waypoints` is 23, plus the origin and destination.
   */
  MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
  /**
   * indicates the requested route is too long and cannot be processed.
   * This error occurs when more complex directions are returned.
   * Try reducing the number of waypoints, turns, or instructions.
   */
  MAX_ROUTE_LENGTH_EXCEEDED = 'MAX_ROUTE_LENGTH_EXCEEDED',
  /**
   * indicates any of the following:
   *  - The API key is missing or invalid.
   *  - Billing has not been enabled on your account.
   *  - A self-imposed usage cap has been exceeded.
   *  - The provided method of payment is no longer valid (for example, a credit card has expired).
   * See the [Maps FAQ](https://developers.google.com/maps/faq#over-limit-key-error) to learn how to fix this.
   */
  OVER_DAILY_LIMIT = 'OVER_DAILY_LIMIT',
  /** indicates the service has received too many requests from your application within the allowed time period. */
  OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
  /** indicates that the service denied use of the Distance Matrix service by your application. */
  REQUEST_DENIED = 'REQUEST_DENIED',
  /** indicates a Distance Matrix request could not be processed due to a server error. The request may succeed if you try again. */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  /** indicates that the request was successful but returned no results. */
  ZERO_RESULTS = 'ZERO_RESULTS',
  /** indicates that the referenced location (place_id) was not found in the Places database. */
  NOT_FOUND = 'NOT_FOUND',
}

export type Place = Partial<PlaceData>;

export interface PlaceData {
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

export declare enum PlaceType {
  geography = 'Geography',
  poi = 'POI',
  street = 'Street',
}

export type Address = {
  municipality: string;
  countrySubdivision: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  streetNumber: string;
  streetName: string;
};

export type LatLngArray = [number, number];

export type LatLngString = string;

export interface LatLngLiteral {
  lat: number;
  lon: number;
}

export interface LatLngLiteralVerbose {
  latitude: number;
  longitude: number;
}
/**
 * A latitude, longitude pair. The API methods accept either:
 *  - a two-item array of [latitude, longitude];
 *  - a comma-separated string;
 *  - an object with 'lat', 'lng' properties; or
 *  - an object with 'latitude', 'longitude' properties.
 */
export type LatLng =
  | LatLngArray
  | LatLngString
  | LatLngLiteral
  | LatLngLiteralVerbose;

/** The bounds parameter defines the latitude/longitude coordinates of the southwest and northeast corners of this bounding box. */
export interface LatLngBounds {
  northeast: LatLngLiteral;
  southwest: LatLngLiteral;
}

export declare enum Language {
  /** Neutral Ground Truth */
  ngt = 'NGT',
  /** Neutral Ground Truth - Latin exonyms */
  ngt_Latn = 'NGT-Latn',
  /** Afrikaans */
  af = 'af-ZA',
  /** Arabic */
  ar = 'ar',
  /** Bulgarian */
  bg = 'bg-BG',
  /** Catalan */
  ca = 'ca-ES',
  /** Czech */
  cs = 'cs-CZ',
  /** Danish */
  da = 'da-DK',
  /** German */
  de = 'de-DE',
  /** Greek */
  el = 'el-GR',
  /** English */
  en_US = 'en-US',
  /** English (Australian) */
  en_Au = 'en-AU',
  /** English (Great Britain) */
  en_GB = 'en-GB',
  /** English (New Zealand) */
  en_NZ = 'en-NZ',
  /** Spanish */
  es = 'es-ES',
  /** Basque */
  eu = 'eu-ES',
  /** Finnish */
  fi = 'fi-FI',
  /** French */
  fr = 'fr-FR',
  /** Galician */
  gl = 'gl-ES',
  /** Croatian */
  hr = 'hr-HR',
  /** Hungarian */
  hu = 'hu-HU',
  /** Indonesian */
  id = 'id-ID',
  /** Italian */
  it = 'it-IT',
  /** Hebrew */
  he = 'he-IL',
  /** Kazakh */
  kk = 'kk-KZ',
  /** Korean */
  ko = 'ko-KR',
  /** Lithuanian */
  lt = 'lt-LT',
  /** Latvian */
  lv = 'lv-LV',
  /** Burmese */
  my = 'ms-MY',
  /** Dutch */
  nl = 'nl-NL',
  /** Norwegian */
  no = 'no-NO',
  /** Polish */
  pl = 'pl-PL',
  /** Portuguese (Brazil) */
  pt_BR = 'pt-BR',
  /** Portuguese (Portugal) */
  pt_PT = 'pt-PT',
  /** Romanian */
  ro = 'ro-RO',
  /** Russian */
  ru = 'ru-RU',
  /** Slovak */
  sk = 'sk-SK',
  /** Slovenian */
  sl = 'sl-SI',
  /** Serbian */
  sr = 'sr-RS',
  /** Swedish */
  sv = 'sv-SE',
  /** Thai */
  th = 'th-TH',
  /** Turkish */
  tr = 'tr-TR',
  /** Ukrainian */
  uk = 'uk-UA',
  /** Vietnamese */
  vi = 'vi-VN',
  /** Chinese (Simlified) */
  zh_CN = 'zh-CN',
  /** Chinese (Traditional) */
  zh_TW = 'zh-TW',
}

export enum TravelMode {
  car = 'car',
  pedestrian = 'pedestrian',
  bicycle = 'bicycle',
  truck = 'truck',
  taxi = 'taxi',
  bus = 'bus',
  van = 'van',
  motorcycle = 'motorcycle',
}

export declare enum TravelRestriction {
  /** indicates that the calculated route should avoid toll roads/bridges. */
  tolls = 'tollsRoads',
  /** indicates that the calculated route should avoid routes that require use of a carpool (HOV/ High Occupancy Vehicle) lanes. */
  carpools = 'carpools',
  /** indicates that the calculated route should avoid motorways. */
  motorways = 'motorways',
  /** indicates that the calculated route should avoid ferries. */
  ferries = 'ferries',
  /** indicates that the calculated route should avoid unpaved roads. */
  unpaved = 'unpavedRoads',
  /** indicates that the calculated route should avoid using the same road multiple times. */
  used = 'alreadyUsedRoads',
}

export declare enum DirectionsResponseStatus {
  /** indicates the response contains a valid `result`. */
  OK = 'OK',
  /** indicates at least one of the locations specified in the request's origin, destination, or waypoints could not be geocoded. */
  NOT_FOUND = 'NOT_FOUND',
  /** indicates no route could be found between the origin and destination. */
  ZERO_RESULTS = 'ZERO_RESULTS',
  /**
   * indicates that too many `waypoints` were provided in the request. For applications using the Directions API as a web service,
   * or the [directions service in the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/directions),
   * the maximum allowed number of `waypoints` is 23, plus the origin and destination.
   */
  MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
  /**
   * indicates the requested route is too long and cannot be processed.
   * This error occurs when more complex directions are returned.
   * Try reducing the number of waypoints, turns, or instructions.
   */
  MAX_ROUTE_LENGTH_EXCEEDED = 'MAX_ROUTE_LENGTH_EXCEEDED',
  /** indicates that the provided request was invalid. Common causes of this status include an invalid parameter or parameter value. */
  INVALID_REQUEST = 'INVALID_REQUEST',
  /**
   * indicates any of the following:
   *  - The API key is missing or invalid.
   *  - Billing has not been enabled on your account.
   *  - A self-imposed usage cap has been exceeded.
   *  - The provided method of payment is no longer valid (for example, a credit card has expired).
   * See the [Maps FAQ](https://developers.google.com/maps/faq#over-limit-key-error) to learn how to fix this.
   */
  OVER_DAILY_LIMIT = 'OVER_DAILY_LIMIT',
  /** indicates the service has received too many requests from your application within the allowed time period. */
  OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
  /** indicates that the service denied use of the directions service by your application. */
  REQUEST_DENIED = 'REQUEST_DENIED',
  /** indicates a directions request could not be processed due to a server error. The request may succeed if you try again. */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface CellTower {
  /**
   * Unique identifier of the cell.
   * On GSM, this is the Cell ID (CID);
   * CDMA networks use the Base Station ID (BID).
   * WCDMA networks use the UTRAN/GERAN Cell Identity (UC-Id), which is a 32-bit value concatenating the Radio Network Controller (RNC)
   * and Cell ID. Specifying only the 16-bit Cell ID value in WCDMA networks may return inaccurate results.
   */
  cellId: number;
  /** The Location Area Code (LAC) for GSM and WCDMA networks. The Network ID (NID) for CDMA networks. */
  locationAreaCode: number;
  /** The cell tower's Mobile Country Code (MCC). */
  mobileCountryCode: number;
  /** The cell tower's Mobile Network Code. This is the MNC for GSM and WCDMA; CDMA uses the System ID (SID). */
  mobileNetworkCode: number;
  /** The number of milliseconds since this cell was primary. If age is 0, the `cellId` represents a current measurement. */
  age?: number;
  /** Radio signal strength measured in dBm. */
  signalStrength?: number;
  /** The [timing advance](https://en.wikipedia.org/wiki/Timing_advance) value. */
  timingAdvance?: number;
}
export interface WifiAccessPoint {
  /** The MAC address of the WiFi node. It's typically called a BSS, BSSID or MAC address. Separators must be `:` (colon). */
  macAddress: string;
  /** The current signal strength measured in dBm. */
  signalStrength?: number;
  /** The number of milliseconds since this access point was detected. */
  age?: number;
  /** The channel over which the client is communicating with the acces. */
  channel?: number;
  /** The current signal to noise ratio measured in dB. */
  signalToNoiseRatio?: number;
}
export interface PredictionTerm {
  /** containing the text of the term. */
  value: string;
  /** start position of this term in the description, measured in Unicode characters. */
  offset: number;
}
export interface PredictionSubstring {
  /** location of the entered term. */
  offset: number;
  /** length of the entered term. */
  length: number;
}
export interface StructuredFormatting {
  /** contains the main text of a prediction, usually the name of the place. */
  main_text: string;
  /**
   * contains an array with `offset` value and `length`. These describe the location of
   * the entered term in the prediction result text, so that the term can be highlighted if desired.
   */
  main_text_matched_substrings: PredictionSubstring[];
  /** contains the secondary text of a prediction, usually the location of the place. */
  secondary_text: string;
  /**
   * contains an array with `offset` value and `length`. These describe the location of
   * the entered term in the prediction result secondary text, so that the term can be highlighted if desired.
   */
  secondary_text_matched_substrings: PredictionSubstring[];
}
export interface SnappedPoint {
  /** Contains a `latitude` and `longitude` value. */
  location: LatLngLiteralVerbose;
  /**
   * An integer that indicates the corresponding value in the original request.
   * Each point in the request maps to at most two segmentsin the response:
   *  - If there are no nearby roads, no segment is returned.
   *  - If the nearest road is one-way, one segment is returned.
   *  - If the nearest road is bidirectional, two segments are returned.
   */
  originalIndex: number;
  /**
   * A unique identifier for a place. All place IDs returned by the Roads API correspond to road segments.
   * Place IDs can be used with other Google APIs, including the Places SDK and the Maps JavaScript API.
   * For example, if you need to get road names for the snapped points returned by the Roads API,
   * you can pass the `placeId` to the Places SDK or the Geocoding API. Within the Roads API,
   * you can pass the `placeId` in a speed limits request to determine the speed limit along that road segment.
   */
  placeId: string;
}
