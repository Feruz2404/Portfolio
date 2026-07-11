import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

export enum ProjectStatus {
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED"
}

@Entity({ name: "Project" })
export class Project {
  @PrimaryColumn({ type: "text" })
  id!: string;

  @Column({ type: "text" })
  title!: string;

  @Index({ unique: true })
  @Column({ type: "text" })
  slug!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "text", nullable: true })
  challenge!: string | null;

  @Column({ type: "text", nullable: true })
  solution!: string | null;

  @Column({ type: "text", nullable: true })
  architecture!: string | null;

  @Column({ type: "text", nullable: true })
  results!: string | null;

  @Column({ type: "text" })
  category!: string;

  @Column({ type: "text", nullable: true })
  industry!: string | null;

  @Column({ type: "text", array: true })
  technologies!: string[];

  @Column({ type: "text", array: true })
  screenshots!: string[];

  @Column({ type: "text", nullable: true })
  videoUrl!: string | null;

  @Column({ type: "text", nullable: true })
  liveUrl!: string | null;

  @Column({ type: "text", nullable: true })
  vercelUrl!: string | null;

  @Column({ type: "text", nullable: true })
  githubUrl!: string | null;

  @Column({ type: "text", nullable: true })
  clientName!: string | null;

  @Column({ type: "text", nullable: true })
  clientLogo!: string | null;

  @Column({ type: "enum", enum: ProjectStatus, enumName: "ProjectStatus" })
  status!: ProjectStatus;

  @Index()
  @Column({ type: "boolean" })
  featured!: boolean;

  @Column({ type: "timestamp", nullable: true })
  startDate!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  endDate!: Date | null;

  @Column({ type: "integer" })
  views!: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
