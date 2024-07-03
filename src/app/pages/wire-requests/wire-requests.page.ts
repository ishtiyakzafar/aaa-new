import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { Platform, ModalController } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import moment from "moment";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject, Subscription,  } from 'rxjs';
import { DashBoardService } from '../dashboard/dashboard.service';
import { ToasterService } from "../../helpers/toaster.service";
import { StorageServiceAAA } from "../../helpers/aaa-storage.service";
import dayjs from "dayjs/esm";

@Component({
	selector: "app-wire-requests",
	providers: [WireRequestService, ToasterService, DashBoardService],
	templateUrl: "./wire-requests.page.html",
	styleUrls: ["./wire-requests.page.scss"],
})
export class WireRequestsPage implements OnInit,AfterViewChecked   {
	public requestType?: string;
    public canActivate: boolean = true;
	public requestTypeData: any[] = [];
    public brokerageTypeData: any[] = [
		{ type: "Hybrid Brokerage" },
		{ type: "Permanent Brokerage" },
	];
	brokerageType:any;
	clientId: any = null;
	clientIdInputValidate!: boolean;
	validateLimitInput: boolean = false;
	clientIdLimitErrMsg: string = "Client ID is required";
	selectWireReqType: any;
	limitFormData: any;
	cleintIdData: any;
	public isClientMappingSelected = false;
	jvFormData: any;
	validateLjvInput: boolean = false;
	isDesktop = false;
	checkjvButton: boolean = false;
	public isDropDownVisible: boolean = false;
	clientCodeList: any[] = [];
	//Loadvalue = false;
	inputattr = false;
	clearText = false;
	currentBrokFun:boolean = false;
	depositDetils:any[] = [];
	public displayHybridDropdown:boolean = false;
	bankDetail:any[] = [];
	equityCmsData:any[] = [];
	clientMappingTableDetails: any[] = [];
	setToken?: string;
	setUserId?: string;
	public selectedDate = { start: moment().startOf('month'), end: moment().endOf('month') };
	NgxDaterangepickerMd?: NgxDaterangepickerMd;
	maxDate = dayjs();
  	minDate = dayjs('1973-01-01');
	ranges: any = {
		'This Month': [moment().startOf('month'), moment().endOf('month')],
		'Previous Month': [
			moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')
		]
	}
	cancelBtn: boolean = true;
	dataLoad: boolean = true;
	addOverlay: boolean = false;
	public isListVisible: boolean = false;
	private clientSearchTerms = new Subject<string>();
	allClients: any[] = [];
	dtLoad: boolean = false;
	public clientSearchValue: any = null;

