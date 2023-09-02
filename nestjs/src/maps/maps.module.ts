import { Module } from '@nestjs/common';

import { PlacesController } from './places/places.controller';
import { PlacesService } from './places/places.service';
import { DirectionsController } from './directions/directions.controller';
import { DirectionsService } from './directions/directions.service';
import { TomTomMapsClient } from 'src/utils/tomtom-maps';

@Module({
  controllers: [PlacesController, DirectionsController],
  providers: [
    PlacesService,
    {
      provide: TomTomMapsClient,
      useValue: new TomTomMapsClient(),
    },
    DirectionsService,
  ],
  exports: [DirectionsService],
})
export class MapsModule {}
