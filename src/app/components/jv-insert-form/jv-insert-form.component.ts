import { Component, OnInit, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Platform, ModalController } from '@ionic/angular';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject, Subscription,  } from 'rxjs';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import moment from 'moment';

@Component({
  selector: 'app-jv-insert-form',
  providers: [WireRequestService, ToasterService, DashBoardService],
  templateUrl: './jv-insert-form.component.html',
  styleUrls: ['./jv-insert-form.component.scss'],
})
export class JvInsertFormComponent implements OnInit {
 @Output() passJvFieldInput = new EventEmitter<any>();
 @Output() passClientIdFieled = new EventEmitter<any>();
 @Input() passClientId: any;
 @Input() passClientIdValidation: any;
 clientCodeList:any;
  dataLoad:boolean = true;
  public requestType: string = "Limt Change";
  public requestTypeData: any[] = [
      {requestType: 'Limt Change'},
      {requestType: 'JV Request'},
  ]
  public segment: string = "TT";
  public segmentData: any[] = [
      {segment: 'TT'},
      {segment: 'Non TT'},
  ]
  public marginRequirement: string = "Intraday Margin";
  public marginRequirementData: any[] = [
      {marginRequirement: 'Intraday Margin'},
      {marginRequirement: 'CMS Updated'},
      {marginRequirement: 'Cheque will be collected'},
      {marginRequirement: 'Stock transfer from outside DP'},
      {marginRequirement: 'Family accounts'}
  ]
  currentDate: any;

  public ReasonList: any[] = [
    {reason: 'Brokerage Reversal'},
    {reason: 'Dealing Error / Dispute by branch'},
    {reason: 'Loss reversal due to Accounts '},
    {reason: 'Loss reversal due to Back office'},
    {reason: 'Loss reversal due to Risk'},
    {reason: 'Loss reversal due to Technology'},
    {reason: 'Other'},
    {reason: 'VAS Reversal'}
  ]

  public RemarkList: any[] = [
    {remark: 'Being brokerage rebate given'},
    {remark: 'Being dealing error debited earlier now reversed'},
    {remark: 'Being interest on delayed payment reversed'},
    {remark: 'Being AMC (DP SPL Annual Scheme) including service tax for CDSL Demat Number'},
    {remark: 'Being AMC (DP SPL Annual Scheme) including service tax for NSDL Demat Number'},
    {remark: 'Being CDSL DP Bill reversed'},
    {remark: 'Being debit towards default cost off cheque/cms bounce reversed'},
    {remark: 'Being Intersettlement/ Beneficiary charges reversed'},
    {remark: 'Being NSDL DP Bill reversed'},
    {remark: 'Being Registration charges reversed'},
    {remark: 'Being Regulatory charges for Cash segment reversed'},
    {remark: 'Being Regulatory charges for F & O segment reversed'},
    {remark: 'Document Handling charges reversal'},
    {remark: 'Other Rebate'},
    {remark: 'Being VAS Charges reversed'},
  ]
  currentDay:any;
	last25Year:any;
  jvRequest:any = {
    dateFrom : null,
    dateTo: null,
    jvDate:null
  };
  jvError:any = {
    jvReason:false,
    jvRemark:false,
    jvAmount:false,
    invoiceNum:false,
    narration:false
  }
  disableToDte:boolean = true;
  formError:boolean = false;
  isDropDownVisible:boolean = false;
  clientIdLimitErrMsg = "Client ID is required";
  Loadvalue: boolean = false;
  inputattr: boolean = false;
  isFromDtSelected = false;
  isToDtSelected = false;
  isJvDtSelected = false;
  
