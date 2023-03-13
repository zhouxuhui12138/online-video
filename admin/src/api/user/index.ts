import http from "@/utils/request"

// 登录
export const login = (data: any) => {
	return http.post("/user/login", data)
}

// 获取人员列表
export const getUserList = (data: any) => {
	return http.get(`/user/${data.page}/${data.size}`, data.data)
}

// 删除
export const delUserApi = (id: string) => {
	return http.delete(`/user`, { id })
}

// 根据id获取用户信息
export const getUserApi = (id: string) => {
	return http.get(`/user/${id}`)
}

// 编辑用户
export const editUserApi = (data: any) => {
	return http.put(`/user`, data)
}