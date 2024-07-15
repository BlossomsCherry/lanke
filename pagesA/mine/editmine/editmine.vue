<template>
  <view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body">
		<navBar :back="true" :home="fph" title="个人信息" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
      <view class="editmine-wrapper">
        <view class="inner">
          <!-- 头像 -->
          <view class="avater-wrapper" @tap.stop.prevent="clipperImage" data-type="avatarClipper">
            <image class="image" :data-src="avatar" mode="aspectFill" :src="avatar"/>
            <i class="mini-icon mini-xiangji camera-icon" @tap.stop.prevent="clipperImage" data-type="avatarClipper"/>
          </view>
		</view>
		<view class="inner">
          <!-- 信息列表 -->
          <view class="info-list-wrapper">
            <view class="item-wrapper divider" @tap.stop.prevent="nicknameChange">
              <view class="label">昵称</view>
              <view class="right flex-row">
                <view :class="[nickName ? 'content' : 'placeholder']">{{ nickName || '起一个名字～' }}</view>
                <i class="mini-icon mini-youjiantou youjiantou-icon"/>
              </view>
            </view>
            <view class="split"></view>
			<view class="item-wrapper divider">
			    <view class="label">UID</view>
			    <view class="right flex-row" style="padding-right: 28rpx;">{{ uid }}</view>
			  </view>
			  <view class="split"></view>
			  <view class="item-wrapper divider" @tap.stop.prevent="showSignatureDialog = true">
			    <view class="label">简介</view>
			    <view class="right flex-row">
			      <view :class="[signatureIsDefault ? 'signature placeholder' : 'signature content']">
			        <view class="_text">
			          {{ signature }}
			        </view>
			      </view>
			      <i class="mini-icon mini-youjiantou youjiantou-icon"/>
			    </view>
			  </view>
			  <view class="split"></view>
			  <view class="item-wrapper divider" @tap.stop.prevent="genderChange">
			    <view class="label">性别</view>
			    <view class="right flex-row">
			      <view class="content">{{ genderToText }}</view>
			      <i class="mini-icon mini-youjiantou youjiantou-icon"/>
			    </view>
			  </view>
			  <view class="split"></view>
			  <view class="item-wrapper divider">
			    <view class="label">生日</view>
			    <view class="right flex-row">
			      <picker class="picker-wrapper" @change.stop.prevent="bindDateChange" mode="date" :value="birth">
			        <view :class="birth ? 'content' : 'placeholder'">{{ birth || '请选择生日' }}</view>
			      </picker>
			      <i class="mini-icon mini-youjiantou youjiantou-icon"/>
			    </view>
			  </view>
			  <block v-if=" config_app_mode != 'examine' ">
				  <view class="split"></view>
				  <view class="item-wrapper divider" @tap.stop.prevent="showwechatAccountDialog = true">
				    <view class="label">微信号</view>
				    <view class="right flex-row">
				      <view :class="((wechatAccount && wechatAccount.length) > 0 ? 'signature content' : 'signature placeholder')">
				        <view class="_text">
				          {{ ((wechatAccount && wechatAccount.length) > 0 ? wechatAccount : '') }}
				        </view>
				      </view>
				      <i class="mini-icon mini-youjiantou youjiantou-icon"/>
				    </view>
				  </view>
			  </block>
			  <view class="split"></view>
			  <!-- 		    <view class="item-wrapper divider">
			            <view class="label">地区</view>
			            <picker class="picker-wrapper" @change="bindRegionsChange" mode="region" :value="regions">
			              <view :class="regions ? 'content' : 'placeholder'">{{ `${regions[0]}-${regions[1]}-${regions[2]}` || '你在哪儿' }}</view>
			            </picker>
			            <i class="mini-icon mini-youjiantou youjiantou-icon"/>
			          </view> -->
			
			  <view class="item-wrapper divider" @tap.stop.prevent="clipperImage" data-type="imagesubjectClipper">
			    <view class="label">背景图</view>
			    <view class="right flex-row">
			      <image v-if="imagesubject" class="image" mode="aspectFill" :data-src="imagesubject" :src="imagesubject"/>
			      <view v-else class="placeholder">选择一张美美的背景图吧~</view>
			      <i class="mini-icon mini-youjiantou youjiantou-icon" style="line-height: 26px;"/>
			    </view>
			  </view>
			
			  <view class="split"></view>
			
			  <view class="item-wrapper" @tap.stop.prevent="showTagSheet = true">
			    <view class="label">标签</view>
			    <view class="right flex-row">
			      <scroll-view class="_scroll-view" :scroll-x="true" :enable-flex="true">
			        <view class="flex-row" style="justify-content: space-between;">
			          <view></view>
			          <view class="tag-list">
			            <view class="tag-item" v-for="(item, index) in tagList" :key="index">
			              <view class="tag">{{ item }}</view>
			            </view>
			          </view>
			        </view>
			      </scroll-view>
			      <i class="mini-icon mini-youjiantou youjiantou-icon"/>
			    </view>
			  </view>
			</view>
		</view>
		
		
		<view class="page-block-gap"></view>
		<view class="inner">
			<view class="item-wrapper">
			  <view class="label other-info-title">其他信息</view>
			  <view class="right"> 
			  </view>
			</view>
			<view class="info-list-wrapper">
				<view class="item-wrapper" @tap.stop.prevent="phoneHandler">
				  <view class="label">手机号</view>
				  <view class="right flex-row">
					  <block v-if="myUserInfo.phone && myUserInfo.phone.length > 0">
						<view class="content">{{ '(+' + myUserInfo.country_code + ')' + myUserInfo.phone }}</view>
					  </block>
					  <block v-else>
						  <view class="placeholder">添加手机号</view>
					  </block>
				    <i class="mini-icon mini-youjiantou youjiantou-icon"/>
				  </view>
				</view>
				
				<view class="split"></view>
				<view class="item-wrapper" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/realname/realname')">
				  <view class="label">实名</view>
				  <view class="right flex-row"> 
				  <view class="placeholder">{{ (myUserInfo.real_name && myUserInfo.real_name.length > 0) ? myUserInfo.real_name : '认证' }}</view>
				  <i class="mini-icon mini-youjiantou youjiantou-icon"/>
				  </view>
				</view>
				
				<view class="split"></view>
				<view class="item-wrapper" @tap.stop.prevent="toSliderUrl(6, '/pagesA/attestation/attestation')">
				  <view class="label">学生认证</view>
				  <view class="right flex-row"> 
				  <view class="placeholder">{{ (myUserInfo.university && myUserInfo.university.length > 0) ? myUserInfo.university : '认证' }}</view>
				  <i class="mini-icon mini-youjiantou youjiantou-icon"/>
				  </view>
				</view>
				
				<view class="split"></view>
				<view class="item-wrapper" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/editmine/accountbind')">
				  <view class="label">第三方账号</view>
				  <view class="right flex-row"> 
				  <view class="placeholder">查看</view>
				  <i class="mini-icon mini-youjiantou youjiantou-icon"/>
				  </view>
				</view>
				
			</view>
		</view>
		<view class="page-block-gap"></view>
		<view class="safe_area_height"></view>
		
		  <!-- 修改简介弹窗 -->
		  <u-popup :show="showSignatureDialog" :zIndex="999999" @close="cloneSignatureDialog" content-align="center" round="24">
			<view class="signature-dialog-wrapper">
			  <view class="title-wrapper">修改简介</view>
			  <!--              <textarea class="textarea-wrapper" placeholder="填写兴趣爱好、生活方式等个人简介..." maxlength="-1" v-model.trim="signatureTemp" :show-confirm-bar="false"-->
			  <!--                        @confirm="signatureChange" confirm-type="done"/>-->
			  <view class="textarea-wrapper">
				<u--textarea v-model.trim="signatureTemp" fixed count :showConfirmBar="false" placeholder="填写兴趣爱好、生活方式等个人简介.." maxlength="30" height="140"/>
			  </view>
			  <view class="save-signature-wrapper" @tap.stop="signatureChange">保存</view>
			</view>
		  </u-popup>
		  
		  <!-- 修改微信号弹窗 -->
		  <u-popup :show="showwechatAccountDialog" :zIndex="999999" @close="closewechatAccountDialog" content-align="center" round="24">
			<view class="signature-dialog-wrapper">
			  <view class="title-wrapper">修改微信号</view>
			  <view class="textarea-wrapper">
				<u--textarea v-model.trim="wechatAccountTemp" fixed count :showConfirmBar="false" placeholder="您的微信号联系方式.." maxlength="30" height="140"/>
			  </view>
			  <view class="save-signature-wrapper" @tap.stop="wechatAccountChange">保存</view>
			</view>
		  </u-popup>

		  <!-- 选择标签 -->
		  <u-popup :show="showTagSheet" @close="cloneSelectedTagSheet" :zIndex="999999" mode="bottom" closeable :safeAreaInsetBottom="false">
			<view class="tag-sheet-wrapper">
			  <view class="tag-inner">
				<view class="title-wrapper">标签</view>
				<scroll-view class="_scroll-view_tag" :scroll-y="true" :enable-flex="true">
				  <view class="sheet-tag-list">
					<view :class="[isSelectTag(item) ? 'tag selected' : 'tag']" v-for="(item, index) in config2_user_labels" :key="index"
						  @tap.stop.prevent="tagSelectedHandle(item)">{{ item }}
					</view>
				  </view>
				</scroll-view>
			  </view>
			  <!-- <view class="save-tag-wrapper" @tap.stop="saveTagHandle">保存</view> -->
			</view>
		  </u-popup>
		  
		  
		  <u-popup :show="showPhonePopup" @close="shutShowPhonePopup" mode="bottom">
			  <view class="phone-popup-wrap" :style=" (textareaBottom > 0 ? 'padding-bottom: '+ textareaBottom +'px;' : '') ">
				  <view class="inner">
					  <view class="title">
					  	{{ myUserInfo.phone ? '更换手机号' : '添加手机号' }}
					  	<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutShowPhonePopup"></i>
					  </view>
					  <view class="content">
							<view class="line number flex-row">
								<view class="tip flex-column">手机号</view>
								<!-- #ifndef APP-NVUE -->
								<u-input @focus="input_focus" @blur="input_blur" :adjustPosition="false" :placeholder="myUserInfo.phone ? '新手机号' : '输入手机号'" border="bottom" :value="input_phone" @change="input_phone_change" :maxlength="11" :disabled=" !(phone_button_tip == '获取验证码' || phone_button_tip == '重新获取') ">
									<view slot="prefix" class="_prefix" @tap.stop.prevent="shutCountryCodePopup">
										<view class="_text">{{ '+' + idd }}</view>
										<view class="icon">
											<i class="mini-icon mini-xiajiantou"></i>
										</view>
									</view>
								<!-- #endif -->
								<!-- #ifdef APP-NVUE -->
								<u--input @focus="input_focus" @blur="input_blur" :adjustPosition="false" :placeholder="myUserInfo.phone ? '新手机号' : '输入手机号'" :value="input_phone" @change="input_phone_change" :maxlength="11" :disabled=" !(phone_button_tip == '获取验证码' || phone_button_tip == '重新获取') ">
								<!-- #endif -->
									<template slot="suffix">
										<u-code
											ref="uCode"
											seconds="60"
											@change="codeChange"
										></u-code>
										<u-button
											@click="userPhoneBind('GET')"
											:text="phone_button_tip"
											type="primary"
											:disabled=" !(phone_button_tip == '获取验证码' || phone_button_tip == '重新获取') "
											size="small"
										></u-button>
									</template>
								<!-- #ifndef APP-NVUE -->
								</u-input>
								<!-- #endif -->
								<!-- #ifdef APP-NVUE -->
								</u--input>
								<!-- #endif -->
							</view>
							<view class="line code flex-row">
								<view class="tip flex-column">
									验证码
								</view>
								<u-code-input @focus="input_focus" @blur="input_blur" :adjustPosition="false" v-model="input_code" mode="line" hairline :maxlength="4" :fontSize="28"></u-code-input>
							</view>
					  </view>
					    <div class="footer">
							<u-button text="取消" @click="shutShowPhonePopup"></u-button>
							<view class="space"></view>
							<u-button text="确认" type="primary" @click="userPhoneBind('POST')"></u-button>
						</div>
				  </view>
			  </view>
		  </u-popup>
		  
		  <u-popup :show="showCountryCodePopup" @close="shutCountryCodePopup" mode="bottom" :safe-area-inset-bottom="false" :zIndex="99999991009">
		  	<view class="country-code-warap">
		  		<view class="inner">
		  			<view class="title">
		  				选择国际区号
		  				<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutCountryCodePopup"></i>
		  			</view>
		  			<country-code @change="countryCountChange">
		  				
		  			</country-code>
		  		</view>
		  	</view>
		  </u-popup>
		  
		  

		  <l-clipper v-if="avatarClipper" :image-url="pic" @success="addimage($event, { name: 'avatarTmp', type: 'avatarClipper' })" @cancel="avatarClipper = false"/>

		  <l-clipper v-if="imagesubjectClipper" :image-url="pic" @success="addimage($event, { name: 'imagesubjectTmp', type: 'imagesubjectClipper' })"
					 @cancel="imagesubjectClipper = false" :width="1000" :height="1000"/>

		  <hover-ball v-if="isOfficial > 1"/>
		  <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"  @captcha="captchaHanlder"/>
      </view>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
