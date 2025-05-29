import { Module } from '@nestjs/common';
import { AIbotService } from './ai-bot.service';
import { AIbotController } from './ai-botcontroller';

@Module({
  controllers: [AIbotController],
  providers: [AIbotService],
})
export class AIbotModule {}
