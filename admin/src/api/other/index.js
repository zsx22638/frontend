import { request } from "@/utils/request.js";

//获取所有面试情况   /admin/overall/getAllInterview
export function getAllInterview(data) {
  return request({
    url: "/admin/overall/getAllInterview",
    method: "post",
    data
  });
}



//获取求职者端的轮播图 /admin/overall/getJobseekerCarousels
export function getJobseekerCarousels() {
  return request({
    url: "/admin/overall/getJobseekerCarousels",
    method: "get"
  });
}


//获取公司端轮播图   /admin/overall/getCompanyCarousels
export function getCompanyCarousels() {
  return request({
    url: "/admin/overall/getCompanyCarousels",
    method: "get"
  });
}

/*
{
  "id": 0,
  "imageUrl": "",
  "title": "",
  "description": "",
  "targetType": 0
}
*/

//更新轮播图  /admin/overall/updateCarousel
export function updateCarousel(data) {
  return request({
    url: "/admin/overall/updateCarousel",
    method: "post",
    data
  });
}

/**
 {
 "imageUrl": "/path/admin/text",
 "title": "测试轮播图",
 "description": "公司类型",
 "targetType": 0
 }
 */


//新增轮播图  /admin/overall/addCarousel
export function addCarousel(data) {
  return request({
    url: "/admin/overall/addCarousel",
    method: "post",
    data
  });
}


//删除轮播图    /admin/overall/deleteCarousel/{id}
export function deleteCarousel(id) {
  return request({
    url: `/admin/overall/deleteCarousel/${id}`,
    method: "DELETE"
  });
}

//获取网站信息  /admin/overall/getWebsiteInfo
export function getWebsiteInfo() {
  return request({
    url: "/admin/overall/getWebsiteInfo",
    method: "GET"
  });
}

//更新网站信息 /admin/overall/updateWebsiteInfo
export function updateWebsiteInfo(data) {
  return request({
    url: "/admin/overall/updateWebsiteInfo",
    method: "post",
    data
  });
}
