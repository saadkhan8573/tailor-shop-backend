import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dress } from 'src/dress/entities/dress.entity';
import { Dresscutter } from 'src/dresscutter/entities/dresscutter.entity';
import { Tailor } from 'src/tailor/entities';
import { UserStatus } from 'src/user/enum';
import { Repository } from 'typeorm';
import { CreateWorkdetailDto } from './dto/create-workdetail.dto';
import { UpdateWorkdetailDto } from './dto/update-workdetail.dto';
import { WorkDetail } from './entities/workdetail.entity';
import { getRepository } from 'typeorm';
import { DressService } from 'src/dress/dress.service';

@Injectable()
export class WorkdetailService {
  constructor(
    @InjectRepository(WorkDetail)
    private readonly workDetailRespository: Repository<WorkDetail>,
    private readonly dressService: DressService,
  ) {}
  create(createWorkdetailDto: CreateWorkdetailDto) {
    return 'This action adds a new workdetail';
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
    return await this.workDetailRespository.save(object);
  }

  findAll() {
    return this.workDetailRespository.find({
      relations: ['tailor', 'sticher', 'dress', 'dressCutter.dress'],
    });
  }

  async findWorkDetailAndStatusUpdate(
    id: number,
    status: UserStatus,
    tailorUserId: number,
  ) {
    const sticherWorkDetail = await this.workDetailRespository.findOne({
      where: { id, tailor: { user: { id: tailorUserId } } },
      relations: ['tailor', 'sticher'],
    });
    if (!sticherWorkDetail) {
      throw new BadRequestException('Sticher Work Detail Not Found');
    }
    sticherWorkDetail.status = status;
    const updateWorkingDetail = this.workDetailRespository.update(
      id,
      sticherWorkDetail,
    );

    if (updateWorkingDetail) {
      return sticherWorkDetail;
    } else {
      throw new BadRequestException('Sticher work detail not updated');
    }
  }

  async findSticherDetailByTailor(
    sticherWorkDetailId: number,
    tailorUserId: number,
  ) {
    const sticherDetail = await this.workDetailRespository.findOne({
      where: {
        id: sticherWorkDetailId,
        tailor: { user: { id: tailorUserId } },
      },
      relations: ['dress', 'sticher.dress'],
    });

    if (!sticherDetail) {
      throw new BadRequestException('Sticher Detial not found!');
    }

    return sticherDetail;
  }

  async sendDressCutterRequestToTailor({
    dressCutterUserId,
    ...data
  }: {
    dressCutterUserId: number;
    workingHoursPerDay: number;
    tailor: Tailor;
    dressCutter: Dresscutter;
  }) {
    const workdetail = await this.workDetailRespository
      .createQueryBuilder('workDetail')
      .leftJoin('workDetail.tailor', 'tailor')
      .leftJoin('workDetail.dressCutter', 'dressCutter')
      .leftJoin('dressCutter.user', 'dressCutterUser')
      .where('tailor.id = :tailorId', { tailorId: data.tailor.id })
      .andWhere('dressCutterUser.id = :dressCutterUserId', {
        dressCutterUserId,
      })
      .getOne();

    if (workdetail) {
      throw new BadRequestException('Request already sent!');
    }

    return this.workDetailRespository.save(data);
  }

  async getDressCutterWorkRequests(id: number) {
    const workDetail = await this.workDetailRespository
      .createQueryBuilder('workDetail')
      .innerJoinAndSelect(`workDetail.dressCutter`, 'dressCutter')
      .innerJoinAndSelect('dressCutter.user', 'dressCutterUser')
      .where('dressCutterUser.id = :id', { id })
      .getMany();

    return workDetail;
  }

  getDressCutterApprovedWorkRequests(id: number) {
    return this.workDetailRespository
      .createQueryBuilder('workDetail')
      .leftJoinAndSelect('workDetail.dressCutter', 'dressCutter')
      .leftJoinAndSelect('dressCutter.user', 'dressCutterUser')
      .where('dressCutterUser.id = :id', { id })
      .andWhere('workDetail.status = :status', { status: UserStatus.APPROVED })
      .getMany();
  }

