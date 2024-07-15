<template>
	<u-popup :show="popup" @close="shutPopup" :zIndex="99999991009" mode="bottom" :safeAreaInsetBottom="false">
		<view class="custom-form-warap">
			<view class="inner">
				<view class="title">
					{{ title }}
					<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutPopup"></i>
				</view>
				<view class="content">
					<scroll-view :scroll-y="true" class="_scroll_view">
						<view v-if="formDataResult && formDataResult.length > 0" class="form-item-list">
						    <view v-for="(item, index) in formDataResult" :key="index" class="form-item">
							  <view class="label-name u-line-1">{{ item.name }}</view>
							  <block>
								<view v-if="Array.isArray(item.qa)" class="right">
								  <radio-group @change="radioChange($event, index)">
									<view class="flex-row" style="margin-left: -18rpx;flex-wrap: wrap;">
										<label v-for="(option, optionIndex) in item.qa" :key="optionIndex" class="flex-row" style="margin-right: 10rpx;">
										  <radio :value="option" style="transform:scale(0.6)" :color="primaryColor" :checked=" option == formDataResult[index].value "/>
										  <view class="_input" style="margin-left: -14rpx;">{{ option }}</view>
										</label>
									</view>
								  </radio-group>
								</view>
								<view v-else class="right">
								  <input v-model="formDataResult[index].value" class="_input" :placeholder="item.name" placeholder-class="_input_place_holder" />
								</view>
							  </block>
						      
						    </view>
						  </view>
					</scroll-view>
				</view>
				<view class="bottom-wrap">
					<view :class="'btn ' + (is_disable ? 'disable' : '')" @tap.stop.prevent="confirmTap">确定</view>
				</view>
			</view>
		</view>
	</u-popup>
	
</template>

<script>
	export default {
		name:"custom-form",
		components: {

		},
		computed:{

		},
		data() {
			return {
				popup: false,
				is_disable: true,
				formDataResult: []
			};
		},
		mounted() {
			
		},
		watch: {
			pop: {
				handler: function (newVal, oldVal) {
					if(newVal > 0){
						this.popup = !this.popup;
						if(this.formdata?.update == 1){
							this.formDataResult = this.formdata.data;
						}else{
							if(this.popup){
								this.formDataResult = this.initializeFormData(this.formdata.data);
							}
						}
					}
				},
				immediate: false,
			},
			formdata: {
				handler(newVal) {
					if(newVal?.update == 1){
						// this.formDataResult = newVal.data;
					}else{
						if(newVal?.data?.length > 0){
							this.formDataResult = this.initializeFormData(newVal.data);
						}
					}
				},
				deep: true,
				immediate: true
			},
			formDataResult: {
				handler(newVal) {
					this.is_disable = !(this.formDataResult.every(item => item.value.trim() !== ''));
				},
				deep: true,
				immediate: true
			}
		},
		props: {
			pop: {
				type: Number,
				default: 0,
			},
			formdata: {
				type: Object,
				default: {data: []}
			},
			title: {
				type: String,
				default: ''
			}
		},
		methods: {
			confirmTap(){
				let that = this;
				if(that.is_disable){
					uni.showToast({
						title: '请完善全部信息',
						icon: 'none'
					});
					return;
				}
				that.shutPopup();
				let formdata_ = JSON.parse(JSON.stringify(uni.wen.util.deepClone(that.formdata)));
				formdata_.data = JSON.parse(JSON.stringify(this.formDataResult));
				this.$emit('confirm', formdata_);
			},
			shutPopup(){
				this.popup = !this.popup;
			},
			initializeFormData(data) {
			  return data.map(item => {
				if (Array.isArray(item.qa)) {
				  return { ...item, value: '' };
				} else {
				  return { ...item, value: '' };
				}
			  });
			},
			radioChange(e, index){
				this.formDataResult[index].value = e.detail.value;
			}
		}
	}
</script>

<style lang="scss">
.custom-form-warap{
	width: 750rpx;
	@include background_color(page-body2-background-color);
	border-top-right-radius: $uni-border-radius-lg-er;
	border-top-left-radius: $uni-border-radius-lg-er;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	padding: 20rpx 0 calc(20rpx + env(safe-area-inset-bottom));
	.inner{
		width: $page-content-body-width;
		/* #ifndef APP-NVUE */
		margin: auto;
		/* #endif */
		/* #ifdef APP-NVUE */
		margin-left: 20rpx;
		margin-right: 20rpx;
		/* #endif */

		.title{
			width: 100%;
			@include color(color-lighter-er-dark);
			position: relative;
			text-align: center;
			margin-bottom: 20rpx;
			font-size: $uni-font-size-base;
			.mini-shanchu2{
				position: absolute;
				right: 0;
				top: 0;
			}
		}
		.content{
			._scroll_view{
				height: 60vh;
				width: $page-content-body-width;
				.form-item-list{
					.form-item{
						display: flex;
						margin-top: 30rpx;
						align-items: center;
						min-height: 60rpx;
						@include background_color(page-box-background-color);
						padding: $uni-spacing-col-sm $uni-spacing-row-base;
						border-radius: $uni-border-radius-lg;
						.label-name{
							max-width: 260rpx;
							min-width: 260rpx;
							@include color(color-light-dark);
							font-size: $uni-font-size-base;
						}
						.right{
							._input{
								@include color(color-light-dark);
								font-size: $uni-font-size-base;
								white-space: nowrap;
							}
						}
						
					}
				}
			}
		}
		.bottom-wrap{
			margin-top: 30rpx;
			.btn{
				padding: 20rpx 0;
				text-align: center;
				background-color: $uni-color-follow;
				color: $uni-color-follow-font;
				border-radius: 50rpx;
			}
			.btn.disable{
				@include background_color(page-lighter-er-line-background-color);
			}
		}
	}
}

</style>