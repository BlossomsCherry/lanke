<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
    <view style="height:100%" class="mini-page-body">
		<navBar :back="true" :home="fph" title="选择商品" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		</navBar>
		<u-sticky offset-top="0">
			<view class="search-box">
			    <view class="inner">
					<image class="icon" src="/static/image/search-line.png"></image>
					<input
					    @confirm="onSearchConfirm"
					    @input="onSearchConfirm"
					    class="input"
					    confirmType="search"
					    name="keyword"
					    placeholder="Search"
					    placeholderClass="placeholder"
					    type="text"
					    :value="keyword"
					/>
					<i class="mini-icon mini-chacha del" v-if="keyword" @tap="delKeyword"></i>
				</view>
			</view>
			<view class="nav">
			    <view @tap="switchRightTab" :class="'nav_items ' + (curIdx == item.id ? 'active' : '')" :data-id="item.id" v-for="(item, index) in cats" :key="index">
			        {{ item.name }}
			    </view>
			    <view style="width: 15px; flex-shrink: 0; height: 1px"></view>
			</view>
		</u-sticky>

		<view class="body">
			<!-- <ls-skeleton :loading="true" :skeleton="boxGoodsSelectSkeleton" :animate="true"> -->
		        <view style="padding-bottom: 30px">
		            <view class="shop-box" @tap.stop.prevent="toSliderUrl(3, item.id)" v-for="(item, index) in goodsList" :key="item.id">
		                <swiper :autoplay="true" :circular="true" interval="4000" :indicator-dots="true" easing-function="easeOutCubic" class="swiper">
		                    <swiper-item v-for="(img, index1) in item.pic" :key="img.id">
		                        <image class="shop-box-cover" mode="aspectFill" :src="img" />
		                    </swiper-item>
		                </swiper>

		                <view class="shop-info">
		                    <view class="shop-info-tag">
		                        <text class="tag" v-for="(it, index1) in item.tag" :key="it.id">{{ it }}</text>
		                    </view>
		                    <view class="shop-info-title">{{ item.name }}</view>
		                    <view class="shop-info-duce" v-if="item.intro">{{ item.intro }}</view>
		                    <view class="info-bur">
								
								<block v-if="item.credit_type == 1">
									<view class="shop-info-price-box">
										<view class="price">
											<view>
												￥<u-count-to
													:endVal="item.vip_price"
													:decimals="2"
													:bold="true"
													:color="global__theme__ == 'black' ? '#dadadb' : '#333333'"
													fontSize="32"
												></u-count-to>
											</view>
											<view class="price-text">会员价</view>
										</view>
										<view class="original-price">¥{{ item.price }}</view>
									</view>
								</block>
								<block v-else>
									<view class="shop-info-price-box gold">
										<view class="price">
											<view class="flex-row">
												<view class="icon flex-column" style="justify-content: center;">
													<i class="gold-color mini-icon mini-Gold_coin_01"></i>
												</view>
												<text class="_text">{{ item.vip_price }}</text>
											</view>
											<view class="price-text">会员价</view>
										</view>
										<view class="original-price flex-row">
											<view class="icon flex-column" style="justify-content: center;">
												<i class="mini-icon mini-Gold_coin_01"></i>
											</view>
											<text class="_text">{{ item.price }}</text>
										</view>
									</view>
								</block>
								
		                        <view
		                            :class="'info-btn ' + (item.isSelected ? 'bg' : '')"
		                            @tap.stop.prevent="chooseTap"
		                            :data-idx="index"
		                            :data-id="item.id"
		                            :data-name="item.name"
		                            :data-pic="item.pic[0]"
		                        >
		                            {{ item.isSelected ? '已选' : '选择' }}
		                        </view>
		                    </view>
		                </view>
		            </view>
		            <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──"  iconSize="28" fontSize="28" color="#989898" />
		        </view>
		        <view v-if="isEmpty">
		            <u-empty text="空" width="300" height="300" text-size="28"/>
		        </view>
			<!-- </ls-skeleton> -->
		</view>


		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';

