import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { Public } from './public-decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('init-session')
  @ApiOperation({ summary: 'Инициализация сессии для логина' })
  @ApiResponse({
    status: 201,
    description: 'Сессия успешно создана',
    schema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        expiresAt: { type: 'string' },
      },
    },
  })
  initSession() {
    return this.authService.initSession();
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Вход в систему через Basic Auth' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход в систему',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(
    @Body() loginDto: LoginDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.authService.loginWithBasicAuth(loginDto, authHeader);
  }

  @Public()
  @Post('login-basic')
  @ApiOperation({ summary: 'Вход в систему через Basic Auth (альтернативный)' })
  @ApiResponse({ status: 200, description: 'Успешный вход в систему' })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async loginBasic(@Headers('authorization') authHeader: string) {
    return this.authService.validateBasicAuth(authHeader);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  getProfile(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.getProfile(req.user.sub as number);
  }

  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить список всех пользователей' })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  getUsers() {
    return this.authService.findAll();
  }
}
