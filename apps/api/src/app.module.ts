import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { CoursesModule } from './modules/courses/courses.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { ExamsModule } from './modules/exams/exams.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { ProgressModule } from './modules/progress/progress.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SystemConfigModule } from './modules/config/config.module';
import { AuditModule } from './modules/audit/audit.module';
import { ContentImportModule } from './modules/content-import/content-import.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'htstudy'),
        password: configService.get('DB_PASSWORD', 'htstudy_dev_pass'),
        database: configService.get('DB_DATABASE', 'htstudy'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: configService.get('DB_LOGGING', 'false') === 'true',
      }),
    }),

    // Feature modules
    HealthModule,
    AuthModule,
    UsersModule,
    RolesModule,
    CoursesModule,
    QuestionsModule,
    ExamsModule,
    GamificationModule,
    ProgressModule,
    NotificationsModule,
    SystemConfigModule,
    AuditModule,
    ContentImportModule,
  ],
})
export class AppModule {}
