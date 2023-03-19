import http from "@/utils/request"

// 创建课程
export const createCourseApi = (data: any) => {
	return http.post(`/course`, data)
}

// 查询全部课程
export const getAllCourseApi = (data: any) => {
	return http.get(`/course/${data.page}/${data.size}`, data.data)
}

// 查询单个课程
export const getCourseApi = (id: string) => {
	return http.get(`/course/${id}`)
}

// 删除课程
export const delCourseApi = (id: string) => {
	return http.delete(`/course/${id}`)
}

// 更新课程
export const editCourseApi = (data: any) => {
	return http.put(`/course`, data)
}

// 添加课程片段
export const addSectionApi = (data: any) => {
	return http.post(`/episode`, data)
}

// 删除课程片段
export const delSectionApi = (id: string) => {
	return http.delete(`/episode/${id}`)
}

// 更新课程片段
export const editSectionApi = (data: any) => {
	return http.put(`/episode`, data)
}