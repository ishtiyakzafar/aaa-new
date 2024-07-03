import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, ToastController, IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { OrderPipe } from 'ngx-order-pipe';
import { TotalClientService } from '../total-clients/total-clients.service';
import { ClientsDetailsModelComponent } from '../clients-details-model/clients-details-model.component';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import moment from 'moment';
import { CommonService } from '../../helpers/common.service';
import { LoginService } from '../../pages/login/login.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-clients-not-traded',
  providers: [TotalClientService, LoginService, DashBoardService],
  templateUrl: './clients-not-traded.component.html',
  styleUrls: ['./clients-not-traded.component.scss'],
})
export class ClientsNotTradedComponent implements OnInit {
	@ViewChild(IonContent) content: any;
	@Input() searchText: any;
	@Input() searchType: any;
	@Input() sendDataOnSearch: any;
	@Input() toggleState: any;
	@Input() isMFCSshow: any;
    public ascending: boolean = false;
	public clientCode: any = null;
	private subscription: any;
	public userID: any = null;
	public totalClients: any = null;
	public totalSIPValue: any = null;
	public clientListData: any = [];
	public totalClientData: any = [];
	public searchTerm: any = null;
	public dataLoad: boolean = true;
	HoverdataLoad: boolean = false;
    minHeight: boolean = false;

	order: string = 'OnboardingDate';
	reverse: boolean = false;
	datas:any[] = [];
	moment: any = moment;
	toast:any;

	filterObj = {
		PageNo: 1,
		SortBy: 'OnboardingDate',
		SortOrder: 'desc',
		Search: null,
		SearchText: null
	}

	// public datas: any[] = [
    //     {clientId: 'PC1234567', clientName: 'Prashanjeet Chakravarty', ledgerBal: '34.78 K', lastTradedDate: '11/21/2021', 
    //     status: 'Pending'},
    //     {clientId: 'PC1234567', clientName: 'Prashanjeet Chakravarty', ledgerBal: '34.78 K', lastTradedDate: '11/21/2021', 
    //     status: 'Done'},
    //     {clientId: 'PC1234567', clientName: 'Prashanjeet Chakravarty', ledgerBal: '34.78 K', lastTradedDate: '11/21/2021', 
    //     status: 'Pending'},
    //     {clientId: 'PC1234567', clientName: 'Prashanjeet Chakravarty', ledgerBal: '34.78 K', lastTradedDate: '11/21/2021', 
    //     status: 'Ignore'},
    //     {clientId: 'PC1234567', clientName: 'Prashanjeet Chakravarty', ledgerBal: '34.78 K', lastTradedDate: '11/21/2021', 
    //     status: 'Pending'},
    //     {clientId: 'PC1234567', clientName: 'Prashanjeet Chakravarty', ledgerBal: '34.78 K', lastTradedDate: '11/21/2021', 
    //     status: 'Follow up'},
	// ];

	// filterObj = {
	// 	PageNo: 1,
	// 	SortBy: 'clientcode',
	// 	SortOrder: 'asc',
	// 	SearchBy: null,
	// 	SearchText: null
	// }

    addHeight() {
        this.minHeight = true;
    }

	public enableNext = false;

	public wait = false;
	public toggleVal: any;

	profileContact: any;
	profileMail: any;
    Loadvalue = false;
    inputattr = false;
    selectBankNameDetail: string = 'Pending';
    // option for status
    shareReportTypeList: any[] = [
        { value: 'Pending'},
        { value: 'Done'},
        { value: 'Ignore'},
        { value: 'Follow up'},
	  ]
	 
	clientNotTradedData:any;
	resetData:any;
	userTypeValue:any;  
	tokenValue:any;
	screenWidth:any;
	dataArray:any[] = [];
	constructor(
		private orderPipe: OrderPipe,
		private commonService: CommonService,
		private storage: StorageServiceAAA,
		private serviceFile: TotalClientService,
		private modalController: ModalController,
		private LoginService: LoginService,
		private toastSer: ToasterService,
		private router: Router, private dashBoardService: DashBoardService, private platform: Platform, public toastController: ToastController) { }
	
