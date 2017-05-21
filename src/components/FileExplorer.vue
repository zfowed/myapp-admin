<template>
	<div v-loading="isLoading" element-loading-text="拼命加载中">
		<el-popover ref="uploadPopover" placement="bottom" v-model="uploadPopover" title="文件上传" width="400" trigger="click" >
			<el-upload ref="upload" drag :action="uploadAction" :data="uploadData" drag :show-file-list="true" multiple with-credentials :on-success="onUploadSuccess">
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip" slot="tip">不超过10mb</div>
			</el-upload>
		</el-popover>
		<div class="operating">
			<el-button type="primary" v-popover:uploadPopover>上传</el-button>
			<el-button @click="onMkdir">新建文件夹</el-button>
			<el-button-group v-show="selectFileLen > 0">
				<el-button @click.stop="onDownload" :disabled="selectFileLen!==1||!selectFile[0].isFile">下载</el-button>
				<el-button @click.stop="onDelete">删除</el-button>
				<el-button @click.stop="onRename" :disabled="selectFileLen!==1">重命名</el-button>
				<el-button @click.stop="onZipDecrypt" v-show="selectFileLen===1&&selectFile[0].extname==='.zip'">解压</el-button>
			</el-button-group>
			<el-button-group>
				<el-button @click.stop="onZipEncrypt" :disabled="selectFileLen<1">压缩</el-button>
				<el-button @click.stop="onCopy" :disabled="selectFileLen<1">复制</el-button>
				<el-button @click.stop="onCut" :disabled="selectFileLen<1">剪切</el-button>
				<el-button @click.stop="onPaste" :disabled="pasteData.method===null">粘贴</el-button>
				<el-button @click.stop="onEmptied" :disabled="pasteData.method===null">清空</el-button>
			</el-button-group>
			<el-button @click.stop="updateView">刷新</el-button>
		</div>
		<div class="breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item v-for="(item, index) in srcArr" :key="item.src">
					<span @click="onBreadcrumb(index)">{{item.text}}</span>
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container" :style="{height: (windowHeight-100)+'px'}">
			<div v-for="item in fileList" :class="['item', {'checkbox': item.isChecked}]" :key="item.resolve">
				<div class="large" :style="{'background-image': 'url('+item.large+')'}" @click="onOpen(item)">
				</div>
				<div class="name" @click="onOpen(item)">
					<span :title="item.basename">{{item.basename}}</span>
				</div>
				<div class="checkbox">
					<el-checkbox v-model="item.isChecked"></el-checkbox>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import path from 'path.js';
import getData from '../getdata';


