import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlashcardSet } from './entities/flashcard-set.entity';
import { Flashcard } from './entities/flashcard.entity';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectRepository(FlashcardSet) private readonly setRepo: Repository<FlashcardSet>,
    @InjectRepository(Flashcard) private readonly cardRepo: Repository<Flashcard>,
  ) {}

  async findAllSets() {
    return this.setRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findCardsBySet(setId: string) {
    return this.cardRepo.find({ where: { setId }, order: { sortOrder: 'ASC' } });
  }
}
