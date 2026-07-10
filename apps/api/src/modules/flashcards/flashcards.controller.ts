import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FlashcardsService } from './flashcards.service';

@ApiTags('Flashcards')
@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly service: FlashcardsService) {}

  @Get('sets')
  @ApiOperation({ summary: 'List all flashcard sets (public)' })
  async findAllSets() {
    const data = await this.service.findAllSets();
    return { success: true, data };
  }

  @Get('sets/:setId/cards')
  @ApiOperation({ summary: 'Get cards in a set (public)' })
  async findCards(@Param('setId') setId: string) {
    const data = await this.service.findCardsBySet(setId);
    return { success: true, data };
  }
}
