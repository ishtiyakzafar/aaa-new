import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";


@Injectable()
export class ShareReportService {

	private clientPanNo = URLS.clientPanNo;
	private tradeListing = URLS.tradeListing
	private settlement = URLS.settlement;

	private unRealizedPL = URLS.unRealizedPL
	private realizedPL = URLS.realizedPL

	private downloadReport = URLS.reportDownload
	private dpHoldingStatement = URLS.dpHoldingStatement


	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	public panNoCookieKEY: any = environment['panNoCookieKEY'];
	private nativeHeaders: any = environment['nativeHeaders'];
	private nativePanNoHeaders: any = environment['nativePanNoHeaders']
	private mfReport: any = URLS.mfAccountReportDownload
	public mfAccountHeaders: any = environment['mfReportDownloadHeader'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private commodityrealtimereport: any = URLS['commodityrealtimereport']

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}


    
    public getClientPanNo(cookievalue: any, clientID: any): Observable<{}> {
		//let params = {"body":{"CaseID":caseId,"CustomerID":"","EmployeeId":"ckv000rm","FromDate":this.commonService.Last7Days("last"),"Status":"","ToDate":this.commonService.Last7Days("first")},"head":{"appname":"AAA","appver":"1.0.26.0","Authkey":"53D7AE755B82D5C2","key":"446794970AAA1237ab394d176612f8c6","osname":"Android","requestcode":"APIBO52UCVDWFY"}}
		let params = {"objHeader":{"VID":this.clientPanNo.vid,"AppName":this.clientPanNo.appName,"AppVersion":"1.0.26.0"},"Value":clientID}
		let obj = {};
		// if (cookievalue) {
		// 	obj = {
		// 		'token': cookievalue
		// 	}
		// }
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientPanNo.url, params, Object.assign(this.nativePanNoHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.clientPanNo.url, params, { headers: new HttpHeaders(this.panNoCookieKEY)});
	}

	public getTradeListing(cookievalue: any, tradeListPrams: any) {
		let params =  {"head": {"RequestCode": "TradeListing","Key": this.tradeListing.key,"AppName": this.tradeListing.appName,"AppVer": "1.0.4.0","OsName": "Android",
		"userType": localStorage.getItem('userType')},"body": {"ClientCode": tradeListPrams.clientCode,"ReportType":tradeListPrams.ReportType ,"FromDate": tradeListPrams.fromDate,"ToDate": tradeListPrams.ToDate, "exchange":tradeListPrams.exch}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.tradeListing.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.tradeListing.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getSettlementList(cookievalue: string, dataToPass: any) {
		let params = { "head": { "RequestCode": "CVUpdateLead01", "Key": this.settlement.key, "AppName": this.settlement.appName, "AppVer": "01", "OsName": "Android",
		"userType": localStorage.getItem('userType') }, "body": dataToPass }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.settlement.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.settlement.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getUnrealizedPl(cookievalue: any, Objprams: any) {
		let params =  {"head": {"RequestCode": "PnLSummaryUnRealized","Key": this.unRealizedPL.key,"AppName": this.unRealizedPL.appName,"AppVer": "1.0.4.0","OsName": "Android",
		"userType": localStorage.getItem('userType')},"body": {"ClientCode": Objprams.clientCode,"TillDate": Objprams.tillDate,"Product" : Objprams.product}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.unRealizedPL.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.unRealizedPL.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getRealizedPl(cookievalue: any, realizedPlParams: any) {
		// let params =  {
		// 	"head": {"RequestCode": "PnLSummaryRealized","Key": this.realizedPL.key,"AppName": this.unRealizedPL.appName,"AppVer": "1.0.4.0","OsName": "Android"},"body": {"ClientCode": "00225JPR","FromDate": "20130401","ToDate" :"20210825","Product" : "cash"}
		// }
		let params =  {
			"head": {"RequestCode": "PnLSummaryRealized","Key": this.realizedPL.key,"AppName": this.unRealizedPL.appName,"AppVer": "1.0.4.0","OsName": "Android",
			"userType": localStorage.getItem('userType')},"body": {"ClientCode": realizedPlParams.clientCode,"PartnerCode": localStorage.getItem("userId1"),"FromDate": realizedPlParams.fromDate,"ToDate":realizedPlParams.ToDate,"Product" : realizedPlParams.product}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.realizedPL.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.realizedPL.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public sharedDownloadReport(cookievalue: any, passObj: any) {
		let params: any =  passObj;
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.downloadReport.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.downloadReport.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	/**
	 * API call to download mf-account statement report.
	 * @param tokenValue 
	 * @param passObj 
	 * @returns 
	 */
	public downloadMfAccountReport(tokenValue: any, passObj: any) {
		let params: any = {
			"head":
			{
				"VID": this.mfReport.vid,
				"AppName": "Website",
				"AppVersion": "",
				"userType": localStorage.getItem('userType'),
				"Key": "446794970AAA1237ab394d176612f8c6",
			},
			"body": passObj
		}
		let obj: any = {};
		if (tokenValue) {
			obj = {
				'token': tokenValue,
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + btoa('+Ziie2ZAI4Y=:wEBYb4fMPXalOE/vdth5Tg=='),
				'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.mf,
				'appID': localStorage.getItem('appID') || ''
			}
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.mfReport.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.mfReport.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getCommodityrealtimereport(cookievalue: any,id: any) {
		let params: any = {
			"head":
			{
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"Clientcode": id
			}
		}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'token' : cookievalue,
			'appID': localStorage.getItem('appID') || ''
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.commodityrealtimereport.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.commodityrealtimereport.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getDPHoldingStatement(cookievalue:any, objPrams:any) {
		let params =  {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.dpHoldingStatement.key,
				"AppName": this.dpHoldingStatement.appName,
				"AppVer": "01",
       		    "OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"DPID": objPrams.DPID,
				"AsOnDate": objPrams.AsOnDate,
				"DPType" : objPrams.DPType
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.dpHoldingStatement.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.dpHoldingStatement.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
}