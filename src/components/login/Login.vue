<template>
    <div id="login">
        <div class="container">
            <div class="title">
                <h1>小电呼智能语音机器人</h1>
                <p>后台管理系统</p>
            </div>
            <div class="table">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item prop="name" style="margin-top: 50px;">
                       <el-input v-model="ruleForm.name" clearable placeholder='用户名'></el-input>
                     </el-form-item>
                    <el-form-item prop="pass" style="margin-top: 30px;">
                        <el-input type="password" v-model="ruleForm.pass" auto-complete="off" clearable placeholder='密码'></el-input>
                    </el-form-item>
                    <el-form-item prop="code" style="margin-top: 30px;" class="code">
                        <el-input type="text" v-model="ruleForm.code" clearable placeholder='验证码'></el-input>
                        <input type="button" :value="random" class="randomNum" @click='mathNum'></input>
                    </el-form-item>
                    <el-row style="margin-top: 30px;">
                        <el-col :span="20" :offset="2">
                            <el-button class="login-btn" type="primary" @click="submitForm('ruleForm')">登录</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import {baseUrl} from '../../assets/api/api'
    import axios from 'axios'
    export default {
        name: 'Login',
        data() {
            var checkedCode = (rule, value, callback) => {
                if (this.ruleForm.code == '' || this.ruleForm.code != '' + this.random) {
                    return callback(new Error('请输入正确的验证码'));
                } else {
                    callback();
                }
            }
            return {
                ruleForm: {
                    name: '',
                    pass: '',
                    code: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur'},
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    pass: [
                        { required: true, message: '请输入密码', trigger: 'blur'},
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    code: [
                        {validator: checkedCode, trigger: 'blur'}
                    ]
                },
                username: '',
                password: '',
                nouerText: '',
                nopassText: '',
                random: 0,
                nocodeText: '',
                padVal: ''
            }
        },
        created: function() {
            this.random = parseInt(Math.random()*8999) + 1000;
            var that = this;
            document.onkeyup = function(e) {
                var event = e || window.event;
                if (event.keyCode == 13) {
                    that.submitForm('ruleForm');
                }
            }
        },
        methods: {
            //点击生产随机数；
            mathNum: function() {
                this.random = parseInt(Math.random()*8999) + 1000;
            },
            submitForm: function(formName) {
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.ruleForm.code == '' || this.ruleForm.code != this.random) {
                            this.$message({
                                showClose: true,
                                message: '登陆不成功',
                                type: 'error'
                            });
                        } else {
                            var params = new URLSearchParams();
                            params.append('userName', this.ruleForm.name);
                            params.append('userPwd', this.$md5(this.ruleForm.pass));
                            axios.post(baseUrl + '/user/login', params).then(res => {
                                if (res.data.status == 0) {
                                    this.$router.push({path: '/main'});
                                    sessionStorage.setItem('userName', that.ruleForm.name);
                                } else if (res.data.status == 1) {
                                    this.$message({
                                        showClose: true,
                                        message: '账户或密码错误',
                                        type: 'warning'
                                    });
                                } else if (res.data.status == 2) {
                                    this.$message({
                                        showClose: true,
                                        message: '账户过期',
                                        type: 'warning'
                                    });
                                };
                            }).catch(err => {
                                this.$message({
                                    showClose: true,
                                    message: '登陆失败',
                                    type: 'warning'
                                });
                            })
                        }
                    } else {
                        this.$message({
                            showClose: true,
                            message: '登陆不了',
                            type: 'error'
                        });
                    }
                });
            }
        }
    }
</script>
<style lang="less">
html, body, #app {
    height: 100%;
}
#login {
    width: 100%;
    height: 100%;
    background: url('/static/background.png') no-repeat center/cover;
    position: relative;
    .el-form-item {
        padding: 0 30px;
    }
    .container {
        width: 380px;
        position: absolute;
        right: 172px;
        top: 84px;
        .title {
            position: relative;
            h1 {
                font-size: 34px;
                font-weight: bold;
                font-style: italic;
                letter-spacing: 4px;
                padding-bottom: 25px;
                color: #fff;
            }
            p {
                width: 180px;
                text-align: center;
                letter-spacing: 4px;
                margin: 0 auto;
                background-color: transparent;
                font-size: 20px;
                color: #fff;
                position: absolute;
                bottom: -10px;
                left: 50%;
                margin-left: -90px;
            }
        }
        .table {
            width: 380px;
            height: 360px;
            border-radius: 6px;
            background-color: #fff;
            margin-top: 60px;
            overflow: hidden;
        }
    }
    input[name='ipt-login'] {
        width: 292px;
        height: 42px;
        display: block;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding-left: 14px;
        font-size: 16px;
    }
    .username {
        margin: 50px auto 0;
    }
    .password {
        margin: 0 auto;
    }
    .nouser {
        height: 30px;
        font-size: 14px;
        width: 292px;
        margin: 0 auto;
        line-height: 30px;
    }
    .nocode {
        height: 40px;
        font-size: 14px;
        width: 292px;
        margin: 0 auto;
        line-height: 30px;
    }
    .code {
        margin: 0 auto;
        position: relative;
        .el-input {
            width: 210px;
        }
        input[type='button'] {
           position: absolute;
           right: 0;
           top: 0;
           width: 100px;
           height: 40px;
           display: inline-block;
           border: 1px solid #ccc;
           border-radius: 3px;
           font-size: 16px;
       }
    }
    .el-row .el-button {
        width: 100%;
    }
    .sub {
        width: 292px;
        height: 42px;
        display: block;
        margin: 0 auto;
        background-color: #3399ff;
        border: none;
        font-size: 18px;
        color: #fff;
        border-radius: 3px;
    }
    .sub:hover {
        background-color: #5cadff;
    }
}

</style>
