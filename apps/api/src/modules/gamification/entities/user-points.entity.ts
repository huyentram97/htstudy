import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('user_points')
export class UserPoints {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'total_points', default: 0 })
  totalPoints: number;

  @Column({ name: 'available_points', default: 0 })
  availablePoints: number;

  @Column({ name: 'current_level', default: 1 })
  currentLevel: number;

  @Column({ name: 'current_streak_days', default: 0 })
  currentStreakDays: number;

  @Column({ name: 'longest_streak_days', default: 0 })
  longestStreakDays: number;

  @Column({ name: 'last_activity_date', type: 'date', nullable: true })
  lastActivityDate: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
