<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="模板中心" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="vote-template-list-page">
			<view class="inner">
				<view style="height: 30rpx;"></view>
				<view class="template-list-wrap">
					<view class="template-item" v-for="(item, index) in templateList" :key="index">
						<image class="cover" :src="item.cover"></image>
						<view class="name u-line-1">{{ item.name }}</view>
						<view class="button-box">
							<view class="btn" @tap.stop.prevent="toSliderUrl(6, '/pagesV/voter/creat/creat?template=' + item.id)">使用</view>
						</view>
					</view>
				</view>
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


const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 125,
			templateList: [],
			page: 1,
			isLastPage: false,
			loadmoreShow: false,
			listLoading: true,
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(125, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.getVoterTemplateList();
	},
	onPullDownRefresh: function () {
	    let that = this;
	    that.setData({
	    	templateList: [],
	    	page: 1,
	    	isLastPage: false,
	    	loadmoreShow: false,
	    	listLoading: true,
	    });
	    that.getVoterTemplateList();
	},
	onReachBottom: function() {
		let that = this;
		if(!that.isLastPage && that.templateList.length > 0){
			that.setData({
				loadmoreShow: true,
				isLastPage: false,
				page: that.page + 1
			});
			that.getVoterTemplateList();
		}
	},
	methods: {
		getVoterTemplateList(){
			let that = this;

			if(that.page == 1){
				that.setData({
					isLastPage: false,
					loadmoreShow: false,
					listLoading: true,
					templateList: [],
				})
			}
			
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/template/list', {
				page: that.page,
			}).then(function(res) {
				
				if(that.page == 1){
					uni.stopPullDownRefresh();
				}
				
				if (res.status) {
					if(res.data.current_page != that.page){
						return false;
					}
					
					let data = res.data;
					let args = {};

					if(data.data && data.data.length > 0){
						args.templateList = that.templateList.concat(data.data);
						args.page = data.current_page;
						if(data.data.length >= 10){
							args.loadmoreShow = false;
							args.isLastPage = false;
						}else{
							args.loadmoreShow = true;
							args.isLastPage = true;
						}
					}else{
						args.loadmoreShow = true;
						args.isLastPage = true;
					}
					args.listLoading = false;
					that.setData(args);
					
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
@import './list.scss';
</style>