import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ClientListService } from './clientlist.service';
import { OrderPipe } from 'ngx-order-pipe';
import { CommonService } from '../../helpers/common.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-client-list',
	providers: [ClientListService],
	templateUrl: './client-list.page.html',
	styleUrls: ['./client-list.page.scss'],
})
export class ClientListPage implements OnInit {

	private subscription: any;

	public globalScripCode: any = null;
	public dataLoad: boolean = false;
	public selectdate: any = null;
	public optionType: any = null;
	strikeprice: any;
	clientList: any = [];
	clientListItems: any;
	searchTerm: string = '';
	order: string = 'cuid';
	reverse: boolean = false;
	sortedCollection!: any[];
	sub: any
	Exch: any; ExchType: any; ScripCode: any; ShortName: any; lastRate: any; pClose: any;

	public clientBuyData: any = [];
	public clientSellData: any = [];
	public scripToggle = true;
	public scripOptionToggle = true;

	public expiryDates: any = [];
	public formattedDate: any;
	public strikeRateData: any = [];
	public ascending = true;
	public urlParams = null;
	exchValue:any;
	exchTypeValue:any;
	scripCodeValue:any;

	constructor(private route: ActivatedRoute,
		private storage: StorageServiceAAA,
		private router: Router,
		private clientService: ClientListService,
		private orderPipe: OrderPipe,
		private commonService: CommonService,
		private location: Location) { }
	ngOnInit() {

	}

	ionViewWillEnter() {
		this.clientList = [];
		
		this.expiryDates = [];
		this.strikeRateData = [];

		this.sortedCollection = this.orderPipe.transform(this.clientList, 'cuid');

		this.sub = this.route.params.subscribe(params => {
			const receivedParams = params['id1'].split('-');
			this.urlParams = params['id1'].split('-');

			this.globalScripCode = params['id2'];

			this.Exch = params['id'];
			this.ExchType = receivedParams[0];
			this.ScripCode = params['id2'];
			this.ShortName = params['id3'];

			this.optionType = receivedParams[4];
			this.ExchType = receivedParams[0];

			this.getMarketFeedParameter(this.ExchType);
			this.getClientListData(this.ExchType, this.globalScripCode);

			if (this.ExchType !== 'C' && receivedParams[4] === 'CE') {
				this.scripOptionToggle = false;
				this.getOptionsExpiry(this.ExchType, receivedParams);
			} else if (this.ExchType !== 'C' && receivedParams[4] === 'PE') {
				this.scripOptionToggle = true;
				this.getOptionsExpiry(this.ExchType, receivedParams);
			} else if (this.ExchType !== 'C' && receivedParams[4] === undefined && receivedParams.length > 1) {
				this.getExpiryDates(this.ExchType, receivedParams);
			} else if (this.ExchType !== 'C' && receivedParams[4] === undefined) {
				this.getExpiryDates(this.ExchType, receivedParams);
			}
		});
		// const currentOptionType = this.ExchType.split('-');

	}

	//get the market feed parameter by passing in url
	getMarketFeedParameter(exchType: any) {
		const passObj: any = {};
		passObj['Count'] = 1;
		passObj['MarketFeedData'] = [{ "Exch": this.Exch, "ExchType": exchType, "ScripCode": this.globalScripCode, "ClientLoginType": 0, "LastRequestTime": "/Date(0)/", "RequestType": 0 }];
		passObj['ClientLoginType'] = 0;
		passObj['RefreshRate'] = "H";
		passObj['date'] = "/Date(0)/";
		passObj['Date'] = "/Date(0)/";
		this.clientService.getMFeedList(passObj).subscribe((response: any) => {
			if (response['body']['Status'] === 0 && response['head']['status'] === '0') {
				// assign the data to array and display
				this.lastRate = response['body']['Data'][0].LastRate;
				this.pClose = response['body']['Data'][0].PClose;
			}
		})
	}
	//sorting function for column
	setOrder(value: string) {
		this.reverse = !this.reverse;
		this.order = value;
        if (this.reverse) {
            this.ascending = false;
        } else {
            this.ascending = true;
        }
	}

