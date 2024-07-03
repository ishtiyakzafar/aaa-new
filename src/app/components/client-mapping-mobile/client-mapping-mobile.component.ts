import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ClientMappingFailModalComponent } from '../client-mapping-fail-modal/client-mapping-fail-modal.component';
import moment from "moment";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { LoginService } from '../../pages/login/login.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
@Component({
  selector: 'app-client-mapping-mobile',
  providers: [WireRequestService, LoginService],
  templateUrl: './client-mapping-mobile.component.html',
  styleUrls: ['./client-mapping-mobile.component.scss'],
})
export class ClientMappingMobileComponent implements OnInit {

  public fileBlockValue: string = 'singleClient';
  public tokenValChange: any;
  public changeUserId: any;
  public activateBlockValue: string = 'D';
  public disableDealer = false;
  public isClientCodeDisable = false;
  public disableClientCode = true;
  public isMapSelect = false;
  public fileName : any;
  clientEntry:any = {};
  public clientCodeErr: any = '';
  public dealerIdErr: any = '';
  public mapSelect: any = '';
  public fileNotFound: any = '';
  public counter = 0;
  public dealerList: any[] = [];
  public dealerListCopy: any[] = [];
  public clientCodeFileList: any = [];
  public uploadData: any[] = [];
  clientCodeList:any = [];
  clientListObj: any = {};
  dealerListObj: any = {};
  onHover = false;
  pageNo = 1;
  clientMapDetails:any[] = [{
    id: 1, clientName: "TTNOW", clientValue: "NOW"
  },
  {
    id: 2, clientName: "ALGO", clientValue: "algo"
  },
  {
    id: 3, clientName: "ALGO (XTS) CDC - 1", clientValue: "algocdc"
  },
  {
    id: 4, clientName: "Greek", clientValue: "greek"
  }];
  productActivity: any = {};
  public userArray: any[] = [];
  dataLoad = false;

