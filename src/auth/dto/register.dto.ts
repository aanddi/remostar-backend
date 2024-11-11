import { IsString, MinLength } from "class-validator";

export interface RegisterOwnerDto {
  name: string;
  surname: string;
  gender: string;
  phone: string;
}

export class RegisterContractorsDto {
  nameCompany: string;
  typeCompany: string;
  mainCity: string;
  phone: string;
  inn: string;

  name: string;
  surname: string;
  gender: string;
  phoneUser: string;
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @IsString({ message: 'Пароль должен быть строкой' })
  password: string;
}

