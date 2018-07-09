<template>
    <el-container id='Main'>
        <el-aside style="width: auto;">
            <div class="logo">
                <span>{{title}}</span>
            </div>
            <el-menu router :default-active="'/merchantList'" class="el-menu-vertical-demo" :unique-opened='true'  active-text-color="#ffd04b" :collapse="isCollapse">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="iconfont icon-yemian"></i>
                        <span>主页</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/HomePage1">主页一</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu v-for='(item, index) in firstName' :key='"mainFirstName" + index' :index="index + '1'" :query='index'>
                    <template slot="title">
                        <i :class="item.iconfont"></i>
                        <span>{{ item.resName }}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item v-for='(v, i) in item.tblAuthResourceList' :key='"mainSecondName" + i' :index="v.resUrl" :query="(index + 1) + '-' + (i + 1)">{{ v.resName }}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-container style="flex-direction: column;">
            <Header @clickCollapse="collapseBoolean"></Header>
            <el-main class="content">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </el-main>
        </el-container>

    </el-container>
</template>
<script>
import { baseUrl } from '../../assets/api/api'
import Header from './Header.vue'
import '../../assets/iconfont/iconfont.css'

export default {
    data() {
        return {
            admin: '',
            title: '大后台管理系统',
            firstName: [], //数据存储的地方,
            input: '',
            isCollapse: false
        }
    },
    components: {
        Header
    },
    created() {
        // 左侧菜单栏请求
        var _this = this,
            resSeq = [];
        var params = this.$qs.stringify({'groupId': 1})
        this.$axios.post(baseUrl + '/userresource/getUserResourceList', params)
        .then(res => {
            _this.firstName = res.data.dataInfo;
        })
        .catch(err => {
            _this.$message({
                message: '登陆信息已过期',
                type: 'error'
            });
            _this.$router.push("/");
        })
    },
    computed: {
        onRoutes: function() {
            return this.$route.path.replace('/', '');
        }
    },
    methods: {
        collapseBoolean(data) {
            var that = this;
            if (data) {
                this.isCollapse = true;
                this.title = "";
            } else {
                this.isCollapse = false;
                setTimeout(function() {
                    that.title = "大后天管理系统";
                }, 200)
            }
        }
    }
}
</script>
<style lang="less">
html, body, #app, .el-container {
    height: 100%;
}
i {
    font-style: normal;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
@logocolor: #d2ecff;
@bgcolor: #4b9af5;
@submenucolor: #bcbdbf;
#Main {
    .el-pagination {
        text-align: center;
        margin: 20px 0;
    }
    .el-submenu .el-menu-item.is-active {
        color: #fff !important;
        background-color: @bgcolor !important;
    }
    .el-main {
        padding: 0;
    }
    .el-aside {
        background-color: #344058;
        .logo {
            height: 70px;
            line-height: 70px;
            font-size: 16px;
            color: @logocolor;
            background-color: @bgcolor;
            font-weight: bold;
            letter-spacing: 3px;
            text-align: center;
            span {
                padding-left: 40px;
                display: inline-block;
                height: 100%;
                background: url(/static/logo.png) no-repeat left center/35px auto;
            }
        }
        .el-menu {
            border: none;
            background-color: #344058;
            .el-menu-item-group__title {
                padding: 0 0 0 20px;
            }
            .el-submenu__title {
                font-size: 16px;
                color: @submenucolor;
                &:hover {
                    background-color: #344058;
                    color: #fff;
                    i {
                        color: #fff;
                    }
                }
            }
            .el-menu-item {
                font-size: 14px;
                color: @submenucolor;
                background-color: #242d3d;
                &:hover {
                    color: #fff;
                }
            }
        }
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
    }
}
</style>
