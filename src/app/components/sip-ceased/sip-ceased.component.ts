import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Subscription } from 'rxjs';
import { SIPBookService } from '../sip-book/sip-book.service';
import { Router } from '@angular/router';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-sip-ceased',
  providers: [ SIPBookService ],
  templateUrl: './sip-ceased.component.html',
  styleUrls: ['./sip-ceased.component.scss'],
})
export class SipCeasedComponent implements OnInit {
    // public ascending: boolean = true;
    // order: string = 'clientName';
    // reverse: boolean = false;
    public ascending: boolean = true;
	public clientCode : any;
	private subscription: any;
	public userID : any;
	public totalSIP : any;
	public totalSIPValue : any;
	public bouncedSIPClientData: any = [];
	public bouncedSIPCount: any = [];
	public searchTerm : any;
	public dataLoad = false;

	order: string = 'clientName';
	reverse: boolean = false;
	public datas: any[] = [
	];

	filterObj: any = {
		PageNo: 1,
		SortBy: 'clientcode',
		SortOrder: 'asc',
		SearchBy: null,
		SearchText: null
	}

	public enableNext = false;

	public wait = false;
    constructor(private orderPipe: OrderPipe,
        private commonService: CommonService,
		private storage: StorageServiceAAA,
		private serviceFile: SIPBookService,
		private router: Router) { }

    ngOnInit() {
        this.orderPipe.transform(this.datas, 'clientName');
        this.commonService.eventObservable.subscribe((obj) => {
			if (obj && obj['event'] === 'ceasedSipsEvent') {
				this.clientCode = obj['data']['clientCode'];
				this.getDataFromStorage();
				return;
			} else if (obj && obj['event'] === 'ceasedSipsSearchText' && !this.wait) {
				this.wait = true;
				const temp = obj['data'];
				this.datas = [];
				this.dataLoad = false;
				this.getDataFromStorage(temp);
				return;
			}
		})

		this.storage.get('empCode').then( code => {
			this.clientCode = code;
			this.dataLoad = false;
			if (this.clientCode) this.getDataFromStorage();
		})
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
		let passObj: any = {};
		// this.dataLoad = false;

		if (obj) {
			this.filterObj['SearchBy'] = (obj['SearchText'] == null || obj['SearchText'] == '' ? null : obj['SearchBy']);
			this.filterObj['SearchText'] = obj['SearchText'];
			this.filterObj['PageNo'] = obj['page'] ? obj['page'] : this.filterObj.PageNo;
			passObj = this.filterObj;
		} else passObj = this.filterObj;
		passObj['RMCode'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
        // passObj['Clientcode'] = this.clientCode !== null && this.clientCode !== undefined ? this.clientCode : this.userID;
		passObj['Clientcode'] = '';
		passObj['Type'] = 'ceased';
		this.subscription.add(
			this.serviceFile
				.bouncedSIP(token, passObj)
				.subscribe((res: any) => {
					this.wait = false;
					if (res['Head']['ErrorCode'] == 0) {

						this.bouncedSIPCount = res['Body'];

						if (res['Body']['summary'].length === 0) {
							this.enableNext = false;
							this.dataLoad = true;
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

	public getDataFromStorage(optionalParams?: any) {
		this.storage.get('userType').then(type => {
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

	// sorting function for column
	setOrder(value: string) {
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
		this.getDataFromStorage();
	}

	
	async goToClientDetails(data: any){
		let checkClientCode = await this.commonService.matchClientCode(data.clientId);
		// if(checkClientCode){
			const clientDetail = {ClientCode: data.clientId, ClientName: data.clientName}
			localStorage.setItem('searchKey',"true")
			localStorage.setItem('searchObj', JSON.stringify(clientDetail))
			this.router.navigate(['/client-trades', 'clients']);
		// }
		// else{
		// 	this.commonService.displyPopupText()
		// }
	}

}
