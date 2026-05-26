import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('✅ Database connected');
        return;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        this.logger.warn(`Database connection failed. Retrying... (${retries} attempts left)`);
        await new Promise((res) => setTimeout(res, 3000)); // wait 3s between retries
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}