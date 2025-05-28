import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChatbotDto } from './dto/chatbot.dto';

@Injectable()
export class ChatbotService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.genAI = new GoogleGenerativeAI(
      configService.getOrThrow<string>('GEMINI_API_KEY'),
    );
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  private async getAllProducts() {
    const products = await this.prismaService.product.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        color: true,
        images: true,
        price: true,
        attributes: {
          select: {
            value: true,
            title: true,
          },
        },
      },
    });

    return products;
  }

  async generateResponse(dto: ChatbotDto) {
    const products = await this.getAllProducts();

    try {
      const language = dto.language || 'ru';

      const prompt = `
      Ты — интеллектуальный помощник по товарам.
      
      Пользователь написал: "${dto.message}"
      
      Вот список товаров:
      ${products
        .map(
          (p) =>
            `{
          "id": ${p.id},
          "title": "${p.title}",
          "description": "${p.description}",
          "category": {
            "id": "${p.category.id}",
            "title": "${p.category.title}"
          },
          "color": "${p.color}",
          "price": ${p.price},
          "images": [${p.images.map((img) => `"${img}"`).join(', ')}],
          "attributes": { ${p.attributes.map((a) => `"${a.title}": "${a.value}"`).join(', ')} }
        }`,
        )
        .join(',\n')}
      
      Проанализируй сообщение пользователя и верни только JSON следующего формата:
      
      {
        "title": "Краткий ответ по теме запроса на языке: ${language}",
        "products": [
          {
            "id": number,
            "title": string,
            "images": string[],
            "category": {id: string, title: string},
            "price": number
          }
        ]
      }
      
      Если нет подходящих товаров, верни JSON с пустым массивом: { "title": "Ничего не найдено", "products": [] }
      
      Ответ должен быть ТОЛЬКО в этом JSON-формате.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleaned = text.replace(/```json|```/g, '').trim();

      return JSON.parse(cleaned);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
