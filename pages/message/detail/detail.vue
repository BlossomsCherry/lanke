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
    <view class="mini-page-body">
      <navBar
        :back="true"
        :home="fph"
        :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"
        :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'"
      >
        <view
          class="message-nav-center"
          slot="center"
          @tap.stop.prevent="toSliderUrl(4, oid)"
        >
          <text class="_text">{{ oname }}</text>
        </view>
      </navBar>
      <view class="content" @touchstart="hideDrawer">
        <scroll-view
          class="msg-list"
          :class="popupLayerClass"
          scroll-y="true"
          :show-scrollbar="false"
          :scroll-with-animation="scrollAnimation"
          :scroll-top="scrollTop"
          :scroll-into-view="scrollToView"
          @scrolltoupper="getUserChat(0)"
          upper-threshold="50"
          :style="
            'padding-bottom: ' + textareaBottom + 'px;top: ' + CustomBar + 'px;'
          "
        >
          <!-- 加载历史数据waitingUI -->
          <view class="loading" v-if="isHistoryLoading">
            <view class="spinner">
              <view class="rect rect1"></view>
              <view class="rect rect2"></view>
              <view class="rect rect3"></view>
              <view class="rect rect4"></view>
              <view class="rect rect5"></view>
            </view>
          </view>
          <view class="inner">
            <view
              class="row"
              v-for="(row, index) in messages"
              :key="index"
              :id="'msg' + row.id"
            >
              <!-- 系统消息 -->
              <block v-if="row.type == 'system'">
                <view class="system">
                  <!-- 文字消息 -->
                  <view v-if="row.msg.type == 'text'" class="text">
                    {{ row.msg.content.text }}
                  </view>
                  <!-- 领取红包消息 -->
                  <view
                    v-if="row.msg.type == 'redEnvelope'"
                    class="red-envelope"
                  >
                    <image src="/static/chat/red-envelope-chat.png"></image>
                    {{ row.msg.content.text }}
                  </view>
                </view>
              </block>
              <!-- 用户消息 -->
              <block v-if="row.type == 'user'">
                <!-- 自己发出的消息 -->
                <view class="my" v-if="row.user_id == myUserInfo.id">
                  <!-- 左-消息 -->
                  <view class="left">
                    <!-- 语言消息 -->
                    <block v-if="row.mode == 'audio'">
                      <view
                        class="bubble voice"
                        @tap.stop.prevent="playVoice(row)"
                        :class="playMsgid == row.id ? 'play' : ''"
                      >
                        <view class="length">{{ row.chat_audio_length }}</view>
                        <i class="mini-icon mini-yuyin"></i>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'img'">
                      <image
                        @tap.stop.prevent="previewImgFunc"
                        :data-list="row.imgList"
                        :data-src="row.chat_image"
                        mode="aspectFill"
                        class="item-right-image"
                        :src="row.chat_image"
                      ></image>
                    </block>
                    <block v-else-if="row.mode == 'refer'">
                      <view
                        class="refer-post"
                        @tap.stop.prevent="toSliderUrl(1, row.refer_id)"
                      >
                        <view class="img">
                          <image
                            class="_image"
                            :src="row.refer.img"
                            mode="aspectFill"
                          ></image>
                        </view>
                        <view class="post-info">
                          <view class="title">{{
                            row.refer.posts_content_raw
                          }}</view>
                          <block v-if="row.refer.user">
                            <user-info
                              :user="row.refer.user"
                              :scene="15"
                            ></user-info>
                          </block>
                        </view>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'adoption_reply'">
                      <view class="adoption_reply me flex-column">
                        <view class="line line-0"> 领养信息已发送 </view>

                        <view
                          class="adoption flex-row"
                          @tap.stop.prevent="
                            toSliderUrl(
                              6,
                              '/pagesP/pet-adoption/details/index?id=' +
                                row.adoption_reply.adoption.id
                            )
                          "
                        >
                          <view class="left_">
                            <image
                              class="pet_avatar"
                              :src="row.adoption_reply.adoption.image"
                              mode="aspectFit"
                            ></image>
                          </view>
                          <view class="right_ flex-column">
                            <view class="name">
                              {{ row.adoption_reply.adoption.name }}
                            </view>
                            <view class="cos_tip">{{
                              row.adoption_reply.adoption.cos_tip
                            }}</view>
                            <view class="time">{{
                              row.adoption_reply.adoption.format_time
                            }}</view>
                          </view>
                        </view>
                        <view class="line line-1">
                          <view class="label"> 申请状态: </view>
                          <text
                            :class="'value status_' + row.adoption_reply.status"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.status_tip }}
                          </text>
                        </view>
                        <view class="line line-1">
                          <view class="label"> 性别: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.gender == 1 ? '男' : '女' }}
                          </text>
                        </view>
                        <view class="line line-2">
                          <view class="label"> 养宠经验: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{
                              row.adoption_reply.is_experience == 1
                                ? '有'
                                : '无'
                            }}
                          </text>
                        </view>
                        <view class="line line-3">
                          <view class="label"> 婚姻状况: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.marital_tip }}
                          </text>
                        </view>
                        <view class="line line-3">
                          <view class="label"> 住房情况: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.housing_tip }}
                          </text>
                        </view>
                        <view class="line line-3">
                          <view class="label"> 工作状态: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.working_tip }}
                          </text>
                        </view>
                        <view class="line line-4">
                          <view class="label"> 职业: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.job }}
                          </text>
                        </view>
                        <view class="line line-5">
                          <view class="label"> 生日: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.birthday }}
                          </text>
                        </view>
                        <view class="line line-6">
                          <view class="label"> 收入: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.income_tip }}
                          </text>
                        </view>
                        <view class="line line-7">
                          <view class="label"> 所在地: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.region_tip }}
                          </text>
                        </view>
                        <view class="line line-8">
                          <view class="label"> 微信号: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.wechatId }}
                          </text>
                        </view>
                        <view class="line line-9">
                          <view class="label"> 手机号: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.mobile }}
                          </text>
                        </view>
                        <view class="line line-10">
                          <view class="label"> 我想说: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.remark }}
                          </text>
                        </view>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'contact_apply'">
                      <view class="contact_apply me flex-column">
                        <view class="line line-0">
                          {{ row.contact_apply.title }}
                        </view>
                        <view class="line line-1">
                          <view class="label"> 申请状态 </view>
                          <text
                            :class="'value status_' + row.contact_apply.status"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.contact_apply.status_tip }}
                          </text>
                        </view>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'shop_good'">
                      <view class="shop-good-view">
                        <view
                          class="item-right-text"
                          v-if="row.shop_good.service_tip"
                        >
                          {{ row.shop_good.service_tip }}
                          <view class="shop-good">
                            <view
                              class="good-inner"
                              @tap.stop.prevent="
                                toSliderUrl(3, row.shop_good.id)
                              "
                            >
                              <view class="pic">
                                <image
                                  class="_image"
                                  :src="row.shop_good.pic"
                                ></image>
                              </view>
                              <view class="good-info">
                                <view class="info">
                                  <view class="title u-line-1">{{
                                    row.shop_good.name
                                  }}</view>
                                  <view class="gapp"></view>
                                  <scroll-view
                                    class="_scroll_view"
                                    v-if="
                                      row.shop_good.tag &&
                                      row.shop_good.tag.length > 0
                                    "
                                  >
                                    <view class="good-tag">
                                      <view
                                        class="tag-item"
                                        v-for="(tag, tag_index) in row.shop_good
                                          .tag"
                                        >{{ tag }}</view
                                      >
                                    </view>
                                  </scroll-view>
                                  <view class="gapp"></view>
                                  <view class="good-price">
                                    <view class="left-price">
                                      <block
                                        v-if="row.shop_good.credit_type == 1"
                                      >
                                        <view class="vip-price"
                                          >￥{{ row.shop_good.vip_price }}</view
                                        >
                                      </block>
                                      <block v-else>
                                        <view class="gold-icon">
                                          <i
                                            class="gold-color mini-icon mini-Gold_coin_01"
                                          ></i>
                                        </view>
                                        <view class="golg-price">{{
                                          row.shop_good.vip_price
                                        }}</view>
                                      </block>
                                      <!-- <view class="origin-vip">￥{{ row.shop_good.price }}</view> -->
                                    </view>
                                    <view class="right-buys">
                                      {{
                                        filters.toFix(row.shop_good.buys)
                                      }}人已买
                                    </view>
                                  </view>
                                </view>
                              </view>
                            </view>
                          </view>
                          <view class="togood">
                            <view></view>
                            <view
                              class="togoodbtn gray"
                              @tap.stop.prevent="
                                toSliderUrl(3, row.shop_good.id)
                              "
                              >查看商品</view
                            >
                          </view>
                        </view>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'used_good'">
                      <view class="used_good_view">
                        <view class="item-right-text">
                          {{ row.used_good.servicer_word }}
                          <view class="shop-good">
                            <view
                              class="good-inner"
                              @tap.stop.prevent="
                                toSliderUrl(28, row.used_good.id)
                              "
                            >
                              <view class="pic">
                                <image
                                  class="_image"
                                  :src="row.used_good.pic"
                                ></image>
                              </view>
                              <view class="good-info">
                                <view class="info">
                                  <view class="title u-line-1">{{
                                    row.used_good.title
                                  }}</view>
                                  <view class="gapp"></view>
                                  <scroll-view class="_scroll_view">
                                    <view class="good-tag">
                                      <view class="tag-item">闲置</view>
                                      <view class="tag-item">{{
                                        row.used_good.tip
                                      }}</view>
                                      <view
                                        class="tag-item"
                                        v-if="row.used_good.classify_id > 0"
                                        >{{ row.used_good.classify.name }}</view
                                      >
                                    </view>
                                  </scroll-view>
                                  <view class="gapp"></view>
                                  <view class="good-price">
                                    <view class="left-price">
                                      <view class="vip-price"
                                        >￥{{ row.used_good.price }}</view
                                      >
                                      <view class="origin-vip"
                                        >￥{{
                                          row.used_good.original_price
                                        }}</view
                                      >
                                    </view>
                                    <view class="right-buys">
                                      {{
                                        filters.toFix(
                                          row.used_good.needed_count
                                        )
                                      }}人想要
                                    </view>
                                  </view>
                                </view>
                              </view>
                            </view>
                          </view>
                          <view class="togood">
                            <view></view>
                            <view
                              class="togoodbtn"
                              @tap.stop.prevent="
                                toSliderUrl(28, row.used_good.id)
                              "
                              >查看商品</view
                            >
                          </view>
                        </view>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'bureau'">
                      <view class="bureau_view">
                        <view
                          class="list_box"
                          @tap.stop.prevent="toSliderUrl(34, row.bureau.id)"
                        >
                          <view class="list_box_cont">
                            <image
                              class="image"
                              :src="row.bureau.pic"
                              mode="aspectFill"
                            ></image>
                            <view class="cont">
                              <view class="title_ u-line-1">
                                {{ row.bureau.title }}
                              </view>
                              <view class="pirce">{{
                                row.bureau.least_price_tip
                              }}</view>
                              <view class="other-text-wrapper">
                                <u-icon name="clock" size="25" color="A3A3A3" />
                                <view class="time">{{
                                  row.bureau.service_date_start +
                                  ' ' +
                                  row.bureau.service_time_start
                                }}</view>
                              </view>

                              <view class="other-text-wrapper">
                                <u-icon name="map" size="25" color="A3A3A3" />
                                <view class="address u-line-1"
                                  >{{ row.bureau.distance }}
                                  {{ row.bureau.address_detailed }}</view
                                >
                              </view>
                            </view>
                          </view>
                        </view>
                      </view>
                    </block>
                    <block v-else>
                      <mp-html
                        class="item-right-text item-right-text-me"
                        :content="row.chat_content"
                        :scene="15"
                        :lazy-load="false"
                      />
                    </block>

                    <view
                      v-if="false"
                      class="bubble red-envelope"
                      @tap.stop.prevent="openRedEnvelope(row.msg, index)"
                    >
                      <image src="/static/chat/red-envelope.png"></image>
                      <view class="tis">
                        <!-- 点击开红包 -->
                      </view>
                      <view class="blessing">
                        {{ row.msg.content.blessing }}
                      </view>
                    </view>
                  </view>
                  <!-- 右-头像 -->
                  <view class="right">
                    <image :src="myUserInfo.user_avatar"></image>
                  </view>
                </view>
                <!-- 别人发出的消息 -->
                <view class="other" v-else>
                  <!-- 左-头像 -->
                  <view class="left">
                    <image
                      :src="row.user.user_avatar"
                      @tap.stop.prevent="toSliderUrl(4, row.user.id)"
                    ></image>
                  </view>
                  <!-- 右-用户名称-时间-消息 -->
                  <view class="right">
                    <view class="username">
                      <view class="name">{{ row.user.user_name }}</view>
                      <view class="time">{{ row.datetime }}</view>
                    </view>
                    <block v-if="row.mode == 'audio'">
                      <view
                        class="bubble voice"
                        @tap.stop.prevent="playVoice(row)"
                        :class="playMsgid == row.id ? 'play' : ''"
                      >
                        <i class="mini-icon mini-yuyin-copy"></i>
                        <view class="length">{{ row.chat_audio_length }}</view>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'img'">
                      <image
                        @tap.stop.prevent="previewImgFunc"
                        :data-list="row.imgList"
                        :data-src="row.chat_image"
                        mode="aspectFill"
                        class="item-right-image"
                        :src="row.chat_image"
                      ></image>
                    </block>
                    <block v-else-if="row.mode == 'refer'">
                      <view
                        class="refer-post"
                        @tap.stop.prevent="toSliderUrl(1, row.refer_id)"
                      >
                        <view class="img">
                          <image
                            class="_image"
                            :src="row.refer.img"
                            mode="aspectFill"
                          ></image>
                        </view>
                        <view class="post-info">
                          <view class="title">{{
                            row.refer.posts_content_raw
                          }}</view>
                          <block v-if="row.refer.user">
                            <user-info
                              :user="row.refer.user"
                              :scene="15"
                            ></user-info>
                          </block>
                        </view>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'adoption_reply'">
                      <view class="adoption_reply flex-column">
                        <view class="line line-0"> 有新的领养申请 </view>

                        <view
                          class="adoption flex-row"
                          @tap.stop.prevent="
                            toSliderUrl(
                              6,
                              '/pagesP/pet-adoption/details/index?id=' +
                                row.adoption_reply.adoption.id
                            )
                          "
                        >
                          <view class="left_">
                            <image
                              class="pet_avatar"
                              :src="row.adoption_reply.adoption.image"
                              mode="aspectFit"
                            ></image>
                          </view>
                          <view class="right_ flex-column">
                            <view class="name">
                              {{ row.adoption_reply.adoption.name }}
                            </view>
                            <view class="cos_tip">{{
                              row.adoption_reply.adoption.cos_tip
                            }}</view>
                            <view class="time">{{
                              row.adoption_reply.adoption.format_time
                            }}</view>
                          </view>
                        </view>

                        <view class="line line-1">
                          <view class="label"> 性别: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.gender == 1 ? '男' : '女' }}
                          </text>
                        </view>
                        <view class="line line-2">
                          <view class="label"> 养宠经验: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{
                              row.adoption_reply.is_experience == 1
                                ? '有'
                                : '无'
                            }}
                          </text>
                        </view>
                        <view class="line line-3">
                          <view class="label"> 婚姻状况: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.marital_tip }}
                          </text>
                        </view>
                        <view class="line line-3">
                          <view class="label"> 住房情况: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.housing_tip }}
                          </text>
                        </view>
                        <view class="line line-3">
                          <view class="label"> 工作状态: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.working_tip }}
                          </text>
                        </view>
                        <view class="line line-4">
                          <view class="label"> 职业: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.job }}
                          </text>
                        </view>
                        <view class="line line-5">
                          <view class="label"> 生日: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.birthday }}
                          </text>
                        </view>
                        <view class="line line-6">
                          <view class="label"> 收入: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.income_tip }}
                          </text>
                        </view>
                        <view class="line line-7">
                          <view class="label"> 所在地: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.region_tip }}
                          </text>
                        </view>
                        <view class="line line-8">
                          <view class="label"> 微信号: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.wechatId }}
                          </text>
                        </view>
                        <view class="line line-9">
                          <view class="label"> 手机号: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.mobile }}
                          </text>
                        </view>
                        <view class="line line-10">
                          <view class="label"> 我想说: </view>
                          <text
                            class="value"
                            :selectable="true"
                            :user-select="true"
                          >
                            {{ row.adoption_reply.remark }}
                          </text>
                        </view>
                        <view
                          class="line line-11"
                          style="
                            margin-top: 20rpx;
                            justify-content: space-between;
                          "
                        >
                          <view></view>
                          <view class="flex-row">
                            <block v-if="row.adoption_reply.status == 0">
                              <u-button
                                text="拒绝"
                                size="small"
                                shape="circle"
                                @click="
                                  adoption_apply_action(
                                    row.adoption_reply.id,
                                    false
                                  )
                                "
                              ></u-button>
                              <view class="space" style="width: 40rpx"></view>
                              <u-button
                                text="同意"
                                type="primary"
                                size="small"
                                shape="circle"
                                @click="
                                  adoption_apply_action(
                                    row.adoption_reply.id,
                                    true
                                  )
                                "
                              ></u-button>
                            </block>
                            <block v-else>
                              <block v-if="row.adoption_reply.status == 1">
                                <u-button
                                  text="已同意"
                                  type="success"
                                  size="small"
                                  shape="circle"
                                  :disabled="true"
                                ></u-button>
                              </block>
                              <block v-else>
                                <u-button
                                  text="已拒绝"
                                  type="error"
                                  size="small"
                                  shape="circle"
                                  :disabled="true"
                                ></u-button>
                              </block>
                            </block>
                          </view>
                        </view>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'shop_good'">
                      <view class="shop-good-view">
                        <view
                          class="item-right-text"
                          v-if="row.shop_good.service_tip"
                        >
                          {{ row.shop_good.service_tip }}
                          <view class="shop-good">
                            <view
                              class="good-inner"
                              @tap.stop.prevent="
                                toSliderUrl(3, row.shop_good.id)
                              "
                            >
                              <view class="pic">
                                <image
                                  class="_image"
                                  :src="row.shop_good.pic[0]"
                                ></image>
                              </view>
                              <view class="good-info">
                                <view class="info">
                                  <view class="title u-line-1">{{
                                    row.shop_good.name
                                  }}</view>
                                  <view class="gapp"></view>
                                  <scroll-view
                                    class="_scroll_view"
                                    v-if="
                                      row.shop_good.tag &&
                                      row.shop_good.tag.length > 0
                                    "
                                  >
                                    <view class="good-tag">
                                      <view
                                        class="tag-item"
                                        v-for="(tag, tag_index) in row.shop_good
                                          .tag"
                                        >{{ tag }}</view
                                      >
                                    </view>
                                  </scroll-view>
                                  <view class="gapp"></view>
                                  <view class="good-price">
                                    <view class="left-price">
                                      <block
                                        v-if="row.shop_good.credit_type == 1"
                                      >
                                        <view class="vip-price"
                                          >￥{{ row.shop_good.vip_price }}</view
                                        >
                                      </block>
                                      <block v-else>
                                        <view class="gold-icon">
                                          <i
                                            class="gold-color mini-icon mini-Gold_coin_01"
                                          ></i>
                                        </view>
                                        <view class="golg-price">{{
                                          row.shop_good.vip_price
                                        }}</view>
                                      </block>
                                      <!-- <view class="origin-vip">￥{{ row.shop_good.price }}</view> -->
                                    </view>
                                    <view class="right-buys">
                                      {{
                                        filters.toFix(row.shop_good.buys)
                                      }}人已买
                                    </view>
                                  </view>
                                </view>
                              </view>
                            </view>
                          </view>
                          <view class="togood">
                            <view></view>
                            <view
                              class="togoodbtn"
                              @tap.stop.prevent="
                                toSliderUrl(3, row.shop_good.id)
                              "
                              >去下单</view
                            >
                          </view>
                        </view>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'used_good'">
                      <view class="used_good_view">
                        <view class="item-right-text">
                          {{ row.used_good.servicer_word }}
                          <view class="shop-good">
                            <view
                              class="good-inner"
                              @tap.stop.prevent="
                                toSliderUrl(28, row.used_good.id)
                              "
                            >
                              <view class="pic">
                                <image
                                  class="_image"
                                  :src="row.used_good.pic"
                                ></image>
                              </view>
                              <view class="good-info">
                                <view class="info">
                                  <view class="title u-line-1">{{
                                    row.used_good.title
                                  }}</view>
                                  <view class="gapp"></view>
                                  <scroll-view class="_scroll_view">
                                    <view class="good-tag">
                                      <view class="tag-item">闲置</view>
                                      <view class="tag-item">{{
                                        row.used_good.tip
                                      }}</view>
                                      <view
                                        class="tag-item"
                                        v-if="row.used_good.classify_id > 0"
                                        >{{ row.used_good.classify.name }}</view
                                      >
                                    </view>
                                  </scroll-view>
                                  <view class="gapp"></view>
                                  <view class="good-price">
                                    <view class="left-price">
                                      <view class="vip-price"
                                        >￥{{ row.used_good.price }}</view
                                      >
                                      <view class="origin-vip"
                                        >￥{{
                                          row.used_good.original_price
                                        }}</view
                                      >
                                    </view>
                                    <view class="right-buys">
                                      {{
                                        filters.toFix(
                                          row.used_good.needed_count
                                        )
                                      }}人想要
                                    </view>
                                  </view>
                                </view>
                              </view>
                            </view>
                          </view>
                          <view class="togood">
                            <view></view>
                            <view
                              class="togoodbtn"
                              @tap.stop.prevent="
                                toSliderUrl(28, row.used_good.id)
                              "
                              >去下单</view
                            >
                          </view>
                        </view>
                      </view>
                    </block>
                    <block v-else-if="row.mode == 'bureau'">
                      <view class="bureau_view">
                        <view
                          class="list_box"
                          @tap.stop.prevent="toSliderUrl(34, row.bureau.id)"
                        >
                          <view class="list_box_cont">
                            <image
                              class="image"
                              :src="row.bureau.pic"
                              mode="aspectFill"
                            ></image>
                            <view class="cont">
                              <view class="title_ u-line-1">
                                {{ row.bureau.title }}
                              </view>
                              <view class="pirce">{{
                                row.bureau.least_price_tip
                              }}</view>
                              <view class="other-text-wrapper">
                                <u-icon name="clock" size="25" color="A3A3A3" />
                                <view class="time">{{
                                  row.bureau.service_date_start +
                                  ' ' +
                                  row.bureau.service_time_start
                                }}</view>
                              </view>

                              <view class="other-text-wrapper">
                                <u-icon name="map" size="25" color="A3A3A3" />
                                <view class="address u-line-1"
                                  >{{ row.bureau.distance }}
                                  {{ row.bureau.address_detailed }}</view
                                >
                              </view>
                            </view>
                          </view>
                        </view>
                      </view>
                    </block>
                    <block v-else>
                      <mp-html
                        class="item-right-text"
                        :content="row.chat_content"
                        :scene="15"
                        :lazy-load="false"
                      />
                    </block>
                    <view
                      v-if="false"
                      class="bubble red-envelope"
                      @tap.stop.prevent="openRedEnvelope(row.msg, index)"
                    >
                      <image src="/static/chat/red-envelope.png"></image>
                      <view class="tis">
                        <!-- 点击开红包 -->
                      </view>
                      <view class="blessing">
                        {{ row.msg.content.blessing }}
                      </view>
                    </view>
                  </view>
                </view>
              </block>
            </view>
            <view style="height: 30vh"></view>
          </view>
        </scroll-view>
      </view>

      <view class="bottom-wrap" :class="popupLayerClass">
        <view
          :style="
            textareaBottom > 0
              ? 'padding-bottom: calc( ' +
                textareaBottom +
                'px - env(safe-area-inset-bottom) );transition: padding-bottom 0.1s;'
              : 'padding-bottom: 0;'
          "
        >
          <!-- 底部输入栏 -->
          <view
            class="input-box cu-bar tabbar"
            :class="popupLayerClass"
            @touchmove.stop.prevent="discard"
          >
            <!-- H5下不能录音，输入栏布局改动一下 -->
            <!-- #ifndef H5 -->
            <view class="voice" v-if="config_pays_paycode_18">
              <i
                class="mini-icon"
                :class="isVoice ? 'mini-jianpan1' : 'mini-flighticowifipsd'"
                @tap.stop.prevent="switchVoice"
              ></i>
            </view>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <view class="more left" @tap.stop.prevent="showMore">
              <i class="mini-icon mini-jjia-"></i>
            </view>
            <!-- #endif -->

            <view class="textbox">
              <view
                class="voice-mode"
                :class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']"
                @touchstart="voiceBegin"
                @touchmove.stop.prevent="voiceIng"
                @touchend="voiceEnd"
                @touchcancel="voiceCancel"
                >{{ voiceTis }}</view
              >

              <view class="text-mode" :class="isVoice ? 'hidden' : ''">
                <view class="box">
                  <textarea
                    class="_textarea"
                    :auto-height="true"
                    :adjust-position="false"
                    v-model="chat_content"
                    :auto-blur="true"
                    @focus="textareaFocus($event, 1)"
                    @blur="textareaFocus($event, 0)"
                    @keyboardheightchange="textareaFocus($event, 3)"
                    @input="textareaFocus($event, 1)"
                    :cursor-spacing="60"
                    :fixed="true"
                    :show-confirm-bar="false"
                  />
                </view>
              </view>
            </view>

            <view class="more right" @tap.stop.prevent="chooseEmoji(1)">
              <i class="mini-icon mini-xiaolian"></i>
            </view>
            <!-- #ifndef H5 -->
            <view
              class="more right"
              @tap.stop.prevent="showMore"
              v-if="!showSendBtn"
            >
              <i class="btn mini-icon mini-jjia-"></i>
            </view>
            <!-- #endif -->
            <view
              class="send"
              :class="isVoice ? 'hidden' : ''"
              @tap.stop.prevent="toAddChat"
              v-if="showSendBtn"
            >
              <view class="btn">发送</view>
            </view>
          </view>
          <!-- 抽屉栏 -->
          <view
            class="popup-layer"
            :class="popupLayerClass"
            @touchmove.stop.prevent="discard"
            :style="
              textareaBottom == 0
                ? 'padding-bottom: env(safe-area-inset-bottom);'
                : ''
            "
          >
            <!-- 表情 -->
            <swiper
              class="emoji-swiper"
              :class="{ hidden: hideEmoji }"
              indicator-dots="true"
              duration="150"
            >
              <block
                v-if="config2_emoji.page_1 && config2_emoji.page_1.length > 0"
              >
                <swiper-item class="_swiper-item">
                  <scroll-view
                    class="emoji-srcoll"
                    :scroll-y="true"
                    :enable-flex="true"
                  >
                    <view class="emoji-srcoll-content">
                      <view
                        class="_view"
                        v-for="(em, index) in config2_emoji.page_1"
                        :key="index"
                        @tap.stop.prevent="addEmoji(em.alt)"
                      >
                        <image
                          class="_image"
                          mode="widthFix"
                          :src="em.emoji"
                        ></image>
                      </view>
                    </view>
                  </scroll-view>
                </swiper-item>
              </block>
              <block
                v-if="config2_emoji.page_2 && config2_emoji.page_2.length > 0"
              >
                <swiper-item class="_swiper-item">
                  <scroll-view
                    class="emoji-srcoll"
                    :scroll-y="true"
                    :enable-flex="true"
                  >
                    <view class="emoji-srcoll-content">
                      <view
                        class="_view"
                        v-for="(em2, index2) in config2_emoji.page_2"
                        :key="index2"
                        @tap.stop.prevent="addEmoji(em2.alt)"
                      >
                        <image
                          class="_image"
                          mode="widthFix"
                          :src="em2.emoji"
                        ></image>
                      </view>
                    </view>
                  </scroll-view>
                </swiper-item>
              </block>
              <block
                v-if="config2_emoji.page_3 && config2_emoji.page_3.length > 0"
              >
                <swiper-item class="_swiper-item">
                  <scroll-view
                    class="emoji-srcoll"
                    :scroll-y="true"
                    :enable-flex="true"
                  >
                    <view class="emoji-srcoll-content">
                      <view
                        class="_view"
                        v-for="(em3, index3) in config2_emoji.page_3"
                        :key="index3"
                        @tap.stop.prevent="addEmoji(em3.alt)"
                      >
                        <image
                          class="_image"
                          mode="widthFix"
                          :src="em3.emoji"
                        ></image>
                      </view>
                    </view>
                  </scroll-view>
                </swiper-item>
              </block>
            </swiper>

            <!-- 更多功能 相册-拍照-红包 -->
            <view class="more-layer" :class="{ hidden: hideMore }">
              <view class="list">
                <view class="box" @tap.stop.prevent="chooseImage">
                  <view class="box-icon">
                    <i class="mini-icon mini-tupian2"></i>
                  </view>
                  <view class="_text">相册</view>
                </view>
                <view class="box" @tap.stop.prevent="camera">
                  <view class="box-icon">
                    <i class="mini-icon mini-xiangji"></i>
                  </view>
                  <view class="_text">拍照</view>
                </view>

                <!-- <view class="box" @tap.stop.prevent="contactApplyForm">
								<view class="box-icon">
									<i class="mini-icon mini-xiangji"></i>
								</view>
								<view class="_text">联系方式</view>
							</view> -->
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 录音UI效果 -->
      <view class="record" :class="recording ? '' : 'hidden'">
        <view class="ing" :class="willStop ? 'hidden' : ''">
          <i class="mini-icon mini-icon-24-luyin"></i>
        </view>
        <view class="cancel" :class="willStop ? '' : 'hidden'">
          <i class="mini-icon mini-yuyinchehui"></i>
        </view>
        <view class="tis" :class="willStop ? 'change' : ''">{{
          recordTis
        }}</view>
      </view>
      <!-- 红包弹窗 -->
      <view class="windows" :class="windowsState">
        <!-- 遮罩层 -->
        <view
          class="mask"
          @touchmove.stop.prevent="discard"
          @tap.stop.prevent="closeRedEnvelope"
        ></view>
        <view class="layer" @touchmove.stop.prevent="discard">
          <view class="open-redenvelope">
            <view class="top">
              <view class="close-btn">
                <view
                  class="icon close"
                  @tap.stop.prevent="closeRedEnvelope"
                ></view>
              </view>
              <image
                src="https://zhoukaiwen.com/img/qdpz/face/face_1.jpg"
              ></image>
            </view>
            <view class="from">来自{{ redenvelopeData.from }}</view>
            <view class="blessing">{{ redenvelopeData.blessing }}</view>
            <view class="money">{{ redenvelopeData.money }}</view>
            <view class="showDetails">
              查看领取详情 <view class="icon to"></view>
            </view>
          </view>
        </view>
      </view>

      <u-popup
        :show="showContactApplyPopup"
        @close="closeContactApplyPopup"
        :zIndex="99999991009"
        mode="bottom"
        :safeAreaInsetBottom="false"
      >
        <view class="contact-apply-warap" v-if="config_app_mode != 'examine'">
          <view class="inner">
            <view class="title">
              申请对方的联系方式
              <i
                class="mini-icon mini-shanchu2"
                @tap.stop.prevent="closeContactApplyPopup"
              ></i>
            </view>

            <view class="apply-content">
              <view class="line line-1">
                <view class="left"> 联系方式 </view>
                <view class="right">
                  <checkbox-group @change="contactApplyCheckChange">
                    <label>
                      <checkbox
                        value="phone"
                        :checked="contactFormData.is_phone == 1"
                        :color="primaryColor"
                        :disabled="
                          !(userInfo.phone && userInfo.phone.length > 0)
                        "
                        style="transform: scale(0.7)"
                      />手机号
                    </label>
                    <label>
                      <checkbox
                        value="wechat"
                        :checked="contactFormData.is_wechat_account == 1"
                        :color="primaryColor"
                        :disabled="
                          !(
                            userInfo.wechat_account &&
                            userInfo.wechat_account.length > 0
                          )
                        "
                        style="transform: scale(0.7)"
                      />微信号
                    </label>
                  </checkbox-group>
                </view>
              </view>
              <view class="line line-2">
                <textarea
                  auto-height
                  class="_textarea"
                  placeholder="请填写申请原因"
                  v-model="contactFormData.reason"
                />
              </view>
              <view class="line line-3">
                <view class="btn" @tap.stop.prevent="closeContactApplyPopup"
                  >取消</view
                >
                <view
                  class="btn apply"
                  :style="
                    (userInfo.phone && userInfo.phone.length > 0) ||
                    (userInfo.wechat_account &&
                      userInfo.wechat_account.length > 0)
                      ? ''
                      : 'opacity: 0.8;'
                  "
                  @tap.stop.prevent="applyUserContact"
                  >申请</view
                >
              </view>
            </view>
          </view>
        </view>
      </u-popup>

      <my-toast
        ref="mytoast"
        :isdistance="true"
        :toast="mytoast_data"
      ></my-toast>
    </view>
  </view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
  import myToast from '@/contrib/components/common/toast/toast'
  import navBar from '@/components/common/navbar/navbar'
  import hoverBall from '@/contrib/components/common/hover-ball/hover-ball'
  import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html'

  import UserInfo from '@/pages/sticky/components/user-info'

  const mixins = require('@/mixins/message')
  const common = require('@/mixins/common')
  const user = require('@/mixins/user')
  var options = {}
  mixins(options)
  common(options)
  user(options)
  export default {
    mixins: [{ methods: options }],
    components: {
      myToast,
      navBar,
      hoverBall,
      mpHtml,
      UserInfo
    },
    computed: {
      CustomBar: {
        get() {
          return this.$store.state.CustomBar
        }
      },
      config2_emoji: {
        get() {
          let that = this
          return that.$store.state.config2.emoji
        },
        set(v) {}
      },
      config_pays_paycode_18: {
        get() {
          let that = this
          return that.$store.state.config.pays.paycode_18
        },
        set(v) {}
      },
      config_app_mode: {
        get() {
          let that = this
          return that.$store.state.config.app.mode
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
        page__scene__: 15,
        cursor: 0,
        showSendBtn: false,
        messages: [],
        oid: 0,
        oname: '',
        page: 1,
        isLastPage: false,
        //文字消息
        chat_content: '',
        chat_image: '',
        chat_audio_url: '',
        chat_audio_length: 0,
        //消息列表
        isHistoryLoading: true,
        scrollAnimation: false,
        scrollTop: 0,
        scrollToView: '',
        msgList: [],
        msgImgList: [],
        myuid: 0,

        textareaBottom: 0,

        //录音相关参数
        // #ifndef H5
        //H5不能录音
        RECORDER: uni.getRecorderManager(),
        // #endif
        isVoice: false,
        voiceTis: '按住 说话',
        recordTis: '手指上滑 取消发送',
        recording: false,
        willStop: false,
        initPoint: {
          identifier: 0,
          Y: 0
        },
        recordTimer: null,
        recordLength: 0,

        //播放语音相关参数
        AUDIO: uni.createInnerAudioContext(),
        playMsgid: null,
        VoiceTimer: null,
        // 抽屉参数
        popupLayerClass: '',
        // more参数
        hideMore: true,
        //表情定义
        hideEmoji: true,
        //红包相关参数
        windowsState: '',
        redenvelopeData: {
          rid: null, //红包ID
          from: null,
          face: null,
          blessing: null,
          money: null
        },

        showContactApplyPopup: false,

        userInfo: {
          id: 0,
          user_name: '',
          user_background_maps: '',
          user_background_color: '63,47,45',
          user_avatar: '',
          avatar_frame_url: '',
          is_official: 0,
          is_authentication: 0,
          is_member: 0,
          user_introduce: '',
          followTotal: 0,
          fansTotal: 0,
          likeTotal: 0,
          isFollow: '',
          phone: '',
          country_code: '86',
          real_name: '',
          wechat_account: ''
        },
        contactFormData: {
          object_id: 0,
          is_phone: 0,
          is_wechat_account: 0,
          reason: '',
          with_type: 0,
          with_object_id: 0
        }
      }
    },
    onLoad(options) {
      const pages = getCurrentPages()
      const currPage = pages[pages.length - 1]
      console.log(options,currPage.route,'ooooooooooooooooooo')
      let that = this
      that.globalOnloadProcess(options)
      that.setData({
        oid: options.userid,
        oname: options.name || '聊天详情'
      })
      that.readUserChat()

      that.getUserChat(1)
      //语音自然播放结束
      that.AUDIO.onEnded(res => {
        that.playMsgid = null
      })
      // #ifndef H5
      //录音开始事件
      that.RECORDER.onStart(e => {
        that.recordBegin(e)
      })
      //录音结束事件
      that.RECORDER.onStop(e => {
        that.recordEnd(e)
      })

      that.RECORDER.onError(e => {
        console.log(e)
        uni.showToast({
          title: e.errMsg,
          icon: 'none'
        })
      })
      // #endif
    },
    onShow() {
      let that = this
      that.updateScene(15, that.oid, true, false, 0, 2)
      that.scrollTop = 9999999
    },
    onPullDownRefresh: function () {
      uni.stopPullDownRefresh()
    },
    methods: {
      previewImgFunc(e) {
        let that = this
        let url = e.currentTarget.dataset.src
        var list = e.currentTarget.dataset.list
        let styleNames = that.$store.state.config.img.styleNames || new Array()
        var imagesArr = []

        if (url && styleNames) {
          for (var i = 0; i < styleNames.length; i++) {
            if (styleNames[i].charAt(0) == '/') {
              url = url.replace(styleNames[i], '')
            }
          }
        }

        if (list) {
          for (var j = 0; j < list.length; j++) {
            let img_ = list[j].img_url
            for (var i = 0; i < styleNames.length; i++) {
              if (styleNames[i].charAt(0) == '/') {
                img_ = img_.replace(styleNames[i], '')
              }
            }
            imagesArr.push(img_)
          }
        } else {
          imagesArr = [url]
        }

        uni.previewImage({
          current: url,
          urls: imagesArr
        })
        return false

        var src = e.currentTarget.dataset.src
        var imageslist = e.currentTarget.dataset.list
        var imagesArr = []

        for (let i in imageslist) {
          imagesArr.push({
            url: imageslist[i].img_url
          })
        }

        uni.navigateTo({
          url:
            '/pages/common/img?imgs=' +
            JSON.stringify(imagesArr) +
            '&src=' +
            src,
          animationType: 'fade-in'
        })
      },
      contactApplyCheckChange(e) {
        let that = this
        if (e.detail.value) {
          let values = e.detail.value
          if (values.includes('phone')) {
            that.contactFormData.is_phone = 1
          } else {
            that.contactFormData.is_phone = 0
          }

          if (values.includes('wechat')) {
            that.contactFormData.is_wechat_account = 1
          } else {
            that.contactFormData.is_wechat_account = 0
          }
        }
      },
      applyUserContact() {
        let that = this
        if (
          (that.userInfo.phone && that.userInfo.phone.length > 0) ||
          (that.userInfo.wechat_account &&
            that.userInfo.wechat_account.length > 0)
        ) {
          if (
            that.contactFormData.is_phone === 0 &&
            that.contactFormData.is_wechat_account === 0
          ) {
            uni.showToast({
              title: '请先勾选手机号或微信号',
              icon: 'none'
            })
            return false
          }

          if (that.contactFormData.reason.length <= 0) {
            uni.showToast({
              title: '请填写申请原因',
              icon: 'none'
            })
            return false
          }

          that.contactFormData.object_id = that.oid

          uni.loading(true)
          uni.wen.util
            .request(
              uni.wen.api.ApiRootUrl + 'user/contact/apply',
              that.contactFormData,
              'POST'
            )
            .then(function (res) {
              uni.loading(false)
              if (res.code == 200) {
                uni.showToast({
                  title: res.message,
                  icon: 'none'
                })
                that.closeContactApplyPopup()
                that.getUserChat(1)
              } else {
                uni.showToast({
                  title: res.message,
                  icon: 'none'
                })
              }
            })
        } else {
          uni.showToast({
            title: '对方未绑定手机号和微信号，无法申请',
            icon: 'none'
          })
          return false
        }
      },
      contactApplyForm() {
        let that = this
        that.hideDrawer()
        that.showContactApplyPopup = true

        if (that.userInfo && that.userInfo.id > 0) {
        } else {
          that.getUserinfoById(that.oid)
        }
      },
      closeContactApplyPopup() {
        let that = this
        that.showContactApplyPopup = !that.showContactApplyPopup
      },
      // 获取宠物列表
      adoption_apply_action(adoption_apply_id, flag) {
        let that = this
        uni.loading(true)
        uni.wen.util
          .request(
            uni.wen.api.ApiRootUrl + 'pets/adoption/apply/action',
            {
              apply_id: adoption_apply_id,
              flag: flag ? 1 : 0
            },
            'POST'
          )
          .then(function (res) {
            uni.loading(false)
            if (res.code == 200) {
              uni.showToast({
                title: res.message,
                icon: 'none'
              })
              that.getUserChat(1)
            } else {
              uni.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          })
      },
      // 接受消息(筛选处理)
      screenMsg(msg) {
        //从长连接处转发给这个方法，进行筛选处理
        if (msg.type == 'system') {
          // 系统消息
          switch (msg.msg.type) {
            case 'text':
              this.addSystemTextMsg(msg)
              break
            case 'redEnvelope':
              this.addSystemRedEnvelopeMsg(msg)
              break
          }
        } else if (msg.type == 'user') {
          // 用户消息
          switch (msg.msg.type) {
            case 'text':
              this.addTextMsg(msg)
              break
            case 'voice':
              this.addVoiceMsg(msg)
              break
            case 'img':
              this.addImgMsg(msg)
              break
            case 'redEnvelope':
              this.addRedEnvelopeMsg(msg)
              break
          }
          console.log('用户消息')
          //非自己的消息震动
          if (msg.msg.userinfo.uid != this.myuid) {
            console.log('振动')
            uni.vibrateLong()
          }
        }
        this.$nextTick(function () {
          // 滚动到底
          this.scrollToView = 'msg' + msg.msg.id
        })
      },
      //处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
      setPicSize(content) {
        // 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
        let maxW = uni.upx2px(350) //350是定义消息图片最大宽度
        let maxH = uni.upx2px(350) //350是定义消息图片最大高度
        if (content.w > maxW || content.h > maxH) {
          let scale = content.w / content.h
          content.w = scale > 1 ? maxW : maxH * scale
          content.h = scale > 1 ? maxW / scale : maxH
        }
        return content
      },

      //更多功能(点击+弹出)
      showMore() {
        this.isVoice = false
        this.hideEmoji = true
        if (this.hideMore) {
          this.hideMore = false
          this.openDrawer()
        } else {
          this.hideDrawer()
        }
      },
      // 打开抽屉
      openDrawer() {
        this.popupLayerClass = 'showLayer'
      },
      // 隐藏抽屉
      hideDrawer() {
        this.popupLayerClass = ''
        this.hideMore = true
        this.hideEmoji = true
      },
      // 选择图片发送
      chooseImage() {
        this.toAddChatImage('album')
      },
      //拍照发送
      camera() {
        this.toAddChatImage('camera')
      },
      //发红包
      handRedEnvelopes() {
        this.hideDrawer()
      },
      // 选择表情
      chooseEmoji(type) {
        let that = this
        if (type == 1) {
          that.hideMore = true
          that.isVoice = false

          if (that.hideEmoji) {
            that.hideEmoji = false
            that.openDrawer()
          } else {
            that.hideDrawer()
          }
        } else {
          that.setData({
            hideMore: true,
            hideEmoji: true
          })
          that.hideDrawer()
        }
      },

      //添加表情
      addEmoji(alt) {
        let that = this
        setTimeout(function () {
          if (that.cursor > 0) {
            that.setData({
              chat_content:
                that.chat_content.slice(0, that.cursor) +
                alt +
                ' ' +
                that.chat_content.slice(that.cursor),
              showSendBtn: true,
              cursor: that.cursor + alt.lenght
            })
          } else {
            that.setData({
              chat_content: that.chat_content + alt,
              showSendBtn: true,
              cursor: that.cursor + alt.lenght
            })
          }
        }, 100)
      },

      //获取焦点，如果不是选表情ing,则关闭抽屉
      textareaFocus(e, type) {
        let that = this
        if (type == 1) {
          that.hideDrawer()
          if (that.chat_content && that.chat_content.length > 0) {
            that.setData({
              cursor: e.detail.cursor,
              showSendBtn: true
            })
          } else {
            that.setData({
              cursor: 0,
              showSendBtn: false
            })
          }
        } else if (type == 3) {
          that.textareaBottom = e.detail.height
        } else {
          if (that.chat_content && that.chat_content.length > 0) {
            that.setData({
              cursor: e.detail.cursor,
              showSendBtn: true,
              textareaBottom: 0
            })
          } else {
            that.setData({
              cursor: 0,
              showSendBtn: false,
              textareaBottom: 0
            })
          }
        }
      },
      //替换表情符号为图片
      replaceEmoji(str) {
        let that = this
        let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
          for (let i = 0; i < that.emojiList.length; i++) {
            let row = that.emojiList[i]
            for (let j = 0; j < row.length; j++) {
              let EM = row[j]
              if (EM.alt == item) {
                //在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径
                //比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
                let onlinePath = 'https://zhoukaiwen.com/img/icon/emojj1/'
                let imgstr = '<img width="32rpx" src="' + onlinePath + '">'
                console.log('imgstr: ' + imgstr)
                return imgstr
              }
            }
          }
        })
        return (
          '<div style="display: flex;align-items: center;word-wrap:break-word;">' +
          replacedStr +
          '</div>'
        )
      },

      // 发送消息
      sendMsg(content, type) {
        //实际应用中，此处应该提交长连接，模板仅做本地处理。
        var nowDate = new Date()
        let lastid = this.msgList[this.msgList.length - 1].msg.id
        lastid++
        let msg = {
          type: 'user',
          msg: {
            id: lastid,
            time: nowDate.getHours() + ':' + nowDate.getMinutes(),
            type: type,
            userinfo: {
              uid: 0,
              username: '大黑哥',
              face: 'https://zhoukaiwen.com/img/kevinLogo.png'
            },
            content: content
          }
        }
        // 发送消息
        this.screenMsg(msg)
        // 定时器模拟对方回复,三秒
        setTimeout(() => {
          lastid = this.msgList[this.msgList.length - 1].msg.id
          lastid++
          msg = {
            type: 'user',
            msg: {
              id: lastid,
              time: nowDate.getHours() + ':' + nowDate.getMinutes(),
              type: type,
              userinfo: {
                uid: 1,
                username: '售后客服008',
                face: 'https://zhoukaiwen.com/img/qdpz/face/face_2.jpg'
              },
              content: content
            }
          }
          // 本地模拟发送消息
          this.screenMsg(msg)
        }, 3000)
      },
      // 打开红包
      openRedEnvelope(msg, index) {
        let rid = msg.content.rid
        uni.loading(true)
        console.log('index: ' + index)
        //模拟请求服务器效果
        setTimeout(() => {
          //加载数据
          if (rid == 0) {
            this.redenvelopeData = {
              rid: 0, //红包ID
              from: '大黑哥',
              face: 'https://zhoukaiwen.com/img/qdpz/face/face.jpg',
              blessing: '恭喜发财，大吉大利',
              money: '已领完'
            }
          } else {
            this.redenvelopeData = {
              rid: 1, //红包ID
              from: '售后客服008',
              face: 'https://zhoukaiwen.com/img/qdpz/face/face_2.jpg',
              blessing: '恭喜发财',
              money: '0.01'
            }
            if (!msg.content.isReceived) {
              // {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
              this.sendSystemMsg(
                {
                  text:
                    '你领取了' +
                    (msg.userinfo.uid == this.myuid
                      ? '自己'
                      : msg.userinfo.username) +
                    '的红包'
                },
                'redEnvelope'
              )
              console.log(
                'this.msgList[index]: ' + JSON.stringify(this.msgList[index])
              )
              this.msgList[index].msg.content.isReceived = true
            }
          }
          uni.loading(false)
          this.windowsState = 'show'
        }, 200)
      },
      // 关闭红包弹窗
      closeRedEnvelope() {
        this.windowsState = 'hide'
        setTimeout(() => {
          this.windowsState = ''
        }, 200)
      },
      sendSystemMsg(content, type) {
        let lastid = this.msgList[this.msgList.length - 1].msg.id
        lastid++
        let row = {
          type: 'system',
          msg: {
            id: lastid,
            type: type,
            content: content
          }
        }
        this.screenMsg(row)
      },
      // 预览图片
      showPic(msg) {
        uni.previewImage({
          indicator: 'none',
          current: msg.content.url,
          urls: this.msgImgList
        })
      },
      // 播放语音
      playVoice(msg) {
        this.playMsgid = msg.id
        this.AUDIO.src = msg.chat_audio_url
        this.$nextTick(function () {
          this.AUDIO.play()
        })
      },

      // 录音开始
      voiceBegin(e) {
        let that = this

        // #ifdef MP
        uni.wen.util.checkMpPermission(
          'scope.record',
          '您拒绝了录音权限',
          () => {
            that._voiceBegin(e)
          }
        )
        // #endif

        // #ifdef APP
        uni.wen.util.checkAppPermission(
          'record',
          '[麦克风权限]获取您的录取声音等信息，用于发送语音私信',
          () => {
            that._voiceBegin(e)
          },
          that
        )
        // #endif

        // #ifdef H5
        that._voiceBegin(e)
        // #endif
      },
      _voiceBegin(e) {
        console.log('-------------------------')
        if (e.touches.length > 1) {
          return
        }
        this.initPoint.Y = e.touches[0].clientY
        this.initPoint.identifier = e.touches[0].identifier
        this.RECORDER.start({
          format: 'mp3'
        }) //录音开始,
      },
      //录音开始UI效果
      recordBegin(e) {
        this.recording = true
        this.voiceTis = '松开 结束'
        this.recordLength = 0
        this.recordTimer = setInterval(() => {
          this.recordLength++
        }, 1000)
      },
      // 录音被打断
      voiceCancel() {
        this.recording = false
        this.voiceTis = '按住 说话'
        this.recordTis = '手指上滑 取消发送'
        this.willStop = true //不发送录音
        this.RECORDER.stop() //录音结束
      },
      // 录音中(判断是否触发上滑取消发送)
      voiceIng(e) {
        if (!this.recording) {
          return
        }
        let touche = e.touches[0]
        //上滑一个导航栏的高度触发上滑取消发送
        if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
          this.willStop = true
          this.recordTis = '松开手指 取消发送'
        } else {
          this.willStop = false
          this.recordTis = '手指上滑 取消发送'
        }
      },
      // 结束录音
      voiceEnd(e) {
        if (!this.recording) {
          return
        }
        this.recording = false
        this.voiceTis = '按住 说话'
        this.recordTis = '手指上滑 取消发送'
        this.RECORDER.stop() //录音结束
      },
      //录音结束(回调文件)
      recordEnd(e) {
        let that = this
        clearInterval(that.recordTimer)
        if (that.recordLength < 1) {
          uni.showToast({
            title: '你说话过短',
            icon: 'none'
          })
          return
        } else if (that.recordLength > 300) {
          uni.showToast({
            title: '你说话时间过长，最长为5分钟',
            icon: 'none'
          })
          return
        }
        if (!that.willStop) {
          let msg = {
            length: that.recordLength,
            url: e.tempFilePath
          }
          that.toAddChatAudio(msg)
        } else {
          console.log('取消发送录音')
        }
        that.willStop = false
      },
      // 切换语音/文字输入
      switchVoice() {
        this.hideDrawer()
        this.isVoice = this.isVoice ? false : true
      },
      discard() {
        return
      }
    }
  }
</script>
<style lang="scss">
  @import './detail.scss';

  .content .showLayer {
    transform: translate3d(0, -43vw, 0);
  }
</style>
