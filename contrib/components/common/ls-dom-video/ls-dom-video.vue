<!-- eslint-disable -->
<template>
	<view class="dom-video-wrap">
		<view
		  v-html="videoHtml"
		  id="dom-video"
		  class="dom-video"
		  :eventDrive="eventDrive"
		  :change:eventDrive="domVideo.eventHandle"
		  :videoSrc="videoSrc"
		  :change:videoSrc="domVideo.srcChange"
		  :videoProps="videoProps"
		  :change:videoProps="domVideo.propsChange"
		  :randomNum="randomNum"
		  :change:randomNum="domVideo.randomNumChange"
		>
		</view>
		<view class="mini-icon play-icon mini-xiangyou" v-if="eventDrive != 'play'"></view>
  </view>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: false
    },
    objectFit: {
      type: String,
      default: 'cover'
    },
    muted: {
      type: Boolean,
      default: false
    },
    poster: {
      type: String,
      default: ''
    },
  },

  // 数据状态
  data() {
    return {
      videoHtml: '',
      videoSrc: '',
      eventDrive: null,
      videoProps: {},
      randomNum: Math.floor(Math.random() * 100000000 + 1)
    }
  },
  watch: {
    // 监听视频资源文件更新
    src: {
      handler(val) {
        if (!val) return
        this.initVideoHtml()
        setTimeout(() => {
          this.videoSrc = val
        }, 0)
      },
      immediate: true
    },
    // 监听首次加载
    autoplay: {
      handler(val) {
        this.videoProps.autoplay = val
      },
      immediate: true
    },
  },
  // 生命周期
  mounted() {
    this.initVideoHtml()
  },

  // 方法
  methods: {
    // 将video的事件传递给父组件
    videoEvent(data) {
      // console.log('向父组件传递事件 =>', data)
      this.$emit(data)
    },
    // 初始化视频
    initVideoHtml() {
      this.videoHtml = `<video
          src="${this.src}"
          id="dom-html-video_${this.randomNum}"
          class="dom-html-video"
          ${this.autoplay ? 'autoplay' : ''}
          ${this.loop ? 'loop' : ''}
          ${this.controls ? 'controls' : ''}
          ${this.muted ? 'muted' : ''}
          ${this.poster ? 'poster="' + this.poster + '"' : ''}
          preload="auto"
          playsinline
          webkit-playsinline
          width="100%"
          height="100%"
          style="object-fit: ${this.objectFit};padding:0;"
        >
          <source src="${this.src}" type="video/mp4">
          <source src="${this.src}" type="video/ogg">
          <source src="${this.src}" type="video/webm">
        </video>
      `
      // console.log('视频html =>', this.videoHtml)
    },
    resetEventDrive() {
      this.eventDrive = null
    },
    // 将service层的事件/数据 => 传递给renderjs层
    play() {
		if(this.eventDrive == 'play'){
			this.eventDrive = 'pause';
		}else{
			this.eventDrive = 'play';
		}
    },
    pause() {
      this.eventDrive = 'pause'
    },
    stop() {
      this.eventDrive = 'stop'
    }
  }
}
</script>

<script module="domVideo" lang="renderjs">
export default {
  data() {
    return {
      video: null,
      num: '',
      options: {}
    }
  },
  mounted() {
    this.initVideoEvent()
  },
  methods: {
    initVideoEvent() {
      setTimeout(() => {
        let video = document.getElementById(`dom-html-video_${this.num}`)
        this.video = video

        // 监听视频事件
        video.addEventListener('play', () => {
          this.$ownerInstance.callMethod('videoEvent', 'play')
        })
        video.addEventListener('pause', () => {
          this.$ownerInstance.callMethod('videoEvent', 'pause')
        })
        video.addEventListener('ended', () => {
          this.$ownerInstance.callMethod('videoEvent', 'ended')
          this.$ownerInstance.callMethod('resetEventDrive')
        })
      }, 100)
    },
    eventHandle(eventType) {
      if (eventType) {
        this.video = document.getElementById(`dom-html-video_${this.num}`)

        if (eventType === 'play') {
          this.video.play()
        } else if (eventType === 'pause') {
          this.video.pause()
        } else if (eventType === 'stop') {
          this.video.stop()
        }
      }
    },
    srcChange(val) {
      // 实现视频的第一帧作为封面，避免视频展示黑屏
      this.initVideoEvent()
      setTimeout(() => {
        let video = document.getElementById(`dom-html-video_${this.num}`)

        video.addEventListener('loadedmetadata', () => {
          let { autoplay } = this.options
          video.play()
          if (!autoplay) {
            video.pause()
          }
        })
      }, 0)
    },
    propsChange(obj) {
      this.options = obj
    },
    randomNumChange(val) {
      this.num = val
    },
  }
}
</script>


<style lang="scss" scoped>
.dom-video-wrap{
	.dom-video {
	  overflow: hidden;
	  height: 100%;
	  background-color: #f8f8f8;
	  padding: 0;
	  &-height {
	    height: 100%;
	  }
	}
	.mini-icon.play-icon{
	  font-size: 75rpx;
	  text-align: center;
	  color: rgba(255,255,255, 0.7);
	  position: absolute;
	  line-height: 300rpx;
	  left: 0;
	  right: 0;
	  top: 0;
	  bottom: 0;
	  z-index: 999;
	}
}

</style>
