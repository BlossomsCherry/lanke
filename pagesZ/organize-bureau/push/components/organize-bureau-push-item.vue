<script>
export default {
  name: 'organize-bureau-push-item',
  props: {
    popupTitle: { type: String},
    icon: { type: String, required: true },
    label: { type: String, required: true },
    labelText: { type: String, default: '' },
    startDate: { type: Array, default: ()=> [] },
    url: { type: String, default: '' },
    placeholder: { type: String, default: '请输入' },
    subPlaceholder: { type: String, default: '' },
    tip: { type: String, default: '' },
    maxLength: { type: Number | String, default: 100 },
    value: { type: String | Object, required: false },
    type: {
      type: 'input' | 'input-number' | 'input-number-digit' | 'gameTypeCheck' | 'gameDatePick' | 'endDatePick' | 'openCheck' | 'url' | 'refundPicker' | 'picker' | 'isWaitingSwitch' | 'isRealNameSwitch' | 'isQuotaSwitch' | 'signDatePicker' | 'signRangeCheck' | 'signGenderCheck' | 'region-picker' | 'date-picker' | 'checkbox' | 'picture' | 'location'
    },
		isLocation: { type: Boolean, default: false },
    range: { type: Array, default: () => [] },
		isRequire: { type: Boolean, default: false }
  },
	data(){
		return {
			isShowPopup: false,
			curValue: null,
			isWaitingVal: false,
			isQuotaVal: false,
			isRealName: false,
			pickerIndex: [0, 0, 0],
			gameDateStartPickerIndex: [0, 0, 0],
			isStartDate: true,
			isDisabledEndDateSubmitBtn: false,
			addressPpdatePop: false,
			tempAddressDetail: ''
		}
	},
	computed: {
	  inputType() {
	    if (this.type == 'input-number') {
	      return 'number'
	    }else if (this.type == 'input-number-digit') {
	      return 'digit'
	    } else {
	      return 'text'
	    }
	  }
	},
	methods: {
		handleClose(){
			this.isShowPopup = false
		},
		handleOpen(){
			if(this.type === 'url'){
				uni.navigateTo({
					url: this.url
				})
			}else if(this.type === 'endDatePick'){
				if(this.startDate[0] === ''){
					uni.showToast({
						title: '请先选择比赛时间',
						icon: 'none'
					})
				}else{
					if(this.startDate[0][0] > this.pickerIndex[0]){
						this.isDisabledEndDateSubmitBtn = true;
					}else if(this.startDate[0][0] == this.pickerIndex[0]){
						if(this.startDate[0][1] > this.pickerIndex[1]){
							this.isDisabledEndDateSubmitBtn = true;
						}else if(this.startDate[0][1] == this.pickerIndex[1]){
							if(this.startDate[0][2] >= this.pickerIndex[2]){
								this.isDisabledEndDateSubmitBtn = true;
							}else{
								this.isDisabledEndDateSubmitBtn = false;
							}
						}else{
							this.isDisabledEndDateSubmitBtn = false;
						}
					}else{
						this.isDisabledEndDateSubmitBtn = false;
					}
					this.isShowPopup = true;
				}
			}else if(this.isLocation){
				this.getLocation()
			}else{
				this.isShowPopup = true
			}
		},
		handleSubmit(e){
			if(this.type === 'refundPicker'){
				this.curValue = this.range[this.pickerIndex[0]]
			} else if(this.type === 'gameDatePick'){
				this.isStartDate = true
				this.curValue = {label: this.range[0][this.gameDateStartPickerIndex[0]] + ' ' + this.range[1][this.gameDateStartPickerIndex[1]] + ':' + this.range[2][this.gameDateStartPickerIndex[2]] + ' - ' + this.range[0][this.pickerIndex[0]] + ' ' + this.range[1][this.pickerIndex[1]] + ':' + this.range[2][this.pickerIndex[2]], value: [this.gameDateStartPickerIndex, this.pickerIndex]}
			} else if(this.type === 'signDatePicker'){
				this.curValue = {label: this.range[0][this.pickerIndex[0]] + ' ' + this.range[1][this.pickerIndex[1]] + ':' + this.range[2][this.pickerIndex[2]], value: this.pickerIndex}
			} else if(this.type === 'endDatePick'){
				this.curValue = {label: this.range[0][this.pickerIndex[0]] + ' ' + this.range[1][this.pickerIndex[1]] + ':' + this.range[2][this.pickerIndex[2]], value: this.pickerIndex}
			} else if(this.type === 'isWaitingSwitch' || this.type === 'isQuotaSwitch' || this.type === 'isRealNameSwitch'){
				this.curValue = e
			}
			
			console.log(this.curValue)
			if(this.curValue !== '' && this.curValue !== null){
				this.$emit('input', this.curValue)
				this.handleClose()
			}else{
				uni.showToast({
					title: '内容不能为空',
					icon: 'none'
				})
			}
		},
		setValue(e){
			this.curValue = e
		},
		shutAddressPpdatePop(){
			this.addressPpdatePop = !this.addressPpdatePop;
		},
		changeAddressDetail(){
			this.curValue.address_detailed = this.tempAddressDetail;
			this.addressPpdatePop = false;
			this.$emit('input', {
				latitude: this.curValue.latitude,
				longitude: this.curValue.longitude,
				address_name: this.curValue.address_name,
				address_detailed: this.curValue.address_detailed
			});
		},
		getLocation(){
			let that = this;
			
			let getLocation_ = (that) => {
				uni.getLocation({
					type: 'wgs84',
					success:(res) => {
						if (res.errMsg == "getLocation:ok") {
							uni.chooseLocation({
								latitude: res.latitude,
								longitude: res.longitude,
								scale: 8,
								success:(resData)=>{
									that.tempAddressDetail = resData.name;
									
									let location = {
										latitude: resData.latitude,
										longitude: resData.longitude,
										address_name: resData.address,
										address_detailed: resData.name
									};
									
									that.curValue = location;
									that.$emit('input', location);
								}
							})
						}
					},
				})
			};
			
			if(that.curValue !== '' && that.curValue !== null){
				uni.showActionSheet({
					itemList: ['编辑', '重新选取'],
					success: function (res) {
						if(res.tapIndex == 0){
							that.addressPpdatePop = true;
						}else if(res.tapIndex == 1){
							getLocation_(that);
						}
					},
					fail: function (res) {
						console.log(res.errMsg);
					}
				});
			}else{
				
				// #ifdef MP
				uni.wen.util.checkMpPermission('scope.userLocation', '请到设置页面授权“位置信息”权限', () => {
					getLocation_(that)
				});
				// #endif
				
				// #ifdef APP
				uni.wen.util.checkAppPermission('location', '[位置权限]获取您的位置等信息，用于标记组局集合的位置', () => {
					getLocation_(that)
				}, that);
				// #endif
				
				// #ifdef H5
				getLocation_(that)
				// #endif

			}
			
		},
		handleSelectRange(data){
			this.isShowPopup = false
			this.$emit('input', data)
		},
		bindPickerChange(e){
			this.pickerIndex = e.detail.value
			if(this.startDate[0] !== '' && this.type === 'endDatePick'){
				if(this.startDate[0][0] > this.pickerIndex[0]){
					this.isDisabledEndDateSubmitBtn = true;
				}else if(this.startDate[0][0] == this.pickerIndex[0]){
					if(this.startDate[0][1] > this.pickerIndex[1]){
						this.isDisabledEndDateSubmitBtn = true;
					}else if(this.startDate[0][1] == this.pickerIndex[1]){
						if(this.startDate[0][2] >= this.pickerIndex[2]){
							this.isDisabledEndDateSubmitBtn = true;
						}else{
							this.isDisabledEndDateSubmitBtn = false;
						}
					}else{
						this.isDisabledEndDateSubmitBtn = false;
					}
				}else{
					this.isDisabledEndDateSubmitBtn = false;
				}
			}
		},
		handleNextDate(){
			this.gameDateStartPickerIndex = JSON.parse(JSON.stringify(this.pickerIndex))
			this.isStartDate = false
		},
		handlePreDate(){
			this.isStartDate = true
		},
		toast(title){
			uni.showToast({
				title: title,
				icon: 'none'
			});
			return false;
		}
	}
}
</script>

