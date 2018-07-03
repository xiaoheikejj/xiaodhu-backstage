<template lang="html">
<!-- 拨号管理 -->
<el-container class="dialManager">
    <el-header>
        拨号管理
    </el-header>
    <el-main>
        <!-- 搜索 -->
        <div class="search">
            <div class="center">
                商户名称/编号:
                <el-input></el-input>
                <span>高级搜索:</span>
                <el-button type='danger'>搜索</el-button>
            </div>
            <div class="toggle">
                客户电话:
                <el-input></el-input>
                意向:
                <el-select>
                    <el-option>
                    </el-option>
                </el-select>
                拨号号码:
                <el-select>
                    <el-option>
                    </el-option>
                </el-select>
                最后拨打时间:
                <el-input></el-input>
                至
                <el-input style="margin-left: 20px;"></el-input>
                <el-button type='danger'>搜索</el-button>
                <el-button type='primary'>导出</el-button>
            </div>
        </div>
        <!-- 表格 -->
        <el-table ref="multipleTable" :data='tableData' tooltip-effect="dark" style="width: 100%" stripe>
            <el-table-column prop='agentSeq' label="编号"></el-table-column>
            <el-table-column prop="agentName" label="被叫信息"></el-table-column>
            <el-table-column prop="agentBusinessEntityContactPhone" label="意向"></el-table-column>
            <el-table-column prop="location" label="通话记录"></el-table-column>
            <el-table-column prop="mercNum" label="拨打时间"></el-table-column>
            <el-table-column prop="portNum" label="拨打模板"></el-table-column>
            <el-table-column prop="status" label="主叫号码"></el-table-column>
            <el-table-column prop="portNum" label="主叫商户"></el-table-column>
        </el-table>
    </el-main>
</el-container>
</template>

<script>
export default {
}
</script>

<style lang="less">
.dialManager {
    .el-header {
        line-height: 60px;
        font-size: 22px;
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
                font-weight: bold;
                position: relative;
                .el-input {
                    margin-right: 20px;
                    input {
                        background-color: #f0f3f6;
                    }
                }
                .el-button {
                    position: absolute;
                    right: 20px;
                    top: 20px;
                }
                &>span {
                    padding-right: 20px;
                    background: url(/static/up.png) no-repeat right center/12px auto;
                }
            }
            .toggle {
                background-color: #fff;
                line-height: 88px;
                padding: 0 20px;
                color: #333;
                font-size: 16px;
                letter-spacing: 3px;
                font-weight: bold;
                position: relative;
                .el-input {
                    margin-right: 20px;
                    input {
                        width: 120px;
                        background-color: #f0f3f6;
                    }
                }
                .el-button {
                    &:nth-of-type(1) {
                        position: absolute;
                        top: 20px;
                        right: 110px;
                    }
                    &:nth-of-type(2) {
                        position: absolute;
                        right: 20px;
                        top: 20px;
                    }
                }
            }
        }
    }
}
</style>
