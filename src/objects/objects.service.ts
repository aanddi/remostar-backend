import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IActionsObject } from './dto/object.dto';

@Injectable()
export class ObjectsService {
  constructor(private prisma: PrismaService) {}

  async getOwnersList() {
    const list = await this.prisma.users.findMany({
      where: {
        roleId: 1,
      },
    });

    const formatted = list.map(user => {
      return {
        id: user.id,
        fullName: `${user.surname} ${user.name} ${user.patronymic}`,
      };
    });

    return formatted;
  }

  async getObjectListOwner(userId: string) {
    const objects = await this.prisma.objects.findMany({
      where: {
        usersId: userId,
      },
      select: {
        id: true,
        updateAt: true,
        createdAt: true,
        name: true,
        address: true,
        status: true,
        gallery: true,
        desc: true,
        budget: true,
        footage: true,
        type: true,
        finishing: true,
      },
      orderBy: {
        updateAt: 'desc',
      },
    });

    return objects;
  }

  async getObjectListContractor(contractorId: number) {
    const objects = await this.prisma.objects.findMany({
      where: {
        contractorsId: contractorId,
      },
      select: {
        id: true,
        updateAt: true,
        createdAt: true,
        name: true,
        address: true,
        status: true,
        gallery: true,
        desc: true,
        budget: true,
        footage: true,
        type: true,
        finishing: true,
      },
      orderBy: {
        updateAt: 'desc',
      },
    });

    return objects;
  }

  async createObject(contractorId: number, dto: IActionsObject) {
    const newObject = await this.prisma.objects.create({
      data: {
        contractorsId: contractorId,
        usersId: dto.usersId,
        name: dto.name,
        address: dto.address,
        status: dto.status,
        footage: dto.footage,
        rooms: dto.rooms,
        budget: dto.budget,
        type: dto.type,
        squareKitchen: dto.squareKitchen,
        squareLived: dto.squareLived,
        floor: dto.floor,
        finishing: dto.finishing,
        gallery: dto.gallery,
        desc: dto.desc,
      },
    });

    return newObject;
  }

  async editObject(objectId: number, dto: IActionsObject) {
    const newObject = await this.prisma.objects.update({
      where: {
        id: objectId,
      },
      data: {
        name: dto.name,
        address: dto.address,
        status: dto.status,
        footage: dto.footage,
        rooms: dto.rooms,
        budget: dto.budget,
        type: dto.type,
        squareKitchen: dto.squareKitchen,
        squareLived: dto.squareLived,
        floor: dto.floor,
        finishing: dto.finishing,
        gallery: dto.gallery,
        desc: dto.desc,
      },
    });
    return newObject;
  }

  async editStatusObject(objectId: number, status: number) {
    const newObject = await this.prisma.objects.update({
      where: {
        id: objectId,
      },
      data: {
        status: status,
      },
    });

    return newObject;
  }

  async getInfo(objectId: number) {
    const info = await this.prisma.objects.findUnique({
      where: {
        id: +objectId,
      },
      include: {
        contractor: {
          select: {
            id: true,
            legalName: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            patronymic: true,
          },
        },
      },
    });

    return info;
  }
}
