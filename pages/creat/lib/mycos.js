import { postPolicy } from "./post-policy";

function unique_uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
  
    var uuid = s.join("");
    return uuid;
}

// #ifdef MP
/** 
var COS = require('./cos-wx-sdk-v5.min');
var cos = new COS({
	// ForcePathStyle: true, // 如果使用了很多存储桶，可以通过打开后缀式，减少配置白名单域名数量，请求时会用地域域名
	SimpleUploadMethod: 'putObject', // 强烈建议，高级上传、批量上传内部对小文件做简单上传时使用putObject,sdk版本至少需要v1.3.0
	getAuthorization: function(options, callback) {
		// 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
		// 异步获取临时密钥	
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'files/credentials',{action: 'put'}, 'POST',).then(res => {
			if(res.status){
				let credentials = res.data.credentials;
				callback({
					TmpSecretId: credentials.tmpSecretId,
					TmpSecretKey: credentials.tmpSecretKey,
					// v1.2.0之前版本的 SDK 使用 XCosSecurityToken 而不是 SecurityToken
					SecurityToken: credentials.sessionToken,
					// 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
					StartTime: res.data.startTime, // 时间戳，单位秒，如：1580000000
					ExpiredTime: res.data.expiredTime, // 时间戳，单位秒，如：1580000900
				});
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
			}
			
		})

	}
});
**/
// #endif

const cosPut = function(that, filePath, key){
	return new Promise(function (resolve, reject) {
		postPolicy(key).then(function(credentials){
			const {
			  cosHost,
			  cosKey,
			  policy,
			  qSignAlgorithm,
			  qAk,
			  qKeyTime,
			  qSignature,
			  securityToken
			} = credentials;
			var formData = {
			  key: cosKey,
			  policy: policy, // 这个传 policy 的 base64 字符串
			  success_action_status: 200,
			  "x-cos-security-token": securityToken,
			  "q-sign-algorithm": qSignAlgorithm,
			  "q-ak": qAk,
			  "q-key-time": qKeyTime,
			  "q-signature": qSignature,
			};
			
			let uploadTask = uni.uploadFile({
			  url: "https://" + cosHost, //仅为示例，非真实的接口地址
			  filePath: filePath,
			  name: "file",
			  formData,
			  success: (res) => {
			    if (![200, 204].includes(res.statusCode)) reject(res);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'files/callback', {'data': res, 'key': key}, 'POST').then(function (res1) {
				    if (res1.status) {
						resolve({
							url: res1.data.url
						});
				    } else {
				        uni.showToast({
				            title: res1.message,
				            icon: 'none',
				            duration: 1500
				        });
						reject(res1)
				    }
				});
			  },
			  error(err) {
			    console.log("%c Line:107 ?? err", "color:#4fff4B", err);
			    reject(err);
			  },
			});
			
			uploadTask.onProgressUpdate(function(res){
				that.videoProgress = res.progress;
			});
			
			
		});
		
		// #ifdef MP
		return false;
		let intelval = null;
		var wxfs = uni.getFileSystemManager();
		wxfs.readFile({
			filePath: filePath,
			success: function(res) {
				
				cos.putObject({
					Bucket: uni.$store.state.config2.cos.bucket,
					Region: uni.$store.state.config2.cos.region,
					Key: key, //临时路径 后台截取获取
					Body: res.data, // Body里传入的是文件内容
					onProgress: function (progressData) {
						let percent = progressData.percent * 100;
						console.log(that.videoProgress);
						if(percent === 0){
							if(that.videoProgress > 0){
								setInterval(function(){
									
									if(that.videoProgress == 0 || that.videoProgress == 100){
										clearInterval(intelval);
										return false;
									}
									
									let min = Math.ceil(-3);
									let max = Math.floor(3);
									let rand = Math.floor(Math.random() * (max - min + 1)) + min;

									let gap = 100 - that.videoProgress;
									if(gap > 50){
										that.videoProgress += Math.floor(gap / (10 + rand));
									}else{
										that.videoProgress += Math.floor(gap / (5 + rand) );
									}
									console.log(that.videoProgress);
								}, 1000);
							}else{
								clearInterval(intelval);
							}
						}else if(percent == 100){
							clearInterval(intelval);
							that.videoProgress = 100;
						}else{
							clearInterval(intelval);
						}
					},
				}, (err, data) => {
					if (data.statusCode == 200) {
						uni.wen.util.request(uni.wen.api.ApiRootUrl + 'files/callback', {'data': data, 'key': key}, 'POST').then(function (res1) {
						    if (res1.status) {
								resolve({
									url: res1.data.url
								});
						    } else {
						        uni.showToast({
						            title: res1.message,
						            icon: 'none',
						            duration: 1500
						        });
								reject(res1)
						    }
						});
					}else {
						reject(err)
					}
				});
			},
			fail: function(err) {
				reject(err)
			},
		});
		// #endif
	});
}

