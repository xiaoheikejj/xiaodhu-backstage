<template lang="html">
<!-- sim卡管理 -->
<el-container class="simCard">
    <el-header>
        sim卡管理
        <el-button type='primary' @click='saveInformation = true'>
            信息录入
        </el-button>
    </el-header>
    <el-main>
        <!-- 搜索 -->
        <div class="search">
            <div class="center">
                sim卡号:
                <el-input v-model="search.name"></el-input>
                机器码:
                <el-input v-model="search.code"></el-input>
                插孔编号:
                <el-input v-model="search.number"></el-input>
                <el-button type='danger' @click="tableInit(1, 10)">搜索</el-button>
            </div>
        </div>
        <!-- 表格 -->
        <el-table ref="multipleTable" :data='tableData' tooltip-effect="dark" style="width: 100%" stripe @cell-click='uniteChange'>
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop='simNum' label="sim卡号"></el-table-column>
            <el-table-column prop="simMachineCode" label="所属机器码"></el-table-column>
            <el-table-column prop="simHubIndex" label="插孔编码"></el-table-column>
            <el-table-column prop="mercName" label="使用商户"></el-table-column>
            <el-table-column prop="entry_time" label="录入时间"></el-table-column>
            <el-table-column prop="agentAllow_time" label="代理商到期日"></el-table-column>
            <el-table-column prop="mercAllow_time" label="商户到期日"></el-table-column>
            <el-table-column prop="waitTask" label="待执行任务"></el-table-column>
            <el-table-column prop="overTask" label="已执行任务"></el-table-column>
            <el-table-column prop="states" label="状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click='popStop'>停止</el-button>
                    <el-button type="text" size="small" @click='popUnit'>解绑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 信息录入弹窗 -->
        <el-dialog
        title="sim卡录入"
        :visible.sync="saveInformation"
        width="30%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="SIM卡归属：" prop="ascriptionSIM">
                    <el-select v-model="ruleForm.ascriptionSIM" placeholder="请选择" @change='SIM_simChange'>
                        <el-option v-for='(i, index) in ascription_SIM' :value='i.mercSeq' :label="i.mercName" :key='"ascription_SIM" + index'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="SIM卡卡号：" prop="SIMCard">
                    <el-input v-model="ruleForm.SIMCard"></el-input>
                </el-form-item>
                <el-form-item label="选择机器：" prop="selectMachine">
                    <el-select v-model="ruleForm.selectMachine" placeholder="请选择" @change='SIM_machineChange'>
                        <el-option v-for='(i, index) in machine_List' :value='i' :key='"machine_List" + index'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="插孔编号：" prop="jackNum">
                    <el-select v-model="ruleForm.jackNum" placeholder="请选择">
                        <el-option v-for='(i, index) in jackList' :value="i" :key='"jackList" + index'></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveInformation = false">取 消</el-button>
                <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 机器窗口被占用弹窗 -->
        <el-dialog
        :visible.sync="machineOccupy"
        width="30%">
            <span>机器端口被占用</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="machineOccupy = false">取 消</el-button>
                <el-button type="primary" @click='machineOccupy = false'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 解绑关系弹窗 -->
        <el-dialog
        title="关系解除"
        :visible.sync="unite"
        width="30%">
            <span>确定要解绑吗</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="unite = false">取 消</el-button>
                <el-button type="primary" @click='uniteSubmit'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 解绑关系解绑失败弹窗 -->
        <el-dialog
        title="关系解除失败"
        :visible.sync="uniteFail"
        width="30%">
            <span>该卡正在执行任务，解绑失败！！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uniteFail = false">取 消</el-button>
                <el-button type="primary" @click='uniteFail = false'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 解绑成功了弹窗 -->
        <el-dialog
        title="关系解除"
        :visible.sync="uniteSuccess"
        width="30%">
            <span>解绑成功了</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uniteSuccess = false">取 消</el-button>
                <el-button type="primary" @click='uniteSuccess = false'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 停止弹窗 -->
        <el-dialog
        title="停止"
        :visible.sync="stop"
        width="30%">
            <span>确定要停止吗</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stop = false">取 消</el-button>
                <el-button type="primary" @click='stopSubmit'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 停止失败弹窗 -->
        <el-dialog
        title="停止失败"
        :visible.sync="stopFail"
        width="30%">
            <span>该卡正在执行任务，是否强制停止！！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stopFail = false">取 消</el-button>
                <el-button type="primary" @click='stopSubmit'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 停止成功弹窗 -->
        <el-dialog
        title="停止成功"
        :visible.sync="stopSuccess"
        width="30%">
            <span>停止成功！！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stopSuccess = false">取 消</el-button>
                <el-button type="primary" @click='stopSuccess = false'>确 定</el-button>
            </span>
        </el-dialog>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync = "page.pagecurrent"
            :total='page.pagecount'
            v-if="page.pagecount != 0">
        </el-pagination>
    </el-main>
    <el-footer>
        <!-- <el-checkbox label="全选"></el-checkbox>
        <el-button type='info' style="margin-left: 20px;">
            批量解除
        </el-button> -->
    </el-footer>