  device:any;
  searchEvent = true;
  clearEvent = true;
  myOptions: any = {
    dateFormat:'dd-mm-yyyy',
    showMonthNumber: false,
     openSelectorTopOfInput:true,
    // showSelectorArrow:true,
    stylesData: {
      styles: `
      @media screen and (min-width: 768px) {
        .myDpSelectorAbsolute {
          top: -305px !important;
        }
        .myDpSelectorAbsolute:after{
          bottom: -8%;
          border: solid transparent;
          content: " ";
          height: 0;
          width: 0;
          position: absolute;
          border-color: rgba(250,250,250,0);
          border-bottom-color: rgba(222,222,222,0.4);
          border-width: 10px;
          margin-left: -10px;
        }
        .myDpSelectorAbsolute:after, .myDpSelectorArrowLeft:before {
          left: 24px;
            transform: rotate(
          180deg);
          box-sizing: border-box;
        }
      }
     
         
      `
  }
  }  
  myOptions1: any;
  clientId:any;
  public isListVisible: boolean = false;
	private clientSearchTerms = new Subject<string>();
	allClients: any[] = [];
	dtLoad: boolean = false;
	public clientSearchValue: any = null;
  datePicker: any; 
	showDatePicker: boolean = false;
	date:any;
	showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;
  showJvDatePicker: boolean = false;
  
  constructor(private elementRef: ElementRef,private storage: StorageServiceAAA, private dashBoardService:DashBoardService, private wireReqService: WireRequestService, public toast: ToasterService, private commonService:CommonService, private router: Router, private platform: Platform) { 
    if (this.platform.is('desktop')) {
			this.device = 'desktop';
		}
		if (this.platform.is('mobile')) {
			this.device = 'mobile';
		}
  }

  ngOnInit() {
    this.currentDate = moment(new Date()).format("YYYY-MM-DD");
    this.currentDay = new Date().getFullYear()+"-"+this.min2Digits(new Date().getMonth()+1)+'-'+this.min2Digits(new Date().getDate())
    // console.log(this.currentDay);
			this.last25Year = this.getminDate();	
      // console.log(this.last25Year);
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      this.myOptions['disableSince'] = {year: moment(tomorrow).format('YYYY'), month:moment(tomorrow).format('MM'), day: moment(tomorrow).format('DD')}
      this.myOptions['minYear'] = this.last25Year;

      

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
    //this.clientCodeList = JSON.parse(localStorage.getItem("clientListWireRequest"));
    this.storage.get('setClientCodes').then((clientCodes) => {
			this.clientCodeList = clientCodes;
		})
		if (!this.platform.is('desktop')) {
			this.passClientIdValidation = true;
		}
  }

  closeDropdown(){
    this.searchEvent = false;
    this.clearEvent = false;
  }

  openDropdown(){
    this.searchEvent = true;
    this.clearEvent = true;
  }
  
  
  goBack(){
    //this.router.navigate(['/wire-requests']);
    window.history.back();
  }

	inputClientId(event: any) {
		// console.log(event);
		if ( event === undefined ||  event == null) {
			this.clientIdLimitErrMsg = "Client ID is required";
			this.passClientIdValidation = false;
		} else {
			this.clientIdLimitErrMsg = "";
			this.passClientIdValidation = true;
		}
   }

   toggleStartDatePicker() {
		this.showStartDatePicker = !this.showStartDatePicker;
		// Optional: Hide end date picker if shown
		this.showEndDatePicker = false;
    this.showJvDatePicker = false;
	  }
	
	  toggleEndDatePicker() {
		this.showEndDatePicker = !this.showEndDatePicker;
		// Optional: Hide start date picker if shown
		this.showStartDatePicker = false;
    this.showJvDatePicker = false;
	  }
    
    toggleJvDatePicker() {
      this.showJvDatePicker = !this.showJvDatePicker;
      // Optional: Hide start date picker if shown
      this.showStartDatePicker = false;
      this.showEndDatePicker = false;
      }
    

