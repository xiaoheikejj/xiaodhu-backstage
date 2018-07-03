<template lang="html">
    <div id='addNewAgent'>
        <div class='header'>
            <div class="center">
                <i onclick="javascript:history.back(-1)"></i>
                新增用户
            </div>
        </div>
            <div class="addNewUser-content">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="企业名称：" prop="name">
                        <el-input v-model="ruleForm.name" maxlength="40"></el-input>
                    </el-form-item>
                    <el-form-item label="企业所在地：" prop="area">
                        <el-select placeholder='省' v-model='ruleForm.province' @change='changeProvice' prop="pro">
                            <el-option v-for='(item, index) in provinceLists' :label='item.areaName' :value='item.areaId' :key='"addNewUserpro" + index'></el-option>
                        </el-select>
                        <el-select placeholder='市' v-model='ruleForm.city' @change='changeCity' prop="city">
                            <el-option v-for='(list, index) in cityLists' :label='list.areaName' :value='list.areaId' :key='"addNewUsercit" + index'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所在行业：" prop="industry">
                        <el-select v-model='ruleForm.industry' @change='changeIndustry'>
                            <el-option v-for='(i, index) in industryLists' :label='i.value' :value='i.orderno' :key='"addNewUserind" + index'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="营业执照号：" prop="license">
                        <el-input v-model="ruleForm.license"></el-input>
                    </el-form-item>
                    <el-form-item label="法人姓名：" prop="legal">
                        <el-input v-model="ruleForm.legal"></el-input>
                    </el-form-item>
                    <el-form-item label="法人身份证号码：" prop="legalID">
                        <el-input v-model="ruleForm.legalID" maxlength="18"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人姓名：" prop="linkman">
                        <el-input v-model="ruleForm.linkman"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人手机号：" prop="linkmanPhone">
                        <el-input v-model="ruleForm.linkmanPhone" oninput="value=value.replace(/[^\d]/g,'')" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-model="ruleForm.email" maxlength="50"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="资料上传：" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item> -->
                    <form id='upImgForm' autocomplete="off" method="post">
                        <div class="uploadImg">
                            资料上传：
                            <input type="file" :name="'file' + index" v-for='(i, index) in fileNum' @click='addFile'>
                        </div>
                    </form>
                    <el-form-item>
                        <el-button type='primary' @click="submit('ruleForm')">确定</el-button>
                        <el-button onclick="javascript:history.back(-1)">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
    </div>
</template>