  currentBrokFun: boolean = false;
	depositDetils: any[] = [];
	public displayHybridDropdown: boolean = false;
	bankDetail: any[] = [];
	equityCmsData: any[] = [];
	clientMappingTableDetails: any[] = [];
	setToken!: string;
	fromDate: string = `${moment().format('YYYY')}-${moment().format('MM')}-01`;
	todate: string = moment().format('YYYY-MM-D');
	public selectedDate = { start: moment().startOf('month'), end: moment().endOf('month') };
	NgxDaterangepickerMd!: NgxDaterangepickerMd;
  dealerListObjInput: any;
  clientListObjInput: any;
	maxDate = moment(new Date());
	minDate = moment(new Date('Mn Jan 1 1973 00:01:00 GMT+0200 (CEST)'));
	ranges: any = {
		'This Month': [moment().startOf('month'), moment().endOf('month')],
		'Previous Month': [
			moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')
		]
	}
	cancelBtn: boolean = true;
  constructor(private wireReqService: WireRequestService,private http: HttpClient,private commonService: CommonService,public toast: ToasterService,private storage: StorageServiceAAA,public serviceFile: LoginService,private modalController: ModalController, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.mappingInit();
    
   
  }
  mappingInit(){
    this.storage.get('userID').then((userID) => {
      this.changeUserId = userID;
        this.storage.get('userType').then(type => {
            if (type === 'RM' || type === 'FAN') {
                this.storage.get('bToken').then(token => {
                  this.tokenValChange = token;
                  this.getClientCode(token,userID);
                  this.getDealerId(token,userID);
                  this.setToken = token;
						      //this.setUserId = userID;
                  this.getcheckProdAct(token,userID);
                })
            } else {
                this.storage.get('subToken').then(token => {
                  this.tokenValChange = token;
                  this.getClientCode(token,userID);
                  this.getDealerId(token,userID);
                  this.setToken = token;
						      //this.setUserId = userID;
                  this.getcheckProdAct(token,userID);
                })
            }
        })
    });

    

    // this.fetchClientMappingData();

  }
  handleFileInput(event: any){
    if(this.clientEntry.clientName !="NOW" && this.clientEntry.clientName !="algo" && this.clientEntry.clientName !="algocdc" && this.clientEntry.clientName !="greek"){
      this.dataLoad = false;
      this.mapSelect = "Please select the Mapping";
      return;
    }
    if (event.target.files.length > 0) {
      if(event.target.files[0].type == "text/plain" || event.target.files[0].type == 'text/csv'){
        this.fileNotFound = "";
        if(event.target.files[0].name.length>23){
          var split = event.target.files[0].name.split('.');
          var file = split[0];
          var extension = split[1];
          file = file.substring(0, 23);
          this.fileName = file + '...' + extension;
        }
        else{
          this.fileName = event.target.files[0].name;
        }
        this.uploadData = [];
        const myReader = new FileReader();
        let fileString;
        myReader.readAsText(event.target.files[0]);
        myReader.onloadend = (event) => {
          fileString = myReader.result as string;
          let parsedarray=fileString.split('\n');
          var filtered = parsedarray.filter(function (el) {
            return el != (null || "" || '');
          });
          for(let i=0;i<filtered.length;i++){
            let dataObj={
              Clientcode : '',
              DealerId: '',
              Type: this.clientEntry.clientName
            };
            dataObj.Clientcode = filtered[i].split(',')[0].trim().replace('\"', '');
            dataObj.DealerId = filtered[i].split(',')[1].trim().replace('\"', '');
            this.uploadData.push(dataObj);
          }
       };
      }
      else{
        this.toast.displayToast("File format is not supported");
      }
     
    }
  }
  dismiss(){
		this.modalController.dismiss();
	  }
  goBack() {
		window.history.back();
	}
  changeMap(event: any){
    this.mapSelect = "";
    this.fileName = "";
    this.uploadData = [];
    if(this.clientEntry && this.clientEntry.clientName == 'NOW'){
      this.isMapSelect = true;
      this.dealerListObj = 'TTNOW';
    }
    else{
      this.isMapSelect = false;
      this.dealerListObj = 'Algo';
    }

    if(this.clientEntry && (this.clientEntry.clientName == 'NOW' || this.clientEntry.clientName == 'algo') && this.activateBlockValue == 'D'){
      this.dealerListObj = {};
      this.clientListObj = {};
      this.disableClientCode = true;
    }
   }
   getClientCode(cookie: any, ID: any){
    this.clientCodeList = [];
    this.serviceFile.getClientCodes(cookie, ID).
    subscribe((response: any) => {
      if (response['Head']['ErrorCode'] == 0) {
        this.clientCodeList = response['Body']['objGetClientCodesResBody']
      } else {
        this.clientCodeList = []
      }
    });
  }
  getDealerId(token: any,userId: any){
    this.wireReqService.getBranch(token,userId).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
        this.dealerList = res['Body']['BranchCodes'];
        this.dealerListCopy = this.dealerList;
			}
			else {
				this.toast.displayToast(res['Head']['ErrorDescription']);
			}
		});
  }
  getcheckProdAct(token: any,userId: any) {
    this.fetchClientMappingData();
  
}
  mapSegmentChanged(event: any) {
    this.fileNotFound = "";
    this.fileName = "";
		if(event == 'singleClient'){
      this.isClientCodeDisable = false;
      this.disableDealer = false;
      this.uploadData = [];
      this.clientListObjInput = "";
		}
		if(event == 'fileUpload'){
			this.isClientCodeDisable = true;
      this.activateBlockValue = 'D';
      this.clientCodeErr = "";
      this.dealerIdErr = "";
      this.dealerListObjInput = "";
      this.clientListObj = {};
      this.uploadData = [];
      setTimeout(() => {
        this.disableDealer = true;
      },0);
		}
	}

  typeDealerText(event: any){
		this.dealerListObjInput = event.target.value;
	}
  typeClientText(event: any){
		this.clientListObjInput = event.target.value;
	}
  changeDealerId(event: any){
    this.dealerIdErr = "";
    this.clientListObj = {};
    this.disableClientCode = false;
    this.getClientCode(this.tokenValChange,event.Branch);
  }
  changeClientId(event: any){
    this.clientCodeErr = "";
  }
  actionSegmentChanged(event: any) {
    if(this.activateBlockValue == 'A'){
      this.clientListObj = {};
      this.getClientCode(this.tokenValChange,this.changeUserId);
      this.disableDealer = true;
      if(this.clientEntry && this.clientEntry.clientName == 'NOW'){
        this.dealerListObj = 'TTNOW';
      }
      else{
        this.dealerListObj = 'Algo';
      }
      this.dealerList = [];
      this.disableClientCode = false;
      this.clientCodeList = [];
      this.clientCodeErr = "";
      this.dealerIdErr = "";
    }
    else{
      this.disableDealer = false;
      this.dealerListObj = {};
      this.dealerListObjInput = "";
      this.dealerList = [];
      this.dealerList = this.dealerListCopy;
      this.disableClientCode = true;
      this.clientCodeList = [];
      this.clientListObj = {};
      this.clientCodeErr = "";
      this.dealerIdErr = "";
      this.clientListObjInput = "";
    }
  }
  onSubmit(){
    this.dataLoad = true;
    if(this.clientEntry.clientName !="NOW" && this.clientEntry.clientName !="algo" && this.clientEntry.clientName !="algocdc" && this.clientEntry.clientName !="greek"){
      this.dataLoad = false;
      this.mapSelect = "Please select the Mapping";
      return;
    }
    if(!this.isClientCodeDisable){
      this.clientCodeErr = "";
      this.dealerIdErr = "";
      // if(Object.keys(this.clientListObj).length === 0 || Object.keys(this.dealerListObj).length === 0){
      //   if(Object.keys(this.dealerListObj).length === 0){
      //     this.dealerIdErr = "Please select Dealer Id";
      //     this.dataLoad = false;
      //     return;
      //   }
      //   if(Object.keys(this.clientListObj).length === 0  && !this.isClientCodeDisable){
      //     this.clientCodeErr = "Please select Client Code";
      //     this.dataLoad = false;
      //     return;
      //   }
      // }
      this.uploadData = [];
      let dataObj = {};
      // if(!this.isOffline){
      //     dataObj={
      //     Clientcode : this.clientListObj,
      //     DealerId: this.dealerListObj,
      //     Type: this.clientEntry.clientName
      //   };
      //   this.uploadData.push(dataObj);
      // }
      // else{
      //     dataObj={
      //     Clientcode : this.clientListObjInput,
      //     DealerId: this.dealerListObjInput,
      //     Type: this.clientEntry.clientName
      //   };
      //   this.uploadData.push(dataObj);
      // }
      dataObj={
        Clientcode : this.clientListObjInput,
        DealerId: this.dealerListObjInput,
        Type: this.clientEntry.clientName
      };
      this.uploadData.push(dataObj);
  }
  if(this.uploadData.length == 0 && this.isClientCodeDisable){
    this.fileNotFound = "Please Upload the file";
    this.dataLoad = false;
    return;
  }
  this.dataLoad = true;
    this.wireReqService.ttnowMapping(this.wireReqService.tokenVal,this.uploadData).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
        this.dataLoad = false;
        let errMsg = '';
        this.clientCodeFileList = [];
        if(this.dealerListObj == 'Algo'){
          this.commonService.setClevertapEvent('AlgoMapping_Submit');
        }
        else{
          this.commonService.setClevertapEvent('TTMapping_Submit');
        }
        if(!this.isClientCodeDisable){
          if(res['Body']['TTNowmappinglist'] && res['Body'].TTNowmappinglist.length){
            errMsg = res['Body'].TTNowmappinglist[0].Remarks;
            this.toast.displayToast(errMsg);
          }
          else {
            if(res['Body']['Msg'] && res['Body'].Msg.includes('insert successfully')){
              this.toast.displayToast("Client Mapping request is sent to Backoffice and will take upto 24 hours for successful mapping");
            }
            else if(res['Body'].includes('0')||res['Body'].includes('1')){
              this.toast.displayToast(res['Body'][0])
            }
          }
        }
        else{
          this.dataLoad = false;
          errMsg = res['Body'].Msg;
          if(errMsg.includes('data is in Invalid')){
            for(let i=0;i<res['Body'].TTNowmappinglist.length;i++){
              this.clientCodeFileList.push(res['Body'].TTNowmappinglist[i].Clientcode);
            }
            this.Popupclientmappingfail();
          }
          else if(errMsg.includes('insert successfully')){
            this.toast.displayToast("Client Mapping request is sent to Backoffice and will take upto 24 hours for successful mapping");
          }
        }
			}
			else {
        this.dataLoad = false;
				this.toast.displayToast(res['Head']['ErrorDescription']);
			}
		});
  }
  
  // onSubmit(){
  //   this.dataLoad = true;
  //   if(this.clientEntry.clientName !="NOW" && this.clientEntry.clientName !="algo"){
  //     this.dataLoad = false;
  //     this.mapSelect = "Please select the Mapping";
  //     return;
  //   }
  //   if(!this.isClientCodeDisable){
  //     this.clientCodeErr = "";
  //     this.dealerIdErr = "";
  //     if(Object.keys(this.clientListObj).length === 0 || Object.keys(this.dealerListObj).length === 0){
  //       if(Object.keys(this.dealerListObj).length === 0){
  //         this.dealerIdErr = "Please select Dealer Id";
  //         this.dataLoad = false;
  //         return;
  //       }
  //       if(Object.keys(this.clientListObj).length === 0  && !this.isClientCodeDisable){
  //         this.clientCodeErr = "Please select Client Code";
  //         this.dataLoad = false;
  //         return;
  //       }
  //     }
  //     this.uploadData = [];
  //     let dataObj={
  //       Clientcode : this.clientListObjInput,
  //       DealerId: this.dealerListObjInput,
  //       Type: this.clientEntry.clientName
  //     };
  //     this.uploadData.push(dataObj);
  // }
  // if(this.uploadData.length == 0 && this.isClientCodeDisable){
  //   this.fileNotFound = "Please Upload the file";
  //   this.dataLoad = false;
  //   return;
  // }
  // this.dataLoad = true;
  //   this.wireReqService.ttnowMapping(this.wireReqService.tokenVal,this.uploadData).subscribe((res) => {
	// 		if (res['Head']['ErrorCode'] == 0) {
  //       this.dataLoad = false;
  //       let errMsg = '';
  //       this.clientCodeFileList = [];
  //       if(this.dealerListObj == 'Algo'){
  //         this.commonService.setClevertapEvent('AlgoMapping_Submit');
  //       }
  //       else{
  //         this.commonService.setClevertapEvent('TTMapping_Submit');
  //       }
  //       if(!this.isClientCodeDisable){
  //         if(res['Body'].TTNowmappinglist.length){
  //         errMsg = res['Body'].Msg + res['Body'].TTNowmappinglist[0].Remarks;
  //         if(errMsg.includes('ClientCode already exists')){
  //           this.toast.displayToast("Client Mapping failed as Client code is already mapped under you");
  //         }
  //         else if(errMsg.includes('Mapping Client,RM,Fan!')){
  //           this.toast.displayToast("Client Mapping failed and provided client is not mapped under you");
  //         }
  //       }
  //       else {
  //         if(res['Body'].Msg.includes('insert successfully')){
  //           this.toast.displayToast("Client mapped successfully");
  //         }
  //       }
  //       }
  //       else{
  //         this.dataLoad = false;
  //         errMsg = res['Body'].Msg;
  //         if(errMsg.includes('data is in Invalid')){
  //           for(let i=0;i<res['Body'].TTNowmappinglist.length;i++){
  //             this.clientCodeFileList.push(res['Body'].TTNowmappinglist[i].Clientcode);
  //           }
  //           this.Popupclientmappingfail();
  //         }
  //         else if(errMsg.includes('insert successfully')){
  //           this.toast.displayToast("Clients mapped successfully");
  //         }
  //       }
	// 		}
	// 		else {
  //       this.dataLoad = false;
	// 			this.toast.displayToast(res['Head']['ErrorDescription']);
	// 		}
	// 	});
  // }
    async Popupclientmappingfail() {
      const modal = this.modalController.create({
          component: ClientMappingFailModalComponent,
          componentProps: { ClientList: this.clientCodeFileList },
          cssClass: 'client_mapping_fail',
        backdropDismiss: true
        });
        return (await modal).present();
      } 

      

      fetchClientMappingData() {
        this.dataLoad = true;
        let payload:any = {			 
          "MakerID": localStorage.getItem('userId1'),
          "FromDate": this.fromDate,
          "Todate": this.todate,
          "Status": "ALL",
          "ClientCode": ''
        }
        payload['PageNo'] = this.pageNo;
        this.wireReqService
        .getClientMappingTableData(payload, this.setToken)
        .subscribe((res: any) => {
            if (res["Head"]["ErrorCode"] == 0) {
              this.clientMappingTableDetails =
                res["Body"]["objGetClientTTMappingStatusReportResBody"];
    
              this.dataLoad = false;
            } else if (res["Head"]["ErrorCode"] == 1) {
              this.clientMappingTableDetails = []
              this.dataLoad = false;
            }
          });
      }

     
    
      datesUpdated(event: any) {
        if (event && event.startDate && event.endDate) {
          this.fromDate = moment(event.startDate).format('YYYY-MM-DD');
          this.todate = moment(event.endDate).format('YYYY-MM-DD');
          this.fetchClientMappingData();
        }
      }
    
      onViewTTMapping(){
        this.commonService.setClevertapEvent('TTMappingStatus_Clicked');
        this.router.navigate(['/demap-client-mapping']);
      }
}