import "dotenv/config";
import { DataSource } from "typeorm";
import { Project } from "../projects/project.entity";

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Project],
  migrations: ["src/database/migrations/*.{ts,js}"],
  synchronize: false
});
