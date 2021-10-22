<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="queryParam.username" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="用户状态">
                <a-select v-model="queryParam.userStatus" placeholder="请选择" default-value="1">
                  <a-select-option value="0">禁用</a-select-option>
                  <a-select-option value="1">启用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="昵称">
                  <a-input v-model="queryParam.nickname" placeholder="昵称" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="手机号">
                  <a-input v-model="queryParam.phone" placeholder="手机号"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="邮箱">
                  <a-input v-model="queryParam.email" placeholder="邮箱"/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="() => this.advanced = !this.advanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="deletes"><a-icon type="delete" />删除</a-menu-item>
            <a-menu-item key="disable"><a-icon type="lock" />禁用</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <clever-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a @click="handleAuthorize(record)">授权</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定要删除该用户吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <a-icon slot="icon" type="question-circle-o" style="color: red" />
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </clever-table>
    </a-card>
    <create-modal ref="createModal" @cancel="handleCancel" @ok="handleOk"/>
    <update-model ref="updateModal" :record="currentRow" @cancel="handleCancel" @ok="handleOk"/>
    <authorize-model ref="authorizeModel" :record="currentRow" @cancel="handleCancel" @ok="handleOk"/>
  </page-header-wrapper>
</template>

<script>
import { CleverTable, Ellipsis } from '@/components'
import { systemUserDelete, systemUserPage } from '@/api/clever-framework'
import CreateModal from './Create'
import UpdateModel from './Update'
import AuthorizeModel from './Authorize'

const columns = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    customRender: (enabled) => enabled ? '启用' : '禁用'
  },
  {
    title: '手机号',
    dataIndex: 'phone'
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '修改密码时间',
    dataIndex: 'changePasswordDateTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  '1': {
    status: '1',
    text: '启用'
  },
  '0': {
    status: 'o',
    text: '禁用'
  }
}

export default {
  name: 'TableList',
  components: {
    CleverTable,
    Ellipsis,
    CreateModal,
    UpdateModel,
    AuthorizeModel
  },
  data () {
    this.columns = columns
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return systemUserPage(requestParameters)
          .then(res => {
            return res
          })
      },
      // 当前行
      currentRow: {},
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.$refs.createModal.show()
    },
    handleEdit (record) {
      this.currentRow = { ...record }
      this.$nextTick(() => {
        this.$refs.updateModal.show()
      })
    },
    handleAuthorize (record) {
      this.currentRow = { ...record }
      this.$nextTick(() => {
        this.$refs.authorizeModel.show()
      })
    },
    handleOk () {
      this.currentRow = {}
      this.$refs.table.refresh()
    },
    handleCancel () {
    },
    handleDelete (record) {
      this.currentRow = { ...record }
      systemUserDelete(record.id).then(response => {
        this.selectedRowKeys = []
        this.selectedRows = []
        this.currentRow = {}
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      }).catch(error => {
        this.$message.error(error.message || '删除失败')
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm () {
      this.queryParam = {}
    }
  }
}
</script>
