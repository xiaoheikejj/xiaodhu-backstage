<!-- <template lang="html">
    <div >
        <div class="header">
            <i></i>
            新增用户
        </div>
        <form id='upPersonal'>
            <div class="addNewPersonal-content">
                <ul>
                    <li>企业用户</li>
                    <li>个人用户</li>
                </ul>
                <div>
                    个人姓名：
                    <el-input class="personName"></el-input>
                </div>
                <div>
                    身份证：
                    <el-input class="codeNum"></el-input>
                </div>
                <div>
                    手机号：
                    <el-input class="phoneNum"></el-input>
                </div>
                <div class="provinceCity">
                    所在地：
                    <el-select placeholder='省' v-model='provinceVal' @change='changeProvice'>
                        <el-option v-for='(item, index) in provinceLists' :value='item.areaName' :query='item.areaId' :key='"addNewUserPersonalpro" + index'></el-option>
                    </el-select>
                    <el-select placeholder='市' v-model='cityVal' @change='changeCity'>
                        <el-option v-for='(list, index) in cityLists' :value='list.areaName' :query='list.areaId' :key='"addNewUserPersonalcit" + index'></el-option>
                    </el-select>
                </div>
                <div>
                    所属行业：
                    <el-select class="" v-model='industryVal' @change='changeIndustry'>
                        <el-option v-for='(i, index) in industryLists' :value='i.value' :query='i.orderno' :key='"addNewUserPersonalind" + index'></el-option>
                    </el-select>
                </div>
                <div>
                    <el-button type='primary' @click='submit'>确定</el-button>
                    <el-button>取消</el-button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
        provinceLists: [],
        provinceVal: '',
        cityLists: [],
        cityVal: '',
        industryLists: [], //行业列表
        industryVal: '',
        changeProName: '', //改变省的名字
        changeCityName: '', //改变市的名字
        changeIndName: '',   //改变行业的名字
        proID: '',   //省的id
        cityID: '',      //市的id
        indID: ''      //行业的id
        }
    },
    created: function() {
        var _this = this;
        //获取省
        this.$axios.post('http://192.168.1.251:8080/areacode/getProvince').then(res => {
            _this.provinceLists = res.data;
        }).catch(err => {
            console.log(err);
        })
        //获取所属行业
        this.$axios.get('http://192.168.1.251:8080/sysdicttreedata/getCategory').then(res => {
            _this.industryLists = res.data;
        }).catch(err => {
            console.log(err);
        })
    },
    methods: {
        changeProvice(name) {
            var _this = this,
                provinceSelected = document.getElementsByClassName('hover')[0];
            var id = provinceSelected.getAttribute('query');
            // 获取省的id
            this.proID = parseInt(id);
            var params = new URLSearchParams;
            params.append('areaSupCode', id)
            this.$axios.post('http://192.168.1.251:8080/areacode/getCity', params).then(res => {
                _this.cityLists = res.data;
            }).catch(err => {
                console.log(err);
            })
            //改变省的名字
            this.changeProName = name;
        },
        changeCity(name) {
            this.changeCityName = name;
            var citySelected = document.getElementsByClassName('hover')[1];
            var id = citySelected.getAttribute('query');
            // 获取市的id
            this.cityID = parseInt(id);
        },
        changeIndustry(name) {
            this.changeIndName = name;
            var industrySelected = document.getElementsByClassName('hover')[2];
            var id = industrySelected.getAttribute('query');
            // 获取行业的id
            this.indID = parseInt(id);
        },
        submit: function() {
            var perName = $('.personName input').val(), //个人名字
                codeName = $('.codeNum input').val(),   //身份证
                phoneName = $('.codeNum input').val();   //手机号

        }
    }
}
</script>

<style lang="less">
.header {
    width: 100%;
    height: 60px;
    background-color: #fff;
    position: relative;
    line-height: 60px;
    padding-left: 60px;
    color: #3399ff;
    font-size: 22px;
    i {
        display: inline-block;
        width: 22px;
        height: 16px;
        background: url(/static/back.png) no-repeat center/22px auto;
        position: absolute;
        left: 18px;
        top: 20px;
    }
}
.addNewPersonal-content {
    margin-top: 14px;
    background-color: #fff;
    padding-top: 30px;
    & > div {
        text-align: center;
        color: #666;
        font-size: 16px;
        margin-top: 26px;
        .el-input {
            width: 258px;
        }
        .avatar-uploader {
            display: inline-block;
        }
        .el-button {
            width: 120px;
            font-size: 18px;
        }
    }
    .provinceCity {
        .el-select {
            .el-input {
                width: 120px;
            }
        }
    }
    & > div:first-of-type {
        margin-top: 30px;
    }
    ul {
        text-align: center;
        li {
            display: inline-block;
            font-size: 20px;
            color: #666;
            cursor: pointer;
            &:nth-of-type(1) {
                margin-right: 18px;
                border-right: 1px solid #666;
                padding-right: 18px;
            }
            &:nth-of-type(2) {
                padding-bottom: 10px;
                border-bottom: 3px solid #3399ff;
                color: #3399ff;
            }
        }
    }
}
</style> -->
