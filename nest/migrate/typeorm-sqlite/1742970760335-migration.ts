import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742970760335 implements MigrationInterface {
    name = 'Migration1742970760335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_typeorm-demos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(20) NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_typeorm-demos"("id", "name") SELECT "id", "name" FROM "typeorm-demos"`);
        await queryRunner.query(`DROP TABLE "typeorm-demos"`);
        await queryRunner.query(`ALTER TABLE "temporary_typeorm-demos" RENAME TO "typeorm-demos"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "typeorm-demos" RENAME TO "temporary_typeorm-demos"`);
        await queryRunner.query(`CREATE TABLE "typeorm-demos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(20) NOT NULL, "age" varchar(20) NOT NULL)`);
        await queryRunner.query(`INSERT INTO "typeorm-demos"("id", "name") SELECT "id", "name" FROM "temporary_typeorm-demos"`);
        await queryRunner.query(`DROP TABLE "temporary_typeorm-demos"`);
    }

}
