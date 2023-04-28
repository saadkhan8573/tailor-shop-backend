import {
  IsDate,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Tailor } from 'src/tailor/entities';
import { User } from 'src/user/entities';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsDateString()
  dob: Date;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  zip: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  tailor: Tailor;
}
