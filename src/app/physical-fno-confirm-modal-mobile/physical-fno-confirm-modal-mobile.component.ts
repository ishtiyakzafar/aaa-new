import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../helpers/common.service';
import { ToasterService } from '../helpers/toaster.service';
import { PhysicalFnoSuccessModalMobileComponent } from '../physical-fno-success-modal-mobile/physical-fno-success-modal-mobile.component';
import { WireRequestService } from '../pages/wire-requests/wire-requests.service';

@Component({
  selector: 'app-physical-fno-confirm-modal-mobile',
  providers: [ WireRequestService ],
  templateUrl: './physical-fno-confirm-modal-mobile.component.html',
  styleUrls: ['./physical-fno-confirm-modal-mobile.component.scss'],
})
export class PhysicalFnoConfirmModalMobileComponent implements OnInit {

  @Input() confirmList: any;
  @Input() groupList: any;
  @Input() tokendata: any;
  @Input() userid: any;

  constructor(private modalController: ModalController,private wireReqService: WireRequestService,private toast: ToasterService,private commonService: CommonService) { }

  ngOnInit() {}
  dismiss(){
		this.modalController.dismiss();
	  }

    async displyPopupText1() {
      const modal = this.modalController.create({
          component: PhysicalFnoSuccessModalMobileComponent,
          componentProps: {},
          cssClass: 'summary_confirm',
        backdropDismiss: true
        });
        return (await modal).present();
      } 
  

    onProceed(){
      this.wireReqService.holdSelectedReports(this.groupList, this.tokendata, this.userid).subscribe((res: any) => {
        if (res['Head']['ErrorCode'] == 5) {
          this.toast.displayToast(res['Head']['ErrorDescription']);
        }
        if (res['Head']['ErrorCode'] == 0) {
          this.modalController.dismiss();
          this.commonService.setClevertapEvent('reports_risk_hold_physical_submit');
          this.displyPopupText1();
          this.groupList=[];
          this.confirmList=[];
        }
      });
    }

}