	public checkValue(event: any) {
		this.scripToggle = !this.scripToggle;
		if (this.scripToggle) {
			this.clientList = this.clientBuyData;
		} else {
			this.clientList = this.clientSellData;
		}

	}

	public expiryDateChange(event: any) {
		const selected = event;
		const url = location.pathname.split('/');
		this.expiryDates.forEach((element: any) => {
			if (element['Expiry'] === selected) {
				if (!this.optionType) {
					this.onExpiryChange(element['ScripCode'] ? element['ScripCode'] : url[4]);
				} else if (this.optionType === 'PE') {
					const params = {
						Exch: this.Exch,
						CallPut: "PUT",
						Symbol: this.ShortName,
						Expiry: this.selectdate
					}
					this.getStrikeValues(params);
				} else if (this.optionType === 'CE') {
					const params = {
						Exch: this.Exch,
						CallPut: "CALL",
						Symbol: this.ShortName,
						Expiry: this.selectdate
					}
					this.getStrikeValues(params);
				}
			}
		});

	}


	//go back page
	goBackMarkets() {
		window.history.back();
	}
	//get the client data and display in table 
	getClientListData(exchType: any, code: any) {
		this.dataLoad = false;
		this.storage.get('userID').then((token) => {
			let dataParams = {
				Exch: this.Exch,
				ExchType: exchType,
				ScripCode: code,
				RequesterCode: token
			}
			this.clientService.getMarketTableData(dataParams).subscribe((response: any) => {
				this.clientList = [];
				if (response['body']['Status'] === 0 && response['head']['status'] === '0') {
					this.dataLoad = true;
					const responseData = response['body']['Data'];
					this.exchValue = response['body']['Exch'];
					this.exchTypeValue = response['body']['ExchType'];
					this.scripCodeValue = response['body']['ScripCode'];

					if (!this.optionType) {
						this.clientBuyData = [];
						responseData.forEach((element: any) => {
							if (element['Qty'] > 0) {
								//const approxValue = this.formatNumberCase(element['Qty'] * this.lastRate);
								this.clientBuyData.push({
									cuid: element['ClientCode'],
									quantity: element['Qty'],
									value: element['Qty'] * this.lastRate
								})
							} else {
								//const approxValue = this.formatNumberCase(-(element['Qty']) * this.lastRate);
								this.clientSellData.push({
									cuid: element['ClientCode'],
									quantity: element['Qty'],
									value: element['Qty'] * this.lastRate
								})
							}
							this.clientList = this.clientBuyData;
							// this.clientList.push({
							//     cuid: element['ClientCode'],
							//     quantity: element['Qty'],
							//     value: (element['Qty'] * this.lastRate / 100000).toFixed(2) + 'L'
							// })
						});
					} else {
						responseData.forEach((element: any) => {
							//const approxValue = this.formatNumberCase(element['Qty'] * this.lastRate);
							this.clientList.push({
								cuid: element['ClientCode'],
								quantity: element['Qty'],
								value: element['Qty'] * this.lastRate
							})
						});
					}
				} else {
					this.dataLoad = true;
					this.clientList = [];
				}
			})
		})
	}

	/**
	 * Get ALL the expiry dates for Future Scrip (derivatives)
	 */
	public getExpiryDates(exchType: any, obj?: any) {
		this.subscription = new Subscription();
		this.expiryDates = [];

		const params: any = {};
		params['Exch'] = this.Exch;
		params['ExchType'] = exchType;
		params['Symbol'] = this.ShortName;
		this.subscription.add(this.clientService
			.getExipry(params)
			.subscribe((response: any) => {
				const responseData = response['Data'];
				const compareDate = this.removeFirstZero(obj[1]) + ' ' + obj[2] + ' ' + obj[3];
				responseData.forEach((element: any) => {
					const formattedDate = this.getDate(element['Expiry']);
					this.expiryDates.push({
						Expiry: formattedDate,
						MarketLot: element['MarketLot'],
						ScripCode: element['ScripCode'],
						TickSize: element['TickSize']
					})
				});
				this.selectdate = compareDate;

				// this.expiryDates = response['Data'];
			}))
	}

