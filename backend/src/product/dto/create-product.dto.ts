import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class PriceDto {
  @IsNumber()
  value: number;

  @IsString()
  symbol: string;

  @IsBoolean()
  isDefault: boolean;
}

class GuaranteeDto {
  @IsString()
  start: string;

  @IsString()
  end: string;
}

export class CreateProductDto {
  @IsNumber()
  serialNumber: number;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  specification?: string;

  @IsObject()
  @IsOptional()
  guarantee?: GuaranteeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceDto)
  price: PriceDto[];

  @IsNumber()
  @IsOptional()
  orderId?: number;
}
