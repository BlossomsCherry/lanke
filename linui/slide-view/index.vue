<template>
    <view>
        <!-- slide-view/slide-view.wxml -->
        <movable-area class="container" :style="'width: ' + width + 'rpx; height: ' + height + 'rpx;'">
            <movable-view
                direction="horizontal"
                class="movable-content"
                :out-of-bounds="out"
                damping="20"
                :disabled="disabled"
                :x="x"
                :style="'width: ' + (width + slideWidth) + 'rpx; height: ' + height + 'rpx;'"
                inertia
                @touchend="onTouchEnd"
                @touchstart="onTouchStart"
                @change="onChange"
            >
                <view class="left" :style="'width: ' + width + 'rpx; height: ' + height + 'rpx;'">
                    <slot name="left"></slot>
                </view>
                <view class="right" @click.stop="onRightTap" :style="'width: ' + slideWidth + 'rpx; height: ' + height + 'rpx;'">
                    <slot name="right"></slot>
                </view>
            </movable-view>
        </movable-area>
    </view>
</template>

<script>
// slide-view/slide-view.js
const _windowWidth = uni.getSystemInfoSync().windowWidth;
export default {
    data() {
        return {
            viewWidth: _windowWidth,

            //  movable-view偏移量
            x: 0,

            //  movable-view是否可以出界
            out: false,

            popup: false,
            closeClone: false
        };
    },
    /**
     * 组件的属性列表
     */
    options: {
        multipleSlots: true
    },
    props: {
        // 组件显示区域的宽度
        width: {
            type: Number,
            default: _windowWidth
        },
        // 组件显示区域的高度
        height: {
            type: Number,
            default: 100
        },
        // 组件滑动显示区域的宽度
        slideWidth: {
            type: Number,
            default: 0
        },
        // 阈值
        threshold: {
            type: Number,
            default: 0
        },
        // 禁用
        disabled: {
            type: Boolean,
            default: false
        },
        // 自动关闭
        autoClose: {
            type: Boolean,
            default: false
        },
        // 主动关闭
        close: {
            type: Boolean,
            default: false
        }
    },
    /**
     * 组件的方法列表
     */
    mounted() {
        this.updateRight();
    },
    methods: {
        updateRight() {
            // 获取右侧滑动显示区域的宽度
            const that = this;
            const query = uni.createSelectorQuery().in(this);
            query
                .select('.right')
                .boundingClientRect(function (res) {
                    that._slideWidth = res.width;
                    let width = res.width <= 50 ? res.width : 50;

                    if (that.threshold) {
                        that._threshold = that.threshold;
                    } else {
                        that._threshold = width;
                    }

                    that._viewWidth = that.width + res.width * (750 / _windowWidth);
                    that.setData({
                        viewWidth: that._viewWidth
                    });
                })
                .exec();
        },

        onTouchStart(e) {
            this._startX = e.changedTouches[0].pageX;
        },

        //  当滑动范围超过阈值自动完成剩余滑动
        onTouchEnd(e) {
            if (this.disabled) {
                return;
            }

            this._endX = e.changedTouches[0].pageX;
            this._length = this._endX - this._startX;
            const { _endX, _startX, _threshold } = this;

            if (this._length > _threshold) {
                this.setData({
                    popup: false,
                    x: 0
                });
                this.onCloseTap();
            }

            if (_endX > _startX && this.out === false) {
                return;
            }

            if (_startX - _endX >= _threshold) {
                this.setData({
                    x: -this._slideWidth,
                    popup: true,
                    closeClone: false
                });
                this.onOpenTap();
            } else if (_startX - _endX < _threshold && _startX - _endX > 0 && this.popup !== true) {
                this.setData({
                    x: 0
                });
                this.onCloseTap();
            } else if (_endX - _startX >= _threshold) {
                this.setData({
                    x: 0
                });
                this.onCloseTap();
            } else if (_endX - _startX < _threshold && _endX - _startX > 0) {
                this.setData({
                    x: -this._slideWidth,
                    closeClone: false
                });
                this.onOpenTap();
            }
        },

        //  根据滑动的范围设定是否允许movable-view出界
        onChange(e) {
            if (!this.out && e.detail.x < -this._threshold) {
                this.setData({
                    out: true
                });
            } else if (this.out && e.detail.x >= -this._threshold) {
                this.setData({
                    out: false
                });
            }
        },

        // 点击 右边区域
        onRightTap() {
            let detail = 'click right';
            let option = {
                bubbles: true,
                composed: true
            };

            if (this.autoClose) {
                this.setData({
                    popup: false,
                    x: 0
                });
                this.onCloseTap();
            }

            this.$emit(
                'lintap',
                {
                    detail: detail
                },
                option
            );
        },

        // 打开后触发
        onOpenTap() {
            let detail = true;
            let option = {
                bubbles: true,
                composed: true
            };
            this.$emit(
                'slideopen',
                {
                    detail: detail
                },
                option
            );
        },

        // 关闭后触发
        onCloseTap() {
            let detail = false;
            let option = {
                bubbles: true,
                composed: true
            };
            this.$emit(
                'slideclose',
                {
                    detail: detail
                },
                option
            );
        }
    },
    watch: {
        close: {
            handler: function (newVal) {
                this.closeClone = this.deepClone(this.close);
                if (newVal) {
                    this.setData({
                        popup: false,
                        x: 0
                    });
                    this.onCloseTap();
                }
            },

            immediate: true
        }
    }
};
</script>
<style lang="scss">
@import './index.scss';
</style>
