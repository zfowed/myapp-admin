<template>
	<el-form class="routing-details" ref="form" :model="form" v-loading="isLoading" element-loading-text="拼命加载中" label-width="85px">
		<el-form-item label="方法">
			<el-select v-model="form.method" placeholder="请选择方法">
				<el-option label="GET" value="get"></el-option>
				<el-option label="POST" value="post"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="URL">
			<el-input v-model="form.uri" placeholder="请输入URI">
				<template slot="append">
					<el-button @click="openRegExp">查看RegExp</el-button>
				</template>
			</el-input>
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
	name: 'RoutingDetails',
	data () {
		return {
			isLoading: false,
			isAdd: true,
			form: {
				'id': null,
				'uri': '/',
				'method': 'get',
				'description': '新添加的路由',
				'controller_code': 'async function route (ctx, next) {\n\n	/**\n	 * 路由控制器\n	 * @param  {Object}        ctx                       上下文(参考koa官网)\n	 * @param  {Object}        ctx.params                路由uri的查询对象\n	 * @param  {Object}        ctx.query                 查询对象\n	 * @param  {Object}        ctx.request.body          POST传参body对象\n	 * @param  {AsyncFunction} ctx.request.getFormidable 解析 `multipart/form-data` 协议\n	 * @param  {Function}      ctx.getTool               获取工具方法\n	 * @param  {Function}      ctx.render                渲染模板问文件\n	 * @param  {Function}      next                      交给下一个路由\n	 */\n\n	/**\n	 * 解析 `multipart/form-data` 协议\n     *\n     * 只解析字段\n     * if (ctx.is(\'multipart/form-data\')) {\n     *     const { fields } = await ctx.request.getFormidable();\n     * }\n     *\n     * 解析字段并接收上传的文件\n     * if (ctx.is(\'multipart/form-data\')) {\n     *     const { fields, files } = await ctx.request.getFormidable(true);\n     * }\n	 */\n  \n	/**\n	 * 获取工具方法\n	 * const tool = ctx.getTool(\'testTool\');\n	 * await tool();\n	 */\n\n	/**\n	 * 渲染模板文件\n	 * ctx.state = { title: \'web title\' };\n	 * await ctx.render(\'index\');\n	 * await ctx.render(\'index.ejs\');\n	 * await ctx.render(\'index.pug\');\n	 */\n\n}',
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
		openRegExp () {
			this.$alert('尚未开发', '查看路由的RegExp（正则表达式）');
		},
		checkCode () {
			return this.getData('core/checkCode', { code: this.form.controller_code })
		},
		onAdd () {
			this.isLoading = true;
			this.checkCode().then(res=>{
				return this.getData('core/route/add', this.form);
			}).then(res=>{
				this.isLoading = false;
				this.$message.success('添加成功');
				this.$emit('emit', 'RoutingList', { event: 'refresh' });
				this.onClose();
			}).catch(err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			})
		},
		onUpdate () {
			this.isLoading = true;
			this.checkCode().then(res=>{
				return this.getData('core/route/update', this.form);
			}).then(res=>{
				this.isLoading = false;
				this.$message.success('更新成功');
				this.$emit('emit', 'RoutingList', { event: 'refresh' });
				this.onClose();
			}).catch(err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			})
		},
		onClose () {
			if (this.isAdd) {
				this.$emit('close', 'RoutingAdd');
			} else {
				this.$emit('close', 'RoutingDetails', this.form.id);
			}
		}
	},
	components: { codemirror: Codemirror },
	created () {
		if (this.data.id !== null) {
			this.isLoading = true;
			this.isAdd = false;

			this.getData('core/route/get', {id: this.data.id}).then(res=>{
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
	.routing-details {
		margin: 15px;
	}
</style>
