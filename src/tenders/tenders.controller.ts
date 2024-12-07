import { Controller, Get, Param, Query } from '@nestjs/common';
import { TendersService } from './tenders.service';

@Controller('tenders')
export class TendersController {
  constructor(private readonly tendersService: TendersService) {}

  @Get()
  async getTenders(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('region') region: string,
    @Query('search') search: string,
  ) {
    return this.tendersService.getTenders(page, perPage, search, region);
  }

  @Get('/:id')
  async getTenderById(@Param('id') tenderId: string) {
    return this.tendersService.getTenderById(tenderId);
  }
}
