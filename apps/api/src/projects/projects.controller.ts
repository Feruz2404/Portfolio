import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { InternalTokenGuard } from "../common/internal-token.guard";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectsService } from "./projects.service";

@Controller("v1/projects")
export class PublicProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  findAll() { return this.projects.findPublic(); }

  @Get(":slug")
  findOne(@Param("slug") slug: string) { return this.projects.findPublicBySlug(slug); }
}

@Controller("v1/admin/projects")
@UseGuards(InternalTokenGuard)
export class AdminProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  findAll() { return this.projects.findAdmin(); }

  @Post()
  create(@Body() dto: CreateProjectDto) { return this.projects.create(dto); }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateProjectDto) { return this.projects.update(id, dto); }

  @Delete(":id")
  remove(@Param("id") id: string) { return this.projects.remove(id); }
}
