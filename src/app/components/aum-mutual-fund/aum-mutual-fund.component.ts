import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { AUMService } from '../aum/aum.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {IonContent, ModalController, Platform } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { DetailsComponent } from '../details/details.component';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-aum-mutual-fund',
	providers: [AUMService],
	templateUrl: './aum-mutual-fund.component.html',
	styleUrls: ['./aum-mutual-fund.component.scss'],
})
export class AumMutualFundComponent implements OnInit {
	@ViewChild(IonContent) content!: IonContent;
	@Input() sendDataOnSearch: any;
	@Input() searchType: any;
	@Input() searchText: any;
	@Input() toggleState: any;
	public clientCode: any = null;
	public ascending: boolean = false;
	private subscription: any;
	public userID: any = null;
	public totalClients: any = null;
	public totalAUM: any = null;
	public aumMutualClientData: any = [];
	public aumMutualData: any = [];
	public searchTerm: any = null;
	public dataLoad: boolean = false;
	
	order: string = 'aum';
	reverse: boolean = false;
	public datas: any[] = [
	];

	filterObj: any = {
		PageNo: 1,
		SortBy: 'aum',
		SortOrder: 'desc',
		SearchBy: null,
		SearchText: null
	}

	public enableNext: boolean = false;

	public wait: boolean = false;
	userTypeValue:any;
	public toggleVal: any;

	constructor(private orderPipe: OrderPipe,
		private commonService: CommonService,
        private modalController: ModalController,
		private storage: StorageServiceAAA,
		private serviceFile: AUMService,
		private router: Router, 
		private platform: Platform) { }

		ngOnChanges(){
			this.toggleVal = localStorage.getItem('toggleSwitch');
			if(this.sendDataOnSearch){
				if (!this.platform.is('desktop')) {
					this.content.scrollToTop();
					
				}
				this.enableNext = false;
				this.dataLoad = false;
				this.datas = [];
				this.filterObj.PageNo = 1;
				let obj = {
					SearchBy: this.searchType,
					SearchText: this.searchText
				}
				this.getDataFromStorage(obj)
			}		
		}

	ngOnInit() {
		this.toggleVal = localStorage.getItem('toggleSwitch');
		this.storage.get('userID').then((userID) => {
			this.userID = userID;
		})
		/* const data = this.commonService.getData();
		if (data && data['clientCode']) {
			this.clientCode = data['clientCode'];
			this.getDataFromStorage();
			return;
		} */

		// this.commonService.eventObservable.subscribe((obj) => {
		// 	// if (obj && obj['event'] === 'mutualFundEvent') {
		// 	// 	this.clientCode = obj['data']['clientCode'];
		// 	// 	this.getDataFromStorage();
		// 	// 	return;
		// 	// } else 
		// 	if (obj && obj['event'] === 'mutualFundSearchText' && !this.wait) {
		// 		this.wait = true;
		// 		const temp = obj['data'];
		// 		this.datas = [];
		// 		this.dataLoad = false;
		// 		this.getDataFromStorage(temp);
		// 		return;
		// 	}
		// })
		// if(!this.sendDataOnSearch){
			// this.getDataFromStorage();
		// }
		

		this.storage.get('empCode').then( code => {
			this.clientCode = code;
			this.dataLoad = false;
			if (this.clientCode) this.getDataFromStorage();
			/* else {
				this.storage.get('userID').then((userID) => {
					this.userID = userID;
					this.getDataFromStorage();
				})
			} */
		})

		// this.orderPipe.transform(this.datas, 'clientName');
	}

