<template>
	<el-form class="login" ref="form" :model="form" v-loading="isLoading" element-loading-text="登录中..." label-width="80px">
		<el-form-item label="API接口">
			<el-input v-model="apiUrl" placeholder="请输入API统一接口"></el-input>
		</el-form-item>
		<el-form-item label="账号">
			<el-input v-model="form.user" placeholder="请输入账号"></el-input>
		</el-form-item>
		<el-form-item label="密码">
			<el-input type="password" v-model="form.password" autofocus placeholder="请输入密码"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onSubmit">登录</el-button>
		</el-form-item>
	</el-form>
</template>

<script>

import getData from '../getdata.js';

export default {
	name: 'Login',
	data() {
		return {
			isLoading: false,
			apiUrl: '',
			form: {
				user: 'sroot',
				password: '',
			}
		}
	},
	props: {
		data: { type: Object, required: true },
		config: { type: Object, required: true },
	},
	watch: {
		apiUrl (newValue, oldValue) {
			getData.url = newValue;
		}
	},
	methods: {
		onSubmit() {
			this.isLoading = true;
			this.getData('core/login', this.form).then(res=>{
				this.isLoading = false;

				if (res.role !== 'Sroots') {
					return this.$message.warning('必须登录超级管理员账号');
				}

				this.$message.success('登录成功');
				localStorage && localStorage.setItem('apiUrl', this.apiUrl);
				this.data.success && this.data.success();
				this.$emit('close', 'Login');
			}, err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});
		}
	},
	created () {
		this.apiUrl = (localStorage && localStorage.getItem('apiUrl')) || getData.url || 'http://localhost:3000/api/';
		getData.url = this.apiUrl;
	}
}
</script>

<style type="text/css" scoped>
	.login {
		margin: 25px 15px;
	}
</style>
