<template lang="html">
<!-- 插孔详情 -->
<el-container class="jackDetail">
    <el-header>
        <i onclick="javascript:history.back(-1)" @click='goBack'></i>
        插孔详情
    </el-header>
    <el-main>
        <!-- 搜索 -->
        <div class="search">
            <div class="center">
                机器码/使用商户/代理商:
                <el-input v-model="search.name"></el-input>
                插孔编号:
                <el-input v-model="search.card"></el-input>
                插槽状态:
                <el-select v-model="search.status">
                    <el-option v-for="(i, index) in search.statusList" :label="i.value" :value="i.id" :key="String(index)"></el-option>
                </el-select>
                <el-button type='danger' @click="tableInit(1, 10)">搜索</el-button>
            </div>
        </div>
        <!-- 表格 -->
        <el-table ref="multipleTable" :data='tableData' tooltip-effect="dark" style="width: 100%" stripe @cell-click='relationChange'>
            <el-table-column prop='deviceCode' label="机器码"></el-table-column>
            <el-table-column prop="slotIndex" label="插孔编号"></el-table-column>
            <el-table-column prop="agentName" label="代理商"></el-table-column>
            <el-table-column prop="simNum" label="SIM卡号"></el-table-column>
            <el-table-column prop="entryTime" label="插入时间"></el-table-column>
            <el-table-column prop="mercName" label="使用商户"></el-table-column>
            <el-table-column prop="remain_time" label="剩余有效期"></el-table-column>
            <el-table-column prop="allow_time" label="到期日"></el-table-column>
            <el-table-column prop="states" label="插槽状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click='reviseStates = true'>修改插槽状态</el-button>
                    <el-button type="text" size="small" @click='relatioBroken = true'>关系解除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.currentPage1"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.pagecount"
            v-if="page.pagecount != 0">
        </el-pagination>
        <!-- 关系解除弹窗 -->
        <el-dialog
        title="关系解除"
        :visible.sync="relatioBroken"
        width="30%">
            选择解除关系：
            <el-select v-model='chooseRelation' @change='selectMerchant'>
                <el-option value="商户"></el-option>
                <el-option value="代理商"></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="relatioBroken = false">取 消</el-button>
                <el-button type="primary" @click='selectMerchantSubmit'>确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改插槽状态弹窗 -->
        <el-dialog
        title="修改插槽状态"
        :visible.sync="reviseStates"
        width="30%">
            状态选择：
            <el-select v-model='chooseReviseStates' @change='reviseStatesChange'>
                <el-option label="未启用" value="0"></el-option>
                <el-option label="已启用" value="1"></el-option>
                <el-option label="已损坏" value="2"></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="reviseStates = false">取 消</el-button>
                <el-button type="primary" @click='reviseStatesSubmit'>确 定</el-button>
            </span>
        </el-dialog>
        <!-- 关系解除弹窗修改成功 -->
        <el-dialog
        title="修改插槽状态"
        :visible.sync="successDialog"
        width="30%">
            <span>你已经成功的修改了状态</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="successDialog = false">取 消</el-button>
                <el-button type="primary" @click='successDialog = false'>确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</el-container>
</template>

