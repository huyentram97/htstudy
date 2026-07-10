import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('flashcard_sets')
export class FlashcardSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'subject_id', nullable: true })
  subjectId: string;

  @Column({ length: 300 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'card_count', default: 0 })
  cardCount: number;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
