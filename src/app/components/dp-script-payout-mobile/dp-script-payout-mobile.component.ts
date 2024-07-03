import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-dp-script-payout-mobile',
  templateUrl: './dp-script-payout-mobile.component.html',
  styleUrls: ['./dp-script-payout-mobile.component.scss'],
})
export class DpScriptPayoutMobileComponent implements OnInit {

  public dpScripData: any[] = [];
  public dataLoad = false;

  constructor(private route: ActivatedRoute,private toast: ToasterService, private storage: StorageServiceAAA, private wireReqService: WireRequestService, public commonService: CommonService) { }

  ngOnInit() {
   this.dpInit(); 
  }

  dpInit(){
    this.storage.get('userID').then((userID) => {
        this.storage.get('userType').then(type => {
            if (type === 'RM' || type === 'FAN') {
                this.storage.get('bToken').then(token => {
                    this.dpScriptList(token,userID)
                })
            } else {
                this.storage.get('subToken').then(token => {
                    this.dpScriptList(token,userID)
                })
            }
        })
    });
  }

  dpScriptList(token: any, userId: any){
    let dpScriptObj: any;
    this.route.queryParams
      .subscribe(params => {
        if(Object.keys(params).length === 0){
          dpScriptObj = JSON.parse(localStorage.getItem('dpScriptObj') || "{}");
        }
        else{
          dpScriptObj = params;
          localStorage.setItem('dpScriptObj', JSON.stringify(params));
        }
      }
    );
    this.dataLoad = true;
    this.wireReqService.getDpScript(token, dpScriptObj, userId).subscribe((res: any) => {
        if(res['Head']['ErrorCode'] == 0){
            if(res['Body'].length > 0){
                this.dpScripData = res['Body'];
                this.dataLoad = false;
            }
        }
        this.dataLoad = false;
    });
}

iconClick(dataObj: any){
  dataObj.onClick = !dataObj.onClick;
}

  /**
  * On click of pdf/excel icon
  */
  onPdfExcelDownload(type: any) {
    this.commonService.setClevertapEvent('DPscripPayout', { 'PartnerCode': localStorage.getItem('userId1') });
    if (this.dpScripData && this.dpScripData.length > 0) {
      this.dataLoad = false;
      let info: any = [];
      let head = [["Client Code", "AppDt", "Dp Remark", "Entry Date", "Partner Code", "Qty", "Risk Remark", "Script Name", "Slip No", "ClsPrice", "Dispute", "Status"]];
      this.dpScripData.forEach((element) => {
        info.push([element.ClientCode, moment(element.AppDt).format('DD/MM/YYYY'), element.DpRemark, moment(element.EntryDate).format('DD/MM/YYYY'), element.PartnerCode, element.Qty, element.RiskRemark, element.ScriptName, element.SlipNo, element.ClsPrice, element.Dispute, element.Status])
      })
      if (type === 'pdf') {
        this.commonService.savePdfFile(head, info);
        this.dataLoad = true;
      } else {
        this.commonService.exportDataToExcel(head[0], info, 'DP Scrip payout');
        this.dataLoad = true;
      }
    } else {
      this.toast.displayToast('No Data Found');
    }
  }
}
