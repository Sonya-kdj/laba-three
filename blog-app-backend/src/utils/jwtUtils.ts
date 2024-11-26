import jwt from 'jsonwebtoken'
import { User } from '../entities/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'

// Функция для генерации токена
export function generateToken(user: User): string {
	return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' })
}

// Функция для проверки токена
export function verifyToken(token: string): any {
	try {
		return jwt.verify(token, JWT_SECRET)
	} catch (error) {
		return null
	}
}
