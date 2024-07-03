import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { URLS } from "../../../config/api.config";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";

@Injectable()
export class DeleteScripService {

	private delScrip = URLS.deleteScrip;

	public options = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private nativeHeaders = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	public deleteScrip(dataParams?: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		let params = {};

		if (dataParams) params = dataParams;
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.delScrip.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.delScrip.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
}