	  hideDatePicker( type: string, event?:any) {
		 // Update selectedDate with the changed value
		const datediv = this.elementRef.nativeElement.querySelector('ion-datetime');
		const isMonthYearDisplayed = datediv.classList.contains('show-month-and-year');
		  
		  if (!isMonthYearDisplayed) {
			if (type === 'start') {
				this.showStartDatePicker = false;
				if(event != undefined){
          this.isFromDtSelected = true;
					this.onStartDateChanged(event);
				}
			  } else if (type === 'end') {
				this.showEndDatePicker = false;
				if(event != undefined){
          this.isToDtSelected = true;
					this.onEndDateChanged1(event);
				}
			  }
        else if (type === 'jvend') {
          this.showJvDatePicker = false;
          if(event != undefined){
            this.isJvDtSelected = true;
            this.onEndDateChanged1(event);
          }
          }
		  } 
	
	  }

   onStartDateChanged(event: any) {
		// console.log(event.singleDate.jsDate)
		// this.disableToDte = false;
		// this.startDate = event.singleDate.epoc;
		// this.passStartDate = event.singleDate.jsDate

		// if (this.endDate !== null) {
		// 	if (this.startDate > this.endDate.singleDate.epoc) {
		// 		console.log('Start Date Cannot be greater than End Date')
		// 	}
		// }
	}
	// new code end date
	onEndDateChanged1(event: any) {
		// console.log(this.startDate.singleDate.epoc)
		// this.endDate = event.singleDate.epoc;
		// this.passEndDate = event.singleDate.jsDate;
		// // console.log(this.endDate);

		// if (this.startDate.singleDate.epoc > this.endDate) {
		// 	this.toast.displayToast('Start Date Cannot be greater than End Date');
		// }
		// else{
		// 	// console.log(moment(this.passStartDate).format('MMM DD YYYY'))
		// 	// console.log(moment(this.passEndDate).format('MMM DD YYYY'))
		// 	const obj = {
		// 		SearchText: this.searchTerm && this.searchTerm.length > 2 ? this.searchTerm : null,
		// 		SearchBy: (this.searchTerm !== null && this.searchTerm !== '') ? this.clientBlockSegmentValue : null,
		// 		page: 1,
		// 		FromDate: moment(this.passStartDate).format('MMM DD YYYY'),
		// 		ToDate: moment(this.passEndDate).format('MMM DD YYYY')
		// 	}

		// 	this.monthWeekObj = {
		// 		FromDate: obj['FromDate'],
		// 		ToDate: obj['ToDate'],
		// 		filterFor: null
		// 	}

		// 	 this.commonService.setEvent(this.fdsBlockTabValue+'Range', obj);
		// }
		
		
	}


  // input modal changes with validation
  // inputChange(event, validate){
  //   this.formError = false;
  //   this.passJvFieldInput.next({data:this.jvRequest, validate:validate});
  // }

  // changed(event){
  //   this.disableToDte = false;
  // }
  onDateChanged(event: any){
    this.myOptions1 = {
      dateFormat:'dd-mm-yyyy',
      disableUntil: event.singleDate.date,
      disableSince:this.myOptions['disableSince'],
      showMonthNumber: false,
      openSelectorTopOfInput:true,
      stylesData:this.myOptions['stylesData']
    }  

    // console.log(event);
      this.disableToDte = false;
  
  }
  // date from cuurent to 25 years back
  getyears() {
		const now = new Date().getUTCFullYear();
		return Array(now - (now - 25)).fill('').map((v, idx) => now - idx) as Array<number>;
	}

	 min2Digits(day: any){
		return (day < 10 ? '0' : '') + day;
	}
  // date format
	getminDate(){
    // return this.getyears()[24]+'-'+this.min2Digits(new Date().getMonth()+1)+'-'+this.min2Digits(new Date().getDate());
    return this.getyears()[24];
	}
    // allow only number in input
    numberOnly(event: any): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (
        (charCode >= 48 && charCode <= 57) ||  // Numbers
        charCode === 8 ||                       // Backspace
        charCode === 46                        // Decimal point
      ) {
        return true;
      }
    
