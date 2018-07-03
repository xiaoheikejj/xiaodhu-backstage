<template lang="html">
<!-- 模组管理 -->
<el-container class="moduleManager">
    <el-header>
        模组管理
        <el-button type='danger'>
            新增
        </el-button>
    </el-header>
    <el-main>
        <div class="lists">
            <span class="active">大后台</span>
            <span>代理商后台</span>
            <span>商户后台</span>
        </div>
        <!-- 表格 -->
        <el-table ref="multipleTable" :data='tableData' tooltip-effect="dark" style="width: 100%" stripe>
            <el-table-column prop='agentSeq' label="编号"></el-table-column>
            <el-table-column prop="agentName" label="组名称"></el-table-column>
            <el-table-column prop="agentBusinessEntityContactPhone" label="路径"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small">删除</el-button>
                    <el-button type="primary" size="small">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-main>
</el-container>
</template>

<script>
export default {
}
</script>

<style lang="less">
.moduleManager {
    .el-header {
        line-height: 60px;
        font-size: 22px;
        color: #3399ff;
        background-color: #fff;
        position: relative;
        .el-button {
            position: absolute;
            right: 20px;
            top: 10px;
        }
    }
    .el-main {
        .lists {
            padding: 0 20px;
            height: 88px;
            line-height: 88px;
            span {
                color: #666;
                font-size: 22px;
                padding-right: 20px;
                margin-right: 20px;
                &:not(:nth-of-type(3)) {
                    border-right: 1px solid #666;
                }
                position: relative;
                &.active {
                    &::after {
                        content: "";
                        width: 65px;
                        height: 3px;
                        background-color: #3399ff;
                        position: absolute;
                        bottom: -10px;
                        left: 0;
                    }
                }
            }
        }
    }
}
</style>
