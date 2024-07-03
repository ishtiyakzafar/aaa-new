import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Subscription } from 'rxjs';
import { LoginService } from '../../pages/login/login.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TotalClientService } from '../../components/total-clients/total-clients.service';
import { CommonService } from '../../helpers/common.service';
import { ClientsDetailsModelComponent } from '../../components/clients-details-model/clients-details-model.component';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-unique-clients',
	providers: [TotalClientService, LoginService],
	templateUrl: './unique-clients.page.html',
	styleUrls: ['./unique-clients.page.scss'],
})
export class UniqueClientsPage implements OnInit {
	public ascending: boolean = true;
	public clientCode: any = null;
	private subscription? : any;
	public userID: any = null;
	public totalClients: any = null;
	public totalSIPValue: any = null;
	public clientListData: any = [];
	public totalClientData: any = [];
	public searchTerm: any = null;
	public dataLoad: boolean = false;

	order: string = '';
	reverse: boolean = false;
	public datas: any[] = [
	];
	public placeholderInput: string = 'Type Client Code / PAN';
	public clientBlockSegmentValue: string = "clientCode";
	public segmentButtonOption: any[] = [
		{ name: 'Client Code / PAN', value: 'clientCode' },
		{ name: 'Name', value: 'clientName' }
	]
	profileContact: any;
	profileMail: any;
	filterObj: any = {
		PageNo: 1,
		SortBy: 'clientCode',
		SortOrder: 'asc',
		SearchBy: null,
		SearchText: null
	}

	public searchValue = null;

	public wait = false;

	public enableNext = false;
	HoverdataLoad: boolean = true;
	public toast: any;
	constructor(
		private orderPipe: OrderPipe,
		private commonService: CommonService,
		private storage: StorageServiceAAA,
		private serviceFile: TotalClientService,
		private modalController: ModalController,
		private LoginService: LoginService, public toastController: ToastController,
		private router: Router) { }

	ngOnInit() {
		/* this.storage.get('userID').then((userID) => {
			this.userID = userID;
			// this.getData();
		})
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getData(token);
				})
			} else {
				this.storage.get('sToken').then(token => {
					this.getData(token);
				})
			}
		}) */

		this.storage.get('empCode').then(code => {
			this.clientCode = code;
			if (code) this.getDataFromStorage();
			else {
				this.storage.get('userID').then((userID) => {
					this.userID = userID;
					this.getDataFromStorage();
				})
			}
		})

		// this.storage.get('pDetails').then((profileDetails) => {
		// 	this.profileContact = profileDetails.MobileNo;
		// 	this.profileMail  = profileDetails.Email;
		// 	console.log(this.profileContact);
		// 	console.log(this.profileMail);
		// })
		// this.orderPipe.transform(this.datas, 'clientName');
	}



	segmentChange() {
		if (this.clientBlockSegmentValue === 'clientName') {
			this.placeholderInput = 'Type Name';
		} else {
			this.placeholderInput = 'Type Client Code / PAN';
		}
	}

