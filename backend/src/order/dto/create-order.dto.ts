import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsString()
  serialNumber: string;

  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  specification?: string;

  @IsOptional()
  isNew?: boolean;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsOptional()
  guarantee?: {
    start: string;
    end: string;
  };

  @IsArray()
  price: Array<{
    value: number;
    symbol: string;
    isDefault: boolean;
  }>;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  @IsOptional()
  products?: ProductDto[];
}
