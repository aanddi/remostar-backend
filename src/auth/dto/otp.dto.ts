import { IsString } from 'class-validator';

export class OtpGenerateDto {
  @IsString({ message: 'Пароль должен быть строкой' })
  phone: string;
}

export interface OtpVerificationDto {
  phone: string;
  code: string;
  sessionId: string;
}
