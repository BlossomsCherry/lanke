<template>
  <view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
		<navBar :back="true" :home="fph" title="我的钱包" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">

		</navBar>
      <view class="block-top">
        <view class="left" @tap="toSliderUrl(6, '/pagesA/mine/earnings/recharge')">
          <i class="mini-icon mini-qianbao1"></i>
          <view class="title">余额</view>
          ￥
          <u-count-to :endVal="restBalance" :decimals="2" color="#ffffff" fontSize="42"></u-count-to>
        </view>
		
		<view class="right" @tap="toSliderUrl(6, ((config_pays && config_pays.paycode_14) ? '/pagesA/mine/earnings/inspire' : '/pages/common/help?type=10'))">
		  <i class="mini-icon mini-Gold_coin_01"></i>
		  <view class="title">{{ config_app_coins_name }}</view>
		  <u-count-to :endVal="totalCoins" color="#ffffff" fontSize="42"></u-count-to>
		</view>

      </view>
      <view class="block-center">
        <view class="center-box" v-for="(item, index) in withdrawal" :key="item.id" @tap.stop.prevent="centerBoxTap(item)">
          <view class="num">￥{{ item.i }}</view>
          <view class="add-date">{{ item.n }}
            <i class="mini-icon mini-bangzhu" v-if="index == 3" @tap.stop.prevent="shutFreezePopup"></i>
          </view>
        </view>
      </view>

      <u-sticky :offsetTop="0" >
        <view class="nav">
          <view @tap="onHandleClick" class="tag-box" :data-index="index" v-for="(item, index) in tabData" :key="index">
            <view :class="'taga-item ' + (swithBarIndex == index ? 'active' : '')" :data-index="index">{{ item == '金币' ? config_app_coins_name : item }}</view>
          </view>
        </view>
      </u-sticky>

      <view class="list-box">
        <block v-if="swithBarIndex == 0">
          <block v-if="isFinancialRecord">
            <view class="record-item flex-row" v-for="(item, index) in financialRecordList" :key="item.id">
              <view :class="'left' + ' '+ item.type">
                <i v-if="item.type == 0" class="mini-icon mini-chongdian"></i>
                <i v-else-if="item.type == 1" class="mini-icon mini-choujiang"></i>
                <i v-else-if="item.type == 2" class="mini-icon mini-tixian"></i>
                <i v-else-if="item.type == 3" class="mini-icon mini-tuikuan"></i>
                <i v-else-if="item.type == 4" class="mini-icon mini-qiandao1"></i>
                <i v-else-if="item.type == 5" class="mini-icon mini-renwu"></i>
                <i v-else class="mini-icon mini-diandiandain"></i>
              </view>
              <view class="middle flex-column">
                <view class="name">{{ item.type_name }}</view>
                <view class="record-date">{{ item.date }}</view>
              </view>
              <view class="right">
                <text class="_text">{{ item.num_str }}</text>
              </view>
            </view>
          </block>
          <block v-else>
            <u-empty text="空" width="300" height="300" text-size="28"/>
          </block>
        </block>
        <block v-else-if="swithBarIndex == 1">
          <block v-if="isExceptional">
            <view class="chen-box" v-for="(item, index) in exceptionalList" :key="item.id">
              <view class="chen-box-conent">
                <view class="left">
                  <image @tap.stop.prevent="toSliderUrl(4, item.user.id)" mode="aspectFill" :src="item.user.user_avatar"/>
                  <view class="chen-box-text">
                    收到一笔「{{ item.user.user_name }}」的充电
                    <view class="chen-botx-desc">
                      <view class="datetime">{{ item.datetime }}</view>
                      <view class="see_the_post" @tap="toSliderUrl(1, item.posts_id)">查看笔记</view>
                    </view>
                  </view>
                </view>
                <view class="price">
					￥{{ item.exceptional_price }}
				</view>
              </view>
            </view>
          </block>
          <block v-else>
            <u-empty text="空" width="300" height="300" text-size="28"/>
          </block>
        </block>
        <block v-if="swithBarIndex == 2">
          <block v-if="isWithdrawal">
            <block v-for="(item, index) in withdrawalList" :key="item.id">
              <view :title="item.state == 1 ? item.account_at : item.created_at">
                <view class="describe-container">
				  <view class="price">
				  	￥{{ item.price }}
				  </view>
                  <view class="status">{{ item.status_value }}</view>
                </view>
              </view>
            </block>
          </block>
          <block v-else>
            <u-empty text="空" width="300" height="300" text-size="28"/>
          </block>
        </block>
        <block v-if="swithBarIndex == 3">
          <block v-if="isCoinsRecord">
            <view class="record-item flex-row" v-for="(item, index) in coinsRecordList" :key="item.id">
              <view class="left gold">
                <i class="mini-icon mini-Gold_coin_01"></i>
              </view>
              <view class="middle flex-column">
                <view class="name">{{ item.tip }}</view>
                <view class="record-date">{{ item.date }}</view>
              </view>
              <view class="right">
                <!-- <text>{{item.num_str}}</text> -->
              </view>
            </view>
          </block>
          <block v-else>
            <u-empty text="空" width="300" height="300" text-size="28"/>
          </block>
        </block>
      </view>

      <u-popup :show="withdrawalPopup" @close="withdrawalTap">
        <view class="withdrawal-add-box">
          <image class="withdrawal-add-box-image" src="https://img.mini.minisns.cn/icons/tixian.png" mode="aspectFill"/>
          <view class="withdrawal-add-box-view">
            <view
                :class="index == idx ? 'bd' : '' || item > withdrawalBalance ? 'hd' : ''"
                @tap="parseEventDynamicCode($event, item > withdrawalBalance ? 'notWithdrawal' : 'addwithdrawalPrice')"
                :data-idx="index"
                :data-price="item"
                v-for="(item, index) in withdrawalPrice"
                :key="item.id"
            >
              ¥{{ item }}
            </view>
          </view>
          <view class="withdrawal-add-input-box">
            <text class="_text">支行名称：</text>
            <input
                class="withdrawal-add-input"
                @input="withdrawalbankName"
                :value="bankName"
                placeholder-class="_input_place_holder"
                placeholder="在这里输入支行名称"
            />
          </view>
          <view class="withdrawal-add-input-box">
            <text class="_text">银行卡号：</text>
            <input
                class="withdrawal-add-input"
                @input="withdrawalbankId"
                :value="bankId"
                placeholder-class="_input_place_holder"
                type="digit"
                placeholder="在这里输入银行卡号"
            />
          </view>
          <view class="withdrawal-add-box-btn" @tap="withdrawalPay">确认提现</view>
          <view class="details">注：由于微信，支付宝费率等原因，提现默认到账金额将会扣除{{ config2_app_withdrawal_platform_percent }}%手续费</view>
        </view>
      </u-popup>

      <u-popup :show="showFreezePopup" @close="shutFreezePopup">
        <view class="rule-tip-wrap">
          <view class="title">余额冻结说明</view>
          <view class="tip-content">
            <view class="line">
              场景一：用户在商城下单后未“确认收货”前，商品的分账收益会进入冻结中
            </view>
          </view>
        </view>
      </u-popup>

      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


