<template>
	<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
		<view style="min-height: 100vh" class="mini-page-body">
			<view :class="'panel-overlay ' + (rightbarShow ? 'rightbar-show' : '')" @tap.stop.prevent="openRightSide">
			</view>
			<view :class="'right-panel ' + (rightbarShow ? 'rightbar-show' : '')">
				<view class="info">
					<view class="avatar">
						<image :src="circleInfo.head_portrait" mode="" class="circle_shape"></image>
					</view>
					<view class="name">{{ circleInfo.circle_name }}</view>
				</view>
				<view class="item">
					<view class="top">圈子ID：{{ circleInfo.id }}</view>
					<view class="bottom"></view>
				</view>
				<view class="item">
					<view class="top">所属分区：{{ circleInfo.plate.plate_name }}</view>
					<view class="bottom"></view>
				</view>
				<view class="item">
					<view class="top">关注权限：</view>
					<view class="bottom">
						<view class="" v-if="selidx[0] && selidx[0].length > 0">{{ selidx[0] }}&nbsp;</view>
						<view class="" v-if="selidx[1] && selidx[1].length > 0">{{ selidx[1] }}&nbsp;</view>
						<view class="" v-if="selidx[2] && selidx[2].length > 0">{{ selidx[2] }}&nbsp;</view>
						<view class="" v-if="selidx[3] && selidx[3].length > 0">{{ selidx[3] }}&nbsp;</view>
						<view class="" v-if="!selidx[0] && !selidx[1] && !selidx[2] && !selidx[3]">所有人</view>
					</view>
				</view>
				<view class="item">
					<view class="top">发布权限：</view>
					<view class="bottom">
						<view class="" v-if="selidx2[0] && selidx2[0].length > 0">{{ selidx2[0] }}&nbsp;</view>
						<view class="" v-if="selidx2[1] && selidx2[1].length > 0">{{ selidx2[1] }}&nbsp;</view>
						<view class="" v-if="selidx2[2] && selidx2[2].length > 0">{{ selidx2[2] }}&nbsp;</view>
						<view class="" v-if="selidx2[3] && selidx2[3].length > 0">{{ selidx2[3] }}&nbsp;</view>
						<view class="" v-if="selidx2[4] && selidx2[4].length > 0">{{ selidx2[4] }}&nbsp;</view>
						<view class="" v-if="!selidx2[0] && !selidx2[1] && !selidx2[2] && !selidx2[3] && !selidx2[4]">
							所有人
						</view>
					</view>
				</view>
			</view>
			<view :class="'panel ' + (rightbarShow ? 'rightbar-show' : '')">
				<navBar :back="true" :iconTheme="iconTheme" :title="circleInfo.circle_name" :home="fph" :background="global__theme__ == 'black' ? 'rgba(25, 25, 30, ' + navbarTrans + ')' : 'rgba(255, 255, 255, ' + navbarTrans + ')'" :color="'rgba(' + color + ', ' + navbarTrans + ')'" :placeholder="false">
					<!-- #ifdef APP -->
					<view @tap.stop.prevent="toShareCircle" slot="right" class="lxy-nav-bar__logo">
						<image class="_image" :src="iconRight" />
					</view>
					<!-- #endif -->
				</navBar>
				<view class="container">
					<view class="circle-info-wrap">
						<image class="banner_image" style="filter: blur(20px)" mode="aspectFill"
							:src="circleInfo.background_maps"></image>
						<view class="banner_image_height"></view>
						<view class="banner_image_mask" @tap.stop.prevent="onPreviewImage"
							:data-src="circleInfo.background_maps"></view>
						<view class="dynamic">
						<view class="dynamic_top">
							<view class="mini-circle-shape-wrap">
								<image @tap.stop.prevent="onPreviewImage" :data-src="circleInfo.head_portrait"
									:src="circleInfo.head_portrait" class="circle_shape" mode="aspectFill"></image>
								<image class="mini-circle-shape-image" src="@/pages/circle/static/image/circle-shape.png" mode="aspectFill"></image>
							</view>
							<view class="info-right">
								<view class="circle-name">
									{{ circleInfo.circle_name }}
								</view>
								<view class="admin-tools" v-if="isOfficial > 0">
								  <view class="circle-setting-a" @tap.stop.prevent="showSettingPopup" style="margin-right: 30rpx">
									<i class="mini-icon mini-shezhi2"></i>
								  </view>
								  <view class="circle-setting-a" @tap.stop.prevent="openRightSide">
									<i class="mini-icon mini-gengduo1"></i>
								  </view>
								</view>
								<view class="desc_box">
									<view class="desc_box_option">
										<text class="_text _textLast">
											{{ circleInfo.circle_posts_count > 999 ? filters.toFix(circleInfo.circle_posts_count): circleInfo.circle_posts_count}}条笔记
										</text>
								
										<view class="desc_box_s"></view>
										<text class="_text _textLast" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/users/users?id=14&object_id=' + circleInfo.id)">{{circleInfo.circle_follow_count > 999 ? filters.toFix(circleInfo.circle_follow_count) : circleInfo.circle_follow_count }}人关注
										</text>
										<view class="_text _textLast" style="margin-left: 10rpx">
											<!-- <i class="mini-icon mini-youjiantou"></i> -->
										</view>
									</view>
									<view @tap.stop.prevent="quitCircle" :data-id="circleInfo.id"
										class="desc_box_right yg" v-if="circleInfo.is_follow_circle">
										已加入
									</view>
									<view @tap.stop.prevent="quitCircle" :data-id="circleInfo.id" class="desc_box_right" v-else>
										加入
									</view>
								</view>
							</view>
						</view>
						
						<view class="user-circle-info">
							<scroll-view class="_scroll_view" scrollX enableFlex="enable-flex" enhanced="enhanced"
								scrollWithAnimation="scroll-with-animation" :showScrollbar="false">
								<view class="middle-them">
									<view class="them-txt-names" v-if="circleInfo.circle_user && circleInfo.circle_user.id > 0" @tap.stop.prevent="toSliderUrl(4, circleInfo.circle_user.id)">
										<view class="them-txt">圈主：</view>
										<view class="them-txt">
											<image class="_image" :src="circleInfo.circle_user.user_avatar" mode="aspectFit"></image>
										</view>
										<view class="them-txt u-line-1">
											{{ circleInfo.circle_user.user_name }}
										</view>
									</view>
									<view class="them-txt-names" v-if="circleInfo.continuous_to_circle && circleInfo.continuous_to_circle['days'] > 0">
										<view class="them-txt">
											{{ '共访问' + circleInfo.continuous_to_circle['days'] + '天' }}
										</view>
									</view>
									<view class="them-txt-names" v-if="circleInfo.follow_payment_duration">
										<view class="them-txt u-line-1">
											{{ '付费到期：' + circleInfo.follow_payment_duration }}
										</view>
									</view>
									
								</view>
							</scroll-view>
						</view>
						
						<view class="banner_container">
							<view class="dynamic_Introducer-content"
								:style="'width: ' + downWidth + 'rpx;-webkit-line-clamp: ' + down"
								v-if="circleInfo.circle_introduce != null">
								{{ circleInfo.circle_introduce }}
							</view>
							<view @tap.stop.prevent="downTap" class="icon-class-box"
								v-if="circleInfo.circle_introduce && circleInfo.circle_introduce.length > 24 && isIntroduce">
								<i class="mini-icon mini-xiajiantou"></i>
							</view>
						</view>
					</view>
					<view class="circle-user" v-if="circleInfo.circle_sqare && circleInfo.circle_sqare.length > 0">
						<scroll-view scrollX enableFlex="enable-flex" enhanced="enhanced"
							scrollWithAnimation="scroll-with-animation" :showScrollbar="false">
							<view class="user-list">
								<view class="user-box" :data-uid="item.id" @tap.stop.prevent="toSliderUrl(item.type, item.target_id)"
									v-for="(item, index) in circleInfo.circle_sqare" :key="index">
									<!-- <image :src="item.user_avatar"></image> -->
									<view class="image">
										<view class="image-txt">
											<image :src="item.img"></image>
										</view>
										<view>
											<text class="_text imageName">{{ item.name }}</text>
										</view>
									</view>
						
									<!-- <view v-if="item.id == circleInfo.user_id" class="qz">圈主</view> -->
						
									<!-- <text class="_text" v-else>{{ item.user_name }}</text> -->
								</view>
							</view>
						</scroll-view>
					</view>
					
					</view>
					
					<u-sticky offsetTop="-10px">
						<view class="nav">
							<view class="nav-inner">
								<view @tap.stop.prevent="onHandleClick(item.id)" class="tag-box" v-for="(item, index) in tabData" :key="index">
									<view :class="'taga-item ' + (curTabId == item.id ? 'active' : '')">
										{{ item.text }}
									</view>
								</view>
							</view>
							<view class="nav-inner-dropdown">
								<uniDataSelect v-model="sort" :localdata="sortRange" @change="sortChange"></uniDataSelect>
							</view>
						</view>
						<block v-if="circleInfo.circle_tags && circleInfo.circle_tags.length > 0">
							<view class="circle-user-tools">
								<scroll-view class="_scroll_view" scrollX enableFlex="enable-flex" enhanced="enhanced"
									scrollWithAnimation="scroll-with-animation" :showScrollbar="false">
									<view class="middle-them">
										<view class="them-txt-name" :class="{ activeTxt: selected_tag == item.id }" 
											v-for="(item, index) in circleInfo.circle_tags" :key="index">
											<view class="them-txt" @click="changeHandle(item.id)">
												{{ '#'+item.tags_name }}
											</view>
										</view>
									</view>
								</scroll-view>
							</view>
						</block>
					</u-sticky>

					<view class="top-notice" v-if="circleInfo.circle_notice && circleInfo.circle_notice.length > 0">
						<view class="notice-item" v-for="(item, index) in circleInfo.circle_notice" :key="index" @tap.stop.prevent="toSliderUrl(1, item.id)">
							<i class="mini-icon mini-zhiding1" style="color: #13cbb9;"></i>
