<template>
  <view class="post-footer">
    <view class="inner flex-row">
      <view class="left flex-row">
        <block v-if="config_app_post_list_footer.left">
          <view
            class="item flex-row"
            v-for="(item, index) in config_app_post_list_footer.left"
            :key="index"
            @tap.stop.prevent="tapfooter(item)"
          >
            <block v-if="item == 1">
              <!-- <i class="mini-icon mini-fenxiang2"></i> -->
              <image
                style="width: 36rpx; height: 25rpx"
                src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/67.svg"
              ></image>
            </block>
            <block v-else-if="item == 2">
              <block v-if="words.is_like">
                <i
                  :class="
                    'mini-icon mini-xihuan-shixin ' + (isLike ? 'loader45' : '')
                  "
                ></i>
                <view class="num">{{
                  words.like_count > 0
                    ? filters.toFix(words.like_count)
                    : '喜欢'
                }}</view>
              </block>
              <block v-else>
                <i class="mini-icon mini-xihuan-kongxin"></i>
                <!-- <image
                  style="width: 36rpx; height: 25rpx"
                  src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/69.svg"
                ></image> -->
                <view class="num">{{
                  words.like_count > 0
                    ? filters.toFix(words.like_count)
                    : '喜欢'
                }}</view>
              </block>
            </block>
            <block v-else-if="item == 3">
              <block v-if="words.is_collect">
                <i class="mini-icon mini-shoucang-shixin1"></i>
                <view class="num">{{
                  words.collected_count > 0
                    ? filters.toFix(words.collected_count)
                    : '收藏'
                }}</view>
              </block>
              <block v-else>
                <i class="mini-icon mini-shoucang-kongxin1"></i>
                <view class="num">{{
                  words.collected_count > 0
                    ? filters.toFix(words.collected_count)
                    : '收藏'
                }}</view>
              </block>
            </block>
            <block v-else-if="item == 4">
              <i class="mini-icon mini-a-pinglun2"></i>
              <!-- <image
                style="width: 36rpx; height: 25rpx"
                src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/68.svg"
              ></image> -->
              <view class="num">{{
                words.comment_count > 0
                  ? filters.toFix(words.comment_count)
                  : '评论'
              }}</view>
            </block>
            <block v-else-if="item == 5">
              <i class="mini-icon mini-toubi"></i>
              <view class="num">投币</view>
            </block>
            <block v-else-if="item == 6">
              <i class="mini-icon mini-chongdian"></i>
              <view class="num">充电</view>
            </block>
            <block v-else-if="item == 7">
              <i class="mini-icon mini-fufeituiguang1"></i>
              <view class="num">推广</view>
            </block>
          </view>
        </block>
      </view>
      <view class="right flex-row">
        <block v-if="config_app_post_list_footer.right">
          <view
            class="item flex-row"
            v-for="(item, index) in config_app_post_list_footer.right"
            :key="index"
            @tap.stop.prevent="tapfooter(item)"
          >
            <block v-if="item == 1">
              <i class="mini-icon mini-fenxiang2"></i>
            </block>
            <block v-else-if="item == 2">
              <block v-if="words.is_like">
                <i
                  :class="
                    'mini-icon mini-xihuan-shixin ' + (isLike ? 'loader45' : '')
                  "
                ></i>
                <view class="num">{{
                  words.like_count > 0
                    ? filters.toFix(words.like_count)
                    : '喜欢'
                }}</view>
              </block>
              <block v-else>
                <!-- <i class="mini-icon mini-xihuan-kongxin"></i> -->
                <image
                  style="width: 33rpx; height: 31rpx; margin-right: 12rpx"
                  src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/69.svg"
                ></image>
                <view class="num">{{
                  words.like_count > 0
                    ? filters.toFix(words.like_count)
                    : '喜欢'
                }}</view>
              </block>
            </block>
            <block v-else-if="item == 3">
              <block v-if="words.is_collect">
                <!-- <i class="mini-icon mini-shoucang-shixin1"></i> -->
                <image
                  style="width: 32rpx; height: 31rpx; margin-right: 12rpx"
                  src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/71.svg"
                ></image>
                <view class="num">{{
                  words.collected_count > 0
                    ? filters.toFix(words.collected_count)
                    : '收藏'
                }}</view>
              </block>
              <block v-else>
                <!-- <i class="mini-icon mini-shoucang-kongxin1"></i> -->
                <image
                  style="width: 32rpx; height: 31rpx; margin-right: 12rpx"
                  src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/66.svg"
                ></image>
                <view class="num">{{
                  words.collected_count > 0
                    ? filters.toFix(words.collected_count)
                    : '收藏'
                }}</view>
              </block>
            </block>
            <block v-else-if="item == 4">
              <!-- <i class="mini-icon mini-a-pinglun2"></i> -->
              <image
                style="width: 34rpx; height: 30rpx; margin-right: 12rpx"
                src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/68.svg"
              ></image>
              <view class="num">{{
                words.comment_count > 0
                  ? filters.toFix(words.comment_count)
                  : '评论'
              }}</view>
            </block>
            <block v-else-if="item == 5">
              <i class="mini-icon mini-toubi"></i>
              <view class="num">投币</view>
            </block>
            <block v-else-if="item == 6">
              <i class="mini-icon mini-chongdian"></i>
              <view class="num">充电</view>
            </block>
            <block v-else-if="item == 7">
              <i class="mini-icon mini-fufeituiguang1"></i>
              <view class="num">推广</view>
            </block>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
  let debounce = null
  export default {
    name: 'post-footer',
    components: {},
    computed: {
      config_app_post_list_footer: {
        get() {
          let that = this
          if (
            that.$store.state.config.app.post &&
            that.$store.state.config.app.post.list
          ) {
            return that.$store.state.config.app.post.list.footer
          }
          return {
            left: [1],
            right: [2, 3, 4]
          }
        },
        set(v) {}
      }
    },
    data() {
      return {
        cursor: 0,
        comment_content: '',
        comment_img: '',
        isShowImage: false,
        isEmoji: false,
        isScaleMax: false,
        minTextHeight: 8,
        textareaBottom: 0,
        isFocus: false,
        isShowCommentForm: false,
        isLike: false
      }
    },
    props: {
      words: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true
      }
    },
    created() {},
    methods: {
      tapfooter(item) {
        let that = this
        if (item == 1) {
          that.$emit('tapShare', {
            type: item,
            post_id: that.words.id,
            index: that.index
          })
        } else if (item == 2) {
          if (that.words.is_like) {
            that.isLike = false
          } else {
            that.isLike = true
          }
          that.$emit('taplikes', {
            type: item,
            post_id: that.words.id,
            index: that.index
          })
        } else if (item == 3) {
          that.$emit('tapCollect', {
            type: item,
            post_id: that.words.id,
            index: that.index
          })
        } else if (item == 4) {
          that.$emit('tapComment', {
            type: item,
            post_id: that.words.id,
            comment_count: that.words.comment_count
          })
        } else if (item == 5) {
          that.$emit('tapGiveCoin', {
            type: item,
            post_id: that.words.id,
            index: that.index
          })
        } else if (item == 6) {
          that.$emit('tapReward', {
            type: item,
            userid: that.words.user.id,
            post_id: that.words.id,
            index: that.index
          })
        } else if (item == 7) {
          uni.wen.toUrl(6, '/pagesC/promotion/post?id=' + that.words.id, that)
        }
      }
    }
  }
