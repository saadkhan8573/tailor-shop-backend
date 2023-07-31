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

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService, // private readonly authService: AuthService,
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

  findByEmail(email: string) {
    return this.userRepository.findOneBy({
      email,
    });
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

  async verifyUserEmailwithToken(token: string) {
    const user = await this.authService.verifyJWTToken(token);
    if (user) {
      return 'Passes';
    }
    return 'Failed';
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
