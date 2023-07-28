import { Injectable } from '@nestjs/common';
import { CreateDresscutterDto } from './dto/create-dresscutter.dto';
import { UpdateDresscutterDto } from './dto/update-dresscutter.dto';

@Injectable()
export class DresscutterService {
  create(createDresscutterDto: CreateDresscutterDto) {
    return 'This action adds a new dresscutter';
  }

  findAll() {
    return `This action returns all dresscutter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dresscutter`;
  }

  update(id: number, updateDresscutterDto: UpdateDresscutterDto) {
    return `This action updates a #${id} dresscutter`;
  }

  remove(id: number) {
    return `This action removes a #${id} dresscutter`;
  }
}
