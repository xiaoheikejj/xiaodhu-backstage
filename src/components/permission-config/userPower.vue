<template lang="html">
    <div class="userPower">
        <el-header class="content-header agentPowerHeader">
            <el-menu :default-active="'2'" class="el-menu-demo" mode="horizontal">
                <el-menu-item index="1" @click='agentPower'>代理商权限</el-menu-item>
                <el-menu-item index="2">用户权限</el-menu-item>
            </el-menu>
            <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            <el-button type="primary" @click='jump'>权限配置</el-button>
        </el-header>
        <!-- 搜索input -->
        <div class="content-ipt agentPowerContent">
            <div class="center">
                名称/编号：
                <el-input v-model="search.name" clearable></el-input>
                用户权限角色：
                <el-select v-model='agentRoleSearchVal'>
                    <el-option v-for='(i, index) in dialogAgentRole' :label='i.groupName' :value='i.groupName' :key='"agentPowerRole1" + index'></el-option>
                </el-select>
                <el-button type="danger" @click="tableInit">搜索</el-button>
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
            <el-table-column prop='userSeq' label="用户编号"></el-table-column>
            <el-table-column prop="userName" label="用户名称"></el-table-column>
            <el-table-column prop="groupName" label="用户权限角色"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click='addAccountNum();dialog.modify.status = true'>修改</el-button>
                    <el-button type="text" size="small" @click="dialog.rewritePw = true">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增用户弹窗 -->
        <el-dialog class="agentPowerDialog"
        title="新增用户"
        :visible.sync="dialogVisible"
        width="30%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="用户姓名：" prop="agentNameVal">
                <el-input v-model='ruleForm.agentNameVal' clearable></el-input>
            </el-form-item>
            <el-form-item label="用户账号：" prop="accountNum">
                <el-input v-model='ruleForm.accountNum' clearable></el-input>
            </el-form-item>
            <el-form-item label="用户密码：" prop="userPw">
                <el-input v-model='ruleForm.userPw' clearable></el-input>
            </el-form-item>
            <el-form-item label="用户角色选择：" prop="agentRoleVal">
                <el-select v-model='ruleForm.agentRoleVal' @change='changeRole'>
                    <el-option v-for='(i, index) in dialogAgentRole' :label='i.groupName' :value='i.groupId' :key='"agentPowerDialog2" + index'></el-option>
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
        <div class="name">
            用户账号：
            <el-input v-model='dialog.modify.accountNum' disabled></el-input>
        </div>
        <div class="name">
            用户姓名：
            <el-input v-model='dialog.modify.name' clearable></el-input>
        </div>
        <div class="name">
            权限角色选择：
            <el-select v-model='dialog.modify.role'>
                <el-option v-for='(i, index) in dialogAgentRole' :label='i.groupName' :value='i.groupId' :key='"agentPowerDialog2" + index'></el-option>
            </el-select>
        </div>
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
            search: {
                name: ""
            },
            dialog: {
                modify: {
                    status: false,
                    role: '',
                    name: '',
                    accountNum: ''
                },
                addAgent: {
                    agentNameVal: '',
                    accountNum: '',
                    agentRoleVal: '',
                    userPw: ''
                },
                rewritePw: false
            },
            ruleForm: {
                agentNameVal: '',
                accountNum: '',
                agentRoleVal: '',
                userPw: ''
            },
            rules: {
                agentNameVal: [
                    { required: true, message: '请输入用户姓名', trigger: 'blur' },
                ],
                accountNum: [
                    { required: true, message: '请输入用户账号', trigger: 'blur' },
                ],
                agentRoleVal: [
                    { required: true, message: '请选择用户角色', trigger: 'change' },
                ],
                userPw: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                ]
            }
        }
    },
    created: function() {
        var _this = this;
        this.tableInit();

        //获取权限角色
        this.$axios.get(baseUrl + '/usergroup/getUserGroupList').then(res => {
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
        /**
         * 表格初始化
         * @return {[type]} [description]
         */
        tableInit: function() {
            var _this = this;
            var params = new URLSearchParams();
            params.append("userName", this.search.name);
            params.append("groupName", this.agentRoleSearchVal);
            this.$axios.post(baseUrl + '/usergroup/getUserGroupVOList', params).then(res => {
                _this.tableData = res.data;
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
                url: baseUrl + '/user/resetPwd',
                type: 'post',
                data: {
                    userSeq: that.row.userSeq
                },
                success: function(res) {
                    that.dialogShow = true;
                },
                error: function(err) {
                    console.log(err);
                }
            })
        },
        /**
         * 获取修改的用户账号
         * @return {[type]} [description]
         */
        addAccountNum: function() {
            var that = this;
            this.$nextTick(function() {
                $.ajax({
                    url: baseUrl + '/user/getUserByUserSeq',
                    type: 'post',
                    data: {
                        userSeq: that.row.userSeq
                    },
                    success: function(res) {
                        that.dialog.modify.accountNum = res.userName;
                        that.dialog.modify.name = res.realName;
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            })
        },
        /**
         * 修改
         * @return {[type]} [description]
         */
        modifyClick: function() {
            var that = this;

            var sendObj = {
                userSeq: this.row.userSeq,
                realName: this.dialog.modify.name,
                groupId: this.dialog.modify.role
            }
            $.ajax({
                url: baseUrl + '/user/editUser',
                type: 'post',
                data: sendObj,
                success: function(res) {
                    if (res == 0) {
                        that.dialog.modify.status = false;
                        that.dialogShow = true;
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            })
        },
        /**
         * 新增用户
         * @return {[type]} [description]
         */
        checkAccount: function(formName) {
            var _this = this;

            _this.dialogVisible = false;

            var params = new URLSearchParams();
            params.append('realName', _this.ruleForm.agentNameVal);
            params.append('userName', _this.ruleForm.accountNum);
            params.append('userPwd', _this.$md5(_this.ruleForm.userPw));
            params.append('groupId', _this.ruleForm.agentRoleVal);

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.$axios.post(baseUrl + '/user/addUser', params).then(res => {
                        _this.$message({
                            message: '成功了',
                            type: 'success'
                        });
                        //成功后重新请求了列表
                        _this.$axios.get(baseUrl + '/usergroup/getUserGroupVOList').then(res => {
                            _this.tableData = res.data;
                        }).catch(err => {
                            console.log(err);
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    _this.$message({
                        message: '信息验证不成功',
                        type: 'error'
                    });
                    return false;
                }
            })
        },
        jump: function() {
            this.$router.push('/permissionConfig');
        },
        agentPower: function() {
            this.$router.push('/agentPower')
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
.userPower {
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
            position: absolute;
            right: 145px;
            top: 10px;
            width: 100px;
        }
        & .el-button:nth-of-type(2) {
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
