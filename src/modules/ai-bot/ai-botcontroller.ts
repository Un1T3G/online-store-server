import { Body, Controller, Post } from '@nestjs/common';
import { AIbotService } from './ai-bot.service';
import { AIbotDto } from './dto/ai-bot.dto';

@Controller('ai-bot')
export class AIbotController {
  constructor(private readonly chatbotService: AIbotService) {}

  @Post('/chatbot')
  async generativeResponse(@Body() dto: AIbotDto) {
    return this.chatbotService.generateResponse(dto);
  }

  @Post('/product-attributes')
  async generateProductAttributes(@Body() dto: AIbotDto) {
    return this.chatbotService.generateProductAttributes(dto);
  }
}
