import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { PasswordHistory } from './entities/PasswordHistory'
import { Post } from './entities/Post'
import { User } from './entities/User'
export const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'localhost',
	port: 8889,
	username: 'root',
	password: 'root',
	database: 'blog_app',
	synchronize: false, // false, чтобы использовать миграции
	logging: true,
	entities: [User, Post, PasswordHistory],
	migrations: ['src/migrations/*.ts'],
	subscribers: [],
})
