import { Vehicle } from '../entities/vehicle.entity';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnexpectedError,
} from '../errors';
import { VehiclesRepository } from '../repositories/vehicles.repository';
import { VehiclesUseCases } from './vehicles.use-cases';

const mockVehiclesRepository: VehiclesRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const sampleVehicle: Vehicle = {
  id: 'some-uuid',
  plate: 'ABC-1234',
  brand: 'Ford',
  model: 'Mustang',
  year: 2023,
  chassis: '12345678901234567',
  renavam: '98765432109876543',
  color: 'black',
};

describe('VehiclesUseCases', () => {
  let useCases: VehiclesUseCases;

  beforeEach(() => {
    jest.clearAllMocks();
    useCases = new VehiclesUseCases(mockVehiclesRepository);
  });

  describe('create', () => {
    it('should create and return a vehicle successfully', async () => {
      const input = {
        plate: 'NEW-5678',
        brand: 'Tesla',
        model: 'Model S',
        chassis: '12345678901234567',
        renavam: '98765432109876543',
        color: 'black',
      };
      (mockVehiclesRepository.findAll as jest.Mock).mockResolvedValue([]);
      (mockVehiclesRepository.create as jest.Mock).mockResolvedValue({
        id: 'new-uuid',
        ...input,
      });

      const result = await useCases.create(input);

      expect(result).toBeDefined();
      expect(result.plate).toBe(input.plate);
      expect(mockVehiclesRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockVehiclesRepository.create).toHaveBeenCalledWith(input);
    });

    it('should throw ConflictError if plate already exists', async () => {
      const input = { plate: sampleVehicle.plate };
      (mockVehiclesRepository.findAll as jest.Mock).mockResolvedValue([
        sampleVehicle,
      ]);

      await expect(useCases.create(input)).rejects.toThrow(ConflictError);
      expect(mockVehiclesRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if plate is not provided', async () => {
      const input = { plate: undefined as any, brand: 'Ford', model: 'Fiesta' }; // Sem placa

      await expect(useCases.create(input)).rejects.toThrow(BadRequestError);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle if found', async () => {
      (mockVehiclesRepository.findOne as jest.Mock).mockResolvedValue(
        sampleVehicle,
      );

      const result = await useCases.findOne(sampleVehicle.id!);

      expect(result).toEqual(sampleVehicle);
      expect(mockVehiclesRepository.findOne).toHaveBeenCalledWith(
        sampleVehicle.id,
      );
    });

    it('should throw NotFoundError if vehicle is not found', async () => {
      (mockVehiclesRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(useCases.findOne('non-existent-id')).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('update', () => {
    it('should update a vehicle successfully', async () => {
      const updateData = { year: 2024 };
      (mockVehiclesRepository.findOne as jest.Mock).mockResolvedValue(
        sampleVehicle,
      );
      (mockVehiclesRepository.update as jest.Mock).mockResolvedValue({
        ...sampleVehicle,
        ...updateData,
      });

      const result = await useCases.update(sampleVehicle.id!, updateData);

      expect(result.year).toBe(2024);
      expect(mockVehiclesRepository.findOne).toHaveBeenCalledWith(
        sampleVehicle.id,
      );
      expect(mockVehiclesRepository.update).toHaveBeenCalledWith(
        sampleVehicle.id,
        updateData,
      );
    });

    it('should throw NotFoundError when trying to update a non-existent vehicle', async () => {
      (mockVehiclesRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        useCases.update('non-existent-id', { year: 2025 }),
      ).rejects.toThrow(NotFoundError);
      expect(mockVehiclesRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a vehicle successfully', async () => {
      (mockVehiclesRepository.findOne as jest.Mock).mockResolvedValue(
        sampleVehicle,
      );
      (mockVehiclesRepository.remove as jest.Mock).mockResolvedValue(undefined);

      await expect(useCases.remove(sampleVehicle.id!)).resolves.toBeUndefined();
      expect(mockVehiclesRepository.findOne).toHaveBeenCalledWith(
        sampleVehicle.id,
      );
      expect(mockVehiclesRepository.remove).toHaveBeenCalledWith(
        sampleVehicle.id,
      );
    });

    it('should throw NotFoundError when trying to remove a non-existent vehicle', async () => {
      (mockVehiclesRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(useCases.remove('non-existent-id')).rejects.toThrow(
        NotFoundError,
      );
      expect(mockVehiclesRepository.remove).not.toHaveBeenCalled();
    });
  });
});
