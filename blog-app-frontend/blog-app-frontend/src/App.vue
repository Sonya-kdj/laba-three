<template>
	<div class="container">
		<router-view></router-view>
		<!-- Компоненты будут отображаться здесь -->
	</div>
</template>

<script setup>
// Здесь можно импортировать компоненты или логику
</script>

<style>
body {
	font-family: Arial, sans-serif;
	background-color: #f4f4f9;
	margin: 0;
	padding: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
}

h1 {
	color: #333;
}

button {
	background-color: #007bff;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 10px 20px;
	cursor: pointer;
	font-size: 16px;
	transition: background-color 0.3s ease;
}

button:hover {
	background-color: #0056b3;
}

input {
	width: 100%;
	padding: 10px;
	margin-top: 8px;
	margin-bottom: 16px;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-sizing: border-box;
	font-size: 14px;
}

form {
	display: flex;
	flex-direction: column;
}

label {
	font-weight: bold;
	margin-top: 10px;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
	background: white;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
