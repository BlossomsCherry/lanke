<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body swiper-css zqui-rel" :style="{ height: hpx }">
		<swiper
			class="swiper"
			:style="{ height: hpx }"
			:indicator-dots="indicatorDots"
			:autoplay="autoplay"
			:interval="interval"
			:duration="duration"
			@change="guideAction"
			next-margin="50rpx"
		>
			<swiper-item v-if="guide_page.page1">
				<view class="swiper-item" :style="{ height: hpx }">
					<view ref="box1" class="box1-move">
						<view class="item-box1"><text class="_text">{{ guide_page.page1.title || '' }}</text></view>
						<view class="item-box2"><text class="_text">{{ guide_page.page1.desc || '' }}</text></view>
					</view>
					<view class="item-box3" ref="box2"><image :src="guide_page.page1.img" class="box-img3"></image></view>
				</view>
			</swiper-item>
			<swiper-item v-if="guide_page.page2">
				<view class="swiper-item bg2" :style="{ height: hpx }">
					<view ref="box3" class="box1-move">
						<view class="item1-box1"><text class="_text">{{ guide_page.page2.title || '' }}</text></view>
						<view class="item1-box2"><text class="_text">{{ guide_page.page2.desc || '' }}</text></view>
					</view>
					<view class="item1-box3" ref="box4"><image :src="guide_page.page2.img" class="box1-img3"></image></view>
				</view>
			</swiper-item>
			<swiper-item v-if="guide_page.page3">
				<view class="swiper-item bg3" :style="{ height: hpx }">
					<view ref="box5" class="box1-move">
						<view class="item2-box1"><text class="_text">{{ guide_page.page3.title || '' }}</text></view>
						<view class="item2-box2"><text class="_text">{{ guide_page.page3.desc || '' }}</text></view>
					</view>
					<view class="item2-box3" ref="box6"><image :src="guide_page.page3.img" class="box2-img3"></image></view>
					<view class="go-btn-box">
						<view class="go-btn" @tap.stop.prevent="gotoHome"><text class="go-btn-css">立即进入</text></view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="zqui-abs swiper-opt-box">
			<view class="zqui-rel swiper-opt-main">
				<view class="swiper-opt"></view>
				<view class="zqui-abs swiper-opt-sw" ref="lefMain"></view>
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

const animation = weex.requireModule('animation');
export default {
	components: {
		myToast,navBar,hoverBall,
	},
	data() {
		return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 0,
			indicatorDots: false,
			autoplay: false,
			interval: 10000,
			duration: 500,
			iStatusBarHeight: '0px',
			hpx: '100%',
			guide_page: {
				'page1': {
					'title': '',
					'desc': '',
					'img': ''
				},
				'page2': {
					'title': '',
					'desc': '',
					'img': ''
				},
				'page3': {
					'title': '',
					'desc': '',
					'img': ''
				}
			}
		};
	},
	onLoad(options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.guide_page = decodeURIComponent(options.guide_page);
		console.log(that.guide_page);
		
		uni.getSystemInfo({
			success: function(res) {
				that.hpx = res.windowHeight + 'px';
			}
		});
	},
	onReady() {
		this.move(0, 1);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		gotoHome() {
			uni.wen.toUrl(-2, 0, null);
		},
		guideAction(event) {
			let that = this,
				index = event.detail.current;
			if (index == 0) {
				that.move(0, 1);
				that.moveTwo(150, 0.1);
				that.moveThree(150, 0.1);
				that.lefMainAction(0);
			}
			if (index == 1) {
				that.moveTwo(0, 1);
				that.move(150, 0.1);
				that.moveThree(150, 0.1);
				that.lefMainAction(uni.upx2px(80) + 'px');
			}
			if (index == 2) {
				that.moveThree(0, 1);
				that.moveTwo(150, 0.1);
				that.move(150, 0.1);
				that.lefMainAction(uni.upx2px(160) + 'px');
			}
		},
		lefMainAction(mum) {
			var testLM = this.$refs.lefMain;
			animation.transition(
				testLM,
				{
					styles: {
						transform: 'translate(' + mum + ',0px)'
					},
					duration: 400, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				},
				function() {}
			);
		},
		move(tran, opa) {
			var testEl = this.$refs.box1;
			animation.transition(
				testEl,
				{
					styles: {
						transform: 'translate(' + tran + 'px,0px)',
						transformOrigin: 'center center',
						opacity: opa
					},
					duration: 800, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				},
				function() {}
			);
			var textE2 = this.$refs.box2;
			animation.transition(
				textE2,
				{
					styles: {
						transform: 'translate(0px,' + tran + 'px) scale(' + opa + ')',
						transformOrigin: 'center center',
						opacity: opa
					},
					duration: 800, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				},
				function() {}
			);
		},
		moveTwo(tran, opa) {
			var testEl = this.$refs.box3;
			animation.transition(
				testEl,
				{
					styles: {
						transform: 'translate(' + tran + 'px,0px)',
						transformOrigin: 'center center',
						opacity: opa
					},
					duration: 800, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				},
				function() {}
			);
			var textE2 = this.$refs.box4;
			animation.transition(
				textE2,
				{
					styles: {
						transform: 'translate(0px,' + tran + 'px) scale(' + opa + ')',
						transformOrigin: 'center center',
						opacity: opa
					},
					duration: 800, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				},
				function() {}
			);
		},
		moveThree(tran, opa) {
			var testEl = this.$refs.box5;
			animation.transition(
				testEl,
				{
					styles: {
						transform: 'translate(' + tran + 'px,0px)',
						transformOrigin: 'center center',
						opacity: opa
					},
					duration: 800, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				},
				function() {}
			);
			var textE2 = this.$refs.box6;
			animation.transition(
				textE2,
				{
					styles: {
						transform: 'translate(0px,' + tran + 'px) scale(' + opa + ')',
						transformOrigin: 'center center',
						opacity: opa
					},
					duration: 800, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				},
				function() {}
			);
		}
	}
};
</script>

