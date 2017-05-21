<template>
	<el-form class="user-details" ref="form" :model="form" v-loading="isLoading" element-loading-text="拼命加载中" label-width="70px">
		<el-form-item label="名称">
			<el-input v-model="form.user" placeholder="请输入角色名称"></el-input>
		</el-form-item>
		<el-form-item label="密码">
			<el-input type="password" v-model="form.password" placeholder="请输入角色密码"></el-input>
		</el-form-item>
		<el-form-item label="所属角色">
			<el-select v-model="form.role_id" style="width:100%" filterable remote :remote-method="remoteMethod" :loading="userListLoading" placeholder="请选择所属角色">
				<el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="描述">
			<el-input v-model="form.description" type="textarea" :autosize="{minRows: 2}" placeholder="请输入描述">
			</el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" v-if="isAdd" @click="onAdd">立即添加</el-button>
			<el-button type="primary" v-else @click="onUpdate">修改</el-button>
			<el-button @click="onClose">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>

export default {
	name: 'UserDetails',
	data () {
		return {
			isLoading: false,
			isAdd: true,
			userListLoading: false,
			userList: [],
			form: {
				'id': null,
				'user': 'newUser',
				'password': '',
				'role_id': null,
				'description': '一个新的用户',
				'updated_at': null,
				'created_at': null,
			}
		}
	},
	props: {
		data: { type: Object, required: true },
		config: { type: Object, required: true },
	},
	methods: {
		onAdd () {
			this.isLoading = true;
			this.getData('core/user/add', this.form).then(res=>{
				this.isLoading = false;
				this.$message.success('添加成功');
				this.$emit('emit', 'UserList', { event: 'refresh' });
				this.onClose();
			}, err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});
		},
		onUpdate () {
			this.isLoading = true;
			this.getData('core/user/update', this.form).then(res=>{
				this.isLoading = false;
				this.$message.success('更新成功');
				this.$emit('emit', 'UserList', { event: 'refresh' });
				this.onClose();
			}, err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});
		},
		remoteMethod (query) {
			let where;
			if (typeof query === 'number' && query > 0) {
				where = { id: query };
			} else if (typeof query === 'string') {
				where = { name: { $like: `%${query}%` } };
			} else {
				return ;
			}


			this.userListLoading = true;
			this.getData('core/role/list', {
				unit_step: 5,
				page_current: 1,
				option: { where }
			}).then(res=>{
				this.userList = res.list_data;
				this.userListLoading = false;
			}, err=>{
				this.userListLoading = false;
				this.userListLoading = [];
				this.$message.warning(err.msg);
			});

		},
		onClose () {
			if (this.isAdd) {
				this.$emit('close', 'UserAdd');
			} else {
				this.$emit('close', 'UserDetails', this.form.id);
			}
		}
	},
	created () {
		if (this.data.id !== null) {
			this.isLoading = true;
			this.isAdd = false;
			Object.assign(this.form, this.data);
			this.isLoading = false;
		}
	}
}
</script>

<style type="text/css" scoped>
	.user-details {
		margin: 15px;
	}
</style>
