<template>
	<view class="container">
		<view class="item" v-for="(item,index) in 10">
			<view class="top">
				<view class="left">
					<view class="title">
						成都家电上门维修服务，空调、热水器、洗衣机、冰箱、厨电、洗衣机、充电转、啥都修！
					</view>
					<view class="tip">
						<u-icon name="server-man" size="16" color="#ec613d"></u-icon><text class="gt">武侯·簇桥</text>
						<image src="/static/header-vip.png" class="badge" mode=""></image><text class="bt">认证企业</text>
					</view>
				</view>
				<view class="right">
					<image class="cover" src="https://mp-544a8cd9-03b3-41fd-9f50-daa7de994b60.cdn.bspapp.com/salePhine/微信图片_20220731222452.jpg" mode=""></image>
				</view>
			</view>
			<view class="btnBox">
				<view class="" style="flex: 1;"></view>
				<u-button type="primary" color="#5ec3a9" iconColor="#5ec3a9" icon="phone" shape="circle" :plain="true"  :customStyle="buttonStyle" throttleTime="1000" text="打电话" ></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"other-service",
		data() {
			return {
				buttonStyle:{width:'auto',minWidth:'164rpx',height:'66rpx'},
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

    .top {
      @include dflexsb;

      .left {
        flex: 1;
        line-height: 36rpx;

        .title {
          font-size: $uni-font-size-sm-base;
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; // 当属性值为3，表示超出3行隐藏
        }

        .tip {
          @include dflex;
          justify-content: flex-start;
          margin-top: 24rpx;

          .badge {
            width: 24rpx;
            height: 24rpx;
            margin: 0 4rpx 0 16rpx;
          }

          .gt {
            font-size: 22rpx;
            color: #7f7f7f;
          }

          .bt {
            font-size: $uni-font-size-sm;
            color: #000;
          }
        }
      }

      .right {
        width: 200rpx;
        height: 180rpx;
        margin-left: 24rpx;
        @include dflex;

        .cover {
          width: 190rpx;
          height: 176rpx;
          border-radius: 20rpx;
        }
      }
    }

    .btnBox {
      width: 100%;
      height: 70rpx;
      margin: 20rpx 0 0 0;
      @include dflex;
      justify-content: space-between;
    }
  }
}

</style>
