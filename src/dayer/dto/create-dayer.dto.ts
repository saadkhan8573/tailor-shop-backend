import { IsNotEmpty, IsOptional } from 'class-validator';
import { Customer } from 'src/customer/entities/customer.entity';
import { Dress } from 'src/dress/entities/dress.entity';
import { Tailor } from 'src/tailor/entities';
import { User } from 'src/user/entities';

export class CreateDayerDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  zip: string;

  @IsOptional()
  dressPickedFrom: User[];

  @IsOptional()
  user: User;

  @IsOptional()
  tailor: Tailor[];

  @IsOptional()
  customer: Customer[];

  @IsOptional()
  dress: Dress[];
}