      return false;  
    }

  submitJvForm(validation: any){
    // if(validation == false){
    //   return;
    // }

    if(this.jvRequest.dateFrom == null){
      this.isFromDtSelected = false;
    }
    else if(this.jvRequest.dateTo == null){
      this.isToDtSelected = false;
    }
    else if(this.jvRequest.jvDate == null){
      this.isJvDtSelected = false;
    }

    if(this.jvRequest.dateFrom == null || this.jvRequest.dateTo == null || this.jvRequest.jvDate == null || this.jvRequest.invoiceNum == null || this.jvRequest.jvAmount == null || this.jvRequest.jvReason == null || this.jvRequest.jvRemark == null || this.jvRequest.narration == null){
      this.dataLoad = true;
      return;
    }
    this.dataLoad = false;

    this.commonService.setClevertapEvent('JV_Insert_Report');
    this.commonService.analyticEvent('JV_Insert_Report', 'Wire Reports');

    this.storage.get('userID').then((userID) => {
    this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.jvReqest(token, userID)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.jvReqest(token, userID)
				})
			}
    })
    
  })

  }

  jvReqest(token: any, userId: any){
    
    let obj = {
      "jvAmount":this.jvRequest.jvAmount,
      "userId":userId,
      "invoiceNum":this.jvRequest.invoiceNum,
      "dateFrom":moment((this.jvRequest.dateFrom)).format('YYYYMMDD'),
      "loginID":this.passClientId,
      "jvRemark":this.jvRequest.jvRemark
    }
    
    // console.log(obj);
    this.wireReqService.jvValidator(token, obj).subscribe((res: any) => {
      if(res['Head']['ErrorCode'] == 0 && res['Body']['ErrorCode'] == 0){
        this.jvInsertSubmit(token,obj,userId)
      }
      else{
        this.dataLoad = true;
        this.toast.displayToast(res['Body']['ErrorDesc']);
      }
      
    })
  }

  jvRequestRedirect(){
		this.router.navigate(['/view-reports'],{ queryParams: {report: 'JVRequest'}});
	}

  jvInsertSubmit(token: any, obj: any, userId: any){
    let JvObj: any = {
      "jvDate": moment((this.jvRequest.jvDate)).format('YYYYMMDD'),
      "jvAmount":this.jvRequest.jvAmount,
      "caseId": this.commonService.getRandomInt(100000, 999999999),
      "userId":userId,
      "dateFrom":moment((this.jvRequest.dateFrom)).format('YYYYMMDD'),
      "loginID":this.passClientId,
      "narration":this.jvRequest.narration,
      "jvReason":this.jvRequest.jvReason,
      "jvRemark":this.jvRequest.jvRemark,
      "toDate":moment((this.jvRequest.dateTo)).format('YYYYMMDD')
    }
    // console.log(JvObj);
    this.wireReqService.jvInsert(token, JvObj).subscribe((res: any) => {
      this.dataLoad = true;
      if(res['Head']['ErrorCode'] == 0 && res['Body']['ErrorCode'] == 0){
        this.toast.displayToast("Jv Request has been Inserted Successfully");

        setTimeout(() => {
          this.jvRequest = {};
          this.passClientIdFieled.emit(this.passClientId)
        }, 400);
      }
      else{
        this.toast.displayToast(res['Body']['ErrorDesc']);
      }
    })

  }


  setClientSearch(res: any) {
		if (res.length) {
			let data:any = [];
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
		this.jvRequest.passClientId = data.ClientCode.split('-')[0].trim();
		this.clientId = data.ClientCode;
		this.clientIdLimitErrMsg = "";
		this.passClientIdValidation = true;
	}
	onCancel(){
		this.clientIdLimitErrMsg = "Client ID is required";
		this.passClientIdValidation = false;
		this.clientSearchValue=null;
		this.clientId = null;
	}


}
