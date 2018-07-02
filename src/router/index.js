import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Main from '../components/main.vue'
// 登陆
import Login from '../components/login/Login.vue'
//商户列表
import merchantList from '../components/merchantList.vue'
import proFormulation from '../components/pro-formulation.vue'
import templateAttribute from '../components/template-attribute.vue'
import audioUpload from '../components/audioUpload.vue'
import degIntention from '../components/deg-intention.vue'
//代理商列表
import agentList from '../components/agent-list.vue'
//商户审核
import merchantAudit from '../components/merchantAudit.vue'
//用户权限管理
import userJurisdiction from '../components/userJurisdiction.vue'
//语音模板管理
import voiceTemplate from '../components/voiceTemplate.vue'
// 代理商列表新增企业用户
import addNewAgent from '../components/addNewAgent.vue'
// 代理商列表新增个人用户
import addNewUserPersonal from '../components/addNewUserPersonal.vue'
//代理商权限
import agentPower from '../components/permission-config/agentPower.vue'
// 用户审核
import merchantExamine from '../components/merchant-examine/merchantexamine.vue'
//设备管理
import deviceManager from '../components/device-manager/deviceManager.vue'
//插孔详情
import jackDetail from '../components/device-manager/jackDetail.vue'
//sim卡管理
import simCard from '../components/SIM-card/SIMcard.vue'
//拨号管理
import dialManager from '../components/dial-manager/dialManager.vue'
//模组管理
import moduleManager from '../components/module-manager/moduleManager.vue'
//商户列表的新增用户
import bussinessAddUser from '../components/bussiness-list/addUser.vue'
// 代理商权限配置
import MerconfigMan from '../components/MerConfigMan.vue'
//用户权限配置
import userPower from '../components/permission-config/userPower.vue'
//用户权限配置//用户权限配置
import permissionConfig from '../components/permission-config/permissionConfig.vue'



export default new Router({
    routes: [
        {
            path: '/',
            component: Login
        },
        {
            path: '/main',
            component: Main,
            children: [
                // 商户列表
                {
                    path: '/',
                    component: merchantList
                },
                // 语言模板管理
                {
                    path: '/voiceTemplate',
                    component: voiceTemplate
                },
                // 流程制定
                {
                    path: '/proFormulation',
                    component: proFormulation
                },
                //模板属性
                {
                    path: '/templateAttribute',
                    component: templateAttribute
                },
                // 音频上传
                {
                    path: '/audioUpload',
                    component: audioUpload
                },
                // 意向程度设置
                {
                    path: '/degIntention',
                    component: degIntention
                },
                //代理商列表
                {
                    path: '/agentList',
                    component: agentList
                },
                //商户审核
                {
                    path: '/merchantAudit',
                    component: merchantAudit
                },
                //用户权限管理
                {
                    path: '/userJurisdiction',
                    component: userJurisdiction
                },
                // 代理商列表新增用户
                {
                    path: '/addNewAgent',
                    component: addNewAgent
                },
                //代理商新增个人用户
                {
                    path: '/addNewUserPersonal',
                    component: addNewUserPersonal
                },
                //代理商权限
                {
                    path: '/agentPower',
                    component: agentPower
                },
                //商户审核
                {
                    path: '/merchantExamine',
                    component: merchantExamine
                },
                //设备管理
                {
                    path: '/deviceManager',
                    component: deviceManager
                },
                //sim管理
                {
                    path: '/simCard',
                    component: simCard
                },
                //插孔详情
                {
                    path: '/jackDetail',
                    component: jackDetail
                },
                //拨号管理
                {
                    path: '/dialManager',
                    component: dialManager
                },
                //模组管理
                {
                    path: '/moduleManager',
                    component: moduleManager
                },
                //用户权限配置
                {
                    path: '/permissionConfig',
                    component: permissionConfig
                },
                //商户列表新增用户
                {
                    path: '/bussinessAddUser',
                    component: bussinessAddUser
                },
                //代理商权限配置
                {
                    path: '/MerconfigMan',
                    component: MerconfigMan
                },
                //用户权限
                {
                    path: '/userPower',
                    component: userPower
                }
            ]
        }
    ]
})
