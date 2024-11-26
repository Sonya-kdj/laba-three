import { NextFunction, Request, Response, Router } from 'express'
import { PostController } from '../controllers/PostController'
import { authMiddleware } from '../middleware/authMiddleware'

const postRouter = Router()

// Защищенные маршруты для постов
postRouter.post(
	'/',
	authMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await PostController.createPost(req, res)
		} catch (err) {
			next(err)
		}
	}
)

postRouter.put(
	'/:id',
	authMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await PostController.updatePost(req, res)
		} catch (err) {
			next(err)
		}
	}
)

postRouter.delete(
	'/:id',
	authMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await PostController.deletePost(req, res)
		} catch (err) {
			next(err)
		}
	}
)

postRouter.get(
	'/',
	authMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await PostController.getAllPosts(req, res)
		} catch (err) {
			next(err)
		}
	}
)

postRouter.get(
	'/:id',
	authMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await PostController.getPostById(req, res)
		} catch (err) {
			next(err)
		}
	}
)

export { postRouter }
