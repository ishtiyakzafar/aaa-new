import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HTTP } from "@ionic-native/http/ngx";
import { map } from 'rxjs/operators';
import { CommonService } from "../../helpers/common.service";
import { environment } from "../../../environments/environment";



@Injectable()
export class FDSMaturingService {

    private fdsDetail = URLS.FDSMatureDetails;

	public options = environment['optionalHeaders'];
	public headersParams = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	public maturityDetails(cookievalue: any, data: any): Observable<{}> {
		let params: any = {
			head: {
				RequestCode: "GetAAABookedMaturedFD",
				Key: this.fdsDetail.key,
				AppName: this.fdsDetail.appName,
				AppVer: "01",
				OsName: "Android",
			
			},
			// body: {
			// 	Loginid: clientID
			// }
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
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.fdsDetail.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.fdsDetail.url, params, { headers: new HttpHeaders(obj) });
    }
}