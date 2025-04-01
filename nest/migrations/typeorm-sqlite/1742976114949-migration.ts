import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1742976114949 implements MigrationInterface {
  name = 'Migration1742976114949'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "typeorm-demos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(20) NOT NULL)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "typeorm-demos"`)
  }
}