import LClipper from '@/pagesA/components/lime-clipper/components/l-clipper/l-clipper';
const mixins = require('@/mixins/user')
const common = require('@/mixins/common')
var options = {};

mixins(options);
common(options);

export default {
  mixins: [{ methods: options }],
  components: {
	  myToast,navBar,hoverBall,
	  LClipper
  },
  computed: {
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
    config2_user_labels: {
      get() {
        let that = this;
        if (that.$store.state.config2 && that.$store.state.config2.user) {
          return that.$store.state.config2.user.labels;
        }
        return [];
      },
      set(v) {}
    },
    // 判断签名是否为默认签名
    signatureIsDefault() {
      return this.signature === this.$store.state.config.user.user_default_introduce
    },

    // 性别转文本
    genderToText() {
      const list = ['未知', '男', '女']
      return list[this.gender]
    }
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 16,
      avatar: '',
      avatarTmp: '',
      signature: '',
	  wechatAccount: '',
      imagesubject: '',
      imagesubjectTmp: '',
      birth: '',
      avatarClipper: false,
      imagesubjectClipper: false,
      pic: '',
      uid: '',
      nickName: '',
      showBuryBg: false,
      setUserId: 0,
      gender: 0,
      regions: '',
      tagList: [],

      // 控制是否显示简介弹窗
      showSignatureDialog: false,
      signatureTemp: '',
	  
	  showwechatAccountDialog: false,
	  wechatAccountTemp: '',

      // 控制是否显示选择标签sheet页
      showTagSheet: false,
      currentSelectTagList: [],
	  
	  showPhonePopup: false,
	  idd: 86,
	  input_phone: '',
	  input_code: '',
	  phone_button_tip: '获取验证码',
	  textareaBottom: 0,
	  showCountryCodePopup: false,
	  

      signatureRules: {
        required: true,
        min: 5,
        max: 100,
        message: '长度需要在5-100个字符之间'
      },
	  
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);

    if (options.uid) {
      that.setUserId = options.uid;
      uni.setNavigationBarTitle({ title: '编辑ta的资料' });
      that.getUserInfo();
    } else {

    }

  },
  
  onPullDownRefresh: function() {
  	let that = this;
  	that.setData({
  		avatar: '',
  		avatarTmp: '',
  		signature: '',
		wechatAccount: '',
  		imagesubject: '',
  		imagesubjectTmp: '',
  		birth: '',
  		avatarClipper: false,
  		imagesubjectClipper: false,
  		pic: '',
  		uid: '',
  		nickName: '',
  		showBuryBg: false,
  		gender: 0,
  		regions: '',
  		tagList: [],
  		showSignatureDialog: false,
  		signatureTemp: '',
		showwechatAccountDialog: false,
		wechatAccountTemp: '',
  		showTagSheet: false,
  		currentSelectTagList: [],
  		
  		showPhonePopup: false,
  		input_phone: '',
  		input_code: '',
  		phone_button_tip: '获取验证码',
  		textareaBottom: 0,
  		signatureRules: {
  		  required: true,
  		  min: 5,
  		  max: 100,
  		  message: '长度需要在5-100个字符之间'
  		}
  	});
	
	that.getUserInfo();
  
  	setTimeout(function() {
		that.update_local();
  		uni.hideNavigationBarLoading();
  		uni.stopPullDownRefresh();
  	}, 700);
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(16, 0, true, false, 0, 2);
	that.update_local();
  },

  methods: {
	countryCountChange(idd){
		let that = this;
		that.idd = idd;
		that.shutCountryCodePopup();
	},
	shutCountryCodePopup(){
		let that = this;
		that.showCountryCodePopup = !that.showCountryCodePopup;
	},
	update_local(){
		let that = this;
		let userInfo = that.$store.state.userInfo;
		if (userInfo.user_birthday != '' && userInfo.user_birthday != null) {
		  that.setData({ birth: userInfo.user_birthday });
		}
		
		that.setData({
		  uid: userInfo.id,
		  nickName: userInfo.user_name,
		  signature: userInfo.user_introduce,
		  wechatAccount: userInfo.wechat_account || '',
		  avatar: userInfo.user_avatar,
		  gender: userInfo.gender,
		  imagesubject: userInfo.user_background_maps,
		  // regions: [userInfo.province, userInfo.city, userInfo.district],
		  tagList: userInfo.user_labels,
		
		  signatureTemp: userInfo.user_introduce,
		  wechatAccountTemp: userInfo.wechat_account || '',
		  currentSelectTagList: uni.wen.util.deepClone(userInfo.user_labels)
		});
	},
	input_focus(e){
		let that = this;
		console.log(e)
		if(e && e.detail && e.detail.height){
			that.textareaBottom = e.detail.height;
		}
	},
	input_blur(e){
		let that = this;
		that.textareaBottom = 0;
	},
	codeChange(text){
		this.phone_button_tip = text;
	},
	input_phone_change(value){
		let that = this;
		that.input_phone = value;
	},
	captchaHanlder(res){
		let that = this;
		if(res.status == 'ok'){
			if(res.next == 'userPhoneBind'){
				that.userPhoneBind('GET');
			}
		}
	},
	userPhoneBind(method){
		let that = this;
		if(method == 'GET' && !that.$refs.uCode.canGetCode){
			uni.showToast({
				title: '倒计时结束后再发送',
				icon: 'none'
			});
			return false;
		}
		if(that.idd == 86 && !uni.wen.util.validatePhoneNumber(that.input_phone)){
			uni.showToast({
				title: '不合法的手机号',
				icon: 'none'
			});
			return false;
		}
		uni.loading(true);
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/phone/bind',
		{ phone: that.input_phone, idd: that.idd, code: that.input_code }, method).then(function (res) {
			uni.loading(false);
		  if (res.status) {
			  if(method == 'GET'){
				that.$refs.uCode.start();
			  }else if(method == 'POST'){
				  uni.showToast({
				  	title: '绑定成功！',
				  	icon: 'none'
				  });
				  uni.wen.util.updateUserInfo();
				  that.showPhonePopup = false;
				  that.input_phone = '';
				  that.input_code = '';
				  that.phone_button_tip = '获取验证码';
			  }
		  }else{
			  if(res.code == 200045){
			  	that.myToast({
			  		type: 'captcha',
			  		timeout: 2000,
			  		isClick: true,
			  		mask: 3,
			  		uuid: 'captcha-xxxx',
					next: 'userPhoneBind',
			  	});
			  }else{
			  	uni.showToast({
			  		title: res.message,
			  		icon: 'none',
			  		duration: 1500
			  	});
			  }
		  }
		});
	},
	shutShowPhonePopup(){
		let that = this;
		that.showPhonePopup = !that.showPhonePopup;
	},
	phoneHandler(){
		let that = this;
		if(that.myUserInfo.phone && that.myUserInfo.phone.length > 0){
			// 更新手机号
			that.shutShowPhonePopup();
		}else{
			// 新增手机号
			that.shutShowPhonePopup();
		}
	},
    getUserInfo() {
      let that = this;
	  if(that.setUserId > 0){
		  return false;
	  }
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/info/byUserId', { user_id: that.setUserId }).then(function (res) {
        if (res.status) {
          that.setData({
            nickName: res.data.user_name,
            signature: res.data.user_introduce,
			wechatAccount: res.data.wechat_account,
            avatar: res.data.user_avatar,
            imagesubject: res.data.user_background_maps,
            gender: res.data.gender,
            tagList: res.data.user_labels,


            avatarTmp: res.data.user_avatar,
            imagesubjectTmp: res.data.user_background_maps,
            signatureTemp: res.data.user_introduce,
			wechatAccountTemp: res.data.wechat_account,
            currentSelectTagList: res.data.user_labels
          });
		  that.update_local();
        }
      });
    },
    arraysAreEqual(array1, array2) {
      let that = this;
      if (array1.length !== array2.length) {
        return false;
      }
      for (var i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
          return false;
        }
      }
      return true;
    },

    clipperImage: function (e) {
      // this.$refs.avatar.fSelect()
      this.imageClipper(e.currentTarget.dataset.type);
    },

    addimage(e, _dataset) {
      let that = this
      /* ---处理dataset begin--- */
      that.datasetHandle(e, _dataset);
      /* ---处理dataset end--- */

      const name = e.currentTarget.dataset.name
      const type = e.currentTarget.dataset.type
      that.setData({ [type]: false });

      that.uploadPicturesPic(e.url, e.currentTarget.dataset.name, e.currentTarget.dataset.type, 15).then(() => {

        if (type == 'avatarClipper') {
          that.updateInfo({ avatar: that.avatarTmp }).then(() => {
            that.setData({ avatar: that.avatarTmp })
          })
        } else {
          that.updateInfo({ imagesubject: that.imagesubjectTmp }).then(() => {
            that.setData({ imagesubject: that.imagesubjectTmp })
          })
        }
      })


    },

    // 修改简介
    signatureChange: function () {
      let that = this;
	  if(that.signatureTemp.length <= 3){
			uni.showToast({
				title: '简介须大于3字符',
				icon: 'none'
			})
			return false;
	  }
      that.updateInfo({ signature: that.signatureTemp }).then(() => {
        that.setData({ signature: that.signatureTemp })
      }).finally(() => {
        this.showSignatureDialog = false
      })
    },
	
	// 修改简介
	wechatAccountChange: function () {
	  let that = this;
	  if(that.wechatAccountTemp.length <= 3){
		  uni.showToast({
			title: '微信号须大于3字符',
			icon: 'none'
		  })
		  return false;
	  }
	  that.updateInfo({ wechatAccount: that.wechatAccountTemp }).then(() => {
	    that.setData({ wechatAccount: that.wechatAccountTemp })
	  }).finally(() => {
	    this.showwechatAccountDialog = false
	  })
	},

    // 关闭修改简介弹窗事件
    cloneSignatureDialog() {
      let that = this
      that.setData({
        signatureTemp: that.signature,
        showSignatureDialog: false
      })
    },
	
	closewechatAccountDialog(){
		let that = this;
		that.setData({
		  showwechatAccountDialog: false,
		  wechatAccountTemp: that.wechatAccount,
		})
	},

    // 修改昵称
    nicknameChange: function () {
      let that = this;
      const oldNickname = this.nickName
      uni.showModal({
        title: '请输入昵称',
        content: oldNickname,
        editable: true,
        success: res => {
          if (res.confirm && res.content.trim() !== '') {
            that.updateInfo({ nickName: res.content.trim() }).then(() => {
              that.setData({ nickName: res.content.trim() })
            })
          }
        }
      })
    },

    // 修改性别
    genderChange: function () {
      let that = this;
      uni.showActionSheet({
        itemList: ['男', '女'],
        success: (res) => {
          that.updateInfo({ gender: res.tapIndex + 1 }).then(() => {
            that.setData({ gender: res.tapIndex + 1 })
          })
        },
      })
    },

    // 生日修改
    bindDateChange: function (a) {
      let that = this
      that.updateInfo({ birth: a.detail.value }).then(() => {
        that.setData({ birth: a.detail.value });
      })
    },

    // 区域修改
    bindRegionsChange: function (a) {
      let that = this
      const regions = a.detail.value
      const data = { province: regions[0], city: regions[1], district: regions[2] }
      that.updateInfo(data).then(() => {
        that.setData({ regions })
      })
    },

    // 判断当前tag是否已经被选中
    isSelectTag(tag) {
      return this.currentSelectTagList.indexOf(tag) !== -1
    },

    // 选中当前tag
    tagSelectedHandle(tag) {
      let that = this;
      const index = this.currentSelectTagList.indexOf(tag)
      if (index === -1) {
        if (that.currentSelectTagList.length >= 5) {
          uni.showToast({ icon: 'none', title: `只可以选择五个哦~` })
        } else {
          that.currentSelectTagList.push(tag)
        }
      } else {
        that.currentSelectTagList.splice(index, 1)
      }
      return false;
    },

    // 选择标签管理弹窗
    saveTagHandle() {
      let that = this
      if (!that.arraysAreEqual(that.currentSelectTagList, that.tagList)) {
        const data = { tagList: [...that.currentSelectTagList] }
        that.updateInfo(data).then(() => {
          that.setData({ tagList: [...that.currentSelectTagList] })
        }).finally(() => {
          that.showTagSheet = false
        })
      } else {

      }
    },

    // 关闭选择标签页事件
    cloneSelectedTagSheet() {
      let that = this
      that.setData({
        showTagSheet: false
      })
      that.saveTagHandle();
    }
  },
};
</script>
<style lang="scss" scoped>
@import './editmine.scss';
</style>
