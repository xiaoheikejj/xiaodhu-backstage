<template>
    <div id="merchantList">
        <el-header class="el-head-child">
            商户列表
        </el-header>
        <div class="search">
            <div class="inputs">
                <div>
                    <span>商品名称/编号/关键字 : </span>
                    <el-input style="margin-right: 30px" class="merchat" v-model='searchValue.commodityName'></el-input>
                    <span>商户入网时间 : </span>
                    <el-date-picker
                        v-model="searchValue.timeBegin"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                        至
                    <el-date-picker
                        v-model="searchValue.timeEnd"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div class="inputs-bottom">
                    <span>行业 : </span>
                    <el-select placeholder="请选择" v-model='searchValue.industryValue'>
                        <el-option v-for='(item, index) in search.industry' :key='"chantListind" + index' :label='item.value' :value='item.orderno'></el-option>
                    </el-select>
                    <span style="margin-left: 30px;">所在地区: </span>
                    <el-select placeholder="省" v-model='searchValue.provinceValue' @change='changeProvinceToGetCity'>
                        <el-option v-for='(item, index) in search.province' :key='"chantListpro" + index' :label='item.areaName' :value='item.areaId'></el-option>
                    </el-select>
                    <el-select placeholder="市" v-model='searchValue.cityValue'>
                        <el-option v-for='(k, index) in search.city' :key='"chantListCity" + index' :label='k.areaName' :value='k.areaId'></el-option>
                    </el-select>
                    <span style="margin-left: 30px;">商户来源: </span>
                    <el-select v-model='searchValue.agentValue' placeholder="请选择">
                        <el-option v-for='(k, index) in search.agent' :key='"chantListAgent" + index' :label='k.agentName' :value='k.agentSeq'></el-option>
                    </el-select>
                    <el-button type="danger" @click='tableInit()'>搜索</el-button>
                    <!-- <el-button type="primary" >导出</el-button> -->
                </div>
            </div>
        </div>

        <el-main>
            <el-table ref="table" tooltip-effect="dark"
                :data="tableData"
                style="width: 100%"
                stripe
                @cell-click='tableClick'>
                    <el-table-column prop='mercSeq' label="商户编号"></el-table-column>
                    <el-table-column prop="mercName" label="商户名称"></el-table-column>
                    <el-table-column prop="industryName" label="行业"></el-table-column>
                    <el-table-column prop="area" label="所在地"></el-table-column>
                    <el-table-column prop="portNum" label="机器人数量"></el-table-column>
                    <el-table-column prop="mercBeginTime" label="客户入网时间"></el-table-column>
                    <el-table-column prop="agentName" label="客户来源"></el-table-column>
                    <el-table-column prop="mercBusinessEntityContactName" label="联系人"></el-table-column>
                    <el-table-column prop="mercBusinessEntityContactPhone" label="联系人电话"></el-table-column>
                    <el-table-column prop="mercStatus" label="状态"></el-table-column>
                    <el-table-column prop="name" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click='datumShow = true'>查看资料</el-button>
                        </template>
                    </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.pagecurrent"
                :total='page.pagecount'
                v-if="page.pagecount != 0">
            </el-pagination>

            <!-- 查看资料弹窗 -->
            <el-dialog
            :visible.sync="datumShow"
            width="50%">
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
                <el-col :span="12">营业执照号/统一社会信用代码:{{ datumData.mercBusinessLicense }}</el-col>
                <el-col :span="12">商户来源:{{ datumData.agentName }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">企业法人姓名:{{ datumData.mercBusinessEntityName }}</el-col>
                <el-col :span="12">企业法人身份证:{{ datumData.mercBusinessId }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">企业联系人姓名:{{ datumData.mercBusinessEntityContactName }}</el-col>
                <el-col :span="12">企业联系人电话:{{ datumData.mercBusinessEntityContactPhone }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">企业邮箱:{{ datumData.mercBusinessMail }}</el-col>
            </el-row>
            <div class="top">
                图片资料
            </div>
            <img src="/static/blue-2.png" alt="">
            <div class="top">
                账户信息
            </div>
            <el-row>
                <el-col :span="12">账户状态:{{ datumData.mercStatus }}
                    <el-button type='primary' v-show='frozen' @click='frozenClick'>冻结</el-button>
                    <el-button type='primary' v-show='thaw' @click='thawClick'>解冻</el-button>
                </el-col>
                <el-col :span="12">子账户数量:</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">商户入网时间:{{ datumData.mercBeginTime }}</el-col>
                <el-col :span="12">套餐剩余有效期:</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">备注:{{ datumData.frozenCause }}</el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
            <el-button @click="datumShow = false">关闭</el-button>
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

        <!-- 成功了 -->
        <el-dialog
        title="成功了"
        :visible.sync="successShow"
        width="30%">
        <span slot="footer" class="dialog-footer">
            <el-button @click="successShow = false">取 消</el-button>
            <el-button type="primary" @click="successShow = false">确 定</el-button>
        </span>
        </el-dialog>
        </el-main>
    </div>
</template>
<script>
import {baseUrl} from '../assets/api/api'

    export default {
        data() {
            return {
                tableData: [], //商户编号
                search: {
                    industry: [],    //行业
                    province: [],   //省
                    city: [],    //市
                    agent: []
                },
                searchValue: {
                    cityValue: '',
                    provinceValue: '',
                    industryValue: '',
                    agentValue: '',
                    timeBegin: '',
                    timeEnd: '',
                    commodityName: ''   //商品名称
                },


                cIndustry: '', //改变后的行业
                cProvince: '',  //改变后的省
                cCity: '',  //改变后的市
                merchantFrom: '',      //商户来源

                pageNum: 1,
                pageSize: 10,

                datumShow: false,

                frozen: false,   //冻结
                thaw: false,    //解冻

                row: {},

                datumData: {},

                frozenShow: false,
                thawShow: false,
                successShow: false,

                frozenReason: '',    //冻结原因
                page: {
                    pagecount: '',
                    pagecurrent: 1
                }
            }
        },
        created: function() {
            var _this = this;
            // 右侧请求访问
            var timeNow = new Date().getTime();
            this.tableInit(1, 10);
            // 请求的是行业
            this.$axios.get(baseUrl + '/sysdicttreedata/getCategory').then(res => {
                _this.search.industry = res.data;
            }).catch(err => {
                console.log(err);
            })
            // 请求的是省
            this.$axios.get(baseUrl + '/areacode/getProvince').then(res => {
                _this.search.province = res.data;
            }).catch(err => {
                console.log(err);
            })
            //请求的是代理商名字
            this.$axios.get(baseUrl + '/agent/getAgentList').then(res => {
                _this.search.agent = res.data;
            }).catch(err => {
                console.log(err);
            })
        },
        mounted: function() {
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
                this.$axios({
                    url: baseUrl + '/merchant/searchMerchantList',
                    method: 'post',
                    data: _this.$qs.stringify({
                        mercName: _this.searchValue.commodityName,
                        startTime: _this.searchValue.timeBegin,
                        endTime: _this.searchValue.timeEnd,
                        mercIndustry: _this.searchValue.industryValue,
                        mercProvince: _this.searchValue.provinceValue,
                        mercCity: _this.searchValue.cityValue,
                        agentSeq: _this.searchValue.agentValue,
                        page: page,
                        size: size
                    })
                })
                .then(res => {
                    res.data.dataInfo.forEach(function(ele, index) {
                        //添加新属性remainTime
                        ele.mercBeginTime = new Date(ele.mercBeginTime).getFullYear() + '-' + (new Date(ele.mercBeginTime).getMonth() + 1) + '-' + new Date(ele.mercBeginTime).getDate();
                        // 添加地区
                        ele.area = ele.provinceName + ele.cityName;
                        //行业
                        if (ele.mercStatus == 0) {
                            ele.mercStatus = '启用';
                        } else if (ele.mercStatus == 1) {
                            ele.mercStatus = '停止';
                        } else if (ele.mercStatus == 2) {
                            ele.mercStatus = '冻结';
                        }
                    })
                    _this.tableData = res.data.dataInfo;
                    _this.page.pagecount = res.data.count;
                })
                .catch(err => {
                    console.log(err);
                })
            },
            /**
             * 搜索请求
             * @return {[type]} [description]
             */
            searchSubmit: function() {
                var _this = this;

            },

            tableClick(row) {
                var _this = this;
                this.row = row;
                //请求的是查看资料里面的东西
                $.ajax({
                    url: baseUrl + '/merchant/getMerchantByMercSeq',
                    type: 'post',
                    data: {
                        mercSeq: _this.row.mercSeq
                    },
                    success: function(res) {
                        _this.datumData = res;
                        _this.datumData.area = _this.datumData.provinceName + _this.datumData.cityName;
                        var now = new Date(_this.datumData.mercBeginTime);
                        _this.datumData.mercBeginTime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                        if (_this.datumData.mercStatus == 0) {
                            _this.datumData.mercStatus = '正常';
                            _this.frozen = true;
                            _this.thaw = false;
                        } else if (_this.datumData.mercStatus == 2) {
                            _this.datumData.mercStatus = '冻结';
                            _this.thaw = true;
                            _this.frozen = false;
                        }
                     },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },

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
                    url: baseUrl + '/merchant/updateMercStatus',
                    type: 'post',
                    data: {
                        mercSeq: _this.row.mercSeq,
                        mercStatus: 2,
                        frozenCause: _this.frozenReason
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
                    url: baseUrl + '/merchant/updateMercStatus',
                    type: 'post',
                    data: {
                        mercSeq: _this.row.mercSeq,
                        mercStatus: 0
                    },
                    success: function(res) {
                        _this.thawShow = false;
                        _this.successShow = true;
                        _this.row.mercStatus = '启用';
                        _this.tableInit(1, 10);
                        _this.page.pagecurrent = 1;
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },
            changeProvinceToGetCity() {
                var _this = this;
                $.ajax({
                    url: baseUrl + '/areacode/getCity',
                    type: 'post',
                    data: {
                        areaSupCode: _this.searchValue.provinceValue
                    },
                    success: function(res) {
                        _this.search.city = res;
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },
            changeCity(name) {
                this.cCity = name;
            }
        }
    }
</script>
<style lang="less">
html, body, #app, .el-container {
    height: 100%;
}
#merchantList {
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
    .search {
        background-color: #f0f3f6;
        padding: 14px 0;
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
        background-color: #f0f3f6;
        padding: 0;
    }
    .inputs {
        background-color: #fff;
        padding: 24px 20px;
    }
    .inputs input {
        display: inline-block;
        width: 140px;
        height: 40px;
        background-color: #f0f3f6;
        border: 1px solid #dfe3eb;
        border-radius: 3px;
    }
    .inputs span {
        letter-spacing: 3px;
        color: #333;
        font-size: 16px;
    }
    .inputs .merchat input {
        width: 180px;
    }
    .el-input {
        width: auto;
    }
    .inputs .inputs-bottom {
        margin-top: 30px;
    }
    .inputs .inputs-bottom input {
        width: 120px;
    }
    .inputs .el-button span {
        color: #fff;
    }
    .el-table thead {
        color: #333;
        font-size: 16px;
    }
    .el-pagination {
        text-align: center;
        margin-top: 30px;
    }
    .cell {
        text-align: center;
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
