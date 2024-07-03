import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { PayDetailsService } from '../../pages/pay-details/pay-details.service';
import { ModalController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import * as _ from 'lodash';
import { FormatNumberDecimalPipe } from '../../helpers/decimalNumber.pipe';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { PaydetailModelComponent } from '../paydetail-model/paydetail-model.component';
import { StatusRequestComponent } from '../status-request/status-request.component';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-pay-details-mutual-fund',
	providers: [FormatNumberDecimalPipe],
	templateUrl: './pay-details-mutual-fund.component.html',
	styleUrls: ['./pay-details-mutual-fund.component.scss'],
})
export class PayDetailsMutualFundComponent implements OnInit, OnChanges {
	//@Input() mfTabList
	@Output() passParentDropDown = new EventEmitter<string>();
	@Input() PayoutMonth: any;
	@Input() isMobile: any;
	@Input() clientCode: any;
	// @Input() clientID;
	order: string = 'clientName';
	reverse: boolean = false;
	bodyObj: any;
	payDetailsMfList: any[] = [];
	public dataLoad: boolean = false;
	requestCode: any;
	reqBodyParams: any;
	reqType: any;
	tableOption: any;
	public enableNext = false;
	public wait = false;
	headerTitle?: string;
	ascending: boolean = true;
	payoutValue: any;
	tokenValue: any;
	PayoutMonthYear:any;
	placeholderText:string = 'Search by Client Code';
	validityMsg:any;
	profileObj:any;
	arnflag:boolean = false;
	loadFile = false;
	displayArnMessage:boolean = false;
	currTime:any;
	arnDate:any;
	constructor(private orderPipe: OrderPipe, private toast:ToasterService, private formatNumDecimal:FormatNumberDecimalPipe, private commonService: CommonService, private payDetService: PayDetailsService, private storage: StorageServiceAAA, private modalController: ModalController, private router: Router, private platform: Platform, private route: ActivatedRoute) { }
	ngOnChanges(changes: SimpleChanges): void {
		let type = localStorage.getItem('isMobile');
		this.isMobile = type ? type : this.isMobile;
		this.enableNext = false;
		this.wait = false;
		this.initMutualFundTab()
	}

	ngOnInit() {
		let type = localStorage.getItem('isMobile');
		this.isMobile = type ? type : this.isMobile;
		if (!this.platform.is('desktop') && this.isMobile) {
			this.initMutualFundTab();
		}
	}

	ArnValidityCond(arncode: any,expdate: any,euin: any ){
		let arnValid = false
		if(arncode.length > 1 && expdate.length > 1 && euin.length > 1){
			arnValid = true
		}
		return arnValid
	}


