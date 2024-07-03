import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { CommonService } from "../../helpers/common.service";

@Injectable()
export class ClientListService {

	private clientListData = URLS.clientList;
	private getMFeeds = URLS.getMFeedList;
	private getDates = URLS.getDates;
	private getOptionsDate = URLS.getOptionsDate;
	private getOptionsDetails = URLS.getOptionsDetails;

	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private nativeHeaders: any = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}
	public getMarketTableData(dataParams: any): Observable<{}> {
		let params = { "head": { "appName": "IIFLMarkets", "appVer": "1.0.20.0", "key": this.clientListData.key, "osName": "Android", "requestCode": "IIFLMarRQManagerWiseClientHT",
		"userType": localStorage.getItem('userType') }, "body": dataParams }
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientListData.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientListData.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
	public getMFeedList(dataParams?: any): Observable<{}> {
		const bodyParam = environment['bodyParams'];
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		let params: any = {};
		params['head'] = {
			appName: "IIFLMarkets",
			appVer: "1.0.20.0",
			key: this.getMFeeds.key,
			osName: "Android",
			requestCode: "IIFLMarRQMarFeedV4"
		};
		if (dataParams) params['body'] = dataParams;

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getMFeeds.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getMFeeds.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
	public getExipry(dataParams?: any): Observable<{}> {
		let params = {};
		if (dataParams) params = dataParams;
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getDates.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getDates.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
	public getOptionsExpiryDate(dataParams?: any): Observable<{}> {
		let params = {};
		if (dataParams) params = dataParams;
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getOptionsDate.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getOptionsDate.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
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
}