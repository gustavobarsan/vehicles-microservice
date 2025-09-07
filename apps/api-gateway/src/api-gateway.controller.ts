import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { firstValueFrom } from 'rxjs';

@Controller('vehicles')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ApiGatewayController {
  constructor(@Inject('VEHICLES_SERVICE') private client: ClientProxy) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return firstValueFrom(
      this.client.send('create_vehicle', createVehicleDto),
    );
  }

  @Get()
  findAll() {
    return firstValueFrom(this.client.send('find_all_vehicles', {}));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(this.client.send('find_one_vehicle', id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return firstValueFrom(
      this.client.send('update_vehicle', { id, updateVehicleDto }),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return firstValueFrom(this.client.send('remove_vehicle', id));
  }
}