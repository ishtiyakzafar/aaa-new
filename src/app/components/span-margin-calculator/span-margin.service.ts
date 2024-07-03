import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";

@Injectable()
export class SpanScripService {

	private searchEquityScrip = URLS.equityFutureOpt;
	private searchCurrencyScrip = URLS.currencyFutureOpt;
	private searchFutureDetails = URLS.searchFutureDetails;
	private searchOptionExpiry = URLS.searchOptionExpiry;
	private getOptionsDetails = URLS.getOptionsDetails;
	private getMFeeds = URLS.getMFeedList;
	private addSpan = URLS.addSpan;
	private calculateSpan = URLS.calculateSpan;
	private marginDetails = URLS.marginDetails;
	private delMargin = URLS.delMargin;
	private resetMargin = URLS.resetMargin;

	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private nativeHeaders: any = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	public getEquityScrips(params: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.searchEquityScrip.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.searchEquityScrip.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getCurrencyScrips(params: any): Observable<{}> {
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.searchCurrencyScrip.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.searchCurrencyScrip.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getMFeedList(dataParams?: any): Observable<{}> {
		const bodyParam = environment['bodyParams'];
		let params: any = {};
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}

		params['head'] = {
			appName: "IIFLMarkets",
			appVer: "1.0.20.0",
			key: this.getMFeeds.key,
			osName: "Android",
			requestCode: "IIFLMarRQMarFeedV4",
		
		};
		if (dataParams) params['body'] = dataParams;
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getMFeeds.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getMFeeds.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public addMargin(params: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}

		const passObj: any = {};
		passObj['head'] = {
			appName: "IIFLMarkets",
			appVer: "1.0.22.0",
			key: this.addSpan.key,
			osName: "Android",
			requestCode: "IIFLMarRQAddMargin",
			LoginId: params['ClientCode'],
		
		};
		if (params) passObj['body'] = params;
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.addSpan.url, passObj, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.addSpan.url, passObj, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public calculate(params: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}

		const passObj: any = {};
		passObj['head'] = {
			appName: "IIFLMarkets",
			appVer: "1.0.22.0",
			key: this.calculateSpan.key,
			osName: "Android",
			requestCode: "IIFLMarRQSpanMarginCalculation",
			LoginId: params['ClientCode'],
		
		};
		if (params) passObj['body'] = params;
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.calculateSpan.url, passObj, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.calculateSpan.url, passObj, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public marginData(params: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		
		const passObj: any = {};
		passObj['head'] = {
			appName: "IIFLMarkets",
			appVer: "1.0.22.0",
			key: this.marginDetails.key,
			osName: "Android",
			requestCode: "IIFLMarRQGetMargin",
			LoginId: params['ClientCode'],
		
		};
		if (params) passObj['body'] = params;
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.marginDetails.url, passObj, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.marginDetails.url, passObj, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public deleteMargin(params: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		
		const passObj: any = {};
		passObj['head'] = {
			appName: "IIFLMarkets",
			appVer: "1.0.22.0",
			key: this.delMargin.key,
			osName: "Android",
			requestCode: "IIFLMarRQDeleteMargin",
			LoginId: params['ClientCode'],
		
		};
		if (params) passObj['body'] = params;
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.delMargin.url, passObj, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.delMargin.url, passObj, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public reset(params: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		
		const passObj: any = {};
		passObj['head'] = {
			appName: "IIFLMarkets",
			appVer: "1.0.22.0",
			key: this.resetMargin.key,
			osName: "Android",
			requestCode: "IIFLMarRQResetMargin",
			LoginId: params['ClientCode'],
		
		};
		if (params) passObj['body'] = params;
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.resetMargin.url, passObj, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.resetMargin.url, passObj, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getSearchFutureDetails(passObj: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.searchFutureDetails.url, passObj, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.searchFutureDetails.url, passObj, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getOptionsScripDetails(dataParams?: any): Observable<{}> {
		let params = {};
		if (dataParams) params = dataParams;
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getOptionsDetails.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getOptionsDetails.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getSearchOptionExpiry(passObj: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.searchOptionExpiry.url, passObj, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.searchOptionExpiry.url, passObj, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
}