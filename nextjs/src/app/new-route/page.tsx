"use client";

import { FormEvent, useRef, useState } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { useMap } from "../hooks/useMap";
import { formatDistance, formatDuration } from "../utils/formatter";

export function NewRoutePage() {
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);
  const [directionsData, setDirectionsData] = useState<
    (DirectionsResponseData & { request: any }) | null
  >(null);

  async function searchPlaces(event: FormEvent) {
    event.preventDefault();
    setIsError(false);
    const source = (document.getElementById("source") as HTMLInputElement)
      .value;
    const destination = (
      document.getElementById("destination") as HTMLInputElement
    ).value;

    const [sourceResponse, destinationResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_NEXT_API_URL}/places?text=${source}`),
      fetch(
        `${process.env.NEXT_PUBLIC_NEXT_API_URL}/places?text=${destination}`
      ),
    ]);

    const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] =
      await Promise.all([sourceResponse.json(), destinationResponse.json()]);

    if (sourcePlace.status !== "OK") {
      console.error(sourcePlace);
      alert("Não foi possível encontrar a origem");
      return;
    }

    if (destinationPlace.status !== "OK") {
      console.error(destinationPlace);
      alert("Não foi possível encontrar o destino");
      return;
    }

    const placeSourceWaypoint = sourcePlace.results[0].position;
    const placeDestinationWaypoint = destinationPlace.results[0].position;

    const formattedPlaceSourceWaypoint = Object.values(
      placeSourceWaypoint ?? {}
    ).join();
    const formattedPlaceDestinationWaypoint = Object.values(
      placeDestinationWaypoint ?? {}
    ).join();

    const directionsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_API_URL}/directions?originWaypoint=${formattedPlaceSourceWaypoint}&destinationWaypoint=${formattedPlaceDestinationWaypoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeSource: sourcePlace.results[0],
          placeDestination: destinationPlace.results[0],
        }),
      }
    );

    const directionsData: DirectionsResponseData & { request: any } =
      await directionsResponse.json();

    if (!directionsData.routes) {
      setDirectionsData(null);
      setIsError(true);
      return;
    }

    setDirectionsData(directionsData);
    setIsError(false);

    map?.removeAllRoutes();

    await map?.addRouteWithIcons({
      routeId: new Date().getTime().toString(),
      startMarkerOptions: {
        position: directionsData.request.origin.location,
      },
      endMarkerOptions: {
        position: directionsData.request.destination.location,
      },
      carMarkerOptions: {
        position: directionsData.request.origin.location,
      },
    });
  }

  async function createRoute() {
    const startAddress = directionsData!.request.origin.start_address;
    const endAddress = directionsData!.request.destination.end_address;

    const sourceWaypoint = directionsData!.request.origin.location;
    const destinationWaypoint = directionsData!.request.destination.location;

    const formattedSourceWaypoint = Object.values(sourceWaypoint ?? {}).join();
    const formattedDestinationWaypoint = Object.values(
      destinationWaypoint ?? {}
    ).join();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_API_URL}/routes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${startAddress} - ${endAddress}`,
          source_waypoint: formattedSourceWaypoint,
          destination_waypoint: formattedDestinationWaypoint,
          getDirectionsDto: {
            placeSource: directionsData!.request.origin.placeSource,
            placeDestination:
              directionsData!.request.destination.placeDestination,
          },
        }),
      }
    );

    const route = await response.json();

    setOpen(true);
  }

  return (
    <Grid2 container sx={{ display: "flex", flex: 1 }}>
      <Grid2 xs={4} px={2}>
        <Typography variant="h4">Nova rota</Typography>
        <form onSubmit={searchPlaces}>
          <TextField id="source" label="Origem" fullWidth />
          <TextField
            id="destination"
            label="Destino"
            fullWidth
            sx={{ mt: 1 }}
          />

          <Button variant="contained" type="submit" sx={{ mt: 1 }} fullWidth>
            Pesquisar
          </Button>
        </form>

        {isError ? (
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Typography variant="h6">Rota não encontrada</Typography>
            </CardContent>
          </Card>
        ) : null}

        {directionsData && (
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary={"Origem"}
                    secondary={directionsData.request.origin.start_address}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Destino"}
                    secondary={directionsData.request.destination.end_address}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Distância"}
                    secondary={formatDistance(
                      directionsData.routes[0].summary.lengthInMeters
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Duração"}
                    secondary={formatDuration(
                      directionsData.routes[0].summary.travelTimeInSeconds
                    )}
                  />
                </ListItem>
              </List>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button type="button" variant="contained" onClick={createRoute}>
                Adicionar rota
              </Button>
            </CardActions>
          </Card>
        )}
      </Grid2>
      <Grid2 id="map" ref={mapContainerRef} xs={8} />
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="success">
          Rota cadastrada com sucesso
        </Alert>
      </Snackbar>
    </Grid2>
  );
}

export default NewRoutePage;
