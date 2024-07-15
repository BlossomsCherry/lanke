<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view :class="'mini-page-body ' + (isBack ? '' : 'tabbar') ">
		
	<navBar :back="false" :home="false" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'" :scene="131">
		
		<view slot="left" class="left-more-wrap">
			<block v-if="isBack">
				<view class="capsule">
					<i class="mini-icon mini-zuojiantou" @tap.stop.prevent="toSliderUrl(-2, 0)"></i>
					<view class="line"></view>
					<i class="mini-icon mini-gengduo1" @tap.stop.prevent="shutSettingPopup"></i>
				</view>
			</block>
			<block v-else>
				<view class="lxy-nav-bar__logo">
					<i class="mini-icon mini-gengduo1" @tap.stop.prevent="shutSettingPopup"></i>
				</view>
			</block>
		</view>
		
		<view slot="center" class="nav-bar-center-box" @click.stop="collapseClick">
			<view class="text" :style="{color: currentWeek!==thisWeek?'red': (global__theme__ == 'black' ? '#ffffff' : '#000000')}">
				第{{currentWeek}}周<text v-if="currentWeek!==thisWeek">(非本周)</text>
			</view>
			<block>
				<i class="mini-icon mini-shangjiantou" v-if="collapseStatus % 2 === 0"></i>
				<i class="mini-icon mini-xiajiantou" v-else></i>
			</block>
		</view>
		
		<!-- #ifndef MP -->
		
		<view slot="right" :style="isBack ? 'width: 72px;' : 'width: 32px;'">
			
		</view>
		<!-- #endif -->
		
	</navBar>

	<view class="curriculum-container">
		<u-collapse :border="false">
		    <u-collapse-item :status="collapseStatus">
		      <scroll-view class="week-scroll-container" scroll-x="true"
		      	:scroll-into-view="`week_${currentWeek}`" scroll-with-animation>
		      	<view class="flex-row">
					<view v-for="(weekCourseList, weekCourseListIndex) in handledCourseList"
						:key="weekCourseListIndex" :id="`week_${weekCourseListIndex+1}`" :class="'week-item ' + ((weekCourseListIndex+1)===currentWeek ? 'current' : '')" @click.stop="currentWeek=weekCourseListIndex+1">
						<view class="text">
							<text>第{{ weekCourseListIndex+1 }}周</text>
							<text v-if="thisWeek===weekCourseListIndex+1">(本)</text>
						</view>
						<view class="week-item-curriculum">
							<view v-for="(courseList, courseListIndex) in weekCourseList" :key="courseListIndex"
								class="curriculum-week-item">
								<view v-for="(course , courseIndex) in courseList" :key="courseIndex" v-if="course.sectionCount > 0"
									class="curriculum-box"
									:style="{'height': `calc(${weekCourseHeight} * ${course.sectionCount})`,'width':weekCourseHeight}">
									<view :class="'course-box ' + (course.name ? 'has' : '')"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
		      </scroll-view>
		    </u-collapse-item>
		</u-collapse>
			<view class="top-container">
				<view class="left-box">
					<view class="text">
						{{ currentMonth }}
					</view>
					<view class="text">
						月
					</view>
				</view>
				<view class="right-box">
					<view class="day-grid-container">
						<view v-for="(day, index) in dayNameList" :key="index" class="day-grid-item"
							:class="{active: thisWeek===currentWeek&&currentDay===startDay%7+index}">
							<view class="day">
								{{ dayNameList[(startDay+index)%7] }}
							</view>
							<view class="date">
								{{ dayDate(index) }}
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<scroll-view scroll-y="true" class="_scroll_view" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
				<view class="bottom-container">
					<view class="left-box">
						<block v-for="(item, index) in timeSlotsPerDay" :key="index" v-if="university.class_time && university.class_time.length > 0">
							<view class="time-item"
								:style="{'height': courseHeight}">
								<view class="number">
									{{ index+1 }}
								</view>
								<view class="time">
									{{ index<=(university.class_time.length-1)?university.class_time[index].startTime:'' }}
								</view>
								<view class="time">
									{{ index<=(university.class_time.length-1)?university.class_time[index].endTime:'' }}
								</view>
							</view>
							<view v-if="(index + 1) % 4 === 0" class="rest-gag">
								
							</view>
						</block>
					</view>
					<view class="right-box">
						<block v-if="myUserInfo.id > 0">
							<swiper class="curriculum-swiper-container" :current="currentWeek-1" :duration="300" @change="swiperChange">
								<swiper-item v-for="(weekCourseList, weekCourseListIndex) in handledCourseList"
									:key="weekCourseListIndex" class="curriculum-swiper-item">
									<view v-for="(courseList, courseListIndex) in weekCourseList" :key="courseListIndex" class="curriculum-week-item">
										<block v-for="(course , courseIndex) in courseList" :key="courseIndex">
											<view v-if="course.sectionCount > 0" class="curriculum-box" :style="{'height': `calc(${courseHeight} * ${course.sectionCount})`,'opacity': (100-opacity)/100}" @click.stop="clickCourse(course)">
												<view v-if="course.name" class="course-padding-box" :style="{'background-color': course ? course.bgColor : 'unset'}">
													<view class="course-box">
														{{ dealText(truncateString(course.name,99) +'⭐'+ course.address) }}
													</view>
												</view>
											</view>
											<view v-if="(courseIndex + 1) % 4 === 0" class="rest-gag">
												<block v-if="courseListIndex == 3">
													<block v-if="courseIndex < 5">
														午
														<view style="width: 10rpx;"></view>
														休
													</block>
													<block v-else-if="courseIndex < 8">
														晚
														<view style="width: 10rpx;"></view>
														休
													</block>
												</block>
											</view>
										</block>
									</view>
								</swiper-item>
							</swiper>
						</block>
						<block v-else>
							<view class="login-tip">
								<view class="_btn" @tap.stop.prevent="toSliderUrl(-4, null)">立即登录</view>
							</view>
						</block>
					</view>
				</view>
				<view style="height: 30rpx;background-color: transparent;"></view>
			</scroll-view>
	</view>
	
	<u-popup :show="myUserInfo.id > 0 && !(myUserInfo.university && myUserInfo.university.length > 0)" :zIndex="99999991009" mode="bottom" :safeAreaInsetBottom="false">
		<view class="no-university-warap">
			<view class="inner">
				<view class="title">
					暂未学生认证
				</view>
				<view class="flex-row">
					<image class="_image" :src=" homeUrl + '/storage/images/student_certi.jpg' " mode="aspectFit"></image>
				</view>
				<view class="btn" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/editmine/editmine')">前往认证</view>
			</view>
		</view>
	</u-popup>
	
	<u-popup :show="settingPopup" :zIndex="99999991009" mode="bottom" :safeAreaInsetBottom="false" @close="shutSettingPopup">
		<view class="setting-warap">
			<view class="inner">
				<view class="title">
					设置
					<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutSettingPopup"></i>
				</view>
				<view class="content">
					<view style="height: 30rpx;"></view>
					<view class="line-item flex-row" @tap.stop.prevent="shutLoginJiaowuPopup(1)">
						<view class="tip">从教务处导入</view>
						<view class="icon">
							<i class="mini-icon mini-youjiantou"></i>
						</view>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
	
	<u-popup :show="loginJiaowuPopup" :zIndex="99999991009" mode="bottom" :safeAreaInsetBottom="false" @close="shutLoginJiaowuPopup">
		<view class="jiaowu-login-warap">
			<view class="inner">
				<view class="title">
					教务处登录
					<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutLoginJiaowuPopup"></i>
				</view>
				<view class="content">
					<view style="height: 40rpx;"></view>
					<view class="school-name">
						{{ myUserInfo.university }}
					</view>
					<view style="height: 40rpx;"></view>
					<view class="account">
						<view class="line">
							<view class="line-tip">账号 *</view>
							<view class="_input_wrap">
								<input class="_input" v-model=" jiaowuAccount.name " placeholder="请输入教务账号" :cursor-spacing="30" />
							</view>
						</view>
						<view style="height: 40rpx;"></view>
						<view class="line">
							<view class="line-tip">密码 *</view>
							<view class="_input_wrap">
								<input class="_input" v-model=" jiaowuAccount.password " placeholder="请输入教务系统密码"  :cursor-spacing="30"/>
							</view>
						</view>
					</view>
					<view style="height: 40rpx;"></view>
					<view class="bottons">
						<u-row>
							<u-col span="5.9">
								<u-button @click="shutLoginJiaowuPopup">取消</u-button>
							</u-col>
							<u-col span="0.2"></u-col>
							<u-col span="5.9">
								<u-button @click="jiaowuLogin" type="primary" throttleTime="1000" :disabled="!(jiaowuAccount.name.length > 0 && jiaowuAccount.password.length > 0)">确认</u-button>
							</u-col>
						</u-row>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
	
	
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
	
	let cookie = '';
	let realCourseList = [];
	
	export default {
		mixins: [{ methods: options }],
		components: {
			myToast,navBar,hoverBall,
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 131,
				collapseStatus: 1,
				isBack: false,
				tenant_id: 0,
				university: {
					sid: '',
					class_time: [{"startTime":"08:00","endTime":"08:40"},{"startTime":"08:45","endTime":"09:25"},
					{"startTime":"09:40","endTime":"10:20"},{"startTime":"10:35","endTime":"11:15"},
					{"startTime":"11:20","endTime":"12:00"},{"startTime":"13:30","endTime":"14:10"},
					{"startTime":"14:15","endTime":"14:55"},{"startTime":"15:10","endTime":"15:50"},
					{"startTime":"15:55","endTime":"16:35"},{"startTime":"18:30","endTime":"19:10"},
					{"startTime":"19:20","endTime":"20:00"},{"startTime":"20:20","endTime":"20:50"}]
				},
				jiaowuAccount: {
					name: '',
					password: ''
				},
				handledCourseList: [],
				
				settingPopup: false,
				loginJiaowuPopup: false,
				
				weekCourseHeight: '20rpx', // 周缩略图高度
				courseHeight: '140rpx', // 课程块高度
				
				opacity: 0, // 课表透明度
				thisWeek: 1, // 本周
				currentWeek: 1, // 当前周
				semesterStarDate: '2024/03/04', // 开学日期
				startDay: 1, // 每周起始日, 0-6依次为周日至周六
				timeSlotsPerDay: 12, // 一天的时间段数量
				dayNameList: ['日', '一', '二', '三', '四', '五', '六'], // 星期名称
			};
		},
		computed: {
			contentHieght: {
			  get() {
			    let that = this;
						if(that.isBack){
							return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px - 80rpx )';
						}else{
							// #ifdef MP
							return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px - 170rpx - env(safe-area-inset-bottom) )';
							// #endif
							// #ifdef APP
							return ' calc(100vh - ' + that.$store.state.CustomBar + 'px - 80rpx ) ';
							// #endif
							// #ifdef H5
							return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px - 45px - 80rpx )';
							// #endif
						}
			  },
			  set(v) {}
			},
			
			// 当前月
			currentMonth() {
				let date = new Date(this.semesterStarDate)
				date.setDate(date.getDate() + (this.currentWeek - 1) * 7)
				let month = date.getMonth() + 1
				return month
			},
			// 当前天(周几)
			currentDay() {
				// 创建一个表示当前日期和时间的Date对象
				const today = new Date()
				// 获取星期几，返回值是一个从0到6的整数，0表示星期日，1表示星期一，以此类推
				const dayOfWeek = today.getDay()
				// 将0-6的值转换为1-7表示的星期
				return (dayOfWeek === 0) ? 7 : dayOfWeek
			},
			homeUrl: {
				get() {
					return uni.wen.api.homeUrl;
				},
				set(v) {
					
				}
			}
			
		},
		onShow: function () {
			let that = this;

			// #ifdef MP-WEIXIN
			getApp().globalData.$mpTabbar = this.$mp.page.getTabBar();
			// #endif
			
			//  #ifdef MP
			that.tabBarSetData({selected: 1});
			// #endif
			//  #ifndef MP
			that.$store.commit('updateTabbarIndex', 1)
			// #endif
						
			that.updateScene(131, 0);
					
			that.getSysMessageCount().then(function (res) {
			  //  #ifdef MP
			  that.tabBarSetData({
			    sysMessageCount: res
			  });
			  // #endif
					
					
			  if(res > 0){
			  	that.$store.commit('updateSysMessageCount', res);
			  }else{
			  	that.$store.commit('updateSysMessageCount', 0);
			  }
			});
			
			
			if(that.tenant_id != that.$store.state.tenant.tenant_id){
				uni.startPullDownRefresh();
			}
			
			if(that.myUserInfo.id > 0 && that.myUserInfo.university && that.myUserInfo.university.length > 0){
				if(cookie && cookie.length > 0){
					
				}else{
					that.shutSettingPopup();
				}
			}
			
		},
		onLoad: function (options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			if (options.back == 1) {
			  that.isBack = true;
			}
			
			let jiaowuAccount = uni.getStorageSync('jiaowuAccount');
			if(jiaowuAccount && jiaowuAccount.name && jiaowuAccount.name.length > 0){
				that.jiaowuAccount = jiaowuAccount;
			}
			
			let jiaowuCookie = uni.getStorageSync('jiaowuCookie');
			if(jiaowuCookie && jiaowuCookie.length > 0){
				cookie = jiaowuCookie;
			}
			
			let handledCourseList = uni.getStorageSync('handledCourseList');
			if(handledCourseList && handledCourseList.length > 0){
				that.handledCourseList = handledCourseList;
			}
			
			that.initData();
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		onTabItemTap : function(e) {
			// #ifndef MP-WEIXIN
			if(e.pagePath == 'pages/tabbar/schedule/schedule'){
				uni.wen.util.doVibrateShort();
			}
			// #endif
		},
		onShareAppMessage: function (res) {
		  let that = this;
		  return {
		    title: '课程表 - ' + that.$store.state.config.about.name,
		    path: 'pages/' + (that.isBack ? 'tabbar_clone' : 'tabbar') + '/schedule/schedule?back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
		    imageUrl: that.$store.state.config.img.default_share
		  };
		},
		onShareTimeline: function (res) {
		  let that = this;
		  return {
		    title: '课程表 - ' + that.$store.state.config.about.name,
		    query: '' + 'back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
		    imageUrl: that.$store.state.config.img.default_share
		  };
		},
		methods: {
			handlerCourseList() {
				let that = this;
				/**
				 * 总共的周数
				 */
				let weeksTotal = 20;
				/**
				 * 一周的天数
				 */
				let daysPerWeek = 7;
				

				/**
				 * 课程格子背景颜色
				 */
				let bgColorList = [
					"#e66868",
					"#9fe01c",
					"#f775c3",
					"#8f71f1",
					"#37e78c",
					"#fcb934",
					"#f38458",
					"#79cc5d",
					"#5db3bb",
					"#d3776c",
					"#578dda",
					"#ce9560",
					"#911ea5"
				];
				
				const groupedData = Array.from({
						length: weeksTotal
					}, () =>
					Array.from({
							length: daysPerWeek
						}, () =>
						Array.from({
							length: that.timeSlotsPerDay
						}, (_, index) => ({
							section: index + 1,
							sectionCount: 1
						}))
					)
				);
				
				const courseMap = new Map();
				// 将每个课程放入对应日期的数组中
				for (const course of realCourseList) {
					const courseKey = `${course.name}_${course.teacher}`;
					if (!courseMap.has(courseKey)) {
						courseMap.set(courseKey, bgColorList[courseMap.size % bgColorList.length]);
					}
					for (const week of course.weeks) {
						const weekIndex = week - 1;
						const dayIndex = (course.week + daysPerWeek - that.startDay) % daysPerWeek;
				
						let removeIndex = groupedData[weekIndex][dayIndex].findIndex(item => item.section === course
							.section);
						// 先删除再增加
						groupedData[weekIndex][dayIndex].splice(removeIndex, course.sectionCount);
						groupedData[weekIndex][dayIndex].splice(removeIndex, 0, {
							...course,
							bgColor: courseMap.get(courseKey)
						});
						if(course.sectionCount > 1){
							groupedData[weekIndex][dayIndex].splice(removeIndex + 1, 0, {sectionCount: 0});
						}
					}
				}
				console.log(groupedData);
				that.handledCourseList = groupedData;
				uni.setStorageSync('handledCourseList', groupedData);
			},
			initData(){
				const currentDate = new Date()
				const targetDate = new Date(this.semesterStarDate)
				// 将日期转换为毫秒数，并计算它们之间的差异
				const differenceInTime = currentDate.getTime() - targetDate.getTime()
				// 将毫秒数转换为天数
				const differenceInDays = differenceInTime / (1000 * 3600 * 24)
				// 计算相隔的周数，向上取整
				const differenceInWeeks = Math.ceil(differenceInDays / 7)
				// 初始化当前周
				this.currentWeek = differenceInWeeks
				// 初始化本周
				this.thisWeek = differenceInWeeks
			},
			jiaowuLogin(){
				let that = this;
				const _login = function() {
					return new Promise((resolve, reject) => {
						try{
							uni.loading(true);
							uni.request({
								url: uni.wen.api.JiaoWuUrl + 'login/' + that.university.sid,
								dataType: 'json',
								// responseType: 'json',// 微信小程序会不走回调
								method: 'POST',
								data: {
									stuId: that.jiaowuAccount.name,
									password: that.jiaowuAccount.password
								},
								success: (res) => {
									console.log('res', res)
									if (res.statusCode == 200) {
										if(res.data.status){
											cookie = res.data.data.cookie;
											uni.setStorageSync('jiaowuAccount', that.jiaowuAccount);
											uni.setStorageSync('jiaowuCookie', cookie);
											resolve({
												cookie
											});
										}else{
											uni.showToast({
												title: res.data.msg,
												icon: 'none'
											})
										}
									}else{
										console.log('xxx');
									}
								},
								fail: (err) => {
									reject(err) // 失败时调用 reject，并传递错误信息
								},
								complete: () => {
									uni.loading(false);
								}
							})
							
						}catch(e){
							//TODO handle the exception
							uni.showToast({
								title: '登录失败',
								icon: 'none'
							})
						}
					})
				};
				
				_login().then((res) =>{
					// 获取课表
					that.getCourses().then((res) =>{
						// 获取课表
						that.shutLoginJiaowuPopup();
					});
				}).catch((err) => {
					uni.showToast({
						title: '登录失败',
						icon: 'none'
					})
				});
			},
			clickCourse(course){
				let that = this;
				uni.wen.toUrl(6, '/pagesS/student/course/course?course=' + encodeURIComponent(JSON.stringify(course)), that);
			},
			getCourses() {
				let that = this;
				return new Promise((resolve, reject) => {
					uni.loading(true);
					uni.request({
						url: uni.wen.api.JiaoWuUrl + 'courses/' + that.university.sid,
						dataType: 'json',
						// responseType: 'json',// 微信小程序会不走回调
						method: 'GET',
						header: {
							token: cookie,
						},
						success: (res) => {
							if (res.statusCode == 200) {
								if(res.data.status){
									realCourseList = res.data.data;
									that.handlerCourseList();
									resolve({});
								}else{
									uni.showToast({
										title: res.data.msg,
										icon: 'none'
									})
									reject({})
								}
							}else{
								reject({})
							}
						},
						fail: (err) => {
							reject(err) // 失败时调用 reject，并传递错误信息
						},
						complete: () => {
							uni.loading(false);
						}
					})
				})
			},
			getSchool(){
				let that = this;
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/university', {page: 1, user_id: that.myUserInfo.id }).then(res => {
				    if (res.status) {
						that.university = res.data.data[0];
					}
				});
			},
			shutLoginJiaowuPopup(flag = 0){
				let that = this;
				if(flag == 1){
					that.shutSettingPopup();
					setTimeout(function(){
						that.loginJiaowuPopup = !that.loginJiaowuPopup;
					}, 300);
				}else{
					that.loginJiaowuPopup = !that.loginJiaowuPopup;
				}
				
				if(that.university.sid.length <= 0){
					that.getSchool();
				}
			},
			shutSettingPopup(){
				this.settingPopup = !this.settingPopup;
			},
			collapseClick(){
				let that = this;
				that.collapseStatus += 1;
			},
			// 处理文字
			dealText(text) {
				// 使用正则表达式替换
				return text
					.replace(/（/g, '(').replace(/）/g, ')') // 替换中文括号为英文括号
					.replace(/\s+/g, '') // 去掉空格
					.replace(/[\r\n]/g, '') // 去掉回车
			},
			// 超出部分显示省略号
			truncateString(str, maxLength) {
				if (str.length > maxLength) {
					return str.slice(0, maxLength) + '..';
				} else {
					return str;
				}
			},
			// 天日期
			dayDate(index) {
				let date = new Date(this.semesterStarDate)
				date.setDate(date.getDate() + (this.currentWeek - 1) * 7 + index)
				let day = date.getDate()
				if (day === 1) {
					return `${date.getMonth() + 1}月`
				} else {
					return day
				}
			},
			// 课程轮播切换
			swiperChange(e) {
				this.currentWeek = parseInt(e.detail.current) + 1
			}
		}
	}
</script>

<style scoped lang="scss">
@import './schedule.scss';
</style>