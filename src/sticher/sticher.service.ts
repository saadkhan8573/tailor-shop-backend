import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSticherDto } from './dto/create-sticher.dto';
import { UpdateSticherDto } from './dto/update-sticher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sticher } from './entities/sticher.entity';
import { WorkingDetailWithTailor } from './entities/workDetail.entity';

import { UserStatus } from 'src/user/enum';
import { Tailor } from 'src/tailor/entities';
import { Dress } from 'src/dress/entities/dress.entity';

@Injectable()
export class SticherService {
  constructor(
    @InjectRepository(Sticher)
    private readonly sticherRepository: Repository<Sticher>,
    @InjectRepository(WorkingDetailWithTailor)
    private readonly workingDetailRepository: Repository<WorkingDetailWithTailor>,
  ) {}
  create(createSticherDto: CreateSticherDto) {
    return this.sticherRepository.save(createSticherDto);
  }

  findAll() {
    return this.sticherRepository.find({
      relations: ['user'],
    });
  }

  findAllAndSelectIds() {
    return this.sticherRepository.find({
      select: { id: true },
    });
  }

  findOne(id: number) {
    return this.sticherRepository.findOne({
      where: { id },
      relations: [
        'tailor',
        'dress',
        'workingDetailWithTailor.dress',
        'workingDetailWithTailor.tailor',
      ],
    });
  }

  findByUser(id: number) {
    return this.sticherRepository.findOne({
      where: { user: { id } },
    });
  }

  async addWorkingDetailWithTailor(object: any) {
    // const sticher = await this.sticherRepository.findOne({
    //   where: { user: { id } },
    // });

    // if (!sticher) {
    //   throw new BadRequestException('Sticher Not Found');
    // }

    // const isExistTailor = sticher?.workingDetailWithTailor?.find(
    //   (workingDetail) => workingDetail?.tailor === tailor,
    // );

    // if (isExistTailor) {
    //   throw new BadRequestException('You already sent request to this tailor');
    // }

    // sticher.workingDetailWithTailor.push({
    //   tailor,
    //   workingHoursPerDay,
    //   sticher,
    // } as WorkingDetailWithTailor);
    // sticher.workingDetailWithTailor &&
    // sticher.workingDetailWithTailor?.length > 0
    //   ? [
    //       ...sticher.workingDetailWithTailor,
    //       {
    //         tailor,
    //         workingHoursPerDay,
    //         sticher,
    //       },
    //     ]
    //   : [
    //       {
    //         tailor,
    //         workingHoursPerDay,
    //         sticher,
    //       },
    //     ];
    return await this.workingDetailRepository.save(object);
  }

  async findWorkDetailAndStatusUpdate(
    id: number,
    status: UserStatus,
    tailorUserId: number,
  ) {
    const sticherWorkDetail = await this.workingDetailRepository.findOne({
      where: { id, tailor: { user: { id: tailorUserId } } },
      relations: ['tailor', 'sticher'],
    });
    if (!sticherWorkDetail) {
      throw new BadRequestException('Sticher Work Detail Not Found');
    }
    sticherWorkDetail.status = status;
    const updateWorkingDetail = this.workingDetailRepository.update(
      id,
      sticherWorkDetail,
    );

    if (updateWorkingDetail) {
      return sticherWorkDetail;
    } else {
      throw new BadRequestException('Sticher work detail not updated');
    }
  }

  async sendDressToSticher(
    dress: Dress,
    sticherWorkDetailId: number,
    tailorUserId: number,
  ) {
    const sticherDetail = await this.workingDetailRepository.findOne({
      where: {
        id: sticherWorkDetailId,
        tailor: { user: { id: tailorUserId } },
      },
      relations: ['dress', 'sticher.dress'],
    });

    const sticher = await this.sticherRepository.findOne({
      where: { workingDetailWithTailor: { id: sticherWorkDetailId } },
      relations: ['dress'],
    });

    if (!sticherDetail) {
      throw new BadRequestException('No Sticher Detail were found');
    }

    if (!sticher) {
      throw new BadRequestException('No Sticher were found');
    }

    sticherDetail.dress.push(dress);

    sticher.dress.push(dress);
    await this.sticherRepository.save(sticher);
    const updatedSticherDetail = await this.workingDetailRepository.save(
      sticherDetail,
    );

    if (updatedSticherDetail) {
      return updatedSticherDetail;
    }
  }

  getSticherWorkDetail() {
    return this.workingDetailRepository.find({
      relations: ['tailor', 'sticher', 'dress'],
    });
  }

  async updateSticherSkills(sticherUserId: number, skills: string[]) {
    const sticher = await this.sticherRepository.findOne({
      where: { user: { id: sticherUserId } },
    });
    const removeCommonSkills = skills.filter((skill) => {
      return !sticher.skills.includes(skill);
    });

    sticher.skills = [...sticher.skills, ...removeCommonSkills];
    return this.sticherRepository.update(sticher.id, sticher);
  }

  update(id: number, updateSticherDto: UpdateSticherDto) {
    return `This action removes a #${id} sticher`;
  }

  remove(id: number) {
    return `This action removes a #${id} sticher`;
  }

  async removeAll() {
    const ids = await this.findAllAndSelectIds();
    return this.sticherRepository.remove(ids);
  }
}
