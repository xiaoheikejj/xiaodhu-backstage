<template lang="html">
    <el-header id='header'>
        <div class="svg" @click="changeSidebar">
            <i class="iconfont icon-shouqi" style="font-size: 26px;"></i>
        </div>
        <el-dropdown trigger="click">
            <span class="el-dropdown-link">
                {{ admin }}，你好<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native='signOut'>退出</el-dropdown-item>
                <el-dropdown-item @click.native='dialog.changepw = true'>修改密码</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
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
    </el-header>
</template>

<script>
import {baseUrl} from '../../assets/api/api'
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
            },
            collapse: false
        }
    },
    props: ["titleText"],
    created() {
        this.admin = sessionStorage.getItem('userName');
    },
    computed: {

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
            })
            .catch(err => {
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
        },
        changeSidebar() {
            var that = this;
            this.collapse = !this.collapse;
            // 自组件传递数据给父组件
            this.$emit('clickCollapse', this.collapse);
        }
    }
}
</script>

<style lang="less">
@blue: #3399ff;
#header {
    border-bottom: 1px solid #f0f0f0;
    line-height: 60px;
    position: relative;
    .svg {
        position: absolute;
        width: 30px;
        height: 35px;
        left: 20px;
        z-index: 100;
    }
    .el-dropdown {
        width: 100%;
        font-size: 18px;
        text-align: right;
    }
}
</style>
