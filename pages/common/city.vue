<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="false" :scene="156" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			<view slot="center" class="center-search">
				<u-search v-model="inputValue" :animation="true" :showAction="false" :bgColor="global__theme__ == 'black' ? '#242328' : '#f3f3f3'"></u-search>
			</view>
		</navBar>
		<view class="chose-city" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
			<!-- 城市搜索 -->
			<view class="city-search-wrap">
				<!-- 搜索列表  -->
				<view class="reach-content" v-show="inputValue">
					<block v-show="searchData.length">
						<view class="li" v-for="item in searchData" :key="item.citycode" @click="selectCity(item)">
							{{item.name}}
						</view>
					</block>
					<view class="has-no-data" v-show="hasNoData">没有找到匹配数据~</view>
				</view>
			</view>
			<!-- 城市列表 -->
			<scroll-view class="scroll-view" scroll-y scroll-with-animation="true" enable-back-to-top="true" :scroll-into-view="toIndex"
			 @scroll="scrollHandle" v-if="!inputValue">
				<view class="block">
					<!-- 您所在的地区 -->
					<view class="area list-item" id="area">
						<view class="title-wrapp">
							<view class="c-title">
								<text class="l">您所在的地区</text>
							</view>
						</view>
						<view class="ul">
							<view class="li now font-clamp" v-if="!hasLocation && myCityObj.name && myCityObj.name.length > 0">
								<text class="text">{{ myCityObj.name }}</text>
							</view>
							<view class="li now font-clamp" @click="selectCity(myCityObj,'refresh')">
								 <i class="icon primay-color mini-icon mini-dizhi3" v-if="hasLocation"></i>
								 <i class="icon mini-icon mini-fanhui" v-else></i>
								<text class="text">{{ hasLocation ? myCityObj.name : '尝试定位' }}</text>
							</view>
						</view>
					</view>
					<!-- 历史记录 -->
					<view class="area list-item" id="record" v-if="recordList.length">
						<view class="title-wrapp">
							<view class="c-title">
								<text class="l">热门</text>
							</view>
						</view>
						<view class="ul">
							<view class="li font-clamp" v-for="item in recordList" :key="item.citycode" @click="selectCity(item)">
								{{ item.name }}
							</view>
						</view>
					</view>
				</view>
				<!-- 城市列表  -->
				<view class="city-list">
					<view class="list list-item" v-for="(item, key) of cityList" :key="key" :id="item.nameType">
						<view class="c-title">{{ item.nameType }}</view>
						<view class="item" v-for="innerItem in item.list" :key="innerItem.citycode" @click="selectCity(innerItem)">
							{{ innerItem.name }}
						</view>
					</view>
				</view>
			</scroll-view>
		
			<!-- 字母列表 -->
			<view class="alphabet" @touchstart="touchStart" @touchend="touchEnd" @touchmove.stop="touchMove">
				<view v-for="(item, index) in alphabet" :key="index" @touchstart="getLetter" @touchend="setLetter" :id="item">
					<view class="item" :class="{ active: currentLetter == item }">
						{{ item == 'area' ? '当前' : item == 'record' ? '历史' : item }}
					</view>
				</view>
			</view>
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import cityJson from '@/pages/common/static/city.json';

