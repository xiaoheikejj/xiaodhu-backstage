<template lang="html">
<!-- 商户审核 -->
<el-container class="merchantExamine">
    <el-header>
        商户审核
    </el-header>
    <el-main>
        <!-- 搜索 -->
        <div class="search">
            <div class="center">
                企业名称/编号/关键字:
                <el-input v-model="search.name"></el-input>
                提交人:
                <el-input v-model="search.person"></el-input>
                提交审核时间:
                <el-date-picker
                    v-model="search.beginTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                至
                <el-date-picker
                    v-model="search.endTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-button type='danger' @click="tableInit(1, 10)">搜索</el-button>
            </div>
        </div>
        <!-- 表格 -->
        <el-table ref="multipleTable" :data='tableData.slice((this.pageNum-1)*this.pageSize, this.pageNum*this.pageSize)' tooltip-effect="dark" style="width: 100%" stripe
        @cell-click='changeExamine'>
            <el-table-column prop='MERC_SEQ' label="用户编号"></el-table-column>
            <el-table-column prop="MERC_NAME" label="用户名称"></el-table-column>
            <el-table-column prop="MERC_BEGIN_TIME" label="提交审核时间"></el-table-column>
            <el-table-column prop="AGENT_NAME" label="提交人"></el-table-column>
            <el-table-column prop="MERC_CHECK_STATUS" label="状态"></el-table-column>
            <el-table-column prop="CHECK_REMARK" label="说明"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="lookInformation">查看资料</el-button>
                    <el-button type="text" size="small" @click="examine = true">审核</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 审核弹窗 -->
        <el-dialog
        title='审核'
        :visible.sync="examine"
        width="20%">
            审核结果: <el-button type="primary" plain :query='0' @click='checkStatusSuccess'>通过</el-button>
                <el-button type="primary" plain :query='2' @click='checkStatusFail'>拒绝</el-button>
                <div>
                    备注:<el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="textarea"
                        resize='none'>
                    </el-input>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="examine = false">取 消</el-button>
                <el-button type="primary" @click='examineSubmit'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 审核弹窗 -->
        <el-dialog
        title='审核通过'
        :visible.sync="examineSuc"
        width="20%">
            <span>审核成功</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="examineSuc = false">取 消</el-button>
                <el-button type="primary" @click='examineSuc = false'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 商户资料 -->
        <el-dialog
        title='商户资料'
        :visible.sync="bussinessInformation"
        width="30%" class="infor">
            <div>企业名称: {{ information.mercName }}</div>
            <div>企业所在地: {{ information.area }}</div>
            <div>所属行业: {{ information.industryName }}</div>
            <div>营业执照/统一社会信用代码: {{ information.mercPwd }}</div>
            <div>企业法人姓名: {{ information.mercBusinessEntityName }}</div>
            <div>企业联系人姓名: {{ information.mercBusinessEntityContactName }}</div>
            <div>企业联系人电话: {{ information.mercBusinessEntityContactPhone }}</div>
            <div>企业邮箱: {{ information.mercBusinessMail }}</div>
            <div>
                图片资料
            </div>
            <div>
                <img src="/static/gray-1.png" alt="">
            </div>
        </el-dialog>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            :current-page.sync="page.pagecurrent"
            layout="total, prev, pager, next, sizes, jumper"
            :total="page.pagecount">
        </el-pagination>
    </el-main>
</el-container>
</template>

<script>
import {baseUrl} from '../../assets/api/api'
export default {
    data: function() {
        return {
            tableData: [],          //列表
            pageSize: 10,       //每页显示条目
            pageNum: 1,          //当前页
            examine: false,      //审核弹窗
            examineSuc: false,
            bussinessInformation: false,
            textarea: '',
            row: {},
            mercCheckStatus: 0,     //审核通过还是拒绝
            information: {},         //查看资料弹窗
            page: {
                pagecount: 0,
                pagecurrent: 1
            },
            search: {
                name: '',
                person: '',
                beginTime: '',
                endTime: ''
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
        /**
         * 初始化表格
         * @param  {[type]} page [description]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        tableInit: function(page, size) {
            var _this = this;
            var params = new URLSearchParams();
            params.append('mercName', this.search.name);
            params.append('agentName', this.search.person);
            params.append('startTime', this.search.beginTime);
            params.append('endTime', this.search.endTime);
            params.append('page', page);
            params.append('size', size);
            this.$axios.post(baseUrl + '/merchantcheck/getMerchantCheckList', params).then(res => {
                res.data.dataInfo.forEach(function(ele, index) {
                    var now = new Date(ele.MERC_BEGIN_TIME);
                    ele.MERC_BEGIN_TIME = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
                    if (ele.MERC_CHECK_STATUS == 1) {
                        ele.MERC_CHECK_STATUS = '待审核';
                    } else if (ele.MERC_CHECK_STATUS == 2) {
                        ele.MERC_CHECK_STATUS = '审核拒绝';
                    }
                })
                _this.tableData = res.data.dataInfo;
                _this.page.pagecount = res.data.count;
            }).catch(err => {
                console.log(err);
            })
        },
        changeExamine(row) {
            this.row = row;
        },
        checkStatusSuccess: function() {
            this.mercCheckStatus = 0;
        },
        checkStatusFail: function() {
            this.mercCheckStatus = 2;
        },
        examineSubmit: function() {
            var _this = this;
            var sendObj = {
                mercSeq: this.row.MERC_SEQ,
                mercCheckStatus: this.mercCheckStatus,
                checkRemark: this.textarea
            };
            $.ajax({
                url: baseUrl + '/merchantcheck/checkMerchant',
                type: 'post',
                data: sendObj,
                success: function(res) {
                    _this.examine = false;
                    _this.examineSuc = true;
                    _this.tableInit(1, 10);
                    _this.page.pagecurrent = 1;
                },
                error: function(err) {
                    console.log(err);
                }
            })
        },
        lookInformation: function() {
            var _this = this;
            var params = new URLSearchParams();
            setTimeout(function() {
                params.append('mercSeq', _this.row.MERC_SEQ);
                _this.$axios.post(baseUrl + '/merchantcheck/getMerchantByMercSeq', params).then(res => {
                    _this.information = res.data;
                    console.log(res);
                    _this.information.area = _this.information.provinceName + _this.information.cityName;
                    console.log(_this.information);
                }).catch(err => {
                    console.log(err);
                })
            }, 500)
            this.$nextTick(function() {
                _this.bussinessInformation = true;
            })
        }
    }
}
</script>

<style lang="less">
html, body, #app, .el-container {
    height: 100%;
}
.content {
    overflow: auto;
}
.merchantExamine {
    .infor {
        .el-dialog__body {
            div {
                text-align: center;
                margin-top: 20px;
            }
        }
    }
    .el-header {
        line-height: 60px;
        font-size: 18px;
        color: #3399ff;
        background-color: #fff;
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
            }
        }
        .cell {
            text-align: center;
        }
    }
}
</style>
