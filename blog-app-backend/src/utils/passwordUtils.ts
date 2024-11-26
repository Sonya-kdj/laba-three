import crypto from 'crypto'

// Функция для хеширования пароля с использованием SHA-256
export function hashPassword(password: string): string {
	return crypto.createHash('sha256').update(password).digest('hex')
}

// Функция для валидации пароля
export function validatePassword(password: string): boolean {
	// Проверка длины пароля
	if (password.length < 10 || password.length > 14) {
		throw new Error('Длина пароля должна составлять от 10 до 14 символов')
	}

	// Проверка на наличие хотя бы 3 цифр
	const digitCount = (password.match(/\d/g) || []).length
	if (digitCount < 3) {
		throw new Error('Пароль должен содержать не менее 3 цифр')
	}

	// Проверка на наличие хотя бы 2 латинских букв
	const latinLetterCount = (password.match(/[a-zA-Z]/g) || []).length
	if (latinLetterCount < 2) {
		throw new Error('Пароль должен содержать не менее 2 латинских букв')
	}

	// Проверка на наличие хотя бы 3 специальных символов
	const specialCharCount = (password.match(/[\W_]/g) || []).length
	if (specialCharCount < 3) {
		throw new Error('Пароль должен содержать не менее 3 специальных символов')
	}

	// Проверка на наличие хотя бы 3 кириллических символов
	const cyrillicCharCount = (password.match(/[а-яА-ЯЁё]/g) || []).length
	if (cyrillicCharCount < 3) {
		throw new Error('Пароль должен содержать не менее 3 символов кириллицы')
	}

	// Если все проверки пройдены, возвращаем true
	return true
}
