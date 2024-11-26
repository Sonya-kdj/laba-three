import { NextFunction, Request, Response, Router } from 'express'
import { UserController } from '../controllers/UserController'
import { authMiddleware } from '../middleware/authMiddleware'
const userRouter = Router()

// Регистрация пользователя
userRouter.post(
	'/register',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await UserController.register(req, res)
		} catch (error) {
			next(error)
		}
	}
)

// Вход
userRouter.post(
	'/login',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await UserController.login(req, res)
		} catch (error) {
			next(error)
		}
	}
)

// Изменение пароля
userRouter.put(
	'/change-password',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await UserController.changePassword(req, res)
		} catch (error) {
			next(error)
		}
	}
)

// Изменение пароля пользователю администратором
userRouter.post(
	'/admin/change-password',
	authMiddleware, // Проверка авторизации
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await UserController.adminChangePassword(req, res)
		} catch (error) {
			next(error)
		}
	}
)

// Проверка срока действия пароля
userRouter.get(
	'/check-password-expiry',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await UserController.checkPasswordExpiry(req, res)
		} catch (error) {
			next(error)
		}
	}
)

export { userRouter }
