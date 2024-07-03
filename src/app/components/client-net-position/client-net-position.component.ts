import { Component, Input, OnInit } from '@angular/core';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { CommonService } from '../../helpers/common.service';
import { Router } from '@angular/router';
import { SplitNameDate } from '../../helpers/splitNameDate.pipe';

@Component({
	selector: 'app-client-net-position',
	providers: [ClientTradesService, SplitNameDate],
	templateUrl: './client-net-position.component.html',
	styleUrls: ['./client-net-position.component.scss'],
})
export class ClientNetPositionComponent implements OnInit {
	@Input() netPosition: any;

	public dataLoad: boolean = false;
	netPositionRecu: any;
	netPositionList: any[] = [];
	public datas: any[] = [
		{}, {}, {}
	]
	netPositionListArray: any[] = [];
	netPositionResetData:any;
	constructor(private clientService: ClientTradesService, private commonservice: CommonService, private router: Router, private splitNameFromDate: SplitNameDate) { }

	ngOnInit() {
		this.dataLoad = false;
		var result = this.groupBy1(this.netPosition, function (item: any) {
			return [item.ScripCode, item.DelvIntra];
		});
		// console.log(result);
		this.netPositionList = [];
		for (var j in result) {
			var buyRateQty = this.BuyRateQty(result[j]) || 0;
			//var buyCalculate = this.splitAvgRateQty(buyRateQty,'1')/this.splitAvgRateQty(buyRateQty,'2') || 0;
			var sellRateQty = this.sellRateQty(result[j]) || 0;

			//var sellCalculate = this.splitAvgRateQty(sellRateQty,'1')/this.splitAvgRateQty(sellRateQty,'2') || 0;
			var displayName = this.ScripName(result[j]);
			var combineObj = {
				"data": result[j],
				"name": displayName,
				"BuyRateQty": buyRateQty,
				//"buyCalculate":buyCalculate,
				//"sellCalculate":sellCalculate,
				"sellRateQty": sellRateQty
			};
			this.netPositionList.push(combineObj);
		}
		this.updateListData(this.netPositionList)
		this.dataLoad = true;
		this.commonservice.setClevertapEvent('Client&Trades_Equity_NetPosition');
	}
	updateListData(dataArray: any) {
		var array: any = [];
		dataArray.forEach((data: any, index: any) => {
			var passObj = {
				"Exch": data.data[0].Exch,
				"ExchType": data.data[0].ExchType,
				"ScripCode": data.data[0].ScripCode
			}
			array.push(passObj)
			// console.log(array);
		})
		this.updateArrayData(dataArray, array);

	}
	updateArrayData(dataArray: any, array: any) {
		this.clientService.getArrayLtpValue(array).subscribe((res: any) => {
			dataArray.forEach((data: any, index: any) => {
				res['Data'].forEach((element: any, index: any) => {
					if (data.data[0].ScripCode == element.Token) {
						data.data[0].LastRate = element.LastRate
					}
				})
			})
			this.netPositionListArray = dataArray;
		})
		clearTimeout(this.netPositionRecu);
		this.netPositionRecu = setTimeout(() => {
			this.updateArrayData(dataArray, array);
		}, 2000);
	}

	// calculate the data for booked p&l of each record
	bookedPL(buyRate: any, sellRate: any) {
		var TotalCalculate: any;

		if (buyRate != 0 && sellRate != 0) {
			var calBuyRate = this.splitAvgRateQty(buyRate, 1);
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			var calselRate = this.splitAvgRateQty(sellRate, 1);
			var calselQty = this.splitAvgRateQty(sellRate, 2);

			var avgBuyRate = calBuyRate / calBuyQty;
			var avgSellRate = calselRate / calselQty;

			if (calBuyQty == calselQty) {
				TotalCalculate = (calselRate - calBuyRate)
			}
			else if (parseInt(calBuyQty) > parseInt(calselQty)) {
				TotalCalculate = calselQty * (avgBuyRate - avgSellRate)
			}
			else if (parseInt(calBuyQty) < parseInt(calselQty)) {
				TotalCalculate = calBuyQty * (avgBuyRate - avgSellRate)
			}

		}
		else if (buyRate != 0 && sellRate == 0) {
			var calBuyRate = this.splitAvgRateQty(buyRate, 1);
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			TotalCalculate = 0;
		}
		else if (buyRate == 0 && sellRate != 0) {
			var calselRate = this.splitAvgRateQty(sellRate, 1);
			var calselQty = this.splitAvgRateQty(sellRate, 2);
			TotalCalculate = 0;
		}
		return (TotalCalculate);
	}
	// calculate Net Qty
	calculateNetQty(buyRate: any, sellRate: any) {
		var totalNetQty;
		if (buyRate != 0 && sellRate != 0) {
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			var calselQty = this.splitAvgRateQty(sellRate, 2);
			totalNetQty = calBuyQty - calselQty
		}
		else if (buyRate == 0 && sellRate != 0) {
			var calselQty = this.splitAvgRateQty(sellRate, 2);
			totalNetQty = -calselQty;
		}
		else {
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			totalNetQty = calBuyQty;
		}
		return totalNetQty;
	}


