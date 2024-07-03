import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-summary-confirm-modal',
  providers: [WireRequestService],
  templateUrl: './summary-confirm-modal.component.html',
  styleUrls: ['./summary-confirm-modal.component.scss'],
})
export class SummaryConfirmModalComponent implements OnInit {

  @Input() HoldBlockSellandBranchRemarkIDList: any;

  constructor(private router: Router,private storage: StorageServiceAAA,private modalController: ModalController, private commonService: CommonService,public toast: ToasterService,private wireReqService: WireRequestService) { }

  ngOnInit() {}
  dismiss(){
		this.modalController.dismiss();
	}
  save(){
    if(this.HoldBlockSellandBranchRemarkIDList.length > 0){
      this.storage.get('selectedBranch').then((branch) => {
        this.storage.get('clientToken').then((token) => {
          this.wireReqService.editSummaryReport(JSON.parse(localStorage.getItem("token") || "{}"), this.HoldBlockSellandBranchRemarkIDList)
          .subscribe((res: any) => {
            if(res['Head']['ErrorCode'] == 0){
              this.commonService.setClevertapEvent('reports_risk_client_summary_submit');
              this.toast.displayToast(res['Body']['Status']);
              this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
                this.modalController.dismiss();
                this.router.navigate(['/client-summary-mobile'],{ queryParams: { branch: branch, token: token } })
                })
            }
            else{
              this.toast.displayToast(res['Head']['ErrorDescription']);
            }
            });
        })
      })
    }
    else{
      this.toast.displayToast("Kindly select the BR Remark to submit the request");
    }
  }
}
