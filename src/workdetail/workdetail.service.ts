import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWorkdetailDto } from './dto/create-workdetail.dto';
import { UpdateWorkdetailDto } from './dto/update-workdetail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkDetail } from './entities/workdetail.entity';
import { Repository } from 'typeorm';
import { UserStatus } from 'src/user/enum';

@Injectable()
export class WorkdetailService {
  constructor(
    @InjectRepository(WorkDetail)
    private readonly workDetailRespository: Repository<WorkDetail>,
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
      relations: ['tailor', 'sticher', 'dress'],
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
