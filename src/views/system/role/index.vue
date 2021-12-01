<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色名称">
                <a-input v-model="queryParam.roleName" placeholder="角色名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' } ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
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
        :loading="loading"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定要删除该菜单吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(record)"
          >
            <a-icon slot="icon" type="question-circle-o" style="color: red" />
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
      </clever-table>
    </a-card>
    <create-modal ref="createModal" @cancel="handleCancel" @ok="handleOk"/>
    <update-modal ref="updateModal" :record="currentRow" @cancel="handleCancel" @ok="handleOk"/>
  </page-header-wrapper>
</template>

<script>
import { CleverTable, Ellipsis } from '@/components'
import { systemRoleDelete, systemRolePage } from '@/api/clever-framework'
import CreateModal from './Create'
import UpdateModal from './Update'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: '300px'
  },
  {
    title: '角色名称',
    dataIndex: 'roleName'
  },
  {
    title: '修改时间',
    width: '250px',
    dataIndex: 'updateDateTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '250px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SystemRoleList',
  components: {
    Ellipsis,
    CleverTable,
    CreateModal,
    UpdateModal
  },
  data () {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {},
      loading: false,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        debugger
        return systemRolePage(requestParameters)
          .then(res => {
            debugger
            return res
          })
      },
      // 当前行
      currentRow: {},
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
  },
  mounted () {
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
    handleOk () {
      this.currentRow = {}
      this.$refs.table.refresh()
    },
    handleCancel () {
    },
    handleDelete (record) {
      this.currentRow = { ...record }
      // this.loading = true
      systemRoleDelete(record.id).then(response => {
        this.selectedRowKeys = []
        this.selectedRows = []
        this.currentRow = {}
        this.$message.info('删除成功')
        this.$refs.table.refresh()
      }).catch(error => {
        this.$message.error(error.message || '删除失败')
      }).finally(() => {
        // this.loading = false
      })
    },
    handleDeletes () {
      this.loading = true
      systemRoleDelete(this.selectedRowKeys.join(',')).then(response => {
        this.selectedRowKeys = []
        this.selectedRows = []
        this.currentRow = {}
        this.$message.info('删除成功')
        this.$refs.table.refresh()
      }).catch(error => {
        this.$message.error(error.message || '删除失败')
      }).finally(() => {
        this.loading = false
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.info('onSelectChange', selectedRowKeys, selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm () {
      this.queryParam = {}
    }
  }
}
</script>
