<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" :class="'mini-page-body ' + global__platform__">
      <navBar
          :back="true"
          :iconTheme="iconTheme"
          :background="'rgba(' + userInfo.user_background_color + ', ' + navbarTrans + ')'"
          :color="'rgba(' + color + ', ' + navbarTrans + ')'"
          :home="fph"
		  :placeholder="false"
      >
        <view class="img-title-center" slot="center">
          <view class="lxy-nav-bar__logo">
            <image class="_image" :src="userInfo.user_avatar" :style="'opacity: ' + navbarTrans + ';'"/>
            <!-- <text class="_text" :style="'rgba(' + color + ', ' + navbarTrans + ')'">{{ userInfo.user_name }}</text> -->
          </view>
        </view>
        <!-- #ifdef APP || H5 -->
        <view slot="right" class="lxy-nav-bar__logo">
          <i @tap.stop.prevent="userMore" class="mini-icon mini-diandiandain" :style="'color:'+iconTheme"></i>
        </view>
        <!-- #endif -->
      </navBar>
	  <view :style="'position: fixed;top: ' + CustomBar + 'px;height: 16rpx;width: 750rpx;background-color: rgba(' + userInfo.user_background_color + ', ' + navbarTrans + ');z-index: 9;'" v-if="navbarTrans >= 0.99"></view>
      <view class="user-background scene_8">
        <image class="banner" compression="content" mode="aspectFill" :src="userInfo.user_background_maps"></image>
        <view class="gradient" :style="'background-image: linear-gradient(180deg,rgba(0,0,0,.4),rgba(' + userInfo.user_background_color + ',.7) 30%,rgba(' + userInfo.user_background_color + ',.95) 65%,rgba(' + userInfo.user_background_color + ', 1))'"></view>
        <view class="own-header">
          <view class="inner">
            <view class="header-top">
              <view :class="'own-header-img-div ' + (userInfo.avatar_frame_url ? 'has-frame' :'') ">
                <image class="own-header-img" @tap.stop.prevent="onPreviewImage" :data-src="userInfo.user_avatar" :lazyLoad="true" :src="userInfo.user_avatar"></image>
                <image class="own-header-img-frame" v-if="userInfo.avatar_frame_url" :data-src="userInfo.avatar_frame_url" :lazyLoad="true"
                       :src="userInfo.avatar_frame_url"></image>
                <i class="avatar-authentication-icon mini-icon mini-verify" v-if="userInfo.is_authentication == 1" @tap.stop.prevent="popupShowTap(1)"></i>
              </view>

              <view class="header-middle">

                <view class="user-name-box">
					
					<view class="name-wrap">
						<contextualPopup subject="users" :popList="userInfo.longtaps" :para="{}">
							<text class="name-text" slot="content">{{ userInfo.user_name }}</text>
						</contextualPopup>
					</view>
                  <!-- 									<i class="header-labels official-icon mini-icon mini-xingbienan" v-if="userInfo.gender == 1" data-type="0"></i>
                                    <i class="header-labels official-icon mini-icon mini-xingbienv" v-if="userInfo.gender == 2" data-type="0"></i> -->
                  <i class="header-labels official-icon mini-icon mini-renzhengguanli1" v-if="userInfo.is_official == 1" @tap.stop.prevent="popupShowTap(0)"></i>
                  <i class="header-labels vip-icon mini-icon mini-vip" v-if="userInfo.is_member == 1" @tap.stop.prevent="popupShowTap(2)"></i>
                </view>
                <view class="user-name-sub-box">
                  <view class="user-account-box">
                    <block v-if="userInfo.authentication && userInfo.authentication.id > 0">
                      <view class="auth-name">认证：{{ userInfo.authentication.name }}</view>
                      <i class="mini-icon mini-shuxian"></i>
					  <view class="uid" @tap.stop.prevent="copyUserID(myUserInfo.id)">
					  	UID：{{ userInfo.id }}
					  </view>
                    </block>
                    <block v-else>
                      <view class="uid" @tap.stop.prevent="copyUserID(myUserInfo.id)">
                      	UID：{{ userInfo.id }}
                      </view>
                    </block>
                  </view>
                  <view class="flex-row">
					  <view class="real_name" v-if="userInfo.real_name && userInfo.real_name.length > 0">已实名</view>
					  <view class="ip_address" v-if="userInfo.ip_address">IP属地：{{ userInfo.ip_address || '未知' }}</view>
				  </view>
                </view>
              </view>
            </view>
            <view class="user_state_not_zero_tip" v-if="userInfo.user_state != undefined && userInfo.user_state != 0">
              <i class="mini-icon mini-jinggao"></i>注意：{{ userInfo.state_tip }}
            </view>
            <view class="header-abstract" v-if="userInfo.user_introduce != null && userInfo.user_introduce != ''">
              {{ userInfo.user_introduce }}
            </view>

            <view class="header-user-labels" v-if="userInfo.user_labels && userInfo.user_labels.length > 0">
              <scroll-view class="_scroll-view-label" :scroll-x="true" :enable-flex="true">
                <view class="label-inner">
                  <block>
                    <block v-if="userInfo.gender > 0">
                      <view class="label">
                        <i class="header-label gender-m-icon mini-icon mini-xingbienan"
                           :style=" (userInfo.constellation && userInfo.constellation.length > 0) ? 'margin-right: 8rpx;' : '' " v-if="userInfo.gender == 1"></i>
                        <i class="header-label gender-w-icon mini-icon mini-xingbienv"
                           :style=" (userInfo.constellation && userInfo.constellation.length > 0) ? 'margin-right: 8rpx;' : '' " v-if="userInfo.gender == 2"></i>
                        {{ userInfo.constellation }}
                      </view>
                    </block>
					<block v-else-if="userInfo.constellation && userInfo.constellation.length > 0 ">
					  <view class="label">
					    {{ userInfo.constellation }}
					  </view>
					</block>
                  </block>
				  <block v-if="userInfo.university && userInfo.university.length > 0 ">
				  	<view class="label">
				  		{{ userInfo.university }}
				  	</view>
				  </block>
                  <view class="label" v-for="(label,index) in userInfo.user_labels" :key="index">{{ label }}</view>
                </view>
              </scroll-view>
            </view>

            <view class="header-bottom">
              <view class="header-zuo">
                <view class="header-bottom-li" hover-class="none" @tap.stop.prevent="toUserFollow(0)">
                  <view class="own-header-num">
                    {{ userInfo.followTotal > 999 ? filters.toFix(userInfo.followTotal) : userInfo.followTotal }}
                  </view>
                  <view class="own-header-text">关注</view>
                </view>
                <view class="header-bottom-li" hover-class="none" @tap.stop.prevent="toUserFollow(1)">
                  <view class="own-header-num">
                    {{ userInfo.fansTotal > 999 ? filters.toFix(userInfo.fansTotal) : userInfo.fansTotal }}
                  </view>
                  <view class="own-header-text">粉丝</view>
                </view>
                <view class="header-bottom-li" @tap.stop.prevent="popupShowTap(3)">
                  <view class="own-header-num">
                    {{ userInfo.likeTotal > 999 ? filters.toFix(userInfo.likeTotal) : userInfo.likeTotal }}
                  </view>
                  <view class="own-header-text">获赞</view>
                </view>
              </view>
              <block v-if="!userInfo.isFollow">
                <view class="header-right-box">
                  <view @tap.stop.prevent="userInfoActionFollow(id)" class="header-box header-right">关注</view>
                  <view v-if="is_user_can_open_chat" @tap.stop.prevent="toMessage(userInfo.id, userInfo.user_name)" class="header-box header-setup">
					<i class="mini-icon mini-sixin message-icon"></i>
                  </view>
                </view>
              </block>
              <block v-else>
                <view class="header-right-box">
                  <view v-if="is_user_can_open_chat" @tap.stop.prevent="toMessage(userInfo.id, userInfo.user_name)" class="header-box header-right">私信ta
                  </view>
                  <view @tap.stop.prevent="userInfoActionFollow(userInfo.id)" class="header-box header-setup">
                    <i class="mini-icon mini-yiguanzhu1"></i>
                  </view>
                </view>
              </block>
            </view>
			<block v-if="userInfo && userInfo.id > 0 && userInfo.grid && userInfo.grid.length > 0">
				<view class="my-grid-box">
					<scroll-view :scroll-x="true" class="_scroll-view">
						<view class="grid-box-inner">
							<view class="grid-item" v-for="(item, index) in userInfo.grid" :key="index" @tap.stop.prevent="toSliderUrl(6, item.path)" :style="'background-color: rgba('+ userInfo.user_background_color +',1);'">
								<view class="grid-item-inner">
									<view class="title">
										<i :class="'mini-icon ' + item.icon"></i>
										<view>{{ item.title }}</view>
									</view>
									<view class="desc">{{ item.desc }}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</block>
          </view>
        </view>
      </view>
      <view class="mine-tools">
		<u-sticky :offsetTop="0">
			<view class="nav">
				<view class="nav-inner">
					<block v-if="userInfo.shop && userInfo.shop.id > 0">
						<view @tap.stop.prevent="select('shop')" class="tag-box type_shop">
							<view :class="'taga-item ' + (currentItem == 'shop' ? ' active' : '')">
								店铺
							</view>
						</view>
					</block>
					<block v-for="(item, index) in taga" :key="index">
						<view @tap.stop.prevent="select(item.name)" :class="'tag-box type_' + item.name">
							<view :class="'taga-item ' + (currentItem == item.name ? ' active' : '')">
								<block v-if="item.name == 'collected' && userInfo.setting && userInfo.setting.privacy_collected_post_show == 2">
									<i class="mini-icon2 mini-zhifumima" style="margin-right: 6rpx;"></i>
								</block>
								{{ item.text }}
							</view>
						</view>
					</block>
		
				</view>
			</view>
			<block v-if="currentItem == 'shop'">
				<view class="sub-head">
					<view class="inner">
						<view class="item" :class="{ current: goodfilterIndex === 0 }" @tap="goodTabClick(0)">
							<view class="_text">
								综合
							</view>
						</view>
						<view class="item" :class="{ current: goodfilterIndex === 1 }" @tap="goodTabClick(1)">
							<view class="_text">
								销量
							</view>
						</view>
						<view class="item" :class="{ current: goodfilterIndex === 2 }" @tap="goodTabClick(2)">
							
							<view class="_text">
								上新
							</view>
						</view>
						<view class="item" :class="{ current: goodfilterIndex === 3 }" @tap="goodTabClick(3)">
							<view class="_text">
								价格
							</view>
							<view class="box">
								<i :class="{ active: goodparas.order === 'asc' && goodfilterIndex === 3 }" class="mini-icon mini-xiangshang"></i>
								<i :class="{ active: goodparas.order === 'desc' && goodfilterIndex === 3 }" class="mini-icon mini-xiangshang-copy"></i>
							</view>
						</view>
					</view>
					<view class="shop-enter flex-column">
						<view class="_view" @tap.stop.prevent="toSliderUrl(32, userInfo.shop.id)">进入Ta的店铺</view>
					</view>
				</view>
			</block>
		</u-sticky>
        <view class="body-box">
			<view class="post-list-gap"></view>
          <ls-skeleton :loading="topicload" :skeleton="commonSkeleton" :animate="true" :scene="user_list_waterfall ? 90734 : 8">
			  <block name="circle">
			  				<block v-if="currentItem == 'shop'">
			  					<l-water-flow comName="goods" :waterData="goodsWaterData" ref="goodswater" :column-gap="8" :scene="8"/>
			  				</block>
			  				<block v-else>
			  					  <block v-if="user_list_waterfall">
			  					    <l-water-flow comName="product" :waterData="postWaterData" ref="productwater" :column-gap="8" :scene="8"/>
			  					  </block>
			  					  <block v-else>
			  					    <view class="post-wrap" v-for="(item, index) in posts" :key="index">
			  					      <contextualPopup subject="posts" :popList="item.longtaps" :para="{ index: index, style: 'list' }">
			  					        <view class="topic-detail-view" slot="content">
			  					          <block v-if="item.post_type == 'single'">
			  					            <single-item :single="item"></single-item>
			  					          </block>
			  					          <block v-else>
			  					            <view class="topic-panel" :id="'media_' + item.id">
			  					              <view class="user-info-view">
			  					                <user-info :user="item.user" :format_time="item.format_time" :ip_address="item.ip_address" :distance="item.distance" :device="item.device"
			  					                           :post_top="item.post_top">
			  					                  <view class="user-rigth" slot="right">
			  					                    <block v-if="item.fields && item.fields.contact_phone">
			  					                      <view @tap.stop.prevent="toSliderUrl(22, item.fields.contact_phone)" class="follow-view">
			  					                        <i class="mini-icon mini-dianhua inline"></i>
			  					                        拨打
			  					                      </view>
			  					                    </block>
			  					                    <block v-else>
			  					                      <block v-if="!item.is_my_posts">
			  					                        <view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id"
			  					                              :data-index="index" class="follow-view" v-if="!item.is_follow_user">
			  					                          关注
			  					                        </view>
			  					                        <view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id"
			  					                              :data-index="index" class="follow-view folled" v-else-if="item.is_follow_user">
			  					                          已关注
			  					                        </view>
			  					                      </block>
			  					                    </block>
			  					                  </view>
			  					                </user-info>
			  					              </view>
			  					
			  					              <post-content :words="item" :postIndex="index" :scene="8" @unfoldTap="unfoldTap" @showPayContent="showPayContent" @soundPlayCall="soundsPlayCall"
			  					                            @forceUpdate="forceUpdate" @pSelectVote="selectVote"></post-content>
			  					              <post-footer @tapShare="tapShare" @taplikes="taplikes" @tapComment="tapComments" @tapCollect="tapCollect" @tapReward="tapReward"
			  					                           @tapGiveCoin="tapGiveCoin" :words="item" :index="index"></post-footer>
			  					
			  					              <view class="reward-box" v-if="item.exceptional && item.exceptional.length > 0" :data-id="item.id"
			  					                    @tap.stop.prevent="onClickReward" :data-ecount="item.exceptional_count">
			  					                <view class="inner">
			  					                  <view class="cu-avatar-group">
			  					                    <view v-if="item.exceptional_count > 6" class="cu-avatar round dian">•••
			  					                    </view>
			  					                    <view class="cu-avatar round"
			  					                          :style="'background-image:url(' + exceptional.user_avatar + ');'"
			  					                          v-for="(exceptional, index1) in item.exceptional"
			  					                          :key="exceptional.rid"></view>
			  					                  </view>
			  					                  <view class="cu-avatar-text">{{ item.exceptional_count }}次充电</view>
			  					                </view>
			  					              </view>
			  					
			  					            </view>
			  					          </block>
			  					        </view>
			  					      </contextualPopup>
			  					      <view class="post-list-gap" v-if="index != (posts.length - 1)"></view>
			  					      <block v-if="posts.length > 5 && item.ad">
			  					        <!-- #ifdef MP -->
			  					        <view class="flow-ad-wrap" v-if="item.ad">
			  					          <block v-if="item.ad.type && item.ad.type == '1' ">
			  					            <i class="mini-icon mini-adtip"></i>
			  					            <image class="_image" :src="item.ad.img" @tap.stop.prevent="toSliderUrl(item.ad.target_type, item.ad.target_id)" mode="widthFix"></image>
			  					          </block>
			  					          <block v-else>
			  					            <view class="ad-content">
			  					              <ad-custom :unit-id="item.ad.unit"></ad-custom>
			  					            </view>
			  					          </block>
			  					        </view>
			  					        <view class="post-list-gap" v-if="item.ad"></view>
			  					        <!-- #endif -->
			  					        <!-- #ifndef MP -->
			  					        <view class="flow-ad-wrap" v-if="item.ad">
			  					          <block v-if="item.ad.type && item.ad.type == '1' ">
			  					            <i class="mini-icon mini-adtip"></i>
			  					            <image class="_image" :src="item.ad.img" @tap.stop.prevent="toSliderUrl(item.ad.target_type, item.ad.target_id)" mode="widthFix"></image>
			  					          </block>
			  					          <block v-else>
			  					            <view class="ad-content">
			  					              <ad :adpid="item.ad.unit"></ad>
			  					            </view>
			  					          </block>
			  					        </view>
			  					        <view class="post-list-gap" v-if="item.ad"></view>
			  					        <!-- #endif -->
			  					      </block>
			  					    </view>
			  					    <u-popup :show="rewardPopup" @close="shutReward" >
			  					      <view class="reward-add-box">
			  					        <image class="reward-add-box-image" :src="config_img.reward_select" mode="aspectFill"/>
			  					        <view class="reward-add-input-box">
			  					          <text class="_text">¥</text>
			  					          <input class="reward-add-input" @input="rewardPriceChange" :value="rewardPrice"
			  					                 placeholder-class="_input_place_holder" type="digit"
			  					                 placeholder="在这里输入充电金额"/>
			  					        </view>
			  					        <view class="reward-add-box-view">
			  					          <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 2 ? 'bd _view' : '_view'"
			  					                data-price="2">¥2
			  					          </view>
			  					          <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 6 ? 'bd _view' : '_view'"
			  					                data-price="6">¥6
			  					          </view>
			  					          <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 8 ? 'bd _view' : '_view'"
			  					                data-price="8">¥8
			  					          </view>
			  					          <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 18 ? 'bd _view' : '_view'"
			  					                data-price="18">¥18
			  					          </view>
			  					        </view>
			  					        <view class="reward-add-box-btn" @tap.stop.prevent="onOpenExceptionalAccountCheck">确认充电</view>
			  					      </view>
			  					    </u-popup>
			  					
			  					    <u-popup :show="payContentPopup" @close="shutPayContent" :zIndex="99999991009">
			  					      <block v-if="payContentObj && payContentObj.price > 0">
			  					        <view class="pay_content_box">
			  					          <view class="title">
			  					            <view :class="'mini-icon ' + (payContentObj.pay_type == 1 ? 'mini-xueyuan-fufeikecheng' : 'mini-jinbi2') "></view>
			  					            付费内容
			  					          </view>
			  					          <view class="pay_for_item price">
			  					            <text class="_text">价格：</text>
			  					            <block v-if="payContentObj.vip_price >= 0">
			  					              <view class="pay_for_item_num vip_price">{{ payContentObj.vip_price + payContentObj.credit }}
			  					                <view class="vip_price_tip">会员价</view>
			  					              </view>
			  					            </block>
			  					            <block v-else>
			  					              <view class="pay_for_item_num">{{ payContentObj.price + payContentObj.credit }}</view>
			  					            </block>
			  					          </view>
			  					          <view class="pay_for_item rest">
			  					            <text class="_text">剩余篇幅：</text>
			  					            <view class="pay_for_item_num">{{ payContentObj.rest }}%</view>
			  					          </view>
			  					          <view class="pay_for_item has_hidden">
			  					            <text class="_text">隐藏内容：</text>
			  					            <view class="pay_for_item_num">{{ payContentObj.has_hidden }}字符</view>
			  					          </view>
			  					          <view class="pay_for_item has_file">
			  					          	<text class="_text">隐藏图片：</text>
			  					          	<view class="pay_for_item_num">{{ payContentObj.has_img }}</view>
			  					          </view>
			  					          <view class="pay_for_item has_file">
			  					          	<text class="_text">隐藏视频：</text>
			  					          	<view class="pay_for_item_num">{{ payContentObj.has_video }}</view>
			  					          </view>
			  					          <view class="pay_for_item has_file">
			  					          	<text class="_text">隐藏附件：</text>
			  					          	<view class="pay_for_item_num">{{ payContentObj.has_file }}</view>
			  					          </view>
			  					          <view class="buy_button" @tap.stop.prevent="payPost">立即购买</view>
			  					          <view class="tips">虚拟物品存在可复制性，请谨慎购买，不可退货，若不慎被骗，请立即举报并说明原因</view>
			  					        </view>
			  					      </block>
			  					    </u-popup>
			  					
			  					    <view
			  					        :class="'dialog ' + (rewardDialog ? 'dialog_show' : '')">
			  					      <view @tap.stop.prevent="onClickReward" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
			  					      <view class="dialog_container">
			  					        <view class="dialog_box_title">
			  					          {{ exceptionalCount }}次充电
			  					          <i class="mini-icon mini-shanchu2" @tap.stop.prevent="onClickReward"/>
			  					        </view>
			  					        <scroll-view :scroll-y="true" class="dialog_comments" enhanced
			  					                     :show-scrollbar="false" lower-threshold="0">
			  					          <view class="dialog_conent">
			  					            <view class="reward-user-box" v-for="(item, index) in exceptionalList"
			  					                  :key="item.rindex">
			  					              <view class="reward-user-avatar-view" hover-class="none" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
			  					                <image class="reward-user-avatar-image" compression="avatar"
			  					                       mode="aspectFill" :src="item.user.user_avatar"></image>
			  					                <view class="reward-user-right">
			  					                  <view class="reward-user-name">{{ item.user.user_name }}</view>
			  					                  <view class="reward-user-date">{{ item.exceptional_date }}
			  					                  </view>
			  					                </view>
			  					              </view>
			  					
			  					              <view class="reward-user-price">
			  					                充电了￥
			  					                <u-count-to :endVal="item.exceptional_price" :decimals="2" color="#FA5150" fontSize="46"></u-count-to>
			  					              </view>
			  					            </view>
			  					          </view>
			  					        </scroll-view>
			  					      </view>
			  					    </view>
			  					
			  					    <view
			  					        :class="'dialog ' + (bounced ? 'dialog_show' : '')">
			  					      <view @tap.stop.prevent="bouncedTap" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
			  					      <view class="dialog_container">
			  					        <view class="dialog_conent">
			  					          <view @tap.stop.prevent="bouncedDeleteTap" class="delete-btn" id="delete">确认删除
			  					          </view>
			  					          <view @tap.stop.prevent="bouncedTap" class="cancel-btn">取消</view>
			  					        </view>
			  					      </view>
			  					    </view>
			  					
			  					    <view
			  					        :class="'dialog ' + (showShare ? 'dialog_show' : '')">
			  					      <view @tap.stop.prevent="onClickShare" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
			  					      <view class="dialog_container">
			  					        <view class="dialog_conent">
			  					          <view class="dialog_box">
			  					            <button open-type="share" class="dialog_btn">
			  					              <i class="mini-icon mini-weixin1"></i>微信好友
			  					            </button>
			  					            <view @tap.stop.prevent="sharePosterClick" class="dialog_btn">
			  					              <i class="mini-icon mini-haibao"></i>海报
			  					            </view>
			  					          </view>
			  					          <view @tap.stop.prevent="onClickShare" class="cancel-btn">取消</view>
			  					        </view>
			  					      </view>
			  					    </view>
			  					
			  					    <view :class="showComments ? 'dialog_show' : ''">
			  					      <view @tap.stop.prevent="toShutComments" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
			  					      <view class="dialog_container">
			  					        <view class="dialog_box_title">
			  					          评论 {{ commentCount > 999 ? filters.toFix(commentCount) : commentCount }}
			  					          <i class="mini-icon mini-shanchu2" @tap.stop.prevent="toShutComments"/>
			  					        </view>
			  					        <comment-scroll :unicom-id="'commentScroll_8_' + id " ref="commentScroll" :postsId="postsId" @tapComment="tapComment"></comment-scroll>
			  					        <comment-form :unicom-id="'commentForm_8_' + id" ref="commentForm" :postsId="postsId" :commentFormShow="commentFormShow" @maskClick="commentFormMaskClick"
			  					                      @sendComment="onInputComment" @tapComment="tapComment" :placeholder="replyName || '此时此刻想说~' "></comment-form>
			  					      </view>
			  					    </view>
			  					  </block>
			  					
			  				</block>
			  </block>
            <view class="empty-box" v-if="isNul">
            	<u-empty :text="emptyTxt" :marginTop="100" :width="250" :height="250" text-size="24" />
            </view>
          </ls-skeleton>
          <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
        </view>
      </view>

      <u-popup :show="imageShow" @close="popupShowTap(-1)">
        <image @tap.stop.prevent="popupShowTap(-1)" v-if="typeShow == 0" class="vip-img" :src="config_user_official_popup" mode="aspectFill"></image>
        <image @tap.stop.prevent="popupShowTap(-1)" v-if="typeShow == 1" class="vip-img" :src="config_user_authentication_popup" mode="aspectFill"></image>
        <image @tap.stop.prevent="popupShowTap(-1)" v-if="typeShow == 2" class="vip-img" :src="config_user_members_popup" mode="aspectFill"></image>
        <view v-if="typeShow == 3" @tap.stop.prevent="popupShowTap(3)" class="like-box">
          <image :src="config_img.beliked_count" mode="aspectFill"/>
          <text class="_text">{{ userInfo.user_name }} 被喜欢数</text>
          <view>{{ userInfo.likeTotal }}</view>
        </view>
      </u-popup>

      <chunLei-popups v-model="showMorePopup" maskBg="rgba(0,0,0,0.8)" :popData="userInfo.actions" @tapPopup="tapUserMorePopup" :x="344" :y="40" placement="top-end">
      </chunLei-popups>
      <post-share :unicom-id="'postShare_8_' + id " :postsId="postsId" :show="showSharePopup" @postfeedback="postFeedback"></post-share>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast :unicom-id=" 'mytotast_8_' + id " ref="mytoast" :isdistance="true" :toast="mytoast_data" @giveCoin="onInputComment" @postfeedback="postFeedback"></my-toast>
    </view>
  </view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';

