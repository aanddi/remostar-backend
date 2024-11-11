import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ContractorService {
  constructor(private prisma: PrismaService) {}

  async getContractorList(
    page = 1,
    perPage = 10,
    region: string,
    type?: string,
    veryfi?: string,
    tags?: string,
    sort?: string,
    search?: string,
  ) {
    const filters: any = {
      name: { contains: search },
      typeCompany: { contains: type },
      citys: { contains: region === 'Россия' ? undefined : region },
      tags: { contains: tags },
    };

    if (veryfi !== undefined) filters.veryfi = true;

    // сколько надо пропустить с учетом пагинации
    const skip = (page - 1) * perPage;

    // поиск подрядчиков
    const contractors = await this.prisma.contractors.findMany({
      where: filters,
      skip: skip,
      take: +perPage,
      select: {
        id: true,
        name: true,
        veryfi: true,
        pathLogo: true,
        mainCity: true,
        citys: true,
        typeCompany: true,
        descCompany: true,
        tags: true,
        countEmployees: true,
        reviews: {
          select: {
            id: true,
            gradeTotal: true,
          },
        },
        services: {
          select: {
            id: true,
            servicesName: true,
            servicesSalary: true,
          },
        },
      },
    });

    // подсчет найденных подрядчиков без учета пагинации
    const contractorsCount = await this.prisma.contractors.count({
      where: filters,
    });

    // Расчёт общего кол-ва страниц
    const totalPages = Math.ceil(contractorsCount / perPage);

    if (sort === 'size') contractors.sort((a, b) => b.countEmployees - a.countEmployees);

    // преобразование итогового объекта
    const contractorsResult = contractors.map(contractor => ({
      id: contractor.id,
      name: contractor.name,
      veryfi: contractor.veryfi,
      pathLogo: contractor.pathLogo,
      mainCity: contractor.mainCity,
      citys: contractor.citys,
      typeCompany: contractor.typeCompany,
      descCompany: contractor.descCompany,
      tags: contractor.tags,
      reviewCount: contractor.reviews.length,
      gradeTotal:
        contractor.reviews.reduce((acc, review) => acc + review.gradeTotal, 0) / (contractor.reviews.length || 1),
      services: contractor.services,
    }));

    if (sort === 'popularity') contractorsResult.sort((a, b) => b.reviewCount - a.reviewCount);
    if (sort === 'rating') contractorsResult.sort((a, b) => b.gradeTotal - a.gradeTotal);

    return {
      found: contractorsCount,
      page: +page,
      pages: totalPages,
      page_per: +perPage,
      items: contractorsResult,
    };
  }

  async getSuggestSearch(field: string, region?: string, type?: string, veryfi?: string, tags?: string) {
    const filters: any = {
      name: { contains: field },
      typeCompany: { contains: type },
      citys: { contains: region === 'Россия' ? undefined : region },
      tags: { contains: tags },
    };

    if (veryfi !== undefined) filters.veryfi = true;

    const contractors = await this.prisma.contractors.findMany({
      where: filters,
      select: {
        name: true,
      },
    });

    return contractors;
  }
}
