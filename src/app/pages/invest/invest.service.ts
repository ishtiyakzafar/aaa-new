import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { URLS } from '../../../config/api.config';
import { environment, investObj } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";
import { StorageServiceAAA } from "../../helpers/aaa-storage.service";
import { WireRequestService } from "../wire-requests/wire-requests.service";
import { Platform } from "@ionic/angular";
import { CustomEncryption } from "../../../config/custom-encrypt";
declare var cordova: any;

@Injectable()
export class InvestService {

	private getToken = investObj['addUser']['getTokenURL'];
	private getCookie = investObj['smallCase']['apiURL'];
	private getCookieIPO = investObj['onlineIPO']['apiURL'];
	private narnoliaSession = investObj['narnolia']['url'];	
	private narnoliaRealTimeMap = investObj['narnoliaRealTimeMap']['url'];	

	public options = environment['optionalHeaders'];
	private nativeHeaders = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nHeaders = investObj['narnoheader']['ocpKey'];
	private offlineIpo = URLS.offlineIpo
	private offlineNcd = URLS.offlineNcd
	public profileDetails: any;
	public loginToken: any;

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private storage: StorageServiceAAA,
		private wireReqService: WireRequestService,
		private platform: Platform,
		private cipherText: CustomEncryption,
		private commonService: CommonService) {
	}

	public getUserAuth(params?: any): Observable<{}> {
		let obj: any = {};
		obj['Ocp-Apim-Subscription-Key'] = environment['genTokKEY'];
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getToken, params, this.nativeHeaders)).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getToken, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getUserAuthe(params?: any): Observable<{}> {
		let obj: any = {};
		obj['Ocp-Apim-Subscription-Key'] = environment['genTokKEY'];
		this.nativeHeaders['Ocp-Apim-Subscription-Key'] = environment['genTokKEY'];
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getToken, params, this.nativeHeaders)).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getToken, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getSmallCaseCookie(params?: any): Observable<{}> {
		const ab = { 'withCredentials': true }
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getCookie, params, this.nativeHeaders)).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getCookie, params, { withCredentials: true });
	}

	public getIPOCookie(params?: any): Observable<{}> {
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getCookieIPO, params, this.nativeHeaders)).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getCookieIPO, params, { withCredentials: true });
	}

	
	public generateSessionForNarnolia(loginId: string, dealerId: string, cookieValue: string): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "IIFLMarRQGSIDFTW01",
				"key": URLS.narnolia.key,
				"appVer": "1.0",
				"appName": "IIFLMarkets",
				"osName": this.commonService.getPlatform(),
				"LoginId": loginId,
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"DealerID": dealerId
			}
		}
		let co = cookieValue;
		let obj = {};
		if (co) {
			obj = {
				'x-auth-cookie': '.ASPXAUTH=' + co,
				'Ocp-Apim-Subscription-Key': this.nHeaders
			}
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.narnoliaSession, params, Object.assign(obj, { withCredentials: 'true' }))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.narnoliaSession, params, { headers: obj, withCredentials: true })
	}

	public realTimeMappingForNarnolia(loginId: string, dealerId: string, cookieValue: string, narnolia?: boolean, grobox?: boolean): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "IIFLMarRQICCASM01",
				"key": URLS.narnolia.key,
				"appVer": "1.0",
				"appName": "IIFLMarkets",
				"osName": this.commonService.getPlatform(),
				"LoginId": loginId,
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"AppSource": narnolia ? URLS.narnolia.appSourceNarnolia : grobox ? URLS.grobox.appSource : URLS.narnolia.appSource,
				"DealerID": dealerId
			}

		}
		let co = cookieValue;
		let obj = {};
		if (co) {
			obj = {
				'x-auth-cookie': '.ASPXAUTH=' + co,
				'Ocp-Apim-Subscription-Key': this.nHeaders
			}
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.narnoliaRealTimeMap, params, Object.assign(obj, { withCredentials: 'true' }))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.narnoliaRealTimeMap, params, { headers: obj, withCredentials: true })
	}

	getOfflineIpo(userID: any): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.ipo,
			'Authorization':this.offlineIpo.Authorization
		});
		let body = {
			"requesterCode": userID,
			"clientCode": userID,
			"appSource": "99",
			"clientType": "9",
			"page": ""
		}
		return this.httpClient.post(this.offlineIpo.url, body, { headers: headers });
	}
	getOfflineNcd(userID: any): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.ipo,
			'Authorization':this.offlineIpo.Authorization
		});
		let body: any = {
			"requesterCode": userID,
			"clientCode": userID,
			"appSource": "99",
			"clientType": "9",
			"page": ""
		}
		return this.httpClient.post(this.offlineNcd.url, body, { headers: headers });
	}

	investEdgeLink(){
		let authorization = localStorage.getItem('jwt_token');
		this.storage.get('pDetails').then(val => {
			this.profileDetails = val;
			this.wireReqService.getinvestEdge(this.profileDetails, authorization)
        		.subscribe((res:any) => {
				window.open(res.redirect_url, '_blank');
				});
			});
	}

	// function for all links in Insurance Tab
	insuranceLinks(objKey?: any) {
		if (objKey == 'web' || objKey == 'web_insu') {
			this.livLongLink();
		} else if (objKey == 'new-mapping') {
			window.open('https://docs.google.com/forms/d/e/1FAIpQLSfH8RMFgI_Ir7eW_cEflZitmSZv_gTXYuopNOdHLsq5K8x6sQ/viewform', '_blank');
		} else if (objKey == 'renewal-mapping') {
			window.open('https://docs.google.com/forms/d/e/1FAIpQLSc4z3wC1lywLWrUEEm8fukMc-qs4TpTv2K1sGAbZZhVEa9G3Q/viewform', '_blank');
		}
	}

	livLongLink(){
		this.storage.get('bToken').then(token => {
			this.loginToken = token;
			this.storage.get('pDetails').then(val => {
				this.profileDetails = val;
				this.wireReqService.getLivLong(this.loginToken,this.profileDetails)
        		.subscribe(res => {
				window.open(res.redirectUrl, '_blank');
       	 });
			});
		  });
	}

	public mutualFund(flag: any) {
		// IOS:  11 
		// Android:  12   
		// AAA website :  13
		let appSource: any = null;
		if (this.platform.is('android')) {
			appSource = this.cipherText.aesEncrypt(12);
		} else if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
			appSource = this.cipherText.aesEncrypt(13);
		} else if (this.platform.is('ios')) {
			appSource = this.cipherText.aesEncrypt(11);
		}
		const flagENC = this.cipherText.aesEncrypt(flag);
		this.storage.get('userType').then((role) => {
			if (role === 'RM' || role === 'FAN') {
				const roleENC = this.cipherText.aesEncrypt(role);
				this.storage.get('bToken').then((sCookie) => {
					const swarajCookie = sCookie.split('=');

					this.storage.get('userID').then((clientCode) => {
						const codeENC = this.cipherText.aesEncrypt(clientCode);
						const obj = {
							token: swarajCookie[1],
							Flag: flagENC,
							Appsource: appSource,
							ClientCode: codeENC,
							Role: roleENC
						}
						const url = investObj['mutualFund']['url'] + '?token=' + swarajCookie[1] + '&Flag=' + flagENC + '&Appsource=' + appSource + '&ClientCode=' + codeENC + '&Role=' + roleENC;
						if (this.commonService.isApp()) {
							var ref = cordova.InAppBrowser.open(url, '_blank');

							ref.addEventListener('loadstart', this.loadstartCallback);
							ref.addEventListener('loadstop', this.loadstopCallback);
							ref.addEventListener('loaderror', this.loaderrorCallback);
							ref.addEventListener('exit', this.exitCallback);
						} else {
							this.commonService.OpenWindowWithPost(investObj['mutualFund']['url'], '_blank', obj);
						}
						// window.open(url);
					})
				})
			} else if (role === 'SUB BROKER') {
				this.storage.get('subToken').then((sCookie) => {
					const brokerToken = sCookie.split('=');
					const roleENC = this.cipherText.aesEncrypt('SubBroker');

					this.storage.get('userID').then((clientCode) => {
						const codeENC = this.cipherText.aesEncrypt(clientCode);

						const obj = {
							token: brokerToken[1],
							Flag: flagENC,
							Appsource: appSource,
							ClientCode: codeENC,
							Role: roleENC
						}

						const url = investObj['mutualFund']['url'] + '?token=' + brokerToken[1] + '&Flag=' + flagENC + '&Appsource=' + appSource + '&ClientCode=' + codeENC + '&Role=' + roleENC;

						const captureObj = {
							url: investObj['mutualFund']['url'],
							method: 'GET',
							values: [
								{ token: brokerToken[1] },
								{ Flag: flagENC },
								{ Appsource: appSource },
								{ ClientCode: codeENC },
								{ Role: roleENC },
							]
						}

						if (this.commonService.isApp()) {
							var ref = cordova.InAppBrowser.open(url, '_blank');

							ref.addEventListener('loadstart', this.loadstartCallback);
							ref.addEventListener('loadstop', this.loadstopCallback);
							ref.addEventListener('loaderror', this.loaderrorCallback);
							ref.addEventListener('exit', this.exitCallback);
						} else {
							this.commonService.OpenWindowWithPost(investObj['mutualFund']['url'], '_blank', obj);
						}
					})
				})
			}
		})
	}	

	public loadstartCallback(event: any) {
		console.log('Loading started: ' + event.url)
	}

	public loadstopCallback(event: any) {
		console.log('Loading finished: ' + event.url)
	}

	public loaderrorCallback(error: any) {
		console.log('Loading error: ' + error.message)
	}

	public exitCallback() {
		console.log('Browser is closed...')
	}

}