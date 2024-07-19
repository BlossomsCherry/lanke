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
        nickName: ''
      }
    },
    onLoad(options) {
      this.nickName = options.nickName
      uni.wen.util
        .request(uni.wen.api.ApiRootUrl + 'configData?which=2')
        .then(res => {
          this.tagList = res.data.user.labels
        })
    },
    methods: {
      addTag(index) {
        if (this.currentIndex.length > 5) {
          uni.showToast({
            title: '最多选择5个标签',
            icon: 'none',
            duration: 2000
          })

          return
        }
        if (this.currentIndex.indexOf(index) === -1) {
          this.currentIndex.push(index)
        } else {
          this.currentIndex.splice(this.currentIndex.indexOf(index), 1)
        }
      },
      beginClick() {
        const arr = this.currentIndex.map(item => {
          return this.tagList[item]
        })
        this.updateInfo({ tagList: arr }).then(() => {
          uni.navigateTo({ url: `/pages/tabbar/index/index` })
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
      <view class="tag-title">选择标签，</view>
      <view class="tag-subtitle">展示风格，个性化定制</view>

      <view class="tags-box">
        <scroll-view scroll-x="true" class="scroll-view">
          <view class="box">
            <view
              class="item"
              v-for="(item, index) in tagList.slice(0, 12)"
              :key="index"
              :class="{ active: currentIndex.includes(index) }"
              @click="addTag(index)"
              >{{ item }}</view
            >
          </view>
          <!-- <view class="box">
            <view
              class="item"
              v-for="(item, index) in tagList.slice(0, 12)"
              :key="index"
              :class="{ active: currentIndex.includes(index) }"
              @click="addTag(index)"
              >{{ item }}</view
            >
          </view> -->
        </scroll-view>
        <image src="@/static/tabbar/209.svg"></image>
      </view>

      <view class="begin-btn" @click="beginClick">开始体验</view>

      <view class="bottom">
        <image src="@/static/tabbar/210.svg"></image>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  page {
    background: #f7f7f9;
  }
  .container {
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

      .tags-box {
        position: relative;
        width: 656rpx;
        height: 320rpx;
        display: flex;
        padding: 54rpx 34rpx 88rpx 34rpx;
        margin-bottom: 60rpx;
        background: #d8d8d8;
        border-radius: 10rpx;
        overflow-x: scroll;
        box-sizing: border-box;

        .scroll-view {
          display: flex;
          width: 1400rpx;
          align-items: center;
        }

        .box {
          display: flex;
          flex-wrap: wrap;
          gap: 20rpx;
          overflow: hidden;
          .item {
            padding: 6rpx 24rpx;
            height: 46rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            border-radius: 25rpx;
            font-size: 24rpx;
            color: #000000;
            box-sizing: border-box;
            z-index: 2;

            &.active {
              background: #00c78b;
              color: #ffffff;
            }
          }
        }

        image {
          position: absolute;
          left: 0;
          top: 0;
          width: 656rpx;
          height: 320rpx;
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
