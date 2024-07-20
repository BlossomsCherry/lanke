<script>
  import navBar from '@/components/common/navbar/navbar'

  const mixins = require('@/mixins/user')
  const common = require('@/mixins/common')
  var options = {}

  mixins(options)
  common(options)
  export default {
    mixins: [{ methods: options }],
    components: {
      navBar
    },
    data() {
      return {
        currentIndex: [],
        tagList: [],
        nickName: '',
        avatar: '',
        gender: 1,
        flag: true
      }
    },
    onLoad(options) {
      this.nickName = options.nickName
      this.avatar = options.avatar
      this.gender = options.gender
      options.gender == 1 ? (this.flag = true) : (this.flag = false)
    },
    methods: {
      changeGender(index) {
        this.flag = !this.flag
      },
      addTag(index) {
        if (this.currentIndex.indexOf(index) === -1) {
          this.currentIndex.push(index)
        } else {
          this.currentIndex.splice(this.currentIndex.indexOf(index), 1)
        }
      },
      nextClick() {
        // const gender = Number(this.flag) === 0 ? 2 : 1
        this.gender = this.flag ? 1 : 2
        this.updateInfo().then(() => {
          uni.navigateTo({
            url: `/pagesF/personImage/index?nickName=${this.nickName}&avatar=${this.avatar}&gender=${this.gender}`
          })
        })
      }
    }
  }
</script>

<template>
  <view class="container">
    <view
      :class="
        'mini-page-wrap global-theme-' +
        global__theme__ +
        ' global-platform-' +
        global__platform__ +
        ' global-device-' +
        global__device__ +
        ' global-tenant-' +
        global__tenant__.tenant_id
      "
      :data-theme="global__theme__"
    >
      <navBar
        :back="true"
        :iconTheme="iconTheme"
        :color="'rgba(' + color + ', ' + navbarTrans + ')'"
        :home="fph"
        :placeholder="false"
      ></navBar>
    </view>

    <view class="tag-header">
      <view class="tag-title">基础信息，</view>
      <view class="tag-subtitle">完善个人信息，完善情绪版</view>

      <view class="gender-box">
        <view class="title">选择性别</view>
        <view class="box">
          <view class="man" @click="changeGender()">
            <image src="@/static/tabbar/man.svg"></image>
            <view class="circle" :class="{ active: flag }">
              <image src="@/static/tabbar/214.svg"></image>
            </view>
          </view>
          <view class="woman" @click="changeGender()">
            <image src="@/static/tabbar/woman.svg"></image>
            <view class="circle" :class="{ active: !flag }">
              <image src="@/static/tabbar/214.svg"></image>
            </view>
          </view>
        </view>
      </view>

      <view class="begin-btn" @click="nextClick">下一步</view>

      <view class="bottom">
        <image src="@/static/tabbar/210.svg"></image>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  .container {
    background-color: #f7f7f9;
    padding: 225rpx 48rpx 0 48rpx;
    .tag-header {
      .tag-title {
        margin-bottom: 20rpx;
        font-weight: bold;
        font-size: 56rpx;
        color: #000000;
      }

      .tag-subtitle {
        margin-bottom: 62rpx;
        font-size: 24rpx;
        color: #000000;
      }

      .gender-box {
        margin-bottom: 100rpx;
        .title {
          margin-bottom: 60rpx;
          font-size: 24rpx;
          color: #000000;
        }

        .box {
          display: flex;
          justify-content: center;
          column-gap: 102rpx;

          .man,
          .woman {
            display: flex;
            flex-direction: column;
            align-items: center;
            row-gap: 22rpx;

            image {
              width: 176rpx;
              height: 176rpx;
            }

            .circle {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 40rpx;
              height: 40rpx;
              background: #ffffff;
              border-radius: 100rpx;

              &.active {
                background: #00c78b;
              }

              image {
                width: 28rpx;
                height: 28rpx;
              }
            }
          }
        }
      }

      .begin-btn {
        width: 656rpx;
        height: 80rpx;
        margin-bottom: 290rpx;
        background: #242424;
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #ffffff;
        text-align: center;
        line-height: 80rpx;
      }

      .bottom {
        display: flex;
        justify-content: center;

        image {
          width: 371rpx;
          height: 420rpx;
        }
      }
    }
  }
</style>
