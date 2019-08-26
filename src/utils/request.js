import axios from 'axios'
import { api } from './api'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import router from '../router'

/**
 * 生成一个用不重复的ID
 */
function GenNonDuplicateID () {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3)
  return idStr
}

// 创建axios实例
const service = axios.create({
  baseURL: api(), // 请求地址公用部分
  // baseURL: '/api',
  timeout: 500000 // 请求超时
})

// request 拦截器
service.interceptors.request.use(
  config => {
    // console.log(config)
    config.url = config.url + '?vn=4.1.2&us=111111' + '&' + 't=' + GenNonDuplicateID()
    return config
  },
  error => {
    // console.log(error)
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // console.log(response.data)
    // if (response.data.optResult) {
    //   return response.data
    // }
    return response.data
  },
  error => {
    // console.log(error)
    return Promise.reject(error)
  }
)

export default service
