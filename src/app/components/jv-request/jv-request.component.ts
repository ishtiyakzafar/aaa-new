import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import * as moment from 'moment';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StatusRequestComponent } from '../status-request/status-request.component';

@Component({
	selector: 'app-jv-request',
	providers: [WireRequestService],
	templateUrl: './jv-request.component.html',
	styleUrls: ['./jv-request.component.scss'],
})
export class JvRequestComponent implements OnInit, OnChanges {
	@Input() jvReqStatusObj: any;
	jvRequestList: any[] = [];
	moment: any = moment;
	applyjvReqPage: boolean = false;
	clientCodeList: any = [];
	dataLoad: boolean = false;
	searchClientCode: any;
	displayStatusBtn:boolean = false;
	userIdValue:any;
	tokenValue:any;
	constructor(private modalController: ModalController, private router: Router, private storage: StorageServiceAAA, private wireReqService: WireRequestService,
		private commonService: CommonService, private platform: Platform, public toast: ToasterService) { }
	ngOnChanges(changes: SimpleChanges): void {
		if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
			this.jvReqStatusObj = this.commonService.getData() ? this.commonService.getData() : this.jvReqStatusObj;
			this.applyjvReqPage = false;
			if (this.jvReqStatusObj) {
				this.InitJvRequest();
			}
		}
	}

	ngOnInit() {
		this.jvReqStatusObj = this.commonService.getData() ? this.commonService.getData() : this.jvReqStatusObj;
		if (this.platform.is('mobile') && !(this.jvReqStatusObj && this.jvReqStatusObj.isDesktopCall)) {
			if (this.jvReqStatusObj) {
				this.InitJvRequest();
			}
		}
	}

	// coming soon popup when click donwload option
	comingOption(event: any) {
		this.commonService.comingSoon(event, 'Coming Soon', 'coming')
	}

	InitJvRequest() {
		this.jvRequestList = [];
		this.dataLoad = false;
		this.displayStatusBtn = false
		this.storage.get('userID').then((userID) => {

			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.userIdValue = userID;
						this.tokenValue = token;
						this.jvReqStatusList(token, userID)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.userIdValue = userID;
						this.tokenValue = token;
						this.jvReqStatusList(token, userID)
					})
				}

			})
		})
	}

	jvReqStatusList(token: any, userId: any) {
		// console.log(this.jvReqStatusObj);
		this.storage.get('setAccessChecker').then((accessChecker) => {
			if(accessChecker.includes("JVEntry")){
				this.displayStatusBtn = true
			}
		})
		this.wireReqService.getjvReqStatus(token, this.jvReqStatusObj, userId).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
				if (res['Body']['objJVRequestStatusResBody'].length > 0) {
					this.jvRequestList = res['Body']['objJVRequestStatusResBody']
				}
				else {
					this.applyjvReqPage = true;
				}
				setTimeout(() => {
					this.dataLoad = true;
				}, 500);

			}
			else {
				this.applyjvReqPage = true;
				setTimeout(() => {
					this.dataLoad = true;
				}, 500);
			}

		})

	}

	async cancelRequestPopup() {
		const modal = await this.modalController.create({
			component: StatusRequestComponent,
			cssClass: 'superstars cancel-request jv-request',
			componentProps: {
				"title": "Cancel Request",
				"msgContent": "To cancel request, kindly contact your IRA.",
				"buttonVisibility": true
			}
		})
		return await modal.present();
	}

	goBack() {
		window.history.back();
	}
	goToCreateRequest() {
		if (this.platform.is('desktop')) {
			this.router.navigate(['/wire-requests', "jv-request"]);
		}
		else {
			this.router.navigate(['jv-insert']);
		}
	}

	
    jvApprovalRejRequest(reqStatus: any, Obj: any){
		this.jvApproRejBtn(this.tokenValue, this.userIdValue,reqStatus,Obj)
	}
	
	jvApproRejBtn(token: any, userID: any, status: any, obj: any){
		let passObj = {
			"RMCode": userID,
			"Clientcode": obj.ClientCode,
			"Remark": obj.Remark,
			"SerialNo": obj.SerialNumber,
			"Status": status
		}
		// console.log(token);
		this.wireReqService.getJvReuestStatus(token,passObj).subscribe((res) => {
			if(res['Head']['ErrorCode'] == 0 && res['Body']['Message'] == "Success"){
				this.toast.displayToast('Status has been updated successfully');
				setTimeout(() => {
					this.InitJvRequest();
				}, 2000);
			}
			else{
				this.toast.displayToast(res['Body']['Message']);
			}
		})
	}

}
