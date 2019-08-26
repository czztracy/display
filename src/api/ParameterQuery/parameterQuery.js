// 台账查询接口
import request from '@/utils/request'
// 选择案例接口（案例信息）
export function selectCases (params) {
  return request({
    url: 'http://116.193.41.50/tabservice/api/disaster/get/list',
    method: 'POST',
    data: params
  })
}
// 台账列表接口
export function parameterList (params) {
  return request({
    url: 'http://116.193.41.50/tabservice/api/tab/v1.0.1/get/list',
    method: 'POST',
    data: params
  })
}

// 台账导出
export function parameterImportant (params) {
  return request({
    url: 'http://116.193.41.50/tabservice/api/tab/v1.0.1/export',
    method: 'POST',
    data: params
  })
}
