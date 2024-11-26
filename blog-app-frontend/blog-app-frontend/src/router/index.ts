import {
	createRouter,
	createWebHistory,
	NavigationGuardNext,
	RouteLocationNormalized,
} from 'vue-router'
import { useUserStore } from '../stores/userStore'
import CreatePost from '../views/CreatePost.vue'
import EditPost from '../views/EditPost.vue'
import HomePage from '../views/HomePage.vue'
import Login from '../views/LoginView.vue'
import PostList from '../views/PostList.vue'
import Register from '../views/RegisterView.vue'

const requireAuth = (
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	next: NavigationGuardNext
) => {
	const userStore = useUserStore()
	if (!userStore.user && !localStorage.getItem('token')) {
		next('/login') // Перенаправляем на страницу входа, если пользователь не авторизован
	} else {
		next() // Если авторизован, продолжаем
	}
}

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: Login,
	},
	{
		path: '/register',
		name: 'Register',
		component: Register,
	},
	{
		path: '/posts',
		name: 'Home',
		component: HomePage,
		beforeEnter: requireAuth, // Защищенный маршрут
	},
	{
		path: '/',
		redirect: '/home', // Редирект на страницу выбора
	},
	{
		path: '/home',
		name: 'HomePage',
		component: HomePage,
	},
	{
		path: '/posts',
		name: 'PostList',
		component: PostList,
	},
	{
		path: '/posts/create',
		name: 'CreatePost',
		component: CreatePost,
	},
	{
		path: '/posts/edit/:id',
		name: 'EditPost',
		component: EditPost,
	},
	{
		path: '/admin/change-password',
		name: 'ChangePassword',
		component: () => import('../views/ChangePassword.vue'),
		meta: { requiresAuth: true, requiresAdmin: true },
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
