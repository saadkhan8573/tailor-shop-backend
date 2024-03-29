import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { DayerService } from 'src/dayer/dayer.service';
import { Dayer } from 'src/dayer/entities/dayer.entity';
import { EmbroiderService } from 'src/embroider/embroider.service';
import { Embroider } from 'src/embroider/entities';
import { Sticher } from 'src/sticher/entities/sticher.entity';
import { In, Repository } from 'typeorm';
import { CreateDressDto } from './dto/create-dress.dto';
import { UpdateDressDto } from './dto/update-dress.dto';
import { Dress } from './entities/dress.entity';
import { DressType } from './entities/dressType.entity';
import { DressStatusEnum, DyeStatusEnum } from './enum';

@Injectable()
export class DressService {
  constructor(
    @InjectRepository(Dress)
    private readonly dressRepository: Repository<Dress>,
    @InjectRepository(DressType)
    private readonly dressTypeRepository: Repository<DressType>,
    private readonly dayerService: DayerService,
    private readonly embroiderService: EmbroiderService,
    moduleRef: ModuleRef,
  ) {}
  async create(createDressDto: CreateDressDto) {
    const dressType = await this.dressTypeRepository.findOne({
      where: { id: +createDressDto.dresstype },
    });

    if (!dressType) {
      throw new BadRequestException('DressType Not Found');
    }

    return this.dressRepository.save({
      ...createDressDto,
      dressType,
    });
  }

  findAll() {
    return this.dressRepository.find({
      relations: ['tailor.user', 'customer', 'dressType', 'dressCutter'],
    });
  }

  findDressByOwner(id: number) {
    return this.dressRepository.find({
      where: {
        tailor: {
          id,
        },
      },
      relations: ['tailor.user', 'customer.user'],
    });
  }

  findOne(id: number) {
    return this.dressRepository.findOne({
      where: { id },
      relations: ['dressType'],
    });
  }

  async findOneByTailor(id: number, tailorId: number) {
    const dress = await this.dressRepository.findOne({
      where: { id, tailor: { user: { id: tailorId } } },
      relations: ['dressType'],
    });
    if (!dress) {
      throw new BadRequestException('Dress Not Found!');
    }
    return dress;
  }

  async transferDressForDye({
    dress,
    dayer,
    tailor,
  }: {
    dress: Dress;
    dayer: Dayer;
    tailor: any;
  }) {
    const dayerData = await this.dayerService.create(dayer);

    dayerData.dress =
      dayerData.dress && dayerData.dress?.length > 0
        ? [...dayerData.dress, dress]
        : [dress];

    const sentToDyer = await this.dayerService.addDress(dayerData);

    if (sentToDyer) {
      throw new HttpException('Successfully Sent', 200);
    }
    throw new BadRequestException('Failed To Sent ');
  }

  async transferDressForEmbroidery({
    dress,
    embroider,
    tailor,
  }: {
    dress: Dress;
    embroider: Embroider;
    tailor: any;
  }) {
    const embroiderData = await this.embroiderService.create(embroider);

    // dayerData.dressPickedFrom.push(tailor)
    embroiderData.dress =
      embroiderData.dress && embroiderData.dress?.length > 0
        ? [...embroiderData.dress, dress]
        : [dress];

    return await this.embroiderService.addDress(embroiderData);
  }

  async changeDressStatus(id: number, status: DressStatusEnum) {
    const dress = await this.findOne(id);
    if (!dress) {
      throw new BadRequestException('Dress Not Found');
    }

    dress.status = status;
    const updatedDress = await this.dressRepository.update(id, dress);
    if (updatedDress) {
      return dress;
    }
  }

