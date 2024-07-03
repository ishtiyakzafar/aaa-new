import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Subscription } from 'rxjs';
import { TotalClientService } from '../total-clients/total-clients.service';
import { LoginService } from '../../pages/login/login.service';
import { ClientsDetailsModelComponent } from '../clients-details-model/clients-details-model.component';
import { ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import {IonContent, Platform } from '@ionic/angular';
import moment from 'moment';
import { DatePipe } from '@angular/common'
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
	selector: 'app-unique-clients',
	providers: [TotalClientService, LoginService],
	templateUrl: './unique-clients.component.html',
	styleUrls: ['./unique-clients.component.scss'],
})
export class UniqueClientsComponent implements OnInit {
	@ViewChild(IonContent) content!: IonContent;	
	@Input() sendDataOnSearch: any;
	@Input() searchType: any;
	@Input() searchText: any;
	@Input() allClientData: any;
	@Input() loader: any;
	@Input() startDate: any;
	@Input() endDate: any;
	@Input() incorrectDate: any;
	@Input() isMFCSshow: any;
	public dashTabSelect: any ;
	public bodyParam: any;
	@Input() equityBlockTabValue: any;
	@Input() toggleState: any;
	public ascending: boolean = false;
	public clientCode = null;
	private subscription: any;
	public userID = null;
	public totalClients: any = null;
	public totalSIPValue: any = null;
	public clientListData: any = [];
	public totalClientData: any = [];
	public searchTerm: any = null;
	public dataLoad: any = false;
	HoverdataLoad: any = false;
	public val: string = 'asc';
	downloadShow:boolean = true;
	tablehide:boolean = true;
	public toggleVal: any;

	order: string = 'aum';
	reverse: boolean = false;
	public datas: any[] = [
	];

    // Remove below line
    dummyDatas: any[] = [
        {clientId: 'fdsfdas', clientName: 'fsdfsad', aum: 'fdsaf'},
        {clientId: 'fdsfdas', clientName: 'fsdfsad', aum: 'fdsaf'},
        {clientId: 'fdsfdas', clientName: 'fsdfsad', aum: 'fdsaf'}
    ]

	date=new Date();

	filterObj: any = {
		PageNo: 1,
		SortBy: 'aum',
		SortOrder: 'desc',
		Search: null,
		SearchText: null
	}

	public enableNext = false;

	public wait = false;

	profileContact: any;
	profileMail: any;
	public toast: any;
	userTypeValue:any;
	screenWidth:any;
	saveToken:any;
	isExcelDownloaded:boolean=false;
	public newClientCheck: any;

	constructor(
		private orderPipe: OrderPipe,	
		private commonService: CommonService,
		private storage: StorageServiceAAA,
		private serviceFile: TotalClientService,
		private modalController: ModalController,
		private LoginService: LoginService,
		private toastSer: ToasterService,
		private router: Router, public toastController: ToastController, private platform: Platform,
		public datepipe: DatePipe) { }

		ngOnChanges(){
			// this.dataLoad = false;
			// setTimeout(() => {
			// 	this.dataLoad = true;
			// }, 6000);
			this.newClientCheck = localStorage.getItem('isNewClientTab');
			this.toggleVal = localStorage.getItem('toggleSwitch');
			this.filterObj.SearchText = this.searchText;
			this.filterObj.Search = null;

			if(this.allClientData && this.allClientData.length == 0){
				if(!this.incorrectDate){
					this.datas = [];
				}
			}

			if (this.allClientData && this.allClientData.length > 19) {
				this.enableNext = true;
				// this.wait = false;
			}

			if(this.allClientData && this.allClientData.length > 0){
				this.datas = [];
				this.allClientData.forEach((element: any) => {
					this.datas.push({
						clientId: element['clientcode'] ? element['clientcode'] : (element['ClientCode'] ? element['ClientCode'] : '-'),
						clientName: element['ClientName'] ? element['ClientName'] : '-',
						aum: element['AUM'] && this.commonService.numberFormatWithCommaUnit(element['AUM']) ? this.commonService.numberFormatWithCommaUnit(element['AUM']) : ( element['TotalAUM'] && this.commonService.numberFormatWithCommaUnit(element['TotalAUM']) ? this.commonService.numberFormatWithCommaUnit(element['TotalAUM']) : '-'),
						afyp: element['AFYP'] && this.commonService.numberFormatWithCommaUnit(element['AFYP']) ? this.commonService.numberFormatWithCommaUnit(element['AFYP']) : '-',
						CM_GroupCD: element['CM_GroupCD'] ? element['CM_GroupCD'] : '-',
						OnboardingDate: element['OnboardingDate'] ? moment(element['OnboardingDate']).format('DD/MM/YYYY') : '-', 
					})
				});


				
				this.dataLoad = true;
			}

			this.storage.get('empCode').then(code => {
				this.clientCode = code;
			})
		
			if(this.sendDataOnSearch){
				if (!this.platform.is('desktop')) {
					this.content.scrollToTop();
				}
				this.enableNext = false;
				this.dataLoad = false;
				this.datas = [];
				this.filterObj.PageNo = 1;
				let obj = {
					Search: this.searchType,
					SearchText: this.searchText
				}
				this.getDataFromStorage(obj)
			}
		}

