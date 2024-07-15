<template>
	<view :class="'card_swiper_out scene_' + scene">
		<block v-if="platformList.length <= 12">
			<view class="card_swiper">
				<view class="one-row">
					<view v-if="index < 6" class="item" v-for="(item,index) in platformList" :key="index" @tap.stop.prevent="toNav(0, index)">
						<view class="img_wrap">
							<image :class="'item_img ' + (scene == 19 ? 'circle_shape' : '')" :src="item.img" /></image>
						</view>
						<view class="name" v-if="item.name">{{item.name}}</view>
					</view>
				</view>
				
				<view class="one-row">
					<view v-if="index >= 6" class="item" v-for="(item,index) in platformList" :key="index" @tap.stop.prevent="toNav(0, index)">
						<view class="img_wrap">
							<image :class="'item_img ' + (scene == 19 ? 'circle_shape' : '')" :src="item.img" /></image>
						</view>
						<view class="name" v-if="item.name">{{item.name}}</view>
					</view>
				</view>
			</view>
			
		</block>
		<block v-else>
			<scroll-view @scroll="changeScroll" :show-scrollbar="false" :enable-flex="true" :scroll-x="true" :scroll-y="true" class="card_swiper" >
				<view class="u-margin-bottom-26">
					<view class="item" v-for="(item,index) in firstColumn" :key="index"  @tap.stop.prevent="toNav(1, index)">
						<view class="img_wrap">
							<image :class="'item_img ' + (scene == 19 ? 'circle_shape' : '')" :src="item.img" /></image>
						</view>
						<view class="name" v-if="item.name">{{item.name}}</view>
					</view>
				</view>
				<view class="u-padding-bottom-26">
					<view class="item" v-for="(item,index) in towColumn" :key="index"  @tap.stop.prevent="toNav(2, index)">
						<view class="img_wrap">
							<image :class="'item_img ' + (scene == 19 ? 'circle_shape' : '')" :src="item.img" /></image>
						</view>
						<view class="name" v-if="item.name">{{item.name}}</view>
					</view>
				</view>
			</scroll-view>
			<view v-if="platformList.length > 12" class="scroll_bar" :style="{width:scrollwidth}">
				<view class="left_line" :style="{left:scrollLeft}"></view>
			</view>
		</block>
		<view style="height: 10rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				firstColumn: [],
				towColumn: [],
				scrollwidth: 0,
				scrollLeft: 0
			}
		},
		props: {
			platformList: {
				type: Array,
				required: true
			},
			scene:{
				tyle: Number,
				default: 0
			},
		},
		watch: {
			platformList: {
				handler: function(newVal, oldVal){
					this.firstColumn = this.getFirstColumn(newVal)
					this.scrollwidth = this.getScrollwidth(newVal)
					this.towColumn = this.getTowColumn(newVal)
				},
				deep: true,
				immediate:true
			}
		},
		methods: {
			getFirstColumn(arr) {
				return arr.slice(0, Math.ceil(arr.length / 2))
			},
			// 计算滚动条的长度
			getScrollwidth(arr) {
				let rate = 5 / Math.ceil(arr.length / 2);
				let one = 16 / rate + 10;
				return one + 'rpx';
			},
			getTowColumn(arr) {
				let list = arr.slice(Math.ceil(arr.length / 2), arr.length)
				if (list.length) {
					// let obj = {
					// 	gt_id: 0,
					// 	gt_name: "全部分类",
					// 	icon_url: "",
					// }
					// list.splice(4, 0, obj)
					return list
				}
			},
			
			changeScroll(e) {
				// console.log(e)
				let columnLength = this.firstColumn.length
				this.scrollLeft = (e.detail.scrollLeft / 1.3) / columnLength + 'rpx'
			},
			toNav(which, index){
				
				if(which == 0){
					let type = this.platformList[index]['type'];
					let id = this.platformList[index]['target'];
					this.$emit('toSliderUrl', type, id);
				}else if(which == 1){
					let type = this.firstColumn[index]['type'];
					let id = this.firstColumn[index]['target'];
					this.$emit('toSliderUrl', type, id);
				}else if(which == 2){
					let type = this.towColumn[index]['type'];
					let id = this.towColumn[index]['target'];
					this.$emit('toSliderUrl', type, id);
				}
				
				
			}
		}
	}
