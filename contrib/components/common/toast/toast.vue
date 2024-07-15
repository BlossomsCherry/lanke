<!--
 *属性 isdistance 每个弹窗之间是否有间距
 *数组形式传值
 *type,类型 success warn info err loading（string）
 *content,内容（string）
 *timeout,消失时间（Number）
 *isClick,是否点击消失（Boolean）
 -->
<template>
	<view :class="'popup_list ' + global__platform__">
		<view v-for="(items,index) of popup_list" :id="items.uuid" :key="items.uuid" >
			<block v-if="defaultTypes.includes(items.type)">
				<view class="mpopup" :style="{ background: items.color ,top:index*(distance * 2)+90+'rpx'}" :class="[items.animator,items.typeClass]" @tap.stop.prevent="close(items.uuid,index)">
					<view class="pic" v-if="items.image"><image class="icon image" mode="aspectFit" :src="items.image"></image></view>
					<view class="pic" v-else><i :class="'icon ' + items.icon"></i></view>
					<text class="_text" :style="{ color: items.colortext }">{{ items.content }}</text>
				</view>
			</block>
			<block v-else>
				<view class="mask" v-if="items.mask == 1" @tap.stop.prevent="close(items.uuid,index)"  @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mask" v-else-if="items.mask == 2" @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mask opcity0" v-else-if="items.mask == 3" @tap.stop.prevent="close(items.uuid,index)"  @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mask opcity1" v-else-if="items.mask == 4" @tap.stop.prevent="close(items.uuid,index)"  @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mask opcity2" v-else-if="items.mask == 5" @tap.stop.prevent="close(items.uuid,index)"  @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mask opcity3" v-else-if="items.mask == 6" @tap.stop.prevent="close(items.uuid,index)"  @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mask opcity4" v-else-if="items.mask == 7" @tap.stop.prevent="close(items.uuid,index)"  @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mask opcity5" v-else-if="items.mask == 8" @tap.stop.prevent="close(items.uuid,index)"  @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mask opcity6" v-else-if="items.mask == 9" @tap.stop.prevent="close(items.uuid,index)"  @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mask opcity7" v-else-if="items.mask == 10" @tap.stop.prevent="close(items.uuid,index)"  @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mask blur" v-else-if="items.mask == 99" @tap.stop.prevent="close(items.uuid,index)"  @touchmove.stop.prevent="miniMoveHandle"></view>
				<view class="mpopup" :class="[items.animator,items.typeClass]" @touchmove.stop.prevent="miniMoveHandle">
					<block v-if="items.type == 'miniloading'">
						<view class="dy-loading">
							<view class="dy-loader"></view>
						</view>
						<view class="xhs-loading">
							<view class="xhs-loader"></view>
						</view>
					</block>
					<block v-if="items.type == 'captcha'">
						<view class="captcha-box">
							<view class="title">人机验证</view>
							<view class="tip">滑动滑块，使图片角度为正</view>
							<view :class="captchaError == 1 ? 'shake captcha-img' : 'captcha-img'">
								<block v-if="!captchaSrcLoading && captchaSrc">
									<view class="_image">
										<image :src="captchaSrc" :style="{transform:  `rotate(${captcha_img_rotate}deg)`}" class="__image"></image>
									</view>
								</block>
								<block v-else>
									<view class="_image flex-column" style="justify-content: center;">
										<u-loading-icon :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" size="48"></u-loading-icon>
									</view>
								</block>
								<!-- 辅助虚线 -->
								<block v-if="captchaDraging">
								  <view class="vertical-line"></view>
								  <view class="transverse-line"></view>
								</block>
							</view>
							
							<view class="captcha-foot">
								<view class="captcha-slider" id="captcha-slider">
									<view class="captcha-slider-item" :class="captchaError == 1 ?'shake':''" id="captcha-slider-item"
									
									  @touchstart="captchaDragStart" 
									  @touchmove.prevent="captchaDragMove"
									  @touchend="captchaDragEnd"
									  
									  @mousedown="captchaDragStart"
									  @mousemove.prevent="captchaDragMove"
									  @mouseup="captchaDragEnd"
									  @dragstart="captchaDragStart"
									  @dragend="captchaDragEnd"
									  @dragover.stop
									  @drop="captchaDragMove"
									  
									  :style="{
									    left: `${captchaSliderLeft}px`,
									    backgroundColor: captchaError > 0 ? (captchaError == 1 ? 'red' : 'limegreen') :(captchaDraging?'#0182ff': (global__theme__ == 'black' ? '#19191e' : '#ffffff'))
									  }"
									>
									<i :class=" captchaError > 0 ? (captchaError == 1 ? 'mini-icon mini-shanchu2' : 'mini-icon mini-icon_669') : 'mini-icon2 mini-youhua'" :style="(captchaDraging || captchaError ) ? 'color: #ffffff' : (global__theme__ == 'black' ? 'color: #ffffff' : 'color: #000000')"></i>
									</view>
								</view>
							</view>
							<view class="technology-tip"><view class="tech-name">闻歌数字</view>提供技术支持</view>
							<i class="captcha-close-icon mini-icon mini-shanchu2" @tap.stop.prevent="close(items.uuid,index)"></i>
						</view>
					</block>
					<block v-if="items.type == 'permisstip'">
						<view class="permisstip-box">
							{{ '获取权限提示：' + items.content }}
						</view>
					</block>
					<block v-if="items.type == 'popImg'">
						<block v-if="items.target_type">
							<view class="popImg-box" @tap.stop.prevent="toPopImg(items, index)">
								<image class="_pop_image" :src="items.img" mode="widthFix"></image>
							</view>
						</block>
						<block v-else>
							<view class="popImg-box">
								<image class="_pop_image" :src="items.img" mode="aspectFit"></image>
							</view>
						</block>
						
					</block>
					<block v-if="items.type == 'taskReward'">
						<view class="taskReward-box">
							<view class="top">
								<image class="taskicon" :src="items.icon"></image>
							</view>
							<view class="content">
								<view class="title">{{items.title}}</view>
								<view class="desc">{{items.content}}</view>
								<view class="btns">
									<view class="mbtn" @tap.stop.prevent="taskReward(items.uuid, items.taskID)">收下奖励</view>
								</view>
							</view>
						</view>
					</block>
					<block v-else-if="items.type == 'fixedcontent'">
						<view :class="'tap-point tap-point-' + items.subject " :style=" 'left: ' + items.x + 'px;top: ' + items.y + 'px;' ">
							<view class="dian">
								<block v-if="items.subject == 'posts'">
									<i class="mini-icon mini-xiangshang" v-if="items.grid <= 6"></i>
									<i class="mini-icon mini-xiangshang-copy" v-else-if="items.grid >= 7"></i>
								</block>
								<block v-else-if="items.subject == 'comment' || items.subject == 'img' || items.subject == 'users'">
									<i class="mini-icon mini-xiangshang"></i>
								</block>
							</view>
						</view>

						<block v-if="items.subject == 'posts'">
							<view :class="'fixedcontent-box subject-' + items.subject + ' grid-' + items.grid " :style=" 'left: 35rpx;top: ' + items.top + 'px;' " >
								<view class="posts-longtap-wrap">
									<block v-for="(item, index_a) in items.popList" :key="index_a">
										<view class="item">
											<view class="text">
												<view class="emoji">{{ item.emoji }}</view>
												<view class="_text">{{ item.text }}</view>
											</view>
											<view class="list">
												<view class="select-item" v-for="(sitem, index_b) in item.list" :key="index_b" @tap.stop.prevent="postfeedback(items, sitem)">
													{{ sitem.name }}
												</view>
											</view>
										</view>
									</block>
								</view>
							</view>
						</block>
						<block v-else-if="items.subject == 'users'">
							<view :class="'fixedcontent-box subject-' + items.subject + ' grid-' + items.grid " :style=" 'left: 35rpx;top: ' + items.top + 'px;' " >
								<view class="posts-longtap-wrap">
									<block v-for="(item, index_a) in items.popList" :key="index_a">
										<view class="item">
											<view class="text">
												<view class="emoji">{{ item.emoji }}</view>
												<view class="_text">{{ item.text }}</view>
											</view>
											<view class="list">
												<view class="select-item" v-for="(sitem, index_b) in item.list" :key="index_b" @tap.stop.prevent="userHandler(items, sitem)">
													{{ sitem.name }}
												</view>
											</view>
										</view>
									</block>
								</view>
							</view>
						</block>
						<block v-else-if="items.subject == 'comment'">
							<view :class="'fixedcontent-box subject-' + items.subject + ' grid-' + items.grid " :style=" 'left: '+ items.left +'px;top: ' + items.top + 'px;' ">
								<view class="comment-fixedcontent-wrap">
									<view class="itme" v-for="(item, index_a) in items.popList" :key="index_a" @tap.stop.prevent="commentAction(index, items, item)">
										<i :class="item.icon"></i>
										<view class="text">{{ item.text }}</view>
									</view>
								</view>
							</view>
						</block>
						<block v-else-if="items.subject == 'img'">
							<view :class="'fixedcontent-box subject-' + items.subject + ' grid-' + items.grid " :style=" 'left: '+ items.left +'px;top: ' + items.top + 'px;' ">
								<view :class="'comment-fixedcontent-wrap img-fixedcontent-wrap ' + items.para.direction">
									<view class="itme" v-for="(item, index_a) in items.popList" :key="index_a" @tap.stop.prevent="adminImgAction(index, items, item)">
										<i :class="item.icon"></i>
										<view class="text">{{ item.text }}</view>
									</view>
								</view>
							</view>
						</block>
					</block>
					<block v-else-if="items.type == 'aite'">
						<view class="aite-box">
							<view class="box-head">
								
								<view class="box-head-title">
									@好友
								</view>
								<i class="mini-icon mini-shanchu2" style="position: absolute;font-size: 30rpx;right: 0;top: 15rpx;"
									@tap.stop.prevent="close(items.uuid,index)"></i>
							</view>
							<view class="search-name">
							    <input placeholder="输入要@的用户昵称"  class="search-name-input" placeholder-class="_input_place_holder" type="text" :value="searchUserNameStr"  @input="aiteInput" />
							</view>
							<view class="loading" v-if="searchLoading">
								<view class="spinner">
									<view class="rect rect1"></view>
									<view class="rect rect2"></view>
									<view class="rect rect3"></view>
									<view class="rect rect4"></view>
									<view class="rect rect5"></view>
								</view>
							</view>

							<scroll-view :scroll-y="true" style="height: 800rpx;" @scrolltolower="getAiteUsers(false)">
								<view class="user-list">
									<block v-if="userList.length > 0">
									    <view @tap.stop.prevent="aiteUserName(items, index, item.user_name)" class="user-item" v-for="(item, user_index) in userList" :key="item.id" >
									        <image class="avatars" :lazyLoad="true" mode="aspectFill" :src="item.user_avatar"></image>
									        <view class="infos">
									            <view class="nickname">{{ item.user_name }}</view>
									        </view>
									    </view>
										<u-loadmore v-if="!searchLoading && isloadingMore" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──"  iconSize="28" fontSize="28" color="#989898" bgClass="page-box-background-color" />
									</block>
									<block v-else-if="!searchLoading">
										<u-empty text="空" width="300" height="300" text-size="28"/>
									</block>
								</view>
							</scroll-view>

						</view>
					</block>
					<block v-else-if="items.type == 'givecoin'">
						<view class="givecoin-box">
							<view class="title">
								<view class="left">
									<view class="_view">请选择投币数量</view>
									<view class="tip"@tap.stop.prevent="toSliderUrl(6, '/pages/common/clause?type=' + config_app_coins_give_clause )">
										<i class="mini-icon mini-guanyuwomen1"></i>
										投币说明
									</view>
								</view>
								<view class="right" @tap.stop.prevent="close(items.uuid,index)">
									<i class="mini-icon mini-shanchu2"></i>
								</view>
							</view>
							<view class="split-line"></view>
							<view class="my"></view>
							<view class="body">
								<scroll-view :scroll-x="true" class="_scroll-view">
									<view class="options">
										<block v-for="(item, index) in config_app_coins_give_options" :key="index">
											<view :class="'select-item ' + (giveCoinNum == item.num ? 'cur' : '') " @tap.stop.prevent="giveCoinSelect(item.num, item.exp)">
												<view class="img">
													<image class="_image" :src="item.img" mode="aspectFit"></image>
												</view>
												<view class="text">{{ item.num + config_app_coins_name }}</view>
											</view>
										</block>
									</view>
								</scroll-view>

								<view class="options-tip">
									共消耗<view class="num">{{ giveCoinNum + config_app_coins_name }}</view>，投币后您将获得<view class="num">{{ experience }}</view>点经验
								</view>
							</view>
							<view class="split-line"></view>
							<view class="footer">

							</view>
							<view class="btn" @tap.stop.prevent="giveCoin(items, index)">为Ta投币</view>
						</view>
					</block>
					<block v-else-if="items.type == 'getPhone'">
						<view class="getphone-box">
							<view class="phone-img">
								<image class="_image" :src="config_img_phone_popup" mode=""></image>
							</view>
							<text class="_text" :style="{ color: items.colortext }">{{ items.content }}</text>
							<text class="desc">根据相关政策要求，请先绑定手机号码</text>
							<!-- #ifdef MP -->
							<button type="default" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber($event,items.uuid,index)" @tap="close(items.uuid,index)">获取手机号</button>
							<!-- #endif -->
						</view>
					</block>
					<block v-else-if="items.type == 'payword'">
						<view class="pass-box">
							<view class="pass-box-head">
								<i class="mini-icon mini-shanchu2" style="position: absolute;font-size: 40rpx;left: 0;"
									@tap.stop.prevent="close(items.uuid,index)"></i>
								<view class="pass-box-head__title">
									请输入支付密码
								</view>
							</view>
							<view class="pass-box-center">
								<view class="pass-box-center__text">
									{{items.content}}
								</view>
								<block v-if="items.isVipPrice && items.isVipPrice > 0">
									<view class="pass-box-center__money vip_price">
										<view class="vip_price_tip">会员价</view>
										￥<text class="_text">{{ items.price }}  </text>
									</view>
								</block>
								<block v-else>
									<view class="pass-box-center__money">
										￥<text class="_text">{{ items.price }}</text>
									</view>
								</block>

							</view>
							<view class="split-line"></view>
							<view class="pay-way">
								<view class="left">付款方式</view>
								<view class="right" v-if="items.userCoin == 0">
									<i class="mini-icon mini-yue balance-color"></i>
									余额
								</view>
								<view class="right" v-if="items.userCoin > 0">
									<i class="mini-icon mini-Gold_coin_01" style="color: #dd6572;"></i>
									{{ config_app_coins_name }}
									<view style="margin: 0 10rpx;display: inline-block;">+</view>
									<i class="mini-icon mini-yue balance-color"></i>
									余额（组合支付）
								</view>
							</view>
							<view class="pass-box-footer" :style="'--digit:6'">
								<view v-for="(item,pindex) in 6" :key="pindex" class="pass-box-footer__passnum">
									<i class="mini-icon mini-dian" v-if="password[pindex]"></i>
								</view>
							</view>
							<view class="split-line"></view>
							<view class="keyboard">
								<view v-for="(item,nindex) in 9" :key="nindex" hover-class="key-hover" :hover-stay-time="100"
									class="keyboard-key" @tap.stop.prevent="keyTap(nindex+1, items, index)">
									{{nindex+1}}
								</view>
								<view class=""></view>
								<view class="keyboard-key" hover-class="key-hover" :hover-stay-time="100" @tap.stop.prevent="keyTap(0, items, index)">
									0
								</view>
								<view class="keyboard-key__del" hover-class="key-hover" :hover-stay-time="100" @tap.stop.prevent="keyTap('del', items, index)">
									<i class="mini-icon mini-shanchu_delete-two"></i>
								</view>
							</view>
						</view>
					</block>
					<block v-else-if="items.type == 'payway'">
						<view class="payway-box">
							<view class="head">
								<i class="mini-icon mini-shanchu2" style="position: absolute;font-size: 40rpx;left: 0;"
									@tap.stop.prevent="close(items.uuid,index)"></i>
								<view class="head__title">
									{{ useCoin ? '组合支付' : '选择支付方式'}}
								</view>
							</view>
							<view style="height: 40rpx;"></view>

								<!-- #ifndef MP-WEIXIN -->
								<view :class="'type-item payway-' + item.toString() + ' seleted-payway-' + payway " @tap.stop.prevent="paywaytap(item, 0)" v-for="(item, index) in paywaylist" :key="index" v-if="((item != 1 && item != 2 && item != 3 ) || (item == 1 && (config_pay &&  config_pay.wechat != 'close')) || (item == 2 && (config_pay &&  config_pay.alipay != 'close')) || (item == 3 && (config_pay &&  config_pay.apple != 'close')) )">
									<i class="mini-icon mini-yue balance-color" v-if="item == 0"></i>
									<i class="mini-icon mini-weixin" style="color: #28c445;transform: scale(0.9);" v-else-if="item == 1"></i>
									<i class="mini-icon mini-zhifubao" style="color: #02a9f1;" v-else-if="item == 2"></i>
									<i class="mini-icon mini-pingguo" style="color: #000000;" v-else-if="item == 4"></i>
									<i class="mini-icon mini-Gold_coin_01" style="color: #dd6572;" v-else-if="item == 3 && canUseCoinMaxNum >= 1"></i>
									<view class="con" v-if="item == 0">
										<text class="tit">余额支付</text>
										<text class="_text">推荐使用余额支付</text>
									</view>
									<view class="con" v-else-if="item == 1">
										<text class="tit">微信支付</text>
									</view>
									<view class="con" v-else-if="item == 2">
										<text class="tit">支付宝支付</text>
									</view>
									<view class="con" v-else-if="item == 4">
										<text class="tit">Apple内购</text>
									</view>
									<view class="con" v-else-if="item == 3 && canUseCoinMaxNum >= 1">
										<text class="tit">{{ config_app_coins_name }}抵扣</text>
										<text class="_text" v-if="coin_offset_num > 0">{{ '可抵消￥'+coin_offset_num }}</text>
									</view>
									<block v-if="canUseCoinMaxNum >= 1 && (item == 3 && useCoin)">
										<view class="coins_num_input_wrap">
											使用
											<input class="coins_num_input" maxlength="10" @input="input_coins_num" @blur="input_coins_num" v-model="userCoinNum" type="number" placeholder="数量" placeholder-style="font-size: 26rpx; color: #ccc;" />
											{{ config_app_coins_name }}
										</view>
									</block>

									<block v-if="item == 3">
										<label class="radio" v-if="canUseCoinMaxNum >= 1">
											<radio value="" color="#fa436a" :checked="useCoin"  @tap.stop.prevent="paywaytap(item, 1)" />
											</radio>
										</label>
									</block>
									<block v-else>
										<label class="radio">
											<radio value="" color="#fa436a" :checked='payway == item'/>
											</radio>
										</label>
									</block>

								</view>
								<!-- #endif -->
								<!-- #ifdef MP-WEIXIN -->
								<view :class="'type-item payway-' + item.toString() + ' seleted-payway-' + payway " @tap.stop.prevent="paywaytap(item, 0)" v-for="(item, index) in paywaylist" :key="index">
									<i class="mini-icon mini-yue balance-color" v-if="item == 0"></i>
									<i class="mini-icon mini-weixin" style="color: #28c445;transform: scale(0.9);" v-else-if="item == 1"></i>
									<i class="mini-icon mini-zhifubao" style="color: #02a9f1;" v-else-if="item == 2"></i>
									<i class="mini-icon mini-Gold_coin_01" style="color: #dd6572;" v-else-if="item == 3 && canUseCoinMaxNum >= 1"></i>
									<view class="con" v-if="item == 0">
										<text class="tit">余额支付</text>
										<text class="_text">推荐使用余额支付</text>
									</view>
									<view class="con" v-else-if="item == 1">
										<text class="tit">微信支付</text>
									</view>
									<view class="con" v-else-if="item == 2">
										<text class="tit">支付宝支付</text>
									</view>
									<view class="con" v-else-if="item == 3 && canUseCoinMaxNum >= 1">
										<text class="tit">{{ config_app_coins_name }}抵扣</text>
										<text class="_text" v-if="coin_offset_num > 0">{{ '可抵消￥'+coin_offset_num }}</text>
									</view>
									<block v-if="canUseCoinMaxNum >= 1 && (item == 3 && useCoin)">
										<view class="coins_num_input_wrap">
											使用
											<input class="coins_num_input" maxlength="10" @input="input_coins_num" @blur="input_coins_num" v-model="userCoinNum" type="number" placeholder="数量" placeholder-style="font-size: 26rpx; color: #ccc;" />
											{{ config_app_coins_name }}
										</view>
									</block>

									<block v-if="item == 3">
										<label class="radio" v-if="canUseCoinMaxNum >= 1">
											<radio value="" color="#fa436a" :checked="useCoin"  @tap.stop.prevent="paywaytap(item, 1)" />
											</radio>
										</label>
									</block>
									<block v-else>
										<label class="radio">
											<radio value="" color="#fa436a" :checked='payway == item'/></radio>
										</label>
									</block>

								</view>
								<!-- #endif -->

							<text class="mix-btn" @tap.stop.prevent="selectPayWay(items,index)">确认支付</text>
						</view>
					</block>
				</view>
			</block>
		</view>
	</view>
