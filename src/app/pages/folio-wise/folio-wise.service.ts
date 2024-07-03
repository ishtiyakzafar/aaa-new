import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { URLS } from '../../../config/api.config';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";

@Injectable()
export class FolioWiseService {
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders: any = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient, private nativeHttp: HTTP, private commonService: CommonService) {
	}

	public FolioWiseClientDetails(token: string, body: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": URLS.foliowise.key,
				"AppVer": "1.0",
				"AppName": URLS.foliowise.appName,
				"OsName": this.commonService.getPlatform(),
				"userType": localStorage.getItem('userType')
			},
			"body": body
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(URLS.foliowise.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(URLS.foliowise.url, params, { headers: new HttpHeaders(obj) });
	}
}