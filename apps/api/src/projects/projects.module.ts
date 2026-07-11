import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./project.entity";
import { AdminProjectsController, PublicProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [PublicProjectsController, AdminProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule {}
