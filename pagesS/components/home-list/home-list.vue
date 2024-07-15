<template>
	<view class="container">
		<view class="item" v-for="(item,index) in 10" @tap.stop.prevent="toSliderUrl(6, '/pagesS/local-serve/detail/house')">
			<view class="left">
				<image class="cover" src="https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg" mode=""></image>
			</view>
			<view class="right">
				<view class="title">
					急租!简单装修可做餐饮办公教育影楼医疗美容康养!
				</view>
				<view class="info">
					53m·金牛·国宾·蜀西路66号
				</view>
				<view class="tag">
					<view class="tagItem first" v-if="index==2||index==4||index==6||index==8">
						<u-icon name="server-man" size="16" color="#ec613d"></u-icon>
						<text>优选房源</text>
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
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"home-list",
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
	  background: #fafafc;
	  box-sizing: border-box;
	  padding-bottom: 100rpx !important;
	
	  .item {
	    padding: 16rpx 24rpx;
	    box-sizing: border-box;
	    background: #fff;
	    margin-bottom: 16rpx;
	    border-radius: 16rpx;
	    @include dflexsb;
	
	    .left {
	      width: 170rpx;
	      height: 180rpx;
	      @include dflex;
	      margin-right: 24rpx;
	
	      .cover {
	        width: 166rpx;
	        height: 170rpx;
	        border-radius: 14rpx;
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
	
	      .tag {
	        @include dflex;
	        justify-content: flex-start;
	        flex-wrap: wrap;
	        margin-bottom: 14rpx;
	
	        .tagItem {
	          color: #7f7f7f;
	          border: 1rpx solid #ccc;
	          border-radius: 4rpx;
	          padding: 3rpx 6rpx;
	          box-sizing: border-box;
	          margin: 0rpx 14rpx 6rpx 0;
	          font-size: 22rpx;
	
	          &.first {
	            background: #fef8f7;
	            @include dflex;
	            color: #ec613d;
	            font-size: 24rpx;
	            font-weight: bolder;
	          }
	        }
	      }
	
	      .price {
	        font-size: $uni-font-size-base;
	        color: #ec613d;
	        font-weight: 600;
	      }
	    }
	  }
	}

</style>