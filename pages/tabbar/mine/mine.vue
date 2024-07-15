<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view :class="'mini-page-body tabbar ' +global__platform__">
		<view :class="'panel-overlay ' + ( showLeftPanel ? 'active' : '')" @tap.stop.prevent="leftPanelOpen(false)" @touchmove.stop.prevent="miniMoveHandle"></view>
		<view :class="'sidebar flex-column ' + ( showLeftPanel ? 'active' : '')"  @touchmove.stop.prevent="miniMoveHandle">
		    <scroll-view class="_scroll-view" :scroll-y="true" >
				<view class="list flex-column">
					<block v-for="(item, index) in myUserInfo.leftPanel" :key="index">
						<view class="item flex-row" @tap.stop.prevent="leftUrlTap(item.target_type, item.target_id )">
							<block v-if="item.type == 0">
								<view class="line"></view>
							</block>
							<block v-else-if="item.type == 1">

								<view class="icon">
									<i :class="'left-icon ' + item.icon "></i>
								</view>
								<view class="_text">
									{{ item.text }}
								</view>
							</block>
						</view>
					</block>
				</view>
			</scroll-view>
			<view class="icons flex-row">
				<view class="item flex-column" @tap.stop.prevent="leftUrlTap(6, '/pagesA/mine/settings/settings')">
					<view class="icon">
						<i class="mini-icon mini-shezhi2"></i>
					</view>
					<view class="_text">设置</view>
				</view>
				<view class="item flex-column" @tap.stop.prevent="leftUrlTap(6, '/pages/help/feedbackIndex/feedbackIndex')">
					<view class="icon">
						<i class="mini-icon mini-kefufenxiermaikefu"></i>
					</view>
					<view class="_text">帮助与反馈</view>
				</view>
				<view class="item flex-column" @tap.stop.prevent="leftUrlTap(9, 0)">
					<view class="icon">
						<i class="mini-icon mini-saoyisao"></i>
					</view>
					<view class="_text">扫一扫</view>
				</view>
			</view>
		</view>
		<view class="content">
			<navBar :iconTheme="iconTheme" :background=" 'rgba(' + myUserInfo.user_background_color + ', ' + navbarTrans + ');' " :color="'rgba(255, 255, 255, ' + navbarTrans + ')'" :scene="5" :placeholder="false">
				<view slot="left" class="lxy-nav-bar__logo">
					<i class="mini-icon mini-gengduo1" :style="'color: ' + iconTheme + ';'" @tap.stop.prevent="leftPanelOpen(true)"></i>
				</view>
				<view class="img-title-center" slot="center">
					<view class="lxy-nav-bar__logo">
						<image class="_image" :src="myUserInfo.user_avatar" :style="'opacity: ' + navbarTrans + ';'"/>
					</view>
				</view>
				<!-- #ifdef APP || H5 -->
				<view slot="right" class="lxy-nav-bar__logo" v-if="config_page_mine_header.right && (config_page_mine_header.right.icon || config_page_mine_header.right.img)">
					<block v-if="config_page_mine_header.right.img">
						<image class="_image" :src="config_page_mine_header.right.img" mode=""></image>
					</block>
					<block v-else>
						<i :class="'mini-icon' + ' ' + config_page_mine_header.right.icon" :style="'color: ' + iconTheme + ';'" @tap.stop.prevent="toSliderUrl(config_page_mine_header.right.type, config_page_mine_header.right.target_id)"></i>
					</block>

				</view>
				<!-- #endif -->
			</navBar>
			<view :style="'position: fixed;top: ' + CustomBar + 'px;height: 16rpx;width: 750rpx;background-color: rgba(' + myUserInfo.user_background_color + ', ' + navbarTrans + ');z-index: 9;'" v-if="navbarTrans >= 0.99"></view>
			<view class="user-background scene_5">
				<image class="banner" mode="aspectFill" :src="myUserInfo.user_background_maps || config_user_user_background_maps"></image>
				<view class="gradient" :style="'background-image: linear-gradient(180deg,rgba(0,0,0,.4),rgba(' + myUserInfo.user_background_color + ',.7) 30%,rgba(' + myUserInfo.user_background_color + ',.95) 65%,rgba(' + myUserInfo.user_background_color + ', 1))'"></view>
				<view class="own-header">
					<view class="inner">
						<view class="header-top" v-if="myUserInfo && myUserInfo.id > 0">
							<view :class="'own-header-img-div ' + (myUserInfo.avatar_frame_url ? 'has-frame' :'') " @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/editmine/editmine')">
								<image class="own-header-img" :lazyLoad="true" mode="aspectFill" :src="myUserInfo.user_avatar"></image>
								<image class="own-header-img-frame" v-if="myUserInfo.avatar_frame_url" :data-src="myUserInfo.avatar_frame_url" :lazyLoad="true" :src="myUserInfo.avatar_frame_url"></image>
								<i class="avatar-authentication-icon mini-icon mini-verify" v-if="myUserInfo.is_authentication == 1" @tap.stop.prevent="popupShowTap(1)"></i>
								<i class="avatar-authentication-icon mini-icon mini-jiahao-" v-else @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/certification/certification')"></i>
							</view>
							<view class="header-middle">
								<view class="user-name-box">
									<text :user-select="true" class="name-text">{{ myUserInfo.user_name }}</text>
									<i class="header-labels official-icon mini-icon mini-renzhengguanli1" v-if="myUserInfo.is_official > 0" @tap.stop.prevent="popupShowTap(0)" ></i>
									<block v-if="(config_pays && config_pays.paycode_16 == true)">
										<i class="header-labels  vip-icon mini-icon mini-vip" v-if="myUserInfo.is_member == 1" data-type="2" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/members/members')"></i>
										<i class="header-labels not-vip-icon mini-icon mini-vip" v-if="myUserInfo.is_member != 1" @tap.stop.prevent="toVipTap"></i>
									</block>
									<i :class="'header-labels lv-icon mini-icon mini-lv' + myUserInfo.lv" data-type="0"></i>
								</view>
								<view class="user-name-sub-box">
									<view class="user-account-box">
										<block v-if="config_app_multi != 0">
											<view class="change-tenant-btn flex-row" @tap.stop.prevent="toSliderUrl(6, '/pages/common/tenants')">
												<i class="mini-icon mini-qiehuan"></i>
												{{ global__tenant__.name }}
											</view>
											<i class="mini-icon mini-shuxian"></i>
											<view class="uid" @tap.stop.prevent="copyUserID(myUserInfo.id)">
												UID：{{ myUserInfo.id }}
											</view>
										</block>
										<block v-else-if="myUserInfo.authentication && myUserInfo.authentication.id > 0">
											<view class="auth-name">{{ myUserInfo.authentication.name}}</view>
											<i class="mini-icon mini-shuxian"></i>
											<view class="uid" @tap.stop.prevent="copyUserID(myUserInfo.id)">
												UID：{{ myUserInfo.id }}
											</view>
										</block>
										<block v-else>
											<view class="uid" @tap.stop.prevent="copyUserID(myUserInfo.id)">
												UID：{{ myUserInfo.id }}
											</view>
										</block>
									<i class="mini-icon mini-31erweima"  @tap.stop.prevent="toSliderUrl(12, 0)"></i>
									</view>
								</view>
							</view>
						</view>
						<view class="header-top" @tap.stop.prevent="toSliderUrl(-4, null)" v-else>
							<view class="own-header-img-div">
								<image class="own-header-img" :lazyLoad="true" :src="config_img.default_avatar" mode="aspectFill"></image>
							</view>
							<view class="header-middle not-login">立即登录</view>
						</view>
						<view class="user_state_not_zero_tip" v-if="myUserInfo.user_state != undefined && myUserInfo.user_state != 0">
							<i class="mini-icon mini-jinggao"></i>注意：{{ myUserInfo.state_tip }}
						</view>
						<view class="header-abstract">{{ myUserInfo.user_introduce }}</view>
						<view class="header-user-labels" v-if="myUserInfo.user_labels && myUserInfo.user_labels.length > 0">
							<scroll-view class="_scroll-view-label" :scroll-x="true" :enable-flex="true">
								<view class="label-inner">
									<block>
										<block v-if="myUserInfo.gender > 0">
											<view class="label" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/editmine/editmine')">
												<i class="header-label gender-m-icon mini-icon mini-xingbienan" :style=" (myUserInfo.age && myUserInfo.age.length > 0) ? 'margin-right: 8rpx;' : '' " v-if="myUserInfo.gender == 1"></i>
												<i class="header-label gender-w-icon mini-icon mini-xingbienv" :style=" (myUserInfo.age && myUserInfo.age.length > 0) ? 'margin-right: 8rpx;' : '' " v-if="myUserInfo.gender == 2"></i>
												{{ myUserInfo.age }}
											</view>
										</block>
										<block v-else-if="myUserInfo.age && myUserInfo.age.length > 0 ">
											<view class="label" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/editmine/editmine')">
												{{ myUserInfo.age }}
											</view>
										</block>
									</block>
									<block v-if="myUserInfo.university && myUserInfo.university.length > 0 ">
										<view class="label">
											{{ myUserInfo.university }}
										</view>
									</block>
									<view class="label" v-for="(label,index) in myUserInfo.user_labels" :key="index" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/editmine/editmine')">{{ label }}</view>
								</view>
							</scroll-view>
						</view>
						<view class="header-bottom">
							<view class="header-zuo">
								<view class="header-bottom-li" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/follow/follow?id=0')">
									<view class="own-header-num">
										{{ myUserInfo.follow_count > 999 ? filters.toFix(myUserInfo.follow_count) : (myUserInfo.follow_count || 0) }}
									</view>
									<view class="own-header-text">关注</view>
								</view>
								<view class="header-bottom-li" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/follow/follow?id=1')">
									<view class="own-header-num">
										{{ myUserInfo.follow_user_count > 999 ? filters.toFix(myUserInfo.follow_user_count) : (myUserInfo.follow_user_count || 0) }}
									</view>
									<view class="own-header-text">粉丝</view>
								</view>
								<view class="header-bottom-li" @tap.stop.prevent="popupShowTap(3)">
									<view class="own-header-num">
										{{ myUserInfo.like_count > 999 ? filters.toFix(myUserInfo.like_count) : (myUserInfo.like_count || 0) }}
									</view>
									<view class="own-header-text">被喜欢</view>
								</view>
							</view>
							<view class="header-right-box">
								<view class="header-box header-right" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/editmine/editmine')">编辑资料</view>
								<view class="header-box header-setup" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/settings/settings')">
									<i class="mini-icon mini-shezhi2"></i>
								</view>
							</view>
						</view>
						<block v-if="myUserInfo && myUserInfo.id > 0 && myUserInfo.grid && myUserInfo.grid.length > 0">
							<view class="my-grid-box">
								<scroll-view :scroll-x="true" class="_scroll-view">
									<view class="grid-box-inner">
										<view class="grid-item" v-for="(item, index) in myUserInfo.grid" :key="index" @tap.stop.prevent="toSliderUrl(6, item.path)" :style="'background-color: rgba('+ myUserInfo.user_background_color +',1);'">
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
						<view :class="'nav-inner ' + (config_audit_is_reward ? '' : 'hidden-exceptionaled') ">
							<block v-for="(item, index) in taga" :key="index">
								<view @tap.stop.prevent="select(item.name)" :class="'tag-box type_' + item.name">
									<view :class="'taga-item ' + (currentItem == item.name ? ' active' : '')">
										{{ item.text }}
										<view class="taga-item-count">{{ item.ums }}</view>
									</view>
								</view>
							</block>

						</view>
					</view>
				</u-sticky>
				<view class="body-box">
					<view class="post-list-gap"></view>
					<ls-skeleton :loading="topicload" :skeleton="commonSkeleton" :animate="true"  :scene="user_list_waterfall ? 90734 : 5">
						<block name="circle">
							<block v-if="user_list_waterfall">
								<l-water-flow comName="product" :waterData="postWaterData" ref="productwater" :column-gap="8" :scene="5"/>
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
													<user-info :user="item.user" :format_time="item.format_time" :ip_address="item.ip_address" :distance="item.distance" :device="item.device" :post_top="item.post_top">
														<view class="user-rigth" slot="right">
															<block v-if="config_app_mode != 'examine' && config_pays && config_pays.paycode_5">
																<view @tap.stop.prevent="toSliderUrl(6, '/pagesC/promotion/post?id=' + item.id)" class="follow-view folled water-mine-promotion">
																	推广
																</view>
															</block>
															<block v-else>
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
															</block>
														</view>
													</user-info>

												</view>

												<post-content :words="item" :postIndex="index" :scene="5" @unfoldTap="unfoldTap" @showPayContent="showPayContent" @soundPlayCall="soundsPlayCall" @forceUpdate="forceUpdate" @pSelectVote="selectVote"></post-content>
												<post-footer @tapShare="tapShare" @taplikes="taplikes" @tapComment="tapComments" @tapCollect="tapCollect" @tapReward="tapReward" @tapGiveCoin="tapGiveCoin" :words="item" :index="index"></post-footer>

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
									<view class="post-list-gap"></view>
								</view>
							</block>

							<u-popup :show="rewardPopup" @close="shutReward" >
								<view class="reward-add-box">
									<image class="reward-add-box-image"
										:src="config_img.reward_select" mode="aspectFill" />
									<view class="reward-add-input-box">
										<text class="_text">¥</text>
										<input class="reward-add-input" @input="rewardPriceChange" :value="rewardPrice"
											placeholder-class="reward-add-input-phs" type="digit"
											placeholder="在这里输入充电金额" />
									</view>
									<view class="reward-add-box-view">
										<view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 2 ? 'bd _view' : '_view'"
											data-price="2">¥2</view>
										<view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 6 ? 'bd _view' : '_view'"
											data-price="6">¥6</view>
										<view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 8 ? 'bd _view' : '_view'"
											data-price="8">¥8</view>
										<view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 18 ? 'bd _view' : '_view'"
											data-price="18">¥18</view>
									</view>
									<view class="reward-add-box-btn" @tap.stop.prevent="onOpenExceptionalAccountCheck">确认充电</view>
								</view>
							</u-popup>

							<u-popup :show="payContentPopup" @close="shutPayContent" :zIndex="99999991009">
								<block v-if="payContentObj && payContentObj.price > 0">
									<view class="pay_content_box">
										<view class="title"><view :class="'mini-icon ' + (payContentObj.pay_type == 1 ? 'mini-xueyuan-fufeikecheng' : 'mini-jinbi2') "></view>付费内容</view>
										<view class="pay_for_item price">
											<text class="_text">价格：</text>
											<block v-if="payContentObj.vip_price >= 0">
												<view class="pay_for_item_num vip_price">{{ payContentObj.vip_price + payContentObj.credit }} <view class="vip_price_tip">会员价</view> </view>
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

							<view :class="'dialog ' + (rewardDialog ? 'dialog_show' : '')">
								<view @tap.stop.prevent="onClickReward" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
								<view class="dialog_container">
									<view class="dialog_box_title">
										{{ exceptionalCount }}次充电
										<i class="mini-icon mini-shanchu2" @tap.stop.prevent="onClickReward" />
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
													<u-count-to :endVal="item.exceptional_price"
														:decimals="2" color="#FA5150" fontSize="46"></u-count-to>
												</view>
											</view>
										</view>
									</scroll-view>
								</view>
							</view>

							<view :class="'dialog ' + (bounced ? 'dialog_show' : '')">
								<view @tap.stop.prevent="bouncedTap" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
								<view class="dialog_container">
									<view class="dialog_conent">
										<view @tap.stop.prevent="bouncedDeleteTap" class="delete-btn" id="delete">确认删除
										</view>
										<view @tap.stop.prevent="bouncedTap" class="cancel-btn">取消</view>
									</view>
								</view>
							</view>

							<view :class="'dialog ' + (showShare ? 'dialog_show' : '')">
								<view @tap.stop.prevent="onClickShare" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
								<view class="dialog_container">
									<view class="dialog_conent">
										<view class="dialog_box">
											<button open-type="share" class="dialog_btn">
												<i class="mini-icon mini-weixin1"></i>
												微信好友
											</button>
											<view @tap.stop.prevent="sharePosterClick" class="dialog_btn">
												<i class="mini-icon mini-haibao"></i>
												海报
											</view>
										</view>
										<view @tap.stop.prevent="onClickShare" class="cancel-btn">取消</view>
									</view>
								</view>
							</view>

							<view  :class="showComments ? 'dialog_show' : ''">
								<view @tap.stop.prevent="toShutComments" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
								<view class="dialog_container">
									<view class="dialog_box_title">
										评论 {{ commentCount > 999 ? filters.toFix(commentCount) : commentCount }}
										<i class="mini-icon mini-shanchu2" @tap.stop.prevent="toShutComments" />
									</view>
									<comment-scroll unicom-id="commentScroll_5_0" ref="commentScroll" :postsId="postsId" @tapComment="tapComment"></comment-scroll>
									<comment-form unicom-id="commentForm_5_0" ref="commentForm" :postsId="postsId" :commentFormShow="commentFormShow" @maskClick="commentFormMaskClick" @sendComment="onInputComment" @tapComment="tapComment" :placeholder="replyName || '此时此刻想说~' "></comment-form>
								</view>
							</view>
						</block>
						<view class="empty-box" v-if="isNul">
							<u-empty :text="emptyTxt" :marginTop="100" :width="250" :height="250" text-size="24" />
							<block v-if="myUserInfo && myUserInfo.id > 0">
								<view class="bon-box" @tap.stop.prevent="addTap" v-if="currentItem == 'post'">立即发布</view>
							</block>
							<block v-else>
								<view class="bon-box" @tap.stop.prevent="toSliderUrl(-4, null)" v-if="currentItem == 'post'">立即登录</view>
							</block>
						</view>
					</ls-skeleton>
					<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──"
						 iconSize="28" fontSize="28" color="#989898" />
					<view class="post-list-gap" v-if="!isNul" style="height: 150rpx;"></view>
				</view>
			</view>

		</view>

		<u-popup :show="imageShow" @close="popupShowTap(-1)">
			<image @tap.stop.prevent="popupShowTap(-1)" v-if="typeShow == 0" class="vip-img" :src="config_user_official_popup || ''"
				mode="aspectFill"></image>
			<image @tap.stop.prevent="popupShowTap(-1)" v-if="typeShow == 1" class="vip-img"
				:src="config_user_authentication_popup" mode="aspectFill"></image>
			<image @tap.stop.prevent="popupShowTap(-1)" v-if="typeShow == 2" class="vip-img" :src="config_user_members_popup"
				mode="aspectFill"></image>
			<view @tap.stop.prevent="popupShowTap(-1)" v-if="typeShow == 3" class="like-box">
				<image :src="config_img.beliked_count" mode="aspectFill" />
				<text class="_text">{{ myUserInfo.user_name }} 被喜欢</text>
				<view>{{ myUserInfo.like_count }}</view>
			</view>
		</u-popup>
		<post-share unicom-id="postShare_5_0" :postsId="postsId" :show="showSharePopup" @postfeedback="postFeedback"></post-share>
		<hover-ball v-if="isOfficial > 1" /><my-toast unicom-id="mytotast_5_0" ref="mytoast" :isdistance="true" :toast="mytoast_data"  @giveCoin="onInputComment" @postfeedback="postFeedback"></my-toast>
	</view>
