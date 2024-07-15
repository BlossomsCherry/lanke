import CryptoJS from "crypto-js";
import { Buffer } from "buffer";

export const postPolicy = (key) => {
	return new Promise(function (resolve, reject) {
		
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'files/credentials',{action: 'post'}, 'POST',).then(res => {
			if(res.status){
				
				// 配置参数
				var config = {
				  // 获取腾讯云密钥，建议使用限定权限的子用户的密钥 https://console.cloud.tencent.com/cam/capi
				  secretId: "",
				  secretKey: "",
				  // 这里填写存储桶、地域，例如：test-1250000000、ap-guangzhou
				  bucket: '',
				  region: uni.$store.state.config2.cos.region,
				  securityToken: '',
				  // 限制的上传后缀
				  // extWhiteList: ["jpg", "jpeg", "png", "bmp", "aac", "mp4", "mp3"],
				};
				
				let credentials = res.data.credentials;
				config.secretId = credentials.tmpSecretId;
				config.secretKey = credentials.tmpSecretKey;
				config.securityToken = credentials.sessionToken;
				config.bucket = uni.$store.state.config2.cos.bucket;
				config.region = uni.$store.state.config2.cos.region;
				
				// 判断异常情况
				if (!config.secretId || !config.secretKey)
				  throw Error("secretId or secretKey not ready");
				if (!config.bucket || !config.region)
				  throw Error("bucket or regions not ready");
				
				// 开始计算凭证
				var cosHost = `${config.bucket}.cos.${config.region}.myqcloud.com`;
				var cosKey = key;
				var now = Math.round(Date.now() / 1000);
				var exp = now + 900;
				var qKeyTime = now + ";" + exp;
				var qSignAlgorithm = "sha1";
				// 生成上传要用的 policy
				// PostObject 签名保护文档 https://cloud.tencent.com/document/product/436/14690#.E7.AD.BE.E5.90.8D.E4.BF.9D.E6.8A.A4
				var policy = JSON.stringify({
				  expiration: new Date(exp * 1000).toISOString(),
				  conditions: [
				    // {'acl': query.ACL},
				    // ['starts-with', '$Content-Type', 'image/'],
				    // ['starts-with', '$success_action_redirect', redirectUrl],
				    // ['eq', '$x-cos-server-side-encryption', 'AES256'],
					// { "x-cos-security-token": config.securityToken},
				    { "q-sign-algorithm": qSignAlgorithm },
				    { "q-ak": config.secretId },
				    { "q-sign-time": qKeyTime },
				    { bucket: config.bucket },
				    { key: cosKey },
				  ],
				});
				
				// 步骤一：生成 SignKey
				var signKey = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, config.secretKey)
				  .update(qKeyTime)
				  .finalize()
				  .toString(CryptoJS.enc.Hex);
				
				// var signKey = crypto
				//   .createHmac("sha1", config.secretKey)
				//   .update(qKeyTime)
				//   .digest("hex");
				
				// 步骤二：生成 StringToSign
				var stringToSign = CryptoJS.SHA1(policy).toString(CryptoJS.enc.Hex);
				// var stringToSign = crypto.createHash("sha1").update(policy).digest("hex");
				
				// 步骤三：生成 Signature
				var qSignature = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, signKey)
				  .update(stringToSign)
				  .finalize()
				  .toString(CryptoJS.enc.Hex);
				// var qSignature = crypto
				//   .createHmac("sha1", signKey)
				//   .update(stringToSign)
				//   .digest("hex");
				
				resolve({
				  cosHost: cosHost,
				  cosKey: cosKey,
				  //Buffer is not defined
				  //https://blog.csdn.net/z_robot/article/details/130679855
				  //https://blog.lvez.cn/archives/vite-vue3-buffer
				  policy: Buffer.from(policy).toString("base64"),
				  qSignAlgorithm: qSignAlgorithm,
				  qAk: config.secretId,
				  qKeyTime: qKeyTime,
				  qSignature: qSignature,
				  securityToken: config.securityToken
				});
				
				
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
				reject({})
			}
		})
	});
};
