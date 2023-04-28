import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(createAuthDto: CreateAuthDto) {
    const user = await this.userService.findByEmail(createAuthDto?.email);
    if (user && user.password === createAuthDto.password) {
      const payload = { username: user.username, sub: user.id };
      const { password, ...userRest } = user;
      return {
        ...userRest,
        assess_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Email or password is incorect');
  }
}