const cosUploadPictures = function (that, type, name, count = 1) {

	let uploadPictures_ = function(sourceType, type, name, count = 1){
		if (type === 1) {
		    uni.chooseImage({
		        count: count,
		        sourceType: [sourceType],
		        sizeType: ['original'],
		
		        success(res) {
		            uni.loading(true);
		            const tempFilePaths = res.tempFilePaths;
		            uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[0], 3).then(function (res) {
		                uni.loading(false);
		                if (res.status) {
		                    that[name] = res.data
		                } else {
		                    uni.showToast({
		                        title: res.message,
		                        icon: 'none',
		                        duration: 1500
		                    });
		                }
		            });
		        },
		
		        fail(err) {
		
		        }
		    });
		} else if (type === 2) {
		    uni.chooseImage({
		        count: count, //name
		        sourceType: [sourceType],
		        sizeType: ['original'],
		        success(res) {
		            uni.loading(true);
		            const tempFilePaths = res.tempFilePaths;
		
		
		            for (let i in tempFilePaths) {
		                uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[i], 3).then(function (res) {
		                    uni.loading(false);
		                    if (res.status) {
		                        var image_urls = that.image_urls;
		                        var images = {};
		                        images.url = res.data;
		                        image_urls.push(images);
		                        that.image_urls = image_urls;
		                    } else {
		                        uni.showToast({
		                            title: res.message,
		                            icon: 'none',
		                            duration: 1500
		                        });
		                    }
		                });
		            }
		        },
		
		        fail(err) {
		
		        }
		    });
		} else if (type === 3) {
		
		    // #ifdef MP
		
		    uni.chooseMedia({
		        mediaType: ['video'],
		        sourceType: [sourceType],
		        maxDuration: 60,
		        camera: 'back',
		
		        success(res) {
		            let tempFiles = res.tempFiles[0];
		
		            that.video_height = tempFiles.height,
		            that.video_width = tempFiles.width
		
		            let thumbTempFilePath = tempFiles.thumbTempFilePath;
					
					var currentDate = new Date();
					
					// 获取年、月、日信息
					var year = currentDate.getFullYear();
					var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // +1是因为月份是从0开始计数的
					var day = currentDate.getDate().toString().padStart(2, '0');
					
					// 生成日期字符串
					let ext = '.mp4';
					if(tempFiles.tempFilePath.endsWith('.mp4')){
						
					}else if(tempFiles.tempFilePath.endsWith('.m4v')){
						ext = '.m4v';
					}else if(tempFiles.tempFilePath.endsWith('.mov')){
						ext = '.mov';
					}else if(tempFiles.tempFilePath.endsWith('.wmv')){
						ext = '.wmv';
					}else if(tempFiles.tempFilePath.endsWith('.rmvb')){
						ext = '.rmvb';
					}else if(tempFiles.tempFilePath.endsWith('.flv')){
						ext = '.flv';
					}else if(tempFiles.tempFilePath.endsWith('.avi')){
						ext = '.avi';
					}else if(tempFiles.tempFilePath.endsWith('.mpg')){
						ext = '.mpg';
					}else if(tempFiles.tempFilePath.endsWith('.mpeg')){
						ext = '.mpeg';
					}
					let key = year + '/' + month + '/' + day + '/' + uni.$store.state.userInfo.id + '/' + unique_uuid() + ext;
					that.videoProgress = 1;
					cosPut(that, tempFiles.tempFilePath, key).then((res1)=>{
						that[name] = res1.url;
						setTimeout(function(){
							that.videoProgress = 0;
						}, 200);
						uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', thumbTempFilePath, 3).then(function (data) {
						    that.video_thumb_url = data.data;
						});
					});
					return false;
		        },
		
		        fail(err) {
		
		        }
		    });
		    // #endif
		
		    // #ifdef APP || H5
			
			uni.chooseVideo({
			    mediaType: ['video'],
			    sourceType: [sourceType],
			    maxDuration: 60,
			    compressed: that.$store.state.config.page.create.video_press == 1,
			    camera: 'back',
			    success: function (res) {
			        // self.src = res.tempFilePath;
			        let tempFilePath = res.tempFilePath;
			        that.video_height = res.height;
			        that.video_width = res.width;
					
					var currentDate = new Date();
					
					// 获取年、月、日信息
					var year = currentDate.getFullYear();
					var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // +1是因为月份是从0开始计数的
					var day = currentDate.getDate().toString().padStart(2, '0');
					
					// 生成日期字符串
					let ext = '.mp4';
					if(tempFilePath.endsWith('.mp4')){
						
					}else if(tempFilePath.endsWith('.m4v')){
						ext = '.m4v';
					}else if(tempFilePath.endsWith('.mov')){
						ext = '.mov';
					}else if(tempFilePath.endsWith('.wmv')){
						ext = '.wmv';
					}else if(tempFilePath.endsWith('.rmvb')){
						ext = '.rmvb';
					}else if(tempFilePath.endsWith('.flv')){
						ext = '.flv';
					}else if(tempFilePath.endsWith('.avi')){
						ext = '.avi';
					}else if(tempFilePath.endsWith('.mpg')){
						ext = '.mpg';
					}else if(tempFilePath.endsWith('.mpeg')){
						ext = '.mpeg';
					}
					let key = year + '/' + month + '/' + day + '/' + uni.$store.state.userInfo.id + '/' + unique_uuid() + ext;
					that.videoProgress = 1;
					cosPut(that, tempFilePath, key).then((res1)=>{
						that[name] = res1.url;
						setTimeout(function(){
							that.videoProgress = 0;
						}, 200);
					});
					return false;
			    }
			});
			
			// #endif
		}
		
	}
	
	uni.showActionSheet({
		itemList: ['拍摄', '从相册选择'],
		success: function (res) {
			
			// #ifdef MP
			uploadPictures_((res.tapIndex === 1 ? 'album' : 'camera'), type, name, count);
			// #endif
			
			// #ifdef APP
			uni.wen.util.checkAppPermission(res.tapIndex === 1 ? 'photoLibrary-write' : 'camera', res.tapIndex === 1 ? '[相册读写权限]获取您的相册图片，用于提交反馈，举报图片，扫一扫等场景' : '[摄像头权限]获取您此刻所拍的照片，用于提交反馈，举报图片，扫一扫等场景', () => {
				uploadPictures_((res.tapIndex === 1 ? 'album' : 'camera'), type, name, count);
			}, that);
			// #endif
			
			// #ifdef H5
			uploadPictures_((res.tapIndex === 1 ? 'album' : 'camera'), type, name, count);
			// #endif
	
		},
		fail: function (res) {
			console.log(res.errMsg);
		}
	});
	
};


module.exports = {
	cosUploadPictures
}


