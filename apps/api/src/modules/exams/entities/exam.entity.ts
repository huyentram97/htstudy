import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'subject_id', nullable: true })
  subjectId: string;

  @Column({ name: 'certification_id', nullable: true })
  certificationId: string;

  @Column({ length: 300 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'time_limit_minutes', default: 60 })
  timeLimitMinutes: number;

  @Column({ name: 'passing_score', default: 60 })
  passingScore: number;

  @Column({ name: 'randomize_questions', default: false })
  randomizeQuestions: boolean;

  @Column({ name: 'shuffle_answers', default: false })
  shuffleAnswers: boolean;

  @Column({ name: 'question_count' })
  questionCount: number;

  @Column({ name: 'access_type', length: 20, default: 'locked' })
  accessType: string;

  @Column({ name: 'point_cost', default: 0 })
  pointCost: number;

  @Column({ length: 20, default: 'draft' })
  status: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