</template>

<script>


	const pay = require('@/mixins/pay');
	// 防抖
	let debounce = null;
	var options = {};
	pay(options);
	export default{
		mixins: [
			{
				methods: options
			}
		],
		components: {

		},
		computed:{
			config_img_phone_popup:{
				get(){
					let that = this;
					return that.$store.state.config.img.phone_popup;
				},
				set(v){}
			},
			coin_offset_num:{
				get(){
					let that = this;
					if(that.$store.state.config.app.coins.rate > 0 && that.$store.state.userInfo.coins > 0){
						if(that.userCoinNum > that.canUseCoinMaxNum){
							return (that.canUseCoinMaxNum / that.$store.state.config.app.coins.rate).toFixed(2);
						}
						return (that.userCoinNum / that.$store.state.config.app.coins.rate).toFixed(2);
					}
					return 0;
				},
				set(v){}
			},
			config_pay:{
				get(){
					let that = this;
					return that.$store.state.config.pay;
				},
				set(v){}
			},
			config_app_coins_name:{
				get(){
					let that = this;
					if(that.$store.state.config.app.coins){
						return that.$store.state.config.app.coins.name;
					}
					return '硬币';
				},
				set(v){}
			},
			config_app_coins_give_options:{
				get(){
					let that = this;
					if(that.$store.state.config.app.coins){
						return that.$store.state.config.app.coins.give_options;
					}
					return [];
				},
				set(v){}
			},
			config_app_coins_give_clause:{
				get(){
					let that = this;
					if(that.$store.state.config.app.coins){
						return that.$store.state.config.app.coins.give_clause;
					}
					return [];
				},
				set(v){}
			},
			captcha_img_rotate: {
				get(){
					let that = this;
					if(that.captchaSliderLeft==0)return 0;
					return Math.ceil((360 / that.captchaSliderLeftMax) * that.captchaSliderLeft * 100) / 100;
				},
				set(v){}
			},
		},
		data(){
			return{
				popup_list:[],//弹窗数组
				distance:65,//每个弹窗之间间距
				timeout: 3,
				defaultTypes: ['success', 'warn', 'info', 'err', 'loading'],
				mpLoginCode: '',
				password: [],
				paywaylist: [],
				payway: 0, // 0 :余额支付  1：微信支付  2：支付宝支付
				order: {},
				useCoin: false,
				userCoinNum: 0,
				canUseCoinMaxNum: 0,
				searchUserNameStr: '',
				searchLoading: false,
				userList: [],
				page: 1,
				isLastPage: false,
				isloadingMore: false,
				giveCoinNum: 0,
				experience: 0,
				
				// 人机验证
				captchaNext: '',
				captchaSrcLoading: true,
				captchaSliderLeft: 0,
				captchaSliderLeftMax: 240,
				captchaSliderItemInitX: 0, //滑动按钮初始X坐标
				captchaSrc: '',
				captchaDraging: false,
				captchaError: 0,
				captchaDragStartTime: 0, //拖动开始时间
				captchaDragUseTime: 0, //拖动用时
				captchaMouseTrackList: [], //鼠标轨迹列表
				captchaRandom: '',
			}
		},
		props: {
			toast: {
				type: Object,
				require: true
			},
			//是否有间距
			isdistance:{
				type:Boolean,
				default:false
			}
		},
		watch:{
			toast: {
				handler: function(newVal, oldVal) {
					let that = this;
					if(newVal.close == 1 || newVal.closeAll == 1){
						that.open(newVal)
					}else{
						if(oldVal){
							if(newVal.random === oldVal.random){
								return false;
							}
						}
						that.open(newVal)
					}
				},
				deep: true,
				immediate: true
			}
		},

		methods:{
			/**
			 * 拖动开始事件
			 */
			captchaDragStart(e){
			  let that = this;
			  if(that.captchaDraging)return false;
			  if(that.captchaSrcLoading)return false;
			  
			  that.captchaMouseTrackList = []; //初始化轨迹列表
			  that.captchaDragStartTime = new Date().getTime(); //记录开始时间
			  that.captchaSliderItemInitX = (e.clientX?e.clientX:e.changedTouches[0].clientX);
			  that.captchaDraging = true;
			  that.captchaAddMouseTrack(e);
			},
			/**
			 * 手指移动事件
			 */
			captchaDragMove(e){
			  let that = this;
			  if(that.captchaSrcLoading)return false;
			  if(!that.captchaDraging)return false;
			  
			  let maringLeft = (e.clientX?e.clientX:e.changedTouches[0].clientX) - that.captchaSliderItemInitX;
			  if(maringLeft<0)maringLeft = 0;
			  if(maringLeft > that.captchaSliderLeftMax){
				maringLeft = that.captchaSliderLeftMax
			  }
			  that.captchaSliderLeft = maringLeft;
			  
			  that.captchaAddMouseTrack(e);
			},
			/**
			 * 拖动结束事件
			 */
			captchaDragEnd(e){
			  let that = this;
			  if(that.captchaSrcLoading)return false;
			  that.captchaAddMouseTrack(e);
			  that.captchaDraging = false;
			  that.dragLoading = true; //开启loading准备ajax
			  that.captchaDragUseTime = new Date().getTime() - that.captchaDragStartTime; //计算拖动时间
			  that.captchaProcess('check');
			},
			captchaAddMouseTrack(){
			  let that = this;
			  let lastTime = that.captchaMouseTrackList=='' ? that.captchaDragStartTime : that.captchaMouseTrackList[that.captchaMouseTrackList.length-1].t;
			  let now = new Date().getTime();
			  if(lastTime + 200 <= now){
			    that.captchaMouseTrackList.push({
			      r: Math.ceil(that.captcha_img_rotate / 360 * 10000) / 100, //当前角度
			      t: now, //当前时间戳
			    })
			  }
			},
			captchaInit(){
				let that = this;
				that.setData({
					captchaSrcLoading: true,
					captchaSliderLeft: 0,
					captchaSliderLeftMax: 240,
					captchaSliderItemInitX: 0, //滑动按钮初始X坐标
					captchaSrc: '',
					captchaDraging: false,
					captchaError: 0,
					captchaDragStartTime: 0, //拖动开始时间
					captchaDragUseTime: 0, //拖动用时
					captchaMouseTrackList: [], //鼠标轨迹列表
					captchaRandom: ''
				});
				that.captchaProcess('src');
			},
			toPopImg(items, index){
				let that = this;
				that.close(items.uuid,index);
				setTimeout(function(){
					that.toSliderUrl(items.target_type, items.target_id);
				}, 300);
			},
			taskReward(uuid, task_id){
				let that = this;
				that.close(uuid, null);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/task/complete', {
				  task_id: task_id
				}, 'POST').then(function (res) {
				  uni.showToast({
				    title: res.message,
				    icon: 'none'
				  });
				});
			},
			userHandler(items, item){
				let that = this;
				that.close(items.uuid, null);
				item = JSON.parse(JSON.stringify(item));
				// console.log(items);
				// console.log(item);
				if(item.action == 'report'){
					uni.wen.toUrl(6, '/pages/common/report?type=2&object_id=' + item.user_id, null);
				}else if(['mute', 'unmute', 'ban', 'unban'].includes(item.action)){
					uni.loading(true);
					uni.wen.util.request(uni.wen.api.ApiRootUrl + 'aggregate/user/hanlder', {
						action: item.action,
						user_id: item.user_id,
						days: item.days
					}, 'POST').then(function(res) {
						uni.loading(false);
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
						if(res.status){
							uni.startPullDownRefresh();
						}
					});
				}else if(item.action == 'icon'){
					uni.wen.toUrl(item.target_type, item.target_id, null);
				}
			},
			postfeedback(items, item){
				let that = this;
				that.close(items.uuid, null);
				// 处理vue的ob属性
				item = JSON.parse(JSON.stringify(item));
				item.postsIndex = items.para.index;
				that.$emit('postfeedback', item);
			},
			adminImgAction(index, items, item){
				let that = this;
				if(item.type == 'delete'){
					that.close(items.uuid, index);
					uni.wen.util.request(uni.wen.api.ApiRootUrl + 'admin/attachment/delete', {
						id: item.id
					}, 'POST').then(function(res) {
						if (res.status) {
							uni.showToast({
								title: '删除成功',
								icon: 'none',
								duration: 1500
							});
						}else{
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 1500
							});
						}
					});
				}else if(item.type == 'copy'){
					that.close(items.uuid, index);
					uni.wen.util.setClipboardData(item.raw, '附件id已复制');
				}
			},
			commentAction(index, items, item){
				let that = this;
				if(item.type == 'report'){
					console.log(items);
					that.close(items.uuid, index);
					uni.wen.toUrl(6, '/pages/common/report?type=1&object_id=' + item.id, null);
				}else if(item.type == 'sticky' || item.type == 'unsticky'){
					let child = this.$unicom("#commentScroll_" + that.$store.state.scene + '_' + that.$store.state.scene_id);
					if(child){
						that.close(items.uuid, index);
						if(items.para.type == 'parent-comment'){
							child.tapStickyComment(items.para.index, item.id)
						}
					}else{
						uni.showToast({
							title: '程序出错，请联系客服',
							icon: 'none'
						})
					}
				}else if(item.type == 'delete'){
					let child = this.$unicom("#commentScroll_" + that.$store.state.scene + '_' + that.$store.state.scene_id);
					if(child){
						that.close(items.uuid, index);
						if(items.para.type == 'parent-comment'){
							child.tapDeleteComment(items.para.index, item.id)
						}else if(items.para.type == 'sub-comment'){
							child.tapDeleteComments(items.para.pindex, items.para.index, item.id)
						}
					}else{
						uni.showToast({
							title: '程序出错，请联系客服',
							icon: 'none'
						})
					}
				}else if(item.type == 'copy'){
					that.close(items.uuid, index);
					uni.wen.util.setClipboardData(item.raw, '评论已复制');
				}
			},
			giveCoin(item, index){
				let that = this;
				uni.wen.util.doVibrateShort();
				if(that.giveCoinNum > 0){
					that.close(item.uuid, index);
					that.$emit('giveCoin', {content: '', img: '', giveCoin: that.giveCoinNum});
				}
			},
			giveCoinSelect(num, exp){
				let that = this;
				that.setData({
					giveCoinNum: num,
					experience: exp
				});
			},
			aiteUserName(item, index, user_name){
				let that = this;
				if(user_name){
					that.close(item.uuid, index);
					let child = this.$unicom('#' + item.emit + '_' + that.$store.state.scene + '_' + that.$store.state.scene_id);
					if(child){
						if(item.isPrefix){
							child.acceptAiteUser(item.cursor, '@' + user_name);
						}else{
							child.acceptAiteUser(item.cursor, user_name);
						}
					}
					if(item.isPrefix){
						that.$emit('acceptAiteUser', {cursor:item.cursor, name: '@' + user_name });
					}else{
						that.$emit('acceptAiteUser', {cursor:item.cursor, name: user_name });
					}
				}
			},
			aiteInput(e){
				let that = this;
				that.setData({
				    searchUserNameStr: e.detail.value
				});

				if( debounce !== null ) {
				    clearTimeout(debounce);
				}
				debounce = setTimeout(() => {
				    that.getAiteUsers(true);
				},150);
			},
			getAiteUsers(isfresh){
				let that = this;
				if(isfresh){
					that.setData({
						page: 1,
						isLastPage: false,
						isloadingMore: true
					})
				}else{
					if(that.isLastPage || that.userList.length <= 0){
						return false;
					}
					that.setData({
						page: that.page + 1,
						isloadingMore: true
					})
				}
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/aite/search', {
					keyword: that.searchUserNameStr,
					page: that.page
				}).then(function(res) {
					if(res.status){
						let data = res.data;
						let args = {};
						
						if(res.data.current_page != that.page){
							return false;
						}

						if (data.data.length > 0) {
							args.isLastPage = false;
							if(isfresh){
								args.userList = data.data;
							}else{
								args.userList = that.userList.concat(data.data);
							}
							args.page = data.current_page;
							args.isloadingMore = false;
						}else{
							args.isLastPage = true;
							if(isfresh){
								args.userList = [];
							}
						}
						args.searchLoading = false;
						that.setData(args);
					}else{
						that.searchLoading = false;
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				});
			},
			selectPayWay(item, index){
				let that = this;
				uni.wen.util.doVibrateShort();
				that.close(item.uuid, index);
				let order_ = item.order;
				order_.coins_num = 0;
				if(that.useCoin){
					order_.coins_num = that.userCoinNum;
				}
				//开通会员=1，充电=2 3: x  4:购买付费  5:商品订单付费
				if(that.payway == 0){
					let need_pay = item.price;
					if(that.useCoin){
						need_pay = (item.price - (that.userCoinNum / that.$store.state.config.app.coins.rate)).toFixed(2);
						if(need_pay <= 0){
							need_pay = 0;
						}
					}
					setTimeout(function(){
						that.open(
						{
							type:'payword',
							content: item.content,
							price: need_pay,
							isVipPrice: item.isVipPrice,
							userCoin: that.useCoin ? that.userCoinNum : 0,
							timeout: 2000,
							isClick:true,
							order: order_
						});
					}, 500);
				}else if(that.payway == 1){
					if(order_.type == 1){
						// #ifdef MP
						that.openMembershipAccount({
							"type": 1,
							"parame": order_
						}, (res) => {
							if(res.status == 1){

							}
						});
						// #endif
						// #ifndef MP
						that.openMembershipAccount({
							"provider": "wxpay",
							"pay_type": that.$store.state.config.pay.wechat || "app",
							"type": 1,
							"parame": order_
						}, (res) => {
							if(res.status == 1){

							}
						})
						// #endif
					}
					else if(order_.type == 2){
						// #ifdef MP
						that.openExceptionalAccountWeixin(order_);
						// #endif
						// #ifndef MP
						that.openExceptionalAccountApp({
							"provider": "wxpay",
							"pay_type": that.$store.state.config.pay.wechat || "app",
							"type": 2,
							"parame": order_
						}, (res) => {
							if(res.status == 1){

							}
						})
						// #endif
					}else if(order_.type == 3){
						// #ifdef MP
						that.onRechargeEarningsInWeixin(order_.recharge)
						// #endif
						// #ifndef MP
						that.onRechargeEarningsInApp({
							"provider": "wxpay",
							"pay_type": that.$store.state.config.pay.wechat || "app",
							"type": 3,
							"parame": order_
						}, (res) => {
							if(res.status == 1){
								if(uni.$store.state.scene == 26){
									uni.startPullDownRefresh({});
								}
								
								if(uni.$store.state.pre_scene == 3){
									setTimeout(function(){
										uni.wen.toUrl(-2, 0, null);
									}, 200);
								}
								
							}
						})
						// #endif
					}
					else if(order_.type == 5){
						// #ifdef MP
						that.shopPliceOrder(order_);
						// #endif
						// #ifndef MP
						order_.provider = "wxpay",
						order_.pay_type = that.$store.state.config.pay.wechat || "app";
						that.appShopPliceOrder(order_,"wxpay", (res) => {
							if(res.status == 1){
								that.$store.commit('forceUpdatePage', true);
								uni.redirectTo({
									url: '/pagesA/shop/order/order'
								})
							}
						})
						// #endif
					}else if(order_.type == 6 || order_.type == 7){
						// 付费圈子
						// #ifdef MP
						that.normalOrder({
							"type": order_.type,
							"parame": order_
						}, (res) => {
							if(res.status == 1){
								if(order_.type == 6){
									uni.showToast({
										title: '推广成功',
										icon:'none',
									});
									if(uni.$store.state.scene == 84){
										setTimeout(function(){
											uni.startPullDownRefresh();
										}, 100)
									}
								}else if(order_.type == 7){
									uni.showToast({
										title: '解锁成功',
										icon:'none',
									});
									
									let currentPage = uni.$store.state.$vm;
									if(!currentPage || uni.$store.state.$vm.page__scene__ != uni.$store.state.scene){
										let pages = getCurrentPages();
										//这句话 获取的才是当前页面实例
										let currentPage = pages[pages.length - 1];
										// #ifdef MP
										currentPage = currentPage.$vm;
										// #endif
										if(currentPage){
											uni.$store.commit('vm', currentPage);
										}
									}
									currentPage.setData({
										visitUnlockPopup: false
									});
									
									setTimeout(function(){
										uni.startPullDownRefresh();
									}, 200)
								}
							}
						});
						// #endif
						// #ifndef MP
						that.normalOrder({
							"provider": "wxpay",
							"pay_type": that.$store.state.config.pay.wechat || "app",
							"type": 7,
							"parame": order_
						}, (res) => {
							if(res.status == 1){
								uni.showToast({
									title: '解锁成功',
									icon:'none',
								});
								
								let currentPage = uni.$store.state.$vm;
								if(!currentPage || uni.$store.state.$vm.page__scene__ != uni.$store.state.scene){
									let pages = getCurrentPages();
									//这句话 获取的才是当前页面实例
									let currentPage = pages[pages.length - 1];
									// #ifdef MP
									currentPage = currentPage.$vm;
									// #endif
									if(currentPage){
										uni.$store.commit('vm', currentPage);
									}
								}
								currentPage.setData({
									visitUnlockPopup: false
								});
								
								setTimeout(function(){
									uni.startPullDownRefresh();
								}, 200)
							}
						})
						// #endif
					}
					else if(order_.type == 8){
						// #ifdef MP
						that.onRechargeGuarantee(order_.rechargeNum);
						// #endif
						// #ifndef MP
						that.onRechargeGuarantee(order_.rechargeNum, 'wxpay', (that.$store.state.config.pay.wechat || "app"));
						// #endif
					}
				}else if(that.payway == 2){
					if(order_.type == 1){
						// #ifndef MP
						that.openMembershipAccount({
							"provider": "alipay",
							"pay_type": that.$store.state.config.pay.alipay || "app",
							"type": 1, //开通会员=1，充电=2
							"parame": order_
						}, (res) => {
							if(res.status == 1){

							}
						})
						// #endif
					}else if(order_.type == 2){
						// #ifndef MP
						that.openExceptionalAccountApp({
							"provider": "alipay",
							"pay_type": that.$store.state.config.pay.alipay || "app",
							"type": 2, //开通会员=1，充电=2
							"parame": order_
						}, (res) => {
							if(res.status == 1){

							}
						})
						// #endif
					}else if(order_.type == 3){
						// #ifndef MP
						that.onRechargeEarningsInApp({
							"provider": "alipay",
							"pay_type": that.$store.state.config.pay.alipay || "app",
							"type": 3,
							"parame": order_
						}, (res) => {
							if(res.status == 1){
								if(uni.$store.state.scene == 26){
									uni.startPullDownRefresh({});
								}
								if(uni.$store.state.pre_scene == 3){
									setTimeout(function(){
										uni.wen.toUrl(-2, 0, null);
									}, 200);
								}
							}
						})
						// #endif
					}else if(order_.type == 5){
						// #ifndef MP
						order_.provider = "alipay",
						order_.pay_type = that.$store.state.config.pay.alipay || "app";
						that.appShopPliceOrder(order_,"alipay", (res) => {
							if(res.status == 1){
								that.$store.commit('forceUpdatePage', true);
								uni.redirectTo({
									url: '/pagesA/shop/order/order'
								})
							}
						})
						// #endif
						
					}else if(order_.type == 6 || order_.type == 7){
						// #ifndef MP
						that.normalOrder({
							"provider": "alipay",
							"pay_type": that.$store.state.config.pay.alipay || "app",
							"type": 7, //开通会员=1，充电=2
							"parame": order_
						}, (res) => {
							if(res.status == 1){
								if(order_.type == 6){
									uni.showToast({
										title: '推广成功',
										icon:'none',
									});
									if(uni.$store.state.scene == 84){
										setTimeout(function(){
											uni.startPullDownRefresh();
										}, 100)
									}
								}else if(order_.type == 7){
									uni.showToast({
										title: '解锁成功',
										icon:'none',
									});
									
									let currentPage = uni.$store.state.$vm;
									if(!currentPage || uni.$store.state.$vm.page__scene__ != uni.$store.state.scene){
										let pages = getCurrentPages();
										//这句话 获取的才是当前页面实例
										let currentPage = pages[pages.length - 1];
										// #ifdef MP
										currentPage = currentPage.$vm;
										// #endif
										if(currentPage){
											uni.$store.commit('vm', currentPage);
										}
									}
									currentPage.setData({
										visitUnlockPopup: false
									});
									
									setTimeout(function(){
										uni.startPullDownRefresh();
									}, 200)
								}
							}
						})
						// #endif
					}else if(order_.type == 8){
						// #ifndef MP
						that.onRechargeGuarantee(order_.rechargeNum, 'alipay', (that.$store.state.config.pay.wechat || "app"));
						// #endif
					}

				}else if(that.payway == 3){
					// 金币支付
					if(order_.type == 4){

					}
				}else if(that.payway == 4){
					// #ifdef APP
					if(order_.type == 1){
						that.apple_payment( 'apple_pay_product_vip_' + order_.price, order_.product_ids);
					}else if(order_.type == 2){

					}else if(order_.type == 3){
						that.apple_payment( 'apple_pay_product_recharge_' + order_.recharge, order_.product_ids);
					}else if(order_.type == 5){

					}
					// #endif
				}
			},
			paywaytap(type, p){
				let that = this;
				uni.wen.util.doVibrateShort();
				if(type == 3){
					if(p == 0){
						if(that.useCoin == false){
							that.useCoin = !that.useCoin;
						}
					}else{
						that.useCoin = !that.useCoin;
					}
				}else{
					that.payway = type;
				}
			},
			keyTap(val, items, index){
				let that = this;
				uni.wen.util.doVibrateShort();
				let value = val.toString()
				if (value !== 'del') {
					if (that.password.length < 6) {
						that.password.push(value)
						if(that.password.length == 6){
							that.close(items.uuid, index);
							that.blancePay(that.order);
						}
					}
				} else {
					that.password.pop()
				}
			},
			blancePay(order){
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'balance_pay', {order: order, paycode: that.password}, 'POST').then(function(res) {
					uni.loading(false);
					if(res.status){
						uni.wen.util.updateUserInfo();
						if(order.type == 1){
							uni.showToast({
								title: res.data.tip,
								icon:'none',
							});
						}else if(order.type == 2){
							uni.showToast({
								title: res.data.tip,
								icon:'none',
							});
						}else if(order.type == 3){

						}else if(order.type == 4){
							// 购买付费
							uni.showToast({
								title: '购买成功！请手动刷新页面',
								icon:'none',
							});
						}else if(order.type == 5){
							uni.showToast({
								title: '结算成功！',
								icon:'none',
							});

							setTimeout(function(){
								uni.wen.toUrl(-6, '/pagesA/shop/order/order', null);
							}, 400);
						}else if(order.type == 6){
							// 笔记付费推广
							uni.showToast({
								title: res.data.tip,
								icon:'none',
							});
							if(uni.$store.state.scene == 84){
								setTimeout(function(){
									uni.startPullDownRefresh();
								}, 100)
							}
						}else if(order.type == 7){
							uni.showToast({
								title: res.data.tip,
								icon:'none',
							});
							
							let currentPage = uni.$store.state.$vm;
							if(!currentPage || uni.$store.state.$vm.page__scene__ != uni.$store.state.scene){
								let pages = getCurrentPages();
								//这句话 获取的才是当前页面实例
								let currentPage = pages[pages.length - 1];
								// #ifdef MP
								currentPage = currentPage.$vm;
								// #endif
								if(currentPage){
									uni.$store.commit('vm', currentPage);
								}
							}
							currentPage.setData({
								visitUnlockPopup: false
							});
							
							setTimeout(function(){
								uni.startPullDownRefresh();
							}, 200)
						}

					}else{
						that.password = [];
						uni.showToast({
							title: res.message,
							icon:'none',
						});
						if(res.code == '200012'){
							setTimeout(function(){
								uni.wen.toUrl(6, '/pagesA/mine/earnings/recharge', null);
							}, 500);

						}
					}
				});
			},
			decryptPhoneNumber(e, uuid, index){
				let that = this;
				that.close(uuid, index);
				// #ifdef MP
				if(that.mpLoginCode && e.detail.errMsg == 'getPhoneNumber:ok'){
					uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/bind/phone', {
						code: that.mpLoginCode,
						iv: e.detail.iv,
						encryptedData: e.detail.encryptedData
					}, 'POST').then(function(res) {
						uni.loading(false);
						if(res.status){

							uni.wen.util.updateUserInfo();

							uni.showToast({
								title: res.data.tip,
								icon: 'none',
								duration: 1000
							});

							if(that.$store.state.scene == 14){
								setTimeout(function(){
									uni.wen.toUrl(-2, 0, null);
								}, 1500);
							}

						}else{
							uni.showToast({
								title: res.message,
								icon:'error',
								duration: 2000
							});
						}
					});
				}else{
					uni.showToast({
						title: e.detail.errMsg,
						icon: 'none',
						duration: 2000
					})
				}
				// #endif
			},
			input_coins_num(e){
				let that = this;
				if(that.userCoinNum > that.$store.state.userInfo.coins || e.detail.value > that.$store.state.userInfo.coins || that.userCoinNum > that.canUseCoinMaxNum || e.detail.value > that.canUseCoinMaxNum){
					if( debounce !== null ) {
					    clearTimeout(debounce);
					}
					debounce = setTimeout(() => {
					    that.userCoinNum = that.$store.state.userInfo.coins;
						if(that.userCoinNum > that.canUseCoinMaxNum){
							that.userCoinNum = that.canUseCoinMaxNum;
						}
					},1000);
				}
			},
			closeSamePopup(type){
				let that = this;
				that.popup_list.forEach((list, k)=>{
					if(list.type == type){
						that.close(list.uuid, null);
					}
				})
			},
			init:function(list){
				let  that = this;
				if (list.type == 'success') {
					list.icon = 'mini-icon mini-duigouxiao';
					list.typeClass='mpopup-success';
					list.animator='fade_Down';
					list.danimator = 'fade_Top';
				}else if (list.type == 'warn') {
					list.icon = 'mini-icon mini-jinggao';
					list.typeClass='mpopup-warn';
					list.animator='fade_Down';
					list.danimator = 'fade_Top';
				}
				else if (list.type == 'info') {
					list.icon = 'mini-icon mini-xiaoxitip';
					list.typeClass='mpopup-info';
					list.animator='fade_Down';
					list.danimator = 'fade_Top';
				}
				else if (list.type == 'err') {
					list.icon = 'mini-icon mini-chacha';
					list.typeClass='mpopup-err';
					list.animator='fade_Down';
					list.danimator = 'fade_Top';
				}
				else if (list.type == 'loading') {
					list.icon = 'mini-icon mini-jiazai';
					list.typeClass='mpopup-loading';
					list.animator='fade_Down';
					list.danimator = 'fade_Top';
				}else if (list.type == 'miniloading') {
					that.closeSamePopup('miniloading')
					list.typeClass='mpopup-mini-loading';
					list.animator='';
					list.danimator = '';
				}else if (list.type == 'permisstip') {
					that.closeSamePopup('permisstip')
					list.typeClass = 'mpopup-permisstip';
					list.animator ='';
					list.danimator = '';
					list.timeout = 2000;
					list.isClick = true;
					list.mask = 9;
				}else if (list.type == 'getPhone') {
					that.closeSamePopup('getPhone')
					list.typeClass='mpopup-getPhone';
					list.mask = (that.$store.state.config.app.phone.hard == 1 ? 2 : 1);
					list.animator='fade_Down';
					list.danimator = 'fade_Top';
					that.mpLoginCode = '';
				}else if (list.type == 'popImg') {
					that.closeSamePopup('popImg')
					list.typeClass='mpopup-popImg';
					list.animator='fade_Down';
					list.danimator = 'fade_Top';
				}else if (list.type == 'captcha') {
					
					that.closeSamePopup('captcha');
					list.typeClass='mpopup-captcha';
					list.mask = 2;
					list.animator='popup-in';
					list.danimator = '';
					
					that.captchaNext = list.next;
					that.captchaInit();
					
				}else if (list.type == 'taskReward') {
					that.closeSamePopup('taskReward')
					list.typeClass='mpopup-taskReward';
					list.animator='fade_Down';
					list.danimator = 'fade_Top';
				}else if (list.type == 'payword') {
					that.closeSamePopup('payword')
					that.setData({
						order: list.order,
						password: []
					});
					uni.$store.commit('popopChange', true);
					list.typeClass='mpopup-payword';
					list.mask = 1;
					list.animator = 'botton-from';
					list.danimator = 'botton-dismiss';
				}else if (list.type == 'payway') {
					that.closeSamePopup('payway')
					that.setData({
						payway: list.paywaylist[0],
						paywaylist: list.paywaylist,
						useCoin: false,
						canUseCoinMaxNum: Math.floor(list.price * (that.$store.state.config.app.coins.percent_every / 100 ) * that.$store.state.config.app.coins.rate)
					});
					setTimeout(function(){
						that.setData({
							userCoinNum: (that.$store.state.userInfo.coins > that.canUseCoinMaxNum) ? that.canUseCoinMaxNum : that.$store.state.userInfo.coins,
						});
						// #ifdef APP
						// if( that.$store.state.platform == 'ios' ){
						// 	that.apple_restore();
						// }
						// #endif
					}, 300);

					uni.$store.commit('popopChange', true);
					list.typeClass='mpopup-payway';
					list.mask = 1;
					list.animator = 'botton-from';
					list.danimator = 'botton-dismiss';
					
				}else if (list.type == 'aite') {
					that.closeSamePopup('aite')
					that.setData({
						searchUserNameStr: '',
						userList: [],
						searchLoading: true,
					});
					uni.$store.commit('popopChange', true);

					list.typeClass='mpopup-aite';
					list.animator = 'botton-from';
					list.danimator = 'botton-dismiss';
					setTimeout(function(){
						that.getAiteUsers(true);
					}, 500);
				}else if(list.type == 'givecoin'){
					that.closeSamePopup('givecoin')
					if(that.$store.state.config.app.coins){
						that.setData({
							giveCoinNum: that.$store.state.config.app.coins.give_options[0].num,
							experience: that.$store.state.config.app.coins.give_options[0].exp,
						});
					}
					uni.$store.commit('popopChange', true);

					list.typeClass='mpopup-givecoin';
					list.animator = 'botton-from';
					list.danimator = 'botton-dismiss';
				}else if(list.type == 'fixedcontent'){
					that.closeSamePopup('fixedcontent')
					list.typeClass='mpopup-fixedcontent';
					list.animator='';
					list.danimator = '';
				}
				return list;
			},
			open:function(list){
				let that = this;

				if(!list || Object.keys(list).length == 0){
					return false;
				}

				if(list && list.closeAll == 1){
					that.closeAll();
					return false;
				}
				if(list.close == 1 && list.uuid){
					that.close(list.uuid, null)
					return false;
				}
				
				if(list.close == 1 && list.type){
					that.closeSamePopup(list.type)
					return false;
				}

				if(list.type == 'miniloading' || list.type == 'permisstip'){
					for(let i=0;i<that.popup_list.length;i++){
						if(that.popup_list[i].uuid==list.uuid){
							return false;
						}
					}
				}


				if(!that.isdistance){that.distance=0}
				//生成uuid
				if( list.uuid === undefined || list.uuid === null){
					let uuid=that.guid();
					list.uuid=uuid;
				}
				//添加动画
				//判断是否可点击消失/可控制消失
				if(typeof(list.isClick)!='boolean'){list.isClick=false;}
				//if(typeof(list.isControl)!='boolean'){list.isControl=false;}

				//初始化
				let new_list=that.init(list);
				//添加进数组
				that.popup_list.push(new_list);
				if(!new_list.isClick){
					that.disappear(new_list.uuid,new_list.timeout);
				}//可点击消失
				else{
					that.$emit('uuidCallback',new_list.uuid);
				}
				if(new_list.type == 'getPhone'){
					// #ifdef MP
					that.getMpLoginCode();
					// #endif
				}
				else if(new_list.type == 'payword'){
					if(that.$store.state.userInfo.paycode){

					}else{
						uni.wen.toUrl(6, '/pagesA/mine/paycode/paycode', null);
					}
				}else if(new_list.type == 'payway'){

					if(that.$store.state.config.app.coins.pay){
						uni.wen.util.updateUserInfo();
					}
				}
			},
			captchaProcess(action){
				let that = this;
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/captcha/process', {
					action: action,
					rotationAngle: that.captcha_img_rotate, //旋转角度
					mouseTrackList: JSON.stringify(that.captchaMouseTrackList), //滑动轨迹
					dragUseTime: that.captchaDragUseTime, //拖动用时
					dragStartTime: that.captchaDragStartTime, //拖动开始时间
					random: that.captchaRandom,
				}, 'POST').then(function(res) {
					if (res.status) {
						if(action == 'src'){
							that.captchaSrc = res.data.src;
							that.captchaRandom = res.data.random;
							that.captchaSrcLoading = false;
						}else if(action == 'check'){
							that.captchaError = 2;
							setTimeout(function(){
								that.closeSamePopup('captcha');
								that.$emit('captcha', {'status': 'ok', 'next': that.captchaNext});
							}, 800);
						}
					}else{
						if(action == 'src'){
							uni.showToast({
								title: res.message,
								icon: 'none'
							})
							return false;
						}else if(action == 'check'){
							that.captchaError = 1;
							uni.wen.util.doVibrateShort();
							setTimeout(()=>{
								that.captchaInit();
							},800)
						}
					}
				});
				
			},
			getMpLoginCode(){
				let that = this;
				uni.login({
				  provider: 'weixin',
				  success:res=>{
						that.mpLoginCode = res.code;
				  }
				});
			},
			closeAll(){
				let that = this;
				that.setData({
					popup_list: [],
					password: [],
					mpLoginCode: ''
				});
			},
			//自动消失
			disappear:function(uuid,timeout){
				let that = this;
				//退出动画之后，短暂延迟后移除本元素
				that.fade_out_animator(uuid,timeout).then(res=>{
					setTimeout(()=>{
						for(let i=0;i<that.popup_list.length;i++){
							if(that.popup_list[i].uuid==res){
								//移除本元素
								that.popup_list.splice(i,1);
								that.$forceUpdate()
							}
						}
					},250)
				});
			},
			fade_out_animator:function(uuid,timeout){
				//timeout秒后退出
				if(!timeout||typeof(timeout)!='number'){timeout=this.timeout * 1000;}
				return new Promise(res=>{
					setTimeout(()=>{
						for(let i=0;i<this.popup_list.length;i++){
							if(this.popup_list[i].uuid==uuid){
								//添加退出动画
								this.popup_list[i].animator=this.popup_list[i].danimator;
								res(uuid);
							}
						}
					},timeout)
				})
			},
			//可控制关闭的弹出框
			close:function(uuid,ind){
				this.remove_element(uuid).then((res)=>{
					setTimeout(()=>{
						for(let i=0;i<this.popup_list.length;i++){
							if(this.popup_list[i].uuid==res){

								if(this.popup_list[i].type != 'miniloading'){
									uni.$store.commit('popopChange', false);
								}

								//移除本元素
								this.popup_list.splice(i,1);
								this.$emit('closeCallback',uuid);
								this.$forceUpdate()
							}
						}
					},250)
				})
			},
			//控制移除元素
			remove_element:function(uuid){
				return new Promise(res=>{
					for (var i = 0; i < this.popup_list.length; i++) {
						if(this.popup_list[i].uuid==uuid){
							this.popup_list[i].animator=this.popup_list[i].danimator;
							this.$forceUpdate()
							res(uuid)
							break;
						}
					}
				})

			},
			//更新
			update:function(update_list){
				for (var i = 0; i < this.popup_list.length; i++) {
					if(this.popup_list[i].uuid==update_list.uuid){
						this.popup_list[i].type=update_list.type;
						this.init(this.popup_list[i]);
						this.popup_list[i].content=update_list.content;
						break;
					}
				}
			},
			//生成uuid
			guid:function() {
			    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			        return v.toString(16);
			    });
			}
		}
	}
