import { Injectable } from '@nestjs/common';
import { ContractorsReviews } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { IReviewStatistics } from './type/contractor.interface';
import { DtoActionPortfolio, DtoActionServices, DtoEditContractorInfo } from './dto/contractor.dto';

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

  async editContractorInfo(contractorId: number, dto: DtoEditContractorInfo) {
    const infoEdit = await this.prisma.contractors.update({
      where: {
        id: contractorId,
      },
      data: {
        legalName: dto.legalName,
        name: dto.name,
        typeCompany: dto.adress,
        mainCity: dto.adress,
        adress: dto.adress,
        countEmployees: dto.countEmployees,
        phone: dto.phone,
        email: dto.email,
        inn: dto.inn,
        descCompany: dto.descCompany,
      },
    });

    return infoEdit;
  }

  async getContractorInfo(contractorId: number) {
    const contractor = await this.prisma.contractors.findUnique({
      where: {
        id: contractorId,
      },
      include: {
        services: true,
        portfolio: true,
      },
    });

    return contractor;
  }

  async getServiceById(servicesId: number) {
    const service = await this.prisma.contractorsServices.findUnique({
      where: {
        id: servicesId,
      },
    });

    return service;
  }

  async createServices(contractorId: number, dto: DtoActionServices) {
    const newServices = await this.prisma.contractorsServices.create({
      data: {
        contractorsId: contractorId,
        servicesName: dto.servicesName,
        servicesDesc: dto.servicesDesc,
        servicesUnit: dto.servicesUnit,
        servicesSalary: dto.servicesSalary,
      },
    });

    return newServices;
  }

  async editServices(servicesId: number, dto: DtoActionServices) {
    const editServices = await this.prisma.contractorsServices.update({
      where: {
        id: servicesId,
      },
      data: {
        servicesName: dto.servicesName,
        servicesDesc: dto.servicesDesc,
        servicesUnit: dto.servicesUnit,
        servicesSalary: dto.servicesSalary,
      },
    });

    return editServices;
  }

  async deleteServices(servicesId: number) {
    const deleteServices = await this.prisma.contractorsServices.delete({
      where: {
        id: servicesId,
      },
    });

    return deleteServices;
  }

  async getPortfolioById(portfolioId: number) {
    const portfolio = await this.prisma.contarctorsPortfolio.findUnique({
      where: {
        id: portfolioId,
      },
    });

    return portfolio;
  }

  async createPortfolio(contractorId: number, dto: DtoActionPortfolio) {
    const newPortfolio = await this.prisma.contarctorsPortfolio.create({
      data: {
        name: dto.name,
        type: dto.type,
        rooms: dto.rooms,
        category: dto.category,
        footage: dto.footage,
        budget: dto.budget,
        time: dto.time,
        desc: dto.desc,
        gallery: dto.gallery,
        author: dto.author,
        contractorsId: contractorId,
      },
    });

    return newPortfolio;
  }

  async editPortfolio(portfolioId: number, dto: DtoActionPortfolio) {
    const editPortfolio = await this.prisma.contarctorsPortfolio.update({
      where: {
        id: portfolioId,
      },
      data: {
        name: dto.name,
        type: dto.type,
        rooms: dto.rooms,
        category: dto.category,
        footage: dto.footage,
        budget: dto.budget,
        time: dto.time,
        desc: dto.desc,
        gallery: dto.gallery,
        author: dto.author,
      },
    });

    return editPortfolio;
  }

  async deletePortfolio(servicesId: number) {
    const deletePortfolio = await this.prisma.contarctorsPortfolio.delete({
      where: {
        id: servicesId,
      },
    });

    return deletePortfolio;
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
