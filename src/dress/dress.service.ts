import { Injectable } from '@nestjs/common';
import { CreateDressDto } from './dto/create-dress.dto';
import { UpdateDressDto } from './dto/update-dress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dress } from './entities/dress.entity';
import { In, Repository } from 'typeorm';
import { Dayer } from 'src/dayer/entities/dayer.entity';
import { Tailor } from 'src/tailor/entities';
import { DayerService } from 'src/dayer/dayer.service';
import { DyeStatusEnum, EmbroideryStatusEnum } from './enum';
import { Embroider } from 'src/embroider/entities';
import { EmbroiderService } from 'src/embroider/embroider.service';

@Injectable()
export class DressService {
  constructor(
    @InjectRepository(Dress)
    private readonly dressRepository: Repository<Dress>,
    private readonly dayerService: DayerService,
    private readonly embroiderService: EmbroiderService,
  ) {}
  create(createDressDto: CreateDressDto) {
    return this.dressRepository.save(createDressDto);
  }

  findAll() {
    return this.dressRepository.find({ relations: ['tailor', 'customer'] });
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
    return this.dressRepository.findOneBy({ id });
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

    // dayerData.dressPickedFrom.push(tailor)
    dayerData.dress =
      dayerData.dress && dayerData.dress?.length > 0
        ? [...dayerData.dress, dress]
        : [dress];

    return await this.dayerService.addDress(dayerData);
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

  changeDressStatus(id: number, dress: Dress) {
    return this.dressRepository.update(id, dress);
  }

  changeDyeStatus(dress: Dress) {
    return this.dressRepository.save(dress);
  }

  async changeEmbroideryStatus(dress:Dress) {
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

  update(id: number, updateDressDto: UpdateDressDto) {
    return `This action updates a #${id} dress`;
  }

  remove(id: number) {
    return `This action removes a #${id} dress`;
  }
}
