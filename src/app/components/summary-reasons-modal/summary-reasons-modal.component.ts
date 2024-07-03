import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-summary-reasons-modal',
  templateUrl: './summary-reasons-modal.component.html',
  styleUrls: ['./summary-reasons-modal.component.scss'],
})
export class SummaryReasonsModalComponent implements OnInit {

  public allRemarkData: any;
  @Input() dataObj: any;
  public remarkList:any[] = [
    {BranchRemarkID: '1', remarkCode: 'Cheque collected - CMS updated'},
    {BranchRemarkID: '2', remarkCode: 'Cheque on way - CMS will be updated by 11:00 am'},
    {BranchRemarkID: '3', remarkCode: 'Shares received as additional margin'},
    {BranchRemarkID: '4', remarkCode: 'Client done Net transfer'},
    {BranchRemarkID: '5', remarkCode: 'BTST (Buy Today Sell Tomorrow) Customer by 10 am'},
    {BranchRemarkID: '6', remarkCode: 'Cheque Cleared but credit not given'},
    {BranchRemarkID: '7', remarkCode: 'Liquid fund sold'}
  ];

  constructor(private modalController: ModalController,private commonService: CommonService, private storage: StorageServiceAAA) { }

    ngOnInit() {}
    dismiss(){
        this.modalController.dismiss();
    }
    listClick(remarkCode: any,BranchRemarkID: any){
      // this.allRemarkData = JSON.parse(localStorage.getItem('remarkData') || "{}");
      this.storage.get('remarkData').then((data) => {
        this.allRemarkData = {};
        if(data) this.allRemarkData = data;
      })

      if(this.allRemarkData.length > 0){
      for(let i=0;i<this.allRemarkData.length;i++){
        if(this.allRemarkData[i].ClientCode == this.dataObj.ClientCode){
          this.allRemarkData[i].RemarkCode = remarkCode;
          this.allRemarkData[i].BranchRemarkID = BranchRemarkID;
        }
      }
    }
      this.commonService.setRemarkData(this.allRemarkData);
      this.dismiss();
    }
}
