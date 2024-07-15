<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import petAdoptionFormItem from "@/pagesP/pet-adoption/components/pet-adoption-form-item.vue";
import PetAdoptionBottomBtn from "@/pagesP/pet-adoption/components/pet-adoption-bottom-btn.vue";
import miniUploadImg from '@/contrib/components/common/mini-upload-img/mini-upload-img';
import domVideo from '@/contrib/components/common/ls-dom-video/ls-dom-video';

export default {
  components: {
    PetAdoptionBottomBtn,
    myToast,
    navBar,
    hoverBall,
    petAdoptionFormItem,
	miniUploadImg,
	domVideo
  },
  computed:{
  	config_app_mode:{
  		get(){
  			let that = this;
  			if(that.$store.state.config.app && that.$store.state.config.app.mode){
  				return that.$store.state.config.app.mode;
  			}
  			return ' ';
  		},
  		set(v){}
  	},
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 50003,
	  adoption_id: 0,
      stepPage: 0, // 信息填写第几步
      mediaCount: 6,
	  isUploading: false,
      conditionRange: [
        { label: '仅限同城', value: 0 },
        { label: '按时打疫苗', value: 1 },
        { label: '适龄绝育', value: 2 },
        { label: '遛狗拴绳，养猫封网', value: 3 },
        { label: '科学养宠，办理狗证', value: 4 },
        { label: '打卡反馈', value: 5 },
        { label: '签领养协议', value: 6 },
        { label: '全家同意', value: 7 },
        { label: '有稳定收入', value: 8 },
        { label: '不得遗弃、转让、贩卖、繁殖、虐待', value: 9 }
      ],
      genderRange: [{ label: '未知', value: 0 }, { label: '男孩', value: 1 }, { label: '女孩', value: 2 }],
      speciesRange: [{ label: '猫咪', value: 1 }, { label: '狗狗', value: 2 }],
      freeRange: [{ label: '免费', value: 0 }, { label: '有偿', value: 1 }, { label: '收押金', value: 2 }],
      flgRange: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
	  statusRange: [{ label: '正常', value: 0 }, { label: '已领养', value: 1 }],
	  AgeRange: [
	  { label: '请选择', value: 0 }, 
	  { label: '一个月左右', value: 1 }, 
	  { label: '两个月左右', value: 2 },
	  { label: '三个月左右', value: 3 },
	  { label: '四个月左右', value: 4 },
	  { label: '五个月左右', value: 5 },
	  { label: '六个月左右', value: 6 },
	  { label: '七个月左右', value: 7 },
	  { label: '八个月左右', value: 8 },
	  { label: '九个月左右', value: 9 },
	  { label: '1岁左右', value: 10 },
	  { label: '1岁半左右', value: 11 },
	  { label: '2岁左右', value: 12 }, 
	  { label: '2岁半左右', value: 13 }, 
	  { label: '3岁左右', value: 14 }, 
	  { label: '5岁左右', value: 15 }, 
	  { label: '10岁左右', value: 16 }],
      adoptionForm: {
		video_url: '',
		video_cover: '',
        pictures: [],
        name: '',
        pet_age: 0,
		age_range: 0,
        pet_gender: 1,
        species: 1, // 物种
        pet_breed: '', // 品种
        is_vaccine: 0, // 是否已打疫苗
        is_sterilization: 0, // 是否已绝育
        is_repellent: 0, // 是否已驱虫
        is_free: 0,
        cost: '', // 费用
        pet_introduce: '', // 介绍
        condition: [], // 领养条件
        region: [],
        address: '',
        adopter_name: '',
        adopter_mobile: '',
        adopter_wechatId: '',
		adopt_status: 0
      },
	  storageVideoKey: ''
    }
  },
  onLoad: function (options) {

	let that = this;
	that.globalOnloadProcess(options);
  
	if(options.id){
		that.adoption_id = options.id;
		that.getAdoptionDetail();
	}
  
	that.storageVideoKey = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
		  v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});

  },
  onShow: function() {
  	let that = this;
  	that.updateScene(50003, 0, true);
	
	if(that.storageVideoKey && that.storageVideoKey.length > 0){
		let videoObj = uni.getStorageSync(that.storageVideoKey);
		if(videoObj && videoObj.video_url && videoObj.video_url.length > 0){
			that.adoptionForm.video_url = videoObj.video_url;
			that.adoptionForm.video_cover = videoObj.video_cover;
			uni.removeStorageSync(that.storageVideoKey);
		}
	}
	
  },
  methods: {
	setConditionCheck(values){
		let that = this;
		if(!values){
			values = [];
		}
		for(let i = 0; i < that.conditionRange.length; i ++){
			if(values.includes( that.conditionRange[i].value) || values.includes( that.conditionRange[i].value + '')){
				that.conditionRange[i]['checked'] = true;
			}else{
				that.conditionRange[i]['checked'] = false;
			}
		}
		let formData = that.adoptionForm;
		formData.condition = values;
		that.adoptionForm = formData;
	},
	getAdoptionDetail(){
		let that = this;
		uni.loading(true);
		uni.wen.util.request(
		    uni.wen.api.ApiRootUrl + 'pets/adoption/detail', {id: that.adoption_id}
		).then(function (res) {
		    uni.loading(false);
		    if (res.code == 200) {
				that.adoptionForm = res.data;
				setTimeout(function(){
					that.$refs.miniUploader.setInitValue(res.data.pictures);
				}, 300);
				that.setConditionCheck(that.adoptionForm.condition);
				
			}else {
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
			}
		});
	},
    // 领取费用类型切换事件
    is_freeChangeHandle(e) {
      this.adoptionForm.is_free = e
      this.adoptionForm.cost = ''
    },

    // 右侧按钮点击事件
    rightBtnHandle() {
	  let that = this;
      if (that.stepPage === 0) {
		// 下一步
		if(that.adoptionForm.pictures.length <= 0){
			uni.showToast({
				title: '至少上传一张图片！',
				icon: 'none'
			});
			return false;
		}
		if(that.adoptionForm.name.length <= 1){
			uni.showToast({
				title: '还没有名字或过短！',
				icon: 'none'
			});
			return false;
		}
		if(that.adoptionForm.pet_breed.length <= 0){
			uni.showToast({
				title: '未填品种！',
				icon: 'none'
			});
			return false;
		}
		if(that.adoptionForm.age_range <= 0){
			uni.showToast({
				title: '未填年龄！',
				icon: 'none'
			});
			return false;
		}
		if(that.adoptionForm.pet_introduce.length <= 10){
			uni.showToast({
				title: '填写ta的故事至少10个字',
				icon: 'none'
			});
			return false;
		}
        that.stepPage = 1
      } else {
        if(that.adoptionForm.region.length <= 0 || that.adoptionForm.address.length <= 0 || that.adoptionForm.adopter_name.length <= 0 || that.adoptionForm.adopter_wechatId.length <= 0){
        	uni.showToast({
        		title: '请将您的信息补充完整哦！',
        		icon: 'none'
        	});
        	return false;
        }
		if(that.adoptionForm.adopter_mobile && !uni.wen.util.validatePhoneNumber(that.adoptionForm.adopter_mobile)){
			uni.showToast({
				title: '手机号不合法',
				icon: 'none'
			});
			return false;
		}
		
		that.push();
      }
    },
	push(){
		let that = this;
		uni.loading(true);
		uni.wen.util.request(
		    uni.wen.api.ApiRootUrl + 'pets/adoption/add', that.adoptionForm,
		    'POST'
		).then(function (res) {
		    uni.loading(false);
		    if (res.code == 200) {
				uni.showToast({
					title: that.adoption_id > 0 ? '修改成功' : '发布成功！',
					icon: 'none'
				});
				setTimeout(function(){
					uni.wen.toUrl(-6, '/pagesP/pet-adoption/details/index?id=' + res.data.id, null);
				}, 500);
			}else {
				uni.showModal({
					title: that.adoption_id > 0 ? '修改失败' : '发布失败！',
					content: res.message,
					showCancel: false,
					confirmText: '朕知道了',
					confirmColor: that.primaryColor
				});
			}
		});
	},
	miniUploadImgChange(data) {
	  let that = this;
	  let form_data = that.adoptionForm;
	  let image_urls = [];
	  for (var i = 0; i < data.urls.length; i++) {
	    image_urls.push({
	      url: data.urls[i]
	    })
	  }
	  form_data.pictures = image_urls;
	  
	  that.setData({
	    adoptionForm: form_data,
		isUploading: false
	  });
	},
	onVideoDelete(){
		this.adoptionForm.video_url = '';
		this.adoptionForm.video_cover = '';
	},
	create_video_play() {
	  let domVideo = this.$refs.domVideo;
	  domVideo.play();
	},
  }
}
</script>

