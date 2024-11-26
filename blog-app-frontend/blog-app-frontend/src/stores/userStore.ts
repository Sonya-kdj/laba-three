// userStore.ts
import { defineStore } from 'pinia'

// Тип пользователя
interface User {
	id: number
	name: string
	email: string
	// Дополнительные поля
}

export const useUserStore = defineStore('user', {
	state: () => ({
		user: null as User | null, // Изначально null, тип данных - либо объект User, либо null
		token: localStorage.getItem('token') || '', // Хранение токена
	}),
	actions: {
		setUser(userData: User) {
			this.user = userData
			localStorage.setItem('user', JSON.stringify(userData)) // Сохраняем в localStorage
		},
		clearUser() {
			this.user = null
			localStorage.removeItem('user')
			localStorage.removeItem('token')
		},
	},
})
