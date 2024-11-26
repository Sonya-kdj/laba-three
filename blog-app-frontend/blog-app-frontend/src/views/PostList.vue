<template>
	<div>
		<h1>Список постов</h1>
		<div v-if="posts.length > 0">
			<div v-for="post in posts" :key="post.id">
				<h2>{{ post.title }}</h2>
				<p>{{ post.content }}</p>
				<button @click="editPost(post.id)">Редактировать</button>
				<button @click="deletePost(post.id)">Удалить</button>
			</div>
		</div>
		<div v-else>
			<p>Постов нет</p>
		</div>
	</div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const posts = ref([]) // Массив для хранения постов
const router = useRouter()

// Загрузка всех постов
const loadPosts = async () => {
	try {
		const response = await axios.get('http://localhost:3000/posts', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
		posts.value = response.data
	} catch (error) {
		console.error('Ошибка при загрузке постов:', error)
	}
}

// Удаление поста
const deletePost = async id => {
	try {
		await axios.delete(`http://localhost:3000/posts/${id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
		posts.value = posts.value.filter(post => post.id !== id) // Удаляем пост из списка
	} catch (error) {
		console.error('Ошибка при удалении поста:', error)
	}
}

// Переход к странице редактирования
const editPost = id => {
	router.push(`/posts/edit/${id}`)
}

onMounted(loadPosts) // Загрузка постов при монтировании компонента
</script>
