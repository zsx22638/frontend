<script setup>
import { reactive, ref, onMounted } from "vue";
import { getAllResume, checkResume, deleteResume } from "@/api/jobSeeker/index.js";
import message from "@/utils/message.js";

const resumeList = ref([]);
const resumeData = reactive({
  userName: "",
  status: 0, // 0 = 待审核, 1 = 通过, 2 = 驳回
  pageNum: 1,
  pageSize: 5,
  total: 0,
});
const loading = ref(true);

const visible = reactive({});

// 获取简历列表
const getResumeList = async () => {
  loading.value = true;
  const res = await getAllResume(resumeData);
  loading.value = false;
  if (res.code === 200) {
    resumeList.value = res.data.records;
    resumeData.total = res.data.total;

    // 初始化每行的弹出框状态
    res.data.records.forEach((row) => {
      visible[row.resumeId] = false;
    });
  }
};

// 搜索
const getSearch = () => {
  getResumeList();
};

// 分页逻辑
const handleSizeChange = (val) => {
  resumeData.pageSize = val;
  getResumeList();
};
const handleCurrentChange = (val) => {
  resumeData.pageNum = val;
  getResumeList();
};

// 审核简历状态
const checkResumeStatus = async (id, status) => {
  const res = await checkResume({ id, status });
  if (res.code === 200) {
    message.success(status === 1 ? "简历通过" : "简历驳回");
    getResumeList();
  } else {
    message.error(res.message);
  }
};

// 删除简历
const deleteResumeItem = async (id) => {
  const res = await deleteResume(id);
  if (res.code === 200) {
    visible[id] = false;
    message.success("删除成功");
    getResumeList();
  } else {
    message.error("删除失败");
  }
};

// 控制删除弹出框显示/关闭
const showPopover = (id) => {
  visible[id] = true;
};
const closePopover = (id) => {
  visible[id] = false;
};

onMounted(() => {
  getResumeList();
});
</script>

<template>
  <div class="container">
    <!-- 搜索 -->
    <div class="search">
      <el-input v-model="resumeData.userName" placeholder="请输入用户名" />
      <el-button type="primary" @click="getSearch">搜索</el-button>
      <el-select v-model="resumeData.status" placeholder="请选择简历状态" @change="getResumeList">
        <el-option label="待审核" :value="0" />
        <el-option label="通过" :value="1" />
        <el-option label="驳回" :value="2" />
      </el-select>
    </div>

    <!-- 表格 -->
    <div class="table">
      <el-table :data="resumeList"  v-loading="loading">
        <el-table-column prop="name" label="姓名" width="200" />
        <el-table-column prop="contact" label="联系方式" width="200" />
        <el-table-column prop="resumeUrl" label="简历链接" width="250">
          <template #default="{ row }">
            <a :href="row.resumeUrl" target="_blank">查看简历</a>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template #default="{ row }">
            <el-tag
                :type="row.status === 1 ? 'success' : row.status === 2 ? 'danger' : 'warning'"
            >
              {{ row.status === 0 ? '待审核' : row.status === 1 ? '通过' : '驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="targetPosition" label="目标职位" width="200" />
        <el-table-column prop="description" label="简历描述" width="300" />
        <el-table-column prop="skills" label="技能" width="200" />

        <!-- 操作 -->
        <el-table-column fixed="right" label="操作" width="300">
          <template #default="{ row }">
            <!-- 状态为待审核 -->
            <el-button
                v-if="row.status === 0"
                plain
                type="primary"
                size="small"
                @click="checkResumeStatus(row.resumeId, 1)"
            >
              通过
            </el-button>
            <el-button
                v-if="row.status === 0"
                plain
                type="danger"
                size="small"
                @click="checkResumeStatus(row.resumeId, 2)"
            >
              驳回
            </el-button>

            <!-- 状态为已通过 -->
            <el-button
                v-if="row.status === 1"
                plain
                type="danger"
                size="small"
                @click="checkResumeStatus(row.resumeId, 2)"
            >
              驳回
            </el-button>

            <!-- 状态为已驳回 -->
            <el-button
                v-if="row.status === 2"
                plain
                type="primary"
                size="small"
                @click="checkResumeStatus(row.resumeId, 1)"
            >
              通过
            </el-button>

            <!-- 删除 -->
            <el-popover v-model:visible="visible[row.resumeId]" placement="top" trigger="click">
              <template #default>
                <p>确认删除该简历？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" text @click="closePopover(row.resumeId)">取消</el-button>
                  <el-button size="small" type="primary" @click="deleteResumeItem(row.resumeId)">
                    确认
                  </el-button>
                </div>
              </template>
              <template #reference>
                <el-button
                    type="danger"
                    size="small"
                    @click.stop="showPopover(row.resumeId)"
                >
                  删除
                </el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
        v-model:current-page="resumeData.pageNum"
        v-model:page-size="resumeData.pageSize"
        :total="resumeData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, sizes, total"
    />
  </div>
</template>


<style scoped>
.container {
  padding: 20px;
}
.search {
  display: flex;
  width: 400px;
  gap: 20px;
  margin-bottom: 20px;
}
.table {
  margin-top: 20px;
}
</style>
