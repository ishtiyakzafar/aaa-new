import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import moment from "moment";
import { Router } from '@angular/router';
import { ToasterService } from '../../helpers/toaster.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-demap-list',
	providers: [WireRequestService],
	templateUrl: './demap-list.component.html',
	styleUrls: ['./demap-list.component.scss'],
})
export class DemapListComponent implements OnInit {
	@Input() cCode: any;
	dataLoad: boolean = true;
	showMsgDiv: boolean = false;
	bothMsg: boolean = false;
	onlySuccess: boolean = false;
	onlyFail: boolean = false;
	successMsg = '';
	failMsg = '';
	isChecked: boolean[] = [];
	demapList: any[] = [];
	selectedClients: any[] = [];
	clientMappingTableDetailCpy: any[] = [];
	tokenVal: any;
	searchText: any;
	endDate: string = moment().format('YYYY-MM-D');
	startDate: string = `${moment().format('YYYY')}-${moment().format('MM')}-01`;
	constructor(public toast: ToasterService, private storage: StorageServiceAAA, private modalController: ModalController, private wireReqService: WireRequestService, private router:Router) { }
	ngOnInit() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenVal = token;
					this.getMappedClients(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenVal = token;
					this.getMappedClients(token);
				})
			}
		})
	}

	getMappedClients(token?: any) {
		this.dataLoad = true;
		this.wireReqService
			.getMappedClients(this.cCode, token ? token : this.tokenVal)
			.subscribe((res: any) => {
				if (res["Head"]["ErrorCode"] == 0) {
					this.demapList = res["Body"];
					this.dataLoad = false;
				} else if (res["Head"]["ErrorCode"] == 1) {
					this.demapList = []
					this.clientMappingTableDetailCpy = []
					this.dataLoad = false;
				}
			});
	}

	selectclient(e: any, obj: any,i: any) {
		let sameClient = [];
		if (e.target.checked) {
			sameClient = this.demapList.filter((item) => {
				if (item.srno === obj.srno) {
					item['isChecked'] = true;
					return item;
				}
			});
			if (sameClient && sameClient.length > 0) {
				this.selectedClients = this.selectedClients.concat(sameClient);
			} else {
				this.selectedClients.push(obj)
			}
		}
		else {
			this.selectedClients = this.demapList.filter((item) => {
				if (item.srno === obj.srno) {
					item['isChecked'] = false;
				}
				if (item['isChecked']) {
					return item
				}
			});
		}
	}

	onDemapbtnClick() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenVal = token;
					this.onDemapClients(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenVal = token;
					this.onDemapClients(token);
				})
			}
		})
	}

	onDemapClients(token: any) {
		let data: any = [];
		this.selectedClients.forEach(element => {
			data.push({
				'PartnerCode': localStorage.getItem('userId1'),
				'AdminCode': element.admincode,
				'ClientCode': element.clientcode
			});
		});
		this.wireReqService.demapClient(data, token ? token : this.tokenVal)
			.subscribe((res: any) => {
				if (res["Head"]["ErrorCode"] == 0) {
					this.dataLoad = false;
					this.showMsgDiv = true;
					this.successMsg = res["Body"][0].Success?.trim().replace(/["']/g, "");
					this.failMsg = res["Body"][0].Fail?.trim().replace(/["']/g, "");
					this.bothMsg = this.failMsg != '' && this.successMsg != '';
					this.onlySuccess = this.successMsg != '' && this.failMsg == '';
					this.onlyFail = this.failMsg != '' && this.successMsg == '';
				} else if (res["Head"]["ErrorCode"] == 1) {
					this.dataLoad = false;
					this.showMsgDiv = true;
					this.dismiss();
					this.toast.displayToast(res['Body']['ErrorDescription']);
				}
			});
	}

	/**
	 * To close popup.
	 */
	async dismiss() {
		this.modalController.dismiss();
		if(this.showMsgDiv){
			this.router.navigate(['/wire-requests/client-mapping']);
			this.showMsgDiv = false;
		}
	}

	goBack() {
		window.history.back();
	}
}