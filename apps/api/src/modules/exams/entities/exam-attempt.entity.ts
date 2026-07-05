import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exam_attempts')
export class ExamAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'exam_id' })
  examId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true })
  passed: boolean;

  @Column({ name: 'duration_seconds', nullable: true })
  durationSeconds: number;

  @Column({ type: 'jsonb', nullable: true })
  answers: { questionId: string; selectedOptions: string[]; isCorrect: boolean }[];

  @Column({ name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'submitted_at', nullable: true })
  submittedAt: Date;

  @Column({ length: 20, default: 'in_progress' })
  status: string;
}
