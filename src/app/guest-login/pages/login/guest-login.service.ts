import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { URLS } from "../../../../config/api.config";
import { environment } from "../../../../environments/environment";
import { CommonService } from "../../../helpers/common.service";
import { CustomEncryption } from "../../../../config/custom-encrypt";

@Injectable()
export class LoginService {
	private guestGenerateOtp = URLS.guestGenerateOtp;
	private guestValidateOtp = URLS.guestValidateOtp;
 
	// for new login End config
	public headersParams: any = environment['headersParams'];
 	private nativeHeaders: any = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private ciphetText: CustomEncryption,
		private commonService: CommonService) {
	}

	public generateGuestOtp(mobileNo: any, inputData: any): Observable<{}> {
		const params = {
			"head":
			{
				"RequestCode": "GuestLogin",
				"Key": this.guestGenerateOtp.key,
				"AppName": this.guestGenerateOtp.appName,
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"Checksum": inputData.checksumStr,
				"ChecksumKey": inputData.checksumKey
			},
			"body":
			{
				"MobNo": this.ciphetText.aesEncrypt(mobileNo)
			}
		}
		let appIdUserType = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}

		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.guestGenerateOtp.url, params, Object.assign(appIdUserType, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.guestGenerateOtp.url, params, { headers: new HttpHeaders(appIdUserType) })
	}
	public validateGuestOtp(mNo: any, otp: any, checkSum: any): Observable<{}> {
		const params = {
			"head":
			{
				"RequestCode": "GuestLogin",
				"Key": this.guestValidateOtp.key,
				"AppName": this.guestValidateOtp.appName,
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"Checksum": checkSum.checksumStr,
				"ChecksumKey": checkSum.checksumKey
			},
			"body":
			{
				"MobNo": this.ciphetText.aesEncrypt(mNo),
				"OTP": this.ciphetText.aesEncrypt(otp)
			}
		}

		let appIdUserType = {
			userAgent: "AAA-WebSite",
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}

		this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.guestValidateOtp.url, params, Object.assign(appIdUserType, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.guestValidateOtp.url, params, { headers: new HttpHeaders(appIdUserType) })
	}
	
}