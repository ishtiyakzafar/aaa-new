import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MutualFundService } from '../../components/mutual-fund/mutual-fund.service';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import { Platform, ModalController } from '@ionic/angular';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { investObj } from '../../../environments/environment';

declare var cordova: any;

@Component({
	selector: 'app-mutual-fund-holdings',
	providers: [MutualFundService, CustomEncryption, ShareReportService],
	templateUrl: './mutual-fund-holdings.component.html',
	styleUrls: ['./mutual-fund-holdings.component.scss'],
})
export class MutualFundHoldingsComponent implements OnInit {
	public dataLoad: boolean = false;
	@ViewChild('detail') detail!: ElementRef;
	public detailHeight!: number;
	public holdingTabValue: string = 'portfolio';
	public allBlockTabValue: string = 'all';
	ascending: boolean = true;
	reverse: boolean = false;
	public order: string = 'scheme';
	public holdingOptions: any[] = [
		{ name: 'Portfolio', value: 'portfolio' },
		{ name: 'DP Portfolio', value: 'dpPortfolio' },
	]
	public segmentOption: any[] = [
		{ name: 'All', value: 'all' },
		{ name: 'Equity', value: 'equity' },
		{ name: 'Debt', value: 'debt' },
		{ name: 'Hybrid', value: 'hybrid' }
	]
	resetPortfolioDetails: any[] = [];
	public details: any[] = [
		// {srNo: 1, scheme: 'Nippon India Liquid(G) - Direct Plan', folioNumber: '123456789098', type: 'Demat', units: '2345.678',
		//  investment: '12,32,345.45',  currentValue: '12,32,345.45', profitLoss: '2,32,345.45', profLossPer: '(12.23%)' 
		// }, 
		// {srNo: 2, scheme: 'Nippon India Liquid(G) - Direct Plan', folioNumber: '123456789098', type: 'Demat', units: '2345.678',
		//  investment: '12,32,345.45',  currentValue: '12,32,345.45', profitLoss: '2,32,345.45', profLossPer: '(12.23%)' 
		// }, 
		// {srNo: 3, scheme: 'Nippon India Liquid(G) - Direct Plan', folioNumber: '123456789098', type: 'Demat', units: '2345.678',
		//  investment: '12,32,345.45',  currentValue: '12,32,345.45', profitLoss: '2,32,345.45', profLossPer: '(12.23%)' 
		// },
		// {srNo: 4, scheme: 'Nippon India Liquid(G) - Direct Plan', folioNumber: '123456789098', type: 'Demat', units: '2345.678',
		//  investment: '12,32,345.45',  currentValue: '12,32,345.45', profitLoss: '2,32,345.45', profLossPer: '(12.23%)' 
		// }, 
		// {srNo: 5, scheme: 'Nippon India Liquid(G) - Direct Plan', folioNumber: '123456789098', type: 'Demat', units: '2345.678',
		//  investment: '12,32,345.45',  currentValue: '12,32,345.45', profitLoss: '2,32,345.45', profLossPer: '(12.23%)' 
		// }, 
		// {srNo: 6, scheme: 'Nippon India Liquid(G) - Direct Plan', folioNumber: '123456789098', type: 'Demat', units: '2345.678',
		//  investment: '12,32,345.45',  currentValue: '12,32,345.45', profitLoss: '2,32,345.45', profLossPer: '(12.23%)' 
		// }, 
	]

	//portfolio:any[] = [];
	public detailsDp: any[] = [
		{ scheme: 'Nippon India Liquid(G) - Direct Plan', units: '2345.678', currentNav: '12,32,345.45', currentValue: '12,32,345.45' },
		{ scheme: 'Nippon India Liquid(G) - Direct Plan', units: '2345.678', currentNav: '12,32,345.45', currentValue: '12,32,345.45' },
		{ scheme: 'Nippon India Liquid(G) - Direct Plan', units: '2345.678', currentNav: '12,32,345.45', currentValue: '12,32,345.45' },
		{ scheme: 'Nippon India Liquid(G) - Direct Plan', units: '2345.678', currentNav: '12,32,345.45', currentValue: '12,32,345.45' },
		{ scheme: 'Nippon India Liquid(G) - Direct Plan', units: '2345.678', currentNav: '12,32,345.45', currentValue: '12,32,345.45' },
	]
	portfolio: any[] = [];
	dpHoldingList: any[] = [];
	portfolioDetails: any[] = [];
	searchScheme: any;
	encrptedClientCode: any;
	totalInvestment = 0;
	totalCurrentValue = 0;
	totalgainLoss = 0;
	displayTotalValueObj: any;
	totalPerct = 0;
	screenWidth:any;
	public val: string = 'asc';
	constructor(private mutualFundSer: MutualFundService, private popoverController: PopoverController, private ciphetText: CustomEncryption, private shareReportSer: ShareReportService, private storage: StorageServiceAAA, private platform: Platform, public commonService: CommonService) { }

