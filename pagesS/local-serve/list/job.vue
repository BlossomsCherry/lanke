<template>
	<view class="content">
		<!-- 顶部搜索框+地址 -->
		<view class="topFixedBox">
			<view class="add">
				<text>成都</text><u-icon name="arrow-down" size="12" top="1.5" color="#717171"></u-icon>
			</view>
			<view class="ipt">
				<u--input prefixIcon="search" prefixIconStyle="font-size: 18px;color: #909399" placeholder="你想住哪儿？"
					border="none" :customStyle="inputStyle" v-model="selValue" shape="circle" readonly
					@change="writeAddressValue"></u--input>
			</view>
		</view>
		<!-- 模块数据 -->
		<view class="topInfo">
			<u-scroll-list indicatorActiveColor="#ec613e">
				<view class="scroll-list">
					<view class="scroll-list__line" v-for="(item, index) in menuArr" :key="index">
						<view class="scroll-list__line__item" v-for="(item1, index1) in item" :key="index1"
							:class="[(index1 === item.length - 1) && 'scroll-list__line__item--no-margin-right']">
							<image class="scroll-list__line__item__image" :src="menuBaseUrl + item1.icon" mode="">
							</image>
							<text class="scroll-list__line__item__text">{{ item1.name }}</text>
						</view>
					</view>
				</view>
			</u-scroll-list>
		</view>
		<!-- 广告位 -->
		<view class="banner">
			<block v-for="(item,index) in bannerList" :key="index">
				<view class="item">
					<text class="title">{{item.title}}</text>
					<text class="tip">{{item.tip}}</text>
					<u-icon :name="item.icon"
						:color="index==0?'#fefae3':index==1?'#f5f8fe':index==2?'#fbfffd':index==3?'#fef9f1':'#fff'"
						size="40"></u-icon>
				</view>
			</block>
		</view>
		<!-- 占位 -->
		<view class="seatBox"></view>
		<!-- 需要吸顶的内容模块(筛选部分) -->
		<view class="tagTop" :class="{ 'topfixedActive': topfixed == 1 }">
			<view class="tab">
				<u-tabs :current="typeCurrent" @click="filterTabClick"
					:activeStyle="{color: '#ec613e', fontWeight: 'bold', transform: 'scale(1.05)'}"
					:inactiveStyle="{ color: '#606266', transform: 'scale(1)' }" lineColor="#ec613e" :list="tabList">
					<view slot="right" style="padding: 10rpx;box-sizing: border-box;">
						<!-- 	 -->
						<u-icon @click="maskShow=true" name="plus" size="21" bold></u-icon>
					</view>
				</u-tabs>
				<view class="sonTab" v-if="typeCurrent==0">
					<view class="sonLeft">
						<view :class="sonTypeCurrent==index?'sonItem active':'sonItem'" v-for="(item,index) in sonTabList"
							:key="index" @click="clickSonTab(item,index)">
							{{item.name}}
						</view>
					</view>
					<view class="sonRight" @click="checkFilter">
						<u-icon name="list-dot" size="18" bold></u-icon>
						<text style="margin: 0 4rpx;">筛选</text>
					</view>
				</view>
			</view>
			<view class="">

			</view>
		</view>
		<!-- 数据列表内容 -->
		<view class="wrap">
			<find-job-list></find-job-list>
		</view>
		<!-- 弹窗添加模块数据 -->
		<u-popup :show="maskShow" mode="top" :closeOnClickOverlay="true" @close="maskShow=false">
			<view class="scrollBox">
				<scroll-view class="scrollView" ref="provinceScrollView" scroll-y>
					<view v-for="(item, index) in provinceList" :key="index" class="option"
						:class="selectFirstValue === item.name?'selected':''" @click="activeFirstSelect(item)">
						{{ item.name||'' }}
					</view>
				</scroll-view>
				<scroll-view class="scrollView" ref="cityScrollView" scroll-y>
					<view v-for="(item, index) in cityList" :key="index"
						:class="selectSecondValue === item.name?'selectedSon option':'option'"
						@click="activeSecondSelect(item,index)">
						<text>{{ item.name||item.lineTitle }}</text>
						<u-icon name="checkbox-mark" size="20" :color="selectSecondValue==item.name?'#ec613e':'#fff'"></u-icon>
					</view>
				</scroll-view>
			</view>
			<view class="readyCheck">
				<view class="tip">
					已选({{checkJobTypeList.length}})
				</view>
				<view class="rc">
					<view class="item" v-for="(item,index) in checkJobTypeList" :key="index" @click="deleteCheckType(item,index)">
						<text>{{item.name}}</text>
						<u-icon name="close" size="14" color="#ec613e"></u-icon>
					</view>
				</view>
			</view>
			<view class="btnList">
				<u-button type="primary" :plain="true" color="#7a7a7a" iconColor="#fff" :customStyle="buttonStyle"
					throttleTime="1000" text="取消" @click="cancelCheck"></u-button>
				<u-button type="primary" color="#eb6540" :customStyle="buttonStyle" throttleTime="1000" text="确认"
					@click="confirmCheck"></u-button>
			</view>
		</u-popup>
	</view>
