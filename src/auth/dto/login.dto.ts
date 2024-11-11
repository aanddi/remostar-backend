import { IsString } from 'class-validator';

export class LoginPhoneDto {
  @IsString({ message: 'Пароль должен быть строкой' })
  phone: string;
}

export class LoginPasswordDto {
  phone: string;
  password: string;
}
