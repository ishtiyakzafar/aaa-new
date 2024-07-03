import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { CommonService } from '../../helpers/common.service';
import { Router } from '@angular/router';
import { SplitNameDate } from '../../helpers/splitNameDate.pipe';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';


@Component({
	selector: 'app-client-live-pl',
	providers: [ClientTradesService, SplitNameDate],
	templateUrl: './client-live-pl.component.html',
	styleUrls: ['./client-live-pl.component.scss'],
})
export class ClientLivePlComponent implements OnInit, OnChanges {
	//@Input() livePlData;
	@Input() netPosition: any;
	@Input() buttonRefresh: any;


	@Input() clientID: any;
	livePlData:any[] = [];
	searchTerm: any = '';
	public dataLoad: boolean = false;
	consolidatearray: any[] = [];
	netPositionDatas: any[] = [];
	netPosHoldingData: any[] = [];
	netPosHoldingDataDesk:any[] = [];
	public datas: any[] = [
		{}, {}, {}, {}
	]
	tokenValue:any;
	livePlResetData:any;
	constructor(private clientService: ClientTradesService, private storage: StorageServiceAAA, private commonservice: CommonService, private router: Router, private splitNameFromDate: SplitNameDate) { }
	ngOnChanges(changes: SimpleChanges): void {
		// console.log(this.buttonRefresh);
		if(this.buttonRefresh == '2'){
			this.dataLoad = false;
			setTimeout(() => {
				this.dataLoad = true;	
			}, 1000);
		}
		this.commonservice.setClevertapEvent('Client&Trades_Equity_LivePnL');	
	}

