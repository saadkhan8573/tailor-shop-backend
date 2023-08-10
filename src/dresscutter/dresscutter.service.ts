import { Repository, In, IsNull, Raw } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dresscutter } from './entities/dresscutter.entity';
import { CreateDresscutterDto } from './dto/create-dresscutter.dto';
import { UpdateDresscutterDto } from './dto/update-dresscutter.dto';
import { TailorService } from 'src/tailor/tailor.service';
import { Dress } from 'src/dress/entities/dress.entity';
import { DressType } from 'src/dress/entities/dressType.entity';
import { UserService } from 'src/user/user.service';
import { UserStatus } from 'src/user/enum';
import { PaginateResult, Pagination, getFilterValues } from 'utils';

@Injectable()
export class DresscutterService {
  constructor(
    @InjectRepository(Dresscutter)
    private readonly dressCutterRepository: Repository<Dresscutter>,
    private readonly tailorService: TailorService,
    private readonly userService: UserService,
  ) {}
  async create(createDresscutterDto: CreateDresscutterDto) {
    const dressCutter = await this.dressCutterRepository.save(
      createDresscutterDto,
    );

    if (dressCutter) {
      await this.userService.sendEmailVerificationLink(dressCutter.user);
    }

    return dressCutter;
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

  async getDressCutterByWorkDetail(pagination: Pagination) {
    const filters = getFilterValues(pagination);
    const [list, count] = await this.dressCutterRepository.findAndCount({
      where: {
        user: {
          name: filters.name,
          email: filters.email,
        },
      },
      relations: ['user'],
      skip: pagination.skip,
      take: pagination.limit,
    });
    const query = this.dressCutterRepository
      .createQueryBuilder('dressCutter')
      .leftJoinAndSelect('dressCutter.user', 'user');

    // if (filters.name) {
    //   query.where(Raw('user.name LIKE :name'), {
    //     name: `%${getKey('name')}%`,
    //   });
    // }
    // if (filters.email) {
    //   query.where('user.email = :email', {
    //     email: filters.email,
    //   });
    // }

    const getFilterKey = (key) =>
      pagination.search.find((s) => s.field === key).value;

    const searchQuery = (key) => `LOWER(user[${key}]) ILike :${key}`;

    if (filters.name) {
      query.where(searchQuery('name'), {
        name: `%${getFilterKey('name')}%`,
      });
    }
    // if (filters.email) {
    //   query.where('LOWER(user.email) LIKE :email', {
    //     // email: filters.email,
    //     email: `%${getKey('email').toLowerCase()}%`,
    //   });
    // }

    // const [list, count] = await query
    //   .take(pagination.limit)
    //   .skip(pagination.skip)
    //   .orderBy('dressCutter.createdAt', 'DESC')
    //   .getManyAndCount();

    return PaginateResult<Dresscutter>(
      pagination.skip,
      pagination.limit,
      count,
      list,
    );
    // return this.dressCutterRepository
    //   .createQueryBuilder('dressCutter')
    //   .leftJoinAndSelect('dressCutter.workDetail', 'workDetail')
    //   .where('workDetail.status = :status OR workDetail.id IS NULL', {
    //     status: UserStatus.APPROVED,
    //   })
    //   .getMany();
    // return this.dressCutterRepository.find({
    //   where: {
    //     workDetail: [
    //       {
    //         status: Not(UserStatus.APPROVED),
    //       },
    //       {
    //         id: IsNull(),
    //       },
    //     ],
    //   },
    //   relations: ['workDetail'],
    // });
  }

  update(id: number, updateDresscutterDto: UpdateDresscutterDto) {
    return `This action updates a #${id} dresscutter`;
  }

  remove(id: number) {
    return `This action removes a #${id} dresscutter`;
  }
}
