import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginService } from '../login/login.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DashBoardService } from '../dashboard/dashboard.service';
import { NewLoginService } from '../new-login/new-login.service';
import { RaiseQueryService } from './raise-query.service';
import moment from 'moment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { QueryThankyouComponent } from '../../components/query-thankyou/query-thankyou.component';
import { AccountActivationModelComponent } from '../../components/account-activation-model/account-activation-model.component';
import { Router } from '@angular/router';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-raise-query',
  providers: [RaiseQueryService, LoginService, DashBoardService, NewLoginService,NgxDaterangepickerMd],
  templateUrl: './raise-query.component.html',
  styleUrls: ['./raise-query.component.scss'],
})
export class RaiseQueryComponent implements OnInit {

  public isClient = false;
  public clientId: any = null;
  public subjectId: any = null;
  public clientList: any = null;
  searchValue:any;
  clearText = false;
  public noDesc = false;
  public noSubject = false;
  public noDate = false;
  public noClient = false;
  public noClcode = false;
  public noName = false;
  public selfTab = true;
  public clientTab = false;
  public descriptionDetails: any;
  public clientData: any;
  public subjectData: any;
  public dateSubject: any;
  public uploadImg: any;
  public imgArr: any = [];
  public maxImgSize: any = /*10485760*/ 20971520;
  public imgError: any;
  public imgFileName: any;
  public isClicked = false;
  public myFiles:any = [];
  public filename: any = [];
  public attachmentName: any = [];
  private consolidateCrmObj: any = {};
  private searchTicketObj: any = {};
  public ticketId: any;
  public showLoader = false;
  public isDisabled = true;
  public searchTableData: any = [];
  public moment: any = moment;
  public reverse: boolean = true;
  public order: string = 'Created_Date';
  public ascending: boolean = true;
  public tableLoader = false;
  public stringHtml: any = '';
  public token: any;
  public isHelpType = false;
  public helpParameters: any= {};
  public clientCodeList: any = [];
  // public clientCodeList: any = [{
  //   clientLabel: 'abcd',
  //   ClientCode: '1234'
  // }];
  public isSelectTradeShow = false;
  public isHelpSearch = false;
  public isClientLabelClick = false;
  public userTypeValue: any;
  private searchRmhierarchyTerms = new Subject<string>();
  public isPartnerLabelClick = false;
  public isNewDropDownVisible: boolean = false;
  public selectOptionArr: any[] = [];
  selectOptionArrCopy: any[] = [];
  searchHierarchyList: any;
  allPartners: any[] = [];
  typeValue = 'selfType';
  isRM = false;
  public subjectListSelf = [
    {SubjectCode: 'Account Activation'},
    {SubjectCode: 'FAN Cancellation'},
    {SubjectCode: 'Technical issues'},
    {SubjectCode: 'Group Change'},
    {SubjectCode: 'Segment Activation'},
    {SubjectCode: 'Karvy'},
    {SubjectCode: 'POA'},
    {SubjectCode: 'DDPI'},
    {SubjectCode: 'Contact details modification'},
    {SubjectCode: 'Bank Modification'},
    {SubjectCode: 'Lead related'},
    {SubjectCode: 'Others'}
  ];
  subjectListClient!:string;
  private clientSearchTerms = new Subject<string>();
  allClients: any[] = [];
  isGroupChange: any;
  mappedClientCode: any;
  radioBoxValue:any = 'mappedCl';
  selectedCategories:any =[];
  showTicketModal:boolean=false;
  showSubmitLoader:boolean = false;
  isSubmitDisabled:boolean = false;
  isThankYou:boolean = false;
  public isRadioVisible:any = true;
  myOptions: any = {
		dateFormat: 'dd/mm/yyyy',
  	showSelectorArrow: true,
		showMonthNumber: false,
	}
  startDate:any="";
  endDate:any="";
  disableToDte: boolean = true;
	startDateFormat:any;
	endDateFormat:any;
  NgxDaterangepickerMd! : NgxDaterangepickerMd;
  showStartDatePicker: boolean = false;
  currentDate: any;
  public documentPath: string = "../../../assets/TATDoc.html";
  previewShow: boolean = false;
  public clientSearchValue: any = null;
  dtLoad: boolean = false;
  public isDropDownVisible: boolean = false;
  public isSignedDoc = false;
  public signedUpload = false;

