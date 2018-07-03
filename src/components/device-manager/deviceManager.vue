<template lang="html">
<!-- 设备管理 -->
<el-container class="deviceManager">
    <el-header>
        设备管理
        <el-button type='primary' @click="dialogVisible = true">
            信息录入
        </el-button>
    </el-header>
    <el-main>
        <!-- 搜索 -->
        <div class="search">
            <div class="center">
                机器码:
                <el-input v-model="search.name"></el-input>
                设备归属:
                <el-select v-model='search.equipment'>
                    <el-option v-for='(i, index) in equipOwnership' :label='i.value' :value="i.value" :key='"deviceManager" + index'>
                    </el-option>
                </el-select>
                <el-button type='danger' @click="tableInit(1, 10)">搜索</el-button>
            </div>
        </div>
        <!-- 表格 -->
        <el-table ref="multipleTable" :data='tableData' tooltip-effect="dark" style="width: 100%" stripe  @cell-click="cellDetail">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop='deviceCode' label="机器码"></el-table-column>
            <el-table-column prop="deviceProName" label="厂家"></el-table-column>
            <el-table-column prop="deviceModel" label="型号"></el-table-column>
            <el-table-column prop="deviceIpAddr" label="IP"></el-table-column>
            <el-table-column prop="devicePort" label="端口"></el-table-column>
            <el-table-column prop="simNumnber" label="已插入sim卡数"></el-table-column>
            <el-table-column prop="workSimNum" label="执行任务sim卡数"></el-table-column>
            <el-table-column prop="deviceHome" label="设备所在地"></el-table-column>
            <el-table-column prop="entryTime" label="录入时间"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click='stop'>停止</el-button>
                    <el-button type="text" size="small" @click='popStart = true'>启动</el-button>
                    <el-button type="text" size="small" @click='jump'>详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            :current-page.sync="page.pagecurrent"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.pagecount">
        </el-pagination>

        <!-- 弹窗 -->
        <el-dialog
        title="设备信息录入"
        :visible.sync="dialogVisible"
        width="30%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="机器码：" prop="machineCode">
                    <el-input v-model="ruleForm.machineCode"></el-input>
                </el-form-item>
                <el-form-item label="厂商：" prop="factory">
                    <el-select v-model="ruleForm.factory" placeholder="请选择" @change='facChange'>
                        <el-option v-for='(i, index) in factory' :value='i.name' :key='"factory" + index'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="型号：" prop="model">
                    <el-select v-model="ruleForm.model" placeholder="请选择" @change='modChange'>
                        <el-option v-for='(i, index) in options' :value="i.value" :key='"deviceManagerModel" + index'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="IP：" prop="IP">
                    <el-input v-model="ruleForm.IP" class="ipAddress"></el-input>
                </el-form-item>
                <el-form-item label="端口：" prop="port">
                    <el-input v-model="ruleForm.port" class="port"></el-input>
                </el-form-item>
                <el-form-item label="设备归属：" prop="ascriptionA">
                    <el-select v-model="ruleForm.ascriptionA" placeholder="请选择" @change='ascriptionChange'>
                        <el-option v-for='(i, index) in equip' :value="i.ascription" :key='"equipA" + index'></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 停止弹出弹窗 -->
        <el-dialog
        title='停止'
        :visible.sync="popStop"
        width="30%">
            <span>是否停止</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="popStop = false">取 消</el-button>
                <el-button type="primary" @click='stopSubmit'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 启用弹出弹窗 -->
        <el-dialog
        title='启用'
        :visible.sync="popStart"
        width="30%">
            <span>是否启动</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="popStart = false">取 消</el-button>
                <el-button type="primary" @click='startSubmit();popStart = false'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 停止成功弹窗 -->
        <el-dialog
        title='停止成功'
        :visible.sync="stopSuccess"
        width="30%">
            <span>停止成功</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stopSuccess = false">取 消</el-button>
                <el-button type="primary" @click='stopSuccess = false'>确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</el-container>
</template>

