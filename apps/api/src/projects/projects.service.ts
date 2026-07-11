import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "node:crypto";
import { In, Repository } from "typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Project, ProjectStatus } from "./project.entity";

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly projects: Repository<Project>) {}

  findPublic() {
    return this.projects.find({ where: { status: In([ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED]) }, order: { featured: "DESC", createdAt: "DESC" } });
  }

  async findPublicBySlug(slug: string) {
    const project = await this.projects.findOne({ where: { slug, status: In([ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED]) } });
    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  findAdmin() {
    return this.projects.find({ order: { updatedAt: "DESC" } });
  }

  async create(dto: CreateProjectDto) {
    return this.projects.save(this.projects.create({ id: randomUUID(), ...dto, status: dto.status ?? ProjectStatus.DRAFT, featured: dto.featured ?? false }));
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.projects.preload({ id, ...dto });
    if (!project) throw new NotFoundException("Project not found");
    return this.projects.save(project);
  }

  async remove(id: string) {
    const result = await this.projects.delete(id);
    if (!result.affected) throw new NotFoundException("Project not found");
    return { ok: true };
  }
}
