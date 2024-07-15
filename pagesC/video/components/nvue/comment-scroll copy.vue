<template>
<view :class="'comment-scroll ' + 'scene_' + scene">
	<ls-skeleton :loading="commentSkeletonLoad" :skeleton="commentListSkeleton">
		<scroll-view :show-scrollbar="false" :scroll-y="scene != 9" class="dialog_comments" enhanced  @scrolltolower="loadRefreshComments(false)">
			<view class="comment-avatar-quick" @tap.stop.prevent="tapComment('', '', '')" v-if="scene == 9">
				<view class="left">
					<image class="_image" :src="myUserInfo.user_avatar || config_img__NVUE.default_avatar" mode=""></image>
				</view>
				<view class="right">
					<view>点赞是喜欢，评论是真爱~</view>
					<view>
						<text class="mini-icon mini-a-">&#xe6df;</text>
						<text class="mini-icon mini-biaoqing1">&#xe6de;</text>
						<text class="mini-icon mini-tupian21">&#xe6e2;</text>
					</view>
				</view>
			</view>
			<view class="comment-reply">
				<view class="comment-reply-item" v-for="(item, cindex) in comments" :key="item.id">
					<view class="comment-header">
						<view class="comment-header-left" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
							<view class="comment-avatar-wrap">
								<image class="comment-avatar" :src="item.user.user_avatar"></image>
								<image class="comment-avatar-frame" v-if="item.user.avatar_frame_url" :src="item.user.avatar_frame_url" mode="aspectFill"></image>
								<text class="avatar-authentication-icon mini-icon mini-verify" v-if="item.user.is_authentication == 1">&#xe614;</text>
							</view>
							<view class="comment-user-date">
								<text class="comment-author-name">{{ item.user.user_name }}</text>
								<block v-if="item.posts_user_id == item.user.id">
									<view class="comment-zuozhe">
										<view class="_text">作者</view>
									</view>
								</block>
								<block v-else>
									<view class="flex-row">
										<text class="comment-header-label gender-m-icon mini-icon mini-xingbienan" v-if="item.user.gender == 1">&#xe6d5;</text>
										<text class="comment-header-label gender-w-icon mini-icon mini-xingbienv" v-if="item.user.gender == 2">&#xe6ad;</text>
										<text class="comment-header-label official-icon mini-icon mini-renzhengguanli1" v-if="item.user.is_official == 1">&#xe6ae;</text>
										<text class="comment-header-label vip-icon mini-icon mini-vip" v-if="item.user.is_member == 1">&#xe6b7;</text>
									</view>
								</block>
							</view>
						</view>
						<view class="comment-header-right">
							<text class="mini-icon mini-xihuan-shixin" @tap.stop.prevent="tapCommentlike(cindex, item.id)" v-if="item.is_like">&#xe610;</text>
							<text class="mini-icon mini-xihuan-kongxin" @tap.stop.prevent="tapCommentlike(cindex, item.id)" v-else>&#xe60f;</text>

							<!-- #ifndef APP-NVUE -->
							<view class="comment-up-num _view">{{ filters.toFix(item.like_count) }}</view>
							<!-- #endif -->
							<!-- #ifdef APP-NVUE -->
							<view class="comment-up-num _view">{{ item.like_count }}</view>
							<!-- #endif -->
						</view>
					</view>

					<view class="comment-content" @tap.stop.prevent="tapComment(item.id, item.user_id, item.user_name)">
						<view class="commentconent">
							<contextualPopup subject="comment" :popList="item.allowable" :para="{ type: 'parent-comment' ,  index: cindex}">
							  <view class="contentinfo" slot="content">
							  	<block v-if="item.comment_content != null">
									<text class="comment_content_raw">{{ item.comment_content_raw }}</text>
									<text class="format_time" slot="content-after">{{ item.format_time + '&nbsp;&nbsp;' + item.ip_address }}</text>
									<view class="post-author-with-comment">
										<view class="author-withed author-liked" v-if="item.is_author_liked">作者赞过</view>
										<!-- <view class="author-replyed" v-if="item.is_author_liked">作者赞过</view> -->
									</view>
							  	</block>
							  </view>
							</contextualPopup>
						</view>
						<image
							v-if="item.comment_img_url != null && item.comment_img_url != ''"
							class="comment-img-list" :lazyLoad="true"
							@tap.stop.prevent="previewImgFunc" :data-list="item.imgList"
							:data-src="item.comment_img_url" mode="aspectFill"
							:src="item.comment_img_url"></image>
					</view>
					<view class="sub-comments">
						<view class="replay-content" v-for="(items, cindexs) in item.child"
							:key="items.id">
							<view class="comment-header sub">
								<view class="comment-header-left" @tap.stop.prevent="toSliderUrl(4, items.user.id)">
									<view class="comment-avatar-wrap sub">
										<image class="comment-avatar" :src="items.user.user_avatar"></image>
										<image class="comment-avatar-frame" v-if="items.user.avatar_frame_url" :src="items.user.avatar_frame_url" mode="aspectFill"></image>
										<text class="avatar-authentication-icon mini-icon mini-verify" v-if="items.user.is_authentication == 1">&#xe614;</text>
									</view>
									<view class="comment-user-date">
										<text class="subcomment-author-name">{{ items.user.user_name }}</text>
										<block v-if="item.posts_user_id == items.user.id">
											<view class="comment-zuozhe">
												<view class="_text">作者</view>
											</view>
										</block>
										<block v-else>
											<text class="comment-header-label gender-m-icon mini-icon mini-xingbienan" v-if="items.user.gender == 1">&#xe6d5;</text>
											<text class="comment-header-label gender-w-icon mini-icon mini-xingbienv" v-if="items.user.gender == 2">&#xe6ad;</text>
											<text class="comment-header-label official-icon mini-icon mini-renzhengguanli1" v-if="items.user.is_official == 1">&#xe6ae;</text>
											<text class="comment-header-label vip-icon mini-icon mini-vip" v-if="items.user.is_member == 1">&#xe6b7;</text>
										</block>
									</view>
								</view>
								<view class="comment-header-right" @tap.stop.prevent="tapCommentslike(cindex, cindexs, items.id)">
									<text class="mini-icon mini-xihuan-shixin"  v-if="items.is_like">&#xe610;</text>
									<text class="mini-icon mini-xihuan-kongxin" v-else>&#xe60f;</text>
									<!-- #ifndef APP-NVUE -->
									<view class="_view">{{ filters.toFix(items.like_count) }}</view>
									<!-- #endif -->
									<!-- #ifdef APP-NVUE -->
									<view class="_view">{{ items.like_count }}</view>
									<!-- #endif -->
								</view>
							</view>

							<view class="comment-content" @tap.stop.prevent="tapComment(item.id, items.user_id, items.user_name)">
								<view class="commentconent">
									<contextualPopup subject="comment" :popList="items.allowable"  :para="{ type: 'sub-comment' , pindex: cindex, index: cindexs}">
										<view class="contentinfo" slot="content">
											<block v-if="items.comment_content != null">
												<text class="comment_content_raw">{{ items.comment_content_raw }}</text>
												<text slot="content-after" class="content-after format_time">{{ items.format_time + "&nbsp;&nbsp;" + items.ip_address }}</text>
											</block>
										</view>
									</contextualPopup>
								</view>
								<image
									v-if="items.comment_img_url != null && items.comment_img_url != ''"
									class="comment-img-list" :lazy-load="true"
									@tap.stop.prevent="previewImgFunc"
									:data-list="items.imgList" :data-src="items.comment_img_url"
									mode="aspectFill" :src="items.comment_img_url"></image>
							</view>
						</view>

						<view class="replay-more" v-if="!item.child_is_last_page" @tap.stop.prevent="getCommentByCommentId(item.id, cindex)">
							<block v-if="item.child_loading === true">
								<view aria-label="Loading..." role="status" class="spin-loader">
								  <text class="icon mini-icon mini-jiazai">&#xe67d;</text>
								  <span class="loading-text">加载中...</span>
								</view>
							</block>
							<block v-else>
								<view class="_text">展开更多回复</view>
							</block>
						</view>
					</view>
					<block v-if=" cindex != (comments.length - 1)">
						<view class="comment-split-line"></view>
						<block v-if="item.ad">
							<!-- #ifdef MP -->
							<view class="comment-ad-wrap">
								<block v-if="item.ad.type && item.ad.type == '1' ">
									<text class="mini-icon mini-adtip">&#xe6d6;</text>
									<image class="_image" :src="item.ad.img" @tap.stop.prevent="toSliderUrl(item.ad.target_type, item.ad.target_id)" mode="widthFix"></image>
								</block>
								<block v-else>
									<view class="ad-content"><ad-custom :unit-id="item.ad.unit" ></ad-custom></view>
								</block>
							</view>
							<view class="comment-split-line"></view>
							<!-- #endif -->
							<!-- #ifndef MP -->
							<view class="comment-ad-wrap">
								<block v-if="item.ad.type && item.ad.type == '1' ">
									<text class="mini-icon mini-adtip">&#xe6d6;</text>
									<image class="_image" :src="item.ad.img" @tap.stop.prevent="toSliderUrl(item.ad.target_type, item.ad.target_id)" mode="widthFix"></image>
								</block>
								<block v-else>
									<view class="ad-content"><ad :adpid="item.ad.unit"></ad></view>
								</block>
							</view>
							<view class="comment-split-line"></view>
							<!-- #endif -->
						</block>
					</block>
				</view>
			</view>

			<block v-if="commentIsNull && comments.length <= 0">
				<u-empty :icon="config_img__NVUE.empty" width="300" height="300" text="快来抢占沙发吧" textSize="28"/>
			</block>

			<u-loadmore v-if="isCommentLoadingShow" :status="isCommentEndPage ? 'nomore' : 'loading'" nomoreText="── THE END ──"  iconSize="28" fontSize="28" color="#989898" bgClass="page-box-background-color" />
			<view style="height: 200rpx;" v-if=" scene != 9 "></view>
		</scroll-view>
	</ls-skeleton>