<!-- 							<view class="">
								<a href=""> #拍一拍春天</a>
							</view> -->
							<view class="lun-txt">
								{{ item.post_title }}
							</view>
							<i class="mini-icon mini-youjiantou"></i>
						</view>
					</view>

					<view class="body-box">
						<view class="pd-btm">
							<block>
								<ls-skeleton :loading="topicload" :skeleton="commonSkeleton" :animate="true" :scene="circle_list_waterfall ? 90734 : 6">
									<block name="circle">
										<block v-if="circle_list_waterfall">
											<l-water-flow comName="product" :scene="6" :waterData="postWaterData" ref="productwater" :column-gap="8" />
										</block>
										<block v-else>
											<view class="post-list-gap"></view>
											<view class="post-wrap" v-for="(item, index) in posts" :key="index">
												<contextualPopup subject="posts" :popList="item.longtaps"
													:para="{ index: index, style: 'list' }">
													<view class="topic-detail-view" slot="content">
														<block v-if="item.post_type == 'single'">
															<single-item :single="item"></single-item>
														</block>
														<block v-else>
															<view class="topic-panel" :id="'media_' + item.id">
																<view class="user-info-view">
																	<user-info :user="item.user"
																		:format_time="item.format_time"
																		:ip_address="item.ip_address"
																		:distance="item.distance" :device="item.device"
																		:post_top="item.post_top">
																		<view class="user-rigth" slot="right">
																			<block
																				v-if="item.fields && item.fields.contact_phone">
																				<view @tap.stop.prevent="toSliderUrl(22, item.fields.contact_phone)" class="follow-view">
																					<i
																						class="mini-icon mini-dianhua inline"></i>
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
																						v-if="!item.is_follow_user">
																						关注
																					</view>
																					<view
																						@tap.stop.prevent="postsActionFollow"
																						:data-userid="item.user.id"
																						:data-index="index"
																						class="follow-view folled"
																						v-else-if="item.is_follow_user">
																						已关注
																					</view>
																				</block>
																			</block>
																		</view>
																	</user-info>
																</view>

																<post-content :words="item" :postIndex="index"
																	:scene="6" @unfoldTap="unfoldTap"
																	@showPayContent="showPayContent"
																	@soundPlayCall="soundsPlayCall"
																	@forceUpdate="forceUpdate"
																	@pSelectVote="selectVote"></post-content>
																<post-footer @tapShare="tapShare" @taplikes="taplikes"
																	@tapComment="tapComments" @tapCollect="tapCollect"
																	@tapReward="tapReward" @tapGiveCoin="tapGiveCoin"
																	:words="item" :index="index"></post-footer>

																<view class="reward-box"
																	v-if="item.exceptional && item.exceptional.length > 0"
																	:data-id="item.id" @tap.stop.prevent="onClickReward"
																	:data-ecount="item.exceptional_count">
																	<view class="inner">
																		<view class="cu-avatar-group">
																			<view v-if="item.exceptional_count > 6"
																				class="cu-avatar round dian">
																				•••
																			</view>
																			<view class="cu-avatar round" :style="
                                          'background-image:url(' + exceptional.user_avatar + ');'
                                        " v-for="(exceptional, index1) in item.exceptional" :key="exceptional.rid">
																			</view>
																		</view>
																		<view class="cu-avatar-text">
																			{{ item.exceptional_count }}次充电
																		</view>
																	</view>
																</view>
															</view>
														</block>
													</view>
												</contextualPopup>
												<view class="post-list-gap" v-if="index != posts.length - 1"></view>
												<block v-if="posts.length > 5 && item.ad">
													<!-- #ifdef MP -->
													<view class="flow-ad-wrap" v-if="item.ad">
														<block v-if="item.ad.type && item.ad.type == '1'">
															<i class="mini-icon mini-adtip"></i>
															<image class="_image" :src="item.ad.img" @tap.stop.prevent="
                                  toSliderUrl(item.ad.target_type, item.ad.target_id)
                                " mode="widthFix"></image>
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
														<block v-if="item.ad.type && item.ad.type == '1'">
															<i class="mini-icon mini-adtip"></i>
															<image class="_image" :src="item.ad.img" @tap.stop.prevent="
                                  toSliderUrl(item.ad.target_type, item.ad.target_id)
                                " mode="widthFix"></image>
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

											<u-popup :show="rewardPopup" @close="shutReward" :animation="false"
												:zIndex="99999991009">
												<view class="reward-add-box">
													<image class="reward-add-box-image" :src="config_img.reward_select"
														mode="aspectFill" />
													<view class="reward-add-input-box">
														<text class="_text">¥</text>
														<input class="reward-add-input" @input="rewardPriceChange"
															:value="rewardPrice"
															placeholder-class="_input_place_holder" type="digit"
															placeholder="在这里输入充电金额" />
													</view>
													<view class="reward-add-box-view">
														<view @tap.stop.prevent="addRewardPrice"
															:class="rewardPrice == 2 ? 'bd _view' : '_view'"
															data-price="2">
															¥2
														</view>
														<view @tap.stop.prevent="addRewardPrice"
															:class="rewardPrice == 6 ? 'bd _view' : '_view'"
															data-price="6">
															¥6
														</view>
														<view @tap.stop.prevent="addRewardPrice"
															:class="rewardPrice == 8 ? 'bd _view' : '_view'"
															data-price="8">
															¥8
														</view>
														<view @tap.stop.prevent="addRewardPrice"
															:class="rewardPrice == 18 ? 'bd _view' : '_view'"
															data-price="18">
															¥18
														</view>
													</view>
													<view class="reward-add-box-btn"
														@tap.stop.prevent="onOpenExceptionalAccountCheck">
														确认充电
													</view>
												</view>
											</u-popup>

											<u-popup :show="payContentPopup" @close="shutPayContent"
												:zIndex="99999991009">
												<block v-if="payContentObj && payContentObj.price > 0">
													<view class="pay_content_box">
														<view class="title">
															<view :class="
                                  'mini-icon ' +
                                  (payContentObj.pay_type == 1
                                    ? 'mini-xueyuan-fufeikecheng'
                                    : 'mini-jinbi2')
                                "></view>
															付费内容
														</view>
														<view class="pay_for_item price">
															<text class="_text">价格：</text>
															<block v-if="payContentObj.vip_price >= 0">
																<view class="pay_for_item_num vip_price">
																	{{ payContentObj.vip_price + payContentObj.credit }}
																	<view class="vip_price_tip">会员价</view>
																</view>
															</block>
															<block v-else>
																<view class="pay_for_item_num">
																	{{ payContentObj.price + payContentObj.credit }}
																</view>
															</block>
														</view>
														<view class="pay_for_item rest">
															<text class="_text">剩余篇幅：</text>
															<view class="pay_for_item_num">{{ payContentObj.rest }}%
															</view>
														</view>
														<view class="pay_for_item has_hidden">
															<text class="_text">隐藏内容：</text>
															<view class="pay_for_item_num">
																{{ payContentObj.has_hidden }}字符
															</view>
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
														<view class="buy_button" @tap.stop.prevent="payPost">立即购买
														</view>
														<view class="tips">
															虚拟物品存在可复制性，请谨慎购买，不可退货，若不慎被骗，请立即举报并说明原因
														</view>
													</view>
												</block>
											</u-popup>

											<view :class="'dialog ' + (rewardDialog ? 'dialog_show' : '')">
												<view @tap.stop.prevent="onClickReward" class="dialog_mask"
													@touchmove.stop.prevent="miniMoveHandle"></view>
												<view class="dialog_container">
													<view class="dialog_box_title">
														{{ exceptionalCount }}次充电
														<i class="mini-icon mini-shanchu2"
															@tap.stop.prevent="onClickReward" />
													</view>
													<scroll-view :scroll-y="true" class="dialog_comments" enhanced
														:show-scrollbar="false" lower-threshold="0">
														<view class="dialog_conent">
															<view class="reward-user-box"
																v-for="(item, index) in exceptionalList"
																:key="item.rindex">
																<view class="reward-user-avatar-view" hover-class="none"
																	@tap.stop.prevent="toSliderUrl(4, item.user.id)">
																	<image class="reward-user-avatar-image"
																		compression="avatar" mode="aspectFill"
																		:src="item.user.user_avatar"></image>
																	<view class="reward-user-right">
																		<view class="reward-user-name">
																			{{ item.user.user_name }}
																		</view>
																		<view class="reward-user-date">
																			{{ item.exceptional_date }}
																		</view>
																	</view>
																</view>

																<view class="reward-user-price">
																	充电了￥
																	<u-count-to :endVal="item.exceptional_price"
																		:decimals="2" color="#FA5150"
																		fontSize="46"></u-count-to>
																</view>
															</view>
														</view>
													</scroll-view>
												</view>
											</view>


											<view :class="'dialog ' + (showShare ? 'dialog_show' : '')">
												<view @tap.stop.prevent="onClickShare" class="dialog_mask"
													@touchmove.stop.prevent="miniMoveHandle"></view>
												<view class="dialog_container">
													<view class="dialog_conent">
														<view class="dialog_box">
															<button open-type="share" class="dialog_btn">
																<i class="mini-icon mini-weixin1"></i>
																微信好友
															</button>
															<view @tap.stop.prevent="sharePosterClick"
																class="dialog_btn">
																<i class="mini-icon mini-haibao"></i>
																海报
															</view>
														</view>
														<view @tap.stop.prevent="onClickShare" class="cancel-btn">取消
														</view>
													</view>
												</view>
											</view>

											<view :class="showComments ? 'dialog_show' : ''">
												<view @tap.stop.prevent="toShutComments" class="dialog_mask"
													@touchmove.stop.prevent="miniMoveHandle"></view>
												<view class="dialog_container">
													<view class="dialog_box_title">
														评论
														{{ commentCount > 999 ? filters.toFix(commentCount) : commentCount }}
														<i class="mini-icon mini-shanchu2"
															@tap.stop.prevent="toShutComments" />
													</view>
													<comment-scroll :unicom-id="'commentScroll_6_' + id"
														ref="commentScroll" :postsId="postsId"
														@tapComment="tapComment"></comment-scroll>
													<comment-form :unicom-id="'commentForm_6_' + id" ref="commentForm"
														:postsId="postsId" :commentFormShow="commentFormShow"
														@maskClick="commentFormMaskClick" @sendComment="onInputComment"
														@tapComment="tapComment"
														:placeholder="replyName || '此时此刻想说~'"></comment-form>
												</view>
											</view>
										</block>
									</block>
									<u-empty v-if="isNul" class="empty-view" text="空"
										width="300" height="300" text-size="28" />
								</ls-skeleton>
								<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'"
									nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898" />
							</block>
						</view>
					</view>
				</view>
				<view @tap.stop.prevent="refreshEvent" class="refresh">
					<i class="mini-icon mini-xunhuan"></i>
				</view>
				<view class="circle-setting-popup" v-if="isShowSettingPopup">
					<view class="mask" @tap.stop.prevent="showSettingPopup"></view>
					<view class="setting-content">
						<view class="listBgV">
							<view class="group">
								<view class="title-wrap">
									<view class="title">1、圈主分成</view>
								</view>
								<view class="division">
									<view :class="'item ' + (circle_user_paycontent_division > 0 ? 'checked' : '')">
										付费内容分成
										<input class="price_input" maxlength="5"
											@input="input_circle_user_devision_price($event, 0)"
											:value="circle_user_paycontent_division" type="number" placeholder="数额"
											placeholder-style="font-size: 26rpx; color: #ccc;" />
										%
									</view>
									<view :class="'item ' + (circle_user_division > 0 ? 'checked' : '')">
										其他分成
										<input class="price_input" maxlength="5"
											@input="input_circle_user_devision_price($event, 1)"
											:value="circle_user_division" type="number" placeholder="数额"
											placeholder-style="font-size: 26rpx; color: #ccc;" />
										%
									</view>
								</view>
							</view>
							<view class="group">
								<view class="title-wrap">
									<view class="title">2、关注限制</view>
									<view class=""></view>
								</view>
								<view class="listitem" v-for="(item, cp_index) in settingCircleFollowPermissions"
									:key="cp_index">
									<view :class="
                      'item ' +
                      (selidx[cp_index] == item ? 'checked' : '') +
                      (cp_index == settingCircleFollowPermissions.length - 1 ? ' not-border' : '')
                    ">
										<block v-if="item == '付费'">
											<view class="name">
												{{ item }}
												<view class="flex-row">
													<input class="price_input" maxlength="5"
														@input="input_circle_price($event, 0)" :value="followPay"
														type="number" placeholder="数额"
														placeholder-style="font-size: 26rpx; color: #ccc;" />
													<textSwitch :checked="followPayType" :disable="false"
														disable_tip="不支持该功能" :uncheck_text="config_app_coins_name"
														checked_text="余额" @change="switch_circle_price_type($event, 0)"
														width="130" :style="
                              'transform:scale(0.72);margin-top: 18rpx;' +
                              (selidx[cp_index] == item ? '' : 'opacity: 0.7;')
                            "></textSwitch>
													<input class="price_input" maxlength="5"
														@input="input_circle_duration($event)"
														:value="followPayDuration" type="number" placeholder="0"
														placeholder-style="font-size: 26rpx; color: #ccc;" />
													天
												</view>
											</view>

											<i class="mini-icon mini-yigouxuan" v-if="selidx[cp_index] == item"
												@tap.stop.prevent="doSelPermission(item, cp_index, 1)"></i>
											<i class="mini-icon mini-weigouxuan" v-else
												@tap.stop.prevent="doSelPermission(item, cp_index, 1)"></i>
										</block>
										<block v-else>
											<view class="name">{{ item }}</view>
											<i class="mini-icon mini-yigouxuan" v-if="selidx[cp_index] == item"
												@tap.stop.prevent="doSelPermission(item, cp_index, 1)"></i>
											<i class="mini-icon mini-weigouxuan" v-else
												@tap.stop.prevent="doSelPermission(item, cp_index, 1)"></i>
										</block>
									</view>
								</view>
							</view>
							<view class="group">
								<view class="title-wrap">
									<view class="title">3、发布限制</view>
								</view>

								<view class="listitem" v-for="(item, cp_index2) in settingCirclePublishPermissions"
									:key="cp_index2">
									<block v-if="item == '付费按次发布'">
										<view :class="
                        'item ' +
                        (selidx2[cp_index2] == item ? 'checked' : '') +
                        (cp_index2 == settingCirclePublishPermissions.length - 1
                          ? ' not-border'
                          : '')
                      ">
											<view class="name">
												{{ item }}
												<view class="flex-row">
													<input class="price_input" maxlength="5"
														@input="input_circle_price($event, 1)" :value="publishPay"
														type="number" placeholder="数额"
														placeholder-style="font-size: 26rpx; color: #ccc;" />
													<textSwitch :checked="publishPayType" :disable="false"
														disable_tip="不支持该功能" :uncheck_text="config_app_coins_name"
														checked_text="余额" @change="switch_circle_price_type($event, 1)"
														width="130" :style="
                              'transform:scale(0.72);margin-top: 18rpx;' +
                              (selidx2[cp_index2] == item ? '' : 'opacity: 0.7;')
                            "></textSwitch>
												</view>
											</view>
											<i class="mini-icon mini-yigouxuan" v-if="selidx2[cp_index2] == item"
												@tap.stop.prevent="doSelPermission(item, cp_index2, 2)"></i>
											<i class="mini-icon mini-weigouxuan" v-else
												@tap.stop.prevent="doSelPermission(item, cp_index2, 2)"></i>
										</view>
									</block>
									<block v-else>
										<view :class="
                        'item ' +
                        (selidx2[cp_index2] == item ? 'checked' : '') +
                        (cp_index2 == settingCirclePublishPermissions.length - 1
                          ? ' not-border'
                          : '')
                      ">
											<view class="name">{{ item }}</view>
											<i class="mini-icon mini-yigouxuan" v-if="selidx2[cp_index2] == item"
												@tap.stop.prevent="doSelPermission(item, cp_index2, 2)"></i>
											<i class="mini-icon mini-weigouxuan" v-else
												@tap.stop.prevent="doSelPermission(item, cp_index2, 2)"></i>
										</view>
									</block>
								</view>
							</view>
						</view>
						<view class="surebtn" @tap.stop.prevent="circleSettingSure">确认</view>
					</view>
				</view>
				<post-share :unicom-id="'postShare_6_' + id" :postsId="postsId" :show="showSharePopup"
					@postfeedback="postFeedback"></post-share>
				<hover-ball v-if="isOfficial > 1" />
				<my-toast :unicom-id="'mytotast_6_' + id" ref="mytoast" :isdistance="true" :toast="mytoast_data"
					@giveCoin="onInputComment" @postfeedback="postFeedback"></my-toast>
			</view>
			<block>
				<block v-if="config2_page_circle_publish_icon == 1">
					<view class="publish_fixed_icon" @tap.stop.prevent="gotoPost(null)">
						<i class="mini-icon mini--jia"></i>
						<view class="float-badge enlarge" v-if="!showmenu">发笔记</view>
					</view>
				</block>
				<block v-else>
					<view class="add-topic-post">
						<view :class="'add-post-ctrl ' + (showmenu ? 'add-post-animation' : 'add-post-animation2')">
							<view class="_view" @tap.stop.prevent="plusClickAction">
								<i class="mini-icon mini--jia"></i>
							</view>
						</view>
					</view>
					<view class="add-topic-post-btn">
						<view :class="
                'add-topic-post-option ' +
                (showmenu ? 'add-option-animation' : 'add-option-animation2')
              ">
							<view :class="
                  'add-post-icon-box ' +
                  (showmenu ? 'add-option-animation-drift' : 'add-option-animation-drift2')
                ">
								<view @tap.stop.prevent="gotoPost(1)" class="add-post-icon">
									<image mode="aspectFill" src="/pages/circle/static/image/tpicon.png"></image>
								</view>
								<view class="add-post-icon-center">
									<view @tap.stop.prevent="gotoPost(1)">
										<image mode="aspectFill" src="/pages/circle/static/image/float_btn.png"></image>
									</view>
								</view>
								<view @tap.stop.prevent="gotoPost(2)" class="add-post-icon">
									<image mode="aspectFill" src="/pages/circle/static/image/spicon.png"></image>
								</view>
							</view>
						</view>
					</view>
				</block>
			</block>
		</view>
		<view :class="'dialog ' + (bounced ? 'dialog_show' : '')">
			<view @tap.stop.prevent="bouncedTap" class="dialog_mask"
				@touchmove.stop.prevent="miniMoveHandle"></view>
			<view class="dialog_container">
				<view class="dialog_conent">
					<view @tap.stop.prevent="bouncedDeleteTap" class="delete-btn"
						id="delete">
						确认删除
					</view>
					<view @tap.stop.prevent="bouncedTap" class="cancel-btn">取消
					</view>
				</view>
			</view>
		</view>
		<block v-if="visitUnlockPopup">
			<view class="follow-pay-box">
				<navBar :back="false" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
					<view slot="left" class="back">
						<i class="mini-icon mini-zuojiantou" @tap.stop.prevent="lockBack" :style="'font-size: 23px;color: '+ ( global__theme__ == 'black' ? '#ffffff' : '#000000' ) +';'"></i>
					</view>
					<!-- #ifdef APP || H5 -->
					<view slot="right" class="lxy-nav-bar__logo">
					</view>
					<!-- #endif -->
				</navBar>
				<scroll-view class="_scroll_view" scrollY  :showScrollbar="false" :style="'height: '+ swiperHeight">
					<view class="follow-pay-inner">
						<view class="header">
							<view class="header-left">
								<view class="title">{{ circleInfo.circle_name}}</view>
								<view class="number">圈子ID: {{ circleInfo.id }}</view>
								<view class="tag"><text>{{ circleInfo.plate.plate_name }}</text></view>
							</view>
							<view class="header-right">
								<image :src="circleInfo.head_portrait" mode="" class="avatar circle_shape"/>
							</view>
						</view>
						<view class="count">
							<view class="item">
								<view class="num">{{ circleInfo.circle_posts_count }}</view>
								<view class="txt">笔记</view>
							</view>
							<view class="item">
								<view class="num">{{ circleInfo.circle_follow_count }}</view>
								<view class="txt">成员</view>
							</view>
							<view class="item">
								<view class="num">{{ circleInfo.pay_content_count }}</view>
								<view class="txt">付费笔记</view>
							</view>
							<view class="item">
								<view class="num">{{ circleInfo.comment_count }}</view>
								<view class="txt">评论数</view>
							</view>
						</view>
						<view class="intro">
							<view class="intro-title">
								<view class="title">圈子介绍</view>
								<view class="complaint" @tap.stop.prevent="toReport(4, circleInfo.id)"><i class="mini-icon mini-shengming"></i>举报</view>
							</view>
							<view class="user" v-if="circleInfo.circle_user && circleInfo.circle_user.id > 0" @tap.stop.prevent="toSliderUrl(4, circleInfo.circle_user.id)">
								<image :src="circleInfo.circle_user.user_avatar" mode="" class="avatar"/>
								<view class="user-text" >
									<view class="name">圈主： {{ circleInfo.circle_user.user_name }}</view>
									<view class="sub">{{ circleInfo.format_time }}创建圈子，{{ circleInfo.circle_user.online_time + ' '+ circleInfo.circle_user.device }}在线</view>
								</view>
							</view>
							<view class="intro-content" :class="isfpIntroMore ?'':'over'" v-if="circleInfo.circle_introduce">
								{{ circleInfo.circle_introduce }}
							</view>
							<view class="intro-more" @click="isfpIntroMore=!isfpIntroMore" v-if="circleInfo.circle_introduce && circleInfo.circle_introduce.length > 72">点击{{isfpIntroMore?'收起':'展开'}}</view>
						</view>
	
	<!-- 					<view class="partner">
							<view class="partner-title">合伙人</view>
							<view class="partner-list">
								<view class="item">
									<image src="" class="avatar" />
									<view class="name">张三</view>
								</view>
								<view class="item">
									<image src="" class="avatar" />
									<view class="name">李四</view>
								</view>
								<view class="item">
									<image src="" class="avatar" />
									<view class="name">王五</view>
								</view>
							</view>
						</view> -->
						<view class="theme">
							<view class="theme-title">部分笔记预览</view>
							<l-water-flow comName="product" :waterData="postWaterData" ref="productwater" :column-gap="8" :scene="60001"/>
							<block v-if="circleInfo.follow_pay_credit == 1">
								<view class="seeMoreBtn"  @tap.stop.prevent="followPayToast">加入圈子可以查看更多内容</view>
							</block>
							<block v-else>
								<view class="seeMoreBtn" @tap.stop.prevent="quitCircle" :data-id="circleInfo.id" data-way="follow-pay">加入圈子可以查看更多内容</view>
							</block>
						</view>
						
						
						<view class="fee" v-if="circleInfo.follow_pay_num > 0">
							<view class="fee-title">
								<view class="text">付费须知</view>
								<block v-if="circleInfo.follow_pay_credit == 1">
									<view class="money balance-color">
										<i class="mini-icon mini-yue balance-color"></i>
										{{ circleInfo.follow_pay_num }}
									</view>
								</block>
								<block v-else>
									<view class="money gold-color">
										<i class="mini-icon mini-Gold_coin_01 gold-color"></i>
										{{ circleInfo.follow_pay_num }}
									</view>
								</block>
							</view>
							<view class="fee-content">
								<view class="no">1.</view>
								<view class="text">
									<view class="p">付费后，你可以使用当前付款的账号在有效期内通过[小程序、App 端、Web 端阅读内容、参与互动，向圈友提问。</view>
									<view class="p">有效期:<text class="orange">{{ circleInfo.follow_pay_duration }}天</text></view>
								</view>
							</view>
							<view class="fee-content">
								<view class="no">2.</view>
								<view class="text">
									<view class="p">加入圈子后，不可申请退款，如有争议，请联系客服进行协商
									</view>
								</view>
							</view>
							<view class="fee-content">
								<view class="no">3.</view>
								<view class="text">
									<view class="p">本圈子由圈主自行创建，加入前请确认风险，平台不提供相关保证。若发现违法圈子，请勿加入，并投诉。</view>
								</view>
							</view>
						</view>
						<view v-else style="height: 300rpx;"></view>
						
						<!-- 联系客服 -->
			<!-- 			<view class="bottom">
							<view class="tip">圈子价格 ￥799，点击咨询如何购买</view>
							<navigator url="" class="url" hover-class="none">联系客服</navigator>
						</view> -->
					</view>
				</scroll-view>
				<!-- 立即加入 -->
				<view class="bottom" v-if="circleInfo.follow_pay_num > 0">
					<view class="package">
						<view class="time">服务时间：{{ circleInfo.follow_pay_duration }}天</view>
						<view class="money">{{ circleInfo.follow_pay_day_tip || '' }}</view>
					</view>
					<block v-if="circleInfo.follow_pay_credit == 1">
						<view class="entry" @tap.stop.prevent="followPayToast">立即加入：<i class="mini-icon mini-yue"></i>{{ circleInfo.follow_pay_num }}</view>
					</block>
					<block v-else-if="circleInfo.follow_pay_credit == 0">
						<view class="entry" @tap.stop.prevent="quitCircle" :data-id="circleInfo.id" data-way="follow-pay">立即加入：<i class="mini-icon mini-Gold_coin_01"></i>{{ circleInfo.follow_pay_num }}</view>
					</block>
					<block v-else>
						<view class="entry"></view>
					</block>
				</view>
				<view class="bottom" v-else>
					<view class="package">
						<view class="time">
							<view>需要满足</view>
							<view class="highlight" v-if="selidx[0] && selidx[0].length > 0">{{ selidx[0] }}</view>
							<view class="highlight" v-if="selidx[1] && selidx[1].length > 0">{{ selidx[1] }}</view>
							<view class="highlight" v-if="selidx[2] && selidx[2].length > 0">{{ selidx[2] }}</view>
							<view class="highlight" v-if="selidx[3] && selidx[3].length > 0">{{ selidx[3] }}</view>
							<view>权限之一</view>
						</view>
						<view class="money"></view>
					</view>
					<view class="entry disable">权限不足</view>
				</view>
			</view>
		</block>
	</view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
	import myToast from '@/contrib/components/common/toast/toast'
	import navBar from '@/components/common/navbar/navbar'
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball'
	import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton'

	import uniDataSelect from '@/pages/circle/components/uni-data-select/uni-data-select'
	import lWaterFlow from '@/linui/water-flow/index'
	import SingleItem from '@/pages/sticky/components/single-item'
	import UserInfo from '@/pages/sticky/components/user-info'
	import PostContent from '@/pages/sticky/components/post-content'
	import textSwitch from '@/components/text-li-switch/text-li-switch.vue'
	import CommentForm from '@/pages/sticky/components/comment-form'
	import CommentScroll from '@/pages/sticky/components/comment-scroll'
	import product from '@/components/common/water/product/index'
	import PostFooter from '@/pages/sticky/components/post-footer'
	import PostShare from '@/pages/sticky/components/post-share'
	import contextualPopup from '@/components/common/contextual-popup/contextual-popup'
	const mixins = require('@/mixins/circle')
	const common = require('@/mixins/common')
	const user = require('@/mixins/user')
	const forum = require('@/mixins/forum')
	var options = {}
	mixins(options)
	common(options)
	user(options)
	forum(options)
	export default {
		mixins: [{
			methods: options,
		}, ],
		components: {
			uniDataSelect,
			myToast,
			navBar,
			hoverBall,
			lsSkeleton,

			lWaterFlow,
			UserInfo,
			PostContent,
			SingleItem,
			textSwitch,
			CommentForm,
			CommentScroll,
			product,
			PostFooter,
			PostShare,
			contextualPopup,
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 6,
				sort: 0,
				sortRange: [{
						value: 0,
						text: '新发'
					},
					{
						value: 1,
						text: '新回'
					},
					{
						value: 2,
						text: '热门'
					},
				],
				postsId: 0,
				selected_tag: 0,
				commentFormShow: 0,
				commentCount: 0,
				exceptionalCount: 0,
				navbarTrans: 0,
				color: '0,0,0',
				iconTheme: 'white',
				iconRight: '/static/image/slim_share_w.png',
				showmenu: false,
				scrollTop: 0,
				circleInfo: {
					circle_posts_count: 0,
					circle_follow_count: 0,
					pay_content_count: 0,
					comment_count: 0,
					follow_pay_credit: 0,
					follow_pay_num: 0,
					circle_name: '',
					circle_introduce: '',
					circle_user_id: 0,
					list_style: -1,
					plate: {},
					circle_tags: [],
					circle_notice: [],
					user: {
						id: 0,
					},
					continuous_to_circle: null
				},
				circleUser: [],
				tabData: [{
					'id': 0,
					'text': '笔记'
				}],
				curTabId: 0,
				posts: [],
				postsList: [],
				newPostsList: [],
				comPostsList: [],
				auditPostsList: [],
				postsPage: 1,
				newPostsPage: 1,
				comPostsPage: 1,
				auditPostsPage: 1,
				isNul: false,
				topicload: true,
				loadmoreShow: false,
				isLastPage: false,
				downWidth: 655,
				down: 1,
				isIntroduce: true,

				id: '',

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
				isShowSettingPopup: false,
				settingCircleFollowPermissions: ['认证用户', '会员', '管理员', '付费'],
				settingCirclePublishPermissions: ['已关注用户', '认证用户', '会员', '管理员', '付费按次发布'],
				selidx: ['', '', ''],
				selidx2: ['', '', '', ''],
				followPay: 0,
				followPayType: false,
				followPayDuration: 0,
				publishPay: 0,
				publishPayType: false,
				circle_user_paycontent_division: 0,
				circle_user_division: 0,
				rightbarShow: false,
				postWaterData: {
					e: 0,
					data: [],
				},
				showSharePopup: 0,
				
				visitUnlockPopup: false,
				isfpIntroMore: false,
			}
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
			circle_list_waterfall: {
				get() {
					let that = this;
					if(that.circleInfo.list_style == 2){
						return true;
					}
					if(that.circleInfo.list_style == 1){
						return false;
					}
					if(that.myUserInfo.setting && that.myUserInfo.setting.diy_scene_6_post_list_style != 1){
						if(that.myUserInfo.setting.diy_scene_6_post_list_style == 3){
							return true;
						}else{
							return false;
						}
					}
					if(that.config_page_circle_style == 1){
						return true;
					}
					return false;
					
				},
				set(v) {},
			},
			config_audit_is_reward: {
				get() {
					let that = this
					return (
						!that.$store.state.config.audit.is_reward &&
						that.$store.state.config.app.mode != 'examine'
					)
				},
				set(v) {},
			},
			isCircleUser: {
				get() {
					let that = this
					return that.circleInfo.user_id == that.$store.state.userInfo.id
				},
				set(v) {},
			},
			config2_page_circle_publish_icon: {
				get() {
					let that = this
					return that.$store.state.config2.page.circle.publish_icon
				},
				set(v) {},
			},
			config_page_circle_style: {
				get() {
					let that = this
					return that.$store.state.config.page.circle.style
				},
				set(v) {},
			},
			commonSkeleton: {
				get() {
					let that = this
					if (that.circle_list_waterfall) {
						return that.$store.state.skeleton.waterfall
					} else{
						return that.$store.state.skeleton.rowPost
					}
				},
				set(v) {},
			},
			config_app_coins_name: {
				get() {
					let that = this
					if (that.$store.state.config.app.coins) {
						return that.$store.state.config.app.coins.name
					}
					return '硬币'
				},
				set(v) {},
			},
			swiperHeight: {
			  get() {
			    let that = this;
			    return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px );';
			  },
			  set(v) {}
			}
		},
		onPageScroll: function onPageScroll(e) {
			let that = this;
			if(that.visitUnlockPopup){
				return false;
			}

			var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55

			if (trans >= 1 && that.navbarTrans >= 1) {
				return false
			}

			var frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff'
			var backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000'
			var iconTheme = that.iconTheme
			var iconRight = that.iconRight
			if (trans == 0) {
				frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff'
				backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000'
				iconTheme = that.$store.state.theme == 'black' ? 'black' : 'white'
				iconRight =
					that.$store.state.theme == 'black' ?
					'/static/image/slim_share.png' :
					'/static/image/slim_share_w.png'
			} else if (trans >= 0.4) {
				frontColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000'
				backgroundColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff'
				iconTheme = that.$store.state.theme == 'black' ? 'white' : 'black'
				iconRight =
					that.$store.state.theme == 'black' ?
					'/static/image/slim_share_w.png' :
					'/static/image/slim_share.png'
			}
			that.setData({
				navbarTrans: trans,
				iconTheme: iconTheme,
				iconRight: iconRight,
				color: that.$store.state.theme == 'black' ? '255,255,255' : '0,0,0',
			})
			uni.setNavigationBarColor({
				frontColor: frontColor,
				backgroundColor: backgroundColor,
				animation: {
					duration: 400,
					timingFunc: 'easeIn',
				},
			}) //发帖按钮
			//判断浏览器滚动条上下滚动

			if (e.scrollTop > that.scrollTop) {
				//向下滚动
				if (!that.showmenu) {
					that.setData({
						showmenu: true,
					})
				}
			} else {
				//向上滚动
				if (that.showmenu) {
					that.setData({
						showmenu: false,
					})
				}
			}

			that.scrollTop = e.scrollTop
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this
			that.globalOnloadProcess(options);
			
			// civ = can i visit
			// 0: 无限制 1：当前用户可访问 2：
			if(options.civ == 2){
				that.visitUnlockPopup = true;
			}

			// 处理小程序码的分享场景
			var scene = decodeURIComponent(options.scene)
			if (scene && scene != 'undefined') {
				let query = {}
				if (scene.indexOf('&') !== -1) {
					let scene_arr = scene.split('&')
					scene_arr.map((item) => {
						let queryData = item.split('=')
						query[queryData[0]] = queryData[1]
					})
				} else {
					let queryData = scene.split('=')
					query[queryData[0]] = queryData[1]
				}
				if (query.from_user && query.from_user.length > 0) {
					uni.setStorageSync('form_user', query.from_user)
					uni.$store.commit('updateFormUser', query.from_user)
				}
				that.setData({
					id: query.id,
					fph: true,
				})
			} else {
				that.setData({
					id: options.id,
				})
			}

			if (
				that.$store.state.userInfo.is_official != undefined &&
				that.$store.state.userInfo.is_official
			) {
				that.tabData.push({
					'id': 999,
					'text': '审核'
				});
			} else if (
				that.$store.state.userInfo.id != undefined &&
				that.circleInfo.user_id != undefined &&
				that.$store.state.userInfo.id == that.circleInfo.user_id
			) {
				that.tabData.push({
					'id': 999,
					'text': '审核'
				});
			}

			that.circleInfoFun(that.id)
			// that.getCircleUserList(that.id)
			that.postsByCircleId(that.id, that.curTabId, that.postsPage, false)
			
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this
			that.updateScene(6, that.id, false, false, 0, 2);
			if(that.visitUnlockPopup){
				that.circleInfoFun(that.id);
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			let that = this;
			if(that.visitUnlockPopup){
				uni.stopPullDownRefresh()
				return false;
			}
			that.pullDownRefresh();

			setTimeout(function() {
				uni.hideNavigationBarLoading()
				uni.stopPullDownRefresh()
			}, 500)
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			let that = this;
			if(that.visitUnlockPopup){
				return false;
			}
			let type = that.curTabId
			that.setData({
				loadmoreShow: true,
				isLastPage: false,
			})
			let page = 0

			if (type == 0) {
				page = that.comPostsPage + 1
			} else if (type == 1) {
				page = that.postsPage + 1
			} else if (type == 2) {
				page = that.newPostsPage + 1
			} else if (type == 3) {
				page = that.auditPostsPage + 1
			}

			that.postsByCircleId(that.id, type, page, false)
		},
		onBackPress(e) {
			if (this.showComments) {
				this.showComments = false

				// #ifdef APP || H5
				setTimeout(function() {
					uni.showTabBar()
				}, 250)
				// #endif

				return true
			} else if (this.rewardDialog) {
				this.rewardDialog = false
				// #ifdef APP || H5
				setTimeout(function() {
					uni.showTabBar()
				}, 250)
				// #endif
				return true
			} else if (this.fph) {
				uni.reLaunch({
					url: '/pages/tabbar/index/index',
				})
				return true
			}
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function(res) {
			let that = this
			if (res.from == 'button') {
				let share_title = that.$store.state.config.share.format.app_share_post
				let share_img = ''

				for (let index = 0; index < that.posts.length; index++) {
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
					path: '/pages/sticky/sticky?id=' +
						Math.abs(that.postsId) +
						'&fph=1&from_user=' +
						that.$store.state.userInfo.id +
						'&tenant=' +
						that.global__tenant__.tenant_id,
					imageUrl: share_img,
				}
			} else {
				let share_title = that.$store.state.config.share.format.app_share_circle
				share_title = share_title
					.replace('[circle_name]', that.circleInfo.circle_name)
					.replace('[circle_introduce]', that.circleInfo.circle_introduce)
				return {
					title: share_title,
					path: '/pages/circle/list?id=' +
						that.circleInfo.id +
						'&fph=1&from_user=' +
						that.$store.state.userInfo.id +
						'&tenant=' +
						that.global__tenant__.tenant_id,
					imageUrl: '',
				}
			}
		},
		onShareTimeline: function(res) {
			let that = this
			let share_title = that.$store.state.config.share.format.app_share_circle
			share_title = share_title
				.replace('[circle_name]', this.circleInfo.circle_name)
				.replace('[circle_introduce]', this.circleInfo.circle_introduce)
			return {
				title: share_title,
				query: 'id=' + that.circleInfo.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: uni.wen.util.removeStyles(that.circleInfo.head_portrait) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
			}
		},
		methods: {
			lockBack(){
				let that = this;
				if(uni.$store.state.pre_scene == 0){
					uni.wen.toUrl(-1, null, that);
				}else{
					if(uni.$store.state.pre_scene == 9){
						if(uni.$store.state.scene_history.length > 2){
							if([1,6,9].includes(uni.$store.state.scene_history[uni.$store.state.scene_history.length - 3])){
								uni.wen.toUrl(-1, null, that);
							}else{
								uni.navigateBack({
									delta: 2,
									fail: function () {
										uni.wen.toUrl(-1, null, that);
									}
								});
							}
						}else{
							uni.wen.toUrl(-1, null, that);
						}
					}else{
						uni.navigateBack({
							fail: function () {
								uni.wen.toUrl(-1, null, that);
							}
						});
					}
					
				}
			},
			followPayToast(){
				let that = this;
				
				let paywaylist = [0];
				if (that.$store.state.platform == 'ios' && that.$store.state.device == 'app') {
					if(that.$store.state.config.app.mode != 'examine'){
						paywaylist.push(1);
						paywaylist.push(2);
					}
					if(false){
					  // #ifdef APP
					  that._apple_init(apple_product_ids);
					  that.apple_payment( 'apple_pay_product_vip_' + the_option.price, apple_product_ids );
					  return false;
					  // #endif
					}
				} else {
					// #ifdef MP
					if(that.$store.state.config.app.mode != 'examine'){
						paywaylist.push(1);
						paywaylist.push(2);
					}
					// #endif
					// #ifndef MP
					paywaylist.push(1);
					paywaylist.push(2);
					// #endif
				}
				if (that.$store.state.config.app.coins && that.$store.state.config.app.coins.pay == true) {
				  paywaylist.push(3)
				}
				
				that.myToast({
				  type: 'payway',
				  content: '加入圈子(' + that.circleInfo.circle_name + '/' + that.circleInfo.follow_pay_duration + '天)',
				  price: that.circleInfo.follow_pay_num,
				  timeout: 2000,
				  isClick: true,
				  paywaylist: paywaylist,
				  order: {
				    type: 7,
				    circle_id: that.circleInfo.id,
				  }
				});
			},
			circleInfoFun(id) {
			    let that = this;
			    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'circle/info', {
			        circle_id: id
			    }).then(function (res) {
			        let args = {};
			        args.circleInfo = res.data;
					let selidx = ['', '', ''];
					if(args.circleInfo.is_follow_authentication == 1){
						selidx[0] = '认证用户';
					}
					if(args.circleInfo.is_follow_vip == 1){
						selidx[1] = '会员';
					}
					if(args.circleInfo.is_follow_admin == 1){
						selidx[2] = '管理员';
					}
					if(args.circleInfo.is_follow_pay == 1){
						selidx[3] = '付费';
						args.followPay = args.circleInfo.follow_pay_num;
						args.followPayType = args.circleInfo.follow_pay_credit == 1;
						args.followPayDuration = args.circleInfo.follow_pay_duration;
					}
					args.selidx = selidx;
					
					let selidx2 = ['', '', '', ''];
					if(args.circleInfo.is_publish_follow == 1){
						selidx2[0] = '已关注用户';
					}
					if(args.circleInfo.is_publish_authentication == 1){
						selidx2[1] = '认证用户';
					}
					if(args.circleInfo.is_publish_vip == 1){
						selidx2[2] = '会员';
					}
					if(args.circleInfo.is_publish_admin == 1){
						selidx2[3] = '管理员';
					}
					if(args.circleInfo.is_publish_pay == 1){
						selidx2[4] = '付费按次发布';
						args.publishPay = args.circleInfo.publish_pay_num;
						args.publishPayType = args.circleInfo.publish_pay_credit == 1;
					}
					args.selidx2 = selidx2;
					
					args.circle_user_division = args.circleInfo.circle_user_division;
					args.circle_user_paycontent_division = args.circleInfo.circle_user_paycontent_division;
					
					args.visitUnlockPopup = args.circleInfo.can_i_visit == 2;
					
			        that.setData(args);
					
					// #ifdef H5
					if(uni.$store.state.h5_browser == 'wxclient'){
						setTimeout(function(){
							
							let share_title = that.$store.state.config.share.format.app_share_circle
							share_title = share_title.replace('[circle_name]', that.circleInfo.circle_name).replace('[circle_introduce]', that.circleInfo.circle_introduce)

							uni.wen.util.setH5WeixinShare(that.circleInfo.head_portrait, share_title, that.circle_user ? that.circle_user.user_name : '');
						}, 500);
					}
					// #endif
					
					
				});
			},
			pullDownRefresh(){
				let that = this;
				that.setData({
					posts: [],
					postWaterData: {
						e: 1,
						data: [],
					},
					postsList: [],
					newPostsList: [],
					comPostsList: [],
					auditPostsList: [],
					postsPage: 1,
					newPostsPage: 1,
					comPostsPage: 1,
					auditPostsPage: 1,
					postsId: 0,
					commentFormShow: 0,
					topicload: true,
					loadmoreShow: false,
					isLastPage: false,
				})
				that.circleInfoFun(that.id)
				// that.getCircleUserList(that.id)
				that.postsByCircleId(that.id, that.curTabId, 1, false)
			},
			sortChange() {
				let that = this;
				that.pullDownRefresh();
			},
			changeHandle(val) {
				let that = this;
				if(that.selected_tag == val){
					that.selected_tag = 0;
				}else{
					that.selected_tag = val;
				}
				that.pullDownRefresh();
			},
			openRightSide() {
				let that = this
				if (that.rightbarShow) {
					// 关闭
					that.rightbarShow = false
				} else {
					uni.wen.util.doVibrateShort();
					that.rightbarShow = true
				}
			},
			input_circle_price(e, type) {
				let that = this
				if (type == 0) {
					that.setData({
						followPay: e.detail.value,
					})
				} else {
					that.setData({
						publishPay: e.detail.value,
					})
				}
			},
			input_circle_duration(e) {
				let that = this
				that.setData({
					followPayDuration: e.detail.value,
				})
			},
			input_circle_user_devision_price(e, type) {
				let that = this
				if (type == 0) {
					that.setData({
						circle_user_paycontent_division: e.detail.value,
					})
				} else {
					that.setData({
						circle_user_division: e.detail.value,
					})
				}
			},
			switch_circle_price_type(e, type) {
				let that = this
				if (type == 0) {
					that.setData({
						followPayType: e.checked ? true : false,
					})
				} else {
					that.setData({
						publishPayType: e.checked ? true : false,
					})
				}
			},
			downTap() {
				let that = this
				that.setData({
					downWidth: 690,
					down: 999,
					isIntroduce: false,
				})
			},
			circleSettingSure() {
				let that = this

				uni.loading(true)

				uni.wen.util
					.request(
						uni.wen.api.ApiRootUrl + 'admin/circle/setting', {
							circle_id: that.circleInfo.id,
							selidx: that.selidx,
							selidx2: that.selidx2,
							followPay: that.followPay,
							followPayType: that.followPayType,
							followPayDuration: that.followPayDuration,
							publishPay: that.publishPay,
							publishPayType: that.publishPayType,
							circle_user_paycontent_division: that.circle_user_paycontent_division,
							circle_user_division: that.circle_user_division,
						},
						'POST'
					)
					.then(function(res) {
						uni.loading(false)
						if (res.status) {
							that.showSettingPopup()

							uni.showToast({
								title: '保存成功',
								icon: 'none',
							})

							that.setData({
								circleInfo: {
									circle_posts_count: 0,
									circle_follow_count: 0,
									circle_name: '',
									circle_introduce: '',
									circle_user_id: 0,
								},
								selidx: ['', '', ''],
								selidx2: ['', '', '', ''],
								followPay: 0,
								followPayType: false,
								followPayDuration: 0,
								publishPay: 0,
								publishPayType: false,
								circle_user_paycontent_division: 0,
								circle_user_division: 0,
							})
							that.circleInfoFun(that.id)
						} else {
							that.showSettingPopup()
							uni.showToast({
								title: res.message,
								icon: 'none',
							})
						}
					})
			},
			// 选择圈子权限
			doSelPermission(item, idx, type) {
				let that = this
				console.log('doSelPermission')
				let the_selidx = null
				if (type == 1) {
					the_selidx = this.selidx
				} else {
					the_selidx = this.selidx2
				}
				if (the_selidx) {
					if (the_selidx.length > 0) {
						let ishave = false
						for (let i = 0; i < the_selidx.length; i++) {
							if (the_selidx[i] == item) {
								the_selidx.splice(i, 1, '')
								ishave = true
								break
							}
						}
						if (ishave == false) {
							the_selidx.splice(idx, 1, item)
						}
					} else {
						the_selidx.splice(idx, 0, item)
					}

					if (type == 1) {
						that.setData({
							selidx: the_selidx,
						})
					} else {
						that.setData({
							selidx2: the_selidx,
						})
					}
				}
			},
			showSettingPopup() {
				let that = this
				that.isShowSettingPopup = !that.isShowSettingPopup
			},
			//点击发帖按钮
			plusClickAction: function plusClickAction(e) {
				if (this.showmenu) {
					this.setData({
						showmenu: false,
					})
				}
			},

			//切换
			onHandleClick: function(tab_id) {
				let that = this;
				if(that.selected_tag > 0){
					that.setData({
						curTabId: tab_id,
						selected_tag: 0
					});
					that.pullDownRefresh();
					return false;
				}
				that.setData({
					curTabId: tab_id,
					isNul: false,
					topicload: true,
					loadmoreShow: false,
					isLastPage: false,
				})
				let args = {}

				if (tab_id == 0) {
					if (that.comPostsList.length <= 0) {
						args.posts = []
						that.postsByCircleId(that.id, tab_id, that.comPostsPage, true)
					} else {
						if (
							that.circleInfo.list_style == 2 ||
							(that.circleInfo.list_style == 0 &&
								that.$store.state.config.page.circle &&
								that.$store.state.config.page.circle.style == 1)
						) {
							that.setData({
								posts: that.comPostsList,
								postWaterData: {
									e: 1,
									data: that.comPostsList,
								},
							})
						} else {
							that.setData({
								posts: that.comPostsList,
							})
						}
					}
				} else if (tab_id == 1) {
					if (that.postsList.length <= 0) {
						args.posts = []
						that.postsByCircleId(that.id, tab_id, that.postsPage, true)
					} else {
						if (
							that.circleInfo.list_style == 2 ||
							(that.circleInfo.list_style == 0 &&
								that.$store.state.config.page.circle &&
								that.$store.state.config.page.circle.style == 1)
						) {
							that.setData({
								posts: that.postsList,
								postWaterData: {
									e: 1,
									data: that.postsList,
								},
							})
						} else {
							that.setData({
								posts: that.postsList,
							})
						}
					}
				} else if (tab_id == 2) {
					if (that.newPostsList.length <= 0) {
						args.posts = []
						that.postsByCircleId(that.id, tab_id, that.newPostsPage, true)
					} else {
						if (
							that.circleInfo.list_style == 2 ||
							(that.circleInfo.list_style == 0 &&
								that.$store.state.config.page.circle &&
								that.$store.state.config.page.circle.style == 1)
						) {
							that.setData({
								posts: that.newPostsList,
								postWaterData: {
									e: 1,
									data: that.newPostsList,
								},
							})
						} else {
							that.setData({
								posts: that.newPostsList,
							})
						}
					}
				} else if (tab_id == 999) {
					if (that.auditPostsList.length <= 0) {
						args.posts = []
						that.postsByCircleId(that.id, tab_id, that.auditPostsPage, true)
					} else {
						if (
							that.circleInfo.list_style == 2 ||
							(that.circleInfo.list_style == 0 &&
								that.$store.state.config.page.circle &&
								that.$store.state.config.page.circle.style == 1)
						) {
							that.setData({
								posts: that.auditPostsList,
								postWaterData: {
									e: 1,
									data: that.auditPostsList,
								},
							})
						} else {
							that.setData({
								posts: that.auditPostsList,
							})
						}
					}
				}

				args.topicload = false
				that.setData(args)
			},

			//前往发帖
			gotoPost: function(type) {
				let that = this
				uni.setStorageSync('userSelectedCircle', {
					id: that.circleInfo.id,
					circle_name: that.circleInfo.circle_name,
					is_publish_follow: that.circleInfo.is_publish_follow,
					is_publish_vip: that.circleInfo.is_publish_vip,
					is_publish_authentication: that.circleInfo.is_publish_authentication,
					is_publish_admin: that.circleInfo.is_publish_admin,
					is_publish_pay: that.circleInfo.is_publish_pay,
					publish_pay_num: that.circleInfo.publish_pay_num,
					publish_pay_credit: that.circleInfo.publish_pay_credit,
				})

				uni.wen.toUrl(6, '/pages/creat/index/creat?type=' + type, null)
			},

			//刷新方法
			refreshEvent() {
				// this.onPullDownRefresh();
				uni.startPullDownRefresh()
			},

			toShareCircle() {
				uni.wen.toUrl(6, '/pagesB/playbill/circleShare?id=' + this.id, null)
			},
		},
	}
</script>
<style lang="scss">
	@import './list.scss';
</style>