  async changeTailorWorkDetailStatus(
    workDetailId: number,
    tailorUserId: number,
    status: UserStatus,
  ) {
    const workDetail = await this.workDetailRespository
      .createQueryBuilder('workDetail')
      .where('workDetail.id = :workDetailId', { workDetailId })
      .innerJoinAndSelect('workDetail.tailor', 'tailor')
      .innerJoinAndSelect('tailor.user', 'tailorUser')
      .andWhere('tailorUser.id = :tailorUserId', { tailorUserId })
      .innerJoinAndSelect('workDetail.dressCutter', 'dressCutter')
      .innerJoinAndSelect('dressCutter.user', 'dressCutterUser')
      .getOne();

    if (!workDetail) {
      throw new BadRequestException('No Work Detail Found!');
    }

    workDetail.status = status;

    return this.workDetailRespository.save(workDetail);
  }

  async sendDressToDressCutter(
    workDetailId: number,
    tailorUserId: number,
    dress: Dress,
  ) {
    const workDetail = await this.workDetailRespository
      .createQueryBuilder('workDetail')
      .where('workDetail.id = :workDetailId', { workDetailId })
      .leftJoin('workDetail.tailor', 'tailor')
      .leftJoin('tailor.user', 'user')
      .andWhere('user.id = :tailorUserId', { tailorUserId })
      .innerJoinAndSelect('workDetail.dressCutter', 'dressCutter')
      .leftJoinAndSelect('dressCutter.dress', 'dress')
      .leftJoinAndSelect('workDetail.dress', 'workDetailDress')
      .getOne();

    if (!workDetail) {
      throw new BadRequestException('Work Detail Not Found!');
    }

    if (workDetail.status === UserStatus.PENDING) {
      throw new BadRequestException(
        'Dress Cant be transfer because Work Request is Pending',
      );
    }

    const dressCutterSkills = await this.workDetailRespository
      .createQueryBuilder('workDetail')
      .where('workDetail.id = :workDetailId', { workDetailId })
      .leftJoin('workDetail.tailor', 'tailor')
      .leftJoin('tailor.user', 'user')
      .andWhere('user.id = :tailorUserId', { tailorUserId })
      .innerJoinAndSelect('workDetail.dressCutter', 'dressCutter')
      .leftJoin('dressCutter.dress', 'dress')
      .leftJoin('workDetail.dress', 'workDetailDress')
      .leftJoinAndSelect('dressCutter.skills', 'skills')
      .andWhere('skills.id = :skills', { skills: dress.dressType.id })
      .getOne();

    if (!dressCutterSkills) {
      throw new BadRequestException('Dress Cutter Skills Not Match');
    }

    const isExistDress = await this.workDetailRespository
      .createQueryBuilder('workDetail')
      .where('workDetail.id = :workDetailId', { workDetailId })
      .leftJoin('workDetail.tailor', 'tailor')
      .leftJoin('tailor.user', 'user')
      .andWhere('user.id = :tailorUserId', { tailorUserId })
      .innerJoinAndSelect('workDetail.dressCutter', 'dressCutter')
      .leftJoin('dressCutter.dress', 'dress')
      .leftJoin('workDetail.dress', 'workDetailDress')
      .leftJoinAndSelect('dressCutter.skills', 'skills')
      .andWhere('dress.id = :dressId', { dressId: dress.id })
      .andWhere('workDetailDress.id = :dressId', { dressId: dress.id })
      .getOne();

    if (isExistDress) {
      throw new BadRequestException('Dress already sent to Dress Cutter!');
    }

    dress.isSentForCutting = true;
    await this.dressService.create({
      ...dress,
      dresstype: dress.dressType.id,
    } as any);
    workDetail.dress.push(dress);
    workDetail.dressCutter.dress.push(dress);

    return this.workDetailRespository.save(workDetail);
  }

  findOne(id: number) {
    return `This action returns a #${id} workdetail`;
  }

  update(id: number, updateWorkdetailDto: UpdateWorkdetailDto) {
    return `This action updates a #${id} workdetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} workdetail`;
  }
}
