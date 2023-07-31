import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dresscutter } from 'src/dresscutter/entities/dresscutter.entity';
import { MailService } from 'src/mail/mail.service';
import { Sticher } from 'src/sticher/entities/sticher.entity';
import { UserStatus } from 'src/user/enum';
import { In, Repository } from 'typeorm';
import { CreateTailorDto } from './dto/create-tailor.dto';
import { UpdateTailorDto } from './dto/update-tailor.dto';
import { Tailor } from './entities';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TailorService {
  constructor(
    @InjectRepository(Tailor)
    private readonly tailorRepository: Repository<Tailor>,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}
  async create(createTailorDto: CreateTailorDto) {
    const tailor = await this.tailorRepository.save(createTailorDto);

    if (tailor) {
      const payload = {
        username: createTailorDto.user.username,
        sub: createTailorDto.user.id,
      };
      const token = await this.authService.generateJWTToken(payload, {
        expiresIn: '35s',
      });
      const url = `http://localhost:8001/user/verify/email/${token}`;

      this.mailService.sendUserConfirmation({
        ...createTailorDto.user,
        subject: 'Confirm your Email on Tailor Shop',
        template: 'email-confirmation',
        context: {
          name: tailor.user.name,
          url: url,
        },
      });
    }
    return tailor;
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
        'dressCutter',
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

  async updateTailorDressCutterStatus(
    tailorUserId: number,
    dressCutter: Dresscutter,
    status: UserStatus,
  ) {
    const tailor = await this.tailorRepository
      .createQueryBuilder('tailor')
      .leftJoin('tailor.user', 'user')
      .where('user.id = :id', { id: tailorUserId })
      .leftJoinAndSelect('tailor.dressCutter', 'dressCutter')
      .getOne();

    if (!tailor) {
      throw new BadRequestException('Tailor Not Found');
    }
    status === UserStatus.APPROVED
      ? tailor.dressCutter.push(dressCutter)
      : [UserStatus.BLOCKED, UserStatus.REJECTED].includes(status)
      ? (tailor.dressCutter = tailor.dressCutter.filter(
          (dCutter) => dCutter.id !== dressCutter.id,
        ))
      : '';

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
