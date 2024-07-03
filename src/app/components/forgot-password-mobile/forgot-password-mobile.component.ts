import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ForgotPasswordService } from './forgot-password.service';
import { Router } from '@angular/router';
import { LoginService } from '../../pages/login/login.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { URLS } from '../../../config/api.config';

@Component({
	selector: 'app-forgot-password-mobile',
	providers: [ LoginService, ForgotPasswordService ],
	templateUrl: './forgot-password-mobile.component.html',
	styleUrls: ['./forgot-password-mobile.component.scss'],
})
export class ForgotPasswordMobileComponent implements OnInit {

	isFocusUser: boolean = false;
	isFocusPassword: boolean = false;

	firstForm: boolean = true;
	secondForm: boolean = false;

	passwordVisible: boolean = false;

	public userID: any = null;
	public userType: any = null;
	public password: any = null;

	private subscription: any;
	public loading: boolean = false;

	constructor(public modalController: ModalController,
		private toast: ToasterService,
		private loginServiceFile: LoginService,
		private router: Router,
		private forgotService: ForgotPasswordService,
		private commonService: CommonService) { }

	ngOnInit() {
		this.commonService.analyticEvent('Forgot_Password', 'Forgot Password');
	}

	submit() {
		if(this.commonService.inputRestriction(this.userID)){
			this.toast.displayToast("Invalid Characters are not allowed");
			return;	
		}

		// const params = {
		// 	head: {
		// 		RequestCode: "CVUserType01",
		// 		Key: URLS.,
		// 		AppVer: "1.0.22.0",
		// 		AppName: "AAA",
		// 		OsName: "Android"
		// 	},
		// 	body: {
		// 		UserCode: this.userID
		// 	}
		// }

		this.subscription = new Subscription();

		this.subscription.add(
			this.loginServiceFile
				.getUserType(this.userID)
				.subscribe((response: any) => {
					if (response['Body']['Status'] == 'SUCCESS' && response['Body']['ClientType'] !== 'INVALID CLIENT') {
						this.userType = response['Body']['ClientType'];
						if (this.userType === 'SUB BROKER') {
							const params = 'RqtpAs=PM2SLMF5T';
							const URL = environment['forgotPasswordURL'] + '?' + params;
							this.modalController.dismiss();
							window.open(URL);
						} else if (this.userType === 'RM' || this.userType === 'FAN') {
							this.firstForm = false;
							this.secondForm = true;
						} else {
							this.toast.displayToast('Something went wrong');
						}
					} else {
						this.toast.displayToast(response['Body']['Message']);
						this.dismiss();
					}
				})
		)
	}

	public inputChange(event: any) {
		this.userID = event.target.value;
	}

	public passwordChange(event: any) {
		this.password = event.target.value;
	}

	// call successfull popup
	async successfull() {
		if(this.commonService.inputRestriction(this.password)){
			this.toast.displayToast("Invalid Characters are not allowed");
			return;	
		}
		// this.dismiss();
		// this.secondForm = false;
		this.loading = true;
		const params = {
			"head": {
				"requestCode": "IIFLMarRQForgotManagerPassword",
				"key": URLS.forgotPass.key,
				"appVer": "1.0.22.0",
				"appName": "IIFLMarkets",
				"osName":"Android",
				"userType": localStorage.getItem('userType')
			},
			"body": {
				"ManagerCode": this.userID,
				"Password": this.password
			}
		}
		this.subscription = new Subscription();

		this.subscription.add(
			this.forgotService
			.checkPassword(params)
			.subscribe( (response: any) => {
				if (response['head']['status'] === '0') {
					if (response['body']['Status'] === 0) {
						this.toast.displayToast(response['body']['message'] ? response['body']['message'] : response['body']['Message']);
						this.router.navigate(['/login']);
					} else {
						this.toast.displayToast(response['body']['Message']);
					}
				} else {
					this.toast.displayToast(response['head']['statusDescription']);
				}
			})
		)
		
		// const modal = await this.modalController.create({
		// 	component: SuccessfullComponent,
		// 	cssClass: 'successfull-popup',
		// 	componentProps: {}
		// });

		// // modal.onDidDismiss().then( (res) => {
		// //   this.router.navigate(['/login']);
		// // })
		// return await modal.present();
	}

	dismiss() {
		this.modalController.dismiss();
	}

	focusUser() {
		this.isFocusUser = true;
	}

	focusOutUser(event: any) {
		this.isFocusUser = false;
		// this.checkUser(event.target.value);
	}

	focusPassword() {
		this.isFocusPassword = true;
	}

	focusOutPassword() {
		this.isFocusPassword = false;
	}

}
