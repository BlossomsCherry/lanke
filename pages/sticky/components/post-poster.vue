<template>
  <view class="content" v-if="isShow">
    <image v-if="tempFilePath" :class="['temp-image', tempFilePath ? 'img-animate' : '']" :src="tempFilePath"/>
    <canvas v-if="!tempFilePath" class="my-canvas" canvas-id="my-canvas" :style="{ width: canvasW + 'px', height: canvasH + 'px' }"/>
    <canvas canvas-id="temp-canvas" :style="{ width: canvasW + 'px', height: canvasH + 'px',opacity: 0, position: 'absolute' }"/>

    <view :class="['bottom-wrapper', isShowFoot ? 'animate' : '']" v-show="isShowFoot">
      <view class="top-wrapper">
        <text class="text">分享至</text>
        <i class="mini-icon mini-shanchu2 close-icon" @tap.stop.prevent="closePoster"/>
      </view>

      <view class="socia-list-wrapper">
        <scroll-view :scroll-x="true" class="_scroll-view">
          <view class="list">
            <block v-if="sociaList && sociaList.length > 0">
              <view class="item" v-for="(item, index) in sociaList" :key="index" @tap.stop.prevent="socialTap(item)">
                <i :class=" item.icon + ' icon-socia ' + item.action " :style="'color: '+ item.color +';'"></i>
                <view class="text">{{ item.text }}</view>
              </view>
            </block>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      canvasW: 0,
      canvasH: 0,
      isShow: false,
      isShowFoot: false,
      sociaList: [],
      // 生成的海报图片
      tempFilePath: '',
	  src: '',
      poster: {
        // 笔记图片
        image: '',
        // 用户昵称
        nickname: '',
        // 用户头像
        avatar: '',
        // 内容
        content: '',
        // 二维码
        qrImage: '',
        glass: '',
        tip: '',
      }
    }
  },
  methods: {
    socialTap(item) {
      let that = this;
      if (item.action === 'save') {
        that.saveImage();
      }else {
        // #ifdef APP
        let share_obj = JSON.parse(item.share);
        share_obj.fail = function (err) {
          uni.wen.util.log(JSON.stringify(err));
          uni.showToast({
            title: JSON.stringify(err),
            icon: 'none'
          })
        }
        uni.share(share_obj);
        // #endif
        // #ifdef MP-WEIXIN
        wx.showShareImageMenu({
          path: that.tempFilePath
        })
        // #endif
      }
    },
    closePoster() {
      let that = this;
      that.isShow = false;
      that.isShowFoot = false;
      uni.$store.commit('popopChange', false);
    },
    //显示
    show(posts_id) {
      this.tempFilePath = ''
      let that = this;
      uni.loading(true);
      that.isShow = true
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/makeShowQcode', { posts_id }).then(function (res) {
        if (res.status) {

          that.poster = {
            image: res.data.img,
            nickname: res.data.user.user_name,
            avatar: res.data.user.user_avatar,
            content: res.data.content,
            qrImage: res.data.qrcode,
            glass: res.data.glass,
            tip: res.data.tip
          };
          that.sociaList = res.data.social;

          uni.$store.commit('popopChange', true);
          that.poster_init()
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        }
      });
    },

    async poster_init() {
      let that = this;
      const sysRes = uni.getSystemInfoSync();
      // 1. 画布设置
      const ctx = uni.createCanvasContext('my-canvas', that);
      that.canvasW = sysRes.windowWidth;
      that.canvasH = sysRes.windowHeight;
    
      if (that.canvasH < uni.upx2px(1350)) {
        that.canvasH = uni.upx2px(1400);
      }
    
      let startH = (that.canvasH - uni.upx2px(1294)) / 2;
      let diff = uni.upx2px(220) - startH; // 差值
    
      // 2. 先清空画布
      that.clear(ctx, that.canvasW, that.canvasH);
    
      // 绘制背景图片
      let bjImg = await that.getImageInfo(that.poster.glass);
      // 确保背景图片覆盖整个画布
      ctx.drawImage(bjImg.path, 0, 0, that.canvasW, that.canvasH);
    
      // 设置矩形背景
      const rectWidth = uni.upx2px(670);
      const rectHeight = uni.upx2px(1000);
      const rectWX = (that.canvasW - rectWidth) / 2;
      that.drawRoundRect(ctx, rectWX, uni.upx2px(220) - diff, rectWidth, rectHeight, uni.upx2px(36), '#FFFFFF');
    
      // 绘制笔记图片
      let headerImg = await that.getImageInfo(that.poster.image);
      let hW = uni.upx2px(630);
      let hH = uni.upx2px(800);
      const hX = (that.canvasW - hW) / 2;
      that.drawRoundImg(ctx, headerImg.path, hX, uni.upx2px(240) - diff, hW, hH, uni.upx2px(12));
    
      // 绘制用户头像
      let avatarImg = await that.getImageInfo(that.poster.avatar);
      let aW = uni.upx2px(100);
      that.drawRoundImg(ctx, avatarImg.path, rectWX + uni.upx2px(20), uni.upx2px(1000) - diff, aW, aW, aW / 2);
    
      // 绘制用户昵称
      ctx.setFontSize(15);
      ctx.setFillStyle('#333');
      ctx.fillText(that.poster.nickname, hX + uni.upx2px(110), uni.upx2px(1080) - diff);
    
      // 绘制笔记内容（多行文本）
      try {
        that.textPreWrap(ctx, that.poster.content, (that.canvasW - hW) / 2, uni.upx2px(1140) - diff, uni.upx2px(32), uni.upx2px(600), 2);
      } catch (err) {
        console.log('11111111111111');
      }
    
      // 绘制二维码
      let qrcodeImg = await that.getImageInfo(that.poster.qrImage);
      let qrW = uni.upx2px(140);
      that.drawRoundImg(ctx, qrcodeImg.path, (that.canvasW - qrW) / 2, uni.upx2px(1285) - diff, qrW, qrW, qrW / 2, true);
    
      // 扫一扫文字
      ctx.setFontSize(14);
      ctx.setFillStyle(that.poster.tip_color);
      const text = that.poster.tip;
      ctx.fillText(text, (that.canvasW - ctx.measureText(text).width) / 2, uni.upx2px(1500) - diff);
    
      setTimeout(() => {
        ctx.draw(true, () => {
          this.createPoster();
          uni.loading(false);
        });
      }, 500);
    },
    // 字体换行，可以限制换行条数
    textPreWrap(ctx, content, drawX, drawY, lineHeight, lineMaxWidth, lineNum) {
      let drawTxt = '' // 当前绘制的内容
      let drawLine = 1 // 第几行开始绘制
      let drawIndex = 0 // 当前绘制内容的索引

      ctx.setFontSize(14) //设置标题字体大小
      ctx.setFillStyle('#333') //设置标题文本颜色
      // 判断内容是否可以一行绘制完毕
      if (ctx.measureText(content).width <= lineMaxWidth) {
        ctx.fillText(content, drawX, drawY)
      } else {
        for (let i = 0; i < content.length; i++) {
          drawTxt += content[i]
          if (ctx.measureText(drawTxt).width >= lineMaxWidth) {
            if (drawLine >= lineNum) {
              ctx.fillText(content.substring(drawIndex, i) + '..', drawX, drawY)
              break
            } else {
              ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY)
              drawIndex = i + 1
              drawLine += 1
              drawY += lineHeight
              drawTxt = ''
            }
          } else {
            // 内容绘制完毕，但是剩下的内容宽度不到lineMaxWidth
            if (i === content.length - 1) {
              ctx.fillText(content.substring(drawIndex), drawX, drawY)
            }
          }
        }
      }
    },

    // 带圆角图片
    drawRoundImg(ctx, img, x, y, width, height, radius, stroke = false) {
      ctx.beginPath()
      ctx.save()
      // 左上角
      ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5)
      // 右上角
      ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2)
      // 右下角
      ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5)
      // 左下角
      ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI)
      if (stroke) {
        ctx.stroke()
      }
      ctx.clip()
      ctx.drawImage(img, x, y, width, height)
      ctx.restore()
      ctx.closePath()
    },

    // 圆角矩形
    drawRoundRect(ctx, x, y, width, height, radius, color) {
      ctx.save()
      ctx.beginPath()
      ctx.setFillStyle(color)
      ctx.setStrokeStyle(color)
      ctx.setLineJoin('round')  // 交点设置成圆角
      ctx.setLineWidth(radius)
      ctx.strokeRect(x + radius / 2, y + radius / 2, width - radius, height - radius)
      ctx.fillRect(x + radius, y + radius, width - radius * 2, height - radius * 2)
      // ctx.stroke()
      ctx.closePath()
    },

    // 获取图片
    getImageInfo(imgSrc) {
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src: imgSrc,
          success: image => resolve(image),
          fail: err => reject(err)
        })
      })
    },

    // 清空画布
    clear(ctx, w, h) {
      ctx.clearRect(0, 0, w, h);
      ctx.draw(true);
    },

    // 生成海报图片
    async createPoster() {
      let that = this
      uni.canvasToTempFilePath({
        canvasId: 'my-canvas',
        quality: 1,
        complete: (res) => {
          that.tempFilePath = res.tempFilePath
          that.isShowFoot = true
        }
      }, this)
    },

    //保存图片到相册
    saveImage() {
      let that = this
      // #ifdef MP
      uni.wen.util.checkMpPermission('scope.writePhotosAlbum', '请先在设置页面打开“保存相册”使用权限', () => {
      	that._saveImg()
      });
      // #endif
      
      // #ifdef APP
      uni.wen.util.checkAppPermission('photoLibrary-write', '[相册写入权限]用于保存图片', () => {
      	that._saveImg()
      });
      // #endif
      
      // #ifdef H5
      that._saveImg()
      // #endif
    },

    _saveImg() {
      let that = this
      uni.loading(true)
      uni.saveImageToPhotosAlbum({
        filePath: this.tempFilePath,
        success(res) {
          uni.loading(false);
          uni.showToast({ title: '已保存到相册', icon: 'success', duration: 2000 })
          setTimeout(() => {
            that.isShow = false;
            that.isShowFoot = false;
          }, 2000)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background: rgba(0, 0, 0, .4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999999;

  .my-canvas {
    transform: translate(-200vw, -200vh);
  }

  .temp-image {
    width: 100vw;
    height: 100vh;
    z-index: 8888888;

    &.img-animate {
      animation: fade .4s ease-in;
    }
  }

  .bottom-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 20rpx env(safe-area-inset-bottom) 20rpx;
    width: 100vw;
    height: 360rpx;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    box-sizing: border-box;
    z-index: 9999999;

    &.animate {
      animation: move .3s ease-in;
    }

    .top-wrapper {
      font-size: 16px;
      width: 100%;
      color: #777;
      position: relative;
      text-align: center;
      margin-bottom: 20rpx;

      .close-icon {
        position: absolute;
        font-size: 42rpx;
        right: 10rpx;
        top: 0;
      }
    }

    .socia-list-wrapper {
      margin-top: 50rpx;
      align-items: center;

      .list {
        display: flex;
        flex-direction: row;

        .item {
          display: flex;
          gap: 16rpx;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 40rpx;

          .icon-socia {
            font-size: 70rpx;
          }

          .text {
            font-size: 14px;
            white-space: nowrap;
            color: #666;
          }
        }
      }
    }
  }
}

@keyframes move {
  0% {
    transform: translateY(360rpx);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fade {
  0% {
    transform: translateY(-100vh);
  }
  100% {
    transform: translateY(0);
  }
}

</style>
