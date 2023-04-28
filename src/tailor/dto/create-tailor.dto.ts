import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Customer } from 'src/customer/entities/customer.entity';
import { Dress } from 'src/dress/entities/dress.entity';
import { Employee } from 'src/employees/entities';
import { User } from 'src/user/entities';

export class CreateTailorDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  dob: Date;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsOptional()
  user: User;

  @IsOptional()
  employee: Employee;

  @IsOptional()
  customer: Customer[];

  @IsOptional()
  dress: Dress;
}