const common = require('@/mixins/common');
var options = {};
let cstorageKey = '';
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{
		contentHieght: {
			get() {
			  return ' calc( 100vh - ' + this.$store.state.CustomBar + 'px )';
			}
		}
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 156,
			inputValue: '',
			searchData: [], // 搜索的数据
			toIndex: '', // 跳转的索引的字母
			tipsLetter: '', // 滑动显示字母
			timer: null,
			hasNoData: false,
			letterDetails: [],
			currentLetter: 'area', //默认选择
			cityArr: [],
			recordList: [],
			cityList: [],
			hasLocation: false,
			myCityObj: {},
			alphabet:[],
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(156, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		if(options.cstorageKey && options.cstorageKey.length > 0){
			cstorageKey = options.cstorageKey;
		}
		
		this.cityArr = cityJson.data.list
		if (this.cityArr && this.cityArr[0]) {
			this.cityArr.map(v => {
				v.nameType = v.pinyin.substr(0, 1)
			})
			this.cityList = this.groupArr(this.cityArr, 'nameType')
		}
		this.recordList = cityJson.data.recordList;
		this.alphabet = cityJson.data.alphabet;
	},
	watch: {
		// 城市搜索输入框
		inputValue(newVal) {
			if (this.timer) {
				clearTimeout(this.timer);
			}
	
			if (!this.inputValue) {
				this.searchData = [];
				return;
			}
			this.timer = setTimeout(() => {
				const result = [];
				this.cityList.map(v => {
					v.list.forEach((item) => {
						if (/^[a-zA-Z]+$/.test(item.pinyin) && item.pinyin.toLowerCase().includes(this.inputValue.toLowerCase()) ||
							item.name.includes(this.inputValue)) {
							result.push(item);
						}
					});
				})
				this.searchData = result;
				if (this.searchData.length === 0) {
					this.hasNoData = true;
				} else {
					this.hasNoData = false;
				}
			}, 200);
		}
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		refreshLocation() {
			let that = this;
			uni.wen.util.getGeocoder().then(res => {
				const component = res.regeocode.addressComponent
				that.myCityObj.name = component.city && component.city.length > 0 ? component.city : '';
				that.hasLocation = true;
				if(cstorageKey.length > 0 && that.myCityObj?.name?.length > 0){
					uni.setStorageSync(cstorageKey, {name: that.myCityObj.name});
					uni.wen.toUrl(-2, null, that);
				}
				uni.setStorageSync('lastCity', that.myCityObj.name);
			});
		},
		groupArr(list, field) {
			var fieldList = [],
				att = [];
			list.map((e) => {
				fieldList.push(e[field])
			})
			//数组去重
			fieldList = fieldList.filter((e, i, self) => {
				return self.indexOf(e) == i
			})
			for (var j = 0; j < fieldList.length; j++) {
				//过滤出匹配到的数据
				var arr = list.filter((e) => {
					return e[field] == fieldList[j];
				})
				att.push({
					nameType: arr[0].nameType,
					list: arr
				})
			}
			return att;
		},
		selectCity(item,type) {
			let that = this;
			if(type === 'refresh'){
				// 获取定位
				that.refreshLocation();
				return false;
			}
			that.myCityObj.name = item.name;
			// console.log('选择的城市：', item);
			if(cstorageKey.length > 0){
				uni.setStorageSync(cstorageKey, {name: item.name});
				uni.wen.toUrl(-2, null, that);
			}
			uni.setStorageSync('lastCity', item.name);
			// // 当前项目是需要选择到区域，所以选择城市后回到区县的地方
			that.toIndex = 'area';
			// setTimeout(() => {
			// 	this.toIndex = '';
			// }, 1000);
		},
		closeModal(){
			this.$emit('closeModal')
		},
		//列表滚动，和右边字母表对应
		scrollHandle(e) {
			let view = uni.createSelectorQuery().in(this).selectAll('.list-item');
			view
				.boundingClientRect((d) => {
					let top = d[0].top;
					d.forEach((item) => {
						item.top = item.top - top;
						item.bottom = item.bottom - top;
						this.letterDetails.push({
							id: item.id,
							top: item.top,
							bottom: item.bottom,
						});
					});
				})
				.exec();
		
			const scrollTop = e.detail.scrollTop;
			this.letterDetails.some((item) => {
				if (scrollTop >= item.top && scrollTop <= item.bottom - 20) {
					this.currentLetter = item.id;
					//当前固定用的是粘性定位，如果不用粘性定位，在这里设置
					return true;
				}
			});
		},
		// 触发开始
		touchStart(e) {
			// console.log(e);
		},
		//移动时
		touchMove(e) {
			uni.wen.util.vibrateShort();
			let y = e.touches[0].clientY;
			let offsettop = e.currentTarget.offsetTop;
		
			//判断选择区域,只在选择区才会生效
			if (y > offsettop) {
				let num = parseInt((y - offsettop) / 15); //右边每个字母元素的高度
				let letter = this.alphabet[num];
				this.tipsLetter = letter;
		
				let curentLetter = this.letterTransform(letter);
				uni.showToast({
					title: curentLetter,
					icon: 'none',
				});
			}
		},
		//触发结束
		touchEnd() {
			this.toIndex = this.tipsLetter;
		},
		//移动开始获取字母，并放大提示
		getLetter(e) {
			uni.wen.util.vibrateShort();
			let {
				id
			} = e.currentTarget;
			this.tipsLetter = id;
		
			let curentLetter = this.letterTransform(id);
			uni.showToast({
				title: curentLetter,
				icon: 'none',
			});
		},
		//移动结束设置字母，赋值到toIndex
		setLetter() {
			this.toIndex = this.tipsLetter;
		},
		
		//提示字母转换
		letterTransform(letter) {
			let str = '';
			if (letter == 'area') {
				str = '当前';
			} else if (letter == 'record') {
				str = '历史';
			} else {
				str = letter;
			}
			return str;
		},
	}
}
</script>

