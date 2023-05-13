import request from '@/utils/request'

// 查询考试学生管理列表
export function listStudent(query) {
  return request({
    url: '/manage/student/list',
    method: 'get',
    params: query
  })
}

// 查询考试学生管理详细
export function getStudent(id) {
  return request({
    url: '/manage/student/' + id,
    method: 'get'
  })
}


export function updateStudentStatus(data) {
  return request({
    url: '/manage/student/updateStatus',
    method: 'post',
    data: data
  })
}

// 新增考试学生管理
export function addStudent(data) {
  return request({
    url: '/manage/student',
    method: 'post',
    data: data
  })
}

// 修改考试学生管理
export function updateStudent(data) {
  return request({
    url: '/manage/student',
    method: 'put',
    data: data
  })
}

// 删除考试学生管理
export function delStudent(id) {
  return request({
    url: '/manage/student/' + id,
    method: 'delete'
  })
}