</view>

</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
// #ifdef APP-NVUE
const domModule = weex.requireModule('dom');
domModule.addRule('fontFace', {
	fontFamily: 'mini-icon',
	src: "url('../../../static/icon/A/iconfont.ttf')"
});
// #endif
	
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';
import contextualPopup from '@/components/common/contextual-popup/contextual-popup';
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';

export default {
	name:"comment-scroll",
	components: {
		lsSkeleton,
		contextualPopup,
		mpHtml
	},
	computed:{
		commentListSkeleton:{
			get(){
				let that = this;
				return that.$store.state.skeleton.commentList;
			},
			set(v){}
		},
		config_app_ip_comment:{
			get(){
				let that = this;
				if(that.$store.state.config.app.ip){
					return that.$store.state.config.app.ip.comment
				}
				return 0;
			},
			set(v){}
		},
		config_img__NVUE:{
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
	},
	data() {
		return {
			comments: [],
			cPage: 1,
			isCommentLoadingShow: false,
			isCommentEndPage: false,
			commentSkeletonLoad: true,
			commentIsNull: false,
		};
	},
	props: {
		scene: {
			type: Number,
			default: 0
		},
		postsId: {
			type: [Number, String],
			default: 0
		},
		refresh: {
			type: Number,
			default: 0
		}
	},
	watch:{
		postsId: {
			handler: function(newVal, oldVal) {
				let that = this;
				if(typeof newVal === 'string'){
					newVal = parseInt(newVal);
				}
				if(typeof oldVal === 'string'){
					oldVal = parseInt(oldVal);
				}
				if(oldVal === newVal){
					return false;
				}
				if(oldVal === undefined && newVal < 0){
					that.loadRefreshComments(true);
					return false;
				}
				if(newVal != 0 && newVal != '0'){
					if(newVal == oldVal * -1){
						setTimeout(function() {
							that.loadRefreshComments(true);
						}, 300);
					}else{
						that.loadRefreshComments(true);
					}
				}else{
					that.datainit();
				}
			},
			immediate: true
		},
		refresh: {
			handler: function(newVal, oldVal) {
				if(newVal > 0){
					this.loadRefreshComments(false);
				}
			},
		},
	},
	methods: {
		toSliderUrl(type, id){
			let that = this;
			uni.wen.toUrl(type, id, that);
		},
		datainit(){
			let that =  this;
			that.comments = [];
			that.cPage = 1;
			that.isCommentLoadingShow = false;
			that.isCommentEndPage = false;
			that.commentSkeletonLoad = true;
			that.commentIsNull = false;
		},
		previewImgFunc(e) {
			let that = this;
			let url = e.currentTarget.dataset.src;
			var list = e.currentTarget.dataset.list;
			let styleNames = that.$store.state.config.img.styleNames || new Array();
			var imagesArr = [];

			if(url && styleNames){
				for (var i = 0; i < styleNames.length; i++) {
					if(styleNames[i].charAt(0) == '/'){
						url = url.replace(styleNames[i], '');
					}
				}
			}

			if(list){
				for (var j = 0; j < list.length; j++) {
					let img_ = list[j].img_url;
					for (var i = 0; i < styleNames.length; i++) {
						if(styleNames[i].charAt(0) == '/'){
							img_ = img_.replace(styleNames[i], '');
						}
					}
					imagesArr.push(img_);
				}
			}else{
				imagesArr = [url];
			}

			uni.previewImage({
				current: url,
				urls: imagesArr
			});
			return false;
		},
		tapComment(commentId,replyUserId,replyName){
			let that = this;
			that.$emit('tapComment', {
				commentId,
				replyUserId,
				replyName,
			});
		},
		getCommentByCommentId(comment_id, index){
			let that = this;
			let comments = that.comments;

			if( comments[index].id != comment_id ){
				uni.showToast({
					title: '错误',
					icon: 'none'
				})
				return false;
			}

			if(comments[index].child_is_last_page){
				uni.showToast({
					title: '没有更多回复了',
					icon: 'none'
				})
				return false;
			}

			comments[index].child_loading = true;
			that.comments = comments;

			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'comment/byCommentId', {
				comment_id: comments[index].id,
				page: comments[index].child_page,
				begin_id: comments[index].child_current_max_id
			}).then(function(res) {
				if(res.status){
					
					if(res.data.current_page != comments[index].child_page){
						return false;
					}
					
					let data = res.data;

					if(data.data && data.data.length > 0){
						comments[index].child = comments[index].child.concat(data.data);
						comments[index].child_page = data.current_page + 1;
						if(data.data.length < 10){
							comments[index].child_is_last_page = true;
						}else{
							comments[index].child_is_last_page = false;
						}
					}else{
						comments[index].child_is_last_page = true;
					}
					comments[index].child_loading = false;
					that.comments = comments;

				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
		},
		loadRefreshComments(refresh){
			let that = this;
			if(refresh === true){
				that.comments = [];
				that.cPage = 1;
				that.isCommentLoadingShow = false;
				that.isCommentEndPage = false;
				that.commentSkeletonLoad = true;
				that.commentIsNull = false;

			}else{
				if(that.isCommentEndPage){
					return false;
				}
				if(that.isCommentEndPage == false){
					that.cPage = that.cPage + 1;
					that.isCommentLoadingShow = true;
					that.isCommentEndPage = false;
				}
			}

			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'comment/byPostsId', {
				posts_id: Math.abs(that.postsId),
				page: that.cPage
			}).then(function(res) {
				if(res.status){
					let data = res.data;

					if(data.data && data.data.length > 0){
						that.comments = that.comments.concat(data.data);
						that.cPage = data.current_page;
						if(data.data.length < 10){
							that.isCommentLoadingShow = true;
							that.isCommentEndPage = true;
							that.$emit('commentRefreshStatus', 0);
						}else{
							that.isCommentLoadingShow = false;
							that.isCommentEndPage = false;
							that.$emit('commentRefreshStatus', 1);
						}
					}else{
						if(refresh){
							that.commentIsNull = true;
						}
						that.isCommentEndPage = true;
						that.$emit('commentRefreshStatus', 0);
					}
					that.commentSkeletonLoad = false;

				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
		},
		tapCommentlike(index, id) {
			let that = this;
			uni.wen.util.doVibrateShort()
			uni.wen.util.request(
				uni.wen.api.ApiRootUrl + 'comment/like/add', {
					comment_id: id
				},
				'POST'
			).then(function(res) {
				uni.loading(false);
				if (res.status) {

					let comments = that.comments;

					if (comments[index].is_like) {
						comments[index].like_count -= 1;
					} else {
						comments[index].like_count += 1;
					}

					comments[index].is_like = !comments[index].is_like;
					that.comments = comments;

				}else{
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				}
			});
		},
		//喜欢评论的评论
		tapCommentslike(pindex, index, id) {
			let that = this;

			uni.wen.util.doVibrateShort()

			uni.wen.util.request(
				uni.wen.api.ApiRootUrl + 'comment/like/add', {
					comment_id: id
				},
				'POST'
			).then(function(res) {
				uni.loading(false);
				if (res.status) {

					let comments = that.comments;

					if (comments[pindex].child[index].is_like) {
						comments[pindex].child[index].like_count -= 1;
					} else {
						comments[pindex].child[index].like_count += 1;
					}

					comments[pindex].child[index].is_like = !comments[pindex].child[index].is_like;
					that.comments = comments;

				}else{
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				}
			});
		},
		//删除评论
		tapDeleteComment(index, id) {
			let that = this;
			uni.showModal({
				title: '提示',
				content: '确定要删除您的这条评论吗？',

				success(res) {
					if (res.confirm) {
						uni.wen.util.request(
							uni.wen.api.ApiRootUrl + 'comment/delete', {
								id: id
							},
							'POST'
						).then(function(sec) {
							if (sec.status) {

								let comments = that.comments;
								comments.splice([index], 1);
								that.comments = comments;

								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
							}else{
								uni.showToast({
									title: sec.message,
									icon: 'none'
								})
							}
						});
					} else if (res.cancel) {}
				}
			})
		},

		//删除评论的评论
		tapDeleteComments(pindex, index, id) {
			let that = this;
			uni.showModal({
				title: '提示',
				content: '确定要删除您的这条评论吗？',

				success(res) {
					if (res.confirm) {
						uni.wen.util.request(
							uni.wen.api.ApiRootUrl + 'comment/delete', {
								id: id
							},
							'POST'
						).then(function(sec) {
							if (sec.status) {

								let comments = that.comments;
								comments[pindex].child.splice([index], 1);
								that.comments = comments;

							}
						});
					} else if (res.cancel) {}
				}
			});
		},
		tapStickyComment(index, id) {
			let that = this;
			uni.wen.util.request(
				uni.wen.api.ApiRootUrl + 'comment/sticky', {
					id: id
				},
				'POST'
			).then(function(sec) {
				if (sec.status) {

					let comments = that.comments;
					comments[index].is_sticky = !comments[index].is_sticky;
					that.comments = comments;

					uni.showToast({
						title: '操作成功',
						icon: 'none'
					});
					setTimeout(function() {
						that.loadRefreshComments(true);
					}, 500);
				}else{
					uni.showToast({
						title: sec.message,
						icon: 'none'
					})
				}
			});
		},
	},
}
</script>

<style lang="scss" scoped>

$comment-author-bg-color: #fc3a72; // 作者标识背景色（默认值：#f6eded ）
$comment-author-color: #ffffff; // 作者标识颜色（默认值：#fc3a72 ）	
$comment-list-sex-display: inline-block; // 文章列表是否显示性别，如果不想显示改为：none （默认值：inline-block ）


.flex-row{
	display: flex;
}

.comment-scroll{
	width: 750rpx;
	height: 1000rpx;
}
.comment-scroll.scene_9{
	/* #ifndef APP-NVUE */
	height: auto;
	.dialog_comments {
		height: auto;
	}
	/* #endif */
}
.dialog_comments {
	width: 750rpx;
	height: 1000rpx;
	.comment-avatar-quick {
		width: $page-content-body-width;
	    display: flex;
		/* #ifndef APP-NVUE */
		margin:15rpx auto 0 ;
		/* #endif */
		/* #ifdef APP-NVUE */
		margin-top: 15rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		margin-bottom: 0;
		/* #endif */

		justify-content: space-between;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		.left{
			._image{
				width: 65rpx;
				height: 65rpx;
				border-radius: 100%;
				background-color: #f5f5f5;
			}
		}
		.right{
			width: 100%;
			height: 65rpx;
			line-height: 65rpx;
			margin-left: 18rpx;
			@include background_color(page-box-item2-background-color);
			@include color(color-lightest-dark);
			border-radius: 100rpx;
			/* #ifndef APP-NVUE */
			text-indent: 30rpx;
			/* #endif */
			font-size: $uni-font-size-base;
			display: flex;
			justify-content: space-between;
			.mini-icon{
				/* #ifdef APP-NVUE */
				display: flex;
				/* #endif */
				/* #ifndef APP-NVUE */
				display: inline;
				/* #endif */
				margin-right: 20rpx;
				font-size: $uni-font-size-medium;
				@include color(color-lightest-dark);
			}
		}
	}
	.comment-reply {

		/* #ifndef APP-NVUE */
		margin: 30rpx auto;
		/* #endif */
		/* #ifdef APP-NVUE */
		margin-top: 30rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		margin-bottom: 30rpx;
		/* #endif */

		width: $page-content-body-width;
		.comment-reply-item {
		    margin-bottom: 20rpx;


			.comment-header {
			    display: flex;
			    justify-content: space-between;
				height: 65rpx;
				line-height: 65rpx;
				/* #ifndef APP-NVUE */
				max-height: 65rpx;
				/* #endif */
				/* #ifdef APP-NVUE */
				height: 65rpx;
				/* #endif */
				position: relative;
			}

			.comment-header-left {
			    display: flex;
			    align-items: center;
				flex-direction: row;
			}
			.comment-avatar-wrap{
				margin-right: 20rpx;
				position: relative;
				height: 65rpx;
				/* #ifndef APP-NVUE */
				max-height: 65rpx;
				/* #endif */
				/* #ifdef APP-NVUE */
				height: 65rpx;
				/* #endif */
				display: flex;
				padding-top: 4rpx;
				/* #ifndef APP-NVUE */
				box-sizing: border-box;
				/* #endif */
				.comment-avatar {
				    display: flex;
				    width: 65rpx;
				    height: 65rpx;
				    border-radius: 100%;
				    @include background_color(page-box-item-background-color);
				}
				.comment-avatar-frame{
					position: absolute;
					top: 0;
					left: 0;
					width: 65rpx;
					height: 65rpx;
					transform: scale(1.25);
				}
				.avatar-authentication-icon{
					position: absolute;
					bottom: -10%;
					right: -20%;
					@include background_color(page-box-background-color);
					border-radius: 50%;
					height: 16px;
					line-height: 16px;
				}
			}

			.comment-header.sub{
				height: 50rpx;
				line-height: 50rpx;
				/* #ifndef APP-NVUE */
				max-height: 50rpx;
				/* #endif */
				/* #ifdef APP-NVUE */
				height: 50rpx;
				/* #endif */
				.comment-avatar-wrap.sub{
					height: 50rpx;
					/* #ifndef APP-NVUE */
					max-height: 50rpx;
					/* #endif */
					/* #ifdef APP-NVUE */
					height: 50rpx;
					/* #endif */
					.comment-avatar {
					    width: 50rpx;
					    height: 50rpx;
					}
					.comment-avatar-frame{
						width: 50rpx;
						height: 50rpx;
						transform: scale(1.25);
					}
					.avatar-authentication-icon{
						bottom: -10%;
						right: -20%;
						height: 14px;
						line-height: 14px;
						font-size: 14px;
					}
				}
			}



			.comment-user-date{
				display: flex;
				flex-direction: row;
				.comment-author-name {
				    font-size: $uni-font-size-sm-base;
				    @include color(color-lightest-dark);
				    overflow: hidden;
				    text-overflow: ellipsis;
				    /* #ifndef APP-NVUE */
					max-width: 260rpx;
				    white-space: nowrap;
				    /* #endif */
					/* #ifdef APP-NVUE */
					width: 260rpx;
					/* #endif */
				}
				.subcomment-author-name {
				    font-size: $uni-font-size-sm-base;
				    @include color(color-lightest-dark);
					/* #ifndef APP-NVUE */
					max-width: 260rpx;
					/* #endif */
					/* #ifdef APP-NVUE */
					width: 260rpx;
					/* #endif */
				    overflow: hidden;
				    text-overflow: ellipsis;
				    /* #ifndef APP-NVUE */
				    white-space: nowrap;
				    /* #endif */
				}
				.comment-header-label {
				    width: 28rpx;
					font-size: $uni-font-size-base;
				    margin-left: 8rpx;
					display: flex;
				}
				.comment-header-label.vip-icon{
					transform: translateY(3rpx);
				}
				.comment-header-label.lv-icon{
					width: 50rpx;
					// padding-left: 14rpx;
					font-size: 42rpx;
				}
				.comment-header-label.gender-m-icon, .comment-header-label.gender-w-icon{
					/* #ifndef APP-NVUE */
					display: $comment-list-sex-display;
					/* #endif */
				}

				.comment-zuozhe{
				    padding: 0;
					width: 60rpx;
				    margin: 0 6rpx;
					position: relative;
					text-align: center;
					._text{
						position: absolute;
						/* #ifndef APP-NVUE */
						top: calc( 50% - 17rpx );
						/* #endif */
						/* #ifdef APP-NVUE */
						top: 40%;
						top: calc( 50% - 17rpx );
						/* #endif */
						width: 56rpx;
						height: 28rpx;
						font-size: 15rpx!important;
						line-height: 28rpx;
						background-color: $comment-author-bg-color;
						font-weight: normal;
						color: $comment-author-color;
						/* #ifndef APP-NVUE */
						white-space: nowrap;
						/* #endif */
						border-radius: 15rpx;
					}
				}
			}

			.comment-header-right {
			    display: flex;
				position: absolute;
			    align-items: center;
				flex-direction: column;
				height: 80rpx;
				width: 60rpx;
				right: 0;
				top: 10rpx;
				line-height: 40rpx;
				._view {
				    font-size: $uni-font-size-sm;
					@include color(color-lightest-dark);
				}
				.mini-xihuan-kongxin,.mini-xihuan-shixin{
					font-size: 25rpx;
					@include color(color-darkest);
				}
				.mini-icon.mini-xihuan-shixin {
					color: $uni-color-love !important;
				}
				._image {
				    width: 30rpx;
				    height: 30rpx;
				    /* #ifndef APP-NVUE */
				    vertical-align: bottom;
				    /* #endif */
				}
				._text {
				    font-size: $uni-font-size-sm;
				    line-height: 24rpx;
				    padding-left: 10rpx;
				    @include color(color-lightest-dark);
					margin-right: 16rpx;
					/* #ifndef APP-NVUE */
					white-space: nowrap;
					/* #endif */
				}

			}

			.commentconent {
			    display: flex;
			    justify-content: flex-start;
			}
			.comment-content {
			    position: relative;
			    padding: 0 66rpx 0 80rpx;
			    font-size: $uni-font-size-base;
			    @include color(color-light-dark);
			}
			
			.comment_content_raw {
			    position: relative;
			    padding: 0 66rpx 0 80rpx;
			    font-size: $uni-font-size-base;
			    @include color(color-light-dark);
			}
			
			.comment-content ._text {
			    overflow: hidden;
			    /* #ifndef APP-NVUE */
			    word-wrap: break-word;
			    /* #endif */
			}

			.replay-content {
			    padding: 20rpx 0 1rpx 20rpx;
				position: relative;
			}

			.replay-more{
				color: #366092;
				font-size: $uni-font-size-base;
				padding: 20rpx 0 20rpx 100rpx;
			}

			.contentinfo {
			    font-size: $uni-font-size-base;
				word-break: break-word;
				.post-author-with-comment{
					display: flex;
					.author-withed{
						display: flex;
						width: 100rpx;
						background-color: #f6f6f6;
						color: #838383;
						font-size: 16rpx;
						padding: 8rpx 0;
						border-radius: 30rpx;
						text-align: center;
						margin-bottom: 10rpx;
						justify-content: center;
					}
				}
			}

			.contentinfo .format_time {
			    @include color(color-lightest-dark);
			    margin: 8rpx 0;
			}

			.comment-content .contentinfo{
				.mini-icon{
					margin-right: 8rpx;
				}
			}
			.comment-content .contentinfo{
				.sticky-icon{
					color: indianred;
					display: flex;
				}
			}
			.comment-split-line {
			    border-bottom: 1px solid;
				@include border_color(border-color-box-item-background-color);
				margin: 20rpx 0;
			}
			.sub-comments{
				margin-left: 70rpx;
				border-radius: 14rpx;
				overflow: hidden;
			}

			.comment-content .format_time {
			    font-size: 22rpx;
			    @include color(color-lightest-dark);
			    /* #ifdef APP-NVUE */
			    display: flex;
			    /* #endif */
				/* #ifndef APP-NVUE */
				display: inline-flex;
				align-self: flex-end;
				/* #endif */
				margin-left: 15rpx;
			}

			.comment-img-list {
			    width: 180rpx;
			    height: 180rpx;
			    border-radius: 8rpx;
			    /* #ifndef APP-NVUE */
			    animation: fadeIn 1s ease;
			    /* #endif */
			}
			.comment-ad-wrap{
				border-radius: 14rpx;
				overflow: hidden;
				position: relative;
				.ad-content{
					width: $page-content-body-width;
					/* #ifndef APP-NVUE */
					margin: auto;
					/* #endif */
					/* #ifdef APP-NVUE */
					margin-left: 20rpx;
					margin-right: 20rpx;
					/* #endif */
				}
				._image{
					border-radius: 14rpx;
					width: 100%;
					/* #ifndef APP-NVUE */
					margin: auto;
					/* #endif */
				}
				.mini-adtip{
					position: absolute; top: 8rpx; left: 8rpx; color: #cccccc; z-index: 9;opacity: 0.6;
				}
			}

			.content-before{
				._text{
					@include color(color-lightest-dark);
				}
			}
			.content-before,.content-after{
				/* #ifdef APP-NVUE */
				display: flex;
				/* #endif */
				/* #ifndef APP-NVUE */
				display: inline-flex;
				/* #endif */
				flex-direction: row;
			}

		}
	}
	.sub-comments .replay-content:last-child{
		padding-bottom: 20rpx;
	}
}
</style>
