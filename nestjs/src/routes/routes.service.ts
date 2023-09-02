import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
// import { Inject } from '@nestjs/common';
// import { ClientKafka } from '@nestjs/microservices';

import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { DirectionsService } from '../maps/directions/directions.service';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService,
    private directionsService: DirectionsService,
    // @Inject('KAFKA_SERVICE')
    // private kafkaService: ClientKafka,
    @InjectQueue('kafka-producer') private kafkaProducerQueue: Queue,
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    const { routes, request } = await this.directionsService.getDirections(
      createRouteDto.source_waypoint,
      createRouteDto.destination_waypoint,
      createRouteDto.getDirectionsDto,
    );

    const routeCreated = await this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        source: {
          name: request.origin.start_address,
          location: {
            lat: request.origin.location.lat,
            lng: request.origin.location.lng,
          },
        },
        destination: {
          name: request.destination.end_address,
          location: {
            lat: request.destination.location.lat,
            lng: request.destination.location.lng,
          },
        },
        distance: routes[0].summary.lengthInMeters,
        duration: routes[0].summary.travelTimeInSeconds,
        directions: JSON.stringify({
          routes,
          request,
        }),
      },
    });

    // await this.kafkaService.emit('route', {
    //   event: 'RouteCreated',
    //   id: routeCreated.id,
    //   name: routeCreated.name,
    //   distance: routeCreated.distance,
    // });
    await this.kafkaProducerQueue.add({
      event: 'RouteCreated',
      id: routeCreated.id,
      name: routeCreated.name,
      distance: routeCreated.distance,
    });
    return routeCreated;
  }

  findAll() {
    return this.prismaService.route.findMany();
  }

  findOne(id: string) {
    return this.prismaService.route.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route with ${updateRouteDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
