


const Login = resolve => require(['@/window/Login.vue'], resolve)

const Routing = resolve => require(['@/window/Routing.vue'], resolve)
const RoutingDetails = resolve => require(['@/window/RoutingDetails.vue'], resolve)

const Api = resolve => require(['@/window/Api.vue'], resolve)
const ApiDetails = resolve => require(['@/window/ApiDetails.vue'], resolve)

const Tool = resolve => require(['@/window/Tool.vue'], resolve)
const ToolDetails = resolve => require(['@/window/ToolDetails.vue'], resolve)


const Role = resolve => require(['@/window/Role.vue'], resolve)
const RoleDetails = resolve => require(['@/window/RoleDetails.vue'], resolve)
const GuestVerification = resolve => require(['@/window/GuestVerification.vue'], resolve)

const User = resolve => require(['@/window/User.vue'], resolve)
const UserDetails = resolve => require(['@/window/UserDetails.vue'], resolve)
const SrootPassword = resolve => require(['@/window/SrootPassword.vue'], resolve)

const ViewsExplorer = resolve => require(['@/window/ViewsExplorer.vue'], resolve)
const PublicsExplorer = resolve => require(['@/window/PublicsExplorer.vue'], resolve)

const Readme = resolve => require(['@/window/Readme.vue'], resolve)





// import Login from '@/window/Login.vue'

// import Routing from '@/window/Routing.vue'
// import RoutingDetails from '@/window/RoutingDetails.vue'

// import Api from '@/window/Api.vue'
// import ApiDetails from '@/window/ApiDetails.vue'

// import Tool from '@/window/Tool.vue'
// import ToolDetails from '@/window/ToolDetails.vue'


// import Role from '@/window/Role.vue'
// import RoleDetails from '@/window/RoleDetails.vue'
// import GuestVerification from '@/window/GuestVerification.vue'

// import User from '@/window/User.vue'
// import UserDetails from '@/window/UserDetails.vue'
// import SrootPassword from '@/window/SrootPassword.vue'

// import ViewsExplorer from '@/window/ViewsExplorer.vue'
// import PublicsExplorer from '@/window/PublicsExplorer.vue'



export default {
	'Login': {
		only: true,
		component: Login,
		config: { title: '登录超级管理员', width: 400, height: 300 },
		data: { },
	},


	'ToolList': {
		only: true,
		component: Tool,
		config: { title: '工具方法列表', width: 800, height: 480 },
		data: { core: false, },
	},
	'ToolCore': {
		only: true,
		component: Tool,
		config: { title: '核心工具方法列表', width: 600, height: 480 },
		data: { core: true, },
	},
	'ToolAdd': {
		only: true,
		component: ToolDetails,
		config: { title: '添加工具方法', width: 640, height: 480 },
		data: { id: null },
	},
	'ToolDetails': {
		component: ToolDetails,
		config: { title: '工具方法详情 ID: ${id}', width: 640, height: 480 },
		data: { id: -1 },
	},


	'RoutingList': {
		only: true,
		component: Routing,
		config: { title: '路由列表', width: 800, height: 480 },
		data: { core: false, },
	},
	'RoutingCore': {
		only: true,
		component: Routing,
		config: { title: '核心路由列表', width: 600, height: 480 },
		data: { core: true, },
	},
	'RoutingAdd': {
		only: true,
		component: RoutingDetails,
		config: { title: '添加路由', width: 640, height: 480 },
		data: { id: null },
	},
	'RoutingDetails': {
		component: RoutingDetails,
		config: { title: '路由详情 ID: ${id}', width: 640, height: 480 },
		data: { id: -1 },
	},

	'ApiList': {
		only: true,
		component: Api,
		config: { title: 'API列表', width: 850, height: 480 },
		data: { core: false, },
	},
	'ApiCore': {
		only: true,
		component: Api,
		config: { title: '核心API列表', width: 700, height: 480 },
		data: { core: true, },
	},
	'ApiAdd': {
		only: true,
		component: ApiDetails,
		config: { title: '添加API', width: 600, height: 550 },
		data: { id: null },
	},
	'ApiDetails': {
		component: ApiDetails,
		config: { title: 'API详情 ID: ${id}', width: 600, height: 550 },
		data: { id: -1 },
	},


	'RoleList': {
		only: true,
		component: Role,
		config: { title: '角色列表', width: 600, height: 550 },
		data: {},
	},
	'RoleAdd': {
		only: true,
		component: RoleDetails,
		config: { title: '添加角色', width: 450, height: 480 },
		data: { id: null },
	},
	'RoleDetails': {
		component: RoleDetails,
		config: { title: '角色详情 ID: ${id}', width: 450, height: 480 },
		data: { id: -1 },
	},

	'GuestVerification': {
		only: true,
		component: GuestVerification,
		config: { title: '来宾用户权限', width: 450, height: 400 },
		data: {},
	},

	'UserList': {
		only: true,
		component: User,
		config: { title: '用户列表', width: 700, height: 550 },
		data: {},
	},
	'UserAdd': {
		only: true,
		component: UserDetails,
		config: { title: '添加用户', width: 400, height: 370 },
		data: { id: null },
	},
	'UserDetails': {
		component: UserDetails,
		config: { title: '用户详情 ID: ${id}', width: 400, height: 370 },
		data: { id: -1 },
	},

	'SrootPassword': {
		only: true,
		component: SrootPassword,
		config: { title: '修改超级管理员密码', width: 400, height: 300 },
		data: {},
	},


	'ViewsExplorer': {
		only: true,
		component: ViewsExplorer,
		config: { title: '视图文件管理', width: 830, height: 480 },
		data: { },
	},

	'PublicsExplorer': {
		only: true,
		component: PublicsExplorer,
		config: { title: '静态文件管理', width: 830, height: 480 },
		data: { },
	},

	'Readme': {
		component: Readme,
		config: { title: '帮助文档 ${typeText} ${mark}', width: 830, height: 480 },
		data: { typeText: '', mark: '' },
	},

}