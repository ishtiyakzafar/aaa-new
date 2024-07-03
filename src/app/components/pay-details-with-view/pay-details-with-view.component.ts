import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { ModalController, Platform } from '@ionic/angular';
import { PaydetailModelComponent } from '../../components/paydetail-model/paydetail-model.component'
import { PayDetailsService } from '../../pages/pay-details/pay-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-pay-details-with-view',
	providers: [PayDetailsService],
	templateUrl: './pay-details-with-view.component.html',
	styleUrls: ['./pay-details-with-view.component.scss'],
})
export class PayDetailsWithViewComponent implements OnInit, OnChanges {
	// public option: string = 'A';
	@Input() tableOption: any;
	@Input() fdTabList: any;
	@Input() bondsTabList: any;
	@Input() PmsTabList: any;
	@Input() mldTabList: any;
	@Input() ncdTabList: any;
	@Input() aifTabList: any;
	@Input() GoldPtcTabList: any;
	@Input() PayoutMonth: any;
	@Input() isMobile: any;
	@Input() clientCode: any;
	// @Input() clientID;
	PayoutMonthYear:any;
	@Output() passParentDropDown = new EventEmitter<string>();
	order: string = 'clientName';
	public dataLoad:boolean = false;
	reverse: boolean = false;
	public payDetailsList: any[] = [];
	monthYearDropDown: any[] = [];
	modelArray: any[] = [];
	array1: any[] = [];
    public paymentOption: any = null;
	sharedVarParent = ''
	bodyObj: any;	// "RMCode":"C87762",
	requestCode?: string;
	reqBodyParams: any;
	ascending:boolean = true;
	reqType?: string
	enableNext?:boolean;
	public wait?:boolean;
	headerTitle?:string;
	payoutValue:any;
	userID:any;
	tokenValue:any;
	placeholderText:string = 'Search by Client Code';
	public payDetailsListDummy: any[] = [
		{ ClientCode: 'PC1234569', ClientName: 'Ramesh Chakravarty', view: 'View Details', Payout: '54.35 K' },
	   { ClientCode: 'PC1234567', ClientName: 'Abhijeet Chakravarty', view: 'View Details', Payout: '34.35 K' },
	];

	constructor(private route: ActivatedRoute, private orderPipe: OrderPipe, private commonService: CommonService, private modalController: ModalController, private payDetService: PayDetailsService, private storage: StorageServiceAAA, private platform: Platform, private router: Router) { }
	ngOnChanges(changes: SimpleChanges): void {
		this.enableNext = false;
	    this.wait = false;
		let type = localStorage.getItem('isMobile');
		this.isMobile = type ? type : this.isMobile;
		this.initTab();
	}

