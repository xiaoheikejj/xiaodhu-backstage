<!-- <template lang="html">
    <el-container>
        <el-header class="content-header">
            <p>商户审核</p>
        </el-header>
        审核内容
        <div class="audit-content">
            企业名称/编号/关键字：<el-input clearable></el-input>
            提交人：<el-input clearable></el-input>
            提交审核时间：<el-date-picker v-model="datevalue1" type="date" placeholder="选择日期"></el-date-picker>
            至 <el-date-picker v-model="datevalue2" type="date" placeholder="选择日期"></el-date-picker>
            <el-button type='danger'>搜索</el-button>
        </div>
        表格
        <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="日期">
                <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
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
        </el-table> -->

        <!-- 分页
        <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="10"></el-pagination>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            datevalue1: '',
            datevalue2: ''
        }
    }
}
</script>

<style lang="less">
.el-container {
    .content-header {
        height: 60px;
        line-height: 60px;
        position: relative;
        background-color: #fff;
        p {
            color: #3399ff;
            font-size: 18px;
            font-weight: bold;
        }
    }
    .audit-content {
        margin-top: 20px;
        background: #fff;
        padding: 24px 20px;
        .el-input {
            input {
                background-color: #f0f3f6;
            }
        }
    }
}
</style>
