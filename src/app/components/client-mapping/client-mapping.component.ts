import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ClientMappingFailModalComponent } from '../client-mapping-fail-modal/client-mapping-fail-modal.component';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { LoginService } from '../../pages/login/login.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-client-mapping',
  providers: [LoginService,DashBoardService],
  templateUrl: './client-mapping.component.html',
  styleUrls: ['./client-mapping.component.scss'],
})
export class ClientMappingComponent implements OnInit {
  @Input() passClientId: any;
  @Input() tokenVal: any;
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
  isOffline = false;
  dealerListObjInput: any;
  clientListObjInput: any;
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
  @Output() clientMap = new EventEmitter;  
  constructor(private wireReqService: WireRequestService,private http: HttpClient,public toast: ToasterService,private storage: StorageServiceAAA,public serviceFile: LoginService,private commonService: CommonService, private modalController: ModalController, private route: ActivatedRoute,private dashBoardService: DashBoardService, private router: Router) { }
  ngOnInit() {
    this.counter = 0;
    this.route.params.subscribe((params: any) => {
      if (params && params.id == "client-mapping") {
        this.clientMap.emit(params.id);
      }
    });
    this.mappingInit();

    this.isOffline = true;
    this.disableDealer = false;
    this.dealerListObj = {};
    this.dealerList = [];
    this.dealerList = this.dealerListCopy;
    this.disableClientCode = true;
    this.clientCodeList = [];
    this.clientListObj = {};
    this.clientCodeErr = "";
    this.dealerIdErr = "";
  }

  dismiss(){
		this.modalController.dismiss();
	}
  
  goBack() {
		window.history.back();
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
                })
            } else {
                this.storage.get('subToken').then(token => {
                  this.tokenValChange = token;
                  this.getClientCode(token,userID);
                  this.getDealerId(token,userID);
                })
            }
        })
    });
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
  typeDealerText(event: any){
		this.dealerListObjInput = event.target.value;
	}
  typeClientText(event: any){
		this.clientListObjInput = event.target.value;
	}
  changeMap(event: any){
    this.mapSelect = "";
    this.fileName = "";
    this.uploadData = [];
    this.isOffline = true;
    this.disableDealer = false;
    this.activateBlockValue = 'D'
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
    this.dashBoardService.getHierarchyList(token,userId).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
        this.dealerList = res['Body']['Details'];
        this.dealerListCopy = this.dealerList;
			}
			else {
				this.toast.displayToast(res['Head']['ErrorDescription']);
			}
		});
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
      this.dealerListObj = {};
      this.clientListObj = {};
      this.uploadData = [];
      this.dealerListObjInput = "";
      setTimeout(() => {
        this.disableDealer = true;
      },0);
		}
	}

  changeDealerId(event: any){
    this.dealerIdErr = "";
    this.clientListObj = {};
    this.disableClientCode = false;
    this.getClientCode(this.tokenValChange,event.EmployeeCode);
  }

  changeClientId(event: any){
    this.clientCodeErr = "";
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
      if(!this.isOffline){
          dataObj={
          Clientcode : this.clientListObj,
          DealerId: this.dealerListObj,
          Type: this.clientEntry.clientName
        };
        this.uploadData.push(dataObj);
      }
      else{
          dataObj={
          Clientcode : this.clientListObjInput,
          DealerId: this.dealerListObjInput,
          Type: this.clientEntry.clientName
        };
        this.uploadData.push(dataObj);
      }
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
          errMsg = res['Body'].Msg + res['Body'].TTNowmappinglist[0].Remarks;
          if(errMsg.includes('ClientCode already exists')){
            this.toast.displayToast("Client Mapping failed as Client code is already mapped under you");
            this.toast.displayToast("Client is already mapped under the selected Dealer Id");
          }
          else if(errMsg.includes('Mapping Client,RM,Fan!')){
            this.toast.displayToast("Client Mapping failed and provided client is not mapped under you");
            this.toast.displayToast("Client mapping failed as provided client is not mapped under the selected Dealer Id");
          }
          else if(errMsg.includes('Freezed Client')){
            this.toast.displayToast("Freezed Client cannot be mapped in Algo");
          }
          else if(errMsg.includes('Dormant Client')){
            this.toast.displayToast("Dormant Client cannot be mapped in Algo");
          }
          else if(errMsg.includes('NRI Client')){
            this.toast.displayToast("NRI Client cannot be mapped in Algo");
          }
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

  onViewTTMapping(){
    this.commonService.setClevertapEvent('TTMappingStatus_Clicked');
    this.router.navigate(['/demap-client-mapping']);
  }
  
  async Popupclientmappingfail() {
    const modal = this.modalController.create({
        component: ClientMappingFailModalComponent,
        componentProps: { ClientList: this.clientCodeFileList },
        cssClass: 'client_mapping_fail',
      backdropDismiss: true
      });
      return (await modal).present();
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
      this.isOffline = false;
    }
    else{
      this.isOffline = true;
      this.disableDealer = false;
      this.dealerListObj = {};
      this.dealerList = [];
      this.dealerList = this.dealerListCopy;
      this.disableClientCode = true;
      this.clientCodeList = [];
      this.clientListObj = {};
      this.clientCodeErr = "";
      this.dealerIdErr = "";
    }
  }
  
}
