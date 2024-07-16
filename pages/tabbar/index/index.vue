<template>
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
    <view
      :class="
        'mini-page-body tabbar ' +
        pagebgcolorClass +
        ' pagemode_' +
        config_app_mode
      "
    >
      <navBar
        :scene="
          config_page_index_channels && config_page_index_channels.style == 0
            ? 20002
            : 1
        "
        @search="toSliderUrl(6, '/pages/common/search')"
        :searchBar="
          !(config_page_index_channels && config_page_index_channels.style == 0)
        "
        :searchText="config_page_index_searchCarousel"
        :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"
        :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'"
      >
        <view slot="left" class="lxy-nav-bar__logo default">
          <block v-if="config_app_multi > 0">
            <block
              v-if="
                config_page_index_channels &&
                config_page_index_channels.style == 0
              "
            >
              <i class="mini-icon" style="width: 40rpx"></i>
              <view
                class="tenant_box flex-row"
                @tap.stop.prevent="toSliderUrl(6, '/pages/common/tenants')"
                style="position: absolute; z-index: 999"
              >
                {{ global__tenant__.short }}
                <i class="mini-icon mini-xiajiantou"></i>
              </view>
            </block>
            <block v-else>
              <view
                class="tenant_box flex-row"
                @tap.stop.prevent="toSliderUrl(6, '/pages/common/tenants')"
              >
                {{ global__tenant__.short }}
                <i class="mini-icon mini-xiajiantou"></i>
              </view>
            </block>
          </block>
          <block v-else>
            <block
              v-if="
                config_page_index_header.left &&
                (config_page_index_header.left.icon ||
                  config_page_index_header.left.img)
              "
            >
              <block v-if="config_page_index_header.left.img">
                <image
                  class="_image"
                  :src="config_page_index_header.left.img"
                  mode=""
                  @tap.stop.prevent="
                    toSliderUrl(
                      config_page_index_header.left.type,
                      config_page_index_header.left.target_id
                    )
                  "
                ></image>
              </block>
              <block v-else-if="config_page_index_header.left.icon">
                <i
                  :class="
                    'mini-icon' + ' ' + config_page_index_header.left.icon
                  "
                  @tap.stop.prevent="
                    toSliderUrl(
                      config_page_index_header.left.type,
                      config_page_index_header.left.target_id
                    )
                  "
                ></i>
              </block>
            </block>
          </block>
        </view>
        <block
          v-if="
            config_page_index_channels && config_page_index_channels.style == 0
          "
        >
          <view class="nav-center" slot="center" style="display: flex">
            <view
              :class="'nav-item ' + (channelIndex == 0 ? 'cur' : '')"
              @tap.stop.prevent="changeChanel(0)"
              >关注</view
            >
            <view class="space"></view>
            <view
              :class="'nav-item ' + (channelIndex == 1 ? 'cur' : '')"
              @tap.stop.prevent="changeChanel(1)"
              >推荐</view
            >
            <view class="space"></view>
            <view
              :class="'nav-item ' + (channelIndex == 2 ? 'cur' : '')"
              @tap.stop.prevent="changeChanel(2)"
              >附近</view
            >
          </view>
        </block>
        <!-- #ifdef APP || H5 -->
        <view
          slot="right"
          class="lxy-nav-bar__logo default"
          v-if="
            config_page_index_header.right &&
            (config_page_index_header.right.icon ||
              config_page_index_header.right.img)
          "
        >
          <block v-if="config_page_index_header.right.img">
            <image
              class="_image"
              :src="config_page_index_header.right.img"
              mode=""
              @tap.stop.prevent="
                toSliderUrl(
                  config_page_index_header.right.type,
                  config_page_index_header.right.target_id
                )
              "
            ></image>
          </block>
          <block v-else-if="config_page_index_header.right.icon">
            <i
              :class="'mini-icon' + ' ' + config_page_index_header.right.icon"
              @tap.stop.prevent="
                toSliderUrl(
                  config_page_index_header.right.type,
                  config_page_index_header.right.target_id
                )
              "
            ></i>
          </block>
        </view>
        <!-- #endif -->
      </navBar>

      <block v-if="channelIndex == 1 && _type == 1">
        <view
          :class="
            ' index-header ' + subNavHeaderTranslateClass + ' index_header_2'
          "
          :style="'top: ' + CustomBar + 'px;'"
        >
          <scroll-view
            :show-scrollbar="false"
            scroll-x
            class="tab-view"
            :scroll-left="scrollLeft"
          >
            <view
              :class="
                'tab-bar-item type_' + item.type + (index == 0 ? ' active' : '')
              "
              :data-pid="undefined"
              :data-type="item.type"
              @tap.stop.prevent="check"
              v-for="(item, index) in [
                {
                  plate_name: '推荐',
                  type: 1
                },
                {
                  plate_name: '热门',
                  type: 3
                },
                {
                  plate_name: '关注',
                  type: 0
                }
              ]"
              :key="index"
            >
              <block>
                <text class="tab-bar-title" v-if="item.plate_name">{{
                  item.plate_name
                }}</text>
              </block>
            </view>
          </scroll-view>
        </view>
      </block>

      <!-- <view class="top-header" v-if="_type == 1">
        <view
          :class="['item', { active: index === headerCurrentIndex }]"
          v-for="(item, index) in ['推荐', '热门', '关注']"
          :key="item"
          @click="checkHeaderTab(index)"
        >
          <text> {{ item }}</text>
          <view class="tab-bar-title-slider"></view>
        </view>
      </view> -->

      <view class="xhs-loading-wrap">
        <!-- #ifdef MP-WEIXIN -->
        <view class="xhs-loading">
          <view :class="'xhs-loader ' + (topicload ? 'rot5' : '')"></view>
        </view>
        <!-- #endif -->
      </view>

      <block v-if="channelIndex == 1">
        <!-- 幻灯片 -->
        <view
          v-if="
            _type == 1 &&
            config_page_index_banner &&
            config_page_index_banner.length > 0
          "
          class="index-swiper-container"
        >
          <swiper
            circular
            enableFlex
            :autoplay="true"
            @change="changeCurrentIdx"
            class="banners"
            :duration="500"
            interval="5000"
            :style="'height: ' + config_page_index_banner_height + 'rpx'"
          >
            <swiper-item
              @tap.stop.prevent="
                toSliderUrl(banner.slideshow_type, banner.target_id)
              "
              class="banner__item"
              v-for="(banner, index) in config_page_index_banner"
              :key="banner.id"
            >
              <image
                :class="
                  'banner__image ' +
                  (index === currentIdx ? 'banner__image--active' : '')
                "
                mode="aspectFill"
                :src="banner.poster"
              ></image>
            </swiper-item>
          </swiper>
          <view class="indicators">
            <view
              :class="
                'indicator ' + (index === currentIdx ? 'indicator-active' : '')
              "
              v-for="(item, index) in config_page_index_banner"
              :key="item.link"
            ></view>
          </view>
        </view>

        <block
          v-if="
            _type == 1 &&
            config_page_index_notice &&
            config_page_index_notice.length > 0
          "
        >
          <view
            class="notice-box"
            v-if="
              config_page_index_notice && config_page_index_notice.length > 0
            "
          >
            <swiper
              :autoplay="true"
              :circular="true"
              :vertical="true"
              interval="4000"
              class="notice"
            >
              <swiper-item
                class="notice-item"
                :data-id="item.id"
                @tap.stop.prevent="toSliderUrl(item.type, item.target)"
                v-for="(item, index) in config_page_index_notice"
                :key="index"
              >
                <image class="_image" :src="item.img" mode="heightFix"></image>
                <text class="_text">{{ item.text }}</text>
              </swiper-item>
            </swiper>
          </view>
        </block>

        <!-- 滚动nav -->
        <scroll-nav
          :platformList="config_page_index_nav"
          @toSliderUrl="toSliderUrl"
          v-if="
            _type == 1 &&
            config_page_index_nav &&
            config_page_index_nav.length > 0
          "
          :scene="1"
        ></scroll-nav>
        <!-- <view class="post-list-gap" v-if="_type == 3"></view> -->
        <scroll-nav
          :platformList="config_page_index_shop_nav"
          @toSliderUrl="toSliderUrl"
          v-if="
            _type == 3 &&
            config_page_index_shop_nav &&
            config_page_index_shop_nav.length > 0
          "
          :scene="20001"
        ></scroll-nav>

        <block
          v-if="config_tab && config_tab[type] && config_tab[type]['type'] == 2"
        >
          <view class="hot_realtime_topics_top">
            <!-- <view class="post-list-gap"></view> -->
            <ls-skeleton
              :loading="topicTopTenLoad"
              :skeleton="topicTopTenSkeleton"
              :animate="true"
            >
              <view>
                <view class="realtime_topicstop_wrap">
                  <view class="title">
                    <view class="left">热门话题</view>
                    <view
                      class="right"
                      @tap.stop.prevent="
                        toSliderUrl(6, '/pages/article/article')
                      "
                      >更多</view
                    >
                  </view>
                  <scroll-view
                    :show-scrollbar="false"
                    scrollX
                    enableFlex="enable-flex"
                    enhanced="enhanced"
                    scrollWithAnimation="scroll-with-animation"
                  >
                    <view class="topicstop_content">
                      <view
                        :class="'topic-top-item top-item-' + (top_index + 1)"
                        v-for="(top_item, top_index) in topicTopList"
                        :key="top_index"
                      >
                        <view class="topic_avatar">
                          <image
                            class="_image"
                            :src="top_item.head_portrait"
                            mode=""
                          ></image>
                        </view>
                        <view
                          @tap.stop.prevent="toSliderUrl(5, top_item.id)"
                          class="topics_name"
                          >{{ top_item.tags_name }}</view
                        >
                        <block>
                          <view class="flag hot" v-if="top_item.is_hot == 1"
                            >热</view
                          >
                        </block>
                      </view>
                    </view>
                  </scroll-view>
                </view>
              </view>
            </ls-skeleton>
          </view>
        </block>

        <!-- template(<<<vue<<<000<<<vue); -->
      </block>

      <block
        v-if="
          channelIndex == 2 &&
          myUserInfo.id > 0 &&
          myUserInfo.longitude == 0 &&
          myUserInfo.latitude == 0
        "
      >
        <view class="location-box">
          <view class="inner">
            <view class="location flex-row">
              <view class="tip flex-row">
                <i class="mini-icon2 mini-shouhuodizhi"></i>
                <view class="_text">未获取到当前定位</view>
              </view>
              <view
                class="right btn flex-column"
                @tap.stop.prevent="refreshLocation"
                >获取定位</view
              >
            </view>
          </view>
        </view>
      </block>

      <!-- 圈子分类 -->
      <view class="new-circle-class" v-if="_type == 1">
        <view class="title">圈子分类</view>
        <view class="content">
          <view class="left">
            <image
              src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/53.svg"
              @tap.stop.prevent="toSliderUrl(2, 48)"
            ></image>
          </view>
          <view class="right">
            <view class="top">
              <image
                src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/57.svg"
                @tap.stop.prevent="toSliderUrl(2, 46)"
              ></image>
              <image
                src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/58.svg"
                @tap.stop.prevent="toSliderUrl(2, 49)"
              ></image>
            </view>
            <view class="bottom">
              <image
                src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/59.svg"
                @tap.stop.prevent="toSliderUrl(2, 50)"
              ></image>
            </view>
          </view>
        </view>
      </view>

      <!-- 大家都在看 -->
      <view class="all-person-view" v-if="_type == 1 && bureauList.length > 0">
        <view class="title">大家都在看</view>
        <view class="content">
          <view class="title">
            <view class="left">
              <image src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/72.svg"></image>
            </view>
            <view class="right">
              <image src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/60.svg"></image>
            </view>
          </view>
          <view
            class="activity"
            v-for="(bitem, bindex) in bureauList"
            :key="bindex"
          >
            <view class="activity-item">
              <view class="pic">
                <image :src="bitem.pic" alt="" />
              </view>
              <view class="activity-info">
                <view class="title">
                  <text>#{{ bitem.title }}</text>
                  <view class="personJoin" v-if="bitem.comment_count > 10"
                    >{{ bitem.comment_count }}人已参与</view
                  >
                </view>
                <view class="intro">{{ bitem.intro }}</view>
              </view>
              <view class="goto" @click="gotoBureauDetail(bitem.id)"
                >去看看</view
              >
            </view>
          </view>
        </view>
      </view>

      <block v-if="channelIndex == 1">
        <view
          :class="
            ' index-header ' +
            `${_type == 1 ? '' : subNavHeaderTranslateClass}` +
            `${_type == 1 ? ' index_header_1' : ''}`
          "
          :style="'top: ' + CustomBar + 'px;'"
        >
          <scroll-view
            :show-scrollbar="false"
            scroll-x
            class="tab-view"
            :scroll-left="scrollLeft"
          >
            <view
              :class="
                'tab-bar-item type_' +
                item.type +
                (index == type ? ' active' : '')
              "
              :data-pid="item.plate_id"
              :data-type="index"
              @tap.stop.prevent="check"
              v-for="(item, index) in config_tab"
              :key="index"
            >
              <block v-if="item.show == 1 && item.icon">
                <i :class="'mini-icon tab-bar-icon ' + item.icon"></i>
              </block>
              <block v-else>
                <i
                  v-if="item.icon && item.icon.length > 0"
                  :class="'mini-icon tab-bar-icon ' + item.icon"
                ></i>
                <text class="tab-bar-title" v-if="item.plate_name">{{
                  item.plate_name
                }}</text>
              </block>
            </view>
          </scroll-view>
          <view
            @tap.stop.prevent="moretags"
            class="tab-more"
            v-if="_type == 1 ? false : true"
          >
            <i class="mini-icon mini-xiajiantou"></i>
          </view>
        </view>
        <view
          class="index-header-height"
          v-if="_type == 1 ? false : true"
        ></view>
      </block>

      <view class="topic-list">
        <view style="padding-bottom: 100px">
          <!-- <view class="post-list-gap"></view> -->
          <ls-skeleton
            :loading="topicload"
            :skeleton="commonSkeleton"
            :scene="is_waterfall ? 90734 : 1"
          >
            <block name="circle">
              <block v-if="hasRefreshData">
                <view
                  @tap.stop.prevent="refreshEvent"
                  class="hasRefreshData-tip"
                  >有新内容发布，点击刷新</view
                >
              </block>
              <block v-if="is_waterfall == 2">
                <l-water-flow
                  comName="goods"
                  :waterData="goodsWaterData"
                  ref="goodswater"
                  :column-gap="8"
                  :scene="20001"
                />
              </block>
              <block v-else>
                <block v-if="is_waterfall == 1">
                  <l-water-flow
                    comName="product"
                    :waterData="postWaterData"
                    ref="productwater"
                    :column-gap="8"
                  />
                </block>
                <block v-else>
                  <view
                    class="post-wrap"
                    v-for="(item, index) in posts"
                    :key="index"
                  >
                    <contextualPopup
                      subject="posts"
                      :popList="item.longtaps"
                      :para="{ index: index, style: 'list' }"
                    >
                      <view class="topic-detail-view" slot="content">
                        <block v-if="item.post_type == 'single'">
                          <single-item :single="item"></single-item>
                        </block>
                        <block v-else>
                          <view class="topic-panel" :id="'media_' + item.id">
                            <view class="user-info-view">
                              <user-info
                                :user="item.user"
                                :format_time="item.format_time"
                                :created_at="item.created_at"
                                :ip_address="item.ip_address"
                                :distance="item.distance"
                                :device="item.device"
                                :post_top="item.post_top"
                              >
                                <view class="user-rigth" slot="right">
                                  <block
                                    v-if="
                                      item.fields && item.fields.contact_phone
                                    "
                                  >
                                    <view
                                      @tap.stop.prevent="
                                        toSliderUrl(
                                          22,
                                          item.fields.contact_phone
                                        )
                                      "
                                      class="follow-view"
                                    >
                                      <i
                                        class="mini-icon mini-dianhua inline"
                                      ></i>
                                      拨打
                                    </view>
                                  </block>
                                  <block v-else>
                                    <block v-if="!item.is_my_posts">
                                      <view
                                        @tap.stop.prevent="postsActionFollow"
                                        :data-userid="item.user.id"
                                        :data-index="index"
                                        class="follow-view"
                                        v-if="!item.is_follow_user"
                                      >
                                        关注
                                      </view>
                                      <view
                                        @tap.stop.prevent="postsActionFollow"
                                        :data-userid="item.user.id"
                                        :data-index="index"
                                        class="follow-view folled"
                                        v-else-if="item.is_follow_user"
                                      >
                                        已关注
                                      </view>
                                    </block>
                                  </block>
                                </view>
                              </user-info>
                            </view>
                            <post-content
                              :words="item"
                              :postIndex="index"
                              :scene="1"
                              @unfoldTap="unfoldTap"
                              @showPayContent="showPayContent"
                              @soundPlayCall="soundsPlayCall"
                              @forceUpdate="forceUpdate"
                              @pSelectVote="selectVote"
                            ></post-content>
                            <post-footer
                              @tapShare="tapShare"
                              @taplikes="taplikes"
                              @tapComment="tapComments"
                              @tapCollect="tapCollect"
                              @tapReward="tapReward"
                              @tapGiveCoin="tapGiveCoin"
                              :words="item"
                              :index="index"
                            ></post-footer>

                            <view
                              class="reward-box"
                              v-if="
                                item.exceptional && item.exceptional.length > 0
                              "
                              :data-id="item.id"
                              @tap.stop.prevent="onClickReward"
                              :data-ecount="item.exceptional_count"
                            >
                              <view class="inner">
                                <view class="cu-avatar-group">
                                  <view
                                    v-if="item.exceptional_count > 6"
                                    class="cu-avatar round dian"
                                    >•••
                                  </view>
                                  <view
                                    class="cu-avatar round"
                                    :style="
                                      'background-image:url(' +
                                      exceptional.user_avatar +
                                      ');'
                                    "
                                    v-for="(
                                      exceptional, index1
                                    ) in item.exceptional"
                                    :key="exceptional.rid"
                                  ></view>
                                </view>
                                <view class="cu-avatar-text"
                                  >{{ item.exceptional_count }}次充电</view
                                >
                              </view>
                            </view>
                          </view>
                        </block>
                      </view>
                    </contextualPopup>
                    <!-- <view
                      class="post-list-gap"
                      v-if="index != posts.length - 1"
                    ></view> -->
                    <block v-if="posts.length > 5 && item.ad">
                      <!-- #ifdef MP -->
                      <view class="flow-ad-wrap" v-if="item.ad">
                        <block v-if="item.ad.type && item.ad.type == '1'">
                          <i class="mini-icon mini-adtip"></i>
                          <image
                            class="_image"
                            :src="item.ad.img"
                            @tap.stop.prevent="
                              toSliderUrl(
                                item.ad.target_type,
                                item.ad.target_id
                              )
                            "
                            mode="widthFix"
                          ></image>
                        </block>
                        <block v-else>
                          <view class="ad-content"
                            ><ad-custom :unit-id="item.ad.unit"></ad-custom
                          ></view>
                        </block>
                      </view>
                      <!-- <view class="post-list-gap" v-if="item.ad"></view> -->
                      <!-- #endif -->
                      <!-- #ifndef MP -->
                      <view class="flow-ad-wrap" v-if="item.ad">
                        <block v-if="item.ad.type && item.ad.type == '1'">
                          <i class="mini-icon mini-adtip"></i>
                          <image
                            class="_image"
                            :src="item.ad.img"
                            @tap.stop.prevent="
                              toSliderUrl(
                                item.ad.target_type,
                                item.ad.target_id
                              )
                            "
                            mode="widthFix"
                          ></image>
                        </block>
                        <block v-else>
                          <view class="ad-content"
                            ><ad :adpid="item.ad.unit"></ad
                          ></view>
                        </block>
                      </view>
                      <!-- <view class="post-list-gap" v-if="item.ad"></view> -->
                      <!-- #endif -->
                    </block>

                    <block
                      v-if="
                        config_page_index_flow == 1 &&
                        item.flow &&
                        item.flow.type
                      "
                    >
                      <view class="flow-wrap">
                        <view class="flow-content">
                          <block v-if="item.flow.type == '1'">
                            <view class="title">
                              <view class="left">热门圈子</view>
                              <view class="right"></view>
                            </view>
                            <view class="circle-wrap-body">
                              <view
                                class="circle-wrap-item"
                                v-for="(circle_item, index_circle) in item.flow
                                  .flow"
                                :key="index_circle"
                                @tap.stop.prevent="
                                  toSliderUrl(2, circle_item.id)
                                "
                              >
                                <view class="left">
                                  <image
                                    :src="circle_item.head_portrait"
                                    mode=""
                                    class="circle_shape"
                                  ></image>
                                </view>
                                <view class="right">
                                  <view class="name">{{
                                    circle_item.circle_name
                                  }}</view>
                                  <view class="circle-degree"
                                    >{{
                                      filters.toFix(circle_item.degree)
                                    }}热度</view
                                  >
                                </view>
                              </view>
                            </view>
                          </block>
                          <block v-if="item.flow.type == '2'">
                            <!-- <view class="title">
                              <view class="left">大家都在聊</view>
                              <view class="right"></view>
                            </view>
                            <view class="topic-wrap-body">
                              <view
                                class="topic-wrap-item"
                                v-for="(topic_item, index_topic) in item.flow
                                  .flow"
                                :key="index_topic"
                                @tap.stop.prevent="
                                  toSliderUrl(5, topic_item.id)
                                "
                              >
                                <view class="left">
                                  <image
                                    :src="topic_item.head_portrait"
                                    mode=""
                                    class="topic-shape"
                                  ></image>
                                  <view class="info">
                                    <view class="name">{{
                                      topic_item.tags_name
                                    }}</view>
                                    <view class="desc"></view>
                                  </view>
                                </view>
                                <view class="right"
                                  >{{
                                    filters.toFix(topic_item.degree)
                                  }}热度</view
                                >
                              </view>
                            </view> -->
                            <view class="may-know">
                              <view class="top">
                                <view class="icon">
                                  <image src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/63.svg"></image>
                                </view>
                                <view class="title">TA可能是你认识的人</view>
                              </view>
                              <view class="content">
                                <view
                                  class="user-item"
                                  v-for="(user_item, index) in knowPeople"
                                  :key="index"
                                >
                                  <view class="avatar">
                                    <image :src="user_item.user_avatar"></image>
                                    <!-- <view > -->
                                    <image
                                      class="gender"
                                      v-if="user_item.gender == 1"
                                      src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/62.svg"
                                    ></image>
                                    <image
                                      class="gender"
                                      v-if="user_item.gender == 2"
                                      src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/61.svg"
                                    ></image>
                                    <!-- </view> -->
                                  </view>
                                  <view class="user_name">{{
                                    user_item.user_name
                                  }}</view>
                                  <view class="user_tag">社区活跃用户</view>
                                  <view
                                    class="add"
                                    @tap.stop.prevent="postsActionFollow"
                                    :data-userid="user_item.id"
                                  >
                                    <image
                                      v-if="!user_item.is_follow_user"
                                      src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/64.svg"
                                    ></image>
                                    <image
                                      v-if="user_item.is_follow_user"
                                      src="https://haitanshidian-1312538539.cos.ap-shanghai.myqcloud.com/icon/65.svg"
                                    ></image>
                                  </view>
                                </view>
                              </view>
                            </view>
                          </block>
                          <block v-if="item.flow.type == '3'">
                            <view class="title">
                              <view class="left">你可能感兴趣的人</view>
                              <view class="right"></view>
                            </view>
                            <view class="user-wrap-body">
                              <view
                                class="user-wrap-item"
                                v-for="(user_item, index_user) in item.flow
                                  .flow"
                                :key="index_user"
                                @tap.stop.prevent="toSliderUrl(4, user_item.id)"
                              >
                                <view class="top">
                                  <view class="flow-avatar-wrap">
                                    <image
                                      class="user-avatar-image"
                                      compression="avatar"
                                      mode="aspectFill"
                                      :src="user_item.user_avatar"
                                      @tap.stop.prevent="
                                        toSliderUrl(4, user_item.id)
                                      "
                                    ></image>
                                    <i
                                      class="avatar-authentication-icon mini-icon mini-verify"
                                      v-if="user_item.is_authentication == 1"
                                    ></i>
                                  </view>
                                </view>
                                <view class="mid">
                                  <view class="name">
                                    <text class="user-nick-text">{{
                                      user_item.user_name
                                    }}</text>
                                    <i
                                      class="header-label official-icon mini-icon mini-renzhengguanli1"
                                      v-if="user_item.is_official == 1"
                                    ></i>
                                    <!-- <i class="header-label vip-icon mini-icon mini-vip" v-if="true || user_item.is_member == 1"></i>
																	<i :class="'header-label lv-icon mini-icon mini-lv' + user_item.lv"></i> -->
                                  </view>
                                  <view class="desc"></view>
                                </view>
                                <view class="botton"
                                  >{{
                                    filters.toFix(user_item.degree)
                                  }}热度</view
                                >
                              </view>
                            </view>
                          </block>
                        </view>
                      </view>
                      <!-- <view class="post-list-gap"></view> -->
                    </block>
                  </view>
                </block>
              </block>

              <u-popup :show="rewardPopup" @close="shutReward">
                <view class="reward-add-box">
                  <image
                    class="reward-add-box-image"
                    :src="config_img.reward_select"
                    mode="aspectFill"
                  />
                  <view class="reward-add-input-box">
                    <text class="_text">¥</text>
                    <input
                      class="reward-add-input"
                      @input="rewardPriceChange"
                      :value="rewardPrice"
                      placeholder-class="_input_place_holder"
                      type="digit"
                      placeholder="在这里输入充电金额"
                    />
                  </view>
                  <view class="reward-add-box-view">
                    <view
                      @tap.stop.prevent="addRewardPrice"
                      :class="rewardPrice == 2 ? 'bd _view' : '_view'"
                      data-price="2"
                      >¥2</view
                    >
                    <view
                      @tap.stop.prevent="addRewardPrice"
                      :class="rewardPrice == 6 ? 'bd _view' : '_view'"
                      data-price="6"
                      >¥6</view
                    >
                    <view
                      @tap.stop.prevent="addRewardPrice"
                      :class="rewardPrice == 8 ? 'bd _view' : '_view'"
                      data-price="8"
                      >¥8</view
                    >
                    <view
                      @tap.stop.prevent="addRewardPrice"
                      :class="rewardPrice == 18 ? 'bd _view' : '_view'"
                      data-price="18"
                      >¥18</view
                    >
                  </view>
                  <view
                    class="reward-add-box-btn"
                    @tap.stop.prevent="onOpenExceptionalAccountCheck"
                    >确认充电</view
                  >
                </view>
              </u-popup>

              <u-popup
                :show="payContentPopup"
                @close="shutPayContent"
                :zIndex="99999991009"
              >
                <block v-if="payContentObj && payContentObj.price > 0">
                  <view class="pay_content_box">
                    <view class="title"
                      ><view
                        :class="
                          'mini-icon ' +
                          (payContentObj.pay_type == 1
                            ? 'mini-xueyuan-fufeikecheng'
                            : 'mini-jinbi2')
                        "
                      ></view
                      >付费内容</view
                    >
                    <view class="pay_for_item price">
                      <text class="_text">价格：</text>
                      <block v-if="payContentObj.vip_price >= 0">
                        <view class="pay_for_item_num vip_price">
                          <view class="vip_price_tip">会员价</view>
                          {{
                            payContentObj.vip_price + payContentObj.credit
                          }}</view
                        >
                      </block>
                      <block v-else>
                        <view class="pay_for_item_num">{{
                          payContentObj.price + payContentObj.credit
                        }}</view>
                      </block>
                    </view>
                    <view class="pay_for_item rest">
                      <text class="_text">剩余篇幅：</text>
                      <view class="pay_for_item_num"
                        >{{ payContentObj.rest }}%</view
                      >
                    </view>
                    <view class="pay_for_item has_hidden">
                      <text class="_text">隐藏内容：</text>
                      <view class="pay_for_item_num"
                        >{{ payContentObj.has_hidden }}字符</view
                      >
                    </view>
                    <view class="pay_for_item has_file">
                      <text class="_text">隐藏图片：</text>
                      <view class="pay_for_item_num">{{
                        payContentObj.has_img
                      }}</view>
                    </view>
                    <view class="pay_for_item has_file">
                      <text class="_text">隐藏视频：</text>
                      <view class="pay_for_item_num">{{
                        payContentObj.has_video
                      }}</view>
                    </view>
                    <view class="pay_for_item has_file">
                      <text class="_text">隐藏附件：</text>
                      <view class="pay_for_item_num">{{
                        payContentObj.has_file
                      }}</view>
                    </view>
                    <view class="buy_button" @tap.stop.prevent="payPost"
                      >立即购买</view
                    >
                    <view class="tips"
                      >虚拟物品存在可复制性，请谨慎购买，不可退货，若不慎被骗，请立即举报并说明原因</view
                    >
                  </view>
                </block>
              </u-popup>

              <view :class="'dialog ' + (rewardDialog ? 'dialog_show' : '')">
                <view
                  @tap.stop.prevent="onClickReward"
                  class="dialog_mask"
                  @touchmove.stop.prevent="miniMoveHandle"
                ></view>
                <view class="dialog_container">
                  <view class="dialog_box_title">
                    {{ exceptionalCount }}次充电
                    <i
                      class="mini-icon mini-shanchu2"
                      @tap.stop.prevent="onClickReward"
                    />
                  </view>
                  <scroll-view
                    :scroll-y="true"
                    class="dialog_comments"
                    enhanced
                    :show-scrollbar="false"
                    lower-threshold="0"
                  >
                    <view class="dialog_conent">
                      <view
                        class="reward-user-box"
                        v-for="(item, index) in exceptionalList"
                        :key="item.rindex"
                      >
                        <view
                          class="reward-user-avatar-view"
                          hover-class="none"
                          @tap.stop.prevent="toSliderUrl(4, item.user.id)"
                        >
                          <image
                            class="reward-user-avatar-image"
                            compression="avatar"
                            mode="aspectFill"
                            :src="item.user.user_avatar"
                          ></image>
                          <view class="reward-user-right">
                            <view class="reward-user-name">{{
                              item.user.user_name
                            }}</view>
                            <view class="reward-user-date"
                              >{{ item.exceptional_date }}
                            </view>
                          </view>
                        </view>

                        <view class="reward-user-price">
                          充电了￥
                          <u-count-to
                            :endVal="item.exceptional_price"
                            :decimals="2"
                            color="#FA5150"
                            fontSize="46"
                          ></u-count-to>
                        </view>
                      </view>
                    </view>
                  </scroll-view>
                </view>
              </view>

              <view :class="'dialog ' + (bounced ? 'dialog_show' : '')">
                <view
                  @tap.stop.prevent="bouncedTap"
                  class="dialog_mask"
                  @touchmove.stop.prevent="miniMoveHandle"
                ></view>
                <view class="dialog_container">
                  <view class="dialog_conent">
                    <view
                      @tap.stop.prevent="bouncedDeleteTap"
                      class="delete-btn"
                      id="delete"
                      >确认删除
                    </view>
                    <view @tap.stop.prevent="bouncedTap" class="cancel-btn"
                      >取消</view
                    >
                  </view>
                </view>
              </view>

              <view :class="'dialog ' + (showShare ? 'dialog_show' : '')">
                <view
                  @tap.stop.prevent="onClickShare"
                  class="dialog_mask"
                  @touchmove.stop.prevent="miniMoveHandle"
                ></view>
                <view class="dialog_container">
                  <view class="dialog_conent">
                    <view class="dialog_box">
                      <button open-type="share" class="dialog_btn">
                        <i class="mini-icon mini-weixin1"></i>
                        微信好友
                      </button>
                      <view
                        @tap.stop.prevent="sharePosterClick"
                        class="dialog_btn"
                      >
                        <i class="mini-icon mini-haibao"></i>
                        海报
                      </view>
                    </view>
                    <view @tap.stop.prevent="onClickShare" class="cancel-btn"
                      >取消</view
                    >
                  </view>
                </view>
              </view>

              <view :class="'dialog ' + (showComments ? 'dialog_show' : '')">
                <view
                  @tap.stop.prevent="toShutComments"
                  class="dialog_mask"
                  @touchmove.stop.prevent="miniMoveHandle"
                ></view>
                <view class="dialog_container">
                  <view class="dialog_box_title">
                    评论
                    {{
                      commentCount > 999
                        ? filters.toFix(commentCount)
                        : commentCount
                    }}
                    <i
                      class="mini-icon mini-shanchu2"
                      @tap.stop.prevent="toShutComments"
                    />
                  </view>
                  <comment-scroll
                    unicom-id="commentScroll_1_0"
                    ref="commentScroll"
                    :postsId="postsId"
                    @tapComment="tapComment"
                  ></comment-scroll>
                  <comment-form
                    unicom-id="commentForm_1_0"
                    ref="commentForm"
                    :postsId="postsId"
                    :commentFormShow="commentFormShow"
                    @maskClick="commentFormMaskClick"
                    @sendComment="onInputComment"
                    @tapComment="tapComment"
                    :placeholder="replyName || '此时此刻想说~'"
                  ></comment-form>
                </view>
              </view>
            </block>

            <view class="empty-box" v-if="!topicload && posts.length <= 0">
              <block v-if="_type == 0">
                <u-empty
                  text="干净清爽"
                  width="300"
                  height="300"
                  text-size="28"
                />
              </block>
              <block v-else>
                <u-empty text="空" width="300" height="300" text-size="28" />
              </block>
            </view>
          </ls-skeleton>
          <u-loadmore
            v-if="loadmoreShow"
            :status="isLastPage ? 'nomore' : 'loading'"
            nomoreText="── THE END ──"
            iconSize="28"
            fontSize="28"
            color="#989898"
          />
        </view>
      </view>
      <view @tap.stop.prevent="refreshEvent" class="refresh">
        <i class="mini-icon mini-xunhuan"></i>
      </view>

      <view
        class="publish_fixed_icon"
        @tap.stop.prevent="toSliderUrl(6, '/pages/creat/index/creat')"
      >
        <i class="mini-icon mini--jia"></i>
        <view class="float-badge enlarge">发笔记</view>
      </view>

      <post-share
        unicom-id="postShare_1_0"
        :postsId="postsId"
        :show="showSharePopup"
        @postfeedback="postFeedback"
      ></post-share>
      <hover-ball v-if="isOfficial > 1" /><my-toast
        unicom-id="mytotast_1_0"
        ref="mytoast"
        :isdistance="true"
        :toast="mytoast_data"
        @giveCoin="onInputComment"
        @postfeedback="postFeedback"
      ></my-toast>
    </view>
  </view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
  import myToast from '@/contrib/components/common/toast/toast'
  import navBar from '@/components/common/navbar/navbar'
  import hoverBall from '@/contrib/components/common/hover-ball/hover-ball'
  import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton'

  import lWaterFlow from '@/linui/water-flow/index'
  import ScrollNav from '@/contrib/components/common/scroll-nav/scroll-nav'

  import SingleItem from '@/pages/sticky/components/single-item'
  import UserInfo from '@/pages/sticky/components/user-info'
  import PostContent from '@/pages/sticky/components/post-content'
  import CommentForm from '@/pages/sticky/components/comment-form'
  import CommentScroll from '@/pages/sticky/components/comment-scroll'
  import PostFooter from '@/pages/sticky/components/post-footer'
  import PostShare from '@/pages/sticky/components/post-share'
  import contextualPopup from '@/components/common/contextual-popup/contextual-popup'

  let prevScrollTop = 0

  const mixins = require('@/mixins/forum')
  const common = require('@/mixins/common')
  const user = require('@/mixins/user')
  const forum = require('@/mixins/forum')
  var options = {}

  mixins(options)
  common(options)
  user(options)
  forum(options)
  export default {
    mixins: [{ methods: options }],
    components: {
      myToast,
      navBar,
      hoverBall,
      lsSkeleton,

      lWaterFlow,
      ScrollNav,

      UserInfo,
      PostContent,
      SingleItem,

      CommentForm,
      CommentScroll,
      PostFooter,
      PostShare,
      contextualPopup
    },
    computed: {
      config_app_multi: {
        get() {
          let that = this
          return that.$store.state.config.app.multi
        },
        set(v) {}
      },
      config_tab: {
        get() {
          let that = this
          return that.$store.state.config.tab
        },
        set(v) {}
      },

      config_page_index_header: {
        get() {
          let that = this
          if (that.$store.state.config.page.index) {
            return that.$store.state.config.page.index.header
          }
          return []
        },
        set(v) {}
      },
      config_page_index_flow: {
        get() {
          let that = this
          if (that.$store.state.config.page.index) {
            return that.$store.state.config.page.index.flow
          }
          return 0
        },
        set(v) {}
      },
      config_audit_is_reward: {
        get() {
          let that = this
          return (
            !that.$store.state.config.audit.is_reward &&
            that.$store.state.config.app.mode != 'examine'
          )
        },
        set(v) {}
      },
      config_page_index_channels: {
        get() {
          let that = this
          if (
            that.$store.state.config.page.index &&
            that.$store.state.config.page.index.channels
          ) {
            if (
              that.$store.state.config.page.index.channels.style === undefined
            ) {
              return {
                style: 0
              }
            } else {
              return that.$store.state.config.page.index.channels
            }
          }
          return {
            style: 0
          }
        },
        set(v) {}
      },
      config_page_index_searchCarousel: {
        get() {
          let that = this
          if (that.$store.state.config.page.index) {
            return that.$store.state.config.page.index.searchCarousel
          }
          return []
        },
        set(v) {}
      },
      config_page_index_banner: {
        get() {
          let that = this
          if (that.$store.state.config.page.index) {
            return that.$store.state.config.page.index.banner || []
          }
          return []
        },
        set(v) {}
      },
      config_page_index_banner_height: {
        get() {
          let that = this
          if (that.$store.state.config.page.index) {
            return that.$store.state.config.page.index.banner_height || '300'
          }
          return '300'
        },
        set(v) {}
      },
      config_page_index_nav: {
        get() {
          let that = this
          if (
            that.$store.state.config.page.index &&
            that.$store.state.config.page.index.nav
          ) {
            return that.$store.state.config.page.index.nav
          }
          return []
        },
        set(v) {}
      },
      config_page_index_shop_nav: {
        get() {
          let that = this
          if (
            that.$store.state.config.page.index &&
            that.$store.state.config.page.index.shop_nav
          ) {
            return that.$store.state.config.page.index.shop_nav
          }
          return []
        },
        set(v) {}
      },
      config_page_index_notice: {
        get() {
          let that = this
          if (that.$store.state.config.page.index) {
            return that.$store.state.config.page.index.notice
          }
          return []
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
      hasRefreshData: {
        get() {
          let that = this
          return that.$store.state.hasRefreshData
        },
        set(v) {}
      },
      is_waterfall: {
        get() {
          let that = this
          if (
            that.$store.state.config.tab &&
            that.$store.state.config.tab.length > 0
          ) {
            let type_ = that.$store.state.config.tab[that.type]['type']
            let waterfall =
              that.$store.state.config.tab[that.type]['waterfall'] == '1'
            let force = that.$store.state.config.tab[that.type]['force'] == '1'
            if (that.channelIndex == 2) {
              waterfall = true
            } else if (that.channelIndex == 0) {
              waterfall = false
            } else if (that.channelIndex == 1) {
              if (force) {
              } else {
                if (
                  that.myUserInfo.setting &&
                  that.myUserInfo.setting.diy_scene_1_post_list_style != 1
                ) {
                  if (
                    that.myUserInfo.setting.diy_scene_1_post_list_style == 3
                  ) {
                    waterfall = true
                  } else if (
                    that.myUserInfo.setting.diy_scene_1_post_list_style == 2
                  ) {
                    waterfall = false
                  }
                }
              }
            }

            if (that.channelIndex == 1 && type_ == 3) {
              return 2
            } else {
              if (waterfall) {
                return 1
              } else {
                return 0
              }
            }
          }
          return 0
        },
        set(v) {}
      },
      commonSkeleton: {
        get() {
          let that = this
          if (that.is_waterfall > 0) {
            return that.$store.state.skeleton.waterfall
          }
          return that.$store.state.skeleton.rowPost
        },
        set(v) {}
      },
      _type: {
        get() {
          let that = this
          if (
            that.$store.state.config.tab &&
            that.$store.state.config.tab.length > 0 &&
            that.$store.state.config.tab[that.type]
          ) {
            return that.$store.state.config.tab[that.type]['type'] || 0
          }
          return 0
        },
        set(v) {}
      },
      config_app_mode: {
        get() {
          let that = this
          if (
            that.$store.state.config.app &&
            that.$store.state.config.app.mode
          ) {
            return that.$store.state.config.app.mode
          }
          return ''
        },
        set(v) {}
      },
      CustomBar: {
        get() {
          let that = this
          if (that.$store.state.CustomBar && that.$store.state.CustomBar > 0) {
            return that.$store.state.CustomBar
          }
          return 87
        },
        set(v) {}
      },
      knowPeople: {
        get() {
          const arr = this.posts.map(item => {
            item.user.is_follow_user = item.is_follow_user
            return item.user
          })

          if (arr.length == 0) return arr
          const resArr = []
          for (let i = 0; i < 10; i++) {
            const num = Math.floor(Math.random() * arr.length)

            if (resArr.includes(num)) i--
            else resArr.push(num)
          }

          return arr.filter((item, index) => resArr.includes(index))
        },
        set(v) {}
      }
    },
    data() {
      return {
        pagebgcolorClass: 'pagebg_white',
        fph: false,
        mytoast_data: {},
        pageTheme: 'default',
        page__scene__: 1,
        channelIndex: 1,
        postsId: 0,
        commentFormShow: 0,
        commentCount: 0,
        exceptionalCount: 0,
        currentIdx: 0,
        type: 1,
        page: 1,
        posts: [],
        pindex: 0,
        loadmoreShow: false,
        loading: false,
        topicload: true,
        swiperload: true,
        topicTopTenLoad: true,
        topicTopList: [],
        showloading: false,
        isLastPage: false,
        isOnShow: false,

        selected: 0,
        sysMessageCount: '',
        plateId: '',
        scrollLeft: 0,

        rewardPopup: false,
        payContentPopup: false,
        payContentObj: null,
        rewardPrice: '',
        rewardDialog: false,
        exceptionalList: [],
        bounced: false,
        showShare: false,
        showComments: false,
        replyName: '',
        topicTopTenSkeleton: [],
        subNavHeaderTranslateClass: '',
        goodsWaterData: {
          e: 0,
          data: []
        },
        postWaterData: {
          e: 0,
          data: []
        },
        showSharePopup: 0,

        real_time_posts: [],
        real_time_posts_time: '',
        bureauList: [],
        headerCurrentIndex: 0
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let that = this
      // #ifdef APP
      plus.navigator.closeSplashscreen()
      // #endif
      //#ifdef APP
      //判断是否存在
      let isguide = uni.getStorageSync('isguide')
      if (isguide != 1) {
        uni.setStorageSync('isguide', 1)
        uni.wen.util
          .request(uni.wen.api.ApiRootUrl + 'app/guide')
          .then(function (res) {
            if (res.code == 200) {
              uni.redirectTo({
                url:
                  '/pages/guide/guide?guide_page=' +
                  encodeURIComponent(res.data)
              })
            }
          })
      }
      // #endif
      that.globalOnloadProcess(options)

      that.topicTopTenSkeleton = that.$store.state.skeleton.topicTopTen

      that.indexPosts()

      that.getBureauList()

      // 注意：mini js代码插入点002号，请勿删除下面一行（热帖榜）
      //script(<<<JS<<<002<<<JS);
    },

    onReady() {
      let that = this
      setTimeout(function () {
        that.userPlate()
      }, 1000)
    },
    onBackPress(e) {
      // 评论相关弹窗
      if (this.showComments) {
        this.showComments = false

        // #ifdef APP || H5
        setTimeout(function () {
          uni.showTabBar()
        }, 250)
        // #endif

        return true
      } else if (this.rewardDialog) {
        this.rewardDialog = false
        // #ifdef APP || H5
        setTimeout(function () {
          uni.showTabBar()
        }, 250)
        // #endif
        return true
      }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      let that = this
      // #ifdef MP-WEIXIN
      getApp().globalData.$mpTabbar = this.$mp.page.getTabBar()
      // #endif
      //  #ifdef MP
      that.tabBarSetData({ selected: 0 })
      // #endif
      //  #ifndef MP
      that.$store.commit('updateTabbarIndex', 0)
      // #endif
      that.updateScene(1, 0)

      if (that.$store.state.Ipushlished) {
        that.$store.commit('Ipushlished', false)
        uni.startPullDownRefresh()
      }

      setTimeout(function () {
        that.getSysMessageCount().then(function (res) {
          // that.getTabBar().setData({
          //     sysMessageCount: res
          // });

          //  #ifdef MP
          that.tabBarSetData({
            sysMessageCount: res
          })
          // #endif

          if (res > 0) {
            that.$store.commit('updateSysMessageCount', res)
          } else {
            that.$store.commit('updateSysMessageCount', 0)
          }
        })
      }, 1200)
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPageScroll(e) {
      let that = this
      let scroll_distance = e.scrollTop - prevScrollTop
      if (scroll_distance > 8) {
        if (e.scrollTop >= 65) {
          if (scroll_distance >= 65) {
            that.subNavHeaderTranslateClass = 'subNavHeaderHidden'
          } else {
            that.subNavHeaderTranslateClass = 'subNavHeaderHiddenLowly'
          }
        }
      } else if (scroll_distance < -8) {
        if (scroll_distance <= -65) {
          that.subNavHeaderTranslateClass = 'subNavHeaderShow'
        } else {
          that.subNavHeaderTranslateClass = 'subNavHeaderShowLowly'
        }
      } else {
        // that.subNavHeaderTranslateClass = '';
      }
      prevScrollTop = e.scrollTop
    },
    onPullDownRefresh: function () {
      let that = this
      that.setData({
        page: 1,
        posts: [],
        postWaterData: {
          e: 1,
          data: []
        },
        goodsWaterData: {
          e: 1,
          data: []
        },
        topicload: true,
        loadmoreShow: false,
        isLastPage: false,
        postsId: 0,
        commentFormShow: 0
      })
      that.setData({
        topicTopTenLoad: true
      })

      if (that.$store.state.config.tab[that.type]) {
        let type_ = that.$store.state.config.tab[that.type]['type']
        if (type_ == 2) {
          that.getRealtimeTopics()
        }
      }

      that.indexPosts()
      setTimeout(function () {
        uni.hideNavigationBarLoading()
        uni.stopPullDownRefresh()
      }, 700)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      let that = this
      if (!that.isLastPage && that.posts.length > 0) {
        that.setData({
          loadmoreShow: true,
          isLastPage: false,
          page: that.page + 1
        })
        that.indexPosts()
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
      let that = this
      if (res.from == 'button') {
        let share_title = that.$store.state.config.share.format.app_share_post
        let share_img = ''

        for (let index = 0; index < this.posts.length; index++) {
          const post = that.posts[index]

          if (post.id == Math.abs(that.postsId)) {
            share_title = share_title
              .replace('[post_content]', post.posts_content_raw)
              .replace('[author_name]', post.user.user_name)
            share_img = post.share_img
            break
          }
        }

        share_title = share_title.replace(/<[^>]*?>/g, '')
        return {
          title: share_title,
          path:
            '/pages/sticky/sticky?id=' +
            Math.abs(that.postsId) +
            '&fph=1&from_user=' +
            that.$store.state.userInfo.id +
            '&tenant=' +
            that.global__tenant__.tenant_id,
          imageUrl: share_img
        }
      } else {
        return {
          title: that.$store.state.config.share.format.app_share_right,
          path:
            '/pages/tabbar/index/index' +
            '?fph=1&from_user=' +
            that.$store.state.userInfo.id +
            '&tenant=' +
            that.global__tenant__.tenant_id,
          imageUrl: that.$store.state.config.img.default_share
        }
      }
    },

    onShareTimeline: function (res) {
      let that = this
      return {
        title: that.$store.state.config.share.format.app_share_right,
        query:
          '' +
          'fph=1&from_user=' +
          that.$store.state.userInfo.id +
          '&tenant=' +
          that.global__tenant__.tenant_id,
        imageUrl: that.$store.state.config.img.default_share
      }
    },
    onTabItemTap: function (e) {
      // #ifndef MP-WEIXIN
      if (e.pagePath == 'pages/tabbar/index/index') {
        uni.wen.util.doVibrateShort()
      }
      // #endif
    },
    methods: {
      checkHeaderTab(index) {
        this.headerTabIndex = index
      },
      getBureauList() {
        uni.wen.util
          .request(
            uni.wen.api.ApiRootUrl + 'bureau/list',
            {
              page: 1,
              city: '全国',
              tag: '全部'
            },
            'GET',
            147
          )
          .then(res => {
            this.bureauList = res.data.data.slice(0, 3)
          })
      },
      gotoBureauDetail(id) {
        uni.navigateTo({
          url: '/pagesZ/organize-bureau/details/index?id=' + id
        })
      },
      changeChanel(index) {
        let that = this
        that.channelIndex = index

        that.setData({
          posts: [],
          page: 1,
          topicload: true,
          loadmoreShow: false,
          isLastPage: false,
          pagebgcolorClass: '',
          postWaterData: {
            e: 1,
            data: []
          }
        })
        that.indexPosts()
      },
      //切换导航栏
      check: function (e) {
        let that = this
        let type = e.currentTarget.dataset.type
        let pid = e.currentTarget.dataset.pid
        let type_ = that.$store.state.config.tab[type]['type']

        if (type_ == null || type_ == undefined) {
          that.setData({
            plateId: pid,
            type: type,
            posts: [],
            postWaterData: {
              e: 1,
              data: []
            },
            page: 1,
            topicload: true,
            loadmoreShow: false,
            isLastPage: false,
            pagebgcolorClass: ''
          })
          that.indexPosts()
        } else {
          if (type_ == 999) {
            that.toSliderUrl(
              that.$store.state.config.tab[type]['target_type'],
              that.$store.state.config.tab[type]['target']
            )

            return false
          } else {
            that.setData({
              plateId: pid,
              type: type,
              posts: [],
              goodsWaterData: {
                e: 1,
                data: []
              },
              postWaterData: {
                e: 1,
                data: []
              },
              page: 1,
              topicload: true,
              loadmoreShow: false,
              isLastPage: false,
              pagebgcolorClass:
                that.channelIndex == 1 && type_ == 3 ? 'pagebg_default' : ''
            })

            if (type_ == 2 && that.topicTopTenLoad) {
              that.getRealtimeTopics()
            }
            that.indexPosts()
          }
        }
      },

      // 推荐笔记接口
      indexPosts() {
        let that = this
        uni.wen.util
          .request(uni.wen.api.ApiRootUrl + 'index/posts', {
            page: that.page,
            type: that.type,
            plate_id: that.plateId,
            channel: that.channelIndex
          })
          .then(function (res) {
            if (res.status) {
              if (res.data.current_page != that.page) {
                return false
              }

              let data = res.data
              let args = {}

              if (data.data && data.data.length > 0) {
                args.posts = that.posts.concat(data.data)
                args.page = data.current_page
                args.loadmoreShow = false
                args.isLastPage = false
              } else {
                args.isLastPage = true
              }
              args.topicload = false
              that.setData(args)

              if (that.$store.state.hasRefreshData) {
                that.$store.commit('hasRefresh', false)
              }

              if (data.data && data.data.length > 0) {
                if (
                  that.is_waterfall > 0 ||
                  that.$store.state.config.Ok === false ||
                  that.$store.state.config.Ok === undefined
                ) {
                  if (that.is_waterfall == 2) {
                    that.setData({
                      goodsWaterData: {
                        e: 0,
                        data: data.data
                      }
                    })
                  } else {
                    that.setData({
                      postWaterData: {
                        e: 0,
                        data: data.data
                      }
                    })
                  }
                } else {
                  console.log('xxxxxxxx2xxxxxxxxx')
                }
              }
            } else {
              that.setData({
                topicload: false
              })
              uni.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            }
          })
      },
      // 热门话题笔记接口
      getRealtimeTopics() {
        let that = this
        uni.wen.util
          .request(uni.wen.api.ApiRootUrl + 'realtime/top/topics')
          .then(function (res) {
            let args = {}
            args.topicTopList = res.data.topics
            args.topicTopTenLoad = false
            that.setData(args)
          })
      },
      flushPlateContent(pid) {
        let that = this
        that.setData({
          plateId: pid,
          posts: [],
          page: 1,
          topicload: true,
          loadmoreShow: false,
          isLastPage: false,
          postWaterData: {
            e: 1,
            data: []
          }
        })
        that.indexPosts()
      },
      refreshLocation() {
        let that = this
        uni.wen.util
          .getLocation(that)
          .then(res => {
            uni.$store.commit('updateLastLocation', {
              longitude: res.longitude,
              latitude: res.latitude
            })
            uni.wen.util
              .request(
                uni.wen.api.ApiRootUrl + 'common/tenants',
                { longitude: res.longitude, latitude: res.latitude },
                'POST'
              )
              .then(res => {
                if (res.status) {
                  uni.wen.util.updateUserInfo()
                  that.indexPosts()
                } else {
                  uni.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 1500
                  })
                }
              })
          })
          .catch(err => {
            uni.showToast({
              title: err.errMsg,
              icon: 'none'
            })
          })
      },

      //跳转更多顶部分类
      moretags: function () {
        this.setData({
          isOnShow: true
        })
        uni.wen.toUrl(6, '/pages/tags/list', null)
      },

      //刷新方法
      refreshEvent() {
        // this.onPullDownRefresh();
        uni.startPullDownRefresh()
      },

      touchmove() {},
      //轮播图切换
      changeCurrentIdx: function (e) {
        let that = this
        that.setData({
          currentIdx: e.detail.current
        })
      }
    }
  }
</script>
<style lang="scss">
  @import './index.scss';
  @import './newIndex.scss';

  .hasRefreshData-tip {
    background: #f0f9eb;
    border: 4rpx solid #e1f3d8;
    color: #67c23a;
    font-size: $uni-font-size-sm;
    text-align: center;
    padding: 10rpx 0;
    display: block;
  }
  .pagemode_examine {
    .tab-bar-item.type_5 {
      display: none;
    }
  }
</style>
