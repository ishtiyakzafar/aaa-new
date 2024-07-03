import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountActivationModelComponent } from '../account-activation-model/account-activation-model.component';
import { ModalController } from '@ionic/angular';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { RaiseQueryService } from '../../pages/raise-query/raise-query.service';
import { LoginService } from '../../pages/login/login.service';
import moment from 'moment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import dayjs from 'dayjs/esm';
import * as _ from 'lodash';
import { BehaviorSubject, NEVER, ReplaySubject, Subscription, catchError, concatMap, switchMap, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-help-partner-query',
  providers:[RaiseQueryService,LoginService,NgxDaterangepickerMd],
  templateUrl: './help-partner-query.component.html',
  styleUrls: ['./help-partner-query.component.scss'],
})
export class HelpPartnerQueryComponent implements OnInit {
  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective!: DaterangepickerDirective;
  private searchTicketObj: any = {};
  public tableLoader: boolean = false;
  public moment: any = moment;
  public segmentValue: string = 'Self';
  public totalQueriesCount: any = 0;
  public sendDeptCount: any = 0;
  public respondedCount: any = 0;
  public resolvedCount: any = 0;
  public isAll = true;
  public isOpen = false;
  public isClose = false;
  public isWip = false;
  lastFiveEntries: boolean = false;
  currentMonth: any;
  datefield: boolean = false;
  today = new Date();
  dateObj: any = {};
  modalObj: any;
  public selectedDate: any = {start: moment().startOf('month'), end: moment().endOf('month')};
  NgxDaterangepickerMd! : NgxDaterangepickerMd;
  maxDate =  dayjs();
  minDate = dayjs('1973-01-01');
  ranges: any = {
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Previous Month': [
          moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')
        ]
  }
  cancelBtn:boolean = true;
  selectedRangeText: string;
  filterObj = {
    fromDate: '',
    toDate: ''
  };
  start:any;
  end:any;
  public reverse: boolean = true;
  public order: string = 'Created_Date';
  public ascending: boolean = true;
  public searchTableData: any = [];
  public duplicateSearchData: any = [];
  myOptions: any = {
		dateFormat: 'dd/mm/yyyy',
		showMonthNumber: false,
		dayLabels: {su: 'S', mo: 'M', tu: 'T', we: 'W', th: 'T', fr: 'F', sa: 'S'},
		firstDayOfWeek: "mo",
		alignSelectorRight:true,
		stylesData: {
			styles: `
			@media screen and (min-width: 768px) {
			  .myDpSelectorAbsolute {
				top: 12px !important;
				left:-200px;
				height:140px;
			
			  } 
			  .myDpWeekDayTitle, .myDpMonthYearText{
				font-weight:700;
			}  
		}	

		@media screen and (max-width: 500px) {
			.myDpSelectorAbsolute {
				left: 0 !important;
			}
			
		}
			`
		}
		
		// disableSince: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()},

	}
