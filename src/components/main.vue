<template>
    <el-container id='Main'>
        <el-header class="clearfix el-head-parent">
            <span class="fl">{{ title }}</span>
            <div class="fr">
                <i style="margin-right: 15px;color: #fff;margin-right: 0;margin-top: 20px;">{{ admin }}，你好</i>
                <i style="color: #fff" @click='signOut'>退出</i>
                <i style="color: #fff" @click='dialog.changepw = true'>修改密码</i>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu router :default-active="'/merchantList'" class="el-menu-vertical-demo" :unique-opened='true' background-color='#313540' text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item index="1">
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-submenu v-for='(item, index) in firstName' :key='"mainFirstName" + index' :index="index + '1'" :query='index'>
                        <template slot="title">
                            <span>{{ item.resName }}</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item v-for='(v, i) in item.tblAuthResourceList' :key='"mainSecondName" + i' :index="v.resUrl" :query="(index + 1) + '-' + (i + 1)">{{ v.resName }}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <div class="content">
                <transition name="move" mode="out-in">
                    <!-- keep-alive慎用慎用慎用 -->
                    <router-view></router-view>
                </transition>
            </div>
        </el-container>
        <!-- 修改密码 -->
        <el-dialog
            title="修改密码"
            :visible.sync="dialog.changepw"
            width="30%">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm">
                <el-form-item prop="oldpass">
                    <el-input type="password" v-model="ruleForm.oldpass" auto-complete="off" placeholder='原密码'></el-input>
                </el-form-item>
                <el-form-item  prop="newpass">
                    <el-input type="password" v-model="ruleForm.newpass" auto-complete="off" placeholder='新密码'></el-input>
                </el-form-item>
                <el-form-item  prop="checkpass">
                    <el-input type="password" v-model="ruleForm.checkpass" auto-complete="off" placeholder='确认新密码'></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.changepw = false">取 消</el-button>
                <el-button type="primary" @click="submitForm();dialog.changepw = false">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>
<script>
import { baseUrl } from '../assets/api/api'

export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.newpass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        }
        return {
            admin: '',
            title: '微盘人工智能大后台管理系统',
            firstName: [], //数据存储的地方,
            input: '',
            dialog: {
                changepw: false
            },
            ruleForm: {
                oldpass: '',
                newpass: '',
                checkpass: ''
            },
            rules: {
                oldpass: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                newpass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                ],
                checkpass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
            }
        }
    },
    created: function() {
        // 左侧菜单栏请求
        var _this = this,
            resSeq = [];
        var params = this.$qs.stringify({'groupId': 1})
        this.$axios.post(baseUrl + '/userresource/getUserResourceList', params).then(res => {
            _this.firstName = res.data;
        }).catch(err => {
            console.log(err);
        })
        this.admin = sessionStorage.getItem('userName');
    },
    computed: {
        onRoutes: function() {
            return this.$route.path.replace('/', '');
        }
    },
    methods: {
        signOut: function() {
            var that = this;
            this.$axios({
                url: baseUrl + '/user/logOut',
                method: "post"
            })
            .then(res => {
                sessionStorage.removeItem('userName');
                that.$message({
                    message: '退出成功',
                    type: 'success'
                });
                that.$router.push('/');
            }).catch(err => {
                that.$message({
                    message: '账户过期',
                    type: 'warning'
                });
            })
        },
        submitForm: function() {
            var that = this;
            this.$axios({
                url: baseUrl + '/user/updatePwd',
                method: "post",
                data: that.$qs.stringify({
                        userPwd: that.$md5(that.ruleForm.oldpass),
                        newPwd: that.$md5(that.ruleForm.newpass)
                    })
            })
            .then(res => {
                console.log(res);
                if (res.data === 0) {
                    that.$message({
                        showClose: true,
                        message: '成功的修改了密码',
                        type: 'success'
                    });
                    that.ruleForm.oldpass = '';
                    that.ruleForm.newpass = '';
                    that.ruleForm.checkpass = '';
                } else {
                    that.$message({
                        showClose: true,
                        message: '原密码错误',
                        type: 'warning'
                    });
                }
            }).catch(err => {
                that.$message({
                    showClose: true,
                    message: '修改失败',
                    type: 'error'
                });
            })
        }
    }
}
</script>
<style lang="less">
i {
    font-style: normal;
}
#Main {
    .el-submenu .el-menu-item.is-active {
        min-width: 180px;
        color: #3399ff !important;
    }

    .content {
        width: 100%;
    }

    .el-header.el-head-parent {
        background-color: #313540;
        color: #333;
        line-height: 60px;
        span {
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 3px;
        }
    }
    .el-header.el-head-child {
        color: #3399ff;
        font-size: 18px;
        line-height: 60px;
        background-color: #fff;
    }
    .el-aside {
        background-color: #313540;
        border-top: 1px solid #464c5b;
    }
    .el-main {
        padding: 0;
    }
    .el-main .inputs {
        margin-top: 20px;
        background-color: #fff;
        padding: 24px 20px;
    }
    .el-main .inputs input {
        display: inline-block;
        width: 140px;
        height: 40px;
        background-color: #f0f3f6;
        border: 1px solid #dfe3eb;
        border-radius: 3px;
    }
    .el-main .inputs span {
        letter-spacing: 3px;
        color: #333;
        font-size: 16px;
    }
    .el-main .inputs .merchat input {
        width: 180px;
    }
    .el-main .inputs .inputs-bottom {
        margin-top: 30px;
    }
    .el-main .inputs .inputs-bottom input {
        width: 120px;
    }
    .el-table thead {
        color: #333;
        font-size: 16px;
    }
}
</style>
