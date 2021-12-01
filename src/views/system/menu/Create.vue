<template>
  <a-modal
    title="新建菜单"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" @submit="handleSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-item
          label="菜单名称"
        >
          <a-input
            placeholder="菜单名称"
            v-decorator="[
              'menuName',
              {rules: [{ required: true, message: '请输入菜单名称' }]}
            ]"
          ></a-input>
        </a-form-item>

        <a-form-item
          label="菜单Code"
        >
          <a-input placeholder="菜单Code" style="width: 100%" v-decorator="['menuCode', {rules: [{ required: true, message: '请输入菜单Code' }]}]" />
        </a-form-item>

        <a-form-item
          label="父级"
        >
          <a-tree-select
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="menuTreeData"
            :replaceFields="{children:'children', title:'menuName', key:'id', value: 'id' }"
            placeholder="请选择父级"
            allow-clear
            tree-default-expand-all
            v-decorator="['parentId', {rules: [{ required: true, message: '请选择父级' }], initialValue: parentId}]"
          >
          </a-tree-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { systemMenuSave, systemMenuTree } from '@/api/clever-framework'
import { TreeSelect as ATreeSelect } from 'ant-design-vue'

export default {
  name: 'SystemMenuCreate',
  components: {
    ATreeSelect
  },
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
      menuTreeData: [],
      parentId: '0',
      form: this.$form.createForm(this)
    }
  },
  mounted () {
  },
  methods: {
    show (parentId = '0') {
      this.visible = true
      this.parentId = parentId
      this.loadMenuTree()
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
    loadMenuTree () {
      this.loading = true
      systemMenuTree().then(response => {
        this.menuTreeData = response.content
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          this.loading = true
          // 新增
          systemMenuSave(values).then(res => {
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
