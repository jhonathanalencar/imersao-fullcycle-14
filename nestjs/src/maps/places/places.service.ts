import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TomTomMapsClient } from 'src/utils/tomtom-maps';

@Injectable()
export class PlacesService {
  constructor(
    private tomtomMapsClient: TomTomMapsClient,
    private configService: ConfigService,
  ) {}

  async findPlace(text: string) {
    const { data, statusText } = await this.tomtomMapsClient.findPlaceFromText({
      params: {
        query: text,
        key: this.configService.get<string>('TOMTOM_MAPS_API_KEY'),
      },
    });

    return { ...data, status: statusText };
  }
}
