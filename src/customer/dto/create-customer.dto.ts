import { IsNotEmpty, IsOptional } from 'class-validator';
import { Tailor } from 'src/tailor/entities';
import { User } from 'src/user/entities';

export class CreateCustomerDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  dob: Date;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  zip: string;

  @IsNotEmpty()
  tailor: Tailor[];

  @IsOptional()
  user: User;
}