	ngOnInit() {
		let type = localStorage.getItem('isMobile');
		this.isMobile = type ? type : this.isMobile;
		if (!this.platform.is('desktop') && this.isMobile) {
			this.initTab();
		}
	}
	initTab(){
		if (!this.platform.is('desktop') && this.isMobile) {
			this.route.params.subscribe(params => {
				if (params && !_.isEmpty(params) ) {
					this.tableOption = params['id'];
					this.payoutValue = params['id1'];
					// console.log(this.tableOption);
					
				} else {
					this.tableOption = this.tableOption;
					this.payoutValue = this.payoutValue;
				}
			});
			this.route.queryParams
			.subscribe(qparams => {
			  console.log(qparams);  
			  this.clientCode = qparams['cCode'];  
			});
		}
		if(localStorage.getItem('payDetailMonth') == undefined){
			this.PayoutMonthYear = this.commonService.last12Month()[1];
		}
		   else{
			this.PayoutMonthYear = localStorage.getItem('payDetailMonth');
		}
		//console.log(localStorage.getItem("payDetailMonth"))
			// setTimeout(() => {
				
			// }, 200);
			this.bodyObj = {
				"RMCode":this.clientCode,
				"ClientCode": "",
				"PayoutMonth": this.PayoutMonthYear,
				"SortBy": "clientcode",
				"SortOrder": "asc",
				"SearchBy": "",
				"SearchText": ""
			}
		this.payDetailsList = []
		switch (this.tableOption) {
			case "deposit":
				this.requestCode = "GetAAAFDPayoutDetails";
				//this.reqBodyParams = Object.assign(this.bodyObj, { "RMCode": "C1011", "PayoutMonth": "January-2019" });
				this.reqBodyParams = this.bodyObj;
				this.reqType = 'fd'
				this.headerTitle = 'Fixed Deposit';
				
				break;
			case "bonds":
				this.requestCode = "GetBondPayout";
				//this.reqBodyParams = Object.assign(this.bodyObj, { "RMCode": "C1011", "PayoutMonth": "January-2019" });
				this.reqBodyParams = this.bodyObj;
				this.reqType = 'bonds';
				this.headerTitle = 'Bonds'
				break;
			case "ncd":
				this.requestCode = "GetAAANCDPayout";
				//this.reqBodyParams = Object.assign(this.bodyObj, { "RMCode": "C1011", "PayoutMonth": "January-2021" });
				this.reqBodyParams = this.bodyObj;
				this.reqType = 'ncd';
				this.headerTitle = 'NCD'
				break;
			case "mld":
				this.requestCode = "GetAAAPMSPayout";
				//this.reqBodyParams = Object.assign(this.bodyObj, { "RMCode": "C1011", "PayoutMonth": "January-2021" });
				this.reqBodyParams = this.bodyObj;
				this.reqType = 'mld';
				this.headerTitle = 'MLD'
				break;
			case "aif":
				this.requestCode = "GetAAAPMSPayout";
				//this.reqBodyParams = Object.assign(this.bodyObj, { "RMCode": "C138228", "PayoutMonth": "January-2021" });
				this.reqBodyParams = this.bodyObj;
				this.reqType = 'aif';
				this.headerTitle = 'AIF'
				break;
			case "pms":
				this.requestCode = "GetAAAPMSPayout";
				//this.reqBodyParams = Object.assign(this.bodyObj, { "RMCode": "C1011", "PayoutMonth": "January-2021" });
				this.reqBodyParams = this.bodyObj;
				this.reqType = 'pms';
				this.headerTitle = 'PMS';
				break;
			case "gold":
				this.requestCode = "GetAAAPTCPayout";
				//this.reqBodyParams = Object.assign(this.bodyObj, { "RMCode": "C156191", "PayoutMonth": "January-2021" });
				this.reqBodyParams = this.bodyObj;
				this.reqType = 'ptc'
				this.headerTitle = 'Gold PTC'
		}
		// console.log(this.commonService.last12Month());
		this.orderPipe.transform(this.payDetailsList, 'clientcode');
		this.bodyObj.PageNo = 1;

		
		setTimeout(() => {
			this.callPayDetailsList();
		}, 200);

	}

    ionViewWillEnter() {
	}
	
    loadData(event: any) {
		setTimeout(() => {
			event.target.complete();
			if (this.enableNext) {
				this.bodyObj.PageNo += 1;
				// this.getData();
				this.callPayDetailsList('1');
			} else event.target.disabled = true;
		}, 1000);
    }

    goBack() {
        window.history.back();
	}

	// moveToModalPage() {
    //     this.router.navigate(['/modal-details']);
    // }


	goToDescription(data: any){
		//this.router.navigate(['/pay-list-details',this.tableOption], { state: data });
		localStorage.setItem('payout_details', JSON.stringify(data));
		this.router.navigate(['/pay-list-details',this.tableOption]);

	}

    goToSearch() {
        //this.router.navigate(['/add-script']);
		this.router.navigate(['/dashboard-clients']);
    }

