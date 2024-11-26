<template>
	<div class="register-container">
		<h1>Регистрация</h1>
		<form @submit.prevent="submitForm">
			<!-- Поле для имени пользователя -->
			<div class="form-group">
				<label for="username">Имя пользователя:</label>
				<input type="text" v-model="username" id="username" required />
			</div>

			<!-- Поле для электронной почты -->
			<div class="form-group">
				<label for="email">Электронная почта:</label>
				<input type="email" v-model="email" id="email" required />
			</div>

			<!-- Поле для пароля -->
			<div class="form-group password-group">
				<label for="password">Пароль:</label>
				<div class="password-input-wrapper">
					<input
						:type="showPassword ? 'text' : 'password'"
						v-model="password"
						id="password"
						@input="validatePassword"
						required
					/>
					<button
						type="button"
						@click="togglePasswordVisibility"
						class="toggle-password"
					>
						<i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
					</button>
				</div>
				<!-- Валидация пароля -->
				<ul class="validation-messages">
					<li :class="{ valid: passwordLengthValid }">
						Длина пароля должна составлять от 10 до 14 символов
					</li>
					<li :class="{ valid: digitCountValid }">
						Пароль должен содержать не менее 3 цифр
					</li>
					<li :class="{ valid: latinLetterCountValid }">
						Пароль должен содержать не менее 2 латинских букв
					</li>
					<li :class="{ valid: specialCharCountValid }">
						Пароль должен содержать не менее 3 специальных символов
					</li>
					<li :class="{ valid: cyrillicCharCountValid }">
						Пароль должен содержать не менее 3 символов кириллицы
					</li>
				</ul>
			</div>

			<!-- Поле для подтверждения пароля -->
			<div class="form-group">
				<label for="confirmPassword">Подтверждение пароля:</label>
				<input
					type="password"
					v-model="confirmPassword"
					id="confirmPassword"
					@input="validateConfirmPassword"
					required
				/>
				<div v-if="confirmPasswordError" class="error">
					{{ confirmPasswordError }}
				</div>
			</div>

			<!-- Кнопка для отправки формы -->
			<button type="submit" :disabled="!isFormValid">Зарегистрироваться</button>
		</form>
		<!-- Сообщение об ошибке -->
		<div v-if="errorMessage" class="error">{{ errorMessage }}</div>
	</div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

// Поля ввода
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const confirmPasswordError = ref('')
const router = useRouter()
const userStore = useUserStore()

// Состояние для отображения пароля
const showPassword = ref(false)

// Локальная валидация пароля
const passwordLengthValid = computed(
	() => password.value.length >= 10 && password.value.length <= 14
)
const digitCountValid = computed(
	() => (password.value.match(/\d/g) || []).length >= 3
)
const latinLetterCountValid = computed(
	() => (password.value.match(/[a-zA-Z]/g) || []).length >= 2
)
const specialCharCountValid = computed(
	() => (password.value.match(/[\W_]/g) || []).length >= 3
)
const cyrillicCharCountValid = computed(
	() => (password.value.match(/[а-яА-ЯЁё]/g) || []).length >= 3
)

// Итоговая валидация пароля
const isPasswordValid = computed(
	() =>
		passwordLengthValid.value &&
		digitCountValid.value &&
		latinLetterCountValid.value &&
		specialCharCountValid.value &&
		cyrillicCharCountValid.value
)

// Валидация подтверждения пароля
const isConfirmPasswordValid = computed(
	() => password.value === confirmPassword.value
)

const validateConfirmPassword = () => {
	if (!isConfirmPasswordValid.value) {
		confirmPasswordError.value = 'Пароли не совпадают.'
	} else {
		confirmPasswordError.value = ''
	}
}

// Итоговая валидация всей формы
const isFormValid = computed(
	() => isPasswordValid.value && isConfirmPasswordValid.value
)

// Функция для переключения видимости пароля
const togglePasswordVisibility = () => {
	showPassword.value = !showPassword.value
}

// Функция для отображения общих ошибок
const validatePassword = () => {
	if (!isPasswordValid.value) {
		errorMessage.value = 'Пожалуйста, исправьте ошибки в пароле.'
	} else {
		errorMessage.value = ''
	}
}

// Отправка формы
const submitForm = async () => {
	if (!isFormValid.value) {
		errorMessage.value = 'Пожалуйста, исправьте ошибки в форме.'
		return
	}

	try {
		const response = await axios.post('http://localhost:3000/users/register', {
			username: username.value,
			email: email.value,
			password: password.value,
		})

		userStore.setUser(response.data.user)
		router.push('/posts') // Перенаправляем на страницу с постами после регистрации
	} catch (error: any) {
		errorMessage.value = error.response?.data?.message || 'Ошибка регистрации'
	}
}
</script>

<style scoped>
.register-container {
	width: 400px;
	margin: 0 auto;
	padding: 30px;
	border: 1px solid #ddd;
	border-radius: 8px;
	background-color: #f9f9f9;
}

h1 {
	text-align: center;
	margin-bottom: 20px;
}

.form-group {
	margin-bottom: 15px;
}

.password-group {
	position: relative;
}

.password-input-wrapper {
	display: flex;
	align-items: center;
}

.password-input-wrapper input {
	flex: 1;
}

.toggle-password {
	background: none;
	border: none;
	cursor: pointer;
	margin-left: -35px;
	padding: 0;
	font-size: 1.2em;
}

.validation-messages {
	margin-top: 10px;
	padding: 0;
	list-style: none;
}

.validation-messages li {
	color: red;
	font-size: 0.9em;
	margin-bottom: 5px;
}

.validation-messages li.valid {
	color: green;
}

button[type='submit'] {
	width: 100%;
	padding: 10px;
	background-color: #4caf50;
	border: none;
	color: white;
	font-size: 1em;
	border-radius: 4px;
	cursor: pointer;
}

button[type='submit']:disabled {
	background-color: #a5d6a7;
	cursor: not-allowed;
}

.error {
	color: red;
	margin-top: 15px;
	text-align: center;
}
</style>
