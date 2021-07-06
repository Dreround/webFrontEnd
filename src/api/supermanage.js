import request from '../api/request'

export function AddOldPeople(params) {
    return request({
        url: 'http://192.168.81.25:8080/ElderManage/addElder',
        method: 'post',
        data: params
    })
}
export function deleteOldPeople(params) {
    return request({
        url: 'http://192.168.81.25:8080/ElderManage/deleteOneElder',
        method: 'get',
        params
    })
}

export function updateOldPeople(params) {
    return request({
        url: 'http://192.168.81.25:8080/ElderManage/updateElder',
        method: 'post',
        data: params
    })
}

export function findAllOldPeople(params) {
    return request({
        url: 'http://192.168.81.25:8080/ElderManage/findAll',
        method: 'get',
        data: params
    })
}