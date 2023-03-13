import { defineStore } from "pinia"
import { ref } from "vue"

export default defineStore("main", () => {
	const token = ref<string>("")

	const romoveToken = () => {
		token.value = ""
		localStorage.removeItem('token')
	}

	const addToken = (data: string) => {
		token.value = data
		localStorage.setItem('token', data)
	}

	return {
		token,
		romoveToken,
		addToken
	}
})
