import http from "@/utils/request"

// 创建课程
export const createCourseApi = (data: any) => {
	return http.post(`/course`, data)
}

// 查询全部课程
export const getAllCourseApi = (data: any) => {
	return http.get(`/course/${data.page}/${data.size}`, data.data)
}