  async findDressByTailorAndChangeDressStatus(
    id: number,
    tailorUserId: number,
    status: DressStatusEnum,
    sticher: Sticher,
  ) {
    const dress = await this.dressRepository.findOne({
      where: { id, tailor: { user: { id: tailorUserId } } },
      relations: ['dressType'],
    });
    if (!dress) {
      throw new BadRequestException('Dress Not Found');
    }
    if (dress.isSentForStiching) {
      throw new BadRequestException('Dress already sent for stiching');
    }

    const isDressTypeExistInSkills = sticher.skills
      .map(({ type }) => type)
      .includes(dress.dressType.type);

    if (!isDressTypeExistInSkills) {
      throw new BadRequestException(
        `Sticher has no ${dress.dressType.type} Skill, so it can,t be transfer`,
      );
    }

    if (dress.isSentForCutting) {
      throw new BadRequestException('Dress Already sent for Cutting!');
    }

    if (dress.sentForDye) {
      throw new BadRequestException('Dress already sent for Dye!');
    }

    if (dress.isSentForEmbroidery) {
      throw new BadRequestException('Dress Sent For Emboroidery!');
    }

    dress.status = status;
    dress.isSentForStiching = true;
    const updatedDress = await this.dressRepository.update(id, dress);
    if (updatedDress) {
      return dress;
    }
  }

  async finDressByTailorAndUpdateCuttingStatus(
    dressId: number,
    tailorId: number,
  ) {
    const dress = await this.findOneByTailor(dressId, tailorId);
    dress.isSentForCutting = true;
    return this.dressRepository.save(dress);
  }

  changeDyeStatus(dress: Dress) {
    return this.dressRepository.save(dress);
  }

  async changeEmbroideryStatus(dress: Dress) {
    return this.dressRepository.save(dress);
  }

  findDressByIds(ids: number[]) {
    return this.dressRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  findForDyeDress(id: number) {
    return this.dressRepository.find({
      where: {
        isDye: true,
        tailor: {
          user: {
            id,
          },
        },
      },
    });
  }

  findByDyeStatus(id: number, dyeStatus: DyeStatusEnum) {
    return this.dressRepository.find({
      where: {
        isDye: true,
        dyeStatus,
        tailor: {
          user: {
            id,
          },
        },
      },
    });
  }

  findDressForDyeList(id: number, isDye: string) {
    return this.dressRepository.find({
      where: {
        ...(isDye === 'true' ? { isDye: true } : { isDye: false }),
        tailor: {
          user: {
            id,
          },
        },
      },
    });
  }

  findDressForEmbroideryList(id: number, isEmbroidery: string) {
    return this.dressRepository.findAndCount({
      where: {
        ...(isEmbroidery === 'true'
          ? { isEmbroidery: true }
          : { isEmbroidery: false }),
        tailor: {
          user: {
            id,
          },
        },
      },
    });
  }

  async findDressBySticherAndReturnToTailor(
    dressId: number,
    sticherId: number,
  ) {
    const dress = await this.dressRepository.findOne({
      where: { id: dressId },
      // where: { id: dressId, sticher: { id: sticherId } },
      relations: ['sticher', 'tailor'],
    });

    if (!dress) {
      throw new BadRequestException('Dress Not Found'!);
    }

    dress.isSentForStiching = false;
    dress.isDressStiched = true;
    dress.isDressReturnedAfterStiching = true;
    return this.dressRepository.save(dress);
    // return this.sticherRepository.update(dress.id, dress);
  }

  update(id: number, updateDressDto: UpdateDressDto) {
    return `This action updates a #${id} dress`;
  }

  remove(id: number) {
    return `This action removes a #${id} dress`;
  }

  async removeAllOwner() {
    const ids = await this.dressRepository.find({ select: ['id'] });
    return await this.dressRepository.remove(ids);
  }

  async addDressType(dressType: string[]) {
    dressType.forEach((dType) => {
      return this.dressTypeRepository.save({ type: dType });
    });

    return 'Successfully Added';
  }
  getDressTypeList() {
    return this.dressTypeRepository.find({ relations: ['dress'] });
  }

  findByGivenDressType(dressTypes: DressType[]) {
    return this.dressTypeRepository.find({
      where: { id: In(dressTypes) },
    });
  }

  findDressTypeById(id: number) {
    return this.dressTypeRepository.findOneBy({ id });
  }
}
