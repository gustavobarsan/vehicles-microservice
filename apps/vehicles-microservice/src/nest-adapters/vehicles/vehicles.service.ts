import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesUseCases } from '../../core/use-cases/vehicles.use-cases';
import { Vehicle } from '../../core/entities/vehicle.entity';


/**
 * Este é o serviço adaptador do NestJS.
 * Ele serve como uma ponte entre o framework e a lógica de negócio agnóstica.
 * Sua única responsabilidade é injetar as dependências e repassar
 * as chamadas para o core da aplicação.
 */
@Injectable()
export class VehiclesService {
  constructor(private readonly useCases: VehiclesUseCases) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.useCases.create(createVehicleDto);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.useCases.findAll();
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.useCases.findOne(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    return this.useCases.update(id, updateVehicleDto);
  }

  async remove(id: string): Promise<void> {
    return this.useCases.remove(id);
  }
}