<script>
import {baseUrl} from "../../assets/api/api"
export default {
    data: function() {
        return {
            popStop: false,     //弹出停止
            stopSuccess: false, //停止成功
            popStart: false,
            tableData: [],
            //设备归属
            equipOwnership: [{
                value: '总公司'
            }],
            value: '',
            dialogVisible: false,    //设备信息录入开关
            ruleForm: {
                machineCode: '',
                factory: '',
                model: '',
                IP: '',
                port: '',
                ascriptionA: ''
            },       //form对象
            options: [{
                value: '8孔',
                id: 8
            },
            {
                value: '16孔',
                id: 16
            },
            {
                value: '32孔',
                id: 32
            }],
            equip: [{
                ascription: '总公司'
            }],
            factory: [{
                name: '厂商a'
            },{
                name: '厂商b'
            }],
            fac: '',     //改变后的厂商
            mod: '',      //改变后的模型
            asc: '',       //该变后设备归属
            deviceCode: '',     //点击产生的机器码
            row: {},

            page: {
                pagecount: 0,
                pagecurrent: 1
            },
            search: {
                name: "",
                equipment: ""
            },
            rules: {
                machineCode: [
                    { required: true, message: '请输入机器码', trigger: 'blur' }
                ],
                factory: [
                    { required: true, message: '请选择厂商', trigger: 'change' }
                ],
                model: [
                    { required: true, message: '请选择型号', trigger: 'change' }
                ],
                IP: [
                    { required: true, message: '请输入IP', trigger: 'blur' }
                ],
                port: [
                    { required: true, message: '请输入端口', trigger: 'blur' }
                ],
                ascriptionA: [
                    { required: true, message: '请选择设备归属', trigger: 'change' }
                ]
            }
        }
    },
    created: function() {
        var _this = this;
        this.tableInit(1, 10);
    },
    methods: {
        handleSizeChange(val) {
            this.tableInit(1, val);
        },
        handleCurrentChange(val) {
            this.tableInit(val, 10);
        },
        tableInit: function(page, size) {
            var _this = this;
            var params = new URLSearchParams();
            params.append('deviceCode', this.search.name);
            params.append('deviceHome', this.search.equipment);
            params.append('page', page);
            params.append('size', size);
            this.$axios.post(baseUrl + '/device/getDeviceListByPage', params).then(res => {
                _this.tableData = res.data.dataInfo;
                this.page.pagecount = res.data.count;
                _this.tableData.forEach(function(ele, index) {
                    var time = new Date(ele.deviceEntryTime);
                    ele.entryTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
                    if (ele.deviceStatus == 0) {
                        ele.status = '运行';
                    } else if (ele.deviceStatus == 1) {
                        ele.status = '停止';
                    } else if (ele.deviceStatus == 2) {
                        ele.status = '损坏';
                    }
                })
            }).catch(err => {
                console.log(err);
            })
        },
        jump: function() {
            var _this= this;
            //active的页码
            var activePage = $('.number.active').text();
            this.$nextTick(function() {
                sessionStorage.setItem('deviceCode', _this.deviceCode);
                var objData = {
                    deviceCode: _this.deviceCode,
                    page: parseInt(activePage),
                    size: 10
                };
                $.ajax({
                    url: baseUrl + '/deviceport/searchDevicePortList',
                    type: 'POST',
                    data: objData,
                    success: function(res) {
                        // 保存下成功的返回结果跳转下一页
                        sessionStorage.setItem('jackDetailValue', JSON.stringify(res.dataInfo));
                        sessionStorage.setItem('count', res.count);
                        _this.$router.push('/jackDetail');
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            })
        },
        cellDetail(row, column, cell) {
            this.deviceCode = row.deviceCode;
            this.row = row;
        },
        facChange(name) {
            this.fac = name;
        },
        modChange(name) {
            this.mod = name;
        },
        ascriptionChange(name) {
            this.asc = name;
        },
        submit: function(formName) {
            var _this = this;
            var dC = $('.mC input').val(),
                //型号的Int
                modInt = parseInt(this.mod.split('孔')[0]),
                ipAddress = $('.ipAddress input').val(),
                port = $('.port input').val();

            //传入给后台的数据
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.$axios({
                        url: baseUrl + '/device/addDevice',
                        method: 'post',
                        data: _this.$qs.stringify({
                            deviceCode: this.ruleForm.machineCode,
                            deviceProName: this.ruleForm.factory,
                            deviceModel: this.ruleForm.model,
                            deviceIpAddr: this.ruleForm.IP,
                            devicePort: parseInt(this.ruleForm.port),
                            deviceHome: this.ruleForm.ascriptionA,
                            slotNum: modInt
                        })
                    })
                    .then(res => {
                        if (res.data === 1) {
                            _this.$message({
                               message: '设备码重复',
                               type: 'warning'
                           });
                       } else if (res.data === 0) {
                           _this.$message({
                              message: '成功',
                              type: 'success'
                          });
                       }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    this.dialogVisible = false;
                } else {
                    _this.$message({
                        message: '信息验证失败',
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        stop: function() {
            // 这个不用验证
            this.popStop = true;
        },
        stopSubmit: function() {
            var _this = this;
            var sendObj = {
                deviceCode: this.row.deviceCode,
                deviceSeq: this.row.deviceSeq
            };
            $.ajax({
                url: baseUrl + '/device/stopDeviceStatus',
                type: 'post',
                data: sendObj,
                success: function(res) {
                    _this.popStop = false;
                    _this.$message({
                        message: '成功的停止了',
                        type: 'success'
                    });
                    _this.tableInit(1, 10);
                    _this.page.pagecurrent = 1;
                },
                error: function(err) {
                    console.log(err);
                }
            })
        },
        startSubmit: function() {
            var _this = this;
            var sendObj = {
                deviceCode: this.row.deviceCode,
                deviceSeq: this.row.deviceSeq
            };
            $.ajax({
                url: baseUrl + '/device/startDeviceStatus',
                type: 'post',
                data: sendObj,
                success: function(res) {
                    _this.$message({
                        message: '成功的开启了',
                        type: 'success'
                    });
                    _this.tableInit(1, 10);
                    _this.page.pagecurrent = 1;
                },
                error: function(err) {
                    console.log(err);
                }
            })
        }
    }
}
</script>

<style lang="less">
html, body, #app, .el-container {
    height: 100%;
}
.deviceManager {
    .el-header {
        line-height: 60px;
        font-size: 18px;
        color: #3399ff;
        background-color: #fff;
        position: relative;
        .el-button {
            &:nth-of-type(1) {
                position: absolute;
                right: 20px;
                top: 10px;
            }
            // &:nth-of-type(2) {
            //     position: absolute;
            //     right: 140px;
            //     top: 10px;
            // }
        }
    }
    .el-main {
        .search {
            padding: 14px 0;
            background-color: #f0f3f6;
            .center {
                background-color: #fff;
                line-height: 88px;
                padding: 0 20px;
                color: #333;
                font-size: 16px;
                letter-spacing: 3px;
                .el-input {
                    margin-right: 20px;
                    width: auto;
                    input {
                        width: 120px;
                        background-color: #f0f3f6;
                    }
                }
            }
        }
        .cell {
            text-align: center;
        }
    }
}
</style>