  // public subjectListClient = [
  //   {SubjectCode: 'Modification Related'},
  //   {SubjectCode: 'Order related'},
  //   {SubjectCode: 'Funds Payout'},
  //   {SubjectCode: 'Segment Activation'},
  //   {SubjectCode: 'KYC related'},
  //   {SubjectCode: 'Brokerage Charges'},
  //   {SubjectCode: 'Ledger clarification'},
  //   {SubjectCode: 'Funds Payin'},
  //   {SubjectCode: 'Holding Statement'},
  //   {SubjectCode: 'Activation Status'},
  //   {SubjectCode: 'Others'}
  // ];

  constructor(private router: Router,private dashBoardService:DashBoardService,private storage: StorageServiceAAA, 
    private commonService: CommonService, private modalController: ModalController, private serviceFile: RaiseQueryService,
    public loginService: LoginService,public toast: ToasterService, private tokenService: LoginService,
    private newlogin:NewLoginService, private elementRef: ElementRef) { }

  ngOnInit() {
		this.currentDate = moment(new Date()).format("YYYY-MM-DD");
    let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		this.myOptions['disableSince'] = { year: moment(tomorrow).format('YYYY'), month: moment(tomorrow).format('MM'), day: moment(tomorrow).format('DD') }
    this.isHelpSearch = false;
    this.isGroupChange = localStorage.getItem('searchTerm') === 'Group Change Process' ? true : false;
    if(localStorage.getItem('helpBotCategory') == 'true'){
      this.isHelpSearch = true;
    }
    this.signedUpload = false;
    if(localStorage.getItem('isSignedDocument') == 'true'){
      this.typeValue = 'clientsType';
      this.isRadioVisible = false;
      this.isSignedDoc = true;
    }
    this.isSelectTradeShow = false;
    if(localStorage.getItem('isSignedDocument') == 'true' && (localStorage.getItem('SubSubjectHeadData') == 'Pre Trade Email Confirmation' || localStorage.getItem('SubSubjectHeadData') == 'Walkin Deal sheet') && localStorage.getItem('ThirdLevelData') != ''){
      this.isSelectTradeShow = true;
    }
    this.storage.get('userType').then(type => {
      this.isRM = type == 'RM' ? true : false;
    });
    this.storage.get('JwtToken').then(token => {
      this.token = token;
      this.searchCrmTicket();
    });
    
    if(localStorage.getItem('helpType') == 'Self'){
      this.isHelpType = false;
    }
    else{
      this.isHelpType = true;
    }
     const storedValue = localStorage.getItem('quesTitle');
     this.subjectListClient = storedValue ? storedValue : '';
     this.subjectId = this.subjectListClient;

    let token = localStorage.getItem('jwt_token');
		let userID = localStorage.getItem('userId1');
		this.userTypeValue = localStorage.getItem('userType');

    if(this.userTypeValue == 'SUB BROKER'){
			this.userTypeValue = 'SB';
		} 
		if(this.userTypeValue == 'FAN'){
			this.userTypeValue = 'FN';
		}

    this.clientSearchTerms
      .pipe(
        debounceTime(500),
        switchMap((searchValue) => this.dashBoardService.fetchGetClientCodes(this.userTypeValue, userID, token, searchValue)))
      .subscribe(results => {
        let clientData = [].concat(...results);
				const data = clientData
				.map((client: any) => {
					return `${client.toString().split("-")[0]} - ${client.toString().split("-")[1].trim()}`;	
				});
        this.setClientSearch(data);
      });
      this.getPartnerList();
  }

  ionViewWillEnter() {
    this.isHelpSearch = false;
    this.isClientLabelClick = false;
    this.isPartnerLabelClick = false;
    this.signedUpload = false;
		if(localStorage.getItem('helpBotCategory') == 'true'){
      this.isHelpSearch = true;
    }
    if(localStorage.getItem('isSignedDocument') == 'true'){
      this.typeValue = 'clientsType';
      this.isRadioVisible = false;
      this.isSignedDoc = true;
    }
    this.isSelectTradeShow = false;
    if(localStorage.getItem('isSignedDocument') == 'true' && (localStorage.getItem('SubSubjectHeadData') == 'Pre Trade Email Confirmation' || localStorage.getItem('SubSubjectHeadData') == 'Walkin Deal sheet') && localStorage.getItem('ThirdLevelData') != ''){
      this.isSelectTradeShow = true;
    }
    if (localStorage.getItem('selected_categories')) {
      this.selectedCategories = JSON.parse(localStorage.getItem('selected_categories') || "{}")
    } 
	}

