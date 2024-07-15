export default {
	websocket: null,
	// #ifdef MP
	contrib: true,
	// #endif
	// #ifndef MP
	contrib: true,
	// #endif
	theme: 'default',
	scene: 0,
	$vm: null,
	scene_id: 0,
	pre_scene: 0, 
	pre_scene_id: 0, 
	scene_history: [],
	scene_total: 0,
	posting_url: '',
	toast: {},
	// 非小程序下有效
	tabbar_index: 0,
	tabbar_style: 2,
	platform: 'android',
	ipad: false,
	popup_total: 0,
	// #ifdef APP
	device: 'app',
	// #endif
	// #ifdef MP
	device: 'mp',
	// #endif
	// #ifdef H5
	device: 'h5',
	// #endif
	sysMessageCount: 0,
	hasRefreshData: false,
	Ipushlished: false,
	userUpdateTimes: 0,
	
	lastLocation: {
		longitude: 0,
		latitude: 0
	},
	lastCity: '',

	token: '',
	played: 0,
	form_user: 0,
	tenant: {tenant_id: null, name: '', short: ''},
	cid: 0,
	fullgreen: false,

	userInfo: {
		id: 0,
		user_name: '未登录用户',
		user_avatar: '',
		avatar_frame_url: '',
		user_introduce: '这个人很懒，还没有简介',
		user_background_maps: '',
		user_background_color: '63,47,45',
		phone: '',
		country_code: '86',
		real_name: '',
		wechat_account: '',
		university: '',
		paycode: '',
		coins: 0,
		lv: 1,
		is_authentication: false,
		is_member: false,
		is_official: false,
		is_played: false,
		gender: 0,
		age: '',
		user_labels: [],
		constellation: '',
		club_id: null,
		follow_count: 0,
		follow_user_count: 0,
		like_count: 0,
		longitude: 0,
		latitude: 0,
		setting: {
			privacy_message_me: 1,
			privacy_collected_post_show: 1,
			privacy_my_follow_show: 1,
			privacy_follow_me_show: 1,
			privacy_personal_recommend: 1,
			privacy_personal_ad: 1,
			privacy_personal_geo_title: 1,
			diy_scene_1_post_list_style: 1,
			diy_scene_6_post_list_style: 1,
			diy_scene_7_post_list_style: 1,
			diy_scene_8_post_list_style: 1,
		},
		leftPanel: [
			{
				icon: "mini-icon2 mini-wodeqianbao",
				target_id: "/pagesA/mine/earnings/earnings",
				target_type: 6,
				text: "我的钱包",
				type: 1,
			},
			{
				icon: "mini-icon2 mini-zhifumima",
				target_id: "/pagesA/mine/paycode/paycode?direct=0",
				target_type: 6,
				text: "支付密码",
				type: 1,
			},
			{
				icon: "mini-icon2 mini-xiaofeijilu",
				target_id: "/pagesA/mine/order/order",
				target_type: 6,
				text: "消费记录",
				type: 1,
			},
			{
				type: 0,
			},
			{
				icon: "mini-icon2 mini-wodedingdan",
				target_id: "/pagesA/shop/order/order",
				target_type: 6,
				text: "我的买入",
				type: 1,
			},
			{
				icon: "mini-icon2 mini-wodegouwudai",
				target_id: "/pagesA/shop/cart/cart",
				target_type: 6,
				text: "我的购物袋",
				type: 1,
			},
			{
				icon: "mini-icon2 mini-shouhuodizhi",
				target_id: "/pagesA/mine/address/address?id=0",
				target_type: 6,
				text: "收货地址",
				type: 1,
			},
			{
				type: 0,
			},
			{
				icon: "mini-icon2 mini-woderenzheng",
				target_id: "/pagesA/mine/certification/certification",
				target_type: 6,
				text: "我的认证",
				type: 1
			},
			{
				icon: "mini-icon2 mini-wodequanzi",
				target_id: "/pagesA/mine/circleaudit/circleaudit",
				target_type: 6,
				text: "我的圈子",
				type: 1,
			}
		],
		publish: [],
		timeStamp: 0
	},
	skeleton: {
		swiper:[
			'card-lg',
			10
		],
		rowPost: [
				'post-gap',
				-20,
				'circle+line-sm*2',
				'line',
				'card+card+card',
				'post-gap',
				-20,
				'circle+line-sm*2',
				'line',
				'card',
				'post-gap',
				-20,
				'line-sm*2',
		],
		hotCircleList: [
			'card+line*2',
			'line+line',
			20
		],
		topicTopTen: [
			-30,
			'line+line+line',
			-10,
			'line+line+line',
		],
		boxGoodsSelect: [
			'card',
			10,
			'card',
			10,
			'card'
		],
		waterfall:[
			'card-lg+card-lg',
			'line-sm+line-sm',
			-20,
			'card-lg+card-lg',
			'line-sm+line-sm',
			-20,
			'card-lg+card-lg',
			'line-sm+line-sm',
		],
		orderList:[
			10,
			'card-lg',
			10,
			'card-lg',
			10,
			'card-lg',
		],
		commentList: [
			10,
			'circle+line-sm*2',
			10,
			'circle+line-sm*2',
			10,
			'circle+line-sm*2',
			10,
			'circle+line-sm*2',
		]
	},
	h5_browser: 'wxclient',
	isRefresh: false,
	innerAudioContext: null,
	query_state_no: "",


	// 设备信息
	statusBarHeight: 0, // 状态栏高度，单位px
	screenLiHeight: 0, // 屏幕高度，单位px
	screenWidth: 0, // 屏幕宽度，单位px
	windowWidth: 0, // 窗口宽度，单位px
	CustomBar: 0, // 自定义导航栏高度，不包括状态栏，单位px
	capsulePosition: null, // 小程序的胶囊栏对象
	hostName: '', 
	hostVersion: '', // 宿主版本号
	SDKVersion: '', // 如微信的基础库版本
};
