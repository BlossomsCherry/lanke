<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
  <view class="mini-page-body">
	  <navBar :back="true" iconTheme="white" :home="fph" color="#ffffff" background="rgba(255, 255, 255, 0);" :placeholder="false">
	  
	  </navBar>
	  <view class="almost-lottery">
		  <!-- head -->
		  <view class="almost-lottery__head" :style=" 'background: url(' + top_background + ') no-repeat center center/cover;' ">
		    <view :class="['action', isApple && 'action-shadow']" @tap="toWallet">
		      <i class="mini-icon mini-Gold_coin_01 gold" style="color: #F9FC31;"></i>
		      <text class="content">我的{{ config_app_coins_name }}：<text class="num">{{ userCoins }}</text></text>
		    </view>
		    <view class="tip"><text class="tip-content">每次抽奖消耗 {{ goldNumEvery + config_app_coins_name }}，不限次数</text></view>
		  </view>
		  <!-- lottery -->
		  <view class="almost-lottery__wheel">
		    <almost-lottery
		      :lottery-size="lotteryConfig.lotterySize"
		      :action-size="lotteryConfig.actionSize"
		      :ring-count="3"
		      :duration="4"
		      :img-circled="true"
		      :canvasCached="true"
		      :prize-list="prizeList"
		      :prize-index="prizeIndex"
		      @reset-index="prizeIndex = -1"
		      @draw-start="handleDrawStart"
		      @draw-end="handleDrawEnd"
		      @finish="handleDrawFinish"
		      v-if="prizeList.length"
		    />
		    <view class="almost-lottery__count">
		      <text class="text">剩余免费抽奖 {{ restFreeNum }} 次</text>
		    </view>
		  </view>
		  <!-- rule -->
		  <view class="almost-lottery__rule">
		    <view class="rule-head">
		      <view class="line"></view>
		      <text class="title">活动规则</text>
		      <view class="line"></view>
		    </view>
		    <view class="rule-body">
		      <view class="item">
		        <view class="number">1</view>
		        <view class="text">
		          <text>抽奖细则：</text>
		          <text>每人每天拥有{{ freeNumDay }}次免费抽奖机会，每次消耗{{ goldNumEvery + config_app_coins_name }}。</text>
		        </view>
		      </view>
		      <view class="item item-rule">
		        <view class="number">2</view>
		        <view class="text">
		          <text>奖励说明：</text>
		          <text>a.余额奖：系统会即时转入账户余额，可提现。</text>
		          <text>b.{{ config_app_coins_name }}奖：系统会即时转入{{ config_app_coins_name }}账户，可在平台内使用。</text>
		          <text>c.实物奖：中奖后需联系客服领取。</text>
		        </view>
		      </view>
		      <template>
		        <view class="item" v-for="(item, index) in tips" :key="index"><view class="number">{{index+3}}</view><view class="text">{{item.text}}</view></view>
		      </template>
		    </view>
		  </view>
		  <hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	  </view>
  </view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	 //预览图片
  import AlmostLottery from '@/pagesB/components/almost-lottery/components/almost-lottery/almost-lottery.vue'
  import { clearCacheFile, clearStore } from '@/pagesB/components/almost-lottery/utils/almost-utils.js'
  export default {
    name: 'Home',
    components: {
	  myToast,navBar,hoverBall,
      AlmostLottery
    },
	computed:{
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
		isApple () {
		  return uni.getSystemInfoSync().platform === 'ios'
		}
	},
    data () {
      return {
        // 开启调试模式
        isDev: true,
        
        // 以下是转盘配置相关数据
        lotteryConfig: {
          // 抽奖转盘的整体尺寸，单位rpx
          lotterySize: 600,
          // 抽奖按钮的尺寸，单位rpx
          actionSize: 200
        },
        
        // 以下是转盘 UI 配置
        // 转盘外环图，如有需要，请参考替换为自己的设计稿
        lotteryBg: require('@/pagesB/static/luckdraw/lottery-bg.png'),
        // 抽奖按钮图
        actionBg: require('@/pagesB/static/luckdraw/action-bg.png'),
        
        // 以下是奖品配置数据
        // 奖品数据
        prizeList: [],
				// 奖品是否设有库存
				onStock: true,
        // 中奖下标
        prizeIndex: -1,
        
        // 是否正在抽奖中，避免重复触发
        prizeing: false,
        
        // 以下为中奖概率有关数据
        // 是否由前端控制概率，默认不开启，强烈建议由后端控制
        onFrontend: false,
        // 权重随机数的最大值
        prizeWeightMax: 0,
        // 权重数组
        prizeWeightArr: [],
        
        // 以下为业务需求有关示例数据
        // 金币余额
        userCoins: 600,
        // 当日免费抽奖次数余额
        restFreeNum: 3,
        // 每次消耗的金币数
        goldNumEvery: 20,
        // 每天免费抽奖次数
        freeNumDay: 3,
		tips: [],
		
		top_background: '',
		needReInit: true
      }
    },
	onShareAppMessage: function(res) {
		let that = this;
		return {
			title: that.$store.state.config.share.format.app_share_right,
			path: '/pagesB/luckdraw/luckdraw?from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: ''
		};
	},
	
	onShareTimeline: function(res) {
		let that = this;
		return {
			title: that.$store.state.config.share.format.app_share_right,
			query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: ''
		};
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	onLoad(options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		if(uni.$store.state.token){
			that.prizeList = []
			that.getPrizeList()
		}
		
	},
	onShow: function () {
		let that = this;
		that.updateScene(112, 0, true);
		
		if(that.needReInit){
			if(uni.$store.state.token){
				that.prizeList = []
				that.getPrizeList()
			}
		}
	},
	onUnload () {
	  uni.hideLoading()
	},
    methods: {
	  toWallet(){
		  uni.wen.toUrl(6, '/pagesA/mine/earnings/earnings', null);
	  },
      // 重新生成
      handleInitCanvas () {
		clearCacheFile()
        clearStore()
        
        this.prizeList = []
        this.getPrizeList()
      },
      // 获取奖品列表
		getPrizeList () {
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'luckdraw/info', {}).then(function(res) {
				uni.loading(false);
				if(res.status){
					that.setData({
						prizeList: res.data.prizeList,
						userCoins: res.data.userCoins,
						restFreeNum: res.data.restFreeNum,
						goldNumEvery: res.data.goldNumEvery,
						freeNumDay: res.data.freeNumDay,
						tips: res.data.tips,
						top_background: res.data.background,
						needReInit: false
					});
				}else{
					that.needReInit = true;
					uni.showToast({
						title: res.message,
						icon:'error'
					});
				}
			});
      },
      // 本次抽奖开始
      handleDrawStart () {
		let that = this;
        console.log('触发抽奖按钮')
        if (this.prizeing) return
        this.prizeing = true
        
        // 还有免费数次或者剩余金币足够抽一次
        if (this.restFreeNum > 0 || this.userCoins >= this.goldNumEvery) {
          this.tryLotteryDraw()
        } else {
          uni.showModal({
            title: that.$store.state.config.app.coins.name + '不足',
            content: '是否前往赚取？' + that.$store.state.config.app.coins.name,
            success: (res) => {
              // 这里需要根据业务需求处理，一般情况下会引导用户前往赚取金币的页面
			  if(res.confirm){
				  uni.wen.toUrl(6, '/pagesA/mine/signtask/index', null);
			  }
            },
            complete: () => {
              this.prizeing = false
            }
          })
        }
      },
      // 尝试发起抽奖
      tryLotteryDraw () {
        console.log('旋转开始，获取中奖下标......')
        // 判断是否由前端控制概率
        if (this.onFrontend) {
          this.localGetPrizeIndex()
        } else {
          this.remoteGetPrizeIndex()
        }
      },
      // 本地获取中奖下标
      localGetPrizeIndex () {
        console.warn('###当前处于前端控制中奖概率，安全起见，强烈建议由后端控制###')
        // 前端控制概率的情况下，需要拿到最接近随机权重且大于随机权重的值
        // 后端控制概率的情况下，通常会直接返回 prizeId
        if (!this.prizeWeightMax || !this.prizeWeightArr.length) {
        	console.warn('###当前已开启前端控制中奖概率，但是奖品数据列表中的 prizeWeight 参数似乎配置不正确###')
        	return
        }
        console.log('当前权重最大值为 =>', this.prizeWeightMax)
        
        // 注意这里使用了 Math.ceil，如果某个权重的值为 0，则始终无法中奖
        let randomWeight = Math.ceil(Math.random() * this.prizeWeightMax)
        console.log('本次权重随机数 =>', randomWeight)
        
        // 生成大于等于随机权重的数组
        let tempMaxArrs = []
        this.prizeList.forEach((item) => {
          if (item.prizeWeight >= randomWeight) {
            tempMaxArrs.push(item.prizeWeight)
          }
        })
        console.log('tempMaxArrs', tempMaxArrs)
        
        // 如果大于随机权重的数组有值，先对这个数组排序然后取值
        // 反之新建一个临时的包含所有权重的已排序数组，然后取值
        let tempMaxArrsLen = tempMaxArrs.length
        if (tempMaxArrsLen) {
          tempMaxArrs.sort((a, b) => a - b)
          // 取值时，如果存在多个值，分两种情况
          if (tempMaxArrsLen > 1) {
            // 检查是否存在重复的值
            let sameCount = 0
            for (let i = 0; i < tempMaxArrs.length; i++) {
              if (tempMaxArrs[i] === tempMaxArrs[0]) {
                sameCount++
              }
            }
            
            // 值不相等的情况下取最接近的值，也就是第1个值
            if (sameCount === 1) {
              this.prizeIndex = this.prizeWeightArr.indexOf(tempMaxArrs[0])
            } else {
              // 存在值相等时，随机取值，当然这里你可以自己决定是否随机取值
              let sameWeight = tempMaxArrs[0]
              let sameWeightArr = []
              let sameWeightItem = {}
              this.prizeWeightArr.forEach((item, index) => {
                if (item === sameWeight) {
                  sameWeightArr.push({
                    prizeWeight: item,
                    index
                  })
                }
              })
              console.log('sameWeightArr', sameWeightArr)
              sameWeightItem = sameWeightArr[Math.floor(Math.random() * sameWeightArr.length)]
              console.log('sameWeightItem', sameWeightItem)
              this.prizeIndex = sameWeightItem.index
            }
          } else {
            this.prizeIndex = this.prizeWeightArr.indexOf(tempMaxArrs[0])
          }
        }
        
        console.log('本次抽中奖品 =>', this.prizeList[this.prizeIndex].prizeName)
        
        // 如果奖品设有库存
        if (this.onStock) {
          console.log('本次奖品库存 =>', this.prizeList[this.prizeIndex].prizeStock)
        }
      },

      remoteGetPrizeIndex () {

		let that = this;
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/luckdraw', {}, 'POST').then(function(res) {
			if(res.status){
				setTimeout(function(){
					that.setData({
						userCoins: res.data.userCoins,
						restFreeNum: res.data.restFreeNum,
					});
				}, 3500);
				let prizeId__ = res.data.prizeId;
				// 拿到后端返回的 prizeId 后，开始循环比对得出那个中奖的数据
				for (let i = 0; i < that.prizeList.length; i++) {
				  let item = that.prizeList[i]
				  if (item.prizeId == prizeId__) {
				    // 中奖下标
				    that.prizeIndex = i
				    break
				  }
				}
				console.log('本次抽中奖品 =>', that.prizeList[that.prizeIndex].prizeName)
				
				// 如果奖品设有库存
				if (that.onStock) {
					console.log('本次奖品库存 =>', that.prizeList[that.prizeIndex].prizeStock)
				}
			}else{
				uni.showToast({
					title: res.message,
					icon:'error'
				});
			}
		});
		
      },
      // 本次抽奖结束
      handleDrawEnd () {
        console.log('旋转结束，执行拿到结果后到逻辑')
        
        // 旋转结束后，开始处理拿到结果后的逻辑
        let prizeName = this.prizeList[this.prizeIndex].prizeName
        let tipContent = ''
				
				if (prizeName === '谢谢参与') {
          tipContent = '很遗憾，没有中奖，请再接再厉！'
				} else {
          // 如果奖品设有库存
          if (this.onStock) {
            let prizeStock = this.prizeList[this.prizeIndex].prizeStock
            tipContent = prizeStock ? `恭喜您，获得 ${prizeName}` : `很抱歉，您来晚了，当前奖品 ${prizeName} 已无库存`
          } else {
            tipContent = `恭喜您，获得 ${prizeName} ！`
          }
        }
        
        uni.showModal({
          content: tipContent,
          showCancel: false,
          complete: () => {
            this.prizeing = false
          }
        })
      },
      // 抽奖转盘绘制完成
      handleDrawFinish (res) {
        console.log('抽奖转盘绘制完成', res)
        
        if (res.ok) {
          // 计算结束绘制的时间
          if (console.timeEnd) {
            console.timeEnd('绘制转盘用时')
          }
        }
				
        let stoTimer = setTimeout(() => {
          stoTimer = null
          
          uni.hideLoading()
          uni.showToast({
            title: res.msg,
          	mask: true,
          	icon: 'none'
          })
        }, 50)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .almost-lottery {
    flex: 1;
    background-color: #FF893F !important;
  }
  
  .almost-lottery__head {
    position: relative;
    width: 100%;
    height: 640rpx;
    .action {
      position: relative;
      top: 400rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 480rpx;
      height: 88rpx;
      line-height: 88rpx;
      margin: 0 auto;
      color: #FFFFFF;
      font-size: $uni-font-size-lg;
      background-color: rgba(255, 136, 61, 1);
      border-radius: 44rpx;
    }
    .action-shadow {
      box-shadow: 0px 14rpx 0px 0px rgba(235, 112, 36, 1);
    }
    .gold {
      margin-right: 10rpx;
	  font-size: 64rpx;
    }
    .num {
      color: #F9FC31;
    }
    .tip {
      position: relative;
      top: 428rpx;
      color: #FFFFFF;
      font-size: $uni-font-size-sm;
      text-align: center;
    }
  }
  
  .almost-lottery__wheel {
    text-align: center;
    .almost-lottery__count {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40rpx 0;
    }
    .text {
      color: #FFFFFF;
      font-size: $uni-font-size-sm;
    }
  }
  
  .almost-lottery__rule {
    padding: 0 28rpx;
    color: #FFF8CB;
    .rule-head {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 40rpx 0;
      .line {
        flex: 1;
        height: 1px;
        background-color: #FFF3A5;
      }
      .title {
        width: 280rpx;
        color: #F63857;
        line-height: 70rpx;
        text-align: center;
        margin: 0 20rpx;
        border-radius: 8rpx;
        background-image: linear-gradient(0deg,rgba(255,242,158,1),rgba(255,244,168,1));
      }
    }
    .rule-body {
      color: #FFF8CB;
      font-size: $uni-font-size-sm;
      padding: 10rpx 0 40rpx;
      .item {
        display: flex;
        margin-bottom: 10rpx;
      }
      .number {
        position: relative;
        top: 4rpx;
        width: 28rpx;
        height: 28rpx;
        line-height: 28rpx;
        text-align: center;
        color: #F63857;
        background: #FFF8CB;
        border-radius: 50%;
        margin-right: 10rpx;
      }
      .text {
        flex: 1;
      }
      .item-rule .text {
        display: flex;
        flex-direction: column;
      }
    }
  }
  
  .almost-lottery__action-dev {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 400rpx;
    height: 80rpx;
    border-radius: 10rpx;
    text-align: center;
    background-color: red;
    margin: 0 auto 40rpx;
    .text {
      color: #FFFFFF;
      font-size: $uni-font-size-base;
    }
  }
</style>
