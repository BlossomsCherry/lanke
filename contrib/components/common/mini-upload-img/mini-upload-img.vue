<template>
  <view :class="'con scene_' + scene">
    <movable-area class="area" :style="{ height: areaHeight }" @mouseenter.stop.prevent="mouseenter" @mouseleave.stop.prevent="mouseleave">
      <block v-for="(item, index) in imageList" :key="item.id">
        <movable-view
          class="view"
          :x="item.x"
          :y="item.y"
          direction="all"
          :damping="40"
          :disabled="item.disable"
          @change.stop.prevent="onChange($event, item)"
          @touchstart.stop.prevent="touchstart(item)"
          @touchend.stop.prevent="touchend(item, index)"
          :style="{ width: viewWidth + 'px', height: viewWidth + 'px', 'z-index': item.zIndex, opacity: item.opacity }"
        >
          <view class="area-con" :style="{ width: childWidth, height: childWidth, transform: 'scale(' + item.scale + ')' }">
            <image class="pre-image"  :src="item.status == 2 ? (item.url + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/webp/interlace/0/quality/100') : ''" mode="aspectFill" :style=" item.status != 2 ? 'background-color: rgba(0,0,0, 0.1);' : '' "></image>
			<view class="progress" :style="{ width: childWidth, height: childWidth}" v-if="item.progress>0&&item.progress<100">{{item.progress}}%</view>
            <view class="del-con" @tap.stop.prevent="delImage(item, index)">
              <view class="del-wrap">
				<i class="del-image mini-icon mini-shanchu2"></i>
              </view>
            </view>
          </view>
        </movable-view>
      </block>
      <view
        class="add"
        v-if="showAdd && imageList.length < number"
        :style="{ top: add.y, left: add.x, width: viewWidth + 'px', height: viewWidth + 'px' }"
        @tap="addImages(false)"
      >
        <view class="add-wrap" :style="{ width: childWidth, height: childWidth }">
		  <i class="del-image mini-icon mini-jia" style="font-size: 50rpx;color: #666;"></i>
		  <!-- <view><text class="iconfont icon-mn_shangchuantupian" style="color: #666;"></text></view> -->
        </view>
      </view>
    </movable-area>
  </view>
</template>

<script>
import uploadFile from '@/contrib/components/common/mini-upload-img/iz-aloss-uploader.js';
let vStorageKey = '';

