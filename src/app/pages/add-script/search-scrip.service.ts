import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";

@Injectable()
export class searchScripService {

	private equityCash = URLS.equityCash;
	private equityFutureOpt = URLS.equityFutureOpt;
	private currencyFutureOpt = URLS.currencyFutureOpt;
	private commodityFuture = URLS.commodityFuture;
	private marketfeedsearch = URLS.marketfeedsearch;
	private searchFutureDetails = URLS.searchFutureDetails;
	private searchFutCommoDetails = URLS.searchFutCommoDetails;
	private searchOptionExpiry = URLS.searchOptionExpiry;
	private searchOptionScripDetail = URLS.searchOptionScripDetail
	private commodityMarketfeed = URLS.commodityMarketfeed

	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders: any = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	public getEquityCash(params: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.equityCash.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.equityCash.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getEquityFutureOpt(params: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.equityFutureOpt.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.equityFutureOpt.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getCurrencyFutureOpt(params: any): Observable<{}> {
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.currencyFutureOpt.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.currencyFutureOpt.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getCommodityFuture(dataParams: any): Observable<{}> {
		let params = {};
		if (dataParams) params = JSON.stringify(dataParams);
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('utf8');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.commodityFuture.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.commodityFuture.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getMarketFeedSearch(array: any, catcheTime: any): Observable<{}> {
		let params = { "Count": array.length, "MarketFeedData": array, "ClientLoginType": 0, "RefreshRate": "H", "date": catcheTime, "Date": catcheTime }
		this.headersParams['token'] =  '.ASPXAUTH=' + localStorage.getItem('JwtToken');
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.marketfeedsearch.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.marketfeedsearch.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getCommodityMarketFeed(array: any, catcheTime: any): Observable<{}> {
		let params = { "Count": array.length, "MarketFeedData": array, "ClientLoginType": 1, "LastRequestTime": catcheTime }
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.commodityMarketfeed.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.commodityMarketfeed.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
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

	public getSearchFutureCommoDetails(passObj: any): Observable<{}> {
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.searchFutCommoDetails.url, passObj, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.searchFutCommoDetails.url, passObj, { headers: new HttpHeaders( Object.assign(obj, this.headersParams)) });
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

	public getSearchOptionDetails(passObj: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.searchOptionScripDetail.url, passObj, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.searchOptionScripDetail.url, passObj, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
}