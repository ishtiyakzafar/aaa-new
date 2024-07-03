import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { CommonService } from "../../helpers/common.service";
import { environment } from "../../../environments/environment";


@Injectable()
export class TotalClientService {

    private clientDetailList = URLS.clientDetailList;
	private rmProfile = URLS.rmProfile;
	private fetchClientDashboardDetails = URLS.fetchClientDashboardDetails;

	public options = environment['optionalHeaders'];
	public headersParams = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	public clientList(cookievalue: any, data: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.clientDetailList.key,
				AppName: this.clientDetailList.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			
			}
        }
        params['body']= data;
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientDetailList.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientDetailList.url, params, { headers: new HttpHeaders(obj) });
    }

	public fetchClientDetails(cookievalue: any, data: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "FetchClientDashBoardDetails",
				Key: this.fetchClientDashboardDetails.key,
				AppName: this.fetchClientDashboardDetails.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
				userType: localStorage.getItem('userType')
			}
        }
        params['body']= data;
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.fetchClientDashboardDetails.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.fetchClientDashboardDetails.url, params, { headers: new HttpHeaders(obj) });
    }

	public getRMProfile(dataParams?: any, cookieValue?: any): Observable<{}> {
		const params: any = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.rmProfile.key,
				"AppName": "AAA",
				"AppVer": "1.0.22.0",
				"OsName": this.commonService.getPlatform(),
				"userType": localStorage.getItem('userType')
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookieValue) {
			obj['token'] = cookieValue;
		}
		params['body'] = dataParams
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.rmProfile.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.rmProfile.url, params, { headers: new HttpHeaders(obj) });
	}

}