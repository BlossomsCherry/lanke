<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view style="min-height: 100vh;" class="mini-page-body">
		<!-- #ifdef H5 -->
		<view class="top-open-app-wrapper" @tap.stop.prevent="openApp">
		  <view class="inner">
				<image class="logo" :src="config_about.logo"/>
				<view class="text-wrapper">
				  <view class="app-name">{{ config_about.name }}App</view>
				  <view>{{ config_about.slogan }}</view>
				</view>
				<view class="btn-wrapper">
				  <view>打开看看</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
        <ls-skeleton :loading="topicload" :skeleton="rowPostSkeleton" :animate="true" :needHeader="true">
            <block name="circle">
                <view class="post-detail-wrap" v-for="(item, index) in posts" :key="index">

					<!-- #ifdef APP -->
					<navBar v-if="isShowImageSwiper" :back="true" :home="fph" :scene="9" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
							<view class="img-title-center imgSwiper" slot="center">
								<view class="user-info">
									<view :class="'user-avatar-view scene_90002 no-detail ' + global__platform__">
											<view class="avatar-wrap" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
												<image class="user-avatar-image" compression="avatar" mode="aspectFill"
													:src="item.user.user_avatar"></image>
												<image class="user-avatar-frame" v-if="item.user.avatar_frame_url" :src="item.user.avatar_frame_url" mode="aspectFill"></image>
												<i class="avatar-authentication-icon mini-icon mini-verify" v-if="item.user.is_authentication == 1"></i>
											</view>
											
											<view class="user-view">
												<view class="user-name" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
													<text :class="'user-nick-text ' + ( item.user.honor ? 'has-honor' : '')">{{ item.user.user_name }}</text>
													<i class="header-label gender-m-icon mini-icon mini-xingbienan" v-if="item.user.gender == 1"></i>
													<i class="header-label gender-w-icon mini-icon mini-xingbienv" v-if="item.user.gender == 2"></i>
													<i class="header-label official-icon mini-icon mini-renzhengguanli1" v-if="item.user.is_official == 1"></i>
													<i class="header-label vip-icon mini-icon mini-vip" v-if="item.user.is_member == 1"></i>
													<i :class="'header-label lv-icon mini-icon mini-lv' + item.user.lv"></i>
													<i class="header-label honor-icon" v-if="item.user.honor">
														<image class="honor-image" :src="item.user.honor" mode="widthFix"></image>
													</i>
												</view>
											</view>
									</view>
								</view>
								<block v-if="!item.is_my_posts">
									<view class="flex-column" style="justify-content: center;">
										<view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id" :data-index="index" class="follow-view color-primary" v-if="!item.is_follow_user">
											关注
										</view>
										<view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id"
											:data-index="index" class="follow-view folled" v-else-if="item.is_follow_user">
											已关注
										</view>
									</view>
								</block>
							</view>
							<view class="user-rigth" slot="right">

							</view>
					</navBar>
					<!-- #endif -->
					<!-- #ifdef MP -->
					<navBar v-if="isShowImageSwiper" :back="true" :home="fph"  iconTheme="black" :scene="9" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
						<view slot="center" class="img-title-center not">
							<block v-if="scrollTop < 55 ">
								<text class="_text">笔记详情</text>
							</block>
							<block v-else>
								<view class="user-info">
									<view :class="'user-avatar-view scene_90002 no-detail ' + global__platform__">
											<view class="avatar-wrap" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
												<image class="user-avatar-image" compression="avatar" mode="aspectFill"
													:src="item.user.user_avatar"></image>
												<image class="user-avatar-frame" v-if="item.user.avatar_frame_url" :src="item.user.avatar_frame_url" mode="aspectFill"></image>
												<i class="avatar-authentication-icon mini-icon mini-verify" v-if="item.user.is_authentication == 1"></i>
											</view>
											
											<view class="user-view">
												<view class="user-name" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
													<text :class="'user-nick-text ' + ( item.user.honor ? 'has-honor' : '')">{{ item.user.user_name }}</text>
													<i class="header-label gender-m-icon mini-icon mini-xingbienan" v-if="item.user.gender == 1"></i>
													<i class="header-label gender-w-icon mini-icon mini-xingbienv" v-if="item.user.gender == 2"></i>
													<i class="header-label official-icon mini-icon mini-renzhengguanli1" v-if="item.user.is_official == 1"></i>
													<i class="header-label vip-icon mini-icon mini-vip" v-if="item.user.is_member == 1"></i>
													<i :class="'header-label lv-icon mini-icon mini-lv' + item.user.lv"></i>
													<i class="header-label honor-icon" v-if="item.user.honor">
														<image class="honor-image" :src="item.user.honor" mode="widthFix"></image>
													</i>
												</view>
											</view>
									</view>
								</view>
								<block v-if="!item.is_my_posts">
									<view class="flex-column" style="justify-content: center;">
										<view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id" :data-index="index" class="follow-view color-primary" v-if="!item.is_follow_user">
											关注
										</view>
										<view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id"
											:data-index="index" class="follow-view folled" v-else-if="item.is_follow_user">
											已关注
										</view>
									</view>
								</block>
							</block>
						</view>
					</navBar>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<navBar v-if="isShowImageSwiper" title="笔记详情" :back="true" :home="fph" iconTheme="black" :scene="9" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
					</navBar>
					<!-- #endif -->
					<navBar v-if="!isShowImageSwiper" :back="true" :home="fph" iconTheme="black" :scene="9" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
						<view slot="center" class="img-title-center not">
							<block v-if="scrollTop < 55 ">
								<text class="_text">笔记详情</text>
							</block>
							<block v-else>
								<view class="user-info">
									<view :class="'user-avatar-view scene_90002 no-detail ' + global__platform__">
											<view class="avatar-wrap" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
												<image class="user-avatar-image" compression="avatar" mode="aspectFill"
													:src="item.user.user_avatar"></image>
												<image class="user-avatar-frame" v-if="item.user.avatar_frame_url" :src="item.user.avatar_frame_url" mode="aspectFill"></image>
												<i class="avatar-authentication-icon mini-icon mini-verify" v-if="item.user.is_authentication == 1"></i>
											</view>
											
											<view class="user-view">
												<view class="user-name" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
													<text :class="'user-nick-text ' + ( item.user.honor ? 'has-honor' : '')">{{ item.user.user_name }}</text>
													<i class="header-label gender-m-icon mini-icon mini-xingbienan" v-if="item.user.gender == 1"></i>
													<i class="header-label gender-w-icon mini-icon mini-xingbienv" v-if="item.user.gender == 2"></i>
													<i class="header-label official-icon mini-icon mini-renzhengguanli1" v-if="item.user.is_official == 1"></i>
													<i class="header-label vip-icon mini-icon mini-vip" v-if="item.user.is_member == 1"></i>
													<i :class="'header-label lv-icon mini-icon mini-lv' + item.user.lv"></i>
													<i class="header-label honor-icon" v-if="item.user.honor">
														<image class="honor-image" :src="item.user.honor" mode="widthFix"></image>
													</i>
												</view>
											</view>
									</view>
								</view>
								<block v-if="!item.is_my_posts">
									<view class="flex-column" style="justify-content: center;">

										<block v-if="item.fields && item.fields.contact_phone">
											<view @tap.stop.prevent="toSliderUrl(22, item.fields.contact_phone)" class="follow-view">
												<i class="mini-icon mini-dianhua inline"></i>
												拨打
											</view>
										</block>
										<block v-else>
											<block v-if="!item.is_my_posts">
												<view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id" :data-index="index" class="follow-view color-primary" v-if="!item.is_follow_user">
													关注
												</view>
												<view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id"
													:data-index="index" class="follow-view folled" v-else-if="item.is_follow_user">
													已关注
												</view>
											</block>
										</block>

									</view>
								</block>
							</block>
						</view>
						<!-- #ifdef APP || H5 -->
						<view class="user-rigth" slot="right"  v-if="scrollTop >= 55 ">
							
						</view>
						<!-- #endif -->
					</navBar>
					<view :class="'post-detail-content ' + (!isShowImageSwiper ? 'not-show-image-swiper' : '')">
						<!-- #ifdef MP -->
						<block v-if="isShowImageSwiper">
							<view class="user-info-view">
								<view class="inner">
									<view class="user-info">
										<view :class="'user-avatar-view scene_9 no-detail ' + global__platform__">
												<view class="avatar-wrap" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
													<image class="user-avatar-image" compression="avatar" mode="aspectFill"
														:src="item.user.user_avatar"></image>
													<image class="user-avatar-frame" v-if="item.user.avatar_frame_url" :src="item.user.avatar_frame_url" mode="aspectFill"></image>
													<i class="avatar-authentication-icon mini-icon mini-verify" v-if="item.user.is_authentication == 1"></i>
												</view>
												
												<view class="user-view">
													<view class="user-name" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
														<text :class="'user-nick-text ' + ( item.user.honor ? 'has-honor' : '')">{{ item.user.user_name }}</text>
														<i class="header-label gender-m-icon mini-icon mini-xingbienan" v-if="item.user.gender == 1"></i>
														<i class="header-label gender-w-icon mini-icon mini-xingbienv" v-if="item.user.gender == 2"></i>
														<i class="header-label official-icon mini-icon mini-renzhengguanli1" v-if="item.user.is_official == 1"></i>
														<i class="header-label vip-icon mini-icon mini-vip" v-if="item.user.is_member == 1"></i>
														<i :class="'header-label lv-icon mini-icon mini-lv' + item.user.lv"></i>
														<i class="header-label honor-icon" v-if="item.user.honor">
															<image class="honor-image" :src="item.user.honor" mode="widthFix"></image>
														</i>
													</view>
													
													<block>
														<view class="time_and_address_wrap">
															<view class="format-time-view">{{ item.format_time }}</view>
															<block v-if="item.ip_address">
																<view class="post-info-view ip_address">{{ item.ip_address }}</view>
															</block>
															<block v-if="item.distance">
																<view class="post-info-view distance">{{ item.distance }}</view>
															</block>
															<block v-if=" ( item.post_top && item.post_top > 0 ) ">
																<view class="post-info-view post_top" @tap.stop.prevent="toRealtimePost"><i class="mini-icon mini-jiangbei"></i>热帖榜第{{ item.post_top }}名</view>
															</block>
														</view>
													</block>
													
												</view>
										</view>
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
								</view>
							</view>
						</block>

						<!-- #endif -->
						<contextualPopup subject="posts" :popList="item.longtaps" :para="{ index: index, style: 'list' }">
						<view class="swiper-container" v-if="index === 0 && isShowImageSwiper" :style="'height: ' + (item.swiperImgHeight + 20)  + 'rpx;'" slot="content">
							<swiper :autoplay="false" :circular="true" interval="3000" :indicator-dots="( item.images && item.images.length > 1 )" easing-function="easeOutCubic" class="switem" @change="ImgSwiperChange">
								<block v-if="imgItem.width > 0">
									<swiper-item>
										<view class="swiper-content" :style="'max-height: '+ item.swiperImgHeight +'rpx;height: ' + item.swiperImgHeight + 'rpx;max-width:750rpx;'">
											<block v-if="imgItem.width > 0">
												<image :class="'_image ' + (imgItem.is_pay == 1 ? ' img_lock' : '')" :style="'width: '+ imgItem.width +'rpx;height: '+imgItem.height + 'rpx;' " :src="imgItem.img_url" mode="widthFix" @tap.stop.prevent="previewImgFunc(0)"/>
											</block>
											<block v-else>
												<image :class="'_image' + (imgItem.is_pay == 1 ? ' img_lock' : '')" :style="'width: 750rpx;' " :src="imgItem.img_url" mode="widthFix" @tap.stop.prevent="previewImgFunc(0)"/>
											</block>
										</view>
									</swiper-item>
								</block>
								<block v-for="(images_item, images_index) in item.images" :key="images_item.id">
									<swiper-item v-if="images_item.width > 0  && ( imgItem.width == 0 || images_index > 0)">
										<view class="swiper-content" :style="'max-height: '+ item.swiperImgHeight +'rpx;height: ' + item.swiperImgHeight + 'rpx;max-width:750rpx;'">
											<block v-if="images_item.width > 0">
												<image :class="'_image' + (imgItem.is_pay == 1 ? ' img_lock' : '')" :style="'width: '+ images_item.width +'rpx;height: '+images_item.height + 'rpx;' " :src="images_item.img_url" mode="widthFix" @tap.stop.prevent="previewImgFunc(images_index)"/>
											</block>
											<block v-else>
												<image :class="'_image' + (imgItem.is_pay == 1 ? ' img_lock' : '')" :style="'width: 750rpx;' " :src="images_item.img_url" mode="widthFix" @tap.stop.prevent="previewImgFunc(images_index)" />
											</block>
										</view>
									</swiper-item>
								</block>
							</swiper>
							<view class="img_tips_count" v-if="( item.images && item.images.length > 1 )">{{ current_img_index }} / {{ item.img_count }}</view>
						</view>
						</contextualPopup>
						
						<!-- #ifdef H5 -->
						<block v-if="isShowImageSwiper">
							<view class="user-info-view">
								<view class="inner">
									
									<view class="user-info">
										<view :class="'user-avatar-view scene_9 no-detail ' + global__platform__">
												<view class="avatar-wrap" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
													<image class="user-avatar-image" compression="avatar" mode="aspectFill"
														:src="item.user.user_avatar"></image>
													<image class="user-avatar-frame" v-if="item.user.avatar_frame_url" :src="item.user.avatar_frame_url" mode="aspectFill"></image>
													<i class="avatar-authentication-icon mini-icon mini-verify" v-if="item.user.is_authentication == 1"></i>
												</view>
												
												<view class="user-view">
													<view class="user-name" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
														<text :class="'user-nick-text ' + ( item.user.honor ? 'has-honor' : '')">{{ item.user.user_name }}</text>
														<i class="header-label gender-m-icon mini-icon mini-xingbienan" v-if="item.user.gender == 1"></i>
														<i class="header-label gender-w-icon mini-icon mini-xingbienv" v-if="item.user.gender == 2"></i>
														<i class="header-label official-icon mini-icon mini-renzhengguanli1" v-if="item.user.is_official == 1"></i>
														<i class="header-label vip-icon mini-icon mini-vip" v-if="item.user.is_member == 1"></i>
														<i :class="'header-label lv-icon mini-icon mini-lv' + item.user.lv"></i>
														<i class="header-label honor-icon" v-if="item.user.honor">
															<image class="honor-image" :src="item.user.honor" mode="widthFix"></image>
														</i>
													</view>
													
													<block>
														<view class="time_and_address_wrap">
															<view class="format-time-view">{{ item.format_time }}</view>
															<block v-if="item.ip_address">
																<view class="post-info-view ip_address">{{ item.ip_address }}</view>
															</block>
															<block v-if="item.distance">
																<view class="post-info-view distance">{{ item.distance }}</view>
															</block>
															<block v-if=" ( item.post_top && item.post_top > 0 ) ">
																<view class="post-info-view post_top" @tap.stop.prevent="toRealtimePost"><i class="mini-icon mini-jiangbei"></i>热帖榜第{{ item.post_top }}名</view>
															</block>
														</view>
													</block>
													
												</view>
										</view>
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
									
								</view>
							</view>
						</block>
						
						<!-- #endif -->

						<view :class="'post-wrap post-wrap-' + index">
							<block v-if="index === 0">
								<contextualPopup subject="posts" :popList="item.longtaps" :para="{ index: index, style: 'list' }">
								<view class="topic-detail-view" slot="content">
									<view class="topic-panel" :id="'media_' + item.id">
										<block v-if="!isShowImageSwiper">
											<view class="user-info-view">
												<view class="inner">
													
													<view class="user-info">
														<view :class="'user-avatar-view scene_9 no-detail ' + global__platform__">
																<view class="avatar-wrap" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
																	<image class="user-avatar-image" compression="avatar" mode="aspectFill"
																		:src="item.user.user_avatar"></image>
																	<image class="user-avatar-frame" v-if="item.user.avatar_frame_url" :src="item.user.avatar_frame_url" mode="aspectFill"></image>
																	<i class="avatar-authentication-icon mini-icon mini-verify" v-if="item.user.is_authentication == 1"></i>
																</view>
																
																<view class="user-view">
																	<view class="user-name" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
																		<text :class="'user-nick-text ' + ( item.user.honor ? 'has-honor' : '')">{{ item.user.user_name }}</text>
																		<i class="header-label gender-m-icon mini-icon mini-xingbienan" v-if="item.user.gender == 1"></i>
																		<i class="header-label gender-w-icon mini-icon mini-xingbienv" v-if="item.user.gender == 2"></i>
																		<i class="header-label official-icon mini-icon mini-renzhengguanli1" v-if="item.user.is_official == 1"></i>
																		<i class="header-label vip-icon mini-icon mini-vip" v-if="item.user.is_member == 1"></i>
																		<i :class="'header-label lv-icon mini-icon mini-lv' + item.user.lv"></i>
																		<i class="header-label honor-icon" v-if="item.user.honor">
																			<image class="honor-image" :src="item.user.honor" mode="widthFix"></image>
																		</i>
																	</view>
																	
																	<block>
																		<view class="time_and_address_wrap">
																			<view class="format-time-view">{{ item.format_time }}</view>
																			<block v-if="item.ip_address">
																				<view class="post-info-view ip_address">{{ item.ip_address }}</view>
																			</block>
																			<block v-if="item.distance">
																				<view class="post-info-view distance">{{ item.distance }}</view>
																			</block>
																			<block v-if=" ( item.post_top && item.post_top > 0 ) ">
																				<view class="post-info-view post_top" @tap.stop.prevent="toRealtimePost"><i class="mini-icon mini-jiangbei"></i>热帖榜第{{ item.post_top }}名</view>
																			</block>
																		</view>
																	</block>
																	
																</view>
														</view>
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
													
													
												</view>
											</view>
										</block>
										<post-content :words="item" :postIndex="index" :scene="9" @unfoldTap="unfoldTap" @showPayContent="showPayContent" @soundPlayCall="soundsPlayCall" @forceUpdate="forceUpdate" :showDetailSwpier="isShowImageSwiper" @pSelectVote="selectVote"></post-content>
										<view class="reward-box sticky-reward-box" v-if="item.exceptional && item.exceptional.length > 0" :data-id="item.id" @tap.stop.prevent="onClickReward" :data-ecount="item.exceptional_count">
											<view class="inner">
												<view class="cu-avatar-group">
													<view v-if="item.exceptional_count > 6" class="cu-avatar round dian">•••</view>
													<view class="cu-avatar round"
														:style="'background-image:url(' + exceptional.user_avatar + ');'"
														v-for="(exceptional, index1) in item.exceptional"
														:key="exceptional.rid"></view>
												</view>
												<view class="cu-avatar-text">{{ item.exceptional_count }}次充电</view>
											</view>
										</view>
									</view>
									<view class="statement" v-if="config2_page_sticky_statement">{{ config2_page_sticky_statement }}</view>
								</view>
								</contextualPopup>

								<block v-if="item.circle && item.circle.circle_name">
									<view class="sticky_circleinfo" @tap.stop.prevent="toSliderUrl(2, item.circle_id)">
										<view class="left">
											<view class="lleft">
												<image :src="item.circle.head_portrait" class="circle_shape"></image>
											</view>
											<view class="lright">
												<view class="circle-name">
													{{ item.circle.circle_name }}
												</view>
												<view class="circle-count">
													关注 {{ item.circle.circle_follow_count }} 内容 {{ item.circle.circle_posts_count }}
												</view>
											</view>
										</view>
										<view class="right">
											<i class="mini-icon mini-youjiantou"></i>
										</view>
									</view>
								</block>

								<view class="page-block-gap"></view>
								<!-- #ifdef MP -->
								<view class="sticky-ad-wrap" v-if="item.ad">
									<block v-if="item.ad.type && item.ad.type == '1' ">
										<i class="mini-icon mini-adtip"></i>
										<image class="_image" :src="item.ad.img" @tap.stop.prevent="toSliderUrl(item.ad.target_type, item.ad.target_id)" mode="widthFix"></image>
									</block>
									<block v-else>
										<view class="ad-content"><ad-custom :unit-id="item.ad.unit" ></ad-custom></view>
									</block>
									<view class="page-block-gap"></view>
								</view>
								<!-- #endif -->
								<!-- #ifndef MP -->
								<view class="sticky-ad-wrap" v-if="item.ad">
									<block v-if="item.ad.type && item.ad.type == '1' ">
										<i class="mini-icon mini-adtip"></i>
										<image class="_image" :src="item.ad.img" @tap.stop.prevent="toSliderUrl(item.ad.target_type, item.ad.target_id)" mode="widthFix"></image>
									</block>
									<block v-else>
										<view class="ad-content"><ad :adpid="item.ad.unit"></ad></view>
									</block>
									<view class="page-block-gap"></view>
								</view>
								<!-- #endif -->
								<!-- 评论开始 -->
								<view class="comments_container">
								    <view class="comments_container_title">
								        评论 {{ filters.toFix(item.comment_count) }}
								    </view>
									<comment-scroll :unicom-id=" 'commentScroll_9_' + id " ref="commentScroll" :postsId="postsId" :scene="9" @tapComment="tapComment" @commentRefreshStatus="commentRefreshStatus" :refresh="commentScrollRefresh"></comment-scroll>
									<comment-form :unicom-id=" 'commentForm_9_' + id " ref="commentForm" :postsId="postsId" :commentFormShow="commentFormShow" @maskClick="commentFormMaskClick" @sendComment="onInputComment" @tapComment="tapComment" :placeholder="replyName || '此时此刻想说~' " :scene="9">
										<view class="sticky-add-comments" slot="action-slot">
											<view class="line1">
												<block>
													<i v-if="item.is_collect" class="mini-icon mini-shoucang-shixin1" @tap.stop.prevent="sticky_collect(item.id)"></i>
													<i v-else  class="mini-icon mini-shoucang-kongxin1" @tap.stop.prevent="sticky_collect(item.id)"></i>
												</block>
												<block>
													<i v-if="item.is_like" class="mini-icon mini-xihuan-shixin" @tap.stop.prevent="taplikes({'post_id': item.id, 'index': index })"></i>
													<i v-else  class="mini-icon mini-xihuan-kongxin" @tap.stop.prevent="taplikes({'post_id': item.id, 'index': index })"></i>
												</block>
												<block>
													<block v-if="config_audit_is_reward && item.is_reward">
														<i class="mini-icon mini-chongdian" @tap.stop.prevent="tapReward({'post_id': item.id, 'index': index, 'userid': item.user.id })"></i>
													</block>
													<block v-else>
														<i class="mini-icon mini-a-pinglun2" @tap.stop.prevent="scrollToComments"></i>
													</block>
												</block>
												<block>
													<i class="mini-icon mini-fenxiang2" @tap.stop.prevent="tapShare({'post_id': item.id, 'index': index })"></i>
												</block>
											</view>
											<view class="line2">
												<block>
													<text class="number" v-if="item.collected_count > 0 " @tap.stop.prevent="sticky_collect(item.id)">{{ filters.toFix(item.collected_count) }}</text>
													<text class="number" v-else @tap.stop.prevent="sticky_collect(item.id)">收藏</text>
												</block>
												<block>
													<text class="number" v-if="item.like_count" @tap.stop.prevent="taplikes({'post_id': item.id, 'index': index })">{{ filters.toFix(item.like_count) }}</text>
													<text class="number" v-else @tap.stop.prevent="taplikes({'post_id': item.id, 'index': index })">喜欢</text>
												</block>
												<block>
													<block v-if="config_audit_is_reward && item.is_reward">
														<text class="number" v-if="item.exceptional_count > 0 " @tap.stop.prevent="tapReward({'post_id': item.id, 'index': index, 'userid': item.user.id })">{{ filters.toFix(item.exceptional_count) }}</text>
														<text class="number" v-else @tap.stop.prevent="tapReward({'post_id': item.id, 'index': index, 'userid': item.user.id })">充电</text>
													</block>
													<block v-else >
														<text class="number" v-if="item.comment_count > 0 " @tap.stop.prevent="scrollToComments">{{ filters.toFix(item.comment_count) }}</text>
														<text class="number" v-else @tap.stop.prevent="scrollToComments">评论</text>
													</block>
												</block>
												<block>
													<text class="number" @tap.stop.prevent="tapShare({'post_id': item.id, 'index': index })">分享</text>
												</block>
											</view>
										</view>
									</comment-form>
									<view class="tap_refrsh_comment" v-if=" stickyCommentRefreshStatus == 1" @tap.stop.prevent="sticky_refresh_comments">点击加载更多评论 ></view>
								</view>
								<!-- 评论结束 -->

							</block>
							<block v-else>

							</block>
						</view>
					 </view>

                </view>
				<view v-if="resCode > 0">
					<navBar :back="true" :home="fph" title="笔记详情" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
						<!-- #ifdef APP || H5 -->
						<view slot="right" class="lxy-nav-bar__logo">
						</view>
						<!-- #endif -->
					</navBar>
					<view class="post-delay-wrap">
						<view class="inner">
							{{ resMessage }}
						</view>
					</view>
				</view>
            </block>
        </ls-skeleton>

		<block v-if="is_refresh_relevant_post_now && (relevant_load_times == 0 || relevant_posts.length > 0) ">
			<view class="page-block-gap"></view>
			<view class="relevant_wrap">
				<view class="title">
					<i class="mini-icon mini-remen1" style="color: #f02d63;"></i>相关内容
				</view>
				<view class="body">
					<ls-skeleton :loading="relevant_topicload" :skeleton="waterfallSkeleton" :scene="90734">
						<block v-if="relevant_posts.length > 0">
							<l-water-flow comName="product" :waterData="postWaterData" ref="productwater" :column-gap="8"/>
						</block>
						<block v-else>
							<u-empty text="无相关内容" width="300" height="300" text-size="28" />
						</block>
					</ls-skeleton>
					<u-loadmore v-if="relevant_loadmoreShow" :status="relevant_isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──"
						size="28" color="#989898" />
				</view>
			</view>
		</block>

		<view style="height: 150rpx;"></view>


		<u-popup :show="rewardPopup" @close="shutReward" >
		    <view class="reward-add-box">
		        <image class="reward-add-box-image" :src="config_img.reward_select" mode="aspectFill" />
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
		            <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 2 ? 'bd _view' : '_view'" data-price="2">¥2</view>
		            <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 6 ? 'bd _view' : '_view'" data-price="6">¥6</view>
		            <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 8 ? 'bd _view' : '_view'" data-price="8">¥8</view>
		            <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 18 ? 'bd _view' : '_view'" data-price="18">¥18</view>
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

		<view  :class="'dialog ' + (rewardDialog ? 'dialog_show' : '')">
		    <view @tap.stop.prevent="onClickReward" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
		    <view class="dialog_container">
		        <view class="dialog_box_title">
		            {{ exceptionalCount }}次充电
					<i class="mini-icon mini-shanchu2" @tap.stop.prevent="onClickReward" />
		        </view>
		        <scroll-view :scroll-y="true" class="dialog_comments" enhanced :show-scrollbar="false" lower-threshold="0">
		            <view class="dialog_conent">
		                <view class="reward-user-box" v-for="(item, index) in exceptionalList" :key="item.rindex">
		                    <view class="reward-user-avatar-view" hover-class="none" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
		                        <image class="reward-user-avatar-image" compression="avatar" mode="aspectFill" :src="item.user.user_avatar"></image>
		                        <view class="reward-user-right">
		                            <view class="reward-user-name">{{ item.user.user_name }}</view>
		                            <view class="reward-user-date">{{ item.exceptional_date }}</view>
		                        </view>
		                    </view>

		                    <view class="reward-user-price">
		                        充电了￥
		                        <u-count-to
		                            autofix
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

		<view  :class="'dialog ' + (bounced ? 'dialog_show' : '')">
		    <view @tap.stop.prevent="bouncedTap" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
		    <view class="dialog_container">
		        <view class="dialog_conent">
		            <view @tap.stop.prevent="bouncedDeleteTap" class="delete-btn" id="delete">确认删除</view>
		            <view @tap.stop.prevent="bouncedTap" class="cancel-btn">取消</view>
		        </view>
		    </view>
		</view>

		<view  :class="'dialog ' + (showShare ? 'dialog_show' : '')">
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
		<post-share :unicom-id=" 'postShare_9_' + id " :postsId="postsId" :show="showSharePopup" @postfeedback="postFeedback"></post-share>
		<hover-ball v-if="isOfficial > 1" />
		<my-toast :unicom-id=" 'mytotast_9_' + id " ref="mytoast" :isdistance="true" :toast="mytoast_data" @giveCoin="onInputComment" @postfeedback="postFeedback"></my-toast>
    </view>
