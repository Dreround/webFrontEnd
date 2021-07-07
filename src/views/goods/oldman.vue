/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>老人信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input
          size="small"
          v-model="formInline.name"
          placeholder="输入姓名进行搜索"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="">
        <el-input size="small" v-model="formInline.deptNo" placeholder="输入部门代码"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="search"
          >搜索</el-button
        >
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="handleEdit()"
          >添加</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      size="small"
      :data="listData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%"
    >
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable prop="name" label="姓名" width="100">
      </el-table-column>
      <el-table-column sortable prop="gender" label="性别" width="100">
      </el-table-column>
      <el-table-column sortable prop="age" label="年龄" width="100">
      </el-table-column>
      <el-table-column sortable prop="phone" label="手机号" width="200">
      </el-table-column>
      <el-table-column sortable prop="id_card" label="身份证" width="300">
      </el-table-column>
      <el-table-column sortable prop="description" label="描述" width="300">
      </el-table-column>
      <el-table-column
        sortable
        prop="creator"
        label="创建者"
        width="100"
      ></el-table-column>
      <el-table-column
        sortable
        prop="created"
        label="创建时间"
        width="200"
      ></el-table-column>
      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deleteUser(scope.$index, scope.row)"
            >删除</el-button
          >
          <el-button size="mini" type="success" @click="opencamera">采集信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination
      v-bind:child-msg="pageparm"
      @callFather="callFather"
    ></Pagination>
    <!-- 编辑界面 -->
    <el-dialog
      :title="title"
      :visible.sync="editFormVisible"
      width="30%"
      @click="closeDialog"
    >
      <el-form
        label-width="120px"
        :model="editForm"
        :rules="rules"
        ref="editForm"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            size="small"
            v-model="editForm.name"
            auto-complete="off"
            placeholder="请输入老人名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input
            size="small"
            v-model="editForm.gender"
            auto-complete="off"
            placeholder="请输入性别"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input
            size="small"
            v-model="editForm.age"
            auto-complete="off"
            placeholder="请输入年龄"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            size="small"
            v-model="editForm.phone"
            auto-complete="off"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card">
          <el-input
            size="small"
            v-model="editForm.id_card"
            auto-complete="off"
            placeholder="请输入身份证号"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            :rows="3"
            v-model="editForm.description"
            auto-complete="off"
            placeholder="请输入对老人的一些描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="creator">
          <el-input
            size="small"
            v-model="editForm.creator"
            auto-complete="off"
            placeholder="请输入创建者"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm('editForm')"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deptList, deptSave, deptDelete } from "../../api/userMG";
import {
  AddOldPeople,
  findAllOldPeople,
  deleteOldPeople,
  updateOldPeople,
} from "../../api/supermanage";
import Pagination from "../../components/Pagination";
export default {
  data() {
    return {
      isEdit: false,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      editForm: {
        name: "",
        gender: "",
        age: "",
        phone: "",
        id_card: "",
        description: "",
        creator: "",
        token: localStorage.getItem("logintoken"),
      },
      // rules表单验证
      rules: {
        name: [{ required: true, message: "请输入老人名字", trigger: "blur" }],
        gender: [{ required: true, message: "请输入性别", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
      },
      formInline: {
        page: 1,
        limit: 10,
        varLable: "",
        varName: "",
        token: localStorage.getItem("logintoken"),
      },
      // 删除部门
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
    };
  },
  // 注册组件
  components: {
    Pagination,
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.formInline);
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    opencamera(){
      this.$router.push({ path: 'goods/vulunteers' })

    },
    // 获取公司列表
    getdata(parameter) {
      this.loading = true;
      // 模拟数据开始
      // let res = {
      //   code: 0,
      //   msg: null,
      //   count: 12,
      //   data: [
      //     {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "12412412124124211241241",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //     {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "124124",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //      {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "124124",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //      {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "124124",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //      {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "124124",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //      {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "124124",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //     {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "12412412124124211241241",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //     {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "124124",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //      {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "124124",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //      {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "124124",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //      {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "124124",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //      {
      //       name: "ddddd",
      //       gender: "男",
      //       phone: "123",
      //       id_card: "124124",
      //       creator: "csacs",
      //       created: "12124/12/21",
      //     },
      //   ],
      // };
      // this.loading = false;
      // this.listData = res.data;
      // this.pageparm.currentPage = this.formInline.page;
      // this.pageparm.pageSize = this.formInline.limit;
      // this.pageparm.total = res.count;
      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      findAllOldPeople(parameter)
        .then((res) => {
          this.loading = false;
          if (res.success == false) {
            this.$message({
              type: "info",
              message: res.msg,
            });
          } else {
            this.listData = res.data.obj;
            // 分页赋值
            this.pageparm.currentPage = this.formInline.page;
            this.pageparm.pageSize = this.formInline.limit;
            this.pageparm.total = res.data.obj.length;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("菜单加载失败，请稍后再试！");
        });
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        // isEdit = true;
        this.title = "修改";
        this.editForm.name = row.name;
        this.editForm.gender = row.gender;
        this.editForm.creator = row.creator;
        this.isEdit = true;
      } else {
        this.title = "添加";
        this.editForm.name = "";
        this.editForm.gender = "";
        this.editForm.creator = "";
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      if (this.isEdit == false) {
        this.$refs[editData].validate((valid) => {
          if (valid) {
            // let obj = {
            //   name: "xxx",
            //   creator: "61",
            // };
            AddOldPeople(this.editForm) // this.editForm
              .then((res) => {
                this.editFormVisible = false;
                this.loading = false;
                if (res.data.code == 200) {
                  this.getdata(this.formInline);
                  this.$message({
                    type: "success",
                    message: "公司保存成功！",
                  });
                } else {
                  this.$message({
                    type: "info",
                    message: res.msg,
                  });
                }
              })
              .catch((err) => {
                this.editFormVisible = false;
                this.loading = false;
                this.$message.error("公司保存失败，请稍后再试！");
              });
          } else {
            return false;
          }
        });
      } else {
        this.isEdit = false;
        this.$refs[editData].validate((valid) => {
          if (valid) {
            // let obj = {
            //   name: "xxx",
            //   creator: "61",
            // };
            console.log(this.editForm);
            this.editForm.elder_id = this.listData[index].elder_id;
            updateOldPeople(this.editForm) // this.editForm
              .then((res) => {
                this.editFormVisible = false;
                this.loading = false;
                if (res.data.code == 200) {
                  this.getdata(this.formInline);
                  this.$message({
                    type: "success",
                    message: "公司保存成功！",
                  });
                } else {
                  this.$message({
                    type: "info",
                    message: res.msg,
                  });
                }
              })
              .catch((err) => {
                this.editFormVisible = false;
                this.loading = false;
                this.$message.error("公司保存失败，请稍后再试！");
              });
          } else {
            return false;
          }
        });
      }
    },
    // 删除公司

    deleteUser(index, row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.listData);
          var params = new URLSearchParams();
          params.append("elder_id", parseInt(this.listData[index].elder_id));
          deleteOldPeople(params)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "公司已删除!",
                });
                this.getdata(this.formInline);
              } else {
                this.$message({
                  type: "info",
                  message: res.msg,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error("公司删除失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
  },
};
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

 
 