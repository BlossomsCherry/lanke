<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="我的二维码" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="note-list-page-content">
			
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import dynamicBox from '@/components/dynamic/box.vue';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		dynamicBox
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 38,
			
			voterList: [],
			page: 1,
			isNull: false,
			isLastPage: false,
			loadmoreShow: false,
			
			
			formData: {
				keyword: '',
				template: [],
				orderBy: 'created_at',
				order: 'desc',
				master: 1,
				player: 0,
				voted: 0
			},
			
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(38, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		getvoterList() {
		  let that = this;
		  if(that.page == 1){
			 uni.loading(true);
			 that.setData({
				isLastPage: false,
				loadmoreShow: false,
				isNull: false
			 });
		  }
		  
		  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/list', {
		    keyword: that.formData.keyword,
			template: (Array.isArray(that.formData.template) && that.formData.template.length > 0) ? that.formData.template.join(',') : '',
			orderBy: that.formData.orderBy,
			order: that.formData.order,
			master: that.formData.master,
			player: that.formData.player,
			voted: that.formData.voted,
			isTenant: false,
		    page: that.page,
			user_id: that.user_id
		  }).then(function (res) {
			uni.stopPullDownRefresh();
			if(that.page == 1){
				uni.loading(false);
			}
			
			if(res.status){
		
				if(res.data.current_page != that.page){
					return false;
				}
				let data = res.data;
				let args = {};
				
				args.tenant_id = that.$store.state.tenant.tenant_id;
							
				if (data.data.length <= 0 && that.page == 1) {
				  args.isNull = true;
				}
							
				if (data.data.length < 10) {
				  args.isLastPage = true;
				  args.loadmoreShow = true;
				}else{
					args.isLastPage = false;
					args.loadmoreShow = false;
				}
				
				
				if(data.data && data.data.length > 0){
					if(that.page == 1){
						args.voterList = data.data;
					}else{
						args.voterList = that.voterList.concat(data.data);
					}
					args.page = data.current_page;
				}
				
				that.setData(args);
			}
		
		    
		  });
		}
	}
}
</script>

<style lang="scss" scoped>
@import './list.scss';
</style>