import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { Auth } from 'src/auth/decorators/auth.deorator';
import { DtoActionPortfolio, DtoActionServices, DtoEditContractorInfo } from './dto/contractor.dto';

@Controller('contractor')
export class ContractorController {
  constructor(private readonly contractorService: ContractorService) {}

  @Get('ribbon')
  async getContractorList(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('region') region: string,
    @Query('type') type: string,
    @Query('veryfi') veryfi: string,
    @Query('tags') tags: string,
    @Query('sort') sort: string,
    @Query('search') search: string,
  ) {
    return this.contractorService.getContractorList(page, perPage, region, type, veryfi, tags, sort, search);
  }

  @Get('search')
  async getSuggestSearch(
    @Query('region') region: string,
    @Query('type') type: string,
    @Query('veryfi') veryfi: string,
    @Query('tags') tags: string,
    @Query('field') field: string,
  ) {
    return this.contractorService.getSuggestSearch(field, region, type, veryfi, tags);
  }

  @Get('/:id')
  async getContractorById(@Param('id') contractorId: string) {
    return this.contractorService.getContractorById(+contractorId);
  }

  @Auth()
  @Get('info/:id')
  async getContractorInfo(@Param('id') contractorId: string) {
    return this.contractorService.getContractorInfo(+contractorId);
  }

  @Auth()
  @Get('services/:id')
  async getServiceById(@Param('id') servicesId: string) {
    return this.contractorService.getServiceById(+servicesId);
  }

  @Auth()
  @Put('info/:id/edit')
  async editContractorInfo(@Param('id') contractorId: string, @Body() dto: DtoEditContractorInfo) {
    return this.contractorService.editContractorInfo(+contractorId, dto);
  }

  @Auth()
  @Post('services/:id/create')
  async createServices(@Param('id') contractorId: string, @Body() dto: DtoActionServices) {
    return this.contractorService.createServices(+contractorId, dto);
  }

  @Auth()
  @Put('services/:id/edit')
  async editServices(@Param('id') servicesId: string, @Body() dto: DtoActionServices) {
    return this.contractorService.editServices(+servicesId, dto);
  }

  @Auth()
  @Delete('services/:id/delete')
  async deleteServices(@Param('id') servicesId: string) {
    return this.contractorService.deleteServices(+servicesId);
  }

  @Auth()
  @Get('portfolio/:id')
  async getPortfolioById(@Param('id') portfolioId: string) {
    return this.contractorService.getPortfolioById(+portfolioId);
  }

  @Auth()
  @Post('portfolio/:id/create')
  async createPortfolio(@Param('id') contractorId: string, @Body() dto: DtoActionPortfolio) {
    return this.contractorService.createPortfolio(+contractorId, dto);
  }

  @Auth()
  @Put('portfolio/:id/edit')
  async editPortfolio(@Param('id') portfolioId: string, @Body() dto: DtoActionPortfolio) {
    return this.contractorService.editPortfolio(+portfolioId, dto);
  }

  @Auth()
  @Delete('portfolio/:id/delete')
  async deletePortfolio(@Param('id') portfolioId: string) {
    return this.contractorService.deletePortfolio(+portfolioId);
  }
}
