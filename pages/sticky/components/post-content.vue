<template>
  <view
    :class="'post-content-wrap ' + 'scene_' + scene + ' ' + global__platform__"
    @tap.stop.prevent="toDetail(words.id)"
  >
    <view class="inner">
      <view
        class="posts_title"
        v-if="words.posts_title && words.posts_title.length > 0"
        >{{ words.posts_title }}</view
      >
      <block v-if="scene == 9">
        <view @longpress.stop.prevent="stopPrevent">
          <view v-if="words.is_only_text == 1">
            <text
              :class="
                'content-view ' + (is_ellipsis ? 'ellipsis' : 'unellipsis')
              "
            >
              <text
                :class="'icon-text ' + only_text_icon"
                v-if="only_text_icon"
              ></text>
              {{ words.posts_content }}</text
            >
          </view>
          <view v-else>
            <mp-html
              ref="singleContent"
              :content="words.posts_content"
              :selectable="scene == 9"
              :lazyLoad="scene == 9"
              :loading-img="config_img.default"
              :error-img="config_img.default"
              :scroll-table="true"
              @imgtap="imgtext_imgtap"
              :class="
                'content-view ' + (is_ellipsis ? 'ellipsis' : 'unellipsis')
              "
              :pay_type="post_pay_type"
              :isSticky="words.is_sticky"
              :scene="scene"
              :isAdminDelete="words.posts_state == 2"
              :isInReview="words.is_examine"
            />
          </view>
        </view>
      </block>
      <block v-else>
        <view v-if="words.is_only_text == 1 && scene != 10">
          <text
            :class="'content-view ' + (is_ellipsis ? 'ellipsis' : 'unellipsis')"
          >
            <text
              :class="'icon-text ' + only_text_icon"
              v-if="only_text_icon"
            ></text>
            {{ words.posts_content }}</text
          >
        </view>
        <view v-else>
          <mp-html
            ref="singleContent"
            :content="words.posts_content"
            :selectable="scene == 9"
            :lazyLoad="scene == 9"
            :loading-img="config_img.default"
            :error-img="config_img.default"
            :scroll-table="true"
            @imgtap="imgtext_imgtap"
            :class="'content-view ' + (is_ellipsis ? 'ellipsis' : 'unellipsis')"
            :pay_type="post_pay_type"
            :isSticky="words.is_sticky"
            :scene="scene"
            :isAdminDelete="words.posts_state == 2"
            :isInReview="words.is_examine"
          />
        </view>
      </block>

      <!-- todo: -->
      <view
        class="content-tag-view"
        @tap.stop.prevent="toTagesInfo(tag.id, tag.tags_name)"
        v-if="words.tags && words.tags.length > 0"
        v-for="(tag, index1) in words.tags"
        :key="index1"
      >
        <text class="view-text _text" :selectable="true"
          >#{{ tag.tags_name }}</text
        >
      </view>

      <view
        class="content-view-unfold"
        v-if="is_ellipsis"
        @tap.stop.prevent="unfoldTap"
        :data-id="words.id"
      >
        <view>...</view>
        <view class="unfold-text">展开</view>
      </view>

      <view
        class="pay_fold"
        v-if="is_content_pay && words.pay_obj.words_percent != 100"
        @tap.stop.prevent="showPayContent"
      >
        <text class="pay_tip" :selectable="true" :user-select="true">{{
          '需付费' +
          words.pay_obj.price +
          words.pay_obj.credit +
          '查看剩余' +
          (100 - words.pay_obj.words_percent) +
          '%的内容'
        }}</text>
        <view class="s-arrows">
          <view class="arrow arrow1"></view>
          <view class="arrow arrow2"></view>
        </view>
      </view>

      <view
        class="hidden_not_payd"
        v-if="is_content_pay && words.pay_obj.has_hidden > 0"
        @tap.stop.preventp="showPayContent"
      >
        <image
          src="@/static/tabbar/70.png"
          style="width: 26rpx; height: 26rpx"
        ></image>
        <view>付费解锁后可观看</view></view
      >

      <block v-if="words.vote && words.vote.id">
        <view class="vote-wrap">
          <view class="vote-list">
            <view
              :class="item.selected ? 'option vote-selected' : 'option'"
              v-for="(item, index) in words.vote.vtList"
              :key="index"
              @tap.stop.prevent="SelectVote(postIndex, words.vote.id, item.p)"
            >
              <view class="option-bar"></view>
              <view
                class="_progess"
                :style="
                  'width: ' +
                  (item.percent && item.percent.length > 0
                    ? item.percent
                    : '0%') +
                  ';'
                "
              ></view>
              <view class="option-title">
                <text class="_text" :selectable="true" :user-select="true"
                  >{{ item.title }}
                </text>
                <i
                  class="icon-gou mini-icon mini-icon_669"
                  v-if="item.selected"
                ></i>
              </view>
              <view class="number">{{ item.num }}</view>
            </view>
          </view>
          <view class="vote-info">
            <view class="voted-title">{{ words.vote.voted_title }}</view>
            <text class="joinnums">{{ words.vote.nums }}人参与</text>
          </view>
        </view>
      </block>
    </view>
    <block v-if="media_style == 1">
      <view
        :class="['inner', 'media_type_1', { is_content_pay: is_content_pay }]"
      >
        <view
          v-if="
            words.video == null &&
            words.post_type != 'single' &&
            words.images &&
            words.images.length > 0
          "
          class="img-lists"
        >
          <block v-if="words.images.length == 1">
            <view class="one-pictures-box">
              <block v-for="(imgItem, index1) in words.images" :key="index1">
                <block v-if="imgItem.width > 750 && imgItem.height > 0">
                  <image
                    @tap.stop.prevent="previewImgFunc(index1)"
                    :class="
                      'one-pictures1' +
                      (words.is_blur == 1 ? ' img-blur' : '') +
                      (imgItem.is_pay == 1 ? ' img_lock' : '')
                    "
                    mode="widthFix"
                    :src="imgItem.img_url"
                  ></image>
                </block>
                <block v-else-if="imgItem.width > 0 && imgItem.height > 0">
                  <image
                    @tap.stop.prevent="previewImgFunc(index1)"
                    :style="
                      'width: ' +
                      imgItem.width +
                      'rpx;height: ' +
                      imgItem.height +
                      'rpx;'
                    "
                    :class="
                      'one-pictures2' +
                      (words.is_blur == 1 ? ' img-blur' : '') +
                      (imgItem.is_pay == 1 ? ' img_lock' : '')
                    "
                    mode="widthFix"
                    :src="imgItem.img_url"
                  ></image>
                </block>
                <block v-else>
                  <image
                    @tap.stop.prevent="previewImgFunc(index1)"
                    :class="
                      'one-pictures3' +
                      (words.is_blur == 1 ? ' img-blur' : '') +
                      (imgItem.is_pay == 1 ? ' img_lock' : '')
                    "
                    mode="heightFix"
                    :src="imgItem.img_url"
                  ></image>
                </block>
              </block>
            </view>
          </block>
          <block v-else>
            <view
              v-for="(imgItem, index1) in words.images"
              :key="index1"
              :class="
                'grid-img-box' +
                (words.images && words.images.length == 4
                  ? ' four-picture'
                  : '')
              "
            >
              <image
                @tap.stop.prevent="previewImgFunc(index1)"
                :class="
                  'image-box' +
                  (words.is_blur == 1 ? ' img-blur' : '') +
                  (imgItem.is_pay == 1 ? ' img_lock' : '')
                "
                mode="aspectFill"
                :src="imgItem.img_url"
              ></image>
              <view
                class="img-count-tip"
                v-if="words.img_count > 9 && index1 == 8 && imgItem.is_pay != 1"
                >+{{ words.img_count - 9 }}</view
              >
            </view>
          </block>
          <view class="blur-tips" v-if="words.is_blur == 1"
            >图片疑似引人不适</view
          >
        </view>

        <block v-if="config_app_mode != 'examine'">
          <view
            :class="
              'videomodel ' +
              (words.video.show_type == 0 ? 'h-video' : 'w-video')
            "
            v-if="
              words.video != null &&
              words.video != '' &&
              words.post_type != 'single'
            "
            @tap.stop.prevent="stopPrevent"
          >
            <!-- #ifndef MP -->
            <!-- <j-video :slide="config_page_sticky_video_slide" :post_id="words.id" :url="words.video.video_url" :poster="words.video.video_thumb_url"
							height="390rpx" width="710rpx" v-if="words.video.show_type != 0"></j-video>
						<j-video :slide="config_page_sticky_video_slide" :post_id="words.id" :url="words.video.video_url" :poster="words.video.video_thumb_url"
							height="490rpx" width="390rpx" v-else></j-video> -->
            <yingbing-video
              ref="wordVideo"
              :src="words.video.video_url"
              :style="
                'height:' + words.video.display_height + 'rpx;width: 710rpx;'
              "
              :poster="words.video.video_thumb_url"
              v-if="words.video.show_type != 0"
              @fullscreenChange="fullscreen"
              @play="mpvideoPlay"
            ></yingbing-video>
            <yingbing-video
              ref="wordVideo"
              :src="words.video.video_url"
              :style="
                'height:' + words.video.display_height + 'rpx;width: 710rpx;'
              "
              :poster="words.video.video_thumb_url"
              v-else
              @fullscreenChange="fullscreen"
              @play="mpvideoPlay"
            ></yingbing-video>
            <!-- #endif -->

            <!-- #ifdef MP -->
            <view class="video-height">
              <video
                :id="'wordVideo-' + words.video.id"
                class="mpvideo video-image z-i4"
                @tap.stop.prevent="mpvideoPlay"
                @ended="
                  () => {
                    isplaying = false
                  }
                "
                @pause="
                  () => {
                    isplaying = false
                  }
                "
                :unit-id="vutad"
                :controls="true"
                :show-fullscreen-btn="true"
                :enable-play-gesture="true"
                :show-play-btn="true"
                :poster-for-crawler="words.video.video_thumb_url"
                :poster="words.video.video_thumb_url"
                :enable-progress-gesture="true"
                :autoplay="isplaying"
                object-fit="contain"
                :enable-auto-rotation="true"
                :src="fakeVideoUrl"
              ></video>
            </view>
            <!-- #endif -->
          </view>
        </block>
      </view>
    </block>
    <block v-else-if="media_style == 2">
      <view class="media_type_2">
        <view
          class="swiper-container"
          :style="'height: ' + (words.swiperImgHeight + 23) + 'rpx;'"
        >
          <swiper
            :autoplay="false"
            :circular="true"
            interval="3000"
            :indicator-dots="words.images && words.images.length > 1"
            easing-function="easeOutCubic"
            class="switem"
            @change="imgSwiperChange"
          >
            <block
              v-for="(images_item, images_index) in words.images"
              :key="images_item.id"
            >
              <swiper-item>
                <view
                  class="swiper-content"
                  :style="
                    'max-height: ' +
                    words.swiperImgHeight +
                    'rpx;height: 100%;wdith:100%;max-width:750rpx;'
                  "
                >
                  <block v-if="images_item.width == 750">
                    <image
                      :class="
                        '_image ' + (images_item.is_pay == 1 ? ' img_lock' : '')
                      "
                      style="width: 750rpx"
                      :src="images_item.img_url"
                      mode="widthFix"
                      @tap.stop.prevent="previewImgFunc(images_index)"
                    />
                  </block>
                  <block v-else-if="images_item.width > 0">
                    <image
                      :class="
                        '_image ' + (images_item.is_pay == 1 ? ' img_lock' : '')
                      "
                      :style="
                        'width: ' +
                        images_item.width +
                        'rpx;height: ' +
                        images_item.height +
                        'rpx;'
                      "
                      :src="images_item.img_url"
                      mode="widthFix"
                      @tap.stop.prevent="previewImgFunc(images_index)"
                    />
                  </block>
                  <block v-else>
                    <image
                      :class="
                        '_image ' + (images_item.is_pay == 1 ? ' img_lock' : '')
                      "
                      :style="'width: 750rpx;'"
                      :src="images_item.img_url"
                      mode="widthFix"
                      @tap.stop.prevent="previewImgFunc(images_index)"
                    />
                  </block>
                </view>
              </swiper-item>
            </block>
          </swiper>
          <view
            class="img_tips_count"
            v-if="words.images && words.images.length > 1"
            >{{ current_img_index }} / {{ words.img_count }}</view
          >
        </view>
      </view>
    </block>
    <block v-else-if="media_style == 3">
      <block v-if="config_app_mode != 'examine'">
        <view class="media_type_3">
          <view
            :class="
              'videomodel ' +
              (words.video.show_type == 0 ? 'h-video' : 'w-video')
            "
            v-if="
              words.video != null &&
              words.video != '' &&
              words.post_type != 'single'
            "
            @tap.stop.prevent="stopPrevent"
          >
            <!-- #ifndef MP -->
            <yingbing-video
              ref="wordVideo"
              :src="words.video.video_url"
              :style="
                'height:' + words.video.display_height + 'rpx;width: 750rpx;'
              "
              :poster="words.video.video_thumb_url"
              v-if="words.video.show_type != 0"
              @fullscreenChange="fullscreen"
              @play="mpvideoPlay"
            ></yingbing-video>
            <yingbing-video
              ref="wordVideo"
              :src="words.video.video_url"
              :style="
                'height:' + words.video.display_height + 'rpx;width: 750rpx;'
              "
              :poster="words.video.video_thumb_url"
              v-else
              @fullscreenChange="fullscreen"
              @play="mpvideoPlay"
            ></yingbing-video>
            <!-- <j-video :slide="config_page_sticky_video_slide" :post_id="words.id" :url="words.video.video_url" :poster="words.video.video_thumb_url" styles="background-color: #000000;border-radius: 0;"
							height="490rpx" width="750rpx" v-if="words.video.show_type != 0"></j-video>
						<j-video :slide="config_page_sticky_video_slide" :post_id="words.id" :url="words.video.video_url" :poster="words.video.video_thumb_url" styles="background-color: #000000;border-radius: 0;"
							height="690rpx" width="750rpx" v-else></j-video> -->
            <!-- #endif -->

            <!-- #ifdef MP -->
            <view class="video-height">
              <video
                :id="'wordVideo-' + words.video.id"
                class="mpvideo video-image z-i4"
                @play.stop.prevent="mpvideoPlay"
                @ended="
                  () => {
                    isplaying = false
                  }
                "
                @pause="
                  () => {
                    isplaying = false
                  }
                "
                :unit-id="vutad"
                :controls="true"
                :show-fullscreen-btn="true"
                :enable-play-gesture="true"
                :show-play-btn="true"
                :poster-for-crawler="words.video.video_thumb_url"
                :poster="words.video.video_thumb_url"
                :enable-progress-gesture="true"
                :autoplay="isplaying"
                object-fit="contain"
                :enable-auto-rotation="true"
                :src="fakeVideoUrl"
              ></video>
            </view>
            <!-- #endif -->
          </view>
        </view>
      </block>
    </block>

    <!-- #ifdef MP-WEIXIN -->
    <block v-if="words.wechat_sph && words.wechat_sph.type">
      <view class="sph-view" @tap.stop.prevent="stopPrevent">
        <view class="inner">
          <mini-sph
            :type="words.wechat_sph.type"
            :feedToken="words.wechat_sph.feed_token"
            styles="width: 710rpx; height: 600rpx; border-radius: 8rpx;"
          />
        </view>
      </view>
    </block>
    <!-- #endif -->

    <block v-if="words.voter_id > 0 && words.voter">
      <view class="inner">
        <view
          class="voter-view"
          :style="'background-image: url(' + words.voter.banners[0] + ');'"
          @tap.stop.prevent="toSliderUrl(33, words.voter.id)"
        >
          <view class="voter-info">
            <view class="voter-title u-line-1">{{ words.voter.title }}</view>
            <view class="voter-master">
              <view class="master">
                <image
                  class="_image"
                  :src="words.voter.master_user_avatar"
                ></image>
                <view class="_name">{{ words.voter.master_user_name }}</view>
              </view>
              <view></view>
            </view>
          </view>
        </view>
      </view>
    </block>

    <view
      class="refer-view"
      v-if="
        words.refer_id && words.refer_id > 0 && words.refer && words.refer.id
      "
      @tap.stop.prevent="toReferer(words.refer.id)"
    >
      <view class="inner refter-user-view">
        <view class="content_raw">
          <view class="user_name" style="color: #366092"
            >@{{ words.refer.user.user_name }}：</view
          >
          {{ words.refer.posts_content_raw }}
        </view>
      </view>
      <view style="height: 10rpx"></view>
      <view class="inner media_type_1">
        <view
          v-if="
            words.refer.video == null &&
            words.refer.post_type != 'single' &&
            words.refer.images &&
            words.refer.images.length > 0
          "
          class="img-lists"
        >
          <block v-if="words.refer.images.length == 1">
            <view class="one-pictures-box">
              <block
                v-for="(imgItem, index1) in words.refer.images"
                :key="index1"
              >
                <block v-if="imgItem.width > 750 && imgItem.height > 0">
                  <image
                    :class="
                      'one-pictures1' +
                      (words.refer.is_blur == 1 ? ' img-blur' : '') +
                      (imgItem.is_pay == 1 ? ' img_lock' : '')
                    "
                    mode="widthFix"
                    :src="imgItem.img_url"
                  ></image>
                </block>
                <block v-else-if="imgItem.width > 0 && imgItem.height > 0">
                  <image
                    :style="
                      'width: ' +
                      imgItem.width +
                      'rpx;height: ' +
                      imgItem.height +
                      'rpx;'
                    "
                    :class="
                      'one-pictures2' +
                      (words.is_blur == 1 ? ' img-blur' : '') +
                      (imgItem.is_pay == 1 ? ' img_lock' : '')
                    "
                    mode="widthFix"
                    :src="imgItem.img_url"
                  ></image>
                </block>
                <block v-else>
                  <image
                    :class="
                      'one-pictures3' +
                      (words.refer.is_blur == 1 ? ' img-blur' : '') +
                      (imgItem.is_pay == 1 ? ' img_lock' : '')
                    "
                    mode="heightFix"
                    :src="imgItem.img_url"
                  >
                  </image>
                </block>
              </block>
            </view>
          </block>
          <block v-else>
            <view
              v-for="(imgItem, index1) in words.refer.images"
              :key="index1"
              :class="
                'grid-img-box ' +
                (words.refer.images && words.refer.images.length == 4
                  ? ' four-picture'
                  : '')
              "
            >
              <image
                :class="
                  'image-box' +
                  (words.refer.is_blur == 1 ? ' img-blur' : '') +
                  (imgItem.is_pay == 1 ? ' img_lock' : '')
                "
                mode="aspectFill"
                :src="imgItem.img_url"
              ></image>
              <view
                class="img-count-tip"
                v-if="
                  words.refer.img_count > 9 &&
                  index1 == 8 &&
                  imgItem.is_pay != 1
                "
                >+{{ words.refer.img_count - 9 }}</view
              >
            </view>
          </block>
          <view class="blur-tips" v-if="words.refer.is_blur == 1"
            >图片疑似引人不适</view
          >
        </view>

        <block v-if="config_app_mode != 'examine'">
          <view
            :class="
              'videomodel ' +
              (words.refer.video.show_type == 0 ? 'h-video' : 'w-video')
            "
            v-if="
              words.refer.video != null &&
              words.refer.video != '' &&
              words.refer.post_type != 'single'
            "
            @tap.stop.prevent="stopPrevent"
          >
            <!-- #ifndef MP -->
            <yingbing-video
              ref="referVideo"
              :src="words.refer.video.video_url"
              :style="
                'height:' +
                words.refer.video.display_height +
                'rpx;width: 750rpx;'
              "
              :poster="words.refer.video.video_thumb_url"
              v-if="words.refer.video.show_type != 0"
              @fullscreenChange="fullscreen"
              @play="referMpvideoPlay"
            ></yingbing-video>
            <yingbing-video
              ref="referVideo"
              :src="words.refer.video.video_url"
              :style="
                'height:' +
                words.refer.video.display_height +
                'rpx;width: 750rpx;'
              "
              :poster="words.refer.video.video_thumb_url"
              v-else
              @fullscreenChange="fullscreen"
              @play="referMpvideoPlay"
            ></yingbing-video>
            <!-- <j-video :slide="config_page_sticky_video_slide" :post_id="words.refer.id" :url="words.refer.video.video_url" :poster="words.refer.video.video_thumb_url"
							height="390rpx" width="710rpx" v-if="words.refer.video.show_type != 0"></j-video>
						<j-video :slide="config_page_sticky_video_slide" :post_id="words.refer.id" :url="words.refer.video.video_url" :poster="words.refer.video.video_thumb_url"
							height="490rpx" width="390rpx" v-else></j-video> -->
            <!-- #endif -->

            <!-- #ifdef MP -->
            <view class="video-height">
              <video
                :id="'referVideo' + words.refer.video.id"
                class="mpvideo video-image z-i4"
                @play.stop.prevent="referMpvideoPlay"
                @ended="
                  () => {
                    referIsplaying = false
                  }
                "
                @pause="
                  () => {
                    referIsplaying = false
                  }
                "
                :unit-id="vutad"
                :controls="true"
                :show-fullscreen-btn="true"
                :enable-play-gesture="true"
                :show-play-btn="true"
                :poster-for-crawler="words.refer.video.video_thumb_url"
                :poster="words.refer.video.video_thumb_url"
                :enable-progress-gesture="true"
                :autoplay="referIsplaying"
                object-fit="contain"
                :enable-auto-rotation="true"
                :src="referFakeVideoUrl"
              ></video>
            </view>
            <!-- #endif -->
          </view>
        </block>
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <block v-if="words.refer.wechat_sph && words.refer.wechat_sph.type">
        <view class="sph-view" @tap.stop.prevent="stopPrevent">
          <view class="inner">
            <mini-sph
              :type="words.refer.wechat_sph.type"
              :feedToken="words.refer.wechat_sph.feed_token"
              styles="width: 710rpx; height: 600rpx; border-radius: 8rpx;"
            />
          </view>
        </view>
      </block>
      <!-- #endif -->
      <block v-if="words.refer.voter_id > 0 && words.refer.voter">
        <view class="inner">
          <view
            class="voter-view"
            :style="
              'background-image: url(' + words.refer.voter.banners[0] + ');'
            "
          >
            <view class="voter-info">
              <view class="voter-title u-line-1">{{
                words.refer.voter.title
              }}</view>
              <view class="voter-master">
                <view class="master">
                  <image
                    class="_image"
                    :src="words.refer.voter.master_user_avatar"
                  ></image>
                  <view class="_name">{{
                    words.refer.voter.master_user_name
                  }}</view>
                </view>
                <view></view>
              </view>
            </view>
          </view>
        </view>
      </block>
    </view>

    <view class="inner">
      <view class="sounds-list" v-if="words.sounds && words.sounds.length > 0">
        <view
          class="gurudin-audio light"
          v-for="(sound, sound_index) in words.sounds"
          :key="sound_index"
        >
          <view class="gurudin-poster">
            <image
              :src="words.squre"
              v-if="words.squre != ''"
              class="_image musicRotate"
              :class="{ musicPaused: !sound.isPlay }"
            ></image>
            <view class="tools" @tap.stop.prevent="sounds_play(sound_index)">
              <image
                class="_image"
                :src="sound.isPlay ? sounds_icon.pause : sounds_icon.play"
              ></image>
            </view>
          </view>
          <view class="gurudin-content">
            <view class="title">
              {{ sound.name }}
              <view class="time">{{ sounds_formatTime(sound.startTime) }}</view>
            </view>
            <view class="author">{{ words.user.user_name }}</view>
          </view>
        </view>
      </view>

      <view class="file-list" v-if="words.files && words.files.length > 0">
        <view
          class="file-item"
          v-for="(file, file_index) in words.files"
          :key="file.id"
        >
          <view class="name"
            ><i class="mini-icon mini-file1"></i>{{ file.name }}</view
          >
          <view
            class="down"
            @tap.stop.prevent="showPayContent"
            v-if="file.is_pay && file.is_pay == 1"
            >解锁</view
          >
          <block v-else>
            <view class="copy down" @tap.stop.prevent="copy_content(file.url)"
              >复制url</view
            >
            <view class="down" @tap.stop.prevent="download_file(file.url)"
              >下载</view
            >
          </block>
        </view>
      </view>

      <block v-if="words.goods && words.goods.length > 0">
        <view class="shop-goods-view">
          <swiper
            :indicator-dots="words.goods.length > 1"
            :autoplay="true"
            :interval="3000"
            :duration="1000"
            class="goods-swiper"
          >
            <block v-for="(git, index) in words.goods" :key="git.id">
              <swiper-item>
                <view
                  class="goods-tiem"
                  @tap.stop.prevent="toSliderUrl(3, git.id)"
                >
                  <view class="left">
                    <image
                      class="_image"
                      :src="git.pic[0]"
                      mode="aspectFill"
                    ></image>
                  </view>
                  <view class="right">
                    <view class="top">
                      <view class="name">
                        {{ git.name }}
                      </view>
                    </view>
                    <view class="bottom">
                      <view class="_left">
                        <block v-if="git.vip_price">
                          <view class="vip-price">
                            ￥<view class="num">{{ git.vip_price }}</view
                            >会员价
                          </view>
                          <view class="price"> ￥{{ git.price }} </view>
                        </block>
                        <block v-else>
                          <view class="price"> ￥{{ git.price }} </view>
                        </block>
                      </view>
                      <view class="_right" v-if="git.buys > 0"
                        >{{ git.buys }}次购买</view
                      >
                    </view>
                  </view>
                </view>
              </swiper-item>
            </block>
          </swiper>
        </view>
      </block>

      <block v-if="words.used_goods && words.used_goods.length > 0">
        <view class="used-goods-view">
          <swiper
            :indicator-dots="words.used_goods.length > 1"
            :autoplay="true"
            :interval="3000"
            :duration="1000"
            class="used-goods-swiper"
          >
            <block v-for="(item, index) in words.used_goods" :key="index">
              <swiper-item>
                <view
                  class="list_box"
                  @tap.stop.prevent="toSliderUrl(28, item.id)"
                >
                  <view class="list_box_cont">
                    <image
                      class="image"
                      :src="item.pic"
                      mode="aspectFill"
                    ></image>
                    <view class="cont">
                      <view class="title u-line-1">
                        {{ item.title }}
                      </view>
                      <view class="pirce"><text>￥</text>{{ item.price }}</view>
                      <view class="tip"> 想要{{ item.needed_count }} </view>
                    </view>
                  </view>
                </view>
              </swiper-item>
            </block>
          </swiper>
        </view>
      </block>

      <block v-if="words.bureau_list && words.bureau_list.length > 0">
        <view class="bureau-list-view">
          <swiper
            :indicator-dots="words.bureau_list.length > 1"
            :autoplay="true"
            :interval="3000"
            :duration="1000"
            class="bureau-swiper"
          >
            <block v-for="(item, index) in words.bureau_list" :key="index">
              <swiper-item>
                <view
                  class="list_box"
                  @tap.stop.prevent="toSliderUrl(34, item.id)"
                >
                  <view class="list_box_cont">
                    <image
                      class="image"
                      :src="item.pic"
                      mode="aspectFill"
                    ></image>
                    <view class="cont">
                      <view class="title u-line-1">
                        {{ item.title }}
                      </view>
                      <view class="pirce">{{ item.least_price_tip }}</view>
                      <view class="other-text-wrapper">
                        <u-icon name="clock" size="25" color="A3A3A3" />
                        <view class="time">{{
                          item.service_date_start +
                          ' ' +
                          item.service_time_start
                        }}</view>
                      </view>

                      <view class="other-text-wrapper">
                        <u-icon name="map" size="25" color="A3A3A3" />
                        <view class="address"
                          >{{ item.distance }} {{ item.address_detailed }}</view
                        >
                      </view>
                    </view>
                  </view>
                </view>
              </swiper-item>
            </block>
          </swiper>
        </view>
      </block>

      <view style="height: 15rpx"></view>

      <view class="address-circle-info">
        <block v-if="words.address && words.address.address_detailed">
          <view
            class="address-view"
            @tap.stop.prevent="openmap"
            :data-lat="words.address.latitude"
            :data-lng="words.address.longitude"
            :data-name="words.address.address_detailed"
          >
            <view class="left">
              <i class="mini-icon mini-dizhi3"></i>
            </view>
            <view class="right">
              <text class="address-text">{{
                words.address.address_detailed
              }}</text>
            </view>
          </view>
        </block>

        <block v-if="scene != 6 && words.circle">
          <view
            class="address-view circle-view"
            @tap.stop.prevent="toSliderUrl(2, words.circle.id)"
          >
            <view class="left">
              <image
                class="_image"
                :src="words.circle.head_portrait"
                mode="aspectFit"
              ></image>
            </view>
            <view class="right">
              <text class="address-text">{{ words.circle.circle_name }}</text>
            </view>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
  import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html'
  export default {
    name: 'post-content',
    components: {
      mpHtml
    },
    computed: {
      is_ellipsis: {
        get() {
          let that = this
          if (that.scene == 9) {
            return false
          }
          if (that.words.is_content_beyond) {
            return true
          }
          return false
        },
        set(v) {}
      },
      config_img: {
        get() {
          let that = this
          if (that.$store.state.config && that.$store.state.config.img) {
            return that.$store.state.config.img || {}
          }
          return {
            empty: '',
            default: '',
            default_avatar: ''
          }
        },
        set(v) {}
      },
      is_content_pay: {
        get() {
          let that = this
          if (
            that.words.pay_obj &&
            that.words.pay_obj.is_payd == false &&
            that.words.pay_obj.price > 0
          ) {
            return true
          }
          return false
        },
        set(v) {}
      },
      media_style: {
        get() {
          let that = this
          if (that.showDetailSwpier) {
            return 0
          }
          if (
            that.$store.state.config.app.post &&
            that.$store.state.config.app.post.list
          ) {
            if (that.$store.state.config.app.post.list.media == 2) {
              if (that.words.video) {
                return 3
              }
              if (that.words.is_blur != 0) {
                return 1
              }
              if (that.words.post_type == 'single') {
                return 1
              }
              if (
                that.words.refer_id &&
                that.words.refer_id > 0 &&
                that.words.refer &&
                that.words.refer.id
              ) {
                return 1
              }
              if (that.words.images.length > 0) {
                return 2
              }
            }
          }
          return 1
        },
        set(v) {}
      },
      config_app_mode: {
        get() {
          let that = this
          return that.$store.state.config.app.mode
        },
        set(v) {}
      },
      config_page_sticky_video_slide: {
        get() {
          let that = this
          if (that.$store.state.config.app.mode == 'examine') {
            return false
          }
          if (that.$store.state.config.page.sticky) {
            return that.$store.state.config.page.sticky.video_slide
          }
          return false
        },
        set(v) {}
      },
      fakeVideoUrl: {
        get() {
          let that = this
          if (that.words.video && that.words.video.id) {
            if (that.isVideoTaped) {
              return that.words.video.video_url
            }
            if (that.isplaying) {
              return that.words.video.video_url
            } else {
              if (that.words.video.show_type == 0) {
                return uni.wen.api.homeUrl + '/statics/video/710x390.mp4'
              } else {
                return uni.wen.api.homeUrl + '/statics/video/390x490.mp4'
              }
            }
          } else {
            return null
          }
        },
        set(v) {}
      },
      referFakeVideoUrl: {
        get() {
          let that = this
          if (
            that.words.refer &&
            that.words.refer.video &&
            that.words.refer.video.id
          ) {
            if (that.isReferVideoTaped) {
              return that.words.refer.video.video_url
            }
            if (that.referIsplaying) {
              return that.words.refer.video.video_url
            } else {
              if (that.words.refer.video.show_type == 0) {
                return uni.wen.api.homeUrl + '/statics/video/710x390.mp4'
              } else {
                return uni.wen.api.homeUrl + '/statics/video/390x490.mp4'
              }
            }
          } else {
            return null
          }
        },
        set(v) {}
      },
      post_pay_type: {
        get() {
          return this.words?.pay_obj?.pay_type ?? -1
        },
        set(v) {}
      },
      only_text_icon: {
        get() {
          let icon = ''
          if (this.words.posts_state == 2) {
            icon = 'isAdminDelete-icon'
          } else if (this.words.is_examine === 0) {
            icon = 'isInReview-icon'
          } else if (this.words.is_examine == 2) {
            icon = 'reviewBack-icon'
          }

          if (this.words.is_sticky) {
            icon += ' isSticky-icon'
          }

          if (this.post_pay_type == 0) {
            icon += ' pay-coins-icon'
          } else if (this.post_pay_type == 1) {
            icon += ' pay-balance-icon'
          }
          return icon
        },
        set(v) {}
      }
    },
    data() {
      return {
        popupshow: '',
        sounds_icon: {
          play: 'data:image/png;base64,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',
          pause:
            'data:image/png;base64,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'
        },
        isplaying: false,
        referIsplaying: false,
        current_img_index: 1,

        isVideoTaped: false,
        isReferVideoTaped: false,

        wordVideoContext: null,
        referVideoContext: null
      }
    },
    onLoad: function (options) {
      let that = this
    },
    props: {
      postIndex: {
        type: Number,
        require: true
      },
      scene: {
        type: Number,
        default: 0
      },
      words: {
        type: Object,
        required: true
      },
      showDetailSwpier: {
        type: Boolean,
        default: false
      }
    },
    created() {
      uni.$eventBus.$on('stopAllVideo', this.stopAllVideo)
    },
    beforeDestroy() {
      uni.$eventBus.$off('stopAllVideo', this.stopAllVideo)
    },
    methods: {
      fullscreen(flag) {
        if (flag.fullscreen) {
          this.$store.commit('updateFullgreen', true)
        } else {
          this.$store.commit('updateFullgreen', false)
        }
      },
      imgSwiperChange(e) {
        let that = this
        that.current_img_index = e.detail.current + 1
      },
      openmap(e) {
        var lng = parseFloat(e.currentTarget.dataset.lng)
        var lat = parseFloat(e.currentTarget.dataset.lat)
        var name = e.currentTarget.dataset.name
        uni.openLocation({
          latitude: lat,
          longitude: lng,
          scale: 8,
          name: name,
          success: function () {
            console.log('openLocation success')
          },
          fail: function (err) {
            console.log('openLocation err', err)
          }
        })
      },
      stopPrevent() {
        return false
      },
      toReferer(id) {
        let that = this
        let civ =
          that.words.refer.circle && that.words.refer.circle.can_i_visit
            ? that.words.refer.circle.can_i_visit
            : 0
        if (civ == 2) {
          if (that.scene == 60001) {
            uni.showToast({
              title: '请先加入圈子',
              icon: 'none'
            })
          } else {
            uni.wen.toUrl(2, that.words.refer.circle.id + '&civ=' + civ)
          }
          return false
        }
        if (that.words.refer.presets) {
          console.log('object')
          that.toSliderUrl(1, id + '&presets=' + that.words.refer.presets)
          return false
        }
        that.toSliderUrl(1, id)
      },
      toDetail(id) {
        let that = this

        console.log(that.is_content_pay, 'that.is_content_pay')
        if (that.is_content_pay) return

        if (that.scene != 9) {
          let civ =
            that.words.circle && that.words.circle.can_i_visit
              ? that.words.circle.can_i_visit
              : 0
          if (civ == 2) {
            if (that.scene == 60001) {
              uni.showToast({
                title: '请先加入圈子',
                icon: 'none'
              })
            } else {
              uni.wen.toUrl(2, that.words.circle.id + '&civ=' + civ)
            }
            return false
          }
          if (that.words.presets) {
            console.log('object')
            that.toSliderUrl(1, id + '&presets=' + that.words.presets)
            return false
          }
          that.toSliderUrl(1, id)
        }
        return false
      },
      stopAllVideo(e) {
        let that = this
        if (e.id && e.id == that.words?.video?.id) {
          return false
        }
        if (e.id && e.id == that.words?.refer?.video?.id) {
          return false
        }
        if (that.isplaying || that.referIsplaying) {
          // #ifndef MP
          if (that.isplaying) {
            let wordVideo = that.$refs.wordVideo
            if (wordVideo) {
              wordVideo.pause()
              that.isplaying = false
            }
          }
          if (that.referIsplaying) {
            let referVideo = that.$refs.referVideo
            if (referVideo) {
              referVideo.pause()
              that.referIsplaying = false
            }
          }
          // #endif
          // #ifdef MP
          if (that.isplaying) {
            if (that.wordVideoContext === null) {
              uni
                .createSelectorQuery()
                .in(this)
                .select('#wordVideo-' + that.words.video.id)
                .context(res => {
                  if (res) {
                    that.wordVideoContext = res.context
                    if (that.wordVideoContext) {
                      if (!that.wordVideoContext.paused) {
                        that.wordVideoContext.pause()
                        that.isplaying = false
                      }
                    }
                  }
                })
                .exec()
            } else {
              if (that.wordVideoContext) {
                if (!that.wordVideoContext.paused) {
                  that.wordVideoContext.pause()
                  that.isplaying = false
                }
              }
            }
          }
          if (that.referIsplaying) {
            if (that.referVideoContext === null) {
              uni
                .createSelectorQuery()
                .in(this)
                .select('#referVideo' + that.words.refer.video.id)
                .context(res => {
                  if (res) {
                    that.referVideoContext = res.context
                    if (that.referVideoContext) {
                      if (!that.referVideoContext.paused) {
                        that.referVideoContext.pause()
                        that.referIsplaying = false
                      }
                    }
                  }
                })
                .exec()
            } else {
              if (that.referVideoContext) {
                if (!that.referVideoContext.paused) {
                  that.referVideoContext.pause()
                  that.referIsplaying = false
                }
              }
            }
          }
          // #endif
        }
      },
      referMpvideoPlay() {
        let that = this
        if (that.referIsplaying) {
          that.referIsplaying = false
          return false
        }
        let civ =
          that.words.circle && that.words.circle.can_i_visit
            ? that.words.circle.can_i_visit
            : 0
        if (civ == 2) {
          if (that.scene == 60001) {
            uni.showToast({
              title: '请先加入圈子',
              icon: 'none'
            })
          } else {
            uni.wen.toUrl(2, that.words.circle.id + '&civ=' + civ)
          }
          return false
        }

        if (that.isReferVideoTaped) {
          uni.$eventBus.$emit('stopAllVideo', { id: that.words.refer.video.id })
          that.referIsplaying = true
        } else {
          that.isReferVideoTaped = true
          // #ifdef MP
          if (that.config_page_sticky_video_slide) {
            if (that.scene == 6) {
              uni.navigateTo({
                url:
                  '/pagesC/video/slide?id=' +
                  that.words.refer.id +
                  '&is_circle=1'
              })
            } else {
              uni.navigateTo({
                url: '/pagesC/video/slide?id=' + that.words.refer.id
              })
            }
            return false
          }
          // #endif
          uni.$eventBus.$emit('stopAllVideo', { id: that.words.refer.video.id })
          that.referIsplaying = true
        }
      },
      mpvideoPlay() {
        let that = this
        if (that.isplaying) {
          that.isplaying = false
          return false
        }
        let civ =
          that.words.circle && that.words.circle.can_i_visit
            ? that.words.circle.can_i_visit
            : 0
        if (civ == 2) {
          if (that.scene == 60001) {
            uni.showToast({
              title: '请先加入圈子',
              icon: 'none'
            })
          } else {
            uni.wen.toUrl(2, that.words.circle.id + '&civ=' + civ)
          }
          return false
        }

        if (that.isVideoTaped) {
          uni.$eventBus.$emit('stopAllVideo', { id: that.words.video.id })
          that.isplaying = true
        } else {
          that.isVideoTaped = true
          // #ifdef MP
          if (that.config_page_sticky_video_slide) {
            if (that.scene == 6) {
              uni.navigateTo({
                url: '/pagesC/video/slide?id=' + that.words.id + '&is_circle=1'
              })
            } else {
              uni.navigateTo({
                url: '/pagesC/video/slide?id=' + that.words.id
              })
            }
            return false
          }
          // #endif
          uni.$eventBus.$emit('stopAllVideo', { id: that.words.video.id })
          that.isplaying = true
        }
      },
      imgtext_imgtap(e) {
        let that = this
        var singleContent = this.$refs.singleContent
        // 暂时使用原生
        let url = singleContent.imgList[e.i]
        let styleNames = that.$store.state.config.img.styleNames || new Array()

        if (url) {
          if (styleNames.length > 0) {
            for (var i = 0; i < styleNames.length; i++) {
              if (styleNames[i].charAt(0) == '/') {
                url = url.replace(styleNames[i], '')
              }
            }
          }
          const index = url.indexOf('?imageMo')
          if (index >= 0) {
            url = url.slice(0, index)
          }
        }
        let imagesArr_ = []
        if (singleContent.imgList) {
          for (var j = 0; j < singleContent.imgList.length; j++) {
            let img_ = singleContent.imgList[j]

            if (styleNames.length > 0) {
              for (var i = 0; i < styleNames.length; i++) {
                if (styleNames[i].charAt(0) == '/') {
                  img_ = img_.replace(styleNames[i], '')
                }
              }
            }

            const index = img_.indexOf('?imageMo')
            if (index >= 0) {
              img_ = img_.slice(0, index)
            }

            imagesArr_.push(img_)
          }
        } else {
          imagesArr_ = [url]
        }

        if (imagesArr_.length > 9) {
          imagesArr_ = imagesArr_.slice(0, 8)
        }

        uni.previewImage({
          current: url,
          urls: imagesArr_
        })
        return false
      },
      SelectVote(postIndex, vote_id, position) {
        let that = this
        let civ =
          that.words.circle && that.words.circle.can_i_visit
            ? that.words.circle.can_i_visit
            : 0
        if (civ == 2) {
          if (that.scene == 60001) {
            uni.showToast({
              title: '请先加入圈子',
              icon: 'none'
            })
          } else {
            uni.wen.toUrl(2, that.words.circle.id + '&civ=' + civ)
          }
          return false
        }
        that.$emit('pSelectVote', {
          postIndex: postIndex,
          vote_id: vote_id,
          position: position
        })
      },
      sounds_formatTime(second) {
        if (second == 0) {
          return '00:00'
        }

        let mm = Number((second / 60).toFixed(0))
        mm = mm < 10 ? '0' + mm : mm

        let ss = Number((second % 60).toFixed(0))
        ss = ss < 10 ? '0' + ss : ss

        return mm + ':' + ss
      },
      sounds_play(index) {
        let that = this
        let civ =
          that.words.circle && that.words.circle.can_i_visit
            ? that.words.circle.can_i_visit
            : 0
        if (civ == 2) {
          if (that.scene == 60001) {
            uni.showToast({
              title: '请先加入圈子',
              icon: 'none'
            })
          } else {
            uni.wen.toUrl(2, that.words.circle.id + '&civ=' + civ)
          }
          return false
        }
        if (that.words.sounds[index]['isPlay']) {
          // 暂停播放
          that.sound_pause(index)
        } else {
          for (let i = 0; i < that.words.sounds.length; i++) {
            if (i != index) {
              that.sound_pause(i)
            }
          }
          that.$emit('soundPlayCall', that.words.id)
          that.sound_play(index)
        }
      },
      sound_play(index) {
        let that = this
        that.words.sounds[index]['isPlay'] = true

        if (that.words.sounds[index]['innerAudioContext'] == null) {
          let innerAudioContext = uni.createInnerAudioContext()
          innerAudioContext.src = that.words.sounds[index]['url']
          innerAudioContext.loop = false
          // innerAudioContext.obeyMuteSwitch = false;
          innerAudioContext.autoplay = false
          that.words.sounds[index]['innerAudioContext'] = innerAudioContext
        }

        // 是否准备完成
        that.words.sounds[index]['innerAudioContext'].onCanplay(() => {
          that.words.sounds[index]['duration'] =
            that.words.sounds[index]['innerAudioContext'].duration
        })

        // 开始播放
        that.words.sounds[index]['innerAudioContext'].play()

        // 音频播放进度更新事件
        that.words.sounds[index]['innerAudioContext'].onTimeUpdate(() => {
          if (that.words.sounds[index]['duration'] == 0) {
            that.words.sounds[index]['duration'] =
              that.words.sounds[index]['innerAudioContext'].duration
          } else {
            that.words.sounds[index]['playProgress'] = (
              (Number(that.words.sounds[index]['startTime'].toFixed(2)) /
                that.words.sounds[index]['duration']) *
              100
            ).toFixed(2)
          }

          that.words.sounds[index]['startTime'] =
            that.words.sounds[index]['innerAudioContext'].currentTime
          that.$forceUpdate()
        })

        // 播放完成事件
        that.words.sounds[index]['innerAudioContext'].onEnded(() => {
          that.words.sounds[index]['startTime'] = 0
          that.words.sounds[index]['playProgress'] = 0

          that.sound_pause(index)
        })

        // 音源错误
        that.words.sounds[index]['innerAudioContext'].onError(res => {
          that.words.sounds[index]['isPlay'] = false
          uni.showModal({
            title: '提示',
            content: '系统错误',
            showCancel: false
          })
        })
        that.$emit('forceUpdate')
      },
      sound_pause(index) {
        let that = this
        if (that.words.sounds[index]['innerAudioContext'] != null) {
          that.words.sounds[index]['isPlay'] = false
          that.words.sounds[index]['innerAudioContext'].pause()
          that.$forceUpdate()
        }
      },
      unfoldTap() {
        let that = this
        that.$emit('unfoldTap', that.postIndex)
      },
      showPayContent() {
        let that = this
        that.$emit('showPayContent', that.postIndex)
      },
      toTagesInfo(id, name) {
        uni.wen.toUrl(5, id + '&name=' + name, null)
      },
      previewImgFunc(index) {
        let that = this

        let civ =
          that.words.circle && that.words.circle.can_i_visit
            ? that.words.circle.can_i_visit
            : 0
        if (civ == 2) {
          if (that.scene == 60001) {
            uni.showToast({
              title: '请先加入圈子',
              icon: 'none'
            })
          } else {
            uni.wen.toUrl(2, that.words.circle.id + '&civ=' + civ)
          }
          return false
        }

        if (that.words.images[index]['is_pay'] == 1) {
          that.showPayContent()
          return false
        }

        var url = that.words.images[index]['img_url']
        var list = that.words.images
        // 暂时使用原生
        var imagesArr = []
        let styleNames = that.$store.state.config.img.styleNames || new Array()

        if (url) {
          if (styleNames.length > 0) {
            for (var i = 0; i < styleNames.length; i++) {
              if (styleNames[i].charAt(0) == '/') {
                url = url.replace(styleNames[i], '')
              }
            }
          }

          const index = url.indexOf('?imageMo')
          if (index >= 0) {
            url = url.slice(0, index)
          }
        }

        if (list) {
          for (var j = 0; j < list.length; j++) {
            let img_ = list[j].img_url

            if (styleNames.length > 0) {
              for (var i = 0; i < styleNames.length; i++) {
                if (styleNames[i].charAt(0) == '/') {
                  img_ = img_.replace(styleNames[i], '')
                }
              }
            }

            const index = img_.indexOf('?imageMo')
            if (index >= 0) {
              img_ = img_.slice(0, index)
            }

            imagesArr.push(img_)
          }
        } else {
          imagesArr = [url]
        }

        if (imagesArr.length > 9) {
          imagesArr = imagesArr.slice(0, 8)
        }

        uni.previewImage({
          current: url,
          urls: imagesArr
        })
        return false
      },
      getVideoUrl(e) {
        let that = this
        that.indexvideo = e.currentTarget.dataset.videopost
        that.video = e.currentTarget.dataset.video
        that.popupshow = true
      },
      popuphidden() {
        let that = this
        that.video = ''
        that.popupshow = false
      },
      copy_content(content) {
        uni.setClipboardData({
          data: content.toString(),
          success(res) {
            uni.getClipboardData({
              success(res) {
                uni.showToast({
                  title: '复制成功',
                  icon: 'none',
                  mask: 'true'
                })
              }
            })
          },

          fail(res) {
            console.log('复制出错' + JSON.stringify(res))
          }
        })
      },
      download_file(url) {
        let that = this
        let civ =
          that.words.circle && that.words.circle.can_i_visit
            ? that.words.circle.can_i_visit
            : 0
        if (civ == 2) {
          if (that.scene == 60001) {
            uni.showToast({
              title: '请先加入圈子',
              icon: 'none'
            })
          } else {
            uni.wen.toUrl(2, that.words.circle.id + '&civ=' + civ)
          }
          return false
        }
        // #ifdef H5
        const { platform } = uni.getSystemInfoSync()
        if (platform === 'ios') {
          uni.showToast({
            title: '因iphone系统限制，请使用安卓下载',
            icon: 'none'
          })
        } else {
          window.location.href = url
        }
        // #endif
        // #ifdef APP || MP-WEIXIN
        uni.loading(true)
        let task = uni.downloadFile({
          url: url,
          success(res) {
            uni.loading(false)
            if (res.statusCode === 200) {
              uni.showToast({
                title: '下载成功，正在尝试打开',
                icon: 'none'
              })
              uni.openDocument({
                filePath: res.tempFilePath,
                showMenu: true,
                success(data) {
                  console.log(data)
                }
              })
            }
          },
          error() {
            uni.loading(false)
            uni.showToast({
              title: '下载失败',
              icon: 'none'
            })
          }
        })
        // #endif
      }
    }
  }
