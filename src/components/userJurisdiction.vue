<template lang="html">
    <el-container id="userJurisdiction">
        <el-header class="content-header">
            <p>用户权限管理</p>
            <el-button type='primary' class="add">新增</el-button>
            <el-button type='primary' class="permission-config">权限配置</el-button>
        </el-header>
        <!-- 内容 -->
        <el-main>
            <!-- 搜索 -->
            <div class="search">
                名称/编号：<el-input clearable></el-input>
                用户权限角色：
                <el-select v-model='value' placeholder='搜索'>
                    <el-option :value='2'></el-option>
                </el-select>
                <el-button type='danger'>搜索</el-button>
            </div>
            <!-- 表格 -->
            <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="日期">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="dialogTableVisible = true">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="10"></el-pagination>
        </el-main>
    </el-container>
</template>

<script>
export default {
    data () {
        return {
            value: ''
        }
    }
}
</script>

<style lang="less">
#userJurisdiction {
    .el-container {
        .content-header {
            height: 60px;
            line-height: 60px;
            position: relative;
            background-color: #fff;
            position: relative;
            p {
                color: #3399ff;
                font-size: 18px;
                font-weight: bold;
            }
            .add {
                position: absolute;
                top: 10px;
                right: 140px;
            }
            .permission-config {
                position: absolute;
                top: 10px;
                right: 20px;
            }
        }
        .el-main {
            .search {
                position: relative;
                margin-top: 20px;
                background: #fff;
                padding: 24px 20px;
                .el-button {
                    position: absolute;
                    right: 20px;
                    top: 24px;
                }
            }
            .el-table {
                margin-top: 20px;
            }
            .el-input {
                input {
                    background-color: #f0f3f6;
                }
            }
        }
    }
}
</style>
