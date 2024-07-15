<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="height:100%" class="mini-page-body">
      <view class="container" v-if="!isEmpty">
        <block v-for="(item, index) in cartGoods" :key="item.id">
          <view :class="'goods-list ' + (item.isTouchMove ? 'touch-move-active' : '')" @touchstart="touchstart" @touchmove="touchmove" :data-index="index">
            <view class="goods-box">
              <view v-if="item.state == 3" class="sold-out">
                <image src="/pagesA/static/image/goods-out.png"></image>
              </view>
              <view class="goods-radio" @tap.stop.prevent="radioGoods" :data-pid="item.product_id" :data-check="item.is_check" :data-index="index">
                <i v-if="item.is_check && item.state == 0" class="mini-icon mini-a-mianxing checked"></i>
                <i v-else class="mini-icon mini-a-mianxing"></i>
              </view>
              <image @tap.stop.prevent="toSliderUrl(3, item.goods_id)" class="goods-img" mode="aspectFill" :src="item.goods_pic"></image>
              <view class="goods-info">
                <view class="goods-info-df" @tap.stop.prevent="toSliderUrl(3, item.goods_id)">
                  <view class="goods-info-text">
                    <view class="txt1">{{ item.goods_name }}</view>
                    <view class="txt2">{{ item.goods_product }}</view>
                  </view>
                  <i @tap.stop.prevent="onClickDialog" :data-idx="index" :data-cid="item.id" class="goods-info-df-icon mini-icon mini-diandiandain"></i>
                </view>
                <view class="goods-info-df gi2">
                  <picker @change="bindPickerChange" :data-pid="item.product_id" :data-idx="index" :value="item.num" :range="numRange">
                    <view class="number">{{ item.num }}</view>
                  </picker>
                  <view>
					  ￥<u-count-to :endVal="'' + (myUserInfo.is_member ? item.vip_price : item.price) * item.num"
					      :decimals="2"
					      :bold="true"
					      :color="global__theme__ == 'black' ? '#dadadb' : '#333333'"
					      fontSize="28"
					  ></u-count-to>
				  </view>
                </view>
              </view>
            </view>
            <view class="slide-right" @tap.stop.prevent="deleteGoods(item.id, index)">删除</view>
          </view>
        </block>
        <view class="footer">
          <view class="footer-box">
            <view class="footer-left" @tap.stop.prevent="allCart">
              <i class="mini-icon mini-a-mianxing checked" v-if="isAllRadio"></i>
              <i class="mini-icon mini-a-mianxing" v-else></i>
              <text class="_text">全选</text>
            </view>
            <view class="footer-rigth">
              <block v-if="myUserInfo.is_member">
                <view class="footer-rigth-price">
                  <view class="total-price">
					  ￥<u-count-to
					      :endVal="vipAmount"
					      :decimals="2"
					      :bold="true"
					      :color="global__theme__ == 'black' ? '#dadadb' : '#333333'"
					      fontSize="38"
					  ></u-count-to>
				  </view>
                  <view class="footer-rigth-text">会员优惠 ¥{{ discountsAmount }}</view>
                </view>
                <view @tap.stop.prevent="toPlaceOrder" :class="'pay-btn ' + (maxNum > 0 ? 'bg1' : 'bg2')">结算 ({{ maxNum }})</view>
              </block>
              <block v-else>
                <view class="footer-rigth-price">
                  <view class="total-price">
					  ￥<u-count-to
					      :endVal="amount"
					      :decimals="2"
					      :bold="true"
					      :color="global__theme__ == 'black' ? '#dadadb' : '#333333'"
					      fontSize="38"
					  ></u-count-to>
				  </view>
                  <view class="footer-rigth-text">开通vip可优惠 ¥{{ discountsAmount }}</view>
                </view>
                <view @tap.stop.prevent="toPlaceOrder" :class="'pay-btn ' + (maxNum > 0 ? 'bg1' : 'bg2')">结算 ({{ maxNum }})</view>
              </block>
            </view>
          </view>
        </view>
      </view>

      <view class="cart-empty-container" v-else>
        <view class="cart-empty-txt bt15">购物袋空空如也</view>
        <view class="cart-empty-txt">开始SHOP，让美好触手可及</view>
        <!-- <image class="cart-empty-img" mode="aspectFill" :src="config_img.empty"></image>
        <view class="cart-empty-btn" @tap.stop.prevent="toSliderUrl(6, '/pages/tabbar/shop/shop')">TO SHOP</view> -->
      </view>

      <view class="goods-container">
        <view class="goods-title">你可能喜欢</view>
        <l-water-flow comName="goods" :waterData="goodsWaterData" :column-gap="8"/>
        <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
      </view>

      <view :class="'dialog ' + (showDialog ? 'dialog_show' : '')">
        <view @tap="onClick" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
        <view class="dialog_container">
          <view class="dialog_conent">
            <view @tap.stop.prevent="shareGoodsClick" class="select-item c1">发帖推荐</view>
            <view @tap.stop.prevent="deleteGoods(cid, idx)" class="select-item c2">删除</view>
            <view @tap="onClick" class="select-item">取消</view>
          </view>
        </view>
      </view>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


