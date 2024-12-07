import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TendersService {
  constructor(private prisma: PrismaService) {}

  async getTenders(page = 1, perPage = 5, search: string, region: string) {
    const filters: any = {
      name: { contains: search },
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
        tags: true,
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
}
