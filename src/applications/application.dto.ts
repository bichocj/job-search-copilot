import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApplicationStatus } from './application.entity';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Neginet' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Senior Software Engineer — Payments Infrastructure' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'https://example.com/careers/123' })
  @IsUrl()
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateApplicationDto {
  @ApiProperty({ required: false, enum: ApplicationStatus })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
