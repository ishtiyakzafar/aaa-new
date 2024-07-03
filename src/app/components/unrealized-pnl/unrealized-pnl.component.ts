import { Component, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import { Platform, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-unrealized-pnl',
	providers: [ShareReportService],
	templateUrl: './unrealized-pnl.component.html',
	styleUrls: ['./unrealized-pnl.component.scss'],
})
export class UnrealizedPnlComponent implements OnInit, OnChanges {
	@ViewChild('detail') detail!: ElementRef;
	moment: any= moment;
	@Input() unrealizedParams: any;
	public detailHeight!: number;
	reverse: boolean = false;
	public ascending!: boolean;
	public order: any;
	dataLoad!:boolean;
	paramDecimal:any;
	unrePL: any[] = [];
	unrealizedPlData: any[] = [];
	totalUnrealizedPl:any;
	tokenValue:any;
	private subscription: any;
	@Input() callFromDesktop: boolean = false;
	public val: string = 'asc';

	constructor(private shareReportSer: ShareReportService, private storage: StorageServiceAAA, private platform: Platform, private commonService: CommonService) { }
	ngOnChanges(changes: SimpleChanges): void {
		if (this.platform.is('desktop') || this.callFromDesktop) {
			this.initUnrealizedPl();
		}
	}

	ngOnInit() {
		if (!this.platform.is('desktop') && !this.callFromDesktop) {
			this.unrealizedParams = this.commonService.getData();
			this.initUnrealizedPl();
		}	
	}

	initUnrealizedPl() {
		// console.log(this.unrealizedParams);
		if(this.unrealizedParams.product == "currency"){
			this.paramDecimal = 'U'
		}
		else{
			this.paramDecimal = 'C'
		}
		this.dataLoad = false;
		this.unrealizedPlData = [];
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenValue = token;
					this.getUnrealizedPlList(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					this.getUnrealizedPlList(token)
				})
			}
		})
	}

	getUnrealizedPlList(token: any) {
		this.shareReportSer.getUnrealizedPl(token, this.unrealizedParams).subscribe((res) => {
			if (res['Head']['ErrorCode'] == 0) {

				if(res['Body']['UnRealized'].length > 0){
					this.unrePL = res['Body']['UnRealized'];
					// console.log(this.unrePL);
					this.totalUnrealizedPl = this.unrePL.reduce((el: any, li: any) => el + li.M2M, 0);
					var result = this.groupBy1(this.unrePL, function (item: any) {
						return [item.ScriptName];
					});
					this.unrealizedPlData = [];
					for (var j in result) {
						var combineObj = {
							"srNo": parseInt(Object.keys(result)[j]),
							"Data": result[j],
							"ScripName":result[j][0].ScriptName,
							"PreClose":result[j][0].PreClose,
							"TotalQty": result[j].reduce((el: any, li: any) => el + li.Qty, 0),
							"TotalBuyAvgRate": result[j].reduce((el: any, li: any) => el + li.BuyValue, 0)/result[j].reduce((el: any, li: any) => el + li.Qty, 0),
							"TotalBuyValue": result[j].reduce((el: any, li: any) => el + li.BuyValue, 0),
							"TotalMarketValue": result[j].reduce((el: any, li: any) => el + li.MarketValue, 0),
							"TotalM2M": result[j].reduce((el: any, li: any) => el + li.M2M, 0),
						};
						this.unrealizedPlData.push(combineObj);
					}
					
					this.unrealizedPlData = this.unrealizedPlData.sort((a, b) => (a.ScripName > b.ScripName) ? -1 : 1);
					// console.log(this.unrealizedPlData);
				
				}
				else{
					this.unrealizedPlData = [];
					this.totalUnrealizedPl = 0.00;
					this.unrePL = [];
				}
				setTimeout(() => {
					this.dataLoad = true;
				}, 1000);
			
			}
			else {
				this.unrealizedPlData = [];
				this.totalUnrealizedPl = 0.00;
				setTimeout(() => {
					this.dataLoad = true;
				}, 2000);
			}
		})
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
		let rId;
		if (this.unrealizedParams.product == 'cash') {
			rId = '130';
		} else if (this.unrealizedParams.product == 'f&o') {
			rId = '139';
		} else if (this.unrealizedParams.product == 'currency') {
			rId = '175';
		} else if (this.unrealizedParams.product == 'commodity') {
			rId = '450';
		}
		let downloadObj: any = {
			rptId: rId,
			Client: this.unrealizedParams.clientCode,
			End: this.unrealizedParams['tillDate'],
			ScripCode: "",
			CallFrom: "AAA",
			SendEmail: 'N'
		}
		downloadObj['ReportFormat'] = 'EXCEL';
		this.getDownloadData(this.tokenValue, downloadObj)
	}

	getDownloadData(token: any, obj: any) {
		this.subscription.add(
			this.shareReportSer
			.sharedDownloadReport(token, obj)
			.subscribe((res) => {
				this.dataLoad = true;
				this.commonService.downLoadReportFun(res,"unrealised",'excel');
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

	// dropClick(sr, arr) {
	// 	arr.forEach((element, ind) => {
	// 		if (sr !== element.srNo) {
	// 			element['isVisible'] = false;
	// 		} else {
	// 			element['isVisible'] = element['isVisible'] ? false : true;
	// 		}
	// 	});
	// }

}
