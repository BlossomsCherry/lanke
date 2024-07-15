<template>
	<view class="content">
		<view class="topInfo">
			<u--input placeholder="你想住哪儿？" border="none" :customStyle="inputStyle" v-model="selValue" shape="circle" readonly
				@change="writeAddressValue"></u--input>
			<view class="moduleList">
				<view class="item" v-for="(item,index) in moduleList" :key="index">
					<image :src="item.icon" class="moduleImg" mode=""></image>
					<text class="moduleText">{{item.name}}</text>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="seatBox"></view>
		<!-- 需要吸顶的内容模块(筛选部分) -->
		<view class="tagTop" :class="{ 'topfixedActive': topfixed == 1 }">
			<view class="filterTab">
				<view :class="typeCurrent==index?'active item':'item'" v-for="(item,index) in filterTabList" :key="index"
					@click="typeTabClick(item,index)">
					{{item.name}}
					<u-icon :name="typeCurrent==index?'arrow-up':'arrow-down'" size="12" top="1.5"
						:color="typeCurrent==index?'#ec613e':'#717171'"></u-icon>
				</view>
			</view>
		</view>
		<!-- 数据列表内容 -->
		<view class="wrap">
			<rent-list></rent-list>
		</view>
		<!-- 页面弹出层 -->
		<view class="directTV" @click="goToVideo">
			<u-icon name="twitter" color="#ea4572" size="14"></u-icon>
			<text class="jdText" style="margin-left: 4rpx;">附近2套房源正在直播中...</text>
		</view>
		<!-- 弹窗数据 -->
		<u-popup :show="maskShow" mode="top" :safeAreaInsetBottom="false" :closeOnClickOverlay="true" @close="closeMask">
			<view class="tagTop" style="border-bottom: 5rpx solid #f7f7f7;">
				<view class="filterTab">
					<view :class="typeCurrent==index?'active item':'item'" v-for="(item,index) in filterTabList" :key="index"
						@click="typeTabClick(item,index)">
						{{item.name}}
						<u-icon :name="typeCurrent==index?'arrow-up':'arrow-down'" size="12" top="1.5"
							:color="typeCurrent==index?'#ec613e':'#717171'"></u-icon>
					</view>
				</view>
			</view>
			<block v-if="typeCurrent==0">
				<view class="scrollBox">
					<scroll-view class="scrollView" ref="firstScrollView" scroll-y>
						<view v-for="(item, index) in firstList" :key="index" class="option"
							:class="selectFirstValue === item.name?'selected':''" @click="activeFirstSelect(item)">
							{{ item.name||'' }}
						</view>
					</scroll-view>
					<scroll-view class="scrollView" ref="secondScrollView" scroll-y>
						<view v-for="(item, index) in secondList" :key="index"
							:class="selectSecondValue === item.name?'selected option':'option'"
							@click="activeSecondSelect(item,index)">
							<text>{{ item.name||item.lineTitle }}</text>
							<!-- <u-icon name="checkbox-mark" size="20"
								:color="selectSecondValue==item.name?'#ec613e':'#fff'"></u-icon> -->
						</view>
					</scroll-view>
					<scroll-view class="scrollView" ref="thirdScrollView" scroll-y>
						<view v-for="(item, index) in thirdList" :key="index"
							:class="selectThirdValue === item.name?'selectedSon option':'option'"
							@click="activeThirdSelect(item,index)">
							<text>{{ item.name||item.lineTitle }}</text>
							<u-icon name="checkbox-mark" size="20" :color="selectThirdValue==item.name?'#ec613e':'#fff'"></u-icon>
						</view>
					</scroll-view>
				</view>
			</block>
			<block v-if="typeCurrent==1">
				<view class="priceBox">
					<view :class="priceCurrent==index?'item active':'item'" v-for="(item,index) in priceList" :key="index"
						@click="checkPrice(item,index)">
						{{item.name}}
					</view>
				</view>
				<view class="cj-slider">
					<view class="cj-slide__text">{{`￥(${priceValueInterval[0]}) - (${priceValueInterval[1]})元`}}</view>
					<cj-slider v-model="priceValueInterval" :min="0" :max="15000" :step="100" :blockWidth="40" @start="blockStart"
						@moving="blockMoving" @end="blockEnd" />
				</view>
			</block>
			<block v-if="typeCurrent==2">
				<view class="fileBox" style="height: auto;">
					<view class="title">
						租房类型
					</view>
					<view class="box">
						<view :class="rentTypeCurrent==index?'item active':'item'" v-for="(item,index) in rentTypeList"
							@click="checkRentType(item,index)">
							{{item.name}}
						</view>
					</view>
					<view class="title">
						户型
					</view>
					<view class="box">
						<view :class="rentHouseTypeCurrent==index?'item active':'item'" v-for="(item,index) in rentHouseTypeList"
							@click="checkRentHouseType(item,index)">
							{{item.name}}
						</view>
					</view>
				</view>
			</block>
			<block v-if="typeCurrent==3">
				<view class="fileBox">
					<view class="title">
						验真情况
					</view>
					<view class="box">
						<view :class="verificationCurrent==index?'item active':'item'" v-for="(item,index) in verificationList"
							@click="checkverification(item,index)">
							{{item.name}}
						</view>
					</view>
					<view class="title">
						房屋来源
					</view>
					<view class="box">
						<view :class="houseSourceCurrent==index?'item active':'item'" v-for="(item,index) in houseSourceList"
							@click="checkHouseSource(item,index)">
							{{item.name}}
						</view>
					</view>
					<view class="title">
						朝向
					</view>
					<view class="box">
						<view class="item" :class="{ 'active': isSelectedToward(item.id) }" v-for="(item,index) in towardTypeList"
							@click="checkTowardType(item.id)">
							{{item.name}}
						</view>
					</view>
					<view class="title">
						住房条件
					</view>
					<view class="box">
						<view :class="houseConditionCurrent==index?'item active':'item'" v-for="(item,index) in houseConditionList"
							@click="checkHouseCondition(item,index)">
							{{item.name}}
						</view>
					</view>
					<view class="title">
						省心租
					</view>
					<view class="box">
						<view class="item" :class="{ 'active': isSelectedSaveWarry(item.id) }" v-for="(item,index) in saveWarryList"
							@click="checkSaveWarryCheckList(item.id)">
							{{item.name}}
						</view>
					</view>
				</view>
			</block>
			<view class="btnList" v-if="typeCurrent==0||typeCurrent==1">
				<u-button type="primary" shape="circle" color="#eb6540" :customStyle="buttonStyle" throttleTime="1000" text="确认"
					@click="confirmCheck"></u-button>
			</view>
			<view class="btnList" v-else>
				<u-button shape="circle" color="#9d9d9d" fontColor="#333" :customStyle="buttonStyle" throttleTime="1000"
					text="重置" @click="resetClick"></u-button>
				<u-button type="primary" shape="circle" color="#eb6540" :customStyle="buttonStyle" throttleTime="1000" text="确认"
					@click="confirmCheckB"></u-button>
			</view>
		</u-popup>
	</view>
