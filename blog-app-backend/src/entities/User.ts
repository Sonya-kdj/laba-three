import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { PasswordHistory } from './PasswordHistory'
import { Post } from './Post'

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	username!: string

	@Column({ unique: true })
	email!: string

	@Column()
	password!: string

	@Column({ default: 0 }) // 0 - user, 1 - admin
	role!: number

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	passwordExpiry!: Date

	@OneToMany(() => Post, post => post.user)
	posts!: Post[]

	@OneToMany(() => PasswordHistory, history => history.user)
	passwordHistories!: PasswordHistory[]

	// Устанавливает срок действия пароля на 151 день
	setPasswordExpiry() {
		const expiryDate = new Date()
		expiryDate.setDate(expiryDate.getDate() + 151)
		this.passwordExpiry = expiryDate
	}
}
