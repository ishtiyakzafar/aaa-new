import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";


@Injectable()
export class PayDetailsService {

	private payoutFDDetails = URLS.payoutFDDetails;
	private payoutBondsDetails = URLS.payoutBondsDetails;
	private payoutPmsDetails = URLS.payoutPmsDetails;
	private payoutMfDetails = URLS.payoutMfDetails;
	private payoutMldDetails = URLS.payoutMldDetails;
	private payoutNcdDetails = URLS.payoutNcdDetails;
	private payoutInsuranceDetails = URLS.payoutInsuranceDetails;
	private payoutAifDetails = URLS.payoutAifDetails;
	private payoutPtcDetails = URLS.payoutPtcDetails;
	private totalPayoutDetails = URLS.totalPayoutDetails;
	private eqPayoutDetails = URLS.eqPayoutDetails;

	public options = environment['optionalHeaders'];
	public headersParams = environment['headersParams'];
	private nativeHeaders = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	
	// PayDetails FD
	public getPayoutDetails(cookievalue: any, requestCode: any, bodyParams: any, type: any): Observable<{}> {
		let params = 
		{
		"head":{
			"requestcode":requestCode,
			"key":this.payoutFDDetails.key,
			"appver":"01",
			"appname": this.payoutFDDetails.appName,
			"osname":"Android",
			"userType": localStorage.getItem('userType')
		},
		"body": bodyParams
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		let setUrl;
		if(type == "fd"){
			setUrl = this.payoutFDDetails.url;
		}
		else if(type == "bonds"){
			setUrl = this.payoutBondsDetails.url;
		}
		else if(type == "pms"){
			setUrl = this.payoutPmsDetails.url;
		}
		else if(type == "mld"){
			setUrl = this.payoutMldDetails.url;
		}
		else if(type == "ncd"){
			setUrl = this.payoutNcdDetails.url;
		}
		else if(type == "mf"){
			setUrl = this.payoutMfDetails.url;
		}
		else if(type == "insu"){
			setUrl = this.payoutInsuranceDetails.url;
		}
		else if(type == "aif"){
			setUrl = this.payoutAifDetails.url;
		}
		else if(type == "ptc"){
			setUrl = this.payoutPtcDetails.url;
		}
		else if(type == "eq"){
			setUrl = this.eqPayoutDetails.url;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(setUrl, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(setUrl, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getTotalPayoutDetails(cookievalue: any, clientID: any, month: any): Observable<{}> {

		let params = {"head": {"RequestCode": "TotalPayoutDetails","Key": this.totalPayoutDetails.key,"AppName": this.totalPayoutDetails.appName,"AppVer": "1.0.4.0","OsName": "Android",
		"userType": localStorage.getItem('userType')},"body": {"RMCode": clientID,"PayoutMonth": month}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.totalPayoutDetails.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.totalPayoutDetails.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
	
}