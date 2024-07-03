import { Component, OnInit, ElementRef} from '@angular/core';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import moment from 'moment';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { investObj } from '../../../environments/environment';
import { MutualFundService } from '../mutual-fund/mutual-fund.service';

@Component({
	selector: 'app-acc-statement',
	providers: [MutualFundService, CustomEncryption, ShareReportService],
	templateUrl: './acc-statement.component.html',
	styleUrls: ['./acc-statement.component.scss'],
})
export class AccStatementComponent implements OnInit {

	constructor(private elementRef: ElementRef,private mutualFundSer: MutualFundService, private ciphetText: CustomEncryption, private storage: StorageServiceAAA, private shareReportSer: ShareReportService, public toast: ToasterService, private commonService: CommonService) { }
	timeDuration: any;
	datePicker: any; 
	showDatePicker: boolean = false;
	date:any;
	showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;
	monthWeekTabValue: any = 'month';
	dataLoad!: boolean;
	accStatementList: any[] = [];
	startDate: any;
	endDate: any;
	disableToDte: boolean = true;
	startDateFormat:any;
	endDateFormat:any;
	currentDate: any;
	myOptions: any = {
		dateFormat: 'dd/mm/yyyy',
		showMonthNumber: false,
		stylesData: {
			styles: `
      .myDpSelectorAbsolute {
        top: 3px !important;
		left:50px;
		&:focus{
			-webkit-box-shadow: none;
			-moz-box-shadow: none;
			box-shadow: none !important;
		}
	  }
	  
	  @media screen and (max-width: 500px){
		.myDpSelectorAbsolute {
			top: 25% !important;
		}
	  }
       `
		}
		// disableSince: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()},

	}

	ngOnInit() {
		this.currentDate = moment(new Date()).format("YYYY-MM-DD");
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		// console.log(tomorrow.getDate());
		this.myOptions['disableSince'] = { year: moment(tomorrow).format('YYYY'), month: moment(tomorrow).format('MM'), day: moment(tomorrow).format('DD') }
		this.changeTimeDuration("month")
	}

	


	tokenFn(lastDate: any, firstDate: any){
		this.dataLoad = false;
		this.accStatementList = [];
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.initAccountStat(token, lastDate, firstDate)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.initAccountStat(token, lastDate, firstDate)
				})
			}
		})
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
					this.onStartDateChanged(event);
				}
			  } else if (type === 'end') {
				this.showEndDatePicker = false;
				if(event != undefined){
					this.onEndDateChanged1(event);
				}
			  }
		  } 
	
	  }

	onStartDateChanged(event: any) {
		this.disableToDte = false;
		this.startDate = event.detail.value;
		this.startDateFormat = moment(event.detail.value, "YYYY/MM/DD").valueOf();
		
		if (this.endDate !== undefined) {
			if (this.startDate > this.endDate) {
				console.log('start Date canot be greater than end Date')
			}
		}
	}

	onEndDateChanged1(event: any) {
		this.endDate = event.detail.value;
		this.endDateFormat = moment(event.detail.value, "YYYY/MM/DD").valueOf();

		if (this.startDateFormat > this.endDateFormat) {
			this.toast.displayToast('Start Date Cannot be greater than End Date');
		}
		else {
			this.tokenFn(this.startDateFormat,this.endDateFormat);
		}
		
	}

	initAccountStat(token: any, lastDate: any, firstDate: any) {
		let clientCode = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || '{}')['ClientCode'] : null;
		let objHeader = {
			"VID": investObj['addUser']['vid'],
			"Value": this.ciphetText.aesEncrypt(clientCode)
		}
		this.shareReportSer.getClientPanNo(token, objHeader.Value).subscribe((res: any) => {
			if (res['objHeader']['Status'] == 0) {
				let panNo = res['Data'];
				//let panNo = "3XV6ot5w8K+MUTcAt7aCow==" 
				this.accStatmentData(panNo, lastDate, firstDate)
			}
			else {
				this.accStatementList = [];
				this.dataLoad = true
			}
		})
	}

	accStatmentData(pan: any, lastDate: any, firstDate: any) {
		this.mutualFundSer.getAccState(pan, lastDate, firstDate).subscribe((res: any) => {
			this.dataLoad = true
			if (res['head']['Status'] == 0 && res['Table2'] != null) {
				this.accStatementList = res['Table2'];
			}
			else {
				this.accStatementList = [];
				// console.log(this.accStatementList)
			}
		})
	}

	changeTimeDuration(event: any) {
		// console.log(event);
		if(event == 'week'){
			// let today = moment(new Date(), "M/D/YYYY H:mm").valueOf();
        // console.log("Values of today = " + today);
			let lastDate = (moment(this.commonService.lastWeekISOConverted('last'), "M/D/YYYY H:mm").valueOf())
			let firstDate = (moment(this.commonService.lastWeekISOConverted('first'), "M/D/YYYY H:mm").valueOf())
			this.tokenFn(lastDate, firstDate);
			
		}
		else{
			let lastDate = (moment(this.commonService.lastMonthISOConverted('previous'), "M/D/YYYY H:mm").valueOf())
			let firstDate = (moment(this.commonService.lastMonthISOConverted('current'), "M/D/YYYY H:mm").valueOf())
			this.tokenFn(lastDate,firstDate);
		}
	}

}
