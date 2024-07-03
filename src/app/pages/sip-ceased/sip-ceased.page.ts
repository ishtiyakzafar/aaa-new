import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SIPBookService } from '../../components/sip-book/sip-book.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-sip-ceased',
  providers: [ SIPBookService ],
  templateUrl: './sip-ceased.page.html',
  styleUrls: ['./sip-ceased.page.scss'],
})
export class SipCeasedPage implements OnInit {
    /* public ascending: boolean = true;
    order: string = '';
    reverse: boolean = false;
    public datas: any[] = [
        // { clientId: 'PC1234567', clientName: 'Prashanjeet Chakravarty', folio: '6542353', scheme: 'Axis Long Term Equity Fund', value: '64.35 K', date: '26/07/2020'},
        // { clientId: 'PC1234567', clientName: 'Abhijeet Chakravarty', folio: '6542353', scheme: 'Axis Bluechip Fund', value: '64.35 K', date: '26/07/2020'},
        // { clientId: 'PC1234567', clientName: 'Rohit Chakravarty', folio: '6542353', scheme: 'Axis Banking & PSU Debt Fund', value: '64.35 K', date: '26/07/2020'},
        // { clientId: 'PC1234567', clientName: 'Niraj Chakravarty', folio: '6542353', scheme: 'Axis Small Cap Fund', value: '64.35 K', date: '26/07/2020'},
    ];
    public placeholderInput: string = 'Type Client Code / PAN';
    public clientBlockSegmentValue: string = "client";
    public segmentButtonOption: any[] = [
        {name: 'Client Code / PAN', value: 'client'},
        {name: 'Name', value: 'name'}
    ] */

    public ascending: boolean = true;
	public clientCode: any;
	private subscription: any;
	public userID : any;
	public totalSIP : any;
	public totalSIPValue : any;
	public bouncedSIPClientData: any = [];
	public bouncedSIPCount: any = [];
	public searchTerm : any;
	public dataLoad = false;
	public placeholderInput: string = 'Type Client Code / PAN';
	order: string = '';
	reverse: boolean = false;
	public datas: any[] = [
	];

	public clientBlockSegmentValue: string = "clientCode";
	public segmentButtonOption: any[] = [
		{ name: 'Client Code / PAN', value: 'clientCode' },
		{ name: 'Name', value: 'clientName' }
	]

	filterObj: any = {
		PageNo: 1,
		SortBy: 'clientCode',
		SortOrder: 'asc',
		SearchBy: null,
		SearchText: null
	}

	public searchValue: any;

	public wait = false;

	public enableNext = false;

    constructor(private orderPipe: OrderPipe,
        private commonService: CommonService,
		private storage: StorageServiceAAA,
		private serviceFile: SIPBookService,
		private router: Router) { }

    ngOnInit() {
        // this.orderPipe.transform(this.datas, 'clientName');
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
    }

    segmentChange() {
        if(this.clientBlockSegmentValue === 'clientName') {
            this.placeholderInput = 'Type Name';
        } else {
            this.placeholderInput = 'Type Client Code / PAN';
        }
    }

    public getData(token: any) {
		this.subscription = new Subscription();
		// const params = {
		// 	Loginid: this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID,
		// 	type: 'new'
		// }
		// this.dataLoad = false;
		let passObj: any = {};

		passObj = this.filterObj;
		passObj['RMCode'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
        // passObj['Clientcode'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
		passObj['Clientcode'] = '';
		passObj['Type'] = 'ceased';
		// passObj['Loginid'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
		this.subscription.add(
			this.serviceFile
				.bouncedSIP(token, passObj)
				.subscribe((res: any) => {
					if (res['Head']['ErrorCode'] == 0) {
						this.wait = false;
						this.bouncedSIPCount = res['Body'];

						if (res['Body']['summary'].length === 0) {
							this.enableNext = false;
							this.dataLoad = true;
							// this.datas = [];
						} else {
							this.bouncedSIPClientData = res['Body']['summary'];

							if (this.filterObj.PageNo === 1) {
								this.datas = [];
							}
							this.bouncedSIPClientData.forEach((element: any) => {
								this.datas.push({
									clientId: element['ClientCode'] ? element['ClientCode'] : '-',
									clientName: element['ClientName'] ? element['ClientName'] : '-',
									folio: element['FolioNumber'],
									scheme: element['SchemeName'],
                                    value: element['SIPAmount'],
                                    date: element['Date']
								})
							});
							
							this.enableNext = true;
							this.dataLoad = true;
						}
						this.totalSIP = this.commonService.formatNumberComma(this.bouncedSIPCount['TotalSIP']);
						this.totalSIPValue = this.commonService.numberFormatWithCommaUnit(this.bouncedSIPCount['TotalSIPAmount']);

						// this.dataLoad = true;
					} else {
						this.enableNext = false;
						this.bouncedSIPCount = [];
						this.bouncedSIPClientData = [];
						this.datas = [];
						this.dataLoad = true;
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