    // detail popup
    async details(data: any) {
		//ev.preventDefault();
        const datas = [
            {type: 'Client ID', value: data['clientId']}, 
            {type: 'Client Name', value: data['clientName']},
            {type: 'Equity MF AUM (₹)', value: data['equityMf']},
            {type: 'Debt MF AUM (₹)', value: data['deptMf']},
            {type: 'Hybrid MF AUM (₹)', value: data['hybridMf']},
            {type: 'Total AUM (₹)', value: data['total']}
        ]
        const modal = await this.modalController.create({
            component: DetailsComponent,
            componentProps: {datas: datas},
            cssClass: 'superstars details-modal'
        });
        return await modal.present();
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
				this.filterObj['SearchBy'] = this.filterObj.SearchBy;
				this.getDataFromStorage(this.filterObj);
			}
	}

	public getData(token: any, obj?: any) {
		this.subscription = new Subscription();
		// this.dataLoad = false;

		let passObj: any = {};

		if (obj) {
			this.filterObj['SearchBy'] = (obj['SearchText'] == null || obj['SearchText'] == '' ? null : obj['SearchBy']);
			this.filterObj['SearchText'] = obj['SearchText'];
			this.filterObj['PageNo'] = obj['page'] ? obj['page'] : this.filterObj.PageNo;
			passObj = this.filterObj;
		} else passObj = this.filterObj;
		this.storage.get('empCode').then( code => {
			passObj['PartnerID'] = code !== null && code !== undefined ? code : this.userID;
			
			this.subscription.add(
				this.serviceFile
					.mutualFundData(token, passObj)
					.subscribe((res: any) => {
						this.wait = false;
						if (res['Head']['ErrorCode'] == 0) {

							this.aumMutualData = res['Body']['GetAAAMFAUMdetails'][0];
							
							if (res['Body']['GetAAAMFAUMdetailsList'].length === 0) {
								this.enableNext = false;
								this.dataLoad = true;
							} else {
								this.aumMutualClientData = res['Body']['GetAAAMFAUMdetailsList'];
								if (this.filterObj.PageNo === 1) {
									this.datas = [];
								}
								this.aumMutualClientData.forEach((element: any) => {
									this.datas.push({
										clientId: element['ClientCode'] ? element['ClientCode'] : '-',
										clientName: element['ClientName'] ? element['ClientName'] : '-',
										groupCode: element['GroupCode'] ? element['GroupCode'] : '-',
										equityMf: this.commonService.numberFormatWithCommaUnit(element['ClientEquityMFAUM']),
										deptMf: this.commonService.numberFormatWithCommaUnit(element['ClientDebtMFAUM']),
										hybridMf: this.commonService.numberFormatWithCommaUnit(element['ClientHybridMFAUM']),
										total: this.commonService.numberFormatWithCommaUnit(element['ClientTotalMFAUM'])
									})
								});
								this.enableNext = true;
								this.dataLoad = true;
							}
							this.totalClients = this.commonService.formatNumberComma(this.aumMutualData['TotalClients']);
							this.totalAUM = this.commonService.numberFormatWithCommaUnit(this.aumMutualData['TotalMFAUM']);

						} else {
							this.enableNext = false;
							this.aumMutualData = [];
							this.aumMutualClientData = [];
							this.datas = [];
							this.dataLoad = true;
						}
					})
			)
		})
	}

	public getDataFromStorage(optionalParams?: any) {
		this.storage.get('userType').then(type => {
			this.userTypeValue = type;
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getData(token, optionalParams);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getData(token, optionalParams);
				})
			}
		})
	}

	//sorting function for column
	setOrder(value: string) {
		// this.dataLoad = false;
		/* if (this.order === value2) {
			this.reverse = !this.reverse;
		}
		this.order = value2;
		
		// this.datas = [];
		this.wait = true;
		this.dataLoad = false;
		this.filterObj.PageNo = 1;
		this.filterObj.SortBy = value;
		this.filterObj.SortOrder = this.reverse ? 'asc' : 'desc';
        if (this.reverse) {
            this.ascending = true;
        } else {
            this.ascending = false;
        }
		this.getDataFromStorage(); */
		// if (this.datas.length) {
			this.dataLoad = false;
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
			if (!this.wait) {
				this.wait = true;			
				this.getDataFromStorage();
			}
		// }
		//  else return;
		
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

	async goToClientDetails(data: any, ev:any){
		ev.preventDefault();
		ev.stopPropagation();
		let checkClientCode = await this.commonService.matchClientCode(data.clientId);
		if (this.platform.is('desktop')) {
			// if(checkClientCode){
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

	ngOnDestroy() {
		this.subscription = this.subscription.unsubscribe();
	}

}
