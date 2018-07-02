<template lang="html">
    <div id="audioUpload">
        <form id="uploadForm" autocomplete="off" method="post">
            <div class="header">
                <el-header>
                    <!-- <i onclick='javascript:history.back(-1)' title="返回"></i> -->
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
                <div class="voiceTemplateStep2">
                    <!-- 开场白 -->
                    <div class="open-white type1">
                        <div class="top">
                            <i class="el-icon-caret-bottom"></i>
                            开场白
                            <i class="el-icon-circle-plus-outline" @click='addWhite'></i>
                        </div>
                        <div class="domList hasQuery" v-for='(item, index) in open_white' :index='index + 1' query='9010100'>
                            <div>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" :name="'filewhite' + index" value="" accept="audio/wav">
                            </div>
                        </div>
                    </div>
                    <!-- 流程语句 -->
                    <div class="open-white pro-statement type2">
                        <div class="top">
                            <i class="el-icon-caret-bottom"></i>
                            流程语句
                            <i class="el-icon-circle-plus-outline" @click='addStatement'></i>
                        </div>
                        <div class="list hasQuery" v-for='(item, index) in pro_statement' :index='index + 1' query='9010200'>
                            <div class="member1">
                                <el-select placeholder="触发关键词" v-model="statementVal" @change='changestatementVal'>
                                    <el-option v-for='(item1, index1) in options' :label="item1.value" :value='item1.id' :key='"audioUpStatement1" + index1'></el-option>
                                </el-select>
                                <!-- <el-tag
                                    :key='String(index2)'
                                    v-for='(item2, index2) in ["span" + index]'
                                    class="backgroundSpan"
                                    @close="editSpan1(item2)"
                                    closable>
                                    {{ item2 }}
                                </el-tag> -->
                                <el-input class="spanclass1"
                                    v-model="processState['key' + index]"
                                    placeholder="例如：好的|需要"
                                    v-show='clickenter'></el-input>
                                <el-select placeholder='低优先级默认' v-model='statementValPriority' v-show='clickenter1'>
                                    <el-option v-for='(item2, index2) in options1' :value="item2.value" :key='"audioUpStatement2" + index2'></el-option>
                                </el-select>
                            </div>
                            <div class="member2">
                                <span>对应回答：</span>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" :name="'filestate' + index" value="" accept="audio/wav">
                            </div>
                        </div>
                    </div>
                    <!-- 结束 -->
                    <div class="open-white pro-statement type3">
                        <div class="top">
                            <i class="el-icon-caret-bottom"></i>
                            结束
                            <i class="el-icon-circle-plus-outline" @click='addEnd'></i>
                        </div>
                        <div class="list hasQuery" v-for='(item, index) in end' :index='index + 1' query='9010300'>
                            <p>结束{{ index + 1 }}：</p>
                            <div class="member1">
                                <el-select placeholder="触发关键词" v-model='endVal' @change='chageendVal'>
                                    <el-option v-for='(item1, index1) in options' :label="item1.value" :value='item1.id' :key='"audioend1" + index1'></el-option>
                                </el-select>
                                <!-- <span v-for='(item, index) in span2' class="backgroundSpan">
                                    {{ item }}
                                    <i class="el-icon-close" :query='index' @click="editSpan2"></i>
                                </span> -->
                                <el-input class="spanclass2"
                                    v-model="endState['key' + index]"
                                    placeholder="例如：好的|需要"
                                    v-show='endclickenter'lang=""></el-input>
                                <el-select placeholder='低优先级默认' v-model='endValPriority' v-show='endclickenter1'>
                                    <el-option v-for='(item2, index2) in options1' :value="item2.value" :key='"audioend2" + index2'></el-option>
                                </el-select>
                            </div>
                            <div class="member2">
                                <span>对应回答：</span>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" :name="'filesend' + index" value="" accept="audio/wav">
                            </div>
                        </div>
                    </div>
                    <!-- 全局问题 -->
                    <div class="open-white pro-statement type4">
                        <div class="top">
                            <i class="el-icon-caret-bottom"></i>
                            全局问题
                            <i class="el-icon-circle-plus-outline" @click='globalPro'></i>
                        </div>
                        <div class="list hasQuery" v-for='(item, index) in global_pro' :index='index + 1' query='9020100'>
                            <div class="member1">
                                <el-select placeholder="触发关键词" v-model='keywordVal' @change='changekeywordVal'>
                                    <el-option v-for='(item1, index1) in options' :label="item.value" :value='item.id' :key='"audioUpG1" + index1'></el-option>
                                </el-select>
                                <!-- <span v-for='(item2, index2) in span3' class="backgroundSpan">
                                    {{ item }}
                                    <i class="el-icon-close" :query='index' @click="editSpan3"></i>
                                </span> -->
                                <el-input class="spanclass3"
                                    v-model="globalQue['key' + index]"
                                    placeholder="例如：好的|需要"
                                    v-show='keywordclickenter'></el-input>
                                <el-select placeholder='低优先级默认' v-model='keywordValPriority' v-show='keywordclickenter1'>
                                    <el-option v-for='(item2, index2) in options1' :value="item.value" :key='"audioUpG2" + index2'></el-option>
                                </el-select>
                            </div>
                            <div class="member2">
                                <span>对应回答：</span>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" :name="'filesglopro' + index" value="" accept="audio/wav">
                            </div>
                        </div>
                    </div>
                    <!-- 超时 -->
                    <div class="open-white pro-statement type5">
                        <div class="top">
                            <i class="el-icon-caret-bottom"></i>
                            超时
                            <i class="el-icon-circle-plus-outline" @click='addovertime'></i>
                        </div>
                        <div class="list hasQuery" v-for='(item, index) in over_time' :index='index + 1' :query='9020201 + index'>
                            <p>超时{{ index + 1 }}：</p>
                            <div class="member2 overtime">
                                <span>对应回答：</span>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" :name="'filesover' + index" value="" accept="audio/wav">
                            </div>
                        </div>
                        <div class="list hasQuery" query='9020299'>
                            <p>超时(结束)：</p>
                            <div class="member2 overtime">
                                <span>对应回答：</span>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" name="filestime99" value="" accept="audio/wav">
                            </div>
                        </div>
                    </div>
                    <!-- 关键词 -->
                    <div class="open-white pro-statement type6">
                        <div class="top">
                            <i class="el-icon-caret-bottom"></i>
                            未匹配到关键词
                            <i class="el-icon-circle-plus-outline" @click='addkeyword'></i>
                        </div>
                        <div class="list hasQuery" v-for='(item, index) in key_word' :index='index + 1' :query='9020401 + index'>
                            <p>未匹配{{ index + 1 }}：</p>
                            <div class="member2 overtime">
                                <span>对应回答：</span>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" :name="'fileskey' + index" value="" accept="audio/wav">
                            </div>
                        </div>
                        <div class="list hasQuery" query='9020499'>
                            <p>未匹配(结束)：</p>
                            <div class="member2 overtime">
                                <span>对应回答：</span>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" name="filesword99" value="" accept="audio/wav">
                            </div>
                        </div>
                    </div>
                    <!-- 挽回 -->
                    <div class="open-white pro-statement type7">
                        <div class="top">
                            <i class="el-icon-caret-bottom"></i>
                            挽回
                            <i class="el-icon-circle-plus-outline" @click='addtosave'></i>
                        </div>
                        <div class="list hasQuery" v-for='(item, index) in to_save' :index='index + 1' :query='9020301 + index'>
                            <p>挽回{{ index + 1 }}：</p>
                            <div class="member2 overtime">
                                <span>对应回答：</span>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" :name="'filesto' + index" value="" accept="audio/wav">
                            </div>
                        </div>
                        <div class="list hasQuery" query='9020399'>
                            <p>挽回(结束)：</p>
                            <div class="member2 overtime">
                                <span>对应回答：</span>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" name="filessave" value="" accept="audio/wav">
                            </div>
                        </div>
                    </div>
                    <!-- 重复 -->
                    <div class="open-white pro-statement type8">
                        <div class="top">
                            <i class="el-icon-caret-bottom"></i>
                            重复
                            <i class="el-icon-circle-plus-outline"></i>
                        </div>
                        <div class="list hasQuery" query='9020599'>
                            <p>重复(结束)：</p>
                            <div class="member2 overtime">
                                <span>对应回答：</span>
                                <el-input class="hasIpt"></el-input>
                                <i class="icon-delete"></i>
                                <i></i>
                                <i></i>
                                <input type="file" name="filesrepeat" value="" accept="audio/wav">
                            </div>
                        </div>
                    </div>
                    <!-- 下一步 -->
                    <div class="nextStep">
                        <el-button type="primary" @click='next();submitUpload()'>下一步</el-button>
                    </div>
                </div>

            </div>
        </form>

    </div>
