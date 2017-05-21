<template>
	<el-form class="tool-details" ref="form" :model="form" v-loading="isLoading" element-loading-text="拼命加载中" label-width="85px">
		<el-form-item label="标识">
			<el-input v-model="form.mark" placeholder="请输入API标识"></el-input>
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
	name: 'ToolDetails',
	data () {
		return {
			isLoading: false,
			isAdd: true,
			form: {
				'id': null,
				'mark': 'test/test',
				'description': '新添加的工具方法',
				'controller_code': 'async function tool () {\n\n	/**\n	 * 工具控制器\n	 * @param  {Function} this.getTool  获取工具方法\n	 * @param  {Function} this.getPath  返回从项目根目录开始的路径\n	 * @param  {Object}   this.store    集中状态管理，各个工具、路由、AIP数据的交换可以放在这个对象中\n	 * @param  {Object}   this.db       数据库\n	 */\n\n}',
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
				return this.getData('core/tool/add', this.form);
			}).then(res=>{
				this.isLoading = false;
				this.$message.success('添加成功');
				this.$emit('emit', 'ToolList', { event: 'refresh' });
				this.onClose();
			}).catch(err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			})
		},
		onUpdate () {
			this.isLoading = true;
			this.checkCode().then(res=>{
				return this.getData('core/tool/update', this.form);
			}).then(res=>{
				this.isLoading = false;
				this.$message.success('更新成功');
				this.$emit('emit', 'ToolList', { event: 'refresh' });
				this.onClose();
			}).catch(err=>{
				this.isLoading = false;
				this.$message.warning(err.msg);
			})
		},
		onClose () {
			if (this.isAdd) {
				this.$emit('close', 'ToolAdd');
			} else {
				this.$emit('close', 'ToolDetails', this.form.id);
			}
		}
	},
	components: { codemirror: Codemirror },
	created () {
		if (this.data.id !== null) {
			this.isLoading = true;
			this.isAdd = false;

			this.getData('core/tool/get', {id: this.data.id}).then(res=>{
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
	.tool-details {
		margin: 15px;
	}
</style>
