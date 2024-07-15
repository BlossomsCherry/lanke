
<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="笔记推广" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			<!-- #ifdef APP || H5 -->
			<view slot="right" class="lxy-nav-bar__logo">
			</view>
			<!-- #endif -->
		</navBar>
		<view class="page-block-gap"></view>
		<view class="item">
			<view class="inner frist">
				<view class="title flex-row">
					<view class="left">推广笔记</view>
					<view class="right"></view>
				</view>
				<view class="con flex-row">
					<view class="left">
						<image class="_image"
						:src="img"
						mode="widthFix"></image>
					</view>
					<view class="right flex-column">
						<view class="line-1 u-line-1">{{ title }}</view>
						<view class="line-2 u-line-1">笔记作者：{{author.user_name}}</view>
						<view class="line-3 u-line-1">发布时间：{{ created_at }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="page-block-gap"></view>
		<view class="item flex-column">
			<view class="inner second">
				<view class="title flex-row">
					<view class="left">推广设置</view>
					<view class="right"></view>
				</view>
				<view class="con flex-column">
					<block v-if="is_promoted">
						<view class="box1">
							<view class="line--1">预计最低推广时间</view>
							<view class="line--2">预估仅供参考</view>
							<view class="line--3">{{ weight }}</view>
						</view>
					</block>
					<block v-else>
						<view class="box1 not_promoted">
							<view class="line--1">当前帖子热度持续时间</view>
							<view class="line--2">热度不足</view>
							<view class="line--3">{{ weight }}</view>
						</view>
					</block>
					
					<u-grid :border="false" @click="gridClick">
					    <u-grid-item :name="index" v-for="(item,index) in selectList" :key="index" style="margin-bottom: 20rpx;">
					    	<view :class="'select ' + (seletedIndex == index ? 'cur' : '') ">
					    		{{ item.tip }}
					    	</view>
					    </u-grid-item>
					</u-grid>
					
				</view>
			</view>
		</view>
		<view class="page-block-gap"></view>
		<view class="bottom flex-column">
			<view class="inner flex-row">
				<view class="left flex-column">
					<block v-if="selectList && selectList[seletedIndex]">
						<block v-if="selectList[seletedIndex].credit_type != 1">
							<view class="price">
								<i class="mini-icon mini-Gold_coin_01" style="color: #dd6572;"></i>
								<view class="num">{{ selectList[seletedIndex].price }}</view>
							</view>
						</block>
						<block v-else>
							<view class="price">
								<view class="num">￥{{ selectList[seletedIndex].price }}</view>
							</view>
						</block>
					</block>
				</view>
				<view class="right flex-column">
					<!-- #ifdef MP-WEIXIN -->
					<block v-if="global__platform__ == 'ios' && config_pay_mini2mp == 1">
						<view class="btn" @tap.stop.prevent="promotion_pay">
							联系客服
						</view>
					</block>
					<block v-else>
						<view class="btn" @tap.stop.prevent="promotion_pay">
							立即支付
						</view>
					</block>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<view class="btn" @tap.stop.prevent="promotion_pay">
						立即支付
					</view>
					<!-- #endif -->
				</view>
			</view>
		</view>
		
		<servicer-popup :pop="popNum" :scene="84" :scene_id="post_id"></servicer-popup>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import servicerPopup from "@/components/servicer-popup/servicer-popup";

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		servicerPopup
	},
	computed:{
		config_app_coins_name:{
			get(){
				let that = this;
				if(that.$store.state.config.app.coins){
					return that.$store.state.config.app.coins.name;
				}
				return '硬币';
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 84,
			post_id: 0,
			title: '',
			img: '',
			created_at: '',
			author: {},
			weight: '',
			
			is_promoted: false,
			seletedIndex: 0,
			selectList: [],
			
			popNum: 0
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(84, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		that.post_id = options.id;
		that.getPostsPpromotion();
	},
	onPullDownRefresh: function() {
		let that = this;
		that.getPostsPpromotion();
	},
	methods: {
		promotion_pay(){
			let that = this;
			
			if(that.selectList[that.seletedIndex].credit_type == 1){
				
				// #ifdef MP-WEIXIN
				if(that.$store.state.platform == 'ios' && that.$store.state.config?.pay?.mini2mp == 1){
					that.popNum += 1;
					return false;
				}
				// #endif
				
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
				
				let price = that.selectList[that.seletedIndex].price;

				that.myToast({
					type:'payway',
					content: '付费推广',
					price: price,
					isVipPrice: false,
					timeout: 2000,
					isClick:true,
					paywaylist: paywaylist,
					order: {
						type: 6,
						post_id: that.post_id,
						index: that.seletedIndex,
					}
				});
			}else{
				
			}
		},
		gridClick(index){
			let that = this;
			that.seletedIndex = index;
		},
		getPostsPpromotion(methed = 'GET'){
		  let that = this;
		  uni.loading(true);
		  
		  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/promotion', {
			  post_id: that.post_id
		  }, methed).then(function(res) {
			  uni.loading(false);
			   if(res.status){
					that.title = res.data.title;
					that.img = res.data.img;
					that.created_at = res.data.created_at;
					that.author = res.data.author;
					that.weight = res.data.weight;
					that.is_promoted = res.data.is_promoted;
					that.selectList = res.data.selectList;
			   }else{
					uni.showToast({
						title: res.message,
						icon:'none'
					});
			   }
		  }).finally(function(){
			  uni.stopPullDownRefresh();
		  });
		}
	}
}
</script>

