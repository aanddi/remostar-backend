import { Module } from '@nestjs/common';
import { TendersService } from './tenders.service';
import { TendersController } from './tenders.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TendersController],
  providers: [TendersService, PrismaService],
})
export class TendersModule {}
