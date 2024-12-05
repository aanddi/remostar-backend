import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContractorService } from './contractor.service';

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
}
