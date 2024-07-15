<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :title="page_title" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="tab-page-content">
			<block  v-if="tables.length > 0" >
				<wyb-table ref="table" @onCellClick="onCellClick" :headers="tables[tableIndex].headers" :contents="tables[tableIndex].contents" :height="contentHieght" :url-col="tables[tableIndex].urlCol" />
				<view class="worksheets" v-if="tables.length > 1">
					<view :class="'sheet ' + ( tableIndex == sindex ? 'curent' : '' )" v-for="(sheet, sindex) in worksheets" :key="sindex" @tap.stop.prevent="changeTable(sindex)">{{ sheet }}</view>
				</view>
			</block>
			<block v-else>
				<u-empty text="空" width="300" height="300" text-size="28"/>
			</block>
			
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import wybTable from '@/pages/common/components/wyb-table/wyb-table.vue';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		wybTable
	},
	computed:{
		contentHieght: {
			get() {
			  if(this.tables.length > 1){
				return ' calc( 100vh - ' + this.$store.state.CustomBar + 'px - 100rpx - env(safe-area-inset-bottom) )';
			  }else{
				return ' calc( 100vh - ' + this.$store.state.CustomBar + 'px )';
			  }
			}
		}
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 38,
			page_title: '',
			tableIndex: 0,
			tables: [
				
			],
			worksheets: []
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(38, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		// 针对某几个需要展示表格的场景
		// 1、组局的问卷信息
		if(options.type == 34){
			that.getBureauTable(options.id);
		}
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		onCellClick(e){
			let that = this;
			uni.wen.util.setClipboardData(e.content, '内容已复制');
			
			if(uni.wen.util.validatePhoneNumber(e.content)){
				uni.wen.toUrl(22, e.content, that);
			}
		},
		changeTable(index){
			this.tableIndex = index;
		},
		getBureauTable(id){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/process', {
				type: 'bureau_xlsx_table',
				bureau_id: id
			}, 'POST').then(res => {
				uni.loading(false);
				if(res.status){
					that.tables = res.data.tables;
					that.worksheets = res.data.worksheets;
					that.page_title = res.data.title;
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
				
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.worksheets {
    display: flex;
	overflow-x: scroll;
	.sheet{
		font-size: $uni-font-size-medium;
		padding: 20rpx 40rpx;
		@include color(page-color-light-dark);
		@include background_color(page-gray-er-background-color);
		white-space: nowrap;
	}
	.sheet.curent{
		@include background_color(follow-background-color);
		@include color(color-follow-font);
	}
}
</style>