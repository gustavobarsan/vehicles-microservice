import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC1D23', description: 'Placa do veículo' })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({
    example: '9BWZZZ3T7KK456789',
    description: 'Número do chassi do veículo',
  })
  @IsString()
  @IsNotEmpty()
  chassis: string;

  @ApiProperty({ example: '12345678901', description: 'Número do RENAVAM' })
  @IsString()
  @IsNotEmpty()
  renavam: string;

  @ApiProperty({ example: 'Mustang', description: 'Modelo do veículo' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 'Ford', description: 'Marca do veículo' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    example: 2023,
    description: 'Ano de fabricação do veículo',
  })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 'Preto', description: 'Cor do veículo' })
  @IsString()
  @IsNotEmpty()
  color: string;
}

