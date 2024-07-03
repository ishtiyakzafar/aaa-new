import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { URLS } from "../../../config/api.config";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";

@Injectable()
export class MarketService {

	private marketWatch = URLS.marketWatchList;
	private getMWatch = URLS.getMWatchList;
	private getMFeeds = URLS.getMFeedList;
	private default = URLS.setDefault;
	private delScrip = URLS.deleteScrip;

	//snapshot URLS
	//  private weekhighlow1 = URLS.weekhighlow1;
	private gainers = URLS.gainers;
	private weekhighlow = URLS.weekhighlow;
	private voltopper = URLS.voltopper;
	private bulkblockdeal = URLS.bulkblockdeal;

	// Indices
	private dashHeader = URLS.dashHeader;
	private indicesNew = URLS.indiceMaster;
	private currCommoIndices = URLS.currCommoIndices
	private globalMarIndices = URLS.globalMarketIndices
	private indiDetails = URLS.indiDetails;

	// Market Status
	private marketStatus = URLS.exchStatus;

	//Expo List
	private expoList = URLS.exposureList;
	private catagoryDescrip = URLS.exposureDescription;

	// Snapshot Derivatives
	private futGain = URLS.futGain;
	private futOIGain = URLS.futOIGain;
	private rollOver = URLS.rollOver;
	private deliveryPer = URLS.deliveryPer;
	private premiumPercent = URLS.premiumPercent;
	private mostActiveSTK = URLS.mostActiveSTK;

