import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-client-summary-remarks',
  providers: [WireRequestService],
  templateUrl: './client-summary-remarks.component.html',
  styleUrls: ['./client-summary-remarks.component.scss'],
})
export class ClientSummaryRemarksComponent implements OnInit {
 // @Output() private passEntry = new EventEmitter<any>();
  equityBlockTabValue = 'equity';
  btnEnable = false;
  selectRemark:any;
  rowIndex:any;
  isChecked!:boolean;
  remarkNoInList:any;
  logInCode:any;
  dataLoad:boolean = true;
  checkbox:any;
  PartnerRemark:any;
  selectSegment:any;

  constructor(private modalController: ModalController, private navParams: NavParams, private storage: StorageServiceAAA, private wireReqService: WireRequestService, public toast: ToasterService) { }

  ngOnInit() {
    this.rowIndex = this.navParams.data['Index'];
    this.logInCode = this.navParams.data['clientCode'];
    this.checkbox = this.navParams.data['checkbox'];
    this.PartnerRemark = this.navParams.data['Remark']
    this.isChecked = this.checkbox == "1" ? true: false;
    this.selectSegment = this.PartnerRemark;
   // String year = credits < 30 ? "freshman" : credits <= 59 ? "sophomore" : credits <= 89 ? "junior" : "senior";

    if(this.selectSegment == 'Client done Net transfer'){
      this.remarkNoInList = '4'
    }
    else if(this.selectSegment == 'Cheque collected- CMS updated'){
      this.remarkNoInList = '1'
    }
    else if(this.selectSegment == 'Shares received as additional margin'){
      this.remarkNoInList = '3'
    }
    else if(this.selectSegment == 'Cheque Cleared but credit not given'){
      this.remarkNoInList = '6'
    }
    else if(this.selectSegment == 'Liquid fund sold'){
      this.remarkNoInList = '7'
    }


    
    // console.log(this.selectSegment);
    // console.log(this.remarkNoInList);
  }

  async dismiss() {
    await  this.modalController.dismiss({
      dismissed: true,
      passData:0
    });
  }

  checkValue(event: any){
    // console.log(event);
    this.isChecked = event;
    this.btnEnable = true;
 }

  segmentSelect(remarkNo: any){
    this.remarkNoInList = remarkNo
    // console.log(remarkNo)
  }
  
  segmentChanged(event: any){
    this.btnEnable = true;
    // this.selectRemark = event 
  }

  submitRemark(){
    this.dataLoad = false;
    this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.editSummaryData(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.editSummaryData(token)
				})
			}

		})

 
  }

  editSummaryData(token: any){
    let obj = {
      LoginId: this.logInCode,
      HoldBlockSell:this.isChecked ? "1": "0",
      BranchRemarkID: this.remarkNoInList,
      MakerId: "C122883"
    }
    // console.log(obj);
    this.wireReqService.editSummary(token, obj).subscribe((res: any) => {
      this.dataLoad = true;
      if(res['Head']['ErrorCode'] == 0){
        this.toast.displayToast(res['Body']['Status']);
        
        this.modalController.dismiss({
          dismissed: true,
          passData:1
        });
      }
      else{
        this.toast.displayToast(res['Head']['ErrorDescription']);
      }
    })


  }

}
