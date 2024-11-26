import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
	const isAuthenticated = ref(false)
	const user = ref(null)

	const login = (userData: any) => {
		isAuthenticated.value = true
		user.value = userData
	}

	const logout = () => {
		isAuthenticated.value = false
		user.value = null
	}

	return { isAuthenticated, user, login, logout }
})
