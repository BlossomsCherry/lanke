<template>
  <view class="user-info">
    <view
      :class="
        'user-avatar-view scene_' +
        scene +
        ' ' +
        global__platform__ +
        (is_show_detail ? '' : ' no-detail')
      "
    >
      <view class="avatar-wrap" @tap.stop.prevent="toSliderUrl(4, user.id)">
        <image
          class="user-avatar-image"
          compression="avatar"
          mode="aspectFill"
          :src="user.user_avatar"
        ></image>
        <image
          class="user-avatar-frame"
          v-if="user.avatar_frame_url"
          :src="user.avatar_frame_url"
          mode="aspectFill"
        ></image>
        <i
          class="avatar-authentication-icon mini-icon mini-verify"
          v-if="user.is_authentication == 1"
        ></i>

        <view class="gender-icon">
          <image src="@/static/tabbar/62.png" v-if="user.gender == 1"></image>
          <image src="@/static/tabbar/61.png" v-if="user.gender == 2"></image>
        </view>
      </view>

      <view class="user-view">
        <view class="user-name" @tap.stop.prevent="toSliderUrl(4, user.id)">
          <text :class="'user-nick-text ' + (user.honor ? 'has-honor' : '')">{{
            user.user_name
          }}</text>
          <!-- <i class="header-label gender-m-icon mini-icon mini-xingbienan" v-if="user.gender == 1"></i>
						<i class="header-label gender-w-icon mini-icon mini-xingbienv" v-if="user.gender == 2"></i> -->
          <i
            class="header-label official-icon mini-icon mini-renzhengguanli1"
            v-if="user.is_official == 1"
          ></i>
          <i
            class="header-label vip-icon mini-icon mini-vip"
            v-if="user.is_member == 1"
          ></i>
          <i :class="'header-label lv-icon mini-icon mini-lv' + user.lv"></i>
          <i class="header-label honor-icon" v-if="user.honor">
            <image
              class="honor-image"
              :src="user.honor"
              mode="widthFix"
            ></image>
          </i>
        </view>

        <block v-if="is_show_detail">
          <view class="time_and_address_wrap">
            <view class="format-time-view">{{ created_at1 }}</view>
            <block v-if="ip_address">
              <view class="post-info-view ip_address">{{ ip_address }}</view>
            </block>
            <block v-if="distance">
              <view class="post-info-view distance">{{ distance }}</view>
            </block>
            <block v-if="post_top && post_top > 0">
              <view
                class="post-info-view post_top"
                @tap.stop.prevent="toRealtimePost"
                ><i class="mini-icon mini-jiangbei"></i>热帖榜第{{
                  post_top
                }}名</view
              >
            </block>
          </view>
        </block>
        <slot name="desc"></slot>
      </view>
    </view>
    <slot name="right"></slot>
  </view>
</template>

<script>
  export default {
    name: 'user-info',
    computed: {
      is_show_detail: {
        get() {
          let that = this
          return (
            that.format_time != '' ||
            that.address != null ||
            that.device != '' ||
            that.post_top > 0
          )
        },
        set(v) {}
      },
      created_at1() {
        return this.created_at.slice(0, 16)
      }
    },
    data() {
      return {}
    },
    props: {
      user: {
        type: Object,
        required: true
      },
      format_time: {
        type: String,
        default: ''
      },
      device: {
        type: String,
        default: ''
      },
      post_top: {
        type: Number,
        default: 0
      },
      scene: {
        type: Number,
        default: 0
      },
      ip_address: {
        type: String,
        default: ''
      },
      distance: {
        type: String,
        default: ''
      },
      created_at: {
        type: String,
        default: ''
      }
    },
    methods: {
      toRealtimePost() {
        uni.wen.toUrl(6, '/pagesC/realtime/post', null)
      }
    }
  }
</script>

