import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { URLS } from "../../../config/api.config";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";
import { CustomEncryption } from "../../../config/custom-encrypt";

@Injectable()
export class LoginService {

	private chkSub = URLS.checkSubscription;
	private userChk = URLS.userType;
	private super = URLS.superstar;
	private req1 = URLS.request1;
	private req2 = URLS.request2;
	private agree = URLS.isAgree;
	private rmProfile = URLS.rmProfile;
	private mapRM = URLS.mapRM;
	private subMap = URLS.subBrokerMap;
	private viewBrokerageRights = URLS.viewBrokerageRights;
	private addMenuRights = URLS.addMenuRights;

	// for new login config

	private loginIappInfo = URLS.loginAppInfo;
	private loginValidateUser = URLS.loginValidateUser;
	private loginVerifyUserOTP = URLS.loginVerifyUserOTP;
	private loginVerifyUserCredential = URLS.loginVerifyUserCred;
	private loginSetCredential = URLS.loginResetCredential;
	private loginForgetCred = URLS.loginForgetCred;
	private loginForgetCredVarifyOTP = URLS.loginForgetCredVarifyOTP;

	private getTokenForAAA = URLS.generateTokenForAAA;

	private productActDea = URLS.productActivationRights
	private clientCodes = URLS.clientCodesList;
	private verifyOneLogin = URLS.verifyOneLogin;
	private userInfoOneLogin = URLS.userInfoOneLogin;

	//influencer
	private inflSendOtp = URLS.inflSendOtp
	private inflVerifyOtp = URLS.inflVerifyOtp
	private getInfluDetail = URLS.getInfluDetail
	private crmToken = URLS.crmToken;

