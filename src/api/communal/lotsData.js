// 公用接口
import request from '@/utils/request'
// 灾种选择
export function minedOutArea (params) {
  return request({
    url: '/disasterkind/get',
    method: 'GET',
    params
  })
}

// 受灾区域选择
export function affectedArea (params, id) {
  return request({
    url: `/creditionrelation/pcerid/${id}`,
    method: 'GET',
    params
  })
}
