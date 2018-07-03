<template lang="html">
    <div class="agentPower">
        <el-header class="content-header agentPowerHeader">
            <el-menu :default-active="'1'" class="el-menu-demo" mode="horizontal">
                <el-menu-item index="1">代理商权限</el-menu-item>
                <el-menu-item index="2" @click='userPower'>用户权限</el-menu-item>
            </el-menu>
            <el-button type="primary" @click='jump'>权限配置</el-button>
        </el-header>
        <!-- 搜索input -->
        <div class="content-ipt agentPowerContent">
            <div class="center">
                名称/编号：
                <el-input v-model="search.name"></el-input>
                代理商权限角色：
                <el-select v-model='agentRoleSearchVal'>
                    <el-option v-for='(i, index) in dialogAgentRole' :label='i.agentPackName' :value='i.agentPackName' :key='"agentPowerRole1" + index'></el-option>
                </el-select>
                <el-button type="danger" @click="tableInit(1, 10)">搜索</el-button>
            </div>
        </div>
        <!-- 表格 -->
        <el-table
        ref="multipleTable"
        :data='tableData'
        tooltip-effect="dark"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @cell-click='getRow'>
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop='agentSeq' label="代理商编号"></el-table-column>
            <el-table-column prop="agentName" label="代理商名称"></el-table-column>
            <el-table-column prop="agentPackName" label="代理商权限角色"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click='dialog.modify.status = true'>修改</el-button>
                    <el-button type="text" size="small" @click="dialog.rewritePw = true">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗 -->
        <el-dialog class="agentPowerDialog"
        title="新增代理商"
        :visible.sync="dialogVisible"
        width="30%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="代理商姓名：" prop="agentNameVal">
                <el-select v-model='ruleForm.agentNameVal' @change='changeName'>
                    <el-option v-for='(item, index) in dialogAgentName' :label='item.agentName' :value='item.agentSeq' :query='item.agentBusinessEntityContactPhone' :key='"agentPowerDialog1" + index'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="代理商账号：" prop="accountNum">
                <el-input v-model='ruleForm.accountNum'></el-input>
            </el-form-item>
            <el-form-item label="权限角色选择：" prop="agentRoleVal">
                <el-select v-model='ruleForm.agentRoleVal' @change='changeRole'>
                    <el-option v-for='(i, index) in dialogAgentRole' :label='i.agentPackName' :value='i.agentPackSeq' :key='"agentPowerDialog2" + index'></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="checkAccount('ruleForm')">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog class="agentPowerDialog"
        title="修改权限角色"
        width='40%'
        :visible.sync="dialog.modify.status">
        <el-form label-width="120px">
            <el-form-item label="代理商姓名：" prop="agentNameVal">
                <el-input v-model='row.agentName' disabled></el-input>
            </el-form-item>
            <el-form-item label="权限角色选择：" prop="agentNameVal">
                <el-select v-model='dialog.modify.role'>
                    <el-option v-for='(i, index) in dialogAgentRole' :label='i.agentPackName' :value='i.agentPackSeq' :key='"agentPowerDialog2" + index'></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialog.modify.status = false">取 消</el-button>
            <el-button type="primary" @click="modifyClick">确 定</el-button>
        </span>
        </el-dialog>

        <el-dialog
        width='30%'
        :visible.sync="dialogShow">
            <span>成功了</span>
            <div slot='footer'>
                <el-button type="primary" @click="dialogShow = false">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 重置密码 -->
        <el-dialog
        width='30%'
        :visible.sync="dialog.rewritePw">
            <span>是否重置?</span>
            <div slot='footer'>
                <el-button type="primary" @click="rewritePassWord();dialog.rewritePw = false">确 定</el-button>
            </div>
        </el-dialog>

        <el-pagination
            background
            :current-page.sync="page.pagecurrent"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.pagecount">
        </el-pagination>
    </div>
</template>

<script>
import {baseUrl} from '../../assets/api/api'

