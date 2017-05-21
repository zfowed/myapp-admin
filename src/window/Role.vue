<template>
	<div class="role-list">
		<el-table :data="res.list_data" :height="config.other.containerHeight-50" border v-loading="isLoading" element-loading-text="拼命加载中" style="width: 100%;">
			<el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
			<el-table-column prop="name" label="名称" sortable  width="105"></el-table-column>
			<el-table-column prop="description" label="描述"></el-table-column>
			<el-table-column label="更新时间" sortable width="115">
				<template scope="scope">{{scope.row.updated_at|date}}</template>
			</el-table-column>
			<el-table-column label="操作" width="140">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="res.page_current"
				:page-sizes="[25, 50, 100, 200]"
				:page-size="res.page_count"
				layout="total, sizes, prev, pager, next, jumper"
				:total="res.unit_count"
			></el-pagination>
		</div>
	</div>
</template>

<script>

export default {
	name: 'Role',
	data () {
		return {
			isLoading: false,
			req: {
				unit_step: 25,
				page_current: 1,
				option: {}
			},
			res: {
				list_data: [],
				page_count: 1,
				page_current: 1,
				unit_count: 0,
				unit_step: 0,
			}
		}
	},
	props: {
		data: { type: Object, required: true },
		config: { type: Object, required: true },
	},
	filters: {
		date (value) {
			const date = new Date(value);
			const year = date.getFullYear();
			const month = date.getMonth()+1;
			const day = date.getDate();
			return [year,month,day].join('-');
		}
	},
	methods: {
		refreshData () {
			this.isLoading = true;

			this.getData('core/role/list', this.req).then(res=>{
				this.res = res;
				this.isLoading = false;
			}, err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});

		},
		handleEdit (index, row) {
			this.$emit('open', 'RoleDetails', row.id, row);
		},
		handleDelete (index, row) {
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.getData('core/role/del', {id: row.id}).then(res=>{
					this.$message.success('删除成功');
					this.refreshData();
					this.$emit('emit', 'UserList', { event: 'refresh' });
				}, err=>{
					this.$message.warning(err.msg);
				});
			});
		},
		handleSizeChange (val) {
			this.req.unit_step = val;
			this.refreshData();
		},
		handleCurrentChange (val) {
			this.req.page_current = val;
			this.refreshData();
		},
	},
	created () {
		this.refreshData();
		this.$on('refresh', this.refreshData);
	}
}
</script>

<style type="text/css" scoped>
	.pagination {
		margin-top: 10px;
		text-align: center;
	}
</style>