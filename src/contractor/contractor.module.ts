import { Module } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { ContractorController } from './contractor.controller';
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [ContractorController],
  providers: [ContractorService, PrismaService],
})
export class ContractorModule {}
