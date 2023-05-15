<template>
  <div class="app-container home">
    <el-row :gutter="20">
        <el-image src= "../src/assets/images/shouye.jpg"  fit="cover"></el-image>
      <el-col :sm="24" :lg="24" style="padding-left: 20px">
        <h2>聚优人力资源管理系统</h2>
        <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;张家口“聚优”是专注于提供人力资源服务的机构，目前由张家口市聚优人力资源服务有限公司和张家口聚优企业运营管理服务有限公司组成。聚优人力资源服务有限公司成立于2012年8月，在公司快速发展的同时，为顺应当前政策法规相关要求以及能够更深入、更广泛的满足各行业用工需求，于2015年4月成立了张家口聚优企业运营管理服务有限公司。两家公司均由工商行政管理部门注册登记，具有独立法人资格，注册资金共计400万。
            聚优人力资源服务有限公司是张家口市首家获得劳务派遣资质的人力资源公司，聚优企业运营管理服务有限公司也是河北省首家获得企业运营资质的服务公司。公司凭借先进的运营模式，以及专业的管理团队，在国内众多领域提供优质的人力资源服务。

        </p>
        <p>
          <b>联系地址:</b> <span>河北省张家口市桥东区胜利北路1号</span>
        </p>
        <p>
          <el-tag type="danger">咨询电话：0313-2017699</el-tag>
        </p>
<!--        <p>-->
<!--          <el-button-->
<!--            type="primary"-->
<!--            icon="Cloudy"-->
<!--            plain-->
<!--            @click="goTarget('https://gitee.com/y_project/RuoYi-Vue')"-->
<!--            >访问码云</el-button-->
<!--          >-->
<!--          <el-button-->
<!--            icon="HomeFilled"-->
<!--            plain-->
<!--            @click="goTarget('http://ruoyi.vip')"-->
<!--            >访问主页</el-button-->
<!--          >-->
<!--        </p>-->
      </el-col>


    </el-row>
    <el-divider />

  </div>
</template>

<script setup name="Index">
import {ref} from "vue";

const version = ref('3.8.5')

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