	//header variables
	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private nativeHeaders: any = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
			// console.log('service', this.nativeHttp);
	}

	// WATCHLIST TAB

	public getMarketList(dataParams?: any): Observable<{}> {
		
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		let params = {};
		params = dataParams;

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.marketWatch.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.marketWatch.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getMList(dataParams?: any): Observable<{}> {
		let params = {};		
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (dataParams) params = JSON.stringify(dataParams);

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('utf8');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getMWatch.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getMWatch.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
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
			osName: this.commonService.getPlatform(),
			requestCode: "IIFLMarRQMarFeedV4"
		};
		if (dataParams) params['body'] = dataParams;

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getMFeeds.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getMFeeds.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public setAsDefault(dataParams?: any) {
		const bodyParam = environment['bodyParams'];
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		let params: any = {};

		params['head'] = bodyParam['head'];
		if (dataParams) params = dataParams;

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.default.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.default.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public recentScrip(dataParams?: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		let params: any = {};

		if (dataParams) params = dataParams;

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.delScrip.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.delScrip.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getGainersLosers(dataParams?: any) {
		let params: any = {};
		params = dataParams;
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.gainers.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.gainers.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
	public weekHighLow(exchType: any, currentdate: any): Observable<{}> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.weekhighlow.url + exchType + 'se/' + currentdate + '/0/0?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.weekhighlow.url + exchType + 'se/' + currentdate + '/0/0?responsetype=json', { headers: new HttpHeaders(Object.assign(passheader)) });
	}
	public getVolToppers(dataParams: any): Observable<{}> {
		let params: any = {
			"head": {
				"requestCode": "IIFLMarRQTopTradedV3",
				"key": this.voltopper.key,
				"appVer": "1.0.20.0",
				"appName": "IIFLMarkets",
				"osName": this.commonService.getPlatform(),
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"Exch": dataParams,
				"ExchType": "C",
				"ClientLoginType": 0
			}
		}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.voltopper.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.voltopper.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) })
	}

	public bulkBlock(exch: any, type: any): Observable<any> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.bulkblockdeal.url + exch + 'se/' + type + '/0/0/0?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.bulkblockdeal.url + exch + 'se/' + type + '/0/0/0?responsetype=json', { headers: new HttpHeaders(Object.assign(passheader)) });
	}

	//Indices

	public getCommonHead(): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.dashHeader.url, {}, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.dashHeader.url, {}, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getIndices(): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.indicesNew.url, {}, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.indicesNew.url, {}, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}

	public getCurrIndices():Observable<{}> {
        const passheader = {
            Authorization:'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.currCommoIndices.url + '?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.currCommoIndices.url + '?responsetype=json',{ headers: new HttpHeaders(Object.assign(passheader))});
    }
    
    public getCommIndices():Observable<{}> {
        const passheader = {
            Authorization:'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.currCommoIndices.url + '?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.currCommoIndices.url + '?responsetype=json',{ headers: new HttpHeaders(Object.assign(passheader))});
    }
    
    public getMarketIndices(): Observable<{}> {
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.globalMarIndices.url, {}, Object.assign({},this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) :  this.httpClient.get(this.globalMarIndices.url,{headers: new HttpHeaders(this.headersParams)});
    }
    
    public getIndiDetails(dataParams?: any): Observable<{}> {
        let params = {};
		if (dataParams) params = JSON.stringify(dataParams);
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('utf8');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.indiDetails.url,params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : 
		this.httpClient.post(this.indiDetails.url,params,{headers: new HttpHeaders(Object.assign(obj, this.headersParams))});
	}
	
	public getMarketStatus(userID: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
        let params = {"head":{"requestCode":"IIFLMarRQGEXS01","key":this.marketStatus.key,"appVer":"1.0.20.0","appName":"AAA","osName":"Android","LoginId":userID,
		"userType": localStorage.getItem('userType')},"body":{}}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.marketStatus.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.marketStatus.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams))});
	}

	public getExpoList(exch: any,userID: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
        let params = {"head":{"requestCode":"IIFLMarRQGCE","key":this.expoList.key,"appVer":"1.0.22.0","appName":"IIFLMarkets","osName":"Android","LoginId":userID,
		"userType": localStorage.getItem('userType')},"body":{"ExchType":exch,"ClientCode":userID}}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.expoList.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) :  this.httpClient.post(this.expoList.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams))});
	}
	public getCatagoryDesr(catagory: any, userID: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		let params = {"head":{"requestCode":"IIFLMarRQGCSI","key":this.catagoryDescrip.key,"appVer":"1.0.22.0","appName":"IIFLMarkets","osName":"Android","LoginId":"0005SNSM",
	   "userType": localStorage.getItem('userType')},"body":{"Exch":"N","Category":catagory,"ClientCode":"0005SNSM"}}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.catagoryDescrip.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.catagoryDescrip.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams))});
	}

	// FUT Gainers and Losers
	public futGainLoose(): Observable<{}> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.futGain.url + '/all/0/0?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.futGain.url + '/all/0/0?responsetype=json', { headers: new HttpHeaders(Object.assign(passheader)) });
	}

	// FUT OI Gainers and Losers
	public futOIGainLoose(): Observable<{}> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.futOIGain.url + '/all/0/0?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.futOIGain.url + '/all/0/0?responsetype=json', { headers: new HttpHeaders(Object.assign(passheader)) });
	}

	// ROLL OVER PERCENT
	public rollOverPercent(): Observable<{}> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.rollOver.url + '/0/1?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.rollOver.url + '/0/1?responsetype=json', { headers: new HttpHeaders(Object.assign(passheader)) });
	}

	// DELIVERY PERCENT
	public deliveryPercent(): Observable<{}> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.deliveryPer.url + '/0/0?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.deliveryPer.url + '/0/0?responsetype=json', { headers: new HttpHeaders(Object.assign(passheader)) });
	}

	// PREMIUM PERCENT
	public premiumPer(): Observable<{}> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'appID': localStorage.getItem('appID') || '',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.premiumPercent.url + '/pre/1/5?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.premiumPercent.url + '/pre/1/5?responsetype=json', { headers: new HttpHeaders(Object.assign(passheader)) });
	}

	// PREMIUM DISCOUNT
	public discountPer(): Observable<{}> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.premiumPercent.url + '/dis/1/5?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.premiumPercent.url + '/dis/1/5?responsetype=json', { headers: new HttpHeaders(Object.assign(passheader)) });
	}

	// MOST ACTIVE STOCK
	public mostActiveStock(): Observable<{}> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.mostActiveSTK.url + '/OPTSTK/CE/-/0/0?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.mostActiveSTK.url + '/OPTSTK/CE/-/0/0?responsetype=json', { headers: new HttpHeaders(Object.assign(passheader)) });
	}

	// MOST ACTIVE STOCK INDEX
	public mostActiveStockIndex(): Observable<{}> {
		const passheader = {
			Authorization: 'Basic aW5kaWFpbmZvbGluZVxhYWFhbmRyb2lkOlctTjIleCRzNkM=',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.papi,
			'appID': localStorage.getItem('appID') || ''
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.mostActiveSTK.url + '/OPTIDX/CE/-/0/0?responsetype=json', {}, Object.assign(passheader, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.mostActiveSTK.url + '/OPTIDX/CE/-/0/0?responsetype=json', { headers: new HttpHeaders(Object.assign(passheader)) });
	}
}