<style lang="scss">
/* 相对定位 */
.zqui-rel {
	position: relative;
}
/* 绝对定位 */
.zqui-abs {
	position: absolute;
}

/* Flex布局 */
/*#ifndef APP-PLUS-NVUE*/
.zqui-item {
	display: flex;
}
/*#endif*/
/* Flex布局-横向显示*/
.flex-row {
	flex-direction: row;
}
/* Flex布局-右对齐元素居中*/
.right-flex {
	justify-content: flex-end;
	align-items: center;
}
/* Flex布局-垂直居中*/
.box-center {
	justify-content: center;
	align-items: center;
}
/* Flex布局-两端元素居中*/
.box-between {
	justify-content: space-between;
	align-items: center;
}
/* Flex布局-满占位*/
.flex-main {
	flex: 1;
}
.swiper-css {
	width: 750rpx;
}
.swiper-item {
	width: 750rpx;
}
.text-css {
	padding-top: 20%;
	padding-left: 20%;
	font-size: 36rpx;
}
.item-box1 {
	margin-top: 276rpx;
	margin-left: 95rpx;
}
.box1-move {
	transform: translate(150px, 0px);
	opacity: 0.1;
}
.box-img1 {
	width: 355rpx;
	height: 58rpx;
}
.item-box2 {
	margin-top: 49rpx;
	margin-left: 96rpx;
}
.box-img2 {
	width: 340rpx;
	height: 30rpx;
}
.item-box3 {
	margin-top: 355rpx;
	margin-left: 275rpx;
	width: 201rpx;
	height: 200rpx;
	transform: translate(0px, 150px) scale(0.5);
	opacity: 0;
}
.box-img3 {
	width: 201rpx;
	height: 200rpx;
}

.item1-box1 {
	margin-top: 276rpx;
	margin-left: 95rpx;
}
.box1-img1 {
	width: 357rpx;
	height: 57rpx;
}
.item1-box2 {
	margin-top: 49rpx;
	margin-left: 96rpx;
}
.box1-img2 {
	width: 340rpx;
	height: 30rpx;
}
.item1-box3 {
	margin-top: 355rpx;
	margin-left: 275rpx;
	width: 202rpx;
	height: 202rpx;
	transform: translate(0px, 150px) scale(0.5);
	opacity: 0;
}
.box1-img3 {
	width: 202rpx;
	height: 202rpx;
}

.item2-box1 {
	margin-top: 276rpx;
	margin-left: 95rpx;
}
.box2-img1 {
	width: 351rpx;
	height: 58rpx;
}
.item2-box2 {
	margin-top: 49rpx;
	margin-left: 96rpx;
}
.box2-img2 {
	width: 341rpx;
	height: 30rpx;
}
.item2-box3 {
	margin-top: 355rpx;
	margin-left: 275rpx;
	width: 200rpx;
	height: 200rpx;
	transform: translate(0px, 150px) scale(0.5);
	opacity: 0;
}
.box2-img3 {
	width: 200rpx;
	height: 200rpx;
}
.go-btn-box {
	width: 750rpx;
	justify-content: center;
	align-items: center;
	margin-top: 90rpx;
}
.go-btn {
	width: 434rpx;
	height: 70rpx;
	@include border_color(border-color-light-dark);
	border-style: solid;
	border-width: 1px;
	border-radius: 35rpx;
	justify-content: center;
	align-items: center;
}
.go-btn-css {
	font-size: $uni-font-size-base;
	@include color(color-light-dark);
}
.swiper-opt-box {
	width: 750rpx;
	z-index: 22;
	left: 0;
	bottom: 100rpx;
	justify-content: center;
	align-items: center;
}
.swiper-opt {
	width: 240rpx;
	height: 3rpx;
	background-color: #eeeeee;
	border-radius: 2rpx;
}
.swiper-opt-main {
	justify-content: center;
	align-items: center;
	width: 240rpx;
	height: 7rpx;
}
.swiper-opt-sw {
	width: 80rpx;
	height: 7rpx;
	left: 0;
	top: 0;
	background-image: linear-gradient(to left, #ff8d76, #e42d29);
	border-radius: 4rpx;
}
</style>
