<template>
	<view class="single"  @tap.stop.prevent="toSingleDetail">
		<view class="inner">
			<view class="single-title">
			<!-- <view class="title">{{single.posts_content_raw }}</view> -->
			<mp-html :content="single.posts_title"
				class="content-view title unellipsis" :isSticky="single.is_sticky" :isAdminDelete="single.posts_state == 2" :isInReview="single.is_examine" :isSingle="true"/>
			</view>
			<view v-if="single.video == null && single.images.length > 0" class="single-imgs img-lists">
				<block v-if="single.images.length == 1">
					<view class="one-pictures-box">
						<image  :class=" 'one-pictures' + (single.is_blur == 1 ? ' img-blur' : '')"  mode="aspectFill" :src="imgItem.img_url"
							v-for="(imgItem, index1) in single.images" :key="index1"></image>
					</view>
				</block>
				<block v-else>
					<image :class="'image-box' + (single.is_blur == 1 ? ' img-blur' : '')"
					    mode="aspectFill"
					    :src="imgItem.img_url"
					    v-for="(imgItem, index1) in single.images"
					    :key="index1"
					></image>
				</block>
				<view class="blur-tips" v-if="single.is_blur == 1">图片疑似引人不适</view>
			</view>
			<view class="single-middle">
				<view class="left">
					<view class="user-avatar-view" hover-class="none" @tap.stop.prevent="toSliderUrl(4, single.user.id)">
						<view class="avatar-wrap">
							<image class="user-avatar-image" compression="avatar" mode="aspectFill"
									:src="single.user.user_avatar"></image>
							<i class="avatar-authentication-icon mini-icon mini-verify" v-if="single.user.is_authentication == 1"></i>
						</view>
						<view class="user-view">
							<view class="user-name">
								<text class="user-nick-text">{{ single.user.user_name }}</text>	
								<i class="header-label official-icon mini-icon mini-renzhengguanli1" v-if="single.user.is_official == 1"></i>
								<!-- <i class="header-label authentication-icon mini-icon mini-verify" v-if="single.user.is_authentication == 1"></i> -->
								<i class="header-label vip-icon mini-icon mini-vip" v-if="single.user.is_member == 1"></i>
								<i :class="'header-label lv-icon mini-icon mini-lv' + single.user.lv"></i>
							</view>
						</view>
					</view>
				</view>
				<view class="right">
					<text class="circle" v-if="single.circle && single.circle.id > 0"><i class="mini-icon mini-tubiaozhizuomoban-mian_quanzi"></i> {{ single.circle.circle_name }}</text>
				</view>
			</view>
			<view class="single-footer">
				<view class="left">
					<view class="reply">
						<i v-if="single.is_like" class="mini-icon mini-xihuan-shixin"></i>
						<i v-else  class="mini-icon mini-xihuan-kongxin"></i>
						<text class="_text">{{ filters.toFix(single.like_count) }}</text>
					</view>
					<view class="reply">
						<i class="mini-icon mini-a-pinglun2"></i>
						<text class="_text">{{ filters.toFix(single.comment_count) }}</text>
					</view>
					<view class="upvote">
						<i class="mini-icon mini-fenxiang" ></i>
					</view>
				</view>
				<view class="right">
					<view class="format-time-view">{{ single.format_time }}</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
	import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';
	export default {
		name:"single-item",
		components: {
			mpHtml
		},
		data() {
			return {

			};
		},
		props: {
			single: {
				type: Object,
				required: true
			},
		},
		methods: {
			toSingleDetail(){
				uni.wen.toUrl(1, this.single.id, null);
			}
		}
	}
</script>

<style lang="scss">
.single{
	width: 750rpx;
	.inner{
		width: $page-content-body-width;
		margin: auto;
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
		.single-imgs.img-lists{
			.one-pictures-box{
				width: 100%;
				max-width: 100%;
				.one-pictures{
					width: 100%;
					max-width: 100%;
				}
			}
		}
		.single-title{
				position: relative;
				.title{
					font-size: $uni-font-size-medium;
					line-height: 50rpx;
					font-weight: 450;
					@include color(color-light-dark);
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					.root{
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
				}
		}
		.single-middle {
		    display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
			margin-bottom: 10rpx;
			.left{
				.user-avatar-view {
				    display: flex;
				    align-items: center;
					height: 40rpx;
					max-height: 40rpx;
					line-height: 40rpx;
				}
				.avatar-wrap{
					margin-right: 22rpx;
					position: relative;
					.user-avatar-image{
						height: 40rpx;
						width: 40rpx;
						border-radius: 50%;
					}
					.avatar-authentication-icon{
						position: absolute;
						bottom: 6%;
						right: -22%;
						@include background_color(page-box-background-color);
						border-radius: 50%;
						height: 13px;
						line-height: 13px;
					}
				}
				
				.user-nick-text{
					font-weight: unset;
					font-size: $uni-font-size-sm;
					line-height: 40rpx;
				}
				.mini-icon{
					font-size: $uni-font-size-sm;
					line-height: 40rpx;
					margin-left: 6rpx;
				}
				.mini-icon.lv-icon{
					font-size: 37rpx;
					width: 45rpx;
					line-height: 36rpx;
				}
			}
			.right{
				.circle{
					.mini-icon{
						font-size: 12px;
						color: $uni-color-primary;
					}
					font-size: 12px;
				}
			}
			
		}
		.single-footer {
		    display: flex;
			justify-content: space-between;
			height: 42rpx;
			line-height: 42rpx;
			.left{
				display: flex;
				width: 38%;
				justify-content: space-between;
				text-align: left;
				.reply{
					margin-left: 0;
				}
				.mini-icon{
					@include color(color-lightest-dark);
					margin-right: 10rpx;
					display: inline-block;
				}
				.mini-icon.mini-xihuan-shixin{
					color: $uni-color-love;
				}
				._text{
					@include color(color-lightest-dark);
					font-size: $uni-font-size-sm-base;
				}
			}
		}
		.img-lists {
		    margin-top: 20rpx;
		    display: flex;
		    flex-wrap: wrap;
			overflow: hidden;
		}
		
		.img-lists .four-picture:nth-child(2n) {
		    margin-right: 30rpx !important;
		}
		
		.image-box {
		    width: 228rpx;
		    height: 228rpx;
		    margin-right: 8rpx;
		    margin-bottom: 8rpx;
			border-radius: 8rpx;
		}
		
		.one-pictures-box {
		    max-width: 590rpx;
		    max-height: 390rpx;
			overflow: hidden;
		}
		
		.one-pictures {
		    max-width: 100%;
		    max-height: 100%;
		    border-radius: 8rpx;
		    margin-bottom: 8rpx;
		}
		.format-time-view {
			@include color(color-lightest-dark);
			font-size: 20rpx;
			font-weight: 400;
			white-space: nowrap;
		}
	}
} 
</style>