<style lang="scss" scoped>
.item{
	width: 750rpx;
	.inner{
		width: $page-content-body-width;
		margin: auto;
		@include background_color(page-box-background-color);
		border-radius: $uni-border-radius-lg;
		padding: 20rpx;
		box-sizing: border-box;
		.title{
			.left{
				@include color(color-light-dark);
			}
		}
		.con{
			margin-top: 30rpx;
		}
	}
	.frist.inner{
		.con{
			.left{
				margin-right: 30rpx;
				._image{
					width: 160rpx;
					border-radius: $uni-border-radius-base;
					max-height: 300rpx
				}
			}
			.right{
				.line-1{
					@include color(color-light-dark);
					margin-bottom: 20rpx;
				}
				.line-2{
					@include color(color-lighter-dark);
					margin-bottom: 20rpx;
				}
				.line-3{
					@include color(color-lighter-dark);
				}
			}
		}
	}
	.second.inner{
		.con{
			.box1{
				margin-bottom: 30rpx;
				.line--1{
					font-size: $uni-font-size-base;
					width: 100%;
					margin-bottom: 20rpx;
					@include color(color-dark);
				}
				.line--2{
					font-size: $uni-font-size-base;
					width: 100%;
					@include color(color-lighter-er-dark);
					margin-bottom: 20rpx;
				}
				.line--3{
					font-size: $uni-font-size-lg;
					width: 100%;
					color: $uni-color-primary;
					text-align: center;
				}
			}
			.box1.not_promoted{
				.line--2{
					@include color(color-error);
				}
				.line--3{
					@include color(color-lightest-est-dark);
				}
			}
			.select{
				font-size: $uni-font-size-sm-base;
				height: 36rpx;
				text-align: center;
				padding: 10rpx 0;
				border-radius: 30rpx;
				@include background_color(page-box-item2-background-color);
				width: 160rpx;
				@include color(color-light-dark);
			}
			.select.cur{
				@include background_color(follow-background-color);
				@include color(color-follow-font);
			}
		}
	}
}
.bottom{
	height: 120rpx;
	padding-bottom: env(safe-area-inset-bottom);
	position: fixed;
	bottom: 0;
	width: 750rpx;
	@include background_color(page-box-background-color);
	justify-content: center;
	.inner{
		height: 120rpx;
		justify-content: space-between;
		width: $page-content-body-width;
		margin: auto;
		.left{
			height: 120rpx;
			justify-content: center;
			.price{
				height: 48rpx;
				display: flex;
				@include color(color-light-dark);
				.num{
					font-size: $uni-font-size-medium;
					line-height: 48rpx;
				}
				.mini-icon{
					display: inline;
					font-size: 48rpx;
					margin-right: 10rpx;
				}
			}
		}
		.right{
			justify-content: center;
			height: 120rpx;
			.btn{
				height: 60rpx;
				line-height: 60rpx;
				box-sizing: border-box;
				padding-left: 24rpx;
				padding-right: 24rpx;
				border-radius: $uni-border-radius-lg-est;
				background-color: $uni-color-follow;
				color: $uni-color-follow-font;
				text-align: center;
				font-size: $uni-font-size-sm-base;
			}
		}
	}
	
}

</style>