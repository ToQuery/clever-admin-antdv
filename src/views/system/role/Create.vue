<template>
  <a-modal
    title="新建角色"
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
        <a-form-item label="菜单权限">
          <a-tree
            :showLine="true"
            :checkable="true"
            :selectable="false"
            :checkStrictly="true"
            :defaultExpandedKeys="['0']"
            :tree-data="menuTreeData"
            :replaceFields="{children:'children', title:'menuName', key:'id' }"
            @check="onCheck"
            v-decorator="[
              'menuIds',
              {rules: [{ required: true, message: '请选择菜单权限' }], valuePropName: 'checkedKeys' }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { systemMenuTree, systemRoleSave } from '@/api/clever-framework'
import { Tree as ATree } from 'ant-design-vue'

export default {
  name: 'SystemUserCreate',
  props: {
  },
  components: { ATree },
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
      menuTreeData: [],
      form: this.$form.createForm(this)
    }
  },
  mounted () {
    this.loadMenuTree()
  },
  methods: {
    loadMenuTree () {
      systemMenuTree().then(response => {
        this.menuTreeData = response.content
      })
    },
    onCheck (checkedKeys) {
      this.form.setFieldsValue({ menuIds: checkedKeys.checked })
    },
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
