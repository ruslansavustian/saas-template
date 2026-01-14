import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private activeSessions = new Map<string, { expiresAt: Date }>();
  initSession() {
    const uuid = uuidv4();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    this.activeSessions.set(uuid, { expiresAt });

    return {
      uuid,
      expiresAt: expiresAt.toISOString(),
    };
  }
  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userService.create(name, email, password);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;

    const payload = { username: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: result,
    };
  }
  private verifyHashedPassword = (
    hashedPassword: string,
    storedPassword: string,
  ): boolean => {
    return hashedPassword === storedPassword;
  };
  async loginWithBasicAuth(loginDto: LoginDto, authHeader: string) {
    const { uuid } = loginDto;

    if (!uuid) {
      throw new UnauthorizedException('Session UUID is required');
    }

    const session = this.activeSessions.get(uuid);
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired session');
    }
    this.activeSessions.delete(uuid);

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    try {
      const base64Credentials = authHeader.replace('Basic ', '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8',
      );
      const [email, password] = credentials.split(':');

      if (!email || !password) {
        throw new UnauthorizedException('Invalid credentials format');
      }

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await this.userService.validatePassword(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { username: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return {
        access_token,
        user: result,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateBasicAuth(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new BadRequestException('Invalid authorization header');
    }

    try {
      const base64Credentials = authHeader.replace('Basic ', '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8',
      );
      const [email, password] = credentials.split(':');

      if (!email || !password) {
        throw new UnauthorizedException('Invalid credentials format');
      }

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await this.userService.validatePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { username: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return {
        access_token,
        user: result,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getProfile(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userWithNoPassword = {
      ...user,
      password: undefined,
    };
    return userWithNoPassword;
  }

  async findAll() {
    return await this.userService.getAll();
  }
}
