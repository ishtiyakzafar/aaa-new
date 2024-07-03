import { Injectable } from "@angular/core";
import { URLS } from '../../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from "../../../environments/environment";
import { CommonService } from "../../helpers/common.service";
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import moment from 'moment';
import { StorageServiceAAA } from "../../helpers/aaa-storage.service";

@Injectable()
export class WireRequestService {



private limitReqStatus = URLS.limitReqStatus;
private jvReqStatus = URLS.jvReqStatus;
private epiReqStatus = URLS.epiReqStatus;
private clientCodes = URLS.clientCodesList;
private limitRequest = URLS.limitInsert;
private limitValidate = URLS.limitValidate;
private jvValidate = URLS.jvValidate;
private jvInsertValidate = URLS.jvInsert;
private brokerageApproval = URLS.brokerageApprove;
private brokergeRequest = URLS.brokergeRequest;
private shareDepositDetailsV1 = URLS.subBrokerShareDepositDetailsV1
private brokerageReqInsert = URLS.brokerageRequestInsertV1
private nfdcReport = URLS.nfdcRiskReport
private scriptExcel = URLS.scriptExcel
private BodHoldingEq = URLS.BodHolding
private BodHeaderEq = URLS.BodHeader
private FnoPositions = URLS.FnoPositions
private SlbmHoldings = URLS.SlbmHoldings
private clientSummary = URLS.clientSummary
private getPhysicalFNOReports = URLS.getPhysicalFNOReports
private editClientSummary = URLS.editClientSummary
private BranchMapping  = URLS.BranchMapping
private profileDetails = URLS.profileDetailsV1
private ClientProfileCapture = URLS.clientProfileCap
private clientOutstandingReport = URLS.clientOutstanding
private ClientProfileScore = URLS.clientRiskProfileScore
private hierarchyList = URLS.hierarchyList
private brokCurrentDetails = URLS.hybridBrokRequest
private holdPhysicalFNOReports=URLS.holdPhysicalFNOReports;
private scripSummaryReport = URLS.scripSummaryReport
private brokerageInfo = URLS.brokerageInformation
private clientInteractionToken = URLS.clientInteractionToken;
private clientTicketDetailsUrl = URLS.clientTicketDetails;
private clientInteractionDetailsUrl = URLS.clientInteractionDetails;
private commoSummary = URLS.commSummaryList;
private tradingListRepo = URLS.tradingListRepo;
private commodityScripSum = URLS.commodityScripSum;
private vasDetailedReport = URLS.vasDetailedReport;
private RaaDebit   = URLS.RaaDebit

private brokApprovalRej = URLS.brokApproRej
private productActDea = URLS.productActivationRights
private actDecProd = URLS.actDecProduct

private cmsDeposit = URLS.cmsDeposit;
private equityCms = URLS.equityCms;
private saveCmsEntry = URLS.saveCmsEntry;
private jvStatusOptions = URLS.jvStatusOption;
private getDPSchemeDetails=URLS.getDPSchemeDetails;
private ttMapping = URLS.ttMapping
private dpScriptReport = URLS.dpScript;
private getLivlongVal = URLS.getLivlong;
private getMarginShortfallVal = URLS.getMarginShortfall;
private clientMappingTableData = URLS.clientMappingTableData;
private getBeyongIRRVal = URLS.getBeyongIRR;
private freezeDetails = URLS.freezeDetails;
private dpModificationDetails = URLS.dpModificationDetails;
private searchScripDetails = URLS.searchScripDetails;
private clientDematHoldings = URLS.clientDematHoldings;
private SubmitEPIRequest = URLS.SubmitEPIRequest;
private clientMarginReport = URLS.clientMarginReport;
private accountClosureStatus = URLS.accountClosureStatus;
private settlementPayoutReport = URLS.settlementPayoutReport;
private dematRequestStatus = URLS.dematRequestStatus;
private mappedClient = URLS.mappedClient;
private demapClnt = URLS.demapClient;
private downloadDematForm = URLS.reportDownload;

public options: any = environment['optionalHeaders'];
public headersParams: any = environment['headersParams'];
public cookieKEYclientInteraction: any = environment['cookieKEYclientInteraction'];
private nativeHeaders: any = environment['nativeHeaders'];
private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
private nativeHeadersClientInteraction: any = environment['nativeHeadersClientInteraction'];
public tokenVal: any;
public paramsObj: any;

constructor(private httpClient: HttpClient,
	private nativeHttp: HTTP,
	private storage: StorageServiceAAA,
	private commonService: CommonService) {
		this.storage.get('cookieValue').then(token => {
			this.tokenVal = token;
			let modifiedToken = this.tokenVal.split(";");
			let str = '';
			for(let i = 0 ; i < modifiedToken.length ; i++){
				if(modifiedToken[i].includes('ASP.NET_SessionId')){
					str = str + modifiedToken[i] + ';';
				}
				if(modifiedToken[i].includes('SameSite=Lax')){
					str = str + modifiedToken[i] + ';';
				}
				}
				this.tokenVal = str;
				this.tokenVal = this.tokenVal.replace(' SameSite=Lax','');
				this.tokenVal = this.tokenVal.replace('Path=/','');
		});
	}


    
    public getLimitReqStatus(cookievalue: any,caseId: any, passObj: any, userId: any): Observable<{}> {
		let params = {"body":{"CaseID":caseId,"CustomerID":"","EmployeeId":userId,"FromDate":passObj.fromDate,"Status":"","ToDate":passObj.toDate},"head":{"appname":this.limitReqStatus.appName,"appver":"1.0.26.0","Authkey":"53D7AE755B82D5C2","key":this.limitReqStatus.key,"osname":"Android","requestcode":"APIBO52UCVDWFY",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.limitReqStatus.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.limitReqStatus.url, params, { headers: new HttpHeaders(Object.assign(obj))});
		
	}

	public getMappedClients(clientId: any, cookievalue: any): Observable<{}> {
		let params: any = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android"
			},
			"body": {
				"ClientCode": clientId
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.mappedClient.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.mappedClient.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public demapClient(dataToSend: any, token: any) {
		let params: any = {
			"head": {
				"RequestCode": "APIBO52UCVDWFY",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppVer": "01",
				"AppName": "AAA",
				"OsName": "Android"
			},
			"body": dataToSend
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.demapClnt.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.demapClnt.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getClientMappingTableData(data: any, cookievalue: any): Observable<{}> {
		let params = {
			"body": data,
			"head": {
				"RequestCode": "APIBO52UCVDWFY",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppVer": "01",
				"AppName": "AAA",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientMappingTableData.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientMappingTableData.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getDpScript(cookievalue: any, passObj: any, userId: any): Observable<{}> {
		let params = {"body":{"FromDate":passObj.fromDate,"PartnerCode":userId,"ToDate":passObj.toDate},"head":{"AppName":"AAA","AppVer":"01","Key":this.dpScriptReport.key,"OsName":"Android","RequestCode":"CVUpdateLead01",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.dpScriptReport.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.dpScriptReport.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}


	public getjvReqStatus(cookievalue: any, passObj: any, userId: any): Observable<{}> {
		let params = {"body":{"FromDate":passObj.fromDate,"RMCode":userId,"Remark":"","Status":passObj.Status,"ToDate":passObj.toDate},"head":{"AppName":this.jvReqStatus.appName,"AppVer":"1.0.26.0","Key":this.jvReqStatus.key,"OsName":"Android","RequestCode":"CVUpdateLead01",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.jvReqStatus.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.jvReqStatus.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getepiReqStatus(cookievalue: any, passObj: any, userId: any): Observable<{}> {
		let params = { 
			"head":{
				"AppName": "AAA",
				"AppVer": "1.0.4.0",
				"Key": this.epiReqStatus.key,
				"OsName": "Android",
				"RequestCode": "ProfileDetailsV1",
				"userType": localStorage.getItem('userType') },
			"body":{
				"FromDate": passObj.fromDate,
				"Partnercode": userId,
				"ClientCode":passObj.clinetCode,
				"ToDate": passObj.toDate,
				"Status": passObj.Status
			}
		};

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.epiReqStatus.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.epiReqStatus.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public limitedValidator(cookievalue: any, pramsObj: any, userId: any): Observable<{}> {
		let params = {"body":{"EmployeeId":userId,"LoginID":pramsObj.clientID,"SegmentID":pramsObj.SegmentID},"head":{"AppName":this.limitValidate.appName,"AppVer":"1.0.26.0","Key":this.limitValidate.key,"OsName":"Android","RequestCode":"CVUpdateLead01",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}		
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.limitValidate.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.limitValidate.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public limitedInsert(cookievalue: any, parameter: any, caseId: any, userId: any): Observable<{}> {
		let params = {"body":{"ActualLimit":parameter.ActualLimit,"CaseID":caseId,"CustomerID":parameter.clientID,"EmployeeId":userId,"MarginRequirement":parameter.MarginRequirement,"ReqLimit":parameter.ReqLimit,"ReqRemark":parameter.ReqRemark,"SegmentID":parameter.SegmentID,"Status":"P"},"head":{"AppName":this.limitRequest.appName,"AppVer":"1.0.26.0","Key":this.limitRequest.key,"OsName":"Android","RequestCode":"CVUpdateLead01",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};		
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.limitRequest.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.limitRequest.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public jvValidator(cookievalue: any, pramsObj: any): Observable<{}> {
		//let params = {"body":{"Amount":pramsObj.jvAmount,"EmployeeId":"ckv000rm","InvoiceNo":pramsObj.invoiceNum,"JvCreditDt":moment(pramsObj.dateFrom).format('YYYYMMDD'),"LoginID":pramsObj.clientID,"Remark":pramsObj.jvRemark},"head":{"AppName":this.limitRequest.appName,"AppVer":"1.0.26.0","Key":this.limitRequest.key,"OsName":"Android","RequestCode":"CVUpdateLead01"}}
		let params = 
		{"body":{"Amount":pramsObj.jvAmount,"EmployeeId":pramsObj.userId,"InvoiceNo":pramsObj.invoiceNum,"JvCreditDt":moment(pramsObj.dateFrom).format('YYYYMMDD'),"LoginID":pramsObj.loginID,"Remark":pramsObj.jvRemark},"head":{"AppName":this.limitRequest.appName,"AppVer":"1.0.26.0","Key":this.limitRequest.key,"OsName":"Android","RequestCode":"CVUpdateLead01",
		"userType": localStorage.getItem('userType')}}
		// console.log(params)
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.jvValidate.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.jvValidate.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public jvInsert(cookievalue: any, parameter: any): Observable<{}> {
		//let params = {"body":{"jvdate":moment(parameter.jvDate).format('YYYYMMDD'),"Amount":parameter.jvAmount,"CrmCaseID":caseId,"EmployeeId":"ckv000rm","FromDate":moment(parameter.dateFrom).format('YYYYMMDD'),"LoginID":parameter.clientID,"Narration":parameter.narration,"Reason":parameter.jvReason,"Remark":parameter.jvRemark,"ToDate":moment(parameter.dateTo).format('YYYYMMDD')},"head":{"AppName":this.jvInsertValidate.appName,"AppVer":"1.0.26.0","Key":this.jvInsertValidate.key,"OsName":"Android","RequestCode":"CVUpdateLead01"}}
		let params = {"body":{"jvdate":moment(parameter.jvDate).format('YYYYMMDD'),"Amount":parameter.jvAmount,"CrmCaseID":parameter.caseId,"EmployeeId":parameter.userId,"FromDate":moment(parameter.dateFrom).format('YYYYMMDD'),"LoginID":parameter.loginID,"Narration":parameter.narration,"Reason":parameter.jvReason,"Remark":parameter.jvRemark,"ToDate":moment(parameter.toDate).format('YYYYMMDD')},"head":{"AppName":this.jvInsertValidate.appName,"AppVer":"1.0.26.0","Key":this.jvInsertValidate.key,"OsName":"Android","RequestCode":"CVUpdateLead01",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.jvInsertValidate.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.jvInsertValidate.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getBrokerageApproval(cookievalue: any, userID: any): Observable<{}> {
		let params = {"body":{"PartnerCode":userID},"head":{"AppName":this.brokerageApproval.appName,"AppVer":"1.0.26.0","Key":this.brokerageApproval.key,"OsName":"Android","RequestCode":"CVUpdateLead01",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.brokerageApproval.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.brokerageApproval.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getBrokerageRequest(cookievalue: any, paramsObj: any, userID: any): Observable<{}> {
		let params = {"body":{"ClientCode":"","FromDate":paramsObj.fromDate,"RMCode":userID,"SrNo":"","Status":paramsObj.status,"ToDate":paramsObj.ToDate},"head":{"AppName":this.brokergeRequest.appName,"AppVer":"1.0.26.0","Key":this.brokergeRequest.key,"OsName":"Android","RequestCode":"CVUpdateLead01",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		
		if (cookievalue) {    
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.brokergeRequest.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.brokergeRequest.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getShareDepositRecord(cookievalue: any, userID: any): Observable<{}> {
		let params = {"body":{"PartnerCode":userID},"head":{"appname":this.shareDepositDetailsV1.appName,"appver":"1.0.26.0","Authkey":"53D7AE755B82D5C2","key":this.shareDepositDetailsV1.key,"osname":"Android","requestcode":"APIBO52UCVDWFY",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.shareDepositDetailsV1.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.shareDepositDetailsV1.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
	//brokerage insert get current data
	public getBrokerageCurrentData(cookievalue: any, clientId: any): Observable<{}> {
		let params = {
			"head": {
					"RequestCode": "HybridBrokerageRequest",
					"Key": this.brokCurrentDetails.Key ,
					"AppName": this.brokCurrentDetails.appName,
					"AppVer": "01",
					"OsName": "Android",
					"userType": localStorage.getItem('userType')
			},
			"body": {
				"ClientCode": clientId
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.brokCurrentDetails.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.brokCurrentDetails.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
	// brokerge Insert
	// public getBrokerageInsert(cookievalue, passObj): Observable<{}> {
	// 	let params = {"body":{"CashDeliveryFirstSidePerc":passObj.cashDeliveryFirstSide,"CashDeliveryMinimumPerShare":passObj.cashDeliveryMps,"CashIntradayFirstSidePerc":passObj.cashIntradayFirstSide,"CashIntradayMinimumPerShare":passObj.cashIntradayMps,"CashIntradaySecondSidePerc":passObj.cashIntradaySecondSide,"CashT2TFirstSidePerc":passObj.cashT2TFirstSide,
	// 	"CashT2TMinimumPerShare":passObj.cashT2TMps,"ClientCode":passObj.clientID,"FuturesDeliveryFirstSidePerc":passObj.futureDeliveryFirstSide,"FuturesDeliveryMinimumPerShare":passObj.futureDeliveryMps,"FuturesIntradayFirstSidePerc":passObj.futureIntradayFirstSide,"FuturesIntradayMinimumPerShare":passObj.futureIntradayMps,
	// 	"FuturesIntradaySecondSidePerc":passObj.futureIntradaySecondSide,"hdnMTOF":"AAA","OptionsIndexPerc":passObj.optionIndex,"OptionsPerLot":passObj.optionPerLot,"RMCode":"ckv000rm","Remark":"AAA"},"head":{"AppName":this.brokerageReqInsert.appName,"AppVer":"1.0.26.0","Key":this.brokerageReqInsert.key,
	// 	"OsName":"Android","RequestCode":"CVUpdateLead01"}}
	// 	let obj = {};
	// 	if (cookievalue) {
	// 		obj = {
	// 			'token': cookievalue
	// 		}
	// 	}
	// 	if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
	// 	return this.commonService.isApp() ? from(this.nativeHttp.post(this.brokerageReqInsert.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
	// 		return JSON.parse(response['data'] as any);
	// 	})): this.httpClient.post(this.brokerageReqInsert.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	// }

	public getBrokerageInsert(cookievalue: any, passObj: any, userId: any): Observable<{}> {
		let params = {
			"head": {
					"RequestCode": "ActiveDeactiveProduct",
					"Key": this.brokerageReqInsert.key,
					"AppName": this.brokerageReqInsert.appName,
					"AppVer": "01",
					"OsName": "Android",
					"userType": localStorage.getItem('userType')
			},
			"body":{
			"CashDeliveryFirstSidePerc":passObj.cashDeliveryFirstSide,
			"CashDeliveryMinimumPerShare":passObj.cashDeliveryMps,
			"CashIntradayFirstSidePerc":passObj.cashIntradayFirstSide,
			"CashIntradayMinimumPerShare":passObj.cashIntradayMps,
			"CashIntradaySecondSidePerc":passObj.cashIntradaySecondSide,
			"CashT2TFirstSidePerc":passObj.cashT2TFirstSide,
			"CashT2TMinimumPerShare":passObj.cashT2TMps,
			"ClientCode":passObj.clientID,
			"FuturesDeliveryFirstSidePerc":passObj.futureDeliveryFirstSide,
			"FuturesDeliveryMinimumPerShare":passObj.futureDeliveryMps,
			"FuturesIntradayFirstSidePerc":passObj.futureIntradayFirstSide,
			"FuturesIntradayMinimumPerShare":passObj.futureIntradayMps,
			"FuturesIntradaySecondSidePerc":passObj.futureIntradaySecondSide,
			"hdnMTOF":"AAA",
			"OptionsIndexPerc":passObj.optionIndex,
			"OptionsPerLot":passObj.optionPerLot,
			"RMCode":userId,
			"Remark":"AAA",
			"RequestType":localStorage.getItem('brokTypeParams'),
			"CashOrdFlag":passObj.CashOrdFlag,
			"FaoOrdFlag":passObj.FaoOrdFlag,
			"BrkOrdwise":passObj.BrkOrdwise
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.brokerageReqInsert.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.brokerageReqInsert.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getNfdcReport(cookievalue: any, passObj: any,userId: any): Observable<{}> {
		let params = {"body":{"ClientCode":"","Email":passObj.Email,"RMCode":localStorage.getItem('userId1'),"ReportType":passObj.reportType},"head":{"requestCode":passObj.requestCode,"key":this.nfdcReport.key,"appVer":"1.0.26.0","appName":this.nfdcReport.appName,"LoginId":passObj.encrpLogInId,
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.nfdcReport.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.nfdcReport.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getBodHoling(cookievalue: any, clientID: any, userID: any): Observable<{}> {
		let params = {"head": {"RequestCode": "BODHOLDING","Key": this.BodHoldingEq.key,"AppName": this.BodHoldingEq.appName,"AppVer": "1.0.4.0","OsName":"Android",
		"userType": localStorage.getItem('userType')},"body": {"PartnerCode": userID,"ClientCode": clientID}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.BodHoldingEq.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.BodHoldingEq.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getFnoPositions(cookievalue: any, clientID: any, userID: any): Observable<{}> {
		let params = {"head": {"RequestCode": "FNOPositions","Key": this.FnoPositions.key,"AppName": this.FnoPositions.appName,"AppVer": "1.0.4.0","OsName":"Android",
		"userType": localStorage.getItem('userType')},"body": {"PartnerCode": userID,"ClientCode": clientID}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.FnoPositions.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.FnoPositions.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getHoldingDetails(cookievalue: any, clientID: any, userID: any, holdingType: any): Observable<{}> {
		let params = {"head": {"RequestCode": "CVUpdateLead01","Key": this.BodHoldingEq.key,"AppName": "AAA","AppVer": "01","OsName":"Android",
		"userType": localStorage.getItem('userType')},"body": {"PartnerCode": userID,"ClientCode": clientID,"HoldingType": holdingType}}
		let obj: any = {
			'appID': localStorage.getItem('appID') || '',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.BodHoldingEq.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.BodHoldingEq.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getHeaderDetails(cookievalue: any, clientID: any): Observable<{}> {
		let params = {"head": {"RequestCode": "CVUpdateLead01","Key": this.BodHeaderEq.key,"AppName": "AAA","AppVer": "01","OsName":"Android",
		"userType": localStorage.getItem('userType')},"body": {"ClientCode": clientID}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.BodHeaderEq.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.BodHeaderEq.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getSlbmHoldings(cookievalue: any, clientID: any, userId: any): Observable<{}> {
		let params = {"head": {"RequestCode": "SLBMHoldings","Key": this.SlbmHoldings.key,"AppName": this.SlbmHoldings.appName,"AppVer": "1.0.4.0","OsName": "Android",
		"userType": localStorage.getItem('userType')},"body": {"PartnerCode": userId,"ClientCode": clientID}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.SlbmHoldings.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.SlbmHoldings.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getClientSummary(cookievalue: any, branchId: any, SearchBy?: any, SearchText?: any, PageNo?: any,SortBy?: any,SortOrder?: any): Observable<{}> {
		let params = {"head": {"RequestCode": "CVUpdateLead01","Key": this.clientSummary.key,"AppName": this.SlbmHoldings.appName,"AppVer": "01","OsName": "Android",
		"userType": localStorage.getItem('userType')},"body": {"PartnerCode": localStorage.getItem('userId1'),"Category": "All", "Branch": branchId?branchId:"ALL", "PageNo": PageNo,
        "SortBy": SortBy?SortBy:"","SortOrder": SortOrder?SortOrder:"","SearchBy": SearchBy?SearchBy:"","SearchText": SearchText?SearchText:""
		}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientSummary.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.clientSummary.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public editSummary(cookievalue: any, passObj: any): Observable<{}> {
		let params = {"head": { "RequestCode": "DashboardDetail", "Key": this.editClientSummary.key, "AppName": this.editClientSummary.appName,"AppVer": "1.0.4.0", "OsName": "Android",
		"userType": localStorage.getItem('userType')}, "body": {"LoginId": passObj.LoginId,"HoldBlockSell": passObj.HoldBlockSell , "BranchRemarkID":passObj.BranchRemarkID, "MakerId": "C122883"}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.editClientSummary.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.editClientSummary.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getBranch(cookievalue: any, userId: any): Observable<{}> {
		let params = {"body": {"RmCode": userId},"head": {"RequestCode": "CVUpdateLead01","Key": this.BranchMapping.key,"AppName": this.BranchMapping.appName,"AppVer": "01","OsName": "Android",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.BranchMapping.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.BranchMapping.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getHierarchyList(cookievalue: any, clientID: any): Observable<{}> {
		let params = {
			head: {
				RequestCode: "CVUpdateLead01",
				Key: this.hierarchyList.key,
				AppName: this.hierarchyList.appName,
				AppVer: "1.0.4.0",
				OsName: "Android",
			
			},
			body: {
				Loginid: clientID
			}
		}
		let obj: any = {
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.hierarchyList.url, params, Object.assign(obj, this.nativeHeaders, this.options))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.hierarchyList.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getProfileDetails(cookievalue: any, passObj: any): Observable<{}> {
		passObj.RequestorCode = localStorage.getItem('userId1');
		passObj.RequestorCode = localStorage.getItem('userId1') ? localStorage.getItem('userId1') : "";
		let params = { "head": { "RequestCode": "ProfileDetailsV1", "Key": this.profileDetails.key, "AppName": this.profileDetails.appName, "AppVer": "1.0.4.0", "OsName": "Android",
		"userType": localStorage.getItem('userType') }, "body": passObj }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.profileDetails.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.profileDetails.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
	public getclientDematHoldings(cookievalue: any, clientId: any, dematID: any, ISIN: any): Observable<{}> {
		let params = { 
			"head": { 
				"RequestCode": "CVUpdateLead01",
				 "Key": this.clientDematHoldings.key,
				  "AppName": "AAA",
				   "AppVer": "01", 
				   "OsName": "Android",
				   "userType": localStorage.getItem('userType')
				},
			"body": {
				"Clientcode": clientId,
				"DematID": dematID,
				"ISIN": ISIN
			} 
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientDematHoldings.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.clientDematHoldings.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public submitEPIRequest(cookievalue: any, clientId: any, dematID: any, ISIN: any, symbol: any, qty: any): Observable<{}> {
		let params = { 
			"head": { 
				"RequestCode": "ProfileDetailsV1",
				 "Key": this.SubmitEPIRequest.key,
				  "AppName": "AAA",
				   "AppVer": "1.0.4.0", 
				   "OsName": "Android",
				   "userType": localStorage.getItem('userType') 
				},
			"body": {
				"ParentCode": localStorage.getItem('userId1'),
				"ChildCode": clientId,
				"DematId": dematID,
				"ISIN": ISIN,
				"Symbol": symbol,
				"Qty": qty
			} 
			}
		
		let obj: any = {
		'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
		'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.SubmitEPIRequest.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.SubmitEPIRequest.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getProfileCap(cookievalue: any,userID: any,clientId: any): Observable<{}> {
		let params =  {
			"head": {
			"RequestCode": "clientProfileCap",
			"Key": this.ClientProfileCapture.key,
			"AppName": "AAA",
			"AppVer": "01",
			"OsName": "Android",
			"userType": localStorage.getItem('userType')},
			"body":{
				"loginid": userID,
				  "clientcode": clientId
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.ClientProfileCapture.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})):this.httpClient.post(this.ClientProfileCapture.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
	public getOutstandingReport(cookievalue: any,fromDate: any,hierarchyListVar: any,N: any,U: any): Observable<{}> {
		let params =  {
			"head": {
			"RequestCode": "APIBO52UCVDWFY",
			"Key": this.clientOutstandingReport.key,
			"AppName": "AAA",
			"AppVer": "01",
			"OsName": "Android",
			"userType": localStorage.getItem('userType')},
			"body":{
				"LoginId": localStorage.getItem('userId1'),
				"Branch": hierarchyListVar,
				"AsOnDate": fromDate,
				"Exchange": N,
				"ExchangeType": U
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientOutstandingReport.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})):this.httpClient.post(this.clientOutstandingReport.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
		
	public getProfileScore(cookievalue: any,userID: any,clientId: any,riskScore: any,riskCategory: any,aumCategory: any): Observable<{}> {
		let params =  {
			
			"body":{
				"LoginId": userID,
				"ClientId": clientId,
				"RiskScore":riskScore,
				"RiskCategory":riskCategory,
				"AUMCategory" : aumCategory
			},
			"head": {
				"RequestCode": "APIBO52UCVDWFY",
				"Key": this.ClientProfileScore.key,
				"AppVer": "01",
				"AppName": "AAA",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.ClientProfileScore.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})):this.httpClient.post(this.ClientProfileScore.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
	
	public getBrokerageInfo(cookievalue: any, clientId: any): Observable<{}> {
		let params =  {"head": {"RequestCode": "CVUpdateLead01","Key": this.brokerageInfo.key,"AppName": this.brokerageInfo.appName,"AppVer": "1.0.4.0","OsName": "Android",
		"userType": localStorage.getItem('userType')},"body": {"ClientCode": clientId,"Segment": "ALL"}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.brokerageInfo.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.brokerageInfo.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}


	public getRaaDebitReport(cookievalue: any, reportType: any, userID: any) {
		let params =  {"head": {"requestCode": "RAADebitReport","key": this.RaaDebit.key,"appVer": "2.0","appName": this.RaaDebit.appName,"LoginId": reportType.encrpLogInId,
		"userType": localStorage.getItem('userType')},"body": {"RMCode": localStorage.getItem('userId1'),"ReportType":reportType.ReportType,"ClientCode":"","Email":"N"}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		}
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.RaaDebit.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.RaaDebit.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getBrokApprovalRej(cookievalue: any, brokObj: any,reqRa: any, userId: any) {
		let params = { 
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.brokApprovalRej.key,
				"AppName": this.brokApprovalRej.appName,
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
			"RMCode": userId,
				"ClientCode": brokObj.ClientCode,
				"Remark": brokObj.Remark,
				"SerialNo": brokObj.Srno,
				"Status": reqRa
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.brokApprovalRej.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.brokApprovalRej.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	// public accessProductActivation(cookievalue,userId) {
	// 	let params = { 
	// 		"head": {
	// 			"RequestCode": " ActiveDeactiveRightsBase",
	// 			"Key": this.productActDea.key,
	// 			"AppName": "AAA",
	// 			"AppVer": "01",
	// 			"OsName": "Android"
	// 		},
	// 		"body": {
	// 			//"PartnerCode": "C86730"
	// 			"PartnerCode": userId
	// 		}
	// 	}
	// 	let obj = {};
	// 	if (cookievalue) {
	// 		obj = {
	// 			'token': cookievalue
	// 		}
	// 	}
	// 	if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
	// 	return this.commonService.isApp() ? from(this.nativeHttp.post(this.productActDea.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
	// 		return JSON.parse(response['data'] as any);
	// 	})): this.httpClient.post(this.productActDea.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	// }

	public submitProdActDec(cookievalue: any,passObj: any, userId: any) {
		let params = {
			"head": {
					"RequestCode": "ActiveDeactiveProduct",
					"Key": this.actDecProd.key,
					"AppName": this.actDecProd.appName,
					"AppVer": "01",
					"OsName": "Android",
					"userType": localStorage.getItem('userType')
			},
			"body": {
				"PartnerCode": userId,
				"ProductName":passObj.productName,
				"Action": passObj.action,
				"ClientCode": passObj.clientID,
				"Remark": passObj.remark,
				"IsFileUpload":passObj.isupload,
				"FileData":passObj.fileData
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.actDecProd.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})):  this.httpClient.post(this.actDecProd.url, params, { headers: new HttpHeaders(Object.assign(obj))});
	}

	//CMS Entry

	getCmsDepositBankList(cookievalue: any, user: any, typeNo: any){
		let params = {
		  "head":{
			 "RequestCode":"GetCMSClearingTypeV1",
			 "Key":this.cmsDeposit.key,
			 "AppName":this.cmsDeposit.appName,
			 "AppVer":"01",
			 "OsName":"Android",
			 "userType": localStorage.getItem('userType')
		  },
		  "body":{
			 "UserCode":user,
			 "ProductType":"EQ",
			 "UserType":typeNo
		  }
	   }
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.cmsDeposit.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.cmsDeposit.url,params,{ headers: new HttpHeaders(Object.assign(obj))});
		 
	  }

	  getEquityCms(cookievalue: any, clientId: any, userId: any, userType: any){
		let params = {
			"head": {
			  "RequestCode": "GetCMSClearingTypeV1",
			  "Key": this.equityCms.key,
			  "AppName": this.equityCms.appName,
			  "AppVer": "01",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			},
			"body": {
			  "ProductType": "EQ",
			  "ClientID": clientId,
			  "UserID": userId,
			  "UserType": userType == "RM" ? "1" : userType == "FAN" ? "2" : "3",
			}
		  }

		  let obj: any = {
		  	'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			  'appID': localStorage.getItem('appID') || ''
		  };	
		  if (cookievalue) {
			obj['token'] = cookievalue;
		  }
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.equityCms.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.equityCms.url,params,{ headers: new HttpHeaders(Object.assign(obj))});
		 
	  }

	  saveEquityCms(cookievalue: any, passObj: any){
		let params = {
			"head": {
			  "RequestCode": "SaveCMSEntryV1",
			  "Key": this.saveCmsEntry.key,
			  "AppName": this.saveCmsEntry.appName,
			  "AppVer": "01",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			},
			"body": passObj
		  }

		  let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		  };
		
		  if (cookievalue) {
			obj['token'] = cookievalue;
		  }
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.saveCmsEntry.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.saveCmsEntry.url,params,{ headers: new HttpHeaders(Object.assign(obj))});
		 
	  }

	 getJvReuestStatus(cookievalue: any, passObj: any){
		let params = {
			"head": {
			  "RequestCode": "CVUpdateLead01",
			  "Key": this.jvStatusOptions.key,
			  "AppName": this.jvStatusOptions.appName,
			  "AppVer": "01",
			  "OsName": "Android",
			  "userType": localStorage.getItem('userType')
			},
			"body": passObj
		  }

		  let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		  };
		  if (cookievalue) {
			obj['token'] = cookievalue;
		  }
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.jvStatusOptions.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.jvStatusOptions.url,params,{ headers: new HttpHeaders(Object.assign(obj))});
		 
	  }

	  public editSummaryReport(cookievalue: any, HoldBlockSellandBranchRemarkIDList: any): Observable<{}> {
		let params = {"head": { "RequestCode": "CVUpdateLead01", "Key": this.editClientSummary.key, "AppName": this.editClientSummary.appName,"AppVer": "01", "OsName": "Android",
		"userType": localStorage.getItem('userType')}, "body": {"LoginId": localStorage.getItem('userId1'),HoldBlockSellandBranchRemarkIDList}}
		let obj: any = {
			'appID': localStorage.getItem('appID') || '',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
		};
		if (cookievalue) {
			obj = {
				'token': cookievalue
			}
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.editClientSummary.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.editClientSummary.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	//Done By Vaitheeswaran
	getallClientWireRequest(body: { PartnerCode: Promise<any>; ClientCode: string; },token: any) {
		let params={
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"PartnerCode": body.PartnerCode,
				"ClientCode": body.ClientCode,
				"SearchBy": body.ClientCode?body.ClientCode:""
			}
		}
		let obj: any = {
			'appID': localStorage.getItem('appID') || '',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
		};
		if (token) {
			obj['token'] = token;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getPhysicalFNOReports.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.getPhysicalFNOReports.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
	  
	holdSelectedReports(groupList: any,token: any,userid: any) {
		
		let params={
			
			"body": {
				"PartnerCode": userid,
				"data":groupList
			}
			}

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (token) {
			obj['token'] = token;
		}
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.holdPhysicalFNOReports.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.holdPhysicalFNOReports.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	getallClientSearchWireRequest(body: { PartnerCode: any; ClientCode: any; }, tokendata: any) {
		let params={
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": "446794970AAA1237ab394d176612f8c6",
				"AppName": "AAA",
				"AppVer": "01",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"PartnerCode": body.PartnerCode,
				"ClientCode": body.ClientCode,
				"SearchBy": body.ClientCode?body.ClientCode:""
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (tokendata) {
			obj['token'] = tokendata;
		}
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.getPhysicalFNOReports.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.getPhysicalFNOReports.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
		}

		getDPSchemeCharges(clientCode: any,Token: any,userID: any) {
		
			let params= {
				"head": {
					"RequestCode": "CVUpdateLead01",
					"Key": this.getDPSchemeDetails.key,
					"AppName": "AAA",
					"AppVer": "01",
					"OsName": "Android",
					"userType": localStorage.getItem('userType')
				},
				"body": {
				"PartnerCode": userID,
				"ClientCode": clientCode
				}
			}
			let obj: any = {
				'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
				'appID': localStorage.getItem('appID') || ''
			};
			if (Token) {
				obj['token'] = Token;
			}
		
			if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');

			return this.commonService.isApp() ? from(this.nativeHttp.post(this.getDPSchemeDetails.url, params,Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
				return JSON.parse(response['data'] as any);
			})): this.httpClient.post(this.getDPSchemeDetails.url,params,{ headers: new HttpHeaders(Object.assign(obj))});
		}
		
		public ttnowMapping(cookievalue: any, ttMappingData: any): Observable<{}> {
		let params = {"head": {"RequestCode": "CVUpdateLead01",
		"Key": "446794970AAA1237ab394d176612f8c6",
		"AppName": "AAA",
		"AppVer": "01",
		"OsName": "Android",
		"userType": localStorage.getItem('userType')}, "body": ttMappingData}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		obj['token'] = cookievalue;
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.ttMapping.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.ttMapping.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getClientInteractionToken(): Observable<{}> {
		let params: any = {};
		let passheader: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm
		};

		this.cookieKEYclientInteraction['Authorization'] = environment['cookieKEYclientInteractionToken'];
		this.nativeHeadersClientInteraction['Authorization'] = environment['cookieKEYclientInteractionToken'];
		
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientInteractionToken.url, params, Object.assign(passheader, this.nativeHeadersClientInteraction))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.clientInteractionToken.url, params, { headers: new HttpHeaders(Object.assign(passheader, this.cookieKEYclientInteraction)) });
	}

	public clientTicketDetails(cookievalue: any, ticketData: any): Observable<{}> {
		let params = {
			"Parameters": {
				"ClientCode": ticketData
			}
		};
		let obj = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm
		};
		this.cookieKEYclientInteraction['Authorization'] = 'CRM-oauthtoken ' + cookievalue;

		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientTicketDetailsUrl.url, params, Object.assign(obj, this.nativeHeadersClientInteraction))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.clientTicketDetailsUrl.url, params, { headers: new HttpHeaders(Object.assign(obj, this.cookieKEYclientInteraction)) });
	}

	public clientInteractionDetails(cookievalue: any, ticketData: any): Observable<{}> {
		let params = {
			"Parameters": {
				"ClientCode": ticketData
			}
		};
			let obj = {
				'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.iiflcrm
			};
			this.cookieKEYclientInteraction['Authorization'] = 'CRM-oauthtoken ' + cookievalue;
			
			if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
			return this.commonService.isApp() ? from(this.nativeHttp.post(this.clientInteractionDetailsUrl.url, params, Object.assign(obj, this.nativeHeadersClientInteraction))).pipe(map(response => {
				return JSON.parse(response['data'] as any);
			})): this.httpClient.post(this.clientInteractionDetailsUrl.url, params, { headers: new HttpHeaders(Object.assign(obj, this.cookieKEYclientInteraction)) });
		}

		public scriptMasterExcel(cookievalue: any, txt: any, filter: any): Observable<{}> {
			let params = {
				"body": {
					"login": localStorage.getItem('userId1'),    
					"txt": txt,
					"Filter": filter
				},
				"head": {
					"RequestCode": "CVUpdateLead01",
					"Key": "446794970AAA1237ab394d176612f8c6",
					"AppName": "AAA",
					"AppVer": "01",
					"OsName": "Android",
					"userType": localStorage.getItem('userType')
				}}
			let obj: any = {
				'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
				'appID': localStorage.getItem('appID') || ''
			}
			if (cookievalue) {
				obj['token'] = cookievalue;
			}
			if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
			return this.commonService.isApp() ? from(this.nativeHttp.post(this.scriptExcel.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
				return JSON.parse(response['data'] as any);
			})): this.httpClient.post(this.scriptExcel.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
		}

		getinvestEdge(details:any,authorization:any){
			
			let params = {
				//"email": details.Email
				"email": localStorage.getItem('userId1') + "@iifl.com"
			
			}
			let obj = {
				'IIFL-AUTHORIZATION': `Bearer ${authorization}`,
				//'IIFL-AUTHORIZATION':  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQ3MDE2ODUzMTN9.RDkwUjBvwZrdyLI8rb_NGBUgy6hJDdqDnZszQ7fNDHs',
				'Content-Type': 'application/json',
				"Ocp-Apim-Subscription-Key":'cc2f25b98ac44cfaa9160b1f265bedd1',
				'appID': localStorage.getItem('appID') || ''
			};
			if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
			return this.commonService.isApp() ? from(this.nativeHttp.post(this.getBeyongIRRVal.url, params, Object.assign(obj, this.headersParams))).pipe(map(response => {
				return JSON.parse(response['data'] as any);
			})) : this.httpClient.post(this.getBeyongIRRVal.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
		
		}

		getRealTimeMarginShortfall(Token:any, userID:any,isNegativeMargin?:any) {
			this.paramsObj = {
				"head": {
					"RequestCode": "CVUpdateLead01",
					"Key": "446794970AAA1237ab394d176612f8c6",
					"AppName": "AAA",
					"AppVer": "01",
					"OsName": "Android",
					"userType": localStorage.getItem('userType')
				},
				"body": {
					"PartnerCode": userID,
					"PageNo": "0",
					"SortBy": "",
					"SortOrder": "asc",
					"SearchBy": "",
					"SearchText": ""
				}
			}
			if (isNegativeMargin) {
				this.paramsObj.body['Type'] = "N"
			}
			let obj: any = {
				'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
				'appID': localStorage.getItem('appID') || ''
			};
			if (Token) {
				obj['token'] = Token;
			}
			if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
			return this.commonService.isApp() ? from(this.nativeHttp.post(this.getMarginShortfallVal.url, this.paramsObj, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
				return JSON.parse(response['data'] as any);
			})) : this.httpClient.post(this.getMarginShortfallVal.url, this.paramsObj, { headers: new HttpHeaders(Object.assign(obj)) });

		}

		getLivLong(cookievalue: any,details: any){
			let params = { 
				"apiKey": "LL.655598262a94ecec7ec888cae32d4054c4e.AAA", 
				"userName": localStorage.getItem('userId1'), 
				"requestData" : [{ "Name": details.Name },
								{ "Email": details.Email }] 
			}
			  let obj: any = {
				'appID': localStorage.getItem('appID') || ''
			};
			//   if (cookievalue) {
			// 	obj = {
			// 	  'token': cookievalue
			// 	}
			//   }
			if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
			return this.commonService.isApp() ? from(this.nativeHttp.post(this.getLivlongVal.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
				return JSON.parse(response['data'] as any);
			})): this.httpClient.post(this.getLivlongVal.url,params,{ headers: new HttpHeaders(Object.assign(obj))});
			 
		  }
		  
	public getScripSummaryReport(cookievalue: any,id: any,symbol: any): Observable<{}> {
		let params = {
			"head": {
			"RequestCode": "APIBO52UCVDWFY",
			"Key": "446794970AAA1237ab394d176612f8c6",
			"AppName": "AAA",
			"AppVer": "01",
			"OsName": "Android",
			"userType": localStorage.getItem('userType')
			}, 
			"body": {
				"loginid": id,
				"Symbol": symbol
			}
		};
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.scripSummaryReport.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.scripSummaryReport.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}		  

	public commoditySummaryList(cookievalue: any, data: any): Observable<{}> {
		let params = {
			"body": data,
			"head": {
				"RequestCode": "APIBO52UCVDWFY",
				"Key": '446794970AAA1237ab394d176612f8c6',
				"AppVer": "01",
				"AppName": 'AAA',
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			}
		}
		let obj: any = {
			'appID': localStorage.getItem('appID') || '',
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.commoSummary.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.commoSummary.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getConsolidatedTradingReport(cookievalue: any, segment: any, date: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": '446794970AAA1237ab394d176612f8c6',
				"AppVer": "01",
				"AppName": 'AAA',
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"loginid": localStorage.getItem('userId1'),
				"segment": segment,
				"asondate": date
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.tradingListRepo.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.tradingListRepo.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
	public getCommodityClientScripSummary(cookievalue: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": '446794970AAA1237ab394d176612f8c6',
				"AppVer": "1.0.4.0",
				"AppName": 'AAA',
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"loginid": localStorage.getItem('userId1')
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.commodityScripSum.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.commodityScripSum.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getVasDetailedReport(cookievalue: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "ProfileDetailsV1",
				"Key": '446794970AAA1237ab394d176612f8c6',
				"AppVer": "1.0.4.0",
				"AppName": 'AAA',
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"loginid": localStorage.getItem('userId1'),
				"ClientCode": ""
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.vasDetailedReport.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.vasDetailedReport.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
	
	public getFreezeDetails = (cookieValue: any, freezeReason: any, loginId: any): Observable<{}> => {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.freezeDetails.key,
				"AppName": this.freezeDetails.appName,
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body":{
				"loginid": loginId,
				"srchby": "",
				"sortby": "",
				"sortorder": "",
				"freezereason": freezeReason,
				"pagenumber": "0"
			}
		}

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if(cookieValue){
			obj['token'] = cookieValue;
		}
		if(this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.freezeDetails.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.freezeDetails.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	} 

	public getDpModificationReport = (cookieValue: any, loginId: any, dpType: any, fromDate: any, toDate: any) : Observable<{}> => {
		let params = {
			"head": {
				"RequestCode": "ProfileDetailsV1",
				"Key": this.dpModificationDetails.key,
				"AppName": this.dpModificationDetails.appName,
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"LoginId": loginId,
				"ClientCode": "",
				"DPType": dpType,
				"FromDate": fromDate,
				"ToDate": toDate
			}
		}

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if(cookieValue){
			obj['token'] = cookieValue;
		}
		if(this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.dpModificationDetails.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.dpModificationDetails.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getSettlementPayoutReport = (cookieValue: any, loginId: any): Observable<{}> => {
		let params = {
			"head": {
				"RequestCode": "APIBO52UCVDWFY",
				"Key": this.settlementPayoutReport.key,
				"AppVer": "01",
				"AppName": this.settlementPayoutReport.appName,
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"LoginID": loginId
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookieValue) {
			obj['token'] = cookieValue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.settlementPayoutReport.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.settlementPayoutReport.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getDematRequestStatus = (cookieValue: any, loginId: any): Observable<{}> => {
		let params = {
			"head": {
				"RequestCode": "ProfileDetailsV1",
				"Key": this.dematRequestStatus.Key,
				"AppName": this.dematRequestStatus.appName,
				"AppVer": "1.0.4.0",
				"OsName": "Android"
			},
			"body": {
				"Partnercode": loginId
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookieValue) {
			obj['token'] = cookieValue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.dematRequestStatus.url, params, Object.assign(obj,this.nativeHttp))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.dematRequestStatus.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getSearchScripDetails = (cookieValue: any,searchText: any) : Observable<{}> => {
		let params = {
			"head": {
				"RequestCode": "ProfileDetailsV1",
				"Key": this.searchScripDetails.key,
				"AppName": this.searchScripDetails.appName,
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"SrchTxt": searchText
			} 
		}

		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if(cookieValue){
			obj['token'] = cookieValue;
		}
		if(this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.searchScripDetails.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.searchScripDetails.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getAccountClosureStatus = (cookieValue: any, loginId: any, fromDate: any, toDate: any) : Observable<{}> => {
		let params = {
			"head": {
				"RequestCode": "ProfileDetailsV1",
				"Key": this.accountClosureStatus.key,
				"AppName": this.accountClosureStatus.appName,
				"AppVer": "1.0.4.0",
				"OsName": "Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"FromDate": fromDate,
				"ToDate": toDate,
				"PartnerCode": loginId,
				"ChildCode": "",
			}
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if(cookieValue){
			obj['token'] = cookieValue;
		}
		if(this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.accountClosureStatus.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.accountClosureStatus.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}

	public getDownloadDematForm = (cookieValue: any, dpType: any, downloadCount: any, loginId: any): Observable<{}> => {
		let params: any = {
			"rptId": dpType == 'CDSL' ? "14452" : "14453",
				"Type": dpType,
				"ClientCode": loginId,
				"downloadCount": downloadCount,
				"SendEmail": "N",
				"ReportFormat": "PDF",
				"CallFrom": "AAA"
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookieValue) {
			obj['token'] = cookieValue;
		}
		if (this.commonService.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.commonService.isApp() ? from(this.nativeHttp.post(this.downloadDematForm.url, params, Object.assign(obj, this.nativeHttp))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.downloadDematForm.url, params, { headers: new HttpHeaders(Object.assign(obj)) });
	}
}
