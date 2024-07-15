<template>
	<view>
		<view class="address-window" :class="value === true ? 'on' : ''">
            <view class="title">
                <i class="title-logo mini-icon mini-xiaochengxu1"></i>
                <view class="title-txt">
                    小程序 申请
                </view>
            </view>
            <view class="notes">
                <view class="notes-top">
                    完善你的昵称、头像
                </view>
                <view class="notes-bot">
                    注册、登录小程序
                </view>
            </view>
            <view class="userbox">
                <button class="mydata-arrow-right" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
                    <view class="userbox-item">
                        <image class="userbox-item-img" :src="avatarUrl?avatarUrl:config_img_default_avatar" mode=""></image>
                        <view class="userbox-item-txt">
                            点击选择头像
                        </view>
                    </view>
                </button>
                <view class="userbox-item">
                    <view class="userbox-item-nicheng">
                        昵称
                    </view>
                    <input class="userbox-item-input" type="nickname" v-model="nickName" @blur="getNickname" placeholder="请填写昵称">
                </view>
            </view>
            <view class="task-btn">
                <view class="left" @click="closeStudent">
                    取消
                </view>
                <view class="left right" @click="authorize">
                    授权
                </view>
            </view>
		</view>
		<view class="mask" @touchmove.prevent :hidden="value === false" @click="closeStudent"></view>
	</view>
</template>
<script>