//   public searchTableData: any = [{
//     "Created_Date": "2022-10-19T12:34:03+05:30",
//     "Subject": "Testing2",
//     "Status": "FTR",
//     "TicketID": "2008522023",
//     "Resolution": "done",
//     "Closed_Date": "2022-10-20T12:00:00+05:30",
//     "User_Query": "This is for testing purpose...Please ignore it.",
//     "Partner_Code": "P123P001",
//     "ExpectedTAT": "The ticket will closed tomorrow, talked to user",
//     "ExpectedDueDate": "2022-10-21T13:00:00+05:30",
//     "BeyondTAT": true,
//     "WithinTAT": true,
//     "AppSupportDue_Date": "2022-10-19T12:00:00+05:30",
//     "WithinDueDate": true,
//     "BeyondDueDate": "true",
//     "client": "True",
//     // "ClientCode": "Test12",
//     "ClientName": "John Butt (Sample)",
//     "File_Uploaded": {
//         "keys": []
//     }
// },
// {
//   "Created_Date": "2022-11-11T12:34:03+05:30",
//   "Subject": "Testing3",
//   "Status": "Fresh Ticket",
//   "TicketID": "2008522065",
//   "Resolution": "done",
//   "Closed_Date": "2022-10-20T12:00:00+05:30",
//   "User_Query": "This is for testing purpose...Please ignore it.",
//   "Partner_Code": "P123P002",
//   "ExpectedTAT": "The ticket will closed tomorrow, talked to user",
//   "ExpectedDueDate": "2022-10-21T13:00:00+05:30",
//   "BeyondTAT": true,
//   "WithinTAT": true,
//   "AppSupportDue_Date": "2022-10-19T12:00:00+05:30",
//   "WithinDueDate": true,
//   "BeyondDueDate": "true",
//   "client": "True",
//   // "ClientCode": "Test55",
//   "ClientName": "johny bro (Sample)",
//   "File_Uploaded": {
//       "keys": []
//   }
// },
// {
//   "Created_Date": "2022-12-01T12:34:03+05:30",
//   "Subject": "Testing7",
//   "Status": "Send To Department",
//   "TicketID": "2008522099",
//   "Resolution": "done",
//   "Closed_Date": "2022-10-20T12:00:00+05:30",
//   "User_Query": "This is for testing purpose...Please ignore it.",
//   "Partner_Code": "P123P003",
//   "ExpectedTAT": "The ticket will closed tomorrow, talked to user",
//   "ExpectedDueDate": "2022-10-21T13:00:00+05:30",
//   "BeyondTAT": true,
//   "WithinTAT": true,
//   "AppSupportDue_Date": "2022-10-19T12:00:00+05:30",
//   "WithinDueDate": true,
//   "BeyondDueDate": "true",
//   "client": "True",
//   "ClientCode": "Test99",
//   "ClientName": "rohit",
//   "File_Uploaded": {
//       "keys": []
//   }
// },
// {
//   "Created_Date": "2022-11-11T12:34:03+05:30",
//   "Subject": "Testing8",
//   "Status": "Fresh Ticket",
//   "TicketID": "2008522065",
//   "Resolution": "done",
//   "Closed_Date": "2022-10-20T12:00:00+05:30",
//   "User_Query": "This is for testing purpose...Please ignore it.",
//   "Partner_Code": "P123P008",
//   "ExpectedTAT": "The ticket will closed tomorrow, talked to user",
//   "ExpectedDueDate": "2022-10-21T13:00:00+05:30",
//   "BeyondTAT": true,
//   "WithinTAT": true,
//   "AppSupportDue_Date": "2022-10-19T12:00:00+05:30",
//   "WithinDueDate": true,
//   "BeyondDueDate": "true",
//   "client": "True",
//   // "ClientCode": "Test55",
//   "ClientName": " Pra devs(Sample)",
//   "File_Uploaded": {
//       "keys": []
//   }
// }];
  public token: any;
  searchValue:any;
  crmToken: any;
  isRM = false;
  helpToken:any= Subscription;
  timerCtrl = new BehaviorSubject<number>(0);
	closeTimer = new ReplaySubject<any>(1);
  constructor(private storage: StorageServiceAAA,private modalController: ModalController,private serviceFile: RaiseQueryService,public toast: ToasterService,private loginServ:LoginService) { 
    this.selectedRangeText = 'RecentQueries';
  }

  ngOnInit() {
     //this.storage.get('JwtToken').then(token => {
      // if (localStorage.getItem('crmToken')) {
      //   this.token = localStorage.getItem('crmToken');
      //   this.crmToken = localStorage.getItem('crmToken');
      // } else {
      //   this.loginServ.getCrmToken().subscribe((res:any) => {
      //     localStorage.setItem('crmToken', res['Body']['Token']);
      //     this.token = localStorage.getItem('crmToken');
      //     this.crmToken = localStorage.getItem('crmToken');
      //   });
      // }
      
    //});
    // console.log(moment().format());
    this.selectedDate = null;
    this.segmentValue = localStorage.getItem('helpType') ? localStorage.getItem('helpType') || '' : 'Self';
   
    this.storage.get('userType').then(type => {
			this.isRM = type == 'RM' ? true : false;
 		});

     this.createHelpToken();
  }


  createHelpToken() {
		this.helpToken = this.timerCtrl
			.asObservable()
			.pipe(
				switchMap((time: number) =>
					timer(time, 1800000).pipe(
						concatMap(() =>
							this.loginServ.getCrmToken()
						),
						catchError(() => {
							this.timerCtrl.next(1800000);
							return NEVER;
						})
					)
				),
				takeUntil(this.closeTimer)
			)
			.subscribe({
				next: (data: any) => {
					if (data && data['Body'] && data['Body']['Token']) {
						localStorage.setItem('crmToken', data['Body']['Token']);
            this.token = localStorage.getItem('crmToken');
            this.crmToken = localStorage.getItem('crmToken');
					}
				}
			});
	}

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
		this.dateObj = {
			"FromDate": dateRangeStart.value.split("/").reverse().join("-"),
			"ToDate": dateRangeEnd.value.split("/").reverse().join("-")
		}
			this.searchCrmTicket();
		this.currentMonth = moment(new Date()).format('MMMM YYYY');
	}

  dateCalculation(d1: any, d2: any){

    if(d1 == null || d2 == null){
      return;
    }
    var m1 = moment(d1, 'DD-MM-YYYY HH:mm');
    var m2 = moment(d2, 'DD-MM-YYYY HH:mm');
    var m3 = m2.diff(m1,'minutes');
    var m4 = m2.diff(m1,'h');
    var numdays = Math.abs(moment(d1).diff(moment(d2), 'days'));
    var numhours = Math.abs(Math.floor((m3 % 1440) / 60));
    var numminutes = Math.abs(Math.floor((m3 % 1440) % 60));
    return numdays + " day(s) " + (23 - numhours) +"h " + (60 - numminutes) +"m";
  }

  ionViewWillEnter(){
		this.dateObj = {
			"FromDate": "",
			"ToDate": ""
		}
		this.currentMonth = moment(new Date()).format('MMMM YYYY');
		// this.searchCrmTicket();
	}

  goBack() {
		window.history.back();
	}

  onStartDateChanged(event: any, fieldName: any) {
		console.log(event)
		// this.disableToDate = false;
		// this.startDate = event.singleDate.epoc;
		// this.passStartDate = event.singleDate.jsDate

		// if (this.endDate !== null) {
		// 	if (this.startDate > this.endDate.singleDate.epoc) {
		// 		console.log('Start Date Cannot be greater than End Date')
		// 	}
		// }
	}

  getStatus(dataObj: any) {
    this.sendDeptCount = 0;
    this.respondedCount = 0;
    this.resolvedCount = 0;
    for (let i = 0; i < dataObj.length; i++) {
      if (dataObj[i].Status == 'Send To Department') {
        this.sendDeptCount += 1;
      }
      else if (dataObj[i].Status == 'Resolved') {
        this.resolvedCount += 1;
      }
      else if (dataObj[i].Status == 'Responded') {
        this.respondedCount += 1;
      }
      dataObj[i].StatusLabel = dataObj[i].Status;
    };
  }

  setOrder(value: string) {
		this.reverse = !this.reverse;
		this.order = value;
		if (this.reverse) {
			this.ascending = true;
		} else {
			this.ascending = false;
		} 
	}

  mapSegmentChanged(event: any){
    this.totalQueriesCount = 0;
    this.segmentValue = event;
    if(event == "Client"){
      this.searchTableData = this.duplicateSearchData.filter((e: any) => e.client == true || e.client == 'true' || e.client == 'True' || e.client == 'TRUE');
      this.totalQueriesCount = this.searchTableData.length;
      this.getStatus(this.searchTableData);
    }
    else if (event == "Partner") {
      this.searchTableData = this.duplicateSearchData.filter((e: any) => e.Partner_Code);
      this.totalQueriesCount = this.searchTableData.length;
      this.getStatus(this.searchTableData);
    }
    else{
      this.searchTableData = this.duplicateSearchData.filter(((e: any) => e.client == false || e.client == 'false' || e.client == 'False' || e.client == 'FALSE' || e.client == null || e.client == 'null'));
      this.totalQueriesCount = this.searchTableData.length;
      this.getStatus(this.searchTableData);
    }
  }

  searchCrmTicket() {
    this.tableLoader = true;
    let userId = localStorage.getItem('userId1');
    let userType = localStorage.getItem('userType');
    let Token = localStorage.getItem('crmToken');
    let ObjectName = "Ticket";
    let SearchParameters = {
      "IsRMCode": userType == "RM" ? userId : null,
      "IsPartnerCode": userType != "RM" ? userId : null,
      "FromDate": this.filterObj.fromDate,
      "ToDate": this.filterObj.toDate
    }

    this.searchTicketObj.Token = Token;
    this.searchTicketObj.ObjectName = ObjectName;
    this.searchTicketObj.SearchParameters = SearchParameters;

    // this.searchTableData = this.searchTableData.filter((e: any) => e.ClientCode);

    this.serviceFile.searchTicket(this.token, this.searchTicketObj).subscribe((res) => {
      this.duplicateSearchData = [];
      this.searchTableData = [];
      if (res && res.Body && res.Body.data) {
        if (this.lastFiveEntries) {
        const lastFiveEntries = res.Body.data;
        this.searchTableData = lastFiveEntries.slice(0, 5);
        this.duplicateSearchData = lastFiveEntries.slice(0, 5);

        }else{
          this.searchTableData = res.Body.data;
          this.duplicateSearchData = this.searchTableData;
        }
        this.getStatus(this.searchTableData);
        this.mapSegmentChanged(this.segmentValue);
      }
      this.tableLoader = false;
    },
      err => {
        this.tableLoader = false;
        this.toast.displayToast(err.error.Message);
      });
  }

  allQueriesClick(){
    this.isAll = true;
    this.isOpen = false;
    this.isClose = false;
    this.isWip = false;
    if(this.segmentValue == "Client"){
      this.searchTableData = this.duplicateSearchData.filter((e: any) => e.client == true || e.client == 'true' || e.client == 'True' || e.client == 'TRUE');
    }
    else{
      this.searchTableData = this.duplicateSearchData.filter(((e: any) => e.client == false || e.client == 'false' || e.client == 'False' || e.client == 'FALSE' || e.client == null || e.client == 'null'));
    }
  }

  sendToDeptClick(){
    this.isOpen = true;
    this.isAll = false;
    this.isClose = false;
    this.isWip = false;
    if(this.segmentValue == "Client"){
      this.searchTableData = this.duplicateSearchData.filter((e: any) => e.client == true || e.client == 'true' || e.client == 'True' || e.client == 'TRUE');
    }
    else{
      this.searchTableData = this.duplicateSearchData.filter(((e: any) => e.client == false || e.client == 'false' || e.client == 'False' || e.client == 'FALSE' || e.client == null || e.client == 'null'));
    }
    this.searchTableData = this.searchTableData.filter((elem: any) => elem.StatusLabel == 'Send To Department');
  }

  respondedClick(){
    this.isClose = true;
    this.isAll = false;
    this.isOpen = false;
    this.isWip = false;
    if(this.segmentValue == "Client"){
      this.searchTableData = this.duplicateSearchData.filter((e: any) => e.client == true || e.client == 'true' || e.client == 'True' || e.client == 'TRUE');
    }
    else{
      this.searchTableData = this.duplicateSearchData.filter(((e: any) => e.client == false || e.client == 'false' || e.client == 'False' || e.client == 'FALSE' || e.client == null || e.client == 'null'));
    }
    this.searchTableData = this.searchTableData.filter((elem: any) => elem.StatusLabel == 'Responded');
  }

  resolvedClick(){
    this.isWip = true;
    this.isAll = false;
    this.isClose = false;
    this.isOpen = false;
    if(this.segmentValue == "Client"){
      this.searchTableData = this.duplicateSearchData.filter((e: any) => e.client == true || e.client == 'true' || e.client == 'True' || e.client == 'TRUE');
    }
    else{
      this.searchTableData = this.duplicateSearchData.filter(((e: any) => e.client == false || e.client == 'false' || e.client == 'False' || e.client == 'FALSE' || e.client == null || e.client == 'null'));
    }
    this.searchTableData = this.searchTableData.filter((elem: any) => elem.StatusLabel == 'Resolved');
  }

  openPopup(dataObj: any){
    dataObj['token'] = localStorage.getItem('crmToken');
    if (dataObj && dataObj.AAAHistory) {
      let splitData = dataObj.AAAHistory.split('\"');
      let msgList = splitData.filter(function (e:any) {
        return e != null && e != '' && e != '[' && e != ']' && e != ',';
      });
      // let msgList = dataObj.AAAHistory.replace(/[\[\]"]+/g, '')?.split("\"");
      let mapArray:any = [];
      if (msgList && msgList.length > 0) {
        msgList.forEach((ele:any) => {
          if (ele.split("-CRM Admin-")[1]) {
            mapArray.push({ 'msg': ele.split("-CRM Admin-")[1]?.trim().replace("\"", "").replace(/(\r\n|\n|\r|\r\\n|\\n|\r)/gm, ""), 'dt': ele.split("-CRM Admin-")[0]?.trim().replace("\"", ""), 'type': 'You' })
          } else {
            let isValidDate = moment(ele.trim().replace("\"", "")?.slice(0, 25), [moment.ISO_8601, "YYYY/MM/DD  :)  HH*mm*ss"], true).isValid();
            if (ele.length > 26 && isValidDate) {
              mapArray.push({ 'msg': ele.split('-')[4], 'dt': isValidDate ? ele.trim()?.replace("\"", "")?.slice(0, 25) : undefined, 'type': 'Response' })
              // mapArray.push({ 'msg': ele.slice(ele.indexOf('\"') + 1, ele.lastIndexOf('\"')).split('-')[4], 'dt': isValidDate ? ele.trim()?.replace("\"", "")?.slice(0, 25) : undefined, 'type': 'Response' })
            } else {
              mapArray.push({ 'msg': ele.trim()?.replace("\"", "")?.replace(/(\r\n|\n|\r|\r\\n|\\n|\r)/gm, ""), 'dt': isValidDate ? ele.trim().replace("\"", "")?.slice(0, 25) : undefined, 'type': 'Response' })
            }
          }
        });
        dataObj['messageList'] = _.sortBy(mapArray, ['dt']);
      }
    }
    dataObj['attach'] = dataObj['File_Uploaded']['keys'].concat(dataObj['Document_Upload_2']['keys']);
    this.displayActivationModel(dataObj);
  }

  async displayActivationModel(dataObj: any){
    this.modalObj = await this.modalController.create({
			component: AccountActivationModelComponent,
			componentProps: { dataObj: dataObj },
			cssClass: 'account_activation backdrop-bg',
      backdropDismiss: true
		});
    this.modalObj.onDidDismiss()
    .then((data: any) => {
      this.searchCrmTicket();
    });
    return (await this.modalObj).present();
  }

  openDatepicker() {
    this.pickerDirective.open();
  }

  datesUpdated(event: any){
    //console.log("Selected Date Range:",  this.selectedRangeText);
    if(event.startDate == null || event.endDate == null){
      //this.filterObj.fromDate = '' + moment().startOf('month').format();
      this.filterObj.fromDate = '' + moment().subtract(29, 'days').format();
      this.filterObj.fromDate = this.filterObj.fromDate.replace('+', "%2b");
      this.filterObj.toDate = '' + moment(new Date()).format();
      this.filterObj.toDate = this.filterObj.toDate.replace('+', "%2b");
      this.lastFiveEntries = true;
    }
    if(event && event.startDate && event.endDate){
      // this.filterObj.fromDate = moment(event.startDate).format('YYYY-MM-DD');
      // this.filterObj.toDate = moment(event.endDate).format('YYYY-MM-DD');
      this.filterObj.fromDate = moment(event.startDate.$d).format();
      this.filterObj.fromDate = this.filterObj.fromDate.replace('+', "%2b");
      this.filterObj.toDate = moment(event.endDate.$d).format();
      this.filterObj.toDate = this.filterObj.toDate.replace('+', "%2b");
      this.lastFiveEntries = false;
    }
    this.searchCrmTicket();
  }

  ngOnDestroy() {
		this.helpToken.unsubscribe();
	}

}