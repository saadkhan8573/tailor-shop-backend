import { Injectable } from '@nestjs/common';
import { CreateEmbroiderDto } from './dto/create-embroider.dto';
import { UpdateEmbroiderDto } from './dto/update-embroider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Embroider } from './entities';

@Injectable()
export class EmbroiderService {
  constructor(
    @InjectRepository(Embroider)
    private readonly embroiderRepository: Repository<Embroider>,
  ) {}
  create(createEmbroiderDto: CreateEmbroiderDto) {
    return this.embroiderRepository.save(createEmbroiderDto);
  }

  findAll() {
    return this.embroiderRepository.find({
      select: {
        id: true,
        phone: true,
        dob: true,
        address: true,
        state: true,
        zip: true,
        user: {
          email: true,
        },
        tailor: {
          id: true,
          user: {
            name: true,
          },
        },
      },
      relations: ['user', 'tailor.user', 'dress'],
    });
  }

  addDress(addDress: CreateEmbroiderDto) {
    return this.embroiderRepository.save(addDress);
  }

  findOne(id: number) {
    return this.embroiderRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  update(id: number, updateEmbroiderDto: UpdateEmbroiderDto) {
    return `This action updates a #${id} embroider`;
  }

  remove(id: number) {
    return `This action removes a #${id} embroider`;
  }
}
