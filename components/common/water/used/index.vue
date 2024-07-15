<template>
	<view class="goodBox" @tap.stop.prevent="toSliderUrl(28, data.id)">
		<!-- 商品图片 -->
		<view :class="'icon_img ' + (data.status != 1 ? 'status_tip status_' + data.status : '')" :style="'width: 100%;height: ' + data.pic_height + 'rpx;max-height: 600rpx;background-image: url('+ data.pic +');' ">
			<i class="mini-icon mini-shipin1" v-if="data.video_url && data.video_url.length > 0 "></i>
			<view class="distance">
				<i class="mini-icon mini-dizhi3"></i>
				<text class="_text">{{ data.distance + ' ' + data.distance_name }}</text>
			</view>
		</view>
		<view class="goodBox-cont">
			<view class="goodBox-title">
				{{data.title}}
			</view>
			<view class="goodBox-pirce">
				<text>￥</text>
				{{data.price}}
				<text class="needed">{{ filters.toFix(data.needed_count) }}人想要</text>
			</view>
			<view class="goodBox-user">
				<image class="_image" :src="data.user.user_avatar" mode="aspectFill"></image>
				<text class="_text">{{data.user.user_name}}</text>
			</view>
		</view>
	</view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
export default {
    data() {
        return {};
    },
    /**
     * 组件的属性列表
     */
    props: {
        data: Object
    },
    /**
     * 组件的方法列表
     */
    methods: {

    }
};
</script>
<style lang="scss">
.goodBox {
		width: 100%;
		overflow: hidden;
		@include background_color(page-box-background-color);
		margin-bottom: 20rpx;
		
		.icon_img{
			background-size: cover;
			border-radius: $uni-border-radius-sm;
			position: relative;
			.mini-icon.mini-shipin1 {
			    position: absolute;
			    top: 20rpx;
			    right: 20rpx;
			    color: #ffffff;
			    font-size: 46rpx;
			}
			.distance {
			    position: absolute;
			    bottom: 10rpx;
				left: 10rpx;
			    display: flex;
			    background-color: rgba(0,0,0, 0.4);
				padding: 4rpx 10rpx;
				border-radius: 10rpx;
				._text{
					color: #ffffff;
					font-size: $uni-font-size-sm;
				}
				.mini-icon{
					color: #ffffff;
					font-size: $uni-font-size-sm;
					margin-right: 4rpx;
				}
			}
		}
		.icon_img.status_tip::after{
			border-radius: $uni-border-radius-sm;
			background-color: rgba(0, 0, 0, 0.6);
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			text-align: center;
			color: #ffffff;
			display: flex;
			flex-direction: column;
			justify-content: center;
			font-size: $uni-font-size-base;
		}
		.icon_img.status_0::after{
			content: '待审核';
		}
		.icon_img.status_2::after{
			content: '已下架';
		}
		
		.icon_img.status_3::after{
			content: '卖掉了';
		}
		
		.icon_img.status_4::after{
			content: '被驳回';
		}
		
		.icon_img.status_5::after{
			content: '买家已付款';
		}
		
		.icon_img.status_6::after{
			content: '已退款';
		}
		
		.icon_img.status_7::after{
			content: '买家待付款';
		}

		&-cont {
			padding: 12rpx 0;
		}

		&-title {
			font-size: $uni-font-size-base;
			// font-weight: bold;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			@include color(color-dark);
		}

		&-pirce {
			font-size: $uni-font-size-lg;
			color: #ff4444;
			padding: 12rpx 0;
			font-weight: bold;
			.needed {
				font-size: $uni-font-size-sm;
				@include color(color-lighter-er-dark);
				padding-left: 24rpx;
				font-weight: normal;
			}
		}

		&-user {
			display: flex;
			align-items: center;

			._image {
				width: 30rpx;
				height: 30rpx;
				border-radius: 50%;
			}

			._text {
				padding: 3rpx 0 3rpx 10rpx;
				@include color(color-lighter-er-dark);
				font-size: $uni-font-size-sm;
			}
		}
	}
</style>