const shop = require('@/mixins/shop');
var options = {};
shop(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,lsSkeleton
    },
	computed:{

	},
    data() {
        return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 21,
            keyword: '',

            cats: [
                {
                    id: -1,
                    name: '上新'
                },
                {
                    id: 0,
                    name: '热销榜单'
                }
            ],

            curIdx: -1,
            goodsList: [],
            page: 1,
            loading: true,
            loadmoreShow: false,
            isLastPage: false,
            isEmpty: false,
            postsGoods: [],
			boxGoodsSelectSkeleton: [],
            img: {
                id: ''
            },

            it: {
                id: ''
            },
        };
    },
    onLoad: function (options) {
        let that = this;
		that.globalOnloadProcess(options);
		// skeleton
		that.boxGoodsSelectSkeleton = that.$store.state.skeleton.boxGoodsSelect;

        let postsGoods = uni.getStorageSync('postsGoods');

        if (!postsGoods) {
            uni.setStorageSync('postsGoods', []);
        } else {
            that.setData({
                postsGoods: postsGoods
            });
        }

        that.getShopClassify();
        that.getClassifyGoods();
    },
	onShow: function () {
		let that = this;
		that.updateScene(21, 0);
	},
    onPullDownRefresh: function () {
        let that = this;
        that.setData({
            loading: true,
            loadmoreShow: false,
            isLastPage: false,
            isEmpty: false,
            page: 1
        });
        that.getClassifyGoods();
    },
    onReachBottom: function () {
        let that = this;
        that.setData({
            loadmoreShow: true,
            page: that.page + 1
        });

        if (that.keyword) {
            that.getGoodsSearch();
        } else {
            that.getClassifyGoods();
        }
    },
    onShareAppMessage: function (res) {},
    methods: {
        chooseTap(e) {
			console.log("chooseTap",e)
            let that = this;
            let postsGoods = uni.getStorageSync('postsGoods');
            let id = e.currentTarget.dataset.id;
            let idx = e.currentTarget.dataset.idx;
            let goodsList = that.goodsList;

            if (postsGoods.length > 8) {
                uni.showToast({
                    title: '最多只能添加8件商品',
                    icon: 'none'
                });
                return;
            }

            for (let i in postsGoods) {
                if (postsGoods[i].id == id) {
                    postsGoods.splice(i, 1);
                    goodsList[idx].isSelected = false;
                    that.setData({
                        postsGoods: postsGoods,
                        goodsList: goodsList
                    });
                    uni.setStorageSync('postsGoods', postsGoods);
                    return;
                }
            }

            let goods = {};
            goods.id = id;
            goods.name = e.currentTarget.dataset.name;
            goods.pic = e.currentTarget.dataset.pic;
            postsGoods.push(goods);
            uni.setStorageSync('postsGoods', postsGoods);
			that.$set(that.goodsList[idx], "isSelected", true)
            // goodsList[idx].isSelected = true;
            that.setData({
                postsGoods: postsGoods,
                goodsList: goodsList
            });
        },

        theSelected() {
            let that = this;
            let postsGoods = that.postsGoods;
            let goodsList = that.goodsList;

            for (let i of postsGoods) {
                for (let j of goodsList) {
                    if (j.id == i.id) {
                        j.isSelected = true;
                    }
                }
            }

            that.setData({
                goodsList: goodsList
            });
        },

        delKeyword() {
            let that = this;
            that.setData({
                keyword: '',
                loading: true,
                loadmoreShow: false,
                isLastPage: false,
                isEmpty: false,
                page: 1,
                goodsList: []
            });
            that.getClassifyGoods();
        },

        onSearchConfirm(e) {
            let that = this;
            that.setData({
                keyword: e.detail.value,
                loading: true,
                loadmoreShow: false,
                isLastPage: false,
                isEmpty: false,
                page: 1,
                goodsList: []
            });
            that.getGoodsSearch();
        },

        switchRightTab: function (e) {
            let that = this;
            that.setData({
                curIdx: e.target.dataset.id,
                loading: true,
                loadmoreShow: false,
                isLastPage: false,
                isEmpty: false,
                page: 1,
                goodsList: []
            });
            that.getClassifyGoods();
        },

        getClassifyGoods() {
            let that = this;
            uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/classifyGoodsList', {
                cid: that.curIdx,
                page: that.page
            }).then(function (res) {
				
				if(res.status){
					if(res.data.current_page != that.page){
						return false;
					}
					let data = res.data;
					let args = {};
					args.loading = false;
					
					if (data.data.length > 0) {
					    args.goodsList = that.goodsList.concat(data.data);
					} else if (data.data == '') {
					    args.isLastPage = true;
					
					    if (data.current_page == 1) {
					        args.isEmpty = true;
					    }
					}
					
					args.page = data.current_page;
					that.setData(args);
					that.theSelected();
				}
            });
        },

        getGoodsSearch() {
            let that = this;
            uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/goodsSearch', {
                keyword: that.keyword,
                page: that.page
            }).then(function (res) {
				
				if(res.status){
					if(res.data.current_page != that.page){
						return false;
					}
					let data = res.data;
					let args = {};
					args.loading = false;
					
					if (data.data.length > 0) {
					    args.goodsList = that.goodsList.concat(data.data);
					} else if (data.data == '') {
					    args.isLastPage = true;
					
					    if (data.current_page == 1) {
					        args.isEmpty = true;
					    }
					}
					
					args.page = data.current_page;
					that.setData(args);
					that.theSelected();
				}
                
            });
        }
    }
};
</script>
<style lang="scss">
@import './goods.scss';
</style>
