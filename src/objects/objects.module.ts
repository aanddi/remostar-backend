import { Module } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ObjectsController],
  providers: [ObjectsService, PrismaService],
})
export class ObjectsModule {}
