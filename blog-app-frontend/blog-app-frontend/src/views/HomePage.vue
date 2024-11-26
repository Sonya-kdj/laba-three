<template>
	<div class="home-page">
		<h1>Добро пожаловать, {{ user ? user.name : 'гость' }}!</h1>
		<p v-if="!user">Пожалуйста, выберите действие:</p>
		<div v-if="!user" class="btn">
			<button @click="goToLogin">Войти</button>
			<button @click="goToRegister">Зарегистрироваться</button>
		</div>

		<div v-if="user">
			<p>Добро пожаловать, {{ user.name }}!</p>
			<div class="btn">
				<button @click="goToCreatePost">Создать пост</button>
				<button @click="goToPostsList">Просмотреть посты</button>
				<button @click="logout">Выйти</button>
				<button v-if="user.role === 1" @click="goToChangePassword">
					Сменить пароль пользователя
				</button>
			</div>
		</div>

		<!-- Модальное окно уведомления -->
		<PasswordExpiryModal ref="passwordExpiryModal" />
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import PasswordExpiryModal from '../views/PasswordExpiryModal.vue'

const router = useRouter()
const userStore = useUserStore()
const user = userStore.user
const passwordExpiryModal = ref()

const goToLogin = () => {
	router.push('/login')
}

const goToRegister = () => {
	router.push('/register')
}

const goToCreatePost = () => {
	router.push('/posts/create')
}

const goToPostsList = () => {
	router.push('/posts')
}

const goToChangePassword = () => {
	router.push('/admin/change-password')
}

const logout = () => {
	userStore.clearUser()
	router.push('/login')
}

onMounted(() => {
	if (user) {
		const passwordExpiryDate = new Date(user.passwordExpiry)
		const currentDate = new Date()

		const daysRemaining = Math.ceil(
			(passwordExpiryDate.getTime() - currentDate.getTime()) /
				(1000 * 60 * 60 * 24)
		)

		if (daysRemaining <= 7 && daysRemaining > 0) {
			passwordExpiryModal.value.showModal(daysRemaining)
		}
	}
})
</script>

<style>
.btn {
	display: flex;
	gap: 20px;
}
</style>
