import { useEffect, useState } from "react";

import { getCurrentPosition } from "../utils/geolocation";
import { Map } from "../utils/map";

export function useMap(containerRef: React.RefObject<HTMLDivElement>) {
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    (async () => {
      const position = await getCurrentPosition();
      const map = new Map(containerRef.current!, {
        key: process.env.NEXT_PUBLIC_TOMTOM_MAPS_API_KEY as string,
        zoom: 15,
        center: [position.lng, position.lat],
      });

      setMap(map);
    })();
  }, [containerRef]);

  return map;
}