	constructor(private cdRef : ChangeDetectorRef,private route: ActivatedRoute, private dashBoardService:DashBoardService, private location: Location, private storage: StorageServiceAAA, private wireReqService: WireRequestService, public toast: ToasterService, private router: Router, private platform: Platform, private commonService: CommonService) { }
	ngAfterViewChecked() {
		this.cdRef.detectChanges();
	  }
	ngOnInit() {
		let typeOfUser = localStorage.getItem('userType');
		if(typeOfUser == 'SUB BROKER'){
			this.requestTypeData = [
				{ requestType: "Limit Change" },
				{ requestType: "JV Request" },
				{ requestType: "Brokerage Request" },
				{ requestType: "Client Mapping" },
				{ requestType: "Payout Request" },
				{ requestType: "EPI Request" }
			]
		}
		else {
			this.requestTypeData = [
				{ requestType: "Limit Change" },
				{ requestType: "JV Request" },
				{ requestType: "Brokerage Request" },
				{ requestType: "Client Mapping" },
				{ requestType: "Payout Request" },
				{ requestType: "EPI Request" },
				// { requestType: "CMS Entry" },  // need to add condition when production is false
			]
		}
		this.displayClientCodes()
		this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
						this.storage.get('bToken').then(token => {
						this.setToken = token;
						this.setUserId = userID;
						this.checkProdAct(token, userID, type)
					})
				} else {
						this.storage.get('subToken').then(token => {
						this.setToken = token;
						this.setUserId = userID;
						this.checkProdAct(token, userID, type)
					})
				}
			})
		})

		let token = localStorage.getItem('jwt_token');
		let userID = localStorage.getItem('userId1');
		let userTypeValue = localStorage.getItem('userType');
		if(userTypeValue==='RM'){
			userTypeValue = 'RM';
		}else if(userTypeValue==='FAN'){
			userTypeValue = 'FN';
		}else{
			userTypeValue = 'SB';
		}
		this.clientSearchTerms
		.pipe(
			debounceTime(500),
			switchMap((searchValue) => this.dashBoardService.fetchGetClientCodes(userTypeValue, userID, token, searchValue)))
		.subscribe(results => {
			let clientData = [].concat(...results);
			const data = clientData
			.filter((element: any) => element.toString().split("-")[3].toLowerCase().trim() == "false")
			.map((client: any) => {
				return `${client.toString().split("-")[0]} - ${client.toString().split("-")[1].trim()}`;	
			});
			this.setClientSearch(data);
		});
	}

	ionViewWillEnter() {
		this.clientId = null;
		this.route.params.subscribe((params) => {
			if (params) {
				this.selectWireReqType = params["id"];
				// console.log(this.selectWireReqType);

				if (this.selectWireReqType == "jv-request") {
					this.requestType = "JV Request";
				}

				else if (this.selectWireReqType == "brokerage-request") {
					this.requestType = "Brokerage Request";
				}
				else if (this.selectWireReqType == "epi-share-from") {
					this.requestType = "EPI Request";
				}
				else if (this.selectWireReqType == "product-act") {
					this.requestType = "Product Activation";
				}
				else if (this.selectWireReqType == "client-mapping") {
					this.requestType = "Client Mapping";
				}
                else if (this.selectWireReqType == "cms-entry") {
					this.requestType = "CMS Entry";
				}
				else {
					this.requestType = "Limit Change";
				}
			}

		});
		this.brokerageType = this.brokerageTypeData[1].type;
		// console.log(this.brokerageType);
	}

	
	checkProdAct(token: any, userId: any, type: any){
		//  if (this.platform.is('desktop')) {
		// 	this.wireReqService.accessProductActivation(token, userId).subscribe((res) => {
		// 	if(res['Head']['ErrorCode'] == 0){
		// 	 //if((res['Head']['ErrorCode'] == 0 && res['Body']['ResponseStatus'] == "Success")){
		// 	   this.displayHybridDropdown = true;
		// 	   this.requestTypeData = [];
		// 	   this.requestTypeData = [
		// 		   { requestType: "Limit Change" },
		// 		   { requestType: "JV Request" },
		// 		   { requestType: "Brokerage Request" },
		// 		   { requestType: "Product Activation" },
		// 		   { requestType: "CMS Entry" }
		// 	   ];
		// 	   this.cmsDepositDetails(token, userId);
		// 	  }
		//    })

		// }
		// this.storage.get('setActivation').then((access) => {
		// 	if(access == true){
		// 		this.displayHybridDropdown = true;
		// 		this.requestTypeData = [
		// 			{ requestType: "Limit Change"},
		// 			{ requestType: "JV Request"},
		// 			{ requestType: "Brokerage Request"},
		// 			{ requestType: "Product Activation"},
		// 			{ requestType: "CMS Entry"}
		// 		];	
		// 	this.cmsDepositDetails(token, userId, type);
		// 	}
		// })

		var arrayItems: any = [];
		 this.storage.get('setAccessMaker').then((accessMaker) => {
			// var accessChecker = "BrokerageException|JVEntry|DPC|CMSEntry"
			// console.log(accessMaker.includes("ProductActivation"));
			// console.log(accessMaker.includes("CMSEntry"))
			if(accessMaker.includes("ProductActivation") && accessMaker.includes("CMSEntry")){
				arrayItems.push({ requestType: "CMS Entry"},{ requestType: "Product Activation"})
				this.cmsDepositDetails(token, userId, type);
			}
			if(accessMaker.includes("ProductActivation") && !accessMaker.includes("CMSEntry")){
				arrayItems.push({ requestType: "Product Activation"})
			}
			if(!accessMaker.includes("ProductActivation") && accessMaker.includes("CMSEntry")){
				arrayItems.push({ requestType: "CMS Entry"})
				this.cmsDepositDetails(token, userId, type);
			}
			if(accessMaker.includes("BrokerageException-Hybrid")){
				this.displayHybridDropdown = true;
			}
			this.requestTypeData = [ ...this.requestTypeData, ...arrayItems];
		})
	
	}

	cmsDepositDetails(token: any, user: any, type: any){
		let userTypeNo = type == 'RM' ? '1': type == 'FAN' ? '2' : '3'
		this.wireReqService.getCmsDepositBankList(token, user, userTypeNo).subscribe((res) => {
			// console.log(res);
			if(res['Head']['ErrorCode'] == 0){
				this.depositDetils = res['Body']['BankDetails'];
				localStorage.setItem('depositBank', JSON.stringify(this.depositDetils))
			}
			else{
				this.depositDetils = [];
			}
		})
	}
	
	changeRequestType(event: any) {
		this.onCancel();
		this.isClientMappingSelected = false;
		// console.log(event);
		this.clientId = null;
		this.clientIdLimitErrMsg = "Client ID is required";
		this.clientIdInputValidate = false;
		let changeroute;
		if (this.requestType == "Limit Change") {
			changeroute = "limit-change";

		} else if (this.requestType == "JV Request") {
			changeroute = "jv-request";
		}
		else if (this.requestType == "Product Activation") {
			changeroute = "product-act";
		}
		else if (this.requestType == "EPI Request") {
			changeroute = "EPIRequest";
		}
		else if (this.requestType == "CMS Entry") {
			this.commonService.setClevertapEvent('CMS_Entry');
			this.isDesktop = true;
			changeroute = "cms-entry";
	
		}
		else if (this.requestType == "Client Mapping") {
			this.commonService.setClevertapEvent('Client Mapping');
			changeroute = "client-mapping";
			this.isClientMappingSelected = true;
		}
		else if (this.requestType == "Payout Request") {
			changeroute = "payout-request";
			this.isDesktop = true;
		}
		else {
			changeroute = "brokerage-request";
		}
		this.location.replaceState("/wire-requests/" + changeroute);
	}

	clientMapEvent(event: any) {
		if(event == "client-mapping"){
			this.isClientMappingSelected = true;
		}
	}

	// equityCmsCall(event){		empty function
	// 	// console.log(event);
	// }

	inputClientId(event: any) {
		this.currentBrokFun = true;
		this.cleintIdData = event;
		// console.log(this.cleintIdData);
		if ( event === undefined ||  event == null) {
			this.clientIdLimitErrMsg = "Client ID is required";
			this.clientIdInputValidate = false;
		} else {
			this.clientIdLimitErrMsg = "";
			this.clientIdInputValidate = true;
		}
		// console.log(this.currentBrokFun);
	}

	setClientSearch(res: any) {
		if (res.length) {
			let data = [];
			for (const item of res) {
				data.push({
					ClientCode: item
				})
			}
			this.allClients = data;
		} else {
			this.allClients = [];
		}
		this.dtLoad = true;
	}
	searchClient(text: any) {
		let searchValue = text.trim();
		this.isListVisible = false;
		if (searchValue && searchValue.length > 3) {
			this.dtLoad = false;
			this.isListVisible = true;
			this.clientSearchTerms.next(searchValue);
		} else {
			this.allClients = [];
			this.onCancel()
		}
	}
	hideDropDown() {
	
		setTimeout(() => {
			this.isListVisible = false;
		}, 300);
	}
	displayClientDetails(data: any) {
		this.clientSearchValue = data.ClientCode.split('-')[0].trim();
		this.clientId = data.ClientCode.split('-')[0].trim();
		this.inputClientId(this.clientId);
		this.clientIdLimitErrMsg = "";
		this.clientIdInputValidate = true;
	}
	onCancel(){
		this.clientIdLimitErrMsg = "Client ID is required";
		this.clientIdInputValidate = false;
		this.clientSearchValue=null;
		this.clientId = null;
	}

	isEmpty(obj: any) {
		return Object.keys(obj).length === 0;
	}

	goBack() {
		window.history.back();
	}

	displayClientCodes() {
		this.storage.get('setClientCodes').then((clientCodes) => {
			this.clientCodeList = clientCodes;
		})
	}

	EnterClientIdText(event: any){
		// console.log(event);
		this.clientId = null;
		this.clientIdLimitErrMsg = "Client ID is required";
		this.clientIdInputValidate = false;
	}

	// changeBrokField(event){		event never used
	changeBrokField(){
		// console.log(event.type);
		this.currentBrokFun = false;
		// console.log(this.currentBrokFun);
	}

	goToRequestType(req: any) {
		// console.log(req);
		//this.commonService.setData(this.clientCodeList);
		//localStorage.setItem('clientListWireRequest', JSON.stringify(this.clientCodeList));
		if (req == 'Limit Change') {
			this.router.navigate(['/limit-insert']);
		} else if (req == 'JV Request') {
			this.router.navigate(['/jv-insert']);
		} else if (req == 'Brokerage Request') {
			//this.router.navigate(['/brokerage-insert']);
			this.router.navigate(['/brok-insert-mobile']);
		} else if (req == 'Product Activation'){
			this.router.navigate(['/product-activation']);
		} else if (req == 'Client Mapping'){
			this.router.navigate(['/client-mapping']);
		} else if (req == 'CMS Entry'){
			this.commonService.setClevertapEvent('CMS_Entry');
			this.router.navigate(['/cms-entry']);
		}else if (req == 'Payout Request') {
			this.router.navigate(['/fund-transfer']);
		}
	}
	
	limitChangeRedirect(){
		this.router.navigate(['/view-reports'],{ queryParams: {report: 'LimitChange'}});
	}
	jvRequestRedirect(){
		this.router.navigate(['/view-reports'],{ queryParams: {report: 'JVRequest'}});
	}
	epiRequestRedirect(){
		this.router.navigate(['/view-reports'],{ queryParams: {report: 'EPIRequest'}});
	}
	brokerageRequestRedirect(){
		this.router.navigate(['/view-reports'],{ queryParams: {report: 'BrokerageRequest'}});
	}

	addOverlayFunction = (event: boolean) => {
		this.addOverlay = event;
	}

	public overlayClicked(event: any) {
		event.preventDefault();
	}
}