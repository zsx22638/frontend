<script setup>
import { reactive, ref, onMounted } from "vue";
import { getAllResume, checkResume, deleteResume } from "@/api/jobSeeker/index.js";
import message from "@/utils/message.js";

// 初始化简历列表
const resumeList = ref([]); // 改为 ref 以确保响应式更新

// 页码数据
const resumeData = reactive({
  userName: '',
  status: 0,  // 0 = 待审核, 1 = 已通过, 2 = 已驳回
  pageNum: 1,
  pageSize: 5,
  total: 0,
});

// 初始化加载
const loading = ref(true)


// 控制每个删除按钮的弹出框显示
const visible = reactive({}); // 改为 reactive 确保动态属性响应式

// 获取简历列表数据
const getResumeList = async () => {
  loading.value = true;
  const res = await getAllResume(resumeData);
  loading.value = false;
  if (res.code === 200) {
    resumeList.value = res.data.records; // 确保响应式赋值
    resumeData.total = res.data.total;  // 修正 total 数据路径

    // 重新初始化 visible
    Object.keys(visible).forEach((key) => delete visible[key]);
    res.data.records.forEach((row) => {
      visible[row.resumeId] = false;
    });
  }
    console.log('初始化的：',visible);

};

// 搜索功能
const getSearch = () => {
  getResumeList();
};

// 处理分页大小变化
const handleSizeChange = (val) => {
  resumeData.pageSize = val;
  getResumeList();
};

// 处理当前页变化
const handleCurrentChange = (val) => {
  resumeData.pageNum = val;
  getResumeList();
};

// 审核简历
const checkResumeStatus = async (id, status) => {

  const data = { id, status };
  const res = await checkResume(data);

  console.log(res)
  if (res.code === 200) {
    message.success("操作成功");
    getResumeList(); // 更新简历列表
  } else {
    message.error(res.message);
  }
};

// 删除简历
const deleteResumeItem = async (id) => {
  const res = await deleteResume(id);
  console.log('删除前的：',res,id);
  if (res.code === 200) {
    visible[id] = false; // 更新 visible 的状态
    console.log('更新后的：',visible);
    message.success("删除成功");
    getResumeList(); // 刷新简历列表
  } else {
    message.error("删除失败");
  }
};

// 关闭弹出框
const handlePopoverClose = (resumeId) => {
  visible[resumeId] = false;
  console.log('关闭后的：',visible);
};

const showPopover = (resumeId) => {
  visible[resumeId] = true;
  console.log('显示后的：',visible);
};

// 页面加载时获取数据
onMounted(() => {
  getResumeList();
});



</script>

<template>
  <div class="container">
    <!-- 搜索框 -->
    <div class="search">
      <el-input v-model="resumeData.userName" placeholder="请输入用户名"/>
      <el-button type="primary" @click="getSearch">搜索</el-button>
      <el-select v-model="resumeData.status" placeholder="请选择简历状态"  @change="getResumeList">
        <el-option label="待审核" :value="0"/>
        <el-option label="已通过" :value="1"/>
        <el-option label="已驳回" :value="2"/>
      </el-select>

    </div>

    <div class="table">
      <!-- 表格显示简历列表 -->
      <el-table  v-loading="loading" :data="resumeList" :header-cell-style="{
            'background-color': '#1989fa',
            'color': '#fff',
            'font-weight': '400'
        }" style="width: 100%" :row-style="{height:60+'px'}">
        <el-table-column prop="name" label="姓名" width="200"/>
        <el-table-column prop="contact" label="联系方式" width="200"/>

        <el-table-column prop="resumeUrl" label="简历链接" width="250">
          <template #default="{ row }">
            <a :href="row.resumeUrl" target="_blank">查看简历</a>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template #default="{ row }">
            <el-tag
                :type="row.status === 1 ? 'success' : (row.status === 2 ? 'danger' : 'warning')"
                :style="{ borderRadius: '50%', padding: '5px 10px', fontSize: '14px' }">
              {{ row.status === 1 ? '发布成功' : (row.status === 2 ? '已驳回' : '待审核') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="targetPosition" label="目标职位" width="200"/>
        <el-table-column prop="description" label="简历描述" width="300"/>
        <el-table-column prop="skills" label="技能" width="200"/>



        <el-table-column fixed="right" label="操作" min-width="220">
          <template #default="{ row }">
            <!-- 状态为待审核 -->
            <template v-if="row.status === 0">
              <el-button plain type="primary" size="small" @click="checkResumeStatus(row.resumeId, 1)">
                通过
              </el-button>
              <el-button plain type="danger" size="small" @click="checkResumeStatus(row.resumeId, 2)">
                驳回
              </el-button>
              <el-popover :visible="visible[row.resumeId]" placement="top" trigger="click" :width="160">
                <template #default>
                  <p>你确定要删除吗?</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="small" text @click="handlePopoverClose(row.resumeId)">取消</el-button>
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

            <!-- 状态为已通过 -->
            <template v-else-if="row.status === 1">
              <el-button plain type="danger" size="small" @click="checkResumeStatus(row.resumeId, 2)">
                驳回
              </el-button>
              <el-popover :visible="visible[row.resumeId]" placement="top" trigger="click" :width="160" >
                <template #default>
                  <p>你确定要删除吗?</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="small" text @click="handlePopoverClose(row.resumeId)">取消</el-button>
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

            <!-- 状态为已驳回 -->
            <template v-else>
              <el-button plain type="primary" size="small" @click="checkResumeStatus(row.resumeId, 1)">
                通过
              </el-button>
              <el-popover :visible="visible[row.resumeId]" placement="top" trigger="click" :width="160">
                <template #default>
                  <p>你确定要删除吗?</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="small" text @click="handlePopoverClose(row.resumeId)">取消</el-button>
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
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div class="foot">
      <!-- 分页 -->
      <el-pagination
          v-model:current-page="resumeData.pageNum"
          v-model:page-size="resumeData.pageSize"
          :page-sizes="[5, 10, 30, 50]"
          layout="prev, pager, next, sizes, total"
          :total="resumeData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 20px;

  .table {
    margin: 20px;
    width: 100%;
  }

  .search {
    width: 400px;
    display: flex;
    gap: 30px;
  }
}
</style>