	// sorting function for column
	setOrder(value: string) {
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		this.bodyObj.SortBy = value;
		this.bodyObj.PageNo = 1;
		this.bodyObj.SortOrder = this.reverse ? 'asc' : 'desc';
		this.ascending = this.reverse ? true : false;
		this.enableNext = false;
		// console.log(this.bodyObj);
		this.payDetailsList = [];
		this.callPayDetailsList();
		
	}
	// View Pay Details of Summary
	async viewDetailsModel(viewDetailObj: any) {
		// console.log(viewDetailObj)
		const modal = this.modalController.create({
			component: PaydetailModelComponent,
			componentProps: { "TabValue": this.tableOption, "viewDetailList": viewDetailObj },
			cssClass: 'superstars Pay-detail-model'
		});
		return (await modal).present();
	}

	// Check the Tab and render the data from API accordingly
	checkTabData(response: any) {
		if (this.tableOption == 'deposit' || this.tableOption == 'pms' || this.tableOption == 'mld' || this.tableOption == 'ncd' || this.tableOption == 'gold' ) {
			this.scrollTriggerApiCall(response['Body']['Payout'])
		}
		else if (this.tableOption == 'bonds') {
			this.scrollTriggerApiCall(response['Body']['Data'])
		}
		else if (this.tableOption == 'aif') {
			this.scrollTriggerApiCall( response['Body']['AIFPayoutData']);
		}
		setTimeout(() => {
			this.dataLoad = true;
		}, 1000);
	}
	// common function to call the API while scroll
	scrollTriggerApiCall(responseData: any){
		if(responseData.length > 49){
			this.enableNext = true;
			this.wait = false;
		}
		else{
			this.enableNext = false;
			this.wait = true;
		}
		responseData.forEach((element: any) => {
			this.payDetailsList.push({
				ClientCode: element['ClientCode'],
				ClientName: element['ClientName'],
				Payout: element['Payout'],
				details: element
			})
		});
	}
	// pass the data of search from header component
	EnterSearchText(searchText: any) {
		if (searchText.length > 2) {
			this.bodyObj.SearchBy = "clientcode";
			this.bodyObj.SearchText = searchText;
			this.bodyObj.PageNo = 1;
			this.enableNext = false;
			// console.log(this.bodyObj);
			
			this.callPayDetailsList();
			this.payDetailsList = [];
		}
		else if(searchText.length == 0){
			this.bodyObj.SearchBy = "";
			this.bodyObj.PageNo = 1;
			this.bodyObj.SearchText = "";
			this.enableNext = true;
			this.callPayDetailsList();
			this.payDetailsList = [];
		}
	}
	//call the API commponly for common Tab	
	callPayDetailsList(params?: any) {
		if(params != '1'){
			this.dataLoad = false;
		}

		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.payDetailsTabData(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.payDetailsTabData(token)
				})
			}
		})
	}

	payDetailsTabData(tokenValue: any){
		this.storage.get('userID').then((ID) => {
			this.payDetService.getPayoutDetails(tokenValue, this.requestCode, Object.assign(this.reqBodyParams,{"RMCode": this.clientCode}), this.reqType)
			.subscribe((res: any) => {
				if (res['Body'] == null) {
					this.payDetailsList = [];
					this.enableNext = false;
					setTimeout(() => {
						this.dataLoad = true;
					}, 1000);
				}
				else{
					this.checkTabData(res)
				}
				
			})
		})
	}
	
	// pass the selected data from dropdown from header component
	dropDownList(value: any) {
		// console.log(value);
		this.bodyObj.PayoutMonth = value.event;
		this.passParentDropDown.emit(value.event);
		this.callPayDetailsList();
		this.payDetailsList = [];
	}
	
	divScroll(event: any){
		const tableHeight = event.target.offsetHeight;
		const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;
			if (tableScrollTop >= scrollerEndPoint - 100 && this.enableNext && !this.wait) {
				this.wait = true;
				this.bodyObj.PageNo += 1;
				this.bodyObj['SearchText'] = this.bodyObj.SearchText;
				this.bodyObj['SearchBy'] = this.bodyObj.SearchBy;
				//  console.log(this.bodyObj);
				 this.callPayDetailsList('1');
			}
		}
	}