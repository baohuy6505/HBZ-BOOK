import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message
      || error.response?.data?.name?.[0]
      || error.response?.data?.title?.[0]
      || error.response?.data?.content?.[0]
      || error.response?.data?.authorId?.[0]
      || error.response?.data?.bookId?.[0]
      || error.message
      || 'An error occurred'

    return Promise.reject(new Error(message))
  }
)

export const authorApi = {
  getAll: (page = 0, size = 5) => api.get(`/authors?page=${page}&size=${size}`),
  getAllDropdown: () => api.get('/authors/all'),
  getById: (id) => api.get(`/authors/${id}`),
  create: (data) => api.post('/authors', data),
  update: (id, data) => api.put(`/authors/${id}`, data),
  delete: (id) => api.delete(`/authors/${id}`),
}

export const bookApi = {
  getAll: (page = 0, size = 5) => api.get(`/books?page=${page}&size=${size}`),
  getAllDropdown: () => api.get('/books/all'),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
}

export const reviewApi = {
  getAll: (page = 0, size = 5) => api.get(`/reviews?page=${page}&size=${size}`),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
}

export default api
