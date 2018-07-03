<template>
    <!-- 用户权限配置 -->
  <div id="userPermissionConfig" style="width:100%;">
    <div class="main-hd">
      <div class="hd-title"><div class="icon-return" @click="returnRouter"></div>用户权限配置</div>
      <div class="hd-btnGroup">
        <el-button type="primary" @click="modifyTree();newAdd = true">新增权限角色</el-button>
      </div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="topBtnGroup" :inline="true" :model="topBtnGroupForm">
        <el-form-item label="角色名称：" style="margin-bottom:0;">
          <el-input v-model="topBtnGroupForm.name" clearable></el-input>
        </el-form-item>
        <el-button type="primary" @click="tableInit">搜 索</el-button>
      </el-form>
    </div>
    <div class="main-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        style="width: 100%"
        @cell-click='changeRow'>
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="groupId"
          label="用户套餐编号">
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="用户套餐名称">
        </el-table-column>
        <el-table-column
          label="用户套餐权限">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="lookTree();edit = true">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="modifyTree();edit = true">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="tableCount">
      </el-pagination>
    </div> -->
    <!-- 新增权限角色-弹窗 -->
    <el-dialog class="dialog checked" title="新增权限角色" :visible.sync="newAdd" width="400px" @open="aa">
      <el-form :model="newAddForm">
        <el-form-item label="角色名称：" style="margin-bottom:6px;">
          <el-input v-model="newAddForm.name" style="width:256px;" clearable></el-input>
        </el-form-item>
          <el-form-item style="margin-bottom:6px;">
            <div>请选择功能模块：</div>
          </el-form-item>
          <el-form-item>
          <el-tree
            :data="treeList"
            ref="tree3"
            show-checkbox
            highlight-current
            default-expand-all
            node-key="resSeq"
            :default-checked-keys="editChecked1"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newAdd = false">取 消</el-button>
        <el-button type="primary" @click="newAdd = false; newAddConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改-弹窗 -->
    <el-dialog class="dialog checked" title="用户权限配置" :visible.sync="edit" width="400px">
      <el-form :model="editForm">
        <el-form-item style="margin-bottom:6px;">
          <div>请选择功能模块：</div>
        </el-form-item>
        <el-form-item>
          <el-tree
            :data="treeList"
            ref="tree1"
            show-checkbox
            highlight-current
            default-expand-all
            node-key="resSeq"
            :default-checked-keys="editChecked"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取 消</el-button>
        <el-button type="primary" @click="edit = false; editConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl, Ajax } from "../../assets/api/api";
