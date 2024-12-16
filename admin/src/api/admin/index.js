import { request } from "@/utils/request.js";

//管理员登录接口
export function adminLogin(data) {
  return request({
    url: "/admin/login",
    method: "post",
    data,
  });
}

//获取管理员信息接口
export function getAdminInfo() {
  return request({
    url: "/admin/info",
  });
}

//退出登录接口
export function adminLogout() {
  return request({
    url: "/admin/logout",
    method: "post",
  });
}

//修改管理员密码接口
export function updateAdminPassword(data) {
  return request({
    url: "/admin/updatePassword",
    method: "put",
    data,
  });
}


//更新管理员信息接口
export function updateAdminInfo(data) {
  return request({
    url: "/admin/update",
    method: "post",
    data,
  });
}
