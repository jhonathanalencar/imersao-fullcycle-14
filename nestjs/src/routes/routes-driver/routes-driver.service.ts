import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

import { PrismaService } from '../../prisma/prisma/prisma.service';
import { DirectionsResponseData } from 'src/utils/tomtom-maps/directions';

@Injectable()
export class RoutesDriverService {
  constructor(
    private prismaService: PrismaService,
    @InjectQueue('kafka-producer') private kafkaProducerQueue: Queue,
    @InjectMetric('route_started_counter')
    private routeStartedCounter: Counter,
    @InjectMetric('route_finished_counter')
    private routeFinishedCounter: Counter,
  ) {}

  async createOrUpdate(dto: { route_id: string; lat: number; lng: number }) {
    const countRouteDriver = await this.prismaService.routeDriver.count({
      where: {
        route_id: dto.route_id,
      },
    });

    const routeDriver = await this.prismaService.routeDriver.upsert({
      include: {
        route: true,
      },
      where: {
        route_id: dto.route_id,
      },
      create: {
        route_id: dto.route_id,
        points: {
          set: {
            location: {
              lat: dto.lat,
              lng: dto.lng,
            },
          },
        },
      },
      update: {
        points: {
          push: {
            location: {
              lat: dto.lat,
              lng: dto.lng,
            },
          },
        },
      },
    });

    if (countRouteDriver === 0) {
      this.routeStartedCounter.inc();

      await this.kafkaProducerQueue.add({
        event: 'RouteStarted',
        id: routeDriver.route_id,
        name: routeDriver.route.name,
        started_at: new Date().toISOString(),
        lat: dto.lat,
        lng: dto.lng,
      });

      return routeDriver;
    }

    const directions: DirectionsResponseData = JSON.parse(
      routeDriver.route.directions as string,
    );

    const lastPoint =
      directions.routes[0].legs[0].points[
        directions.routes[0].legs[0].points.length - 1
      ];

    if (lastPoint.latitude === dto.lat && lastPoint.longitude === dto.lng) {
      this.routeFinishedCounter.inc();

      await this.kafkaProducerQueue.add({
        event: 'RouteFinished',
        id: routeDriver.route_id,
        name: routeDriver.route.name,
        finished_at: new Date().toISOString(),
        lat: dto.lat,
        lng: dto.lng,
      });

      return routeDriver;
    }

    await this.kafkaProducerQueue.add({
      event: 'DriverMoved',
      id: routeDriver.route_id,
      name: routeDriver.route.name,
      started_at: new Date().toISOString(),
      lat: dto.lat,
      lng: dto.lng,
    });

    return routeDriver;
  }
}