import axios from "axios";
export default {
  data() {
    return {
      treeList: [],
      defaultProps: {
        children: "tblAuthResourceList",
        label: "resName"
      },
      editChecked: [],
      editChecked1: [],
      name: "",
      topBtnGroupForm: {
        name: ""
      },
      edit: false,
      newAdd: false,
      tableData: [],
      tableCount: 0,
      currentPage: 1,
      editForm: {
        //修改弹窗
        checkedTel: [],
        telArr: [],
        telOptions: [],
        checkedTel: [],
        checkAll: false,
        isIndeterminate: true
      },
      editMercSeq: "",
      newAddForm: {
        name: ""
      },
      newAddBtn: true,

      row: {}
    };
  },
  mounted() {
        this.tableInit();
  },
  methods: {
    aa(){
      if(this.newAddBtn){
        this.newAddForm.name = '';
      }
    },
    returnRouter() {
      this.$router.push("/agentPower");
    },
    idconfig() {
      this.$router.push("/idConfig");
    },


    changeRow: function(row) {
        this.row = row;
        console.log(row);
    },
    lookTree: function() {
        var that = this;
        this.editChecked = [];
        this.$nextTick(function() {
            var params = {
                groupId: that.row.groupId
            };
            Ajax('/userresource/getResListByGroupId', 'post', params).then(res => {
                res.forEach(function(ele, index) {
                    that.editChecked.push(ele.resSeq)
                })
                console.log(that.editChecked);
                //可选权限模块
                Ajax("/userresource/getAuthList", "get").then(res => {
                    //禁用
                    res.forEach(function(ele, index) {
                        ele.disabled = true;
                        ele.tblAuthResourceList.forEach(function(e, i) {
                            e.disabled = true;
                        })
                    })
                    that.treeList = res;
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
            })
        })
    },
    modifyTree: function() {
        var that = this;
        this.editChecked = [];
        this.$nextTick(function() {
            var params = {
                groupId: that.row.groupId
            };
            Ajax('/userresource/getResListByGroupId', 'post', params).then(res => {
                res.forEach(function(ele, index) {
                    that.editChecked.push(ele.resSeq)
                })
                console.log(that.editChecked);
                //可选权限模块
                Ajax("/userresource/getAuthList", "get").then(res => {
                    that.treeList = res;
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
            })
        })
    },
    handleCurrentChange(val) {
      this.tableInit(val);
    },
    tableInit() {
      let that = this;
      var params = new URLSearchParams();
      params.append("groupName", this.topBtnGroupForm.name);
      this.$axios.post(baseUrl + "/usergroup/searchUserGroupList", params).then(res => {
          that.tableData = res.data;
      }).catch(err => {
          console.log(err);
      })
      // Ajax('/usergroup/getUserGroupList', 'get').then(res => {
      //     that.tableData = res;
      // }).catch(err => {
      //     console.log(err);
      // })
    },
    search() {
      let that = this;
      let paramsForm = {
        name: this.topBtnGroupForm.name
      };
      Ajax("/merchantpackage/mercPermissionCfg", "post", paramsForm).then(
        res => {
          if (res.resultCode == 0) {
            that.tableCount = res.count;
            that.tableData = res.dataInfo;
            that.currentPage = 1;
          } else {
            this.$message({
              type: "error",
              message: "表格数据初始化有误"
            });
          }
        }
      );
    },
    editConfirm() {
      let that = this;
      let groupSeq = this.editMercSeq;
      let arr = this.$refs.tree1.getCheckedNodes();
      let resourceSeq = [];
      arr.forEach(function(ele, index) {
        resourceSeq.push(ele.resSeq);
      });
      console.log(resourceSeq);
      if (resourceSeq.length > 0) {
        var sendObj = {
            groupId: that.row.groupId,
            resSeq: resourceSeq
        }
         $.ajax({
             url: baseUrl + '/usergroup/editGroupAuth',
             type: 'post',
             dataType: 'json',
             xhrFields: {
                    withCredentials: true
             },
             contentType: 'application/json',
             data: JSON.stringify(sendObj),
             success: function(res) {
                 console.log(res);
             },
             error: function(err) {
                 console.log(err);
             }
         })
      } else {
        this.$message({
          type: "error",
          message: "至少选择一个功能模块"
        });
      }
    },
    newAddConfirm() {
      this.newAddBtn = false;
      let that = this;
      let arr = this.$refs.tree3.getCheckedNodes();
      let resourceSeq = [];
      let packageName = this.newAddForm.name;
      arr.forEach(function(ele, index) {
        resourceSeq.push(ele.resSeq);
      });
      if (packageName) {
        if (resourceSeq.length > 0) {
            var sendObj = {
                groupName: packageName,
                resSeq: resourceSeq
            };
            $.ajax({
                url: baseUrl + '/usergroup/addUserGroup',
                type: 'post',
                dataType: 'json',
                xhrFields: {
                       withCredentials: true
                },
                contentType: 'application/json',
                data: JSON.stringify(sendObj),
                success: function(res) {
                    console.log(res);
                },
                error: function(err) {
                    console.log(err);
                }
            })
        } else {
          this.$message({
            type: "error",
            message: "至少选择一个功能模块"
          });
          this.newAdd = true;
        }
      } else {
        this.$message({
          type: "error",
          message: "请输入角色名称"
        });
        this.newAdd = true;
      }
    }
  }
};
</script>
<style lang='less'>
#userPermissionConfig{
  display: flex;
  flex-direction: column;
  .el-dialog__wrapper{
    overflow: hidden;
    &.checked{
      .el-dialog__body{
        padding-bottom: 0;
      }
    }
  }
  .main-hd{
    background-color: #fff;
    padding: 0 20px;
    position: relative;
    .hd-title {
      height: 60px;
      line-height: 60px;
      color: #3399ff;
      font-size: 22px;
      position: relative;
      text-indent: 40px;
      .icon-return{
        width: 40px;
        height: 40px;
        position: absolute;
        top: 10px;
        left: 0;
        background: #f0f3f0;
        cursor: pointer;
      }
    }
    .hd-btnGroup{
      height: 32px;
      position: absolute;
      top: 14px;
      right: 20px;
    }
  }

  .top-btnGroup{
    padding: 20px 20px;
    background-color: #fff;
    margin: 14px 0;
    .el-input__inner{
      line-height: 32px;
    }
  }

  .main-table{
    flex: 1;
    .cell{
      text-align: center;
    }
  }

  .pagination{
    text-align: center;
    padding: 10px 0;
    background-color: #fff;
  }

  .el-dialog__header {
      border-bottom: 1px solid #E4E7ED;
  }

  .el-dialog__body{
    padding: 20px 30px;
  }
}
</style>
