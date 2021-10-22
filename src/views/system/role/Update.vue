<template>
  <a-modal
    title="修改角色"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" @submit="handleSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-item
          hidden
          label="id"
        >
          <a-input :min="1" style="width: 100%" v-decorator="['id']" />
        </a-form-item>
        <a-form-item
          label="角色名称"
        >
          <a-input
            placeholder="角色名称"
            v-decorator="[
              'roleName',
              {rules: [{ required: true, message: '请输入角色名称' }]}
            ]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { systemRoleDetail, systemRoleUpdate } from '@/api/clever-framework'
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'roleName']

export default {
  name: 'SystemRoleUpdate',
  props: {
    record: {
      type: [Object],
      required: false,
      default: null
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      buttonCol: {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12, offset: 5 }
        }
      },
      loading: false,
      visible: false,
      form: this.$form.createForm(this),
      id: 0
    }
  },
  mounted () {
  },
  methods: {
    show () {
      this.visible = true
      if (this.record && this.record.id) {
        this.loadDetailInfo(this.record.id)
      }
    },
    handleOk () {
      this.handleSubmit()
    },
    handleCancel () {
      this.loading = false
      this.visible = false
      // 重置表单数据
      this.form.resetFields()
      this.$emit('cancel')
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          // 新增
          this.loading = true
          systemRoleUpdate(values).then(res => {
            this.visible = false
            // 重置表单数据
            this.form.resetFields()
            this.$message.info('修改成功')
            this.$emit('ok')
          }).catch(errors => {
            this.$message.error(errors.message || '修改失败')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    loadDetailInfo (id) {
      // ajax
      console.log(`将加载 ${id} 信息到表单`)
      this.loading = true
      systemRoleDetail(id).then((response) => {
        const { content } = response
        const formData = pick(content, fields)
        console.log('formData', formData)
        this.form.setFieldsValue(formData)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