	ngOnInit() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('sToken').then(token => {
					this.tokenValue = token;
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					// console.log(this.tokenValue);
				})
			}
		})
	
		// console.log(this.clientID)
		this.consolidatearray = [];
		this.netPosition.forEach((data: any, index: any) => {
			var passObj: any = {
				"Exch": data.Exch,
				"ExchType": data.ExchType,
				"ScripCode": data.ScripCode
			}
			this.clientService.getLtpValue(passObj).subscribe((res: any) => {
				res['Data'].forEach((value: any, index: any) => {
					if (data.Exch == value.Exch && data.ScripCode == value.Token) {
						data.LastRate = value.LastRate
					}
				})
			})
		})
		setTimeout(() => {
			this.dataLoad = false;
			this.clientService.getHoldingPl(this.tokenValue, this.clientID).subscribe((res: any) => {
			  if (res['head']['status'] == 0) {
				this.livePlData = res['body']['Lst_HoldingPL'];
			  //   console.log(this.consHoldingPlData);
			  setTimeout(() => {
				var result = this.groupBy1(this.netPosition, function (item: any) {
					return [item.ScripCode, item.Exch, item.ExchType];
				});
				this.livePlData.forEach((data, index) => {
					var passObj = {
						"Exch": data.Exch,
						"ExchType": data.ExchType,
						"ScripCode": data.ScripCode
					}
					this.clientService.getLtpValue(passObj).subscribe((res: any) => {
						res['Data'].forEach((value: any, index: any) => {
							if (data.Exch == value.Exch && data.ScripCode == value.Token) {
								data.LastRate1 = value.LastRate;
								data.Pclose = value.PClose
							}
						})
					})
				})
	
				for (var j in result) {
					var combineObj: any = {}
					combineObj['data'] = result[j];
	
					var buyRateQty = this.BuyRateQty(result[j]) || 0;
					var sellRateQty = this.sellRateQty(result[j]) || 0;
					combineObj['BuyRateQty'] = buyRateQty;
					combineObj['sellRateQty'] = sellRateQty;
					combineObj['netqty'] = this.netQunatity(buyRateQty, sellRateQty);
					combineObj['Holding'] = []
					this.livePlData.forEach(datas => {
						if ((result[j][0].ScripCode == datas.ScripCode) && (result[j][0].Exch == datas.Exch) && (result[j][0].ExchType == datas.ExchType)) {
							combineObj['Holding'].push(datas);
						}
					})
					this.consolidatearray.push(combineObj);
				}
	
				this.livePlData.forEach(datas => {
					datas.NetPosition = []
					this.consolidatearray.forEach(element => {
						if (element.data[0].ScripCode == datas.ScripCode) {
							datas.NetPosition.push(element);
	
						}
					})
	
				})
	
	
				if (this.livePlData.length == 0) {
					// this.consolidatearray = this.consolidatearray.filter(function (el) {
					// 	this.netPositionDatas = el
					// })
					this.consolidatearray.forEach(element => {
						this.netPositionDatas.push(element);
					})
				}
				else {
					this.livePlData.forEach(element => {
						this.consolidatearray = this.consolidatearray.filter(function (el) {
							return el.data[0].ScripCode != element.ScripCode
						})
						this.netPositionDatas = this.consolidatearray;
					});
				}
	
				var netPositionArray: any = [];
				this.netPositionDatas.forEach((data, index) => {
					var dataObj = {
						BuyRate: "N",
						BuyValue: 0,
						LastRate: 0,
						LastRate1: 0,
						NetPosition: [data],
						Name: data.data[0].ScripName,
						Pclose: 0,
						PrevClose: 0,
						Qty: 0
					}
					netPositionArray.push(dataObj)
				})
	
	
				this.netPosHoldingData = this.livePlData.concat(netPositionArray);
				this.netPosHoldingData = this.netPosHoldingData.filter(function (el) {
					if (el.NetPosition.length > 0) {
						return (el.Qty + el.NetPosition[0].netqty != 0) || el.NetPosition[0].data[0].ExchType != 'U'
					}
					else {
						return (el.Qty != 0) || el.ExchType != "U"
					}
				})
				// console.log(this.netPosHoldingData);
				this.netPosHoldingDataDesk = this.netPosHoldingData.filter(function (el){
					let qtyValue 
					if(el.NetPosition.length > 0){
						qtyValue = el.Qty + el.NetPosition[0].netqty
					}
					else{
						qtyValue = el.Qty 
					}
					

					return qtyValue != 0;
				});
				this.livePlResetData = this.netPosHoldingDataDesk
				this.dataLoad = true;
			  }, 500);
	  
			  }
			})	
		}, 700);
	}
	resetData(){
		this.netPosHoldingDataDesk = this.livePlResetData;
	}

	searchWithInput(event: any){
		this.resetData();
		this.netPosHoldingDataDesk = this.netPosHoldingDataDesk.filter((item) => {
			return item.Name.toLowerCase().includes(event.toLowerCase());
		  });
	}	  


	getConsolidateValue(qty: any, ltp: any, pclose: any, netposition: any, buyRate: any) {
		var consolidatevalue: any;
		var value: any;
		var cost: any;
		var totalspl: any;
		var tillpnl: any;
		var investment: any;
		if (netposition.length == 0 && buyRate != 'N') {
			value = Math.abs(qty) * ltp;
			cost = Math.abs(qty) * pclose;

			if (qty > 0) {
				totalspl = value - cost;
				tillpnl = (qty * (ltp - buyRate));
				investment = value - tillpnl;
			}
			else if (qty < 0) {
				totalspl = cost - value;
				tillpnl = Math.abs(qty) * (buyRate - ltp);
				investment = value - tillpnl;
			}
			consolidatevalue = value + '/' + cost + '/' + totalspl + '/' + tillpnl + '/' + investment;
		}
		else if (netposition.length > 0 && buyRate == 'N') {
			value = netposition[0].data[0].LastRate * netposition[0].netqty;

			if (netposition[0].netqty > 0) {
				var getBuySellRate = this.getAvgBuySellRate(netposition[0].BuyRateQty, netposition[0].sellRateQty, netposition[0].data);
			}

			cost = (netposition[0].netqty) * (<any>getBuySellRate);
			totalspl = cost - value;
			tillpnl = totalspl;
			investment = value - tillpnl
			consolidatevalue = value + '/' + cost + '/' + totalspl + '/' + tillpnl + '/' + investment;
		}
		else if (netposition.length > 0 && buyRate != 'N') {
			if (netposition[0].netqty + qty > 0 && qty > 0) {
				value = ltp * (netposition[0].netqty + qty)
				if (netposition[0].netqty > 0) {
					cost = (qty * pclose) + (netposition[0].netqty * this.getAvgBuySellRate(netposition[0].BuyRateQty, netposition[0].sellRateQty,netposition[0].data))
				}
				else {
					cost = (qty + netposition[0].netqty) * pclose
				}
				totalspl = value - cost;

				if (netposition[0].netqty < 0) {
					tillpnl = totalspl + (qty + netposition[0].netqty) * (pclose - buyRate)
				}
				else {
					tillpnl = totalspl + (qty * (pclose - buyRate))
				}
				investment = value - tillpnl;
				consolidatevalue = value + '/' + cost + '/' + totalspl + '/' + tillpnl + '/' + investment;
			}
			else if ((netposition[0].netqty + qty < 0) && qty > 0) {
				value = (netposition[0].netqty + qty) * ltp
				cost = (netposition[0].netqty + qty) * this.getAvgSellRate(netposition[0].sellRateQty);
				totalspl = value - cost;
				tillpnl = totalspl
				investment = value - tillpnl
				consolidatevalue = value + '/' + cost + '/' + totalspl + '/' + tillpnl + '/' + investment;
			}
			else if (qty < 0 && netposition[0].netqty < 0) {
				value = (netposition[0].netqty + qty) * ltp;
				cost = (qty * pclose + (netposition[0].netqty * this.getAvgBuySellRate(netposition[0].BuyRateQty, netposition[0].sellRateQty,netposition[0].data)));
				totalspl = value - cost;
				tillpnl = totalspl + (qty * (pclose - buyRate))
				investment = value - tillpnl
				consolidatevalue = value + '/' + cost + '/' + totalspl + '/' + tillpnl + '/' + investment;
			}
			else if (qty < 0 && (qty + netposition[0].netqty) > 0) {
				value = (netposition[0].netqty + qty) * ltp;
				cost = (netposition[0].netqty + qty) * this.getAvgBuySellRate(netposition[0].BuyRateQty, netposition[0].sellRateQty,netposition[0].data)
				totalspl = value - cost;
				tillpnl = totalspl;
				investment = value - tillpnl;
				consolidatevalue = value + '/' + cost + '/' + totalspl + '/' + tillpnl + '/' + investment;
			}
			else if (qty < 0 && netposition[0].netqty > 0 && (qty + netposition[0].netqty) < 0) {
				value = (netposition[0].netqty + qty) * ltp;
				cost = (qty + netposition[0].netqty) * pclose;
				totalspl = value - cost;
				tillpnl = totalspl + (qty * (pclose - buyRate));
				investment = value - tillpnl;
				consolidatevalue = value + '/' + cost + '/' + totalspl + '/' + tillpnl + '/' + investment;
			}
			else if (qty + netposition[0].netqty == 0) {
				value = 0;
				cost = 0;
				totalspl = 0;
				tillpnl = 0;
				investment = 0;
				consolidatevalue = value + '/' + cost + '/' + totalspl + '/' + tillpnl + '/' + investment;
			}
		}
		return consolidatevalue
	}

	getHoldingValue(qty: any, ltp: any, pclose: any, netposition: any, buyRate: any) {
		var holdingValue = this.getConsolidateValue(qty, ltp, pclose, netposition, buyRate).split("/")[0];
		return holdingValue
	}

	getInvestValue(qty: any, ltp: any, pclose: any, netposition: any, buyRate: any) {
		var InvestValue = this.getConsolidateValue(qty, ltp, pclose, netposition, buyRate).split("/")[4];
		return InvestValue;
	}
	getTodayPl(qty: any, ltp: any, pclose: any, netposition: any, buyRate: any) {
		var todayPl = this.getConsolidateValue(qty, ltp, pclose, netposition, buyRate).split("/")[2];
		return todayPl;
	}

	gettilldatePl(qty: any, ltp: any, pclose: any, netposition: any, buyRate: any) {
        var tillPl = this.getConsolidateValue(qty, ltp, pclose, netposition, buyRate).split("/")[3];
        // console.log('check value' + tillPl);
		return tillPl;
	}
	// call function for avg Sell Rate
	getAvgSellRate(sellRate: any) {
		var avgSellRate: any;
		if (sellRate != 0) {
			var calselRate = this.splitAvgRateQty(sellRate, 1);
			var calselQty = this.splitAvgRateQty(sellRate, 2);
			avgSellRate = calselRate / calselQty
		}
		else {
			sellRate = 0
		}
		return avgSellRate
	}
	// calculate the buy sell avg Rate
	getAvgBuySellRate(buyRate: any, sellRate: any, netPositionData: any) {
		var avgRate;
		if (buyRate != 0 && sellRate != 0) {
			var calBuyRate = this.splitAvgRateQty(buyRate, 1);
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			var calselRate = this.splitAvgRateQty(sellRate, 1);
			var calselQty = this.splitAvgRateQty(sellRate, 2);
			var avgBuyRate = calBuyRate / calBuyQty;
			var avgSellRate = calselRate / calselQty;

			if (avgBuyRate > avgSellRate) {
				avgRate = avgBuyRate
			}
			else {
				avgRate = avgSellRate
			}

		}
		else if (buyRate != 0 && sellRate == 0) {
			var calBuyRate = this.splitAvgRateQty(buyRate, 1);
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			var calselRate = this.splitAvgRateQty(sellRate, 1);
			var calselQty = this.splitAvgRateQty(sellRate, 2);
		    if(netPositionData.length > 1){
				var avgBuyRate = calBuyRate / calBuyQty;
				avgRate = calBuyRate;
			}
			else{
				avgRate = calBuyRate;
			}
			
		}
		else if (buyRate == 0 && sellRate != 0) {
			var calBuyRate = this.splitAvgRateQty(buyRate, 1);
			var calBuyQty = this.splitAvgRateQty(buyRate, 2);
			var calselRate = this.splitAvgRateQty(sellRate, 1);
			var calselQty = this.splitAvgRateQty(sellRate, 2);
			if(netPositionData.length > 1){
				var avgSellRate = calselRate / calselQty;
				avgRate = avgSellRate;
			}
			else{
				avgRate = calselRate;
			}
			
		}
		return avgRate;
	}
	// calculate the net Qty
	netQunatity(buyRateQty: any, sellRateQty: any) {
		var totlNetQty = 0
		if (buyRateQty != 0 && sellRateQty != 0) {
			//var totBuyRate = this.splitAvgRateQty(buyRateQty, 1);
			var totBuyQty = this.splitAvgRateQty(buyRateQty, 2);
			//	var totselRate = this.splitAvgRateQty(sellRateQty, 1);
			var totselQty = this.splitAvgRateQty(sellRateQty, 2);
			totlNetQty = totBuyQty - totselQty;
		}
		else if (buyRateQty == 0 && sellRateQty != 0) {
			var totBuyQty = this.splitAvgRateQty(buyRateQty, 2);
			var totselQty = this.splitAvgRateQty(sellRateQty, 2);
			totlNetQty = 0 - totselQty;
		}
		else if (buyRateQty != 0 && sellRateQty == 0) {
			var totBuyQty = this.splitAvgRateQty(buyRateQty, 2);
			var totselQty = this.splitAvgRateQty(sellRateQty, 2);
			totlNetQty = totBuyQty - 0;
		}
		return totlNetQty;
	}
	// display the name acc
	getName(name: any, netposition: any, buyRate: any) {
		var displayNme;
		if (netposition.length == 0) {
			displayNme = name
		}
		else if (netposition.length > 0) {
			displayNme = netposition[0].data[0].ScripName
		}
		return displayNme;
	}

	getLTP(ltp: any, netposition: any, buyRate: any) {
		var lastRate
		if (netposition.length == 0) {
			lastRate = ltp
		}
		else if (netposition.length > 0) {
			lastRate = netposition[0].data[0].LastRate
		}
		return lastRate;
	}

	doRefresh() {
		this.searchTerm = '';
		this.dataLoad = false;
		this.resetData();
		setTimeout(() => {
			this.dataLoad = true;
		}, 500);
	}
	getExchAndExchType(exch: any, exchType: any, netposition: any, buyRate: any) {
		var exchExchType: any;
		if (netposition.length == 0 && buyRate != 'N') {
			exchExchType = exch + ',' + exchType
		}
		else if (netposition.length > 0 && buyRate == 'N') {
			exchExchType = netposition[0].data[0].Exch + ',' + netposition[0].data[0].ExchType
		}
		return exchExchType;
	}


	getQty(qty: any, netposition: any, buyRate: any) {
		var openQty: any;
		if (netposition.length == 0 && buyRate != 'N') {
			openQty = qty
		}
		else if (netposition.length > 0 && buyRate == 'N') {
			openQty = netposition[0].netqty
		}
		else if (netposition.length > 0 && buyRate != 'N') {
			openQty = qty + netposition[0].netqty
		}

		return openQty;
	}
	// Total Buy Rate Qty from Calculation
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
	// split the total Rate and Qty from Each Record
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
	// calculate Sell Rate Qty
	sellRateQty(tab: any) {
		var concatsRateQty;
		var sRate = 0;
		var sQty = 0
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
	// consolidate the record according to type and Name in array
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

	goToCompanyDetails(data: any){
		localStorage.setItem('clientDetail', "true")
		// console.log(data);
		if (data.NetPosition.length == 0 && data.BuyRate != 'N') {
			if(this.splitNameFromDate.transform(data.Name,"date").length == 0){
				this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, data.Name.split(' ')[0] + data.ExchType, data.Name.split(' ')[0]]);
			}
			else{
				if(data.Name.includes('CE') || data.Name.includes('PE')){
					this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, this.splitNameFromDate.transform(data.Name,"date").split(' ').join('-').toUpperCase().substring(1) + data.ExchType, data.Name.split(' ')[0]])
				}
				else{
					this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, this.splitNameFromDate.transform(data.Name,"date").split(' ').join('-').toUpperCase().substring(1) + data.ExchType, data.Name.split(' ')[0]])
				}
			}
			//this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, data.Name + data.ExchType, data.Name]);
		}
		else if (data.NetPosition.length > 0 && data.BuyRate == 'N') {
			if(this.splitNameFromDate.transform(data['NetPosition'][0]['data'][0].ScripName,"date").length == 0){
				this.router.navigate(['/company-details', data['NetPosition'][0]['data'][0].Exch, data['NetPosition'][0]['data'][0].ExchType, data['NetPosition'][0]['data'][0].ScripCode, data['NetPosition'][0]['data'][0].ScripName.split(' ')[0] + data['NetPosition'][0]['data'][0].ExchType, data['NetPosition'][0]['data'][0].ScripName.split(' ')[0]]);
			}
			else{
				if(data['NetPosition'][0]['data'][0].ScripName.includes('CE') || data['NetPosition'][0]['data'][0].ScripName.includes('PE')){
					this.router.navigate(['/company-details', data['NetPosition'][0]['data'][0].Exch, data['NetPosition'][0]['data'][0].ExchType, data['NetPosition'][0]['data'][0].ScripCode, this.splitNameFromDate.transform(data['NetPosition'][0]['data'][0].ScripName,"date").split(' ').join('-').toUpperCase().substring(1) + data['NetPosition'][0]['data'][0].ExchType, data['NetPosition'][0]['data'][0].ScripName.split(' ')[0]])
				}
				else{
					this.router.navigate(['/company-details', data['NetPosition'][0]['data'][0].Exch, data['NetPosition'][0]['data'][0].ExchType, data['NetPosition'][0]['data'][0].ScripCode, this.splitNameFromDate.transform(data['NetPosition'][0]['data'][0].ScripName,"date").split(' ').join('-').toUpperCase().substring(1) + data['NetPosition'][0]['data'][0].ExchType, data['NetPosition'][0]['data'][0].ScripName.split(' ')[0]])
				}
			}
			//console.log(data['NetPosition'][0]['data'][0].Exch);
			//this.router.navigate(['/company-details', data['NetPosition'][0]['data'][0].Exch, data['NetPosition'][0]['data'][0].ExchType, data['NetPosition'][0]['data'][0].ScripCode, data['NetPosition'][0]['data'][0].ScripName + data['NetPosition'][0]['data'][0].ExchType, data['NetPosition'][0]['data'][0].ScripName]);
		}
		else if (data.NetPosition.length > 0 && data.BuyRate != 'N') {
			if(this.splitNameFromDate.transform(data.Name,"date").length == 0){
				this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, data.Name.split(' ')[0] + data.ExchType, data.Name.split(' ')[0]]);
			}
			else{
				if(data.Symbol.includes('CE') || data.Symbol.includes('PE')){
					this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, this.splitNameFromDate.transform(data.Name,"date").split(' ').join('-').toUpperCase().substring(1) + data.ExchType, data.Name.split(' ')[0]])
				}
				else{
					this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, this.splitNameFromDate.transform(data.Name,"date").split(' ').join('-').toUpperCase().substring(1) + data.ExchType, data.Name.split(' ')[0]])
				}
			}
			//this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, data.Name + data.ExchType, data.Name]);
		}
	}

}
