import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthController } from "./health.controller";
import { ProjectsModule } from "./projects/projects.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres" as const,
        url: config.getOrThrow<string>("DATABASE_URL"),
        autoLoadEntities: true,
        synchronize: false,
        retryAttempts: 2,
        ssl: config.get<string>("NODE_ENV") === "production" ? { rejectUnauthorized: false } : false
      })
    }),
    ProjectsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
