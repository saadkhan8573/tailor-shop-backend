import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkdetailDto } from './create-workdetail.dto';

export class UpdateWorkdetailDto extends PartialType(CreateWorkdetailDto) {}
