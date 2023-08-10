import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  NotEquals,
} from 'class-validator';
import { UserRole } from 'src/constants';
import { Employee } from 'src/employees/entities';
import { Tailor } from 'src/tailor/entities';
import { UserStatus } from '../enum';

export class CreateUserDto {
  @IsOptional()
  avatar: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @NotEquals(UserRole[UserRole.Tailor])
  @IsOptional()
  role: UserRole;

  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;

  @IsOptional()
  tailor: Tailor;

  @IsOptional()
  employee: Employee;
}