export default {
	name:'mini-upload-img',
  data() {
    return {
      imageList: [],
      width: 0,
      add: {
        x: 0,
        y: 0
      },
      colsValue: 0,
      viewWidth: 0,
      tempItem: null,
      timer: null,
      changeStatus: true,
	  previewList:[],
	  
	  
	  timeObj: null,
	  tochHoldTime: 0,
    }
  },
  props: {
    // 选择图片数量限制
    number: {
      type: Number,
      default: 20
    },
    // 图片父容器宽度（实际显示的图片宽度为 imageWidth / 1.1 ），单位 rpx
    imageWidth: {
      type: Number,
      default: 230
    },
    // 图片列数（cols > 0 则 imageWidth 无效）
    cols: {
      type: Number,
      default: 3
    },
    // 图片周围空白填充，单位 rpx
    padding: {
      type: Number,
      default: 10
    },
    // 拖动图片时放大倍数 [0, ∞)
    scale: {
      type: Number,
      default: 1.1
    },
    // 拖动图片时不透明度
    opacity: {
      type: Number,
      default: 0.7
    },
    // 自定义添加（需配合 @aaddImage 事件使用）
    custom: {
      type: Boolean,
      default: false
    },
	tapUploader: {
		type: Number,
		default: 0
	},
	showAdd: {
		type: Boolean,
		default: true
	},
	scene: {
		type: Number,
		default: 0
	},
	canVideo: {
		type: Boolean,
		default: false
	}
  },
  watch:{
	  tapUploader: {
	  	handler: function(newVal, oldVal) {
	  		let that = this;
	  		that.addImages(false);
	  	},
	  	immediate: false,
	}
  },
  computed: {
    areaHeight() {
      if (this.imageList.length < this.number && this.showAdd) {
        return Math.ceil((this.imageList.length + 1) / this.colsValue) * this.viewWidth + 'px'
      } else {
        return Math.ceil(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
      }
    },
    childWidth() {
      return this.viewWidth - this.rpx2px(this.padding) * 2 + 'px'
    },
  },
  
  created() {
    this.width = uni.getSystemInfoSync().windowWidth
    this.viewWidth = this.rpx2px(this.imageWidth);
	this.vStorageKey = '';
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this)
    query.select('.area').boundingClientRect(data => {
      this.colsValue = Math.floor(data.width / this.viewWidth)
      if(this.cols > 0){
        this.colsValue = this.cols
        this.viewWidth = data.width / this.cols
		
		if(this.initValue && this.initValue.length > 0){
			this.initValue.forEach(img=>{
				this.addProperties(img, -1)
			});
		}
      }
    })
    query.exec()
  },
  methods: {
	init(imgs){
		let fileManager = this.$api.getFlieManager(imgs)
		let list=fileManager.getImgObjectListByImgStyle(this.$api.imgStyle.min_w)
		list.forEach(img=>{
			this.addProperties(img,6)
		});
	},
	setInitValue(imgs){
		if(imgs && imgs.length > 0){
			imgs.forEach(img=>{
				this.addProperties(img, -1)
			});
		}
	},
    onChange(e, item) {
      if(!item) return
      item.oldX = e.detail.x
      item.oldY = e.detail.y
      if (e.detail.source === 'touch') {
        if(item.moveEnd){
          item.offset = Math.sqrt(Math.pow(item.oldX - item.absX * this.viewWidth, 2) + Math.pow(item.oldY - item.absY * this.viewWidth, 2))
        }
        let x = Math.floor((e.detail.x + this.viewWidth / 2) / this.viewWidth)
        if(x >= this.colsValue) return
        let y = Math.floor((e.detail.y + this.viewWidth / 2) / this.viewWidth)
        let index = this.colsValue * y + x
        if (item.index != index && index < this.imageList.length) {
          this.changeStatus = false
          for (let obj of this.imageList) {
            if (item.index > index && obj.index >= index && obj.index < item.index) {
              this.change(obj, 1)
            } else if (item.index < index && obj.index <= index && obj.index > item.index) {
              this.change(obj, -1)
            } else if(obj.id != item.id) {
              obj.offset = 0
              obj.x = obj.oldX
              obj.y = obj.oldY
              setTimeout(() => {
                this.$nextTick(() => {
                  obj.x = obj.absX * this.viewWidth
                  obj.y = obj.absY * this.viewWidth
                })
              }, 0)
            }
          }
          item.index = index
          item.absX = x
          item.absY = y
          this.sortList()
        }
      }
    },
    change(obj, i){
      obj.index += i
      obj.offset = 0
      obj.x = obj.oldX
      obj.y = obj.oldY
      obj.absX = obj.index % this.colsValue
      obj.absY = Math.floor(obj.index / this.colsValue)
      setTimeout(() => {
        this.$nextTick(() => {
          obj.x = obj.absX * this.viewWidth
          obj.y = obj.absY * this.viewWidth
        })
      }, 0)
    },
    touchstart(item) {
		  let that = this;
		  that.tochHoldTime = 0;
		  that.timeObj = setInterval(function() {
		  	that.tochHoldTime ++;
		  },100);
		
		  this.imageList.forEach(v => {
			v.zIndex = 'auto'
		  })
		  item.zIndex = 99
		  item.moveEnd = true
		  this.tempItem = item
		  this.timer = setTimeout(() => {
			item.scale = this.scale
			item.opacity = this.opacity
			clearTimeout(this.timer)
			this.timer = null
		  }, 200)
    },
    touchend(item, index) {
	  let that = this;
	  
	  clearInterval(that.timeObj); //清除计时器
	  if(that.tochHoldTime < 2){
		  setTimeout(function(){
			  that.tapImgAction(that, item, index)
		  }, 20);
	  }
	  
	  item.scale = 1
	  item.opacity = 1
	  item.x = item.oldX
	  item.y = item.oldY
	  item.offset = 0
	  item.moveEnd = false
	  setTimeout(() => {
		this.$nextTick(() => {
		  item.x = item.absX * this.viewWidth
		  item.y = item.absY * this.viewWidth
		  this.tempItem = null
		  this.changeStatus = true
		})
	  }, 0)
    },
	tapImgAction(that, item, index){

		uni.showActionSheet({
			itemList: ['查看图片', '删除'],
			success: function (res) {
				if(res.tapIndex == 0){
					that.previewImage(item);
				}else if(res.tapIndex == 1){
					that.delImage(item, index);
				}
			},
			fail: function (res) {
				console.log(res.errMsg);
			}
		});
	},
    previewImage(item){
	  let that = this;
      let src = that.previewList.findIndex(v => v === item.src)
      uni.previewImage({
        urls: that.previewList,
        current: src,
        success: () => {

        }
      })
    },
    mouseenter(){
      //#ifdef H5
      this.imageList.forEach(v => {
        v.disable = false
      })
      //#endif
      
    },
    mouseleave(){
      //#ifdef H5
      if(this.tempItem){
        this.imageList.forEach(v => {
          v.disable = true
          v.zIndex = v.index + 9
          v.offset = 0
          v.moveEnd = false
          if(v.id == this.tempItem.id){
            if (this.timer){
              clearTimeout(this.timer)
              this.timer = null
            }
            v.scale = 1
            v.opacity = 1
            v.x = v.oldX
            v.y = v.oldY
            this.$nextTick(() => {
              v.x = v.absX * this.viewWidth
              v.y = v.absY * this.viewWidth
              this.tempItem = null
            })
          }
        })
        this.changeStatus = true
      }
      //#endif
    },
    addImages(forceImg = false) {
	  let that = this;
      if(that.custom){
        that.$emit('addImage')
      } else {
		if(!forceImg){
			if(that.canVideo){
				let flag = true;
				if(vStorageKey && vStorageKey.length > 0){
					let videoObj = uni.getStorageSync(vStorageKey);
					if(videoObj && videoObj.video_url && videoObj.video_url.length > 0){
						flag = false;
					}
				}
				
				if(flag){
					uni.showActionSheet({
						itemList: ['图片', '视频'],
						success: function (res) {
							if(res.tapIndex == 0){
								that.addImages(true);
							}else if(res.tapIndex == 1){
								vStorageKey =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
									var r = Math.random() * 16 | 0,
									  v = c == 'x' ? r : (r & 0x3 | 0x8);
									  
									return v.toString(16);
								});
								that.$emit('vkey', vStorageKey);
								uni.wen.toUrl(6, '/pages/creat/index/video?uuid=' + vStorageKey);
							}
						},
						fail: function (res) {
							console.log(res.errMsg);
						}
					});
					return false;
				}
				
			}
		}
		console.log('555555555555');
		let _addImages = (sourceType) => {
			let checkNumber = that.number - that.imageList.length
			uni.chooseImage({
			  count: checkNumber,
			  sizeType:'original',
			  sourceType: [sourceType],
			  success: res => {
				that.$emit('uploading', true);
			    let count = checkNumber <= res.tempFilePaths.length ? checkNumber : res.tempFilePaths.length;
			    for (let i = 0; i < count; i++) {
			        that.addProperties(res.tempFilePaths[i])
			    }
				that.upload()
			  }
			})
		}
		
		uni.showActionSheet({
			itemList: ['拍摄', '从相册选择'],
			success: function (res) {
				
				// #ifdef MP
				_addImages(res.tapIndex === 1 ? 'album' : 'camera')
				// #endif
				
				// #ifdef APP
				uni.wen.util.checkAppPermission(res.tapIndex === 1 ? 'photoLibrary-write' : 'camera', res.tapIndex === 1 ? '[相册读写权限]获取您的相册图片，用于发表图片笔记' : '[摄像头权限]获取您此刻所拍的照片，用于发表图片笔记', () => {
					_addImages(res.tapIndex === 1 ? 'album' : 'camera')
				});
				// #endif
				
				// #ifdef H5
				_addImages(res.tapIndex === 1 ? 'album' : 'camera')
				// #endif
		
			},
			fail: function (res) {
				console.log(res.errMsg);
			}
		});
		
      }
    },
    addImage(image){
      this.addProperties(image)
	  this.upload()
    },
    delImage(item, index){
      this.imageList.splice(index, 1)
      for (let obj of this.imageList) {
        if (obj.index > item.index) {
          obj.index -= 1
          obj.x = obj.oldX
          obj.y = obj.oldY
          obj.absX = obj.index % this.colsValue
          obj.absY = Math.floor(obj.index / this.colsValue)
          this.$nextTick(() => {
            obj.x = obj.absX * this.viewWidth
            obj.y = obj.absY * this.viewWidth
          })
        }
      }
      this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
      this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
      this.sortList()
    },
    delImageMp(item, index){
      //#ifdef MP
      this.delImage(item, index)
      //#endif
    },
    sortList() {
		let list = this.imageList.slice()
		list.sort((a, b) => {
			return a.index - b.index
		})
		let urlList = []
		let previewList=[]
		let upSuccessCount=0
		let upLoadingCount=0
		list.forEach(img=>{
			if(img.status==2||img.status==6){
				upSuccessCount++
				urlList.push(img.url)
			}
			previewList.push(img.src)
			if(img.status==1){
				upLoadingCount++
			}
		})
		let data = {
			details:list,
			urls:urlList,
			upLoadingCount:upLoadingCount,
			upSuccessCount:upSuccessCount,
			imgCount:this.imageList.length
		}
		this.previewList=previewList
		this.$emit('change', data)
		uni.loading(false);
    },
	upload(img){
		let that = this;
		let promises = []
		uni.loading(true);
		this.imageList.forEach(img=>{
			if(img.status==0){
				img.status=1
				let promise =new Promise(function(resolve, reject) {
					let uploadTask = uploadFile(img.src,'png',data=>{
						resolve(data)
					}, reject)
					img.uploadTask = uploadTask
					uploadTask.onProgressUpdate(async function(res) {
						that.$set(img, 'progress' ,res.progress) 
						img.uploadInfo = res
					});
				}).then(res=>{
					img.progress=100
					img.status=2
					img.url=res
				}).catch(e=>{
					img.status=99
				})
				promises.push(promise)
			}
		})
		
		
		Promise.all(promises)
		.then(res=>{
			this.sortList()
		}).catch(function(e){
			
		})
	},
    addProperties(item,status){
		if(status===undefined){
			status=0
		}
		let initValue = false;
		if(status == -1){
			status = 2;
			initValue = true;
		}
      let absX = this.imageList.length % this.colsValue;
      let absY = Math.floor(this.imageList.length / this.colsValue)
      let x = absX * this.viewWidth
      let y = absY * this.viewWidth
      this.imageList.push({
        src: initValue ? item.url : (status==6?item.src:item),
		url: initValue ? item.url : (status==6?item.url:''),
		progress:0,
		status:status,
        x,
        y,
        oldX: x,
        oldY: y,
        absX,
        absY,
        scale: 1,
        zIndex: 9,
        opacity: 1,
        index: this.imageList.length,
        id: this.guid(),
        disable: false,
        offset: 0,
        moveEnd: false
      })
      this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
      this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
      this.sortList()
    },
    nothing(){},
    rpx2px(v){
      return this.width * v / 750
    },
    guid() {
    	function S4() {
    		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    	}
    	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
  }
}
</script>

<style lang="scss" scoped>
.progress{
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(0,0,0, 0.8);
	color: #fff;
	border-radius: 10rpx;
}
.con {
  .area {
    width: 100%;
	// pointer-events: none;
    .view {
      display: flex;
      justify-content: center;
      align-items: center;
	  pointer-events: auto;
      .area-con {
        position: relative;
        .pre-image {
		  border-radius: 10rpx;
          width: 100%;
          height: 100%;
        }
        .del-con {
          position: absolute;
          top: 0rpx;
          right: 0rpx;
          padding: 0 0 20rpx 20rpx;
		  z-index: 9999;
          .del-wrap {
            width: 36rpx;
            height: 36rpx;
            background-color: rgba(255, 0, 0, 0.8);
            border-radius: 0 10rpx 0 5rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            .del-image {
              width: 20rpx;
              height: 20rpx;
			  color: #ffffff;
			  font-size: 20rpx;
            }
          }
        }
      }
    }
    .add {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
	  // border: 1px solid;
	  // @include border_color(border-color-box-item-background-color);
	  box-sizing: border-box;
      .add-wrap{
		@include background_color(page-body2-background-color);
        display: flex;
		border-radius: 10rpx;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>