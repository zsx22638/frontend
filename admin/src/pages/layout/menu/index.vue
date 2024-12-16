<script setup>
import { useRouter } from "vue-router";

// 使用 Vue Router
const router = useRouter();
</script>

<template>
  <el-menu
      default-active="home"
      router
  >
    <!-- 首页 -->
    <el-menu-item index="/home">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shouye1"></use>
      </svg>
      <span>首页</span>
    </el-menu-item>

    <!-- 数据大屏 -->
    <el-menu-item index="/datashow">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shujudaping"></use>
      </svg>
      <span>数据大屏</span>
    </el-menu-item>

    <!-- 求职者管理 -->
    <el-sub-menu index="jobSeeker">
      <template #title>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-qiuzhizheguanli"></use>
        </svg>
        <span>求职者管理</span>
      </template>
      <el-menu-item index="/jobSeekerAccount">账号管理</el-menu-item>
      <el-menu-item index="/resume">简历管理</el-menu-item>
    </el-sub-menu>

    <!-- 招聘方管理 -->
    <el-sub-menu index="company">
      <template #title>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-lujing5891"></use>
        </svg>
        <span>招聘方管理</span>
      </template>
      <el-menu-item index="/companyAccount">账号管理</el-menu-item>
      <el-menu-item index="/position">职位管理</el-menu-item>
    </el-sub-menu>

    <!-- 其他管理 -->
    <el-sub-menu index="other">
      <template #title>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-qita"></use>
        </svg>
        <span>其他管理</span>
      </template>
      <el-menu-item index="/companyCarousels">招聘方轮播图管理</el-menu-item>
      <el-menu-item index="/jobSeekerCarousels">求职者轮播图管理</el-menu-item>
      <el-menu-item index="/interViewInfo">面试监控</el-menu-item>
      <el-menu-item index="/webInfo">网站信息管理</el-menu-item>
    </el-sub-menu>

    <!-- 管理信息 -->
    <el-menu-item index="/adminInfo">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xinxi"></use>
      </svg>
      <span>信息更新</span>
    </el-menu-item>

    <!-- 留言信箱 -->
    <el-menu-item index="/message">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-juchangxinxiang"></use>
      </svg>
      <span>留言信箱</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="scss">
</style>