	public getData(token: any) {
		this.subscription = new Subscription();
		// const params = {
		// 	Loginid: this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID,
		// 	type: 'All'
		// }
		// this.dataLoad = false;
		let passObj: any = {};

		passObj = this.filterObj;
		passObj['Loginid'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
		passObj['type'] = 'All';
		
		this.subscription.add(
			this.serviceFile
				.clientList(token, passObj)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						this.wait = false;

						this.totalClientData = res['Body']['AAAClients'][0];
						if (res['Body']['EquityClientAUM'].length === 0) {
							this.enableNext = false;
							this.dataLoad = true;
						} else {
							this.clientListData = res['Body']['EquityClientAUM'];

							if (this.filterObj.PageNo === 1) {
								this.datas = [];
							}
							this.clientListData.forEach((element: any) => {
								this.datas.push({
									clientId: element['ClientCode'] ? element['ClientCode'] : '-',
									clientName: element['ClientName'] ? element['ClientName'] : '-',
									aum: this.commonService.numberFormatWithCommaUnit(element['AUM']),
									afyp: this.commonService.numberFormatWithCommaUnit(element['AFYP'])
								})
							});
							this.dataLoad = true;
							this.enableNext = true;
						}
						this.totalClients = this.commonService.formatNumberComma(this.totalClientData['TotalClients']);
						// this.totalSIPValue = this.commonService.numberFormatWithCommaUnit(this.totalClientData['TotalSIPValue']);

					} else {
						this.enableNext = false;
						this.dataLoad = true;
						this.clientListData = [];
						this.totalClientData = [];
						this.datas = [];
					}
				})
		)
	}

	public getDataFromStorage() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getData(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getData(token);
				})
			}
		})
	}

	public loadData(event: any) {
		setTimeout(() => {
			event.target.complete();
			// App logic to determine if all data is loaded
			// and disable the infinite scroll
			/* if (this.data.length === this.filterObj['totalRecords']) {
			  event.target.disabled = true;
			} */
			if (this.enableNext) {
				this.filterObj.PageNo += 1;
				// this.getData();
				this.getDataFromStorage();
			} else event.target.disabled = true;
		}, 1000);

	}

	public searchFilter() {
		if (this.searchValue === null || this.searchValue === '' || this.searchValue === undefined) {
			this.filterObj = {
				PageNo: 1,
				SortBy: 'clientcode',
				SortOrder: 'asc',
				SearchBy: null,
				SearchText: null
			}
			this.dataLoad = false;
			this.datas = [];
			this.enableNext = false;
			this.getDataFromStorage();
		} else {
			this.filterObj['SearchText'] = this.searchValue;
			this.filterObj['SearchBy'] = this.clientBlockSegmentValue;
			this.filterObj['PageNo'] = 1;
			this.dataLoad = false;
			this.datas = [];
			this.enableNext = false;
			this.getDataFromStorage();
		}
	}

	// sorting function for column
	setOrder(value: string) {
		if (this.datas.length) {
			this.dataLoad = false;
			if (this.order === value) {
				this.reverse = !this.reverse;
			}
			this.order = value;

			this.datas = [];
			this.filterObj.PageNo = 1;
			this.filterObj.SortBy = value;
			this.filterObj.SortOrder = this.reverse ? 'asc' : 'desc';
			if (this.reverse) {
				this.ascending = true;
			} else {
				this.ascending = false;
			}
			if (!this.wait) {
				this.wait = true;
				this.getDataFromStorage();
			}
		} else return;
	}

	public goBack() {
		window.history.back();
	}
	// redirect for dial the contact no
	getCallMailData(clientId: any, params: any) {
		//window.location.href = 'tel:'+this.profileContact;
		this.HoverdataLoad = false;
		// console.log(event);
		// console.log(clientId);
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getProfileParams(token, clientId, params)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getProfileParams(token, clientId, params)
				})
			}
		})
	}


	getProfileParams(token: any, clientID: any, type: any) {
		const params = {
			UserCode: clientID,
			UserType: 4
		}

		this.subscription.add(
			this.LoginService
				.getRMProfile(params, token)
				.subscribe((response: any) => {
					if (response['Head']['ErrorCode'] == 0) {
						const pDetails = response['Body'];
						// console.log(response['Body']);
						if (type == 'call') {
							this.profileContact = response['Body']['ClientMobileNo'];
							window.location.href = 'tel:' + response['Body']['ClientMobileNo'];
						}
						else {
							this.profileMail = response['Body']['ClientEmail'];
							window.location.href = 'mailto:' + this.profileMail;
						}

						//this.profileMail = response['Body']['Email']
						setTimeout(() => {
							this.HoverdataLoad = true;
						}, 200);
					}
					else {
						if (type == 'call') {
							this.profileContact = "No Contact Found";
							this.showToaster(this.profileContact);
						}
						else {
							this.profileMail = "No Mail Found";
							this.showToaster(this.profileMail);
						}

						//this.showToaster(this.profileContact);
						setTimeout(() => {
							this.HoverdataLoad = true;
						}, 200);
					}

				})
		)
	}

	async showToaster(msg: any) {
		this.toast = await this.toastController.create({
			message: msg,
			duration: 4000,
			cssClass: "textaligntoast"
		});
		this.toast.present();
	}


	// redirect for profile
	async goForProfile(ID?: any) {
		const modal = this.modalController.create({
			component: ClientsDetailsModelComponent,
			componentProps: { "IndParams": '', clientID: ID },
			cssClass: 'superstars client-details'
		});
		return (await modal).present();
	}

	async goToClientDetails(data: any){
		let checkClientCode = await this.commonService.matchClientCode(data.clientId);
		// if(checkClientCode){
			this.storage.get('userType').then(type => {
				if (type == 'RM' || type == 'FAN') {
				this.router.navigate(['/client-details', data.clientId, data.clientName.split(' ').join('-')]);
				}
				else{
				this.router.navigate(['/client-details', data.clientId, '-']);
				}
			})
		// }
		// else{
		// 	this.commonService.displyPopupText()
		// }

	}

	ngOnDestroy() {
		this.subscription =	this.subscription.unsubscribe();
	}

}
