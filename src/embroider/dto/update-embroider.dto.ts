import { PartialType } from '@nestjs/mapped-types';
import { CreateEmbroiderDto } from './create-embroider.dto';

export class UpdateEmbroiderDto extends PartialType(CreateEmbroiderDto) {}