<template>
	<view class="organize-bureau-push-item-wrapper">
		<!-- 比赛类型 -->
		<view class="item" v-if="type==='gameTypeCheck'">
			<view class="flex" @click="isShowPopup = true">
				<!-- <image class="icon" :src="require(`../../../static/push/${icon}`)"/> -->
				<i :class="icon + ' icon ' + (value.label ? '' : 'opc')"></i>
				<view class="label">{{ value.label || label }}</view>
				<view class="right-icon">
					<u-icon name="arrow-right" style="color:#ACAEB2"/>
				</view>
			</view>
			<view class="default" v-if="!value.label">
				<view class="default-item" v-for="(item,index) in range" :key="index" @click="handleSelectRange(item)" v-if="item.isDefault">{{ item.label }}</view>
			</view>
		</view>
		<!-- switch --> 
		<view class="item" v-else-if="type==='isWaitingSwitch'">
			<view class="flex">
				<i :class="icon + ' icon'"></i>
				<view class="label">{{ label }}</view>
				<view class="right-icon">
					<u-switch v-model="isWaitingVal" @input="e => handleSubmit(e)" :active-color="primaryColor" :inactive-color="global__theme__ == 'black' ? '#141417' : '#f4f6f9'"></u-switch>
				</view>
			</view>
		</view>
		<view class="item" v-else-if="type==='isQuotaSwitch'">
			<view class="flex">
				<i :class="icon + ' icon'"></i>
				<view class="label">{{ label }}</view>
				<view class="right-icon">
					<u-switch v-model="isQuotaVal" @input="e => handleSubmit(e)" :active-color="primaryColor" :inactive-color="global__theme__ == 'black' ? '#141417' : '#f4f6f9'"></u-switch>
				</view>
			</view>
		</view>
		<view class="item" v-else-if="type==='isRealNameSwitch'">
			<view class="flex">
				<i :class="icon + ' icon'"></i>
				<view class="label">{{ label }}</view>
				<view class="right-icon">
					<u-switch v-model="isRealName" @input="e => handleSubmit(e)" :active-color="primaryColor" :inactive-color="global__theme__ == 'black' ? '#141417' : '#f4f6f9'"></u-switch>
				</view>
			</view>
		</view>
		<view class="item" @click="handleOpen" v-else-if="type==='url' || type == 'input-number' || type == 'input-number-digit'">
			<i :class="icon + ' icon ' + (value || value.label ? '' : 'opc')"></i>
			<view class="label placeholder" v-if="labelText && value">{{ labelText }}</view>
			<view :class="'label ' + (value.label ? '' : 'placeholder')" v-else>{{ value.label || label }}</view>
			<view class="sub" v-if="subPlaceholder">{{ subPlaceholder }}</view>
			<view class="right-icon" v-if="!(labelText && type==='gameDatePick')">
				<u-icon name="arrow-right" style="color:#ACAEB2"/>
			</view>
		</view>
		<view class="item" @click="handleOpen" v-else-if="isLocation">
			<i :class="icon + ' icon ' + (labelText ? '' : 'opc')"></i>
			<view class="label placeholder" v-if="labelText && value">{{ labelText }}</view>
			<view :class="'label ' + (value.label ? '' : 'placeholder')" v-else>{{ value.label || label }}</view>
			<view class="sub" v-if="subPlaceholder">{{ subPlaceholder }}</view>
			<view class="right-icon" v-if="!(labelText && type==='gameDatePick')">
				<u-icon name="arrow-right" style="color:#ACAEB2"/>
			</view>
		</view>
		<!-- 其他 -->
		<view class="item" @click="handleOpen" v-else>
			<i :class="icon + ' icon ' + (value.label || curValue ? '' : 'opc')"></i>
			<view class="label placeholder" v-if="labelText && value">{{ labelText }}</view>
			<view :class="'label ' + (value.label ? '' : 'placeholder')" v-else>{{ value.label || label }}</view>
			<view class="sub" v-if="subPlaceholder">{{ subPlaceholder }}</view>
			<view class="right-icon" v-if="!(labelText && type==='gameDatePick')">
				<u-icon name="arrow-right" style="color:#ACAEB2"/>
			</view>
		</view>
		
		<!-- 弹窗 -->
		<u-popup :show="isShowPopup" :mode="(type==='input-number' || type==='input-number-digit') ? 'center' : 'bottom'" @close="isShowPopup=false">
			<!-- 比赛类型 -->
			<view class="popupMain" v-if="type==='gameTypeCheck'">
				<view class="popupHeader">
					<view class="popupClose"></view>
					<view class="popupTitle">{{ popupTitle }}</view>
					<i class="close-icon mini-icon mini-shanchu2" @click="isShowPopup=false"/>
				</view>
				<scroll-view :scroll-y="true" class="_scroll-view-game-type">
					<view class="popupBody gameType">
						<view class="gameTypeItem" v-for="(item, index) in range" :key="index" @click="handleSelectRange(item)" :class="item.value === value.value && 'active'">{{ item.label }}</view>
					</view>
				</scroll-view>
			</view>
			<!-- 比赛时间 -->
			<view class="popupMain" v-else-if="type==='gameDatePick'">
				<view class="popupHeader" v-if="isStartDate">
					<view class="popupClose" @click="isShowPopup=false">取消</view>
					<view class="popupTitle">开始时间</view>
					<view class="popupSubmit mini-icon mini-arrowRight" @click="handleNextDate()"></view>
				</view>
				<view class="popupHeader" v-else>
					<view class="popupClose mini-icon mini-arrowLeft" @click="handlePreDate()"></view>
					<view class="popupTitle">结束时间</view>
					<view class="popupSubmit" @click="handleSubmit()">确定</view>
				</view>
				<view class="popupBody gameDate">
					<picker-view :value="pickerIndex" @change="bindPickerChange" class="team-picker-view">
						<picker-view-column>
							<view class="team-picker-item" :class="pickerIndex[0] === index ? 'active' : ''" v-for="(item, index) in range[0]" :key="index">{{ item }}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="team-picker-item" :class="pickerIndex[1] === index ? 'active' : ''" v-for="(item, index) in range[1]" :key="index">{{ item }}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="team-picker-item" :class="pickerIndex[2] === index ? 'active' : ''" v-for="(item, index) in range[2]" :key="index">{{ item }}</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
			<!-- 选择可见范围 -->
			<view class="popupMain" v-else-if="type==='openCheck'">
				<view class="popupHeader">
					<view class="popupClose"></view>
					<view class="popupTitle">{{ popupTitle }}</view>
					<i class="close-icon mini-icon mini-shanchu2" @click="isShowPopup=false"/>
				</view>
				<view class="popupBody openSee">
					<view class="openSeeItem" v-for="(item, index) in range" :key="index" @click="handleSelectRange(item)">
						<view class="openSeeItem-label">{{ item.label }}</view>
						<i class="mini-icon" :class="item.value === value.value ? 'mini-a-mianxing' : 'mini-quan'"/>
					</view>
				</view>
			</view>
			<!-- 退款政策 -->
			<view class="popupMain" v-else-if="type==='refundPicker'">
				<view class="popupHeader">
					<view class="popupClose" @click="isShowPopup=false">取消</view>
					<view class="popupTitle">{{ popupTitle || label }}</view>
					<view class="popupSubmit" @click="handleSubmit">确定</view>
				</view>
				<view class="popupBody refundList">
					<view class="tip">{{tip}}</view>
					<picker-view :value="pickerIndex" @change="bindPickerChange" class="team-picker-view">
						<picker-view-column>
							<view class="team-picker-item" :class="pickerIndex[0] === index ? 'active' : ''" v-for="(item, index) in range" :key="index">
								{{ item.label }}
							</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
			<!-- 几支战队、每队人数、每队多少钱 -->
			<view class="popupMain popupMainCenter" v-else-if="type==='input-number' || type == 'input-number-digit'">
				<view class="popupTop">{{ popupTitle }}</view>
				<view class="popupBody">
					<view class="input-wrapper">
					  <u-input :value="value" :placeholder="placeholder" border="none" height="100" :maxlength="maxLength" :type="inputType" @input="e => setValue(e)"/>
					</view>
					<view class="input-tip" v-if="tip">{{ tip }}</view>
				</view>
				<view class="popupBottom">
					<view class="popupBtn" @click="isShowPopup=false">取消</view>
					<view class="popupBtn primary" @click="handleSubmit">确定</view>
				</view>
			</view>
			<!-- 开始报名时间 -->
			<view class="popupMain" v-else-if="type==='signDatePicker'">
				<view class="popupHeader">
					<view class="popupClose" @click="isShowPopup=false">取消</view>
					<view class="popupTitle">{{ popupTitle || label }}</view>
					<view class="popupSubmit" @click="handleSubmit()">确定</view>
				</view>
				<view class="popupBody signDate">
					<picker-view :value="pickerIndex" @change="bindPickerChange" class="team-picker-view">
						<picker-view-column>
							<view class="team-picker-item" :class="pickerIndex[0] === index ? 'active' : ''" v-for="(item, index) in range[0]" :key="index">{{ item }}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="team-picker-item" :class="pickerIndex[1] === index ? 'active' : ''" v-for="(item, index) in range[1]" :key="index">{{ item }}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="team-picker-item" :class="pickerIndex[2] === index ? 'active' : ''" v-for="(item, index) in range[2]" :key="index">{{ item }}</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
			<!-- 报名范围 -->
			<view class="popupMain" v-else-if="type==='signRangeCheck' || type === 'signGenderCheck'">
				<view class="popupHeader">
					<view class="popupClose" @click="isShowPopup=false">取消</view>
					<view class="popupTitle">{{ popupTitle || label }}</view>
					<view class="popupSubmit" @click="handleSubmit">确定</view>
				</view>
				<view class="popupBody signRange">
					<view class="signRangeItem" v-for="(item, index) in range" :key="index" @click="setValue(item)">
						<view class="signRangeItem-label">{{ item.label }}</view>
						<i class="mini-icon mini-icon_669" v-if="(curValue !== undefined && curValue !== null) && (curValue.value !== undefined && curValue.value !== null) && (curValue.value === item.value)"/>
					</view>
				</view>
			</view>
			<!-- 报名截止时间 -->
			<view class="popupMain" v-else-if="type==='endDatePick'">
				<view class="popupHeader">
					<view class="popupClose" @click="isShowPopup=false">取消</view>
					<view class="popupTitle">{{ popupTitle || label }}</view>
					<view class="popupSubmit" @click="handleSubmit" v-if="isDisabledEndDateSubmitBtn">确定</view>
					<view class="popupSubmit disabled" v-else @click="toast('报名截止时间应在活动开始时间之前')">确定</view>
				</view>
				<view class="popupBody gameDate">
					<picker-view :value="pickerIndex" @change="bindPickerChange" class="team-picker-view">
						<picker-view-column>
							<view class="team-picker-item" :class="pickerIndex[0] === index ? 'active' : ''" v-for="(item, index) in range[0]" :key="index">{{ item }}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="team-picker-item" :class="pickerIndex[1] === index ? 'active' : ''" v-for="(item, index) in range[1]" :key="index">{{ item }}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="team-picker-item" :class="pickerIndex[2] === index ? 'active' : ''" v-for="(item, index) in range[2]" :key="index">{{ item }}</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
		</u-popup>
		
		<u-popup :show="addressPpdatePop" @close="shutAddressPpdatePop" :closeOnClickOverlay="false" :safeAreaInsetBottom="false"round="10px" mode="center">
			<view class="address-change-wrapper">
				<view class="title-wrapper">编辑地址</view>
					<view class="input-box">
						<u-input placeholder="输入您想修改的地址" maxlength="30" v-model="tempAddressDetail" :clearable="true"></u-input>
					</view>
					<view class="flex-row">
						<u-button type="primary" text="取消" shape="circle" :plain="true" @click="shutAddressPpdatePop" :customStyle="{transform: 'scale(0.8)'}"></u-button>
						<view style="width: 60rpx;"></view>
						<u-button type="primary" text="确定" :color="primaryColor" shape="circle" :customStyle="{transform: 'scale(0.8)'}" @click="changeAddressDetail"></u-button>
					</view>
			</view>
		</u-popup>
		
	</view>
