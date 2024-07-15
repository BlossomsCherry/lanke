<template>
  <view
    class="contextual-wrap"
    @longpress.stop.prevent="longpress"
    @touchmove="moveChange(true)"
    @touchend="moveChange(false)"
  >
    <slot name="content"></slot>
  </view>
</template>

<script>
  let isMove = false
  export default {
    data() {
      return {}
    },
    props: {
      subject: {
        type: String,
        default: ''
      },
      popList: {
        type: Array,
        default() {
          return []
        }
      },
      para: {
        type: Object,
        default: {}
      },
      scene: {
        type: Number,
        default: 0
      }
    },
    methods: {
      moveChange(flag) {
        if (flag === !isMove) {
          isMove = flag
        }
      },
      longpress(e) {
        let that = this
        if (isMove) {
          return false
        }
        if (that.scene == 60001) {
          return false
        }
        if (Array.isArray(e.changedTouches) && e.changedTouches.length > 0) {
          let x = e.changedTouches[0].clientX
          // y = e.changedTouches[0].pageY + this.windowTop
          let y = e.changedTouches[0].clientY
          let grid = uni.wen.util.pointGridCode(x, y)
          let child = that.$unicom(
            '#mytotast_' +
              that.$store.state.scene +
              '_' +
              that.$store.state.scene_id
          )
          if (x < 40) {
            x = 40
          } else if (uni.$store.state.screenWidth - x < 40) {
            x = uni.$store.state.screenWidth - 40
          }

          if (y < 20) {
            y = 20
          } else if (uni.$store.state.screenLiHeight - y < 20) {
            y = uni.$store.state.screenLiHeight - 20
          }

          let left = x
          let top = y
          if (that.subject == 'posts' || that.subject == 'users') {
            if (grid >= 7) {
              top -= 30
            } else {
              top += 30
            }
          } else if (that.subject == 'comment') {
            top += 20
          } else if (that.subject == 'img') {
            top += 20
          }

          if (child) {
            uni.wen.util.doVibrateShort()
            child.open({
              type: 'fixedcontent',
              content: 'xxxx',
              timeout: 2000,
              isClick: true,
              mask: 6,
              x: x,
              y: y,
              left: left,
              top: top,
              grid: grid,
              para: that.para,
              subject: that.subject,
              popList: that.popList
            })
            return false
          }
          return false
        }
      }
    }
  }
</script>

<style lang="scss" scoped></style>
