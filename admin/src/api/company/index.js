import { request } from "@/utils/request.js";

//获取所有公司账号
export function getCompanyAccount(data) {
    return request({
        url: "/admin/account/getAllCompanyAccount",
        method: "post",
        data,
    });
}

//封禁公司账号  /admin/account/banCompany
export function banCompanyAccount(data) {
    return request({
        url: "/admin/account/banCompany",
        method: "post",
        data,
    });
}

//解封公司账号  /admin/account/company/{companyId}/unban
export function unbanCompanyAccount(id) {
    return request({
        url: "/admin/account/company/" + id + "/unban",
        method: "put",
    });
}

//删除公司账号 /admin/account/company/{companyId}
export function deleteCompanyAccount(id) {
    return request({
        url: "/admin/account/company/" + id,
        method: "delete",
    });
}



//获取所有职位 /admin/position/getAllPosition
export function getAllPosition(data) {
    return request({
        url: "/admin/position/getAllPosition",
        method: "post",
        data,
    });
}

//审核职位  /admin/position/handlePosition
export function checkPosition(data) {
    return request({
        url: "/admin/position/handlePosition",
        method: "post",
        data,
    });
}


//删除职位 /admin/position/deletePosition/{id}
export function deletePosition(id) {
    return request({
        url: "/admin/position/deletePosition/" + id,
        method: "delete",
    });
}
