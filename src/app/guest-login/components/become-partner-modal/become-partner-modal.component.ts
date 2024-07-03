import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../../helpers/common.service';

@Component({
  selector: 'app-guest-become-partner-modal',
  templateUrl: './become-partner-modal.component.html',
  styleUrl: './become-partner-modal.component.scss',
})
export class BecomePartnerModalComponent implements OnInit {
  constructor(private modalController: ModalController, private commonService: CommonService) { }
 
    dismiss(){
		this.modalController.dismiss();
    }

    ngOnInit() {}

    /**
	 * @param redirectFor accepts param to redirect for new user 
	 */
	public redirectTo(redirectFor: any) {
		if (redirectFor === 'register') {
			this.commonService.setClevertapEvent('Guest_Onboarding_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
			//this.commonService.triggerAppsflyerLogEvent('Guest_Onboarding_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
			window.open('https://epartner.iifl.com/Referral');

		}
	}

}
