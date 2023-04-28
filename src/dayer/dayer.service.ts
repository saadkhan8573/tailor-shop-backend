import { Injectable } from '@nestjs/common';
import { CreateDayerDto } from './dto/create-dayer.dto';
import { UpdateDayerDto } from './dto/update-dayer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dayer } from './entities/dayer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DayerService {
  constructor(
    @InjectRepository(Dayer)
    private readonly dayerRepository: Repository<Dayer>,
  ) {}
  create(createDayerDto: CreateDayerDto) {
    return this.dayerRepository.save(createDayerDto);
  }

  addDress(addDress: CreateDayerDto) {
    return this.dayerRepository.save(addDress);
  }

  findAll() {
    return this.dayerRepository.find({
      relations: ['user', 'dress.tailor.user'],
    });
  }

  findOne(id: number) {
    return this.dayerRepository.findOne({
      where: { id },
      relations: ['dress'],
    });
  }

  update(id: number, updateDayerDto: UpdateDayerDto) {
    return this.dayerRepository.save(updateDayerDto);
  }

  async remove(id: number) {
    return await this.dayerRepository.delete(id);
  }
}
