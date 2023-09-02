"use client";

import { useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import tt from "@tomtom-international/web-sdk-maps";

import { Route } from "../utils/model";
import { socket } from "../utils/socket-io";
import { useMap } from "../hooks/useMap";

import { RouteSelect } from "../components/RouteSelect";

export function DriverPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  async function startRoute() {
    const routeId = (document.getElementById("route") as HTMLSelectElement)
      .value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_API_URL}/routes/${routeId}`
    );
    const route: Route = await response.json();

    map?.removeAllRoutes();

    await map?.addRouteWithIcons({
      routeId,
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

    const { points } = route.directions.routes[0].legs[0];

    for (const step of points) {
      await sleep(200);
      map?.moveCar(routeId, new tt.LngLat(step.longitude, step.latitude));
      socket.emit("new-points", {
        route_id: routeId,
        lat: step.latitude,
        lng: step.longitude,
      });
    }
  }

  return (
    <Grid2 container sx={{ display: "flex", flex: 1 }}>
      <Grid2 xs={4} px={2}>
        <Typography variant="h4">Minha viagem</Typography>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <RouteSelect id="route" />
          <Button variant="contained" onClick={startRoute} fullWidth>
            Iniciar a viagem
          </Button>
        </div>
      </Grid2>
      <Grid2 id="map" ref={mapContainerRef} xs={8} />
    </Grid2>
  );
}

export default DriverPage;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
