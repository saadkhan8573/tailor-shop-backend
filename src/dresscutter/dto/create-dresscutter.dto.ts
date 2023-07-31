import { User } from 'src/user/entities';
import { Tailor } from 'src/tailor/entities';
import { Dress } from 'src/dress/entities/dress.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Sticher } from 'src/sticher/entities/sticher.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { DressType } from 'src/dress/entities/dressType.entity';

export class CreateDresscutterDto {
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  zip: string;

  @IsNotEmpty()
  dob: Date;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  skills: DressType[];

  @IsOptional()
  user: User;

  @IsOptional()
  sticher: Sticher[];

  @IsOptional()
  tailor: Tailor[];

  @IsOptional()
  customer: Customer[];

  @IsOptional()
  dress: Dress[];
}
