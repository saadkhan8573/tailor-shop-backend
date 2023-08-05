import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateJWTToken(payload: any, options?: any) {
    return this.jwtService.sign(payload, options);
  }

  async verifyJWTToken(token: string) {
    try {
      const validated = this.jwtService.verify(token, {
        publicKey: process.env.JWT_SECRET,
      });
      return validated;
    } catch (error) {
      throw new BadRequestException('Token Expired!');
    }
  }
  async login(createAuthDto: CreateAuthDto) {
    const user = await this.userService.findByEmail(createAuthDto?.email);
    if (user && user.password === createAuthDto.password) {
      const { password, ...userRest } = user;
      const payload = { ...userRest, sub: user.id };
      return {
        ...userRest,
        assess_token: await this.generateJWTToken(payload),
      };
    }
    throw new UnauthorizedException('Email or password is incorect');
  }
}