	ngOnChanges(){
		this.toggleVal = localStorage.getItem('toggleSwitch');
		this.storage.get('empCode').then(code => {
			this.clientCode = code;
		})
		if(this.sendDataOnSearch){
			// console.log('callAPI change')
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
		
		//this.changeSearchType(this.searchType)
	}	
		
	ngOnInit() {
		this.toggleVal = localStorage.getItem('toggleSwitch');
		this.screenWidth = window.innerWidth;
		this.dataLoad = false;
		this.commonService.setClevertapEvent('Clients_NotTraded');
		// this.storage.get('userID').then((userID) => {
        //     this.userID = userID;
        // })

		// this.datas = [];
		// //this.searchText = ''
		// this.subscription = new Subscription();
		// this.storage.get('empCode').then(code => {
		// 	this.clientCode = code;
		// 	this.dataLoad = false;
		// 	if (this.clientCode) this.getDataFromStorage(this.clientCode);
		// })
		setTimeout(() => {
			this.storage.get('userID').then((userID) => {
				this.userID = userID;
			})
			this.storage.get('empCode').then(code => {
				this.clientCode = code;
				
				if (this.clientCode || this.userID) this.getDataFromStorage();
			})
		}, 500);

	}


	public getDataFromStorage(optionalParams?: any) {
		this.storage.get('userType').then(type => {
			this.userTypeValue = type;
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenValue = token;
					this.getData(token, optionalParams);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					this.getData(token, optionalParams);
				})
			}
		})
	}

	public getData(token: any, obj?: any) {
		this.subscription = new Subscription();
		// this.dataLoad = false;
		let passObj: any = {};

		if (obj) {
			this.filterObj['Search'] = (obj['SearchText'] == null || obj['SearchText'] == '' ? null : obj['Search']);
			this.filterObj['SearchText'] = obj['SearchText'];
			this.filterObj['PageNo'] = obj['page'] ? obj['page'] : this.filterObj.PageNo;
			passObj = this.filterObj;
		} else passObj = this.filterObj;

		switch (localStorage.getItem('DashTabSelect')) {
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
		passObj['ClientType'] = this.isMFCSshow ? "NonBroking" : "Active",
		passObj['UserType'] = localStorage.getItem('userType'),
		// this.storage.get('bToken').then(token => {
		this.subscription.add(
			this.serviceFile
				.fetchClientDetails(token, passObj)
				.subscribe((res: any) => {
					this.wait = false;
					if (res['Head']['ErrorCode'] == 0) {
						// this.aumEquityData = [];
						// this.aumEquityClientData = [];
						// this.datas = [];
						this.dataArray = res['Body'];
						if (res['Body'].length === 0) {
							this.enableNext = false;
							this.dataLoad = true;
						} else {
							//this.aumEquityClientData = res['Body']['EquityClientAUM'];
							if (this.filterObj.PageNo === 1) {
								this.datas = [];
							}
							this.dataArray.forEach(element => {
								this.datas.push({
									ClientCode: element.clientcode ? element.clientcode : '-',
									ClientName: element.ClientName ? element.ClientName : '-',
									groupCode: element.PartnerCode ? element.PartnerCode : '-',
									aum: element.TotalAUM ? element.TotalAUM : '-',
									OnboardingDate: element.OnboardingDate ? moment(element.OnboardingDate).format('DD/MM/YYYY') : '-',
									Mobile: element.MobileNumber ? element.MobileNumber : 'No Contact Found'
								})
							});
							if(this.dataArray.length > 49){
								this.enableNext = true;
							}
							else{
								this.enableNext = false;
							}
							this.dataLoad = true;
						}
					} else {
						this.enableNext = false;
						this.datas = [];
						this.dataLoad = true;
					}
				})
		)
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
	

	public loadData(event: any) {
		setTimeout(() => {
			event.target.complete();
			// App logic to determine if all data is loaded
			// and disable the infinite scroll
			/* if (this.data.length === this.filterObj['totalRecords']) {
			  event.target.disabled = true;
			} */
			// console.log(this.filterObj.PageNo);
			if (this.enableNext) {
				this.filterObj.PageNo += 1;
				this.getDataFromStorage();
				
			} 
			else event.target.disabled = true;
		}, 1000);

	}
	
	statusSelect(event: any) {
        event.stopPropagation();
        event.preventDefault()
    }

   // sorting function for column
   setOrder(value: string) {
		if (this.order === value) {
			this.reverse = !this.reverse;
		}
		this.order = value;
		
		this.dataLoad = false;
		this.enableNext = false;
		this.datas = [];
		if (!this.platform.is('desktop')) {
			this.content.scrollToTop();
		}
		
		this.filterObj.PageNo = 1;
		this.filterObj.SortBy = value;
		this.filterObj.SortOrder = this.reverse ? 'asc' : 'desc';
		if (this.reverse) {
			this.ascending = true;
		} else {
			this.ascending = false;
		}
		this.getDataFromStorage();
	}

	async goToClientDetails(data: any){
		//let checkClientCode = await this.commonService.matchClientCode(data.clientId);
		if (this.platform.is('desktop') || this.screenWidth > 1360) {
			// if(checkClientCode){
				const clientDetail = {ClientCode: data.ClientCode, ClientName: data.ClientName}
				localStorage.setItem('searchKey',"true")
				localStorage.setItem('searchObj', JSON.stringify(clientDetail))
				this.router.navigate(['/client-trades', 'clients']);
		}
		else {
			if (this.userTypeValue == 'RM' || this.userTypeValue == 'FAN') {
				this.router.navigate(['/client-details', data.ClientCode, data.ClientName.split(' ').join('-')]);
			}
			else{
				this.router.navigate(['/client-details', data.ClientCode, '-']);
			}
		}

		// }
		// else{
		// 	this.commonService.displyPopupText()
		// }
	}

	hoverCall(clientId: any, type: any) {
		this.HoverdataLoad = false;
		this.getProfileParams(this.tokenValue, clientId, type)

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
						this.profileContact = response['Body']['ClientMobileNo'];
						if(type == 'mobile'){
							window.location.href = 'tel:' + response['Body']['ClientMobileNo'];
						}
						// else{
							
						// }
						this.HoverdataLoad = true;
					}
					else {
						this.profileContact = "No Contact Found";
						if(type == 'mobile'){
							this.showToaster(this.profileContact);
						}
						this.HoverdataLoad = true;
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

	downloadExcel() {
		if (this.datas && this.datas.length > 0) {
			if(this.toggleVal == 'Hierarchy'){
				let info: any = [];
				let head = [["Client ID", "Client Name", "Group Code", "Ledger Balance (₹)", "Last Traded Date"]];
				this.datas.forEach((element) => {
					info.push([element.ClientCode, element.ClientName, element.groupCode, element.aum, element.OnboardingDate]);
				});
				this.commonService.exportDataToExcel(head[0], info, 'Active Clients');
			}
			else{
				let info: any = [];
				let head = [["Client ID", "Client Name", "Ledger Balance (₹)", "Last Traded Date"]];
				this.datas.forEach((element) => {
					info.push([element.ClientCode, element.ClientName, element.aum, element.OnboardingDate]);
				});
				this.commonService.exportDataToExcel(head[0], info, 'Active Clients');
			}
			
		} else {
			this.toastSer.displayToast('No Data Found');
		}
	}

	ngOnDestroy() {
		if(this.subscription){
			this.subscription = this.subscription.unsubscribe();
		}
	}

}
