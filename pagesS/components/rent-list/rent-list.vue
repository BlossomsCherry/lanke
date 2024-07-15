<template>
	<view class="container">
		<view class="item" v-for="(item,index) in 10"  @tap.stop.prevent="toSliderUrl(6, '/pagesS/local-serve/detail/house')">
			<view class="left">
				<image class="cover" src="https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg" mode=""></image>
			</view>
			<view class="right">
				<view class="title">
					合租上实图!6号线8号线东
				</view>
				<view class="info">
					53m·金牛·国宾·蜀西路66号
				</view>
				<view class="tag">
					<view class="tagItem first" v-if="index==2||index==4||index==6||index==8">
						<text>安选</text>
					</view>
					<view class="tagItem">
						<text>配套齐全</text>
					</view>
					<view class="tagItem">
						<text>交通便利</text>
					</view>
					<view class="tagItem">
						<text>南北通透</text>
					</view>
				</view>
				<view class="price">
					16600元/月
				</view>
				<view class="info way">
					<u-icon name="twitter" size="14"></u-icon>
					<text class="jdText" style="margin-left: 4rpx;">距离1号线东光520米</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"rent-list",
		data() {
			return {
			};
		}
	}
</script>

<style lang="scss" scoped>
	@mixin dflex {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	
	@mixin dflexsb {
	  @include dflex;
	  justify-content: space-between;
	}
	
	@mixin dflexsa {
	  @include dflex;
	  justify-content: space-around;
	}
	
	.container {
	  height: 100%;
	  box-sizing: border-box;
	  padding-bottom: 100rpx !important;
	
	  .item {
	    background: #fff;
	    margin-bottom: 26rpx;
	    border-radius: 16rpx;
	    @include dflexsb;
	
	    .left {
	      width: 220rpx;
	      height: 180rpx;
	      @include dflex;
	      margin-right: 24rpx;
	
	      .cover {
	        width: 220rpx;
	        height: 170rpx;
	        border-radius: 8rpx;
	      }
	    }
	
	    .right {
	      flex: 1;
	
	      .title {
	        padding: 0 10rpx 10rpx 0;
	        box-sizing: border-box;
	        font-size: $uni-font-size-sm-base;
	        color: #000;
	      }
	
	      .info {
	        font-size: 22rpx;
	        color: #7f7f7f;
	        margin-bottom: 14rpx;
	      }
	
	      .way {
	        @include dflex;
	        justify-content: flex-start;
	      }
	
	      .tag {
	        @include dflex;
	        justify-content: flex-start;
	        flex-wrap: wrap;
	
	        .tagItem {
	          color: #50aff8;
	          border: 1rpx solid #f4f4f4;
	          border-radius: 4rpx;
	          padding: 3rpx 6rpx;
	          box-sizing: border-box;
	          margin: 0rpx 14rpx 6rpx 0;
	          font-size: 22rpx;
	
	          &.first {
	            background: #fef8f7;
	            @include dflex;
	            color: #fff;
	            background: #43e35e;
	            font-size: $uni-font-size-sm;
	            font-weight: bolder;
	          }
	        }
	      }
	
	      .price {
	        font-size: $uni-font-size-base;
	        color: #ed6c4c;
	        font-weight: 600;
	        margin-bottom: 14rpx;
	      }
	    }
	  }
	}

</style>