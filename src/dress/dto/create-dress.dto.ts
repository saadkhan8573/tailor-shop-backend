import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Customer } from 'src/customer/entities/customer.entity';
import { Tailor } from 'src/tailor/entities';
import { DressEnum, DyeStatusEnum, PriorityEnum, StatusEnum } from '../enum';

export class CreateDressDto {
  @IsEnum(DressEnum)
  @IsOptional()
  dresstype: DressEnum;

  @IsEnum(PriorityEnum)
  @IsOptional()
  priority: PriorityEnum;

  @IsEnum(StatusEnum)
  @IsOptional()
  status: StatusEnum;

  @IsEnum(DyeStatusEnum, { message: 'Provide a valid Dye Status' })
  @IsOptional()
  dyeStatus: DyeStatusEnum;

  @IsOptional()
  isDye: boolean;

  @IsOptional()
  isEmbroidery: boolean;

  @IsNotEmpty()
  tailor: Tailor;

  @IsNotEmpty()
  customer: Customer;
}
