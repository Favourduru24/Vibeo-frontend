import axios from 'axios'

export const uploadConfig = axios.create({
    baseURL: 'http://localhost:3001/v1/upload'
})
