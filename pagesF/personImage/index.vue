<script>
  import navBar from '@/components/common/navbar/navbar'
  import LClipper from '../lime-clipper/components/l-clipper/l-clipper.vue'

  const mixins = require('@/mixins/user')
  const common = require('@/mixins/common')
  var options = {}

  mixins(options)
  common(options)
  export default {
    mixins: [{ methods: options }],
    components: {
      navBar,
      LClipper
    },
    data() {
      return {
        avatar:
          'https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/2023/07/04/ad9c9d4443faac664e5d14c4dd22da16.png',
        avatarClipper: false,
        imagesubjectClipper: false,
        pic: '',
        nickName: '',
        avatarTmp: '',
        signature: '',
        wechatAccount: '',
        imagesubject: '',
        imagesubjectTmp: ''
      }
    },
    onLoad(options) {
      console.log(options, 'iiiiiiiiiiiiiiiiiii')
      this.nickName = options.nickName
      this.avatar = options.avatar
    },
    methods: {
      changeName() {
        // uni.wen.util.request(
        //   uni.wen.api.ApiRootUrl + 'user/update/info',
        //   { user_name: this.nickName },
        //   'POST'
        // )
        this.updateInfo({ nickName: this.nickName })
        uni.navigateTo({ url: `/pagesF/tags/index?nickName=${this.nickName}` })
      },
      clipperImage(e) {
        // this.$refs.avatar.fSelect()
        this.imageClipper(e.currentTarget.dataset.type)
      },
      addimage(e, _dataset) {
        let that = this
        /* ---处理dataset begin--- */
        that.datasetHandle(e, _dataset)
        /* ---处理dataset end--- */
        console.log(e)

        const name = e.currentTarget.dataset.name
        const type = e.currentTarget.dataset.type
        that.setData({ [type]: false })

        that
          .uploadPicturesPic(
            e.url,
            e.currentTarget.dataset.name,
            e.currentTarget.dataset.type,
            15
          )
          .then(() => {
            if (type == 'avatarClipper') {
              that
                .updateInfo({
                  avatar: that.avatarTmp,
                  nickName: this.nickName
                })
                .then(() => {
                  that.setData({
                    avatar: that.avatarTmp
                  })
                })
            } else {
              that
                .updateInfo({ imagesubject: that.imagesubjectTmp })
                .then(() => {
                  that.setData({ imagesubject: that.imagesubjectTmp })
                })
            }
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
      <view class="tag-title">形象，</view>
      <view class="tag-subtitle">打造个性ID，玩转岚客</view>

      <!-- <view class="tags-box">
        <image src="@/static/tabbar/212.svg"></image>
      </view> -->
      <!-- 头像 -->
      <view
        class="avater-wrapper"
        @tap.stop.prevent="clipperImage"
        data-type="avatarClipper"
      >
        <image
          class="image"
          :data-src="avatar"
          mode="aspectFill"
          :src="avatar"
        />
        <i
          class="mini-icon mini-xiangji camera-icon"
          @tap.stop.prevent="clipperImage"
          data-type="avatarClipper"
        />
      </view>

      <view class="name">
        <input type="text" placeholder="昵称" v-model="nickName" />
      </view>

      <view class="begin-btn" @click="changeName">下一步</view>

      <view class="bottom">
        <image src="@/static/tabbar/211.svg"></image>
      </view>
    </view>

    <l-clipper
      v-if="avatarClipper"
      :image-url="pic"
      @success="addimage($event, { name: 'avatarTmp', type: 'avatarClipper' })"
      @cancel="avatarClipper = false"
    />

    <l-clipper
      v-if="imagesubjectClipper"
      :image-url="pic"
      @success="
        addimage($event, {
          name: 'imagesubjectTmp',
          type: 'imagesubjectClipper'
        })
      "
      @cancel="imagesubjectClipper = false"
      :width="1000"
      :height="1000"
    />
  </view>
</template>

<style lang="scss" scoped>
  page {
    background: #f7f7f9;
  }
  .container {
    padding: 225rpx 48rpx 0 48rpx;
    .tag-header {
      .avater-wrapper {
        margin: auto;
        position: relative;
        width: 180rpx;
        height: 180rpx;
        margin-bottom: 54rpx;

        .image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .camera-icon {
          position: absolute;
          right: 10rpx;
          bottom: 0;
          width: 48rpx;
          height: 48rpx;
          color: white;
          text-align: center;
          border-radius: 50%;
          line-height: 48rpx;
          align-self: center;
          background-color: rgba(0, 0, 0, 0.8);
        }
      }

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
        display: flex;
        position: relative;
        height: 176rpx;
        margin-bottom: 54rpx;
        border-radius: 10rpx;

        image {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 176rpx;
          height: 176rpx;
        }
      }

      .name {
        text-align: center;
        margin-bottom: 58rpx;
        font-size: 32rpx;
        color: #c8c8c8;
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
