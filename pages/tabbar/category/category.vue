<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view :class="'mini-page-body ' + (isBack ? '' : 'tabbar') ">
		<navBar :back="isBack" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'" :scene="87">
			<view class="search-form" slot="center" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/list/list')">
				<view class="left_icon"><i class="mini-icon mini-sousuo1"></i></view>
				<view class="center-range">
					<view class="right_input">
						<view class="_input">输入关键词</view>
					</view>
				</view>
			</view>
		</navBar>
		
		<view class="category-page-content">
			<scroll-view scroll-y class="left-aside"  :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
				<view v-for="item in cats" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
					{{item.name}}
				</view>
			</scroll-view>
			<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
				<block v-for="item in cats" :key="item.id">
					<block v-if="item.sub">
						<view v-for="subitem in item.sub" :key="subitem.id" class="s-list" :id="'main-'+subitem.id">
							<text class="s-item">{{subitem.name}}</text>
							<view class="t-list" v-if="subitem.sub">
								<view class="t-item" v-for="(ssubitem, index) in subitem.sub" :key="index" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/list/list?cid='+ssubitem.id + '&cname=' + ssubitem.name)">
									<image class="_image" :src="ssubitem.pic"></image>
									<text>{{ssubitem.name}}</text>
								</view>
							</view>
						</view>
					</block>
				</block>
				<block>
					<view style="background-color: transparent;height: 80vh;"></view>
				</block>
			</scroll-view>
		</view>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{
		contentHieght: {
		  get() {
		    let that = this;
			if(that.isBack){
				return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px )';
			}else{
				// #ifdef MP
				return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px - 90rpx - env(safe-area-inset-bottom) )';
				// #endif
				// #ifdef APP
				return ' calc(100vh - ' + that.$store.state.CustomBar + 'px) ';
				// #endif
				// #ifdef H5
				return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px - 45px )';
				// #endif
			}
		  },
		  set(v) {}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 87,
			sizeCalcState: false,
			tabScrollTop: 0,
			currentId: 1,
			cats: [],
			isBack: false,
		}
	},
	onShow: function () {
		let that = this;
		// #ifdef MP-WEIXIN
		getApp().globalData.$mpTabbar = this.$mp.page.getTabBar();
		// #endif
		//  #ifdef MP
		// if ('function' == typeof this.getTabBar && this.getTabBar()) {
		//     this.getTabBar().setData({
		//         selected: 3
		//     });
		// }
		that.tabBarSetData({selected: 1});;
		// #endif
		//  #ifndef MP
		that.$store.commit('updateTabbarIndex', 1);
		// #endif
		that.updateScene(87, 0);
		
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
		
	},
	onLoad: function (options) {
		let that = this;
		
		if(options.back == 1){
			that.isBack = true;
		}
		
		that.globalOnloadProcess(options);
		that.getShopClassify();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	onShareAppMessage: function(res) {
		let that = this;
	
		return {
			title: '好物  - ' + that.$store.state.config.about.name,
			path: '/pages/tabbar/category/category?back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.$store.state.config.img.default_share
		};
	},
	onShareTimeline: function(res) {
		let that = this;
		return {
			title: '好物  - ' + that.$store.state.config.about.name,
			query: '' + 'back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.$store.state.config.img.default_share
		};
	},
	onTabItemTap : function(e) {
		// #ifndef MP-WEIXIN
		if(e.pagePath == 'pages/tabbar/category/category'){
			uni.wen.util.doVibrateShort();
		}
		// #endif
	},
	methods: {
		getShopClassify() {
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/classify', {
				hierarchy: 1
			}).then(function(res) {
				if(res.status){
					that.cats = res.data;
					if(that.cats){
						that.currentId = that.cats[0].id;
					}
					setTimeout(function(){
						that.calcSize();
					}, 500)
				}
			
			});
		},
		async loadData(){
			let list = await this.$api.json('cateList');
			list.forEach(item=>{
				if(!item.pid){
					this.flist.push(item);  //pid为父级id, 没有pid或者pid=0是一级分类
				}else if(!item.picture){
					this.slist.push(item); //没有图的是2级分类
				}else{
					this.tlist.push(item); //3级分类
				}
			}) 
		},
		//一级分类点击
		tabtap(item){
			let that = this;
			if(!that.sizeCalcState){
				that.calcSize();
			}
			for(let i = 0; i < that.cats.length; i++){
				if(item.id == that.cats[i].id){
					that.tabScrollTop = that.cats[i].sub[0].top;
					that.currentId = that.cats[i].id;
					break;
				}
			}
		},
		//右侧栏滚动
		asideScroll(e){
			let that = this;
			if(!this.sizeCalcState){
				this.calcSize();
			}
		},
		//计算右侧栏每个tab的高度等信息
		calcSize(){
			let that = this;
			let h = 0;
			that.cats.forEach(item=>{
				if(item.sub){
					item.sub.forEach(sitem => {
						let view = uni.createSelectorQuery().select("#main-" + sitem.id);
						view.fields({
							size: true
						}, data => {
							sitem.top = h;
							h += data.height;
							sitem.bottom = h;
						}).exec();
					})
				}
				
			})
			that.sizeCalcState = true;
		}
	}
}
</script>

<style lang="scss" scoped>
	.search-form{
		line-height: 68rpx;
		height: 68rpx;
		width: 100%;
		display: flex;
		border: 1px solid;
		@include border_color(border-color-lightest-est-dark);
		@include background_color(page-box-background-color);
		border-radius: 500px;
		.left_icon{
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin-right: 20rpx;
			margin-left: 20rpx;
			@include color(color-lightest-dark);
		}
		.center-range{
			display: flex;
			flex-direction: column;
			justify-content: center;
			max-width: 85%;
			overflow: hidden;
		}
		.right_input{
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 100%;
			._input{
				width: 95%;
				font-size: $uni-font-size-base;
				white-space: nowrap;
				@include color(color-lightest-dark);
			}
		}
	}
	.category-page-content {
		height: 100%;
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200rpx;
		height: 100%;
		@include background_color(page-box-background-color);
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
		font-size: $uni-font-size-base;
		@include color(color-light-dark);
		position: relative;
		&.active{
			@include color(color-primary);
			@include background_color(page-gray-background-color);
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36rpx;
				width: 8rpx;
				background-color: $uni-color-primary;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20rpx;
		height: 100%;
		@include background_color(page-body-background-color);
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70rpx;
		padding-top: 8rpx;
		font-size: $uni-font-size-base;
		@include color(color-dark);
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		@include background_color(page-box-background-color);
		padding-top: 30rpx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176rpx;
		font-size: $uni-font-size-sm-base;
		@include color(color-lighter-er-dark);
		padding-bottom: 30rpx;
		
		._image{
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 6rpx;
		}
	}
</style>