<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import OrganizeBureauPushItem from '@/pagesZ/organize-bureau/push/components/organize-bureau-push-item.vue';
import domVideo from '@/contrib/components/common/ls-dom-video/ls-dom-video';

import miniUploadImg from '@/contrib/components/common/mini-upload-img/mini-upload-img';

const common = require('@/mixins/common');
var options = {};
let vStorageKey = '';

export default {
  mixins: [{ methods: options }],
  components: {
    myToast, navBar, hoverBall,
    OrganizeBureauPushItem,
    miniUploadImg,
    domVideo
  },
  data() {
    return {
      pagebgcolorClass: 'pagebg_white', fph: false, mytoast_data: {}, pageTheme: 'default', page__scene__: 145,
	  page_title: '发布活动',
      mediaCount: 1,
      formData: {
        type: 'bureau_push',
		bureau_type: 1,
        title: '',
        intro: '',
        image_urls: '',
        video_url: '',
        video_cover: '',
        tags: {},
        location: {
          latitude: 0,
          longitude: 0,
          address_name: '',
          address_detailed: ''
        },
        gameDate: { label: '', value: ['', ''] },
        exposure_type: 1,
        refund_policy: 0,
        user_info_fill: '',
        group: [
          {
            isShowMore: false,
			name: '',
            total_people: '',
            cost_per_person: 0.00,
            is_waiting: false,
            is_limit_one: false,
			is_real_name: false,
            signup_end_time: { label: '', value: '' },
            signup_start_time: { label: '', value: '' },
            signup_scope: '',
			signup_gender: '',
          }
        ]
      },
      uStorageKey: '',
      isUploading: false,
      groupItem: {
        isShowMore: false,
		name: '',
        total_people: '',
        cost_per_person: '',
        is_waiting: false,
        is_limit_one: false,
		is_real_name: false,
        signup_end_time: { label: '', value: '' },
		signup_start_time: { label: '', value: '' },
        signup_scope: '',
		signup_gender: '',
      },
      isValidSubmit: false,
      gameDateData: [
        [],
        ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
      ],
      endDateData: [
        [],
        ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
      ],
      openData: [
        { label: '公开（所有地方可见）', value: 1 },
        { label: '私密（不出现在首页）', value: 2 },
        { label: '私密（仅分享链接可见）', value: 3 }
      ],
      refundData: [
        { label: '活动开始前随时可以下车', value: 0 },
        { label: '活动前3个小时', value: 3 },
        { label: '活动前12个小时', value: 12 },
        { label: '活动前24个小时', value: 24 },
        { label: '活动前48个小时', value: 48 },
        { label: '活动前3天', value: 72 },
        { label: '活动前7天', value: 168 },
        { label: '活动前10天', value: 240 },
        { label: '活动不支持无理由退款', value: 255 },
      ],
      signDateData: [
        [],
        ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
      ],
      signRangeData: [
        { label: '所有人', value: 1 },
        { label: '仅俱乐部成员', value: 2 }
      ],
	  signGenderData: [
	    { label: '不限制性别', value: 0 },
	    { label: '仅男性', value: 1 },
		{ label: '仅女性', value: 2 },
		// { label: '男女1:1', value: 3 }
	  ],
	  showGroupName: false,
	  tmpGroupName: '',
	  updatedingGrouIndex: 0,
	  isFromDraft: false
    }
  },
  onLoad: function (options) {
  	let that = this;
  	that.globalOnloadProcess(options);

	let flag = true;
	if(options.id && options.id > 0){
		if(options.repeat == 1){
			that.bureau_for_repeat(options.id);
		}else{
			flag = false;
			that.bureau_for_update(options.id);
		}
	}else{
		// 检查是否有草稿数据
		uni.getStorage({
			key: 'draft_bureau',
			success: function (res) {
				that.isFromDraft = true;
				that.formData = res.data;
				uni.showToast({
					title: '草稿已恢复',
					icon: 'none'
				});
			}
		});
	}
	
	if(flag){
		for (let i = 0; i <= 180; i++) {
		  let date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
		  let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
		  let day = date.getDate()
		  let week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
		  that.signDateData[0].push(month + '月' + day + '日 周' + week)
		  that.gameDateData[0].push(month + '月' + day + '日 周' + week)
		}
	}
	
  },
  onShow: function () {
    let that = this;
    that.updateScene(145, 0, true, false, 0, 2);

    if (vStorageKey && vStorageKey.length > 0) {
      if (that.formData.video_url && that.formData.video_url.length > 0) {

      } else {
        let videoObj = uni.getStorageSync(vStorageKey);
        if (videoObj && videoObj.video_url && videoObj.video_url.length > 0) {
          that.formData.video_url = videoObj.video_url;
          that.formData.video_cover = videoObj.video_cover;
          // uni.removeStorageSync(vStorageKey);
        }
      }
    }

    if (that.uStorageKey && that.uStorageKey.length > 0) {
      let userinfoArr = uni.getStorageSync(that.uStorageKey);
	  if(userinfoArr){
		that.formData.user_info_fill = JSON.stringify(userinfoArr);
		uni.setStorageSync(that.uStorageKey+'_update', userinfoArr);
	  }
    } else {
      that.uStorageKey = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);

        return v.toString(16);
      });
    }
	
	if (that.myUserInfo?.club_id > 0) {
		
	}else{
		uni.wen.util.updateUserInfo();
		uni.showModal({
			title: '未入驻俱乐部',
			content: '请先填写您的俱乐部信息，通过审核后才可发布组局活动',
			showCancel: true,
			confirmText: '去填写',
			confirmColor: that.primaryColor,
		
			success(res2) {
				if (res2.confirm){
					uni.wen.toUrl(6, '/pagesZ/organize-bureau/settle-in/index', that);
				}
			}
		});
	}

  },
  watch: {
    formData: {
      handler(newVal) {
        this.isValidSubmit = this.isValidForm;
      },
      deep: true
    }
  },
  computed: {
    isValidForm() {
      return this.validateForm(this.formData);
    },
	config2_bureau_tags: {
	  get() {
	    return this.$store.state.config2?.bureau?.tags;
	  },
	  set(v) {}
	},
  },
  onPullDownRefresh: function () {
    uni.stopPullDownRefresh();
  },
  methods: {
	bureau_for_repeat(id){
		let that = this;
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/process', {
			type: 'bureau_for_update',
			bureau_id: id,
			is_for_repeat: 1,
		}, 'POST').then(res => {
			if(res.status){
				that.formData = res.data;
				if(res.data.image_urls){
					setTimeout(function(){
						try{
							that.$refs.miniUploader.setInitValue(res.data.image_urls);
							if (that.uStorageKey?.length > 0 && that.formData?.user_info_fill?.length > 0) {
							  uni.setStorageSync(that.uStorageKey+'_update', JSON.parse(that.formData.user_info_fill));
							}
						}catch(e){
							setTimeout(function(){
								that.$refs.miniUploader.setInitValue(res.data.image_urls);
								if (that.uStorageKey?.length > 0 && that.formData?.user_info_fill?.length > 0) {
								  uni.setStorageSync(that.uStorageKey+'_update', JSON.parse(that.formData.user_info_fill));
								}
							}, 300);
						}
					}, 600);
				}
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
		});
	},
	bureau_for_update(id){
		let that = this;
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/process', {
			type: 'bureau_for_update',
			bureau_id: id
		}, 'POST').then(res => {
			if(res.status){
				that.page_title = '修改活动'
				that.formData = res.data;
				
				let startDateStr = res.data.base_date;
				let startDate = new Date(startDateStr);
				
				for (let i = 0; i <= 180; i++) {
				  let date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
				  let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
				  let day = date.getDate();
				  let week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
				  that.signDateData[0].push(month + '月' + day + '日 周' + week);
				  that.gameDateData[0].push(month + '月' + day + '日 周' + week);
				}
				
				setTimeout(function(){
					try{
						that.$refs.miniUploader.setInitValue(res.data.image_urls);
					}catch(e){
						setTimeout(function(){
							that.$refs.miniUploader.setInitValue(res.data.image_urls);
						}, 300);
					}
				}, 600);
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
		});
	},
    validateForm(formData) {
        if (!formData) return false;
    
        // 检查主表单字段
        const mainFields = ['title', 'intro', 'location', 'gameDate'];
        let hasImageOrVideo = formData.image_urls?.length > 0 || formData.video_url.length > 0;
    
        for (let key of mainFields) {
          if (!formData[key] || (Array.isArray(formData[key]) && formData[key].length === 0) || (typeof formData[key] === 'object' && Object.keys(formData[key]).length === 0)) {
            return false;
          }
        }
    
        if (!hasImageOrVideo) return false;
    
        // 检查 each group 的字段
          const groupFields = ['total_people', 'cost_per_person', 'signup_end_time'];
          for (let group of formData.group) {
            for (let key of groupFields) {
              if (!group[key] || 
                  (Array.isArray(group[key]) && group[key].length === 0) || 
                  (typeof group[key] === 'object' && !group[key].value && Object.keys(group[key]).length === 0)) {
                return false;
              }
            }
          }
    
        return true;
    },
    create_video_play() {
	  let that = this;
      let domVideo = that.$refs.domVideo;
      domVideo.play();
    },
    onVideoDelete() {
	  let that = this;
      that.formData.video_url = '';
      that.formData.video_cover = '';

      uni.removeStorage({
        key: vStorageKey,
        success: function (res) {
          console.log(vStorageKey + '删除成功');
          vStorageKey = '';
        }
      });
    },
    miniUploadImgChange(data) {
	  let that = this;
      let image_urls = data.urls.map(url => ({ url }));
      that.formData.image_urls = image_urls;
      that.isUploading = false;
    },
    addGroup() {
	  let that = this;
      that.formData.group.push(JSON.parse(JSON.stringify(that.groupItem)));
      that.isValidSubmit = that.validateForm(that.formData);
    },
    deleteGroup(index) {
	  let that = this;
      if (that.formData.group.length > 1) {
        that.formData.group.splice(index, 1);
        that.isValidSubmit = that.validateForm(that.formData);
      } else {
        uni.showToast({
          title: '至少保留一个分组',
          icon: 'none'
        });
      }
    },
    handleDraft(flag) {
		let that = this;
		if(flag){
			if (that.isValidSubmit) {
				// 保存草稿数据到本地存储
				uni.setStorage({
				  key: 'draft_bureau',
				  data: that.formData,
				  success: function () {
					uni.showToast({
					  title: '草稿已保存',
					  icon: 'none'
					});
				  }
				});
			} else {
			  uni.showToast({
			    title: '请完善信息',
			    icon: 'none'
			  });
			}
		}else{
			uni.removeStorage({
				key: 'draft_bureau',
				success: function () {
					that.isFromDraft = false;
					uni.showToast({
						title: '草稿缓存已清理',
						icon: 'none'
					});
				}
			});
		}
    },
    handleSubmit() {
		let that = this;
        if (that.isValidSubmit) {
          uni.loading(true);
		  
			const getFormattedDate = index => {
			  if (typeof index !== 'number') return '';
			  if(that.formData.id > 0){
				let startDateStr = that.formData.base_date; // 固定的起始日期
				let startDate = new Date(startDateStr);
				startDate.setDate(startDate.getDate() + index);
				let month = (startDate.getMonth() + 1).toString().padStart(2, '0');
				let day = startDate.getDate().toString().padStart(2, '0');
				return `${startDate.getFullYear()}-${month}-${day}`;
			  }else{
				let date = new Date();
				date.setDate(date.getDate() + index);
				let month = (date.getMonth() + 1).toString().padStart(2, '0');
				let day = date.getDate().toString().padStart(2, '0');
				return `${date.getFullYear()}-${month}-${day}`;
			  }
			};
		
			// 获取具体时间（假设索引直接对应某个时间值）
			const getFormattedTime = (hourIndex, minuteIndex) => {
			  if (typeof hourIndex !== 'number' || typeof minuteIndex !== 'number') return '';
			  const hours = this.gameDateData[1][hourIndex].toString().padStart(2, '0');
			  const minutes = this.gameDateData[2][minuteIndex].toString().padStart(2, '0');
			  return `${hours}:${minutes}:00`;
			};
		
			// 获取具体日期和时间（用于group中的endDate和signDate）
			const getFormattedDateTime = value => {
			  if (!Array.isArray(value) || value.length !== 3) return '';
			  const [dateIndex, hourIndex, minuteIndex] = value;
			  const date = getFormattedDate(dateIndex);
			  const time = getFormattedTime(hourIndex, minuteIndex);
			  return `${date} ${time}`;
			};
			
			// 验证活动时间
			const serviceStartDateTime = new Date(`${that.formData.service_date_start}T${that.formData.service_time_start}`);
			const serviceEndDateTime = new Date(`${that.formData.service_date_end}T${that.formData.service_time_end}`);
			if (serviceEndDateTime.getTime() - serviceStartDateTime.getTime() < 30 * 60 * 1000) {
				uni.loading(false);
				uni.showToast({
					title: '活动开始时间到结束时间必须大于30分钟',
					icon: 'none'
				});
				return;
			}

			// 验证报名时间
			that.formData.group.forEach(group => {
				const signupStartDateTime = group.signup_start_time ? new Date(group.signup_start_time) : new Date();
				const signupEndDateTime = new Date(group.signup_end_time);
				if (signupEndDateTime.getTime() - signupStartDateTime.getTime() < 30 * 60 * 1000) {
					uni.loading(false);
					uni.showToast({
						title: '报名开始时间到结束时间必须大于30分钟',
						icon: 'none'
					});
					return;
				}

				if (signupEndDateTime > serviceStartDateTime && signupEndDateTime.getTime() - serviceStartDateTime.getTime() > 10 * 24 * 60 * 60 * 1000) {
					uni.loading(false);
					uni.showToast({
						title: '报名截止时间到活动开始时间不能超过10天',
						icon: 'none'
					});
					return;
				}
			});

			// 进行数据转换
			const transformedData = {
				type: that.formData.type,
				bureau_type: that.formData.bureau_type,
				id: that.formData.id ?? 0,
				title: that.formData.title,
				intro: that.formData.intro,
				image_urls: that.formData?.image_urls?.map(image => image.url),  // 转换为字符串数组
				video_url: that.formData.video_url,
				video_cover: that.formData.video_cover,
				tags: [that.formData?.tags?.label],  // 转换为标签数组
				location: {
				  latitude: that.formData.location.latitude,
				  longitude: that.formData.location.longitude,
				  address_name: that.formData.location.address_name,
				  address_detailed: that.formData.location.address_detailed
				},
				service_date_start: getFormattedDate(this.formData.gameDate.value[0][0]),
			    service_date_end: getFormattedDate(this.formData.gameDate.value[1][0]),  // 结束日期
			    service_time_start: getFormattedTime(this.formData.gameDate.value[0][1], this.formData.gameDate.value[0][2]),
			    service_time_end: getFormattedTime(this.formData.gameDate.value[1][1], this.formData.gameDate.value[1][2]),  // 结束时间
				exposure_type: that.formData.exposure_type?.value ?? 1,  // 直接使用数值
				refund_policy: that.formData.refund_policy?.value ?? 255,
				user_info_fill: that.formData.user_info_fill,
				group: that.formData.group.map(group => ({
				  id: group?.id ?? 0,
				  name: group.name ?? '',
				  total_people: parseInt(group.total_people, 10),  // 转换为整数
				  cost_per_person: parseFloat(group.cost_per_person),  // 转换为浮点数
				  is_waiting: group.is_waiting,
				  is_limit_one: group.is_limit_one,
				  is_real_name: group.is_real_name,
				  signup_end_time: group.signup_end_time.value ? getFormattedDateTime(group.signup_end_time.value) : '',  // 使用getFormattedDateTime函数，检查value是否存在
				  signup_start_time: (group.signup_start_time && group.signup_start_time.value) ? getFormattedDateTime(group.signup_start_time.value) : '',  // 使用getFormattedDateTime函数，检查value是否存在
				  signup_gender: group.signup_gender ? group.signup_gender.value : null,
				  signup_scope: group.signup_scope ? group.signup_scope.value : null  // 如果不存在，传null
				}))
			};
		  
          uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/process', transformedData, 'POST').then(res => {
            uni.loading(false);
			if(res.status){
				uni.showToast({
					title: '发布中，审核中...',
					icon: 'none'
				});
				// 清理草稿
				uni.removeStorage({
					key: 'draft_bureau',
					success: function () {
					  console.log('草稿已清除');
					}
				  });
				setTimeout(function(){
					uni.wen.toUrl(-6, '/pagesZ/organize-bureau/details/index?id=' + res.data, that);
				}, 300);
			}else if( res.code == 200041 ){
				uni.showModal({
					title: '默认昵称不能发布内容',
					content: '为了您在社区的信誉，请勿以"微信用户","普通用户"'+ (that.$store.state.config.user?.default_user_name.length > 0 ? ',"'+that.$store.state.config.user?.default_user_name+'"' : '') +'开头',
					showCancel: true,
					confirmText: '修改昵称',
					confirmColor: that.primaryColor,
					success(res) {
						if (res.confirm){
							uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine', that);
						}
					}
				});
				return false;
			}else{
				uni.showToast({
				  title: res.message,
				  icon: 'none'
				});
			}
          });
        } else {
          uni.showToast({
            title: '请完善信息',
            icon: 'none'
          });
        }
    },
    showMore(index) {
	  let that = this;
      that.formData.group[index].isShowMore = !that.formData.group[index].isShowMore;
    },
    setVkey(value) {
      vStorageKey = value;
    },
	changeGroupName() {
		this.formData.group[this.updatedingGrouIndex].name = this.tmpGroupName;
		this.showGroupName = false;
	},
	showChangeGroupName(flag, index) {
		this.showGroupName = flag
		if(flag){
			this.updatedingGrouIndex = index;
			this.tmpGroupName = this.formData.group[index].name;
		}
	},
  }
}
</script>