	// calculate M to M value
	calculateMtoM(ltp: any, datas: any, buyRate: any, sellRate: any) {
		var totalMtoM: any;
		if (buyRate != 0 && sellRate != 0) {
			var calBuyRate = this.splitAvgRateQty(buyRate, 1);
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			var calselRate = this.splitAvgRateQty(sellRate, 1);
			var calselQty = this.splitAvgRateQty(sellRate, 2);
			var avgBuyRate = calBuyRate / calBuyQty;
			var avgSellRate = calselRate / calselQty;
			if (calBuyQty == calselQty) {
				totalMtoM = 0;
			}
			else if (parseInt(calBuyQty) > parseInt(calselQty)) {
				totalMtoM = (ltp - avgBuyRate) * Math.abs(calBuyQty - calselQty)
			}
			else if (parseInt(calBuyQty) < parseInt(calselQty)) {
				totalMtoM = (avgSellRate - ltp) * (calBuyQty - calselQty);
			}
		}
		else if (buyRate != 0 && sellRate == 0) {
			var calBuyRate = this.splitAvgRateQty(buyRate, 1);
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			var calselRate = this.splitAvgRateQty(sellRate, 1);
			var calselQty = this.splitAvgRateQty(sellRate, 2);
			if(datas.length > 1){
				totalMtoM = (ltp - (calBuyRate/calBuyQty)) * Math.abs(calBuyQty - 0);
			}
			else{
				totalMtoM = (ltp - calBuyRate) * Math.abs(calBuyQty - 0);
			}
		}
		else if (buyRate == 0 && sellRate != 0) {
			var calBuyRate = this.splitAvgRateQty(buyRate, 1);
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			var calselRate = this.splitAvgRateQty(sellRate, 1);
			var calselQty = this.splitAvgRateQty(sellRate, 2);
			if(datas.length > 1){
				totalMtoM = ((calselRate/calselQty) - ltp) * Math.abs(0 - calselQty);
			}
			else{
				totalMtoM = (calselRate - ltp) * Math.abs(0 - calselQty);
			}
		}
		return totalMtoM;
	}
	// calculate buy rate Qty
	displayBuyRateQty(buyRate: any, data: any) {
		var buyRateQty: any;
		if (buyRate != 0) {
			var calBuyRate = this.splitAvgRateQty(buyRate, 1);
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			var avgBuyRate;
			if (data.length > 1) {
				avgBuyRate = (calBuyRate / calBuyQty).toFixed(2);
			}
			else {
				avgBuyRate = calBuyRate;
			}

			buyRateQty = calBuyQty + '/' + avgBuyRate;
		}
		else {
			buyRateQty = 0
		}
		return buyRateQty;
	}
	// calculate sell rate Qty
	displaySellRateQty(sellRate: any, data: any) {
		var sellRateQty;
		if (sellRate != 0) {
			var calselRate = this.splitAvgRateQty(sellRate, 1);
			var calselQty = this.splitAvgRateQty(sellRate, 2);
			var avgSellRate;
			if (data.length > 1) {
				avgSellRate = (calselRate / calselQty).toFixed(2);
			}
			else {
				avgSellRate = calselRate
			}

		sellRateQty = calselQty + '/' + avgSellRate;
		}
		else {
			sellRateQty = 0;
		}
		return sellRateQty
	}
	// display Scrip Name
	ScripName(tab: any) {
		var scripName;
		for (var k in tab) {
			scripName = tab[k].ScripName;
		}
		return scripName;
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
	// calculate buy Rate Qty
	BuyRateQty(tab: any, Qtyvalue?: any) {
		var concatbRateQty: any;
		var bRate = 0;
		var bQty = 0
		if (tab.length > 1) {
			for (var k in tab) {
				if (tab[k].BuySell == "B") {
					bRate = bRate + (tab[k].Rate * tab[k].Qty);
					bQty = bQty + tab[k].Qty
					concatbRateQty = bRate.toFixed(2) + '/' + bQty
				}
			}

		}
		else if (tab.length == 1 && tab[0].BuySell == 'B') {
			bRate = tab[0].Rate;
			bQty = tab[0].Qty
			concatbRateQty = bRate.toFixed(2) + '/' + bQty
		}
		else {
			bRate = 0;
			bQty = 0
			concatbRateQty = 0
		}
		return concatbRateQty;

	}
	checkTabLength(tab: any) {
		var checkLength;
		checkLength = tab.length;
		return checkLength;
	}
	// calculate Sell Rate Qty
	sellRateQty(tab: any) {
		var concatsRateQty;
		var sRate = 0;
		var sQty = 0
		//console.log(tab);
		if (tab.length > 1) {
			for (var k in tab) {
				if (tab[k].BuySell == "S") {
					sRate = sRate + (tab[k].Rate * tab[k].Qty);
					sQty = sQty + tab[k].Qty
					concatsRateQty = sRate.toFixed(2) + '/' + sQty
				}
			}

		}
		else if (tab.length == 1 && tab[0].BuySell == 'S') {
			sRate = tab[0].Rate;
			sQty = tab[0].Qty
			concatsRateQty = sRate.toFixed(2) + '/' + sQty
		}
		else {
			sRate = 0;
			sQty = 0
			concatsRateQty = 0
		}
		return concatsRateQty;
	}
	// Split Avg Rate Qty
	splitAvgRateQty(value: any, para: any) {
		var res;
		if (value !== 0) {
			if (para == "1") {
				res = value.split('/')[0];
			}
			else {
				res = value.split('/')[1];
			}
		}

		return res;

	}
	dropClick(index: any, arr: any) {
		// this.dropBtn = true;
		// console.log('Closing value: ', val.High);
		arr.forEach((element: any, ind: any) => {
			if ((index) !== ind) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
		// val['isVisible'] = val['isVisible'] ? false : true;
	}

	goToCompanyDetails(data: any){
		localStorage.setItem('clientDetail', "true")
		// console.log(data);
		if(this.splitNameFromDate.transform(data['data'][0].ScripName,"date").length == 0){
			this.router.navigate(['/company-details', data['data'][0].Exch, data['data'][0].ExchType, data['data'][0].ScripCode, data['data'][0].ScripName.split(' ')[0] + data['data'][0].ExchType, data['data'][0].ScripName.split(' ')[0]]);
   		}
		else{
			if(data['data'][0].ScripName.includes('CE') || data['data'][0].ScripName.includes('PE')){
				this.router.navigate(['/company-details', data['data'][0].Exch, data['data'][0].ExchType, data['data'][0].ScripCode, this.splitNameFromDate.transform(data['data'][0].ScripName,"date").split(' ').join('-').toUpperCase().substring(1) + data['data'][0].ExchType, data['data'][0].ScripName.split(' ')[0]])
			}
			else{
				this.router.navigate(['/company-details', data['data'][0].Exch, data['data'][0].ExchType, data['data'][0].ScripCode, this.splitNameFromDate.transform(data['data'][0].ScripName,"date").split(' ').join('-').toUpperCase().substring(1) + data['data'][0].ExchType, data['data'][0].ScripName.split(' ')[0]])
			}
		}
    	//this.router.navigate(['/company-details', data['data'][0].Exch, data['data'][0].ExchType, data['data'][0].ScripCode, data['data'][0].ScripName + data['data'][0].ExchType, data['data'][0].ScripName]);
	}
	ionViewWillLeave() {
		clearTimeout(this.netPositionRecu);
	}
	ngOnDestroy() {
		clearTimeout(this.netPositionRecu);
	}

	doRefresh() {
		this.dataLoad = false;
		this.updateListData(this.netPositionList)
		setTimeout(() => {
			this.dataLoad = true;
		}, 500);
	}
}
