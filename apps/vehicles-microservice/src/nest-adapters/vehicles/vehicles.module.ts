import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { VehiclesRepository } from '../../core/repositories/vehicles.repository';
import { PrismaVehiclesRepository } from '../../infra/database/prisma/repositories/prisma.vehicles.repository';


@Module({
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    PrismaService,
    {
      provide: VehiclesRepository,
      useClass: PrismaVehiclesRepository,
    },
  ],
})
export class VehiclesModule {}