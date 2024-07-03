import { Component, Input, OnInit, OnChanges, ElementRef,SimpleChanges } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { FormatUnitNumberPipe } from '../../helpers/formatnumberunit.pipe';
import moment from "moment";
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-client-ledger',
	providers: [ClientTradesService, FormatUnitNumberPipe, ToasterService],
	templateUrl: './client-ledger.component.html',
	styleUrls: ['./client-ledger.component.scss'],
})
export class ClientLedgerComponent implements OnInit, OnChanges {
    public monthWeekTabValue: any = 'month';
    public dataLoad: boolean = false;
	@Input() ledgerData: any;
    @Input() ladgerId: any;
    @Input() isResponseReady: any;
    @Input() isResponseReadyWeb: any;
	@Input()newLedgerData: any;
	datePicker: any; 
	showDatePicker: boolean = false;
	date:any;
	showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;
   
    ledgerDetailsRecords: any[] = [];
    public startDate: any;
    public endDate: any;
	openingBalance: any;
	totalBalance: any;
	unClearedBalance: any;
	clearedBalance: any;
	weekDateList: any;
	LedgerTabDetails: any = [];
	public datas: any[] = [
		{}, {}, {}
	]
	currentDay:any;
	tokenValue:any;
	disableToDte: boolean = true;
	passStartDate:any;
	passEndDate:any;
	updatedOpeningBalance:any;
	myOptions: any = {
		dateFormat: 'dd/mm/yyyy',
		showMonthNumber: false
	
		// disableSince: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()},

	}
	clientIdValue = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || '{}')['ClientCode'] : "{}";
	currentDate: any;
	constructor(private elementRef: ElementRef,private toast:ToasterService, private commonservice: CommonService, private storage: StorageServiceAAA, private clientService: ClientTradesService,  private formatNumber: FormatUnitNumberPipe) { }
	ngOnChanges() {
		
		this.commonservice.setClevertapEvent('Client&Trades_Equity_Ledger');
		this.displayLedgerdata(this.newLedgerData);
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		// console.log(tomorrow.getDate());
		this.myOptions['disableSince'] = { year: moment(tomorrow).format('YYYY'), month: moment(tomorrow).format('MM'), day: moment(tomorrow).format('DD') }
		this.currentDay = new Date().getFullYear()+"-"+this.min2Digits(new Date().getMonth()+1)+'-'+this.min2Digits(new Date().getDate())
	}
    
    rangeSelected(event: any) {
		// console.log(event);
	}
	
	min2Digits(day: any){
		return (day < 10 ? '0' : '') + day;
	}
    
    // date selection
    // loadResult() {
	// 	//this.currentDay = "31 10 2021";
	// 	//this.currentDay = new Date().getFullYear()+"-"+this.min2Digits(new Date().getMonth()+1)+'-'+this.min2Digits(new Date().getDate())
    //     // console.log(typeof(this.startDate), this.startDate, this.endDate);
    //     if (this.startDate && this.endDate) {
    //         let sliceStartDate = this.startDate.slice(0, 10);
    //         let sliceEndDate = this.endDate.slice(0, 10);
    //         sliceStartDate = sliceStartDate.replaceAll('-', '');
    //         sliceEndDate = sliceEndDate.replaceAll('-', '');
    //         if (sliceStartDate > sliceEndDate) {
    //             this.toast.displayToast('Start date can not be greater than end date');
    //             // this.startDate = null;
    //             this.endDate = null;
    //             // console.log(this.startDate);
    //         } else {
    //             // console.log('call function now');
    //             this.clientLedger(this.ladgerId,sliceStartDate,sliceEndDate);
    //         }
    //     }
	// }
	
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
		// console.log(event.singleDate.jsDate)
		this.disableToDte = false;
		this.startDate = event.detail.value;
		this.passStartDate = moment(new Date(event.detail.value)).format("YYYYMMDD");

		if (this.endDate !== null) {
			if (this.startDate > this.endDate) {
				this.toast.displayToast('Start Date Cannot be greater than End Date')
			}
		}
	}

	onEndDateChanged1(event: any) {
		this.endDate = event.detail.value;
		this.passEndDate = moment(new Date(event.detail.value)).format("YYYYMMDD");
		if (this.startDate > this.endDate) {
			this.toast.displayToast('Start Date Cannot be greater than End Date');
		}
		else {
			this.clientService.getclientLedger1(this.tokenValue,this.clientIdValue,this.passStartDate,this.passEndDate)
			.subscribe(res=>{
				this.displayLedgerdata(res);
			});
		}
		
	}

    // Week, month duration change
    durationChange() {
        this.startDate = null;
        this.endDate = null;
    }

	// Rendering of list of data
	displayLedgerdata(ledgerData: any) {
        this.dataLoad = false;
		if(ledgerData!=null && ledgerData!=undefined){
			if(ledgerData && ledgerData['body'] && ledgerData['body']['OpeningBalance']){
				this.openingBalance = ledgerData['body']['OpeningBalance'].split(' ')[0];
				this.totalBalance = ledgerData['body']['TotalBalance'].split(' ')[0];
			}
	
			if (ledgerData && ledgerData['body'] && ledgerData['body']['Records'] && ledgerData['body']['Records'].length > 0) {
				this.unClearedBalance = ledgerData['body']['UnClearedBalance'].split(' ')[0];
				this.clearedBalance = Number(ledgerData['body']['OpeningBalance'].split(' ')[0]) - Number(ledgerData['body']['UnClearedBalance'].split(' ')[0]);
				this.ledgerDetailsRecords = ledgerData['body']['Records'];
				this.ledgerDetailsRecords = this.ledgerDetailsRecords.sort((a, b) => (a.Transaction_date.slice(6, 19) > b.Transaction_date.slice(6, 19)) ? -1 : 1);
			}
			else {
				this.ledgerDetailsRecords = [];
				this.unClearedBalance = "0";
				this.clearedBalance = 0;
			}
			
		}
		else{
			this.openingBalance = "0";
			this.totalBalance = "0";
			this.clearedBalance=0;
			this.unClearedBalance = "0";
		}
		
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('sToken').then(token => {
					this.tokenValue = token;
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					// console.log(this.tokenValue);
				})
			}
		})
        
        if (this.isResponseReady || this.isResponseReadyWeb) {
            setTimeout(() => {
                this.dataLoad = true;
            }, 500);
        } 
	}

	ngOnInit() {
		this.currentDate = moment(new Date()).format("YYYY-MM-DD");
		this.clientService.getclientLedger1(this.tokenValue,this.clientIdValue,moment(this.DateDisplay('previous')).format('YYYYMMDD'),
			        moment(this.DateDisplay('current')).format('YYYYMMDD')).subscribe(res=>{
						this.displayLedgerdata(res);
		});
		// this.Last7Days();
	}
	Last7Days(day: any) {
		var result:any = [];
		for (var i = 0; i < 8; i++) {
			var d:any = new Date();
			d.setDate(d.getDate() - i);
			result.push(this.commonservice.formatDate(d));
		}
		if (day == 'first') {
			return result[0]
		}
		else if (day == 'last') {
			return result[7]
		}
		return result
		// this.weekDateList = result;

	}
	segmentTab(duration: any) {
		if (duration == "week") {
			this.clientLedger(this.clientIdValue, this.Last7Days("last"), this.Last7Days("first"))
		}
		else if (duration == "month") {
			this.clientLedger(this.clientIdValue, this.DateDisplay('previous'), this.DateDisplay('current'))
		}
	}
	// function call when segment change to month and week
	clientLedger(clientID: any, fromDate: any, toDate: any) {
	
		// console.log(this.tokenValue);
        this.dataLoad = false;
			this.clientService.getclientLedger1(this.tokenValue, clientID, fromDate, toDate)
			.subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.LedgerTabDetails = res;
                    this.displayLedgerdata(this.LedgerTabDetails);
                    setTimeout(() => {
                        this.dataLoad = true;
                    }, 500);
				}
			})
	}
	
	splitAmountValue(transData: any){
		var transNum: any;
		var transUnit: any;
		transNum = transData.split(' ')[0];
		transUnit = transData.split(' ')[1];
		// return transNum + ' '+transUnit
		return transNum;
	}

	splitBalance(balance: any){
		var balanceNum: any;
		var balanceUnit: any;
		balanceNum = this.formatNumber.transform(balance.split(' ')[0]);
		balanceUnit = balance.split(' ')[1];
		// return balanceNum + ' '+balanceUnit
		return balanceNum;
	}
	// last one month dates
	DateDisplay(monthValue: any) {
		var d = new Date();
		if (monthValue == "previous") {
			d.setDate(d.getDate() - 30);
			return this.commonservice.formatDate(d)
		}
		else if(monthValue == "current"){
			d.setDate(d.getDate() );
			return this.commonservice.formatDate(d)
		}
		return;
	}
}
