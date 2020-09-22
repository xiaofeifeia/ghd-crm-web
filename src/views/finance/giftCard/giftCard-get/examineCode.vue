<template>
  <div class="appGift">
    <el-dialog title='查看Code码' :visible.sync="dialogTableVisible" width="40%">
      <div class="content">
      <div class="code">
        <div class="titel">
          <span>Gift Card 面额：${{CodeData.unitPrice}}</span>
          <span>适用站点： {{CodeData.country}}</span>
          <span>领取数量： {{CodeData.totalAmount}}</span>
        </div>
        <div class="codeNumber">
          <ul>
            <template v-if="CodeData.codeList">
              <li v-for="(item,index) in CodeData.codeList" :key="index"> {{item!==''?item:'无Code码'}}</li>
            </template>
            <li v-else>无Code码</li>
          </ul>
        </div>
      </div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  props:{
    visible:{
      type:Boolean,
      default:false
    },
    CodeData:{
      type:Object,
      default:()=>({})
    }
  },
  data(){
    return{
      dialogTableVisible:false,
      
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogTableVisible = this.visible
        if (val) {

        }
      }
    },
    dialogTableVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods:{

  }
}
</script>
<style lang="scss" scoped>
.appGift{
  .code{
    .titel{
      span{
        margin-right: 20px;
      }
       margin-bottom: 10px;
    }
    .codeNumber{
      border: 1px solid #ccc;
      padding: 0 20px;
      ul{
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        li{
              margin: 5px 10px;
              list-style: none;
              margin-bottom: 10px;
              
        }
      }
    }
  }
}
</style>