import { Repository, In } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dresscutter } from './entities/dresscutter.entity';
import { CreateDresscutterDto } from './dto/create-dresscutter.dto';
import { UpdateDresscutterDto } from './dto/update-dresscutter.dto';
import { TailorService } from 'src/tailor/tailor.service';
import { Dress } from 'src/dress/entities/dress.entity';
import { DressType } from 'src/dress/entities/dressType.entity';

@Injectable()
export class DresscutterService {
  constructor(
    @InjectRepository(Dresscutter)
    private readonly dressCutterRepository: Repository<Dresscutter>,
    private readonly tailorService: TailorService,
  ) {}
  create(createDresscutterDto: CreateDresscutterDto) {
    return this.dressCutterRepository.save(createDresscutterDto);
  }

  findAll() {
    return this.dressCutterRepository
      .createQueryBuilder('dressCutter')
      .leftJoinAndSelect('dressCutter.user', 'user')
      .leftJoinAndSelect('dressCutter.sticher', 'sticher')
      .leftJoinAndSelect('dressCutter.tailor', 'tailor')
      .leftJoinAndSelect('dressCutter.customer', 'customer')
      .leftJoinAndSelect('dressCutter.dress', 'dress')
      .getMany();
  }

  findOne(id: number) {
    return this.dressCutterRepository
      .createQueryBuilder('dressCutter')
      .where('dressCutter.id = :id', { id })
      .leftJoinAndSelect('dressCutter.user', 'user')
      .leftJoinAndSelect('dressCutter.dress', 'dress')
      .leftJoinAndSelect('dressCutter.skills', 'skills')
      .getOne();
  }

  findByUser(id: number) {
    return this.dressCutterRepository
      .createQueryBuilder('dressCutter')
      .leftJoin('dressCutter.user', 'user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async sendDressForCuttingFromTailor(dressCutter: Dresscutter, dress: Dress) {
    const cutter = await this.dressCutterRepository.create(dressCutter);
    cutter.dress.push(dress);
    return this.dressCutterRepository.save(cutter);
  }

  async updateDressCutterSkills(
    dressCutterUserId: number,
    skills: DressType[],
  ) {
    const dressCutter = await this.dressCutterRepository
      .createQueryBuilder('dressCutter')
      .leftJoin('dressCutter.user', 'user')
      .where('user.id = :dressCutterUserId', { dressCutterUserId })
      .leftJoinAndSelect('dressCutter.skills', 'skills')
      .getOne();

    dressCutter.skills = [...dressCutter.skills, ...skills];

    return this.dressCutterRepository.save(dressCutter);
  }

  async removeMySkills(dressCutterUserId: number, skills: string[]) {
    const dressCutter = await this.dressCutterRepository
      .createQueryBuilder('dressCutter')
      .innerJoin('dressCutter.user', 'user')
      .leftJoinAndSelect('dressCutter.skills', 'skills')
      .where('user.id = :dressCutterUserId', { dressCutterUserId })
      // .andWhere('skills.id In(:...skills)', { skills })
      .getOne();

    if (!dressCutter) {
      throw new BadRequestException('Skills Not Found');
    }

    const updatedSkills = dressCutter.skills.filter(
      (skill) => !skills.includes(String(skill.id)),
    );

    dressCutter.skills = updatedSkills;

    return this.dressCutterRepository.save(dressCutter);
  }

  async findMyDress(dressCutterUserId: number, dress: string[]) {
    const query = await this.dressCutterRepository
      .createQueryBuilder('dressCutter')
      .leftJoinAndSelect('dressCutter.user', 'user')
      .where('user.id = :dressCutterUserId', { dressCutterUserId })
      .leftJoinAndSelect('dressCutter.dress', 'dress');

    if (dress && dress.length > 0) {
      query.andWhere('dress.id IN(:...dress)', { dress });
    }

    return query.getOne();
  }

  async filterDressCutter(sticher, dress, tailor, customer, skills) {
    const filteredDressCutter = await this.dressCutterRepository
      .createQueryBuilder('dressCutter')
      .leftJoinAndSelect('dressCutter.user', 'user')
      .leftJoinAndSelect('dressCutter.sticher', 'sticher')
      .leftJoinAndSelect('dressCutter.dress', 'dress')
      .leftJoinAndSelect('dressCutter.tailor', 'tailor')
      .leftJoinAndSelect('dressCutter.customer', 'customer')
      .leftJoinAndSelect('dressCutter.skills', 'skills');

    if (sticher) {
      filteredDressCutter.where('sticher.id = :sticher', { sticher });
    }
    if (dress) {
      filteredDressCutter.andWhere('dress.id = :dress', { dress });
    }
    if (tailor) {
      filteredDressCutter.andWhere('tailor.id = :tailor', { tailor });
    }
    if (customer) {
      filteredDressCutter.andWhere('customer.id = :customer', { customer });
    }
    if (skills) {
      filteredDressCutter.andWhere('skills.id = :skills', { skills });
    }

    return filteredDressCutter.getMany();
  }

  update(id: number, updateDresscutterDto: UpdateDresscutterDto) {
    return `This action updates a #${id} dresscutter`;
  }

  remove(id: number) {
    return `This action removes a #${id} dresscutter`;
  }
}
