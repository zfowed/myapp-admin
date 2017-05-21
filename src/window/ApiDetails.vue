<template>
	<el-form class="api-details" ref="form" :model="form" v-loading="isLoading" element-loading-text="拼命加载中" label-width="85px">
		<el-form-item label="标识">
			<el-input v-model="form.mark" placeholder="请输入API标识"></el-input>
		</el-form-item>
		<el-form-item label="验证模式">
			<el-select v-model.number="form.verification" placeholder="请选择验证模式">
				<el-option label="所有用户" :value="0"></el-option>
				<el-option label="已登录的用户" :value="1"></el-option>
				<el-option label="超级管理员" :value="2"></el-option>
				<el-option label="角色权限管理" :value="3"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="文件上传">
			<el-switch v-model="form.multipart_file"></el-switch>
		</el-form-item>
		<el-form-item label="描述">
			<el-input v-model="form.description" type="textarea" :autosize="{minRows: 2}" placeholder="请输入描述">
			</el-input>
		</el-form-item>
		<el-form-item label="控制器代码">
			<div class="codemirror">
				<codemirror ref="myEditor" v-model="form.controller_code" ></codemirror>
			</div>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" v-if="isAdd" @click="onAdd">立即添加</el-button>
			<el-button type="primary" v-else @click="onUpdate">修改</el-button>
			<el-button @click="onClose">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>

const Codemirror = resolve => require(['@/components/CodemirrorJavaScript'], resolve)

export default {
	name: 'ApiDetails',
	data () {
		return {
			isLoading: false,
			isAdd: true,
			form: {
				'id': null,
				'mark': 'test/test',
				'verification': 3,
				'multipart_file': false,
				'description': '新添加的API',
				'controller_code': 'async function api (params, files, ctx, statusFun) {\n\n	/**\n	 * API控制器\n	 * @param  {Object}   params       请求的参数\n	 * @param  {Object}   files        上传的文件(multipart/form-data)\n	 * @param  {Object}   ctx          上下文(参考koa官网)\n	 * @param  {Function} ctx.getTool  获取工具方法\n	 * @param  {Function} statusFun    统一返回的数据(code,msg,data)\n	 * @return {Object}                返回API处理后的数据\n	 */\n\n	/**\n	 * 获取工具方法\n	 * const tool = ctx.getTool(\'testTool\');\n	 * await tool();\n	 */\n\n	/**\n	 * 返回处理后的数据\n	 *\n	 * return statusFun(200);\n	 * return statusFun(\'ok\');\n	 * return statusFun(200, \'ok\');\n	 * return statusFun(200, \'ok\', {});\n	 *\n	 * return { code: 200, msg: \'ok\', data: {} };\n	 */\n\n}',
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
		checkCode () {
			return this.getData('core/checkCode', { code: this.form.controller_code })
		},
		onAdd () {
			this.isLoading = true;
			this.checkCode().then(res=>{
				return this.getData('core/api/add', this.form);
			}).then(res=>{
				this.isLoading = false;
				this.$message.success('添加成功');
				this.$emit('emit', 'ApiList', { event: 'refresh' });
				this.onClose();
			}).catch(err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});
		},
		onUpdate () {
			this.isLoading = true;
			this.checkCode().then(res=>{
				return this.getData('core/api/update', this.form);
			}).then(res=>{
				this.isLoading = false;
				this.$message.success('更新成功');
				this.$emit('emit', 'ApiList', { event: 'refresh' });
				this.onClose();
			}).catch(err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			});
		},
		onClose () {
			if (this.isAdd) {
				this.$emit('close', 'ApiAdd');
			} else {
				this.$emit('close', 'ApiDetails', this.form.id);
			}
		}
	},
	components: { codemirror: Codemirror },
	created () {
		if (this.data.id !== null) {
			this.isLoading = true;
			this.isAdd = false;

			this.getData('core/api/get', {id: this.data.id}).then(res=>{
				this.isLoading = false;
				Object.assign(this.form, res);
			}, err=>{
				this.$message.warning(err.msg);
			});

		}
	}
}
</script>

<style type="text/css" scoped>
	.api-details {
		margin: 15px;
	}
</style>
