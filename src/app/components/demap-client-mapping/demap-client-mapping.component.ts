import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, Platform } from '@ionic/angular';
import moment from "moment";
import { ToasterService } from '../../helpers/toaster.service';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { LoginService } from '../../pages/login/login.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { DemapListComponent } from '../demap-list/demap-list.component';

@Component({
	selector: 'app-demap-client-mapping',
	providers: [LoginService, DashBoardService],
	templateUrl: './demap-client-mapping.component.html',
	styleUrls: ['./demap-client-mapping.component.scss'],
})
export class DemapClientMappingComponent implements OnInit {
	@ViewChild(IonContent) content: IonContent | undefined;
	dataLoad: boolean = false;
	clientMappingTableDetails: any[] = [];
	public datas: any[] = [];
	public enableNext = false;
	public wait = false;
	pageNo = 1;
	tokenVal: any;
	searchText: any;
	myOptions: any = {
		dateFormat: 'dd/mm/yyyy',
		showSelectorArrow: true,
		showMonthNumber: false,
	}
	endDate: any = moment().format('YYYY-MM-D');
	startDate: any = moment().subtract(6, "days").format('YYYY-MM-D');
	grayBoxVisible: boolean[] = [];
	showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;
	currentDate: any;

	constructor(public toast: ToasterService, private storage: StorageServiceAAA, private wireReqService: WireRequestService, private platform:Platform, private modalController: ModalController,
		private elementRef: ElementRef) { }
	ngOnInit() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenVal = token;
					this.fetchClientMappingData(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenVal = token;
					this.fetchClientMappingData(token);
				})
			}
		})
	}

	fetchClientMappingData(token?: any) {
		let payload:any = {			 
			"MakerID": localStorage.getItem('userId1'),
			"FromDate": this.startDate,
			"Todate": this.endDate,
			"Status": "ALL",
			"ClientCode": this.searchText ? this.searchText : ""
		}
		payload['PageNo'] = this.pageNo;
		this.wireReqService
			.getClientMappingTableData(payload, token ? token : this.tokenVal)
			.subscribe((res: any) => {
				this.wait = false;
				if (res["Head"]["ErrorCode"] == 0) {
					if (res['Body']['objGetClientTTMappingStatusReportResBody'].length === 0) {
						this.enableNext = false;
						this.dataLoad = true;
					}else{
						this.clientMappingTableDetails = res["Body"]["objGetClientTTMappingStatusReportResBody"];
						if (this.pageNo === 1) {
							this.datas = [];
						}
						this.clientMappingTableDetails.forEach((element: any) => {
							this.datas.push({
								CheckerDate: element['CheckerDate'],
								ClientCode: element['ClientCode'],
								DealerID: element['DealerID'],
								ExistingDealerID: element['ExistingDealerID'],
								MakerDate:element['MakerDate'],
								MakerID:element['MakerID'],
								Reason:element['Reason'],
								Status:element['Status']
							})
						});
						// this.grayBoxVisible = new Array(this.clientMappingTableDetails.length).fill(false);					
					}	
					this.dataLoad = true;
					this.enableNext = true;
					if (res['Body']['objGetClientTTMappingStatusReportResBody'].length < 49) {
						this.enableNext = false;
					}
				} else if (res["Head"]["ErrorCode"] == 1) {
					this.wait = false;
					this.enableNext = false;
					// this.clientMappingTableDetails = []
					this.datas = [];
					this.dataLoad = true;
				}
			});
	}

	divScroll(event: any) {
		const tableHeight = event.target.offsetHeight;
		const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;

		if (tableScrollTop >= scrollerEndPoint - 100 && this.enableNext && !this.wait) {
			this.wait = true;
			this.pageNo += 1;
 			this.fetchClientMappingData();
		}
	}

	public loadData(event: any) {
		setTimeout(() => {
			event.target.complete();		 
			if (this.enableNext) {
				this.pageNo += 1;
				this.fetchClientMappingData();				
			} 
			else event.target.disabled = true;
		}, 1000);
	}

	typeSearchText(event: any) {
		if (event != null) {
			this.pageNo = 1;
			this.dataLoad = false;
			this.fetchClientMappingData();
		}
	}

	toggleGrayBoxVisibility(index: number): void {
		this.grayBoxVisible[index] = !this.grayBoxVisible[index];
	}
	updatedStartDate(event: any) {
		this.startDate = event.singleDate.formatted;
		if (this.startDate && this.endDate) {
			this.fetchClientMappingData();
		}
	}

	updatedEndDate(event: any) {
		this.endDate = event.singleDate.formatted;
		if (this.startDate && this.endDate) {
			this.fetchClientMappingData();
		}
	}
	async openPopup(clientCode: any){
		const modal = this.modalController.create({
			component: DemapListComponent,
			componentProps: { cCode:clientCode },
			cssClass: 'demap-client-details'
		});
		return (await modal).present();
	}

	toggleStartDatePicker() {
		this.showStartDatePicker = !this.showStartDatePicker;
		// Optional: Hide end date picker if shown
		this.showEndDatePicker = false;
	}
	
	toggleEndDatePicker() {
	this.showEndDatePicker = !this.showEndDatePicker;
	// Optional: Hide start date picker if shown
	this.showStartDatePicker = false;
	}


	hideDatePicker( type: string, event?:any) {
		// Update selectedDate with the changed value
		const datediv = this.elementRef.nativeElement.querySelector('ion-datetime');
		const isMonthYearDisplayed = datediv.classList.contains('show-month-and-year');
		if (!isMonthYearDisplayed) {
			if (type === 'start') {
				this.showStartDatePicker = false;
				if(event != undefined){
					this.onStartDateChanged();
				}
			} else if (type === 'end') {
				this.showEndDatePicker = false;
				if(event != undefined){
					this.onEndDateChanged1();
				}
			} 
		} 

	}

	onStartDateChanged() {
		// this.startDate = new Date(this.ionStartDate);
		if (this.startDate && this.endDate) {
			if(new Date(this.startDate) > new Date(this.endDate)){
				this.toast.displayToast("Start Date cannot be greater than End Date");
				return;
			}
			this.dataLoad = false;
			this.fetchClientMappingData();
		}
	}
	// new code end date
	onEndDateChanged1() {
		// this.endDate = new Date(this.ionEndDate);
		if (this.startDate && this.endDate) {
			if(new Date(this.startDate) > new Date(this.endDate)){
				this.toast.displayToast("Start Date cannot be greater than End Date");
				return;
			}
			this.dataLoad = false;
			this.fetchClientMappingData();
		}
	}

	dismiss() {
		this.modalController.dismiss();
	}
	goBack() {
		window.history.back();
	}
}