<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :title="page_title" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="push-page">
		  <view style="height: 20rpx;"></view>
		  <view class="one-card-wrapper">
		    <input class="_input" placeholder="输入活动标题" placeholder-class="_input_place_holder" v-model="formData.title"/>
		    <view class="textarea-wrapper">
		      <u-textarea
		          class="textarea-input"
		          border="none"
		          height="200"
				  :confirmType="null"
		          style="padding: 0" v-model="formData.intro"
				  :maxlength="7000"
		          placeholder="描述一下活动的亮点、活动内容、推荐的入群、贴心tips等, 叫大家一起吧~"
		      />
		    </view>

			<view class="video-wrap" v-if=" formData.video_url && formData.video_url.length > 0 ">
				<view class="uploade-video-box">
					<view class="media-video">
						<!-- #ifdef APP || H5 -->
						<view @tap.stop.prevent="create_video_play">
						  <dom-video style="width: 400rpx;height: 300rpx;" ref="domVideo" :src="formData.video_url"/>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP -->
						<video class="video-source" :controls="true" :src="formData.video_url"></video>
						<!-- #endif -->
						<i @tap.stop.prevent="onVideoDelete" class="picture-delete mini-icon mini-chacha"></i>
					</view>
				</view>
			</view>
			
			<view class="images">
				<mini-upload-img ref="miniUploader" style="width: 690rpx;" @uploading=" isUploading = true " :number="20"
					@change="miniUploadImgChange" :showAdd="true" :scene="145" :canVideo="true" @vkey="setVkey"></mini-upload-img>
			</view>
			
		
		    <view class="push-item-wrapper">
		      <organize-bureau-push-item label="活动类型" popupTitle="选择活动类型" v-model="formData.tags" type="gameTypeCheck" :range="config2_bureau_tags" icon="mini-icon-z mini-z-leixing1"/>
		      <organize-bureau-push-item label="集合地点" v-model="formData.location" :labelText="formData.location.address_detailed" :isLocation="true" icon="mini-icon-z mini-z-location"/>
		      <organize-bureau-push-item label="活动时间" v-model="formData.gameDate" :labelText="formData.gameDate.label" type="gameDatePick" :range="gameDateData" icon="mini-icon-z mini-z-shijian1" @setEndDate="setEndDate"/>
		      <organize-bureau-push-item label="曝光策略" popupTitle="选择可见范围" v-model="formData.exposure_type" type="openCheck" :range="openData" icon="mini-icon-z mini-z-fanwei"/>
		      <organize-bureau-push-item label="退款政策" v-model="formData.refund_policy" tip="*超过选择的时间段，申请下车需要主理人同意" type="refundPicker" :range="refundData" icon="mini-icon-z mini-z-tuikuan"/>
			  
			  <block v-if="formData.id && formData.id > 0">
				<organize-bureau-push-item label="问卷收集" subPlaceholder="不允许修改问卷收集" v-model="formData.user_info_fill" icon="mini-icon-z mini-z-yinsi"/>
			  </block>
			  <block v-else>
				<organize-bureau-push-item label="问卷收集" subPlaceholder="选填" v-model="formData.user_info_fill" :url=" '/pagesZ/organize-bureau/push/userInfo?skey=' + uStorageKey " type="url" icon="mini-icon-z mini-z-yinsi"/>
			  </block>
		    </view>
		  </view>
				<view class="team-group" v-for="(item, index) in formData.group" :key="index">
					<view class="team-group-name" v-if="formData.group.length > 1 && !(item.id > 0)">
						<view class="text" @tap.stop.prevent="showChangeGroupName(true, index)">
							{{ item.name || '第'+ (index+1) +'组' }}
							<i class="mini-icon mini-xie"></i>
						</view>
						<view class="mini-icon mini-shanchu3" @click="deleteGroup(index)"></view>
					</view>
					<view class="two-card-wrapper">
					  <view class="push-item-wrapper">
					    <organize-bureau-push-item label="活动人数" popupTitle="多少人参加" placeholder="多少人参加" :labelText="item.total_people+'人'" v-model="item.total_people" type="input-number" max-length="20" icon="mini-icon-z mini-z-zhandui"/>
					    <organize-bureau-push-item label="活动价格" popupTitle="每人多少钱" placeholder="每人多少钱" tip="当价格为0时，不可以设置保险" :labelText="'每人 ¥'+item.cost_per_person" v-model="item.cost_per_person" type="input-number-digit" max-length="20" icon="mini-icon-z mini-z-qian"/>
					    <organize-bureau-push-item label="报名截止时间" v-model="item.signup_end_time" :labelText="item.signup_end_time.label && ('报名截止：'+item.signup_end_time.label)" type="endDatePick" :startDate='formData.gameDate.value' :range="gameDateData" icon="mini-icon-z mini-z-riqi"/>
						<organize-bureau-push-item label="开始报名时间" :labelText="item.signup_start_time.label && ('开始报名时间：'+item.signup_start_time.label)" v-model="item.signup_start_time" type="signDatePicker" :range="signDateData" icon="mini-icon-z mini-z-dingshi" v-show="item.isShowMore"/>
						<organize-bureau-push-item label="性别限制" v-model="item.signup_gender" type="signGenderCheck" :range="signGenderData" icon="mini-icon-z mini-z-xingbie" v-show="item.isShowMore"/>
						<organize-bureau-push-item label="强制实名认证" v-model="item.is_real_name" type="isRealNameSwitch" icon="mini-icon-z mini-z-qiangzhishiming" v-show="item.isShowMore"/>
					    <!-- <organize-bureau-push-item label="可候补等位" v-model="item.is_waiting" type="isWaitingSwitch" icon="mini-icon-z mini-z-houbu" v-show="item.isShowMore"/> -->
					    <!-- <organize-bureau-push-item label="每人限购一次" v-model="item.is_limit_one" type="isQuotaSwitch" icon="mini-icon-z mini-z-xiangou" v-show="item.isShowMore"/> -->
					    <!-- <organize-bureau-push-item label="报名范围" v-model="item.signup_scope" type="signRangeCheck" :range="signRangeData" icon="mini-icon-z mini-z-fanwei" v-show="item.isShowMore"/> -->
					  </view>
						<view class="showMore" @click="showMore(index)">
							<block v-if="!item.isShowMore">
								更多设置<i class="mini-icon mini-xiajiantou" />
							</block>
							<block v-else>
								收起<i class="mini-icon mini-shangjiantou" />
							</block>
						</view>
					</view>
				</view>
				
				<view class="addGroup" @click="addGroup"><i class="mini-icon mini--jia"></i>新增分组</view>
		
		  <view class="bottom-tools-wrapper">
			<block>
				<view class="draft-button" v-if="isFromDraft" @click="handleDraft(false)">删除草稿</view>
				<view class="draft-button" @click="handleDraft(true)" v-else>存草稿</view>
			</block>
			<view style="width: 18rpx;"></view>
		    <view class="push-button" :class="isValidSubmit || 'disabled'" @click="handleSubmit">发布</view>
		  </view>
		</view>
		
		
		<u-popup :show="showGroupName" @close="showChangeGroupName(false, 0)" :closeOnClickOverlay="false" :safeAreaInsetBottom="false"round="10px" mode="center">
			<view class="groupname-dialog-wrapper">
				<view class="title-wrapper">修改第{{ updatedingGrouIndex + 1 }}组名称</view>
					<view class="input-box">
						<u-input placeholder="输入您想修改的名称" maxlength="30" v-model="tmpGroupName" :clearable="true"></u-input>
					</view>
					<view class="flex-row">
						<u-button type="primary" text="取消" shape="circle" :plain="true" @click="showChangeGroupName(false, 0)" :customStyle="{transform: 'scale(0.8)'}"></u-button>
						<view style="width: 60rpx;"></view>
						<u-button type="primary" text="确定" :color="primaryColor" shape="circle" :customStyle="{transform: 'scale(0.8)'}" @click="changeGroupName"></u-button>
					</view>
			</view>
		</u-popup>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<style scoped lang="scss">
@import './push.scss';
</style>
