import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { ProjectStatus } from "../project.entity";

export class CreateProjectDto {
  @IsString() @MinLength(2) @MaxLength(200) title!: string;
  @IsString() @MinLength(2) @MaxLength(200) slug!: string;
  @IsString() @MinLength(10) @MaxLength(10000) description!: string;
  @IsString() @MinLength(1) @MaxLength(160) category!: string;
  @IsOptional() @IsString() @MaxLength(160) industry?: string;
  @IsOptional() @IsString() @MaxLength(10000) challenge?: string;
  @IsOptional() @IsString() @MaxLength(10000) solution?: string;
  @IsOptional() @IsString() @MaxLength(10000) architecture?: string;
  @IsOptional() @IsString() @MaxLength(10000) results?: string;
  @IsArray() @ArrayMaxSize(50) @IsString({ each: true }) @MaxLength(100, { each: true }) technologies!: string[];
  @IsArray() @ArrayMaxSize(50) @IsUrl({}, { each: true }) @MaxLength(2048, { each: true }) screenshots!: string[];
  @IsOptional() @IsUrl() @MaxLength(2048) videoUrl?: string;
  @IsOptional() @IsUrl() @MaxLength(2048) liveUrl?: string;
  @IsOptional() @IsUrl() @MaxLength(2048) vercelUrl?: string;
  @IsOptional() @IsUrl() @MaxLength(2048) githubUrl?: string;
  @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus;
  @IsOptional() @IsBoolean() featured?: boolean;
}
