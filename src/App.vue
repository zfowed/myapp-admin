<template>
	<div id="app" v-loading.fullscreen.lock="fullscreenLoading" :element-loading-text="fullscreenLoadingText">
		<el-menu v-if="isLogin" theme="dark" class="nav" mode="horizontal" @select="handleSelect">
			<el-menu-item index="">MyApp</el-menu-item>
			<el-submenu index="Routing">
				<template slot="title">路由</template>
				<el-menu-item index="RoutingAdd">添加路由</el-menu-item>
				<el-menu-item index="RoutingList">路由列表</el-menu-item>
				<el-menu-item index="RoutingCore">核心路由列表</el-menu-item>
			</el-submenu>
			<el-submenu index="Api">
				<template slot="title">API</template>
				<el-menu-item index="ApiAdd">添加API</el-menu-item>
				<el-menu-item index="ApiList">API列表</el-menu-item>
				<el-menu-item index="ApiCore">核心API列表</el-menu-item>
			</el-submenu>
			<el-submenu index="Tool">
				<template slot="title">工具</template>
				<el-menu-item index="ToolAdd">添加工具方法</el-menu-item>
				<el-menu-item index="ToolList">工具方法列表</el-menu-item>
				<el-menu-item index="ToolCore">核心工具方法列表</el-menu-item>
			</el-submenu>
			<el-submenu index="Role">
				<template slot="title">角色</template>
				<el-menu-item index="RoleAdd">添加角色</el-menu-item>
				<el-menu-item index="RoleList">角色列表</el-menu-item>
				<el-menu-item index="GuestVerification">修改来宾用户权限</el-menu-item>
			</el-submenu>
			<el-submenu index="User">
				<template slot="title">用户</template>
				<el-menu-item index="UserAdd">添加用户</el-menu-item>
				<el-menu-item index="UserList">用户列表</el-menu-item>
				<el-menu-item index="SrootPassword">修改超级管理员密码</el-menu-item>
			</el-submenu>
			<el-submenu index="File">
				<template slot="title">文件管理</template>
				<el-menu-item index="ViewsExplorer">视图文件</el-menu-item>
				<el-menu-item index="PublicsExplorer">静态文件</el-menu-item>
			</el-submenu>
			<el-menu-item index="Logout">注销</el-menu-item>
		</el-menu>
		<window-components :list="windowList" ref="windowComponents"></window-components>
		<div class="taskbar">
			<el-tag v-for="task in tasks" :key="task.name" :closable="true" :type="task.type" @close="onClose(task.is, task.mark)">
				<span @click="onOpen(task.is, task.mark, task.windowItem)">{{task.name}}</span>
			</el-tag>
		</div>
	</div>
</template>

<script>


import { Message } from 'element-ui';
import WindowComponents from '@/components/WindowComponents.vue'


export default {
	name: 'app',
	data () {
		return {
			fullscreenLoading: true,
			fullscreenLoadingText: '',
			isLogin: false,
			windowList: [],
		}
	},
	computed: {
		tasks () {
			return this.windowList.map(item=>{
				return {
					name: (item.config.other && item.config.other.title) || '',
					is: item.config.is,
					mark: item.config.mark,
					type: item.config.focus ? 'gray' : '',
					windowItem: item
				};
			});
		}
	},
	components: {
		"window-components": WindowComponents,
	},
	methods: {
		handleSelect (key, keyPath) {
			if (key === '') { return ; }

			if (key === 'Logout') { this.onLogout(); }

			this.$refs.windowComponents.onOpen(key);
		},
		openLogin () {
			this.$refs.windowComponents.onOpen('Login', {
				success: () => {
					this.isLogin = true;
				}
			});
		},
		onLogout () {
			this.fullscreenLoading = true;
			this.fullscreenLoadingText = '注销身份中...';

			this.getData('core/logout').then(res=>{
				this.fullscreenLoading = false;
				Message.success('注销成功');
				location.reload();
			}, err=>{
				this.fullscreenLoading = false;
				Message.warning(err.msg);
			});
		},
		onOpen (is, mark, windowItem) {
			if (windowItem.config.currentStatus !== 'hide' && windowItem.config.focus) {
				windowItem.config.currentStatus = 'hide';
			} else {
				this.$refs.windowComponents.onOpen(is, mark);
			}
		},
		onClose (is, mark) {
			this.$refs.windowComponents.onClose(is, mark);
		}
	},
	mounted () {
		this.fullscreenLoading = true;
		this.fullscreenLoadingText = '验证身份中...';
		this.getData('core/user/identity').then(res=>{
			if (res.role !== 'Sroots') {
				this.openLogin();
			} else {
				this.isLogin = true;
			}
			this.fullscreenLoading = false;
		}, err=>{
			this.openLogin();
			this.fullscreenLoading = false;
		});
	}
}
</script>

<style>
	#app{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-image: url("http://img.infinitynewtab.com/wallpaper/2992.jpg");
		background-size: cover;
		background-attachment: fixed;
		-webkit-transform: translate(0);
		-webkit-transition: all ease .3s;
		overflow: hidden;
	}
	#app > .nav {
		position: absolute;
		left: 15px;
		right: 15px;
		top: 15px;
		margin: 0 auto;
		z-index: 5;
		box-shadow: 0 0 5px #222;
	}
	#app > .nav:hover {
		z-index: 1000000;
		box-shadow: 0 0 10px #222;
	}
	#app > .nav.el-menu--horizontal .el-submenu > .el-menu {
		top: 55px;
	}
	#app > .taskbar {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 25px;
		padding: 5px;
		background-color: rgba(0, 0, 0, 0.5);
		box-shadow: 0 0 5px #222;
		overflow: hidden;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	#app > .taskbar:hover {
		z-index: 1000000;
	}
	#app > .taskbar > .el-tag{
		margin-right: 5px;
		margin-bottom: 10px;
		cursor: pointer;
	}
</style>
