import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HTTP } from "@ionic-native/http/ngx";
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";



@Injectable()
export class BrokerageService {

	private brokerageDetailsList = URLS.brokerageDetailsList;
	private due = URLS.brokerageDue;

	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders: any = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	public getBrokerageDetails(cookievalue: any, data: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.brokerageDetailsList.key,
				AppName: this.brokerageDetailsList.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			}
        }
        params['body'] = data;
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || '',
			'token': localStorage.getItem('brokerageToken')
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.brokerageDetailsList.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.brokerageDetailsList.url, params, { headers: new HttpHeaders(obj) });
	}

	public getBrokerageDue(cookievalue: any, data: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.due.key,
				AppName: this.due.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			
			}
        }
        params['body'] = data;
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.due.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.due.url, params, { headers: new HttpHeaders(obj) });
	}

}