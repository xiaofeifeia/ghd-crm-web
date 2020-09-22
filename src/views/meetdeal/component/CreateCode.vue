<template>
  <el-dialog
    title="生成激活码"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form :model="form" :rules="formRules" ref="form">
      <el-form-item label="选择面额" :label-width="formLabelWidth" prop="priceId">
        <el-select style="width: 100%;" v-model="form.priceId" placeholder="请选择面额">
          <el-option v-for="(item, index) in priceList" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生成数量" :label-width="formLabelWidth" prop="createCount">
        <el-input v-model="form.createCount" type="Number" placeholder="请输入数量" ></el-input>
      </el-form-item>
      <el-form-item label="有效期" :label-width="formLabelWidth" prop="time">
        <el-date-picker
          v-model="form.time"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        有效期以当地美国时间为准
      </el-form-item>
      <el-form-item label="关联Model" :label-width="formLabelWidth" prop="model">
        <el-input v-model="form.model" placeholder="请输入Model"></el-input>
      </el-form-item>
      <p class="tip">
        如果填写了关联Model，则这批激活码的生成值中会和该Model关联（包括二维码）。在发送包含激活码（即二维码）的卡片时，<span class="color-danger">为了后期统计的准确性，请将此批次的激活码放在相应Model的商品中。</span>
      </p>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPriceIds, createCode } from '@/api/meetdeal'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      formLabelWidth: '120px',
      form: {
        createCount: 0,
        model: '',
        priceId: null,
        time: []
      },
      formRules: {
        createCount: [
          {
            required: true, message: '请输入创建数量', trigger: 'blur'
          }
        ],
        model: [
          {
            required: true, message: '请输入创建数量', trigger: 'blur'
          }
        ],
        priceId: [
          {
            required: true, message: '请输入创建数量', trigger: 'change'
          }
        ],
        time: [
          {
            required: true, message: '请选择有效期', trigger: 'change'
          }
        ]
      },
      priceList: []
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  created() {
    this.getPriceIds()
  },
  methods: {
    async getPriceIds() {
      const { data } = await getPriceIds()
      this.priceList = data
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const params = {
            ...this.form,
            startDate: this.form.time[0],
            endDate: this.form.time[1]
          }
          const res = await createCode(params)
          if (res.resCode !== 200) return this.$message.error(res.resDes)
          this.$message.success('Success')
          this.dialogVisible = false
          this.resetForm()
          this.$emit('onOk')
        }
      })
    }
  }
}
</script>