<script>
import PetAdoptionFormItem from "@/pagesP/pet-adoption/components/pet-adoption-form-item.vue";
import PetAdoptionBottomBtn from "@/pagesP/pet-adoption/components/pet-adoption-bottom-btn.vue";

export default {
  components: { PetAdoptionBottomBtn, PetAdoptionFormItem },
  data() {
    return {
      ageRange: [{ label: '0-1岁', value: 1 }, { label: '2-6岁', value: 2 }, { label: '7-10岁', value: 3 }],
      genderRange: [{ label: '男孩', value: 1 }, { label: '女孩', value: 2 }],
      petStatusRange: [{ label: '已绝育', value: 1 }, { label: '已免疫', value: 2 }, { label: '已驱虫', value: 3 }],
      searchForm: {
        filter_age_range: [],
        filter_gender_range: [],
        filter_pet_status_range: []
      }
    }
  },

  methods: {
    // 回退到上一页，并发送消息告诉首页进行条件查询
    navigateBack() {
	  let searchForm = this.searchForm;
      uni.$emit('searchPetAdoptionHomeList', { type: 'filterForm', params: searchForm })
      uni.navigateBack({ delta: 1 })
    }
  }
}
</script>

<template>
  <view class="pet-filter-page">
    <pet-adoption-form-item v-model="searchForm.filter_age_range" type="tag-multiple" label="年龄" position="top" :range="ageRange" tag-size="lg"/>
    <pet-adoption-form-item v-model="searchForm.filter_gender_range" type="tag-multiple" label="性别" position="top" :range="genderRange" tag-size="lg"/>
    <pet-adoption-form-item v-model="searchForm.filter_pet_status_range" type="tag-multiple" label="身体状况" position="top" :range="petStatusRange" tag-size="lg"/>

    <!-- 底部按钮栏 -->
    <pet-adoption-bottom-btn right-text="确定" :leftCondition="false" @rightBtnHandle="navigateBack"/>
  </view>
</template>

<style lang="scss" scoped>
.pet-filter-page {
  margin: $uni-spacing-col-lg 0;
}
</style>
