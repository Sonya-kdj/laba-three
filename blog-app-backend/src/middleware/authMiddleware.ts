import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const authHeader = req.headers.authorization

	if (!authHeader) {
		res.status(401).json({ message: 'Authorization header missing' })
		return // Убедимся, что выполнение прекращается
	}

	const token = authHeader.split(' ')[1]

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
			id: number
		}

		const userRepository = AppDataSource.getRepository(User)
		const user = await userRepository.findOne({ where: { id: payload.id } })

		if (!user) {
			res.status(401).json({ message: 'Invalid token.' })
			return // Убедимся, что выполнение прекращается
		}

		req.user = { id: user.id } // Предполагается, что вы добавили типизацию для req.user
		next() // Передаем управление следующему middleware
	} catch (error) {
		res.status(401).json({ message: 'Invalid or expired token.' })
		return // Убедимся, что выполнение прекращается
	}
}
