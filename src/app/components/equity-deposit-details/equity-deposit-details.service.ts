import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { URLS } from "../../../config/api.config";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";

@Injectable()
export class EquityDepositDetailService {

	private list: any = URLS.equityDeposit;

	//header variables
	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders: any = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
			// console.log('service', this.nativeHttp);
			
	}

	// WATCHLIST TAB

	public getList(cookievalue: any, dataParams?: any): Observable<{}> {
		let params: any = {};

		params['head'] = {
			appName: this.list.appName,
			appVer: "1.0.26.0",
			key: this.list.key,
			// osName: this.commonService.getPlatform(),
            osName: 'Android',
			requestCode: "APIBO52UCVDWFY",
            Authkey: this.list.Authkey,
		};
		params['body'] = dataParams;

        let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
        if (cookievalue) {
			obj['token'] = cookievalue;
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.list.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.list.url, params, { headers: new HttpHeaders(obj) });
	}
}