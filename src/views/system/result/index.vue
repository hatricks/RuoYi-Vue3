<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="学生名称" prop="examStudentName">
                <el-input
                        v-model="queryParams.examStudentName"
                        placeholder="请输入学生名称"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="学生编码" prop="examStudentCode">
                <el-input
                        v-model="queryParams.examStudentCode"
                        placeholder="请输入学生编码"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="学生分数" prop="examStudentScore">
                <el-input
                        v-model="queryParams.examStudentScore"
                        placeholder="请输入学生分数"
                        clearable
                        @keyup.enter="handleQuery"
                />
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
                        v-hasPermi="['system:result:add']"
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
                        v-hasPermi="['system:result:edit']"
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
                        v-hasPermi="['system:result:remove']"
                >删除
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="warning"
                        plain
                        icon="Download"
                        @click="handleExport"
                        v-hasPermi="['system:result:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="resultList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="学生名称" align="center" prop="examStudentName"/>
            <el-table-column label="学生编码" align="center" prop="examStudentCode"/>
            <el-table-column label="学生分数" align="center" prop="examStudentScore"/>
            <el-table-column label="考试名称" align="center" prop="examName"/>
            <el-table-column label="考试类型" align="center" prop="examType"/>
            <el-table-column label="考试状态" align="center" prop="examStatus"/>
            <el-table-column label="录入时间" align="center" prop="createDateTime"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                               v-hasPermi="['system:result:edit']">修改
                    </el-button>
                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                               v-hasPermi="['system:result:remove']">删除
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

        <!-- 添加或修改成绩对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="resultRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="学生名称" prop="examStudentName">
                    <el-select
                            style="width: 100%;"
                            v-model="form.examStudentName"
                            class="m-2"
                            placeholder="请选择学生"
                    >
                        <el-option
                                v-for="item in queryParams.students"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="考试名称" prop="examId">
                    <el-select
                            style="width: 100%;"
                            v-model="form.examId"
                            class="m-2"
                            placeholder="请选择具体考试以及类别"
                    >
                        <el-option
                                v-for="item in queryParams.examList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="学生分数" prop="examStudentScore">
                    <el-input v-model="form.examStudentScore" placeholder="请输入学生分数"/>
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

<script setup name="Result">
import {listResult, getResult, delResult, addResult, updateResult} from "@/api/system/result";
import {reactive, ref, toRefs} from "vue";
import {listStudent} from "@/api/manage/student";
import {listExam} from "@/api/system/exam";

const {proxy} = getCurrentInstance();

const resultList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        examStudentName: null,
        examStudentCode: null,
        examStudentScore: null,
        examId: null,
        students: [],
        examList: []
    },
    rules: {}
});

let {queryParams, form, rules} = toRefs(data);


/** 查询学生列表 */
const getStudentList = function () {
    loading.value = true;
    listStudent().then(response => {
        console.log("所有的学生信息", response);
        queryParams.value.students = response.rows.map(x => {
            return {
                value: x.studentName + "",
                label: x.studentName,
                name: x.studentName,
                code: x.studentPassword
            }
        });
        console.log("所有的学生信息", queryParams);
        loading.value = false;
    });
}

/** 查询考试列表 */
const examList = function () {
    loading.value = true;
    listExam().then(response => {
        console.log("所有的考试信息", response);
        queryParams.value.examList = response.rows.map(x => {
            return {
                value: x.id,
                label: x.examName + '-' + x.examType,
                examScore: x.examScore,
            }
        });
        console.log("所有查询信息", queryParams);
        loading.value = false;
    });
}

/** 查询成绩列表 */
function getList() {
    loading.value = true;
    listResult(queryParams.value).then(response => {
        resultList.value = response.rows;
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
        examStudentName: null,
        examStudentCode: null,
        examStudentScore: null,
        examId: null,
        createDateTime: null,
        updateDateTime: null
    };
    proxy.resetForm("resultRef");
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
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
    title.value = "添加成绩";
    examList()
    getStudentList()
}

/** 修改按钮操作 */
function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    examList()
    getResult(_id).then(response => {
        form.value = response.data;
        open.value = true;
        title.value = "修改成绩";
    });
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["resultRef"].validate(valid => {
        if (valid) {
            if (form.value.id != null) {
                updateResult(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    getList();
                });
            } else {
                console.log("queryParam的值为", queryParams);
                console.log("查询的值为", queryParams.value.students);
                let st = queryParams.value.students.filter(x => x.name === form.value.examStudentName) || [];
                form.value.examStudentCode = st[0].code;
                addResult(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除成绩编号为"' + _ids + '"的数据项？').then(function () {
        return delResult(_ids);
    }).then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download('system/result/export', {
        ...queryParams.value
    }, `result_${new Date().getTime()}.xlsx`)
}

getList();
</script>
