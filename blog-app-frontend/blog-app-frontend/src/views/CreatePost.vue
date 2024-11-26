<template>
	<div class="create-post">
		<h1>Создать новый пост</h1>
		<form @submit.prevent="createPost">
			<div>
				<label for="title">Заголовок</label>
				<input type="text" v-model="newPost.title" id="title" required />
			</div>
			<div>
				<label for="content">Контент</label>
				<textarea v-model="newPost.content" id="content" required></textarea>
			</div>
			<button type="submit">Создать пост</button>
		</form>
	</div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const newPost = ref({
	title: '',
	content: '',
})

const router = useRouter()

// Функция для создания поста
const createPost = async () => {
	try {
		// Получаем токен из localStorage
		const token = localStorage.getItem('token')

		if (!token) {
			console.error('Токен не найден')
			return
		}

		// Логируем данные перед отправкой
		console.log('Данные для создания поста:', {
			title: newPost.value.title,
			content: newPost.value.content,
		})

		const response = await axios.post(
			'http://localhost:3000/posts',
			{
				title: newPost.value.title,
				content: newPost.value.content,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`, // Передаем токен в заголовке запроса
				},
			}
		)

		// При успешном создании поста перенаправляем на список постов
		console.log('Пост успешно создан:', response.data)
		router.push('/posts') // Переход на страницу со всеми постами
	} catch (error) {
		// Логируем ошибку
		console.error('Ошибка при создании поста:', error)

		// Можно добавить обработку ошибок на основе статуса
		if (error.response) {
			console.error('Ответ от сервера:', error.response.data)
		} else if (error.request) {
			console.error(
				'Запрос был отправлен, но ответа не получено:',
				error.request
			)
		} else {
			console.error('Ошибка при настройке запроса:', error.message)
		}
	}
}
</script>

<style scoped>
/* Добавь стиль по своему усмотрению */
form {
	margin-top: 20px;
}

input,
textarea {
	width: 100%;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
}

button {
	padding: 10px;
	background-color: #007bff;
	color: white;
	border: none;
	cursor: pointer;
}

button:hover {
	background-color: #0056b3;
}
</style>
