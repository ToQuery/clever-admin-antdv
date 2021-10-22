<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单名称">
                <a-input v-model="queryParam.menuName" placeholder="菜单名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单Code">
                <a-input v-model="queryParam.menuCode" placeholder="菜单Code"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' } ">
                <a-button type="primary" @click="loadMenuTree">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd('0')">新建</a-button>
        <a-button :disabled="this.selectedRowKeys.length <= 0" icon="delete" @click="handleDeletes">批量删除</a-button>
      </div>

      <a-table
        ref="table"
        rowKey="id"
        :columns="columns"
        :loading="loading"
        :data-source="menuTreeData"
        :rowSelection="rowSelection"
        :defaultExpandAllRows="true"
        showPagination="false"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleAdd(record.id)">新建子集</a>
          <template v-if="record.id !== '0'">
            <a-divider type="vertical" />
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
          </template>
        </span>
      </a-table>
    </a-card>
    <create-modal ref="createModal" @cancel="handleCancel" @ok="handleOk"/>
    <update-modal ref="updateModal" :record="currentRow" @cancel="handleCancel" @ok="handleOk"/>
  </page-header-wrapper>
</template>

<script>
import { Ellipsis } from '@/components'
import { systemMenuDelete, systemMenuTree } from '@/api/clever-framework'
import CreateModal from './Create'
import UpdateModal from './Update'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: '300px'
  },
  {
    title: '菜单名称',
    dataIndex: 'menuName'
  },
  {
    title: '菜单Code',
    dataIndex: 'menuCode'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '250px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SystemMenuTree',
  components: {
    Ellipsis,
    CreateModal,
    UpdateModal
  },
  data () {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {},
      loading: false,
      menuTreeData: [],
      // 当前行
      currentRow: {},
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
  },
  mounted () {
    this.loadMenuTree()
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
    handleAdd (parentId) {
      this.$refs.createModal.show(parentId)
    },
    handleEdit (record) {
      this.currentRow = { ...record }
      this.$nextTick(() => {
        this.$refs.updateModal.show()
      })
    },
    loadMenuTree () {
      this.loading = true
      systemMenuTree(this.queryParam).then(response => {
        this.menuTreeData = response.content
      }).finally(() => {
        this.loading = false
      })
    },
    handleOk () {
      this.currentRow = {}
      this.loadMenuTree()
    },
    handleCancel () {
    },
    handleDelete (record) {
      this.currentRow = { ...record }
      this.loading = true
      systemMenuDelete(record.id).then(response => {
        this.selectedRowKeys = []
        this.selectedRows = []
        this.currentRow = {}
        this.$message.info('删除成功')
        this.loadMenuTree()
      }).catch(error => {
        this.$message.error(error.message || '删除失败')
      }).finally(() => {
        this.loading = false
      })
    },
    handleDeletes () {
      systemMenuDelete(this.selectedRowKeys.join(',')).then(response => {
        this.selectedRowKeys = []
        this.selectedRows = []
        this.currentRow = {}
        this.$message.info('删除成功')
        this.loadMenuTree()
      }).catch(error => {
        this.$message.error(error.message || '删除失败')
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
