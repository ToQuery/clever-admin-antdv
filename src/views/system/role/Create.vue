<template>
  <a-modal
    title="新建用户"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" @submit="handleSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
import { systemRoleSave } from '@/api/clever-framework'

export default {
  name: 'SystemUserCreate',
  props: {
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
      loading: false,
      visible: false,
      form: this.$form.createForm(this)
    }
  },
  mounted () {
  },
  methods: {
    show () {
      this.visible = true
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
          this.loading = true
          // 新增
          systemRoleSave(values).then(res => {
            this.visible = false
            // 重置表单数据
            this.form.resetFields()
            this.$message.info('新增成功')
            this.$emit('ok')
          }).catch(errors => {
            this.$message.error(errors.message || '保存失败')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
