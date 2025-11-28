import axios from "axios";

export const courseApi = axios.create({
    baseURL: "http://localhost:4002/courses",
})

courseApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token)
        config.headers.Authorization = `Bearer ${token}`

    return config
})