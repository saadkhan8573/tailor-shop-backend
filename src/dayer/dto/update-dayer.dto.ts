import { PartialType } from '@nestjs/mapped-types';
import { CreateDayerDto } from './create-dayer.dto';

export class UpdateDayerDto extends PartialType(CreateDayerDto) {}
