import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardsController } from './flashcards.controller';
import { FlashcardsService } from './flashcards.service';
import { FlashcardSet } from './entities/flashcard-set.entity';
import { Flashcard } from './entities/flashcard.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FlashcardSet, Flashcard]), AuthModule],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
})
export class FlashcardsModule {}
