import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSticherDto } from './dto/create-sticher.dto';
import { UpdateSticherDto } from './dto/update-sticher.dto';
import { Sticher } from './entities/sticher.entity';
import { Dress } from 'src/dress/entities/dress.entity';
import { DressType } from 'src/dress/entities/dressType.entity';
import { UserStatus } from 'src/user/enum';
import { WorkDetail } from 'src/workdetail/entities/workdetail.entity';
import { WorkdetailService } from 'src/workdetail/workdetail.service';

@Injectable()
export class SticherService {
  constructor(
    @InjectRepository(Sticher)
    private readonly sticherRepository: Repository<Sticher>,

    @InjectRepository(WorkDetail)
    private readonly workDetailRepository: Repository<WorkDetail>,

    private readonly workDetailService: WorkdetailService,
  ) {}
  create(createSticherDto: CreateSticherDto) {
    return this.sticherRepository.save(createSticherDto);
  }

  findAll() {
    return this.sticherRepository.find({
      relations: ['user', 'skills'],
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
        'user',
        'skills',
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

  async sendDressToSticher(
    dress: Dress,
    sticherWorkDetailId: number,
    tailorUserId: number,
  ) {
    const sticherDetail =
      await this.workDetailService.findSticherDetailByTailor(
        sticherWorkDetailId,
        tailorUserId,
      );

    const sticher = await this.sticherRepository.findOne({
      where: { workingDetailWithTailor: { id: sticherWorkDetailId } },
      relations: ['dress'],
    });

    if (!sticher) {
      throw new BadRequestException('No Sticher were found');
    }

    sticherDetail.dress.push(dress);

    sticher.dress.push(dress);
    await this.sticherRepository.save(sticher);
    const updatedSticherDetail = await this.workDetailRepository.save(
      sticherDetail,
    );

    if (updatedSticherDetail) {
      return updatedSticherDetail;
    }
  }

  async updateSticherSkills(sticherUserId: number, skills: DressType[]) {
    const sticher = await this.sticherRepository.findOne({
      where: { user: { id: sticherUserId } },
      relations: ['skills'],
    });

    sticher.skills = [...sticher.skills, ...skills];
    return this.sticherRepository.save(sticher);
  }

  async findSticherByWorkDetail(workDetailId: number) {
    return this.sticherRepository.findOne({
      where: { workingDetailWithTailor: { id: workDetailId } },
      relations: ['skills'],
    });
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
