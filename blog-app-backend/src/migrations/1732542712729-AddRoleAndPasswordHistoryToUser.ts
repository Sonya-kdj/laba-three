import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleAndPasswordHistoryToUser1732542712729 implements MigrationInterface {
    name = 'AddRoleAndPasswordHistoryToUser1732542712729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`password_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`password\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`password_history\` ADD CONSTRAINT \`FK_20c510e5ca12f63b0c915c3e2df\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`password_history\` DROP FOREIGN KEY \`FK_20c510e5ca12f63b0c915c3e2df\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`DROP TABLE \`password_history\``);
    }

}
