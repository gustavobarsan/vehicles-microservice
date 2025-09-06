import { Vehicle } from '../entities/vehicle.entity';

export abstract class VehiclesRepository {
  abstract create(createVehicleDto: Partial<Vehicle>): Promise<Vehicle>;
  abstract findAll(): Promise<Vehicle[]>;
  abstract findOne(id: string): Promise<Vehicle | null>;
  abstract update(id: string, updateVehicleDto: Partial<Vehicle>): Promise<Vehicle>;
  abstract remove(id: string): Promise<void>;
}