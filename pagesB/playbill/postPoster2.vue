<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="rgba(255, 255, 255, 0);">
		</navBar>
		<view class="post2-page">
			<view class="inner">
				<block v-if="poster && poster.poster2 && poster.poster2.content && poster.poster2.content.length > 0">
					<poster2 :postersData="poster.poster2"></poster2>
				</block>
			</view>
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import poster2 from '@/pagesB/components/poster2/poster2.vue'
const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		poster2
	},
	computed:{
		config_about:{
			get(){
				let that = this;
				return that.$store.state.config.about;
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 85,
			src: '',
			posts_id: 0,
			poster: {
			  // 笔记图片
			  image: '',
			  // 用户昵称
			  nickname: '',
			  // 用户头像
			  avatar: '',
			  // 内容
			  content: '',
			  // 二维码
			  qrImage: '',
			  glass: '',
			  tip: '',
			  poster2: {

			  }
			}
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(85, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.posts_id= options.id;
		
		that.init_data();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		save_phone(){
			let that = this;
			let posterRef = this.$refs.poster;
			posterRef.saveImageToPhotosAlbum(that.src);
		},
		init_data(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/makeShowQcode', { posts_id: that.posts_id }).then(function (res) {
			  if (res.status) {
			
			    that.poster = {
			      image: res.data.img,
			      nickname: res.data.user.user_name,
			      avatar: res.data.user.user_avatar,
			      content: res.data.content,
			      qrImage: res.data.qrcode,
			      glass: res.data.glass,
			      tip: res.data.tip,
				  poster2: res.data.poster2,
			    };
			    that.sociaList = res.data.social;
			
			    setTimeout(function(){
					// that.poster_init()
				}, 200);
			  } else {
			    uni.showToast({
			      title: res.message,
			      icon: 'none',
			      duration: 1500
			    });
			  }
			});
		},
		async poster_init() {
			let that = this;
			let posterRef = this.$refs.poster;
			uni.loading(true);

			await posterRef.init();
			// var namebottext = that.poster.tip?("#"+that.poster.tip):'';		//话题
			this.src = await posterRef
				.setBackgroundColor("#ffffff")
				.addRect(0, 0, 375, 500, "#FEFEFE") 
				.addText(that.config_about.name, 230, -20, 80, "#efefef", 1000, false)
				// .addText("“", 0, 120, 120, "#fcc8cb", 453, false)
				.addImage(that.poster.poster2.yinhao, 25, 35, 60, 60,false)
				.addText(that.poster.content, 50,70, 24, "#111111", 250, true, 40)
				.addImage(that.poster.poster2.image, 50, 120, 275, 150,false)		//图片
				.addImage(that.poster.avatar, 50, 300, 35, 35,true)		//头像
				.addText(that.poster.nickname, 100,310, 14, "#111111", 250)		//昵称
					
				.addImage(that.poster.poster2.xuxian, 0, 310, 375, 100,false)

				.addImage(that.poster.qrImage, 50, 390, 75, 75, false)				//二维码
				.addText(that.config_about.name, 135,410, 14, "#111111", 250)		//昵称
				.addText(that.poster.poster2.tip, 135,432, 13, "#5b5b5b", 250)		//二维码提示
				.draw();
			uni.loading(false);
			this.$forceUpdate();
		},
	}
}
</script>

<style lang="scss" scoped>
.post2-page{
	width: 750rpx;
	height: 100vh;
	.inner{
		height: 80vh;
		width: $page-content-body-width;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		.the_poster{
			width: 100%;
			height: 1000rpx;
		}
		.save{
			position: fixed;
			bottom: calc( env(safe-area-inset-bottom) + 20rpx );
			left: 50%;
			transform: translateX(-50%);
			background: $uni-color-follow;
			color: $uni-color-follow-font;
			padding: 10rpx 35rpx;
			border-radius: 30rpx;
			font-size: $uni-font-size-medium;
			text-align: center;
		}
	}
}
</style>