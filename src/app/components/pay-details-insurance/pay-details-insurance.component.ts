import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { PayDetailsService } from '../../pages/pay-details/pay-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import * as _ from 'lodash';
import { FormatNumberDecimalPipe } from '../../helpers/decimalNumber.pipe';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';


@Component({
	selector: 'app-pay-details-insurance',
	providers: [FormatNumberDecimalPipe],
	templateUrl: './pay-details-insurance.component.html',
	styleUrls: ['./pay-details-insurance.component.scss'],
})
export class PayDetailsInsuranceComponent implements OnInit, OnChanges {
	@ViewChild('detail') detail?: ElementRef;
	@Input() insuranceTabList: any;
	@Input () PayoutMonth: any;
	@Output() passParentDropDown = new EventEmitter<string>();
	@Input() isMobile: any;
	@Input() clientCode: any;
	// @Input() clientID;
	order: string = 'clientName';
	reverse: boolean = false;
	payDetailsList: any[] = [];
	bodyObj: any;
	public dataLoad: boolean = false;
	requestCode: any;
	reqBodyParams: any;
	reqType: any;
	insuranceNewDetails: any[] = [];
	insuranceRenewDetails: any[] = [];
	public ascending: boolean = true;
	enableNext = false;
	enableNext1 = false;
	public wait = false;
	tableOption: any;
	payoutValue: any;
	spinnerstop: boolean = false;
	tokenValue:any;
	sortRenew?:boolean;
	sortNew?:boolean; 
	PayoutMonthYear:any;
	placeholderText:string = 'Search by Client Name';
	newSetTime:any;
	loadFile = false;
	
	constructor(private orderPipe: OrderPipe, private toast:ToasterService, private formatNumDecimal:FormatNumberDecimalPipe, private commonService: CommonService, private payDetService: PayDetailsService, private storage: StorageServiceAAA, private router: Router, private platform: Platform, private route: ActivatedRoute) { }
	
	ngOnChanges(changes: SimpleChanges): void {
		let type = localStorage.getItem('isMobile');
		this.isMobile = type ? type : this.isMobile;
		this.enableNext = false;
		this.enableNext1 = false;
		//this.spinnerstop = false;
		this.initInsuranceTab()
	}

	ngOnInit() {
		let type = localStorage.getItem('isMobile');
		this.isMobile = type ? type : this.isMobile;
		if (!this.platform.is('desktop') && this.isMobile) {
			this.initInsuranceTab()
		}
	}

