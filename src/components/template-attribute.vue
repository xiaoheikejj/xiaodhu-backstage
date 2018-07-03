<template lang="html">
    <div class="templateAttribute">
        <div class="header">
            <el-header>
                <!-- <i title="返回" onclick='javascript:history.back(-1)'></i> -->
                <span>配置模板</span>
            </el-header>
        </div>
        <div class="bottom">
            <ul class="status">
                <li>模板属性</li>
                <li>音频上传</li>
                <li>流程定制</li>
                <li>意向程度设置</li>
            </ul>
            <div class="voiceTemplateStep1">
                <el-row>
                    <el-col :span='8' :offset="8">
                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="模板标题:" prop="title">
                                <el-input v-model="ruleForm.title" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="所属行业:" prop="industry">
                                <el-select placeholder='下拉选择' v-model='ruleForm.industry'>
                                    <el-option v-for='(item, index) in industryList' :value='item.value' :key='"tempAttrIndustry" + index'></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所属地区:" prop="tile">
                                <el-row>
                                    <el-col >
                                        <el-form-item prop="province">
                                        <el-select placeholder='省' v-model='ruleForm.province' @change='changeprovinceValue'>
                                            <el-option v-for='(item, index) in provinceName' :label='item.areaName' :value='item.areaId' :key='"tempAttrProvince" + index'></el-option>
                                        </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col >
                                        <el-form-item prop="city">
                                        <el-select placeholder='市' v-model='ruleForm.city'>
                                            <el-option v-for='(i, index) in cityName' :label='i.areaName' :value='i.areaId' :key='"tempAttrCity" + index'></el-option>
                                        </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="使用公司:" prop="company">
                                <el-select placeholder='下拉选择' v-model='ruleForm.company' @change='changecompany'>
                                    <el-option v-for='(item, index) in companyName' :label='item.mercName' :value='item.mercSeq' :key='"tempAttrCompany" + index'></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button el-button type="primary" @click="next('ruleForm')" style="width: 257px;">下一步</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import {baseUrl} from '../assets/api/api'

export default {
    data() {
        return {
            industryList: [],    //行业集合
            industryValue: '',
            provinceName: '',    //省
            provinceValue: '',
            cityName: '',   //市
            cityValue: '',
            companyName: '', //公司
            companyValue: '',
            industryVal: '',
            provinceVal: '',
            cityVal: '',
            companyVal: '' ,
            mercSeqVal: '',  //商户编号
            ruleForm: {
                title: '',
                industry: '',
                province: '',
                city: '',
                company: ''
            },
            rules: {
                title: [
                    { required: true, message: '请输入模板名称', trigger: 'blur' },
                ],
                industry: [
                    { required: true, message: '请选择行业', trigger: 'change' },
                ],
                province: [
                    { required: true, message: '请选择省', trigger: 'change' },
                ],
                city: [
                    { required: true, message: '请选择市', trigger: 'change' },
                ],
                company: [
                    { required: true, message: '请选择市', trigger: 'change' },
                ]
            }
        }
    },
    created: function() {
        var _this = this;
        //行业请求
        this.$axios.post(baseUrl + '/sysdicttreedata/getCategory').then(res => {
            _this.industryList = res.data;
        }).catch(err => {
            console.log(err);
        });
        //省请求
        this.$axios.post(baseUrl + '/areacode/getProvince').then(res => {
            _this.provinceName = res.data;
        }).catch(err => {
            console.log(err)
        });
        //商户请求
        this.$axios.post(baseUrl + '/merchant/getMerchantList').then(res => {
            _this.companyName = res.data;
        }).catch(err => {
            console.log(err)
        });
    },
    methods: {
        changecompany: function(name) {
            var that = this;
            this.companyName.map(function(ele, index) {
                if (ele.mercSeq == name) {
                    that.companyVal = ele.mercName;
                }
            })
        },
        changeprovinceValue() {
            //当请求到的省数据不是空的时候请求市
            var that = this;
            $.ajax({
                url: baseUrl + '/areacode/getCity',
                type: 'post',
                data: {
                    areaSupCode: that.ruleForm.province
                },
                success: function(res) {
                    that.cityName = res;
                },
                error: function() {
                    console.log(err);
                }
            })
        },
        next: function(formName) {
            var that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    $.ajax({
                        url: baseUrl + '/speechtemplate/addTemplate',
                        type: 'post',
                        data: {
                            tempTitle: that.ruleForm.title,
                            code: that.ruleForm.industry,
                            tempProvince: that.ruleForm.province,
                            tempCity: that.ruleForm.city,
                            mercName: that.companyVal,
                            mercSeq: that.ruleForm.company
                        },
                        success: function(res) {
                            sessionStorage.setItem("tempSeq",res.tempSeq);
                            if (res.status == '0') {
                                that.$message({
                                    showClose: true,
                                    message: '第一步成功了',
                                    type: 'success'
                                });
                                that.$router.push('/audioUpload');
                            } else if (res.status == "1") {
                                that.$message({
                                    showClose: true,
                                    message: '模板名称重复',
                                    type: 'warning'
                                });
                            }
                            console.log(res);
                        },
                        error: function() {
                            that.$message({
                                showClose: true,
                                message: '创建失败',
                                type: 'error'
                            });
                        }
                    })
                } else {
                    that.$message({
                        message: '信息验证错误',
                        type: 'error'
                    });
                    return false;
                }
            })
        }
    }

}
</script>

<style lang="less">
.templateAttribute {
    .header{
        padding-bottom: 14px;
        background-color: #f0f3f6;
    }
    .el-header {
        color: #3399ff;
        font-size: 18px;
        line-height: 60px;
        background-color: #fff;
    }
    .el-header i {
        display: inline-block;
        width: 22px;
        height: 16px;
        background: url(/static/back.png) no-repeat center;
        background-size: cover;
        margin-right: 15px;
    }
    .bottom .status {
        height: 120px;
        box-shadow: 0 5px 10px rgba(235,237,246,0.75);
        text-align: center;
        line-height: 120px;
    }
    .bottom .status li {
        display: inline-block;
        color: #999;
        font-size: 22px;
    }
    .bottom .status li:not(:last-of-type) {
        margin-right: 70px;
    }
    .bottom .status li:first-of-type + li {
        background: url('/static/gray-2.png') no-repeat center left;
        padding-left: 83px;
        color: #999;
    }
    .bottom .status li:first-of-type {
        background: url('/static/blue-1.png') no-repeat center left;
        padding-left: 83px;
        color: #3399ff;
    }
    .bottom .status li:first-of-type + li + li {
        background: url('/static/gray-4.png') no-repeat center left;
        padding-left: 83px;
    }
    .bottom .status li:first-of-type + li + li + li {
        background: url('/static/gray-5.png') no-repeat center left;
        padding-left: 83px;
    }
    .voiceTemplateStep1 {
        margin-top: 70px;
        padding-bottom: 200px;
    }
    .voiceTemplateStep1 .module-title {
        text-align: center;
        color: #666;
        font-size: 16px;
        margin-top: 40px;
    }
    .voiceTemplateStep1 .module-title.industry {
        margin-top: 30px;
    }
    .voiceTemplateStep1 .el-input__inner {
        height: 34px;
        width: 258px;
    }
    .voiceTemplateStep1 .module-title.area .el-input__inner{
        width: 127px;
    }
    .voiceTemplateStep1 .next-button {
        text-align: center;
        margin-top: 40px;
    }
    .voiceTemplateStep1 .next-button .el-button {
        width: 354px;
        height: 50px;
        font-size: 16px;
        border-radius: 30px;
    }
}
</style>