	ngOnInit() {
		this.dashTabSelect = localStorage.getItem('DashTabSelect');
		switch (this.dashTabSelect) {
			case 'Mutual Funds':
			case 'Cross-Sell':
			this.downloadShow = false;
			this.tablehide = false;
				break;
			default:
				this.downloadShow = true;
				this.tablehide = true;
				break;
	}
		this.screenWidth = window.innerWidth;
		this.toggleVal = localStorage.getItem('toggleSwitch');
		this.newClientCheck = localStorage.getItem('isNewClientTab');
		this.storage.get('userID').then((userID) => {
			this.userID = userID;
		})	
		// this.getDataFromStorage()
		
			/* this.storage.get('userType').then(type => {
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
		
		// this.commonService.eventObservable.subscribe((obj) => {
		// 	console.log(obj)
		// 	if (obj && obj['event'] === 'uniqueClientsEvent') {
		// 		this.clientCode = obj['data']['clientCode'];
		// 		this.getDataFromStorage();
		// 		return;
		// 	} 
		// 	else if (obj && obj['event'] === 'uniqueClientsSearchText' && !this.wait) {
		// 		this.wait = true;
		// 		const temp = obj['data'];
		// 		this.datas = [];
		// 		this.dataLoad = false;
		// 		this.getDataFromStorage(temp);
		// 		return;
		// 	}
		// })

		this.storage.get('empCode').then(code => {
			this.clientCode = code;
			this.dataLoad = false;
			if (this.clientCode) this.getDataFromStorage();
		})

		// this.storage.get('pDetails').then((profileDetails) => {
		// 	this.profileContact = profileDetails.MobileNo;
		// 	this.profileMail  = profileDetails.Email;
		// 	console.log(this.profileContact);
		// 	console.log(this.profileMail);
		// })
		// this.orderPipe.transform(this.datas, 'clientName');
	}

	divScroll(event: any) {
		const tableHeight = event.target.offsetHeight;
		const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;

		if (tableScrollTop >= scrollerEndPoint - 100 && this.enableNext && !this.wait) {
			this.wait = true;
			this.filterObj.PageNo += 1;
			this.filterObj['SearchText'] = this.filterObj.SearchText;
			this.filterObj['Search'] = this.filterObj.Search;
			this.getDataFromStorage(this.filterObj);
		}
	}

	public gettingFromdate() {
		const d = new Date();
		let month = d.getMonth();
		let year = new Date().getFullYear();
	    let startDate = moment([year, month ]);
		let endDate = moment(startDate).endOf('month');
	
	    return { start: startDate, end: endDate };
	}


	public getData(token: any, obj?: any) {
		this.subscription = new Subscription();
		// const params = {
		// 	Loginid: this.clientCode,
		// 	type: 'All'
		// }
		// this.dataLoad = false;
		let passObj: any = {};

		if (obj) {
			this.filterObj['Search'] = (obj['SearchText'] == null || obj['SearchText'] == '' ? null : obj['Search']);
			this.filterObj['SearchText'] = obj['SearchText'];
			this.filterObj['PageNo'] = obj['page'] ? obj['page'] : this.filterObj.PageNo;
			// this.filterObj['ToDate']  =this.datepipe.transform(this.date, 'yyyy-MM-dd');
			passObj = this.filterObj;
		} else passObj = this.filterObj;

		switch (this.dashTabSelect) {
			case 'Mutual Funds':
				passObj['Product'] = 'MF';
				break;
			case 'Cross-Sell':
				passObj['Product'] = 'Cross_sell';
				break;
			case 'Overall':
				passObj['Product'] = 'OVERALL';
				break;
			default:
				passObj['Product'] = localStorage.getItem('DashTabSelect');
				break;
		}
		
		passObj['Role'] = localStorage.getItem('userChannel'),
		passObj['LoginID'] = localStorage.getItem('userId1'),
		passObj['PartnerID'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : localStorage.getItem('userId1'),
		passObj['DataType'] = localStorage.getItem('toggleSwitch'),
		passObj['ClientType'] = this.newClientCheck == 'NewClient' && this.equityBlockTabValue == 'NewClient' ? "NewClients" : "OVERALL",
		passObj['UserType'] = localStorage.getItem('userType'),
		// let datevalue=this.gettingFromdate();
		// if(this.startDate == null || this.endDate == null){
		// 	// passObj['FromDate']=this.datepipe.transform(datevalue.start,'yyyyMMdd');
		// 	// passObj['ToDate']=this.datepipe.transform(this.date, 'yyyyMMdd');
		// 	passObj['FromDate']=this.startDate;
		// 	passObj['ToDate']=this.endDate;
		// }
		// else{
		// 	// passObj['FromDate']=this.datepipe.transform(this.startDate,'yyyyMMdd');
		// 	// passObj['ToDate']=this.datepipe.transform(this.endDate, 'yyyyMMdd');
		// 	passObj['FromDate']=this.startDate;
		// 	passObj['ToDate']=this.endDate;
		// }
		
		this.subscription.add(
			this.serviceFile
				.fetchClientDetails(token, passObj)
				.subscribe((res: any) => {
					
					if (res['Head']['ErrorCode'] == 0) {
						this.wait = false;
						// this.totalClientData = res['Body']['AAAClients'][0];

						if (res['Body'].length > 19) {
							this.enableNext = true;
						}

						if (res['Body'].length === 0) {
							this.clientListData = [];
							//this.datas = [];
							this.enableNext = false;
							this.dataLoad = true;
						} else {
							this.clientListData = res['Body'];

							if (this.filterObj.PageNo === 1) {
								this.datas = [];
								this.dataLoad = true;
							}

							this.clientListData.forEach((element: any) => {
								this.datas.push({
									clientId: element.clientcode ? element.clientcode : '-',
									clientName: element.ClientName ? element.ClientName : '-',
									aum: element['TotalAUM'] && this.commonService.numberFormatWithCommaUnit(element['TotalAUM']) ? this.commonService.numberFormatWithCommaUnit(element['TotalAUM']) : '-',
									OnboardingDate: element.OnboardingDate ? moment(element.OnboardingDate).format('DD/MM/YYYY') : '-',
									Mobile: element.MobileNumber ? element.MobileNumber : 'No Contact Found',
									Mail: element.EmailId ? element.EmailId : 'No Mail Found',
									CM_GroupCD: element['PartnerCode'] ? element['PartnerCode'] : '-',
								})
							});

							this.enableNext = true;
							this.dataLoad = true;
						}
						// this.totalClients = this.commonService.formatNumberComma(this.totalClientData['TotalClients']);
						// this.totalSIPValue = this.commonService.numberFormatWithCommaUnit(this.totalClientData['TotalSIPValue']);

						// this.dataLoad = true;
					} else {
						this.enableNext = false;
						this.clientListData = [];
						this.totalClientData = [];
						this.datas = [];
						this.dataLoad = true;
					}
				})
		)
	}

	public getDataFromStorage(optionalParams?: any) {
		//this.dataLoad = false;
		this.storage.get('userType').then(type => {
			this.userTypeValue = type;
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.saveToken = token;
					this.getData(token, optionalParams);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.saveToken = token;
					this.getData(token, optionalParams);
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
				this.getDataFromStorage();
				
			} 
			else event.target.disabled = true;
		}, 1000);

	}


	// sorting function for column
	setOrder(value: string) {
		this.dataLoad = false;
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		if (!this.platform.is('desktop')) {
			this.content.scrollToTop();
		}
		
		this.enableNext = false;
		this.dataLoad = false;
		this.datas = [];
		this.filterObj.PageNo = 1;
		this.filterObj.SortBy = value;
		this.filterObj.SortOrder = this.reverse ? 'asc' : 'desc';
		if (this.reverse) {
			this.ascending = true;
			this.val = 'asc';
		} else {
			this.ascending = false;
			this.val = 'desc';
		}
		this.getDataFromStorage(this.filterObj);
	}

	
	async goToClientDetails(data: any){
		//let checkClientCode = await this.commonService.matchClientCode(data.clientId);
		// if(checkClientCode){
			if (this.platform.is('desktop') || this.screenWidth > 1360) {
				const clientDetail = {ClientCode: data.clientId, ClientName: data.clientName}
				localStorage.setItem('searchKey',"true")
				localStorage.setItem('searchObj', JSON.stringify(clientDetail))
				this.router.navigate(['/client-trades', 'clients']);
			}
			else {
				if (this.userTypeValue == 'RM' || this.userTypeValue == 'FAN') {
					this.router.navigate(['/client-details', data.clientId, data.clientName.split(' ').join('-')]);
				}
				else{
					this.router.navigate(['/client-details', data.clientId, '-']);
				}
			}
		// }
		// else{
		// 	this.commonService.displyPopupText()
		// }
	}

	async profilePopup(clientcode: any){
		const modal = this.modalController.create({
			component: ClientsDetailsModelComponent,
			componentProps: { "IndParams": '', clientID: clientcode},
			cssClass: 'superstars client-details'
		});
		return (await modal).present();
	}

	getCallMailData(clientId: any, params: any) {
		//window.location.href = 'tel:'+this.profileContact;
		this.HoverdataLoad = false;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getProfileParamsInMobile(token, clientId, params)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getProfileParamsInMobile(token, clientId, params)
				})
			}
		})
	}

	getProfileParamsInMobile(token: any, clientID: any, type: any) {
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

	async goForProfile(ID?: any) {
		const modal = this.modalController.create({
			component: ClientsDetailsModelComponent,
			componentProps: { "IndParams": '', clientID: ID },
			cssClass: 'superstars client-details'
		});
		return (await modal).present();
	}

	downloadExcel() {
		this.isExcelDownloaded = true;
		this.filterObj.PageNo = 0;
		// this.filterObj.FromDate = this.startDate;
		// this.filterObj.ToDate = this.endDate;
		this.subscription.add(
			this.serviceFile
				.fetchClientDetails(this.saveToken, this.filterObj)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						if (res['Body'].length === 0) {
							this.isExcelDownloaded = false;
							this.toastSer.displayToast('No Data Found');
						} else {
							this.clientListData = res['Body'];
							let arr: any = []
							this.clientListData.forEach((element: any) => {
								arr.push({
									clientId: element.clientcode ? element.clientcode : '-',
									clientName: element.ClientName ? element.ClientName : '-',
									aum: element['TotalAUM'] && this.commonService.numberFormatWithCommaUnit(element['TotalAUM']) ? this.commonService.numberFormatWithCommaUnit(element['TotalAUM']) : '-',
									CM_GroupCD: element['PartnerCode'] ? element['PartnerCode'] : '-',
									OnboardingDate: element.OnboardingDate ? moment(element.OnboardingDate).format('DD/MM/YYYY') : '-',
									Mobile: element.MobileNumber ? element.MobileNumber : 'No Contact Found',
									Mail: element.EmailId ? element.EmailId : 'No Mail Found',
								})
							});
							let info: any = [];
							let head: any = [["Client ID", "Client Name", "Group Code", "Onboarded on", "AUM (₹)"]];
							arr.forEach((element: any) => {
								info.push([element.clientId, element.clientName, element.CM_GroupCD, element.OnboardingDate, element.aum]);
							});
							this.commonService.exportDataToExcel(head[0], info, 'All Clients');
							this.isExcelDownloaded = false;
						}
					} else {
						this.isExcelDownloaded = false;
						this.toastSer.displayToast(res['Head']['ErrorDescription']);
					}
				})
		)
	}

}
