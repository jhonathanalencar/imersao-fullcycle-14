import "node_modules/@tomtom-international/web-sdk-maps/dist/maps.css";

import { sample, shuffle } from "lodash";
import tt from "@tomtom-international/web-sdk-maps";
import { calculateRoute } from "@tomtom-international/web-sdk-services/esm";
import { CalculateRouteResponse } from "@tomtom-international/web-sdk-services";

export class Map {
  public map: tt.Map;
  private routes: { [routeId: string]: Route } = {};

  constructor(element: HTMLElement, options: Omit<tt.MapOptions, "container">) {
    this.map = tt.map({
      ...options,
      container: element,
      style: {
        map: "basic_night",
        poi: "poi_main",
        trafficIncidents: "incidents_dark",
        trafficFlow: "flow_relative0-dark",
      },
    });

    this.map.addControl(new tt.FullscreenControl());
    this.map.addControl(new tt.NavigationControl());
  }

  async addRoute(routeOptions: {
    routeId: string;
    startMarkerOptions: MarkerOptions & {
      position: tt.LngLat;
    };
    endMarkerOptions: MarkerOptions & {
      position: tt.LngLat;
    };
    carMarkerOptions: MarkerOptions & {
      position: tt.LngLat;
    };
    directionsResponseData?: DirectionsResponseData & { request: any };
  }) {
    if (routeOptions.routeId in this.routes) {
      throw new RouteExistsError();
    }

    const { startMarkerOptions, endMarkerOptions, carMarkerOptions } =
      routeOptions;

    const route = new Route({
      startMarkerOptions: {
        ...startMarkerOptions,
      },
      endMarkerOptions: {
        ...endMarkerOptions,
      },
      carMarkerOptions: {
        ...carMarkerOptions,
      },
    });

    this.routes[routeOptions.routeId] = route;

    const locations =
      route.startMarker.getLngLat().toArray().toString() +
      ":" +
      route.endMarker.getLngLat().toArray().toString();

    this.drawRouteLine(locations, routeOptions.routeId);

    route.startMarker.addTo(this.map);
    route.endMarker.addTo(this.map);
    route.carMarker.addTo(this.map);

    this.fitBounds();
  }

  async addRouteWithIcons(routeOptions: {
    routeId: string;
    startMarkerOptions: Omit<MarkerOptions, "element"> & {
      position: tt.LngLat;
    };
    endMarkerOptions: Omit<MarkerOptions, "element"> & {
      position: tt.LngLat;
    };
    carMarkerOptions: Omit<MarkerOptions, "element"> & {
      position: tt.LngLat;
    };
    directionsResponseData?: DirectionsResponseData & { request: any };
  }) {
    const color = sample(shuffle(colors)) as string;
    return this.addRoute({
      ...routeOptions,
      startMarkerOptions: {
        ...routeOptions.startMarkerOptions,
        element: makeMarkerIcon(color),
      },
      endMarkerOptions: {
        ...routeOptions.endMarkerOptions,
        element: makeMarkerIcon(color),
      },
      carMarkerOptions: {
        ...routeOptions.carMarkerOptions,
        element: makeCarIcon(color),
      },
      directionsResponseData: routeOptions.directionsResponseData,
    });
  }

  private fitBounds() {
    const bounds = new tt.LngLatBounds();

    Object.keys(this.routes).forEach((id: string) => {
      const route = this.routes[id];
      bounds.extend(route.startMarker.getLngLat());
      bounds.extend(route.endMarker.getLngLat());
    });

    this.map.fitBounds(bounds);
  }

  moveCar(routeId: string, position: tt.LngLat) {
    this.routes[routeId].carMarker.setLngLat(position);
  }

  removeRoute(id: string) {
    if (!this.hasRoute(id)) {
      return;
    }
    const route = this.routes[id];
    route.delete();
    delete this.routes[id];
  }

  removeAllRoutes() {
    Object.keys(this.routes).forEach((id) => {
      this.map.removeLayer(`route-${id}`);
      this.removeRoute(id);
    });
  }

