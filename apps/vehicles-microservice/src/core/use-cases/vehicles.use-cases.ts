import { Vehicle } from '../entities/vehicle.entity';
import { VehiclesRepository } from '../repositories/vehicles.repository';

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnexpectedError,
} from '../errors';

export class VehiclesUseCases {
  constructor(private readonly repository: VehiclesRepository) {}

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    if (!data.plate) {
      throw new BadRequestError('A placa do veículo é obrigatória.');
    }

    const allVehicles = await this.repository.findAll();
    const existingVehicle = allVehicles.find((v) => v.plate === data.plate);
    if (existingVehicle) {
      throw new ConflictError(
        `Já existe um veículo com a placa "${data.plate}".`,
      );
    }

    try {
      return await this.repository.create(data as Omit<Vehicle, 'id'>);
    } catch (error) {
      throw new UnexpectedError('Ocorreu um erro ao criar o veículo.');
    }
  }

  async findAll(): Promise<Vehicle[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new UnexpectedError('Ocorreu um erro ao buscar os veículos.');
    }
  }

  async findOne(id: string): Promise<Vehicle> {
    if (!id) {
      throw new BadRequestError('O ID do veículo é obrigatório.');
    }

    const vehicle = await this.repository.findOne(id);

    if (!vehicle) {
      throw new NotFoundError(`Veículo com ID "${id}" não encontrado.`);
    }
    return vehicle;
  }

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicleToUpdate = await this.findOne(id);

    if (data.plate && data.plate !== vehicleToUpdate.plate) {
      const allVehicles = await this.repository.findAll();
      const existingVehicle = allVehicles.find((v) => v.plate === data.plate);
      if (existingVehicle && existingVehicle.id !== id) {
        throw new ConflictError(
          `A placa "${data.plate}" já está em uso por outro veículo.`,
        );
      }
    }

    return this.repository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    return this.repository.remove(id);
  }
}