  updatedStartDate(event: any) {

		this.startDate = event;
		this.startDate = moment(this.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
	}

  viewExcel(){
    this.previewShow = true;
    // window.open('../../../assets/TATDoc.html', '_blank');
  }

  closePreview(){
    this.previewShow = false;
  }

  downloadExcel(){
    window.open('../../../assets/Department_TAT_for_HNI_and_Non_HNI_Clients.xlsx');
  }

  searchText(text: any) {
		let searchValue = text.trim();
		this.isDropDownVisible = false;
		if (searchValue && searchValue.length > 3) {
			this.dtLoad = false;
			this.isDropDownVisible = true;
			this.clientSearchTerms.next(searchValue);
		} else {
			this.allClients = [];
		}
	}

  showDropDown() {
		this.isDropDownVisible = true;
		this.clientSearchValue = '';
		this.dtLoad = true;
	}

	hideDropDown() {
		setTimeout(() => {
			this.isDropDownVisible = false;
		}, 300);
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

  displayClientDetails(data: any) {
    this.isClientLabelClick = true;
		this.clientSearchValue = data.ClientCode.split('-')[0].trim();
    if(this.clientSearchValue){
      this.isDisabled = false;
    }
	}

  displayPartnerDetails(data: any) {
    this.isPartnerLabelClick = true;
    this.clientSearchValue = data.EmployeeCode.trim();
    if(this.clientSearchValue){
      this.isDisabled = false;
    }
  }

  showDropDown1() {
    this.isNewDropDownVisible = true;
    this.clientSearchValue = '';
    this.dtLoad = true;
  }

  hideDropDown1() {
    setTimeout(() => {
      this.isNewDropDownVisible = false;
    }, 300);
  }

  goBack() {
		window.history.back();
	}

  accordionClick(){
    this.isClicked = !this.isClicked;
  }

  removeFile(value: any){
    let fileSize = this.myFiles[value].size;
    this.myFiles.splice(value, 1);
    // this.maxImgSize = this.maxImgSize + fileSize;
    this.imgArr.splice(value, 1);
    this.attachmentName.splice(value, 1);
    if(this.myFiles.length == 0){
      this.imgError = '';
    }
  }

  getStatus(dataObj: any){
    for(let i=0 ; i<dataObj.length ; i++){
    if(dataObj[i].Status == 'Fresh Ticket'){
      dataObj[i].StatusLabel = 'Open';
    }
    else if(dataObj[i].Status == 'Send To RM' || dataObj[i].Status == 'Fresh Ticket by AutoMata' || dataObj[i].Status == 'Send To Department' || dataObj[i].Status == 'Responded by AutoMata' || dataObj[i].Status == 'Responded by CRM' || dataObj[i].Status == 'Responded' || dataObj[i].Status == 'ReOpened' || dataObj[i].Status == 'WIP' || dataObj[i].Status == 'Fresh Ticket -Karvy'){
      dataObj[i].StatusLabel = 'WIP';
    }
    else if(dataObj[i].Status == 'FTR' || dataObj[i].Status == 'Resolved' || dataObj[i].Status == 'Invalid'){
      dataObj[i].StatusLabel = 'Closed';
    }
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

  searchCrmTicket(){
    // this.tableLoader = true;
    // let userId = localStorage.getItem('userId1');
    // let userType = localStorage.getItem('userType');
    // let Token = localStorage.getItem('crmToken');
    // let ObjectName = "Ticket";
    // let SearchParameters = {
    //     "IsRMCode": userType == "RM" ? userId : null,
    //     "IsPartnerCode": userType != "RM" ? userId : null
    // }

    // this.searchTicketObj.Token = Token;
    // this.searchTicketObj.ObjectName = ObjectName;
    // this.searchTicketObj.SearchParameters = SearchParameters;

    // this.serviceFile.searchTicket(this.token,this.searchTicketObj).subscribe((res) => { 
     
    //   if(res && res.Body && res.Body.data){
    //     this.searchTableData = res.Body.data;
    //     this.getStatus(this.searchTableData);
    //   }
    //   this.tableLoader = false;
    // },

    // this.storage.get('mappingDetails').then(type => {
    //   // console.log(type);
    //   this.clientCodeList = type;
    //   if(this.clientCodeList != null){
    //   this.clientCodeList.forEach(element => {
    //     element['clientLabel'] = element.ClientCode + ' - ' + element.ClientName
    //   });
    // }
		// });

    // this.storage.get('userID').then((userID) => {
    //     this.storage.get('userType').then(type => {
    //         if (type === 'RM' || type === 'FAN') {
    //             this.storage.get('bToken').then(token => {
    //               this.getClientCode(token,userID);
    //             })
    //         } else {
    //             this.storage.get('subToken').then(token => {
    //               this.getClientCode(token,userID);
    //             })
    //         }
    //     })
    // });

    this.storage.get('setClientCodes').then((clientCodes) => {
      this.clientCodeList = clientCodes;
    });

    // this.serviceFile.mapping(this.token).subscribe((res) => { 
    //   console.log(res);
    //   // if(res && res.Body && res.Body.data){
    //   //   this.searchTableData = res.Body.data;
    //   //   this.getStatus(this.searchTableData);
    //   // }
    //   this.tableLoader = false;
    // },
    // err => {
    //   this.tableLoader = false;
    //   this.toast.displayToast(err.error.Message);
    // });
  }

  getClientCode(cookie: any, ID: any){
    this.clientCodeList = [];
    this.loginService.getClientCodes(cookie, ID).
    subscribe((response: any) => {
      if (response['Head']['ErrorCode'] == 0) {
        this.clientCodeList = response['Body']['objGetClientCodesResBody'];
            // this.clientCodeList.forEach(element => {
            //   element['clientLabel'] = element.ClientCode + ' - ' + element.ClientName;
            // });
      } else {
        this.clientCodeList = []
      }
    });
  }
  
  handleFileInput(event: any){
    for (var i = 0; i < event.target.files.length; i++) {
        if((event.target.files[i].type === 'application/pdf' || event.target.files[i].type === 'image/jpeg' || event.target.files[i].type === 'video/mp4' || event.target.files[i].type === 'audio/mpeg' || event.target.files[i].type === 'image/png' || (event.target.files[i].type).includes("text/csv") || (event.target.files[i].type).includes("application/vnd.ms-excel") || (event.target.files[i].type).includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) && !this.attachmentName.includes(event.target.files[i].name)){
          // if(event.target.files[i].size <= this.maxImgSize){
          if(event.target.files[i].name.length>25){
            var split = event.target.files[i].name.split('.');
            var file = split[0];
            var extension = split[1];
            file = file.substring(0, 25);
            this.filename[i] = file + '...' + extension;
          }
          // this.maxImgSize = this.maxImgSize - event.target.files[i].size;
          this.myFiles.push(event.target.files[i]);
          this.attachmentName.push(event.target.files[i].name);
          const reader = new FileReader();
                  reader.readAsDataURL(event.target.files[i]);
                  reader.onload = () => {
                      this.uploadImg = reader.result;
                      this.uploadImg = this.uploadImg.split('64,')[1];
                      this.imgArr.push(this.uploadImg);
                  };
                  this.imgError = '';
        // }
        // else{
        //   this.imgError = 'File size is greater than 20 MB';
        // }
      }
      else{
        if(this.attachmentName.includes(event.target.files[i].name)){
          this.imgError = '';
        }
        else{
          this.imgError = 'File format is Invalid';
        }
      }
    }
    if(this.isSignedDoc && this.myFiles.length > 0){
      this.signedUpload = false;
    }
  }

  // submitOption(event){
  //   let Token = localStorage.getItem('crmToken');
  //     this.consolidateCrmObj = {
  //       "Token": Token,
  //       "ObjectName": "Ticket", //static
  //       "Parameters": {
  //           "Details": "This is for testing purpose...Please ignore it.",
  //           "Name": this.subjectId,
  //           "Subject": this.subjectId,
  //           "Channel": "Web FSD", //static
  //           "IsRMCode": "C188004",
  //           "IsPartnerCode": "P123P004",
  //           "Subject_Head": this.subjectId,
  //           "Status": "Open",
  //           // Below are the new fields
  //           "LoginId": "Test12",
  //           "Client": "flase", // or "false"
  //           "ApiVersion": "2" //Mandatory,
  //       },
  //       "Attachment": [],
  //       "AttachmentName": []
  //   };
  //   this.consolidateCrmObj.Attachment = this.imgArr;
  //   this.consolidateCrmObj.AttachmentName = this.attachmentName;
  //     this.serviceFile.createCrmTicket(Token,this.consolidateCrmObj).subscribe((res) => { 
  //               if(res && res.Body){
  //               //   setTimeout(() => {
  //               //     this.searchCrmTicket();
  //               // }, 3000);
  //               //   this.descriptionDetails = null;
  //               //   this.subjectId = null;
  //               //   this.myFiles = [];
  //                 this.commonService.setClevertapEvent('Support&Feedback_CreateTicket');
  //                 this.ticketId = res.Body.TicketID;
  //                 this.showLoader = false;
  //                 this.isDisabled = false;
  //                 this.displyPopupText();
  //               }
  //             },
  //             err => {
  //               this.toast.displayToast(err.error.Message);
  //               // this.showLoader = false;
  //               // this.isDisabled = false;
  //             });
  // }

  submitOption(event: any){
		this.commonService.setClevertapEvent('Submit_query_Clicked', { 'Login ID': localStorage.getItem('userId1') });
    this.showLoader = true;
    this.isDisabled = false;
    
    if((this.clientSearchValue == null || this.clientSearchValue == "" || this.clientSearchValue == undefined) && localStorage.getItem('isSignedDocument') == 'true'){
      this.noClcode = true;
      this.showLoader = false;
      this.isDisabled = false;
      return;
    }

    if(this.isHelpSearch && !this.subjectData  && localStorage.getItem('isSignedDocument') == 'true'){
      this.noSubject = true;
      this.showLoader = false;
      this.isDisabled = false;
      return;
    }


    if(!this.startDate && this.isSelectTradeShow && localStorage.getItem('isSignedDocument') == 'true' && (localStorage.getItem('SubSubjectHeadData') == 'Pre Trade Email Confirmation' || localStorage.getItem('SubSubjectHeadData') == 'Walkin Deal sheet')){
      this.noDate = true;
      this.showLoader = false;
      this.isDisabled = false;
      return;
    }

  
    if (this.typeValue === 'selfType') {
      this.clientSearchValue = null;
    }
    if (this.isGroupChange && this.radioBoxValue === 'unmappedCl') {
      this.clientSearchValue = this.mappedClientCode ? this.mappedClientCode : null;
      this.isClientLabelClick = this.clientSearchValue ? true : false;
      this.isPartnerLabelClick = this.clientSearchValue ? true : false;
      if (!this.clientSearchValue) {
        this.noClcode = true;
        this.showLoader = false;
        this.isDisabled = false;
        return;
      }
    }
    if(this.clientSearchValue && (this.typeValue == 'clientsType' && this.isClientLabelClick == false) || (this.typeValue == 'partnersType' && this.isPartnerLabelClick == false)) {
      this.toast.displayToast('Kindly Select Client Code');
      this.showLoader = false;
      this.isDisabled = false;
      return;
    }

    
    setTimeout(() => {
      let Token = localStorage.getItem('crmToken');
      if (Token) {
        this.sendData(Token);
      } else {
        this.loginService.getCrmToken().subscribe((res: any) => {
          localStorage.setItem('crmToken', res['Body']['Token']);
          this.sendData(res['Body']['Token']);
        });
      }
    }, 2000);
  }

  sendData(Token: any){
    let userId = localStorage.getItem('userId1');
    let userType = localStorage.getItem('userType');
    let RMCode = localStorage.getItem('RMCode');
    this.consolidateCrmObj = {};
    let ObjectName = "Ticket";

    let formattedDate = this.startDate;

    if(this.isSignedDoc && this.myFiles.length == 0){
      this.toast.displayToast('File upload is mandatory');
      this.signedUpload = true;
      this.showLoader = false;
      this.isDisabled = false;
      return;
    }
		  
    if(this.isHelpType){
      this.helpParameters = {
        "Details": this.descriptionDetails,
        "Name": localStorage.getItem('quesTitle'), // Same as subject Value (Map subject value to Name)
        "Subject": localStorage.getItem('quesTitle'),
        "Channel": userType == 'RM' ? 'AAA RM' : 'AAA Partner',
        "IsRMCode": RMCode == '-' ? userId : RMCode,
        "IsPartnerCode": this.typeValue == 'partnersType' ? this.clientSearchValue : userType == 'RM' ? null : userId,
        "ApiVersion": "2",
        "LoginId": this.typeValue === 'partnersType' ? null : this.clientSearchValue ? this.clientSearchValue : null,
        "IsClient": (this.typeValue === 'clientsType' && this.clientSearchValue) ? "true" : "false",
        "Status": this.isSignedDoc ? "FTR" : "Open",
        "Subject_Head": localStorage.getItem('SubjectHeadData') ? localStorage.getItem('SubjectHeadData') :'',
        "Sub_Subject_Head": localStorage.getItem('SubSubjectHeadData') ? localStorage.getItem('SubSubjectHeadData') : '',
        "Third_level_drill_down": localStorage.getItem('ThirdLevelData') ? localStorage.getItem('ThirdLevelData') : '',
        "Trade_Date": formattedDate ? formattedDate : null,
    }
    }
    else{
      this.helpParameters = {
        "Details": this.descriptionDetails,
        "Name": localStorage.getItem('quesTitle'), // Same as subject Value (Map subject value to Name)
        "Subject": localStorage.getItem('quesTitle'),
        "Channel": userType == 'RM' ? 'AAA RM' : 'AAA Partner',
        "IsRMCode": RMCode == '-' ? userId : RMCode,
        "IsPartnerCode": this.typeValue == 'partnersType' ? this.clientSearchValue : userType == 'RM' ? null : userId,
        "ApiVersion": "2",
        "LoginId": this.typeValue === 'partnersType' ? null : this.clientSearchValue ? this.clientSearchValue : null,
        "IsClient": (this.typeValue === 'clientsType' && this.clientSearchValue) ? "true" : "false",
        "Status": this.isSignedDoc ? "FTR" : "Open",
        "Subject_Head": localStorage.getItem('SubjectHeadData') ? localStorage.getItem('SubjectHeadData') :'',
        "Sub_Subject_Head": localStorage.getItem('SubSubjectHeadData') ? localStorage.getItem('SubSubjectHeadData') : '',
        "Third_level_drill_down": localStorage.getItem('ThirdLevelData') ? localStorage.getItem('ThirdLevelData') : '',
        "Trade_Date": formattedDate ? formattedDate : null,
    }
    }

    if(this.isHelpSearch){
      this.noSubject = false;

      if(localStorage.getItem('isSignedDocument') == 'true'){
        
        this.helpParameters['Name'] = this.subjectData;
        this.helpParameters['Subject'] = this.subjectData;
        this.helpParameters['LoginId'] = this.typeValue === 'partnersType' ? null : this.clientSearchValue ? this.clientSearchValue : null;
        this.helpParameters['IsClient'] = (this.clientSearchValue && this.typeValue === 'clientsType') ? "true" : "false";
        this.helpParameters['Subject_Head'] = localStorage.getItem('SubjectHeadData');
        this.helpParameters['Sub_Subject_Head'] = localStorage.getItem('SubSubjectHeadData');
        this.helpParameters['Third_level_drill_down'] =  localStorage.getItem('ThirdLevelData');
        this.helpParameters['Trade_Date'] =  formattedDate ? formattedDate : null;

        if(this.descriptionDetails == '' || this.descriptionDetails == undefined || this.descriptionDetails.length == 0) {
          this.noDesc = true;
          this.showLoader = false;
          this.isDisabled = false;
          this.noName = false;
          return;
        }
        else {
          this.noSubject = false;
          this.noClcode = false;
          this.noDesc = false;
          this.noDate = false;
          this.noName = false;
          this.showLoader = false;
          this.isDisabled = false;
          this.showTicketModal = true;
        }

      }else{
        if(!this.subjectData){
          this.noSubject = true;
          this.showLoader = false;
          this.isDisabled = false;
          return;
        }
        this.helpParameters['Name'] = this.subjectData;
        this.helpParameters['Subject'] = this.subjectData;
        this.helpParameters['LoginId'] = this.typeValue === 'partnersType' ? null : this.clientSearchValue ? this.clientSearchValue : null;
        this.helpParameters['IsClient'] = (this.clientSearchValue && this.typeValue === 'clientsType') ? "true" : "false";
        this.helpParameters['Subject_Head'] = localStorage.getItem('SubjectHeadData');
        this.helpParameters['Sub_Subject_Head'] = localStorage.getItem('SubSubjectHeadData');
        this.helpParameters['Third_level_drill_down'] =  localStorage.getItem('ThirdLevelData');
        this.helpParameters['Trade_Date'] =  formattedDate ? formattedDate : null;

        if(this.descriptionDetails == '' || this.descriptionDetails == undefined || this.descriptionDetails.length == 0) {
          this.noDesc = true;
          this.showLoader = false;
          this.isDisabled = false;
          this.noName = false;
          return;
        }
        else {
          this.noSubject = false;
          this.noClcode = false;
          this.noDesc = false;
          this.noDate = false;
          this.noName = false;
          this.showLoader = false;
          this.isDisabled = false;
          this.showTicketModal = true;
        }
      }
      
      
    }

    this.consolidateCrmObj.Token = Token;
    this.consolidateCrmObj.ObjectName = ObjectName;
    this.consolidateCrmObj.Parameters = this.helpParameters;
    this.consolidateCrmObj.Attachment = this.imgArr;
    this.consolidateCrmObj.AttachmentName = this.attachmentName;

    if(!this.isHelpSearch){
      if(!this.subjectListClient){
        this.noSubject = true;
        return;
      }
      this.noName = false;
      if(this.descriptionDetails == '' || this.descriptionDetails == undefined || this.descriptionDetails.length == 0) {
        this.noDesc = true;
        this.showLoader = false;
        this.isDisabled = false;
        return;
      }else{
        this.handleRaiseTicket();
      }
      // else{
      //   this.noDesc = false;
      //   this.showLoader = false;
      //   this.isDisabled = false;
      //   return;
      // }
      // return;
    }

    // if(this.descriptionDetails == '' || this.descriptionDetails == undefined || this.descriptionDetails.length == 0) {
    //   if(localStorage.getItem('isSignedDocument') == 'true'){
    //   this.noDesc = false;
    //   this.showLoader = false;
    //   this.isDisabled = false;
    //   this.noName = false;}
    //   else{
    //     this.noDesc = true;
    //     this.showLoader = false;
    //     this.isDisabled = false;
    //     this.noName = false;
    //   }
    //   return;
    // }
    // else {
    //   this.noSubject = false;
    //   this.noClcode = false;
    //   this.noDate = false;
    //   this.noDesc = false;
    //   this.noName = false;
    //   this.showLoader = false;
    //   this.isDisabled = false;
    //   this.showTicketModal = true;
    // }
  }

  async displyPopupText() {
    const modal = this.modalController.create({
			component: QueryThankyouComponent,
			componentProps: {ticketID: this.ticketId},
			cssClass: 'thankyou_model',
      backdropDismiss: true
		});
		return (await modal).present();
	} 

  async displayActivationModel(dataObj: any){
    
    const modal = this.modalController.create({
			component: AccountActivationModelComponent,
			componentProps: { dataObj: dataObj },
			cssClass: 'account_activation backdrop-bg',
      backdropDismiss: true
		});
		return (await modal).present();
  }

  inputClientId(event: any) {
    this.noClient = false;
    this.noSubject = false;
    this.noName = false;
	}
  
  openPopup(dataObj: any){
    this.displayActivationModel(dataObj);
  }

  isClientTable(){
    this.clientTab = true;
    this.selfTab = false;
  }

  isSelfTable(){
    this.selfTab = true;
    this.clientTab = false;
  }

  onIsClient(){
    this.isClient = true;
  }

  onIsSelf(){
    this.isClient = false;
  }

  radioGroupChange(value: any) {
    this.radioBoxValue = value;
    this.noClcode = false;
    this.clientSearchValue = null;
    this.mappedClientCode = null;
    this.subjectData = null;
    this.descriptionDetails = null;
    this.consolidateCrmObj = null;
  }

  validateClient(text: any){
    return /^[A-Za-z0-9]*$/.test(text);
  }

  /**
   * To change radio button - self/clients/partners.
   * @param value 
   */
  typeChange(value:any) {
    this.typeValue = value;
    this.clientSearchValue = null;
  }
  /**
   * To get Partner list.
   */
  getPartnerList() {
    let token = localStorage.getItem('jwt_token');
    this.storage.get('userID').then((userID) => {
      this.storage.get('userType').then(type => {
        this.searchRmhierarchyTerms
          .pipe(
            debounceTime(500),
            switchMap((textSerach) => this.dashBoardService.fetchRMHierarchyNew(type, userID, token, textSerach)) // Perform the search operation
          )
          .subscribe(results => {
            this.setHierarchyList(results);
          });
      });
    });
  }
  /**
   * To format partnerlist.
   * @param res 
   */
  setHierarchyList(res:any) {
    let details = [];
    for (const item of res[0]) {
      details.push({
        EmployeeName: item.employeeName,
        EmployeeCode: item.employeeId,
        EmployeeLevel: item.level,
        ManagerCode: '',
        ManagerName: '',
      })
    }
    const listToTree = (arr:any = []) => {
      let map:any = {}, node, res:any = [], i;
      for (i = 0; i < arr.length; i += 1) {
        map[arr[i].EmployeeCode] = i;
        arr[i]['isChecked'] = true;
        arr[i]['type'] = 'Individual';
        arr[i]['innerDetail'] = [];
      };
      for (i = 0; i < arr.length; i += 1) {
        node = arr[i];
        if (node.ManagerCode !== "" && arr.length > 1 && node.ManagerCode !== arr[map[node.ManagerCode]].ManagerCode) {
          arr[map[node.ManagerCode]].innerDetail.push(node);
          arr[map[node.ManagerCode]].innerDetail = arr[map[node.ManagerCode]].innerDetail.sort((a:any, b:any) => {
            return b.EmployeeLevel - a.EmployeeLevel;
          })
        }
        else {
          node['isVisible'] = true;
          node['isChecked'] = true;
          res.push(node);
        };
      };
      return res;
    };
    let x = listToTree(details);
    x = x.sort((a:any, b:any) => {
      return b.EmployeeLevel - a.EmployeeLevel;
    });
    var result = x.filter((obj:any) => {
      return obj.EmployeeLevel !== ''
    })
    var logid = result.filter((obj:any) => {
      return obj.EmployeeCode == localStorage.getItem('userId1')
    })
    var notlogid = result.filter((obj:any) => {
      return obj.EmployeeCode != localStorage.getItem('userId1')
    })
    result = logid.concat(notlogid);
    var result1 = x.filter((obj:any) => {
      return obj.EmployeeLevel == ''
    })
    let y = result.concat(result1);
    this.selectOptionArr = y;
    this.selectOptionArrCopy = y;
    this.dtLoad = true;
  }
  /**
   * To get searched partner code.
   * @param value 
   */
  typeHierarchyText(value:any) {
    const textSerach = value;
    // this.isNewDropDownVisible = fa;
    if (textSerach && textSerach.length > 3) {
      this.searchRmhierarchyTerms.next(textSerach);
      this.isNewDropDownVisible = true;
      console.log(this.selectOptionArrCopy);
    } else {
      this.selectOptionArr = [];
      this.selectOptionArrCopy = [];
      this.clientSearchValue = null;
    }
  }

  gobacktoHelp(){
    this.router.navigate(['/help-support']);
    this.showTicketModal = false;
    this.isThankYou = false;
    this.subjectData = null;
    this.clientSearchValue = null;
    this.descriptionDetails = null;
    this.subjectId = null;
    this.clientList = null;
    this.mappedClientCode = null;
    this.startDate = null
    this.myFiles = [];
  }

  gotoprevQuery(){
    this.router.navigate(['/help-partner-query']);
    this.showTicketModal = false;
    this.isThankYou = false;
  }

  closeRaiseTicketModal(){
    this.showTicketModal = false;
    this.isThankYou = false;
  }

  handleRaiseTicket(){
    this.showSubmitLoader = true;
    this.isSubmitDisabled = true;
      this.storage.get('JwtToken').then(token => {
        this.serviceFile.createCrmTicket(token,this.consolidateCrmObj).subscribe((res) => {
          if(res && res.Body){
            setTimeout(() => {
              this.searchCrmTicket();
            }, 3000);
            this.subjectData = null;
            this.clientSearchValue = null;
            this.descriptionDetails = null;
            this.subjectId = null;
            this.clientList = null;
            this.mappedClientCode = null;
            this.startDate = null
            this.myFiles = [];
            if(this.isHelpType) {
              this.commonService.setClevertapEvent('Submit_Query_Client_Clicked');
            }
            else{
              this.commonService.setClevertapEvent('Submit_Query_Self_Clicked');
            }
            this.ticketId = res.Body.TicketID;
            this.showSubmitLoader = false;
            this.isSubmitDisabled = false;
            if(!this.isHelpSearch){
              this.showLoader = false;
              this.showTicketModal = true;
            }
            this.isThankYou = true;
            // this.displyPopupText();
          }
        },
          err => {
            this.toast.displayToast(err.error.Message);
            this.showSubmitLoader = false;
            this.isSubmitDisabled = false;
          });
      });
  }
  
  toggleStartDatePicker() {
		this.showStartDatePicker = !this.showStartDatePicker;
    this.startDate= moment(new Date()).format("YYYY-MM-DD");
	}

  hideDatePicker(type: string, event?:any) {
		// Update selectedDate with the changed value
		const datediv = this.elementRef.nativeElement.querySelector('ion-datetime');
		const isMonthYearDisplayed = datediv.classList.contains('show-month-and-year');
		
		if (!isMonthYearDisplayed) {
      if (type === 'start') {
        this.showStartDatePicker = false;
        if(event != undefined){
          this.onStartDateChanged();
        }
      }
		} 

	}

	onStartDateChanged() {
    if(this.startDate){
      this.noDate = false;
    }
    else{
      this.noDate = true;
      
    }
    if(this.clientSearchValue && this.startDate){
      this.isDisabled = false;
    }
		// this.fromDate = new Date(this.ionFromDate);
	}
}