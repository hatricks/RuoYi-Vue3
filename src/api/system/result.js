import request from '@/utils/request'

// 查询成绩列表
export function listResult(query) {
  return request({
    url: '/system/result/list',
    method: 'get',
    params: query
  })
}

// 查询成绩详细
export function getResult(id) {
  return request({
    url: '/system/result/' + id,
    method: 'get'
  })
}

// 新增成绩
export function addResult(data) {
  return request({
    url: '/system/result',
    method: 'post',
    data: data
  })
}

// 修改成绩
export function updateResult(data) {
  return request({
    url: '/system/result',
    method: 'put',
    data: data
  })
}

// 删除成绩
export function delResult(id) {
  return request({
    url: '/system/result/' + id,
    method: 'delete'
  })
}
