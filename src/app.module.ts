import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ContractorModule } from './contractor/contractor.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, ContractorModule],
  providers: [PrismaService],
})
export class AppModule {}
