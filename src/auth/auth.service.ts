import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterOwnerDto, RegisterContractorsDto } from './dto/register.dto';

import { PrismaService } from 'src/prisma.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Roles, RolesEmployee } from './types/roles.type';
import { LoginPasswordDto, LoginPhoneDto } from './dto/login.dto';
import { hash, verify } from 'argon2';
import { RefreshTokenDto } from './dto/tokens.dto';
import { OtpGenerateDto, OtpVerificationDto } from './dto/otp.dto';
import { Users, Roles as RolesUser, ContractorsEmployees, EmployeesRoles } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async loginPassword(dto: LoginPasswordDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        phone: dto.phone,
      },
      include: {
        role: true,
        employee: {
          include: {
            employeesRole: true,
          },
        },
      },
    });

    if (!user) throw new BadRequestException('Пользователь с таким номером не зарегистрирован');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('Не верный пароль');

    const tokens = await this.generateTokens(user.id);

    return {
      user: this.returnUserField(user, user.role, user.employee, user.employee.employeesRole),
      ...tokens,
    };
  }

  async loginPhone(dto: LoginPhoneDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        phone: dto.phone,
      },
      include: {
        role: true,
        employee: {
          include: {
            employeesRole: true,
          },
        },
      },
    });

    const tokens = await this.generateTokens(user.id);

    return {
      user: this.returnUserField(user, user.role, user.employee, user?.employee?.employeesRole),
      ...tokens,
    };
  }

  async registerOwner(dto: RegisterOwnerDto) {
    const checkUser = await this.prisma.users.findUnique({
      where: {
        phone: dto.phone,
      },
    });

    if (checkUser) throw new BadRequestException('Такой юзер уже зарегистрирован');

    const role = await this.prisma.roles.findUnique({
      where: {
        name: Roles.Owner,
      },
    });

    const newUser = await this.prisma.users.create({
      data: {
        name: dto.name,
        surname: dto.surname,
        phone: dto.phone,
        isLoginPhone: true,
        roleId: role.id,
      },
    });

    const tokens = await this.generateTokens(newUser.id);

    return {
      user: this.returnUserField(newUser, role),
      ...tokens,
    };
  }

  async registerConractor(dto: RegisterContractorsDto) {
    const role = await this.prisma.roles.findUnique({
      where: {
        name: Roles.Employee,
      },
    });

    const roleEmployee = await this.prisma.employeesRoles.findUnique({
      where: {
        name: RolesEmployee.Admin,
      },
    });

    const checkInn = await this.prisma.contractors.findUnique({
      where: {
        inn: String(dto.inn),
      },
    });

    if (checkInn) throw new BadRequestException('Подрядчик с таким ИНН уже зарегистрирован');

    const newUser = await this.prisma.users.create({
      data: {
        name: dto.name,
        surname: dto.surname,
        gender: dto.gender,
        phone: dto.phoneUser,
        roleId: role.id,
        isLoginPhone: false,
        password: await hash(dto.password),
      },
    });

    const newContractor = await this.prisma.contractors.create({
      data: {
        name: dto.nameCompany,
        typeCompany: dto.typeCompany,
        mainCity: dto.mainCity,
        phone: dto.phone,
        inn: String(dto.inn),
        veryfi: false,
      },
    });

    const newEmployee = await this.prisma.contractorsEmployees.create({
      data: {
        userId: newUser.id,
        contractorId: newContractor.id,
        employeesRoleId: roleEmployee.id,
      },
    });

    const tokens = await this.generateTokens(newUser.id);

    return {
      user: this.returnUserField(newUser, role, newEmployee, roleEmployee),
      ...tokens,
    };
  }

  async otpGenerate(dto: OtpGenerateDto, type: string) {
    const checkPhone = await this.prisma.users.findUnique({
      where: {
        phone: dto.phone,
      },
    });

    if (type === 'login') {
      if (!checkPhone) throw new BadRequestException('Пользователь с таким номером не зарегистрирован');
      if (!checkPhone.isLoginPhone) throw new ForbiddenException('Вход по телефону запрещен для этого пользователя');
    } else if (type === 'register') {
      if (checkPhone) throw new BadRequestException('Пользователь с таким номером уже зарегистрирован');
    }

    // в теории сейчас должен отправляться запрос на сторонний платный api сервис для отправки смс на телефон,
    // этот сервис в теории возвращает id сессии который имеет ограниченное время жизни,
    // для того чтобы потом проверить код, который ввел пользователь

    // отправляем фейк запрос и получаем id сессии
    const sessionSmsId = '432s5d436sdf8dsfsf';

    return {
      phone: dto.phone,
      sessionSmsId: sessionSmsId,
    };
  }

  async otpVerification(dto: OtpVerificationDto) {
    // делаем фейк запрос к нашему сервису, передаем туда sessionId и условно получаем валидный код
    const validCode = '47621';

    if (validCode !== dto.code) throw new BadRequestException('Неверный код');

    return {
      phone: dto.phone,
      approved: true,
    };
  }

  async getNewTokens(dto: RefreshTokenDto) {
    let payload;

    try {
      payload = await this.jwt.verifyAsync(dto.refreshToken);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('RefreshToken истек');
      }
      throw new UnauthorizedException('RefreshToken не валидный');
    }

    const user = await this.prisma.users.findUnique({
      where: {
        id: payload.id,
      },
      include: {
        role: true,
        employee: {
          include: {
            employeesRole: true,
          },
        },
      },
    });

    const tokens = await this.generateTokens(user.id);

    return {
      user: this.returnUserField(user, user.role, user.employee, user.employee.employeesRole),
      ...tokens,
    };
  }

  private async generateTokens(userId: string) {
    const payload = { id: userId };

    const accessToken = this.jwt.sign(payload, {
      expiresIn: '30s',
    });

    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '14d',
    });

    return { accessToken, refreshToken };
  }

  private returnUserField(
    user: Users,
    role: RolesUser,
    employee?: ContractorsEmployees,
    employeesRole?: EmployeesRoles,
  ) {
    if (role.name === Roles.Employee) {
      return {
        id: user.id,
        name: user.name,
        surname: user.surname,
        pathImage: user.pathImage,
        employee: {
          employeeId: employee.id,
          contractorId: employee.contractorId,
        },
        roles: {
          userRole: {
            roleId: user.roleId,
            roleName: role.name,
            roleDesc: role.desc,
          },
          employeeRole: {
            roleId: employeesRole.id,
            roleName: employeesRole.name,
            roleDesc: employeesRole.desc,
          },
        },
      };
    }

    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      pathImage: user.pathImage,
      roles: {
        userRole: {
          roleId: role.id,
          roleName: role.name,
          roleDesc: role.desc,
        },
      },
    };
  }
}