<script>
import {baseUrl} from '../assets/api/api'
export default {
    data() {
        return {
            provinceLists: [],
            provinceVal: '',
            cityLists: [],
            cityVal: '',
            industryLists: [], //行业列表
            industryVal: '',
            changeProName: '', //改变省的名字
            changeCityName: '', //改变市的名字
            changeIndName: '',   //改变行业的名字
            proID: '',   //省的id
            cityID: '',      //市的id
            indID: '',      //行业的id
            fileNum: 1,
            fileUrl: '',
            dialogVisible: false,    //显示弹窗
            ruleForm: {
                name: "",
                province: "",
                city: "",
                industry: "",
                license: "",
                legal: "",
                legalID: "",
                linkman: "",
                linkmanPhone: "",
                email: "",
                provinceName: "",
                cityName: "",
                industryName: ""
            },
            rules: {
                name: [
                    { required: true, message: '请输入企业名称', trigger: 'blur' },
                    { max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
                ],
                industry: [
                    { required: true, message: '请选择行业', trigger: 'change' }

                ],
                license: [
                    { required: true, message: '请输入营业执照', trigger: 'blur' },
                    { min: 15, max: 18, message: '长度在 15 到 18 位', trigger: 'blur' }
                ],
                legal: [
                    { required: true, message: '请输入企业法人姓名', trigger: 'blur' },
                    {  max: 20, message: '最大长度20位', trigger: 'blur' }
                ],
                legalID: [
                    { required: true, message: '请输入法人身份证号', trigger: 'blur' },
                    {  min: 18, max: 18, message: '长度18位', trigger: 'blur' }
                ],
                linkman: [
                    { required: true, message: '请输入企业联系人', trigger: 'blur' },
                    {  max: 20, message: '最大长度20位', trigger: 'blur' },
                ],
                linkmanPhone: [
                    { required: true, message: '请输入企业联系人电话', trigger: 'blur' },
                    {  min: 11, max: 11,  message: '请输入正确的手机号码', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { max: 50, type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            }
        }
    },
    created: function() {
        var _this = this;
        //获取省
        this.$axios.post(baseUrl + '/areacode/getProvince').then(res => {
            _this.provinceLists = res.data;
        }).catch(err => {
            console.log(err);
        })
        //获取所属行业
        this.$axios.get(baseUrl + '/sysdicttreedata/getCategory').then(res => {
            _this.industryLists = res.data;
        }).catch(err => {
            console.log(err);
        })
    },
    methods: {
        changeProvice(name) {
            var _this = this;
            // 获取省的id
            var params = new URLSearchParams();
            params.append('areaSupCode', this.ruleForm.province)
            this.$axios.post(baseUrl + '/areacode/getCity', params).then(res => {
                _this.cityLists = res.data;
            }).catch(err => {
                console.log(err);
            })
            //改变省的名字
            this.provinceLists.map(function(v, i) {
                if (v.areaId == _this.ruleForm.province) {
                    _this.changeProName = v.areaName;
                }
            })
            console.log(_this.changeProName);
        },
        changeCity(name) {
            var _this = this;
            this.cityLists.map(function(v, i) {
                if (v.areaId == _this.ruleForm.city) {
                    _this.changeCityName = v.areaName;
                }
            })

            console.log(this.changeCityName);
        },
        changeIndustry(name) {
            var _this = this;
            this.industryLists.map(function(v, i) {
                if (v.orderno == _this.ruleForm.industry) {
                    _this.changeIndName = v.value;
                }
            })
            console.log(this.changeIndName);
        },
        submit: function(formName) {
            var _this = this;
            var formData = new FormData($("#upImgForm")[0]);
            $.ajax({
                url: baseUrl + '/upload/fileupload',
                type: 'post',
                data: formData,
                async: false,
                // dataType: 'json',
                contentType: false,
                processData: false,
                success: function(res) {
                    res.pop();      //删除null
                    _this.fileUrl = res.join(',');
                },
                error: function(err) {
                    console.log(err);
                }
            })


            var subParams = new URLSearchParams();
            subParams.append('agentName', this.ruleForm.name);
            subParams.append('agentProvince', this.ruleForm.province);
            subParams.append('agentCity', this.ruleForm.city);
            subParams.append('agentIndustry', this.ruleForm.industry);
            subParams.append('agentBusinessLicense', this.ruleForm.license);
            subParams.append('agentBusinessEntityName', this.ruleForm.legal);
            subParams.append('agentBusinessEntityContactName', this.ruleForm.linkman);
            subParams.append('agentBusinessEntityContactPhone', this.ruleForm.linkmanPhone);
            subParams.append('agentBusinessMail', this.ruleForm.email);
            subParams.append('agentBusinessId', this.ruleForm.legalID);
            subParams.append('provinceName', this.changeProName);
            subParams.append('cityName', this.changeCityName);
            subParams.append('industryName', this.changeIndName);
            subParams.append('agentBusinessLicensePic', this.fileUrl);


            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post(baseUrl + '/agent/addAgent', subParams).then(res => {
                        console.log(res);
                        this.$message({
                            showClose: true,
                            message: '成功的新增了',
                            type: 'success'
                        });
                        this.$router.push('/agentList');
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    this.$message({
                        showClose: true,
                        message: '数据验证错误',
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        addFile: function() {
            this.fileNum += 1;
        }
    }
}
</script>

<style lang="less">
#addNewAgent {
    .uploadImg {
        text-align: center;
        margin-top: 25px;
    }
    .el-form-item {
        width: 450px;
        margin: 20px auto 0;
        .el-select {
            width: 153px;
        }
    }
    .header {
        width: 100%;
        height: 80px;
        background-color: #f0f3f6;
        position: relative;
        line-height: 60px;
        color: #3399ff;
        font-size: 22px;
        i {
            display: inline-block;
            width: 22px;
            height: 16px;
            background: url(/static/back.png) no-repeat center/22px auto;
            position: absolute;
            left: 18px;
            top: 20px;
        }
        .center {
            width: 100%;
            height: 60px;
            background-color: #fff;
            padding-left: 60px;
        }
    }
}
</style>