	// for new login End config
	public headersParams: any = environment['headersParams'];
	private influencerKEY: any = environment['influencerKEY'];
	private nativeHeaders: any = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];

	private appIdUserType: any = {
		appID: localStorage.getItem('appID') ? localStorage.getItem('appID') : "0",
		userAgent: "AAA-WebSite",
	}

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private deviceInfo: DeviceDetectorService,
		private commonService: CommonService,
		private ciphetText: CustomEncryption) {
	}


	//new login modules service fun //

	public checkUser(passObj: any): Observable<{}> {
		const params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"appID": "0",
				"osName": this.deviceInfo.os,
				"osVendor": "Microsoft",
				"osVersion": this.deviceInfo.os_version == "unknown" ? "Windows-11":this.deviceInfo.os_version  ,
				"deviceModel": "Latitude 3140",
				"deviceVendor": "Dell",
				"deviceUUID": "",
				"deviceScreen": this.screenSize(),
				"deviceIpImei": "192.168.132.112",
				"appMarket": "Web-Brower",
				"appName": this.deviceInfo.browser,
				"appVersion": "1.2.2",
				"loginType": passObj.loginType,
				"loginID": this.ciphetText.aesEncrypt(passObj.userId),
				"updatedTimeStamp": "0",
				"userAgent": "AAA-Web"
			}
		}

		// let appIdUserType = {
		// 	userAgent: "AAA-WebSite",
		// }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if(this.commonService.isApp()){
			params.body.userAgent = "AAA-Mobile";
		}
		else{
			params.body.userAgent = "AAA-Web";
		}
		
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.loginIappInfo.url, params, Object.assign(obj, this.nativeHeaders, this.appIdUserType))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.loginIappInfo.url, params, { headers: new HttpHeaders(obj) })
	}

	screenSize(){
		let deviceWidth = 720
		let deviceHeight = 1080
		 deviceWidth  = window.innerWidth || document.documentElement.clientWidth || 
		document.body.clientWidth;
		 deviceHeight = window.innerHeight|| document.documentElement.clientHeight|| 
		document.body.clientHeight;

		return deviceWidth+'*'+deviceHeight
	}

	public getValidUser(userId: any, appId: any, type: any): Observable<{}> {
		const params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"LoginMode": type,
				"CredentialMode": 0,
				"CredentialSet": 0,
				"userID": this.ciphetText.aesEncrypt(userId),
			}
		}
		let appIdUserType = {
			userAgent: "AAA-WebSite",
			appID: appId,
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
		}

		// console.log(this.nativeHeaders, 'native headers', appIdUserType);
		
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.loginValidateUser.url, params, Object.assign(appIdUserType, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.loginValidateUser.url, params, { headers: new HttpHeaders(Object.assign(appIdUserType)) })
	}


	public validateOtp(otp: any, appId: any, type: any): Observable<{}> {
		const params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"LoginMode": 1,
				"CredentialMode": 2,
				"CredentialSet": 0,
				"userID": this.ciphetText.aesEncrypt(localStorage.getItem('userId1')),
				//"userID": "c81243",
				"UserCredential": this.ciphetText.aesEncrypt(otp)
			}
		}

		let appIdUserType = {
			userAgent: "AAA-WebSite",
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}

		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.loginVerifyUserOTP.url, params, Object.assign(appIdUserType, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.loginVerifyUserOTP.url, params, { headers: new HttpHeaders(appIdUserType) })
	}


	public verifyUserCredential(pin: any, appId: any): Observable<{}> {
		const params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"LoginMode": 1,
				"CredentialMode": 4,
				"CredentialSet": 0,
				"userID": this.ciphetText.aesEncrypt(localStorage.getItem('userId1')),
				"UserCredential": this.ciphetText.aesEncrypt(pin)
			}
		}


		let appIdUserType = {
			userAgent: "AAA-WebSite",
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.loginVerifyUserCredential.url, params, Object.assign(appIdUserType, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.loginVerifyUserCredential.url, params, {
			headers: new HttpHeaders(appIdUserType)
		})
	}



	public setCredential(pin: any, appId: any): Observable<{}> {
		const params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"UserId": this.ciphetText.aesEncrypt(localStorage.getItem('userId1')),
				"CredentialSet": 1,
				"CredentialType": 3,
				"OldCredential": this.ciphetText.aesEncrypt("999999"),
				"NewUserCredential": this.ciphetText.aesEncrypt(pin)
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
			'userAgent': "AAA"
		};
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.loginSetCredential.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.loginSetCredential.url, params, {
			headers: new HttpHeaders(Object.assign(obj))
		})
	}

	// call forget Pin API
	public forgetPin(type: any, appId: any): Observable<{}> {
		const params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"LoginMode": 1,
				"CredentialMode": 1,
				"CredentialSet": 1,
				"userID": this.ciphetText.aesEncrypt(localStorage.getItem('userId1'))
			}
		}

		let appIdUserType = {
			userAgent: "AAA-WebSite",
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}

		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.loginForgetCred.url, params, Object.assign(appIdUserType, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.loginForgetCred.url, params, { headers: new HttpHeaders(appIdUserType) })
	}

	// call forget Pin API
	public forgetOtpVerify(otp: any, appId: any): Observable<{}> {
		const params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"userID": this.ciphetText.aesEncrypt(localStorage.getItem('userId1')),
				"CredentialSet": 1,
				"CredentialType": 1,
				"OTP": this.ciphetText.aesEncrypt(otp)
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
			userAgent: "AAA-WebSite"
		};
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.loginForgetCredVarifyOTP.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.loginForgetCredVarifyOTP.url, params, {
			headers: new HttpHeaders(Object.assign(obj))
		})
	}

	//new login modules service fun //


	public checkSubs(cookieValue: any, id: any): Observable<{}> {
		const params = {
			head: {
				RequestCode: "MFRQLO01",
				Key: this.chkSub.key,
				AppVer: "1.0.4.0",
				AppName: "AAA",
				OsName: this.commonService.getPlatform(),
			
			},
			body: {
				Loginid: id
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookieValue) {
			obj['token'] = cookieValue;
		}
		this.nativeHttp.setDataSerializer('json');
		// console.log(params, obj);

		return this.commonService.isApp() ? from(this.nativeHttp.post(this.chkSub.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.chkSub.url, params, { headers: new HttpHeaders(obj) });
	}

	public getUserType(id: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		const params = {
			head: {
				RequestCode: "CVUserType01",
				Key: this.userChk.key,
				AppVer: "1.0.22.0",
				AppName: "AAA",
				OsName: this.commonService.getPlatform(),
			
			},
			body: {
				UserCode: id
			}
		}
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.userChk.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.userChk.url, params, { headers: new HttpHeaders(obj) })
	}

	public requestOne(userID?: any, dataParams?: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || ''
		}
		const params: any = {
			"head": {
				"requestCode": "IIFLMarRQLR02",
				"key": this.req1.key,
				"appVer": "1.0.22.0",
				"appName": "AAA",
				"osName": this.commonService.getPlatform(),
				"LoginId": userID,
				"userType": localStorage.getItem('userType')
			}
		}
		params['body'] = dataParams

		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.req1.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.req1.url, params, { headers: new HttpHeaders(obj) });
		// return this.httpClient.post(this.req1, params);
	}

	public requestTwo(dataParams?: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		const params: any = {
			"head": {
				"requestCode": "CVUpdateLead01",
				"key": this.req2.key,
				"appVer": "1.0.22.0",
				"appName": "AAA",
				"osName": this.commonService.getPlatform(),
				"userType": localStorage.getItem('userType')
			}
		}
		params['body'] = dataParams
		// return this.httpClient.post(this.req2.url, params, { withCredentials: true});
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.req2.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.req2.url, params, { headers: new HttpHeaders(obj) });
	}

	public getRMProfile(dataParams?: any, cookieValue?: any): Observable<{}> {
		const params: any = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.rmProfile.key,
				"AppName": "AAA",
				"AppVer": "1.0.22.0",
				"OsName": this.commonService.getPlatform(),
				"userType": localStorage.getItem('userType')
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookieValue) {
			obj['token'] = cookieValue;
		}
		params['body'] = dataParams
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.rmProfile.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.rmProfile.url, params, { headers: new HttpHeaders(obj) });
	}

	public getRMMapping(dataParams: any, id: any, cookievalue: any): Observable<{}> {
		const params: any = {
			"head": {
				"requestCode": "IIFLMarManagermappingreq",
				"key": this.mapRM.key,
				"appVer": "1.0.22.0",
				"appName": "IIFLMarkets",
				"osName": this.commonService.getPlatform(),
				"loginId": dataParams['AdminCode'],
				"userType": localStorage.getItem('userType')
				// "LoginId": dataParams['AdminCode']
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		params['body'] = dataParams
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.mapRM.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.mapRM.url, params, { headers: new HttpHeaders(obj) });
	}

	public getAgree(dataParams?: any, cookieValue?: any): Observable<{}> {
		// const bodyParam = environment['bodyParams'];
		// let params = {
		const head = {
			"RequestCode": "CVUserType01",
			"Key": this.agree.key,
			"AppVer": "1.0.22.0",
			"AppName": "AAA",
			"OsName": this.commonService.getPlatform(),
			"userType": localStorage.getItem('userType')
		}
		// };
		let params: any = {};

		params['head'] = head;
		params['body'] = dataParams;
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookieValue) {
			obj['token'] = cookieValue;
		}

		// return this.httpClient.post(this.agree.url, params, { withCredentials: true });
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.agree.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.agree.url, params, { headers: new HttpHeaders(obj) });
	}

	public getSubBrokerLogin(userID?: any, dataParams?: any): Observable<{}> {
		const params: any = {
			"head": {
				"requestCode": "IIFLMarRQLR02",
				"key": this.req1.key,
				"appVer": "1.0.22.0",
				"appName": "AAA",
				"osName": this.commonService.getPlatform(),
				"LoginId": userID,
				"userType": localStorage.getItem('userType')
			}
		}
		params['body'] = dataParams
		let obj: any = {
			'appID': localStorage.getItem('appID') || ''
		}
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.req1.url, params, this.nativeHeaders)).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.req1.url, params, { observe: 'response', headers: new HttpHeaders(obj) });
	}

	public getSubBrokerMap(dataParams?: any, cookieValue?: any): Observable<{}> {
		// const bodyParam = environment['bodyParams'];
		let params: any = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.subMap.key,
				"AppName": "AAA",
				"AppVer": "1.0.18.0",
				"OsName": this.commonService.getPlatform(),
				"userType": localStorage.getItem('userType')
			}
		};
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		params['body'] = dataParams;

		if (cookieValue) {
			obj['token'] = cookieValue;
		}

		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.subMap.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.subMap.url, params, { headers: new HttpHeaders(obj) });
	}

	public getScore(obj: any, cookieValue?: any) {
		let cookieObj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookieValue) {
			obj['token'] = cookieValue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(URLS['iglScore']['url'], obj, Object.assign(cookieObj, environment['nativeHeaders'], environment['optionalHeaders']))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(URLS['iglScore']['url'], obj, { headers: new HttpHeaders(Object.assign(cookieObj)) });
	}

	public getToken(obj: any, details: any,  cookieValue?: any) {
		let params: any = {
			"head": {
				"osName": this.commonService.getPlatform(),
				"LoginId": details['UserId'],
				"RequestCode": "IIFLMarRQGTFAAA01",
				"key": this.getTokenForAAA.key,
				"appVer": "1.0",
				"appName": "IIFLMarkets",
				"userType": localStorage.getItem('userType')
			}
		}
		if (obj) params['body'] = obj;
		else params['body'] = {
			JwtAAAToken: details['JwtToken']
		}

		let cookieObj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookieValue) {
			cookieObj['token'] = cookieValue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getTokenForAAA.url, params, Object.assign(cookieObj, environment['nativeHeaders'], environment['optionalHeaders']))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getTokenForAAA.url, params, { headers: new HttpHeaders(Object.assign(cookieObj)) });
	}

	public accessProductActivation(cookievalue: any,userId: any) {
		let params = { 
			"head": {
				"RequestCode": " ActiveDeactiveRightsBase",
				"Key": this.productActDea.key,
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				//"PartnerCode": "C86730"
				"PartnerCode": userId
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.productActDea.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.productActDea.url, params, { headers: new HttpHeaders(obj) });
	}

	public getClientCodes(cookievalue: any, userId: any): Observable<{}> {
		let params = {"body":{"Code":userId},"head":{"AppName":this.clientCodes.appName,"AppVer":"1.0.26.0","Key":this.clientCodes.key,"OsName":"Android","RequestCode":"CVUpdateLead01",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientCodes.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.clientCodes.url, params, { headers: new HttpHeaders(obj) });
	}

	//Influencer Send OTP fun
	public sendInflOtp(mobile: any): Observable<{}> {
		let passObj = {
			"mobileno": mobile
		}
		const passheader = {
			Authorization : 'IndiaInfoline_CliPlGtW3YlDElmt7Ed9kYXEJAHsvzMWA4L0V',
			// 'ocp-apim-subscription-key': '281e5fc10b764cdfbf279d950113db30'
		}
		return this.httpClient.post(this.inflSendOtp.url, passObj, { headers: new HttpHeaders(Object.assign(passheader, this.influencerKEY))});
	}

	//Influencer Verify OTP fun
	public verifyInflOtp(mobile: any, otp: any): Observable<{}> {
		let passObj = {
			"mobileno": mobile,
			"otp": otp
		}
		const passheader = {
			Authorization : 'IndiaInfoline_CliPlGtW3YlDElmt7Ed9kYXEJAHsvzMWA4L0V',
			// 'ocp-apim-subscription-key': '281e5fc10b764cdfbf279d950113db30'
		}
		return this.httpClient.post(this.inflVerifyOtp.url, passObj, { headers: new HttpHeaders(Object.assign(passheader, this.influencerKEY))});
	}

	//Influencer Details
	public InfluencerDetails(mobile: any, clientCode: any,cookievalue: any): Observable<{}> {

		let obj = {};
		if (cookievalue) {
			obj = {
				'Authorization': 'Bearer '+cookievalue
			}
		}
		// const passheader = {
		// 	Authorization : 'IndiaInfoline_CliPlGtW3YlDElmt7Ed9kYXEJAHsvzMWA4L0V',
		// 	// 'ocp-apim-subscription-key': '281e5fc10b764cdfbf279d950113db30'
		// }
		return this.httpClient.post(this.getInfluDetail.url+'/'+mobile+'/'+clientCode, null, { headers: new HttpHeaders(Object.assign(obj, this.influencerKEY))});
	}

	public getCrmToken(): Observable<{}> {

		let params = {
            "UserID" :"ED349A8E0DEA4512",
			"Key": "446794970AAA1237ab394d176612f8c6",
			"AppName": "AAA",
			"userType": localStorage.getItem('userType')
        }
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm,
			'appID': localStorage.getItem('appID') || ''
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.crmToken.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.crmToken.url, params, { headers: new HttpHeaders(Object.assign(obj))});
	}

	public verifyOneLoginUser(jwttoken: any,checksum: any): Observable<{}> {
		let params = { 
			"head": {
				"RequestCode": " CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"JWTToken": jwttoken,
				"Checksum": checksum
			}
		}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.verifyOneLogin.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.verifyOneLogin.url, params, { headers: new HttpHeaders(obj) });
	}

	public getUserDetails(accessToken: any): Observable<{}> {
		let obj = {};
		if (accessToken) {
			obj = {
				'Authorization': 'Bearer ' + accessToken
			}
		}
		return this.httpClient.get(this.userInfoOneLogin.url, { headers: new HttpHeaders(obj) });
	}

	public getAccessControlData(): Observable<{}> {
		const params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
        		"Key": "446794970AAA1237ab394d176612f8c6",
        		"AppName": "AAA",
        		"AppVer": "1.0.4.0",
        		"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"Loginid": localStorage.getItem('userId1')
			}
		}
		// if(this.cookieKEY['token'] == null || this.cookieKEY['token'] == undefined){
		// 	this.cookieKEY['token'] == localStorage.getItem('brokerageToken');
		// }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'token': localStorage.getItem('brokerageToken'),
			'appID': localStorage.getItem('appID') || ''
		};
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.viewBrokerageRights.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.viewBrokerageRights.url, params, { observe: 'response', headers: new HttpHeaders(obj) });
	}

	public updateMenuRights(dataParams: any, token: any): Observable<{}> {
		const params: any = {
			"head": {
				"RequestCode": "APIBO52UCVDWFY",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppVer": "01",
				"AppName": "AAA",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
		}
		params['body'] = dataParams;

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
		};

		if(token){
			obj['token'] = token;
		}
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.addMenuRights.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.addMenuRights.url, params, { observe: 'response', headers: new HttpHeaders(obj) });
	}
}