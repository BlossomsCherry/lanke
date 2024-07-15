<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="店铺保证金" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
		<view class="guarantee-content">
			<view class="inner">
				<view class="page-block-gap"></view>
				<view class="margin-rest">
					<view class="line-1">总余额（元）</view>
					<view class="line-2 flex-row">
						<view class="num" v-if="myUserInfo.shop && myUserInfo.shop.id > 0">{{ myUserInfo.shop.margin_rest || 0 }}</view>
					</view>
					<view class="margin-need" v-if="myUserInfo.shop.margin_rest - myUserInfo.shop.margin_least < 0">待补缴金额：{{ myUserInfo.shop.margin_least - myUserInfo.shop.margin_rest }}</view>
					<view class="line-3 flex-row">
						<view class="recharge" @tap.stop.prevent="shutRechargeInputPopup">充值</view>
					</view>
				</view>
				<view class="page-block-gap"></view>
				<view class="guarantee-record-list">
					<view class="head flex-row">
						<view class="title">账户明细</view>
						<view class="filter"></view>
					</view>
					<block v-if="records && records.length > 0">
						<view class="guarantee-record-item flex-row" v-for="(item, index) in records" :key="index">
							<view class="left flex-row">
								<view class="icon flex-column">
									<view class="icon_" v-if="item.num > 0">充</view>
									<view class="icon_ kou" v-else>扣</view>
								</view>
								<view class="flex-column">
									<view class="title">{{ item.title }}</view>
									<view class="time">{{ item.created_at }}</view>
								</view>
							</view>
							<view class="right flex-column">
								<view class="num">￥{{ item.num }}</view>
							</view>
						</view>
						<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──"
							iconSize="28" fontSize="28" color="#989898" bgClass="page-box-item-background-color"/>
					</block>
					<block v-else>
						<u-empty text="空" width="300" height="300" text-size="28" />
					</block>
				</view>
			</view>
		</view>
		
		<u-popup :show="rechargeInputPopup" @close="shutRechargeInputPopup" :zIndex="99999991009" mode="bottom">
			<view class="recharge-input-wrap">
				<view class="inner">
					<view class="title flex-row">
						<view class="left">输入充值数额</view>
						<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutRechargeInputPopup"></i>
					</view>
					<view class="tip" v-if="myUserInfo.shop && myUserInfo.shop.id > 0">保证金余额：￥{{ myUserInfo.shop.margin_rest }} 最低应缴金额：￥ {{ myUserInfo.shop.margin_least || 0 }}</view>
					<view class="input-wrap">
						<view class="icon">￥</view>
						<input v-model="rechargeNum" type="digit" class="_input"/>
					</view>
					<view class="btn-wrap">
						<view :class="'btn ' + (rechargeNum > 0 ? '' : 'disable')" @tap.stop.prevent="rechargeGuarantee">确认充值</view>
					</view>
					<view class="height-p"></view>
				</view>
			</view>
		</u-popup>
		
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
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 108,
			
			records: [],
			page: 1,
			loadmoreShow: false,
			isLastPage: false,
			
			rechargeInputPopup: false,
			rechargeNum: 0
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(108, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.getGuaranteeRecords();
	},
	onPullDownRefresh: function () {
		let that = this;
		that.setData({
			records: [],
			page: 1,
			loadmoreShow: false,
			isLastPage: false,
			
			rechargeInputPopup: false,
			rechargeNum: 0
		});
		uni.wen.util.updateUserInfo();
		that.getGuaranteeRecords();
	},
	onReachBottom: function() {
		let that = this;
		if(!that.isLastPage){
			that.page = that.page + 1;
			that.getGuaranteeRecords();
		}
	},
	methods: {
		shutRechargeInputPopup(){
			let that = this;
			that.rechargeInputPopup = !that.rechargeInputPopup;
		},
		rechargeGuarantee(){
			let that = this;
			
			if(that.rechargeNum <= 0){
				uni.showToast({
					title: '请输入数额',
					icon: 'none'
				})
				return false;
			}
			
			let paywaylist = [1, 2];

			that.myToast({
				type:'payway',
				content: '店铺保证金充值',
				price: that.rechargeNum,
				timeout: 2000,
				isClick:true,
				paywaylist: paywaylist,
				order: {
					type: 8,
					rechargeNum: that.rechargeNum
				}
			});
			
		},
		getGuaranteeRecords(){
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/guarantee/record', {
				page: that.page,
				limit: 10
			}).then(function(res) {
				uni.stopPullDownRefresh();
				if(res.status){
					
					if(res.data.current_page != that.page){
						return false;
					}
					
					let data = res.data;
					let args = {};
					
					if (data.data && data.data.length > 0) {
						args.records = that.records.concat(data.data);
						if(data.data.length < 10){
							args.isLastPage = true;
							args.loadmoreShow = true;
						}else{
							args.isLastPage = false;
							args.loadmoreShow = false;
						}
					} else{
						args.isLastPage = true;
						args.loadmoreShow = true;
					}
					args.page = data.current_page;
					that.setData(args);
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
@import './guarantee.scss';
</style>