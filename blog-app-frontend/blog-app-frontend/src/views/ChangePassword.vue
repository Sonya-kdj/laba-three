<template>
	<div class="change-password">
		<h1>Смена пароля пользователя</h1>
		<form @submit.prevent="changePassword">
			<div>
				<label for="email">Email пользователя:</label>
				<input
					id="email"
					v-model="email"
					type="email"
					placeholder="Введите email"
					required
				/>
			</div>
			<div>
				<label for="newPassword">Новый пароль:</label>
				<input
					id="newPassword"
					v-model="newPassword"
					type="password"
					placeholder="Введите новый пароль"
					required
				/>
			</div>
			<button type="submit">Сменить пароль</button>
		</form>
		<p v-if="message" :class="{ error: isError }">{{ message }}</p>
	</div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const email = ref('')
const newPassword = ref('')
const message = ref('')
const isError = ref(false)

const changePassword = async () => {
	try {
		const token = localStorage.getItem('token') // Получение токена из локального хранилища
		if (!token) {
			throw new Error('Необходимо войти в систему для смены пароля.')
		}

		const response = await axios.post(
			'http://localhost:3000/users/admin/change-password',
			{
				email: email.value,
				newPassword: newPassword.value,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`, // Передача токена в заголовке
				},
			}
		)

		message.value = response.data.message
		isError.value = false
		email.value = ''
		newPassword.value = ''
	} catch (error) {
		message.value =
			error.response?.data?.message || 'Произошла ошибка при смене пароля'
		isError.value = true
	}
}
</script>

<style scoped>
.change-password {
	max-width: 400px;
	margin: 0 auto;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

.error {
	color: red;
	font-size: 14px;
}
</style>
