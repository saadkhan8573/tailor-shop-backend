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

export class CreateDressDto {
  @IsNotEmpty()
  dresstype: DressType;

  @IsEnum(PriorityEnum)
  @IsOptional()
  priority: PriorityEnum;

  @IsEnum(DressStatusEnum)
  @IsOptional()
  status: DressStatusEnum;

  @IsEnum(DyeStatusEnum, { message: 'Provide a valid Dye Status' })
  @IsOptional()
  dyeStatus: DyeStatusEnum;

  @IsEnum(EmbroideryStatusEnum, {
    message: 'Provide a valid Embroidery Status',
  })
  @IsOptional()
  embroideryStatus: EmbroideryStatusEnum;

  @IsOptional()
  isDye: boolean;

  @IsOptional()
  isEmbroidery: boolean;

  @IsNotEmpty()
  tailor: Tailor;

  @IsNotEmpty()
  customer: Customer;
}
