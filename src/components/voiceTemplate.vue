<template lang="html">
    <el-container class="voiceTemplate">
        <el-header class="content-header">
            <p>语音模板管理</p>
            <el-button type='primary' @click='jump'>新增模板</el-button>
        </el-header>
        <!-- 内容 -->
        <el-main>
            <!-- 搜索 -->
            <div class="search">
                <div class="center">
                        行业类型：
                    <el-select v-model="search.industry" @change="changeIndustry">
                        <el-option v-for="(item, index) in search.industryOptions" :label="item.value" :value="item.value" :key="String(index)"></el-option>
                    </el-select>
                        模板：
                    <el-select v-model="search.template">
                        <el-option v-for="(list, index) in search.templateOptions" :label="list.tempTitle" :value="list.tempTitle" :key="String(index)"></el-option>
                    </el-select>
                    <el-button type='danger' @click="tableInit(1, 10)">搜索</el-button>
                </div>
            </div>
            <!-- 表格 -->
            <el-table :data='tableData' tooltip-effect="dark" style="width: 100%" stripe>
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="tempTitle" label="模板名称"></el-table-column>
                <el-table-column prop="code" label="所属行业"></el-table-column>
                <el-table-column prop="mercName" label="使用用户"></el-table-column>
                <!-- <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="dialogTableVisible = true">修改</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                background
                :current-page="page.pagecurrent"
                layout="total, prev, pager, next, sizes, jumper"
                :total="page.pagecount">
            </el-pagination>
        </el-main>
    </el-container>
</template>

<script>
import {baseUrl} from '../assets/api/api'

export default {
    data: function() {
        return {
            value: '',
            tableData: [],

            pageSize: 10,       //每页显示条目
            pageNum: 1,          //当前页

            page: {
                pagecount: 0,
                pagecurrent: 1
            },
            search: {
                industry: "",
                industryOptions: [],
                template: "",
                templateOptions: []
            }
        }
    },
    created: function() {
        var _this = this;
        this.tableInit(1, 10);
        //行业请求
        this.$axios.post(baseUrl + '/sysdicttreedata/getCategory').then(res => {
            _this.search.industryOptions = res.data;
        }).catch(err => {
            console.log(err);
        });
    },
    methods: {
        jump: function() {
            this.$router.push('/templateAttribute');
        },
        handleSizeChange(val) {
            this.tableInit(1, val);
        },
        handleCurrentChange(val) {
            this.tableInit(val, 10);
            console.log(val);
        },
        tableInit: function(page, size) {
            var _this = this;
            var params = new URLSearchParams();
            params.append('code', this.search.industry);
            params.append('tempTitle', this.search.template);
            params.append('page', page);
            params.append('size', size);
            this.$axios.post(baseUrl + '/speechtemplate/getTemplateListByPage', params).then(res => {
                _this.tableData = res.data.dataInfo;
                _this.page.pagecount = res.data.count;
            }).catch(err => {
                console.log(err);
            })
        },
        /**
         * 请求模板
         * @return {[type]} [description]
         */
        changeIndustry: function(name) {
            var _this = this;
            var params = new URLSearchParams();
            params.append("code", name)
            this.$axios.post(baseUrl + '/speechtemplate/getTemplateByCode', params).then(res => {
                _this.search.templateOptions = res.data;
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        }
    }
}
</script>

<style lang="less">
.voiceTemplate {
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
            position: absolute;
            top: 10px;
            right: 20px;
        }
    }
    .el-main {
        .search {
            background-color: #f0f3f6;
            padding: 14px 0;
            .center {
                background: #fff;
                padding: 24px 20px;
                position: relative;
                .el-button {
                    position: absolute;
                    right: 20px;
                    top: 24px;
                }
                .el-select {
                    width: 100px;
                }
            }
        }
        .el-table {
            margin-top: 20px;
        }
    }
    .cell {
        text-align: center;
    }
}
</style>
