<script setup>
import message from "@/utils/message.js"
import { useRouter  } from "vue-router";
import {adminLogout} from "@/api/admin/index.js";
import {useAdminStore} from "@/store/admin/index.js";
const adminStore = useAdminStore();
const router = useRouter();

const handleCommand = async (command) => {
  console.log(command);
  if (command === "personal") {
    router.push('/adminInfo')
  } else if (command === "logout") {
    const res = await adminLogout();
    if (res.code === 200) {
      adminStore.clearAdminInfo();
      localStorage.clear();
      message.success("退出成功");
      router.push("/login");
    }
  }
};
</script>

<template>
  <div class="container">
    <!-- 系统标题 -->
    <div class="title">东葵招聘后台管理系统</div>

    <!-- 右侧用户操作区 -->
    <div class="right">

      <span class="username">欢迎您，钟！</span>

      <el-dropdown @command="handleCommand" trigger="hover" placement="bottom">


        <!-- 自定义触发器 -->
        <span class="avatar-trigger">
          <el-avatar
              :src="adminStore.adminAvatar"
              style="cursor: pointer"
          />
        </span>


        <!-- 下拉菜单内容 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="personal">个人信息</el-dropdown-item>
            <el-dropdown-item command="changepwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>


      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">


.container {
  background-color: #d6f4ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;

  .title {
    font-size: 32px;
    font-weight: bold;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 10px;

    .avatar-trigger {
      display: flex;
      align-items: center;
      gap: 5px;

      .username {
        font-size: 16px;
        color: #333;
        cursor: pointer;
      }
    }
  }
}
</style>
