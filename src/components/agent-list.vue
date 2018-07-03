<template lang="html">
    <div id="agentList">
        <el-header class="content-header">
            <p>代理商列表</p>
            <el-button type="primary" @click='addNewAgent'>新增代理</el-button>
        </el-header>
        <!-- 搜索input -->
        <div class="search">
            <div class="content-ipt">
                代理商名称/编号：<el-input class="agent-name" v-model="search.name" clearable></el-input>
                电话：<el-input class="agent-phone" v-model="search.phone" clearable></el-input>
                状态：<el-select class="agent-status" v-model='search.status'>
                        <el-option v-for='(i, index) in status' :label='i.value' :value="i.id" :key='"agentListStatus" + index'></el-option>
                    </el-select>
                所在地区：<el-select class="agent-province" placeholder="省" v-model='search.province' @change='changeProvice'>
                            <el-option v-for='(item, index) in provinceLists' :label='item.areaName' :value='item.areaId' :key='"agentListPro" + index'></el-option>
                        </el-select>
                        <el-select class="agent-city"  placeholder="市" v-model='search.city'>
                            <el-option v-for='(list, index) in cityLists' :label='list.areaName' :value="list.areaId" :key='"agentListCity" + index'></el-option>
                        </el-select>
                <el-button type="danger" @click="tableInit()">搜索</el-button>
            </div>
        </div>

        <!-- 表格 -->
        <el-table ref="multipleTable"
            :data='tableData'
            tooltip-effect="dark"
            style="width: 100%"
            @cell-click='tableClick'
            stripe>
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop='agentSeq' label="代理商编号"></el-table-column>
                <el-table-column prop="agentName" label="代理商名称"></el-table-column>
                <el-table-column prop="agentBusinessEntityContactPhone" label="联系电话"></el-table-column>
                <el-table-column prop="location" label="所在地"></el-table-column>
                <el-table-column prop="mercNum" label="代理商户数量"></el-table-column>
                <el-table-column prop="portNum" label="剩余机器人数量"></el-table-column>
                <el-table-column property="status" label="状态"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small"
                            @click="addNew();dialog.OpenAccount = true"
                            class="openaccount">开户</el-button>
                        <el-button type="text" size="small" @click="clearData();dialog.addRobot = true">增加机器人</el-button>
                        <el-button type="text" size="small" @click="lookData();dialog.lookData = true">查看资料</el-button>
                    </template>
                </el-table-column>
        </el-table>
        <!-- 弹窗 -->
        <el-dialog
        title='代理商信息'
        :visible.sync='dialog.lookData'>
        <div class="top">
            商户信息
        </div>
        <el-row>
            <el-col :span="12">企业名称:{{ datumData.agentName }}</el-col>
            <el-col :span="12">身份信息:商户</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">企业所在地:{{ datumData.area }}</el-col>
            <el-col :span="12">所属行业:{{ datumData.industryName }}</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">营业执照号/统一社会信用代码:{{ datumData.agentBusinessLicense }}</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">企业法人姓名:{{ datumData.agentBusinessEntityName }}</el-col>
            <el-col :span="12">企业法人身份证:{{ datumData.agentBusinessId }}</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">企业联系人姓名:{{ datumData.agentBusinessEntityContactName }}</el-col>
            <el-col :span="12">企业联系人电话:{{ datumData.agentBusinessEntityContactPhone }}</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">企业邮箱:{{ datumData.agentBusinessMail }}</el-col>
        </el-row>
        <div class="top">
            图片资料
        </div>
        <img src="/static/blue-2.png" alt="">
        <div class="top">
            账户信息
        </div>
        <el-row>
            <el-col :span="12">账户状态:{{ datumData.agentStatus }}
                <el-button type='primary' v-show='frozen' @click='frozenClick();dialog.lookData = false'>冻结</el-button>
                <el-button type='primary' v-show='thaw' @click='thawClick();dialog.lookData = false'>解冻</el-button>
            </el-col>
            <el-col :span="12">子账户数量:</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">商户入网时间:{{ datumData.agentBeginTime }}</el-col>
            <el-col :span="12">套餐剩余有效期:</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">备注:{{ datumData.frozenCause }}</el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.lookData = false">关闭</el-button>
        </span>
        </el-dialog>

        <!-- 冻结弹窗 -->
        <el-dialog
        title="冻结"
        :visible.sync="frozenShow"
        width="30%">
        冻结原因：
        <el-input type='textarea' resize='none' v-model='frozenReason'></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="frozenShow = false">取 消</el-button>
            <el-button type="primary" @click="frozenSubmit">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 解冻弹窗 -->
        <el-dialog
        title="解冻"
        :visible.sync="thawShow"
        width="30%">
        <span>是否解冻</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="thawShow = false">取 消</el-button>
            <el-button type="primary" @click="thawSubmit">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 新增机器人 -->
        <el-dialog
            title="新增机器人"
            :visible.sync="dialog.addRobot"
            width="40%">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
                <el-form-item label="可分配的机器人数量：" prop="allotNum">
                    <el-input v-model="ruleForm.surplus" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="机器人数量：" prop="num">
                    <el-input v-model="ruleForm.num" auto-complete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="机器人有效期：" prop="effect">
                    <el-select v-model="ruleForm.effect" auto-complete="off">
                        <el-option v-for="(i, index) in data" :label="i.label" :value="i.id" :key="String(index)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效时间：">
                    <el-date-picker
                        prop="checkPass"
                        v-model="ruleForm.beginTime"
                        type="date"
                        placeholder="选择日期"
                        value-format="timestamp"
                        format="yyyy 年 MM 月 dd 日"
                        @change="addTimeStamp">
                    </el-date-picker>
                    <el-date-picker
                        v-model="ruleForm.endTime"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="timestamp">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.addRobot = false">取 消</el-button>
                <el-button type="primary" @click="submitRobot('ruleForm');dialog.addRobot = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分页 -->
        <el-pagination
            background
            layout="total, prev, pager, next, sizes, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.pagecurrent"
            :total="page.pagecount">
        </el-pagination>

        <!-- 新增代理商 -->
        <el-dialog class="agentPowerDialog"
        title="代理商开户"
        :visible.sync="dialog.OpenAccount"
        width="30%">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="120px" class="demo-ruleForm">
            <el-form-item label="代理商姓名：" prop="agentNameVal">
                <el-input v-model='ruleForm2.agentNameVal' disabled></el-input>
            </el-form-item>
            <el-form-item label="代理商账号：" prop="accountNum">
                <el-input v-model='ruleForm2.accountNum'></el-input>
            </el-form-item>
            <el-form-item label="权限角色选择：" prop="agentRoleVal">
                <el-select v-model='ruleForm2.agentRoleVal' >
                    <el-option v-for='(i, index) in ruleForm2.dialogAgentRole' :label='i.agentPackName' :value='i.agentPackSeq' :key='"agentPowerDialog2" + index'></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialog.OpenAccount = false">取 消</el-button>
            <el-button type="primary" @click="checkAccount('ruleForm2')">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import {baseUrl} from '../assets/api/api'
