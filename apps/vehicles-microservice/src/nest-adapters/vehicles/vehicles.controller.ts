import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true }))
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @MessagePattern('create_vehicle')
  create(@Payload() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @MessagePattern('find_all_vehicles')
  findAll() {
    return this.vehiclesService.findAll();
  }

  @MessagePattern('find_one_vehicle')
  findOne(@Payload() id: string) {
    return this.vehiclesService.findOne(id);
  }

  @MessagePattern('update_vehicle')
  update(@Payload() data: { id: string; updateVehicleDto: UpdateVehicleDto }) {
    return this.vehiclesService.update(data.id, data.updateVehicleDto);
  }

  @MessagePattern('remove_vehicle')
  remove(@Payload() id: string) {
    return this.vehiclesService.remove(id);
  }
}