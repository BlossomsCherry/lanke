<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import PetAdoptionFormItem from "@/pagesP/pet-adoption/components/pet-adoption-form-item.vue";
import PetAdoptionBottomBtn from "@/pagesP/pet-adoption/components/pet-adoption-bottom-btn.vue";

export default {
  components: {
    PetAdoptionBottomBtn,
    myToast, navBar, hoverBall,
    PetAdoptionFormItem
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
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 50007,
      isView: false, // 是否为查看页面类型
      genderRange: [{ label: '男孩', value: 1 }, { label: '女孩', value: 2 }],
      flgRange: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
      experienceRange: [{ label: '有经验', value: 1 }, { label: '无经验', value: 0 }],
      maritalStatusRange: [{ label: '单身', value: 0 }, { label: '恋爱中', value: 1 }, { label: '已婚', value: 2 }],
      housingStatusRange: [{ label: '自住房', value: 0 }, { label: '整租房', value: 1 }, { label: '合租', value: 2 }],
      workingStatusRange: [{ label: '无业', value: 0 }, { label: '学生', value: 1 }, { label: '工作', value: 2 }, { label: '退休', value: 3 }],
      incomeRange: [{ label: '小于3千', value: 0 }, { label: '3千～6千', value: 1 }, { label: '6千～1万', value: 2 }, { label: '1万以上', value: 3 }],
      form: {
		pet_adoption_id: 0,
        gender: 1,
        is_experience: 1,
        marital_status: 0,
        housing_status: 0,
        working_status: 0,
        job: '',
        birthday: '',
        income: 0,
        region: [],
        wechatId: '',
        mobile: '',
        remark: ''
      }
    }
  },
  onLoad: function (options) {
	  let that = this;
	  
	  let application = JSON.parse(decodeURIComponent(options.application))
	  if(application && application.id > 0){
		  that.form = application;
		  that.isView = true
	  }else{
		  that.form.pet_adoption_id = application.pet_adoption_id || 0;
	  }
  },
  onShow: function () {
  	let that = this;
  	that.updateScene(50007, 0, true);
  },
  methods: {
    // 底部右侧按钮点击事件
    rightBtnHandle() {
		let that = this;
		
		if(that.form.pet_adoption_id.length <= 0){
			uni.showToast({
				title: '页面错误，请返回重新进入',
				icon: 'none'
			});
			return false;
		}
		if(that.form.job.length <= 1){
			uni.showToast({
				title: '请填写您的职业',
				icon: 'none'
			});
			return false;
		}
		if(that.form.birthday.length <= 1){
			uni.showToast({
				title: '请填写您的生日',
				icon: 'none'
			});
			return false;
		}
		if(that.form.wechatId.length <= 1){
			uni.showToast({
				title: '请填写您的微信号',
				icon: 'none'
			});
			return false;
		}
		
		if(that.form.mobile.length <= 1 || !uni.wen.util.validatePhoneNumber(that.form.mobile)){
			uni.showToast({
				title: '请填写正确的手机号',
				icon: 'none'
			});
			return false;
		}
		if(that.form.remark.length <= 1){
			uni.showToast({
				title: '请填写个人说明',
				icon: 'none'
			});
			return false;
		}
		
		if (that.isView) {
			uni.wen.util.request(
				uni.wen.api.ApiRootUrl + 'pets/adoption/apply', that.form, 'POST'
			).then(function (res) {
				if (res.code == 200) {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
					setTimeout(function(){
						uni.wen.toUrl(18, res.data.object_id, null);
					}, 500)
				}else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
      } else {
        that.isView = true
      }
    }
  },
}
</script>

<template>
  <view class="adoptive-user-info-gather-page">
    <pet-adoption-form-item v-model="form.gender" type="tag" :isView="isView" :label="isView ? '性别' : '我的性别'" :range="genderRange" :isRequire="true" />
    <pet-adoption-form-item v-model="form.is_experience" type="tag" :isView="isView" label="养宠经验" :range="experienceRange" :isRequire="true" />
    <pet-adoption-form-item v-model="form.marital_status" type="tag" :isView="isView" label="婚姻状况" :range="maritalStatusRange" :isRequire="true" />
    <pet-adoption-form-item v-model="form.housing_status" type="tag" :isView="isView" label="住房情况" :range="housingStatusRange" :isRequire="true" />
    <pet-adoption-form-item v-model="form.working_status" type="tag" :isView="isView" label="工作状态" :range="workingStatusRange" :isRequire="true" />
    <pet-adoption-form-item v-model="form.job" type="input" :isView="isView" :label="isView ? '从事职业' : '我的职业'" placeholder="输入你的职业" max-length="10" :isRequire="true" />
    <pet-adoption-form-item v-model="form.birthday" type="date-picker" :isView="isView" :label="isView ? '年龄' : '我的年龄'" placeholder="请选择" :isRequire="true" />
    <pet-adoption-form-item v-model="form.income" type="picker" :isView="isView" label="月收入" :range="incomeRange" :isRequire="true" />
    <pet-adoption-form-item v-model="form.region" type="region-picker" :isView="isView" :label="isView ? '所在地' : '我的地址'" :isRequire="true" />
	<block v-if=" config_app_mode != 'examine' ">
		<pet-adoption-form-item v-model="form.wechatId" type="input" :isView="isView" label="微信号" placeholder="输入微信号" :isRequire="true" />
		<pet-adoption-form-item v-model="form.mobile" type="input" :isView="isView" label="手机号" placeholder="输入手机号" :isRequire="true" />
	</block>
    <pet-adoption-form-item v-model="form.remark" type="textarea" position="top" :isView="isView" :label="isView ? '简介' : '让送养人看到我的诚意'" placeholder="输入想说的话..." :isRequire="true" />
    <!-- 底部按钮栏 -->
    <pet-adoption-bottom-btn
        left-text="修改资料"
        :right-text="isView ? '发送' : '提交修改'"
        :leftCondition="isView"
        @leftBtnHandle="isView = false"
        @rightBtnHandle="rightBtnHandle"
    />
  </view>
</template>

<style lang="scss" scoped>
.adoptive-user-info-gather-page {
  position: relative;
  margin: $uni-spacing-col-lg 0;
  padding-bottom: calc(env(safe-area-inset-bottom) + 170rpx);
}
</style>
