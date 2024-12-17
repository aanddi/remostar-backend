import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { Auth } from 'src/auth/decorators/auth.deorator';
import { DtoCreateReport, IActionsObject } from './dto/object.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Auth()
  @Get('list/owner/:id')
  async getObjectListOwner(@Param('id') userId: string) {
    return this.objectsService.getObjectListOwner(userId);
  }

  @Auth()
  @Get('list/employees/:id')
  async getListEmployees(@Param('id') contractorId: number) {
    return this.objectsService.getListEmployees(+contractorId);
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

  @Auth()
  @Get('/list')
  async getOwnersList() {
    return this.objectsService.getOwnersList();
  }

  @Auth()
  @Get('/:id/info')
  async getDashboardInfo(@Param('id') objectId: number) {
    return this.objectsService.getInfo(objectId);
  }

  @Auth()
  @Get('/reports')
  async getReportsForStatus(@Query('objectId') objectId: number, @Query('statusId') statusId: number) {
    return this.objectsService.getReportsForStatus(+objectId, +statusId);
  }

  @Auth()
  @Post('/report/:id/create')
  async createReport(@Param('id') objectId: number, @Query('statusId') statusId: number, @Body() dto: DtoCreateReport) {
    return this.objectsService.createReport(+objectId, +statusId, dto);
  }

  @Auth()
  @Post('/:id/file/upload')
  @UseInterceptors(FileInterceptor('multipartFile'))
  async uploadFile(@Param('id') objectId: number, @UploadedFile() file: Express.Multer.File) {
    return this.objectsService.uploadFile(file, +objectId);
  }

  @Auth()
  @Get('/file/:id/content')
  async getFileContent(@Param('id') fileId: number, @Res() res: Response) {
    const fileContent = await this.objectsService.getFileContent(+fileId);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(Buffer.from(fileContent));
  }

  @Auth()
  @Get('/:id/files/list')
  async getListFiles(@Param('id') objectId: number) {
    return this.objectsService.getListFiles(+objectId);
  }
}