</view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	
	import SingleItem from "@/pages/sticky/components/single-item";
	import UserInfo from "@/pages/sticky/components/user-info";
	import PostContent from "@/pages/sticky/components/post-content";
	import CommentForm from "@/pages/sticky/components/comment-form";
	import CommentScroll from "@/pages/sticky/components/comment-scroll";
	import product from '@/components/common/water/product/index';
	import lWaterFlow from '@/linui/water-flow/index';
	import PostFooter from "@/pages/sticky/components/post-footer";
	import PostShare from "@/pages/sticky/components/post-share";
	import contextualPopup from '@/components/common/contextual-popup/contextual-popup';
	import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';

	const mixins = require('@/mixins/user');
	const common = require('@/mixins/common');
	const forum = require('@/mixins/forum');
	var options = {};

	mixins(options);
	common(options);
	forum(options);
	export default {
		mixins: [{ methods: options }],
		components: {
			myToast,navBar,hoverBall,lsSkeleton,
			
			lWaterFlow,
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
		computed:{
			CustomBar:{
				get(){
					let that = this;
					return that.$store.state.CustomBar;
				},
				set(v){}
			},
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
			config_user_user_background_maps: {
				get(){
					let that = this;
					return that.$store.state.config.user.user_background_maps
				},
				set(v){}
			},
			config_page_mine_header:{
				get(){
					let that = this;
					return that.$store.state.config.page.mine.header;
				},
				set(v){}
			},
			config_audit_is_reward:{
				get(){
					let that = this;
					return !that.$store.state.config.audit.is_reward && that.$store.state.config.app.mode != 'examine';
				},
				set(v){}
			},
			config_user_official_popup:{
				get(){
					let that = this;
					return that.$store.state.config.user.official_popup;
				},
				set(v){}
			},
			config_user_authentication_popup:{
				get(){
					let that = this;
					return that.$store.state.config.user.authentication_popup;
				},
				set(v){}
			},
			config_user_members_popup:{
				get(){
					let that = this;
					return that.$store.state.config.user.members_popup;
				},
				set(v){}
			},
			config_pays:{
				get(){
					let that = this;
					if(that.$store.state.config && that.$store.state.config.pays){
						return that.$store.state.config.pays || {};
					}
					return {};
				},
				set(v){}
			},
			user_list_waterfall:{
				get(){
					let that = this;
					
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
				get(){
					let that = this;
					if(that.user_list_waterfall){
						return that.$store.state.skeleton.waterfall;
					}else{
						return that.$store.state.skeleton.rowPost;
					}
				},
				set(v){}
			},
			config_app_multi:{
				get(){
					let that = this;
					return that.$store.state.config.app.multi;
				},
				set(v){}
			},
			config_app_mode:{
				get(){
					let that = this;
					if(that.$store.state.config.app && that.$store.state.config.app.mode){
						return that.$store.state.config.app.mode;
					}
					return ' ';
				},
				set(v){}
			},
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 5,
				postsId: 0,
				commentFormShow: 0,
				commentCount: 0,
				exceptionalCount: 0,
				sysMessageCount: 0,
				myPostsList: [],
				myLikePostsList: [],
				myCollectionList: [],
				myExceptionalList: [],
				myPostsPage: 1,
				myLikePostsPage: 1,
				myCollectionPage: 1,
				myExceptionalPage: 1,
				isNul: false,

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
					{
						text: '喜欢',
						name: 'liked',
						ums: '',
						type: 2,
					},
					{
						text: '充电',
						name: 'exceptionaled',
						ums: '',
						type: 3,
					}
				],

				currentItem: 'post',
				navbarTrans: 0,
				color: '0,0,0',
				iconTheme: 'white',
				emptyTxt: '空',
				posts: [],
				topicload: true,
				imageShow: false,

				loadmoreShow: false,
				isLastPage: false,
				selected: 0,
				typeShow: '',
				scrollTop: 0,


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
				postWaterData: {
					e: 0,
					data: []
				},
				showLeftPanel: false,
				showSharePopup: 0,
				lastRefrshTimeStamp: 0,
			};
		},
		onPageScroll: function onPageScroll(e) {
			let that = this;
			var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;

			if(trans > 1 && that.navbarTrans > 1){
				return false;
			}
			
			that.navbarTrans = trans;
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);

			if (options && options.id > 0) {
				uni.wen.toUrl(4, options.id, null);
			}

			if (uni.$store.state.token) {
				// that.userTotalPost();
				// that.userPosts(that.currentItem, 1);
			} else {
				that.setData({
					topicload: false,
					isNul: true,
					loadmoreShow: false,
				})
			}
			
			// #ifdef MP-WEIXIN
			if (wx.getPrivacySetting) {
				wx.getPrivacySetting({
					success: (res) => {
						if (res.needAuthorization) {
							that.shutLogin();
						}
					},
				});
			}
			// #endif
			
		},
		onReady: function() {
			uni.setNavigationBarColor({
			  frontColor: '#ffffff',
			});
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this;
			
			// #ifdef MP-WEIXIN
			getApp().globalData.$mpTabbar = this.$mp.page.getTabBar();
			// #endif

			//  #ifdef MP
			that.tabBarSetData({selected: 4});;
			// #endif
			//  #ifndef MP
			that.$store.commit('updateTabbarIndex', 4);;
			// #endif
			
			that.updateScene(5, 0, false, false, 0, 2);
			
			if (uni.$store.state.token) {
				that.getSysMessageCount().then(function(res) {
					//  #ifdef MP
					that.tabBarSetData({
						sysMessageCount: res
					});
					// #endif

					if(res > 0){
						that.$store.commit('updateSysMessageCount', res);
					}else{
						that.$store.commit('updateSysMessageCount', 0);
					}
				});
			}else{
				that.setData({
					topicload: false,
					isNul: true,
					loadmoreShow: false,
				})
			}
			
			if (that.myUserInfo && that.myUserInfo.timeStamp > 0 && (that.myUserInfo.timeStamp > that.lastRefrshTimeStamp) ) {
				that.lastRefrshTimeStamp = that.myUserInfo.timeStamp;
				uni.startPullDownRefresh();
			}
			
		},
		onBackPress(e) {
			if(this.rewardDialog){
				this.rewardDialog = false;
				// #ifdef APP || H5
				setTimeout(function(){
					uni.showTabBar();
				}, 250)
				// #endif
				return true;
			}else if(this.showComments) {
				this.showComments = false;

				// #ifdef APP || H5
				setTimeout(function(){
					uni.showTabBar();
				}, 250)
				// #endif

				return true;
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			let that = this;
			that.setData({
				postsId: 0,
				commentFormShow: 0,
				posts: [],
				postWaterData: {
					e: 1,
					data: []
				},
				myPostsList: [],
				myLikePostsList: [],
				myCollectionList: [],
				myExceptionalList: [],
				myPostsPage: 1,
				myLikePostsPage: 1,
				myCollectionPage: 1,
				myExceptionalPage: 1,
				topicload: true,
				loadmoreShow: false,
				isLastPage: false,
				isNul: false,
			});
			uni.wen.util.updateUserInfo(5, that);
			that.userPosts(that.currentItem, 1);
			that.userTotalPost();
			setTimeout(function() {
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh();
			}, 500);
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			let that = this;

			if (uni.$store.state.token) {
				if(that.isLastPage){
					return;
				}
				let page = 1;
				if (that.currentItem == 'post') {
					if(that.myPostsList.length <= 0){
						return;
					}else{
						page = that.myPostsPage + 1;
					}
				} else if (that.currentItem == 'collected') {
					if(that.myCollectionList.length <= 0){
						return;
					}else{
						page = that.myCollectionPage + 1;
					}
				} else if (that.currentItem == 'liked') {
					if(that.myLikePostsList.length <= 0){
						return;
					}else{
						page = that.myLikePostsPage + 1;
					}
				} else if (that.currentItem == 'exceptionaled') {
					if(that.myExceptionalList.length <= 0){
						return;
					}else{
						page = that.myExceptionalPage + 1;
					}
				}
				
				that.setData({
					loadmoreShow: true,
					isLastPage: false
				});

				that.userPosts(that.currentItem, page);
			}
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function(res) {
			let that = this;
			if (res.from == 'button') {
				let share_title = that.$store.state.config.share.format.app_share_post;
				let share_img = '';

				for (let index = 0; index < this.posts.length; index++) {
					const post = this.posts[index];

					if (post.id == Math.abs(this.postsId) ) {
						share_title = share_title.replace('[post_content]', post.posts_content_raw).replace(
							'[author_name]', post.user.user_name);
						share_img = post.share_img;
						break;
					}
				}

				share_title = share_title.replace(/<[^>]*?>/g, '');
				return {
					title: share_title,
					path: '/pages/sticky/sticky?id=' + Math.abs(that.postsId)  + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
					imageUrl: share_img
				};
			} else {
				let share_title = that.$store.state.config.share.format.app_share_user;
				share_title = share_title.replace('[user_name]', that.$store.state.myUserInfo.user_name).replace('[user_introduce]',
					that.$store.state.myUserInfo.user_introduce);
				return {
					title: share_title,
					path: '/pages/tabbar/mine/mine?id=' + that.$store.state.myUserInfo.id  + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
					imageUrl: that.$store.state.config.img.default_share
				};
			}
		},
		onShareTimeline: function(res) {
			let that = this;
			let my_avater_img = that.$store.state.myUserInfo ? that.$store.state.myUserInfo.user_avatar : '';
			let my_name = that.$store.state.myUserInfo ? that.$store.state.myUserInfo.user_name : '';
			let my_user_id = that.$store.state.myUserInfo ? that.$store.state.myUserInfo.id : '';
			let share_title = that.$store.state.config.share.format.app_share_user;
			share_title = share_title.replace('[user_name]', my_name).replace('[user_introduce]', that.$store.state.myUserInfo
				.user_introduce);
			return {
				title: share_title,
				query: 'id=' + my_user_id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: uni.wen.util.removeStyles(my_avater_img || that.$store.state.config.img.default_share) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
			};
		},
		onTabItemTap : function(e) {
			// #ifndef MP-WEIXIN
			if(e.pagePath == 'pages/tabbar/mine/mine'){
				uni.wen.util.doVibrateShort();
			}
			// #endif
		},
		methods: {
			leftUrlTap(type, id){
				let that = this;
				that.leftPanelOpen(false);
				setTimeout(function() {
					uni.wen.toUrl(type, id, that);
				}, 300);
			},
			leftPanelOpen(flag){
				let that = this;
				if(flag){
					uni.wen.util.doVibrateShort();
					uni.$store.commit('popopChange', true);
					that.showLeftPanel = true;
				}else{
					uni.$store.commit('popopChange', false);
					that.showLeftPanel = false;
				}
			},
			leftDrawOpen(){
				let that = this;
				that.$refs.leftDrawer.open();
			},
			select(type) {
				var that = this;

				if (uni.$store.state.token) {

				}else{
					uni.showToast({
						title: '请您先登录',
						icon: 'none'
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
					isLastPage: false,
				});
				let args = {};

				if (that.currentItem == 'post') {
					if (that.myPostsList.length <= 0) {
						that.userPosts(that.currentItem, 1);
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
						that.userPosts(that.currentItem, 1);
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
				} else if (that.currentItem == 'liked') {
					if (that.myLikePostsList.length <= 0) {
						that.userPosts(that.currentItem, 1);
					} else {
						args.posts = that.myLikePostsList;
						if(that.user_list_waterfall){
							that.setData({
								postWaterData: {
									e: 1,
									data: that.myLikePostsList
								}
							});
						}
					}
				} else if (that.currentItem == 'exceptionaled') {
					if (that.myExceptionalList.length <= 0) {
						that.userPosts(that.currentItem, 1);
					} else {
						args.posts = that.myExceptionalList;
						if(that.user_list_waterfall){
							that.setData({
								postWaterData: {
									e: 1,
									data: that.myExceptionalList
								}
							});
						}
					}
				}

				args.topicload = false;
				that.setData(args);
			},

			addTap() {
				let that = this;
				if (uni.$store.state.token) {
					uni.wen.toUrl(6, '/pages/creat/index/creat', null);
				} else {
					if(that.$store.state.scene == 14){
						return;
					}
					uni.wen.toUrl(-4, null, null);
				}
			},

			popupShowTap(type) {
				this.setData({
					typeShow: type,
					imageShow: !this.imageShow
				});
			},

			toVipTap() {
				uni.wen.toUrl(6, '/pagesA/mine/members/members', null);
			},

			//扫码
			toMessage() {
				uni.wen.toUrl(6, '/pages/notice/notice', null);
			},
			copyUserID(id){
				uni.wen.util.setClipboardData(id, 'UID已复制');
			},
			shutLogin(){
				let that = this;
				uni.removeStorageSync("token");
				uni.$store.commit('updateToken', '');
				
				uni.removeStorageSync("userInfo");
				that.$store.commit('updateUserInfo', 
				{
					id: 0,
					user_name: '未登录用户',
					user_avatar: '',
					avatar_frame_url: '',
					user_introduce: '这个人很懒，还没有简介',
					user_background_maps: '',
					user_background_color: '63,47,45',
					phone: '',
					country_code: '86',
					real_name: '',
					wechat_account: '',
					university: '',
					paycode: '',
					coins: 0,
					lv: 1,
					is_authentication: false,
					is_member: false,
					is_official: false,
					is_played: false,
					gender: 0,
					age: '',
					user_labels: [],
					constellation: '',
					club_id: null,
					follow_count: 0,
					follow_user_count: 0,
					like_count: 0,
					longitude: 0,
					latitude: 0,
					setting: {
						privacy_message_me: 1,
						privacy_collected_post_show: 1,
						privacy_my_follow_show: 1,
						privacy_follow_me_show: 1,
						privacy_personal_recommend: 1,
						privacy_personal_ad: 1,
						privacy_personal_geo_title: 1,
						diy_scene_1_post_list_style: 1,
						diy_scene_6_post_list_style: 1,
						diy_scene_7_post_list_style: 1,
						diy_scene_8_post_list_style: 1,
					},
					leftPanel: [
						{
							icon: "mini-icon2 mini-wodeqianbao",
							target_id: "/pagesA/mine/earnings/earnings",
							target_type: 6,
							text: "我的钱包",
							type: 1,
						},
						{
							icon: "mini-icon2 mini-zhifumima",
							target_id: "/pagesA/mine/paycode/paycode?direct=0",
							target_type: 6,
							text: "支付密码",
							type: 1,
						},
						{
							icon: "mini-icon2 mini-xiaofeijilu",
							target_id: "/pagesA/mine/order/order",
							target_type: 6,
							text: "消费记录",
							type: 1,
						},
						{
							type: 0,
						},
						{
							icon: "mini-icon2 mini-wodedingdan",
							target_id: "/pagesA/shop/order/order",
							target_type: 6,
							text: "我的买入",
							type: 1,
						},
						{
							icon: "mini-icon2 mini-wodegouwudai",
							target_id: "/pagesA/shop/cart/cart",
							target_type: 6,
							text: "我的购物袋",
							type: 1,
						},
						{
							icon: "mini-icon2 mini-shouhuodizhi",
							target_id: "/pagesA/mine/address/address?id=0",
							target_type: 6,
							text: "收货地址",
							type: 1,
						},
						{
							type: 0,
						},
						{
							icon: "mini-icon2 mini-woderenzheng",
							target_id: "/pagesA/mine/certification/certification",
							target_type: 6,
							text: "我的认证",
							type: 1
						},
						{
							icon: "mini-icon2 mini-wodequanzi",
							target_id: "/pagesA/mine/circleaudit/circleaudit",
							target_type: 6,
							text: "我的圈子",
							type: 1,
						}
					],
					publish: [],
					timeStamp: 0
				},
				);
				
				that.setData({
					postsId: 0,
					commentFormShow: 0,
					posts: [],
					postWaterData: {
						e: 1,
						data: []
					},
					myPostsList: [],
					myLikePostsList: [],
					myCollectionList: [],
					myExceptionalList: [],
					myPostsPage: 1,
					myLikePostsPage: 1,
					myCollectionPage: 1,
					myExceptionalPage: 1,
					topicload: true,
					loadmoreShow: false,
					isLastPage: false,
					isNul: false,
				});
				
			}

		}
	};
</script>
<style lang="scss" scoped>
	@import './mine.scss';
	.user_state_not_zero_tip{
		font-size: 12px;
		margin: 10px 0;
		color: black;
		.mini-icon{
			font-size: 12px;
			display: inline;
		}
	}
</style>