</template>
<script>
	import findJobList from '@/pagesS/components/find-job-list/find-job-list.vue';
	export default {
		components: {
			findJobList,
		},
		data() {
			return {
				topfixed: 0, // 是否需要吸顶
				typeCurrent: 0, // type类型
				sonTypeCurrent: 0, // 子类型
				inputStyle: {
					background: '#f8f8f8',
					height: '70rpx',
					paddingLeft: '24rpx'
				},
				buttonStyle: {
					width: 'auto',
					minWidth: '220rpx',
					height: '70rpx'
				},
				moduleList: [{
					icon: '../../static/find-job.png',
					name: '找工作'
				}, {
					icon: '../../static/find-house.png',
					name: '二手房'
				}, {
					icon: '../../static/renting.png',
					name: '租房'
				}, {
					icon: '../../static/service.png',
					name: '本地服务'
				}, {
					icon: '../../static/car.png',
					name: '二手车'
				}, {
					icon: '../../static/nearby.png',
					name: '附近工作'
				}, {
					icon: '../../static/fix.png',
					name: '维修服务'
				}, {
					icon: '../../static/shop.png',
					name: '商铺写字楼'
				}, {
					icon: '../../static/clean.png',
					name: '家庭保洁'
				}, {
					icon: '../../static/house.png',
					name: '新房'
				}, {
					icon: '../../static/find-nanny.png',
					name: '自助选保姆'
				}, {
					icon: '../../static/move-house.png',
					name: '放心搬家'
				}, {
					icon: '../../static/piping.png',
					name: '管道疏通'
				}, {
					icon: '../../static/nany.png',
					name: '保姆月嫂'
				}, {
					icon: '../../static/borrow.png',
					name: '58借钱'
				}],
				menuBaseUrl: 'https://cdn.uviewui.com/uview/menu/',
				menuArr: [
					[{
							name: '天猫新品',
							icon: '11.png'
						},
						{
							name: '今日爆款',
							icon: '9.png'
						}, {
							name: '天猫国际',
							icon: '17.png'
						}, {
							name: '饿了么',
							icon: '6.png'
						}, {
							name: '天猫超市',
							icon: '11.png'
						}, {
							name: '分类',
							icon: '2.png'
						}, {
							name: '天猫美食',
							icon: '3.png'
						}, {
							name: '阿里健康',
							icon: '12.png'
						}, {
							name: '口碑生活',
							icon: '7.png'
						}
					],
					[{
							name: '充值中心',
							icon: '8.png'
						},
						{
							name: '机票酒店',
							icon: '10.png'
						}, {
							name: '金币庄园',
							icon: '18.png'
						}, {
							name: '阿里拍卖',
							icon: '15.png'
						}, {
							name: '淘宝吃货',
							icon: '16.png'
						}, {
							name: '闲鱼',
							icon: '4.png'
						}, {
							name: '会员中心',
							icon: '6.png'
						}, {
							name: '造点新货',
							icon: '13.png'
						}, {
							name: '土货鲜食',
							icon: '14.png'
						}
					]
				],
				bannerList: [{
						title: '附近工作',
						tip: '一万内江牛肉面,',
						icon: 'calendar'
					},
					{
						title: '五险一金',
						tip: '吃完就上流水线!',
						icon: 'car'
					},
					{
						title: '暑假工',
						tip: '泪水打湿猪脚饭,',
						icon: 'gift'
					},
					{
						title: '包吃住',
						tip: '发誓要赚三千万!',
						icon: 'camera'
					},
				],
				tabList: [{
					name: '关注',
				}, {
					name: '推荐',
				}, {
					name: '电影'
				}, {
					name: '科技'
				}, {
					name: '音乐'
				}, {
					name: '美食'
				}, {
					name: '文化'
				}, {
					name: '财经'
				}, {
					name: '手工'
				}],
				sonTabList: [{
						name: '最新',
						id: '0'
					},
					{
						name: '最近',
						id: '1'
					},
				],
				maskShow: false, // 弹窗选择数据
				provinceList: [{
						name: '北京',
						value: '0'
					},
					{
						name: '天津',
						value: '1'
					},
					{
						name: '河北',
						value: '2'
					},
					{
						name: '山西',
						value: '3'
					},
					{
						name: '内蒙古',
						value: '4'
					},
					{
						name: '辽宁',
						value: '5'
					},
					{
						name: '吉林',
						value: '6'
					},
					{
						name: '黑龙江',
						value: '7'
					},
					{
						name: '上海',
						value: '8'
					},
					{
						name: '江苏',
						value: '9'
					},
					{
						name: '浙江',
						value: '10'
					},
					{
						name: '安徽',
						value: '11'
					},
					{
						name: '福建',
						value: '12'
					},
					{
						name: '江西',
						value: '13'
					},
					{
						name: '山东',
						value: '14'
					},
					{
						name: '河南',
						value: '15'
					},
					{
						name: '湖北',
						value: '16'
					},
					{
						name: '湖南',
						value: '17'
					},
					{
						name: '广东',
						value: '18'
					},
					{
						name: '广西',
						value: '19'
					},
					{
						name: '海南',
						value: '20'
					},
					{
						name: '重庆',
						value: '21'
					},
					{
						name: '四川',
						value: '22'
					},
					{
						name: '贵州',
						value: '23'
					},
					{
						name: '云南',
						value: '24'
					},
					{
						name: '西藏',
						value: '25'
					},
					{
						name: '陕西',
						value: '26'
					},
					{
						name: '甘肃',
						value: '27'
					},
					{
						name: '青海',
						value: '28'
					},
					{
						name: '宁夏',
						value: '29'
					},
					{
						name: '新疆',
						value: '30'
					},
					{
						name: '台湾',
						value: '31'
					},
					{
						name: '香港',
						value: '32'
					},
					{
						name: '澳门',
						value: '33'
					}
				],
				cityList: [], // 城市数据(根据所选的省份来确认)
				selectFirstValue: '', // 选中第一项(省份)
				selectSecondValue: '', // 选中第二项(城市)
				checkJobTypeList: []
			};
		},
		onReady() {},
		onLoad() {
			this.activeFirstSelect(this.provinceList[0]);
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

		},
		methods: {
			filterTabClick(e) {
				this.typeCurrent = e.index;
			},
			clickSonTab(e, i) {
				this.sonTypeCurrent = i;
			},
			checkFilter() {
				uni.navigateTo({
					url: '/pagesS/local-serve/detail/checkFilter'
				})
			},
			deleteCheckType(item, index) {
				this.checkJobTypeList.splice(index, 1)
			},
			/**
			 * @function 省份城市筛选条件展开 
			 */
			activeFirstSelect(item) {
				this.selectFirstValue = item.name;
				this.selectSecondValue = "";
				this.cityList = [];
				this.cityList = this.getCityList(item.name);
				this.activeSecondSelect(this.cityList[0], 0);
			},
			/**
			 * @function 切换和初始化激活第二列数据 
			 */
			activeSecondSelect(item, index) {
				let result = this.checkJobTypeList.some(val => val.name === item.name);
				if (result) {
					this.selectSecondValue = item.name;
				} else {
					this.checkJobTypeList.push(item);
					this.selectSecondValue = item.name;
				}
			},
			confirmCheck() {
				console.log(this.checkJobTypeList, '选择后的数据');
				this.maskShow = false;
			},
			cancelCheck() {
				this.checkJobTypeList = [];
				this.maskShow = false;
			},
			// 获取城市数据
			getCityList(pname) {
				let arr = [];
				for (let i = 0; i <= 14; i++) {
					arr = arr.concat({
						name: pname + i,
						value: pname + '-' + i
					})
				}
				return arr
			},
		}
	};
</script>
<style lang="scss" scoped>
	@import './job.scss';

	/deep/.u-popup__content {
		background: #fff !important;
	}
</style>