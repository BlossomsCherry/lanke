<script>
export default {
  name: "pet-adoption-mine",
  data() {
    return {
      list: [
        { label: '我的领养', icon: ['mini-icon-p', 'mini-lingyang'], type: 6, target: '/pagesP/pet-adoption/pet-common-list/index?type=1' },
        { label: '我的送养', icon: ['mini-icon-p', 'mini-songyang'], type: 6, target: '/pagesP/pet-adoption/pet-common-list/index?type=2' },
        { label: '我的收藏', icon: ['mini-icon', 'mini-shoucang-kongxin1'], type: 6, target: '/pagesP/pet-adoption/pet-common-list/index?type=3' },
      ]
    }
  },
  computed: {
	config_img:{
		get(){
			let that = this;
			if(that.$store.state.config && that.$store.state.config.img){
				return that.$store.state.config.img || {};
			}
			return {
				empty: "",
				default: "",
				default_avatar: ""
			};
		},
		set(v){}
	},
    isLogin() {
      return this.myUserInfo && this.myUserInfo.id > 0
    }
  }
}
</script>

<template>
  <view class="mine-wrapper">
    <view class="user-info-wrapper">
      <image class="avatar" :src="isLogin ? myUserInfo.user_avatar : config_img.default_avatar"/>
	  <block v-if="isLogin">
		  <view class="user-name">{{ myUserInfo.user_name }}</view>
	  </block>
	  <block v-else>
		  <view class="user-name" @tap.stop.prevent="toSliderUrl(-4, null)">{{ '未登录'  }}</view>
	  </block>
      
      <view v-if="isLogin" :class="['auth-name', myUserInfo.is_authentication ? 'auth' : '']" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/certification/certification')">
        <i v-if="myUserInfo.is_authentication" class="mini-icon-p mini-yishiming"/>
        <i v-else class="mini-icon-p mini-yishiming"/>
        <view class="label">{{ myUserInfo.is_authentication ? '已认证' : '去认证' }}</view>
      </view>
    </view>

    <view class="list-wrapper">
      <view class="item-wrapper" v-for="(item, index) in list" :key="index" @tap.stop.prevent="toSliderUrl(item.type, item.target)">
        <i :class="item.icon"/>
        <view class="label">{{ item.label }}</view>
        <view class="arrow-right">
          <u-icon name="arrow-right"/>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "@/pagesP/app.scss";

.mine-wrapper {
  min-height: calc(100vh - env(safe-area-inset-bottom) - 88px);
  background: $uni-bg-color-grey;

  .user-info-wrapper {
    margin-top: 88px;
    display: flex;
    align-items: center;
    padding: $uni-spacing-col-lg $page-row-spacing;
    background: white;
    border-radius: 0 0 $uni-border-radius-lg-est $uni-border-radius-lg-est;

    .avatar {
      width: 140rpx;
      height: 140rpx;
      border-radius: $uni-border-radius-circle;
    }

    .user-name {
      margin-left: $uni-spacing-row-lg;
      font-size: $uni-font-size-lg;
      font-weight: bold;
    }

    .auth-name {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: $uni-spacing-row-sm;
      font-size: $uni-font-size-medium;
      color: $uni-text-color-light;

      .auth {
        color: #bf78fb;
      }
    }
  }

  .list-wrapper {
    margin: 42rpx $page-row-spacing 0 $page-row-spacing;
    padding: $uni-spacing-col-lg $uni-spacing-row-lg;
    background: white;
    border-radius: $uni-border-radius-lg-er;

    .item-wrapper {
      padding: $uni-spacing-col-lg $uni-spacing-row-base;
      display: flex;
      align-items: center;
      font-size: 36rpx;
      font-weight: bold;
      gap: $uni-spacing-row-base;

      .arrow-right {
        margin-left: auto;
      }
    }
  }
}
</style>
