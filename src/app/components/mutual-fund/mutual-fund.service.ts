import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";

@Injectable()
export class MutualFundService {

	private sipOrderBook = URLS.sipOrderBook;
	private orderBookMf = URLS.orderBookMf;
	private dpHolding = URLS.dpHolding;
	private statAcc = URLS.statAcc;
	private portfolioMf = URLS.portfolioMf
	
	

	public options: any = environment['optionalHeaders'];
	public headersParams: any = environment['headersParams'];
	public gatewaySubscriptionKey: any = environment['gatewaySubscriptionKey'];
	// public authorization: any = environment['authorizationCred'];		key not there in environment file
	public panNoCookieKEY = environment['panNoCookieKEY'];

	// private nativeHeaders = environment['nativeHeaders'];
	private nativePanNoHeaders = environment['nativePanNoHeaders']
	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}


    
    public getSipRegistraBook(prev: any, today: any,userId?: any, userType?: any, clientCode?: any): Observable<{}> {
		let params = {"objHeader":{"VID":this.sipOrderBook.vid,"AppName":this.sipOrderBook.appName,"AppVersion":"1.0.22.0"},"sClientCode":clientCode,"pStartDate":`/Date(${prev})/`,"pendDate":`/Date(${today})/`,"pSegMent":"M","pOrderStatus":"L","IsAgentClient":"Y","RequesterType":userType,"OrderRequesterCode":userId}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.sipOrderBook.url, params, Object.assign(this.nativePanNoHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.sipOrderBook.url, params, {headers: new HttpHeaders( this.panNoCookieKEY)});
		
	}

	public getOrderBookMf(userId: any, userType: any, clientCode: any): Observable<{}> {
		//let params = {"body":{"CaseID":caseId,"CustomerID":"","EmployeeId":"ckv000rm","FromDate":this.commonService.Last7Days("last"),"Status":"","ToDate":this.commonService.Last7Days("first")},"head":{"appname":"AAA","appver":"1.0.26.0","Authkey":"53D7AE755B82D5C2","key":"446794970AAA1237ab394d176612f8c6","osname":"Android","requestcode":"APIBO52UCVDWFY"}}
		let params = {"head":{"VID":this.orderBookMf.vid,"AppName":this.orderBookMf.appName,"AppVersion":"1.0.22.0"},"body":{"ClientCode":clientCode,"IsAgentClient":"Y","RequesterType":userType,"OrderRequesterCode":userId}}
	
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.orderBookMf.url, params, Object.assign(this.nativePanNoHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.orderBookMf.url, params,{headers: new HttpHeaders( this.panNoCookieKEY)})
	}

	public getDpHolding(clientCode: any): Observable<{}> {
		//let params = {"body":{"CaseID":caseId,"CustomerID":"","EmployeeId":"ckv000rm","FromDate":this.commonService.Last7Days("last"),"Status":"","ToDate":this.commonService.Last7Days("first")},"head":{"appname":"AAA","appver":"1.0.26.0","Authkey":"53D7AE755B82D5C2","key":"446794970AAA1237ab394d176612f8c6","osname":"Android","requestcode":"APIBO52UCVDWFY"}}
		let params = {"body":{"ClientCode":clientCode},"head":{"VID":this.dpHolding.vid,"AppName":this.dpHolding.appName,"AppVersion":"1.0.26.0"}}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.dpHolding.url, params, Object.assign(this.nativePanNoHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})):this.httpClient.post(this.dpHolding.url, params,{headers: new HttpHeaders( this.panNoCookieKEY)})
	}

	public getAccState(pan: any,lastDate: any,firstDate: any): Observable<{}> {
		let params = {"body":{"PANNO":pan,"FromDate":`/Date(${lastDate})/`,"ToDate":`/Date(${firstDate})/`},"head":{"VID":this.statAcc.vid,"AppName":this.statAcc.appName,"AppVersion":"1.0.26.0"}}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.statAcc.url, params, Object.assign(this.nativePanNoHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})):this.httpClient.post(this.statAcc.url, params,{headers: new HttpHeaders( this.panNoCookieKEY)})
	}

	public getPortfolioMf(clientCode: any): Observable<{}> {
		// let params = {"body":{"CLIENTCODE":clientCode},
		// "head":{"VID":"AS30RH5KC20","AppName":"AAA","AppVersion":"1.0.2.0"}}   
		let params = {"body":{"CLIENTCODE":clientCode},
		"head":{"VID":"AS30RH5KC20","AppName":"AAA","AppVersion":"1.0.2.0"}}   
		const passheader = {
			Authorization: 'Basic K1ppaWUyWkFJNFk9OndFQlliNGZNUFhhbE9FL3ZkdGg1VGc9PQ==',
			'appID': localStorage.getItem('appID') || '',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.mf
		}
	
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.portfolioMf.url, params, Object.assign(passheader, this.headersParams))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})):this.httpClient.post(this.portfolioMf.url, params,{headers: new HttpHeaders (passheader)})
	}

}