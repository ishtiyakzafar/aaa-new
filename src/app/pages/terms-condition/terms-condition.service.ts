import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { catchError, map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";


@Injectable()
export class TermsConditionService {

	
    private termsConditions: any = URLS.termCondition;
	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders: any = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	
	public getTermsConditionFile(): Observable<{}> {
        let params = {"head":{"requestCode":"IIFLMarRQTC01","key":this.termsConditions.key,"appVer":"1.0.20.0","appName":"AAA","osName":"Android","LoginId":"C9685",
		"userType": localStorage.getItem('userType')},"body":{}}
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.termsConditions.url, params, Object.assign(obj,this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.termsConditions.url, params, { headers: new HttpHeaders(Object.assign(obj,this.headersParams)) });
	}
	
}