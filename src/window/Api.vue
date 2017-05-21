<template>
	<el-table :data="tableData" :height="config.other.containerHeight" border v-loading="isLoading" element-loading-text="拼命加载中" style="width: 100%;">
		<el-table-column v-if="!data.core" prop="id" label="ID" sortable width="80"></el-table-column>
		<el-table-column prop="mark" label="标识" sortable min-width="160">
			<template scope="scope">
				<el-tag type="gray"><span :title="scope.row.mark">{{scope.row.mark}}</span></el-tag>
			</template>
		</el-table-column>
		<el-table-column label="验证模式" prop="verification" sortable :filters="filtersVerificationData" :filter-method="filtersVerification" :filter-multiple="false" width="135">
			<template scope="scope">
				<el-tag v-if="scope.row.verification===0"><span title="所有用户">所有用户</span></el-tag>
				<el-tag v-else-if="scope.row.verification===1"><span title="已登录的用户">已登录的用户</span></el-tag>
				<el-tag v-else-if="scope.row.verification===2"><span title="超级管理员">超级管理员</span></el-tag>
				<el-tag v-else><span title="角色权限管理">角色权限管理</span></el-tag>
			</template>
		</el-table-column>
		<el-table-column prop="description" label="描述" min-width="210"></el-table-column>
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
	name: 'Api',
	data () {
		return {
			isLoading: false,
			filtersVerificationData: [
				{
					text: '所有用户',
					value: 0
				}, {
					text: '已登录的用户',
					value: 1
				}, {
					text: '超级管理员',
					value: 2
				}, {
					text: '角色权限管理',
					value: 3
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
			return this.data.core ? 'core/api/core' : 'core/api/list';
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
			this.$emit('open', 'Readme', `api-${row.mark}`, {
				api: 'core/api/core/help',
				typeText: 'API',
				mark: row.mark
			});
		},
		handleEdit (index, row) {
			this.$emit('open', 'ApiDetails', row.id, row);
		},
		handleDelete (index, row) {
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.getData('core/api/del', {id: row.id}).then(res=>{
					this.$message.success('删除成功');
					this.refreshData();
				}, err=>{
					this.$message.warning(err.msg);
				});
			});
		},
		filtersVerification (value, row) {
			return row.verification === value;
		}
	},
	created () {
		this.refreshData();
		this.$on('refresh', this.refreshData);
	}
}
</script>