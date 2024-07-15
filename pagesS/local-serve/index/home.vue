<template>
	<view class="content">
		<xzj-firsthint :isCustom="true" />
		<u-navbar leftText="返回" title="个人中心" :safeAreaInsetTop="true">
			<view class="u-nav-slot-left" slot="left">
				<text>成都</text>
				<u-icon name="arrow-down" size="14"></u-icon>
			</view>
			<view class="u-nav-slot-center" :style="{width:searchBoxWidth+'px'}" slot="center">
				<u-notice-bar :text="notice" icon=' ' color="#eec099" fontSize="27" bgColor="transparent"
					direction="column"></u-notice-bar>
				<u-icon name="search" size="27"></u-icon>
			</view>
			<view class="u-nav-slot-right" slot="right">

			</view>
		</u-navbar>
		<!-- 顶部信息(notice/banner) -->
		<view class="topInfo" :style="{paddingTop:(statusBarHeight+navBarHeight)+'px'}">
			<!-- <view class="notice">
				点击添加到我的小程序，下次直接打开!更方便!
			</view> -->
			<!-- 功能模块展示 -->
			<view class="moduleList">
				<view class="item" v-for="(item,index) in moduleList" :key="index" @click="clickTopModule(item,index)">
					<image :src="item.icon" class="moduleImg" mode=""></image>
					<text class="moduleText">{{item.name}}</text>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="seatBox"></view>
		<!-- 需要吸顶的内容模块(筛选部分) -->
		<view class="tagTop" :class="{ 'topfixedActive': topfixed == 1 }"
			:style="{top:topfixed==1?(statusBarHeight+navBarHeight)+'px':'0px'}">

			<view class="tab">
				<u-tabs :current="typeFirstCurrent" :list="typeList" @click="typeClick"
					:activeStyle="{color: '#303133', fontWeight: 'bold', transform: 'scale(1.05)'}"
					:inactiveStyle="{ color: '#606266', transform: 'scale(1)' }"
					itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"></u-tabs>
				<!-- <u-tabs :current="typeFirstCurrent" :list="typeList" lineWidth="20" lineHeight="7" :lineColor="`url('/static/local-serve/tab-icon.png')100% 100%`" :activeStyle="{color: '#303133', fontWeight: 'bold', transform: 'scale(1.05)'}" :inactiveStyle="{ color: '#606266', transform: 'scale(1)' }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;" @click="typeClick"></u-tabs> -->
			</view>
			<view class="filter">
				<scroll-view class="filterTab" scroll-x="true" style="white-space: nowrap;">
					<block v-if="typeFirstCurrent=='0'">
						<view :class="jobTypeCurrent==index?'item activeJob':'item'" v-for="(item,index) in filterJobList"
							:key="index" @click="clickJobTypeTab(item,index)">
							<view>{{item.name}}</view>
						</view>
					</block>
					<block v-if="typeFirstCurrent=='1'">
						<view :class="homeTypeCurrent==index?'item activeHome':'item'" v-for="(item,index) in filterHomeList"
							:key="index" @click="clickHomeTypeTab(item,index)">
							<view>{{item.name}}</view>
						</view>
					</block>
					<block v-if="typeFirstCurrent=='2'">
						<view :class="serviceTypeCurrent==index?'item activeService':'item'"
							v-for="(item,index) in filterServiceList" :key="index" @click="clickServiceTypeTab(item,index)">
							<view>{{item.name}}</view>
						</view>
					</block>
				</scroll-view>
				<scroll-view class="filterTab" scroll-x="true" style="white-space: nowrap;margin-top: 20rpx;">
					<block v-if="typeFirstCurrent=='1'&&homeTypeCurrent=='0'">
						<view class="hireTabBox">
							<view :class="hireHomeTypeCurrent==index?'hireItem activeHireHome':'hireItem'"
								v-for="(item,index) in hireHomeList" :key="index" @click="clickHireHomeTypeTab(item,index)">
								<view>{{item.name}}</view>
							</view>
						</view>
					</block>
					<block v-if="typeFirstCurrent=='2'&&serviceTypeCurrent=='0'">
						<view class="serviceTabBox" v-if="serviceTypeCurrent=='0'">
							<view :class="selfServiceTypeCurrent==index?'serviceItem activeSelfService':'serviceItem'"
								v-for="(item,index) in selfServiceTypeList" :key="index" @click="clickSelfServiceTypeTab(item,index)">
								<view>{{item.name}}</view>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
		<!-- 数据列表内容 -->
		<view class="wrap">
			<block v-if="typeFirstCurrent=='0'">
				<job-list></job-list>
			</block>
			<block v-if="typeFirstCurrent=='1'">
				<home-list></home-list>
			</block>
			<block v-if="typeFirstCurrent=='2'&&serviceTypeCurrent=='0'">
				<self-list></self-list>
			</block>
			<block v-if="typeFirstCurrent=='2'&&serviceTypeCurrent!='0'">
				<other-service></other-service>
			</block>
		</view>
		<view style="position: fixed;right: 20px; bottom: 50px;width: 50px;height: 50px;" @tap.stop.prevent="toSliderUrl(6, '/pagesS/local-serve/push/push')">发布</view>
	</view>
