import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742970784548 implements MigrationInterface {
    name = 'Migration1742970784548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`typeorm-demos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL COMMENT 'Demo name', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`typeorm-demos\``);
    }

}
