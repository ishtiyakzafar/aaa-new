import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import moment from 'moment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';

@Component({
  selector: 'app-dp-scrip-payout',
  templateUrl: './dp-scrip-payout.component.html',
  styleUrls: ['./dp-scrip-payout.component.scss'],
})
export class DpScripPayoutComponent implements OnInit,OnChanges {

  public detailHeight!: number;
  public reverse: boolean = true;
  public order: string = 'ScriptName';
  public ascending: boolean = true;
  public dataLoad = false;
  searchValue: any;
  public dpScripData: any[] = [];
  public moment: any = moment;
  @ViewChild('detail') detail!: ElementRef;
  @Input() dpScriptObj: any;
  public val: string = 'asc';
  
  constructor(private storage: StorageServiceAAA, private commonService: CommonService, private toast: ToasterService, private wireReqService: WireRequestService) { }

  ngOnInit() {
    this.dpInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  setOrder(value: string) {
    this.reverse = !this.reverse;
    this.order = value;
    if (this.reverse) {
        this.ascending = true;
        this.val = 'asc';
    } else {
        this.ascending = false;
        this.val = 'desc';
    } 
}

  dpScriptList(token: any, userId: any){
    this.dataLoad = true;
    this.dpScripData = [];
    this.wireReqService.getDpScript(token, this.dpScriptObj, userId).subscribe((res: any) => {
        if(res['Head']['ErrorCode'] == 0){
            if(res['Body'].length > 0){
                this.dpScripData = res['Body'];
                res['Body'].forEach((element: any, index: any) => {
					        element.srNo = index;
                });
                this.dataLoad = false;
            }
        }
        this.dataLoad = false;
    });
}

  dropClick(id: any, arr: any) {
    // event.preventDefault();
        arr.forEach((element: any, ind: any) => {
            if (id !== element.srNo) {
                element['isVisible'] = false;
            } else {
                element['isVisible'] = element['isVisible'] ? false : true;
                if (element['isVisible']) {
                    setTimeout(() => {
                        this.detailHeight = this.detail.nativeElement.offsetHeight;
                    }, 100);
                }
            }
        });


}

  /**
     * On click of pdf/excel icon
     */
  onPdfExcelDownload(type: any) {
    this.commonService.setClevertapEvent('Summaries_dpscrippayout', { 'Login ID': localStorage.getItem('userId1') });
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
        setTimeout(() => {
          this.dataLoad = false;
				}, 2000);
      } else {
        this.commonService.exportDataToExcel(head[0], info, 'DP Scrip payout');
        this.dataLoad = true;
        setTimeout(() => {
          this.dataLoad = false;
				}, 2000);
      }
    } else {
      this.toast.displayToast('No Data Found');
    }
  }

}