</script>

<style lang="scss">
  // 笔记内页
  $sticky-clrcle-mini-display: inline-flex; // 笔记内页的小圈子是否显示，改成 inline-flex 可显示和列表一样的小圈子（默认值：none ）

  .post-content-wrap {
    .inner {
      display: block;
      width: $page-content-body-width;
      margin: auto;
    }
    .media_type_2,
    .media_type_3 {
      width: 750rpx;
    }
    .inner.media_type_1 {
      &.is_content_pay {
        position: relative;
        height: 222rpx;
        overflow: hidden;

        &::after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          content: '';
          height: 222rpx;
          z-index: 9999;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.52) 32%,
            #ffffff 100%
          );
        }
      }

      .videomodel {
        margin-top: 20rpx;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .w-video {
        width: $page-content-body-width;
        .video-height {
          height: 490rpx;
          width: 100%;
        }
        .mpvideo {
          width: $page-content-body-width;
          height: 490rpx;
        }
      }

      .h-video {
        width: $page-content-body-width;
        .video-height {
          width: 100%;
          height: 690rpx;
        }
        .mpvideo {
          width: $page-content-body-width;
          height: 690rpx;
        }
      }

      .videomodel .video-image {
        width: 100%;
        height: 100%;
        border-radius: 8rpx;
        position: absolute;
      }

      .videomodel .z-i4 {
        z-index: 4;
      }

      .videomodel .vide-icon-box {
        position: absolute;
        z-index: 2;
        width: 90rpx;
        height: 90rpx;
        border-radius: 90rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, $uni-mask-opacity);
      }

      .videomodel .vide-icon-box .vide-icon {
        width: 56rpx;
        height: 56rpx;
      }
    }
    .media_type_3 {
      .videomodel {
        width: 750rpx;
        border-radius: 0;
        .mpvideo {
          border-radius: 0;
          width: 750rpx;
        }
        .video-image {
          width: 100%;
          height: 100%;
          border-radius: 0;
          position: absolute;
        }
      }
      .videomodel.w-video {
        .video-height {
          width: 100%;
          height: 490rpx;
        }
        .mpvideo {
          height: 490rpx;
        }
      }
      .videomodel.h-video {
        .video-height {
          width: 100%;
          height: 690rpx;
        }
        .mpvideo {
          height: 690rpx;
        }
      }
    }
    .posts_title {
      @include color(color-dark);
      font-size: $uni-font-size-lg;
    }
    .content-view {
      margin: 6rpx auto;
      font-size: $uni-font-size-medium;
      width: $page-content-body-width;
      line-height: 50rpx;
      @include color(color-light-dark);
      display: block;
      overflow: hidden;
      .icon-text::before,
      .icon-text::after {
        font-family: 'mini-icon' !important;
        font-size: $uni-font-size-base;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
      }
      .icon-text.isSticky-icon::before {
        content: '\e657';
        color: #13cbb9;
        margin-right: 10rpx;
      }
      .icon-text.isInReview-icon::before {
        content: '\e6ab';
        color: #008df0;
        margin-right: 10rpx;
      }
      .icon-text.reviewBack-icon::before {
        content: '\e69b';
        color: red;
        margin-right: 10rpx;
      }
      .icon-text.isAdminDelete-icon::before {
        content: '\e696';
        color: #000000;
        margin-right: 10rpx;
      }
      .icon-text.pay-coins-icon::after {
        content: '\e6aa';
        color: #ce994f;
        margin-right: 10rpx;
      }
      .icon-text.pay-balance-icon::after {
        content: '\e6bd';
        color: #ce994f;
        margin-right: 10rpx;
      }
    }

    .unellipsis {
      max-height: auto;
      transition: max-height 2.5s ease-in, height 2.5s ease-in;
    }

    .content-view-unfold {
      width: $page-content-body-width;
      margin-bottom: 26rpx;
      display: flex;
      @include color(color-light-dark);
      font-size: $uni-font-size-sm-base;
      font-weight: 540;
      justify-content: space-between;
    }

    .swiper-container {
      width: 100%;
      margin: 0rpx auto;
      position: relative;
      @include background_color(page-box-background-color);
      .img_tips_count {
        top: 15rpx;
        position: absolute;
        bottom: 50rpx;
        right: 20rpx;
        font-size: 20rpx;
        color: #fff;
        background: rgba(0, 0, 0, 0.3);
        width: 80rpx;
        height: 45rpx;
        border-radius: 45rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .switem {
        width: 100% !important;
        height: 100% !important;
        animation: fadeIn 1s ease;
        .swiper-content {
          display: flex;
          justify-content: center;
          position: relative;
          overflow: hidden;
          ._image {
            display: block;
            margin: auto;
            align-self: center;
          }
        }
      }
    }

    .content-tag-view {
      display: inline-block;
      margin-right: 24rpx;
      margin-bottom: 15rpx;
    }
    .content-tag-view ._text {
      @include color(color-topic);
      font-size: $uni-font-size-medium;
    }
    .post-bottom-info {
      display: flex;
    }

    .view-image {
      width: 38rpx;
      height: 38rpx;
    }

    .view-text {
      font-size: $uni-font-size-sm;
      line-height: 36rpx;
      @include color(color-lightest-dark);
      font-weight: 400;
      margin-left: 6rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tag-view {
      margin-right: 14rpx;
      padding: 15rpx 20rpx 15rpx 10rpx;
      height: 36rpx;
      display: flex;
      align-items: center;
      border-radius: 500rpx;
      border: 1px solid;
      @include border_color(border-color-box-item-background-color);
    }

    .address-circle-info {
      display: flex;
      flex-wrap: wrap;
      .address-view {
        @include background_color(page-box-item-background-color);
        display: inline-flex;
        height: 40rpx;
        line-height: 40rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
        margin-bottom: 15rpx;
        .left {
          background-color: #12c05f;
          width: 40rpx;
          height: 40rpx;
          text-align: center;
          border-radius: 8rpx;
          .mini-icon {
            @include color(color-box-bg);
          }
          ._image {
            width: 40rpx;
            height: 40rpx;
          }
        }
        .right {
          padding-right: 15rpx;
          padding-left: 15rpx;
          @include background_color(page-body-background-color);
          .address-text {
            @include color(color-light-dark);
            max-width: 700rpx;
            font-size: 25rpx;
            display: inline-flex;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .address-view.circle-view {
        .left {
          background-color: transparent;
          ._image {
            border-radius: 8rpx;
          }
        }
      }
    }

    .shop-goods-view {
      width: $page-content-body-width;
      min-height: 150rpx;
      max-height: 150rpx;
      .goods-swiper {
        height: 150rpx;
      }
      .goods-tiem {
        @include background_color(page-box-item-background-color);
        display: flex;
        min-height: 120rpx;
        max-height: 120rpx;
        padding: 6rpx;
        box-sizing: border-box;
        width: $page-content-body-width;
        border-radius: 8rpx;
        .left {
          margin-right: 20rpx;
          ._image {
            height: 108rpx;
            width: 108rpx;
            border-radius: 8rpx;
          }
        }
        .right {
          width: 560rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 15rpx 0;
          .top {
            .name {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: $uni-font-size-sm-base;
            }
          }
          .bottom {
            display: flex;
            justify-content: space-between;
            ._left {
              display: flex;
              .vip-price {
                font-size: 22rpx;
                color: #daa520;
                margin-right: 10rpx;
                .num {
                  display: inline-block;
                  font-size: $uni-font-size-sm-base;
                }
              }
              .price {
                @include color(color-lightest-dark);
                font-size: 22rpx;
                display: inline-flex;
                align-items: flex-end;
              }
            }
            ._right {
              font-size: 22rpx;
              color: #939393;
            }
          }
        }
      }
    }

    .used-goods-view {
      width: $page-content-body-width;
      min-height: 150rpx;
      max-height: 150rpx;
      .used-goods-swiper {
        height: 150rpx;
      }
      .list_box {
        display: flex;
        flex-direction: column;
        .list_box_cont {
          @include background_color(page-box-item2-background-color);
          padding: 16rpx;
          border-radius: 10rpx;
          display: flex;
          align-items: center;
          position: relative;
          > .image {
            width: 120rpx;
            min-width: 120rpx;
            height: 120rpx;
            border-radius: 20rpx;
          }

          .cont {
            display: flex;
            flex-direction: column;
            min-height: 120rpx;
            height: 120rpx;
            justify-content: space-between;
            padding-left: 20rpx;
            .title {
              text-align: left;
              @include color(color-light-dark);
              font-weight: bold;
              font-size: $uni-font-size-sm-base;
              white-space: nowrap; // 强制一行显示
              overflow: hidden; // 超出隐藏
              text-overflow: ellipsis; // 省略号
              width: 480rpx;
            }

            .pirce {
              font-weight: bold;
              font-size: $uni-font-size-base;
              color: #ff0000;

              text {
                font-size: 22rpx;
              }
            }

            .tip {
              font-size: 22rpx;
              @include color(color-lightest-dark);
            }
          }
        }
      }
    }

    .bureau-list-view {
      width: $page-content-body-width;
      min-height: 210rpx;
      max-height: 210rpx;
      .bureau-swiper {
        height: 210rpx;
      }
      .list_box {
        display: flex;
        flex-direction: column;
        .list_box_cont {
          @include background_color(page-box-item2-background-color);
          padding: 16rpx;
          border-radius: 10rpx;
          display: flex;
          align-items: center;
          position: relative;
          > .image {
            width: 150rpx;
            min-width: 150rpx;
            height: 180rpx;
            border-radius: 10rpx;
          }

          .cont {
            display: flex;
            flex-direction: column;
            min-height: 180rpx;
            height: 180rpx;
            justify-content: space-between;
            padding-left: 20rpx;
            .title {
              text-align: left;
              @include color(color-light-dark);
              font-weight: bold;
              font-size: $uni-font-size-sm-base;
              white-space: nowrap; // 强制一行显示
              overflow: hidden; // 超出隐藏
              text-overflow: ellipsis; // 省略号
              width: 480rpx;
            }

            .pirce {
              font-size: $uni-font-size-sm-base;
              color: #ff0000;
            }

            .other-text-wrapper {
              display: flex;
              align-items: center;
              gap: 12rpx;
              font-size: $uni-font-size-sm;
              @include color(color-lightest-est-er-dark);
              line-height: 26rpx;
            }
          }
        }
      }
    }

    .img-lists {
      margin-top: 10rpx;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      position: relative;
    }

    .img-lists .four-picture:nth-child(2n) {
      margin-right: 30rpx !important;
    }

    .grid-img-box {
      width: 230rpx;
      height: 230rpx;
      border-radius: $uni-border-radius-sm;
      position: relative;
      margin-right: 10rpx;
      margin-bottom: 10rpx;
      .image-box {
        width: 230rpx;
        height: 230rpx;
        border-radius: $uni-border-radius-sm;
        position: relative;
      }
      .img-count-tip {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.25);
        color: #ffffff;
        font-size: $uni-font-size-lg-er;
      }
    }
    .grid-img-box:nth-child(3n) {
      margin-right: 0;
    }
    .grid-img-box.four-picture:nth-child(3n) {
      margin-right: 10rpx;
    }

    .one-pictures-box {
      overflow: hidden;
      margin-bottom: 10rpx;
      position: relative;
    }
    .one-pictures1 {
      width: $page-content-body-width;
      border-radius: $uni-border-radius-sm;
      position: relative;
    }
    .one-pictures2 {
      border-radius: $uni-border-radius-sm;
      position: relative;
    }
    .one-pictures3 {
      height: 400rpx;
      border-radius: $uni-border-radius-sm;
      position: relative;
    }
    .unfold-text {
      color: $uni-color-primary;
    }
    .hidden_not_payd {
      // @include background_color(page-gray-background-color);
      position: absolute;
      bottom: 80rpx;
      left: 0;
      display: flex;
      column-gap: 10rpx;
      align-items: center;
      justify-content: center;
      // padding: 20rpx;
      overflow: hidden;
      width: $page-content-body-width;
      box-sizing: border-box;
      // height: 140rpx;
      // line-height: 100rpx;
      // text-align: center;
      font-weight: 400;
      font-size: 24rpx;
      color: #d5a637;
      white-space: nowrap;
      z-index: 99999;
    }
    .file-list {
      margin-top: 10rpx;
      .file-item {
        display: flex;
        justify-content: space-between;
        @include background_color(page-gray-background-color);
        padding: 10px;
        box-sizing: border-box;
        font-size: 13px;
        margin-bottom: 5px;
        width: $page-content-body-width;
        .mini-icon {
          color: slategray;
          margin-right: 5rpx;
          display: inline-block;
        }
        .name {
          width: 500rpx;
          @include color(color-light-dark);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .down {
          color: grey;
          white-space: nowrap;
        }
      }
    }

    .sounds-list {
      .light {
        border: 2rpx solid;
        @include background_color(relative-background-color);
        @include border_color(border-color-box-item-background-color);
        .gurudin-poster {
          @include background_color(page-light2-line-background-color);
        }

        .gurudin-content {
          .title {
            @include color(color-light-dark);
            .time {
              @include color(color-lightest-dark);
            }
          }

          .author {
            @include color(color-lightest-dark);
          }
        }
      }

      .dark {
        border: 2rpx solid #17233d;
        background: #515a6e;

        .gurudin-poster {
          background: #17233d;
        }

        .gurudin-content {
          .title {
            color: #ffffff;

            .time {
              color: #c5c8ce;
            }
          }

          .author {
            color: #c5c8ce;
          }
        }
      }

      .gurudin-audio {
        animation: mymove 0.5s;
        position: relative;
        height: 130rpx;
        border-radius: 8rpx;
        clear: both;
        margin: 10rpx 0 0;

        .gurudin-poster,
        .gurudin-content {
          float: left;
        }

        .gurudin-poster {
          position: relative;
          width: 130rpx;
          height: 126rpx;
          margin-top: 1rpx;
          margin-left: 1rpx;
          border-top-left-radius: 8rpx;
          border-bottom-left-radius: 8rpx;

          ._image {
            width: 110rpx;
            height: 110rpx;
            margin: 10rpx;
            opacity: 0.8;
            border-radius: 100%;
          }

          .tools {
            position: absolute;
            text-align: center;
            top: 0;
            left: 0;
            height: 130rpx;
            width: 130rpx;

            ._image {
              width: 50rpx;
              height: 50rpx;
              margin-top: calc((100% - 50rpx) / 2);
            }
          }
        }

        .gurudin-content {
          width: calc(100% - 130rpx - 62rpx);
          height: calc(130rpx - 60rpx);
          padding: 30rpx;

          .title {
            position: relative;
            font-size: $uni-font-size-base;
            height: 40rpx;

            .time {
              position: absolute;
              right: 0;
              top: 0;
              font-size: $uni-font-size-sm;
            }
          }

          .author {
            margin-top: 10rpx;
            font-size: $uni-font-size-sm;
          }
        }
      }

      @keyframes mymove {
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
      }

      // 旋转动画
      .musicRotate {
        animation: rotate 10s linear infinite;
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(359deg);
        }
      }

      .musicPaused {
        animation-play-state: paused;
      }
    }

    .pay_fold:before {
      display: block;
      content: '';
      position: absolute;
      pointer-events: none;
      width: $page-content-body-width;
      top: -56rpx;
      height: 56rpx;
      background-image: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.95) 90%,
        #fff
      );
    }
    .pay_fold {
      width: $page-content-body-width;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .pay_tip {
        text-align: center;
        display: block;
        padding: 20rpx;
        box-sizing: border-box;
        font-size: 25rpx;
        justify-content: center;
        @include color(color-vip);
      }
      .s-arrows {
        margin-left: 3rpx;
        position: relative;
        width: 20rpx;
        display: inline-block;
        @include color(color-vip);
        @keyframes pay_tip_arrow {
          0% {
            opacity: 0;
            left: 0;
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            left: 100%;
          }
        }
        .arrow {
          position: absolute;
        }
        .arrow:before,
        .arrow::after {
          content: '';
          display: block;
          height: 2rpx;
          position: absolute;
          top: 0;
          left: 0;
          width: 10rpx;
          background: #ce994f;
        }
        .arrow:before {
          transform: rotate(-45deg);
          transform-origin: right 50%;
        }
        .arrow:after {
          transform: rotate(45deg);
          transform-origin: right 50%;
        }

        .arrow1 {
          animation: pay_tip_arrow 2s ease-in-out infinite;
        }
        .arrow2 {
          animation: pay_tip_arrow 2s ease-in-out 1s infinite;
        }
      }
    }
    .vote-wrap {
      margin-top: 10rpx;
      margin-bottom: 10rpx;
      .vote-list {
        .option {
          position: relative;
          display: block;
          margin-bottom: 16rpx;
          width: 100%;
          height: 64rpx;
          @include background_color(page-box-item2-background-color);
          border-radius: 6rpx;
          .option-bar {
            height: 64rpx;
            width: 0px;
            border-radius: 10rpx;
          }
          .option-title {
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 10rpx 0 0 10rpx;
            display: flex;
            ._text {
              @include color(color-lightest-est-dark);
              display: block;
              padding-left: 20px;
              height: 64rpx;
              line-height: 64rpx;
              font-size: $uni-font-size-sm-base;
              font-weight: bold;
            }
            .icon-gou {
              display: inline-flex;
              font-size: $uni-font-size-sm-base;
              font-weight: bold;
              margin-left: 10rpx;
              height: 64rpx;
              line-height: 64rpx;
            }
          }
          ._progess {
            position: absolute;
            top: 0;
            left: 0;
            height: 64rpx;
            line-height: 64rpx;
            @include background_color(page-light2-line-background-color);
            border-radius: 10rpx 5rpx 5rpx 10rpx;
            width: 0;
            transition: width 0.3s ease-in-out;
          }
          .number {
            position: absolute;
            top: 19rpx;
            right: 16rpx;
            color: #7c7c7c;
            font-size: $uni-font-size-sm-base;
          }
        }
        .option.vote-selected {
          .option-title {
            ._text {
              @include color(color-primary);
            }
            .icon-gou {
              color: $uni-color-primary;
            }
          }
          ._progess {
            @include background_color(second-primary-background-color);
          }
        }
      }
      .vote-info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-weight: normal;
        .voted-title {
          font-size: 22rpx;
          color: #7a7a7a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 500rpx;
        }
        .joinnums {
          font-size: 22rpx;
          color: #7a7a7a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .voter-view {
      width: $page-content-body-width;
      height: 360rpx;
      background-size: cover;
      position: relative;
      border-radius: $uni-border-radius-base;
      overflow: hidden;
      .voter-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20rpx;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.25);
        .voter-title {
          color: #ffffff;
          margin-bottom: 20rpx;
          font-size: $uni-font-size-base;
        }
        .voter-master {
          .master {
            display: flex;
            ._image {
              width: 40rpx;
              height: 40rpx;
              border-radius: 50%;
            }
            ._name {
              margin-left: 10rpx;
              color: #c0c0c0;
              height: 40rpx;
              line-height: 40rpx;
              font-size: $uni-font-size-sm;
            }
          }
        }
      }
    }

    .refer-view {
      @include background_color(page-gray-background-color);
      padding: 20rpx 0 14rpx;
      .refter-user-view {
        display: flex;
        .content_raw {
          font-size: $uni-font-size-base;
          line-height: 40rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          .user_name {
            white-space: nowrap;
            font-size: $uni-font-size-base;
            line-height: 40rpx;
            display: inline;
          }
        }
      }
    }
  }
  .post-content-wrap.scene_9 {
    .address-view.circle-view {
      display: $sticky-clrcle-mini-display;
    }
  }
  .global-theme-black .pay_fold:before {
    background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0,
      rgba(0, 0, 0, 0.95) 90%,
      #000000
    );
  }
</style>
