<template>
	<el-form class="role-details" ref="form" :model="form" v-loading="isLoading" element-loading-text="拼命加载中" label-width="100px">
		<el-form-item label="名称">
			<el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
		</el-form-item>
		<el-form-item label="验证路由模式">
			<el-switch v-model="form.verification_route_bypass" on-text="绕行" off-text="绕行" on-color="#13ce66"></el-switch>
			<span v-if="form.verification_route_bypass">（禁止访问列表中的路由规则）</span>
			<span v-else>（只允许访问列表中的路由规则）</span>
		</el-form-item>
		<el-form-item label="验证路由列表">
			<el-select v-model="form.verification_route" style="width:100%" multiple filterable allow-create placeholder="请输入验证的路由规则">
				<el-option v-for="item in form.verification_route" :key="item" :label="item" :value="item"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="验证API模式">
			<el-switch v-model="form.verification_api_bypass" on-text="绕行" off-text="绕行" on-color="#13ce66"></el-switch>
			<span v-if="form.verification_api_bypass">（禁止访问列表中的API）</span>
			<span v-else>（只允许访问列表中的API）</span>
		</el-form-item>
		<el-form-item label="验证API列表">
			<el-select v-model="form.verification_api" style="width:100%" multiple filterable allow-create placeholder="请输入验证的路由规则">
				<el-option v-for="item in form.verification_api" :key="item" :label="item" :value="item"></el-option>
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
	name: 'RoleDetails',
	data () {
		return {
			isLoading: false,
			isAdd: true,
			form: {
				'id': null,
				'name': 'newRole',
				'verification_route_bypass': true,
				'verification_route': [],
				'verification_api_bypass': false,
				'verification_api': [],
				'description': '一个新的角色',
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
			this.getData('core/role/add', this.form).then(res=>{
				this.isLoading = false;
				this.$message.success('添加成功');
				this.$emit('emit', 'UserList', { event: 'refresh' });
				this.$emit('emit', 'RoleList', { event: 'refresh' });
				this.onClose();
			}, err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});
		},
		onUpdate () {
			this.isLoading = true;
			this.getData('core/role/update', this.form).then(res=>{
				this.isLoading = false;
				this.$message.success('更新成功');
				this.$emit('emit', 'UserList', { event: 'refresh' });
				this.$emit('emit', 'RoleList', { event: 'refresh' });
				this.onClose();
			}, err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});
		},
		onClose () {
			if (this.isAdd) {
				this.$emit('close', 'RoleAdd');
			} else {
				this.$emit('close', 'RoleDetails', this.form.id);
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
	.role-details {
		margin: 15px;
	}
</style>
