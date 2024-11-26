<template>
	<div>
		<h1>Редактировать пост</h1>
		<form @submit.prevent="updatePost">
			<div>
				<label for="title">Заголовок</label>
				<input type="text" id="title" v-model="post.title" required />
			</div>
			<div>
				<label for="content">Контент</label>
				<textarea id="content" v-model="post.content" required></textarea>
			</div>
			<button type="submit">Обновить пост</button>
		</form>
	</div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const post = ref({
	title: '',
	content: '',
})
const route = useRoute()
const router = useRouter()

// Загрузка данных поста
const loadPost = async () => {
	try {
		const response = await axios.get(
			`http://localhost:3000/posts/${route.params.id}`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		)
		post.value = response.data
	} catch (error) {
		console.error('Ошибка при загрузке поста:', error)
	}
}

// Обновление поста
const updatePost = async () => {
	try {
		await axios.put(
			`http://localhost:3000/posts/${route.params.id}`,
			{
				title: post.value.title,
				content: post.value.content,
			},
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		)
		router.push('/posts') // Перенаправление после обновления поста
	} catch (error) {
		console.error('Ошибка при обновлении поста:', error)
	}
}

onMounted(loadPost) // Загружаем данные поста при монтировании
</script>
