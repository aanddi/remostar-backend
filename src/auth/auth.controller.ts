import { Controller, HttpCode, Post, Body, ValidationPipe, UsePipes, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterContractorsDto, RegisterOwnerDto } from './dto/register.dto';
import { LoginPasswordDto, LoginPhoneDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/tokens.dto';
import { OtpGenerateDto, OtpVerificationDto } from './dto/otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('register/owner')
  async registerOwner(@Body() dto: RegisterOwnerDto) {
    return this.authService.registerOwner(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register/conractor')
  async registerConractor(@Body() dto: RegisterContractorsDto) {
    return this.authService.registerConractor(dto);
  }

  @HttpCode(200)
  @Post('login/password')
  async loginPassword(@Body() dto: LoginPasswordDto) {
    return this.authService.loginPassword(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/login/phone')
  async loginPhone(@Body() dto: LoginPhoneDto) {
    return this.authService.loginPhone(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/tokens/new')
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewTokens(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/otp/generate')
  async otpGenerate(@Query('type') type: string, @Body() dto: OtpGenerateDto) {
    return this.authService.otpGenerate(dto, type);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/otp/verification')
  async otpVerification(@Body() dto: OtpVerificationDto) {
    return this.authService.otpVerification(dto);
  }
}