</el-container>
</template>

<script>
import {baseUrl} from '../../assets/api/api'
export default {
    data: function() {
        return {
            tableData: [],
            saveInformation: false,  //信息录入弹窗
            machineOccupy: false,   //机器窗口被占用弹窗
            unite: false,   //关系解除弹窗
            uniteFail: false,   //关系解除失败弹窗
            uniteSuccess: false,    //解绑成功了
            stop: false,    //停止弹窗
            stopFail: false,
            stopSuccess: false, //停止成功
            ruleForm: {
                ascriptionSIM: '',   //sim卡归属
                SIMCard: '',    //SIM卡号
                selectMachine: '',  //机器选择
                jackNum: '',    //插孔编号
            },
            ascription_SIM: [],  //sim卡归属
            machine_List: [],    //选择机器列表
            jackList: [],       //插孔编号的列表
            cellList: {},    //点击后这一列的信息
            page: {
                pagecurrent: 1,
                pagecount: 0
            },
            search: {
                name: "",
                code: "",
                number: ""
            },
            rules: {
                ascriptionSIM: [
                    { required: true, message: '请选择sim归属', trigger: 'change' }
                ],
                SIMCard: [
                    { required: true, message: 'sim卡号', trigger: 'blur' },
                ],
                selectMachine: [
                    { required: true, message: '请选择机器', trigger: 'change' },
                ],
                jackNum: [
                    { required: true, message: '请选择插孔编号', trigger: 'change' },
                ]
            }
        }
    },
    created: function() {
        var _this = this;
        // sim列表
        this.tableInit(1, 10);
        // 弹窗sim卡归属列表
        this.$axios(baseUrl + '/merchant/getMerchantList')
        .then(res => {
            _this.ascription_SIM = res.data.dataInfo;
        })
        .catch(err => {
            console.log(err);
        })
    },
    methods: {
        handleSizeChange(val) {
            this.tableInit(1, val);
        },
        handleCurrentChange(val) {
            this.tableInit(val, 10);
            console.log(this.page.pagecurrent);
        },
        /**
         * SIM卡归属
         * @return {[type]} [description]
         */
        SIM_simChange: function() {
            this.ruleForm.selectMachine = "";
            this.ruleForm.jackNum = "";
            var _this = this;
            // 获取完mercSeq后获取选择机器的值
            var sendObj = {
                mercSeq: parseInt(this.ruleForm.ascriptionSIM)
            }
            this.$axios({
                url: baseUrl + '/sim/getDeviceByMercSeq',
                method: 'post',
                data: _this.$qs.stringify(sendObj)
            })
            .then(res => {
                _this.machine_List = res.data.dataInfo;
            })
            .catch(err => {
                console.log(err);
            })
        },
        tableInit: function(page, size) {
            var _this = this;
            var params = new URLSearchParams();
            params.append('simNum', this.search.name);
            params.append('simMachineCode', this.search.code);
            params.append('simHubIndex', this.search.number);
            params.append('page', page);
            params.append('size', size);
            this.$axios.post(baseUrl + '/sim/getSimVOListByPage', params).then(res => {
                _this.tableData = res.data.dataInfo;
                this.page.pagecount = res.data.count;
                _this.tableData.forEach(function(ele, index) {
                    //录入时间
                    var simEntryTime = new Date(ele.simEntryTime);
                    ele.entry_time = simEntryTime.getFullYear() + '年' + (simEntryTime.getMonth() + 1) + '月' + simEntryTime.getDate() + '日';
                    //代理商到期日
                    var agentAllowTime = new Date(ele.agentAllowTime);
                    ele.agentAllow_time = agentAllowTime.getFullYear() + '年' + (agentAllowTime.getMonth() + 1) + '月' + agentAllowTime.getDate() + '日';
                    //商户到期日
                    var mercAllowTime = new Date(ele.mercAllowTime);
                    ele.mercAllow_time = mercAllowTime.getFullYear() + '年' + (mercAllowTime.getMonth() + 1) + '月' + mercAllowTime.getDate() + '日';

                    //判断启用状态
                    if (ele.simStatus == 0) {
                        ele.states = '未启用';
                    } else if (ele.simStatus == 1) {
                        ele.states = '已启用';
                    } else if (ele.simStatus == 2) {
                        ele.states = '已损坏';
                    }
                })
            }).catch(err => {
                console.log(err);
            });
        },
        SIM_machineChange: function() {
            var _this = this;
            var sendObj = {
                mercSeq: parseInt(this.ruleForm.ascriptionSIM),
                deviceCode: this.ruleForm.selectMachine
            }
            this.$axios({
                url: baseUrl + '/sim/getPortByDevice',
                method: 'post',
                data: this.$qs.stringify(sendObj)
            })
            .then(res => {
                this.jackList = res.data.dataInfo;
            })
            .catch(err => {
                console.log(err);
            })
        },
        submit: function(formName) {
            var _this = this;
            var sendObj = {
                mercSeq: this.ruleForm.ascriptionSIM,
                simNum: this.ruleForm.SIMCard,
                simMachineCode: this.ruleForm.selectMachine,
                simHubIndex: this.ruleForm.jackNum
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    $.ajax({
                        url: baseUrl + '/sim/addSimInfo',
                        type: 'POST',
                        data: sendObj,
                        success: function(res) {
                            console.log(res)
                            _this.saveInformation = false;
                            if (res.status === "1") {
                                _this.$message({
                                    message: res.errorMsg,
                                    type: 'warning'
                                });
                            } else if (res.status === "0") {
                                _this.$message({
                                    message: res.errorMsg,
                                    type: 'success'
                                });
                                _this.tableInit(1, 10);
                                this.page.pagecurrent = 1;
                            }
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    })
                } else {
                    _this.$message({
                        message: '信息验证不成功',
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        // 弹出是否解绑
        popUnit: function() {
            var _this = this;
            this.$nextTick(function() {
                $.ajax({
                    url: baseUrl + '/sim/deleteSimCheck',
                    type: 'POST',
                    data: {
                        simNum: _this.cellList.simNum
                    },
                    success: function(res) {
                        if (res == 0) {
                            _this.unite = true;
                            _this.tableInit(1, 10);
                            _this.page.pagecurrent = 1;
                        } else if (res == 1) {
                            _this.uniteFail = true;
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            })
        },
        //解绑需要传入的信息
        uniteChange(row) {
            this.cellList = row;
        },
        // 解绑提交
        uniteSubmit: function() {
            var _this = this;
            var sendObj = {
                simNum: this.cellList.simNum,
                simMachineCode: this.cellList.simMachineCode,
                simHubIndex: this.cellList.simHubIndex
            }
            $.ajax({
                url: baseUrl + '/sim/deleteSim',
                type: 'POST',
                data: sendObj,
                success: function(res) {

                    if (res == 0) {
                        _this.unite = false;
                        _this.uniteSuccess = true;
                        _this.tableInit(1, 10);
                        _this.page.pagecurrent = 1;
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            })
        },

        //弹出停止弹窗
        popStop: function() {
            var _this = this;
            this.$nextTick(function() {
                $.ajax({
                    url: baseUrl + '/sim/deleteSimCheck',
                    type: 'POST',
                    data: {
                        simNum: _this.cellList.simNum
                    },
                    success: function(res) {
                        if (res == 0) {
                            _this.stop = true;
                        } else if (res == 1) {
                            _this.stopFail = true;
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            })
        },

        //提交停止
        stopSubmit: function() {
            var _this = this;
            var sendObj = {
                simNum: this.cellList.simNum,
                simMachineCode: this.cellList.simMachineCode,
                simHubIndex: this.cellList.simHubIndex
            }
            $.ajax({
                url: baseUrl + '/sim/stopSim',
                type: 'POST',
                data: sendObj,
                success: function(res) {
                    if (res == 0) {
                        _this.stop= false;
                        _this.stopFail = false;
                        _this.stopSuccess = true;
                        _this.tableInit(1, 10);
                        _this.page.pagecurrent = 1;
                    }
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
.simCard {
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
            &:nth-of-type(2) {
                position: absolute;
                right: 140px;
                top: 10px;
            }
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
                        background-color: #f0f3f6;
                    }
                }
            }
        }
    }
    .el-form-item .el-select {
        width: 100%;
    }
    .cell {
        text-align: center;
    }
    .el-footer {
        line-height: 60px;
    }
}
</style>
