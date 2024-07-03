import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';    
import { ModalController,AlertController } from '@ionic/angular';
import { GuestHavingBirthdayModalComponent } from '../../components/having-birthday-modal/guest-having-birthday-modal.component';
import { GuestNotInvestInSipComponent } from '../../components/not-invest-in-sip/guest-not-invest-in-sip.component';
import { GuestPmsAifLeadComponent } from '../../components/pms-aif-lead/guest-pms-aif-lead.component';
import { CookieService } from 'ngx-cookie-service';
import { StorageServiceAAA } from '../../../helpers/aaa-storage.service';
import { ToasterService } from '../../../helpers/toaster.service';
import { CommonService } from '../../../helpers/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-guest-dashboard-revamp',
	providers: [],
	templateUrl: './guest-dashboard.page.html',
	styleUrls: ['./guest-dashboard.page.scss'],
})
export class GuestDashboardRevampPage implements OnInit,OnDestroy {
	
	isDropDownVisible!: boolean;
	@Input() toggleChange: any;
	constructor(private router: Router,public modalController: ModalController,
		private storage: StorageServiceAAA, 
		public alertController: AlertController,
		private toast: ToasterService,
		private cookieService: CookieService,
		private commonService: CommonService,
		private route:ActivatedRoute
		){
			route.params.subscribe(val => {
                if(!localStorage.getItem("GuestMobileNumber")){
                    this.router.navigate(['/demo']);
                }
            });

		}

	ngOnInit(){
	}

	ngOnDestroy(): void {
		
	}
	equityBlockTabValue: any = 'Overall';
	equityBlockButton: any[] = [
		{ Name: 'Overall', Value: 'Overall', active: 1 },
		{ Name: 'Mutual Funds', Value: 'Mutual Funds', active: 0 },
		{ Name: 'Equity', Value: 'Equity', active: 0 },
		{ Name: 'Cross-Sell', Value: 'Cross-Sell', active: 0 }
	  ];
	equityBlockSegmentChanged(event: any, cashfutureTab: any) {
		//this.checkSegmentValue();
		 if(event == 'Overall'){
			this.equityBlockTabValue;
		}
		else if (event == 'Mutual Funds') {
		 this.equityBlockTabValue;
		}
		else if (event == 'Equity') {
		 this.equityBlockTabValue;
		}
		else if (event == 'Cross-Sell') {
		  this.equityBlockTabValue;
		}
		
	
	  }

	indiciesSlider={
		  delay: 2000,
	}

	async confirmLogout() {
		const alert = await this.alertController.create({
			cssClass: 'confirm-logout-alert',
			// header: 'Alert',
			// subHeader: 'Subtitle',
			message: 'Are you sure you want to exit?',
			// buttons: ['No', 'Yes'],
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Yes',
					handler: () => {
 						this.storage.clear();
						window.localStorage.clear();
						indexedDB.deleteDatabase('_ionicstorage');
 						if (window.location.hostname == 'localhost') {
							this.cookieService.deleteAll();
						} else {
							this.cookieService.deleteAll('/', '.indiainfoline.com');
						}
						this.toast.displayToast("Successfully exited");
						this.commonService.setClevertapEvent("Guest_Exit_Clicked", { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
						//this.commonService.triggerAppsflyerLogEvent('Guest_Exit_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
						this.router.navigate(['/demo']);
					}
				}
			]
		});

		await alert.present();
	}

	public overlayClicked(event: any) {
		event.preventDefault();
		this.isDropDownVisible = false;
	}
	
goBack() {
		window.history.back();
	}

	onAumClick(){
		this.commonService.setClevertapEvent("Guest_Dashboard_AUM_Clicked", { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		//this.commonService.triggerAppsflyerLogEvent('Guest_Dashboard_AUM_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		this.router.navigate(['/guest/guest-dashboard-aum']);
	  }
	  onBrokerageClick(){
		this.commonService.setClevertapEvent("Guest_Dashboard_Brokerage_Clicked", { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		//this.commonService.triggerAppsflyerLogEvent('Guest_Dashboard_Brokerage_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		this.router.navigate(['/guest/guest-dashboard-brokerage']);
	  }
	  onClientsClick(){
		this.commonService.setClevertapEvent("Guest_Dashboard_Clients_Clicked", { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		//this.commonService.triggerAppsflyerLogEvent('Guest_Dashboard_Clients_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		this.router.navigate(['/guest/guest-dashboard-clients']);
	  }

	  onAumMFClick(){
		this.router.navigate(['/guest/guest-dashboard-aum'],{ queryParams: {Tab: 'MF'}});
	  }
	  onBrokerageMFClick(){
		this.router.navigate(['/guest/guest-dashboard-brokerage'],{ queryParams: {Tab: 'MF'}});
	  }
	  onClientsMFClick(){
		this.router.navigate(['/guest/guest-dashboard-clients'],{ queryParams: {Tab: 'MF'}});
	  }

	  onAumFDClick(){
		this.router.navigate(['/guest/guest-dashboard-aum'],{ queryParams: {Tab: 'FD'}});
	  }
	  onBrokerageFDClick(){
		this.router.navigate(['/guest/guest-dashboard-brokerage'],{ queryParams: {Tab: 'FD'}});
	  }
	  onClientsFDClick(){
		this.router.navigate(['/guest/guest-dashboard-clients'],{ queryParams: {Tab: 'FD'}});
	  }

	async displyPopupManageQuickLink() {
		this.commonService.setClevertapEvent("Guest_BussOpps_Clicked", { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		//this.commonService.triggerAppsflyerLogEvent('Guest_BussOpps_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		const modal = await this.modalController.create({
			component: GuestHavingBirthdayModalComponent,
			cssClass: 'having-birthday-modal',
			backdropDismiss: true
		});
		modal.onDidDismiss()
			.then((data: any) => {
			});
		return (await modal).present();
	}

	async displyPopupNotInvest() {
		this.commonService.setClevertapEvent("Guest_BussOpps_Clicked", { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		//this.commonService.triggerAppsflyerLogEvent('Guest_BussOpps_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		const modal = await this.modalController.create({
			component: GuestNotInvestInSipComponent,
			cssClass: 'having-birthday-modal',
			backdropDismiss: true
		});
		modal.onDidDismiss()
			.then((data: any) => {
			});
		return (await modal).present();
	}

	async displyPopupPMS() {
		this.commonService.setClevertapEvent("Guest_BussOpps_Clicked", { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		//this.commonService.triggerAppsflyerLogEvent('Guest_BussOpps_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
		const modal = await this.modalController.create({
			component: GuestPmsAifLeadComponent,
			cssClass: 'having-birthday-modal',
			backdropDismiss: true
		});
		modal.onDidDismiss()
			.then((data: any) => {
			});
		return (await modal).present();
	}

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

	public async callBecomePartnerModal() {
		this.commonService.becomePartnerModal();
	}
	
}