</template>

<script>
import {baseUrl} from '../assets/api/api'
export default {
    data() {
        return {
            clickenter: true,
            clickenter1: false,
            endclickenter: true,
            endclickenter1: false,
            keywordclickenter: true,
            keywordclickenter1: false,
            options: [{
                value: '触发关键词',
                id: 1
            },{
                value: '触发条件',
                id: 2
            }],
            options1: [{
                value: '低优先级触发'
            },{
                value: '高优先级触发'
            }],
            open_white: [''],   //开场白
            pro_statement: [''],    //流程语句
            end: [''],     //结束
            global_pro: [''],   //全局问题
            over_time: [''],    //超时
            key_word: [''],      //关键词
            to_save: [''],      //挽回
            statementVal: '',  //流程语句
            statementValPriority: '',
            endVal: '',
            endValPriority: '',
            keywordVal: '',
            keywordValPriority: '',
            span1: [],    //关键字词条
            span2: [],   //结束词条
            span3: [],    //全局问题
            uploadToSql: [],     //上传给后台的数据
            acceptFile: [],      //接收从后台返回的文件路径
            span1Tag: '',
            processState: {
                key0: '',
                key1: '',
                key2: ''
            },
            endState: {
                key0: '',
                key1: '',
                key2: ''
            },
            globalQue: {
                key0: '',
                key1: '',
                key2: ''
            }
        }
    },
    mounted: function() {
        $(document).on('click', '.icon-delete', function () {
            $(this).parents('.list').remove();
            $(this).parents('.domList').remove();
        });
    },
    methods: {
        //添加
        addWhite: function() {
            this.open_white.push('');
        },
        addStatement: function() {
            this.pro_statement.push('');
        },
        addEnd: function() {
            //长度不大于3
            if (this.end.length < 3) {
                this.end.push('');
            }
        },
        globalPro: function() {
            this.global_pro.push('');
        },
        addovertime: function() {
            if (this.over_time.length < 3) {
                this.over_time.push('');
            }
        },
        addkeyword: function() {
            if (this.key_word.length < 3) {
                this.key_word.push('');
            }
        },
        addtosave: function() {
            if (this.to_save.length < 3) {
                this.to_save.push('');
            }
        },
        // 切换
        changestatementVal(name) {
            if (name == 1) {
                this.clickenter = true;
                this.clickenter1 = false;
            } else if (name == 2) {
                this.clickenter = false;
                this.clickenter1 = true;
            }
            console.log(this.clickenter);
        },
        chageendVal(name) {
            if (name == 1) {
                this.endclickenter = true;
                this.endclickenter1 = false;
            } else if (name == 2) {
                this.endclickenter = false;
                this.endclickenter1 = true;
            }
        },
        changekeywordVal(name) {
            if (name == 1) {
                this.keywordclickenter = true;
                this.keywordclickenter1 = false;
            } else if (name == 2) {
                this.keywordclickenter = false;
                this.keywordclickenter1 = true;
            }
        },
        submitUpload: function() {
            var _this = this;
        },
        next: function() {
            var _this = this,
                type2Search = '',  //流程语句关键词
                type3Search = '',   //结束关键词
                type4Search = '',   //全局问题关键词
                tempSeq = sessionStorage.getItem('tempSeq');

            //表单提交
            var formData = new FormData($('#uploadForm')[0]);

            $.ajax({
                url: baseUrl + '/upload/fileupload',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function(res) {
                    _this.acceptFile = res;
                },
                error: function(err) {
                    console.log(err);
                }
            })

            //拼接流程语句关键词
            // for (let i = 0; i < $('.type2').find('.backgroundSpan').length; i++) {
            //     type2Search += $('.type2').find('.backgroundSpan')[i].innerText;
            //     type2Search += '|';
            // }
            // //删除字符串最后一位
            // if (type2Search == '') {
            //     type2Search = null;
            // }
            //
            // for (let i = 0; i < $('.type3').find('.backgroundSpan').length; i++) {
            //     type3Search += $('.type3').find('.backgroundSpan')[i].innerText;
            //     type3Search += '|';
            // }
            // //删除字符串最后一位
            // if (type3Search == '') {
            //     type3Search = null;
            // }
            //
            // for (let i = 0; i < $('.type4').find('.backgroundSpan').length; i++) {
            //     type4Search += $('.type4').find('.backgroundSpan')[i].innerText;
            //     type4Search += '|';
            // }
            // //删除字符串最后一位
            // if (type4Search == '') {
            //     type4Search = null;
            // }

            // 获取每个input框的值
            var upInputVal = [];
            $('.hasIpt :text').each(function(index, ele) {
                if ($(this).val() == '') {
                    upInputVal.push(null);
                } else {
                    upInputVal.push($(this).val());
                }
            });
            //获取关键词
            //新建数组，数组每一位传入null
            var upKeyWord = [];
            for (let i = 0; i < 8; i++) {
                upKeyWord[i] = null;
            }
            var effectKeys = [];

            $('.spanclass1 input').each(function() {
                if ($(this).val() !== "") {
                    effectKeys.push($(this).val());
                }
            })
            $('.spanclass2 input').each(function() {
                if ($(this).val() !== "") {
                    effectKeys.push($(this).val());
                }
            })
            $('.spanclass3 input').each(function() {
                if ($(this).val() !== "") {
                    effectKeys.push($(this).val());
                }
            })

            effectKeys.forEach(function(value, i) {
                upKeyWord.splice(1 + i, 0, value);
            })
            console.log(upKeyWord);
            //获取有几个对象
            $('.hasQuery').each(function(index, ele) {
                _this.uploadToSql.push({
                    'voiceType': parseInt($(this).attr('query')),
                    'tempSeq': parseInt(tempSeq),
                    'voiceSearch': upKeyWord[index],
                    'voiceDesc': upInputVal[index],
                    'voiceFilePath': _this.acceptFile[index]
                })
            });
            console.log(this.uploadToSql);

            //把uploadToSq发送给后台
            this.$axios.post(baseUrl + '/voicestatement/addVoiceStatement', this.uploadToSql).then(res => {
                _this.$message({
                    showClose: true,
                    message: '第二步成功了',
                    type: 'success'
                });
                _this.$router.push('/proFormulation')
            }).catch(err => {
                console.log(err);
            })
        },
        spanenter1: function() {
            var spanClass1 = document.getElementsByClassName('spanclass1')[0].children;
            if (spanClass1[0].value !== '') {
                this.span1.push(spanClass1[0].value);
            }
            spanClass1[0].value = '';
            console.log(this.span1)
        },
        spanenter2: function() {
            var spanClass2 = document.getElementsByClassName('spanclass2')[0].children;
            if (spanClass2[0].value !== '') {
                this.span2.push(spanClass2[0].value);
            }
        },
        spanenter3: function() {
            var spanClass3 = document.getElementsByClassName('spanclass3')[0].children;
            if (spanClass3[0].value !== '') {
                this.span3.push(spanClass3[0].value);
            }
        },
        editSpan1: function(tag) {
            this.span1.splice(this.span1.indexOf(tag), 1);
        },
        editSpan2: function() {
            this.span2.pop();
        },
        editSpan3: function() {
            this.span3.pop();
        }
    }
}
</script>

