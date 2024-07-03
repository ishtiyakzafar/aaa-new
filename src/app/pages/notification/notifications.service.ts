import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';


import { catchError, map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";


@Injectable()
export class NotifictionCenterService {

	
    private notifictionCen = URLS.notification;
	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	private nativeHeaders: any = environment['nativeHeaders'];
	private gatewaySubscriptionKey: any = environment['gatewaySubscriptionKey'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	
	public getAllNotification(userID: any, timeStamp: any): Observable<{}> {
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || ''
		}
        let params = {"head": { "requestCode":"IIFLMarRQNotiCentreV3","key":this.notifictionCen.key,"appVer":"1.0.22.0","appName":"IIFLMarkets","osName":"Android",
		"userType": localStorage.getItem('userType')}, "body": {"ClientCode":userID,"LastRequestedTime":"/Date("+timeStamp+")/","IsDealer":"Y"}} 
		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.notifictionCen.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.notifictionCen.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
	}
	
}