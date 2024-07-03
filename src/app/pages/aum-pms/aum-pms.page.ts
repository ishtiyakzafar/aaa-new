import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AUMService } from '../../components/aum/aum.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-aum-pms',
	providers: [ AUMService ],
	templateUrl: './aum-pms.page.html',
	styleUrls: ['./aum-pms.page.scss'],
})
export class AumPmsPage implements OnInit {
    public ascending: boolean = true;
	public clientCode: any = null;
	private subscription: any;
	public userID: any = null;
	public totalClients: any = null;
	public totalAUM: any = null;
	public aumPMSClientData: any = [];
	public aumPMSData: any = [];
	public searchTerm: any = null;
	public dataLoad: boolean = false;

	order: string = '';
	reverse: boolean = false;
	public datas: any[] = [
	];
    public placeholderInput: string = 'Type Client Code';
    public isSearchVisible: boolean = false;
    public clientBlockSegmentValue: string = "clientCode";
    public segmentButtonOption: any[] = [
        {name: 'Client Code', value: 'clientCode'},
        {name: 'Name', value: 'clientName'}
    ]

	filterObj: any = {
		PageNo: 1,
		SortBy: 'clientCode',
		SortOrder: 'asc',
		SearchBy: null,
		SearchText: null
	}

	public searchValue: any = null;

	public wait = false;

	public enableNext = false;
	constructor(private orderPipe: OrderPipe,
		private commonService: CommonService,
		private storage: StorageServiceAAA,
		private serviceFile: AUMService,
		private router: Router) { }

	ngOnInit() {
		/* this.storage.get('userID').then((userID) => {
			this.userID = userID;
			this.getDataFromStorage();
		})

		this.commonService.eventObservable.subscribe((obj) => {
			if (obj && obj['event'] === 'pmsEvent') {
				this.clientCode = obj['data']['clientCode'];
				this.getDataFromStorage();
			}
		}) */

		this.storage.get('empCode').then( code => {
			this.clientCode = code;
			if (code) this.getDataFromStorage();
			else {
				this.storage.get('userID').then((userID) => {
					this.userID = userID;
					this.getDataFromStorage();
				})
			}
		})
		// this.orderPipe.transform(this.datas, 'clientName');
	}

    segmentChange() {
        if(this.clientBlockSegmentValue === 'clientName') {
            this.placeholderInput = 'Type Name';
        } else {
            this.placeholderInput = 'Type Client Code';
        }
    }

    // toggleSearch() {
    //     this.isSearchVisible = !this.isSearchVisible;
    // }

	public getData(token: any) {
		this.subscription = new Subscription();
		// this.dataLoad = false;

		let passObj: any = {};

		passObj = this.filterObj;
		passObj['Loginid'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;

		// this.storage.get('bToken').then(token => {
			this.subscription.add(
				this.serviceFile
					.pmsData(token, passObj)
					.subscribe((res: any) => {
						if (res['Head']['ErrorCode'] == 0) {
							this.wait = false;
							this.aumPMSData = [];
							this.aumPMSClientData = [];

							this.aumPMSData = res['Body']['AAAPMSAIFTotalAUM'];
							
							if (res['Body']['AAAPMSAIFClientwise'].length === 0) {
								this.enableNext = false;
								this.dataLoad = true;
							} else {
								this.aumPMSClientData = res['Body']['AAAPMSAIFClientwise'];
								if (this.filterObj.PageNo === 1) {
									this.datas = [];
								}
								this.aumPMSClientData.forEach((element: any) => {
									this.datas.push({
										clientId: element['ClientCode'] ? element['ClientCode'] : '-',
										clientName: element['ClientName'] ? element['ClientName'] : '-',
										pms: this.commonService.numberFormatWithCommaUnit(element['ClientPMSAUM']),
										aif: this.commonService.numberFormatWithCommaUnit(element['ClientAIFAUM'])
									})
								});
								this.dataLoad = true;
								this.enableNext = true;
							}

							this.totalClients = this.commonService.formatNumberComma(this.aumPMSData['TotalClients']);
							this.totalAUM = this.commonService.numberFormatWithCommaUnit(this.aumPMSData['TotalPMSAUM'] + this.aumPMSData['TotalAIFAUM']);

						} else {
							this.aumPMSClientData = [];
							this.aumPMSData = [];
							this.enableNext = false;
							this.datas = [];
							this.dataLoad = true;
						}
					})
			)
		// })
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
			this.datas = [];
			this.dataLoad = false;
			this.enableNext = false;
			this.getDataFromStorage();
		} else {
			this.filterObj['SearchText'] = this.searchValue;
			this.filterObj['SearchBy'] = this.clientBlockSegmentValue;
			this.filterObj['PageNo'] = 1;
			this.datas = [];
			this.dataLoad = false;
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

}
