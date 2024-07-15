<script>
import regionPicker from '@/pagesP/components/region-picker/region-picker.vue';
	
export default {
  name: "pet-adoption-form-item",
  components: {
  	regionPicker
  },
  props: {
    isView: { type: Boolean, default: false },
    value: { type: Object | Number | String | Array },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '请输入' },
    type: {
      type: 'input' | 'input-number' | 'textarea' | 'tag' | 'picker' | 'region-picker' | 'date-picker' | 'checkbox' | 'picture',
      required: true
    },
    range: { type: Array, default: () => [] },
    maxLength: { type: Number | String, default: 100 },
    // label所在位置 left = 左侧、 top = 顶部
    position: { type: 'left' | 'top', default: 'left' },
    // 选择媒体最大数量
    mediaCount: { type: Number, default: 6 },
    // 选择媒体类型，照片或视频
    mediaType: { type: Array, default: () => ['mix'] },
    tagSize: { type: 'mini' | 'mid' | 'lg', default: 'mid' },
	isRequire: { type: Boolean, default: false }
  },
  computed: {
    tagStyle() {
      if (this.tagSize === 'mid') {
        return 'width: 120rpx; height: 50rpx'
      } else if (this.tagSize === 'lg') {
        return 'width: 140rpx; height: 60rpx'
      } else {
        return 'width: 100rpx; height: 40rpx'
      }
    },
    inputType() {
      if (this.type === 'input-number') {
        return 'number'
      } else {
        return 'text'
      }
    }
  },

  methods: {
    // 选择图片
    choosePicture() {
      uni.chooseImage({
        count: this.mediaCount - this.value.length,
		sizeType: ['original'],
        // mediaType: this.mediaType,
        success: res => this.$emit('change', res.tempFiles)
      })
    },

    // tag 多选框
    tagMultipleClickHandle(item) {
      const temp = this.value
      const index = temp.findIndex(f => f === item.value)
      if (index === -1) {
        temp.push(item.value)
      } else {
        temp.splice(index, 1)
      }
      this.$emit('input', temp)
    }
  }
}
</script>

