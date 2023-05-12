<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
            <el-form-item label="员工名称" prop="userName">
                <el-input
                        v-model="queryParams.userName"
                        placeholder="请输入员工名称"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="员工所属部门" prop="userSourceDept">
                <el-input
                        v-model="queryParams.userSourceDept"
                        placeholder="请输入员工所属部门"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="基本薪资" prop="baseMoney">
                <el-input
                        v-model="queryParams.baseMoney"
                        placeholder="请输入基本薪资"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="保险费" prop="insuranceMoney">
                <el-input
                        v-model="queryParams.insuranceMoney"
                        placeholder="请输入保险费"
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
                        v-hasPermi="['system:salary:add']"
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
                        v-hasPermi="['system:salary:edit']"
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
                        v-hasPermi="['system:salary:remove']"
                >删除
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="warning"
                        plain
                        icon="Download"
                        @click="handleExport"
                        v-hasPermi="['system:salary:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="salaryList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="主键" align="center" prop="id"/>
            <el-table-column label="员工编号" align="center" prop="userCode"/>
            <el-table-column label="员工名称" align="center" prop="userName"/>
            <el-table-column label="员工所属部门" align="center" prop="userSourceDept"/>
            <el-table-column label="基本薪资" align="center" prop="baseMoney"/>
            <el-table-column label="保险费" align="center" prop="insuranceMoney"/>
            <el-table-column label="创建时间" align="center" prop="createDate" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.createDate) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center" prop="updateDate" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.updateDate) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                               v-hasPermi="['system:salary:edit']">修改
                    </el-button>
                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                               v-hasPermi="['system:salary:remove']">删除
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

        <!-- 添加或修改员工薪资对话框 -->
        <el-dialog :title="title" v-model="open" width="600px" append-to-body>
            <el-form ref="salaryRef" :model="form" :rules="rules" label-width="150px">
                <el-form-item label="员工编号" prop="userCode">
                    <el-input v-model="form.userCode" placeholder="请输入员工编号"/>
                </el-form-item>
                <el-form-item label="员工名称" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入员工名称"/>
                </el-form-item>
                <el-form-item label="员工所属部门" prop="userSourceDept">
                    <el-select v-model="deptNames" class="m-2" placeholder="请选择员工所属部门">
                        <el-option
                                v-for="item in deptNames"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                    <!--                    <el-input v-model="form.userSourceDept" placeholder="请选择员工所属部门"/>-->
                </el-form-item>
                <el-form-item label="基本薪资" prop="baseMoney">
                    <el-input v-model="form.baseMoney" placeholder="请输入基本薪资"/>
                </el-form-item>
                <el-form-item label="保险费" prop="insuranceMoney">
                    <el-input v-model="form.insuranceMoney" placeholder="请输入保险费"/>
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

<script setup name="Salary">
import {listSalary, getSalary, delSalary, addSalary, updateSalary} from "@/api/system/salary";
import {parseTime} from "@/utils/ruoyi";
import {getCurrentInstance, nextTick, reactive, ref, toRefs} from "vue";
import {listDept} from '@/api/system/dept';
import {handleThemeStyle} from "@/utils/theme";
import useSettingsStore from "@/store/modules/settings";

const {proxy} = getCurrentInstance();

const salaryList = ref([]);
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
        userName: null,
        userSourceDept: null,
        baseMoney: null,
        insuranceMoney: null,
        createDate: null,
    },
    deptNames: [],
    rules: {
        userCode: [
            {required: true, message: "员工编号不能为空", trigger: "blur"}
        ],
        userName: [
            {required: true, message: "员工名称不能为空", trigger: "blur"}
        ],
        userSourceDept: [
            {required: true, message: "员工所属部门不能为空", trigger: "blur"}
        ],
    }
});

let {queryParams, form, rules, deptNames} = toRefs(data);

const getAllDepts = function () {
    listDept().then((response) => {
        let d = response.data || [];
        console.log("部门的信息为:[{%o}]", data.deptNames);
        console.log("类型为:",  deptNames.value);
        console.log("类型为:", deptNames);
        d.forEach(x => deptNames.value.push({
            value: x.deptName,
            label: x.deptName
        }));
        console.log("部门的信息为:[{%o}]", data.deptNames);
    })
};


/** 查询员工薪资列表 */
function getList() {
    loading.value = true;
    queryParams.value.params = {};
    if (null != daterangeCreateDate && '' != daterangeCreateDate) {
        queryParams.value.params["beginCreateDate"] = daterangeCreateDate.value[0];
        queryParams.value.params["endCreateDate"] = daterangeCreateDate.value[1];
    }
    listSalary(queryParams.value).then(response => {
        salaryList.value = response.rows;
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
        userCode: null,
        userName: null,
        userSourceDept: null,
        baseMoney: null,
        insuranceMoney: null,
        createDate: null,
        updateDate: null
    };
    proxy.resetForm("salaryRef");
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
    title.value = "添加员工薪资";
    getAllDepts();
}

/** 修改按钮操作 */
function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getSalary(_id).then(response => {
        form.value = response.data;
        open.value = true;
        title.value = "修改员工薪资";
    });
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["salaryRef"].validate(valid => {
        if (valid) {
            if (form.value.id != null) {
                updateSalary(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    getList();
                });
            } else {
                addSalary(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除员工薪资编号为"' + _ids + '"的数据项？').then(function () {
        return delSalary(_ids);
    }).then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download('system/salary/export', {
        ...queryParams.value
    }, `salary_${new Date().getTime()}.xlsx`)
}

getList();
</script>