<script>
import {baseUrl} from '../../assets/api/api'
export default {
    data: function() {
        return {
            tableData: [],
            relatioBroken: false,    //关系解除
            reviseStates: false,    //修改插槽状态
            successDialog: false,
            chooseRelation: '',     //关系解除选择
            chooseReviseStates: "",
            slotStates: '',      //插槽状态
            DEVICE_CODE: '',    //存放解除商户/代理商的code
            SLOT_INDEX: '',     //存放解除商户/代理商的插槽码
            SIM_NUM: '',          //存放解除商户/代理商的手机号
            SELECTMerchantName: '',     //存放选择的是商户还是代理商
            reviseStatesName: '',    //插槽状态
            reviseStatesInt: 0,
            page: {
                pagecount: 0,    //table总数
                currentPage1: 1,
                size: 0
            },
            search: {
                name: "",
                card: "",
                status: "",
                statusList: [
                    {
                        value: "未启用",
                        id: 0
                    },
                    {
                        value: "已启用",
                        id: 1
                    },
                    {
                        value: "已损坏",
                        id: 2
                    }
                ]
            }
        }
    },
    created: function() {
        var _this = this;
        var jackDetailTableData = JSON.parse(sessionStorage.getItem('jackDetailValue'));
        var pagecount = sessionStorage.getItem('count');
        this.page.pagecount = parseInt(pagecount);
        this.tableData = jackDetailTableData;
        this.tableData.forEach(function(ele, index) {
            //计算插入时间
            var SIM_ENTRY_TIME = new Date(ele.simEntryTime);
            //去掉无效日期
            if (SIM_ENTRY_TIME != 'Invalid Date') {
                ele.entryTime = SIM_ENTRY_TIME.getFullYear() + '.' + (SIM_ENTRY_TIME.getMonth() + 1) + '.' + SIM_ENTRY_TIME.getDate();
            }

            // 计算剩余有效期
            var REMAIN_TIME = ele.allowTime - ele.startTime;
            if (REMAIN_TIME != 'Invalid Date') {
                ele.remain_time = parseInt(REMAIN_TIME/1000/3600/24) + '天';
                if (ele.remain_time == 'NaN天') {
                    ele.remain_time = '';
                }
            }

            //到期日
            var ALLOW_TIME = new Date(ele.allowTime);
            if (ALLOW_TIME != 'Invalid Date') {
                ele.allow_time = ALLOW_TIME.getFullYear() + '.' + (ALLOW_TIME.getMonth() + 1) + '.' + ALLOW_TIME.getDate();
            }
            //判断启用状态
            if (ele.slotStatus == 0) {
                ele.states = '未启用';
            } else if (ele.slotStatus == 1) {
                ele.states = '已启用';
            } else if (ele.slotStatus == 2) {
                ele.states = '已损坏';
            }
        })
    },
    methods: {
        handleSizeChange(val) {
            this.size = val;
            this.tableInit(1, val);
        },
        handleCurrentChange(val) {
            var that = this;
            this.tableInit(val, 10);
        },
        tableInit: function(page, size) {
            var that = this;
            var deviceCode = sessionStorage.getItem('deviceCode');
            $.ajax({
                url: baseUrl + '/deviceport/getDevicePortListByPage',
                type: 'POST',
                data: {
                    search: that.search.name,
                    slotIndex: that.search.card,
                    slotStatus: that.search.status,
                    deviceCode: deviceCode,
                    page: page,
                    size: size
                },
                success: function(res) {
                    that.tableData = res.dataInfo;
                    that.tableData.forEach(function(ele, index) {
                        //计算插入时间
                        var SIM_ENTRY_TIME = new Date(ele.simEntryTime);
                        //去掉无效日期
                        if (SIM_ENTRY_TIME != 'Invalid Date') {
                            ele.entryTime = SIM_ENTRY_TIME.getFullYear() + '.' + (SIM_ENTRY_TIME.getMonth() + 1) + '.' + SIM_ENTRY_TIME.getDate();
                        }

                        // 计算剩余有效期
                        var REMAIN_TIME = ele.allowTime - ele.startTime;
                        if (REMAIN_TIME != 'Invalid Date') {
                            ele.remain_time = parseInt(REMAIN_TIME/1000/3600/24) + '天';
                            if (ele.remain_time == 'NaN天') {
                                ele.remain_time = '';
                            }
                        }

                        //到期日
                        var ALLOW_TIME = new Date(ele.allowTime);
                        if (ALLOW_TIME != 'Invalid Date') {
                            ele.allow_time = ALLOW_TIME.getFullYear() + '.' + (ALLOW_TIME.getMonth() + 1) + '.' + ALLOW_TIME.getDate();
                        }

                        //判断启用状态
                        if (ele.slotStatus == 0) {
                            ele.states = '未启用';
                        } else if (ele.slotStatus == 1) {
                            ele.states = '已启用';
                        } else if (ele.slotStatus == 2) {
                            ele.states = '已损坏';
                        }
                    })
                },
                error: function(err) {
                    console.log(err);
                }
            })
        },
        goBack: function() {
            //用完就甩
            sessionStorage.removeItem('jackDetailValue');
        },
        selectMerchant(name) {
            this.SELECTMerchantName = name;
        },
        reviseStatesChange(name) {
            this.reviseStatesName = name;
        },
        relationChange(row) {
            this.DEVICE_CODE = row.deviceCode;
            this.SLOT_INDEX = row.slotIndex;
            this.SIM_NUM = row.simNum;
        },
        selectMerchantSubmit: function() {
            var that = this;
            var submitObj = {
                deviceCode: this.DEVICE_CODE,
                slotIndex: this.SLOT_INDEX,
                simNum: this.SIM_NUM
            }
            if (this.SELECTMerchantName == '商户') {
                $.ajax({
                    url: baseUrl + '/deviceport/removeMerchant',
                    type: 'POST',
                    async: false,
                    data: submitObj,
                    success: function(res) {
                        that.$message({
                            message: '关系成功解除',
                            type: 'success'
                        });
                        that.tableInit(1, 10);
                        that.page.currentPage1 = 1;
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            } else if (this.SELECTMerchantName == '代理商') {
                $.ajax({
                    url: baseUrl + '/deviceport/removeAgent',
                    type: 'POST',
                    async: false,
                    data: submitObj,
                    success: function(res) {
                        that.$message({
                            message: '关系成功解除',
                            type: 'success'
                        });
                        that.tableInit(1, 10);
                        that.page.currentPage1 = 1;
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            }
            this.relatioBroken = false;
        },
        reviseStatesSubmit: function() {
            var that = this;
            var submitObj = {
                deviceCode: this.DEVICE_CODE,
                slotIndex: this.SLOT_INDEX,
                slotStatus: this.chooseReviseStates
            }
            console.log(submitObj);
            $.ajax({
                url: baseUrl + '/deviceport/updateSlotStatus',
                type: 'POST',
                data: submitObj,
                async: false,
                success: function(res) {
                    if (res == 0) {
                        that.$message({
                            message: '成功的修改了',
                            type: 'success'
                        });
                        that.tableInit(1, 10);
                        that.page.currentPage1 = 1;
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            })
            this.reviseStates = false;
            this.successDialog = true;
        }
    }
}
</script>

<style lang="less">
html, body, #app, .el-container {
    height: 100%;
}
.jackDetail {
    .el-header {
        line-height: 60px;
        font-size: 18px;
        color: #3399ff;
        background-color: #fff;
        position: relative;
        i {
            display: inline-block;
            width: 22px;
            height: 16px;
            background: url(/static/back.png) no-repeat center/22px 16px;
            margin-right: 10px;
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
                    &:not(:nth-of-type(1)) {
                        input {
                            width: 120px;
                        }
                    }
                }
                .el-select {
                    width: 120px;
                }
            }
        }
        .cell {
            text-align: center;
        }
    }
}
</style>
