import { Body, Controller, Post, Query } from '@nestjs/common';

import { DirectionsService } from './directions.service';
import { GetDirectionsDto } from './dto/get-directions.dto';

@Controller('directions')
export class DirectionsController {
  constructor(private directionsService: DirectionsService) {}

  @Post()
  getDirections(
    @Query('originWaypoint') originWaypoint: string,
    @Query('destinationWaypoint') destinationWaypoint: string,
    @Body() getDirectionsDto: GetDirectionsDto,
  ) {
    return this.directionsService.getDirections(
      originWaypoint,
      destinationWaypoint,
      getDirectionsDto,
    );
  }
}
