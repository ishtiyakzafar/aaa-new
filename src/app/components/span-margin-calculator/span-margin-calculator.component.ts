import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SpanScripService } from './span-margin.service';
import { Subscription } from 'rxjs';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-span-margin-calculator',
	providers: [SpanScripService],
	templateUrl: './span-margin-calculator.component.html',
	styleUrls: ['./span-margin-calculator.component.scss'],
})

export class SpanMarginCalculatorComponent implements OnInit {

	public equityBlockValue: any = 'equity';
	public futuresBlockValue: any = 'F';
	public buyBlockValue: any = 'buy';
	public callBlockValue: any = 'CE';
	public calculatorData: any[] = [
		// { status: 'buy', scrip: 'BAJAFINANCE', date: '09 July 2020', strikePrice: '8000', quantity: '505' },
		// { status: 'sell', scrip: 'BAJAFINANCE', date: '09 July 2020', strikePrice: '8000', quantity: '505' },
	];

	private subscription = new Subscription();

	public search_item: any;
	public searchErrorMessage: any;
	public scripList: any = [];
	public dataVisible = false;

	public expiryDates: any = [];
	public selectdate: any;

	public strikeRateData = [];
	public selectedStrikePrice: any;

	public scripCode: any;
	public marketLot: any;
	public lotQTY: any;

	public price = null;
	public exposureMargin: any = 0;
	public spanMargin: any = 0;
	public totalMargin: any = 0;

	constructor(private modalController: ModalController,
		private storage: StorageServiceAAA,
		private toast: ToasterService,
		private commonService: CommonService,
		private serviceFile: SpanScripService) { }

	ngOnInit() {
		this.calculation(true);
	}

	public goBack() {
		window.history.back();
	  }

	// async dismiss() {
	// 	await this.modalController.dismiss();
	// }

	public getItems(event: any) {
		this.search_item = event.target.value;
		if (this.search_item) {
			// this.dataVisible = true;
			if (this.search_item.length <= 2) {
				this.searchErrorMessage = 'Please enter at least 3 characters...';
			} else {
				this.searchErrorMessage = null;
				if (this.equityBlockValue === 'equity') {
					this.getEquityScripList(this.search_item);
				} else if (this.equityBlockValue === 'currency') {
					this.getCurrencyScripList(this.search_item);
				}
			}
			
		} else {
			this.scripList = [];
			this.dataVisible = false;
		}
		/* this.serchString = ev.detail.value;
		if (this.serchString == '') {
		  this.minStringMsg = null
		  this.scripSearch = "Please Search Scrip Name in input";
		  this.combineFutureData = [];
		  this.equityCashTabList = [];
		}
		else if (this.serchString != '') {
		  if (this.serchString.length <= 2) {
			this.minStringMsg = 'Please enter 3 characters at least...';
		  }
		  else if (this.serchString.length > 2) {
			this.minStringMsg = null;
	
			this.equityBlockSegmentChanged(this.equityBlockTabValue,this.cashFutureOptionTabValue );
		  }
		} */
	}

	public getEquityScripList(textValue: any) {
		const obj = {
			DerivativeType: this.futuresBlockValue,
			Symbol: textValue
		}
		this.subscription.add(
			this.serviceFile
				.getEquityScrips(obj)
				.subscribe((response: any) => {
					this.dataVisible = true;
					if (response['Status'] === 0) {
						this.scripList = response['Data'];
					} else {
						this.scripList = [];
						this.toast.displayToast('No records found.');
					}
				})
		)
	}

	public getCurrencyScripList(textValue: any) {
		const obj = {
			DerivativeType: this.futuresBlockValue,
			Symbol: textValue
		}
		this.subscription.add(
			this.serviceFile
				.getCurrencyScrips(obj)
				.subscribe((response: any) => {
					this.dataVisible = true;
					if (response['Status'] === 0) {
						this.scripList = response['Data'];
					} else {
						this.scripList = [];
						this.toast.displayToast('No records found.');
					}
				})
		)
	}

	public getScripValue(obj: any) {
		this.dataVisible = false;
		const passObj = {
			Exch: obj['Exchange'],
			ExchType: obj['ExchangeType'],
			Symbol: this.equityBlockValue === 'equity' ? obj['Symbol'] : obj['Name']
		}
		this.search_item = this.search_item + (obj['Exchange'] == 'N' ? ' (NSE)' : ' (BSE)');
		if (this.futuresBlockValue === 'F') {
			this.getFutureExpiryDates(passObj);
		} else if (this.futuresBlockValue === 'O') {
			this.getOptionsExpiryDates(passObj);
		}
	}

