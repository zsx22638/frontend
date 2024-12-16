<script setup>
import { reactive, onMounted, ref } from "vue";
import {
  getAllJobSeekerAccount,
  banJobSeekerAccount,
  unbanJobSeekerAccount,
  deleteJobSeekerAccount,
} from "@/api/jobSeeker/index.js";
import message from "@/utils/message.js";

// 初始化求职者列表
const jobSeekerList = reactive([]);

// 页码数据
const pageData = reactive({
  name: "",
  city: "",
  pageSize: 5,
  pageNum: 1,
  total: 0,
});

const loading = ref(false);

// 获取求职者列表数据
const getJobSeekerList = async () => {
  loading.value = true;
  const res = await getAllJobSeekerAccount(pageData);
  loading.value = false;
  pageData.total = res.data.total;
  jobSeekerList.splice(0, jobSeekerList.length, ...res.data.records);
  console.log("获取的数据：", res);
};

// 搜索
const getSearch = () => {
  getJobSeekerList();
};

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageData.pageSize = val;
  getJobSeekerList();
};

// 处理当前页变化
const handleCurrentChange = (val) => {
  pageData.pageNum = val;
  getJobSeekerList();
};

// 页面加载时获取数据
onMounted(() => {
  getJobSeekerList();
});

// 封禁对话框的控制变量
const banDialogVisible = ref(false);
const unbanDialogVisible = ref(false);
const banData = ref({
  id: "",
  banReason: "",
});
const banJobSeekerName = ref("");
const unbanJobSeekerName = ref("");

// 打开封禁对话框
const openBanDialog = (row) => {
  banData.value.id = row.userId;
  banJobSeekerName.value = row.userName;
  banDialogVisible.value = true; // 显示对话框
};

// 执行封禁操作
const banJobSeeker = async () => {
  if (!banData.value.banReason) {
    message.error("请输入封禁原因");
    return;
  }

  const res = await banJobSeekerAccount(banData.value);
  if (res.code === 200) {
    message.success(res.message);
    getJobSeekerList(); // 刷新列表
  } else {
    message.error("封禁失败");
  }

  banDialogVisible.value = false; // 关闭对话框
  banData.value.banReason = ""; // 清空封禁原因
};

// 打开解封对话框
const openUnbanDialog = (row) => {
  console.log('打印：',row)
  unbanJobSeekerName.value = row.userName;
  unbanDialogVisible.value = true; // 显示解封对话框
};

// 确认解封操作
const confirmUnban = async (row) => {

  const res = await unbanJobSeekerAccount(row.userId);
  if (res.code === 200) {
    message.success("解封成功");
    row.accountStatus = 1; // 设置为正常状态
    row.banReason = null; // 清空封禁原因
  } else {
    message.error(res.message);
  }
  unbanDialogVisible.value = false; // 关闭解封对话框
};

// 删除对话框控制
const deleteDialogVisible = ref(false);
const deleteJobSeekerId = ref(null);
const deleteJobSeekerName = ref("");

// 打开删除对话框
const openDeleteDialog = (row) => {
  deleteJobSeekerId.value = row.userId;
  deleteJobSeekerName.value = row.userName;
  deleteDialogVisible.value = true;
};

// 执行删除操作
const deleteJobSeeker = async () => {
  const res = await deleteJobSeekerAccount(deleteJobSeekerId.value);
  if (res.code === 200) {
    message.success("删除成功");
    getJobSeekerList(); // 刷新列表
  } else {
    message.error("删除失败");
  }

  deleteDialogVisible.value = false; // 关闭对话框
};

// 清空封禁原因输入
const resetBanReason = () => {
  banData.value.banReason = "";
};
</script>

<template>
  <div class="container">
    <!-- 搜索框 -->
    <div class="search">
      <el-input v-model="pageData.name" placeholder="请输入求职者名字"/>
      <el-input v-model="pageData.city" placeholder="请输入所在城市"/>
      <el-button type="primary" @click="getSearch">搜索</el-button>
    </div>

   <div class="table">
     <!-- 求职者表格 -->
     <el-table
         v-loading="loading"
         :data="jobSeekerList"
         style="width: 100%"
         :row-style="{ height: 60 + 'px' }"
         :header-cell-style="{
            'background-color': '#1989fa',
            'color': '#fff',
            'font-weight': '400',
            'height': '50px'
        }"
     >
       <el-table-column prop="userName" label="用户名" width="150"/>

       <el-table-column prop="accountStatus" label="账号状态" width="120">
         <template #default="{ row }">
           <el-tag
               :type="row.accountStatus === 1 ? 'success' : 'danger'"
           >
             {{ row.accountStatus === 1 ? "正常" : "封禁" }}
           </el-tag>
         </template>
       </el-table-column>
       <el-table-column prop="userFullName" label="真实名字" width="150"/>
       <el-table-column prop="userAge" label="年龄" width="200"/>
       <el-table-column prop="userSex" label="性别" width="150"/>
       <el-table-column prop="userEmail" label="邮箱" width="200"/>
       <el-table-column prop="userPhone" label="电话" width="150"/>
       <el-table-column prop="userCity" label="所在城市" width="120"/>



       <el-table-column fixed="right" label="操作" width="300">
         <template #default="{ row }">

           <el-button plain type="danger" size="small" @click="openBanDialog(row)">
             封禁
           </el-button>

           <el-button
               plain
               type="success"
               size="small"
               @click="openUnbanDialog(row)"
           >
             解封
           </el-button>
           <el-button type="danger" size="small" @click="openDeleteDialog(row)">
             删除
           </el-button>

         </template>
       </el-table-column>
     </el-table>

   </div>

    <!-- 分页 -->
    <el-pagination
        v-model:current-page="pageData.pageNum"
        v-model:page-size="pageData.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        layout="prev, pager, next, sizes, total"
        :total="pageData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />

    <!-- 封禁对话框 -->
    <el-dialog v-model="banDialogVisible" title="封禁操作" @close="resetBanReason">
      <div class="title">封禁求职者：<b style="color: red">{{ banJobSeekerName }}</b></div>
      <el-input
          v-model="banData.banReason"
          type="textarea"
          placeholder="请输入封禁原因"
          class="inputReason"
          maxlength="100"
          show-word-limit
      ></el-input>
      <span slot="footer">
        <el-button @click="banDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="banJobSeeker">确认封禁</el-button>
      </span>
    </el-dialog>

    <!-- 解封对话框 -->
    <el-dialog v-model="unbanDialogVisible" title="解封操作">
      <div>确认解封求职者：<b>{{ unbanJobSeekerName }}</b></div>
      <span slot="footer">
        <el-button @click="unbanDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUnban(jobSeekerList.find(item => item.userName === unbanJobSeekerName))">确认解封</el-button>
      </span>
    </el-dialog>

    <!-- 删除对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="删除操作">
      <div>确认删除求职者：<b>{{ deleteJobSeekerName }}</b></div>
      <span slot="footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteJobSeeker">确认删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 可以根据需求自定义样式 */
.container {
  padding: 20px;
  .table {
    margin: 20px;
    width: 1000px;
  }
  .search {
    width: 400px;
    display: flex;
    gap: 30px;
  }
  .title {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .inputReason {
    margin-bottom: 20px;
    height: 100px;
    :deep(.el-textarea__inner) {
      resize: none !important;
    }

  }


}
</style>
