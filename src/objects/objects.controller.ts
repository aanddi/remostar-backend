import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { Auth } from 'src/auth/decorators/auth.deorator';
import { IActionsObject } from './dto/object.dto';

@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Auth()
  @Get('list/owner/:id')
  async getObjectListOwner(@Param('id') userId: string) {
    return this.objectsService.getObjectListOwner(userId);
  }

  @Auth()
  @Get('list/contractor/:id')
  async getObjectListContractor(@Param('id') contractorId: string) {
    return this.objectsService.getObjectListContractor(+contractorId);
  }

  @Auth()
  @Post('/:id/create')
  async createObject(@Param('id') contractorId: number, @Body() dto: IActionsObject) {
    return this.objectsService.createObject(+contractorId, dto);
  }

  @Auth()
  @Put('/:id/edit')
  async editObject(@Param('id') objectId: number, @Body() dto: IActionsObject) {
    return this.objectsService.editObject(+objectId, dto);
  }

  @Auth()
  @Patch('/:id/status')
  async editStatusObject(@Param('id') objectId: number, @Query('status') status: number) {
    return this.objectsService.editStatusObject(+objectId, +status);
  }

  @Get('/list')
  async getOwnersList() {
    return this.objectsService.getOwnersList();
  }

  @Get('/:id/info')
  async getDashboardInfo(@Param('id') objectId: number) {
    return this.objectsService.getInfo(objectId);
  }
}
