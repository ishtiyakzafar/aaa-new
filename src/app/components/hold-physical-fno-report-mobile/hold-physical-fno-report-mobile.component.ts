import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { PhysicalFnoConfirmModalMobileComponent } from '../../physical-fno-confirm-modal-mobile/physical-fno-confirm-modal-mobile.component';

@Component({
  selector: 'app-hold-physical-fno-report-mobile',
  providers: [ WireRequestService ],
  templateUrl: './hold-physical-fno-report-mobile.component.html',
  styleUrls: ['./hold-physical-fno-report-mobile.component.scss'],
})
export class HoldPhysicalFnoReportMobileComponent implements OnInit {

  public clientHolddata: any;
  public userid: any;
  public tokendata: any;
  public dataLoad = false;
  public saveCount = 0;
  public datLoad = false;
  groupList: any = [];
  reportData = [];
  public monthinclude = false;
  confirmList: any=[];
  searchValue:any;
  isChecked: boolean[] = [];

  constructor(private modalController: ModalController,private wireReqService: WireRequestService,private storage: StorageServiceAAA,private commonService: CommonService, private toast: ToasterService) { }

  ngOnInit() {
    this.getData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getData();
  }
  goBack() {
		window.history.back();
	}

  getData(){
    this.storage.get('userID').then((userID) => {
      this.userid = userID;
      this.storage.get('bToken').then(token => {
        this.tokendata = token;
        if (this.userid != "") {
          let body = {
            "PartnerCode": this.userid,
            "ClientCode": ""
          }
          this.dataLoad = true;
          this.wireReqService.getallClientWireRequest(body, this.tokendata).subscribe(res => {
            this.clientHolddata = res['Body'];
            this.reportData = res['Body'];
            this.dataLoad = false;
          })
        }
      })
    });
  }

    async displyPopupText2(confirmList: any,groupList: any,tokendata: any,userid: any) {
      const modal = this.modalController.create({
          component: PhysicalFnoConfirmModalMobileComponent,
          componentProps: {confirmList,groupList,tokendata,userid},
          cssClass: 'summary_confirm',
        backdropDismiss: true
        });
        return (await modal).present();
      } 

  classCheck(data: any){
		if(data > 0){
			return false;
		}
		return true;
	}

  selectclient(e: any, obj: any) {
    let sameClient: any = [];
    if (e.target.checked) {
      sameClient = this.clientHolddata.filter((item: any) => {
        if (item.ClientCode === obj.ClientCode) {
          item['isChecked'] = true;
          return item;
        }
      });
      if (sameClient && sameClient.length > 0) {
        this.groupList = this.groupList.concat(sameClient);
      } else {
        this.groupList.push(obj)
      }
    }
    else {
      this.clientHolddata.filter((item: any) => {
        if (item.ClientCode === obj.ClientCode) {
          item['isChecked'] = false;
          this.groupList.splice(item, 1);
        }
      });
    }
  }

  cancel() {
    for (let i = 0; i < this.clientHolddata.length; i++) {
      if (this.clientHolddata[i] && this.clientHolddata[i].isChecked) {
        delete this.clientHolddata[i].isChecked;
      }
    }
    this.groupList = [];
  }

    onClosePopup() {
      this.monthinclude = !this.monthinclude;
    }

    onHoldClick(){

    if(this.groupList.length < 1){
      return;
    }

    if (this.clientHolddata.length > 0) {
      this.confirmList=[];
      this.groupList=[];
      for(let i=0 ; i< this.clientHolddata.length ; i++){
        if(this.clientHolddata[i] && this.clientHolddata[i].isChecked){
            this.groupList.push({ "ClientCode": this.clientHolddata[i].ClientCode, "ScripCode": Number(this.clientHolddata[i].SCRIPCODE), "Hold": 1 });
            this.confirmList.push({ "ClientCode": this.clientHolddata[i].ClientCode, "ContractName": this.clientHolddata[i].ContractName});
        }
      }

      this.displyPopupText2(this.confirmList,this.groupList,this.tokendata, this.userid);
    }
    }

  /**
* On click of pdf/excel icon
*/
  onPdfExcelDownload(type: any) {
    this.commonService.setClevertapEvent('Riskreport_FnO', { 'PartnerCode': localStorage.getItem('userId1') });
    if (this.reportData && this.reportData.length > 0) {
      this.dataLoad = true;
      let info: any = [];
      let head = [["Client Code", "Contract Name", "Cash Available Quantity", "BOD Quantity", "HOLD", "LTP (Rs)", "MoneynessType", "Product Type", "SCRIPCODE", "Spot price", "Today NetQuantity", "Total NetQuantity"]];
      this.reportData.forEach((element: any) => {
        info.push([element.ClientCode, element.ContractName, element.CashAvailableQuantity, element.BODQuantity, element.HOLD, element.LTP, element.MoneynessType, element.ProductType, element.SCRIPCODE, element.Spotprice, element.TodayNetQuantity, element.TotalNetQuantity])
      })
      if (type === 'pdf') {
        this.commonService.savePdfFile(head, info);
        this.dataLoad = false;
      } else {
        this.commonService.exportDataToExcel(head[0], info, 'Hold Physical FNO Report');
        this.dataLoad = false;
      }
    } else {
      this.toast.displayToast('No Data Found');
    }
  }
}
