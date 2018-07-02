<template lang="html">
    <div id="proFormulation">
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
            <div class="content">
                <ul>
                    <li v-for='(list, index) in lists' :query='index'>
                        <el-button-group>
                            <el-button class="text" @click='getParentSeq(index)'>{{ list.parentVoiceDesc }}</el-button>
                            <el-button class="logo"></el-button>
                        </el-button-group>
                        <i class="arrow"></i>
                        <el-button class="select" @click='getChildSeq'>{{ list.childVoiceDesc }}</el-button>
                        <i class="el-icon-circle-plus-outline" @click='addList'></i>
                        <i class="el-icon-delete" @click='removeList($event)' :query='index'></i>
                    </li>
                </ul>
                <el-button class="next-step" type="primary" @click='submit'>下一步</el-button>
            </div>
            <el-dialog
            title="选择语音"
            :visible.sync="dialogVisible"
            width="50%">
            <!-- 表格 -->
            <el-table ref="multipleTable" :data='tableData' tooltip-effect="dark" style="width: 100%" @row-click='clickParentTableRow'>
                <el-table-column prop='voiceSeq' label="编号"></el-table-column>
                <el-table-column prop="voiceSearch" label="关键字"></el-table-column>
                <el-table-column prop="voiceDesc" label="语言文字"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small">修改</el-button>
                        <el-button type="text" size="small" @click="dialogTableVisible = true">重置密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
            title="选择语音"
            :visible.sync="dialogShow"
            width="50%">
            <!-- 表格 -->
            <el-table ref="multipleTable" :data='tableData' tooltip-effect="dark" style="width: 100%" @row-click='clickChildTableRow'>
                <el-table-column prop='voiceSeq' label="编号"></el-table-column>
                <el-table-column prop="voiceSearch" label="关键字"></el-table-column>
                <el-table-column prop="voiceDesc" label="语言文字"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small">修改</el-button>
                        <el-button type="text" size="small" @click="dialogTableVisible = true">重置密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogShow = false">取 消</el-button>
                <el-button type="primary" @click="dialogShow = false">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {baseUrl} from '../assets/api/api'

export default {
    data() {
        return {
            lists: [{
                parentVoiceDesc: '开场白',
                childVoiceDesc: '点击选择'
            }],
            removeListNum: 0,    //移除list的第几项
            tempSeq: 0,     //传给后台的tempSeq
            dialogVisible: false,    //弹窗
            dialogShow: false,
            tableData: [],
            parentObj: {},
            childObj: {},
            extendArray: [],
            index: 0    //让每次选择的index保存下来
        }
    },
    created: function() {
        this.tempSeq = sessionStorage.getItem('tempSeq');
    },
    methods: {
        addList: function() {
            this.lists.push({
                parentVoiceDesc: '开场白',
                childVoiceDesc: '点击选择'
            });
        },
        removeList: function(e) {
            var _this = this,
                e = e || window.event,
                target = e.target || e.srcElement;
            this.removeListNum = e.target.getAttribute('query');
            // 改变原数组,总是保留第一项
            if (this.removeListNum > 0) {
                this.lists.splice(this.removeListNum, 1);
            }
        },

        getParentSeq: function(index) {
            var _this = this;
            var params = new URLSearchParams();
            params.append('tempSeq', parseInt(this.tempSeq));
            this.$axios.post(baseUrl + '/voicestatement/getVoiceStatementList', params).then(res => {
                _this.tableData = res.data;
            }).catch(err => {
                console.log(err);
            })
            this.dialogVisible = true;

            this.index = index;
        },
        getChildSeq: function() {
            var _this = this;
            var params = new URLSearchParams();
            params.append('tempSeq', parseInt(this.tempSeq));
            this.$axios.post(baseUrl + '/voicestatement/getVoiceStatementList', params).then(res => {
                _this.tableData = res.data;
            }).catch(err => {
                console.log(err);
            })
            this.dialogShow = true;
        },

        clickParentTableRow: function(row, event, column) {
            this.lists[this.index].parentVoiceDesc = row.voiceDesc;
            // 关闭dialog

            this.dialogVisible = false;
            this.parentObj.tempSeq = row.tempSeq;
            this.parentObj.voiceSeq = row.voiceSeq;
            this.parentObj.voiceType = row.voiceType;
        },

        clickChildTableRow: function(row, event, column) {
            this.lists[this.index].childVoiceDesc = row.voiceDesc;

            // 关闭dialog
            this.dialogShow = false;
            this.childObj.voiceSeqSub = row.voiceSeq;
            this.childObj.voiceSearch = row.voiceSearch;
            //对象合并
            var clone = $.extend(this.parentObj, this.childObj);
            var obj = Object.create(null);
            for (var prop in clone) {
                obj[prop] = clone[prop];
            }
            this.extendArray.push(obj);
        },

        submit: function() {
            var _this = this;
            $.ajax({
                url: baseUrl + '/speechrelation/addSpeechRelation',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(_this.extendArray),
                success: function(res) {
                    _this.$message({
                        showClose: true,
                        message: '第三步成功了',
                        type: 'success'
                    });
                    _this.$router.push('/degIntention')
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
#proFormulation {
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
    }
    .bottom .status li:first-of-type + li + li {
        background: url('/static/blue-3.png') no-repeat center left;
        padding-left: 83px;
        color: #3399ff;
    }
    .bottom .status li:first-of-type + li + li + li {
        background: url('/static/gray-5.png') no-repeat center left;
        padding-left: 83px;
    }
    .bottom {
        .content {
            width: 100%;
            margin: 24px 20px;
            padding: 30px;
            border: 1px solid #dfe3eb;
            ul {
                li {
                    position: relative;
                    margin-bottom: 20px;
                    .el-button-group {
                        .text {
                            width: 94px;
                            height: 40px;
                            font-size: 16px;
                            overflow: hidden;
                        }
                        .logo {
                            width: 44px;
                            height: 40px;
                            background: url('/static/play1.png') no-repeat center;
                        }
                    }
                    .arrow {
                        position: absolute;
                        left: 148px;
                        top: 5px;
                        display: inline-block;
                        width: 44px;
                        height: 30px;
                        background: url('/static/arrow.png') no-repeat center;
                        background-size: cover;
                    }
                    .select {
                        margin-left: 64px;
                        width: 138px;
                        height: 40px;
                        overflow: hidden;
                        .el-input__inner {
                            text-align: center;
                        }
                    }
                    i[class^=el-icon-] {
                        padding-left: 5px;
                    }
                }
            }
            .next-step {
                width: 354px;
                height: 50px;
                font-size: 16px;
                border-radius: 30px;
            }
        }
    }
}
</style>