</template>

<style scoped lang="scss">
@import '@/pagesZ/app.scss';
.organize-bureau-push-item-wrapper {
	.item{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 30rpx 0;
		border-bottom: 1px solid;
		@include border_color(border-color-body-background-color);
		.flex{
			width: 100%;
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
  .icon {
    width: 44rpx;
    height: 44rpx;
	display: inline-flex;
	color: $uni-color-primary;
  }
  
  .icon.opc{
	@include color(color-lightest-dark);
  }

  .label {
	flex: 1;
    margin-left: 12rpx;
    font-size: $uni-font-size-medium;
	@include color(color-darkest);
    line-height: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
  }
  
  .label.placeholder{
	// @include color(color-lighter-er-dark);
  }

  .sub {
    margin: 0 12rpx;
    font-size: $uni-font-size-medium;
    @include color(color-lightest-est-er-dark);
    line-height: 1;
		text-align: right;
  }

  .right-icon {
    margin-left: auto;
  }
	
	.default{
		margin-top: 30rpx;
		width: 100%;
		display: flex;
		align-items: center;
		.default-item{
			margin-right: 20rpx;
			padding: 7rpx 30rpx;
			@include background_color(page-body2-background-color);
			border-radius: 50rpx;
			font-size: $uni-font-size-medium;
			@include color(color-darkest);
			line-height: 50rpx;
		}
	}
}
.popupMain{
	border-radius: 40rpx 40rpx 0 0;
	@include background_color(page-box-background-color);
	.popupHeader{
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.close-icon{
			color: #acaeb2;
		}
		.popupClose{
			font-size: $uni-font-size-medium;
			@include color(color-lightest-est-er-dark);
			line-height: 1;
			&.mini-icon{
				font-size: 40rpx;
				font-weight: bold;
				@include color(color-lightest-est-er-dark);
			}
		}
		.popupTitle{
			font-size: $uni-font-size-medium;
			font-weight: bold;
			@include color(color-darkest);
			line-height: 1;
			text-align: center;
		}
		.popupSubmit{
			font-size: $uni-font-size-medium;
			color: $uni-color-primary;
			line-height: 1;
			&.mini-icon{
				font-size: 40rpx;
				font-weight: bold;
				color: $uni-color-primary;
			}
			&.disabled{
				@include color(color-lightest-est-er-dark);
			}
		}
	}
	._scroll-view-game-type{
		height: 30vh;
		max-height: 30vh;
	}
	.popupBody{
		padding: 50rpx 20rpx calc(env(safe-area-inset-bottom) + 80rpx) 20rpx;
		.input-wrapper{
			padding: 20rpx;
			@include background_color(page-body2-background-color);
			border-radius: 20rpx;
			font-size: $uni-font-size-medium;
			@include color(color-darkest);
		}
		&.gameType{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			padding: 30rpx 14rpx calc(env(safe-area-inset-bottom) + 80rpx);
			.gameTypeItem{
				margin: 0 20rpx 20rpx 0;
				width: 214rpx;
				height: 88rpx;
				@include background_color(page-body2-background-color);
				font-size: $uni-font-size-medium;
				font-family: PingFang SC-Bold, PingFang SC;
				@include color(color-darkest);
				line-height: 88rpx;
				text-align: center;
				overflow: hidden;
				border-radius: 88rpx;
				&:nth-child(3n){
					margin-right: 0;
				}
				&.active{
					background-color: $uni-color-follow;
					color: $uni-color-follow-font;
				}
			}
		}
		&.openSee{
			.openSeeItem{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 40rpx 0;
				border-bottom: 1px solid;
				@include border_color(border-color-body-background-color);
				.openSeeItem-label{
					font-size: $uni-font-size-medium;
					@include color(color-darkest);
					line-height: 1;
				}
				.mini-icon{
					font-size: $uni-font-size-medium;
					&.mini-quan{
						@include color(color-lightest-est-er-dark);
					}
					&.mini-a-mianxing{
						color: $uni-color-primary;
					}
				}
			}
		}
		&.refundList{
			padding-top: 30rpx;
			padding-left: 0;
			padding-right: 0;
			border-top: 1px solid;
			@include border_color(border-color-body-background-color);
			.tip{
				padding: 0 20rpx 20rpx;
				font-size: $uni-font-size-sm-base;
				@include color(color-lightest-est-er-dark);
				line-height: 1;
			}
			.team-picker-view {
				width: 100%;
				padding: 0 20rpx;
				height: 300rpx;
				.team-picker-item{
					font-size: $uni-font-size-lg-er;
					color: #CFCFCF;
					text-align: center;
					&.active{
						font-size: $uni-font-size-lg-er;
						font-weight: bold;
						@include color(color-darkest);
						line-height: 34px;
					}
				}
			}
		}
		&.signDate, &.gameDate{
			.team-picker-view {
				width: 100%;
				padding: 0 20rpx;
				height: 300rpx;
				.team-picker-item{
					font-size: $uni-font-size-lg-er;
					color: #CFCFCF;
					text-align: center;
					&.active{
						font-size: $uni-font-size-lg-er;
						font-weight: bold;
						@include color(color-darkest);
						line-height: 34px;
					}
				}
			}
		}
		&.signRange{
			.signRangeItem{
				padding: 30rpx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.signRangeItem-label{
					font-size: $uni-font-size-medium;
					@include color(color-darkest);
					line-height: 35rpx;
				}
				.mini-icon{
					font-weight: bold;
					font-size: 35rpx;
					color: $uni-color-primary;
				}
			}
		}
	}
	
	&.popupMainCenter{
		width: 600rpx;
		border-radius: 40rpx;
		.popupTop{
			padding: 40rpx;
			font-size: $uni-font-size-lg;
			font-weight: bold;
			@include color(color-darkest);
			line-height: 32rpx;
			text-align: center;
		}
		.popupBody{
			padding: 0 30rpx 38rpx 30rpx;
			.input-wrapper{
				margin-bottom: 20rpx;
			}
			.tip{
				font-size: $uni-font-size-sm-base;
				@include color(color-lightest-est-er-dark);
				line-height: 1;
			}
		}
		.popupBottom{
			height: 100rpx;
			border-top: 1px solid;
			@include border_color(border-color-light-line-background-color);
			display: flex;
			align-items: center;
			justify-content: space-between;
			.popupBtn{
				width: 50%;
				font-size: $uni-font-size-medium;
				font-weight: bold;
				@include color(color-darkest);
				line-height: 100rpx;
				text-align: center;
				&.primary{
					color: $uni-color-primary;
					border-left: 1px solid;
					@include border_color(border-color-light-line-background-color);
				}
			}
		}
	}
}
.address-change-wrapper{
	display: flex;
	flex-direction: column;
	width: 620rpx;
	padding: 20rpx;
	//box-sizing: border-box;
	background-color: white;
	border-radius: $uni-border-radius-lg-er;
	
	.title-wrapper {
		text-align: center;
		@include color(color-lightest-dark);
		font-size: $uni-font-size-sm-base;
	}
	.input-box{
		margin: 40rpx 0;
	}
}
</style>
