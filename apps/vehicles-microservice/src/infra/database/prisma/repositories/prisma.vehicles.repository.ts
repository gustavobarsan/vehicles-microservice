import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VehiclesRepository } from 'apps/vehicles-microservice/src/core/repositories/vehicles.repository';
import { Vehicle } from 'apps/vehicles-microservice/src/core/entities/vehicle.entity';

@Injectable()
export class PrismaVehiclesRepository implements VehiclesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const createdVehicle = await this.prisma.vehicle.create({ data });
    return createdVehicle as Vehicle;
  }

  async findAll(): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany();
    return vehicles as Vehicle[];
  }

  async findOne(id: string): Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    return vehicle as Vehicle | null;
  }

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const updatedVehicle = await this.prisma.vehicle.update({ where: { id }, data });
      return updatedVehicle as Vehicle;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Vehicle with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.vehicle.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Vehicle with ID "${id}" not found`);
      }
      throw error;
    }
  }
}