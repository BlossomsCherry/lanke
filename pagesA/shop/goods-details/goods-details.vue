<template>
  <view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body">
      <navBar :iconTheme="iconTheme" :background="global__theme__ == 'black' ? 'rgba(25, 25, 30, ' + navbarTrans + ')' : 'rgba(255, 255, 255, ' + navbarTrans + ')'"
              :color="'rgba(' + color + ', ' + navbarTrans + ')'" :title="goodsinfo.name">
        <view slot="left" :class="'back ' + (iconTheme == 'white' ? '' : 'b')">
		  <i class="mini-icon mini-zuojiantou" @tap.stop.prevent="toSliderUrl(-2, 0)" :style="'color: '+iconTheme+';'"></i>
          <view :class="'line ' + (iconTheme == 'white' ? '' : 'lb')"></view>
		  <i class="mini-icon mini-shangpin1"  @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/cart/cart')" :style="'color: '+iconTheme+';'" /></i>
        </view>
        <!-- #ifdef APP || H5 -->
        <view slot="right" class="lxy-nav-bar__logo"></view>
        <!-- #endif -->
      </navBar>

      <view class="container">
        <view class="carousel">
          <swiper class="swiper" @change="swiperChange" circular :autoplay="true" interval="3000">
            <block v-for="(item, index) in goodsinfo.pic" :key="index">
              <swiper-item>
                <image @tap="onPreviewPics" :data-list="goodsinfo.pic" :data-src="item" mode="aspectFill" class="swiper-item" :src="item"></image>
              </swiper-item>
            </block>
          </swiper>
          <view class="doct">{{ swiperCurrent }}/{{ goodsinfo.pic.length }}</view>
        </view>

        <view class="goods-container">
          <view class="title-box">
            <view class="left-box">
              <view class="title">{{ goodsinfo.name }}</view>
              <view class="introduce">{{ goodsinfo.intro || '' }}</view>
            </view>
            <i @tap.stop.prevent="onClickShare" class="share-btn mini-icon mini-fenxiang1"></i>
          </view>
		  <block v-if="goodsinfo.credit_type == 1">
			  <view class="price vip_price">
			    ￥{{ goodsinfo.vip_price }}
			    <view class="price-text">会员价</view>
			  </view>
			  <view class="original-box">
			    <view class="original-price">
			      ¥
			      <text class="_text">{{ goodsinfo.price }}</text>
			    </view>
			    <view class="buys" v-if="goodsinfo.buys > 0">{{ goodsinfo.buys }}人购买</view>
			  </view>
		  </block>
		  <block v-else-if="goodsinfo.credit_type == 0">
			  <view class="price vip_price gold">
				  <view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
			    {{ goodsinfo.vip_price }}
			    <view class="price-text">会员价</view>
			  </view>
			  <view class="original-box gold" v-if="goodsinfo.vip_price < goodsinfo.price">
			    <view class="original-price">
					<view class="gold-icon flex-column"><i class="mini-icon mini-Gold_coin_01"></i></view>
			      <text class="_text">{{ goodsinfo.price }}</text>
			    </view>
			    <view class="buys" v-if="goodsinfo.buys > 0">{{ goodsinfo.buys }}人兑换</view>
			  </view>
		  </block>
          <view class="label">
            <view class="label-box" v-if=" goodsinfo.can_purchase_times > 0 ">限购{{ goodsinfo.can_purchase_times }}次</view>
			<view class="label-box" v-if=" goodsinfo.type == 5 ">核销</view>
            <view class="label-box" v-for="(item, index) in goodsinfo.tag" :key="item.id">{{ item }}</view>
          </view>
          <view class="list" @tap.stop.prevent="toDetails" v-if="!goodsinfo.url">
            <view class="list-left">
              <view class="name">选择</view>
              <view class="cont">{{ paraminfo.value ? '已选：' + paraminfo.value : '请选择规格' }}</view>
            </view>
            <view class="arrow"></view>
          </view>
		  
		  <view class="list" v-if="goodsinfo.contact && goodsinfo.contact.address_name">
		    <view class="list-left">
		      <view class="name">到店</view>
		      <view class="cont">{{ goodsinfo.contact.address_name }}
			  <view class="cont2">{{ goodsinfo.contact.address_detail }}</view>
			  </view>
		    </view>
		    <view class="flex-row icons">
				<i class="mini-icon2 mini-shouhuodizhi" @tap.stop.prevent="toSliderUrl(30, (goodsinfo.contact.longitude+'|'+goodsinfo.contact.latitude+'|'+goodsinfo.contact.address_detail + '|8') )" v-if="goodsinfo.contact && goodsinfo.contact.id > 0"></i>
				<view style="width: 30rpx;"></view>
				<i class="mini-icon mini-dianhua" @tap.stop.prevent="toSliderUrl(22, goodsinfo.contact.phone)"></i>
			</view>
		  </view>
		  <view class="list" v-if="goodsinfo.service_time_tip" @tap.stop.prevent="shutPopupTimeShow">
		    <view class="list-left">
		      <view class="name">时间</view>
		      <view class="cont">{{ goodsinfo.service_time_tip }}</view>
		    </view>
		    <view class="arrow"></view>
		  </view>
		  
          <view class="list" @tap.stop.prevent="toSecurity">
            <view class="list-left">
              <view class="name">服务</view>
              <view class="cont">{{ serviceTxt }}</view>
            </view>
            <view class="arrow"></view>
          </view>
          <view class="list" @tap.stop.prevent="toSliderUrl(8, goodsinfo.question_id)" v-if="goodsinfo.question_id > 0">
            <view class="list-left">
              <view class="name">帮助</view>
              <view class="cont">点击查看</view>
            </view>
            <view class="arrow"></view>
          </view>
		  
		  <block v-if="goodsinfo.guests && goodsinfo.guests.length > 0">
				<view class="table">
				  <text class="_text">嘉宾展示</text>
				  <view class="arrow"></view>
				</view>
				
				<view class="guests-wrap">
					<scroll-view class="_scroll_view" :show-scrollbar="false" :scroll-x="true" :enable-flex="true">
						<view class="guests-box">
							<view class="guest-item" v-for="(guest, guest_index) in goodsinfo.guests" :key="guest_index" @tap.stop.prevent="toSliderUrl(4, guest.id)">
								<view class="avatar-wrap">
									<image class="_image" :src="guest.user_avatar"></image>
									<i class="avatar-authentication-icon mini-icon mini-verify" v-if="guest.is_authentication == 1"></i>
								</view>
								<view class="name u-line-1">{{ guest.user_name }}</view>
							</view>
						</view>
					</scroll-view>
				</view>
		  </block>
		  
		  
          <view class="table" @tap.stop.prevent="toGoodsPosts">
            <text class="_text">相关笔记</text>
            <view class="arrow"></view>
          </view>
          <view class="posts">
            <ls-skeleton :loading="topicload">
              <block v-if="goodsComment.length > 0">
                <view class="posts-wrap">
                  <scroll-view :show-scrollbar="false" :scroll-x="true" :enable-flex="true">
                    <view class="goodsComment-wrap">
                      <view class="goodsComment-item" v-for="(goodsCommentItem, gc_index) in goodsComment" :key="gc_index" @tap.stop.prevent="toSliderUrl(1, goodsCommentItem.id)">
                        <view class="content">{{ goodsCommentItem.content }}</view>
                        <view class="bottom">
                          <view class="left">
                            <image class="avatar" mode="aspectFill" :src="goodsCommentItem.author.user_avatar"></image>
                            <view class="name">{{ goodsCommentItem.author.user_name }}</view>
                          </view>
                          <view class="right">
                            <block v-if="goodsCommentItem.imgs.length > 0">
                              <view class="right-img-view" v-for="(img_item, img_index) in goodsCommentItem.imgs" :key="img_index" v-if="img_index < 3">
                                <image class="right-img" :src="img_item" mode="aspectFill"></image>
                                <view class="img_res" v-if="img_index == 2 && goodsCommentItem.img_res > 0">+{{ goodsCommentItem.img_res }}</view>
                              </view>
                            </block>
                          </view>
                        </view>
                      </view>
                    </view>
                  </scroll-view>
                </view>
              </block>
              <view v-else class="empty-box">
                <u-empty text="暂无晒单" width="300" height="300" text-size="28" />
              </view>
            </ls-skeleton>
          </view>
		  
		  <block v-if="goodsinfo.shop && goodsinfo.shop.id > 0">
			  <view class="seller-box">
				<view class="info" @tap.sop.prevent="toSliderUrl(32, goodsinfo.shop.id)">
					<view class="left">
						<view class="logo">
							<image :src="goodsinfo.shop.shop_logo" class="_image"></image>
						</view>
						<view class="name">
							<view class="name_">{{ goodsinfo.shop.shop_name }}</view>
							<view class="score">卖家口碑 {{ goodsinfo.shop.shop_credit_score }}</view>
						</view>
					</view>
					<view class="right">
						<view class="enter">进店</view>
					</view>
				</view>
			  </view>
		  </block>
		  
          <view class="details">
            <view class="details-title">商品详情</view>
            <view style="width: 750rpx">
              <mp-html :content="goodsinfo.content" class="goods-detail-html" :scene="750"/>
            </view>
          </view>
        </view>

        <view class="footer">
          <view class="inner">
			<block v-if="goodsinfo.user_id > 0">
				<button @click="toServicer(18, goodsinfo.user_id)" class="footer-icon">
				  <i class="mini-icon mini-kefufenxiermaikefu"></i>
				  <text class="_text">客服</text>
				</button>
			</block>
			<block v-else>
				<!-- #ifdef MP -->
				<button open-type="contact" class="footer-icon">
				  <i class="mini-icon mini-kefufenxiermaikefu"></i>
				  <text class="_text">客服</text>
				</button>
				<!-- #endif -->
				<!-- #ifdef APP || H5 -->
				<button @click="toServicer(config_page_shop_servicer.servicer_target_type, config_page_shop_servicer.servicer_target_id)" class="footer-icon">
				  <i class="mini-icon mini-kefufenxiermaikefu"></i>
				  <text class="_text">客服</text>
				</button>
				<!-- #endif -->
			</block>
            
			<block v-if="goodsinfo.state === 0">
				<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/order/order')" class="footer-icon">
				  <i class="mini-icon2 mini-wodedingdan"></i>
				  <text class="_text">订单</text>
				</view>
				<view class="footer-btn-wrap">
				  <view class="footer-btn-badge state_0" style="width: 520rpx;">
				    <view class="inner_">商品已下架</view>
				  </view>
				</view>
			</block>
			<block v-else>
				<block v-if="goodsinfo.credit_type === 0">
					<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/order/order')" class="footer-icon">
					  <i class="mini-icon2 mini-wodedingdan"></i>
					  <text class="_text">订单</text>
					</view>
					<!-- 金币商品 -->
					<block v-if="goodsinfo.can_purchase_times == 0 || goodsinfo.user_purchase < goodsinfo.can_purchase_times">
					  <view class="footer-btn-wrap gold">
					    <view class="footer-btn-badge buy" @tap.stop.prevent="addCart(0, 1)" data-type="0">
					      <view class="inner_">立即兑换</view>
					    </view>
					  </view>
					</block>
					<block v-else-if="goodsinfo.user_purchase >= goodsinfo.can_purchase_times">
					  <view class="footer-btn-wrap quota">
					    <view class="footer-btn-badge">
					      <view class="inner_">限购{{ goodsinfo.can_purchase_times || '' }}次</view>
					    </view>
					    <view class="footer-btn-badge buy" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/order/order')">
					      <view class="inner_">订单中心</view>
					    </view>
					  </view>
					</block>
					<block v-else>
					  <view class="footer-btn-wrap quota gold">
					    <view class="footer-btn-badge buy" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/order/order')">
					      <view class="inner_"></view>
					    </view>
					  </view>
					</block>
					
				</block>
				<block v-else-if="goodsinfo.credit_type === 1">
					
					<block>
						<block v-if="goodsinfo.type == 5">
							<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/order/order')" class="footer-icon">
							  <i class="mini-icon2 mini-wodedingdan"></i>
							  <text class="_text">订单</text>
							</view>
						</block>
						<block v-else>
							<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/cart/cart')" class="footer-icon">
							  <i class="mini-icon mini-shangpin1"></i>
							  <text class="_text">购物袋</text>
							  <view class="bags-badge" v-if="cartCount > 0">{{ cartCount > 99 ? '99+' : cartCount }}</view>
							</view>
						</block>
					</block>
					
					<block v-if="goodsinfo.type == 1">
					  <view class="footer-btn-wrap" data-type="0" :data-url="goodsinfo.url">
					    <view class="footer-btn-wrap">
					      <view class="footer-btn-badge" @tap.stop.prevent="copyShortLink(goodsinfo.url_word)">
					        <view class="inner_">复制口令</view>
					      </view>
					      <view class="footer-btn-badge buy" @tap.stop.prevent="goodsDirectTo(goodsinfo.url)">
					        <view class="inner_">
					          <i :class="'platform_icon mini-icon' + ' ' + goodsinfo.platform_icon"></i>去购买</view>
					      </view>
					    </view>
					  </view>
					</block>
					<block v-else-if="goodsinfo.type == 5">
						<view class="footer-btn-wrap scan">
						  <view class="footer-btn-badge buy" @tap.stop.prevent="addCart(0, 1)" data-type="0">
						    <view class="inner_">立即购买</view>
						  </view>
						</view>
					</block>
					<block v-else>
					  <block v-if="goodsinfo.can_purchase_times == 0 || goodsinfo.user_purchase < goodsinfo.can_purchase_times">
					    <view class="footer-btn-wrap">
					      <view class="footer-btn-badge" @tap.stop.prevent="addCart(0, 0)" data-type="0">
					        <view class="inner_">加入购物袋</view>
					      </view>
					      <view class="footer-btn-badge buy" @tap.stop.prevent="addCart(0, 1)" data-type="0">
					        <view class="inner_">立即购买</view>
					      </view>
					    </view>
					  </block>
					  <block v-else-if="goodsinfo.user_purchase >= goodsinfo.can_purchase_times">
					    <view class="footer-btn-wrap quota">
					      <view class="footer-btn-badge">
					        <view class="inner_">限购{{ goodsinfo.can_purchase_times || '' }}次</view>
					      </view>
					      <view class="footer-btn-badge buy" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/order/order')">
					        <view class="inner_">订单中心</view>
					      </view>
					    </view>
					  </block>
					  <block v-else>
					    <view class="footer-btn-wrap quota">
					      <view class="footer-btn-badge">
					        <view class="inner_"></view>
					      </view>
					      <view class="footer-btn-badge buy" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/order/order')">
					        <view class="inner_"></view>
					      </view>
					    </view>
					  </block>
					</block>
					
				</block>
				<block v-else>
					<view class="footer-btn-wrap quota">
					  <view class="footer-btn-badge">
					    <view class="inner_"></view>
					  </view>
					  <view class="footer-btn-badge buy" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/order/order')">
					    <view class="inner_"></view>
					  </view>
					</view>
				</block>
			</block>
          </view>
        </view>
		<view class="bg-padding"></view>
      </view>

      <u-popup :show="detailsShow" @close="toDetailsClose" mode="bottom">
        <view class="popup-box">
          <view class="popup-details" :style="'height: ' + (screenLiHeight - 360) + 'px;'">
			<i class="mini-icon mini-chacha close" @tap="toDetailsClose"></i>
            <view class="details-top">
              <image
                  class="details-img"
                  @tap.stop.prevent="onPreviewImage"
                  :data-src="paraminfo.pic"
                  mode="aspectFill"
                  :src="paraminfo.pic ? paraminfo.pic : goodsinfo.pic[0]"
              ></image>
              <view class="details-left">
                <view class="goods-name">{{ goodsinfo.name }}</view>
                <view class="goods-doc">{{ paraminfo.value ? paraminfo.value : '请选择规格' }}</view>
				<block v-if="goodsinfo.credit_type == 1">
					<view class="goods-price">
					  <view class="vip-price">￥{{ paraminfo.vip_price ? paraminfo.vip_price : goodsinfo.vip_price }}</view>
					  <view class="price-txt">¥{{ paraminfo.price ? paraminfo.price : goodsinfo.price }}</view>
					</view>
				</block>
				<block v-else-if="goodsinfo.credit_type == 0">
					<view class="goods-price">
						<view class="gold-icon flex-column"><i class="gold-color mini-icon mini-Gold_coin_01"></i></view>
						<view class="vip-price">{{ paraminfo.vip_price ? paraminfo.vip_price : goodsinfo.vip_price }}</view>
						<view class="price-txt">
							  <view class="gold-icon flex-column"><i class="mini-icon mini-Gold_coin_01"></i></view>
							  {{ paraminfo.price ? paraminfo.price : goodsinfo.price }}
					   </view>
					</view>
				</block>
                
              </view>
            </view>
            <scroll-view :show-scrollbar="false" :scroll-y="true" :style="'height: ' + (screenLiHeight - 465) + 'px;'">
              <view class="details-box" v-for="(item, idx) in param" :key="item.id">
                <view class="details-name">{{ item.name }}</view>

                <view class="details-doc">
                  <view
                      :class="'details-doc-box ' + (items.state ? 'on' : '')"
                      @tap="paramTap"
                      :data-idx="idx"
                      :data-idxs="idxs"
                      :data-value="items.value"
                      v-for="(items, idxs) in item.value"
                      :key="items.ids"
                  >{{ items.value }}</view>
                </view>

              </view>
            </scroll-view>
          </view>
          <view class="details-number">
            <view class="num">数量</view>
            <block v-if="paraminfo.stock > 0">
              <u-number-box v-model="num" :min="1" :max="paraminfo.stock" :step="1"></u-number-box>
            </block>
            <view v-else class="null-stock">暂无库存</view>
          </view>
          <block v-if="goodsinfo.can_purchase_times == 0 || goodsinfo.user_purchase < goodsinfo.can_purchase_times">
            <view v-if="selectAction == 'buy' || selectAction == 'gold' " @tap.stop.prevent="addCart(1, 1)" class="details-btn">{{ goodsinfo.credit_type == 1 ? '立即购买' : '立即兑换' }}</view>
            <view v-else @tap.stop.prevent="addCart(1, 0)" class="details-btn">加入购物袋</view>
          </block>
          <block v-else>
            <view class="details-btn quota" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/order/order')">
              限购{{ goodsinfo.can_purchase_times || '' }}次
            </view>
          </block>
        </view>
      </u-popup>

      <u-popup :show="securityShow" @close="toSecurityClose" mode="bottom">
        <view class="popup-box">
          <view class="popup-title">
            服务
			<i class="mini-icon mini-shanchu2 close" @tap="toSecurityClose"></i>
          </view>
          <scroll-view :show-scrollbar="false" :scroll-y="true" style="height: 750rpx">
            <view class="popup-cont" v-for="(item, index) in goodsinfo.service" :key="item.id">
              <view class="name">{{ item.name }}</view>
              <text class="_text">{{ item.intro }}</text>
            </view>
          </scroll-view>
        </view>
      </u-popup>
	  
	  
	  <u-popup :show="popupTimeShow" @close="shutPopupTimeShow" mode="bottom">
	    <view class="popup-box">
	      <view class="popup-title">
	        时间
	  			<i class="mini-icon mini-shanchu2 close" @tap.stop.prevent="shutPopupTimeShow"></i>
	      </view>
	      <scroll-view :show-scrollbar="false" :scroll-y="true" style="height: 750rpx">
	        <view class="popup-cont">
	          <view class="name">店铺服务时间</view>
	          <text class="_text">{{ goodsinfo.service_time_tip }}</text>
	        </view>
	      </scroll-view>
	    </view>
	  </u-popup>

      <u-popup :show="directToImgShow" @close="goodsDirectTo(goodsinfo.url)">
        <image @tap="goodsDirectTo(goodsinfo.url)" class="goodsDirectToImg" src="@/pagesA/static/image/copyGoodsLink.png" mode="aspectFit"></image>
      </u-popup>

      <view :class="showShare ? 'dialog_show' : ''">
        <view @tap="onClickShare" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
        <view class="dialog_container">
          <view class="dialog_conent">
            <view class="dialog_box">
              <!-- #ifdef MP -->
              <button open-type="share" class="dialog_btn">
                <i class="mini-icon mini-weixin1"></i>
                微信好友
              </button>
              <!-- #endif -->
              <!-- #ifdef APP -->
              <button class="dialog_btn" @tap="shareWxGooditem()">
                <i class="mini-icon mini-weixin1"></i>
                微信好友
              </button>
              <!-- #endif -->
              <button class="dialog_btn" @tap="toGoodsitemPoster()">
                <i class="mini-icon mini-haibao"></i>商品海报
              </button>
              <view @tap.stop.prevent="shareGoodsClick" class="dialog_btn">
                <i class="mini-icon mini-qianbipencil86"></i>发帖推荐
              </view>
            </view>
            <view @tap="onClickShare" class="cancel-btn">取消</view>
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
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';

