import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('flashcards')
export class Flashcard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'set_id' })
  setId: string;

  @Column({ name: 'front_content', type: 'text' })
  frontContent: string;

  @Column({ name: 'back_content', type: 'text' })
  backContent: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