	/**
	 * @param code accepts the respective Scrip Code
	 */
	public onExpiryChange(code: any) {

		this.storage.get('userID').then((token) => {
			let dataParams = {
				Exch: this.Exch,
				ExchType: this.ExchType,
				ScripCode: code,
				RequesterCode: token
			}
			this.subscription = new Subscription();

			this.subscription.add(
				this.clientService
					.getMarketTableData(dataParams)
					.subscribe((response: any) => {
						if (response['body']['Status'] === 0 && response['head']['status'] === '0') {
							this.clientList = [];
							this.clientBuyData = [];
							this.clientSellData = [];
							const responseData = response['body']['Data'];
							responseData.forEach((element: any) => {
								if (element['Qty'] > 0) {
									//const approxValue = this.formatNumberCase(element['Qty'] * this.lastRate);
									this.clientBuyData.push({
										cuid: element['ClientCode'],
										quantity: element['Qty'],
										value: element['Qty'] * this.lastRate
									})
								} else {
									const approxValue = this.formatNumberCase(-(element['Qty']) * this.lastRate);
									this.clientSellData.push({
										cuid: element['ClientCode'],
										quantity: element['Qty'],
										value: element['Qty'] * this.lastRate
									})
								}
								this.clientList = this.clientBuyData;
								// this.clientList.push({
								//     cuid: element['ClientCode'],
								//     quantity: element['Qty'],
								//     value: (element['Qty'] * this.lastRate / 100000).toFixed(2) + 'L'
								// })
							});
						} else {
							this.clientList = [];
							this.clientBuyData = [];
							this.clientSellData = [];
						}
					})
			)
		})
	}

	public getOptionsExpiry(exchType: any, obj: any) {
		this.subscription = new Subscription();
		this.expiryDates = [];

		const params: any = {};
		params['Exch'] = this.Exch;
		params['ExchType'] = exchType;
		params['Symbol'] = this.ShortName;
		this.subscription.add(this.clientService
			.getOptionsExpiryDate(params)
			.subscribe((response: any) => {
				const responseData = response['Data'];
				const compareDate = this.removeFirstZero(obj[1]) + ' ' + obj[2] + ' ' + obj[3];
				responseData.forEach((element: any) => {
					const formattedDate = this.getDate(element['Expiry']);
					this.expiryDates.push({
						Expiry: formattedDate
					})
				});

				this.selectdate = compareDate.toString();
				if (obj[4] === 'CE') {
					this.optionType = 'CE';
					const params = {
						Exch: this.Exch,
						CallPut: "CALL",
						Symbol: this.ShortName,
						Expiry: this.selectdate
					}
					this.getStrikeValues(params);
				} else if (obj[4] === 'PE') {
					this.optionType = 'PE';
					const params = {
						Exch: this.Exch,
						CallPut: "PUT",
						Symbol: this.ShortName,
						Expiry: this.selectdate
					}
					this.getStrikeValues(params);
				}
				// this.expiryDates = response['Data'];
			}))
	}

	public optionCheckValue(event: any) {
		if (event) {
			const params = {
				Exch: this.Exch,
				CallPut: "PUT",
				Symbol: this.ShortName,
				Expiry: this.selectdate
			}
			this.getStrikeValues(params);
		} else {
			const params = {
				Exch: this.Exch,
				CallPut: "CALL",
				Symbol: this.ShortName,
				Expiry: this.selectdate
			}
			this.getStrikeValues(params);
		}
	}