import lWaterFlow from '@/linui/water-flow/index';
import goods from '@/components/common/water/goods-item/index';

const shop = require('@/mixins/shop');
const user = require('@/mixins/user');
var options = {};

shop(options);
user(options);
export default {
  mixins: [{ methods: options }],
  components: {
	  myToast,navBar,hoverBall,
	  lWaterFlow,goods
  },
  computed: {},
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 36,
      isEmpty: false,
      isAllRadio: false,
      isTouchMove: false,
      startX: 0,
      startY: 0,
      showDialog: false,
      cartGoods: [],
      maxNum: 0,
      amount: 0,
      vipAmount: 0,
      discountsAmount: 0,
      recommendList: [],
      page: 1,
      loadmoreShow: false,
      isLastPage: false,
      numRange: [],
      idx: 0,
      pid: 0,
      cid: 0,
      goodsWaterData: {
        e: 0,
        data: []
      }
    };
  },
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    uni.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: '#fff'
    })
    var arr = new Array();
    for (var i = 0; i < 100; i++) {
      arr.push(i);
    }
    that.numRange = arr;
    that.getShopIndexRecommend();
  },
  onShow: function () {
    let that = this;
    that.updateScene(36, 0, true);

    that.getShopUserCartList();
  },
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      loadmoreShow: false,
      isLastPage: false,
      page: 1
    });
    that.getShopUserCartList();
    that.getShopIndexRecommend();
    uni.stopPullDownRefresh();
  },
  onReachBottom: function () {
    let that = this;
    that.setData({
      loadmoreShow: true,
      page: that.page + 1
    });
    that.getShopIndexRecommend();
  },
  onShareAppMessage: function (res) {
    return {
      title: '我的购物袋',
      path: 'pages/tabbar/shop/shop?fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: that.$store.state.config.img.default_share
    };
  },
  methods: {
    calculateFun() {
      let that = this;
      let cartGoods = that.cartGoods;
      let maxNum = 0;
      let outNum = 0;
      let amount = 0;
      let vipAmount = 0;
      let discountsAmount = 0;
      let isAllRadio = false;

      for (let v of cartGoods) {
        if (v.is_check && v.state == 0) {
          maxNum += 1;
          amount = amount + parseFloat(v.price * v.num);
          vipAmount = vipAmount + parseFloat(v.vip_price * v.num);
        }

        if (v.state == 3) {
          outNum += 1;
        }
      }

      discountsAmount = amount.toFixed(2) - vipAmount.toFixed(2);
      amount = amount.toFixed(2);
      vipAmount = vipAmount.toFixed(2);
      discountsAmount = discountsAmount.toFixed(2);

      if (cartGoods.length == maxNum + outNum) {
        isAllRadio = true;
      }

      that.setData({
        maxNum: maxNum,
        amount: amount,
        vipAmount: vipAmount,
        discountsAmount: discountsAmount,
        isAllRadio: isAllRadio
      });
    },

    toPlaceOrder() {
      let that = this;

      if (that.maxNum > 0) {
        uni.wen.toUrl(6, '/pagesA/shop/place-order/place-order', null);
      }
    },

    allCart(e) {
      let that = this;
      let isAllRadio = that.isAllRadio;

      if (isAllRadio) {
        isAllRadio = 0;
      } else {
        isAllRadio = 1;
      }

      that.getShopAllCheckCartGoods(isAllRadio);
    },

    radioGoods(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      let pid = e.currentTarget.dataset.pid;
      let check = e.currentTarget.dataset.check;

      if (check) {
        check = 0;
      } else {
        check = 1;
      }

      that.cartGoods.forEach(function (v, i) {
        if (i == index) {
          v.is_check = !v.is_check;
        }
      });
      that.setData({
        cartGoods: that.cartGoods
      });
      that.getShopCheckCartGoods(pid, check);
    },

    onClickDialog(e) {
      let that = this;
      let idx = e.currentTarget.dataset.idx;
      let cid = e.currentTarget.dataset.cid
      that.setData({
        showDialog: true,
        idx: idx,
        cid: cid,
        pid: that.cartGoods[idx].product_id
      });
    },

    deleteGoods(cid, idx) {
      let that = this;
      uni.showModal({
        title: '提示',
        content: '是否确认要删除商品？',

        success(res) {
          if (res.confirm) {
            let cartGoods = that.cartGoods;
            cartGoods.splice(idx, 1);
            that.setData({
              showDialog: false,
              cid: cid,
              cartGoods: cartGoods
            });
            that.getShopDelCartGoods();
          }
        }
      });
    },

    shareGoodsClick() {
      let that = this;
      let postsGoods = [];
      let goods = {};
      let idx = that.idx;
      goods.id = that.cartGoods[idx].goods_id;
      goods.name = that.cartGoods[idx].goods_name;
      goods.pic = that.cartGoods[idx].goods_pic;
      that.setData({
        showDialog: false
      });
      postsGoods.push(goods);
      uni.setStorageSync('postsGoods', postsGoods);
      uni.wen.toUrl(6, '/pages/creat/index/creat', null);
    },

    onClick() {
      this.setData({
        showDialog: false
      });
    },

    bindPickerChange: function (e) {
      let that = this;
      let idx = e.currentTarget.dataset.idx;
      let pid = e.currentTarget.dataset.pid;
      let value = e.detail.value; // 索引
      if (value > 0) {
        that.getShopSaveCartNum(pid, value, idx, value);
      } else {
        uni.showToast({
          title: '请选择数量大于0',
          icon: 'none'
        })
      }
    },

    touchstart: function (e) {
      //开始触摸时 重置所有删除
      this.cartGoods.forEach(function (v, i) {
        if (v.isTouchMove) {
          //只操作为true的
          v.isTouchMove = false;
        }
      });
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        cartGoods: this.cartGoods
      });
    },

    //滑动事件处理
    touchmove: function (e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      var //当前索引
          startX = that.startX;
      var //开始X坐标
          startY = that.startY;
      var //开始Y坐标
          touchMoveX = e.changedTouches[0].clientX;
      var //滑动变化坐标
          touchMoveY = e.changedTouches[0].clientY;
      var //滑动变化坐标
          //获取滑动角度
          angle = that.angle(
              {
                X: startX,
                Y: startY
              },
              {
                X: touchMoveX,
                Y: touchMoveY
              }
          );
      that.cartGoods.forEach(function (v, i) {
        v.isTouchMove = false; //滑动超过30度角 return

        if (Math.abs(angle) > 30) {
          return;
        }

        if (i == index) {
          if (touchMoveX > startX) {
            //右滑
            v.isTouchMove = false;
          } else {
            //左滑
            v.isTouchMove = true;
          }
        }
      }); //更新数据

      that.setData({
        cartGoods: that.cartGoods
      });
    },

    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function (start, end) {
      var _X = end.X - start.X;

      var _Y = end.Y - start.Y; //返回角度 /Math.atan()返回数字的反正切值

      return (360 * Math.atan(_Y / _X)) / (2 * Math.PI);
    }
  }
};
</script>
<style lang="scss">
@import './cart.scss';
</style>
