<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="纸条发布" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="note-creat-page" :style="'min-height: '+ contentHieght +';'">
			<view class="container flex-row">
				<view class="textarea-box">
					<textarea v-model="formData.content" maxlength="2000" auto-height="true" placeholder="分享灵感和作品"></textarea>
				</view>
				<scroll-view scroll-x="true" class="scroll">
					<view class="scroll_box">
						<view v-if="type==0" class="add flex-row" @click="openFile">＋</view>
						<block v-if="type==1">
							<view class="img-box" v-for="(item,idx) in pic_arr" :key="id">
								<image class="pic" :src="item.url" mode="aspectFill"></image>
								<view class="del flex-row" @click="delImg(idx)">＋</view>
								<view class="sort-box flex-row" v-if="pic_arr.length>1">
									<view class="sort-box-item flex-row" :style="{color:idx>0?'#fff':'#cecece'}"
										@click.stop="onSort(idx,0)">←
									</view>
									<view class="sort-box-item flex-row" :style="{color:idx<pic_arr.length-1?'#fff':'#cecece'}"
										@click.stop="onSort(idx,1)">→</view>
								</view>
							</view>
							<view @click="addImg(1)" class="add flex-row">＋</view>
						</block>
						<block v-if="type==2">
							<view class="img-box">
								<video class="pic" :src="video.url"></video>
								<view class="del flex-row" @click="delVideoImg(1)">＋</view>
							</view>
							<view v-if="video.img" class="img-box">
								<image class="pic" :src="video.img" mode="aspectFill"></image>
								<view class="del flex-row" @click="delVideoImg(2)">＋</view>
							</view>
							<view v-else @click="addImg(2)" class="add flex-row">
								＋<view>视频封面，建议与视频尺寸保持一致</view>
							</view>
						</block>
					</view>
				</scroll-view>
				<view class="topic-box flex-row">
					<view class="topic-item flex-row" @click="openCircle">
						<image src="/static/img/qz.png"></image>
						<view class="name">{{circle?circle:'选择圈子'}}</view>
					</view>
					<view class="topic-item flex-row" @click="locationClick">
						<image src="/static/img/dw.png"></image>
						<view class="name ohto">{{adds.name?adds.name:'添加位置'}}</view>
					</view>
				</view>
				<view class="footer">
					<view class="footer_box flex-row">
						<view class="tips flex-row" @click="openTipsPopup">
							<view class="tips-item flex-row">
								<image src="/static/img/ts.png"></image>
							</view>
							<text>小贴士</text>
						</view>
						<view class="btn flex-row" @click="saveDynamic">
							<text>发布动态</text>
							<view v-if="integral">/ +{{ integral }} 积分</view>
						</view>
					</view>
				</view>
				<!-- Tips Popup -->
				<u-popup ref="filePopup" type="center">
					<view class="file-box flex-row">
						<view class="file-item flex-row" @click="addVideo">
							<image :src="insetUrl+'video.png'" />
							<text>添加视频</text>
						</view>
						<view class="file-line"></view>
						<view class="file-item flex-row" @click="addImg(1)">
							<image :src="insetUrl+'image.png'" />
							<text>添加图片</text>
						</view>
					</view>
				</u-popup>
				<u-popup ref="circlePopup" type="bottom" :safe-area="false">
					<view class="circle-popup">
						<view v-if="!circlearr.length">
							<view class="empty-box">
								<image :src="insetUrl+'6.png'" mode="aspectFill" />
								<view class="text flex-row">
									<view>没有圈子，</view>
									<view @click="toCircle" style="color: #FFA676;">去关注一个</view>
								</view>
							</view>
						</view>
						<block v-else>
							<view class="circle-box">
								<view class="circle-wrap">
									<block v-for="(v,i) in circlearr" :key="i">
										<view class="circle-item flex-row" @click="circleClick" :data-i="i"
											:class="{'active':circle_id==v.id}">
											<image :src="v.avatar" mode="aspectFill"></image>
											<text>{{ v.name }}</text>
										</view>
									</block>
								</view>
							</view>
							<view class="circle-btn flex-row">
								<view class="btn1" @click="closeCircle(1)">暂不选择</view>
								<view class="btn2" @click="closeCircle(0)">确定</view>
							</view>
						</block>
					</view>
				</u-popup>
				<u-popup ref="addPopup" type="center">
					<view class="tips-popup flex-row">
						<view class="tips-popup-t1">发布小贴士</view>
						<view class="tips-popup-t2">我们鼓励向上、真实、原创的内容，含以下内容的动态将不会被推荐：</view>
						<view class="tips-popup-t2">1. 含有不文明语言、过度性感图片；</view>
						<view class="tips-popup-t2">2. 含有投资股票、基金、涉政等信息；</view>
						<view class="tips-popup-t2">3. 冒充他人身份或搬运他人作品；</view>
						<view class="tips-popup-t2">4. 通过有奖方式诱导他人收藏、评论、转发、关注；</view>
						<view class="tips-popup-t2">5. 为刻意搏眼球，在内容、图片等处使用夸张表达。</view>
						<view class="tips-popup-btn flex-row" @click="closeTipsPopup"> 我知道了</view>
					</view>
				</u-popup>
				<u-popup ref="tipsPopup" type="top" mask-background-color="rgba(0, 0, 0, 0)">
					<view class="tips-box flex-row">
						<view class="tips-item">{{tips_title}}</view>
					</view>
				</u-popup>
			</view>
		</view>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{
		contentHieght: {
			get() {
			  let that = this;
			  return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px )';
			}
		}
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 38,
			formData: {
				content: ''
			},
			insetUrl: '',
			id: 0,
			integral: 0,
			type: 0,
			pic_arr: [],
			video: {
				high: 0,
				wide: 0,
				url: '',
				img: '',
			},
			circle: '',
			circle_id: 0,
			circlearr: [],
			adds: {},
			tips_title: '',
			isaddVideo: false,
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(38, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
	  
	}
}
</script>

<style lang="scss" scoped>
@import './creat.scss';
</style>