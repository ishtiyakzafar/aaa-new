import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { URLS } from "../../../config/api.config";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";

@Injectable()
export class ForgotPasswordService {

	private forgot = URLS.forgotPass;
	public headersParams = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders = environment['nativeHeaders'];

	public options = environment['optionalHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService,) {
	}

	public checkPassword(dataParams?: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || ''
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.forgot.url, dataParams, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.forgot.url, dataParams, { headers: new HttpHeaders(Object.assign(obj, this.options)) });
	}
}