  hasRoute(id: string) {
    return id in this.routes;
  }

  getRoute(id: string) {
    return this.routes[id];
  }

  drawRouteLine(locations: string, routeId: string) {
    calculateRoute({
      key: process.env.NEXT_PUBLIC_TOMTOM_MAPS_API_KEY!,
      locations: locations,
    }).then((response: CalculateRouteResponse) => {
      var geojson = response.toGeoJson();

      this.map.addLayer({
        id: `route-${routeId}`,
        type: "line",
        source: {
          type: "geojson",
          data: geojson,
        },
        paint: {
          "line-color": "#00d7ff",
          "line-width": 4,
        },
      });

      const bounds = new tt.LngLatBounds();

      geojson.features[0].geometry.coordinates.forEach((point) => {
        bounds.extend(tt.LngLat.convert(point as tt.LngLatLike));
      });
      this.map.fitBounds(bounds);
    });
  }
}

export class RouteExistsError extends Error {}

export class Route {
  public startMarker: tt.Marker;
  public endMarker: tt.Marker;
  public carMarker: tt.Marker;

  constructor(options: {
    startMarkerOptions: MarkerOptions & {
      position: tt.LngLat;
    };
    endMarkerOptions: MarkerOptions & {
      position: tt.LngLat;
    };
    carMarkerOptions: MarkerOptions & {
      position: tt.LngLat;
    };
  }) {
    const { startMarkerOptions, endMarkerOptions, carMarkerOptions } = options;
    this.startMarker = new tt.Marker(startMarkerOptions).setLngLat(
      startMarkerOptions.position
    );
    this.endMarker = new tt.Marker(endMarkerOptions).setLngLat(
      endMarkerOptions.position
    );
    this.carMarker = new tt.Marker(carMarkerOptions).setLngLat(
      carMarkerOptions.position
    );
  }

  async calculateRoute() {
    const startPosition = this.startMarker.getLngLat().toArray().toString();
    const endPosition = this.endMarker.getLngLat().toArray().toString();

    const calculateRouteResponse = await calculateRoute({
      key: process.env.NEXT_PUBLIC_TOMTOM_MAPS_API_KEY!,
      locations: `${startPosition}:${endPosition}`,
    });

    return {
      calculateRouteResponse,
      startMarker: this.startMarker,
      endMarker: this.endMarker,
    };
  }

  delete() {
    this.startMarker.remove();
    this.endMarker.remove();
    this.carMarker.remove();
  }
}

export const makeCarIcon = (color: string) => {
  const element = document.createElement("div");
  element.id = "car-icon";

  return element;
};

export const makeMarkerIcon = (color: string) => {
  const element = document.createElement("div");
  element.id = "marker-icon";

  return element;
};

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
  "#880e4f",
  "#1a237e",
  "#006064",
  "#1b5e20",
  "#880e4f",
  "#01579b",
  "#263238",
];

function convertDirectionsResponseToDirectionsResult(
  directionsResponse: DirectionsResponseData & { request: any }
): DirectionsResponseData {
  const copy = { ...directionsResponse };

  return {
    status: copy.status,
    request: copy.request,
    //@ts-expect-error
    routes: copy.routes.map((route) => {
      const bounds = new tt.LngLatBounds(
        [
          route.legs[0].points[route.sections[0].startPointIndex].latitude,
          route.legs[0].points[route.sections[0].startPointIndex].longitude,
        ],
        [
          route.legs[0].points[route.sections[0].endPointIndex].latitude,
          route.legs[0].points[route.sections[0].endPointIndex].longitude,
        ]
      );

      return {
        bounds,
        summary: route.summary,
        legs: route.legs.map((leg) => ({
          ...leg,
          start_location: new tt.LngLat(
            leg.points[0].latitude,
            leg.points[0].longitude
          ),
          end_location: new tt.LngLat(
            leg.points[0].latitude,
            leg.points[0].longitude
          ),
          steps: leg.points.map((step) => ({
            path: step,
            start_location: new tt.LngLat(step.latitude, step.longitude),
          })),
        })),
      };
    }),
  };
}
