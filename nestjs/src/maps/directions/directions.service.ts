import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  TomTomMapsClient,
  DirectionsRequest,
  TravelMode,
} from '../../utils/tomtom-maps';
import { GetDirectionsDto } from './dto/get-directions.dto';

@Injectable()
export class DirectionsService {
  constructor(
    private tomtomMapsClient: TomTomMapsClient,
    private configService: ConfigService,
  ) {}

  async getDirections(
    placeOriginWaypoint: string,
    placeDestinationWaypoint: string,
    getDirectionsDto: GetDirectionsDto,
  ) {
    const { placeDestination, placeSource } = getDirectionsDto;

    const requestParams: DirectionsRequest['params'] = {
      locations: `${placeOriginWaypoint}:${placeDestinationWaypoint}`,
      mode: TravelMode.car,
      key: this.configService.get<string>('TOMTOM_MAPS_API_KEY'),
    };

    const { data } = await this.tomtomMapsClient.directions({
      params: requestParams,
    });

    return {
      ...data,
      request: {
        origin: {
          place_id: placeSource.id,
          location: {
            lat: placeSource.position.lat,
            lng: placeSource.position.lon,
          },
          start_address: placeSource.address.freeformAddress,
          placeSource,
        },
        destination: {
          place_id: placeDestination.id,
          location: {
            lat: placeDestination.position.lat,
            lng: placeDestination.position.lon,
          },
          end_address: placeDestination.address.freeformAddress,
          placeDestination,
        },
        mode: requestParams.mode,
      },
    };
  }
}
