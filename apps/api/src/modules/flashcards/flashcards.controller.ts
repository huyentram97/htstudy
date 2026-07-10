import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FlashcardsService } from './flashcards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Flashcards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly service: FlashcardsService) {}

  @Get('sets')
  @ApiOperation({ summary: 'List all flashcard sets' })
  async findAllSets() {
    const data = await this.service.findAllSets();
    return { success: true, data };
  }

  @Get('sets/:setId/cards')
  @ApiOperation({ summary: 'Get cards in a set' })
  async findCards(@Param('setId') setId: string) {
    const data = await this.service.findCardsBySet(setId);
    return { success: true, data };
  }
}
