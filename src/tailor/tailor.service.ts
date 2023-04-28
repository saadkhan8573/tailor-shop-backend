import { Injectable } from '@nestjs/common';
import { CreateTailorDto } from './dto/create-tailor.dto';
import { UpdateTailorDto } from './dto/update-tailor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tailor } from './entities';
import { Repository, In } from 'typeorm';

@Injectable()
export class TailorService {
  constructor(
    @InjectRepository(Tailor)
    private readonly tailorRepository: Repository<Tailor>,
  ) {}
  create(createTailorDto: CreateTailorDto) {
    return this.tailorRepository.save(createTailorDto);
  }

  findAll() {
    return this.tailorRepository.find({
      relations: ['user'],
    });
  }

  findAndSelectIds() {
    return this.tailorRepository.find({ select: { id: true } });
  }

  findOwnerByIds(ids: string) {
    const tailorIds = ids.split(',');
    return this.tailorRepository.find({ where: { id: In(tailorIds) } });
  }

  findOne(id: number) {
    return this.tailorRepository.findOne({ where: { id } });
  }

  update(id: number, updateTailorDto: UpdateTailorDto) {
    return `This action updates a #${id} tailor`;
  }

  remove(id: number) {
    return this.tailorRepository.delete(id);
  }

  async removeAllOwner() {
    const ids = await this.findAndSelectIds();
    return await this.tailorRepository.remove(ids);
  }
}
