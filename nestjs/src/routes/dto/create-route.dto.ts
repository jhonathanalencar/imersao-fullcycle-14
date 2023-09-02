import { GetDirectionsDto } from 'src/maps/directions/dto/get-directions.dto';

export class CreateRouteDto {
  name: string;
  source_waypoint: string;
  destination_waypoint: string;
  getDirectionsDto: GetDirectionsDto;
}