</script>

<style lang="scss">
	
	$global-loading-dy-style: none; // 抖音loading效果，若要开启，则改成 block（默认值：none ）
	$global-loading-xhs-style: flex; // 小红书 loading效果，若要关闭，则改成 none（默认值：flex ）
	
	.popup_list .mask{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999999999;
		transition: background 0.3s ease-in-out;
		background: rgba(0, 0, 0, $uni-mask-opacity);
	}
	
	/* #ifndef APP-NVUE */
	.shake{
	  animation: shake 800ms ease-in-out;
	}
	@keyframes shake { /* 水平抖动，核心代码 */
	  10%, 90% { transform: translate3d(-1px, 0, 0); }
	  20%, 80% { transform: translate3d(+2px, 0, 0); }
	  30%, 70% { transform: translate3d(-3px, 0, 0); }
	  40%, 60% { transform: translate3d(+3px, 0, 0); }
	  50% { transform: translate3d(-3px, 0, 0); }
	}
	/* #endif */
	
	.popup_list .mask.opcity0{
		background: rgba(0, 0, 0, 0)!important;
	}
	.popup_list .mask.opcity1{
		background: rgba(0, 0, 0, 0.1)!important;
	}
	.popup_list .mask.opcity2{
		background: rgba(0, 0, 0, 0.2)!important;
	}
	.popup_list .mask.opcity3{
		background: rgba(0, 0, 0, 0.3)!important;
	}
	.popup_list .mask.opcity4{
		background: rgba(0, 0, 0, 0.4)!important;
	}
	.popup_list .mask.opcity5{
		background: rgba(0, 0, 0, 0.5)!important;
	}
	.popup_list .mask.opcity6{
		background: rgba(0, 0, 0, 0.6)!important;
	}
	.popup_list .mask.opcity7{
		background: rgba(0, 0, 0, 0.7)!important;
	}
	.popup_list .mask.blur{
		backdrop-filter: blur(16px);
	}
	.mpopup-success, .mpopup-warn, .mpopup-info, .mpopup-err, .mpopup-loading, .mpopup-getPhone,.mpopup-popImg,.mpopup-taskReward{
		display: flex;
		flex-direction: row;
		text-align: center;
		justify-content: center;
		align-items: center;
		min-height: 90rpx;
		width: 700rpx;
		transition :all .5s;
		position: fixed;
		left: 0;
		right: 0;
		margin: 0 auto;
		border-radius: 10rpx;
		z-index:9999999999;
		padding: 16rpx 0;
		box-sizing: border-box;
		.pic{
			display: flex;
			text-align: center;
			justify-content: center;
			width: 60rpx;
			height: 60rpx;
			margin: 0 20rpx;
			.mini-icon{
				font-size: 40rpx;
			}
			.image{
				width: 100%;
				height: auto;
				border-radius: 50%;
			}
		}
		._text{
			margin: auto 40rpx auto 0;
			width: 580rpx;
			font-size: $uni-font-size-lg;
			color: #444444;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
	}
	.mpopup-success{
		background: #f0f9eb;
		border: 2px solid #e1f3d8;
		color: #67c23a;
	}
	.mpopup-err{
		background: #fef0f0;
		border: 2rpx solid #fde2e2;
		color: #f56c6c;
	}
	.mpopup-warn{
		background: #fdf6ec;
		border: 2rpx solid #faecd8;
		color: #e6a23c;
	}
	.mpopup-info{
		background: #edf2fc;
		border: 2px solid #ebeef5;
		color: #909399;
	}
	.mpopup-loading{
		background: #e2f5ff;
		border: 2rpx solid #ceeeff;
		color: #5cbaff;
		.mini-icon{
			animation: rotate360 1.5s ease infinite;
		}
	}
	.mpopup.mpopup-fixedcontent {
		.tap-point{
			position: fixed;
			z-index:9999999999;
			width: 40rpx;
			height: 40rpx;
			text-align: center;
			line-height: 40rpx;
			background-color: rgba(255, 255, 255, 0.4);
			border-radius: 50%;
			display: flex; justify-content: center;
			transform: translate(-50%, -50%);
			.dian{
				@include background_color(page-box-background-color);
				width: 20rpx;
				height: 20rpx;
				margin: auto;
				border-radius: 50%;
				position: relative;
			}
		}

		.tap-point.tap-point-posts, .tap-point.tap-point-users{
			.dian{
				.mini-xiangshang{
					position: absolute;
					@include color(color-box-bg);
					top: 23px;
					left: -3px;
				}
				.mini-xiangshang-copy{
					position: absolute;
					@include color(color-box-bg);
					bottom: 23px;
					right: -3px;
				}
			}
		}

		.tap-point.tap-point-comment, .tap-point.tap-point-img{
			width: 34rpx;
			height: 34rpx;
			line-height: 34rpx;
			.dian{
				width: 14rpx;
				height: 14rpx;
				.mini-xiangshang{
					position: absolute;
					color: #4c4c4c;
					top: 15px;
					left: -3px;
				}
				.mini-xiangshang-copy{
					position: absolute;
					color: #4c4c4c;
					bottom: 15px;
					right: -3px;
				}
			}
		}

		.fixedcontent-box{
			position: fixed;
			z-index:9999999999;
			@include background_color(page-box-background-color);
			border-radius: $uni-border-radius-lg-er;
			.comment-fixedcontent-wrap {
			    display: flex;
				background-color: #4c4c4c;
				color: #ffffff;
				border-radius: 10rpx;
				.itme {
					min-width: 80rpx;
				    text-align: center;
				    padding: 10rpx 15rpx;
					.mini-icon{
						font-size: $uni-font-size-lg-er;
						display: inline;
					}
					.mini-icon2{
						font-size: $uni-font-size-lg-er;
						display: inline;
					}
					.text{
						margin-top: 6rpx;
						font-size: $uni-font-size-sm-base;
						white-space: nowrap;
					}
				}
			}
			.posts-longtap-wrap{
				display: flex;
				flex-direction: column;
				padding: 40rpx 40rpx 28rpx;
				box-sizing: border-box;
				position: relative;
				.item{
					width: 600rpx;
					.text{
						height: 60rpx;
						line-height: 60rpx;
						display: flex;
						.emoji{
							display: inline-flex;
							margin-right: 20rpx;
						}
						._text{
							font-size: $uni-font-size-sm-base;
							@include color(color-lighter-dark);
						}
					}
					.list{
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;
						margin-top: 20rpx;
						.select-item{
							@include background_color(page-box-item-background-color);
							@include color(color-lighter-er-dark);
							width: 48%;
							height: 60rpx;
							line-height: 60rpx;
							text-align: center;
							border-radius: 10rpx;
							margin-bottom: 20rpx;
							font-size: $uni-font-size-sm-base;
						}
					}
				}
			}
		}
		.fixedcontent-box.subject-posts.grid-7, .fixedcontent-box.subject-posts.grid-8, .fixedcontent-box.subject-posts.grid-9, .fixedcontent-box.subject-posts.grid-10, .fixedcontent-box.subject-posts.grid-11, .fixedcontent-box.subject-posts.grid-12{
			transform: translateY(-100%);
		}
		.fixedcontent-box.subject-comment{
			transform: translateX(-25%);
		}
	}
	
	.mpopup.mpopup-popImg {
	    display: flex;
	    flex-direction: column;
		padding: 20rpx;
		top: 0;
		z-index:9999999999;
		.popImg-box{
			position: fixed;
			top: 50vh;
			transform: translateY(-50%);
			._pop_image{
				max-width: 600rpx;
			}
		}
	}

	.mpopup.mpopup-captcha {
		display: flex;
		flex-direction: column;
		justify-content: center;
		top: 0;
		bottom: 0;
		z-index: 9999999999;
		position: fixed;
		left: 0;
		right: 0;
		.captcha-box{
			@include background_color(page-box-background-color);
			border-radius: $uni-border-radius-lg-est;
			position: relative;
			display: inline-block;
			vertical-align: middle;
			margin-left: auto;
			margin-right: auto;
			width: 313px;
			.captcha-close-icon{
				position: absolute;
				color: #ffffff;
				left: 50%;
				transform: translateX(-50%);
				bottom: -15%;
				font-size: 25px;
			}
			.title{
				text-align: center;
				font-size: $uni-font-size-sm-base;
				@include color(color-lightest-dark);
				margin-top: 30rpx;
			}
			.tip{
				text-align: center;
				font-size: $uni-font-size-base;
				@include color(color-light-dark);
				margin-top: 30rpx;
			}
			.captcha-img{
				display: flex;
				justify-content: center;
				margin-top: 30rpx;
				position: relative;
				._image{
					width: 160px;
					height: 160px;
					border-radius: 50%;
					position: relative;
					overflow: hidden;
					.__image {
					    width: 320px;
					    height: 320px;
					    position: absolute;
					    left: -50%;
					    top: -50%;
					}
				}
				.vertical-line{
					position: absolute;
					height: 1px;
					width: 160px;
					border-top: 1px dashed #fff;
					margin-top: 1px;
					overflow: visible;
					top: 50%;
					transform: translateY(-50%);
				}
				.transverse-line{
					position: absolute;
					height: 160px;
					border-left: 1px dashed #fff;
					margin-left: 1px;
					width: 1px;
					left: 50%;
					transform: translateX(-50%);
				}
			}
			.captcha-foot{
				display: flex;
				justify-content: center;
				box-sizing: border-box;
				margin-top: 30rpx;
				.captcha-slider{
					width: 300px;
					height: 49px;
					@include background_color(page-box-item-background-color);
					border-radius: 494px;
					overflow: hidden;
					position: relative;
					.captcha-slider-item{
						height: 48px;
						width: 60px;
						border-radius: 494px;
						background-color: white;
						position: absolute;
						left: 0;
						top: 1px;
						cursor: pointer;
						display: flex;
						justify-content: center;
						align-items: center;
						box-shadow: 0 21px 52px 0 rgba(82, 82, 82, 0.2);
					}
				}
			}
			.technology-tip{
				text-align: center;
				font-size: $uni-font-size-sm;
				@include color(color-lightest-est-er-dark);
				margin-bottom: 30rpx;
				margin-top: 30rpx;
				.tech-name{
					font-size: $uni-font-size-sm;
					display: inline-block;
					@include color(color-light-dark);
					margin-right: 6rpx;
				}
			}
		}
	}
	
	
	.mpopup.mpopup-taskReward {
	    display: flex;
	    flex-direction: column;
		padding: 20rpx;
		top: 30vh;
		z-index:9999999999;
		.taskReward-box{
			@include background_color(page-box-background-color);
			border-radius: $uni-border-radius-lg-er;
			width: 460rpx;
			height: 560rpx;
			.top{
				width: 100%;
				height: 220rpx;
				border-radius: 20rpx 20rpx 0 0;
				background-image: url(data:image/png;base64,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);
				background-size: cover;
				display: flex;
				justify-content: center;
				align-items: flex-end;
				background-color: $uni-color-primary;
				.taskicon{
					width: 110rpx;
					height: 100rpx;
				}
			}
			.content{
				width: 100%;
				height: 340rpx;
				background-color: #fff;
				border-radius: 0 0 20rpx 20rpx;
				padding: 60rpx 32rpx 32rpx;
				box-sizing: border-box;
				.title{
					text-align: center;
					font-size: 36rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #333333;
					line-height: 50rpx;
				}
				.desc{
					width: 100%;
					height: 96rpx;
					margin: 20rpx auto 0;
					font-size: $uni-font-size-lg;
					text-align: center;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					@include color(color-lighter-er-dark);
					line-height: 48rpx;
				}
				.btns{
					width: 100%;
					height: 60rpx;
					margin: auto;
					display: flex;
					justify-content: center;
					margin-top: 20rpx;
					.mbtn{
						width: 208rpx;
						height: 60rpx;
						border-radius: 42rpx;
						background: $uni-color-follow;
						font-weight: 400;
						color: $uni-color-follow-font;
						line-height: 60rpx;
						text-align: center;
						font-size: $uni-font-size-lg;
					}
				}
			}
		}
	}
	
	
	.mpopup.mpopup-getPhone {
	    display: flex;
	    flex-direction: column;
		padding: 20rpx;
		top: 30vh;
		z-index:9999999999;
		.getphone-box{
			@include background_color(page-box-background-color);
			border-radius: $uni-border-radius-lg-er;
			.phone-img{
				text-align: center;
				._image{
					width: 229rpx;
					height: 158rpx;
				}
			}
			._text{
				margin: 40rpx auto;
			}
			.desc {
			    color: gray;
				margin-bottom: 20rpx;
				font-size: $uni-font-size-sm-base;
			}
		}

	}
	.mpopup.mpopup-mini-loading {
		position: fixed;
	    display: flex;
	    flex-direction: column;
		justify-content: center;
		top: 40vh;
		width: 750rpx;
		z-index:999999999999;
		left: 0;
		.xhs-loading {
			width: 120rpx;
			height: 120rpx;
			line-height: 120rpx;
			margin: auto;
			background-color: rgba(0, 0, 0, 0.06);
			border-radius: 10rpx;
			display: $global-loading-xhs-style;
			flex-direction: column;
			justify-content: center;
			.xhs-loader {
			  width: 45rpx;
			  height: 45rpx;
			  display: block;
			  margin: auto;
			  border: 6rpx solid transparent;
			  border-top-color: transparent;
			  border-bottom-color: transparent;
			  border-right-color: $uni-color-primary;
			  border-left-color: $uni-color-primary;
			  border-radius: 50%;
			  animation: rot5 1s infinite;
			}

			@keyframes rot5 {
			  0% {
			    transform: rotate(0);
			  }

			  50% {
			    transform: rotate(180deg);
			  }

			  100% {
			    transform: rotate(360deg);
			  }
			}
		}
		.dy-loading{
			width: 70rpx;
			height: 70rpx;
			margin: auto;
			display: $global-loading-dy-style;
			.dy-loader {
			 width: 22rpx;
			 height: 22rpx;
			 position: relative;
			 transform: translateX(-11rpx);
			 /* Compensating for the left of 50px in the keyframe. */
			}

			.dy-loader::before,
			.dy-loader::after {
			 content: '';
			 position: absolute;
			 width: inherit;
			 height: inherit;
			 border-radius: 50%;
			 mix-blend-mode: multiply;
			 animation: rotate9 1s infinite cubic-bezier(0.77, 0, 0.175, 1);
			}

			.dy-loader::before {
			 background-color: #fc3f9e;
			}

			.dy-loader::after {
			 background-color: #50e8f3;
			 animation-delay: .5s;
			}

			@keyframes rotate9 {
			 0%,100% {
			  left: 40rpx;
			 }

			 25% {
			  transform: scale(.5);
			 }

			 50% {
			  left: 0;
			 }

			 75% {
			  transform: scale(1);
			 }
			}
		}
	}
	.fade_Down{
		animation: fadeInDown 0.6s both;
	}
	.fade_Top{
		animation: fadeInTop 0.5s forwards;
	}
	.botton-from{
		animation: botton-from 0.5s;
	}
	.botton-dismiss{
		animation: botton-dismiss 0.26s;
	}
	.popup-in{
		animation: popup-in 0.26s;
	}
	.popup-out{
		animation: popup-out 0.2s;
	}
	@keyframes botton-from
	{
	    0% {
			bottom: -960rpx;
	    }
	}
	@keyframes botton-dismiss
	{
		100% {
			bottom: -960rpx;
		}
	}
	/*从上到下*/
	@keyframes popup-in
	{
	    from {
	        opacity: 0;
			-ms-transform: scale(1.185);
			transform: scale(1.185);
	    }
	    to {
	        opacity:1;
	        -ms-transform: scale(1);
	        transform: scale(1);
	    }
	}
	@keyframes popup-out
	{
	    from {
	        opacity: 1;
			-ms-transform: scale(1);
			transform: scale(1);
	    }
	    to {
	        opacity:0;
			-ms-transform: scale(0);
			transform: scale(0);
	    }
	}
	/*从上到下*/
	@keyframes fadeInDown
	{
	    from {
	        opacity: 0;
	        -webkit-transform: translate(0,-200rpx);
	        transform: stranslate(0,-200rpx);
	    }
	    to {
	        opacity:1;
	        -webkit-transform: translate(0,20rpx);
	        transform: stranslate(0,20rpx);
	    }
	}
	/*从下到上*/
	@keyframes fadeInTop
	{
	    from {
	        opacity:1;
	        -webkit-transform: translate(0,20rpx);
	        transform: stranslate(0,20rpx);
	    }
	    to {
			opacity: 0;
			-webkit-transform: translate(0,-200rpx);
			transform: stranslate(0,-200rpx);
	    }
	}
	@keyframes rotate360
	{
		from {
			transform: rotate(0);
		}
		to{
			transform: rotate(360deg);
		}
	}
.mpopup.mpopup-payword{
	width: 750rpx;
	position: fixed;
	z-index:9999999999;
	bottom: 0;
	height: 960rpx;
	@include background_color(page-box-background-color);
	border-radius: $uni-border-radius-lg-er $uni-border-radius-lg-er 0 0;
	padding-bottom: env(safe-area-inset-bottom);
}

.mpopup.mpopup-givecoin{
	width: 750rpx;
	position: fixed;
	z-index:9999999999;
	bottom: 0;
	height: 500rpx;
	@include background_color(page-box-background-color);
	border-radius: $uni-border-radius-lg-er $uni-border-radius-lg-er 0 0;
	padding-bottom: env(safe-area-inset-bottom);
	.givecoin-box{
		width: $page-content-body-width;
		margin: auto;
		.split-line{
			border-bottom: 1rpx solid;
			@include border_color(border-color-light-line-background-color);
		}
		.title{
			display: flex;
			justify-content: space-between;
			padding: 10px 0 30rpx;
			@include color(color-darkest);
			.left{
				display: flex;
				font-size: $uni-font-size-base;
				.tip{
					.mini-icon{
						display: inline-block;
					}
					@include color(color-lightest-dark);
					margin-left: 10rpx;
					font-size: $uni-font-size-sm-base;
					align-self: end;
					@include color(color-lighter-dark);
				}
				._view{
					align-self: end;
				}
			}
			.right{

			}
		}
		._scroll-view{
			width: $page-content-body-width;
			margin-top: 30rpx;
		}
		.options {
		    display: flex;
			flex-wrap: nowrap;
			.select-item{
				width: 120rpx;
				margin-right: 28rpx;
				.img{
					width: 100rpx;
					height: 100rpx;
					background-color: #f2f2f4;
					text-align: center;
					margin: auto;
					align-items: center;
					box-sizing: border-box;
					border-radius: 10rpx;
					._image{
						width: 50rpx;
						height: 50rpx;
						margin-top: calc( 50% - 25rpx );
					}
				}
				.text{
					@include color(color-lightest-dark);
					width: 120rpx;
					font-size: $uni-font-size-sm-base;
					text-align: center;
					margin-top: 10rpx;
				}
			}
			.select-item.cur{
				.img{
					border: 1px solid $uni-color-primary;
				}
				.text{
					color: $uni-color-primary !important;
				}
			}
		}
		.options-tip {
		    @include color(color-dark);
			margin: 40rpx 0;
			text-align: center;
			font-size: $uni-font-size-sm-base;
			.num{
				display: inline-block;
				color: $uni-color-primary;
			}
		}
		.btn{
			padding: 20rpx 0;
			background-color: $uni-color-follow;
			color: $uni-color-follow-font;
			text-align: center;
			font-size: $uni-font-size-sm-base;
			border-radius: $uni-border-radius-lg-er;
		}
	}
}


.mpopup.mpopup-aite{
	width: 750rpx;
	position: fixed;
	z-index:9999999999;
	bottom: 0;
	height: 960rpx;
	@include background_color(page-box-background-color);
	border-radius: $uni-border-radius-lg-er $uni-border-radius-lg-er 0 0;
	padding-bottom: env(safe-area-inset-bottom);
	.aite-box{
		width: $page-content-body-width;
		margin: auto;
		.box-head{
			padding: 10rpx 0 20rpx;
			position: relative;
			width: 100%;
			.mini-icon{
				@include color(color-lightest-dark);
				font-weight: 100;
			}
			.box-head-title{
				text-align: center;
				@include color(color-light-dark);
			}
		}
		.search-name{
			margin-top: 14rpx;
			.search-name-input{
				font-size: $uni-font-size-lg;
				@include background_color(page-gray-background-color);
				@include color(color-light-dark);
				height: 70rpx;
				line-height: 70rpx;
				font-size: $uni-font-size-sm-base;
				padding: 0 16rpx;
				border-radius: 10rpx;
			}
		}

		.user-list{
			.user-item{
				display: flex;
				align-items: center;
				padding: 0 16rpx;
				height: 120rpx;
				.avatars {
				    width: 80rpx;
				    height: 80rpx;
				    border-radius: 50%;
					@include background_color(page-box-item-background-color);
				}
				.infos {
				    flex: 1;
				    margin: 0 30rpx;
				    display: flex;
				    flex-direction: column;
				    align-items: flex-start;
				}
				.nickname {
				    flex: 1;
				    line-height: 50rpx;
				    height: 50rpx;
				    font-size: $uni-font-size-medium;
				    width: 100%;
				    @include color(color-light-dark);
				    margin: 0;
				    display: -webkit-box;
				    -webkit-line-clamp: 1;
				    -webkit-box-orient: vertical;
				    overflow: hidden;
				}
			}
		}
	}
}

.mpopup.mpopup-permisstip{
	width: 750rpx;
	position: fixed;
	z-index:9999999999;
	top: 0;
	left: 0;
	padding-top: 100rpx;
	.permisstip-box{
		width: $page-content-body-width;
		@include background_color(page-box-background-color);
		border-radius: $uni-border-radius-lg-er;
		box-sizing: border-box;
		@include color(color-darkest);
		padding: 30rpx 20rpx;
		margin: auto;
	}
}

.mpopup.mpopup-payway{
	width: 750rpx;
	position: fixed;
	z-index:9999999999;
	bottom: 0;
	height: 800rpx;
	@include background_color(page-box-background-color);
	border-radius: $uni-border-radius-lg-er $uni-border-radius-lg-er 0 0;
	padding-top: 20rpx;
	padding-bottom: env(safe-area-inset-bottom);
	.payway-box{
		width: $page-content-body-width;
		margin: auto;
		.head {
			position: relative;
			line-height: 40rpx;
			.head__title {
				width: 100%;
				text-align: center;
				font-size: $uni-font-size-base;
				font-weight: 700;
				@include color(color-darkest);
			}
		}
		.type-item {
			height: 70rpx;
			padding: 20rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: $uni-font-size-medium;
			position: relative;
			.coins_num_input_wrap{
				display: flex;
				line-height: 60rpx;
				margin-right: 20rpx;
				color: #888888;
				.coins_num_input{
					width: 120rpx;
					text-align: center;
					border-bottom: 1px solid #dddddd;
					line-height: 60rpx;
					height: 60rpx;
					@include color(color-lighter-er-dark);
				}
			}

		}
		.payway-3{
			display: none;
		}
		.seleted-payway-0.payway-3{
			display: flex;
		}

		/* #ifdef MP-WEIXIN */
		.payway-2{
			display: none!important;
		}
		/* #endif */
		.mini-icon{
			font-size: 52rpx;
			margin-right: 20rpx;
		}

		.tit {
			font-size: $uni-font-size-lg;
			@include color(color-light-dark);
			margin-bottom: 4rpx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: $page-content-body-width;
		height: 80rpx;
		margin: 30rpx auto 30rpx;
		font-size: $uni-font-size-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
		position: absolute;
		bottom: 20rpx;
	}
}
.pass-box {
	padding: 20rpx;
	@include background_color(page-box-background-color);
	width: 750rpx;
	box-sizing: border-box;
	z-index: 9999999999;
	border-radius: $uni-border-radius-lg-er $uni-border-radius-lg-er 0 0;
	&-head {
		position: relative;
		line-height: 40rpx;
		@include color(color-lightest-dark);
		&__title {
			width: 100%;
			text-align: center;
			font-size: $uni-font-size-base;
			font-weight: 700;
			@include color(color-light-dark);
		}
	}

	&-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 40rpx;
		&__text {
			overflow: hidden;
			display: -webkit-box;
			margin-bottom: 10rpx;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			@include color(color-darkest);
		}

		&__money {
			font-weight: 700;
			@include color(color-darkest);
			._text {
				font-size: 60rpx;
				@include color(color-darkest);
			}
		}
		&__money.vip_price{
			@include color(color-vip);
			.vip_price_tip{
				display: inline-block;
				font-size: $uni-font-size-sm;
				margin-right: 20rpx;
				color: #ccc;
			}
		}
	}
	.pay-way{
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
		.left{
			@include color(color-lighter-er-dark);
		}
		.right{
			@include color(color-lighter-er-dark);
			.mini-icon{
				display: inline-block;
				margin-right: 5rpx;
			}
		}
	}
	.split-line{
		border-bottom: 2rpx solid;
		@include border_color(border-color-light-line-background-color);
	}

	&-footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 60rpx 70rpx;

		&__passnum {
			width: 70rpx;
			height: 70rpx;
			border-radius: 10rpx;
			background-color: #eee;
			@include background_color(page-lighter-er-line-background-color);
			display: flex;
			align-items: center;
			text-align: center;
			.mini-dian{
				font-size: 22rpx;
				margin: auto;
			}
		}
	}
}

.keyboard {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	bottom:env(safe-area-inset-bottom);
	//margin-bottom: env(safe-area-inset-bottom);
	@include background_color(page-box-item2-background-color);
	display: grid;
	grid: 100rpx / repeat(3, 1fr);
	grid-gap: 1px;
	z-index: 9999999999;
	&-key {
		@include background_color(page-box-background-color);
		line-height: 100rpx;
		text-align: center;
		font-size: 60rpx;
		@include color(color-darkest);
		&__del {
			line-height: 100rpx;
			text-align: center;
			font-size: 60rpx;
			.mini-icon{
				font-size: 50rpx;
				@include color(color-darkest);
			}
		}
	}
}
/* #ifdef APP */
.popup_list.android{
	.payway-4{
		display: none !important;
	}
}
/* #endif */
/* #ifdef H5 || MP */
.payway-4{
	display: none !important;
}
/* #endif */
</style>