<style lang="scss">
  $post-list-sex-display: inline-block; // 文章列表是否显示性别，如果不想显示改为：none （默认值：inline-block ）

  .user-info {
    display: flex;
    justify-content: space-between;
    .user-avatar-view {
      display: flex;
      width: 483rpx;
      max-width: 483rpx;
      .avatar-wrap {
        margin-right: 22rpx;
        position: relative;

        .gender-icon {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 24rpx;
          height: 24rpx;
          image {
            width: 100%;
            height: 100%;
          }
        }

        .user-avatar-image {
          height: 68rpx;
          width: 68rpx;
          min-width: 68rpx;
          border-radius: 50%;
        }
        .user-avatar-frame {
          position: absolute;
          top: 0;
          left: 0;
          height: 68rpx;
          width: 68rpx;
          min-width: 68rpx;
          transform: scale(1.35);
        }
        .avatar-authentication-icon {
          position: absolute;
          bottom: 6%;
          right: -22%;
          width: 30rpx;
          max-width: 30rpx;
          height: 30rpx;
          max-height: 30rpx;
          line-height: 30rpx;
          @include background_color(page-box-background-color);
          border-radius: 50%;
        }
      }
      .time_and_address_wrap {
        display: flex;
        overflow: hidden;
      }

      .user-view {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .user-name {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .user-nick-text {
        max-width: 315rpx;
        height: 40rpx;
        font-size: $uni-font-size-base;
        font-weight: bold;
        @include color(color-light-dark);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .format-time-view {
        // @include color(color-lightest-dark);
        // opacity: 0.9;
        // font-size: 20rpx;
        font-size: 24rpx;
        color: #9e9e9e;
        white-space: nowrap;
      }
      .post-info-view {
        @include color(color-lightest-dark);
        font-size: 20rpx;
        font-weight: 400;
        margin-left: 30rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .post-info-view.distance {
        margin-left: 0;
      }
      .post_top.post-info-view .mini-icon {
        width: 26rpx;
        font-size: 20rpx;
        display: inline;
        margin-right: 6rpx;
        color: #4eb3ff;
      }
      .post-info-view .address-icon {
        width: 26rpx;
        margin-right: 6rpx;
        font-size: 20rpx;
        display: inline;
      }
      .address-tag-all-view {
        display: flex;
        height: 70rpx;
        margin-top: 20rpx;
      }

      .address-view {
        height: 36rpx;
        display: flex;
        align-items: center;
        margin-right: 14rpx;
        padding: 15rpx 20rpx 15rpx 10rpx;
        border-radius: 500rpx;
        border: 1px solid;
        @include border_color(border-color-box-item-background-color);
      }
      .header-label {
        width: 28rpx;
        height: 28rpx;
        line-height: 26rpx;
        font-size: $uni-font-size-base;
        margin-left: 8rpx;
        display: inline-block;
      }
      .header-label.honor-icon {
        width: 100rpx;
        height: unset;
        .honor-image {
          width: 100rpx;
          max-height: 40rpx;
        }
      }
      .header-label.lv-icon {
        width: 50rpx;
        // padding-left: 14rpx;
        // box-sizing: border-box;
        font-size: 42rpx;
        line-height: 22rpx;
      }
      .header-label.gender-m-icon,
      .header-label.gender-w-icon {
        display: $post-list-sex-display;
      }
    }

    .user-avatar-view.android {
      .post-info-view,
      .format-time-view {
        font-weight: 100;
        font-size: 24rpx;
        color: #9e9e9e;
      }
    }

    .user-avatar-view.no-detail {
      width: unset;
      .user-view {
      }
    }
    .user-avatar-view.scene_90002 {
      .avatar-wrap {
        height: 68rpx;
        line-height: 68rpx;
        .user-avatar-image {
          height: 55rpx;
          width: 55rpx;
          min-width: 55rpx;
          margin-top: 8rpx;
        }
        .user-avatar-frame {
          height: 55rpx;
          width: 55rpx;
          min-width: 55rpx;
          margin-top: 8rpx;
          transform: scale(1.35);
        }
        .avatar-authentication-icon {
          bottom: 1%;
          right: -33%;
          width: 15px;
          height: 15px;
          line-height: 15px;
          font-size: 15px;
          @include background_color(page-box-background-color);
          border-radius: 50%;
        }
      }
      .user-view {
        height: 68rpx;
        line-height: 68rpx;
        .user-name {
          .user-nick-text {
            height: 68rpx;
            line-height: 68rpx;
            /* #ifdef MP */
            max-width: 250rpx;
            /* #endif */
          }
          .header-label {
            /* #ifdef MP */
            display: none;
            /* #endif */
          }
        }
      }
    }
    .user-avatar-view.scene_15 {
      width: 360rpx;
      padding: 10rpx;
      box-sizing: border-box;
      height: 70rpx;
      .avatar-wrap {
        .user-avatar-image {
          height: 40rpx;
          width: 40rpx;
          min-width: 40rpx;
        }
        .user-avatar-frame {
          height: 40rpx;
          width: 40rpx;
          min-width: 40rpx;
        }
        .avatar-authentication-icon {
          width: 24rpx;
          height: 24rpx;
          bottom: 22%;
          right: -29%;
          font-size: $uni-font-size-sm;
        }
      }
      .user-view {
        .user-name {
          .user-nick-text {
            color: #6a6a6a;
            font-weight: normal;
            font-size: $uni-font-size-base;
          }
        }
      }
    }
  }
</style>
