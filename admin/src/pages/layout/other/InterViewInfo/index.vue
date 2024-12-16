<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getAllInterview } from '@/api/other/index.js';

const loading = ref(false);

// 初始化请求数据
const interviewData = reactive({
  user_fullName: '', // 真实名字
  companyName: '',    // 公司名
  pageSize: 10,       // 每页数量
  pageNum: 1,         // 当前页数
  total: 0            // 总数
});

// 格式化面试时间
const formatInterviewTime = (row, column, cellValue) => {
  const date = new Date(cellValue); // 将时间字符串转换为 Date 对象
  return date.toLocaleString(); // 格式化为本地字符串，例如：2024-11-17 14:34:00
};


const interviewList = reactive([]);  // 用来存储查询结果

// 请求数据并更新列表
const getInterviewList = async () => {
  try {
    loading.value = true;
    const res = await getAllInterview(interviewData);
    loading.value = false;
    if (res.code === 200) {
      interviewData.total = res.data.total; // 更新总数
      interviewList.splice(0, interviewList.length, ...res.data.records); // 更新列表
    }
  } catch (error) {
    console.error('获取面试数据失败:', error);
  }
};

// 页码改变
const handleSizeChange = (val) => {
  interviewData.pageSize = val;
  getInterviewList();
};

// 每页条数改变
const handleCurrentChange = (val) => {
  interviewData.pageNum = val;
  getInterviewList();
};

onMounted(() => {
  getInterviewList();
});
</script>

<template>
  <div class="interview">
    <el-table
        header-align="center"
        :scrollbar-always-on="true"
        v-loading="loading"
        :data="interviewList"
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
      <el-table-column prop="userFullName" label="真实名字" width="150"/>
      <el-table-column prop="userEmail" label="邮箱" width="200"/>
      <el-table-column prop="userPhone" label="电话" width="150"/>
      <el-table-column prop="companyName" label="公司名" width="200"/>
      <el-table-column prop="positionName" label="职位" width="250"/>
      <el-table-column prop="positionSalary" label="职位薪资" width="150"/>
      <el-table-column
          prop="interviewStatus"
          label="面试状态"
          width="120"
      >
        <template #default="{ row }">
          <el-tag v-if="row.interviewStatus === 1" type="success">已通过</el-tag>
          <el-tag v-else-if="row.interviewStatus === 0" type="warning">待处理</el-tag>
          <el-tag v-else type="danger">已拒绝</el-tag>

        </template>
      </el-table-column>

      <el-table-column
          prop="interviewTime"
          label="面试时间"
          width="200"
          :formatter="formatInterviewTime"
      />

      <el-table-column prop="interviewAddress" label="面试地址" width="300"/>
      <el-table-column prop="companyEmail" label="公司邮箱" width="200"/>
      <el-table-column prop="companyPhone" label="公司电话" width="200"/>
      <el-table-column
          label="简历链接"
          width="300"
          :formatter="(row) => row.resumeUrl"
      >
        <template #default="{ row }">
          <a v-if="row.resumeUrl" :href="row.resumeUrl" target="_blank">查看简历</a>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        v-model:current-page="interviewData.pageNum"
        v-model:page-size="interviewData.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        layout="prev, pager, next, sizes, total"
        :total="interviewData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped lang="scss">
/* 可根据需要自定义样式 */
</style>