</script>

<style scoped lang="scss">
	
	// 请勿改动----------首页格子菜单配置
	$page-index-box-menu-width: 54rpx; // 首页格子菜单大小（默认值：78rpx ）
	$page-index-box-menu-wrap-width: 100rpx; // （默认值：132rpx ）先调整上面的的图片大小，大小确认以后，再调整这里使整体看起来居中。  疑问？：为什么不能自动调整，因为菜单本身是滚动的，需要兼容的地方太多，只能手动调整
	$page-index-box-menu-font-size: 20rpx; // （默认值：30rpx ）
	$page-index-box-menu-border-radius: 0%; // 首页格子菜单圆角（默认值：50% ）
	
	$page-find-circle-width: 85rpx; // 发现页圈子头像大小（默认值：85rpx ）
	$page-find-circle-name-font-size: 26rpx; // （默认值：30rpx ）圈子名称字体大小
	
	// 菜单
	.card_swiper_out {
		position: relative;
		padding: 20rpx 10rpx 0;
		box-sizing: border-box;
		@include background_color(page-box-background-color);
		width: 100%;
		overflow-y: auto;
		.one-row{
			display: block;
		}
	}
	.card_swiper_out.scene_27{
		border-radius: 32upx;
	}

	.card_swiper {
		white-space: nowrap;
		width: 100%;
	}

	.item {
		width: 135rpx;
		display: inline-block;
		text-align: center;
		@include color(color-lighter-er-dark);
		font-size: $uni-font-size-sm;
		margin-right: 24rpx;
		.img_wrap{
			width: 80rpx;
			text-align: center;
			margin-bottom: 16rpx;
			font-size: $uni-font-size-sm;
			.item_img {
				width: 80rpx;
				height: 80rpx;
				// background: #EFEFEF;
				border-radius: 50%;
				display: block;
			}
		}

		.name{
			width: 80rpx;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.card_swiper_out.scene_19{
		.item {
			.img_wrap{
				min-width: 103rpx;
				.item_img{
					margin: auto;
					border-radius: 10rpx; 
					width: $page-find-circle-width; 
					height: $page-find-circle-width;
					mask-size: $page-find-circle-width;
					@include background_color(page-box-item-background-color);
					-webkit-mask-size: $page-find-circle-width;
				}
			}
			.name{
				width: $page-find-circle-width;
				min-width: 103rpx;
				font-size: $page-find-circle-name-font-size;
				text-overflow: clip;
			}
		}
	}
	.card_swiper_out.scene_1, .card_swiper_out.scene_20001{
		.item {
			width: $page-index-box-menu-wrap-width;
			.img_wrap{
				min-width: 115rpx;
				margin-bottom: 10rpx;
				.item_img {
					margin: auto;
					width: $page-index-box-menu-width;
					height: $page-index-box-menu-width;
					border-radius: $page-index-box-menu-border-radius;
				}
			}
			.name{
				width: $page-index-box-menu-width;
				min-width: 115rpx;
				margin-bottom: 15rpx;
				font-size: $page-index-box-menu-font-size;
			}
		}
	}
	.card_swiper_out.scene_20001{
		@include background_color(page-body-background-color);
	}
	.card_swiper_out.scene_2{
		@include background_color(page-body-background-color);
		border-radius: unset;
	}

	.item:nth-last-child(1) {
		margin-right: 0;
	}

	.scroll_bar {
		background: rgba(239, 239, 239, 0.9);
		height: 8rpx;
		border-radius: 5rpx;
		position: relative;
		left: 50%;
		transform: translate(-50%, 0);
		z-index: 9;
		bottom: 0;
		transition: all 0.5s ease-in;
		display: inline-block;
	}

	.left_line {
		content: ' ';
		width: 16rpx;
		height: 8rpx;
		background-color: $uni-color-primary;
		border-radius: 5rpx;
		position: absolute;
		top: 0;
	}
	.u-margin-bottom-26 {
	    margin-bottom: 15rpx;
	}
</style>
