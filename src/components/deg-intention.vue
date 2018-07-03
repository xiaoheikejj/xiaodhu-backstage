<template lang="html">
    <div id='degIntention'>
        <div class="header">
            <el-header>
                <!-- <i title="返回" onclick='javascript:history.back(-1)'></i> -->
                <span>配置模板</span>
            </el-header>
        </div>
        <div class="bottom">
            <ul class="status">
                <li>模板属性</li>
                <li>音频上传</li>
                <li>流程定制</li>
                <li>意向程度设置</li>
            </ul>
            <div class="table">
                <el-table
                    :data="tableData"
                    border style="width: 100%"
                    @cell-click='modify'>
                    <el-table-column prop="intention" label="意向">
                    </el-table-column>
                    <el-table-column prop="classification" label="分类" >
                    </el-table-column>
                    <el-table-column prop="time" label="流程" >
                    </el-table-column>
                    <el-table-column prop="key" label="命中关键词" >
                    </el-table-column>
                    <el-table-column  label="操作" >
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="dialogVisible = true">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="complete">
                <el-button class="next-step" type="primary" @click='submit'>完成</el-button>
            </div>
        </div>

        <el-dialog
        title="修改"
        :visible.sync="dialogVisible"
        width="30%">
        <!-- 表格 -->
        <div>
            分类：
            <span style="color: #409EFF">{{ en }}</span>
            <span>{{ text }}</span>
        </div>
        <div>
            规则：对话轮数>=<el-input class="dialogNum" v-model="dialogVal.role"accesskey=""></el-input>
        </div>
        <div>
            关键词：<el-input type="textarea" resize='none' class="dialogText" v-model="dialogVal.key"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sure();dialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import {baseUrl} from '../assets/api/api'
export default {
    data() {
        return {
            num: 0,
            en: '',
            text: '',
            index: 0,
            dialogVisible: false,
            dialogVal: {
                role: '',
                key: ''
            },
            tableData: [{
                intention: 'A',
                classification: '明确关注/邀约成功',
                query: 0,
                time: '对话轮数0'
            }, {
                intention: 'B',
                classification: '有意向，需要进一步了解',
                query: 1,
                time: '对话轮数0'
            }, {
                intention: 'C',
                classification: '需求不明确，兴趣不明确',
                query: 2,
                time: '对话轮数0'
            }, {
                intention: 'D',
                classification: '明确拒绝',
                query: 3,
                time: '对话轮数0'
            }, {
                intention: 'E',
                classification: '在忙',
                query: 4,
                time: '对话轮数0'
            }, {
                intention: 'F',
                classification: '未接通',
                query: 5,
                time: '对话轮数0'
            }]
        }
    },
    methods: {
        modify: function(row, event, column) {
            this.en = row.intention;
            this.text = row.classification;
            this.index = row.query;
        },
        sure: function() {
            this.tableData[this.index].time = '对话轮数' + this.dialogVal.role;
            this.tableData[this.index].key = this.dialogVal.key;
        },
        submit: function() {
            var that = this;
            var session = sessionStorage.getItem('tempSeq');
            var array = [];
            this.tableData.forEach(function(ele, index) {
                array.push({
                    'intentGrade': ele.intention,
                    'dialoguesNum': parseInt(ele.time.split('对话轮数')[1]),
                    'tempSeq': session,
                    'keyWord': ele.key
                })
            })
            $.ajax({
                url: baseUrl + '/speechrelation/addSpeechGrade',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                async: false,
                data: JSON.stringify(array),
                success: function(res) {
                    that.$message({
                        showClose: true,
                        message: '完成',
                        type: 'success'
                    });
                    that.$router.push('/voiceTemplate');
                },
                error: function(err) {
                    console.log(err);
                }
            });

        }
    }

}
</script>

<style lang="less">
#degIntention {
    .header{
        padding-bottom: 14px;
        background-color: #f0f3f6;
    }
    .el-header {
        color: #3399ff;
        font-size: 18px;
        line-height: 60px;
        background-color: #fff;
    }
    .el-header i {
        display: inline-block;
        width: 22px;
        height: 16px;
        background: url(/static/back.png) no-repeat center;
        background-size: cover;
        margin-right: 15px;
    }
    .bottom .status {
        height: 120px;
        box-shadow: 0 5px 10px rgba(235,237,246,0.75);
        text-align: center;
        line-height: 120px;
    }
    .bottom .status li {
        display: inline-block;
        color: #999;
        font-size: 22px;
    }
    .bottom .status li:not(:last-of-type) {
        margin-right: 70px;
    }
    .bottom .status li:first-of-type + li {
        background: url('/static/gray-2.png') no-repeat center left;
        padding-left: 83px;
        color: #999;
    }
    .bottom .status li:first-of-type {
        background: url('/static/gray-1.png') no-repeat center left;
        padding-left: 83px;
        margin-left: -83px;
    }
    .bottom .status li:first-of-type + li + li {
        background: url('/static/gray-4.png') no-repeat center left;
        padding-left: 83px;
    }
    .bottom .status li:first-of-type + li + li + li {
        background: url('/static/blue-4.png') no-repeat center left;
        padding-left: 83px;
        color: #3399ff;
    }
    .table {
        padding: 0 20px;
        text-align: center;
        tr {
            th {
                text-align: center;
            }
        }
    }
    .complete {
        text-align: center;
        margin-top: 40px;
        .next-step {
            width: 354px;
            height: 50px;
            font-size: 16px;
            border-radius: 30px;
        }
    }
}
</style>
