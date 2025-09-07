import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { VehiclesRepository } from '../../core/repositories/vehicles.repository';
import { PrismaVehiclesRepository } from '../../infra/database/prisma/repositories/prisma.vehicles.repository';
import { VehiclesUseCases } from '../../core/use-cases/vehicles.use-cases';

@Module({
  controllers: [VehiclesController],
  providers: [
    {
      provide: VehiclesRepository,
      useClass: PrismaVehiclesRepository,
    },
    {
      provide: VehiclesUseCases,
      useFactory: (repository: VehiclesRepository) => new VehiclesUseCases(repository),
      inject: [VehiclesRepository],
    },
    VehiclesService,
    PrismaService,
  ],
})
export class VehiclesModule {}