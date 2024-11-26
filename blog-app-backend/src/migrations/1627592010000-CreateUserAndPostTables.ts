import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserAndPostTables1627592010000
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Создание таблицы user
		await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS user (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                passwordExpiry TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)

		// Создание таблицы post
		await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS post (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                userId INT,
                FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
            );
        `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Удаление таблицы post (если миграция откатывается)
		await queryRunner.query(`
            DROP TABLE IF EXISTS post;
        `)

		// Удаление таблицы user (если миграция откатывается)
		await queryRunner.query(`
            DROP TABLE IF EXISTS user;
        `)
	}
}
