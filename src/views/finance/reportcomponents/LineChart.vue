<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts';

  require('echarts/theme/macarons'); // echarts theme
  import resize from './mixins/resize';

  export default {
    mixins: [resize],
    props: {
      className: {type: String, default: 'chart'},
      width: {type: String, default: '100%'},
      height: {type: String, default: '350px'},
      autoResize: {type: Boolean, default: true},
      // x轴
      xAxis: {type: Object, required: true},
      // 线段名
      legend: {type: Object, required: true},
      // 线段数据
      series: {type: Object, required: true}
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      series: {
        handler() {
          this.setOptions();
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart();
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons');
        this.setOptions();
      },
      setOptions() {
        this.chart.setOption({
          xAxis: {
            data: this.xAxis,
            boundaryGap: false,
            axisTick: {show: false}
          },
          yAxis: {
            axisTick: {show: false}
          },
          grid: {
            left: 50,
            right: 70,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'cross'},
            padding: [5, 10]
          },
          legend: {
            data: this.legend
          },
          series: this.series
        }, true);
      }
    }
  }
</script>