export default {
    data () {
        return {
            tableData: [], //表格数据
            dialogTableVisible: false,

            frozen: false,   //冻结
            thaw: false,    //解冻

            frozenShow: false,
            thawShow: false,
            frozenReason: '',    //冻结原因

            provinceLists: [],
            provinceVal: '',
            cityLists: [],
            cityVal: '',
            status: [
                {
                    value: '启用',
                    id: 0
                },
                {
                    value: '停用',
                    id: 1
                },
                {
                    value: '冻结',
                    id: 2
                }
            ],
            statusVal: '',
            statusNoNul: '',
            dialog: {       //弹窗
                lookData: false,
                addRobot: false,
                OpenAccount: false
            },
            row: {},
            datumData: {},
            page: {
                pagecount: 0,
                pagecurrent: 1
            },
            data: [{
                label: '7天',
                id: 604800000
            },{
                label: '30天',
                id: 2592000000
            },{
                label: '90天',
                id: 7776000000
            },{
                label: "180天",
                id: 15552000000
            }],
            ruleForm: {
                surplus: "",
                num: "",
                effect: "",
                beginTime: "",
                endTime: ""
            },
            rules: {
                num: [
                    { required: true, message: '请填写内容', trigger: 'blur' },
                ],
                effect: [
                    { required: true, message: '请填写有效期', trigger: 'blur' },
                ],
                checkPass: [
                    { required: true, message: '请填写生效时间', trigger: 'blur' },
                ]
            },
            search: {
                name: "",
                phone: "",
                status: "",
                province: "",
                city: ""
            },
            ruleForm2: {
                agentNameVal: "",
                accountNum: "",
                agentRoleVal: "",
                dialogAgentName: "",
                dialogAgentRole: ""
            },
            rules2: {
                accountNum: [
                    { required: true, message: '请填写代理商账号', trigger: 'blur' },
                ],
                agentRoleVal: [
                    { required: true, message: '请选择权限角色', trigger: 'change' },
                ]
            },
        }
    },
    created: function() {
        var _this = this;
        this.tableInit(1, 10);
        //获取省
        this.$axios.post(baseUrl + '/areacode/getProvince').then(res => {
            _this.provinceLists = res.data;
        }).catch(err => {
            console.log(err);
        })
    },
    methods: {
        handleSizeChange(val) {
            this.tableInit(1, val);
        },
        handleCurrentChange(val) {
            this.tableInit(val, 10);
        },
        /**
         * 表格初始化
         * @param  {[type]} page [description]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        tableInit: function(page, size) {
            var _this = this;
            $.ajax({
                url: baseUrl + '/agent/getAgentListByPage',
                type: 'post',
                async: false,
                xhrFields: {
                      withCredentials: true
                },
                data: {
                    agentName: _this.search.name,
                    agentBusinessEntityContactPhone: _this.search.phone,
                    agentStatus: _this.search.status,
                    agentProvince: _this.search.province,
                    agentCity: _this.search.city,
                    page: page,
                    size: size
                },
                success: function(res) {
                    _this.tableData = res.dataInfo;
                    _this.page.pagecount = res.count;
                    _this.tableData.forEach(function(ele, index) {
                        ele.location = ele.provinceName + ele.cityName;
                        if (ele.agentStatus == 0) {
                            ele.status = '启用';
                        } else if (ele.agnetStatus == 1) {
                            ele.status = '停用';
                        } else if (ele.agentStatus == 2) {
                            ele.status = '冻结'
                        } else if (ele.agentStatus == 3) {
                            ele.status = "未开户"
                        }
                    })

                    // _this.tableData.forEach(function(val, index) {
                    //
                    //     if (val.status === "未开户") {
                    //
                    //     } else {
                    //
                    //     }
                    // })
                },
                error: function(err) {
                    console.log(err);
                }
            })
        },
        tableClick: function(row, column) {
            this.row = row;
            console.log(row, column);
        },
        /**
         * [description]
         * @return {[type]} [description]
         */
        frozenClick: function() {
            this.frozenShow = true;
            this.datumShow = false;
        },
        thawClick: function() {
            this.thawShow = true;
            this.datumShow = false;
        },
        // 提交冻结
        frozenSubmit: function() {
            var _this = this;
            $.ajax({
                url: baseUrl + '/agent/updateAgentStatus',
                type: 'post',
                data: {
                    agentSeq: _this.row.agentSeq,
                    agentStatus: 2,
                    agentRemark: _this.frozenReason
                },
                success: function(res) {
                    _this.frozenShow = false;
                    _this.successShow = true;
                    _this.tableInit(1, 10);
                    _this.page.pagecurrent = 1;
                },
                error: function(err) {
                    console.log(err);
                }
            })
        },

        // 提交解冻
        thawSubmit: function() {
            var _this = this;
            $.ajax({
                url: baseUrl + '/agent/updateAgentStatus',
                type: 'post',
                data: {
                    agentSeq: _this.row.agentSeq,
                    agentStatus: 0
                },
                success: function(res) {
                    _this.thawShow = false;
                    _this.successShow = true;
                    _this.tableInit(1, 10);
                    _this.page.pagecurrent = 1;
                },
                error: function(err) {
                    console.log(err);
                }
            })
        },
        /**
         * 获取市
         * @return {[type]} [description]
         */
        changeProvice: function() {
            var _this = this;
            var params = new URLSearchParams;
            params.append('areaSupCode', this.search.province)
            this.$axios.post(baseUrl + '/areacode/getCity', params).then(res => {
                _this.cityLists = res.data;
            }).catch(err => {
                console.log(err);
            })
            if (this.statusNoNul == '') {
                this.$message({
                    showClose: true,
                    message: '警告，你还没有填写状态',
                    type: 'warning'
                });
                return;
            }
        },
        /**
         * 查看资料
         * @return {[type]} [description]
         */
        lookData: function() {
            var that = this;
            this.$nextTick(function() {
                $.ajax({
                    url: baseUrl + '/agent/getAgentBySeq',
                    type: 'post',
                    data: {
                        agentSeq: that.row.agentSeq
                    },
                    success: function(res) {
                        console.log(res);
                        that.datumData = res;
                        that.datumData.area = that.datumData.provinceName + that.datumData.cityName;
                        var now = new Date(that.datumData.agentBeginTime);
                        that.datumData.agentBeginTime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                        if (that.datumData.agentStatus == 0) {
                            that.datumData.agentStatus = '正常';
                            that.frozen = true;
                            that.thaw = false;
                        } else if (that.datumData.agentStatus == 2) {
                            that.datumData.agentStatus = '冻结';
                            that.thaw = true;
                            that.frozen = false;
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            })
        },
        /**
         * 加时间
         * @return {[type]} [description]
         */
        addTimeStamp: function(name) {
            this.ruleForm.endTime = this.ruleForm.effect + this.ruleForm.beginTime;
        },
        /**
         * 查看空闲机器人数
         * @return {[type]} [description]
         */
        clearData: function() {
            var that = this;
            this.ruleForm.endTime = "";
            this.ruleForm.effect = "";
            this.ruleForm.beginTime = "";
            $.ajax({
    			url: baseUrl + '/agentrobots/getFreeRobotsCount',
    			type: 'POST',
    			success: function(res) {
                    that.ruleForm.surplus = res;
    			},
    			error: function(returndata) {
					console.log(err);
				}
			});
        },
        /**
         * 发送机器人
         * @return {[type]} [description]
         */
        submitRobot: function(formName) {
            var that = this;
            var beginTime = new Date(this.ruleForm.beginTime);
            var endTime = new Date(this.ruleForm.endTime);
            var bT = beginTime.getFullYear() + '-' + (beginTime.getMonth() + 1) + '-' + beginTime.getDate();
            var eT = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate();
            var sendObj = {
                agentSeq: this.row.agentSeq,
                robotsNum: this.ruleForm.num,
                startTime: bT,
                allowTime: eT
            };
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    $.ajax({
                        url: baseUrl + '/agentrobots/addRobots',
                        type: 'post',
                        data: sendObj,
                        success: function(res) {
                            if (res == 0) {
                                that.$message({
                                    showClose: true,
                                    message: '成功的修改了',
                                    type: 'success'
                                });
                            } else if (res == 1) {
                                that.$message({
                                    showClose: true,
                                    message: '机器人数量不足',
                                    type: 'error'
                                });
                            }
                            that.tableInit(1, 10);
                            that.page.pagecurrent = 1;
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    })
                } else {
                    that.$message({
                        message: '未填写完整信息',
                        type: 'warning'
                    });
                    return false;
                }
            })

        },
        /**
         * 新增代理商开户
         * @return {[type]} [description]
         */
        addNew: function() {
            var that = this;
            this.$axios(baseUrl + '/agentpackage/getAgentPackageList')
            .then(res => {
                that.ruleForm2.dialogAgentRole = res.data;
            })
            .catch(err => {
                console.log(err);
            });
            this.$nextTick(function() {
                that.ruleForm2.agentNameVal = that.row.agentName;
            })
        },
        checkAccount: function(formName) {
            var that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    new Promise(function(resolve, reject) {
                        that.$axios({
                            url: baseUrl + '/agent/checkAgentLoginName',
                            method: 'post',
                            data: that.$qs.stringify({
                                'agentLoginName': that.ruleForm2.accountNum
                            })
                        })
                        .then(res => {
                            if (res.data === 0) {
                                resolve();
                            } else if (res.data == 1) {
                                reject();
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    })
                    .then(function() {
                        that.$axios({
                            url: baseUrl + "/agentpackage/updateNewAgentPackage",
                            method: "post",
                            data: that.$qs.stringify({
                                agentSeq: that.row.agentSeq,
                                password: that.$md5(that.row.agentBusinessEntityContactPhone.slice(-6)),
                                agentLoginName: that.ruleForm2.accountNum,
                                agentPackSeq: that.ruleForm2.agentRoleVal
                            })
                        })
                        .then(res => {
                            if (res.data === 1) {
                                that.$message({
                                    message: '该代理商已开户',
                                    type: 'warning'
                                })
                            } else if (res.data === 0) {
                                that.$message({
                                    message: '开户成功',
                                    type: 'success'
                                })
                            }
                            that.dialog.OpenAccount = false;
                            that.tableInit(1, 10);
                        })
                    }).catch(err => {
                        that.$message({
                            message: '代理商账号已存在',
                            type: 'error'
                        });
                    })
                } else {
                    that.$message({
                        message: '信息验证不成功',
                        type: 'error'
                    });
                    return false;
                }
            })
        },
        addNewAgent: function() {
            this.$router.push('/addNewAgent');
        }
    }
}
</script>

<style lang="less">
#agentList {
    .el-table {
        .cell {
            text-align: center;
        }
    }
    .content-header {
        height: 60px;
        line-height: 60px;
        position: relative;
        background-color: #fff;
        p {
            color: #3399ff;
            font-size: 18px;
        }
        .el-button {
            width: 100px;
            position: absolute;
            right: 20px;
            top: 10px;
        }
    }
    .search {
        background-color: #f0f3f6;
        padding: 14px 0;
        .content-ipt {
            background-color: #fff;
            padding: 24px 20px;
            .el-input {
                width: 120px;
            }
        }
    }
    .el-form-item {
        .el-select {
            width: 100%;
        }
        .el-date-editor {
            width: 49%;
        }
    }
    .el-dialog {
        .top {
            color: #333;
            font-size: 18px;
            height: 40px;
            line-height: 40px;
            background-color: #f0f3f6;
            margin: 0 -20px;
            padding: 0 20px;
        }
    }
}
</style>