	initInsuranceTab(){
		this.commonService.setClevertapEvent('Insurance_Payout_Details');
		if (!this.platform.is('desktop') && this.isMobile) {
			this.route.params.subscribe(params => {
				if (params && !_.isEmpty(params)) {
					this.payoutValue = parseInt(params['id']);
					// console.log(this.payoutValue);
				} else {
					// this.payoutValue = parseInt(this.InsurancePayout);
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
		
		this.bodyObj = {
			// "RMCode":"C87762",
			"ClientCode": "",
			"PayoutMonth": this.PayoutMonthYear,
			"PageNo": parseInt("1"),
			"SortBy": "clientcode",
			"SortOrder": "asc",
			"SearchBy": "",
			"SearchText": ""
		}
		this.newSetTime = [0, 1000];
		this.sortRenew = false;
		this.sortNew = false
		this.payDetailsList = [];
		this.spinnerstop = false;
		//this.payDetailsList = this.insuranceTabList;
		this.requestCode = "GetAAAFDPayoutDetails";
		this.reqBodyParams = this.bodyObj;
		this.reqType = 'insu';
		this.tableOption = 'insu';
		setTimeout(() => {
			this.insuranceDetails('undefined', this.newSetTime)
		}, 200);
		
	}

	goBack() {
		window.history.back();
	}

	insuranceDetails(params?: any, timeset?: any) {
		
		if (params != '2') {
			this.payDetailsList = [];
			this.dataLoad = false;
		}

		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.payDetailsInsuranceTab(token, timeset)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.payDetailsInsuranceTab(token, timeset)
				})
			}
		})
	
	
	}
	payDetailsInsuranceTab(tokenValue: any, timeset: any){
		this.storage.get('userID').then((ID) => {
			if (!this.enableNext) {
				setTimeout(() => {
					this.insuranceNewPayDetailsList(tokenValue, "GetAAAFDPayoutDetails", Object.assign(this.reqBodyParams, {"RMCode": this.clientCode, "Type": "new"}), 'insu');	
				},this.newSetTime[0]);
				
			}
			if (!this.enableNext1) {
				setTimeout(() => {
				this.insuranceReNewPayDetailsList(tokenValue, "GetAAAFDPayoutDetails", Object.assign(this.reqBodyParams, {"RMCode": this.clientCode, "Type": "renew"}), 'insu');
			},this.newSetTime[1]);	
			}
		})
		setTimeout(() => {
			this.dataLoad = true;
		}, 3500);
	}
	async insuranceNewPayDetailsList(token: any, requestCode: any, objBody: any, type: any) {
		this.payDetService.getPayoutDetails(token, requestCode, objBody, type).subscribe(async (res: any) => {
			if (res['Body'] == null) {
				this.insuranceNewDetails = [];
				//this.payDetailsList = [];
				this.enableNext = true;
				this.spinnerstop = true;
			}
			else {
				this.commonService.setClevertapEvent('InsurancePayout_downloaded');
				this.insuranceNewDetails = res['Body']['Payout'];
			
				if(res['Body']['Payout'].length > 0 ){
					this.sortNew = true;
				}
				if (this.insuranceNewDetails.length > 49) {
					this.enableNext = false;
					this.wait = false;
				}
				else {
					this.enableNext = true;
				}
				await this.insuranceNewDetails.forEach(element => {
					this.payDetailsList.push({
						ClientName: element['ClientName'],
						PayoutDetails: element['PayoutDetails'],
						PolicyPremium: element['PolicyPremium'],
						type: "New",
						details: element
					})
				});
			}

		})
	}

	async insuranceReNewPayDetailsList(token: any, requestCode: any, objBody: any, type: any) {
		this.payDetService.getPayoutDetails(token, requestCode, objBody, type).subscribe(async (res: any) => {
			if (res['Body'] == null) {
				this.insuranceRenewDetails = [];
				this.enableNext1 = true;
				this.spinnerstop = true;
				//this.payDetailsList = [];
			}
			else {
				this.insuranceRenewDetails = res['Body']['Payout'];
				this.commonService.setClevertapEvent('InsurancePayout_downloaded');
				if(res['Body']['Payout'].length > 0 ){
					this.sortRenew = true;
				}
				if (this.insuranceRenewDetails.length > 49) {
					this.enableNext1 = false;
					this.wait = false;
				}
				else {
					this.enableNext1 = true;
				}

				await this.insuranceRenewDetails.forEach(element => {
					this.payDetailsList.push({
						ClientName: element['ClientName'],
						PayoutDetails: element['PayoutDetails'],
						PolicyPremium: element['PolicyPremium'],
						type: "Renew",
						details: element
					})
				});
			}
		})
	}


	dropClick(index: any, arr: any) {
		// console.log(arr.length);
		arr.forEach((element: any, ind: any) => {
			if ((index) !== ind) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
		setTimeout(() => {
			const height = this.detail?.nativeElement.offsetHeight;
			// console.log(height);
		}, 0);
	}

	loadData(event: any) {
		setTimeout(() => {
			event.target.complete();

			//	console.log(this.bodyObj);
			if (!this.enableNext || !this.enableNext1) {
				this.bodyObj.PageNo += 1;
				// console.log(this.bodyObj);
				this.insuranceDetails('2', this.newSetTime)
			} else event.target.disabled = true;
			//event.target.disabled = true;
		}, 2000);
	}

	// sorting function for column
	setOrder(value: string) {
		if (this.payDetailsList.length === 0) return;
		this.enableNext = false;
		this.enableNext1 = false;
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		this.bodyObj.SortBy = value;
		if(this.bodyObj.SortBy == 'New'){
			this.newSetTime = [0, 1000];
		}
		if(this.bodyObj.SortBy == 'Renew'){
			this.newSetTime = [1000, 0];
		}
	
		this.bodyObj.PageNo = 1;
		this.bodyObj.SortOrder = this.reverse ? 'asc' : 'desc';
		this.ascending = this.reverse ? true : false;
		this.insuranceDetails(undefined ,this.newSetTime);
	}

	// pass the data of search from header component
	EnterSearchText(searchText: any) {
		this.enableNext = false;
		this.enableNext1 = false;
		this.newSetTime = [0, 100];
		if (searchText.length > 2) {
			// console.log(this.enableNext);
			// console.log(this.enableNext1);
			this.wait = true;
			this.bodyObj.SearchBy = "clientname";
			this.bodyObj.SearchText = searchText;
			this.bodyObj.PageNo = 1;
			// console.log(this.bodyObj);
			this.insuranceDetails('undefined',this.newSetTime)
		}
		else if (searchText.length == 0) {
			this.wait = false;
			this.bodyObj.PageNo = 1;
			this.bodyObj.SearchBy = "";
			this.bodyObj.SearchText = "";
			this.insuranceDetails('undefined',this.newSetTime)

		}
	}
	
	// pass the selected data from dropdown from header component
	dropDownList(value: any) {
		this.enableNext = false;
		this.enableNext1 = false;		
		this.bodyObj.PayoutMonth = value.event;
		this.passParentDropDown.emit(value.event);
		this.insuranceDetails()
	}

	goToDescription(data: any) {
		localStorage.setItem('payout_details', JSON.stringify(data));
		this.router.navigate(['/pay-list-details', "insu"]);
	}

    goToSearch() {
       //this.router.navigate(['/add-script']);
	   this.router.navigate(['/dashboard-clients']);
    }

	divScroll(event: any) {
		const tableHeight = event.target.offsetHeight;
		const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;
		if (tableScrollTop >= scrollerEndPoint - 100 && !this.wait) {
			this.wait = true;
			// if(this.enableNext == true){
			// 	this.flag = false;
			// }
			// else if(this.enableNext1 == true){
			// 	this.flag1 = false;
			// }
			

			if (!this.enableNext || !this.enableNext1) {
				this.bodyObj.PageNo += 1;
				this.bodyObj['SearchText'] = this.bodyObj.SearchText;
				this.bodyObj['SearchBy'] = this.bodyObj.SearchBy;
				this.insuranceDetails('2', this.newSetTime)
			}

		}
	}
	/**
	 * On click of pdf/excel icon
	 */
	onPdfExcelDownload() {
		this.loadFile = true;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.downloadFile(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.downloadFile(token)
				})
			}
		})

	}

	downloadFile(token: any) {
		this.reqBodyParams.PageNo = 0;
		this.payDetService.getPayoutDetails(token, this.requestCode, this.reqBodyParams, 'insu').subscribe(async (res: any) => {
			if (res['Body'] == null) {
				this.toast.displayToast('No Data Found');
				this.loadFile = false;
			}
			else {
				if (res['Body']['Payout'] && res['Body']['Payout'].length > 0) {
					let info: any = [];
					let head = [["Client Name", "Policy Premium", "AgentCode", "FinalReferralSharing", "IssueDate", "Month", "Partner", "Payout", "Policy Number", "Premium", "Product Name", "Recovery", "Referral Sharing"]];
					res['Body']['Payout'].forEach((element: any) => {
						info.push([element.ClientName, this.formatNumDecimal.transform(element.PolicyPremium), element.PayoutDetails[0].AgentCode, this.formatNumDecimal.transform(element.PayoutDetails[0].FinalReferralSharing), element.PayoutDetails[0].IssueDate, element.PayoutDetails[0].Month, element.PayoutDetails[0].Partner, element.PayoutDetails[0].Payout, element.PayoutDetails[0].PolicyNumber, this.formatNumDecimal.transform(element.PayoutDetails[0].Premium), element.PayoutDetails[0].ProductName, this.formatNumDecimal.transform(element.PayoutDetails[0].Recovery), this.formatNumDecimal.transform(element.PayoutDetails[0].ReferralSharing),])
					})
					this.commonService.exportDataToExcel(head[0], info, 'Insurance');
					this.loadFile = false;
				} else {
					this.loadFile = false;
					this.toast.displayToast('No Data Found');
				}
			}
		})
	}
}
