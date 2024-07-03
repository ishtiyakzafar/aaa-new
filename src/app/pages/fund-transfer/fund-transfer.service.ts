import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";


@Injectable()
export class FundTransferService {

	

    private availableTotalFund = URLS.availableFund
    private requestLedgerTransfer = URLS.interLedgerTransfer
    private fundPayoutDetail = URLS.fundPayoutDetail
    private amountForInterTransfer = URLS.amountForInterTransfer
    private payOutRequest = URLS.payOutRequest
    private payoutHistory = URLS.payoutHistory

	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	public panNoCookieKEY: any = environment['panNoCookieKEY'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
    private nativeHeaders: any = environment['nativeHeaders'];

	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}


    
    public getTotalFund(clientCode: any): Observable<{}> {
		let params = {"body":{"ClientCode":clientCode,"Segment":"all"},"head":{"requestCode":"IIFLMarRQLR01","key":this.availableTotalFund.key,"appVer":"1.0.22.0","appName":this.availableTotalFund.appName,"osName":"Android",
        "userType": localStorage.getItem('userType')}}
        let obj: any = {
            'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
        };
        if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.availableTotalFund.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.availableTotalFund.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams))});
        
    }
    

    public requestTransferLedger(cookievalue: any,amount: any,transferType: any, userId: any, clientCode: any): Observable<{}> {
        let params = {"head":{"requestCode":"IIFLMarRQRILTAAA02","key":this.requestLedgerTransfer.key,"appVer":"1.0.22.0","appName":this.requestLedgerTransfer.appName,"osName":"Android","LoginId":userId,
        "userType": localStorage.getItem('userType')},"body":{"ClientCode":clientCode,"Amount":amount,"TransferDirection": transferType}}
        let obj: any = {
            'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
        };
		if (cookievalue) {
			obj['token'] = cookievalue;
        }
        if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.requestLedgerTransfer.url, params, Object.assign(obj,this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.requestLedgerTransfer.url, params, { headers: new HttpHeaders(Object.assign(obj,this.headersParams))});
    }
    
    public getfundPayout(dataParams: any): Observable<{}> {
        let params = {};
        let obj: any = {
            'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
        };
		if (dataParams) params = JSON.stringify(dataParams);
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('utf8');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.fundPayoutDetail.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.fundPayoutDetail.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams))});
       
    }
    
    public getAmountForInterTransfer(clientCode: any): Observable<{}> {
		let params = {"body":{"ClientCode":clientCode,"Segment":"all"},"head":{"requestCode":"IIFLMarRQLR01","key":this.amountForInterTransfer.key,"appVer":"1.0.22.0","appName":this.amountForInterTransfer.appName,"osName":"Android",
        "userType": localStorage.getItem('userType')}}
        let obj: any = {
            'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
        };
        if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.amountForInterTransfer.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) :this.httpClient.post(this.amountForInterTransfer.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
    }

    public getPayoutRequest(amount: any, remark: any, bankdetails: any, userId: any, clientCode: any, cookievalue: any): Observable<{}> {
		bankdetails = bankdetails.replace(">","#");
        let params = {
            "head": {
                "RequestCode": "MFRQLO01",
                "Key": this.payOutRequest.key,
                "AppVer": "1.0.4.0",
                "AppName": this.payOutRequest.appName,
                "OsName": "Android",
                "LoginId": userId,
				"userType": localStorage.getItem('userType')
            },
            "body": {
                "ClientCode":clientCode,
                "Paymode": "EFT",
                "BankName": bankdetails,
                "Amount": amount,
                "Paylocation": "",
                "Printlocation": "",
                "Remark": remark,
                "Product": "EQ",
                "RequesterCode": userId
            }
        }
        let obj: any = {
            'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
        };
        if (cookievalue) {
            obj['token'] = cookievalue;
        }
        if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.payOutRequest.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.payOutRequest.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams))});
    }

    public getPayoutHistory(clientCode: any): Observable<{}> {
        let params = {"ClientCode":clientCode,"Product":"EQUITY"}
        let obj: any = {
            'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt
        };
        if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.payoutHistory.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) :this.httpClient.post(this.payoutHistory.url, params, { headers: new HttpHeaders(Object.assign(obj, this.headersParams)) });
    }

    

}