	ngOnInit() {
		this.screenWidth = window.innerWidth;
		this.tokenFn()
	}

	test(e: any) {
		e.stopPropagation();
		e.preventDefault();
		// console.log(45);
	}

	tokenFn() {
		this.dataLoad = false;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.encryClientCode(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.encryClientCode(token)
				})
			}
		})
	}

	encryClientCode(token: any) {
		let clientCode = JSON.parse(localStorage.getItem('select_client') || "{}")['ClientCode'];
		let objHeader: any = {
			"VID": investObj['addUser']['vid'],
			//"Value": this.ciphetText.aesEncrypt('tiwari82')
			"Value": this.ciphetText.aesEncrypt(clientCode)
		}
		this.mutualFundSer.getPortfolioMf(objHeader.Value).subscribe((res: any) => {
			if (res['head']['Status'] == 0 && res['Table3'].length > 0) {
				this.resetPortfolioDetails = res['Table3'].filter(function (el: any) {
					return el.AMC_CODE != "0"
				});

				if (this.resetPortfolioDetails.length == 0) {
					this.dataLoad = true;
					return;
				}

				this.displayTotalValueObj = res['Table3'].filter(function (el: any) {
					return el.Folio_No == "Grand Total :"
				});



				this.portfolio = this.resetPortfolioDetails;
				// console.log(this.portfolio);
				this.portfolio.forEach((element) => {
					if ((element.SCHEMECATEGORY).includes('Hybrid') == true) {
						element.filterLabel = 4;
						element.scheme_category = "Hybrid";
					}
					else if ((element.SCHEMECATEGORY).includes('Equity') == true) {
						if ((element.SCHEMECATEGORY).includes('Equity Linked Savings Scheme') == true) {
							element.filterLabel = 2;
							element.scheme_category = "ELSS";
						}
						else {
							element.filterLabel = 1;
							element.scheme_category = "Equity"
						}
					}
					else if ((element.SCHEMECATEGORY).includes('Debt') == true) {
						if ((element.SCHEMECATEGORY).includes('Liquid') == true) {
							element.filterLabel = 5;
							element.scheme_category = "Liquid";
						}
						else {
							element.filterLabel = 3;
							element.scheme_category = "Debt";
						}
					}
					else {
						element.filterLabel = 6;
						element.scheme_category = element.SCHEMECATEGORY;
					}
					element.TotalInvestment = element.TotalInvestment == null ? "0" : element.TotalInvestment;
					element.PresentValue = element.PresentValue == null ? '0' : element.PresentValue
					// console.log('display Total', this.displayTotalValueObj)
					if (this.displayTotalValueObj.length > 0) {
						this.totalInvestment = this.displayTotalValueObj[0].CurrentInvestment;
						this.totalCurrentValue = this.displayTotalValueObj[0].PresentValue;
						this.totalgainLoss = this.displayTotalValueObj[0].Notional_GainLoss;
						this.totalPerct = (this.totalgainLoss / this.totalInvestment) * 100
					}

				})
				this.portfolioList();
			}
			else {
				this.dataLoad = true;
				this.portfolioDetails = [];
				this.resetPortfolioDetails = [];
			}
		},
			err => {
				// console.log(err);
				if (err.status == 500) {
					this.dataLoad = true;
					this.portfolioDetails = [];
					this.resetPortfolioDetails = [];
				}
				// console.log(err.status);
				// check error status code is 500, if so, do some action
			})


	}

	// filter popup for portfolio
	async filterOption(ev: any) {
		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: FilterPopupComponent,
			cssClass: "custom-popover filter-popover",
			mode: "md",
			showBackdrop: false,
			event: ev,
			//translucent: true
		});

		await popover.present();
		// return await popover.present();
		popover.onDidDismiss().then((data: any) => {
			// console.log(data)
			if (data['data'] === undefined) {
				console.log('No Data')
			}
			else {
				this.dataLoad = false;
				this.portfolioDetails = this.resetPortfolioDetails;
				if (data['data']['flag'] == 1) {
					// console.log(data['data']['passData'])
					var result = this.portfolioDetails.filter((o) => data['data']['passData'].includes(o.filterText));
					// console.log(result);
					this.portfolioDetails = result;
					setTimeout(() => {
						this.dataLoad = true;
					}, 500);
				}
			}

		})
	}

	dropClick(sr: any, arr: any) {
		event?.preventDefault();
		event?.stopPropagation();
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

	segmentChange(event: any) {
		this.searchScheme = '';
		this.dataLoad = false;
		if (event == 'dpPortfolio') {
			this.dpHoldingList = [];
			localStorage.removeItem('setCheckBox');
			let clientCode = JSON.parse(localStorage.getItem('select_client') || "{}")['ClientCode']
			this.mutualFundSer.getDpHolding(clientCode).subscribe((res: any) => {
				setTimeout(() => {
					this.dataLoad = true;
				}, 1000);
				if (res['head']['Status'] == 0) {
					//this.dpHoldingList = res['body']['DPHolding'];
					res['body']['DPHolding'].forEach((element: any, index: any) => {
						this.dpHoldingList.push({
							schemename: element.schemename,
							UNITS: element.UNITS,
							currentnav: parseFloat(element.currentnav),
							currentvalue: parseFloat(element.currentvalue)
						})

					})
				}
				else {
					this.dpHoldingList = [];
				}
			})

		}
		else {
			this.tokenFn();
			this.resetPortfolioDetails = [];
			this.portfolioDetails = [];
			this.totalInvestment = 0;
			this.totalCurrentValue = 0;
			this.totalgainLoss = 0;
			this.totalPerct = 0;
		}



		// setTimeout(() => {
		//     this.dataLoad = true;
		// }, 1000);
	}

	portfolioList() {
		var consPortfolio = this.groupBy1(this.portfolio, function (item: any) {
			return [item.SchemeName];
		});
		this.portfolioDetails = [];
		for (var j in consPortfolio) {
			var combineObj = {
				"srNo": parseInt(Object.keys(consPortfolio)[j]),
				"datas": consPortfolio[j],
				"assetCatagoty": consPortfolio[j][0].scheme_category,
				"scheme": consPortfolio[j][0].SchemeName,
				"totalInvestment": consPortfolio[j].reduce((el: any, li: any) => el + parseFloat(li.CurrentInvestment), 0),
				"currValue": consPortfolio[j].reduce((el: any, li: any) => el + parseFloat(li.PresentValue), 0),
				"profLoss": consPortfolio[j].reduce((el: any, li: any) => el + parseFloat(li.Notional_GainLoss), 0),
				"filterText": consPortfolio[j][0].filterLabel,
				"assetType": consPortfolio[j][0].ASSET_TYPE
				//"TotalM2M": consPortfolio[j].reduce((el, li) => el + li.M2M, 0),
			};
			this.portfolioDetails.push(combineObj);
			// console.log(this.portfolioDetails);
			this.resetPortfolioDetails = this.portfolioDetails;
			this.dataLoad = true;
		}
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

	trnsctClickfun(event: any, dataObj: any) {
		event.stopPropagation();
		event.preventDefault();
		let clientCode = JSON.parse(localStorage.getItem('select_client') || "{}")['ClientCode']
		// IOS:  11 
		// Android:  12   
		// AAA website :  13
		let appSource: any = null;
		if (this.platform.is('android')) {
			appSource = this.ciphetText.aesEncrypt(12);
		} else if (this.platform.is('mobileweb') || this.platform.is('desktop') || this.screenWidth > 1360) {
			appSource = this.ciphetText.aesEncrypt(13);
		} else if (this.platform.is('ios')) {
			appSource = this.ciphetText.aesEncrypt(11);
		}
		const flagENC = this.ciphetText.aesEncrypt('Trade');
		const folioNo = this.ciphetText.aesEncrypt(dataObj.Folio_No);
		const symbol = this.ciphetText.aesEncrypt(dataObj.SchemeName)
		const Isin = this.ciphetText.aesEncrypt(dataObj.ISIN)
		this.storage.get('userType').then((role) => {
			 if (role === 'RM' || role === 'FAN') {
				const roleENC = this.ciphetText.aesEncrypt(role);
				this.storage.get('bToken').then((sCookie) => {
					const swarajCookie = sCookie.split('=');
					this.storage.get('userID').then((userId) => {
						const codeENC = this.ciphetText.aesEncrypt(clientCode);
						const obj = {
							Token: swarajCookie[1],
							Flag: flagENC,
							Appsource: appSource,
							ClientCode: codeENC,
							Role: roleENC,
							Symbol: symbol,
							FolioNo: folioNo,
							ISIN: Isin
						}
						const url = investObj['mutualFund']['url'] + '?Token=' + swarajCookie[1] + '&Flag=' + flagENC + '&Appsource=' + appSource + '&ClientCode=' + codeENC + '&Role=' + roleENC + '&Symbol=' + symbol + '&FolioNo=' + folioNo + '&ISIN=' + Isin;
						if (this.commonService.isApp()) {
							var ref = cordova.InAppBrowser.open(url, '_blank');

							ref.addEventListener('loadstart', this.loadstartCallback);
							ref.addEventListener('loadstop', this.loadstopCallback);
							ref.addEventListener('loaderror', this.loaderrorCallback);
							ref.addEventListener('exit', this.exitCallback);
						} else {
							this.OpenWindowWithPost(investObj['mutualFund']['url'], '_blank', obj);
						}
					})
				})
			 }
			 else if (role === 'SUB BROKER') {
				this.storage.get('subToken').then((sCookie) => {
					const brokerToken = sCookie.split('=');
					const roleENC = this.ciphetText.aesEncrypt('SubBroker');

					this.storage.get('userID').then((clientCode) => {
						const codeENC = this.ciphetText.aesEncrypt(clientCode);

						const obj = {
							Token: brokerToken[1],
							Flag: flagENC,
							Appsource: appSource,
							ClientCode: codeENC,
							Role: roleENC,
							Symbol: symbol,
							FolioNo: folioNo,
							ISIN: Isin
						}

						const url = investObj['mutualFund']['url'] + '?Token=' + brokerToken[1] + '&Flag=' + flagENC + '&Appsource=' + appSource + '&ClientCode=' + codeENC + '&Role=' + roleENC + '&Symbol=' + symbol + '&FolioNo=' + folioNo + '&ISIN=' + Isin;
						if (this.commonService.isApp()) {
							var ref = cordova.InAppBrowser.open(url, '_blank');

							ref.addEventListener('loadstart', this.loadstartCallback);
							ref.addEventListener('loadstop', this.loadstopCallback);
							ref.addEventListener('loaderror', this.loaderrorCallback);
							ref.addEventListener('exit', this.exitCallback);
						} else {
							this.OpenWindowWithPost(investObj['mutualFund']['url'], '_blank', obj);
						}
						// window.open(url);
					})
				})
			}

		})
	}

	public loadstartCallback(event: any) {
		console.log('Loading started: ' + event.url)
	}

	public loadstopCallback(event: any) {
		console.log('Loading finished: ' + event);
	}

	public loaderrorCallback(error: any) {
		console.log('Loading error: ' + error.message)
	}

	public exitCallback() {
		console.log('Browser is closed...')
	}



	public OpenWindowWithPost(url: any, name: any, params: any) {
		var form = document.createElement("form") as HTMLFormElement;
		form.setAttribute("method", "post");
		form.setAttribute("action", url);
		form.setAttribute("target", name);

		for (var i in params) {
			if (params.hasOwnProperty(i)) {
				var input = document.createElement('input');
				input.type = 'hidden';
				input.name = i;
				input.value = params[i];
				form.appendChild(input);
			}
		}

		document.body.appendChild(form);

		//note I am using a post.htm page since I did not want to make double request to the page 
		//it might have some Page_Load call which might screw things up.
		form.submit();

		// document.body.removeChild(form);
		// window.open("post.htm", name);

	}

	// disableParentEvent(e) {

	// 	return false;
	//   }

	ionViewWillLeave() {
		localStorage.removeItem('setCheckBox');
	}
	ngOnDestroy() {
		localStorage.removeItem('setCheckBox');
	}

}