	initMutualFundTab(){
		this.arnflag = false;
		this.currTime = (moment(new Date(), "M/D/YYYY H:mm").valueOf())
		this.displayArnMessage = false;

		if (!this.platform.is('desktop') && this.isMobile) {
			this.route.params.subscribe(params => {
				if (params && !_.isEmpty(params) ) {
					this.payoutValue = parseInt(params['id']);
				}else {
					// this.payoutValue = this.payoutValue;
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

		
	
		this.storage.get('userType').then(type => {
			if(type == 'FAN' || type == 'SUB BROKER'){
				this.storage.get('pDetails').then(details => {
					// details.ARNCode = "ARN-119416";
					// details.ARNExpDate = "5/16/2022 12:31:52 PM";
					// details.EUIN = 'E183916'
					this.profileObj = details;
					if(this.ArnValidityCond(details.ARNCode,details.ARNExpDate,details.EUIN) == true){
						
					// if(this.profileObj.ARNExpDate !== undefined){
						// console.log(moment(new Date(this.profileObj.ARNExpDate), "DD/MM/YYYY H:mm").valueOf())
						this.arnDate = moment(new Date(this.profileObj.ARNExpDate), "DD/MM/YYYY H:mm").valueOf()
						 if(this.currTime < this.arnDate){
							this.displyPopupText(this.arnDate)
						 }
						 else{
							this.arnflag = true; 
						 }
						
					}
					else{
						
						this.arnflag = true;
						
					}
					
				
				})
			}	
		})

		
	
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
		this.orderPipe.transform(this.payDetailsMfList, 'clientName');
		this.payDetailsMfList = [];
		//this.payDetailsMfList = this.mfTabList;
		this.requestCode = "GetMFPayout";
		this.reqBodyParams = this.bodyObj;
		this.reqType = 'mf';
		this.tableOption = 'mf';
		this.headerTitle = 'Mutual Fund';
		setTimeout(() => {
			this.callPayDetailsList()
		}, 200);

	}

	

	
	
	// sorting function for column
	setOrder(value: string) {
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		this.bodyObj.SortBy = value;
		this.bodyObj.SortOrder = this.reverse ? 'asc' : 'desc';
		this.bodyObj.PageNo = 1;
		this.enableNext = false;
		this.ascending = this.reverse ? true : false;
		this.payDetailsMfList = [];
		this.callPayDetailsList();
	}

	// pass the data of search from header component
	EnterSearchText(searchText: any) {
		if (searchText.length > 2) {
			this.bodyObj.SearchBy = "clientcode";
			this.bodyObj.SearchText = searchText;
			// console.log(this.bodyObj);
			this.bodyObj.PageNo = 1;
			this.enableNext = false;
			this.callPayDetailsList();
			this.payDetailsMfList = [];
		}
		else if (searchText.length == 0) {
			this.bodyObj.SearchBy = "";
			this.bodyObj.SearchText = "";
			this.bodyObj.PageNo = 1;
			this.enableNext = true;
			this.callPayDetailsList();
			this.payDetailsMfList = [];
		}
	}

	// View Pay Details of Summary
	async viewDetailsModel(viewDetailObj: any) {
		const modal = this.modalController.create({
			component: PaydetailModelComponent,
			componentProps: { "TabValue": this.tableOption, "viewDetailList": viewDetailObj },
			cssClass: 'superstars Pay-detail-model'
		});
		return (await modal).present();
	}

	// pass the selected data from dropdown from header component
	dropDownList(value: any) {
		this.enableNext = false;
		this.bodyObj.PayoutMonth = value.event;
		this.passParentDropDown.emit(value.event);
		this.callPayDetailsList();
	}

	async displyPopupText(arnDate: any) {
		let compDays = this.secondsToHms(arnDate - this.currTime)
		// console.log(this.currTime)
		// console.log(arnDate)

		// console.log(compDays);


		if(compDays > 0){
			if((compDays <= 7 )){
				this.validityMsg = 'Your ARN is due for renewal in 7 days. Kindly renew your ARN immediately to continue viewing MF pay details.'
			}
			//30 to 90 days
			else if((compDays <= 30)){
				this.validityMsg = 'Your ARN is due for renewal in 1 month. Kindly renew your ARN before expiry to continue viewing MF pay details.'
			}
			//90 to 180 days
			else if((compDays <= 90)){
				this.validityMsg = 'Your ARN is due for renewal in 3 months. Kindly renew your ARN before expiry to continue viewing MF pay details.'
			}
			//more than 180 days
			else if(compDays <= 180){
				this.validityMsg = 'Your ARN is due for renewal in 6 months. Kindly renew your ARN before expiry to continue viewing MF pay details.'
			}
			// if(compDays < 7){
			// 	this.validityMsg = `Your ARN is due for renewal in ${compDays} day. Kindly renew your ARN before expiry to continue viewing MF pay details.`
			// }
			// if((compDays >= 7 && compDays < 30)){
			// 	this.validityMsg = 'Your ARN is due for renewal in 7 days. Kindly renew your ARN immediately to continue viewing MF pay details.'
			// }
			// //30 to 90 days
			// else if((compDays >= 30 && compDays < 90)){
			// 	this.validityMsg = 'Your ARN is due for renewal in 1 month. Kindly renew your ARN before expiry to continue viewing MF pay details.'
			// }
			// //90 to 180 days
			// else if((compDays >= 90 && compDays < 180)){
			// 	this.validityMsg = 'Your ARN is due for renewal in 3 months. Kindly renew your ARN before expiry to continue viewing MF pay details.'
			// }
			// //more than 180 days
			// else if(compDays == 180){
			// 	this.validityMsg = 'Your ARN is due for renewal in 6 months. Kindly renew your ARN before expiry to continue viewing MF pay details.'
			// }
			
		}
		else{
			this.validityMsg = `Your ARN is going to Expire soon. Kindly renew your ARN before expiry to continue viewing MF pay details.`
		}
		
		// if(this.currTime < arnDate){
			//7 to 30 days
	
			// else{
			// 	this.validityMsg = 'Your ARN validity has expired. Kindly renew the same to view your MF Pay details'
			// }
		// }
		// else{
		// 	this.validityMsg = 'Your ARN validity has expired. Kindly renew the same to view your MF Pay details'
		// }
		if(compDays < 181){
			const modal = await this.modalController.create({
				component: StatusRequestComponent,
				cssClass: 'superstars popup-text mf-popup',
				componentProps: {
					"title": "",
					"msgContent": this.validityMsg,
					"buttonVisibility": false,
				},
				//backdropDismiss:false
			})
			return modal.present();
		}
		
	}

	callPayDetailsList(params?: any) {

		if(this.arnflag == false){
			if (params != '1') {
				this.dataLoad = false;
			}
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.payDetailMfTab(token)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.payDetailMfTab(token)
					})
				}
			})
		}
		else{
			this.displayArnMessage = true;
			this.validityMsg = 'Your ARN validity has expired. Kindly renew the same to view your MF Pay details'
		}
	
	}

	payDetailMfTab(tokenValue: any){
		this.storage.get('userID').then((ID) => {
			this.payDetService.getPayoutDetails(tokenValue, this.requestCode, Object.assign(this.reqBodyParams, {"RMCode": this.clientCode}), this.reqType)
			.subscribe((res: any) => {
				if (res['Body'] == null) {
					this.payDetailsMfList = [];
					this.enableNext = false;
					setTimeout(() => {
						this.dataLoad = true;
					}, 1000);
				}
				else {
					this.commonService.setClevertapEvent('MFPayout_downloaded');
					this.checkTabData(res);
				}

			})
		})
	}

	checkTabData(response: any) {
		if (response['Body']['MFPayoutData'].length > 49) {
			this.enableNext = true;
			this.wait = false;
		}
		else {
			this.enableNext = false;
			this.wait = true;
		}
		response['Body']['MFPayoutData'].forEach((element: any) => {
			this.payDetailsMfList.push({
				ClientCode: element['ClientCode'],
				clientName: element['ClientName'],
				PAN: element['PAN'],
				Total_Brokerage: element['Total_Brokerage'],
				Trail: element['Trail'],
				Upfront: element['Upfront'],
				details: element
			})
		});

		setTimeout(() => {
			this.dataLoad = true;
		}, 1000);
	}

	goBack() {
		window.history.back();
	}

	loadData(event: any) {
		setTimeout(() => {
			event.target.complete();
			if (this.enableNext) {
				this.bodyObj.PageNo += 1;
				// console.log(this.bodyObj);
				// this.getData();
				this.callPayDetailsList('1');
			} else event.target.disabled = true;
		}, 1000);
	}

	goToDescription(data: any) {
		localStorage.setItem('payout_details', JSON.stringify(data));
		this.router.navigate(['/pay-list-details', this.tableOption]);
	}

    goToSearch() {
        this.router.navigate(['add-script']);
    }

	divScroll(event: any) {
		const tableHeight = event.target.offsetHeight;
		const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;
		if (tableScrollTop >= scrollerEndPoint - 100 && this.enableNext && !this.wait) {
			this.wait = true;
			this.bodyObj.PageNo += 1;
			this.bodyObj['SearchText'] = this.bodyObj.SearchText;
			this.bodyObj['SearchBy'] = this.bodyObj.SearchBy;
			// console.log(this.bodyObj);
			this.callPayDetailsList('1');
		}
	}

	// checkARNValidity(arnDate){			empty function. never used
	// 	//this.displayArnMessage = true;
	// 	//let currTime = (moment(new Date(), "M/D/YYYY H:mm").valueOf())
	
	// }

	secondsToHms(d: any) {
		d = Number(d);
		var h = Math.floor(d / 86400000);
		return h; 
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
		this.payDetService.getPayoutDetails(token, this.requestCode, Object.assign(this.reqBodyParams, { "RMCode": this.clientCode }), this.reqType)
			.subscribe((response: any) => {
				if (response['Body'] == null) {
					this.toast.displayToast('No Data Found');
					this.loadFile = false;
				}
				else {
					if (response['Body']['MFPayoutData'] && response['Body']['MFPayoutData'].length > 0) {
						let info: any = [];
						let head = [["Client Code", "Client Name", "PAN", "Total Brokerage", "Trail", "Upfront"]];
						response['Body']['MFPayoutData'].forEach((element: any) => {
							info.push([element.ClientCode, element.ClientName, element.PAN, this.formatNumDecimal.transform(element.Total_Brokerage), this.formatNumDecimal.transform(element.Trail), this.formatNumDecimal.transform(element.Upfront),])
						})

						this.commonService.exportDataToExcel(head[0], info, 'Mutual Fund');
						this.loadFile = false;

					} else {
						this.toast.displayToast('No Data Found');
						this.loadFile = false;
					}
				}

			})
	}
}
