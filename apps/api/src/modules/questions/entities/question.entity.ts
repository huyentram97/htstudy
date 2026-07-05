import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'subject_id', nullable: true })
  subjectId: string;

  @Column({ name: 'certification_id', nullable: true })
  certificationId: string;

  @Column({ name: 'question_type', length: 20 })
  questionType: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb' })
  options: { id: string; text: string; isCorrect: boolean }[];

  @Column({ length: 2000, nullable: true })
  explanation: string;

  @Column({ length: 10 })
  difficulty: string;

  @Column({ type: 'varchar', array: true, default: '{}' })
  tags: string[];

  @Column({ name: 'is_ai_generated', default: false })
  isAiGenerated: boolean;

  @Column({ length: 20, default: 'draft' })
  status: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
