import { Component, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import moment from 'moment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-trade-listing',
	providers: [ShareReportService],
	templateUrl: './trade-listing.component.html',
	styleUrls: ['./trade-listing.component.scss'],
})
export class TradeListingComponent implements OnInit, OnChanges {
	@ViewChild('detail') detail!: ElementRef;
	@Input() tradeListObj: any;
	public detailHeight!: number;
	public ascending!: boolean;
	moment: any= moment;
	public order: any;
	reverse: boolean = false;
	tradeListData:any[] = [];
	dataLoad!:boolean;
	public val: string = 'asc';
	public reportsData: any[] = [
		{
			clientCode: 'PNL00021', clientName: 'NFDC Client', aghvc: '0.00', alb: '-28.09', thv: '1,492,553.00',
			holdIn: false, remark: 'Add a remark', remarkValue: false, canEdit: false, moreDetails: [
				{
					unCIChq: '0.00', unDel: '0.00', span: '0',  marginTHV: '0.00',
					MarginAHV: '0.00', MarginGHV: '0.00'
				}
			]
		},
		{
			clientCode: 'PNL00021', clientName: 'NFDC Client', aghvc: '0.00', alb: '-28.09', thv: '1,492,553.00',
			holdIn: false, remark: 'Add a remark', remarkValue: true, canEdit: true, moreDetails: [
				{
					unCIChq: '0.00', unDel: '0.00', span: '0',  marginTHV: '0.00',
					MarginAHV: '0.00', MarginGHV: '0.00'
				}
			]
		},
		{
			clientCode: 'PNL00021', clientName: 'NFDC Client', aghvc: '0.00', alb: '-28.09', thv: '1,492,553.00',
			holdIn: false, remark: 'Add a remark', remarkValue: false, canEdit: false, moreDetails: [
				{
					unCIChq: '0.00', unDel: '0.00', span: '0',  marginTHV: '0.00',
					MarginAHV: '0.00', MarginGHV: '0.00'
				}
			]
		},
		{
			clientCode: 'PNL00021', clientName: 'NFDC Client', aghvc: '0.00', alb: '-28.09', thv: '1,492,553.00',
			holdIn: false, remark: 'Add a remark', remarkValue: true, canEdit: true, moreDetails: [
				{
					unCIChq: '0.00', unDel: '0.00', span: '0',  marginTHV: '0.00',
					MarginAHV: '0.00', MarginGHV: '0.00'
				}
			]
		},
		{
			clientCode: 'PNL00021', clientName: 'NFDC Client', aghvc: '0.00', alb: '-28.09', thv: '1,492,553.00',
			holdIn: false, remark: 'Add a remark', remarkValue: true, canEdit: true, moreDetails: [
				{
					unCIChq: '0.00', unDel: '0.00', span: '0',  marginTHV: '0.00',
					MarginAHV: '0.00', MarginGHV: '0.00'
				}
			]
		},
	];
	constructor(private storage: StorageServiceAAA, private shareReportSer: ShareReportService) { }
	ngOnChanges(changes: SimpleChanges): void {
		// console.log(this.tradeListObj);
			this.initTradeList();
	}



	ngOnInit() {

	}

	initTradeList() {
		this.tradeListData = [];
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tradeList(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tradeList(token)
				})
			}
		})
	}

	tradeList(token: any) {
		this.dataLoad = false;
		this.shareReportSer.getTradeListing(token, this.tradeListObj).subscribe((res) => {
			setTimeout(() => {
				this.dataLoad = true;
			}, 1000);
			if(res['Head']['ErrorCode'] == 0){
				//this.tradeListData = res['Body']['TradeListing'];
				res['Body']['TradeListing'].forEach((element: any, index: any) => {
					this.tradeListData.push({
						srNo:index,
						Exchange: element.Exchange,
						TradeDate: element.TradeDate == ""?'-':moment(element.TradeDate).format("DD/MM/YYYY"),
						Code: element.Code,
						Name: element.Name,
						ExpiryDate: element.ExpiryDate == ""?'-':moment(element.ExpiryDate).format("DD/MM/YYYY"),
						StrikePrice: parseFloat(element.StrikePrice),
						OptionType: element.OptionType,
						SellQty: element.SellQty == ""?'-':element.SellQty,
						BuyQty: element.BuyQty == ""?'-':parseFloat(element.BuyQty),
						BuyMarketRate: element.BuyMarketRate == ""?'-':element.BuyMarketRate,
						BuyBrokerage: element.BuyBrokerage == ""?'-':element.BuyBrokerage,
						BuyNetRate: element.BuyNetRate == ""?'-':element.BuyNetRate,
						BuyAmt: element.BuyAmt == ""?'-':element.BuyAmt,
						SellMarketRate: element.SellMarketRate == ""?'-':element.SellMarketRate,
						SellNetRate: element.SellNetRate == ""?'-':element.SellNetRate,
						SellAmt: element.SellAmt == ""?'-':element.SellAmt,
						NetQty: element.NetQty == ""?'-':element.NetQty,
						NetValue: element.NetValue == ""?'-':element.NetValue,
						SellBrokerage: element.SellBrokerage == ""?'-':element.SellBrokerage,
						ClosingPriceAsOn: element.ClosingPriceAsOn == ""?'-':element.ClosingPriceAsOn,
						ClosingValueAsOn: element.ClosingValueAsOn == ""?'-':element.ClosingValueAsOn
					})
				});
				// console.log(this.tradeListData);
			
			}
			else{
				this.tradeListData = [];
			}
		})
	
		
	}

	dropClick(index: any, arr: any) {
		// event.preventDefault();
		arr.forEach((element: any, ind: any) => {
			if ((index) !== ind) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
				if (element['isVisible']) {
					setTimeout(() => {
						this.detailHeight = this.detail.nativeElement.offsetHeight;
						// console.log('height= ' + this.detailHeight);
					}, 100);
				}
			}
		});
		// console.log(arr);
	}


	setOrder(value: string) {
		this.reverse = !this.reverse;
		this.order = value;
        if (this.reverse) {
            this.ascending = false;
			this.val = 'desc';
        } else {
            this.ascending = true;
			this.val = 'asc';
        }
	}

}
