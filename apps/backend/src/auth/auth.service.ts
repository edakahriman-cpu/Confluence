import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, ...(dto.email ? [{ email: dto.email }] : [])],
      },
    });

    if (existingUser) {
      throw new ConflictException('Bu kullanıcı adı veya e-posta zaten kullanılıyor.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email ?? null,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı.');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('Bu kullanıcı silinmiş durumda.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Bu kullanıcı pasif durumda.');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı.');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('Bu kullanıcı silinmiş durumda.');
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, purpose: 'password-reset' },
      { expiresIn: '15m' },
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    return {
      message: 'Şifre sıfırlama isteği alındı.',
      resetToken,
    };
  }
}