<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		
		<navBar :back="true" :home="fph" title="发布领养" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
		<view class="push-adoption-wrapper">
		  <u-gap height="20" bgColor="#f7f7f7"/>
		  <!-- 信息填写第一步 -->
		  <view v-show="stepPage === 0" class="push-step-one-wrapper">
			<view class="textarea_wrap uploade">
				<view class="title-box flex-row">
					<text class="title">上传视频</text>
				</view>
				<view class="uploade-video-box">
					<view class="media-video">
						<view class="placeholder-video" v-if="adoptionForm.video_url.length <= 0" @tap.stop.prevent="toSliderUrl(6, '/pages/creat/index/video?uuid=' + storageVideoKey)">
							<view class="box">
								<view class="tip">点击上传</view>
							</view>
						</view>
						<block v-else>
							<!-- #ifdef APP || H5 -->
							<view @tap.stop.prevent="create_video_play">
							  <dom-video style="width: 400rpx;height: 300rpx;" ref="domVideo" :src="adoptionForm.video_url"/>
							</view>
							<!-- #endif -->
							<!-- #ifdef MP -->
							<video class="video-source" :controls="true" :src="adoptionForm.video_url"></video>
							<!-- #endif -->
							<i @tap.stop.prevent="onVideoDelete" class="picture-delete mini-icon mini-chacha"></i>
						</block>
					</view>
				</view>
				
				<view class="title-box flex-row">
					<text class="title">上传图片</text>
					<text class="required">*</text>
				</view>
				<view class="uploade-box">
				  <mini-upload-img ref="miniUploader" style="width: 690rpx;" @uploading=" isUploading = true " :number="mediaCount" @change="miniUploadImgChange" :showAdd="true"></mini-upload-img>
				</view>
				<view class="tips">*最多传{{ mediaCount }}张，第一张照片默认为封面图</view>
			</view>
			
			
		
		    <u-gap height="20" bgColor="#f7f7f7"/>
		
		    <pet-adoption-form-item v-model="adoptionForm.name" label="宠物名字" placeholder="输入宠物名字(10字以内)" type="input" max-length="20" :isRequire="true" />
		    <pet-adoption-form-item v-model="adoptionForm.species" label="种类" type="tag" :range="speciesRange"/>
		    <pet-adoption-form-item v-model="adoptionForm.pet_breed" label="品种" placeholder="输入品种(10字以内)" type="input" max-length="20"  :isRequire="true"/>
		    <!-- <pet-adoption-form-item v-model="adoptionForm.pet_age" label="宠物年龄" type="date-picker" @change="e => adoptionForm.pet_age = e"/> -->
			
			<pet-adoption-form-item v-model="adoptionForm.age_range" label="宠物年龄" type="picker" :range="AgeRange" :isRequire="true"/>
		    <pet-adoption-form-item v-model="adoptionForm.pet_gender" label="性别" type="tag" :range="genderRange"/>
		    <pet-adoption-form-item v-model="adoptionForm.is_vaccine" label="是否已注射疫苗？" type="tag" :range="flgRange"/>
		    <pet-adoption-form-item v-model="adoptionForm.is_sterilization" label="是否已绝育？" type="tag" :range="flgRange"/>
		    <pet-adoption-form-item v-model="adoptionForm.is_repellent" label="是否已驱虫？" type="tag" :range="flgRange"/>
		    <pet-adoption-form-item v-model="adoptionForm.is_free" label="是否免费？" type="tag" :range="freeRange"/>
			<pet-adoption-form-item v-model="adoptionForm.adopt_status" label="领养状态" type="tag" :range="statusRange" v-if="adoption_id > 0" />

		    <pet-adoption-form-item
		        max-length="5"
		        type="input-number"
		        v-model="adoptionForm.cost"
		        v-show="adoptionForm.is_free !== 0"
		        :label="adoptionForm.is_free === 1 ? '输入费用(元)' : '输入押金(元)'"
		        :placeholder="adoptionForm.is_free === 1 ? '输入领养金额' : '输入押金金额'"
		    />
		    <pet-adoption-form-item v-model="adoptionForm.pet_introduce" position="top" type="textarea" max-length="200" label="TA的故事" placeholder="请输入宠物相关描述/送养原因(200字以内)" :isRequire="true" />
		    <view class="tips" style="padding-left: 26rpx;box-sizing: border-box;">*该送养信息将通过平台多种自有渠道帮您宣传</view>
		  </view>
		
		  <!-- 信息填写第二步 -->
		  <view v-show="stepPage === 1" class="push-step-two-wrapper">
		    <pet-adoption-form-item :value="adoptionForm.condition" label="领养条件" type="checkbox" :range="conditionRange" position="top" @select="setConditionCheck"/>
		    <u-gap height="20" bgColor="#f7f7f7"/>
		    <pet-adoption-form-item v-model="adoptionForm.region" label="所在城市" type="region-picker" :isRequire="true" />
		    <pet-adoption-form-item v-model="adoptionForm.address" label="详细地址" placeholder="输入您的详细地址" type="input" :isRequire="true" />
		    <pet-adoption-form-item v-model="adoptionForm.adopter_name" label="联系人姓名" placeholder="输入您的姓名" type="input"  :isRequire="true" />
			<block v-if=" config_app_mode != 'examine' ">
				<pet-adoption-form-item v-model="adoptionForm.adopter_wechatId" label="微信号" placeholder="输入微信号" type="input" :isRequire="true"/>
				<pet-adoption-form-item v-model="adoptionForm.adopter_mobile" label="手机号" placeholder="输入手机号" type="input" />
			</block>
		  </view>
		
		  <pet-adoption-bottom-btn
		      left-text="上一步"
		      :right-text="stepPage === 0 ? '下一步' : ( adoption_id > 0 ? '保存' : '发布') "
		      :leftCondition="stepPage === 1"
		      @leftBtnHandle="stepPage = 0"
		      @rightBtnHandle="rightBtnHandle"
		  />
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<style lang="scss" scoped>
.push-adoption-wrapper {
  position: relative;
  padding-bottom: calc(env(safe-area-inset-bottom) + 160rpx);
  @include background_color(page-box-background-color);
  

  .push-step-one-wrapper {
	  .uploade-box{
		  margin: auto;
	  }
	  .tips {
		  margin-top: 20rpx;
	    font-size: $uni-font-size-base;
	    color: $uni-color-primary;
		margin-bottom: 30rpx;
	  }
  }

  .push-step-two-wrapper {
    margin: 24rpx $page-row-spacing;
  }

  .submit-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999999;
    padding: 24rpx 24rpx calc( env(safe-area-inset-bottom) + 24rpx ) 24rpx;
    display: flex;
    align-items: center;
    gap: $uni-spacing-row-lg;
    background: white;
    box-shadow: 0rpx -8rpx 52rpx 0rpx rgba(0, 0, 0, 0.11);

    .left-wrapper {
      width: 100%;

      &.scale {
        width: 220rpx;
      }
    }

    .right-wrapper {
      flex: 1;
    }
  }
  .textarea_wrap{
  	padding: 0 $page-row-spacing;
  	.title-box{
		margin-top: 30rpx;
  		.title{
  			font-size: $uni-font-size-base;
			font-weight: bold;
  		}
  		.required{
  			color: red;
  			font-weight: bold;
  			margin-left: 10rpx;
  		}
  	}
  	.textarea-box{
  		display: block;
  		margin-top: 10rpx;
  		._textarea{
  			font-size: $uni-font-size-base;
  		}
  	}
  	.uploade-box{
  		display: block;
  		margin-top: 10rpx;
  	}
	.uploade-video-box{
	display: flex;
	margin-top: 20rpx;
	box-sizing: border-box;
	flex-direction: column;
	.media-video{
		position: relative;
		width: 400rpx;
		height: 300rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		box-sizing: border-box;
		.picture-delete {
		  position: absolute;
		  top: 10rpx;
		  right: 8rpx;
		  width: 40rpx;
		  height: 40rpx;
		  border-radius: 500rpx;
		  z-index: 99;
		  color: red;
		  background: rgba(255, 255, 255, 0.7);
		}
		.video-source {
		  width: 400rpx;
		  height: 300rpx;
		  border-radius: 8rpx;
		  animation: fadeIn 1s ease;
		}
		.placeholder-video{
			width: 400rpx;height: 300rpx;
			@include background_color(page-gray-background-color);
			border-radius: 8rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			animation: fadeIn 1s ease;
			.box{
				transform: scale(0.75);
				.tip{
					@include color(color-dark-gray);
					text-align: center;
					font-size: $uni-font-size-base;
					margin-bottom: 10rpx;
				}
			}
		}
	}
	}
  }
}
</style>
