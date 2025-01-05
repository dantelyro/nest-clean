import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { PrismaServise } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CreateAccountController],
  providers: [PrismaServise],
})
export class AppModule {}
