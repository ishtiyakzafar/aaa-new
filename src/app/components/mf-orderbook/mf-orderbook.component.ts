import { Component, OnInit } from '@angular/core';
import { MutualFundService } from '../../components/mutual-fund/mutual-fund.service';
import moment from 'moment';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-mf-orderbook',
	providers: [MutualFundService],
	templateUrl: './mf-orderbook.component.html',
	styleUrls: ['./mf-orderbook.component.scss'],
})
export class MfOrderbookComponent implements OnInit {
	monthWeekTabValue: any = 'month';
	public holdingTabValue: string = 'lumpsum';
	public detailHeight!: number;
	public allBlockTabValue: string = 'all';
	public holdingOptions: any[] = [
		{ name: 'Lumpsum', value: 'lumpsum' },
		{ name: 'SIP', value: 'sip' },
	]

	dataLoad: boolean = false;
	orderBookList: any[] = [];
	moment: any = moment;
	searchScheme: any;
	sipRegList: any[] = [];
	userIdValue!:string;
	userType!:string

	constructor(private mutualFundSer: MutualFundService, private commonService: CommonService, private storage: StorageServiceAAA) { }

	ngOnInit() {
		this.storage.get('userID').then((userID) => {
            this.storage.get('userType').then(type => {
				this.userIdValue = userID;
				this.userType = type
    
            })
         })  
		this.segmentChange('lumpsum')
	}

	segmentChange(event: any) {
		if (event == 'lumpsum') {
			this.storage.get('userID').then((userID) => {
				this.storage.get('userType').then(type => {
					let clientCode = JSON.parse(localStorage.getItem('select_client') || "{}")['ClientCode']
						this.mutualFundSer.getOrderBookMf(userID,type, clientCode).subscribe((res: any) => {
							this.dataLoad = true;
							// console.log(res['objHeader'].Status);
							if (res['objHeader'].Status == 0) {
								this.orderBookList = res['Data'];
								this.orderBookList.forEach((element, index) => {
									element.srNo = index;
								})
								this.orderBookList = this.orderBookList.sort((a, b) => (a.ExchOrderTime.slice(6, 19) > b.ExchOrderTime.slice(6, 19)) ? -1 : 1);
								// console.log(this.orderBookList);
							}
							else{
								this.orderBookList = [];
							}
						})
				})
			})	
		
		}
		else {
			this.timeDurationChange('month')
		}
		//console.log(event);
	}

	sipRegData(prevDate: any, todayDate: any){
		this.storage.get('userID').then((userID) => {
            this.storage.get('userType').then(type => {
				let clientCode = JSON.parse(localStorage.getItem('select_client') || "{}")['ClientCode']
				this.mutualFundSer.getSipRegistraBook(prevDate,todayDate,userID,type,clientCode).subscribe((res: any) => {
					this.dataLoad = true;
					if (res['Status'] == 0) {
						if (res['lstOrderDetail'].length > 0) {
							this.sipRegList = res['lstOrderDetail'];
							this.sipRegList.forEach((element, index) => {
								element.srNo = index;
							})
						}
						else{
							this.sipRegList = [];
						}
					}
					else{
						this.sipRegList = [];
					}
				})
    
            })
         })  
	
	}

	dropClick(sr: any, arr: any) {
		arr.forEach((element: any, ind: any) => {
			if (sr !== element.srNo) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
				if (element['isVisible']) {
					setTimeout(() => {
						// this.detailHeight = this.detail.nativeElement.offsetHeight;
						// console.log('height= ' + this.detailHeight);
					}, 100);
				}
			}
		});
	}

	timeDurationChange(event: any) {
		this.dataLoad = false;
		if(event == 'week'){
			let prevDate = (moment(this.commonService.lastWeekISOConverted('last'), "M/D/YYYY H:mm").valueOf())
			let today = (moment(this.commonService.lastWeekISOConverted('first'), "M/D/YYYY H:mm").valueOf())
			// console.log(prevDate+ '+'+ today)
			this.sipRegData(prevDate, today)
			
		}
		else{
			let prevDate = (moment(this.commonService.lastMonthISOConverted('previous'), "M/D/YYYY H:mm").valueOf())
			let today = (moment(this.commonService.lastMonthISOConverted('current'), "M/D/YYYY H:mm").valueOf())
			this.sipRegData(prevDate, today)
		}
	}

	splitStatus(status: any) {
		return status.split(' ')[0];
	}

	purchaseTypes(purchaseValue: any, buySellValue: any){
		if(purchaseValue == 'F'){
			if(buySellValue == 'S'){
				return "Fresh REDEEM"	
			}
			return "Fresh PURCHASE"
		}
		else if(purchaseValue == 'A'){
			if(buySellValue == 'S'){
				return "REDEMPTION"	
			}
			return "Additional PURCHASE"
		}
		else{
			return purchaseValue;
		}

	}

}
