<template>
  <div class="dashboard-editor-container" style="display: flex; flex-wrap: wrap">
    <el-card class="box-card" style="margin: 20px 25px; width: 350px; height: 350px">
      <div slot="header" class="box-card-header">
        <pan-thumb class="panThumb" :image="avatar"></pan-thumb>
      </div>
      <span class="display_name">Hi {{name}}</span>
      <div class="info-item">
        <span class="info-item-text">Email：</span>
        <icon-svg icon-class="a" class="dashboard-editor-icon"></icon-svg>
      </div>
      <div class="info-item">
        <span class="info-item-text">职位：</span>
        <icon-svg icon-class="b" class="dashboard-editor-icon"></icon-svg>
      </div>
    </el-card>

    <personal-task-list style="margin: 20px 25px"></personal-task-list>

<!--    <el-col :span="15">-->
<!--      <line-chart></line-chart>-->
<!--    </el-col>-->
  </div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import panThumb from 'components/PanThumb';
	import pieChart from './pieChart';
	import barChart from './barChart';
	import lineChart from './lineChart';
	import countTo from 'vue-count-to';
	import personalTaskList from './personalTaskList';

	export default {
	  name: 'dashboard-editor',
	  components: { panThumb, countTo, pieChart, lineChart, barChart, personalTaskList },
	  data() {
    return {
	      statisticsData: {
	        article_count: 1024,
	        comment_count: 102400,
	        latest_article: [],
	        month_article_count: 28,
	        pageviews_count: 1024
      }
    }
  },
	  computed: {
	    ...mapGetters([
	      'name',
	      'avatar',
	      'roles'
    ])
  }
	}
</script>

<style rel="stylesheet/scss" lang="scss" slot-scope>
.dashboard-editor-container {
    margin: 30px;
    .btn-group {
        margin-bottom: 60px;
    }
    .box-card-header {
        position: relative;
        height: 160px;
    }
    .panThumb {
        z-index: 100;
        height: 150px;
        width: 150px;
        position: absolute;
        left: 0px;
        right: 0px;
        margin: auto;
    }
    .display_name{
        font-size: 30px;
        display: block;
    }
    .info-item{
        display: inline-block;
        margin-top: 10px;
        font-size: 14px;
        &:last-of-type{
            margin-left: 15px;
        }
    }
}
</style>
