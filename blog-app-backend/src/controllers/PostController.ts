import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Post } from '../entities/Post'
import { User } from '../entities/User'

class PostController {
	// Создание нового поста
	static async createPost(req: Request, res: Response): Promise<Response> {
		console.log('User from request:', req.user)

		const { title, content } = req.body

		if (!title || !content) {
			return res.status(400).json({ message: 'Title and content are required' })
		}

		if (!req.user?.id) {
			return res.status(401).json({ message: 'User not authenticated' })
		}

		const userRepository = AppDataSource.getRepository(User)
		const user = await userRepository.findOne({
			where: { id: req.user.id },
		})

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		const postRepository = AppDataSource.getRepository(Post)
		const newPost = postRepository.create({ title, content, user })
		await postRepository.save(newPost)

		return res.status(201).json(newPost)
	}

	// Получение всех постов с данными пользователей
	static async getAllPosts(req: Request, res: Response): Promise<Response> {
		try {
			const postRepository = AppDataSource.getRepository(Post)
			const posts = await postRepository.find({ relations: ['user'] }) // Включаем автора
			return res.status(200).json(posts)
		} catch (error: any) {
			console.error('Error fetching posts:', error)
			return res
				.status(500)
				.json({ message: 'Server error', error: error.message })
		}
	}

	// Получение поста по ID с пользователем
	static async getPostById(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params

			const postRepository = AppDataSource.getRepository(Post)
			const post = await postRepository.findOne({
				where: { id: Number(id) },
				relations: ['user'],
			})

			if (!post) {
				return res.status(404).json({ message: 'Post not found' })
			}

			return res.status(200).json(post)
		} catch (error: any) {
			console.error('Error fetching post:', error)
			return res
				.status(500)
				.json({ message: 'Server error', error: error.message })
		}
	}

	// Обновление поста (только для авторов)
	static async updatePost(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params
			const { title, content } = req.body

			const postRepository = AppDataSource.getRepository(Post)
			const post = await postRepository.findOne({
				where: { id: Number(id) },
				relations: ['user'],
			})

			if (!post) {
				return res.status(404).json({ message: 'Post not found' })
			}

			// Проверяем, что пользователь является автором поста
			if (post.user.id !== req.user?.id) {
				return res
					.status(403)
					.json({ message: 'You can only update your own posts' })
			}

			post.title = title || post.title
			post.content = content || post.content

			await postRepository.save(post)

			return res.status(200).json(post)
		} catch (error: any) {
			console.error('Error updating post:', error)
			return res
				.status(500)
				.json({ message: 'Server error', error: error.message })
		}
	}

	// Удаление поста
	static async deletePost(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params

			const postRepository = AppDataSource.getRepository(Post)
			const post = await postRepository.findOne({
				where: { id: Number(id) },
				relations: ['user'],
			})

			if (!post) {
				return res.status(404).json({ message: 'Post not found' })
			}

			// Проверяем, что пользователь является автором поста
			if (post.user.id !== req.user?.id) {
				return res
					.status(403)
					.json({ message: 'You can only delete your own posts' })
			}

			await postRepository.delete(post.id)

			return res.status(200).json({ message: 'Post deleted' })
		} catch (error: any) {
			console.error('Error deleting post:', error)
			return res
				.status(500)
				.json({ message: 'Server error', error: error.message })
		}
	}
}

export { PostController }
