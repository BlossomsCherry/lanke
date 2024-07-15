<template>
	<view class="container">
		<view class="item" v-for="(item,index) in 10">
			<view class="left">
				<image class="cover" src="https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg" mode=""></image>
			</view>
			<view class="middle">
				<view class="title">
					日常家居保洁2小时
				</view>
				<view class="info">
					每周一次 省心又洁净
				</view>
				<view class="price">
					￥<text class="big">45.1</text>元/小时起
				</view>
			</view>
			<view class="right">
				<u-button type="primary" color="#5ec3a9" iconColor="#5ec3a9" shape="circle" :plain="true"  :customStyle="buttonStyle" throttleTime="1000" text="立即预约" ></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"self-service",
		data() {
			return {
				buttonStyle:{width:'auto',minWidth:'164rpx',height:'60rpx'},
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
	      width: 220rpx;
	      height: 180rpx;
	      @include dflex;
	      margin-right: 16rpx;
	
	      .cover {
	        width: 210rpx;
	        height: 170rpx;
	        border-radius: 14rpx;
	      }
	    }
	
	    .middle {
	      flex: 1;
	      @include dflex;
	      flex-direction: column;
	      align-items: flex-start;
	      line-height: 44rpx;
	
	      .title {
	        font-size: $uni-font-size-sm-base;
	        color: #000;
	        font-weight: 600;
	      }
	
	      .info {
	        color: #7f7f7f;
	        background: #faf7f7;
	        border-radius: 4rpx;
	        font-size: 22rpx;
	      }
	
	      .price {
	        font-size: 22rpx;
	        color: #ec613d;
	
	        .big {
	          font-size: $uni-font-size-base;
	          font-weight: 600;
	        }
	      }
	    }
	
	    .right {
	      width: 170rpx;
	      height: 70rpx;
	      @include dflex;
	    }
	  }
	}

</style>
