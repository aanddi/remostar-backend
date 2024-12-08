import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TenderDto } from './dto';

@Injectable()
export class TendersService {
  constructor(private prisma: PrismaService) {}

  async getTenders(page = 1, perPage = 5, search: string, region: string) {
    const filters: any = {
      address: { contains: region },
    };

    const skip = (page - 1) * perPage;

    const tenders = await this.prisma.tenders.findMany({
      where: filters,
      skip: skip,
      take: +perPage,
      select: {
        id: true,
        name: true,
        address: true,
        desc: true,
        budget: true,
        gallery: true,
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

    // подсчет найденных подрядчиков без учета пагинации
    const tendersCount = await this.prisma.tenders.count({
      where: filters,
    });

    // Расчёт общего кол-ва страниц
    const totalPages = Math.ceil(tendersCount / perPage);

    return {
      found: tendersCount,
      page: +page,
      pages: totalPages,
      page_per: +perPage,
      items: tenders,
    };
  }

  async getTenderById(tenderId: string) {
    const tender = await this.prisma.tenders.findUnique({
      where: {
        id: +tenderId,
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

    return tender;
  }

  async getMyTenders(userId: string) {
    const tenders = await this.prisma.tenders.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        address: true,
        desc: true,
        budget: true,
        gallery: true,
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

    return tenders;
  }

  async createTender(userId: string, dto: TenderDto) {
    const newTender = await this.prisma.tenders.create({
      data: {
        userId: userId,
        name: dto.name,
        budget: dto.budget,
        address: dto.address,
        desc: dto.desc,
        gallery: dto.gallery,
        rooms: dto.rooms,
        type: dto.type,
        footage: dto.footage,
        squareKitchen: dto.squareKitchen,
        squareLived: dto.squareLived,
        floor: dto.floor,
        finishing: dto.finishing,
      },
    });

    return newTender;
  }

  async getTenderInfoById(tenderId: string) {
    const tender = await this.prisma.tenders.findUnique({
      where: {
        id: +tenderId,
      },
      select: {
        name: true,
        budget: true,
        address: true,
        desc: true,
        gallery: true,
        rooms: true,
        type: true,
        footage: true,
        squareKitchen: true,
        squareLived: true,
        floor: true,
        finishing: true,
      },
    });

    return tender;
  }

  async editTender(tenderId: string, dto: TenderDto) {
    const newTender = await this.prisma.tenders.update({
      where: {
        id: +tenderId,
      },
      data: {
        name: dto.name,
        budget: dto.budget,
        address: dto.address,
        desc: dto.desc,
        gallery: dto.gallery,
        rooms: dto.rooms,
        type: dto.type,
        footage: dto.footage,
        squareKitchen: dto.squareKitchen,
        squareLived: dto.squareLived,
        floor: dto.floor,
        finishing: dto.finishing,
      },
    });

    return newTender;
  }

  async deleteTender(tenderId: string) {
    const deleteTender = await this.prisma.tenders.delete({
      where: {
        id: +tenderId,
      },
    });

    return deleteTender;
  }
}
