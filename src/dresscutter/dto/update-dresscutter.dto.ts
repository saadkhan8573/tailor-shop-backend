import { PartialType } from '@nestjs/mapped-types';
import { CreateDresscutterDto } from './create-dresscutter.dto';

export class UpdateDresscutterDto extends PartialType(CreateDresscutterDto) {}