export default {
	name: 'StudentWindow',
	props: {
		value: Boolean,
		mydate: Object
	},
	computed:{
		config_img_default_avatar:{
			get(){
				let that = this;
				return that.$store.state.config.img.default_avatar;
			},
			set(v){}
		},
	},
	data: function() {
		return {
            avatarUrl:'',
            nickName:'',
            openid:'',
            
		};
	},
	mounted: function() {},
	methods: {
        async authorize(){
            let that = this;
            if(!that.avatarUrl){
                uni.showToast({
                    title:'请选择头像',
                    icon:"none",
                    duration:1500
                })
                return
            }
            that.nickName = that.nickName.trim();
            if(!that.nickName){
                uni.showToast({
                    title:'请填写昵称',
                    icon:"none",
                    duration:1500
                })
                return
            }
            uni.loading(true);
            const filePath = that.avatarUrl // 选择图片的临时路径
            const name = that.avatarUrl.substring(that.avatarUrl.lastIndexOf(".")+1); // 获取图片格式 png jpg 等
            
           uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', filePath, 14).then(function(res) {
		    uni.loading(false);
           	if(res.status){
				let obj = {}
				obj.avatarUrl = res.data
				obj.nickName = that.nickName
				that.$emit("send",obj)
           	}else{
           		uni.showToast({
           			title: res.message,
           			icon:'none'
           		});
           	}
           }).catch(function(err){
           	uni.showToast({
           		title: err,
           		icon:'none'
           	});
           });
        },
        getNickname(e){
            this.nickName = e.detail.value
        },
        async uploadImg(url) {
            let that = this;
            that.avatarUrl = url;
        },
        onChooseAvatar(e){
           this.uploadImg(e.detail.avatarUrl)
        },
		closeStudent() {
			this.$emit('close', false);
		},
	}
};
</script>
<style lang="scss" scoped>
    view,
    scroll-view,
    swiper,
    swiper-item,
    cover-view,
    cover-image,
    icon,
    text,
    rich-text,
    progress,
    button,
    checkbox,
    form,
    input,
    label,
    radio,
    slider,
    switch,
    textarea,
    navigator,
    audio,
    camera,
    image,
    video {
        box-sizing: border-box;
    }
    button {
        padding: 0upx;
        margin: 0upx;
        border: none;
        border-radius: 0upx;
        box-sizing: border-box;
        @include background_color(page-body-background-color);
    }
    
    button.button-hover {
        transform: translate(3rpx, 3rpx);
        @include background_color(page-body-background-color);
    }
    
    button::after {
        border: none
    }
    
    .mask {
    	position: fixed;
    	top: 0;
    	left: 0;
    	right: 0;
    	bottom: 0;
    	background-color: #000;
    	opacity: 0.7;
    	z-index: 99;
    }
    
	.address-window {
		@include background_color(page-box-background-color);
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 6666;
        padding: 32rpx 40rpx 200rpx;
		transform: translate3d(0, 100%, 0);
		-webkit-transform: translate3d(0, 100%, 0);
		-ms-transform: translate3d(0, 100%, 0);
		-moz-transform: translate3d(0, 100%, 0);
		-o-transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-webkit-transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-moz-transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-o-transition: all .3s cubic-bezier(.25, .5, .5, .9);
        border-radius: 24rpx 24rpx 0 0;
        box-shadow: 0px 0px 30rpx 30rpx rgba(107,127,153,0.30);
        box-sizing: border-box;
        
        &.on {
            transform: translate3d(0, 0, 0);
            -webkit-transform: translate3d(0, 0, 0);
            -ms-transform: translate3d(0, 0, 0);
            -moz-transform: translate3d(0, 0, 0);
            -o-transform: translate3d(0, 0, 0);
        }
        .title {
            width: 100%;
                padding: 36rpx 10rpx 40rpx;
                box-sizing: border-box;
                overflow: auto;
                
            .title-logo {
                float: left;
                width: 40rpx;
                height: 40rpx;
				font-size: 40rpx;
                border-radius: 50%;
                margin-right: 20rpx;
            }
            .title-txt {
                float: left;
                font-size: $uni-font-size-base;
                font-family: PingFang SC, PingFang SC-Semibold;
                font-weight: 600;
                text-align: left;
                @include color(color-darkest);
            }
        }
        .notes {
            width: 100%;
            
            .notes-top {
                width: 100%;
                font-size: $uni-font-size-lg;
                font-family: PingFang SC, PingFang SC-Semibold;
                font-weight: 600;
                text-align: left;
                @include color(color-darkest);
            }
            .notes-bot {
                width: 100%;
                font-size: $uni-font-size-sm-base;
                font-family: PingFang SC, PingFang SC-Semibold;
                font-weight: 400;
                text-align: left;
                @include color(color-lighter-er-dark);
                margin-top: 10rpx;
            }
        }
        .userbox {
            width: 100%;
            border-top: 2rpx solid #ededed;
            margin-top: 30rpx;
            .mydata-arrow-right {
                border-color: #fff;
                padding: 0rpx !important;
                margin: 0rpx !important;
                border: none !important;
                border-radius: 0rpx !important;
                box-sizing: border-box !important;
                background-color: $uni-bg-color !important;
                
            }
            .userbox-item {
                width: 100%;
                height: 112rpx;
                border-bottom: 2rpx solid #ededed;
                overflow: auto;
				padding: 0 20rpx;
                
                .userbox-item-img {
                    float: left;
                    width: 70rpx;
                    height: 70rpx;
                    border-radius: 8rpx;
                    margin-top: 20rpx;
                    margin-right: 20rpx;
                }
                .userbox-item-txt {
                    float: left;
                    font-size: $uni-font-size-sm-base;
                    font-family: PingFang SC, PingFang SC-Semibold;
                    font-weight: 400;
                    line-height: 112rpx;
                    text-align: left;
                    @include color(color-lighter-er-dark);
                }
                .userbox-item-nicheng {
                    float: left;
                    font-size: $uni-font-size-sm-base;
                    font-family: PingFang SC, PingFang SC-Semibold;
                    font-weight: 400;
                    line-height: 112rpx;
                    text-align: left;
                    @include color(color-darkest);
                }
                .userbox-item-input {
                    float: left;
                    font-size: $uni-font-size-sm-base;
                    font-family: PingFang SC, PingFang SC-Semibold;
                    font-weight: 400;
                    line-height: 112rpx;
                    text-align: left;
                    @include color(color-darkest);
                    margin-top: 34rpx;
                        margin-left: 36rpx;
                }
            }
        }
        .task-btn {
            width: 80%;
            padding: 0 30rpx;
            box-sizing: border-box;
            margin: 44rpx auto 0;
            .left {
                float: left;
                width: 210rpx;
                height: 72rpx;
                line-height: 72rpx;
                text-align: center;
                background: #F2F2F2;
                border-radius: 8rpx;
                font-size: $uni-font-size-base;
                font-family: PingFang SC, PingFang SC-Regular;
                font-weight: 400;
                text-align: center;
                color: #5DBC6F;
                &.right {
                    float: right;
                    background: #5DBC6F;
                    color: #ffffff;
                }
            }
        }
        
	}

</style>