</template>
<script>
	import rentList from '@/pagesS/components/rent-list/rent-list.vue';
	import cjSlider from '@/pagesS/components/cj-slider/cj-slider.vue'
	export default {
		components: {
			rentList,
			cjSlider
		},
		data() {
			return {
				topfixed: 0, // 是否需要吸顶
				selValue: '', // 输入框
				inputStyle: {
					background: '#f8f8f8',
					height: '70rpx',
					paddingLeft: '24rpx'
				},
				moduleList: [{
					icon: '@/pagesS//static/local-serve/find-job.png',
					name: '找工作'
				}, {
					icon: '@/pagesS//static/local-serve/find-house.png',
					name: '二手房'
				}, {
					icon: '@/pagesS//static/local-serve/renting.png',
					name: '租房'
				}, {
					icon: '@/pagesS//static/local-serve/service.png',
					name: '本地服务'
				}, {
					icon: '@/pagesS//static/local-serve/car.png',
					name: '二手车'
				}, {
					icon: '@/pagesS//static/local-serve/nearby.png',
					name: '附近工作'
				}],
				filterTabList: [{
					name: '区域',
					id: '0'
				}, {
					name: '租金',
					id: '1'
				}, {
					name: '户型',
					id: '2'
				}, {
					name: '筛选',
					id: '3'
				}],
				typeCurrent: null, // 顶部四个current切换
				maskShow: false, // 弹窗选择数据
				buttonStyle: {
					width: '100%',
					height: '70rpx',
					margin: '0 30rpx'
				},
				firstList: [{
						name: '附近',
						id: '0'
					},
					{
						name: '区域',
						id: '1'
					},
					{
						name: '地铁',
						id: '2'
					}
				],
				secondList: [], // 第二列数据数据
				thirdList: [], // 第三列数据
				selectFirstValue: '', // 选中第一项
				selectSecondValue: '', // 选中第二项
				selectThirdValue: '', // 选中第三项

				//--------价格
				priceCurrent: null, // 价格初始化选择
				priceValueInterval: [2000, 5000], // 可以指定价格区间
				priceList: [{
					name: '不限',
					id: '0'
				}, {
					name: '≤2000元',
					id: '1'
				}, {
					name: '2000-3000元',
					id: '2'
				}, {
					name: '3000-5000元',
					id: '3'
				}, {
					name: '5000-8000元',
					id: '4'
				}, {
					name: '≥8000元',
					id: '5'
				}],

				//--------户型
				// 租房类型
				rentTypeCurrent: 0, // 租房类型初始化选择
				rentTypeList: [{
					name: '不限',
					id: '0'
				}, {
					name: '整租',
					id: '1'
				}, {
					name: '合租',
					id: '2'
				}],
				// 户型
				rentHouseTypeCurrent: 0, // 户型选择初始化
				rentHouseTypeList: [{
					name: '不限',
					id: '0'
				}, {
					name: '1室',
					id: '1'
				}, {
					name: '2室',
					id: '2'
				}, {
					name: '3室',
					id: '3'
				}, {
					name: '3室+',
					id: '4'
				}],

				//-------筛选
				// 验真情况
				verificationCurrent: 0, // 验真情况初始化选择
				verificationList: [{
					name: '不限',
					id: '0'
				}, {
					name: '安选',
					id: '1'
				}, {
					name: '核验真房',
					id: '2'
				}],
				// 房屋来源
				houseSourceCurrent: 0, // 房屋来源初始化选择
				houseSourceList: [{
					name: '不限',
					id: '0'
				}, {
					name: '个人',
					id: '1'
				}, {
					name: '经纪人',
					id: '2'
				}],
				// 朝向
				towardTypeList: [{
					name: '东',
					id: '0'
				}, {
					name: '西',
					id: '1'
				}, {
					name: '南',
					id: '2'
				}, {
					name: '北',
					id: '3'
				}, {
					name: '南北',
					id: '4'
				}],
				towardTypeCheckList: [], // 已经选择的朝向数组数据
				// 住房条件
				houseConditionCurrent: 0,
				houseConditionList: [{
					name: '独立单间',
					id: '0'
				}, {
					name: '邻地铁',
					id: '1'
				}, {
					name: '押一付一',
					id: '2'
				}, {
					name: '配套齐全',
					id: '3'
				}, {
					name: '可短租',
					id: '4'
				}, {
					name: '女生合租',
					id: '5'
				}, {
					name: '男生合租',
					id: '6'
				}, {
					name: '有独立卫生间',
					id: '7'
				}, {
					name: '独立阳台',
					id: '8'
				}, {
					name: 'VR看房',
					id: '9'
				}],
				// 省心租
				saveWarryList: [{
					name: '省心租I',
					id: '0'
				}, {
					name: '省心租II',
					id: '1'
				}, {
					name: '省心租III',
					id: '2'
				}, {
					name: '完成保洁',
					id: '3'
				}],
				saveWarryCheckList: [], // 选择的省心租
			};
		},
		onReady() {},
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

		},
		methods: {
			// 输入框
			writeAddressValue(e) {
				this.selValue = e.detail.value;
			},
			// 直播
			goToVideo() {

			},
			typeTabClick(item, index) {
				if (this.typeCurrent == index) {
					this.typeCurrent = null
				} else {
					this.typeCurrent = index;
					this.maskShow = true;
					this.activeFirstSelect(this.firstList[0], 0)
				}
			},
			/**
			 * @function 选择第一项的时候
			 */
			activeFirstSelect(item) {
				this.selectFirstValue = item.name;
				this.selectSecondValue = "";
				this.secondList = [];
				this.secondList = this.getCityList(item);
				this.activeSecondSelect(this.secondList[0], 0);
			},
			/**
			 * @function 切换和初始化激活第二列数据 
			 */
			activeSecondSelect(item, index) {
				this.selectSecondValue = item.name;
				this.selectThirdValue = "";
				this.thirdList = [];
				this.thirdList = this.getCityList(item);
				this.activeThirdSelect(this.thirdList[0], 0);
			},
			/**
			 * @function 切换和初始化激活第三列数据 
			 */
			activeThirdSelect(item, index) {
				this.selectThirdValue = item.name
			},
			/**
			 * @function 选择租房价格-区间
			 */
			checkPrice(item, index) {
				this.priceCurrent = index;
				this.$set(this.filterTabList[1], 'name', item.name)
			},
			blockStart() {
				// console.log('滑动触发')
			},
			blockMoving() {
				// console.log('正在滑动中')
			},
			blockEnd() {
				// console.log('滑动结束')
			},
			/**
			 * @function 选择租房类型 
			 */
			checkRentType(item, index) {
				this.rentTypeCurrent = index;
				if (this.rentTypeCurrent == 2) {
					this.rentHouseTypeList = [{
						name: '不限',
						id: '0'
					}, {
						name: '主卧',
						id: '1'
					}, {
						name: '次卧',
						id: '2'
					}]
				} else {
					this.rentHouseTypeList = [{
						name: '不限',
						id: '0'
					}, {
						name: '1室',
						id: '1'
					}, {
						name: '2室',
						id: '2'
					}, {
						name: '3室',
						id: '3'
					}, {
						name: '3室+',
						id: '4'
					}]
				}
			},
			/**
			 * @function 选择租房户型 
			 */
			checkRentHouseType(item, index) {
				this.rentHouseTypeCurrent = index;
			},
			/**
			 * @function 选择筛选-验真情况户型 
			 */
			checkverification(item, index) {
				this.verificationCurrent = index;
			},
			/**
			 * @function 选择筛选-房屋来源
			 */
			checkHouseSource(item, index) {
				this.houseSourceCurrent = index;
			},
			/**
			 * @function 选择筛选-朝向-是否激活-多选
			 */
			isSelectedToward(id) {
				return this.towardTypeCheckList.includes(id);
			},
			/**
			 * @function 选择筛选-朝向
			 */
			checkTowardType(id) {
				const index = this.towardTypeCheckList.indexOf(id);
				if (index === -1) {
					this.towardTypeCheckList.push(id); // 添加到已选中的列表
				} else {
					this.towardTypeCheckList.splice(index, 1); // 从已选中的列表中移除
				}
			},
			/**
			 * @function 选择筛选-住房条件
			 */
			checkHouseCondition(item, index) {
				this.houseConditionCurrent = index;
			},
			/**
			 * @function 选择筛选-省心租-是否激活-多选
			 */
			isSelectedSaveWarry(id) {
				return this.saveWarryCheckList.includes(id);
			},
			/**
			 * @function 选择筛选-省心租
			 */
			checkSaveWarryCheckList(id) {
				const index = this.saveWarryCheckList.indexOf(id);
				if (index === -1) {
					this.saveWarryCheckList.push(id); // 添加到已选中的列表
				} else {
					this.saveWarryCheckList.splice(index, 1); // 从已选中的列表中移除
				}
			},
			/**
			 * @function 确认筛选的条件 
			 */
			confirmCheck() {
				this.maskShow = false;
				this.typeCurrent = null;
				// 操作筛选条件
			},
			// 重置
			resetClick() {
				if (this.typeCurrent == 2) {
					this.rentTypeCurrent = 0;
					this.rentHouseTypeCurrent = 0;
				} else if (this.typeCurrent == 3) {
					this.verificationCurrent = 0;
					this.houseSourceCurrent = 0;
					this.towardTypeCheckList = []
					this.houseConditionCurrent = 0;
					this.saveWarryCheckList = []
				}
			},
			// 选择确认
			confirmCheckB() {
				this.maskShow = false;
				this.typeCurrent = null;
			},
			/**
			 * @function 关闭筛选数据 
			 */
			closeMask() {
				this.maskShow = false;
				this.typeCurrent = null;
			},
			// 获取第二列数据
			getCityList(item) {
				let arr = [];
				for (let i = 0; i <= 14; i++) {
					arr = arr.concat({
						name: item.name + '-' + i,
						id: item.id + '-' + i
					})
				}
				arr.unshift({
					name: '不限',
					id: 'N/A'
				})
				return arr
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import './house.scss';

	/deep/.u-popup__content {
		background: #fff !important;
	}
</style>