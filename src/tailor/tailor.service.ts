import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateTailorDto } from './dto/create-tailor.dto';
import { UpdateTailorDto } from './dto/update-tailor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tailor } from './entities';
import { Repository, In } from 'typeorm';
import { Sticher } from 'src/sticher/entities/sticher.entity';

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

  async findOne(id: number) {
    const tailor = await this.tailorRepository.findOne({
      where: { id },
      relationLoadStrategy: 'query',
      relations: [
        'user',
        'sticher',
        'dress',
        'workingDetailWithTailor.dress',
        'workingDetailWithTailor.sticher.user',
      ],
    });

    if (tailor) {
      return tailor;
    } else {
      throw new HttpException('No Tailor were found', 400);
    }
  }

  async updateTailorSticher(id: number, sticher: Sticher) {
    const tailor = await this.tailorRepository.findOne({
      where: { user: { id } },
      relations: ['sticher'],
    });
    tailor.sticher.push(sticher);
    // tailor.sticher =
    //   tailor.sticher?.length > 0 ? [...tailor.sticher, sticher] : [sticher];

    return this.tailorRepository.save(tailor);
  }

  async removeSticherFromTailor(sticherId: number, tailerUserId: number) {
    const tailor = await this.tailorRepository.findOne({
      where: { user: { id: tailerUserId } },
      relations: ['sticher'],
    });

    if (!tailor) {
      throw new BadRequestException('Tailor Not Found');
    }
    tailor.sticher = tailor.sticher.filter(
      (sticher) => sticher.id !== sticherId,
    );

    return this.tailorRepository.save(tailor);
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
