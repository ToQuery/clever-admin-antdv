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
          label="用户名"
        >
          <a-input
            placeholder="用户名"
            v-decorator="[
              'username',
              {rules: [{ required: true, message: '请输入用户名' }]}
            ]"
          ></a-input>
        </a-form-item>

        <a-form-item
          label="用户昵称"
        >
          <a-input placeholder="用户昵称" style="width: 100%" v-decorator="['nickname', {rules: [{ required: true, message: '请输入用户昵称' }]}]" />
        </a-form-item>

        <a-form-item
          label="密码"
        >
          <a-input placeholder="密码" :min="1" style="width: 100%" v-decorator="['password', {rules: [{ required: true, message: '请输入密码' }]}]" />
        </a-form-item>

        <a-form-item
          label="手机号"
        >
          <a-input placeholder="手机号" style="width: 100%" v-decorator="['phone']" />
        </a-form-item>
        <a-form-item
          label="邮箱"
        >
          <a-input placeholder="邮箱" style="width: 100%" v-decorator="['email']" />
        </a-form-item>

        <a-form-item
          label="状态"
        >
          <a-select v-decorator="['userStatus', {rules: [{ required: true, message: '请选择状态' }], initialValue: 1}]">
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { systemUserSave } from '@/api/clever-framework'

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
          systemUserSave(values).then(res => {
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
