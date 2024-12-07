import { Injectable } from '@nestjs/common';
import { ContractorsReviews } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { IReviewStatistics } from './type/contractor.interface';

@Injectable()
export class ContractorService {
  constructor(private prisma: PrismaService) {}

  async getContractorList(
    page = 1,
    perPage = 5,
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
      mainCity: { contains: region },
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

  async getContractorById(contractorId: number) {
    const contractorInfo = await this.prisma.contractors.findUnique({
      where: {
        id: contractorId,
      },
    });

    const contractorService = await this.prisma.contractorsServices.findMany({
      where: {
        contractorsId: contractorId,
      },
    });

    const contractorReviews = await this.prisma.contractorsReviews.findMany({
      where: {
        contractorsId: contractorId,
      },
    });

    const contractorPortfolio = await this.prisma.contarctorsPortfolio.findMany({
      where: {
        contractorsId: contractorId,
      },
    });

    const statisticsReviews = this.calculateAverageReviewScores(contractorReviews);

    return {
      info: contractorInfo,
      services: contractorService,
      reviews: {
        statistics: statisticsReviews,
        items: contractorReviews,
      },
      portfolio: contractorPortfolio,
    };
  }

  private calculateAverageReviewScores = (reviews: ContractorsReviews[]): IReviewStatistics => {
    if (!reviews || reviews.length === 0) {
      return {
        gradeTotal: 0,
        gradeQuality: 0,
        gradeMaterials: 0,
        gradePrice: 0,
        gradeExperience: 0,
        gradeDeadlines: 0,
        gradeCommunication: 0,
      };
    }

    const sums = reviews.reduce(
      (acc, review) => {
        return {
          gradeTotal: acc.gradeTotal + review.gradeTotal,
          gradeQuality: acc.gradeQuality + review.gradeQuality,
          gradeMaterials: acc.gradeMaterials + review.gradeMaterials,
          gradePrice: acc.gradePrice + review.gradePrice,
          gradeExperience: acc.gradeExperience + review.gradeExperience,
          gradeDeadlines: acc.gradeDeadlines + review.gradeDeadlines,
          gradeCommunication: acc.gradeCommunication + review.gradeCommunication,
        };
      },
      {
        gradeTotal: 0,
        gradeQuality: 0,
        gradeMaterials: 0,
        gradePrice: 0,
        gradeExperience: 0,
        gradeDeadlines: 0,
        gradeCommunication: 0,
      },
    );

    const count = reviews.length;
    const averages = {
      gradeTotal: sums.gradeTotal / count,
      gradeQuality: sums.gradeQuality / count,
      gradeMaterials: sums.gradeMaterials / count,
      gradePrice: sums.gradePrice / count,
      gradeExperience: sums.gradeExperience / count,
      gradeDeadlines: sums.gradeDeadlines / count,
      gradeCommunication: sums.gradeCommunication / count,
    };

    return averages;
  };
}
