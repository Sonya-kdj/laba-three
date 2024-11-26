import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import { AppDataSource } from './data-source'
import { postRouter } from './routes/postRoutes'
import { userRouter } from './routes/userRoutes'
const app = express()
const PORT = 3000

dotenv.config()

app.use(bodyParser.json())

app.use(
	cors({
		origin: ['http://localhost:5173', 'http://localhost:8888'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
)

app.use((req, res, next) => {
	console.log('Request origin:', req.headers.origin)
	console.log('Request method:', req.method)
	console.log('Authorization header:', req.headers.authorization)
	next()
})

app.use('/users', userRouter)
app.use('/posts', postRouter)

AppDataSource.initialize()
	.then(() => {
		console.log('DataSource has been initialized!')
		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`)
		})
	})
	.catch(error => {
		console.error('Error during DataSource initialization:', error)
		console.error(error)
		process.exit(1)
	})
