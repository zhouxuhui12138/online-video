import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios"
import { ElMessage, ElLoading } from "element-plus"
import { BASE_URL, TIME_OUT } from "../config/constant"
import useMainStore from "@/store/useMainStore"

const mainStore = useMainStore()

const server = axios.create({
	baseURL: BASE_URL,
	timeout: TIME_OUT
})

// 请求拦截器
let loading: any = null
server.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		loading = ElLoading.service({ fullscreen: true })
		if (mainStore.token) {
			config.headers.Authorization = mainStore.token
		}
		return config
	},
	(error: AxiosError) => {
		ElMessage.error(error.message)
		return Promise.reject(error)
	}
)

// 响应拦截器
server.interceptors.response.use(
	(response: AxiosResponse) => {
		loading.close()
		const { msg, code } = response.data
		if (code === 200) {
			return response.data
		} else {
			// 处理业务错误。
			ElMessage.error(msg)
			return Promise.reject(new Error(msg))
		}
	},
	(error: AxiosError) => {
		// 处理 HTTP 网络错误
		let message = ""
		// HTTP 状态码
		const status = error.response?.status
		switch (status) {
			case 401:
				message = "token 失效，请重新登录"
				mainStore.romoveToken()
				location.reload(true)
				break
			case 403:
				message = "拒绝访问"
				break
			case 404:
				message = "请求地址错误"
				break
			case 500:
				message = "服务器故障"
				break
			default:
				message = "网络连接故障"
		}
		ElMessage.error(message)
		return Promise.reject(error)
	}
)

// 响应参数
interface ResultData {
	code: number
	msg: string
	data?: any
}

// 常用方法封装
const http = {
	get(url: string, params?: object): Promise<ResultData> {
		return server.get(url, { params })
	},
	post(url: string, params?: object): Promise<ResultData> {
		return server.post(url, params)
	},
	put(url: string, params?: object): Promise<ResultData> {
		return server.put(url, params)
	},
	delete(url: string, params?: object): Promise<ResultData> {
		return server.delete(url, { params })
	}
}

export default http
