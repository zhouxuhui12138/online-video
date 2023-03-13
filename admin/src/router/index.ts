import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import pinia from "@/store"
import useMainStore from "@/store/useMainStore"

const mainStore = useMainStore(pinia)

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: () => import("@/views/layout/Layout.vue"),
		redirect: "home",
		children: [
			{
				path: "/home",
				component: () => import("@/views/home/Home.vue")
			},
			{
				path: "/user",
				component: () => import("@/views/user/User.vue")
			},
			{
				path: "/course",
				component: () => import("@/views/course/Course.vue")
			},
			{
				path: "/createCourse",
				component: () => import("@/views/course/children/CreateCourse.vue")
			},
			{
				path: "/category",
				component: () => import("@/views/category/Category.vue")
			}
		]
	},
	{
		path: "/login",
		component: () => import("@/views/login/Login.vue")
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

router.beforeEach((to, form, next) => {
	if (to.fullPath !== "/login" && !mainStore.token) {
		return next("/login")
	}

	next()
})

export default router
