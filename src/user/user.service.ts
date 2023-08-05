import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { UserStatus } from './enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService, // private readonly authService: AuthService,

    private readonly mailService: MailService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const username = await this.findByUsername(createUserDto.username);
    if (username) {
      throw new BadRequestException('Usernmae already Exist!');
    }

    const email = await this.findByEmail(createUserDto.email);
    if (email) {
      throw new BadRequestException('Email already Exist!');
    }
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find({
      relations: ['tailor', 'customer', 'sticher', 'dayer', 'dressCutter'],
    });
  }

  async findByEmail(email: string) {
    console.log('str', email);
    const user = await this.userRepository.findOneBy({
      email,
    });

    return user;
  }

  findByUsername(username: string) {
    return this.userRepository.findOneBy({
      username,
    });
  }

  findAndSelectIds() {
    return this.userRepository.find({ select: { id: true } });
  }

  findOneAndSelectProfiles(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['tailor', 'customer'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['tailor', 'customer', 'sticher'],
    });
  }

  async findByEmailAndUserName(email: string, username: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .orWhere('user.username = :username', { username })
      .getOne();
  }

  async sendEmailVerificationLink(user: User) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
      status: user.status,
      sub: user.id,
    };
    const token = await this.authService.generateJWTToken(payload, {
      expiresIn: '200s',
    });
    const url = `http://localhost:8001/user/verify/email/${token}`;

    const mail = await this.mailService.sendUserConfirmation({
      ...user,
      subject: 'Confirm your Email on Tailor Shop',
      template: 'email-confirmation',
      context: {
        name: user.name,
        url: url,
      },
    });
    if (mail) {
      return {
        mail,
        access_token: token,
      };
    }
  }

  async verifyUserEmailwithToken(token: string) {
    const user = await this.authService.verifyJWTToken(token);
    if (user) {
      const userData = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: user.sub })
        .getOne();
      userData.isEmailVerified = true;
      return await this.userRepository.save(userData);
    }
    return 'Failed';
  }

  async updateUserStatus(userId: number, status: UserStatus) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne();

    user.status = status;

    return await this.userRepository.save(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async removeAllUser() {
    const ids = await this.findAndSelectIds();
    return await this.userRepository.remove(ids);
  }
}
