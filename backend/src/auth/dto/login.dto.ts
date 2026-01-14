import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Session UUID from init-session endpoint',
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}