</script>

<style lang="scss">
  // 列表式
  $post-list-footer-share-icon: '\e67e'; // 分享图标，设置为 \e61e，会变成之前的版本的图标（默认值："\e67b"， 注意引号）
  $post-list-footer-icon-size: 36rpx; // 图标大小（默认值：46rpx）
  $post-list-footer-font-color: #141414; // 颜色（默认值：#141414 ）

  .post-footer {
    width: 750rpx;
    padding-top: 10rpx;
    .inner {
      width: $page-content-body-width-scend;
      margin: auto;
      justify-content: space-between;
      .left {
        .item {
          margin-right: 34rpx;
          @include color(color-dark);
          height: $post-list-footer-icon-size;
          line-height: $post-list-footer-icon-size;
          .mini-icon {
            display: inline;
            @include color(color-dark);
            font-size: $post-list-footer-icon-size;
            margin-right: 10rpx;
          }
          .num {
            font-size: $uni-font-size-sm-base;
            text-align: left;
          }
          .mini-icon.mini-xihuan-shixin {
            color: $uni-color-love !important;
          }
          .mini-icon.mini-shoucang-shixin1 {
            color: $uni-color-collected !important;
          }
          .mini-icon.mini-fufeituiguang1 {
            transform: scale(1.06);
          }
        }
      }
      .right {
        .item {
          margin-left: 34rpx;
          @include color(color-dark);
          height: $post-list-footer-icon-size;
          line-height: $post-list-footer-icon-size;
          .num {
            font-size: $uni-font-size-sm-base;
            text-align: left;
          }
          .mini-icon {
            display: inline;
            margin-right: 10rpx;
            @include color(color-dark);
            font-size: $post-list-footer-icon-size;
          }
          .mini-icon.mini-xihuan-shixin {
            color: $uni-color-love !important;
          }
          .mini-icon.mini-shoucang-shixin1 {
            color: $uni-color-collected !important;
          }
          .mini-icon.mini-fufeituiguang1 {
            transform: scale(1.06);
          }
        }
      }
      @keyframes loader45 {
        0% {
          transform: scale(0.95);
        }

        5% {
          transform: scale(1.1);
        }

        39% {
          transform: scale(0.85);
        }

        45% {
          transform: scale(1);
        }

        60% {
          transform: scale(0.95);
        }

        100% {
          transform: scale(0.9);
        }
      }
      .loader45 {
        animation: loader45 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
      }
    }
  }
  .mini-fenxiang2::before {
    /* #ifndef APP-PLUS */
    content: $post-list-footer-share-icon;
    /* #endif */
  }
</style>
