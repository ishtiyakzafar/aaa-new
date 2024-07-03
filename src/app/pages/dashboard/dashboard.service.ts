import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HTTP } from "@ionic-native/http/ngx";
import { map } from 'rxjs/operators';
import { Platform } from "@ionic/angular";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";

@Injectable()
export class DashBoardService {

	private hierarchyList = URLS.hierarchyList;
	private clientHoldingMargin = URLS.clientHoldingMargin;
	private dashboarddetail = URLS.dashboarddetail;
	private aumdetail = URLS.aumdetail;
	private sipBook = URLS.sipBook;
	private insuranceSumm = URLS.insuranceSummary;
	private clientDetail = URLS.clientDetail;
	private brokerageDetails = URLS.brokerageDetails;
	private iglcScoreDetails = URLS.iglcScore;
	private flyhigh = URLS.flyhighData;
	private quickLink = URLS.getQuickLink;
	private addLink = URLS.addQuickLink;
	private crossSellDetails = URLS.crossSellDetails;
	private mfDashboard = URLS.mfDashboard;
	private equityDashboard = URLS.equityDashboard;
	private overallDashboard = URLS.overallDashboard;
	private defaultDashboard = URLS.defaultDashboard;
	private fetchClientDashBoardDetails = URLS.fetchClientDashBoardDetails;
	private productWiseClient = URLS.productWiseClient;

	private partnerPoints = URLS.partnerPoints;
    private ipoList = URLS.ipoList;
	private clientCount = URLS.clientCount;
    private GetCMSDepositBankV1 = URLS.GetCMSDepositBankV1;
    private getClientHoldingAbove25L = URLS.getClientHoldingAbove25L
    private BusinessOppsFao = URLS.BusinessOppsFao
    private clientwithoutSip = URLS.clientWithoutSip
    private clientNotTraded = URLS.clientNotTraded
    private clientTobeDormant = URLS.clientTobeDormant
    private getBrokeragePerform = URLS.getBrokeragePerformance
    private ncdMfHolding = URLS.getNcdMfDebtHolding
    private dayWiseBrokerageGraph = URLS.dayWiseBrokerageGraph
    private dashBoardCount = URLS.dashBoardCount
	private IncentivesPremiaRMs = URLS.incentivesPremiaRMs
  
  
	private oneUploginThrowApp = URLS.oneUploginThrowApp;
	private ipoClientList = URLS.ipoClientList;	
	private peerPoints = URLS.peerPoints;
	private ClientNotInvestedMF = URLS.ClientNotInMF
	private equityMfLeads = URLS.equityMfLeads
	private bDayToday = URLS.bDayToday
	private p1p2p3Clients = URLS.p1p2p3Clients
	private leadStats = URLS.leadStats
	private fixedIncomeLeads = URLS.fixedIncomeLeads
	private PmsAifLeads = URLS.PmsAifLeads

    public options: any = environment['optionalHeaders'];
    public headersParams: any = environment['headersParams'];
    public panNoCookieKEY: any = environment['panNoCookieKEY'];
    private nativeHeaders: any = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	// private ttAvatarApi = environment['ttAvatar']		never used and ttAvatar is not available in environment file
	private ipoHeader = environment['ipoHeaders'];
	private GetRMHierarchyNew = URLS.GetRMHierarchyNew;
	private GetClientCodes = URLS.GetClientCodes;
	private wireMappedCode = URLS.wireMappedCode;
	private removeClientAccess = URLS.removeClientAccess;
	private KPIDashBoardBDM = URLS.kpiDashboardBDM;

