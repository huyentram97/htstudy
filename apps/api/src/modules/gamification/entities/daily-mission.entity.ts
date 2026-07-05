import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('daily_missions')
export class DailyMission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'mission_date', type: 'date' })
  missionDate: Date;

  @Column({ name: 'mission_type', length: 50 })
  missionType: string;

  @Column({ name: 'target_value' })
  targetValue: number;

  @Column({ name: 'current_value', default: 0 })
  currentValue: number;

  @Column({ name: 'bonus_points' })
  bonusPoints: number;

  @Column({ length: 20, default: 'active' })
  status: string;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
