import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { validatePassword } from '../utils/passwordUtils'

export class UserController {
	// Регистрация пользователя
	static async register(req: Request, res: Response): Promise<Response> {
		try {
			const { username, email, password } = req.body

			const userRepository = AppDataSource.getRepository(User)

			const existingUserByEmail = await userRepository.findOne({
				where: { email },
			})
			if (existingUserByEmail) {
				return res
					.status(400)
					.json({ message: 'User with this email already exists.' })
			}

			const existingUserByUsername = await userRepository.findOne({
				where: { username },
			})
			if (existingUserByUsername) {
				return res.status(400).json({ message: 'Username is already taken.' })
			}

			validatePassword(password) // Проверка пароля
			const hashedPassword = await bcrypt.hash(password, 10)

			const newUser = userRepository.create({
				username,
				email,
				password: hashedPassword,
			})
			newUser.setPasswordExpiry()

			await userRepository.save(newUser)

			return res
				.status(201)
				.json({ message: 'User created successfully', user: newUser })
		} catch (error) {
			return res.status(500).json({
				message: 'Error during registration',
				error: (error as Error).message,
			})
		}
	}

	// Вход
	static async login(req: Request, res: Response): Promise<Response> {
		try {
			const { email, password } = req.body

			const userRepository = AppDataSource.getRepository(User)
			const user = await userRepository.findOne({ where: { email } })

			if (!user || !(await bcrypt.compare(password, user.password))) {
				return res.status(400).json({ message: 'Invalid email or password.' })
			}

			// Генерация JWT токена
			const token = jwt.sign(
				{ id: user.id },
				process.env.JWT_SECRET_KEY as string,
				{ expiresIn: '1h' }
			)

			return res.status(200).json({ message: 'Login successful', user, token })
		} catch (error) {
			return res.status(500).json({
				message: 'Error during login',
				error: (error as Error).message,
			})
		}
	}

	// Изменение пароля
	static async changePassword(req: Request, res: Response): Promise<Response> {
		try {
			const { email, oldPassword, newPassword } = req.body

			const userRepository = AppDataSource.getRepository(User)
			const user = await userRepository.findOne({ where: { email } })

			if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
				return res.status(400).json({ message: 'Invalid email or password.' })
			}

			validatePassword(newPassword)
			user.password = await bcrypt.hash(newPassword, 10)
			user.setPasswordExpiry()

			await userRepository.save(user)

			return res.status(200).json({ message: 'Password changed successfully' })
		} catch (error) {
			return res.status(500).json({
				message: 'Error changing password',
				error: (error as Error).message,
			})
		}
	}
	// Изменение пароля пользователю администратором
	static async adminChangePassword(
		req: Request,
		res: Response
	): Promise<Response> {
		try {
			const { email, newPassword } = req.body

			const userRepository = AppDataSource.getRepository(User)

			// Поиск пользователя по email
			const user = await userRepository.findOne({ where: { email } })
			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			// Проверка, является ли вызывающий пользователь администратором
			const adminId = req.user?.id // Предполагается, что authMiddleware добавляет req.user
			const admin = await userRepository.findOne({ where: { id: adminId } })
			if (!admin || admin.role !== 1) {
				return res
					.status(403)
					.json({ message: 'Only administrators can change passwords.' })
			}

			// Проверка нового пароля и его хэширование
			validatePassword(newPassword)
			user.password = await bcrypt.hash(newPassword, 10)

			// Установка нового срока действия пароля
			user.setPasswordExpiry()

			// Сохранение обновленного пользователя
			await userRepository.save(user)

			return res.status(200).json({ message: 'Password changed successfully.' })
		} catch (error) {
			return res.status(500).json({
				message: 'Error changing password',
				error: (error as Error).message,
			})
		}
	}

	// Проверка срока действия пароля
	// Проверка срока действия пароля
	static async checkPasswordExpiry(
		req: Request,
		res: Response
	): Promise<Response> {
		try {
			const email = req.query.email as string | undefined
			if (!email) {
				return res.status(400).json({ message: 'Email is required.' })
			}

			const userRepository = AppDataSource.getRepository(User)
			const user = await userRepository.findOne({ where: { email } })

			if (!user) {
				return res.status(400).json({ message: 'User not found.' })
			}

			const currentDate = new Date()
			const expiryDate = new Date(user.passwordExpiry)
			const timeDiff = expiryDate.getTime() - currentDate.getTime()
			const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))

			if (daysRemaining <= 0) {
				return res.status(200).json({ message: 'Password has expired.' })
			}

			if (daysRemaining <= 7) {
				return res.status(200).json({
					message: `Your password will expire in ${daysRemaining} day(s). Please change it soon.`,
				})
			}

			return res.status(200).json({ message: 'Password is valid.' })
		} catch (error) {
			return res.status(500).json({
				message: 'Error checking password expiry',
				error: (error as Error).message,
			})
		}
	}
}