</view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';	
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';
import lazyLoad from '@/components/common/lazy-load/lazy-load';

import lWaterFlow from '@/linui/water-flow/index';

import PostContent from "@/pages/sticky/components/post-content";
import CommentForm from "@/pages/sticky/components/comment-form";
import CommentScroll from "@/pages/sticky/components/comment-scroll";
import PostShare from "@/pages/sticky/components/post-share";

import product from '@/components/common/water/product/index';


import contextualPopup from '@/components/common/contextual-popup/contextual-popup';

const common = require('@/mixins/common');
const user = require('@/mixins/user');
const forum = require('@/mixins/forum');

var options = {};
common(options);
user(options);
forum(options);
export default {
	mixins: [{ methods: options }],
    components: {
		myToast,navBar,hoverBall,lsSkeleton,
		
		lWaterFlow,
		PostContent,

		CommentForm,
		CommentScroll,
		product,
		PostShare,
		contextualPopup,
		lazyLoad
    },
	computed:{
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
		isShowImageSwiper:{
			get(){
				let that = this;
				if(that.posts && that.posts[0]){
					return (that.posts[0].is_blur == 0 && that.posts[0].video == null && that.posts[0].post_type != 'single' && that.posts[0].images.length > 0);
				}
				return false;
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
		config2_page_sticky_statement:{
			get(){
				let that = this;
				if(that.$store.state.config2.page.sticky && that.$store.state.config2.page.sticky.statement){
					return that.$store.state.config2.page.sticky.statement;
				}
				return '';
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
		waterfallSkeleton: {
			get(){
				let that = this;
				return that.$store.state.skeleton.waterfall;
			},
			set(v){}
		},
		config_about: {
			get(){
				let that = this;
				return that.$store.state.config.about;
			},
			set(v){}
		}
	},
    data() {
        return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 9,
			id: '',
			postsId: 0,
			resCode: 0,
			resMessage: '',
			commentFormShow: 0,
			commentScrollRefresh: 0,
			stickyCommentRefreshStatus: -1,
			commentCount: 0,
			exceptionalCount: 0,
            focus: false,
            topicload: true,
			relevant_topicload: false,
            posts: [],
			relevant_posts: [],
			
			imgItem: {
				img_url: '',
				width: 0,
				height: 0,
				is_pay: 0
			},

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
			rowPostSkeleton: [],
			slider_comment_page: -1,
			refresh_comment_times_already: 0,
			is_refresh_relevant_post_now: false,
			relevant_page: 0,
			relevant_loadmoreShow: false,
			relevant_isLastPage: false,
			relevant_load_times: 0,
			current_img_index: 1,
			scrollTop: 0,
			postWaterData: {
				e: 0,
				data: []
			},
			showSharePopup: 0,
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		// skeleton
		that.rowPostSkeleton = that.$store.state.skeleton.rowPost;

        var scene = decodeURIComponent(options.scene);
        if (scene && scene != 'undefined') {
			let query = {};
			if(scene.indexOf('&') !== -1){
				let scene_arr = scene.split('&');
				scene_arr.map((item)=> {
				    let queryData = item.split('=')
				    query[queryData[0]] = queryData[1]
				})
			}else{
				let queryData = scene.split('=')
				query[queryData[0]] = queryData[1]
			}
			if(query.from_user && query.from_user.length > 0){
				uni.setStorageSync('form_user', query.from_user);
				uni.$store.commit('updateFormUser', query.from_user);
			}
			that.id = query.id;
			that.postsId = that.id * -1;
			that.fph = true;
        } else {
			that.id = options.id;
			that.postsId = options.id * -1;
        }
		
		if(options.presets){
			var presets = decodeURIComponent(options.presets);
			if(presets && presets != 'undefined' && that.posts.length === 0){
				presets = JSON.parse(presets);
				that.imgItem = {
					img_url: presets.img,
					width: presets.img_width > 0 ? presets.img_width : 0,
					height: presets.img_height,
					is_pay: presets.is_pay == 1 ? 1 : 0
				};
				that.posts = [
					{
						is_examine: 1,
						posts_content: presets.raw,
						user: {
							user_name: presets.user_name,
							user_avatar: presets.user_avatar
						},
						swiperImgHeight: presets.imgHeight,
						images: [
							{
								img_url: presets.img,
								width: presets.img_width,
								height: presets.img_height,
								is_pay: 0
							}
						],
						longtaps: [],
						pay_obj: {
							price: 0
						},
						circle: {
							id: presets.cid,
							can_i_visit: presets.civ,
							circle_name: presets.circle_name,
							head_portrait: presets.head_portrait,
							circle_follow_count: 0,
							circle_posts_count: 0,
						},
						comment_count: presets.comment_count,
						is_blur: presets.is_blur,
					}
				];
				if(presets.civ == 2){
					if(that.$store.state.scene == 6 && that.$store.state.scene_id == presets.cid){
						
					}else{
						if(that.$store.state.scene != 9){
							setTimeout(function() {
								uni.wen.toUrl(2, presets.cid + '&civ=2');
							}, 200);
						}else{
							uni.wen.toUrl(2, presets.cid + '&civ=2');
						}
					}
					return false;
				}
				that.topicload = false;
			}
		}
		
		that.postsDetail(that.id);
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
		let that = this;
		that.updateScene(9, that.id, false, false, 0, 2);
		
		if(that.topicload){
			if(that.$store.state.pre_scene == 6){
				if(that.posts[0]?.circle?.id > 0){
					if(that.$store.state.pre_scene_id == that.posts[0]?.circle?.id ){
						that.postsDetail(that.id);
					}
				}else{
					that.postsDetail(that.id);
				}
			}
		}
		
	},
	onReachBottom: function() {
		let that = this;
		if(that.is_refresh_relevant_post_now){
			that.relevant_post();
			return false;
		}
		if(that.slider_comment_page == -1){
			if(that.$store.state.config2.page.sticky && that.$store.state.config2.page.sticky.slider_comment_page){
				if(that.$store.state.config2.page.sticky.slider_comment_page == -1){

				}else{
					that.slider_comment_page = that.$store.state.config2.page.sticky.slider_comment_page;
				}
			}
		}
		if(that.slider_comment_page <= 0){
			that.setData({
				stickyCommentRefreshStatus: -1,
				commentScrollRefresh: Date.now()
			});
		}else{
			if(that.refresh_comment_times_already < that.slider_comment_page){
				that.setData({
					stickyCommentRefreshStatus: -1,
					commentScrollRefresh: Date.now(),
					refresh_comment_times_already: that.refresh_comment_times_already + 1
				});
			}else{
				if(that.$store.state.config2.page.sticky && that.$store.state.config2.page.sticky.is_recommendation == 1){
					that.is_refresh_relevant_post_now = true;
					that.relevant_post();
				}
			}
		}

	},
	onBackPress(e) {
		if(this.showComments) {
			this.showComments = false;

			// #ifdef APP || H5
			setTimeout(function(){
				uni.showTabBar();
			}, 250)
			// #endif

			return true;
		}else if(this.rewardDialog){
				this.rewardDialog = false;
				// #ifdef APP || H5
				setTimeout(function(){
					uni.showTabBar();
				}, 250)
				// #endif
				return true;
		}else if(this.fph) {
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
			posts: [],
			topicload: true,
			popupshow: '',
			postsId: (that.postsId * -1),
			commentFormShow: 0,
		});
		that.postsDetail(that.id);
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onPageScroll: function onPageScroll(e) {
		let that = this;
		that.scrollTop = e.scrollTop;
	},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
		let that =  this;
        let share_title = that.$store.state.config.share.format.app_share_post;
        let share_img = '';

        for (let index = 0; index < that.posts.length; index++) {
            const post = that.posts[index];

            if ( post.id == Math.abs(that.postsId) ) {
                share_title = share_title.replace('[post_content]', post.posts_title ? post.posts_title : post.posts_content_raw).replace('[author_name]', post.user.user_name);
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
    },
    onShareTimeline: function (res) {
		let that =  this;
		let share_title = that.$store.state.config.share.format.app_share_post;
		let share_img = '';

		for (let index = 0; index < that.posts.length; index++) {
		    const post = that.posts[index];

		    if (post.id == Math.abs(that.postsId) ) {
		        share_title = share_title.replace('[post_content]', post.posts_title ? post.posts_title : post.posts_content_raw).replace('[author_name]', post.user.user_name);

		        share_img = post.share_img;
		        break;
		    }
		}

		share_title = share_title.replace(/<[^>]*?>/g, '');
        return {
            title: share_title,
            query: 'id=' + that.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
            imageUrl: uni.wen.util.removeStyles(share_img) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
        };
    },
    methods: {
		//预览图片
		previewImgFunc(index) {
		    let that = this;
			
			if(that.posts[0].images[index]['is_pay'] == 1){
				that.showPayContent(0);
				return false;
			}
			
		    let url = that.posts[0].images[index]['img_url'];
		    var list = that.posts[0].images;
		    let styleNames = that.$store.state.config.img.styleNames || new Array();
		    var imagesArr = [];
		
		    if (url) {
				if(styleNames.length > 0){
					for (var i = 0; i < styleNames.length; i++) {
						if (styleNames[i].charAt(0) == '/') {
							url = url.replace(styleNames[i], '');
						}
					}
				}
				
				const index = url.indexOf('?imageMo');
				if(index >= 0){
					url = url.slice(0, index)
				}
		    }
		
		    if (list) {
		        for (var j = 0; j < list.length; j++) {
		            let img_ = list[j].img_url;
					
					if(styleNames.length > 0){
						for (var i = 0; i < styleNames.length; i++) {
						    if (styleNames[i].charAt(0) == '/') {
						        img_ = img_.replace(styleNames[i], '');
						    }
						}
					}
		            
					const index = img_.indexOf('?imageMo');
					if(index >= 0){
						img_ = img_.slice(0, index)
					}
					
		            imagesArr.push(img_);
		        }
		    } else {
		        imagesArr = [url];
		    }
		
		    uni.previewImage({
		        current: url,
		        urls: imagesArr
		    });
		    return false;
		},
		postsDetail(id){
		    let that = this;
		    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/detail', {
		        posts_id: id
		    }).then(function (res) {
		        uni.loading(false);
		        if (res.status) {

					if(res?.data?.[0]?.circle?.can_i_visit == 2){
						if(that.$store.state.scene == 6 && that.$store.state.scene_id == presets.cid){
							
						}else{
							if(that.$store.state.scene != 9){
								setTimeout(function() {
									uni.wen.toUrl(2, res.data[0].circle.id + '&civ=2');
								}, 200);
							}else{
								uni.wen.toUrl(2, res.data[0].circle.id + '&civ=2');
							}
						}
						return false;
					}
					
		            that.posts = res.data;
		            that.topicload = false;
					
					// #ifdef H5
					if(uni.$store.state.h5_browser == 'wxclient'){
						setTimeout(function(){
							
							let share_title = that.$store.state.config.share.format.app_share_post;
							share_title = share_title.replace('[post_content]', that.posts[0].posts_title ? that.posts[0].posts_title : that.posts[0].posts_content_raw).replace('[author_name]', that.posts[0].user.user_name);
							let share_img = that.posts[0].share_img;
							share_title = share_title.replace(/<[^>]*?>/g, '');
							uni.wen.util.setH5WeixinShare(share_img, share_title, that.posts[0].user.user_name);
							
						}, 500);
					}
					// #endif
					
		        } else {
					that.resCode = res.code;
					that.resMessage = res.message
					that.topicload = false;
		            uni.showToast({
		                title: res.message,
		                icon: 'none',
		                duration: 1500
		            });
		        }
		    });
		},
		scrollToComments(){
			uni.createSelectorQuery().select('.post-wrap-0').boundingClientRect(data => {
			　　　　uni.createSelectorQuery().select('.comments_container').boundingClientRect(res => {
			　　　　　　uni.pageScrollTo({
			　　　　　　　　scrollTop: res.top - data.top - 10
			　　　　　　})
			　　　　}).exec()
			}).exec()
		},
		ImgSwiperChange(e){
			let that = this;
			that.current_img_index = e.detail.current + 1;
		},
		sticky_refresh_comments(){
			let that = this;
			that.setData({
				stickyCommentRefreshStatus: -1,
				commentScrollRefresh: Date.now()
			});
		},
		relevant_post(){
			let that = this;
			if(that.relevant_isLastPage){
				return;
			}
			that.setData({
				relevant_loadmoreShow: true,
				relevant_isLastPage: false,
				relevant_topicload: that.relevant_page == 0 ? true : false,
				relevant_page: that.relevant_page + 1
			});
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/relevant', {
				posts_id: that.id,
				page: that.relevant_page
			}).then(function (res) {
			    if (res.code === 200) {
					
					if(res.data.current_page != that.relevant_page){
						return false;
					}
					
			        let data = res.data;
			        let args = {};

			        if(data.data && data.data.length > 0){
			        	args.relevant_posts = that.relevant_posts.concat(data.data);
			        	args.relevant_page = data.current_page;
			        	args.relevant_loadmoreShow = false;
			        	args.relevant_isLastPage = false;
			        }else{
			        	args.relevant_isLastPage = true;
			        }

					args.relevant_load_times = that.relevant_load_times + 1,
			        args.relevant_topicload = false;
			        that.setData(args);

			        if(data.data && data.data.length > 0){
						that.setData({
							postWaterData: {
								e: 0,
								data: data.data
							}
						});
			        }

			    }else{

					that.setData({
						relevant_load_times: that.relevant_load_times + 1,
					});
				}
			});
		},
		commentRefreshStatus(status){
			let that = this;
			let is_refresh_relevant_post_now = false;
			if(status == 0 && that.$store.state.config2.page.sticky && status == 0 && that.$store.state.config2.page.sticky.is_recommendation == 1){
				is_refresh_relevant_post_now = true;
				that.relevant_post();
			}

			// 等待评论渲染时间
			setTimeout(function() {
				that.setData({
					stickyCommentRefreshStatus: status,
					is_refresh_relevant_post_now:  is_refresh_relevant_post_now,
				});
			}, 200);

		},
		is_show_detail_swpier(item){
			return (item.is_blur == 0 && item.video == null && item.post_type != 'single' && item.images.length > 0);
		},
		sticky_collect(id){
			let that = this;

			uni.wen.util.doVibrateShort();

			uni.wen.util.request(
				uni.wen.api.ApiRootUrl + 'posts/collect', {
					posts_id: id
				},
				'POST'
			).then(function(res) {
				uni.loading(false);
				if (res.status) {
					let post = that.posts[0];
					if (post.is_collect) {
						post.collected_count -= 1;
					} else {
						post.collected_count += 1;
					}
					post.is_collect = !post.is_collect;

					that.setData({
						posts: [post]
					});

					if (!post.is_collect) {
						uni.showToast({
							title: '取消收藏',
							icon: 'none',
							duration: 1500
						});
					} else {
						uni.showToast({
							title: '收藏成功',
							icon: 'none',
							duration: 1500
						});
					}
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				}
				uni.$store.commit('popopChange', false);
			});
		},
		openApp(){
			uni.wen.util.openOrDownloadApp()
		}
    }
};
</script>
<style lang="scss">

$sticky-clrcle-big-display: none; // 笔记内页的大圈子是否显示，改成 none 可隐藏（默认值：flex ）
$post-list-sex-display: inline-block; // 文章列表是否显示性别，如果不想显示改为：none （默认值：inline-block ）

	
@import '@/pages/template/circle.scss';
.lxy-nav-bar__logo{
	._image.circle_shape{
		border-radius: unset;
	}
}
.img-title-center{
	width: 100%;
	display: flex;
	justify-content: space-between;
}
.post-detail-content{
	.swiper-container {
	    width: 100%;
	    margin: 0rpx auto;
	    position: relative;
	    @include background_color(page-box-background-color);
		.img_tips_count{
		  top: 15rpx;
          position: absolute;
          bottom: 50rpx;
          right: 20rpx;
          font-size: 20rpx;
          color: #fff;
          background: rgba(0, 0, 0, .3);
          width: 80rpx;
          height: 45rpx;
          border-radius: 45rpx;
          display: flex;
          align-items: center;
          justify-content: center
		}
		.switem {
		    width: 100%!important;
			height: 100% !important;
		    animation: fadeIn 1s ease;
			.swiper-content{
				display: flex;
				justify-content: center;
				position: relative;
				overflow: hidden;
				._image{
					display: block;
					margin: auto;
					align-self: center;
				}
			}
		}
	}
}
.sticky_circleinfo{
	display: $sticky-clrcle-big-display;
	justify-content: space-between;
	width: 750rpx;
	box-sizing: border-box;
	padding: 20rpx 30rpx;
	@include background_color(page-box-background-color);
	border-top: 1px solid;
	@include border_color(border-color-body-background-color);
	.left{
		height: 80rpx;
		display: flex;
		.lleft{
			margin-right: 20rpx;
			line-height: 80rpx;
			image{
				margin-top: 8rpx;
				border-radius: 28%;
				width: 70rpx;
				height: 70rpx;
			}
		}
		.lright{
			.circle-name{
				font-size: $uni-font-size-base;
				line-height: 45rpx;
				@include color(color-dark);
			}
			.circle-count{
				@include color(color-lighter-dark);
				font-size: $uni-font-size-sm;
				line-height: 35rpx;
			}
		}
	}
	.right{
		height: 80rpx;
		line-height: 80rpx;
		.mini-icon{
			@include color(color-lightest-dark);
		}
	}
}
.sticky-add-comments{
	// position: fixed;
	// bottom: 0;
	z-index: 0;
	@include background_color(page-box-background-color);
	width: 380rpx;
	// right: 0;
	// margin-left: 330rpx;
	box-sizing: border-box;
	border-top: unset;
	height: 80rpx;
	line-height: unset;
	display: flex;
	flex-direction: column;
	justify-content: center;
	@include color(color-darkest);
	.line1{
		display: flex;
		justify-content: space-between;
		height: 44rpx;
		line-height: 44rpx;
		.mini-icon{
			width: 95rpx;
			min-width: 95rpx;
			max-width: 95rpx;
			text-align: center;
			@include color(color-light-dark);
			font-size: 44rpx;
			font-weight: bold;
			align-self: center;
			vertical-align: middle;
			display: inline;
		}
		.mini-icon.mini-xihuan-shixin{
			color: $uni-color-love !important;
		}
		.mini-icon.mini-shoucang-shixin1{
			color: $uni-color-collected !important;
		}
	}
	.line2{
		display: flex;
		justify-content: space-between;
		height: 40rpx;
		line-height: 40rpx;
		.number{
			width: 95rpx;
			min-width: 95rpx;
			max-width: 95rpx;
			text-align: center;
			@include color(color-light-dark);
			line-height: 40rpx;
			font-weight: bold;
			font-size: $uni-font-size-sm-base;
			align-self: center;
			vertical-align: middle;
		}
	}
}
.comment-dialog-bg {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
	background: rgba(0, 0, 0, 0.2);
}
.sticky-reward-box{
	padding: 20rpx 0 35rpx;

}
.statement {
	text-align: center;
    font-size: 25rpx;
    @include color(color-lighter-er-dark);
	font-weight: 100;
	// opacity: 0.9;
    margin: 30rpx auto 20rpx;
	width: $page-content-body-width;
}
.sticky-ad-wrap{
	position: relative;
	@include background_color(page-body-background-color);
	.ad-content{
		width: 750rpx;
		margin: auto;
	}
	._image{
		width: 750rpx;
		margin: auto;
	}
	.mini-adtip{
		position: absolute; top: 8rpx; left: 8rpx;  color: #cccccc; z-index: 9;opacity: 0.6;
	}
}
.tap_refrsh_comment { display: block; width: 100%; text-align: center; @include color(color-lighter-dark); padding: 15rpx 0; font-size: $uni-font-size-base; }
.comments_container{
	padding-bottom: 20rpx!important;
}
.relevant_wrap{
	@include background_color(page-box-background-color);
	.title {
		padding: 16rpx 20rpx;
		font-size: $uni-font-size-lg;
		@include color(color-darkest);
		.mini-icon{
			margin-right: 8rpx;
			display: inline-block;
		}
	}
	.body {
	    margin-top: 10px;
	}
}
.img-title-center.not{
	.follow-view{
		margin-right: 10rpx;
	}
	.follow-view.color-primary{
		border-color: $uni-color-follow;
	}
	._text{
		font-size: 16px;
		font-weight: 500;
		max-width: 320rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
}
.user-info-view{
	width: 750rpx;
	display: flex;
	justify-content: center;
	padding: 16rpx 0 10rpx;
	@include background_color(page-box-background-color);
	.inner{
		width: $page-content-body-width;
	}
}


.post-delay-wrap{
	width: 750rpx;
	.inner{
		width: $page-content-body-width;
		margin: auto;
		height: 300rpx;
		text-align: center;
		line-height: 300rpx;
		margin-top: 20rpx;
		@include background_color(page-gray-background-color);
	}
}

/* #ifdef H5 */
.top-open-app-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  width: 750rpx;
  @include background_color(page-box2-background-color);
  .inner{
	  display: flex;
	  width: $page-content-body-width;
	  margin: auto;
	  align-items: center;
	  gap: $uni-spacing-row-base;
	  padding: 10rpx 0;
	  .logo {
	    width: 68rpx;
	    height: 68rpx;
	  }
	  
	  .text-wrapper {
	    font-size: $uni-font-size-sm;
		@include color(color-lightest-dark);
	  
	    .app-name {
	      @include color(color-light-dark);
	      font-weight: 500;
	    }
	  }
	  
	  .btn-wrapper {
	    margin-left: auto;
	    width: 140rpx;
	    height: 58rpx;
	    font-size: $uni-font-size-sm;
	    text-align: center;
	    line-height: 58rpx;
	    color: $uni-color-follow-font;
	    background: $uni-color-follow;
	    border-radius: 58rpx;
	  }
  }
}
/* #endif */


.user-info{
	display: flex;
	justify-content: space-between;
	.user-avatar-view{
		display: flex;
		width: 483rpx;
		max-width: 483rpx;
		.avatar-wrap{
			margin-right: 22rpx;
			position: relative;
			.user-avatar-image {
			    height: 68rpx;
			    width: 68rpx;
				min-width: 68rpx;
			    border-radius: 50%;
			}
			.user-avatar-frame{
				position: absolute;
				top: 0;
				left: 0;
				height: 68rpx;
				width: 68rpx;
				min-width: 68rpx;
				transform: scale(1.35);
			}
			.avatar-authentication-icon{
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
		.time_and_address_wrap{
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
			@include color(color-lightest-dark);
			// opacity: 0.9;
			font-size: 20rpx;
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
		.post-info-view.distance{
			margin-left: 0;
		}
		.post_top.post-info-view .mini-icon{
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
		.header-label.honor-icon{
			width: 100rpx;
			height: unset;
			.honor-image{
				width: 100rpx;
				max-height: 40rpx;
			}
		}
		.header-label.lv-icon{
			width: 50rpx;
			// padding-left: 14rpx;
			// box-sizing: border-box;
			font-size: 42rpx;
			line-height: 22rpx;
		}
		.header-label.gender-m-icon, .header-label.gender-w-icon{
			display: $post-list-sex-display;
		}
	}
	
	.user-avatar-view.android{
		.post-info-view, .format-time-view {
			font-weight: 100;
		}
	}
	
	.user-avatar-view.no-detail {
		width: unset;
		.user-view{
	
		}
	}
	.user-avatar-view.scene_90002{
		.avatar-wrap{
			height: 68rpx;
			line-height: 68rpx;
			.user-avatar-image{
				height: 55rpx;
				width: 55rpx;
				min-width: 55rpx;
				margin-top: 8rpx;
			}
			.user-avatar-frame{
				height: 55rpx;
				width: 55rpx;
				min-width: 55rpx;
				margin-top: 8rpx;
				transform: scale(1.35);
			}
			.avatar-authentication-icon{
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
		 .user-view{
			 height: 68rpx;
			 line-height: 68rpx;
			 .user-name{
				 .user-nick-text{
					height: 68rpx;
					line-height: 68rpx;
				 	/* #ifdef MP */
				 	max-width: 250rpx;
				 	/* #endif */
				 }
				 .header-label{
					 /* #ifdef MP */
					 display: none;
					 /* #endif */
				 }
			 }
			 
		 }
	}
	.user-avatar-view.scene_15{
		width: 360rpx;
		padding: 10rpx;
		box-sizing: border-box;
		height: 70rpx;
		.avatar-wrap{
			.user-avatar-image{
				height: 40rpx;
				width: 40rpx;
				min-width: 40rpx;
			}
			.user-avatar-frame{
				height: 40rpx;
				width: 40rpx;
				min-width: 40rpx;
			}
			.avatar-authentication-icon{
				width: 24rpx;
				height: 24rpx;
				bottom: 22%;
				right: -29%;
				font-size: $uni-font-size-sm;
			}
		}
		.user-view{
			.user-name{
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
