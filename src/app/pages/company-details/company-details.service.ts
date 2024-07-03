import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { catchError, map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";


@Injectable()
export class CompanyDetailsService {

	private superStarStock = URLS.superstar;
	private cashFilter = URLS.cashfilter;
	private cashTabDetails = URLS.cashtabdetails;
	private marketDepth = URLS.marketdepth;
	private addScrip = URLS.deleteScrip;
	private cashscripcode = URLS.cashscripcode;
	private getoptionforsymbol = URLS.getoptionforsymbol;
	private newstabList = URLS.newstabList;
	private contractinfo = URLS.contractinfo;
	private futureOptdetails = URLS.futureOptDetails;
	private updatefutureOptDetails = URLS.updateFutureOptDetails

	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private nativeHeaders: any = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	public getSuperStarStock(passObj: any): Observable<{}> {

		let params = {
			"head": {
				"key": this.superStarStock.key,
				"appVer": "1.0.20.0",
				"appName": "AAA",
				"osName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"code": passObj
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.superStarStock.url, params, Object.assign(obj,this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.superStarStock.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
	public getCashFiler(params: any): Observable<{}> {
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.cashFilter.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.cashFilter.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
	public getCashTabDetails(passobj: any): Observable<{}> {
		let params = {
			"Exch": passobj.Exch,
			"ExchType": passobj.ExchType,
			"ScripCode": passobj.ScripCode,
			"ClientLoginType": 0,
			"RefreshRate": "H",
			"Count": 1,
			"LastRequestTime": "/Date(1593720083225+)/" 
		}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.cashTabDetails.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.cashTabDetails.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
	public getMarketDepthList(passobj: any): Observable<{}> {
		let params = {
			"Exch": passobj.Exch,
			"ExchType": passobj.ExchType,
			"ScripCode": passobj.ScripCode,
			"ClientLoginType": 0,
			"RequestType": 0 
		}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.marketDepth.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.marketDepth.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public futureOptgetDetailsUpdate(passobj: any) {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || ''
		}
		let params: any = {
			"head": {
				"requestCode": "IIFLMarRQCDP02",
				"key": this.updatefutureOptDetails.key,
				"appVer": "1.0.20.0",
				"appName": "AAA",
				"osName": "Android",
				"LoginId": passobj.clientCode,
				"userType": localStorage.getItem('userType') 
			},
			"body": {
				"Exch": passobj.Exch,
				"ExchType": passobj.ExchType,
				"ScripCode": passobj.ScripCode,
				"ClientLoginType": 0,
				"RefreshRate": "H",
				"Count": 1
			}
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.updatefutureOptDetails.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.updatefutureOptDetails.url, params, { headers: new HttpHeaders(obj) }).pipe(
			catchError(this.handleError)
		);
	}

	public addScripData(passobj: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		let params: any = {
			"Clientcode": passobj.clientCode,
			"MWname": passobj.MWname,
			"ClientLoginType": 0,
			"Data": [
				{
					"Exch": passobj.Exch,
					"ExchType": passobj.ExchType,
					"ScripCode": passobj.ScripCode,
					"Action": "A"
				}
			]
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.addScrip.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.addScrip.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) })
	}
	public CashScripFuture(passobj: any): Observable<{}> {
		let params = {
			"head": {
				"requestCode": "IIFLMarRQGetCashScripCode",
				"key": this.cashscripcode.key,
				"appVer": "1.0.22.0",
				"appName": "IIFLMarkets",
				"osName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"Exch": passobj.Exch,
				"Symbol": passobj.Symbol
			}
		}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.cashscripcode.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.cashscripcode.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) })
	}
	public getOptionalSymbol(passobj: any): Observable<{}> {
		let params = {
			"Exch": passobj.Exch,
			"Symbol": passobj.Symbol,
			"ExpiryDate": passobj.ExpiryDate
		}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getoptionforsymbol.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getoptionforsymbol.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) })
	}

	getFutureOptionDetails(scripCode: any): Observable<any> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.futureOptdetails.url + scripCode + '//-/-/-/0/-?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.futureOptdetails.url + scripCode + '//-/-/-/0/-?responsetype=json', { headers: new HttpHeaders(passheader) })
	}

	//Not Implemented
	public getNewsTabList(): Observable<any> {
		// let params = {"Exch":passobj.Exch,"Symbol":passobj.Symbol,"ExpiryDate":passobj.ExpiryDate}
		// return this.httpClient.get(this.newstabList+'SBIN')  
		return this.httpClient.get("./assets/datafile.json");
	}
	//Not Implemented
	public getNewsTabDetails(): Observable<any> {
		// let params = {"Exch":passobj.Exch,"Symbol":passobj.Symbol,"ExpiryDate":passobj.ExpiryDate}
		//return this.httpClient.get(this.newstabList+'SBIN')  
		return this.httpClient.get("./assets/datafile.json");
	}
	public getContractInfo(passObj: any): Observable<{}> {
		let params = {
			"head": {
				"requestCode": "IIFLMarRQScripDetailsFoFOOrderV3",
				"key": this.contractinfo.key,
				"appVer": "1.0.22.0",
				"appName": "AAA", 
				"osName": "Android", 
				"LoginId": "c66350",
				"userType": localStorage.getItem('userType') 
			}, 
			"body": { 
				"Exch": passObj.Exch, 
				"ExchType": passObj.ExchType, 
				"ScripCode": passObj.ScripCode 
			} 
		}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.contractinfo.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.contractinfo.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) })
	}

	handleError(error: HttpErrorResponse) {
		// console.log(error.statusText);
		alert(error.statusText);
		return throwError(error);
	}
}