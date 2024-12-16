
import { request } from "@/utils/request.js";

//获取所有求职者账号 /admin/account/getAllJobSeekerAccount
export function getAllJobSeekerAccount(data) {
  return request({
    url: "/admin/account/getAllJobSeekerAccount",
    method: "post",
      data,
  });
}


//封禁求职者账号 /admin/account/banJobSeeker
export function banJobSeekerAccount(data) {
    return request({
        url: "/admin/account/banJobSeeker",
        method: "post",
        data,
    });
}

//解封求职者账号  /admin/account/jobSeeker/{jobSeekerId}/unban
export function unbanJobSeekerAccount(jobSeekerId) {
    return request({
        url: `/admin/account/jobSeeker/${jobSeekerId}/unban`,
        method: "put",
    });
}


//删除求职者账号 /admin/account/jobSeeker/{jobSeekerId}
export function deleteJobSeekerAccount(jobSeekerId) {
    return request({
        url: `/admin/account/jobSeeker/${jobSeekerId}`,
        method: "delete",
    });
}


//获取所有简历  /admin/resume/getAllResume
export function getAllResume(data) {
    return request({
        url: "/admin/resume/getAllResume",
        method: "post",
        data,
    });
}


//审核简历   /admin/resume/checkResume
export function checkResume(data) {
    return request({
        url: "/admin/resume/checkResume",
        method: "post",
        data,
    });
}

//删除简历  /admin/resume/deleteResume/{id}
export function deleteResume(id) {
    return request({
        url: `/admin/resume/deleteResume/${id}`,
        method: "delete",
    });
}