	public getFutureExpiryDates(obj: any) {
		const recievedData = obj;
		this.subscription.add(
			this.serviceFile
				.getSearchFutureDetails(obj)
				.subscribe((response: any) => {
					if (response['Status'] === 0) {
						
						this.expiryDates = [];

						response['Data'].forEach((element: any) => {
							const formattedDate = this.getDate(element['Expiry']);
							this.expiryDates.push({
								OExpiry: element['Expiry'],
								Expiry: formattedDate,
								MarketLot: element['MarketLot'],
								ScripCode: element['ScripCode'],
								TickSize: element['TickSize'],
								Exch: recievedData['Exch'],
								ExchType: recievedData['ExchType'],
								Symbol: recievedData['Symbol']
							})
						});
						this.selectdate = this.expiryDates[0]['Expiry'];
						this.marketLot = this.expiryDates[0]['MarketLot'];
						this.lotQTY = this.expiryDates[0]['MarketLot'];
						this.callStrikeAPI(this.selectdate);
					} else {
						this.expiryDates = [];
					}
				})
		)
	}

	public getOptionsExpiryDates(obj: any) {
		const recievedData = obj;
		this.subscription.add(
			this.serviceFile
				.getSearchOptionExpiry(obj)
				.subscribe((response: any) => {
					if (response['Status'] === 0) {
						
						this.expiryDates = [];

						response['Data'].forEach((element: any) => {
							const formattedDate = this.getDate(element['Expiry']);
							this.expiryDates.push({
								OExpiry: element['Expiry'],
								Expiry: formattedDate,
								Exch: recievedData['Exch'],
								ExchType: recievedData['ExchType'],
								Symbol: recievedData['Symbol']
							})
						});
						this.selectdate = this.expiryDates[0]['Expiry'];
						this.callStrikeAPI(this.selectdate);
					} else {
						this.expiryDates = [];
					}
				})
		)
	}

	public expiryDateChange(event: any) {
		const selected = event;
		this.callStrikeAPI(selected);
	}

	public callStrikeAPI(selected: any, strikeChange?: any) {
		this.expiryDates.forEach((element: any) => {
			if (element['Expiry'] === selected) {
				if (strikeChange) {
					const params = {
						Exch: element['Exch'],
						ExchType: element['ExchType'],
						ScripCode: this.scripCode
					}
					this.getPriceMarketFeed(params);
				} else {
					this.marketLot = element['MarketLot'];
					this.lotQTY = element['MarketLot'];
					if (this.futuresBlockValue === 'O') {
						if (this.callBlockValue === 'PE') {
							const params = {
								Exch: element['Exch'],
								CallPut: "PUT",
								Symbol: element['Symbol'],
								Expiry: this.selectdate
							}
							this.getOptionStrikeValues(params, element['ExchType']);
						} else if (this.callBlockValue === 'CE') {
							const params = {
								Exch: element['Exch'],
								CallPut: "CALL",
								Symbol: element['Symbol'],
								Expiry: this.selectdate
							}
							this.getOptionStrikeValues(params, element['ExchType']);
						}
					} else {
						const params = {
							Exch: element['Exch'],
							ExchType: element['ExchType'],
							ScripCode: element['ScripCode'],
						}
						this.getPriceMarketFeed(params);
					}
				}
			}
		});
	}