<style lang="scss" scoped>
.center-search{
	width: 100%;
}
.chose-city{
	@include background_color(page-box-background-color);
}

.reach-content {
	padding-left: 36rpx;
	box-sizing: border-box;
	.li {
		width: 714rpx;
		font-size: 28rpx;
		height: 100rpx;
		line-height: 100rpx;
		color: #333;
		position: relative;
		box-sizing: border-box;
		border-bottom: 2rpx solid #F5F5F5;
	}
}

.block {
	padding: 0 36rpx;
	box-sizing: border-box;
}

.top-search {
	line-height: 72rpx;
	padding: 14rpx 30rpx 0;
	box-sizing: border-box;
	margin-bottom: 26rpx;

	.item {
		background: #F5F5F5;
		border-radius: 12rpx;
		font-size: 28rpx;
		text-align: center;
		color: #999999;
		/* #ifdef MP-ALIPAY */
		height: 72rpx;
		line-height: 72rpx;

		/* #endif */
		text {
			padding-left: 20rpx;
			color: #c1c2cd;
			vertical-align: middle;
			position: relative;
			top: -4rpx;
		}

	}
}

.scroll-view {
	width: 100%;
	height: calc(100vh - 110rpx);
	box-sizing: border-box;
}

.area {
	margin-bottom: 8rpx;

	.title-wrapp {
		position: sticky;
		top: 0;
		left: 0;
	}

	.c-title {
		width: 100%;
		box-sizing: border-box;
		font-size: 28rpx;
		@include color(color-lightest-dark);
		margin-bottom: 24rpx;
		display: inline-flex;
		justify-content: space-between;
		align-items: center;

		.r {
			font-size: 24rpx;
			@include color(color-lighter-er-dark);
			display: inline-block;
			align-items: center;

			.iconfont {
				font-size: 24rpx;
			}
		}
	}

	.ul {
		display: flex;
		flex-wrap: wrap;

		.li {
			width: 155rpx;
			padding: 0 10rpx;
			box-sizing: border-box;
			height: 72rpx;
			line-height: 68rpx;
			text-align: center;
			font-size: 32rpx;
			@include color(color-light-dark);
			border-radius: 8rpx;
			margin: 0 18rpx 28rpx 0;
			@include background_color(page-box-item3-background-color);

			&:nth-child(4n) {
				margin-right: 0;
			}

			&.now {
				width: auto;
				padding: 0 32rpx 0 22rpx;

				.icon {
					font-size: $uni-font-size-base;
				}
				.icon.primay-color{
					@include color(color-primary);
				}

				.text {
					padding-left: 10rpx;
				}
			}

			&.active {
				font-weight: 500;
				background: #ffde45;
			}
		}

		.hover {
			background: #ffde45;
		}
	}
}

.city-list {
	width: 750rpx;
	padding-bottom: 50rpx;

	.c-title {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
		font-weight: 500;
		@include color(color-darkest);
		box-sizing: border-box;
		padding-left: 36rpx;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 2;
		@include background_color(page-box-item2-background-color);
	}

	.item {
		width: 714rpx;
		margin-left: 36rpx;
		padding: 0 36rpx 0 0;
		height: 100rpx;
		line-height: 100rpx;
		@include color(color-light-dark);
		font-size: 28rpx;
		box-sizing: border-box;
		border-bottom: 2rpx solid;
		@include border_color(border-color-body-background-color);
	}
}

.alphabet {
	position: fixed;
	right: 0;
	bottom: 20%;
	width: calc(750rpx - 680rpx);
	text-align: center;
	font-size: 20rpx;
	font-weight: 700;
	@include color(color-lighter-er-dark);
	z-index: 99;

	.item {
		height: 15px;
		line-height: 15px;
	}

	.active {
		@include color(color-primary);
	}
}

.has-no-data {
	font-size: 24rpx;
	text-align: center;
	@include color(color-lighter-er-dark);
	margin-top: 50rpx;
}
</style>