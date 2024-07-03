import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";



@Injectable()
export class SIPBookService {

    private sipLive = URLS.sipLive;
	private bounced = URLS.bouncedCeased;

	public options = environment['optionalHeaders'];
	public headersParams = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	public liveSIP(cookievalue: any, data: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.sipLive.key,
				AppName: this.sipLive.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			},
			// body: {
			// 	Loginid: clientID
			// }
        }
        params['body'] = data;
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.sipLive.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.sipLive.url, params, { headers: new HttpHeaders(obj) });
    }

	public bouncedSIP(cookievalue: any, data: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "GetAAABouncedCeasedSIP",
				Key: this.bounced.key,
				AppName: this.bounced.appName,
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.bounced.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.bounced.url, params, { headers: new HttpHeaders(obj) });
    }
}