import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { environment } from "../../../environments/environment";
import { CustomEncryption } from "../../../config/custom-encrypt";
import { CommonService } from "../../helpers/common.service";
import moment from "moment";

@Injectable()
export class ClientTradesService {

	private clientHoldingMargin = URLS.clientHoldingMargin;
	private amcReportStmt = URLS.amcReport;
	private orderBook = URLS.orderBook;
	private tradeBook = URLS.tradeBook;
	private marginV2 = URLS.marginV2;
	private clientLedger1 = URLS.clientLedger1;
	private clientHolding = URLS.clientHolding;
	private clientNetPositioneq = URLS.clientNetPositioneq;
	private clientNetPositioncomm = URLS.clientNetPositioncomm
	private marketfeedsearch = URLS.marketfeedsearch;
	private consolidateHolding = URLS.consolidateHolding;
	private consolidateCommodityHolding = URLS.consolidateCommodityHolding;
	private plHolding = URLS.clientHoldingPL;
	private consolidateTradeBook = URLS.consolidateTradeBook;
	private consolidateOrderBook = URLS.consolidateOrderBook;
	private fundsPayinPayout = URLS.fundsPayinOut;
	private offlineClients = URLS.offlineClients;
	private amcData = URLS.amcData;
	private clientPortfolio = URLS.clientPortfolio;
	private familyMapp = URLS.familyMapp;
	private clientEqDetails = URLS.clientEqDetails;
	private clientMf  = URLS.clientMfDetails;
	private clientProductDetails = URLS.clientProductDetails;
	private clientFd = URLS.clientFdDetails;
	private clientBonds = URLS.clientBonds;
	private clientAif = URLS.clientAif;
	private clientPms = URLS.clientPms;
	private familyMemberDetails = URLS.familyMember;
	private clientBreakDown = URLS.clientBreakDown
	private sessionTransfer = URLS.sessionTransfer
	private realizedPL = URLS.realizedPL;
	private MFPNLStatement  = URLS.MFPNLStatement;
	private getTotalEquityDividend = URLS.getTotalEquityDividend;
	private http!: HttpClient;