export default {
    data() {
        return {
            tableData: [],
            dialogVisible: false,
            dialogShow: false,
            dialogShowValue: '',
            dialogAgentName: [],
            dialogAgentNameVal: '',
            dialogAgentRole: [],
            dialogAgentRoleVal: '',
            agentRoleSearchVal: '',
            roleName: '',
            nameName: '',
            dialogAccountNum: '',
            row: {},
            dialog: {
                modify: {
                    status: false,
                    role: ''
                },
                addAgent: {
                    agentNameVal: '',
                    accountNum: '',
                    agentRoleVal: ''
                },
                rewritePw: false
            },
            page: {
                pagecount: 0,
                pagecurrent: 1
            },
            search: {
                name: ""
            },
            ruleForm: {
                agentNameVal: "",
                accountNum: "",
                agentRoleVal: ""
            },
            rules: {
                agentNameVal: [
                    { required: true, message: '请选择代理商姓名', trigger: 'change' }
                ],
                accountNum: [
                    { required: true, message: '请输入代理商账号', trigger: 'blur' },
                ],
                agentRoleVal: [
                    { required: true, message: '请选择权限角色', trigger: 'change' }
                ]
            }
        }
    },
    created: function() {
        var _this = this;

        this.tableInit(1, 10);
        //获取权限角色
        this.$axios.get(baseUrl + '/agentpackage/getAgentPackageList').then(res => {
            _this.dialogAgentRole = res.data;
        }).catch(err => {
            console.log(err);
        })
    },
    methods: {
        changeRole(name) {
            this.roleName = name;
        },
        changeName(name) {
            this.nameName = name;
            this.dialogAgentName.map(function(currentValue) {
                if (currentValue.agentSeq == 3) {
                    console.log(currentValue.agentBusinessEntityContactPhone);
                }
            })
        },
        getRow(row) {
            this.row = row;
            console.log(row);
        },
        handleSizeChange(val) {
            this.tableInit(1, val);
        },
        handleCurrentChange(val) {
            this.tableInit(val, 10);
        },
        tableInit: function(page, size) {
            var _this = this;
            var params = new URLSearchParams();
            params.append('agentName', this.search.name);
            params.append('agentPackName', this.agentRoleSearchVal);
            params.append('page', page);
            params.append('size', size);
            this.$axios.post(baseUrl + '/agentpackage/getAgentPackageVO', params).then(res => {
                _this.tableData = res.data.dataInfo;
                _this.page.pagecount = res.data.count;
            }).catch(err => {
                console.log(err);
            })
        },
        /**
         * 重置密码
         * @return {[type]} [description]
         */
        rewritePassWord: function() {
            var that = this;
            $.ajax({
                url: baseUrl + '/agent/resetPwd',
                type: 'post',
                data: {
                    agentSeq: that.row.agentSeq
                },
                success: function(res) {
                    that.dialogShow = true;
                },
                error: function(err) {
                    console.log(err);
                }
            })
        },
        // 修改
        modifyClick: function() {
            var _this = this;
            this.$axios({
                url: baseUrl + '/agentpackage/updateAgentAndPackage',
                method: 'post',
                data: _this.$qs.stringify({
                    agentSeq: _this.row.agentSeq,
                    agentPackSeq: _this.dialog.modify.role
                })
            })
            .then(res => {
                _this.dialog.modify.status = false;
                _this.tableInit(1, 10);
                _this.page.pagecurrent = 1;
            })
            .catch(err => {
                console.log(err);
            })
        },

        jump: function() {
            this.$router.push('/MerconfigMan');
        },
        userPower: function() {
            this.$router.push('/userPower')
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        }
    }
}
</script>

<style lang="less">
html, body, #app, .el-container {
    height: 100%;
}
.agentPower {
    .el-table .warning-row {
        background: oldlace;
    }
    .el-table .success-row {
        background: #f0f9eb;
    }
    .agentPowerHeader {
        line-height: 60px;
        position: relative;
        background-color: #fff;
        color: #3399ff;
        font-size: 22px;
        & .el-button:nth-of-type(1) {
            width: 100px;
            position: absolute;
            right: 20px;
            top: 10px;
        }
    }
    .agentPowerContent {
        background-color: #f0f3f6;
        padding: 14px 0;
        .center{
            position: relative;
            background-color: #fff;
            line-height: 88px;
            padding: 0 20px;
            .el-input {
                width: auto;
            }
            .el-button {
                position: absolute;
                right: 20px;
                top: 25px;
                width: 100px;
            }
        }
    }
    .agentPowerDialog {
        .name {
            width: 100%;
            text-align: center;
            color: #333;
            font-size: 16px;
        }
        & .name:not(:nth-of-type(1)) {
            margin-top: 20px;
        }
    }
    .cell {
        text-align: center;
    }
}
</style>
