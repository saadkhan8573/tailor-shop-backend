import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Customer } from 'src/customer/entities/customer.entity';
import { Tailor } from 'src/tailor/entities';
import { DressType } from '../entities/dressType.entity';
import {
  DressStatusEnum,
  DyeStatusEnum,
  EmbroideryStatusEnum,
  PriorityEnum,
} from '../enum';

export class CreateDressTypeDto {
  @IsNotEmpty()
  type: string;
}
