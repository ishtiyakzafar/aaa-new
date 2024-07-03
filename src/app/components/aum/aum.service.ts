import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HTTP } from "@ionic-native/http/ngx";
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";


@Injectable()
export class AUMService {

    private aumEquity = URLS.aumEquity;
    private aumMutual = URLS.aumMutualFund;
    private aumFDBond = URLS.aumFDBond;
    private aumPMS = URLS.aumPMS;
    private aumMLDS = URLS.aumMLDS;

	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders: any = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	public equityData(cookievalue: any, filterObj: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.aumEquity.key,
				AppName: this.aumEquity.appName,
				AppVer: "1.0.4.0",
				OsName: "Android"
			},
		}
		params['body'] = filterObj
		params['body']['Loginid'] = localStorage.getItem('userId1')
		params['body']['Datatype'] = localStorage.getItem('toggleSwitch')
		params['body']['Role'] = localStorage.getItem('userChannel')
		params['body']['UserType'] = localStorage.getItem('userType')
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.aumEquity.url, params, Object.assign(obj,this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.aumEquity.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
    }
    
    public mutualFundData(cookievalue: any, filterObj: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.aumMutual.key,
				AppName: this.aumMutual.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			}
		}
		params['body'] = filterObj
		params['body']['Loginid'] = localStorage.getItem('userId1')
		params['body']['Datatype'] = localStorage.getItem('toggleSwitch')
		params['body']['Role'] = localStorage.getItem('userChannel')
		params['body']['UserType'] = localStorage.getItem('userType')
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.aumMutual.url, params, Object.assign(obj,this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.aumMutual.url, params, { headers: new HttpHeaders(obj) });
    }

    public fdBond(cookievalue: any, filterObj: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.aumFDBond.key,
				AppName: this.aumFDBond.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			}
		}
		params['body'] = filterObj;
		params['body']['Loginid'] = localStorage.getItem('userId1')
		params['body']['Datatype'] = localStorage.getItem('toggleSwitch')
		params['body']['Role'] = localStorage.getItem('userChannel')
		params['body']['UserType'] = localStorage.getItem('userType')
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.aumFDBond.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.aumFDBond.url, params, { headers: new HttpHeaders(obj) });
    }

    public pmsData(cookievalue: any, filterObj: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.aumPMS.key,
				AppName: this.aumPMS.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			}
		}
		params['body'] = filterObj;
		params['body']['Loginid'] = localStorage.getItem('userId1')
		params['body']['Datatype'] = localStorage.getItem('toggleSwitch')
		params['body']['Role'] = localStorage.getItem('userChannel')
		params['body']['UserType'] = localStorage.getItem('userType')
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.aumPMS.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.aumPMS.url, params, { headers: new HttpHeaders(obj) });
    }

    public mldsData(cookievalue: any, filterObj: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "APIBO52UCVDWFY",
				Key: this.aumMLDS.key,
				AppName: this.aumMLDS.appName,
				AppVer: "01",
				OsName: "Android"
			}
		}
		params['body'] = filterObj;
		params['body']['Loginid'] = localStorage.getItem('userId1')
		// params['body']['PartnerID'] = localStorage.getItem('empCode') ? localStorage.getItem('empCode') : localStorage.getItem('userId1')
		params['body']['Datatype'] = localStorage.getItem('toggleSwitch')
		params['body']['Role'] = localStorage.getItem('userChannel')
		params['body']['UserType'] = localStorage.getItem('userType')
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.aumMLDS.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.aumMLDS.url, params, { headers: new HttpHeaders(obj) });
    }


}