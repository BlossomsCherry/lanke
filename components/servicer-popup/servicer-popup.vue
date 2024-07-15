<template>
	<u-popup :show="popup" @close="shutPopup" :zIndex="99999991009" mode="center" :safeAreaInsetBottom="false">
		<view class="servicer-popup-box">
			<view class="inner">
				<image class="_image" :src="code" @tap.stop.prevent="preview" :show-menu-by-longpress="true"></image>
				<view class="tips">由于ios虚拟产品支付限制，苹果用户请点击二维码关注公众号客服</view>
				<view class="btn" @tap.stop.prevent="shutPopup">我知道了</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name:"servicer-popup",
		computed:{
			test: {
				get(){
					
				},
				set(v){}
			},
		},
		data() {
			return {
				popup: false,
				code: '',
			};
		},
		mounted() {
			
		},
		props: {
			pop: {
				type: Number,
				default: 0,
			},
			scene: {
				type: Number,
				default: 0
			},
			scene_id: {
				type: Number,
				default: 0
			},
		},
		watch: {
			pop: {
				handler: function (newVal, oldVal) {
					if(newVal > 0){
						this.shutPopup();
					}
				},
				immediate: false,
			},
		},
		methods: {
			preview(){
				this.shutPopup();
				uni.wen.toUrl(26, this.code, this);
			},
			shutPopup(){
				this.popup = !this.popup;
				if(this.popup){
					if(this.code && this.code.length > 0){
						
					}else{
						this.getCode();
					}
				}
			},
			getCode(){
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'aggregate/config', {
					type: 'get-withpara-mpservicer-code',
					code_action: 'scene',
					scene: that.scene,
					scene_id: that.scene_id
				}).then(function(res) {
					uni.loading(false);
					if (res.status) {
						that.code = res.data;
					} else {
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

<style lang="scss">
@import './servicer-popup.scss';
</style>