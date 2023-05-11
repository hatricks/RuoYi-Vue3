<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="培训计划名称" prop="trainTitle">
        <el-input
          v-model="queryParams.trainTitle"
          placeholder="请输入培训计划名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="培训人" prop="trainPersonName">
        <el-input
          v-model="queryParams.trainPersonName"
          placeholder="请输入培训人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="培训时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeTrainDatetime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="培训地址" prop="trainAddress">
        <el-input
          v-model="queryParams.trainAddress"
          placeholder="请输入培训地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeCreateDate"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['manage:management:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:management:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:management:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['manage:management:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="managementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="培训计划名称" align="center" prop="trainTitle" />
      <el-table-column label="培训人" align="center" prop="trainPersonName" />
      <el-table-column label="培训宗旨" align="center" prop="trainMessage" />
      <el-table-column label="培训时间" align="center" prop="trainDatetime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.trainDatetime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="培训地址" align="center" prop="trainAddress" />
      <el-table-column label="培训计划详情" align="center" prop="trainDesc" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:management:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:management:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改培训管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="managementRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="培训计划名称" prop="trainTitle">
          <el-input v-model="form.trainTitle" placeholder="请输入培训计划名称" />
        </el-form-item>
        <el-form-item label="培训人" prop="trainPersonName">
          <el-input v-model="form.trainPersonName" placeholder="请输入培训人" />
        </el-form-item>
        <el-form-item label="培训宗旨" prop="trainMessage">
          <el-input v-model="form.trainMessage" placeholder="请输入培训宗旨" />
        </el-form-item>
        <el-form-item label="培训时间" prop="trainDatetime">
          <el-date-picker clearable
            v-model="form.trainDatetime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择培训时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="培训地址" prop="trainAddress">
          <el-input v-model="form.trainAddress" placeholder="请输入培训地址" />
        </el-form-item>
        <el-form-item label="培训计划详情" prop="trainDesc">
          <el-input v-model="form.trainDesc" placeholder="请输入培训计划详情" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Management">
import { listManagement, getManagement, delManagement, addManagement, updateManagement } from "@/api/manage/management";

const { proxy } = getCurrentInstance();

const managementList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeTrainDatetime = ref([]);
const daterangeCreateDate = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    trainTitle: null,
    trainPersonName: null,
    trainDatetime: null,
    trainAddress: null,
    createDate: null,
  },
  rules: {
    trainTitle: [
      { required: true, message: "培训计划名称不能为空", trigger: "blur" }
    ],
    trainPersonName: [
      { required: true, message: "培训人不能为空", trigger: "blur" }
    ],
    trainDatetime: [
      { required: true, message: "培训时间不能为空", trigger: "blur" }
    ],
    trainAddress: [
      { required: true, message: "培训地址不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询培训管理列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeTrainDatetime && '' != daterangeTrainDatetime) {
    queryParams.value.params["beginTrainDatetime"] = daterangeTrainDatetime.value[0];
    queryParams.value.params["endTrainDatetime"] = daterangeTrainDatetime.value[1];
  }
  if (null != daterangeCreateDate && '' != daterangeCreateDate) {
    queryParams.value.params["beginCreateDate"] = daterangeCreateDate.value[0];
    queryParams.value.params["endCreateDate"] = daterangeCreateDate.value[1];
  }
  listManagement(queryParams.value).then(response => {
    managementList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    trainTitle: null,
    trainPersonName: null,
    trainMessage: null,
    trainDatetime: null,
    trainAddress: null,
    trainDesc: null,
    createDate: null,
    updateDate: null
  };
  proxy.resetForm("managementRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeTrainDatetime.value = [];
  daterangeCreateDate.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加培训管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getManagement(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改培训管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["managementRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateManagement(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addManagement(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除培训管理编号为"' + _ids + '"的数据项？').then(function() {
    return delManagement(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/management/export', {
    ...queryParams.value
  }, `management_${new Date().getTime()}.xlsx`)
}

getList();
</script>