<template>
  <view :class="['form-item', { 'column': position === 'top' }]">
    <view v-if="label" class="label">{{ label }}
		<view class="required" v-if="isRequire">*</view>
	</view>

    <!-- 输入框类型 -->
    <view v-if="['input', 'input-number'].includes(type)" class="input-wrapper">
      <view v-if="isView">{{ value }}</view>
      <u--input v-else :value="value" :placeholder="placeholder" border="none" inputAlign="right" :maxlength="maxLength" :type="inputType" @input="e => $emit('input', e)"/>
    </view>

    <!-- 文本域类型 -->
    <view v-else-if="type === 'textarea'" class="textarea-wrapper">
      <view v-if="isView">{{ value }}</view>
      <u--textarea v-else :value="value" :placeholder="placeholder" height="240" count :maxlength="maxLength" @input="e => $emit('input', e)"/>
    </view>

    <!-- 多选类型 -->
    <view v-else-if="type === 'checkbox'" class="checkbox-wrapper">
      <checkbox-group class="group-wrapper" @change="e => $emit('select', e.detail.value)">
        <label v-for="item in range" :key="item.value" class="item-wrapper">
          <checkbox color="#fc3a73" :value="`${item.value}`" :checked="item.checked"/>
          <view>{{ item.label }}</view>
        </label>
      </checkbox-group>
    </view>

    <!-- 选择器 -->
    <view v-else-if="type === 'picker'">
      <picker :disabled="isView" :range="range" range-key="label" @change="e => $emit('input', e.detail.value)" mode="selector" :value="value">
        <view class="uni-input">{{ range[value].label }}</view>
      </picker>
    </view>

    <!-- 区域选择 -->
    <view v-else-if="type === 'region-picker'">
      <region-picker :disabled="isView" @change="e => $emit('input', e.detail.value)" :value="value">
        <view class="picker" v-if="value.length > 0">{{ value[0] }}-{{ value[1] }}-{{ value[2] }}</view>
        <view class="placeholder" v-else>{{ placeholder || '请选择' }}</view>
      </region-picker>
    </view>

    <!-- 日期选择 -->
    <view v-else-if="type === 'date-picker'">
      <picker :disabled="isView" mode="date" :value="value" @change="e => $emit('input', e.detail.value)">
        <view v-if="value">{{ value }}</view>
        <view class="placeholder" v-else>{{ placeholder || '请选择' }}</view>
      </picker>
    </view>

    <!-- Tag 类型 -->
    <view v-else-if="type === 'tag'" class="tags-wrapper">
      <view
          v-if="isView ? item.value === value : true"
          v-for="item in range"
          :key="item.value"
          :style="tagStyle"
          :class="['item', { 'active': item.value === value }]"
          @click="$emit('input', item.value)">
        {{ item.label }}
      </view>
    </view>

    <view v-else-if="type === 'tag-multiple'" class="tags-wrapper">
      <view
          v-if="isView ? value.includes(item.value) : true"
          v-for="item in range"
          :key="item.value"
          :style="tagStyle"
          :class="['item', { 'active': value.includes(item.value) }]"
          @click="tagMultipleClickHandle(item)">
        {{ item.label }}
      </view>
    </view>

    <!-- 选择图片 -->
    <view v-else-if="type === 'picture'" class="select-picture-wrapper">
      <view v-show="value.length > 0" class="picture-wrapper" v-for="(item, index) in value" :key="index">
        <!-- 显示已选择的图片或视频 -->
        <image class="picture" :src="item.url" mode="aspectFill"/>
        <!-- 删除按钮 -->
        <view class="close-icon" @click="$emit('deleted', index)">
          <u-icon name="close-circle" size="45" color="white"/>
        </view>
        <!-- 视频显示标记 -->
        <view v-if="item.type === 'video'" class="video-play-icon">
          <u-icon name="play-right" size="45" color="white"/>
        </view>
      </view>

      <!-- 添加图片视频按钮 -->
      <view v-if="value.length < mediaCount" class="picture-wrapper plus-wrapper" @click="choosePicture">
        <u-icon name="camera-fill" size="60"/>
        <view class="label">上传照片</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
$picture-width: calc((100vw - 60upx - 24px) / 3);

.form-item {
  margin: $uni-spacing-col-lg $page-row-spacing;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: $uni-spacing-row-lg;
  padding: 16rpx 0;

  &.column {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .label {
    font-size: $uni-font-size-base;
    font-weight: bold;
	@include color(color-dark);
	.required{
		display: inline-flex;
		color: red;
		margin-left: 10rpx;
		font-weight: bold;
	}
  }

  .input-wrapper {
    flex: 1;
    text-align: right
  }

  .textarea-wrapper {
    width: 100%;
  }

  .checkbox-wrapper {
    .group-wrapper {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-row-gap: $uni-spacing-row-base;

      .item-wrapper {
        display: flex;
        align-items: flex-start;
        font-size: $uni-font-size-base;
        color: $uni-text-color;
      }
    }
  }

  .tags-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: $uni-spacing-row-sm;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50rpx;
      background: $uni-bg-color-hover;
      color: $uni-text-color;
      font-size: $uni-font-size-base;
      transition: all 0.05s;

      &.active {
        background: $uni-color-follow;
        color: $uni-color-follow-font;
      }
    }
  }

  .placeholder {
    color: $uni-text-color-grey;
  }

  .select-picture-wrapper {
    margin: 24rpx 0;
    display: grid;
    grid-template-columns: repeat(3, $picture-width);
    grid-column-gap: $uni-spacing-col-lg;
    grid-row-gap: $uni-spacing-row-lg;

    .picture-wrapper {
      position: relative;
      height: $picture-width;
      background: $uni-bg-color-grey;
      border-radius: $uni-border-radius-lg;

      .picture {
        width: 100%;
        height: 100%;
        border-radius: $uni-border-radius-lg;
      }

      .close-icon {
        position: absolute;
        top: 12rpx;
        right: 12rpx;
      }

      .video-play-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .plus-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: $uni-spacing-col-lg;

      .label {
        color: $uni-text-color-grey;
      }
    }
  }
}
</style>
