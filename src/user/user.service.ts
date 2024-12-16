import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        createdAt: true,
        updateAt: true,
        name: true,
        surname: true,
        patronymic: true,
        gender: true,
        birthday: true,
        pathImage: true,
        email: true,
        phone: true,
      },
    });

    return user;
  }

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        name: dto.name,
        surname: dto.surname,
        patronymic: dto.patronymic,
        gender: dto.gender,
        email: dto.email,
      },
    });

    return user;
  }
}
