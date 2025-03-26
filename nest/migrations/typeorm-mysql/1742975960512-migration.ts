import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742975960512 implements MigrationInterface {
    name = 'Migration1742975960512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`typeorm-demos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL COMMENT 'Demo name', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`typeorm-demos\``);
    }

}