import SingleItem from "@/pages/sticky/components/single-item";
import UserInfo from "@/pages/sticky/components/user-info";
import PostContent from "@/pages/sticky/components/post-content";

const shop = require('@/mixins/shop');

const mixins = require('@/mixins/common');
const user = require('@/mixins/user');
var options = {};

shop(options);
mixins(options);
user(options);
export default {
  mixins: [{ methods: options }],

  components: {
	myToast,navBar,hoverBall,lsSkeleton,mpHtml,

    SingleItem,
    UserInfo,
    PostContent
  },
  computed: {
    screenLiHeight: {
      get() {
        let that = this;
        return that.$store.state.screenLiHeight;
      },
      set(v) {}
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
	config_page_shop_servicer:{
		get(){
			let that = this;
			if(that.$store.state.config.page.shop && that.$store.state.config.page.shop.servicer){
				return that.$store.state.config.page.shop.servicer;
			}
			return {
				"servicer_target_type": 0,
				"servicer_target_id": ""
			}
		},
		set(v){}
	},
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 12,
      selectAction: 'buy',
      navbarTrans: 0,
      color: '0,0,0',
      iconTheme: 'white',
      id: '',

      goodsinfo: {
        name: '',
        pic: [],
        intro: '',
        vip_price: '',
        price: '',
        buys: 0,
        tag: [],
        url: '',
        content: '',
        platform_icon: '',
        service: []
      },

      swiperCurrent: 1,
      serviceTxt: '',
      param: [],
      product: [],

      paraminfo: {
        id: 0,
        vip_price: '',
        price: '',
        pic: '',
        value: '',
        stock: 1
      },

      num: 1,
      securityShow: false,
	  popupTimeShow: false,
	  
      detailsShow: false,
      showShare: false,
      goodsComment: [],
      cartCount: 0,
      directToImgShow: false,
      topicload: false,

      popupshow: '',

      idxs: [],

      // app商品分享
      dtk_id: 0,
      tk_goodsid: 0,
      tk_platform: 0,
    };
  },
  onPageScroll: function onPageScroll(e) {
    let that = this;
    var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;

    if (trans > 1 && that.navbarTrans > 1) {
      return false;
    }

    var frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff';
    var backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000';
    var iconTheme = that.iconTheme;
    
    
    if (trans <= 0) {
    	frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff';
    	backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000';
    	iconTheme = that.$store.state.theme == 'black' ? 'black' : 'white';
    
    } else if (trans >= 0.4) {
    	frontColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000';
    	backgroundColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff';
    	iconTheme = that.$store.state.theme == 'black' ? 'white' : 'black';
    }

    that.setData({
      navbarTrans: trans,
      iconTheme: iconTheme,
      color: that.$store.state.theme == 'black' ? '255,255,255' : '0,0,0',
    });
	uni.setNavigationBarColor({
		frontColor: frontColor,
		backgroundColor: backgroundColor,
		animation: {
			duration: 400,
			timingFunc: 'easeIn',
		}
	});
  },
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);

    // 处理小程序码的分享场景
    var scene = decodeURIComponent(options.scene);
    if (scene && scene != 'undefined') {
      let query = {};
      if (scene.indexOf('&') !== -1) {
        let scene_arr = scene.split('&');
        scene_arr.map((item) => {
          let queryData = item.split('=')
          query[queryData[0]] = queryData[1]
        })
      } else {
        let queryData = scene.split('=')
        query[queryData[0]] = queryData[1]
      }
      if (query.from_user && query.from_user.length > 0) {
        uni.setStorageSync('form_user', query.from_user);
        uni.$store.commit('updateFormUser', query.from_user);
      }
      that.id = query.id;
      that.fph = true;
    } else {
      that.setData({
        id: options.id,
        dtk_id: options.dtk_id,
        tk_goodsid: options.tk_goodsid,
        tk_platform: options.tk_platform
      });
    }

    that.getShopGoodsDetails();
    that.getShopGoodsPosts();
    if (uni.$store.state.token) {
      that.userCartCount();
    }
  },
  onShow: function () {
    let that = this;
    that.updateScene(12, 0);
  },
  onBackPress(e) {
    if (this.detailsShow) {
      this.detailsShow = false;
      return true;
    }else if (this.securityShow) {
      this.securityShow = false;
      return true;
    } else if (this.fph) {
      uni.reLaunch({
        url: '/pages/tabbar/index/index'
      });
      return true;
    }
  },
  onShareAppMessage: function (res) {
    let that = this;
    let share_title = that.$store.state.config.share.format.app_share_good;
    share_title = share_title.replace('[good_name]', this.goodsinfo.name);
    return {
      title: share_title,
      path: '/pagesA/shop/goods-details/goods-details?id=' + this.goodsinfo.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: this.goodsinfo.pic[0] || that.$store.state.config.img.default_share
    };
  },
  onShareTimeline: function (res) {
    let that = this;
    let share_title = that.$store.state.config.share.format.app_share_good;
    share_title = share_title.replace('[good_name]', this.goodsinfo.name);
    return {
      title: share_title,
      query: 'id=' + that.goodsinfo.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: uni.wen.util.removeStyles(that.goodsinfo.pic[0] || that.$store.state.config.img.default_share) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
    };
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
	shutPopupTimeShow(){
		this.popupTimeShow = !this.popupTimeShow;
	},
	toServicer(target_type, target_id){
		let that = this;
		if(target_type == 18){
			if(target_id == that.myUserInfo.id){
				uni.wen.toUrl(18, target_id, that);
				return false;
			}
			uni.loading(true);
			uni.wen.util.request(
        uni.wen.api.ApiRootUrl + 'massages/addChat',
			    {
			        oid: target_id,
					shop_good_id: that.goodsinfo.id,
			        chat_content: '',
					chat_audio_url: '',
					chat_audio_length: 0,
			        chat_image: ''
			    },
			    'POST'
			).then(function (res) {
				uni.loading(false);
			    if (res.status) {
					uni.wen.toUrl(18, target_id, that);
			    } else {
			        uni.showToast({
			            title: res.message,
			            icon: 'none',
			            duration: 1500
			        });
			    }
			});
		}else{
			uni.wen.toUrl(target_type, target_id, that);
		}
	},
    toBack() {
      uni.wen.toUrl(-2, 0, null);
    },
    toGoodsitemPoster() {
      this.showShare = false;
      uni.wen.toUrl(6, '/pagesB/playbill/goodsPoster?id=' + this.id, null);
    },
    swiperChange: function (e) {
      this.setData({
        swiperCurrent: e.detail.current + 1
      });
    },

    toDetails(e) {
      this.setData({
        detailsShow: true
      });
      console.log('==============', this.detailsShow);
    },

    toDetailsClose(e) {
      this.setData({
        detailsShow: false
      });
    },

    toSecurity() {
      this.setData({
        securityShow: true
      });
    },

    toSecurityClose() {
      this.setData({
        securityShow: false
      });
    },
    copyShortLink(word) {
      if(word){
		  uni.wen.util.setClipboardData(word, '口令已复制');
	  }else{
		  uni.showToast({
			  title: '该商品没有口令',
			  icon: 'none'
		  })
	  }
    },
    goodsDirectTo(url) {
      // #ifdef MP
      this.setData({
        directToImgShow: !this.directToImgShow
      });
      uni.setClipboardData({
        data: url,
        success(res) {
          uni.hideToast();
        }
      });
      // #endif
      // #ifdef APP
      plus.runtime.openWeb(url);
      // #endif
      // #ifdef H5
      window.open(url);
      // #endif
    },
    addCart(position, action) {
      let that = this;
      let paraminfo = that.paraminfo;
      if (paraminfo.stock == 0) {
        uni.showToast({
          title: '该规格暂时没有库存啦！',
          icon: 'none',
          duration: 1500
        });
      } else {
        if (position == 0) {
          that.setData({
            detailsShow: true,
            selectAction: action == 0 ? 'cart' : 'buy'
          });
        } else {
          if (paraminfo.id) {
            if (action == 0) {
              that.selectAction = 'cart';
              that.getShopAddCart();
            } else {
				if(that.goodsinfo.credit_type == 1){
					// 立即购买
					that.selectAction = 'buy';
					that.getShopAddCart();
				}else{
					that.selectAction = 'gold';
					that.getShopAddCart();
				}
            }
          } else {
            uni.showToast({
              title: '请选择规格！',
              icon: 'none',
              duration: 1500
            });
          }
        }
      }
    },

    toGoodsPosts() {
      uni.wen.toUrl(6, '/pagesA/shop/goods-details/posts?id=' + this.goodsinfo.id, null);
    },

    paramTap(e) {
      let that = this;
      let idx = e.target.dataset.idx;
      let idxs = e.target.dataset.idxs;
      let value = e.target.dataset.value;
      let param = that.param;
      let product = that.product;
      let have = true;

      for (let i in product) {
        if (product[i].indx == idx) {
          product[i].value = value;
          have = false;
        }
      }

      if (have) {
        let args = {};
        args.indx = idx;
        args.value = value;
        product.push(args);
      }

      for (let v in param[idx].value) {
        if (v == idxs) {
          param[idx].value[v].state = true;
        } else {
          param[idx].value[v].state = false;
        }
      }

      that.setData({
        param: param,
        product: product
      });
      let arr = [];

      for (let i in product) {
        arr.push(product[i].value);
      }

      let result = uni.wen.util.getNumbers(arr, arr.length, false);
      let gproduct = that.goodsinfo.product;

      for (let i in gproduct) {
        for (let j in result) {
          if (gproduct[i].param_value == result[j]) {
            let args = {};
            let paraminfo = {};

            if (gproduct[i].pic != '' && gproduct[i].pic != null) {
              paraminfo.pic = gproduct[i].pic;
            }

            paraminfo.id = gproduct[i].id;
            paraminfo.price = gproduct[i].price;
            paraminfo.vip_price = gproduct[i].vip_price;
            paraminfo.value = gproduct[i].param_value;
            paraminfo.stock = gproduct[i].stock;
            args.paraminfo = paraminfo;
            that.setData(args);
          }
        }
      }
    },

    shareGoodsClick() {
      let that = this;
      let postsGoods = [];
      let goods = {};
      goods.id = that.goodsinfo.id;
      goods.name = that.goodsinfo.name;
      goods.pic = that.goodsinfo.pic[0];
      postsGoods.push(goods);
      uni.setStorageSync('postsGoods', postsGoods);
      uni.wen.toUrl(6, '/pages/creat/index/creat', null);
    },

    shareWxGooditem() {
      let that = this;
      if (that.$store.state.config.app.wechat.mini.meta_appid) {
        let shareGoodObj = {
          'provider': 'weixin',
          'type': 5,
          'title': that.goodsinfo.name,
          'scene': 'WXSceneSession',
          'imageUrl': this.goodsinfo.pic[0],
		  'href': that.$store.state.config.h5.home + '/#/pagesA/shop/goods-details/goods-details?id=' + that.id + '&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
          'miniProgram': {
            'id': that.$store.state.config.app.wechat.mini.meta_appid,
            'path': '/pagesA/shop/goods-details/goods-details?id=' + that.id + '&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
            'type': 0,
            'webUrl': that.$store.state.config.h5.home + '/#/pagesA/shop/goods-details/goods-details?id=' + that.id + '&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
          },
          success: function (res) {
            console.log("success:" + JSON.stringify(res));
          },
          fail: function (err) {
            console.log("fail:" + JSON.stringify(err));
          }
        };

        uni.share(shareGoodObj);
      } else {
        uni.showToast({
          title: '未知小程序appid',
          icon: 'none',
          duration: 1500
        });
      }
      that.showShare = false;
    },

    touchmove() {console.log("touchmove no defined")}
  }
};
</script>
<style lang="scss">
@import './goods-details.scss';

.footer-btn {
  .platform_icon.mini-icon {
    font-size: 50rpx;
    font-weight: 100;
    margin-right: 10rpx;
  }
}

</style>
