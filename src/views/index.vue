<template>
  <div class="app-container home">
    <el-row :gutter="20">
        <el-image src= "../src/assets/images/beijing.jpg"  fit="cover"></el-image>
      <el-col :sm="24" :lg="24" style="padding-left: 20px">
        <h2>聚优人力资源管理系统</h2>
        <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;张家口市金桥人力资源开发服务中心成立于1998年4月，是张家口市规模最大、管理最规范的人力资源服务机构，目前，由人力资源和社会保障局直管，中心成立以来，一直秉承创新、合作、服务的企业精神，锐意进取、追求卓越，现已发展成为当地人力资源行业领军企业。

            自成立以来，得到了业界及客户的广泛赞誉、荣获“全国人力资源诚信服务示范机构”、“AAAA级人力资源服务机构”、“全国人力资源服务大赛河北省选拔赛”二等奖、受邀参加“第一届全国人力资源服务业发展大会”、入选2022河北服务企业100强。

            金桥立足张家口，率先实现京津冀全覆盖,与各行政事业单位、石油、机械制造、金融、采掘、商贸、电力生产运营等不同行业的大中型企业建立了长期、稳定的合作关系。中心主营项目为：劳务派遣；电信业务代办；人力资源服务；通信线路维护；代驾服务；电器设备维护、检修；会议服务；物业服务；电气工程；绿化工程；


            接受委托提供劳务外包服务;企业管理咨询；业务培训；会议及展览服务；专业保洁、清洗、消毒服务；档案整理服务；礼仪服务；广告制作；广告发布；广告设计、代理；图文设计制作；平面设计；办公服务；办公用品销售；纸制品销售;印刷装订服务;信息技术咨询服务其中劳务派遣、档案整理服务业务居行业领先地位。

            做对社会有贡献的人力资源企业，是金桥人力的企业使命，珍视与每一位客户的合作关系，创建优质的品牌效益，金桥人力是企业发展的最佳合作伙伴。
        </p>
        <p>
          <b>联系地址:</b> <span>河北省张家口市桥东区胜利北路1号</span>
        </p>
        <p>
          <el-tag type="danger">张家口市金桥人力资源开发服务中心</el-tag>
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

