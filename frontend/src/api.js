import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const expensesApi = {
  getAll() {
    return axios.get(`${API_URL}/expenses`)
  },
  getOne(id) {
    return axios.get(`${API_URL}/expenses/${id}`)
  },
  create(expense) {
    return axios.post(`${API_URL}/expenses`, expense)
  },
  update(id, expense) {
    return axios.put(`${API_URL}/expenses/${id}`, expense)
  },
  delete(id) {
    return axios.delete(`${API_URL}/expenses/${id}`)
  }
}

export const categoriesApi = {
  getAll() {
    return axios.get(`${API_URL}/categories`)
  },
  create(category) {
    return axios.post(`${API_URL}/categories`, category)
  },
  delete(id) {
    return axios.delete(`${API_URL}/categories/${id}`)
  }
}