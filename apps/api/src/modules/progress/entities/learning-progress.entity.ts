import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('learning_progress')
export class LearningProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'course_id' })
  courseId: string;

  @Column({ name: 'chapter_id', nullable: true })
  chapterId: string;

  @Column({ name: 'lesson_id', nullable: true })
  lessonId: string;

  @Column({ name: 'progress_percentage', default: 0 })
  progressPercentage: number;

  @Column({ name: 'current_page', nullable: true })
  currentPage: number;

  @Column({ name: 'scroll_position', nullable: true })
  scrollPosition: number;

  @Column({ name: 'video_timestamp', nullable: true })
  videoTimestamp: number;

  @Column({ name: 'quiz_state', type: 'jsonb', nullable: true })
  quizState: any;

  @Column({ name: 'time_spent_seconds', default: 0 })
  timeSpentSeconds: number;

  @Column({ length: 20, default: 'in_progress' })
  status: string;

  @Column({ name: 'last_accessed_at' })
  lastAccessedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
