import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ContractorModule } from './contractor/contractor.module';
import { TendersModule } from './tenders/tenders.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, ContractorModule, TendersModule, UserModule],
  providers: [PrismaService],
})
export class AppModule {}
