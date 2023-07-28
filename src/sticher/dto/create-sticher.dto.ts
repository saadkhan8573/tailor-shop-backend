import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Customer } from 'src/customer/entities/customer.entity';
import { Tailor } from 'src/tailor/entities';
import { User } from 'src/user/entities';
import { WorkingDetailWithTailor } from '../entities/workDetail.entity';

export class CreateSticherDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zip: string;

  @IsNotEmpty()
  @IsString()
  dob: Date;

  @IsNotEmpty()
  skills: string[];

  @IsOptional()
  workingDetailWithTailor: WorkingDetailWithTailor[];

  @IsOptional()
  customer: Customer[];

  @IsOptional()
  tailor: Tailor[];

  @IsOptional()
  user: User;
}
