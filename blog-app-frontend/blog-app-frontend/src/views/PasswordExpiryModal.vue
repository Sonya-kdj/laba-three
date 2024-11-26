<template>
	<div v-if="isVisible" class="modal-overlay">
		<div class="modal-content">
			<h3>Внимание!</h3>
			<p>
				Ваш пароль истекает через {{ daysRemaining }} дней. Пожалуйста, смените
				пароль.
			</p>
			<button @click="closeModal">Закрыть</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)
const daysRemaining = ref(0)

const showModal = days => {
	daysRemaining.value = days
	isVisible.value = true
}

const closeModal = () => {
	isVisible.value = false
}

defineExpose({
	showModal,
})
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
}

.modal-content {
	background-color: white;
	padding: 20px;
	border-radius: 8px;
	width: 300px;
	text-align: center;
}

button {
	background-color: #4caf50;
	color: white;
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}

button:hover {
	background-color: #45a049;
}
</style>
