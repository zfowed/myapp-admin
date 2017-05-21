<template>
	<el-table :data="tableData" :height="config.other.containerHeight" border v-loading="isLoading" element-loading-text="拼命加载中" style="width: 100%;">
		<el-table-column v-if="!data.core" prop="id" label="ID" sortable width="80"></el-table-column>
		<el-table-column prop="method" label="方法" sortable :filters="filtersMethodData" :filter-method="filtersMethod" :filter-multiple="false" width="105">
			<template scope="scope">
				<el-tag :type="scope.row.method==='post'?'primary':'success'">{{scope.row.method|toUpperCase}}</el-tag>
			</template>
		</el-table-column>
		<el-table-column prop="uri" label="URI" sortable min-width="160">
			<template scope="scope">
				<el-tag type="gray"><span :title="scope.row.uri">{{scope.row.uri}}</span></el-tag>
			</template>
		</el-table-column>
		<el-table-column prop="description" label="描述" width="180"></el-table-column>
		<el-table-column v-if="!data.core" label="更新时间" sortable width="115">
			<template scope="scope">{{scope.row.updated_at|date}}</template>
		</el-table-column>
		<el-table-column label="操作" width="140">
			<template scope="scope">
				<el-button v-if="data.core"size="small" @click="readme(scope.$index, scope.row)">使用说明</el-button>
				<el-button v-if="!data.core"size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				<el-button v-if="!data.core"size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script>

export default {
	name: 'Routing',
	data () {
		return {
			isLoading: false,
			filtersMethodData: [
				{
					text: 'get',
					value: 'get'
				}, {
					text: 'post',
					value: 'post'
				}
			],
			tableData: [],
		}
	},
	props: {
		data: { type: Object, required: true },
		config: { type: Object, required: true },
	},
	filters: {
		toUpperCase (value) {
			return value.toUpperCase();
		},
		date (value) {
			const date = new Date(value);
			const year = date.getFullYear();
			const month = date.getMonth()+1;
			const day = date.getDate();
			return [year,month,day].join('-');
		}
	},
	computed: {
		apiMark () {
			return this.data.core ? 'core/route/core' : 'core/route/list';
		},
	},
	methods: {
		refreshData () {
			this.isLoading = true;

			this.getData(this.apiMark).then(res=>{
				this.tableData = res;
				this.isLoading = false;
			}, err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});

		},
		readme (index, row) {
			this.$emit('open', 'Readme', `routing-${row.core_id}`, {
				api: 'core/route/core/help',
				core_id: row.core_id,
				typeText: '路由',
				mark: row.uri
			});
		},
		handleEdit (index, row) {
			this.$emit('open', 'RoutingDetails', row.id, row);
		},
		handleDelete (index, row) {
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.getData('core/route/del', {id: row.id}).then(res=>{
					this.$message.success('删除成功');
					this.refreshData();
				}, err=>{
					this.$message.warning(err.msg);
				});
			});
		},
		filtersMethod (value, row) {
			return row.method === value;
		}
	},
	created () {
		this.refreshData();
		this.$on('refresh', this.refreshData);
	}
}
</script>