"use client";

import { useEffect, useRef } from "react";
import tt from "@tomtom-international/web-sdk-maps";

import { Route } from "../utils/model";
import { socket } from "../utils/socket-io";
import { useMap } from "../hooks/useMap";

export function AdminPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    socket.connect();

    socket.on(
      "admin-new-points",
      async (data: { route_id: string; lat: number; lng: number }) => {
        if (!map?.hasRoute(data.route_id)) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_NEXT_API_URL}/routes/${data.route_id}`
          );
          const route: Route = await response.json();

          map?.removeRoute(data.route_id);

          await map?.addRouteWithIcons({
            routeId: data.route_id,
            startMarkerOptions: {
              position: route.directions.request.origin.location,
            },
            endMarkerOptions: {
              position: route.directions.request.destination.location,
            },
            carMarkerOptions: {
              position: route.directions.request.origin.location,
            },
          });
        }

        map?.moveCar(data.route_id, new tt.LngLat(data.lng, data.lat));
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [map]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <div
        id="map"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
}

export default AdminPage;