	public getOptionStrikeValues(obj: any, exchType: any) {
		this.subscription = new Subscription();
		this.subscription.add(
			this.serviceFile
				.getOptionsScripDetails(obj)
				.subscribe((response: any) => {
					if (response['Status'] === 0) {
						this.strikeRateData = response['Data'];
						let selectstrikeRate, strikeRateScripCode;
						
						selectstrikeRate = this.strikeRateData[0]['StrikeRate'];
						strikeRateScripCode = this.strikeRateData[0]['ScripCode'];
						this.strikeRateData.forEach(element => {
							if (element['StrikeRate'] == this.selectedStrikePrice) {
								selectstrikeRate = element['StrikeRate'];
								strikeRateScripCode = element['ScripCode'];
							}
						})
						
						this.selectedStrikePrice = selectstrikeRate;
						this.marketLot = this.strikeRateData[0]['MarketLot'];
						this.scripCode = strikeRateScripCode;
						this.lotQTY = this.strikeRateData[0]['MarketLot'];
						const params = {
							Exch: obj['Exch'],
							ExchType: exchType,
							ScripCode: strikeRateScripCode,
						}
						this.getPriceMarketFeed(params);
						let code = null;
					} else {
						this.strikeRateData = [];
					}
					// this.strikeRateData.forEach(element => {
					// 	if (element['ScripCode'] === +this.globalScripCode) this.strikeprice = element['StrikeRate'];
					// 	if (element['StrikeRate'] === this.strikeprice) {
					// 		code = element['ScripCode'];
					// 		this.globalScripCode = element['ScripCode'];
					// 		this.getMarketFeedParameter(this.ExchType);
					// 	}
					// });
					// if (obj['CallPut'] === 'CALL') {
					// 	this.optionType = 'CE';
					// 	let urlBreak = null;
					// 	let option = null;
					// 	urlBreak = location.pathname.split('/');

					// 	option = urlBreak[3].split('-');
					// 	option[4] =  'CE';
					// 	option = option.join('-');
					// 	urlBreak[3] = option;
					// 	urlBreak[4] = code;
					// 	urlBreak = urlBreak.join('/');
						
						
					// 	this.location.go(urlBreak);
					// } else if (obj['CallPut'] === 'PUT') {
					// 	this.optionType = 'PE';
					// 	let urlBreak = null;
					// 	let option = null;
					// 	urlBreak = location.pathname.split('/');

					// 	option = urlBreak[3].split('-');
					// 	option[4] =  'PE';
					// 	option = option.join('-');
					// 	urlBreak[3] = option;
					// 	urlBreak[4] = code;
					// 	urlBreak = urlBreak.join('/');
						
						
					// 	this.location.go(urlBreak);
					// }
					// this.getClientListData(this.ExchType,code);
					
				})
		)
	}

	public callPutChange() {
		this.strikeRateData = [];
		//this.selectedStrikePrice = null;
		this.callStrikeAPI(this.selectdate);
	}

	public strikeRateChange(event: any) {
		this.selectedStrikePrice = event;
		this.strikeRateData.forEach(element => {
			if (element['StrikeRate'] === event) {
				this.scripCode = element['ScripCode'];
				this.marketLot = element['MarketLot'];
				this.lotQTY = element['MarketLot'];
			}
		});
		this.callStrikeAPI(this.selectdate, true);
	}

	public getPriceMarketFeed(data: any) {
		this.subscription = new Subscription();
		const obj = {
			Count: 1,
			MarketFeedData: [
				{
					Exch: data['Exch'],
					ExchType: data['ExchType'],
					ScripCode: data['ScripCode'],
					ClientLoginType: 0,
					RequestType: 0,
					LastRequestTime: "/Date(0)/",
				}
			],
			RefreshRate: 'H',
			date: "/Date(0)/",
			ClientLoginType: 0,
			Date: "/Date(0)/"
		}

		this.subscription.add(
			this.serviceFile
			.getMFeedList(obj)
			.subscribe( (response: any) => {
				// console.log(response);
				if (response['body']['Status'] === 0 && response['head']['status'] === '0') {
					this.price = response['body']['Data'][0]['LastRate'];
				}
			})
		)
	}

	public addSpanMargin() {

		if (this.lotQTY !== null) {
			if (this.marketLot % this.lotQTY !== 0) {
				this.toast.displayToast('Please enter valid Lot Qty.');
				return;
			}
		}
		if (!this.marketLot) {
			return;
		}
		this.storage.get('userID').then( ID => {
			const obj: any = {
				ClientCode: ID,
				// Expiry: "/Date(1600938000000+0530)/",
				StrikeRate: this.selectedStrikePrice ? this.selectedStrikePrice : 0.0,
				OptionType: this.callBlockValue,
				BuySell: this.buyBlockValue === 'buy' ? 'B' : 'S',
				Instrument: this.futuresBlockValue === 'F' ? 'FUTSTK' : 'OPTSTK',
				Price: this.price,
				Qty: this.marketLot,
				// ScripCode: "58824"
			}

			this.expiryDates.forEach((element: any) => {
				if (element['Expiry'] === this.selectdate) {
					obj['Exch'] = element['Exch'],
					obj['ExchType'] = element['ExchType'],
					obj['Symbol'] = element['Symbol'],
					obj['Expiry'] = element['OExpiry'],
					obj['ScripCode'] = element['ScripCode'] ? element['ScripCode'] : this.scripCode
				}
			});

			this.subscription.add(
				this.serviceFile
				.addMargin(obj)
				.subscribe( (response: any) => {
					if (response['body']['Status'] === 0 && response['head']['status'] === '0') {
						this.toast.displayToast(response['body']['Message']);
						this.calculation(true);
					} else {
						this.toast.displayToast(response['body']['Message']);
					}
				})
			)
		})
	}

