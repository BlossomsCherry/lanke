<script>
import PetAdoptionFormItem from "@/pagesP/pet-adoption/components/pet-adoption-form-item.vue";
import PetAdoptionBottomBtn from "@/pagesP/pet-adoption/components/pet-adoption-bottom-btn.vue";

export default {
  components: { PetAdoptionBottomBtn, PetAdoptionFormItem },
  data() {
    return {
      stepPage: 0,
      identityRange: [{ label: '领养人', value: 1 }, { label: '送养人', value: 2 }],
      genderRange: [{ label: '男', value: 1 }, { label: '女', value: 2 }],
      reportForm: {
        identity: 1,
        gender: 1,
        realName: '',
        idCard: '',
        wechatName: '',
        mobile: '',
        wechat: '',
        region: '',
        address: '',
        reportContent: '',
        reportPicture: [],
        contact: {
          name: '',
          mobile: '',
          wechat: ''
        }
      }
    }
  },
  computed: {
    // 底部按钮是否允许点击
    btnDisabled() {
      if (this.stepPage === 0) {
        return !(this.reportForm.mobile || this.reportForm.wechat)
      } else if (this.stepPage === 1) {
        return !this.reportForm.reportContent
      } else if (this.stepPage === 2) {
        const contact = this.reportForm.contact
        return !(contact.name && contact.mobile && contact.wechat)
      }
    },
	config_app_mode:{
		get(){
			let that = this;
			if(that.$store.state.config.app && that.$store.state.config.app.mode){
				return that.$store.state.config.app.mode;
			}
			return ' ';
		},
		set(v){}
	}
  },
  methods: {
    leftBtnHandle() {
      if (this.stepPage !== 0) {
        this.stepPage -= 1
      }
    },
    rightBtnHandle() {
      if (this.stepPage === 2) {
        // 提交
      } else {
        this.stepPage += 1
      }
    }
  }
}
</script>

<template>
  <view class="push-report-page">

    <view v-if="stepPage === 0">
      <pet-adoption-form-item v-model="reportForm.identity" type="tag" :range="identityRange" label="TA的身份"/>
      <pet-adoption-form-item v-model="reportForm.gender" type="tag" :range="genderRange" label="性别"/>
      <pet-adoption-form-item v-model="reportForm.realName" type="input" label="真实姓名" placeholder="选填"/>
      <pet-adoption-form-item v-model="reportForm.idCard" type="input" label="身份证号" placeholder="选填"/>
      <pet-adoption-form-item v-model="reportForm.wechatName" type="input" label="微信昵称" placeholder="选填"/>
      <u-gap height="20" bgColor="#f7f7f7"/>

	<block v-if=" config_app_mode != 'examine' ">
		<view class="tips-wrapper">
		<u-icon name="info-circle" color="#ff9b39"/>
		<view>手机号和微信号必填一项～</view>
		</view>

		<pet-adoption-form-item v-model="reportForm.mobile" type="input" label="手机号" placeholder="选填"/>
		<pet-adoption-form-item v-model="reportForm.wechat" type="input" label="微信号" placeholder="选填"/>
		<u-gap height="20" bgColor="#f7f7f7"/>
	</block>

      <pet-adoption-form-item v-model="reportForm.region" type="region-picker" label="所在地"/>
      <pet-adoption-form-item v-model="reportForm.address" type="input" label="详细地址" placeholder="选填"/>
    </view>

    <view v-else-if="stepPage === 1">
      <pet-adoption-form-item v-model="reportForm.reportContent" type="textarea" label="填写举报内容" position="top" placeholder="请叙述为什么举报TA，举报TA的原因..."/>
      <pet-adoption-form-item
          label="上传图片证据(最多9张)"
          :value="reportForm.reportPicture"
          type="picture"
          :mediaCount="9"
          position="top"
          @change="e => reportForm.reportPicture.push(...e)"
          @deleted="idx => reportForm.reportPicture.splice(idx, 1)"
      />
    </view>

    <view v-else-if="stepPage === 2">
      <view class="tips-wrapper">
        <u-icon name="info-circle" color="#ff9b39"/>
        <view>温馨提示：以下信息请务必填写，我们会联系您进行核实，如果联系不上，您举报的信息将自动作废！</view>
      </view>
      <pet-adoption-form-item v-model="reportForm.contact.name" type="input" label="姓名" placeholder="输入您的姓名"/>
      <pet-adoption-form-item v-model="reportForm.contact.wechat" type="input" label="微信号" placeholder="请输入微信号"/>
      <pet-adoption-form-item v-model="reportForm.contact.mobile" type="input" label="手机号" placeholder="请输入手机号"/>
    </view>

    <!-- 底部按钮栏 -->
    <pet-adoption-bottom-btn
        left-text="上一步"
        :right-text="stepPage !== 2 ? '下一步' : '提交'"
        :leftCondition="stepPage !== 0"
        :right-btn-disabled="btnDisabled"
        @leftBtnHandle="leftBtnHandle"
        @rightBtnHandle="rightBtnHandle"
    />
  </view>
</template>


<style lang="scss" scoped>
.push-report-page {
  position: relative;
  margin: $uni-spacing-col-lg 0;
  padding-bottom: calc(env(safe-area-inset-bottom) + 170rpx);

  .tips-wrapper {
    margin: $uni-spacing-col-lg $page-row-spacing;
    display: flex;
    align-items: flex-start;
    gap: $uni-spacing-row-sm;
    color: #ff9b39;
    font-size: $uni-font-size-sm;
  }
}
</style>
