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

      <clever-table
        ref="table"
        rowKey="id"
        :columns="columns"
        :loading="loading"
        :data="loadData"
        showPagination="auto"
      >
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <span>原始数据： {{ record.rawData }}</span>
        </p>
      </clever-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { CleverTable, Ellipsis } from '@/components'
import { systemLogPage } from '@/api/clever-framework'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: '300px'
  },
  {
    title: '操作人',
    dataIndex: 'sysUser.username'
  },
  {
    title: '日志类型',
    dataIndex: 'logType'
  },
  {
    title: '模块名称',
    dataIndex: 'moduleName'
  },
  {
    title: '业务名称',
    dataIndex: 'bizName'
  },
  {
    title: '操作时间',
    dataIndex: 'optionDateTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '250px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SystemLogList',
  components: {
    Ellipsis,
    CleverTable
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
        return systemLogPage(requestParameters)
          .then(res => {
            return res
          })
      },
      loading: false,
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
  },
  methods: {
  }
}
</script>
