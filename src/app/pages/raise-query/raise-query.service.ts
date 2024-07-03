import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";


@Injectable()
export class RaiseQueryService {

	private createTicket = URLS.createTicket;
	private searchTicketCRM = URLS.searchTicket;
	private updateTkt = URLS.updateTkt;
	private brokingBot = URLS.brokingBot;
	private searchZoho = URLS.searchZoho;
	private listZoho = URLS.listZoho;
	private deskGetArticle = URLS.deskGetArticle;
	private getRootCategoreTree = URLS.getRootCategoreTree;
	public options = environment['optionalHeaders'];
	public headersParams = environment['headersParams'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	private nativeHeaders = environment['nativeHeaders'];
    private consolidateCrmObj: any = {};
	public searchUrlObj: any;
	public listArticle: any;
	public getArticle: any;
	public getDesk: any;
	public getAttachment: any;


	constructor(private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private commonService: CommonService) {
	}

	public createCrmTicket(token: any,obj: any) {
		let cookievalue: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {    
			cookievalue['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.createTicket.url, obj, Object.assign(cookievalue, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.createTicket.url, obj,{ headers: new HttpHeaders(Object.assign(cookievalue))});
	}

	public searchTicket(token: any,obj: any) {
		let cookievalue: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {    
			cookievalue['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.searchTicketCRM.url, obj, Object.assign(cookievalue, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.searchTicketCRM.url, obj,{ headers: new HttpHeaders(Object.assign(cookievalue))});
	}

	public updateTicket(obj: any) {
		let objPass: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm,
			'appID': localStorage.getItem('appID') || ''
		};
		// if(this.cookieKEY && this.cookieKEY['Authorization']){
		// 	delete this.cookieKEY['Authorization'] ;
		// }
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.searchTicketCRM.url, obj, Object.assign(objPass, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.updateTkt.url, obj, { headers: new HttpHeaders(Object.assign(objPass)) });
	}

	public zohoSearch(obj: any){
		this.searchUrlObj = this.searchZoho.url + `?portalId=edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57&searchStr=${obj.searchStr}`;
		let ocpKey = {
			// 'subscription-key':environment.headersParams['Ocp-Apim-Subscription-Key']
			// 'Ocp-Apim-Subscription-Key': '75e5ccdf4ba84de583cfe81f5b89158a'
		}
		// if(this.cookieKEY && this.cookieKEY['Authorization']){
        //     delete this.cookieKEY['Authorization'];
        // }
		let objPass: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm,
			'appID': localStorage.getItem('appID') || ''
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.searchUrlObj,ocpKey,Object.assign(objPass, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.searchUrlObj,{ headers: new HttpHeaders(Object.assign(objPass))});
	}

	public helpSubjectCategory(obj: any,category: any,hToken: any){

		let params = {
            'Token': hToken,
			'ObjectName': "BOT",
			'Parameters': {
				"SearchField": obj,
				"Mode": category
			}
        }
		let objPass: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm,
			'appID': localStorage.getItem('appID') || ''
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.brokingBot.url, params, Object.assign(objPass, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.brokingBot.url, params, { headers: new HttpHeaders(Object.assign(objPass))});
	}

	public zohoListArticle(obj: any){
		this.listArticle = this.listZoho.url + `?portalId=edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57&from=1&limit=100&categoryId=${obj.categoryId}`;
		let ocpKey = {
			'subscription-key': '75e5ccdf4ba84de583cfe81f5b89158a'
		}
		let objPass: any = {
			'appID': localStorage.getItem('appID') || ''
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.listArticle,ocpKey,Object.assign(this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.listArticle,{ headers: new HttpHeaders(Object.assign(objPass))});
	}

	public zohoGetArticle(obj: any){
		this.getArticle = this.listZoho.url + `/82853000931423950?portalId=edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57`;
		let ocpKey = {
			'subscription-key': '75e5ccdf4ba84de583cfe81f5b89158a'
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		let objPass: any = {
			'appID': localStorage.getItem('appID') || ''
		}
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.getArticle,ocpKey,Object.assign(this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.getArticle,{ headers: new HttpHeaders(Object.assign(objPass))});
	}

	public zohoAttachment(obj: any){
		this.getAttachment = this.listZoho.url + `${obj.categoryId}/locale/en/attachments?portalId=edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57`;
		let ocpKey = {
			//'subscription-key': '75e5ccdf4ba84de583cfe81f5b89158a'
		}
		//if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		let objPass: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm,
			'appID': localStorage.getItem('appID') || ''
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.getAttachment,ocpKey,Object.assign(objPass, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.getAttachment,{ headers: new HttpHeaders(Object.assign(objPass))});
	}

	public zohoGetDeskArticle(id: any){
		this.getDesk = this.deskGetArticle.url + `?auth_type=test1&zapikey=test2&article_id=${id}`;
		let ocpKey = {
			'subscription-key': '75e5ccdf4ba84de583cfe81f5b89158a'
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm,
			'appID': localStorage.getItem('appID') || ''
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.getDesk,ocpKey,Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.getDesk,{ headers: new HttpHeaders(Object.assign(obj))});
	}

	public zohoGetCategoreTree(){
		this.getDesk = this.getRootCategoreTree.url;
		let ocpKey = {
			'subscription-key': '75e5ccdf4ba84de583cfe81f5b89158a'
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm,
			'appID': localStorage.getItem('appID') || ''
		};
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.get(this.getDesk,ocpKey,Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.get(this.getDesk,{ headers: new HttpHeaders(Object.assign(obj))});
	}
	
}