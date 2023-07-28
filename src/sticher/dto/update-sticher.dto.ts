import { PartialType } from '@nestjs/mapped-types';
import { CreateSticherDto } from './create-sticher.dto';

export class UpdateSticherDto extends PartialType(CreateSticherDto) {}
