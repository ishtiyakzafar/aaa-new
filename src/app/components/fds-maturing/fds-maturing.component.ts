import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { CalendarComponentOptions, CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
@Component({
	selector: 'app-fds-maturing',
	templateUrl: './fds-maturing.component.html',
	styleUrls: ['./fds-maturing.component.scss'],
})
export class FdsMaturingComponent implements OnInit {
	public monthWeekTabValue = 'lastMonth';
	@ViewChild('dognutChart') dognutChart: any;

	public monthWeekObj: any = null;
	public startDate: any = null;
    public endDate: any = null;
    public placeholderInput: string = 'Type Client Code';
	public fdsBlockTabValue: any = 'booked';
	public dognut: any;
	public clientCode: any = null;
    public searchTerm: any = null;
	public fdsBlock: any[] = [
		{ name: 'Booked FDs', value: 'booked', perform: 'MTD Performance', fds: 0, dataValue: 0, page: 'fds-booked' },
		{ name: 'Matured FDs', value: 'matured', perform: 'MTD Performance', fds: 0, dataValue: 0, page: 'fds-matured' },
	]
	passStartDate:any;
	passEndDate:any;
	disableToDte: boolean = true;
	public durationData: any[] = [
		{ name: 'Last 1M', value: 'lastMonth' },
		{ name: 'Last 1Wk', value: 'lastWeek' }
	]
	public clientBlockSegmentValue: string = "clientcode";
	public segmentButtonOption: any[] = [
		{ name: 'Client Code', value: 'clientcode' },
		{ name: 'Name', value: 'clientname' }
	]

	currentDay:any;
	myOptions: any = {
		dateFormat: 'dd mm yyyy',
		showMonthNumber: false,
		stylesData: {
			styles: `
			@media screen and (min-width: 768px) {
			  .myDpSelectorAbsolute {
				top: 0 !important;
				left:-120px !important;
			  }
			  .myDpSelectorAbsolute:after, .myDpSelectorArrowLeft:before {
				display:none;
			  }
			}
		   
			   
			`
		}
	}
	datePicker: any; 
	showDatePicker: boolean = false;
	date:any;
	showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;
	currentDateSet: any;

	constructor(private elementRef: ElementRef,private router: Router,
		private commonService: CommonService,
		public modalCtrl: ModalController,
		private toast:ToasterService,
		private storage: StorageServiceAAA) { }

	ngOnInit() {
		// setTimeout(() => {
		// 	const detail = this.commonService.getData();
		// 	console.log(detail);
			
		// 	if (detail['noOfFD']) this.fdsBlock[0]['fds'] = detail['noOfFD'];
		// 	if (detail['fdValue']) this.fdsBlock[0]['dataValue'] = this.commonService.numberFormatWithCommaUnit(detail['fdValue']);

		// 	if (detail['noOfFDMatured']) this.fdsBlock[1]['fds'] = detail['noOfFDMatured'];
		// 	if (detail['maturedFDValue']) this.fdsBlock[1]['dataValue'] = this.commonService.numberFormatWithCommaUnit(detail['maturedFDValue']);

		// }, 1000);
		this.currentDateSet = moment(new Date()).format("YYYY-MM-DD");

		var d = new Date();
		var currentDate = d.setDate(d.getDate());
		var dd = d.setDate(d.getDate() - 30);
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var yyyy = d.getFullYear();
		let mm = months[d.getMonth()];
		let currentMonth = months[new Date().getMonth()];
		if (dd < 10) {
			dd = +('0' + dd);
		}

		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		// console.log(tomorrow.getDate());
		this.myOptions['disableSince'] = { year: moment(tomorrow).format('YYYY'), month: moment(tomorrow).format('MM'), day: moment(tomorrow).format('DD') }
		this.currentDay = new Date().getFullYear()+"-"+this.min2Digits(new Date().getMonth()+1)+'-'+this.min2Digits(new Date().getDate())

		this.monthWeekObj = {
			FromDate: mm + ' ' + new Date(dd).getDate() + ' ' + yyyy,
			ToDate: currentMonth + ' ' + new Date(currentDate).getDate() + ' ' + yyyy,
			filterFor: this.monthWeekTabValue
		}

		this.commonService.eventObservable.subscribe((obj) => {
			if (obj && obj['event'] === 'bookedFDEvent') {
				this.clientCode = obj['data']['clientCode'];
			} else if (obj && obj['event'] === 'bookedCountEvent') {
				if (obj['data']['noOfFD']) this.fdsBlock[0]['fds'] = obj['data']['noOfFD'];
				if (obj['data']['fdValue']) this.fdsBlock[0]['dataValue'] = this.commonService.numberFormatWithCommaUnit(obj['data']['fdValue']);
			} else if (obj && obj['event'] === 'maturedCountEvent') {
				if (obj['data']['noOfFDMatured']) this.fdsBlock[1]['fds'] = obj['data']['noOfFDMatured'];
				if (obj['data']['maturedFDValue']) this.fdsBlock[1]['dataValue'] = this.commonService.numberFormatWithCommaUnit(obj['data']['maturedFDValue']);
			}
		})
		const event: any = {
			detail: {
				value: 'booked',
				clientCode: this.clientCode
			}
		}
		this.commonService.setData(event);
		this.currentDay = new Date().getFullYear()+"-"+this.min2Digits(new Date().getMonth()+1)+'-'+this.min2Digits(new Date().getDate())
	}

	ngOnChanges() {

		
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
	// new code start date
	onStartDateChanged(event: any) {
		// console.log(event.singleDate.jsDate)
		this.disableToDte = false;

		this.startDate = event.detail.value;
		this.passStartDate = moment(event.detail.value, "YYYY/MM/DD").valueOf();

		if (this.endDate !== null) {
			if (this.startDate > this.endDate) {
				console.log('Start Date Cannot be greater than End Date')
			}
		}
	}
	// new code end date
	onEndDateChanged1(event: any) {
		// console.log(this.startDate.singleDate.epoc)
		
		this.endDate = event.detail.value;
		this.passEndDate = moment(event.detail.value, "YYYY/MM/DD").valueOf();
		// console.log(this.endDate);

		if (this.passStartDate > this.passEndDate) {
			this.toast.displayToast('Start Date Cannot be greater than End Date');
		}
		else{
			// console.log(moment(this.passStartDate).format('MMM DD YYYY'))
			// console.log(moment(this.passEndDate).format('MMM DD YYYY'))
			const obj = {
				SearchText: this.searchTerm && this.searchTerm.length > 2 ? this.searchTerm : null,
				SearchBy: (this.searchTerm !== null && this.searchTerm !== '') ? this.clientBlockSegmentValue : null,
				page: 1,
				FromDate: this.passStartDate,
				ToDate: this.passEndDate
			}

			this.monthWeekObj = {
				FromDate: obj['FromDate'],
				ToDate: obj['ToDate'],
				filterFor: null
			}

			 this.commonService.setEvent(this.fdsBlockTabValue+'Range', obj);
		}
		
		
	}

    segmentChange() {
		if (this.clientBlockSegmentValue === 'clientname') {
			this.placeholderInput = 'Type Name';
		} else {
			this.placeholderInput = 'Type Client Code';
		}
	}

	min2Digits(day: any){
		return (day < 10 ? '0' : '') + day;
	}

	// async openCalendar() {
	// 	const options: CalendarModalOptions = {
	// 		pickMode: 'range',
	// 		title: 'RANGE'
	// 	};
	// 	const myCalendar = await this.modalCtrl.create({
	// 		component: CalendarModal,
	// 		componentProps: { options }
	// 	});

	// 	myCalendar.present();
 
	// 	const event: any = await myCalendar.onDidDismiss();
	// 	const date: CalendarResult = event.data;
	// 	console.log(date);
	// }

	goToPage(page: any) {
		if (page) {
			this.router.navigate(['/' + page]);
		} else {
			return;
		}
	}

	// old code start end date
    loadResult() {
        // console.log(typeof(this.startDate), this.startDate, this.endDate);
        if (this.startDate && this.endDate) {
            let sliceStartDate = this.startDate.slice(0, 10);
            let sliceEndDate = this.endDate.slice(0, 10);
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var startDay = sliceStartDate.split('-')[1];
			var endDay = sliceEndDate.split('-')[1];
			const startMonth = months[(startDay < 10 ? startDay.replace('0','') : startDay) - 1];
			const endMonth = months[(endDay < 10 ? endDay.replace('0','') : endDay) - 1];
			// console.log(startMonth, endMonth);
			
            const sliceStartDate2 = sliceStartDate.replaceAll('-', '');
            const sliceEndDate2 = sliceEndDate.replaceAll('-', '');
            if (sliceStartDate2 > sliceEndDate2) {
                this.toast.displayToast('Start date can not be greater than end date');
                // this.startDate = null;
                this.endDate = null;
            } else {
				//this.monthWeekTabValue = null;
				const obj = {
					SearchText: this.searchTerm && this.searchTerm.length > 2 ? this.searchTerm : null,
					SearchBy: (this.searchTerm !== null && this.searchTerm !== '') ? this.clientBlockSegmentValue : null,
					page: 1,
					FromDate: startMonth + ' ' + sliceStartDate.split('-')[2] + ' ' + sliceStartDate.split('-')[0],
					ToDate: endMonth + ' ' + sliceEndDate.split('-')[2] + ' ' + sliceEndDate.split('-')[0]
				}

				this.monthWeekObj = {
					FromDate: obj['FromDate'],
					ToDate: obj['ToDate'],
					filterFor: null
				}

				this.commonService.setEvent(this.fdsBlockTabValue+'Range', obj);
                // console.log('call function now');
                // this.clientLedger(this.ladgerId,sliceStartDate,sliceEndDate);
            }
        }
    }

	searchText() {
		const obj = {
			SearchText: this.searchTerm,
			SearchBy: this.clientBlockSegmentValue,
			page: 1
		}
		this.commonService.setEvent(this.fdsBlockTabValue+'SearchText', obj);
		// if (this.searchTerm.length > 2) {
		// 	return;
		// } else {
		// 	this.commonService.setEvent(this.fdsBlockTabValue+'SearchText', obj);
		// }
	}

	filterData(event: any) {
	
	}

	segmentButtonChange(value: any){
		if (value === 'lastWeek') {
			this.startDate = null;
			this.endDate = null;
			var result:any = [];

			// for (var i = 0; i < 8; i++) {
			// 	var d = new Date();
			// 	d.setDate(d.getDate() - i);
			// 	result.push(this.commonService.formatDate(d));
			// }
			for (var i = 0; i < 8; i++) {
				var d = new Date();
				 d.setDate(d.getDate() - i);
				var dd = d.getDate();
				var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				var yyyy = d.getFullYear();
				let mm = months[d.getMonth()];
				if (dd < 10) {
					dd = +('0' + dd);
				}
				result.push(mm + ' ' + dd + ' ' + yyyy);
			}
			const obj = {
				SearchText: this.searchTerm && this.searchTerm.length > 2 ? this.searchTerm : null,
				SearchBy: (this.searchTerm !== null && this.searchTerm !== '') ? this.clientBlockSegmentValue : null,
				page: 1,
				FromDate: result[7],
				ToDate: result[0]
			}

			this.monthWeekObj = {
				FromDate: obj['FromDate'],
				ToDate: obj['ToDate'],
				filterFor: value
			}
			this.commonService.setEvent(this.fdsBlockTabValue+'LastWeek', obj);
			// return result;
		} else {
			this.startDate = null;
			this.endDate = null;
			var d = new Date();
			var currentDate = d.setDate(d.getDate());
			var dd = d.setDate(d.getDate() - 30);
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var yyyy = d.getFullYear();
			let mm = months[d.getMonth()];
			let currentMonth = months[new Date().getMonth()];
			if (dd < 10) {
				dd = +('0' + dd);
			}
			// console.log(mm, new Date(dd).getDate(), yyyy);
			
			const obj = {
				SearchText: this.searchTerm && this.searchTerm.length > 2 ? this.searchTerm : null,
				SearchBy: (this.searchTerm !== null && this.searchTerm !== '') ? this.clientBlockSegmentValue : null,
				page: 1,
				FromDate: mm + ' ' + new Date(dd).getDate() + ' ' + yyyy,
				ToDate: currentMonth + ' ' + new Date(currentDate).getDate() + ' ' + yyyy
			}
			
			this.monthWeekObj = {
				FromDate: mm + ' ' + new Date(dd).getDate() + ' ' + yyyy,
				ToDate: currentMonth + ' ' + new Date(currentDate).getDate() + ' ' + yyyy,
				filterFor: value
			}
			
			this.commonService.setEvent(this.fdsBlockTabValue+'LastMonth', obj);
			// return this.commonService.formatDate(d);
		}
	}

	public onSegmentChanged(event: any) {
		this.searchTerm = null;
		this.storage.get('empCode').then( code => {
			const obj: any = {
				clientCode: code,
				value: event['detail']['value']
			}
			this.commonService.setData(obj);
		})
	}

}