export default {
	name: 'ViewsExplorer',
	data () {
		return {
			srcArr: [{
				src: '/',
				text: 'root',
			}],
			uploadAction: `${getData.url}${this.data.uploadApi}`,
			uploadPopover: false,
			isLoading: false,
			dirLarge: require('@/assets/file_large/folde.png'),
			fileLarge: require('@/assets/file_large/misc.png'),
			largeList: {
				'.txt': require('@/assets/file_large/text.png'),
				'.zip': require('@/assets/file_large/zip.png'),
			},
			pasteData: {
				method: null,
				text: null,
				list: [],
			},
			fileList: []
		}
	},
	props: {
		windowHeight: { type: Number, required: true },
		data: { type: Object, required: true },
	},
	filters: {
	},
	computed: {
		selectFile () {
			return this.fileList.filter(item=>item.isChecked);
		},
		selectFileLen () {
			return this.selectFile.length;
		},
		uploadData () {
			return {
				tool: this.data.uploadTool,
				src: this.src
			}
		},
		src () {
			const lastIndex = this.srcArr.length - 1;
			if (lastIndex <= 0) { return '/' }
			return this.srcArr[lastIndex].src;
		}
	},
	methods: {
		emit (method, data) {
			return this.getData(this.data.explorerApi, Object.assign({method}, data || {} ));
		},
		updateView (res) {
			this.isLoading = true;
			this.emit('readdir', { src: this.src }).then(res=>{
				const files = res.map(item=>{
					let file = {
						isChecked: false,
						large: '',
						resolve: item.resolve,
						size: item.size,
						dirname: item.dirname,
						basename: item.basename,
						extname: item.extname,
						isFile: item.isFile,
						isDirectory: item.isDirectory,
					};

					if (file.size < 100 * 1024 && (file.extname === '.jpg' || file.extname === '.png' || file.extname === '.gif')) {
						console.log(this.data.explorerApi)
						file.large = `${getData.url}${this.data.explorerApi}?method=download&src=${encodeURIComponent(file.resolve)}`;
					} else {
						file.large = this.large(item)
					}

					return file;
				})
				this.fileList.splice(0, this.fileList.length, ...files);
				this.isLoading = false;
			}, err=>{
				this.$message.warning(err.msg);
				this.isLoading = false;
			})
		},
		large (file) {
			let large = '';
			if (file.isDirectory) {
				large = this.dirLarge;
			} else if (!file.isFile || file.extname === '') {
				large = this.fileLarge;
			} else if (this.largeList[file.extname]) {
				large = this.largeList[file.extname];
			} else {
				large = this.fileLarge;
			}

			return large;
		},
		onUploadSuccess (res, file, fileList) {
			this.uploadPopover = false;
			this.$refs.upload.clearFiles();
			if (res.code !== 200) {
				return this.$message.warning(res.msg);
			}
			this.$message.success('上传成功');
			this.updateView();
		},
		onOpen (item) {
			if (item.isFile) {

			} else if (item.isDirectory) {
				this.srcArr.push({
					src: path.join(this.src, item.basename),
					text: item.basename
				});
				this.updateView();
			}
		},
		onBreadcrumb(index) {
			this.srcArr.splice(index+1, this.srcArr.length);
			this.updateView();
		},
		onZipEncrypt () {
			this.$prompt('请输入压缩包名称（不需要后缀，自动添加".zip"）', '压缩文件', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(value => {
				this.isLoading = true;
				this.emit('zipEncrypt', {
					path: this.src,
					srcList: this.selectFile.map(item=>item.basename),
					dest: value.value,
				}).then(res=>{
					this.$message.success('压缩成功');
					this.updateView();
				}, err=>{
					this.$message.warning(err.msg);
					this.isLoading = false;
				})
			}, err=>{});
		},
		onZipDecrypt () {
			this.isLoading = true;
			this.emit('zipDecrypt', {
				src: this.selectFile[0].resolve
			}).then(res=>{
				this.$message.success('已解压');
				this.updateView();
			}, err=>{
				this.$message.warning(err.msg);
				this.isLoading = false;
			})
		},
		onMkdir () {
			this.$prompt('请输入文件夹名称', '新建文件夹', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(value => {
				value = value.value;
				if (!value) { return this.$message.warning('文件夹名称不允许为空！'); }
				this.isLoading = true;
				this.emit('mkdir', {
					src: path.join(this.src, value)
				}).then(res=>{
					this.$message.success('添加成功');
					this.updateView();
				}, err=>{
					this.$message.warning(err.msg);
					this.isLoading = false;
				})
			}, err=>{});
		},
		onDownload () {
			window.open(`${getData.url}${this.data.explorerApi}?method=download&src=${encodeURIComponent(this.selectFile[0].resolve)}`);
		},
		onDelete () {
			this.isLoading = true;
			Promise.all(this.selectFile.map(item=>{
				return this.emit('remove', { src: item.resolve });
			})).then(res => {
				this.$message.success('删除成功');
				this.updateView();
			}, err => {
				this.$message.warning(err.msg);
				this.updateView();
			});
		},
		onRename () {
			this.$prompt('请输入新的名称', '重命名', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValue:  this.selectFile[0].basename
			}).then(value => {
				value = value.value;
				if (!value) { return this.$message.warning('重命名不允许为空！'); }
				const src = this.selectFile[0].resolve;
				const dest = path.join(this.selectFile[0].dirname, value);
				this.isLoading = true;
				this.emit('move', { src, dest }).then(res=>{
					this.$message.success('重命名成功');
					this.updateView();
				}, err=>{
					this.$message.warning(err.msg);
					this.isLoading = false;
				})
			}, err=>{});
		},
		onCopy () {
			this.pasteData.method = 'copy';
			this.pasteData.text = '复制';
			this.pasteData.list = this.selectFile;
		},
		onCut () {
			this.pasteData.method = 'move';
			this.pasteData.text = '移动'
			this.pasteData.list = this.selectFile;
		},
		onEmptied () {
			this.pasteData.method = null;
			this.pasteData.text = null;
			this.pasteData.list = [];
		},
		onPaste () {
			const method = this.pasteData.method;
			const text = this.pasteData.text;
			const list = this.pasteData.list;
			this.onEmptied();
			this.isLoading = true;

			Promise.all(list.map(item=>{
				const src = item.resolve;
				const dest = path.join(this.src, item.basename);
				return this.emit(method, { src, dest });
			})).then(res => {
				this.$message.success(`${text}成功`);
				this.updateView();
			}, err => {
				this.$message.warning(err.msg);
				this.updateView();
			});
		},
	},
	created () {
		this.updateView()
	}
}
</script>

<style type="text/css" scoped>
	.operating {
		margin: 15px;
	}
	.breadcrumb {
		margin: 15px;
	}

	.container {
		overflow: auto;
	}
	.container .item {
		float: left;
		width: 80px;
		height: 100px;
		border: 1px solid #fff;
		margin: 4px 0 0 6px;
		position: relative;
	}
	.container .item .large {
		width: 60px;
		height: 60px;
		margin: 9px auto 0;
		position: relative;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.container .item .name {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		margin: 6px 5px 5px;
		text-align: center;
	}
	.container .item .checkbox {
		position: absolute;
		left: 5px;
		top: 5px;
		display: none;
	}

	.container .item.checkbox {
		background-color: #f1f5fa;
		border: 1px solid #90c3fd;
		border-radius: 5px;
	}
	.container .item:hover {
		background: #f1f5fa;
		border: 1px solid #90c3fd;
	}
	.container .item:hover .checkbox,
	.container .item.checkbox .checkbox {
		display: block;
	}
</style>