	public getStrikeValues(obj: any) {
		this.subscription = new Subscription();

		this.subscription.add(
			this.clientService
				.getOptionsScripDetails(obj)
				.subscribe((response: any) => {
					this.strikeRateData = response['Data'];
					//let code = null 
					 let code = this.strikeRateData[0].StrikeRate;
					 this.globalScripCode = this.strikeRateData[0]['ScripCode'];
					this.strikeRateData.forEach((element: any) => {
						if (element['ScripCode'] === +this.globalScripCode) this.strikeprice = element['StrikeRate'];
						if (element['StrikeRate'] === this.strikeprice) {
							code = element['ScripCode'];
							this.globalScripCode = element['ScripCode'];
							
							
						}
					});
					this.getMarketFeedParameter(this.ExchType);
					

					if (obj['CallPut'] === 'CALL') {
						this.optionType = 'CE';
						let urlBreak = null;
						let option = null;
						urlBreak = location.pathname.split('/');

						option = urlBreak[3].split('-');
						option[4] = 'CE';
						option = option.join('-');
						urlBreak[3] = option;
						urlBreak[4] = code;
						urlBreak = urlBreak.join('/');


						this.location.replaceState(urlBreak);
					} else if (obj['CallPut'] === 'PUT') {
						this.optionType = 'PE';
						let urlBreak = null;
						let option = null;
						urlBreak = location.pathname.split('/');

						option = urlBreak[3].split('-');
						option[4] = 'PE';
						option = option.join('-');
						urlBreak[3] = option;
						urlBreak[4] = code;
						urlBreak = urlBreak.join('/');


						this.location.replaceState(urlBreak);
					}
					this.getClientListData(this.ExchType, code);

				})
		)
	}

	public strikeRateChange(event: any) {
		let code = null;
		let currentRate = null;
		this.strikeRateData.forEach((element: any) => {
			if (element['StrikeRate'] === event) {
				code = element['ScripCode'];
				this.globalScripCode = code;
				currentRate = this.ExchType === 'U' ? element['StrikeRate'].toFixed(4) : element['StrikeRate'].toFixed(2);
			}
		});
		let urlBreak: any = null;
		let strike = null;
		urlBreak = location.pathname.split('/');
		urlBreak[4] = code;

		strike = urlBreak[3].split('-');

		strike[5] = currentRate;
		strike = strike.join('-');
		urlBreak[3] = strike;

		urlBreak = urlBreak.join('/');


		this.location.replaceState(urlBreak);
		this.getClientListData(this.ExchType, code);
	}

	getDate(val: any) {
		let sliceddate = val.slice(6, 19);
		let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
		// let date = new Date(sliceddate * 1000);

		// let date1 = date.getDate();


		let utcSeconds = sliceddate / 1000;
		let date1 = new Date(0); // The 0 there is the key, which sets the date to the epoch
		date1.setUTCSeconds(utcSeconds);

		let date = date1.getDate();
		let month = months[date1.getMonth()];
		let year = date1.getFullYear();

		return this.formattedDate = ((date.toString())) + ' ' + month + ' ' + year;
	}

	formatNumberCase(value: any) {
		var val;
		val = Math.abs(value)
		if (val >= 10000000) {
			val = this.addZeroDecimal(val / 10000000) + 'Cr';

		} else if (val >= 100000) {
			val = this.addZeroDecimal(val / 100000) + 'L';
		}
		else if (val >= 1000) {
			val = this.addZeroDecimal(val / 1000) + 'K';
		}
		else if (val < 100) {
			val = this.addZeroDecimal(val);
		}
		return val;
	}

	addZeroDecimal(value: any) {
		if (value == 0 || value == Math.round(value)) {
			return value
		}
		else {
			if (this.ExchType == 'U') {
				return value.toFixed(4);
			}
			else {
				return value.toFixed(2);
			}
		}
	}

	removeFirstZero(number: any) {
		if (number.substr(0, 1) == "0") {
			number = number.substr(1);
		}
		return number
	}

	goToClientDetails(){
		this.router.navigate(['/company-details', this.exchValue, this.exchTypeValue, this.scripCodeValue, this.ShortName + this.exchTypeValue, this.ShortName]);
	}
}