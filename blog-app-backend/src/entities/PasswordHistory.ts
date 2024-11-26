import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class PasswordHistory {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	password!: string

	@ManyToOne(() => User, user => user.passwordHistories)
	user!: User
}
