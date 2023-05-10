import request from '@/utils/request'

// 查询培训管理列表
export function listManagement(query) {
  return request({
    url: '/manage/management/list',
    method: 'get',
    params: query
  })
}

// 查询培训管理详细
export function getManagement(id) {
  return request({
    url: '/manage/management/' + id,
    method: 'get'
  })
}

// 新增培训管理
export function addManagement(data) {
  return request({
    url: '/manage/management',
    method: 'post',
    data: data
  })
}

// 修改培训管理
export function updateManagement(data) {
  return request({
    url: '/manage/management',
    method: 'put',
    data: data
  })
}

// 删除培训管理
export function delManagement(id) {
  return request({
    url: '/manage/management/' + id,
    method: 'delete'
  })
}