import NumberAnimate from '@/utils/numberAnimate';

const mixins = require('@/mixins/user');
const common = require('@/mixins/common');
var options = {};

common(options);
mixins(options);
export default {
  mixins: [{ methods: options }],
  components: {
	  myToast,navBar,hoverBall,
  },
  computed: {
	config_pays:{
		get(){
			let that = this;
			if(that.$store.state.config && that.$store.state.config.pays){
				return that.$store.state.config.pays || {};
			}
			return {};
		},
		set(v){}
	},
    config_app_coins_name: {
      get() {
        let that = this;
        if (that.$store.state.config.app.coins) {
          return that.$store.state.config.app.coins.name;
        }
        return '硬币';
      },
      set(v) {}
    },
    config2_app_withdrawal_platform_percent: {
      get() {
        let that = this;
        if (that.$store.state.config2.app && that.$store.state.config2.app.withdrawal) {
          return that.$store.state.config2.app.withdrawal.platform_percent;
        }
        return '10';
      },
      set(v) {}
    },
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 24,
      tabData: ['余额', '充电', '提现', '金币'],
      swithBarIndex: 0,
      withdrawalPopup: false,
      idx: -1,
      withdrawalPrice: [10, 50, 100, 200],
      price: 0,
      withdrawalBalance: 0,
      bankName: '',
      bankId: '',
      restBalance: '0',
      totalCoins: 0,

      withdrawal: [
        {
          n: '昨日余额',
          i: '0'
        },
        {
          n: '可提现',
          i: '0'
        },
        {
          n: '已提现',
          i: '0'
        },
        {
          n: '冻结中',
          i: '0'
        },
      ],

      financialRecordList: [],
      isFinancialRecord: true,
      financialRecordPage: 1,

      coinsRecordList: [],
      isCoinsRecord: true,
      coinsRecordPage: 1,

      withdrawalList: [],
      isWithdrawal: true,
      withdrawalpage: 1,

      exceptionalList: [],
      isExceptional: true,
      exceptionalPage: 1,

      scrollTop: 0,
      setUserId: 0,

      showFreezePopup: false,
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
      uni.setNavigationBarTitle({
        title: 'ta的钱包'
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(24, 0, true, false, 0, 2);

    that.myFinancial();
    that.myUserFinancialRecord();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.myFinancial();
    that.myUserWithdrawal();
    uni.hideNavigationBarLoading();
    uni.stopPullDownRefresh();
  },
  onNavigationBarButtonTap: function (e) {
    // e的返回格式为json对象：{"text":"测试","index":0}
    if (e.index == 0) {
      uni.wen.toUrl(6, '/pagesA/mine/earnings/ranking', null);
    }

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {},
  methods: {
    shutFreezePopup() {
      let that = this;
      that.showFreezePopup = !that.showFreezePopup;
    },
    //切换
    onHandleClick: function (e) {
      let that = this;
      const index = e.currentTarget.dataset.index;
      that.setData({
        swithBarIndex: index
      });
      if (index == 0) {
        this.myUserFinancialRecord();
      } else if (index == 1) {
        this.myUserExceptional();
      } else if (index == 2) {
        this.myUserWithdrawal();
      } else if (index == 3) {
        this.myUserCoinsRecord();
      }
    },
    centerBoxTap(item) {
      let that = this;
      if (item.n == '可提现') {
        // that.withdrawalTap();
      }

    },
    withdrawalTap() {
      let that = this;
      if (that.$store.state.config.audit.is_withdrawal == 1 && that.$store.state.config.app.mode != 'examine') {
        that.setData({
          withdrawalPopup: !that.withdrawalPopup
        });
      }
    },

    addwithdrawalPrice(e) {
      let price = e.currentTarget.dataset.price;
      let idx = e.currentTarget.dataset.idx;
      let that = this;
      that.setData({
        price: price,
        idx: idx
      });
    },

    withdrawalbankName(e) {
      this.setData({
        bankName: e.detail.value
      });
    },

    withdrawalbankId(e) {
      this.setData({
        bankId: e.detail.value
      });
    },

    notWithdrawal(e) {
      let price = e.currentTarget.dataset.price;
      uni.showToast({
        title: '可提现金额不足¥' + price + ' !',
        icon: 'none',
        duration: 1500
      });
    },

    animate: function () {
      let that = this;
      let restBalance = that.restBalance;
      let number = new NumberAnimate({
        from: restBalance,
        speed: 500,
        refreshTime: 150,
        decimals: 2,
        onUpdate: () => {
          that.setData({
            restBalance: number.tempValue
          });
        }
      });

      let totalCoins = that.totalCoins;
      let number2 = new NumberAnimate({
        from: totalCoins,
        speed: 500,
        refreshTime: 150,
        decimals: 2,
        onUpdate: () => {
          that.setData({
            totalCoins: number2.tempValue
          });
        }
      });

    },
  }
};
</script>
<style lang="scss">
.list-box {
  width: 700rpx;
  margin: 40rpx auto;
  animation: fadeIn 1s ease;
  padding-bottom: env(safe-area-inset-bottom);
}

.record-item {
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid;
  @include border_color(border-color-box-item-background-color);
  padding: 0 0 10px;

  .left {
    width: 70rpx;
    text-align: center;
    height: 70rpx;
    line-height: 70rpx;
    background-color: yellowgreen;
    border-radius: 50%;
    margin-right: 20rpx;

    .mini-icon {
      font-size: 30px;
      color: #ffffff;
    }
  }

  .middle {
    width: 490rpx;

    .name {
      font-size: 14px;
      @include color(color-darkest);
    }

    .record-date {
      @include color(color-lightest-dark);
      font-size: 13px;
    }
  }

  .right {
    font-size: $uni-font-size-lg;
    width: 120rpx;
    text-align: right;
	._text{
		@include color(color-darkest);
	}
  }
}

.record-item .left.gold {
  background-color: $uni-color-primary;
}

.block-top {
  margin: 0 20rpx;
  padding: 80rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $uni-color-primary;
  color: #ffffff;
  border-radius: 15px;

  .left, .right {
    width: 50%;
    text-align: center;
    overflow: hidden;
  }

  .mini-icon {
    font-size: 22px;
  }
}

.top-left .title {
  color: $uni-color-primary;
  font-size: $uni-font-size-lg;
  font-weight: bold;
}

.top-left .translation {
  color: #444;
  font-size: $uni-font-size-base;
  padding: 10rpx 0 30rpx;
}

.top-right {
  font-size: $uni-font-size-base;
  font-weight: bold;
  background: $uni-color-follow;
  color: $uni-color-follow-font;
  width: 160rpx;
  height: 80rpx;
  border-radius: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 24px 0 #cccccc;
}

.block-center {
  margin: 20rpx 20rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.center-box {
  padding: 10rpx 10rpx;
  flex: 1;
  border-radius: 10rpx;
  max-width: 150rpx;
  @include background_color(page-box-background-color);
  .num{
	  @include color(color-darkest);
  }
}

.add-date {
  font-size: $uni-font-size-sm;
  @include color(color-darkest);

  .mini-icon {
    display: inline;
    @include color(color-darkest);
    font-size: $uni-font-size-base;
    margin-left: 10rpx;
  }
}

.describe-container {
  display: flex;
  align-items: flex-end;
  padding: 15rpx 0;
  .price{
	@include color(color-light-dark);
  }
}

.describe-container .status {
  padding-left: 30rpx;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  font-weight: bold;
}

.withdrawal-add-box {
  width: 700rpx;
  height: 760rpx;
  border-radius: 30rpx;
  @include background_color(page-box-background-color);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.withdrawal-add-box-image {
  position: absolute;
  top: -150rpx;
  width: 400rpx;
  height: 400rpx;
}

.withdrawal-add-input-box {
  margin-top: 20rpx;
  width: 460rpx;
  height: 50rpx;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  @include background_color(page-box-item-background-color);
  font-size: $uni-font-size-sm-base;
  font-weight: 500;
  @include color(color-light-dark);
  display: flex;
  align-items: center;
}

.withdrawal-add-input-box text {
  width: 140rpx;
  @include color(color-light-dark);
  font-size: $uni-font-size-sm-base;
  font-weight: 500;
  line-height: 50rpx;
}

.withdrawal-add-input {
  width: 320rpx;
  height: 50rpx;
}

.withdrawal-add-input-phs {
  font-size: $uni-font-size-sm-base;
  @include color(color-lightest-dark);
}

.withdrawal-add-box-view {
  margin: 20rpx 0 20rpx;
  width: 500rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  view {
    padding: 10rpx 24rpx;
    @include color(color-light-dark);
    border-radius: 8rpx;
    font-size: $uni-font-size-sm-base;
    font-weight: 500;
    @include background_color(page-box-item-background-color);
  }

  .bd {
    @include background_color(follow-background-color);
    @include color(color-follow-font);
  }

  .hd {
    color: $uni-text-color-grey !important;
  }
}

.withdrawal-add-box-btn {
  margin: 40rpx 0 10rpx;
  width: 300rpx;
  height: 80rpx;
  border-radius: 80rpx;
  font-size: $uni-font-size-base;
  font-weight: bold;
  background: $uni-color-follow;
  color: $uni-color-follow-font;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 24px 0 #cccccc;
}

.details {
  width: 500rpx;
  padding: 20rpx 30rpx;
  @include color(color-light-dark);
  font-size: 22rpx;
}

.nav {
  width: 100%;
  height: 90rpx;
  display: flex;
  font-size: $uni-font-size-lg;
  line-height: 90rpx;
  @include background_color(page-body-background-color);
  justify-content: center;
}


.tag-box {
  padding: 0 30rpx;
}

.taga-item {
  font-size: $uni-font-size-lg;
  @include color(color-lightest-dark);
  font-weight: 450;
}

.tag-box .active {
  color: $uni-color-primary !important;
  font-weight: bold !important;
  position: relative;
}

.tag-box .active:before {
  content: '';
  display: block;
  width: 16rpx;
  height: 6rpx;
  background: $uni-color-primary;
  border-radius: 6rpx;
  position: absolute;
  bottom: 10rpx;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.4s ease;
}

.chen-box {
  margin-bottom: 40rpx;
  border-bottom: 1px solid;
  @include border_color(border-color-box-item-background-color);
  padding-bottom: 30rpx;
}

.chen-box-conent {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
  }
}

.chen-box-conent image {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  animation: fadeIn 1s ease;
}

.chen-box-conent .chen-box-text {
  width: 400rpx;
  font-size: $uni-font-size-base;
  @include color(color-light-dark);
  line-height: 40rpx;
  display: flex;
  flex-direction: column;

  .chen-botx-desc {
    display: flex;

    .datetime {
      font-size: $uni-font-size-sm;
      @include color(color-lightest-dark);
    }

    .see_the_post {
      color: cornflowerblue;
      font-size: $uni-font-size-sm-base;
      margin-left: 10px;
    }
  }
}

.see-posts {
  margin-top: 30rpx;
  width: 220rpx;
  height: 70rpx;
  border-radius: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  @include color(color-light-dark);
  font-size: $uni-font-size-base;
  @include background_color(page-box-background-color);

  .mini-icon {
    font-size: 43rpx;
    margin-right: 10rpx;
  }
}

.see-posts image {
  width: 38rpx;
  height: 38rpx;
  margin-right: 16rpx;
}


.rule-tip-wrap {
  @include background_color(page-box-background-color);
  width: 600rpx;
  height: 900rpx;
  border-radius: $uni-border-radius-lg-er;

  .title {
    text-align: center;
    width: 600rpx;
    padding: 30rpx 0 40rpx;
    font-weight: 600;
  }

  .tip-content {
    width: 600rpx;
    padding: 0 20rpx;
    box-sizing: border-box;

    .line {
      margin-bottom: 20rpx;
      font-size: $uni-font-size-base;
      color: #444;
    }
  }
}


</style>