<style lang="less">
html, body, #app, .el-container {
    height: 100%;
}
#audioUpload {
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
        background: url('/static/blue-2.png') no-repeat center left;
        padding-left: 83px;
        color: #3399ff;
    }
    .bottom .status li:first-of-type {
        background: url('/static/gray-1.png') no-repeat center left;
        padding-left: 83px;
        color: #999;
    }
    .bottom .status li:first-of-type + li + li {
        background: url('/static/gray-4.png') no-repeat center left;
        padding-left: 83px;
    }
    .bottom .status li:first-of-type + li + li + li {
        background: url('/static/gray-5.png') no-repeat center left;
        padding-left: 83px;
    }


    .open-white {
        margin: 24px 20px 0;
        border: 1px solid #dfe3eb;
        padding-bottom: 28px;
    }
    .open-white .top {
        height: 60px;
        background-color: #f6f7fb;
        line-height: 60px;
        color: #333;
        font-size: 18px;
        position: relative;
    }
    .open-white .top .el-icon-caret-bottom {
        margin: 0 0 0 30px;
    }
    .open-white .top .el-icon-circle-plus-outline {
        position: absolute;
        right: 20px;
        top: 20px;
    }

    .open-white .domList {
        margin-top: 30px;
    }
    .open-white .domList .el-input {
        width: 90%;
    }
    .open-white .domList>div {
        margin: 0 30px;
        position: relative;
    }
    .open-white .domList i:first-of-type {
        position: absolute;
        right: 0;
        top: 10px;
        display: inline-block;
        width: 22px;
        height: 22px;
        background: url(/static/lajitong.png) no-repeat center/22px auto;
    }
    .open-white .domList i:first-of-type + i {
        position: absolute;
        right: 30px;
        top: 10px;
        display: inline-block;
        width: 24px;
        height: 24px;
        // background: url(/static/play1.png) no-repeat center/22px auto;
    }
    .open-white .domList i:first-of-type + i + i {
        width: 26px;
        height: 23px;
        position: absolute;
        top: 10px;
        right: 60px;
        background: url(/static/upload.png) no-repeat center/26px auto;
    }

    .open-white .domList input[type='file'] {
        width: 26px;
        height: 23px;
        position: absolute;
        top: 10px;
        right: 60px;
        opacity: 0;
    }

    .pro-statement {
        padding-bottom: 30px;
    }
    .pro-statement .list {
        margin: 30px 30px 0;
    }
    .pro-statement .list .member1 .el-input {
        width: 330px;
    }
    .pro-statement .list .member1 .el-select .el-input{
        width: 120px;
        height: 40px;
    }
    .pro-statement .list .member1 .el-select {
        margin-right: 14px;
    }

    .pro-statement .list .member2 {
        margin-top: 26px;
        position: relative;
    }

    .pro-statement .list .member2 i:first-of-type {
        position: absolute;
        right: 0;
        top: 10px;
        display: inline-block;
        width: 22px;
        height: 22px;
        background: url(/static/lajitong.png) no-repeat center/22px auto;
    }
    .pro-statement .list .member2 i:first-of-type + i {
        position: absolute;
        right: 30px;
        top: 10px;
        display: inline-block;
        width: 24px;
        height: 24px;
        // background: url(/static/play1.png) no-repeat center/22px auto;
    }

    .pro-statement .list .member2 i:first-of-type + i + i {
        width: 26px;
        height: 23px;
        position: absolute;
        top: 10px;
        right: 60px;
        background: url(/static/upload.png) no-repeat center/26px auto;
    }
    .pro-statement .list .member2 input[type='file'] {
        width: 26px;
        height: 23px;
        position: absolute;
        top: 10px;
        right: 60px;
        opacity: 0;
    }

    .pro-statement .list .member2 span {
        font-size: 16px;
        color: #666;
        letter-spacing: 4px;
        display: inline-block;
        margin-right: 36px;
    }
    .pro-statement .list .member2 .el-input {
        width: 75%;
    }
    .pro-statement .list .member2 i {
        font-size: 20px;
    }
    .pro-statement{
        .list {
            p {
                color: #333;
                padding-bottom: 30px;
                font-size: 16px;
                font-weight: bold;
            }
            .member2 {
                &.overtime {
                    margin-top: 0;
                }
            }
        }
    }
    .open-white {
        .top {
            font-weight: bold;
        }
    }
    .nextStep {
        margin: 50px 0;
        text-align: center;
        .el-button {
            width: 354px;
            height: 50px;
            border-radius: 30px;
            font-size: 18px;

        }
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
}

</style>
