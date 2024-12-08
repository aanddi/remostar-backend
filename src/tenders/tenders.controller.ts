import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TendersService } from './tenders.service';
import { TenderDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.deorator';

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

  @Auth()
  @Get('my/:id')
  async getMyTenders(@Param('id') userId: string) {
    return this.tendersService.getMyTenders(userId);
  }

  @Auth()
  @Post('create/:id')
  async createTender(@Param('id') userId: string, @Body() dto: TenderDto) {
    return this.tendersService.createTender(userId, dto);
  }

  @Auth()
  @Get('info/:id')
  async getTenderInfoById(@Param('id') tenderId: string) {
    return this.tendersService.getTenderInfoById(tenderId);
  }

  @Auth()
  @Put('edit/:id')
  async editTender(@Param('id') tenderId: string, @Body() dto: TenderDto) {
    return this.tendersService.editTender(tenderId, dto);
  }

  @Auth()
  @Delete('delete/:id')
  async deleteTender(@Param('id') tenderId: string) {
    return this.tendersService.deleteTender(tenderId);
  }

}