	// public options = environment['optionalHeaders'];
	// public headersParams = environment['headersParams'];
	// private nativeHeaders = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private platform: Platform,
		private commonService: CommonService) {
	}

	fetchGetClientCodes(userType: any, userID: any, token: any, searchText: any): Observable<any> {
		let userId = localStorage.getItem('userId1');
		let Token = localStorage.getItem('jwt_token');
		//let UserType = localStorage.getItem('userType');
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${Token}`,
			'Ocp-Apim-Subscription-Key': this.GetClientCodes['Ocp-Apim-Subscription-Key']
		});
		const url = `${this.GetClientCodes.url}/${userId}/${searchText}/${userType}`;
		return this.httpClient.get(url, { headers: headers });
	}

	public deleteClientAccess(data: any, cookievalue: any): Observable<{}> {
		let params = {
			"body": {data},
			  "head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			}
		}

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.removeClientAccess.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.removeClientAccess.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });

	}

	public fetchWireMappedCode(flag: any, cookievalue: any, userId: any): Observable<{}> {
		let params = {
			"body": {
				"loginid": userId,
				"Flag" : flag
			},
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			}
		}

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
		};		
		if (cookievalue) {
			obj['token'] = cookievalue;
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.wireMappedCode.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.wireMappedCode.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });

	}

	fetchRMHierarchyNew(userType: any, userID: any, token: any, searchText: any): Observable<any> {
		var UserId = localStorage.getItem('userId1');
		var UserType = localStorage.getItem('userType');
		var Token = localStorage.getItem('jwt_token');
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${Token}`,
			'Ocp-Apim-Subscription-Key': this.GetRMHierarchyNew['Ocp-Apim-Subscription-Key'],
			'Access-Control-Allow-Origin': ""
		});
		const url = `${this.GetRMHierarchyNew.url}/${UserId}/${searchText}/${UserType}`;
		return this.httpClient.get(url, { headers: headers });
	}

	public getPartnerDetail(cookievalue: any, partnerID: any): Observable<{}> {
		let params = {
			"body": {
				"PartnerCode": partnerID,
				"Tops": "0"
			},
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			}
		}

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.partnerPoints.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.partnerPoints.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });

	}

	getIPOList(cookievalue: any) {
		let params = {}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.ipo,
			'appID': localStorage.getItem('appID') || '',
			withCredentials: 'true'
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		// let Obj1 = {
		//   'Ocp-Apim-Subscription-Key': '75e5ccdf4ba84de583cfe81f5b89158a',
		//   token:'.ASPXAUTH=7A5DB29F98B4AE56A60C370CB4A8BE4953537D4AADEC158AED76262CB7604563034F35A3DDCCED5136AB4D1A1F0651FB187A7E88369B05ABBA516BE19FF432E15E7A0066A573ECEBA3E5B0DF4B7C731DF418E3143E05A2E95C033FC8DCD784B785D67B45DE2A58FB9B981F2BF400191EA7817039DC9FE83948120D05BE7E114B1B1F3BB012F32F4A97A8DEB8719B4EBF763CE12D'
		// }
		// console.log(obj);
		return this.httpClient.post(this.ipoList.url, null, { headers: new HttpHeaders(obj) });
	}

	// getIPOList(cookievalue){
	//   let params = {
	//     "requesterCode": "TIWARI82",

	//     "clientCode": "TIWARI82",

	//     "appSource": 1,

	//     "clientType": 6
	//   }
	//   let obj = {};
	//   if (cookievalue) {
	//     obj = {
	//       'token': cookievalue 
	//     }
	//   }
	//   // let Obj1 = {
	//   //   'Ocp-Apim-Subscription-Key': '75e5ccdf4ba84de583cfe81f5b89158a',
	//   //   token:'.ASPXAUTH=7A5DB29F98B4AE56A60C370CB4A8BE4953537D4AADEC158AED76262CB7604563034F35A3DDCCED5136AB4D1A1F0651FB187A7E88369B05ABBA516BE19FF432E15E7A0066A573ECEBA3E5B0DF4B7C731DF418E3143E05A2E95C033FC8DCD784B785D67B45DE2A58FB9B981F2BF400191EA7817039DC9FE83948120D05BE7E114B1B1F3BB012F32F4A97A8DEB8719B4EBF763CE12D'
	//   // }
	//   console.log(obj);
	// }


	public getOneUpIPOLink(cookievalue: string, clientCode: string, issueCode: string): Observable<{}> {
		let appSource;
		if (this.platform.is('android')) {
			appSource = 12;
		} else if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
			appSource = 13;
		} else if (this.platform.is('ios')) {
			appSource = 11;
		}
		let dataToSend = {
			"requesterCode": clientCode,
			"clientCode": clientCode,
			"appSource": appSource,
			"clientType": 6,
			"Page": issueCode
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.ipo
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
			obj['Authorization'] = 'IMN05OPLoDvbTTaIQkqLNMI7cPLguaRyHzyg7n5qNBVjQmtBhzF4SzYh4NBVCXi3KJHlSXKP+oi2+bXr6CUYTRL';
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.oneUploginThrowApp.url, dataToSend, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.oneUploginThrowApp.url, dataToSend, { headers: new HttpHeaders(Object.assign(obj)) });
	}
	public getClientCount(cookievalue: any, data: any) {
		let params = { "head": { "RequestCode": "CVUpdateLead01", "Key": environment.paramsAPIKey, "AppName": environment.boAppName, "AppVer": "01", "OsName": "Android",
		"userType": localStorage.getItem('userType') }, "body": data }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientCount.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientCount.url, params, { headers: new HttpHeaders(obj) });
	}

	public applyClientNonClient(cookievalue: string, dataToSend: any): Observable<{}> {		 	
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.ipo
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
			obj['Authorization'] = 'IMN05OPLoDvbTTaIQkqLNMI7cPLguaRyHzyg7n5qNBVjQmtBhzF4SzYh4NBVCXi3KJHlSXKP+oi2+bXr6CUYTRL';
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.oneUploginThrowApp.url, dataToSend, Object.assign(obj, this.nativeHeaders, this.ipoHeader, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.oneUploginThrowApp.url, dataToSend, { headers: new HttpHeaders(Object.assign(obj, this.ipoHeader)) });
	}

	public getInterestedClientList(cookievalue: string, data:any): Observable<{}> {
		let params = { "head": { "RequestCode": "CVUpdateLead01", "Key": environment.paramsAPIKey, "AppName": environment.boAppName, "AppVer": "01", "OsName": "Android",
		"userType": localStorage.getItem('userType') }, "body": data }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.ipoClientList.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.ipoClientList.url, params, { headers: new HttpHeaders(obj) });
	}

	public getClientHolding25(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"body": passObj,
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.getClientHoldingAbove25L.key,
				"AppName": this.getClientHoldingAbove25L.appName,
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getClientHoldingAbove25L.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getClientHoldingAbove25L.url, params, { headers: new HttpHeaders(obj) });
	}

	public businessFao(cookievalue: any, userId: any): Observable<{}> {
		let params = {
			"head": {
				"requestcode": "APIBO52UCVDWFY",
				"key": this.BusinessOppsFao.key,
				"appver": "01",
				"appname": this.BusinessOppsFao.appName,
				"osname": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"PartnerCode": userId,
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.BusinessOppsFao.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.BusinessOppsFao.url, params, { headers: new HttpHeaders(obj) });
	}

	public kpiDashboardBDM(cookievalue: any, userId: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.KPIDashBoardBDM.key,
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				 "loginid": userId
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.KPIDashBoardBDM.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.KPIDashBoardBDM.url, params, { headers: new HttpHeaders(obj) });
	}

	public clientMfNotTraded(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"body": passObj,
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.clientwithoutSip.key,
				"AppName": this.clientwithoutSip.appName,
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientwithoutSip.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientwithoutSip.url, params, { headers: new HttpHeaders(obj) });
	}

	public incentivesPremiaRMs(cookievalue: any, userId: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.IncentivesPremiaRMs.key,
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				 "login": userId
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.IncentivesPremiaRMs.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.IncentivesPremiaRMs.url, params, { headers: new HttpHeaders(obj) });
	}

	public clientsNotTraded(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"head": {
				"requestcode": "CVUpdateLead01",
				"key": this.clientNotTraded.key,
				"appver": "01",
				"appname": this.clientNotTraded.appName,
				"osname": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": passObj
		}

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientNotTraded.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientNotTraded.url, params, { headers: new HttpHeaders(obj) });
	}

	public getClientTobeDormant(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"head": {
				"requestcode": "CVUpdateLead01",
				"key": this.clientTobeDormant.key,
				"appver": "01",
				"appname": this.clientTobeDormant.appName,
				"osname": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body":passObj
		}

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientTobeDormant.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientTobeDormant.url, params, { headers: new HttpHeaders(obj) });
	}

	public clientWireDashboardReport(token: string, body: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": URLS.dashboardReport.key,
				"AppVer": "01",
				"AppName": 'AAA',
				"OsName": this.commonService.getPlatform(),
				"userType": localStorage.getItem('userType')
			},
			"body": body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(URLS.dashboardReport.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(URLS.dashboardReport.url, params, { headers: new HttpHeaders(obj) });
	}

	public getBusinessCount(cookievalue: any, userId: any): Observable<{}> {
		let params = {
		  "head": {
			"RequestCode": "CVUpdateLead01",
			"Key": this.dashBoardCount.key,
			"AppName": this.dashBoardCount.appName,
			"AppVer": "01",
			"OsName": "Android",
			"userType": localStorage.getItem('userType')
		  },
		  "body": {
			"LoginID": userId
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.dashBoardCount.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) :this.httpClient.post(this.dashBoardCount.url, params, { headers: new HttpHeaders(obj) });
	  }


	public getBrokMtdEquity(cookievalue: any, userId: any,fromDateChange?: any,toDateChange?: any): Observable<{}> {
		let params = {
			"head": {
				"requestcode": "APIBO52UCVDWFY",
				"key": this.getBrokeragePerform.key,
				"appver": "01",
				"appname": this.getBrokeragePerform.appName,
				"osname": "Android",
				"userType": localStorage.getItem('userType')
			},

			"body": {
				"PartnerCode": userId,
				"FromDate": fromDateChange,
				"ToDate": toDateChange,
				"Exchange": ""
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getBrokeragePerform.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getBrokeragePerform.url, params, { headers: new HttpHeaders(obj) });
	}

	public getNcdMfHolding(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.ncdMfHolding.key,
				"AppName": this.ncdMfHolding.appName,
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": passObj
		}


		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.ncdMfHolding.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.ncdMfHolding.url, params, { headers: new HttpHeaders(obj) });
	}

	public getBrokChart(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"head": {
				"requestcode": "APIBO52UCVDWFY",
				"key": this.dayWiseBrokerageGraph.key,
				"appver": "01",
				"appname": this.dayWiseBrokerageGraph.appName,
				"osname": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": passObj
		}


		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
			'token': localStorage.getItem('brokerageToken')
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.dayWiseBrokerageGraph.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.dayWiseBrokerageGraph.url, params, { headers: new HttpHeaders(obj) });
	}

	public getPeerPoints(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"body": passObj,
			"head": {
			  "RequestCode": "CVUpdateLead01",
			  "Key": this.peerPoints.key,
			  "AppName": this.peerPoints.appName,
			  "AppVer": "01",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.peerPoints.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.peerPoints.url, params, { headers: new HttpHeaders(obj) });
	}

	public getClientInvestedMF(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.ClientNotInvestedMF.key,
				"AppName": this.ClientNotInvestedMF.appName,
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": passObj
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.ClientNotInvestedMF.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.ClientNotInvestedMF.url, params, { headers: new HttpHeaders(obj) });
	}

	public getEquityLeads(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "FetchClientDebtMFAUM",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": 
				passObj
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.equityMfLeads.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.equityMfLeads.url, params, { headers: new HttpHeaders(obj) });
	}

	public getListOfClientsBdays(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.bDayToday.key,
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body":
				passObj
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.bDayToday.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.bDayToday.url, params, { headers: new HttpHeaders(obj) });
	}

	public getP1P2P3ClientList(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.p1p2p3Clients.key,
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body":
				passObj
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.p1p2p3Clients.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.p1p2p3Clients.url, params, { headers: new HttpHeaders(obj) });
	}

	public getFixedIncomeLeads(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "FetchClientDebtMFAUM",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": 
				passObj
			}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.fixedIncomeLeads.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.fixedIncomeLeads.url, params, { headers: new HttpHeaders(obj) });
	}

	public getLeadStatsChartData(cookievalue: any, rmCode: any): Observable<{}> {
		let params = {
			"Parameters": {
				"RM_Code": rmCode
			}
		};
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm,
			'appID': localStorage.getItem('appID') || ''
		};
		obj['Authorization'] = 'CRM-oauthtoken ' + cookievalue;

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.leadStats.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.leadStats.url, params, { headers: new HttpHeaders(obj) });
	}
	
	public getPmsLeads(cookievalue: any, passObj: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "FetchClientDebtMFAUM",
				"Key": this.PmsAifLeads.key,
				"AppName": "AAA",
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": passObj
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.PmsAifLeads.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.PmsAifLeads.url, params, { headers: new HttpHeaders(obj) });
	}




	// DashBoard-revamp Services

	public getClientHoldingMargin(passobj: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		let params = { "head": { "requestCode": "IIFLMarRQGetClientHoldingAndMargin", "key": this.clientHoldingMargin.key, "appVer": "1.0.22.0", "appName": "IIFLMarkets", "osName": "Android",
		"userType": localStorage.getItem('userType') }, "body": passobj }
		return this.httpClient.post(this.clientHoldingMargin.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public dashBoardDetail(cookievalue: any, clientID: any): Observable<{}> {
		let params = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.dashboarddetail.key,
				AppName: this.dashboarddetail.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			
			},
			body: {
				Loginid: clientID

			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
			'token': localStorage.getItem('brokerageToken')
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.dashboarddetail.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.dashboarddetail.url, params, { headers: new HttpHeaders(obj) });
	}

	public getHierarchyList(cookievalue: any, clientID: any): Observable<{}> {
		let params = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.hierarchyList.key,
				AppName: this.hierarchyList.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			
			},
			body: {
				Loginid: clientID
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
			'token': localStorage.getItem('brokerageToken')
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.hierarchyList.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.hierarchyList.url, params, { headers: new HttpHeaders(obj) });
	}

	public getAUMDetail(cookievalue: any, data: any): Observable<{}> {
		let params = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.aumdetail.key,
				AppName: this.aumdetail.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			},
			body: {
				Role: localStorage.getItem('userChannel'),
				Loginid: localStorage.getItem('userId1'),
				PartnerID: data.PartnerID,
				DataType: localStorage.getItem('toggleSwitch')
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.aumdetail.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.aumdetail.url, params, { headers: new HttpHeaders(obj) });
	}

	public getSIPBookDetail(cookievalue: any, clientID: any): Observable<{}> {
		let params = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.sipBook.key,
				AppName: this.sipBook.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			
			},
			body: {
				Loginid: clientID

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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.sipBook.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.sipBook.url, params, { headers: new HttpHeaders(obj) });
	}

	public getAFYPDetail(cookievalue: any, clientID: any): Observable<{}> {
		// { "head": { "RequestCode": "GetAAAInsuranceSummary", "Key": "446794970AAA1237ab394d176612f8c6", "AppName": "AAA", "AppVer": "1.0.4.0", "OsName": "Android" }, "body": { "RMCode": "C1011" } }
		let params = {
			head: {
				RequestCode: "GetAAAInsuranceSummary",
				Key: this.insuranceSumm.key,
				AppName: this.insuranceSumm.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			
			},
			body: {
				RMCode: clientID,
				PartnerCode: localStorage.getItem('empCode') ? localStorage.getItem('empCode') : localStorage.getItem('userId1'),
				DataType: localStorage.getItem('toggleSwitch'),
				Role: localStorage.getItem('userChannel')
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.insuranceSumm.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.insuranceSumm.url, params, { headers: new HttpHeaders(obj) });
	}

	public getTotalClientsDetail(cookievalue: any, clientID: any): Observable<{}> {
		let params = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.clientDetail.key,
				AppName: this.clientDetail.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			
			},
			body: {
				Loginid: clientID

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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientDetail.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientDetail.url, params, { headers: new HttpHeaders(obj) });
	}

	public getBrokerageDetails(cookievalue: any, data: any): Observable<{}> {
		let params = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.brokerageDetails.key,
				AppName: this.brokerageDetails.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			},
			body: data
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
			'token': localStorage.getItem('brokerageToken')
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.brokerageDetails.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.brokerageDetails.url, params, { headers: new HttpHeaders(obj) });
	}
	public getIglcScoredetails(cookievalue: any, PartnerCode: any): Observable<{}> {
		let params = {
			head: {
				"RequestCode": "CVUpdateLead01",
     			"Key": "446794970AAA1237ab394d176612f8c6",
     			"AppName": "AAA",
     			"AppVer": "01",
     			"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			body: {
				PartnerCode: PartnerCode
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.iglcScoreDetails.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.iglcScoreDetails.url, params, { headers: new HttpHeaders(obj) });
	}

	public getFlyHighdetails(token: any,loginID: any,userType: any): Observable<{}> {
		let params: any = {
			head: {
				"RequestCode": "CVUpdateLead01",
				"Key": this.flyhigh.key,
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			body: {
				"loginid": loginID,
				"UserType":userType
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if(token){
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.flyhigh.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.flyhigh.url, params, { headers: new HttpHeaders(obj) });
	}

	public getQuickLinks(token: any, body: any): Observable<{}> {
		let params: any = {
			head: {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android"
			},
			body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.quickLink.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.quickLink.url, params, { headers: new HttpHeaders(obj) });
	}

	addQuickLinks(token: any, body: any): Observable<{}> {
		let params: any = {
			head: {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android"
			},
			body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.addLink.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.addLink.url, params, { headers: new HttpHeaders(obj) });
	}
	
	getCrossSellDetails(token: any, body: any): Observable<{}> {
		let params: any = {
			head: {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android"
			},
			body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.crossSellDetails.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.crossSellDetails.url, params, { headers: new HttpHeaders(obj) });
	}

	getMFDashboard(token: any, body: any): Observable<{}> {
		let params: any = {
			head: {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android"
			},
			body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.mfDashboard.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.mfDashboard.url, params, { headers: new HttpHeaders(obj) });
	}

	getEquityDashboard(token: any, body: any): Observable<{}> {
		let params: any = {
			head: {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android"
			},
			body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.equityDashboard.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.equityDashboard.url, params, { headers: new HttpHeaders(obj) });
	}

	getOverallDashboard(token: any, body: any): Observable<{}> {
		let params: any = {
			head: {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android"
			},
			body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.overallDashboard.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.overallDashboard.url, params, { headers: new HttpHeaders(obj) });
	}

	getDefaultDashboard(token: any, body: any): Observable<{}> {
		let params: any = {
			head: {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android"
			},
			body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.defaultDashboard.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.defaultDashboard.url, params, { headers: new HttpHeaders(obj) });
	}

	getClientDashboardDetails(token: any, body: any): Observable<{}> {
		let params: any = {
			head: {
				"RequestCode": "FetchClientDashBoardDetails",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "1.0.4.0",
				"OsName": "Android"
			},
			body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.fetchClientDashBoardDetails.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.fetchClientDashBoardDetails.url, params, { headers: new HttpHeaders(obj) });
	}

	getProductWiseClient(token: any, body: any): Observable<{}> {
		let params: any = {
			head: {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "1.0.4.0",
				"OsName": "Android"
			},
			body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.productWiseClient.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.productWiseClient.url, params, { headers: new HttpHeaders(obj) });
	}
}