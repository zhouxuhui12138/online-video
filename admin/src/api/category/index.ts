import http from "@/utils/request"

// 查询全部分类
export const getAllCatApi = (data: any) => {
	return http.get(`/category/${data.page}/${data.size}`, data.data)
}

// 添加分类
export const addCatApi = (data: any) => {
	return http.post(`/category`, data)
}

// 删除分类
export const delCatApi = (id: string) => {
	return http.delete(`/category`, { id })
}

// 查询单个分类
export const getCatApi = (id: string) => {
	return http.get(`/category/${id}`)
}

// 更新分类
export const editCatApi = (data: any) => {
	return http.put(`/category`, data)
}