	public options = environment['optionalHeaders'];
	public headersParams = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private platform: Platform, private cipherText: CustomEncryption,
		private commonService: CommonService) {
	}

	public getClientHoldingMargin(passobj: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token' :  '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		}
		let params = { "head": { "requestCode": "IIFLMarRQGetClientHoldingAndMargin", "key": this.clientHoldingMargin.key, "appVer": "1.0.22.0", "appName": "IIFLMarkets", "osName": "Android",
		"userType": localStorage.getItem('userType') }, "body": passobj }
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientHoldingMargin.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientHoldingMargin.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getAmcStatementReport(submission: any, tokenValue: string): Observable<{}> {
		let params: any = {
			objHeader: {
				VID: this.amcReportStmt.vid,
				AppName: "Website",
				AppVersion: ""
			},
		};
		let appSource = null;
		if (this.platform.is('android')) {
			appSource = 12;
		} else if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
			appSource = 13;
		} else if (this.platform.is('ios')) {
			appSource = 11;
		}
		submission['AppSource'] = appSource;
		Object.assign(params, submission);
		let obj: any = {
			'appID': localStorage.getItem('appID') || ''
		};
		if (tokenValue) {
			obj = {
				'token': tokenValue,
				'Authorization': 'Basic ' + btoa('+Ziie2ZAI4Y=:wEBYb4fMPXalOE/vdth5Tg=='),
				'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.mf,
				'appID': localStorage.getItem('appID') || ''
			}
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.amcReportStmt.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
		return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.amcReportStmt.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getOrderBookNow(cookievalue: any, clientID: any): Observable<{}> {
		let params = { "head": { "requestCode": "IIFLMarRQOBN01", "key": this.orderBook.key, "appVer": "1.0.22.0", "appName": "AAA", "osName": "Android", "LoginId": clientID,
		"userType": localStorage.getItem('userType') }, "body": {} }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token' : '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		};

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.orderBook.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.orderBook.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getTradeBook(cookievalue: any, clientID: any): Observable<{}> {
		let params = { "head": { "requestCode": "IIFLMarRQTradeBookV1", "key": this.tradeBook.key, "appVer": "1.0.22.0", "appName": "ADVISORY ANYTIME ANYWHERE", "osName": "Android", "LoginId": clientID,
		"userType": localStorage.getItem('userType') }, "body": { "ClientCode": clientID, "clientCode": clientID } }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token' : '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		};
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.tradeBook.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.tradeBook.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getMarginV2(cookievalue: any, clientID: any): Observable<{}> {
		let params = { "head": { "requestCode": "IIFLMarRQM02", "key": this.marginV2.key, "appVer": "1.0.22.0", "appName": "AAA", "osName": "Android", "LoginId": clientID,
		"userType": localStorage.getItem('userType') }, "body": {} }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken'),
			'appID': localStorage.getItem('appID') || ''
		};
		
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.marginV2.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.marginV2.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getclientLedger1(cookievalue: any, clientID: any, previousdate: any, currentdate: any): Observable<{}> {
		let headers={
			'Content-Type':'application/json',
			'UserID':environment.headersParams['UserId'],
			'Password':environment.headersParams['Password'],
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		let data: any = {
			
			"head": {
			 	"appName": "IIFLMarkets",
				"appVer": "1.0",
				"key": environment['ledgerKey'],
				// "key": "2cccc59bdab77bace6189d001f96487e",
				"osName": "Android",
				"requestCode": "Ledger",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"ClientCode":clientID,
				"FromDate":moment(previousdate).format('YYYYMMDD'),
				"ToDate":moment(currentdate).format('YYYYMMDD'),
			 }
			
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientLedger1.url, data, Object.assign(headers))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientLedger1.url, data, { headers: new HttpHeaders(Object.assign(headers)) });
	}

	public getclientHolding(cookievalue: any, clientID: any): Observable<{}> {
		let params = { "head": { "requestCode": "IIFLMarRQMH01", "key": this.clientHolding.key, "appVer": "1.0.22.0", "appName": "ADVISORY ANYTIME ANYWHERE", "osName": "Android", "LoginId": clientID,
		"userType": localStorage.getItem('userType') }, "body": {} }
		let obj: any= {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'token' : '.ASPXAUTH=' + localStorage.getItem('JwtToken'),
			'appID': localStorage.getItem('appID') || ''
		};
		
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientHolding.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientHolding.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getNetPositioneq(cookievalue: any, clientID: any): Observable<{}> {
		let params = { "head": { "requestCode": "IIFLMarRQGETD01", "key": this.clientNetPositioneq.key, "appVer": "1.0.22.0", "appName": "AAA", "osName": "Android", "LoginId": clientID,
		"userType": localStorage.getItem('userType') }, "body": {} }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		};
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientNetPositioneq.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientNetPositioneq.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getNetPositioncomm(cookievalue: any, clientID: any): Observable<{}> {
		let params = { "head": { "requestCode": "IIFLMarRQGCTD01", "key": this.clientNetPositioncomm.key, "appVer": "1.0.22.0", "appName": "AAA", "osName": "Android", "LoginId": clientID,
		"userType": localStorage.getItem('userType') }, "body": {} }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		};
		
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientNetPositioncomm.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientNetPositioncomm.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getconsolidateHolding(cookievalue: any, clientID: any): Observable<{}> {
		let params = { "head": { "requestCode": "IIFLMarRQMHOC", "key": this.consolidateHolding.key, "appVer": "1.0.22.0", "appName": "AAA", "osName": "Android", "LoginId": clientID,
		"userType": localStorage.getItem('userType') }, "body": {} }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		};
		
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.consolidateHolding.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.consolidateHolding.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getconsolidateCommodityHolding(cookievalue: any, clientID: any): Observable<{}> {
		let params = { "head": { "requestCode": "IIFLMarRQHComAAA", "key": this.consolidateCommodityHolding.key, "appVer": "1.0.22.0", "appName": "AAA", "osName": "Android", "LoginId": clientID,
		"userType": localStorage.getItem('userType') }, "body": {} }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		};
		
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.consolidateCommodityHolding.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.consolidateCommodityHolding.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getConsTradeBook(cookievalue: any, clientID: any): Observable<{}> {

		let params = { "head": { "requestCode": "IIFLMarRQTradeBookForAAA", "key": this.consolidateTradeBook.key, "appVer": "1.0", "appName": "IIFLMarkets", "osName": "Android", "LoginId": clientID,
		"userType": localStorage.getItem('userType') }, "body": {} }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		};
		
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.consolidateTradeBook.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.consolidateTradeBook.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getConsOrderBook(clientID: any): Observable<{}> {

		let params = { "body": { "AdminCode": clientID }, "head": { "appName": "IIFLMarkets", "appVer": "1.0.22.0", "key": this.consolidateOrderBook.key, "osName": "Android", "requestCode": "IIFLMarRQOrderBookForAAA",
		"userType": localStorage.getItem('userType') } }
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		};
		// if (cookievalue) {
		// 	obj = {
		// 		'token': cookievalue
		// 	}
		// }
		// this.headersParams['token'] =  '.ASPXAUTH=' + localStorage.getItem('JwtToken');
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.consolidateOrderBook.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.consolidateOrderBook.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getHoldingPl(cookievalue: any, clientID: any): Observable<{}> {

		let params = { "head": { "requestCode": "IIFLMarRQHPLS02", "key": this.plHolding.key, "appVer": "1.0.22.0", "appName": "AAA", "osName": "Android", "LoginId": clientID,
		"userType": localStorage.getItem('userType') }, "body": {} }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		};
		
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.plHolding.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.plHolding.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getMarketFeedData(array: any): Observable<{}> {
		let params = { "Count": array.length, "MarketFeedData": array, "ClientLoginType": 0, "LastRequestTime": "/Date(2+)/", "RefreshRate": "H", "date": "", "Date": "" }
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		}
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.marketfeedsearch.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.marketfeedsearch.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getLtpValue(passObj: any): Observable<{}> {
		let params = { "Count": 1, "MarketFeedData": [{ "Exch": passObj.Exch, "ExchType": passObj.ExchType, "ScripCode": passObj.ScripCode, "ClientLoginType": 0, "RequestType": 0 }], "ClientLoginType": 0, "LastRequestTime": "/Date(2+)/", "RefreshRate": "H", "date": "", "Date": "" }
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.marketfeedsearch.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.marketfeedsearch.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
	public getArrayLtpValue(array: any): Observable<{}> {
		let params = { "Count": array.length, "MarketFeedData": array, "ClientLoginType": 0, "LastRequestTime": "/Date(2+)/", "RefreshRate": "H", "date": "", "Date": "" }
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || '',
			'token': '.ASPXAUTH=' + localStorage.getItem('JwtToken')
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.marketfeedsearch.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.marketfeedsearch.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getPayinPayout(cookievalue: any, bodyParams: any): Observable<{}> {
		let params = {"head": {"requestcode": "MFRQLO01","key": this.fundsPayinPayout.key,"appver": "1.0.4.0","appname": this.fundsPayinPayout.appName,"osname": "Android",
		"userType": localStorage.getItem('userType')},"body": bodyParams}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}	
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.fundsPayinPayout.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.fundsPayinPayout.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) })
	}

	getOfflineMfClients(cookievalue: any, bodyParams: any): Observable<{}> {
		let params = { "head": { "RequestCode": "CVUpdateLead01", "Key": this.offlineClients.key, "AppVer": "1.0.4.0", "AppName": this.offlineClients.appName, "OsName": "Android",
		"userType": localStorage.getItem('userType') }, "body": bodyParams }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.offlineClients.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.offlineClients.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) })
	}

	getAMCData(cookievalue: any): Observable<{}> {
		let params = { "objHeader": { "VID": "AS30RH5KC20", "AppName": "Website", "AppVersion": "", "AppSource": null }, "AppSource": "2", "OrderRequesterCode": "FDEM1" };
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.mf,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.amcData.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.amcData.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) })
	}
	
	public getClientPortfolio(cookievalue: any, clientCode: any,consolidate: any, childCode?: any, userId?: any, clientType?: any): Observable<{}> {
		let params = 
		{
			"body": {
			  "ClientCodeParent": clientCode,
			  "ClientCodeChild": childCode ? childCode : "",
			  "PartnerCode": localStorage.getItem("userId1") ? this.cipherText.aesEncrypt(localStorage.getItem("userId1")) : "",//userId,
			  "ConsoliDated": consolidate,
			    "ClientType": clientType
			},
			"head": {
			  "RequestCode": "APIBO52UCVDWFY",
			  "Key": this.clientPortfolio.key,
			  "AppVer": "01",
			  "AppName": "AAA",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			}
		  } 
		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);

	 	return this.httpClient.post(this.clientPortfolio.url, params, { headers: headers})
	}

	public getFamilyMapping(cookievalue?: any, clientCode?: any,userId?: any, clientType?: any): Observable<{}> {
		let params = 
		{
			"body": {
				"ClientCode": clientCode,
				"PartnerCode": userId,
				"ClientType": clientType,
			},
			"head": {
			  "RequestCode": "APIBO52UCVDWFY",
			  "Key": this.familyMapp.key,
			  "AppVer": "01",
			  "AppName": "AAA",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			}
		}	

		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);
		
	 	return this.httpClient.post(this.familyMapp.url, params, { headers: headers})
	}


	public getClientEqDetails(cookievalue: any, clientCode: any, consolidate: any, childCode?: any, userId?: any, clientType?: any): Observable<{}> {
		let params = 
		{
			"body": {
			  "ClientCodeParent": clientCode,
			  "ClientCodeChild": childCode ? childCode : "",
			  "PartnerCode": localStorage.getItem("userId1") ? this.cipherText.aesEncrypt(localStorage.getItem("userId1")) : "",//userId,
			  "ConsoliDated": consolidate,
			  "AsonDate": moment(new Date()).format('YYYYMMDD'),
			  "ClientType": clientType
			},	
			"head": {
			  "RequestCode": "APIBO52UCVDWFY",
			  "Key": this.clientEqDetails.key,
			  "AppVer": "01",
			  "AppName": "AAA",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			}
		}

		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);

		return this.httpClient.post(this.clientEqDetails.url, params, { headers: headers})
	}

	public getClientMfDetails(cookievalue: any, clientCode: any,consolidate: any, childCode?: any, userId?: any, clientType?: any): Observable<{}> {
		let params = 
		{
			"body": {
			 "ClientCodeParent": clientCode,
			  "ClientCodeChild": childCode ? childCode : "",
			  "PartnerCode": localStorage.getItem("userId1") ? this.cipherText.aesEncrypt(localStorage.getItem("userId1")) : "", //userId,
			  "ConsoliDated": consolidate,
			  "AsonDate": moment(new Date()).format('YYYYMMDD'),
			  "ClientType": clientType
			  
			},
			"head": {
			  "RequestCode": "APIBO52UCVDWFY",
			  "Key": this.clientMf.key,
			  "AppVer": "01",
			  "AppName": "AAA",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			}
		}

		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);

		return this.httpClient.post(this.clientMf.url, params, { headers: headers})
	}

	public getProductSummary(cookievalue: any, clientCode: any, consolidate: any, childCode: any, userId: any, clientType?: any): Observable<{}> {
		let params = 
		{
			"body": {
			"ClientCodeParent": clientCode,
			"ClientCodeChild": childCode ? childCode : "",
			"PartnerCode": localStorage.getItem("userId1") ? this.cipherText.aesEncrypt(localStorage.getItem("userId1")) : "",	//userId,
			"ConsoliDated": consolidate,
			  "ClientType": clientType
			},
			"head": {
			  "RequestCode": "APIBO52UCVDWFY",
			  "Key": this.clientProductDetails.key,
			  "AppVer": "01",
			  "AppName": "AAA",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			}
		  }

		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);

		return this.httpClient.post(this.clientProductDetails.url, params, { headers: headers})
	}

	public getFixDepoDetails(cookievalue: any, clientCode: any, consolidate: any, childCode: any, userId: any, clientType?: any): Observable<{}> {
		let params = 
		{
			"body": {
			  "ClientCodeParent": clientCode,
			  "ClientCodeChild": childCode ? childCode : "",
			  "PartnerCode": localStorage.getItem("userId1") ? this.cipherText.aesEncrypt(localStorage.getItem("userId1")) : "",	//userId,
			  "ConsoliDated": consolidate,
			  "AsonDate": moment(new Date()).format('YYYYMMDD'),
			  "ClientType":clientType
			},
			"head": {
			  "RequestCode": "APIBO52UCVDWFY",
			  "Key": this.clientFd.key,
			  "AppVer": "01",
			  "AppName": "AAA",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			}
		  }

		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);

		return this.httpClient.post(this.clientFd.url, params, { headers: headers})
	}

	public getBondDetails(cookievalue: any, clientCode: any, consolidate: any, childCode: any, userId: any, clientType?: any): Observable<{}> {
		let params = 
		{
			"body": {
			  "ClientCodeParent": clientCode,
			  "ClientCodeChild": childCode ? childCode : "",
			  "PartnerCode": localStorage.getItem("userId1") ? this.cipherText.aesEncrypt(localStorage.getItem("userId1")) : "",// userId,
			  "ConsoliDated": consolidate,
			  "AsonDate": moment(new Date()).format('YYYYMMDD'),
			  "ClientType": clientType
			},
			"head": {
			  "RequestCode": "APIBO52UCVDWFY",
			  "Key": this.clientBonds.key,
			  "AppVer": "01",
			  "AppName": "AAA",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			}
		  }

		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);

		return this.httpClient.post(this.clientBonds.url, params, { headers: headers})
	}

	public getAifDetails(cookievalue: any, clientCode: any, consolidate: any, childCode: any, userId: any, clientType?: any): Observable<{}> {
		let params = 
		{
			"body": {
				"ClientCodeParent": clientCode,
				"ClientCodeChild": childCode ? childCode : "",
				"PartnerCode": localStorage.getItem("userId1") ? this.cipherText.aesEncrypt(localStorage.getItem("userId1")) : "",	//userId,
				"ConsoliDated": consolidate,
				"AsonDate": moment(new Date()).format('YYYYMMDD'),
				"ClientType": clientType
			},
			"head": {
				"RequestCode": "APIBO52UCVDWFY",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppVer": "01",
				"AppName": "AAA",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			}
		}

		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);

		return this.httpClient.post(this.clientAif.url, params, { headers: headers})
	}

	public getPmsDetails(cookievalue: any, clientCode: any, consolidate: any, childCode: any, userId: any, clientType?: any): Observable<{}> {
		let params = 
		{
			"body": {
			  "ClientCodeParent": clientCode,
			  "ClientCodeChild": childCode ? childCode : "",
			  "PartnerCode": localStorage.getItem("userId1") ? this.cipherText.aesEncrypt(localStorage.getItem("userId1")) : "",	//userId,
			  "ConsoliDated": consolidate,
			  "AsonDate": moment(new Date()).format('YYYYMMDD'),
			  "ClientType": clientType
			},
			"head": {
			  "RequestCode": "APIBO52UCVDWFY",
			  "Key": "446794970AAA1237ab394d176612f8c6",
			  "AppVer": "01",
			  "AppName": "AAA",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			}
		  }

		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);

		return this.httpClient.post(this.clientPms.url, params, { headers: headers})
	}


	public getMemberDetails(passObj: any,cookievalue?: any): Observable<{}> {
		let params = 
		{
			"body": passObj,
			"head": {
				"RequestCode": "APIBO52UCVDWFY",
				"Key": this.familyMemberDetails.key,
				"AppVer": "01",
				"AppName": "AAA",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			}
		} 

		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);

		return this.httpClient.post(this.familyMemberDetails.url, params, { headers: headers})
	}

	
	public getClientBreakDownDetails(clientCode: any,passObj: any,cookievalue?: any,clientType?: any): Observable<{}> {
		let params = 
		{
			"body": {
				"PartnerCode": localStorage.getItem("userId1") ? this.cipherText.aesEncrypt(localStorage.getItem("userId1")) : "",//userId
				"ClientCode": clientCode,
				"ScripCode": passObj['value'],
				"Product": passObj['type'],
				"ClientType": clientType
			},
			"head": {
				"RequestCode": "APIBO52UCVDWFY",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppVer": "01",
				"AppName": "AAA",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			}
		}

		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);

		return this.httpClient.post(this.clientBreakDown.url, params, { headers: headers})
	}

	public getSessionToken(clientCode: any,formToken: any): Observable<{}> {
		let params = 
		{
			"head": {
				"requestCode": "IIFLMarRQSAFCBL01",
				//"key": "5749AesFgj4dZy7rztyc9NayUhLhm9ZE",
				"key": this.sessionTransfer.key,
				"appVer": "5.20.0.0",
				"appName": "IIFLMarkets",
				"osName": "Android",
				"LoginId": clientCode,
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"formAuthToken": formToken
			}
		}	
		let headers = new HttpHeaders()
		// headers = headers.delete('token');
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.tt);
		return this.httpClient.post(this.sessionTransfer.url, params, { headers: headers})
	}

	public getRealizedPl(cookievalue: any, realizedPlParams: any) {
		let params =  {
			"head": {"RequestCode": "PnLSummaryRealized","Key": this.realizedPL.key,"AppVer": "1.0.4.0","OsName": "Android","AppName": "AAA",
			"userType": localStorage.getItem('userType')},"body": {"ClientCode": realizedPlParams.clientCode,"PartnerCode": localStorage.getItem("userId1"),"FromDate": realizedPlParams.fromDate,"ToDate":realizedPlParams.ToDate,"Product" : realizedPlParams.product}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.realizedPL.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.realizedPL.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getMFPNLStatement(cookievalue: any,  clientCode: any, previousdate: any, currentdate: any, userId:any, clientType?: any): Observable<{}> {

		let params: any = 
		{
			"body": {
				"ClientCode": this.cipherText.aesEncrypt(clientCode),
				"FromDate": previousdate,
				"ToDate": currentdate,
				"PartnerCode": localStorage.getItem("userId1") ? this.cipherText.aesEncrypt(localStorage.getItem("userId1")) : "",
				"ClientType": clientType
				},
			"head": {
			"RequestCode": "ProfileDetailsV1",
       		"Key": this.MFPNLStatement.key,
       		"AppName": "AAA",
       		"AppVer": "1.0.4.0",
       		"OsName": "Android"
			}
		}
		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);
		return this.httpClient.post(this.MFPNLStatement.url, params, { headers: headers, })
	}

	
	public GetTotalEquityDividend(cookievalue:string,  clientCode:string, fromDate:string, toDate:string, consolidate:string): Observable<{}> {

		let params = 
		{
			"body": {
			"ClientCode": this.cipherText.aesEncrypt(clientCode),
			"PartnerCode": this.cipherText.aesEncrypt(localStorage.getItem("userId1")),
			"FromDate": fromDate,
			"ToDate": toDate,
			"Consolidate": consolidate
			},
			"head": {
			"RequestCode": "ProfileDetailsV1",
			"Key": this.getTotalEquityDividend.key,
			"AppName": this.getTotalEquityDividend.appName,
			"AppVer": "1.0.4.0",
			"OsName": "Android"
			}
		}
		
		let headers = new HttpHeaders()
		headers = headers.delete('token');
		headers = headers.set('token', cookievalue);
		headers = headers.set('Ocp-Apim-Subscription-Key', this.gatewaySubscriptionKey.aaa);
		return this.httpClient.post(this.getTotalEquityDividend.url, params, { headers: headers, })
	}

}