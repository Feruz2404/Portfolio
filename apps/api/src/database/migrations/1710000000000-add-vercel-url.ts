import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddVercelUrl1710000000000 implements MigrationInterface {
  name = "AddVercelUrl1710000000000";

  async up(queryRunner: QueryRunner) {
    if (!(await queryRunner.hasColumn("Project", "vercelUrl"))) {
      await queryRunner.addColumn("Project", new TableColumn({ name: "vercelUrl", type: "text", isNullable: true }));
    }
  }

  async down(queryRunner: QueryRunner) {
    if (await queryRunner.hasColumn("Project", "vercelUrl")) await queryRunner.dropColumn("Project", "vercelUrl");
  }
}