	public calculation(callMargin?: any) {
		this.subscription = new Subscription();
		this.storage.get('userID').then( ID => {
			const obj = {
				ClientCode: ID
			}

			this.subscription.add(
				this.serviceFile
				.calculate(obj)
				.subscribe( (response: any) => {
					this.spanMargin = 0;
					this.exposureMargin = 0;
					this.totalMargin = 0;
					if (response['body']['status'] === 0 && response['head']['status'] === '0') {

						this.spanMargin = this.commonService.numberFormatWithCommaUnit(response['body']['SpanMargin']);
						this.exposureMargin = this.commonService.numberFormatWithCommaUnit(response['body']['ExposureMargin']);
						this.totalMargin = this.commonService.numberFormatWithCommaUnit(response['body']['SpanMargin'] + response['body']['ExposureMargin']);

					}
					if (callMargin) this.marginDetails();
				})
			)
		})
	}

	public marginDetails() {
		this.subscription = new Subscription();
		this.storage.get('userID').then( ID => {
			const obj = {
				ClientCode: ID
			}

			this.subscription.add(
				this.serviceFile
				.marginData(obj)
				.subscribe( (response: any) => {
					// console.log(response);
					if (response['body']['status'] === 0 && response['head']['status'] === '0') {
						this.calculatorData = response['body']['_lstmargin'];
					}
				})
			)
		})
	}

	public delete(index: any, obj: any) {
		this.subscription = new Subscription();

		this.storage.get('userID').then( ID => {
			const params = {
				ClientCode: ID,
				OrderNo: obj['OrderNo']
			}

			this.subscription.add(
				this.serviceFile
				.deleteMargin(params)
				.subscribe( (response: any) => {
					if (response['body']['Status'] === 0 && response['head']['status'] === '0') {
						this.calculatorData.splice(index, 1);
						this.calculatorData = [...this.calculatorData];
						this.toast.displayToast(response['body']['Message']);
						this.calculation(false);
					} else {
						this.toast.displayToast(response['body']['Message']);
					}
				})
			)
		})
	}

	public resetMarginData() {
		if (this.calculatorData.length) {
			this.subscription = new Subscription();
	
			this.storage.get('userID').then( ID => {
				const params = {
					ClientCode: ID
				}
	
				this.subscription.add(
					this.serviceFile
					.reset(params)
					.subscribe( (response: any) => {
						if (response['body']['Status'] === 0 && response['head']['status'] === '0') {
							this.calculatorData = [];
							this.clearValues(false);
							this.toast.displayToast(response['body']['Message']);
						} else {
							this.toast.displayToast(response['body']['Message']);
						}
					})
				)
			})
		}
	}

	getDate(val: any) {
		let sliceddate = val.slice(6, 19);
		let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
		let utcSeconds = sliceddate / 1000;
		let date1 = new Date(0); // The 0 there is the key, which sets the date to the epoch
		date1.setUTCSeconds(utcSeconds);

		let date = date1.getDate();
		let month = months[date1.getMonth()];
		let year = date1.getFullYear();
		let formattedDate;
		return formattedDate = ((date.toString())) + ' ' + month + ' ' + year;
	}

	public typeChange() {
		this.clearValues(true);
	}

	public productChange() {
		this.clearValues(true);
	}

	public clearValues(change?: any) {
		this.search_item = null;
		this.dataVisible = false;
		this.scripList = [];
		this.expiryDates = [];
		this.selectdate = null;
		this.strikeRateData = [];
		this.selectedStrikePrice = null;
		this.marketLot = null;
		this.lotQTY = null;
		this.price = null;
		if (!change) this.spanMargin = 0;
		if (!change) this.exposureMargin = 0;
		if (!change) this.totalMargin = 0;
	}
}
