import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DtoCreateReport, IActionsObject } from './dto/object.dto';
import * as iconv from 'iconv-lite';

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
        fullName: `${user.surname ?? ''} ${user.name ?? ''} ${user.patronymic ?? ''}`,
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
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            patronymic: true,
            phone: true,
            email : true
          },
        },
      },
    });

    return info;
  }

  async getReportsForStatus(objectId: number, statusId: number) {
    const reports = await this.prisma.objectsReports.findMany({
      where: {
        objectsId: objectId,
        step: statusId,
      },
    });

    return reports;
  }

  async createReport(objectId: number, statusId: number, dto: DtoCreateReport) {
    const report = await this.prisma.objectsReports.create({
      data: {
        objectsId: objectId,
        step: statusId,
        gallery: dto.gallery,
        title: dto.title,
        desc: dto.desc,
        result: dto.result,
        author: dto.author,
      },
    });

    return report;
  }

  async getListEmployees(contractorId: number) {
    const listEmployees = await this.prisma.contractorsEmployees.findMany({
      where: {
        contractorId: contractorId,
      },
      include: {
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

    const listUser = listEmployees.map(employee => {
      return {
        id: employee.user.id,
        fullName: `${employee.user?.surname ?? ''} ${employee.user?.name ?? ''} ${employee.user?.patronymic ?? ''}`,
      };
    });

    return listUser;
  }

  async uploadFile(file: Express.Multer.File, objectId: number) {
    console.log(file);
    const newFiles = await this.prisma.objectsFiles.create({
      data: {
        name: iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8'),
        size: file.size,
        blobContent: file.buffer,
        objectsId: objectId,
      },
    });

    return {
      id: newFiles.id,
      name: newFiles.name,
    };
  }

  async getFileContent(fileId: number) {
    const content = await this.prisma.objectsFiles.findUnique({
      where: {
        id: fileId,
      },
    });

    return content.blobContent;
  }

  async getListFiles(objectId: number) {
    const list = await this.prisma.objectsFiles.findMany({
      where: {
        objectsId: objectId,
      },
      select: {
        id: true,
        createdAt: true,
        name: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return list;
  }
}
