<template>
	<el-form class="guest-verification" ref="form" :model="form" v-loading="isLoading" element-loading-text="拼命加载中" label-width="100px">
		<el-form-item label="验证路由模式">
			<el-switch v-model="form.verification_route_bypass" on-text="绕行" off-text="绕行" on-color="#13ce66"></el-switch>
			<span v-if="form.verification_route_bypass">（禁止访问列表中的路由规则）</span>
			<span v-else>（只允许访问列表中的路由规则）</span>
		</el-form-item>
		<el-form-item label="验证路由列表">
			<el-select v-model="form.verification_route" style="width:100%" multiple filterable allow-create placeholder="请输入验证的路由规则">
				<el-option v-for="item in form.route" :key="item" :label="item" :value="item"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="验证API模式">
			<el-switch v-model="form.verification_api_bypass" on-text="绕行" off-text="绕行" on-color="#13ce66"></el-switch>
			<span v-if="form.verification_api_bypass">（禁止访问列表中的API）</span>
			<span v-else>（只允许访问列表中的API）</span>
		</el-form-item>
		<el-form-item label="验证API列表">
			<el-select v-model="form.verification_api" style="width:100%" multiple filterable allow-create placeholder="请输入验证的路由规则">
				<el-option v-for="item in form.api" :key="item" :label="item" :value="item"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="立刻生效">
			<el-switch v-model="form.effective" on-color="#13ce66"></el-switch>
			<span>（踢掉所有用户）</span>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onUpdate">修改</el-button>
			<el-button @click="onClose">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>

export default {
	name: 'GuestVerification',
	data () {
		return {
			isLoading: true,
			form: {
				'verification_route_bypass': true,
				'verification_route': [],
				'verification_api_bypass': false,
				'verification_api': [],
				'effective': false,
			}
		}
	},
	props: {
		data: { type: Object, required: true },
		config: { type: Object, required: true },
	},
	methods: {
		onUpdate () {
			this.isLoading = true;
			this.getData('core/guest/verification/set', this.form).then(res=>{
				this.isLoading = false;
				this.$message.success('更新成功');
				this.onClose();
			}, err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});
		},
		onClose () {
			this.$emit('close', 'GuestVerification');
		}
	},
	created () {
		this.getData('core/guest/verification').then(res=>{
			this.isLoading = false;
			Object.assign(this.form, res);
		}, err=>{
			this.isLoading = false;
			this.$message.warning(err.msg);
		});
	}
}
</script>

<style type="text/css" scoped>
	.guest-verification {
		margin: 15px;
	}
</style>
