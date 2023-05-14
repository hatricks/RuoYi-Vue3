<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="考试名称" prop="examName">
                <el-input
                        v-model="queryParams.examName"
                        placeholder="请输入考试名称"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="开考时间" prop="examDateTime">
                <el-date-picker clearable
                                v-model="queryParams.examDateTime"
                                type="datetime"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                placeholder="请选择开考时间">
                </el-date-picker>
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
                        v-hasPermi="['system:exam:add']"
                >新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="success"
                        plain
                        icon="Edit"
                        :disabled="single"
                        @click="handleUpdate"
                        v-hasPermi="['system:exam:edit']"
                >修改
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="danger"
                        plain
                        icon="Delete"
                        :disabled="multiple"
                        @click="handleDelete"
                        v-hasPermi="['system:exam:remove']"
                >删除
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="warning"
                        plain
                        icon="Download"
                        @click="handleExport"
                        v-hasPermi="['system:exam:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="examList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="考试编号" align="center" prop="id"/>
            <el-table-column label="考试名称" align="center" prop="examName"/>
            <el-table-column label="开考时间" align="center" prop="examDateTime" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.examDateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="考试类型" align="center" prop="examType"/>
            <el-table-column label="考试基准分" align="center" prop="examScore"/>
            <el-table-column label="创建时间" align="center" prop="createDate" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.createDate) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateDate" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.updateDate) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                               v-hasPermi="['system:exam:edit']">修改
                    </el-button>
                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                               v-hasPermi="['system:exam:remove']">删除
                    </el-button>
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

        <!-- 添加或修改考试管理对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="examRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="考试名称" prop="examName">
                    <el-input v-model="form.examName" placeholder="请输入考试名称"/>
                </el-form-item>
                <el-form-item label="开考时间" prop="examDateTime">
                    <el-date-picker clearable
                                    v-model="form.examDateTime"
                                    type="datetime"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value-format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择开考时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="考试类型" prop="examName">
                    <el-input v-model="form.examType" placeholder="请输入考试类型"/>
                </el-form-item>
                <el-form-item label="考试基准分" prop="examName">
                    <el-input v-model="form.examScore" placeholder="请输入考试基准分"/>
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

<script setup name="Exam">
import {listExam, getExam, delExam, addExam, updateExam} from "@/api/system/exam";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import {parseTime} from "@/utils/ruoyi";

const {proxy} = getCurrentInstance();

const examList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeCreateDate = ref([]);

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        examName: null,
        examDateTime: null,
        examType: null,
        examSocre: null,
        createDate: null,
    },
    pickerOptions: {
        start: '07:00',
        step: '00:30',
        end: '20:30'
    },
    rules: {}
});

const {queryParams, form, rules, pickerOptions} = toRefs(data);

/** 查询考试管理列表 */
function getList() {
    loading.value = true;
    queryParams.value.params = {};
    if (null != daterangeCreateDate && '' != daterangeCreateDate) {
        queryParams.value.params["beginCreateDate"] = daterangeCreateDate.value[0];
        queryParams.value.params["endCreateDate"] = daterangeCreateDate.value[1];
    }
    listExam(queryParams.value).then(response => {
        examList.value = response.rows;
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
        examName: null,
        examDateTime: null,
        examType: null,
        examSocre: null,
        createDate: null,
        updateDate: null
    };
    proxy.resetForm("examRef");
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
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
    title.value = "添加考试管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getExam(_id).then(response => {
        form.value = response.data;
        open.value = true;
        title.value = "修改考试管理";
    });
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["examRef"].validate(valid => {
        if (valid) {
            if (form.value.id != null) {
                updateExam(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    getList();
                });
            } else {
                addExam(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除考试管理编号为"' + _ids + '"的数据项？').then(function () {
        return delExam(_ids);
    }).then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download('system/exam/export', {
        ...queryParams.value
    }, `exam_${new Date().getTime()}.xlsx`)
}

getList();
</script>
