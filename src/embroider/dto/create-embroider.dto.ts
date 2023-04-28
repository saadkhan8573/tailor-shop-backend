import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { Tailor } from 'src/tailor/entities';
import { User } from 'src/user/entities';

export class CreateEmbroiderDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsDateString()
  dob: Date;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  zip: string;

  @IsOptional()
  user: User;

  @IsNotEmpty()
  tailor: Tailor;
}