import lWaterFlow from '@/linui/water-flow/index';
import chunLeiPopups from "@/pages/user/components/chunLei-popups/chunLei-popups.vue";
import SingleItem from "@/pages/sticky/components/single-item";
import UserInfo from "@/pages/sticky/components/user-info";
import PostContent from "@/pages/sticky/components/post-content";
import CommentForm from "@/pages/sticky/components/comment-form";
import CommentScroll from "@/pages/sticky/components/comment-scroll";
import product from '@/components/common/water/product/index';
import PostFooter from "@/pages/sticky/components/post-footer";
import PostShare from "@/pages/sticky/components/post-share";
import contextualPopup from '@/components/common/contextual-popup/contextual-popup';


const mixins = require('@/mixins/user');
const common = require('@/mixins/common');
const user = require('@/mixins/user');
const forum = require('@/mixins/forum');
var options = {};

mixins(options);
common(options);
user(options);
forum(options);

export default {
	mixins: [{ methods: options }],
    components: {
	  myToast,navBar,hoverBall,lsSkeleton,
	  
    lWaterFlow,
    chunLeiPopups,
    SingleItem,
    UserInfo,
    PostContent,
    CommentForm,
    CommentScroll,
    product,
    PostFooter,
    PostShare,
    contextualPopup
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
    config_audit_is_reward: {
      get() {
        let that = this;
        return !that.$store.state.config.audit.is_reward && that.$store.state.config.app.mode != 'examine';
      },
      set(v) {}
    },
    config_user_official_popup: {
      get() {
        let that = this;
        return that.$store.state.config.user.official_popup;
      },
      set(v) {}
    },
    config_user_authentication_popup: {
      get() {
        let that = this;
        return that.$store.state.config.user.authentication_popup;
      },
      set(v) {}
    },
    config_user_members_popup: {
      get() {
        let that = this;
        return that.$store.state.config.user.members_popup;
      },
      set(v) {}
    },
    user_list_waterfall:{
    	get(){
    		let that = this;
    		if(that.currentItem == 'shop'){
				return true;
			}
    		if(that.myUserInfo.setting && that.myUserInfo.setting.diy_scene_8_post_list_style != 1){
    			if(that.myUserInfo.setting.diy_scene_8_post_list_style == 3){
    				return true;
    			}else{
    				return false;
    			}
    		}
    		return that.$store.state.config.page.mine.style == 1;
    	},
    	set(v){}
    },
	
    commonSkeleton: {
      get() {
        let that = this;
        if (that.user_list_waterfall) {
          return that.$store.state.skeleton.waterfall;
        } else {
          return that.$store.state.skeleton.rowPost;
        }
      },
      set(v) {}
    },
    is_user_can_open_chat: {
      get() {
        let that = this;
        if (that.$store.state.config.app.lv && that.$store.state.config.app.lv.permission) {
          if (that.$store.state.userInfo.lv >= that.$store.state.config.app.lv.permission.open_chat) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      },
      set(v) {}
    },
	CustomBar:{
		get(){
			let that = this;
			return that.$store.state.CustomBar;
		},
		set(v){}
	},
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 8,
      postsId: 0,
      commentFormShow: 0,
      commentCount: 0,
      exceptionalCount: 0,
      navbarTrans: 0,
      color: '255,255,255',
      iconTheme: 'white',
      id: 0,
	  goodfilterIndex: 0,

      userInfo: {
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
		longtaps: [],
        actions: [
          {
            title: '举报'
          }
        ],
      },
	  
      page: 1,
      posts: [],
      topicload: true,
      loadmoreShow: false,
      isLastPage: false,
      imageShow: false,
	  myPostsList: [],
	  myPostsPage: 1,
	  myCollectionList: [],
	  myCollectionPage: 1,
	  myShopGoodsList: [],
	  myShopGoodsPage: 1,

      isNul: false,
      typeShow: '',

      popupshow: '',

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
      showMorePopup: false,
      postWaterData: {
        e: 0,
        data: []
      },
	  goodsWaterData: {
	  	e: 0,
	  	data: []
	  },
      showSharePopup: 0,
	  
	  currentItem: 'post',
	  taga: [{
	  		text: '笔记',
	  		name: 'post',
	  		ums: '',
			type: 0,
	  	},
	  	{
	  		text: '收藏',
	  		name: 'collected',
	  		ums: '',
			type: 1,
	  	},
	  ],
	  goodparas: {
	  	shop_id: 0,
	  	classify: {
	  		id: 0,
	  		name: ''
	  	},
	  	search: '',
	  	orderBy: 'created_at',
	  	order: 'desc',
	  	minPrice: 0,
	  	maxPrice: 9999999999,
	  },
	  
    };
  },
  onPageScroll: function onPageScroll(e) {
    let that = this;
    var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;

    if (trans >= 1 && that.navbarTrans >= 1) {
      return false;
    }

    that.navbarTrans = trans;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);

    // 处理小程序码的分享场景
    var scene = decodeURIComponent(options.scene);
    if (scene && scene != 'undefined') {
      let query = {};
      if (scene.indexOf('&') !== -1) {
        let scene_arr = scene.split('&');
        scene_arr.map((item) => {
          let queryData = item.split('=')
          query[queryData[0]] = queryData[1]
        })
      } else {
        let queryData = scene.split('=')
        query[queryData[0]] = queryData[1]
      }
      if (query.from_user && query.from_user.length > 0) {
        uni.setStorageSync('form_user', query.from_user);
        uni.$store.commit('updateFormUser', query.from_user);
      }
      that.setData({
        id: query.id,
		page__scene__id__: query.id,
        fph: true
      });
    } else {
      that.setData({
        id: options.id,
		page__scene__id__: options.id,
      });
    }


    that.getUserinfoById(that.id);
    that.userPosts(that.currentItem, 1, that.id);
  },
  onReady: function() {
  	uni.setNavigationBarColor({
  	  frontColor: '#ffffff',
  	});
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(8, that.id);
  },
  onBackPress(e) {
    if (this.showComments) {
      this.showComments = false;

      // #ifdef APP || H5
      setTimeout(function () {
        uni.showTabBar();
      }, 250)
      // #endif

      return true;
    } else if (this.rewardDialog) {
      this.rewardDialog = false;
      // #ifdef APP || H5
      setTimeout(function () {
        uni.showTabBar();
      }, 250)
      // #endif
      return true;
    } else if (this.fph) {
      uni.reLaunch({
        url: '/pages/tabbar/index/index'
      });
      return true;
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
	let that = this;
	that.setData({
		postsId: 0,
		commentFormShow: 0,
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
		myPostsList: [],
		myPostsPage: 1,
		myCollectionList: [],
		myCollectionPage: 1,
		myShopGoodsList: [],
		myShopGoodsPage: 1,
		isNul: false,
		topicload: true,
		loadmoreShow: false,
		isLastPage: false
	});
	that.getUserinfoById(that.id);
	that.userPosts(that.currentItem, 1, that.id);
	uni.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
	  
	let that = this;
	if(that.isLastPage){
		return;
	}
	that.setData({
		loadmoreShow: true,
		isLastPage: false
	});
	let page = 1;
	
	if (that.currentItem == 'post') {
		page = that.myPostsPage + 1;
	} else if (that.currentItem == 'collected') {
		page = that.myCollectionPage + 1;
	} else if (that.currentItem == 'shop') {
		page = that.myShopGoodsPage + 1;
	}
	
	that.userPosts(that.currentItem, page, that.id);
  },
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from == 'button') {
      let share_title = that.$store.state.config.share.format.app_share_post;
      let share_img = '';

      for (let index = 0; index < this.posts.length; index++) {
        const post = this.posts[index];

        if (post.id == Math.abs(this.postsId)) {
          share_title = share_title.replace('[post_content]', post.posts_content_raw).replace('[author_name]', post.user.user_name);

          share_img = post.share_img;

          break;
        }
      }

      share_title = share_title.replace(/<[^>]*?>/g, '');
      return {
        title: share_title,
        path: '/pages/sticky/sticky?id=' + Math.abs(that.postsId) + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
        imageUrl: share_img
      };
    } else {
      let share_title = that.$store.state.config.share.format.app_share_author;
      share_title = share_title.replace('[author_name]', this.userInfo.user_name).replace('[author_introduce]', this.userInfo.user_introduce);
      return {
        title: share_title,
        path: 'pages/user/user?id=' + that.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
        imageUrl: ''
      };
    }
  },
  onShareTimeline: function (res) {
    let that = this;
    let my_avater_img = this.userInfo ? this.userInfo.user_avatar : '';
    let my_name = this.userInfo ? this.userInfo.user_name : '';
    let share_title = that.$store.state.config.share.format.app_share_author;
    share_title = share_title.replace('[author_name]', my_name).replace('[author_introduce]', this.userInfo.user_introduce);
    return {
      title: share_title,
      query: 'id=' + this.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: uni.wen.util.removeStyles(my_avater_img || that.$store.state.config.img.default_share) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
    };
  },
  methods: {
	select(type) {
		var that = this;
		
		if(type == 'collected' && that.userInfo.setting && that.userInfo.setting.privacy_collected_post_show == 2){
			uni.showToast({
				title: '该用户已设置收藏内容不可见',
				icon: 'none',
			})
			return false;
		}
		
		var emptyTxt = '空';
		if (type != 'post') {
			emptyTxt = '干净清爽';
		}
	
		that.setData({
			currentItem: type,
			emptyTxt: emptyTxt,
			isNul: false,
			topicload: true,
			loadmoreShow: false,
			isLastPage: false
		});
		let args = {};
	
		if (that.currentItem == 'post') {
			if (that.myPostsList.length <= 0) {
				that.userPosts(that.currentItem, 1, that.id);
			} else {
				args.posts = that.myPostsList;
				if(that.user_list_waterfall){
					that.setData({
						postWaterData: {
							e: 1,
							data: that.myPostsList
						}
					});
				}
	
			}
		} else if (that.currentItem == 'collected') {
			if (that.myCollectionList.length <= 0) {
				that.userPosts(that.currentItem, 1, that.id);
			} else {
				args.posts = that.myCollectionList;
				if(that.user_list_waterfall){
					that.setData({
						postWaterData: {
							e: 1,
							data: that.myCollectionList
						}
					});
				}
			}
		} else if (that.currentItem == 'shop') {
			if (that.myShopGoodsList.length <= 0) {
				that.userPosts(that.currentItem, 1, that.id);
			} else {
				that.setData({
					goodsWaterData: {
						e: 1,
						data: that.myShopGoodsList
					}
				});
			}
		}
	
		args.topicload = false;
		that.setData(args);
	},
	goodTabClick(index){
		let that = this;
		if(that.goodfilterIndex == index){
			if(index == 1){
				that.goodparas.orderBy = 'id';
				that.goodfilterIndex = 0;
			}else if(index == 2){
				that.goodparas.orderBy = 'id';
				that.goodfilterIndex = 0;
			}else if(index == 3){
				if(that.goodparas.order == 'desc'){
					that.goodparas.order = 'asc';
				}else{
					that.goodparas.order = 'desc';
				}
			}else{
				that.goodparas.orderBy = 'id';
				that.goodfilterIndex = 0;
			}
		}else{
			that.goodfilterIndex = index;
			if(index == 1){
				that.goodparas.orderBy = 'buys';
			}else if(index == 2){
				that.goodparas.orderBy = 'created_at';
			}else if(index == 3){
				that.goodparas.orderBy = 'price';
			}else{
				that.goodparas.orderBy = 'id';
			}
		}
		that.userPosts('shop', 1, that.id);
	},
	toUserFollow(type){
		let that = this;
		if(type === 0){
			// 关注的人
			if(that.userInfo.setting && that.userInfo.setting.privacy_my_follow_show == 2){
				uni.showToast({
					title: '该用户已设置关注列表不可见',
					icon: 'none'
				});
				return false;
			}
			uni.wen.toUrl( 6, '/pagesA/mine/follow/follow?id=0&userid=' + that.userInfo.id );
		}else if(type === 1){
			if(that.userInfo.setting && that.userInfo.setting.privacy_follow_me_show == 2){
				uni.showToast({
					title: '该用户已设置粉丝列表不可见',
					icon: 'none'
				});
				return false;
			}
			// 粉丝
			uni.wen.toUrl( 6, '/pagesA/mine/follow/follow?id=1&userid=' + that.userInfo.id );
		}
	},
	copyUserID(id){
		uni.wen.util.setClipboardData(id, 'UID已复制');
	},
    blackUser() {
      let that = this;
      uni.loading(true);
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/black', {
        object_id: that.id,
        action: 'black'
      }, 'POST').then(function (res) {
        uni.loading(false);
        if (res.status) {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
          that.getUserinfoById(that.id);
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        }
      });
    },
    popupShowTap(type) {
      this.setData({
        typeShow: type,
        imageShow: !this.imageShow
      });
    },

    toMessage(userid, name) {
      let that = this;
	  if(that.userInfo.setting){
			if(that.userInfo.setting.privacy_message_me == 1){
				if (that.userInfo.isFollow) {
					uni.wen.toUrl(6, '/pages/message/detail/detail?userid=' + userid + '&name=' + name, null);
				}else{
				  uni.showToast({
				    title: '该用户已设置仅“关注Ta的人”可私信',
				    icon: 'none',
				    duration: 2500
				  });
				}
				return false;
			}else if(that.userInfo.setting.privacy_message_me == 2){
				if (that.userInfo.isFans) {
					uni.wen.toUrl(6, '/pages/message/detail/detail?userid=' + userid + '&name=' + name, null);
				}else{
				  uni.showToast({
				    title: '该用户已设置仅“Ta关注的人”可私信',
				    icon: 'none',
				    duration: 2500
				  });
				}
				return false;
			}else if(that.userInfo.setting.privacy_message_me == 3){
				if (that.userInfo.isFans && that.userInfo.isFollow) {
					uni.wen.toUrl(6, '/pages/message/detail/detail?userid=' + userid + '&name=' + name, null);
				}else{
				  uni.showToast({
				    title: '该用户已设置仅“互相关注的人”可私信',
				    icon: 'none',
				    duration: 2500
				  });
				}
				return false;
			}else if(that.userInfo.setting.privacy_message_me == 4){
				uni.showToast({
				  title: '该用户已设置“禁止私信”',
				  icon: 'none',
				  duration: 2500
				});
				return false;
			}else{
				if (that.userInfo.isFollow) {
					uni.wen.toUrl(6, '/pages/message/detail/detail?userid=' + userid + '&name=' + name, null);
				}else{
				  uni.showToast({
				    title: '该用户已设置仅“关注Ta的人”可私信',
				    icon: 'none',
				    duration: 2500
				  });
				}
				return false;
			}
			
	  }else{
		  if (that.userInfo.isFollow) {
		  	uni.wen.toUrl(6, '/pages/message/detail/detail?userid=' + userid + '&name=' + name, null);
		  }else{
		    uni.showToast({
		      title: '该用户已设置仅“关注Ta的人”可私信',
		      icon: 'none',
		      duration: 2500
		    });
		  return false;
		  }
	  }
    },
    tapUserMorePopup(e) {
      let that = this;
      if (e.title == "举报") {
        that.toReport(2, that.id);
      }
      if (e.title == "拉黑" || e.title == "取消拉黑") {
        that.blackUser();
      } else if (e.title == 'ta的钱包') {
        that.toSliderUrl(6, '/pagesA/mine/earnings/earnings?uid=' + that.id);
      } else if (e.title == '编辑ta的资料') {
        that.toSliderUrl(6, '/pagesA/mine/editmine/editmine?uid=' + that.id);
      }
    },
    userMore() {
      let that = this;
      that.showMorePopup = !that.showMorePopup;
    }

  }
};
</script>
<style lang="scss">
@import './user.scss';
</style>
