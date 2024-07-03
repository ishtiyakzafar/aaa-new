import { Component, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import { Platform, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-realised-pnl',
  providers: [ShareReportService],
  templateUrl: './realised-pnl.component.html',
  styleUrls: ['./realised-pnl.component.scss'],
})
export class RealisedPnlComponent implements OnInit, OnChanges {
    @ViewChild('detail') detail!: ElementRef;
    public detailHeight!: number;
    moment: any= moment;
    @Input() realizedParams: any;
    @Input() callFromDesktop: boolean = false;
   reverse: boolean = false;
    public ascending!: boolean;
    dataLoad!:boolean;
    public order: any;
    // GrandTotal Variables
    grandTotalBuyCharge:number = 0;
    grandTotalBuyValue:number = 0;
    grandTotalSellAvgRate:number = 0;
    grandTotalSellCharge:number = 0;
    grandTotalSellValue:number = 0;
    grandTotalLongTermPl:number = 0;
    grandTotalShortTermPl:number = 0;
    grandTotalIntradayPL:number = 0;
    grandTotalPL:number = 0;
    grandTotalLongTermTaxPL:number = 0
    paramDecimal:any;
    tokenValue:any;
    private subscription: any;
    public reportsData: any[] = [
        {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
            buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
            shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00', moreDetails: [
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
        ]}, 
        {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
            buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
            shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00', moreDetails: [
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
        ]}, 
        {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
            buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
            shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00', moreDetails: [
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '5453.00', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
        ]}, 
        {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
            buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '', sellValue: '-', longTermPL: '-',
            shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00', moreDetails: [
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
            {scripName: 'BAJAJFINANCE', qty: '0.00', buyDate: '12 Aug 2020', buyAvgRate: '5453.00', 
                buyCharges: 729.93, buyValue: '546018.90', sellDate:'12 Aug 2020', sellAvgRate: '', sellValue: '-', longTermPL: '-',
                shortTermPL: '-', intradayPL: '-', totalPL: '-', rateAs: '0.00', longTermTaxPL: '0.00'
            },
        ]}, 
    ];
    public cashSegment: any[] = [
        {typeSegment: 'Delivery NSE/BSE', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
        {typeSegment: 'Intraday NSE/BSE', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
        {typeSegment: 'Trade for Trade & Z group scrip', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
        {typeSegment: 'Auction', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
    ]

    realizedPlData:any[] = [];
    consRealizedPlList:any[] = [];
    public val: string = 'asc';

    constructor(private shareReportSer: ShareReportService, private storage: StorageServiceAAA, private platform: Platform, private commonService: CommonService) { }
    
    ngOnChanges(changes: SimpleChanges): void {
        if (this.platform.is('desktop') || this.callFromDesktop) {
            if(this.realizedParams) this.initRealizedPl();
        }   
    }

    ngOnInit() {
    }    

    ionViewWillEnter() {
        if (!this.platform.is('desktop') || !this.callFromDesktop) {
            this.realizedParams = this.commonService.getData();
            if(this.realizedParams){
                if(this.realizedParams.callFrom360 != true || this.realizedParams.callFrom360 == undefined) this.realizedParams.callFrom360 = false; 
                this.initRealizedPl();   
            }
        } 
     }

     initRealizedPl() {
        if(this.realizedParams.product == "currency"){
			this.paramDecimal = 'U'
		}
		else{
			this.paramDecimal = 'C'
		}
		this.dataLoad = false;
		this.realizedPlData = [];
		if(this.realizedParams.portfolioToken){
            this.getRealizedPlList(this.realizedParams.portfolioToken);
        } else {
            this.storage.get('userType').then(type => {
                if (type === 'RM' || type === 'FAN') {
                    this.storage.get('bToken').then(token => {
                        this.tokenValue = token
                        this.getRealizedPlList(token)
                    })
                } else {
                    this.storage.get('subToken').then(token => {
                        this.tokenValue = token
                        this.getRealizedPlList(token)
                    })
                }
		    })
        }
    }
    
    getRealizedPlList(token: any) {
		this.shareReportSer.getRealizedPl(token, this.realizedParams).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
                if(res['Body']['Realized'].length > 0){

                    this.grandTotalBuyCharge = res['Body']['Realized'].reduce((el: any, li: any) => el + li.BuyCharges, 0);
                    this.grandTotalBuyValue = res['Body']['Realized'].reduce((el: any, li: any) => el + li.BuyValue, 0);
                    this.grandTotalSellAvgRate = res['Body']['Realized'].reduce((el: any, li: any) => el + li.SellAvgRate, 0);
                    this.grandTotalSellCharge = res['Body']['Realized'].reduce((el: any, li: any) => el + li.SellCharges, 0);
                    this.grandTotalSellValue = res['Body']['Realized'].reduce((el: any, li: any) => el + li.SellValue, 0);
                    this.grandTotalLongTermPl = res['Body']['Realized'].reduce((el: any, li: any) => el + li.LongTermPL, 0);
                    this.grandTotalShortTermPl = res['Body']['Realized'].reduce((el: any, li: any) => el + parseFloat(li.ShortTermPL), 0);
                    this.grandTotalIntradayPL = res['Body']['Realized'].reduce((el: any, li: any) => el + li.IntradayPL, 0);
                    this.grandTotalPL = res['Body']['Realized'].reduce((el: any, li: any) => el + li.TotalPL, 0);
                    this.grandTotalLongTermTaxPL = res['Body']['Realized'].reduce((el: any, li: any) => el + li.LongTermTaxPL, 0);

                    var result = this.groupBy1(res['Body']['Realized'], function (item: any) {
                        return [item.ScripName];
                    });
                    this.consRealizedPlList = [];
                    for (var j in result) {
                        var combineObj = {
                            "srNo": parseInt(Object.keys(result)[j]),
                            "Data": result[j],
                            "ScripName":result[j][0].ScripName,
                            "TotalQty": result[j].reduce((el: any, li: any) => el + li.Qty, 0),
                            "TotalBuyAvgRate": this.totalBuyAvgRate(result[j]),
                            "TotalBuyCharges": result[j].reduce((el: any, li: any) => el + li.BuyCharges , 0),
                           //"TotalBuyCharges": this.totalBuyCharges(result[j]),
                            "TotalBuyValue": result[j].reduce((el: any, li: any) => el + li.BuyValue, 0),
                            "SellAvgRate": this.totalSellAvgRate(result[j]),
                            "TotalSellCharges": result[j].reduce((el: any, li: any) => el + li.SellCharges, 0),
                            "TotalSellValue": result[j].reduce((el: any, li: any) => el + li.SellValue, 0),
                            "TotalLongTermPl": result[j].reduce((el: any, li: any) => el + li.LongTermPL, 0),
                            "TotalShortTermPl": result[j].reduce((el: any, li: any) => el + parseFloat(li.ShortTermPL), 0),
                            "TotalIntraDayPl": result[j].reduce((el: any, li: any) => el + li.IntradayPL, 0),
                            "TotalPl": result[j].reduce((el: any, li: any) => el + li.TotalPL, 0),
                            "TotalLongTaxPl": result[j].reduce((el: any, li: any) => el + li.LongTermTaxPL, 0),
    
                        };
                        this.consRealizedPlList.push(combineObj);
                    }
                    
                    this.consRealizedPlList = this.consRealizedPlList.sort((a, b) => (a.ScripName > b.ScripName) ? -1 : 1);
                    // console.log(this.consRealizedPlList);
                 
                }
                else{
                    this.consRealizedPlList = [];
                    this.grandTotalBuyCharge = 0;
                    this.grandTotalBuyValue = 0;
                    this.grandTotalSellAvgRate = 0;
                    this.grandTotalSellCharge = 0;
                    this.grandTotalSellValue = 0;
                    this.grandTotalLongTermPl = 0;
                    this.grandTotalShortTermPl = 0;
                    this.grandTotalIntradayPL = 0;
                    this.grandTotalPL = 0;
                    this.grandTotalLongTermTaxPL = 0;
                    
                }

                setTimeout(() => {
                    this.dataLoad = true;
                }, 2000);
				// console.log(this.unrePL);
			
			}
			else {
				this.consRealizedPlList = [];
                this.grandTotalBuyCharge = 0;
                this.grandTotalBuyValue = 0;
                this.grandTotalSellAvgRate = 0;
                this.grandTotalSellCharge = 0;
                this.grandTotalSellValue = 0;
                this.grandTotalLongTermPl = 0;
                this.grandTotalShortTermPl = 0;
                this.grandTotalIntradayPL = 0;
                this.grandTotalPL = 0;
                this.grandTotalLongTermTaxPL = 0;
				setTimeout(() => {
					this.dataLoad = true;
				}, 1000);
			}
		})
    }
    

    // formula for Avg Buy Rate
    totalBuyAvgRate(tab: any){
        var totalAvgRate;
		var qty = 0;
		var rate = 0
		if (tab.length > 1) {
			for (var k in tab) {
                rate = rate + (tab[k].BuyAvgRate * tab[k].Qty);
                qty = qty + tab[k].Qty
                totalAvgRate = rate / qty
			}
        }
        else{
            totalAvgRate = tab[0].BuyAvgRate
        }
		return totalAvgRate;
    }

    // formula for Avg Sell Rate

    totalSellAvgRate(tab: any){
        var totalAvgRate;
		var qty = 0;
		var rate = 0
		if (tab.length > 1) {
			for (var k in tab) {
                rate = rate + (tab[k].SellAvgRate * tab[k].Qty);
                qty = qty + tab[k].Qty
                totalAvgRate = rate / qty
			}
        }
        else{
            totalAvgRate = tab[0].SellAvgRate
        }
		return totalAvgRate;
    }
    
    goBack() {
        window.history.back();
    }

    groupBy1(array: any, f: any) {
		let groups: any = {};
		array.forEach(function (o: any) {
			var group = JSON.stringify(f(o));
			groups[group] = groups[group] || [];
			groups[group].push(o);
		});
		return Object.keys(groups).map(function (group) {
			return groups[group];
		})
	}
    
    dropClick(sr: any, arr: any) {
		// event.preventDefault();
		arr.forEach((element: any, ind: any) => {
			if (sr !== element.srNo) {
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

    downloadReport(){
        this.subscription = new Subscription();
        this.dataLoad = false;
        let rpId;
        if (this.realizedParams.product == 'cash') {
            rpId = '122';
        } else if (this.realizedParams.product == 'f&o') {
            rpId = '138';
        } else if (this.realizedParams.product == 'currency') {
            rpId = '174';
        } else if (this.realizedParams.product == 'commodity') {
            rpId = '451';
        }
        let downloadObj: any = {
            rptId: rpId,
            Client: this.realizedParams['clientCode'],
            Start: this.realizedParams['fromDate'],
            End: this.realizedParams['ToDate'],
            CallFrom: "AAA",
            SendEmail: 'N'
        }
        downloadObj['ReportFormat'] = 'EXCEL';
        if (this.realizedParams.product == 'cash' || this.realizedParams.product == 'f&o') {
            downloadObj['ScripCode'] = "";
        }
        this.getDownloadData(this.tokenValue, downloadObj)
    }

    getDownloadData(token: any, obj: any) {
		this.subscription.add(
			this.shareReportSer
			.sharedDownloadReport(token, obj)
			.subscribe((res) => {
				this.dataLoad = true;
				this.commonService.downLoadReportFun(res,"realised",'excel');
		}))
	}

    setOrder(value: any) {
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
    formatDecimal(value: any) {
		return value.toFixed(2);
	}
}
