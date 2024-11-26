<template>
	<div>
		<h1>Вход</h1>
		<form @submit.prevent="login">
			<input v-model="email" placeholder="Email" type="email" />
			<input v-model="password" placeholder="Пароль" type="password" />
			<button type="submit">Войти</button>
		</form>
		<p v-if="errorMessage" class="error">{{ errorMessage }}</p>
	</div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const userStore = useUserStore()

const login = async () => {
	try {
		// Отправляем данные на сервер для проверки авторизации
		const response = await axios.post('http://localhost:3000/users/login', {
			email: email.value,
			password: password.value,
		})

		if (response.data.token) {
			// Сохраняем токен в localStorage
			localStorage.setItem('token', response.data.token)

			// Сохраняем данные о пользователе в state (store)
			userStore.setUser(response.data.user)

			// Перенаправляем на страницу с постами
			router.push('/posts')
		} else {
			// В случае отсутствия токена, выводим ошибку
			errorMessage.value = 'Ошибка авторизации: Неверный email или пароль.'
		}
	} catch (error) {
		// Обработка ошибок при авторизации
		errorMessage.value = 'Ошибка авторизации: Неверный email или пароль.'
	}
}
</script>

<style scoped>
.error {
	color: red;
	font-size: 14px;
}
</style>