</template>
<script>
	import xzjFirsthint from '@/pagesS/components/xzj-firsthint/xzj-firsthint.vue';
	import jobList from '@/pagesS/components/job-list/job-list.vue';
	import homeList from '@/pagesS/components/home-list/home-list.vue';
	import selfList from '@/pagesS/components/self-service/self-service.vue';
	import otherService from '@/pagesS/components/other-service/other-service.vue';
	const lineBg =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";
	export default {
		components: {
			xzjFirsthint,
			jobList,
			homeList,
			selfList,
			otherService
		},
		data() {
			return {
				statusBarHeight: 0, // 状态栏高度
				navBarHeight: 0, // 导航栏高度
				topfixed: 0, // 是否需要吸顶
				searchBoxWidth: 0, // 搜索框宽度
				notice: ['寒雨连江夜入吴', '平明送客楚山孤', '洛阳亲友如相问', '一片冰心在玉壶'],
				moduleList: [{
					icon: '@/pagesS/static/local-serve/find-job.png',
					name: '找工作'
				}, {
					icon: '@/pagesS/static/local-serve/find-house.png',
					name: '二手房'
				}, {
					icon: '@/pagesS/static/local-serve/renting.png',
					name: '租房'
				}, {
					icon: '@/pagesS/static/local-serve/service.png',
					name: '本地服务'
				}, {
					icon: '@/pagesS/static/local-serve/car.png',
					name: '二手车'
				}, {
					icon: '@/pagesS/static/local-serve/nearby.png',
					name: '附近工作'
				}, {
					icon: '@/pagesS/static/local-serve/fix.png',
					name: '维修服务'
				}, {
					icon: '@/pagesS/static/local-serve/shop.png',
					name: '商铺写字楼'
				}, {
					icon: '@/pagesS/static/local-serve/clean.png',
					name: '家庭保洁'
				}, {
					icon: '@/pagesS/static/local-serve/house.png',
					name: '新房'
				}, {
					icon: '@/pagesS/static/local-serve/find-nanny.png',
					name: '自助选保姆'
				}, {
					icon: '@/pagesS/static/local-serve/move-house.png',
					name: '放心搬家'
				}, {
					icon: '@/pagesS/static/local-serve/piping.png',
					name: '管道疏通'
				}, {
					icon: '@/pagesS/static/local-serve/nany.png',
					name: '保姆月嫂'
				}, {
					icon: '@/pagesS/static/local-serve/borrow.png',
					name: '58借钱'
				}],

				typeFirstCurrent: 0, // 大类分类索引
				typeList: [{
					name: '找工作'
				}, {
					name: '找房子'
				}, {
					name: '找服务'
				}],

				jobTypeCurrent: 0, // 选择工作类型索引
				filterJobList: [{
					name: '普工技工'
				}, {
					name: '司机交通'
				}, {
					name: '餐饮'
				}, {
					name: '销售'
				}, {
					name: '物流仓储'
				}, {
					name: '人事行政'
				}], // 工作类型数据

				homeTypeCurrent: 0, // 找房子索引
				filterHomeList: [{
					name: '租房'
				}, {
					name: '二手房'
				}, {
					name: '商铺写字楼'
				}],
				hireHomeTypeCurrent: 0, // 租房选择类型索引
				hireHomeList: [{
					name: '整租'
				}, {
					name: '合租'
				}], // 租房类型数据

				serviceTypeCurrent: 0, // 找服务索引
				filterServiceList: [{
					name: '官方自营'
				}, {
					name: '房屋维修'
				}, {
					name: '专业搬家'
				}, {
					name: '家电维修'
				}, {
					name: '金牌保姆'
				}, {
					name: '开锁修锁'
				}], // 找服务类型数据
				selfServiceTypeCurrent: 0, // 自营类型索引
				selfServiceTypeList: [{
					name: '清洗维修	'
				}, {
					name: '房屋维修'
				}, {
					name: '管道疏通'
				}, {
					name: '开锁换锁'
				}, {
					name: '数码维修'
				}], // 自营类型数据数组
			};
		},
		onReady() {
			// 获取手机系统信息(包括状态栏高度等等，但是info.capsuleHeight已经被废弃了 热烈的温 )
			const info = uni.getSystemInfoSync();
			this.statusBarHeight = info.statusBarHeight; // 状态栏高度
			this.searchBoxWidth = info.searchBoxWidth; // 视口宽度
			// 条件编译-以下仅作为微信小程序平台代码，其他平台代码是否有兼容我也不知道
			// #ifdef MP-WEIXIN
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect(); // 获取胶囊按钮部分高度，其实导航栏高度
			/**
			 * 显示模态弹窗
			 * @description navBarHeight 导航栏高度=胶囊按钮部分顶部到底部的距离减去-状态栏高度(电池电量信息等这个是状态栏高度)
			 */
			this.searchBoxWidth = menuButtonInfo.left - 80; // 胶囊按钮左边剩余部分，也就是搜索框所需要占用的宽度
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info
				.statusBarHeight)
			// #endif
		},
		onLoad() {

		},
		onPageScroll(res) {
			var _this = this;
			var temptop;
			const query = uni.createSelectorQuery();
			query.select('.seatBox').boundingClientRect();
			query.selectViewport().scrollOffset();
			query.exec(function(res) {
				res[0].top;
				res[1].scrollTop;
				temptop = res[0].top;
				if (temptop <= '2') {
					_this.topfixed = 1;
				} else {
					_this.topfixed = 0;
				}
			});
		},
		onShow() {
			uni.$on("handFilterInfo", res => {
				let {
					data
				} = res;
				if (data.welfareIdArr.length <= 0) {
					data.welfareIdArr.push('0')
				}
				console.log(data, '从B页面传递过来的数据')
				uni.$off("handFilterInfo");
			});
		},
		methods: {
			// 最顶部模块点击事件
			clickTopModule(item, index) {
				switch (item.name) {
					case '找工作':
						uni.navigateTo({
							url: '/pagesS/local-serve/detail/job'
						})
						break;
					case '租房':
						uni.navigateTo({
							url: '/pagesS/local-serve/detail/house'
						})
					default:
						break;
				}
			},
			// 点击最顶上tab选择大类
			typeClick(e) {
				this.typeFirstCurrent = e.index;
			},
			// 选择找工作类型
			clickJobTypeTab(e, index) {
				this.jobTypeCurrent = index;
			},
			// 选择找房子类型
			clickHomeTypeTab(e, index) {
				this.homeTypeCurrent = index;
			},
			// 选择租房类型
			clickHireHomeTypeTab(e, index) {
				this.hireHomeTypeCurrent = index;
			},
			// 选择找服务类型
			clickServiceTypeTab(e, index) {
				this.serviceTypeCurrent = index
			},
			// 选择自营服务类型
			clickSelfServiceTypeTab(e, index) {
				this.selfServiceTypeCurrent = index
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './home.scss';
</style>