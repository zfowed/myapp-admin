<template>
	<el-form class="sroot-password" ref="form" :model="form" v-loading="isLoading" element-loading-text="拼命加载中" label-width="70px">
		<el-form-item label="新密码">
			<el-input type="password" v-model="form.password" placeholder="请输入新的密码"></el-input>
		</el-form-item>
		<el-form-item label="确认密码">
			<el-input type="password" v-model="form.confirm_password" placeholder="请输入确认密码"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onUpdate">修改</el-button>
			<el-button @click="onClose">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>

export default {
	name: 'SrootPassword',
	data () {
		return {
			isLoading: false,
			form: {
				'password': '',
				'confirm_password': '',
			}
		}
	},
	props: {
		data: { type: Object, required: true },
		config: { type: Object, required: true },
	},
	methods: {
		onUpdate () {
			if (this.form.confirm_password !== this.form.password) {
				return this.$message.warning('两次输入的密码不一致！');
			}
			this.isLoading = true;
			this.getData('core/user/password', this.form).then(res=>{
				this.isLoading = false;
				this.$message.success('更新密码成功');
				this.onClose();
			}, err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});
		},
		onClose () {
			this.$emit('close', 'SrootPassword');
		}
	},
	created () {
	}
}
</script>

<style type="text/css" scoped>
	.sroot-password {
		margin: 15px;
	}
</style>
