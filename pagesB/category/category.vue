<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'" :scene="87">
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
			return ' calc( 100vh - ' + this.$store.state.CustomBar + 'px )';
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
	@import './category.scss';
</style>