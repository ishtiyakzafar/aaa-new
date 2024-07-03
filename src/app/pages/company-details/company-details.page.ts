import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { CompanyDetailsService } from './company-details.service';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from '../../helpers/common.service';
import { Subscription } from 'rxjs';
import { NumberformatPipe } from '../../helpers/numberformat.pipe';
import { DecimalPipe, NgStyle } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { LoaderService } from '../../helpers/loader.service';
import { Location } from '@angular/common';
import { FormatUnitNumberPipe } from '../../helpers/formatnumberunit.pipe';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ToasterService } from '../../helpers/toaster.service';
import { ChartLink } from '../../../environments/environment';
import { AddToWatchlistComponent } from '../../components/add-to-watchlist/add-to-watchlist.component';
import { SuperstarsComponent } from '../../components/superstars/superstars.component';
import { CommodityContractInfoComponent } from '../../components/commodity-contract-info/commodity-contract-info.component';
import { ClientListService } from '../client-list/clientlist.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

declare var cordova: any;

@Component({
	selector: 'app-company-details',
	providers: [CompanyDetailsService, CommonService, ClientListService, LoaderService, NumberformatPipe, DecimalPipe, ToasterService, FormatUnitNumberPipe],
	templateUrl: './company-details.page.html',
	styleUrls: ['./company-details.page.scss'],
})
export class CompanyDetailsPage {
	@ViewChild('iframe') iframe!: ElementRef;
	public superStarStockData = [];
	public isCommodityValueVisible: boolean = false;
	public dataLoad: boolean = false;
	hideChart: boolean = false;
	selectDate: any = '1';
	selectStrikePrice: any;
	cashBlockTabValue: any;
	timeBlockTabValue: any = 'oneDay';
	urlParameter: any;
	Exch: any;
	ExchType: any;
	ScripCode: any;
	cashLastRate: any;
	ScripFullName: any;
	cashPClose: any;
	cashFilterData: any[] = [];
	cashTabData: any[] = [];
	cashDetailsList: any[] = [];
	cashScripName!: string;
	marketDepthData: any = [];
	optionChain!: boolean;
	nscObj: any;
	bscObj: any;
	ScripShortName: any;
	passScripCode: any;
	exchValue: any;
	exchTypeValue: any;
	ScripCodeValue: any;
	scripNscCode: any;
	changeBtn: boolean = false;
	subscription: any;
	cashScripCodeFuture: any;
	expiryDates: any[] = [];
	selectdate: any;
	selectdateOption: any;
	expiryDateOptionList: any;
	expiryDatesOption: any[] = [];
	scripCodeUnavailable: boolean = true;
	isAscendic!: boolean;
	segmentButtons!: any[]
	removeLVolume: boolean = true
	ltpDetails: any[] = [];
	bidList: any[] = [];
	askList: any[] = [];
	totalBidQ: any;
	totalOffQ: any;
	splitCE: any;
	splitPE: any;
	callPutBtn!: boolean;
	callPutValue!: string;
	expiryDateOptionValue: any;
	strikericeOptionValue: any;
	strikePriceList: any[] = [];
	optionList: any[] = [];
	noDataOptionList!: string;
	callDataList: any[] = [];
	putDataList: any[] = [];
	selectedExpiryDate: any;
	selectScripCode: any;
	displayStrikePrice: any;
	urlExchParameter: any;
	cashtabDisplay!: boolean;
	eposeExpiryDate: any;
	futureScripCode: any;
	optionScripCode: any;
	commodityDetails: any;
	commodityName: any; contractList: any;
	nscBscCode: any;

	tableData: any[] = [{}, {}, {}, {}, {}];

	futureOptDetails: any[] = [];
	passToWatchList: any;
	graphBaseUrl: string = 'https://charts.iiflsecurities.com/'
	displayfuCoChart!: string;
	displayBasicChart: any;
	newsDetailsList: any;
	displayAdvanceChart: any;
	optionInGraph: any;
	compareExpiryDate: any;
	companyDetailCatcheTime: any;
	clearCashDetails: any;
	clearTableData: any;
	futureOptUpdatedData: any;
	updateFutureOptValue: any;
	futureUpdateStatus: any;
	futureChartRenderInit:any;
	showSetTimeGraph:boolean = true;
	constructor(public modalController: ModalController, private route: ActivatedRoute, private companyService: CompanyDetailsService,
		public navCtrl: NavController, private router: Router, private clientService: ClientListService, private commonservice: CommonService,
		private loader: LoaderService, private location: Location, private numberformat: NumberformatPipe, private _decimalPipe: DecimalPipe,
		private platform: Platform, protected sanitizer: DomSanitizer, public toast: ToasterService, private storage: StorageServiceAAA, private formatNumber: FormatUnitNumberPipe,
		private iab: InAppBrowser) { }

	ionViewWillEnter() {
		// console.log(this.grapgFuCoUrl);
		this.urlParameter = this.route.params.subscribe(params => {
			this.Exch = params['id'];
			this.ExchType = params['id1'];
			this.ScripCode = params['id2'];
			this.ScripFullName = params['id3'];
			this.ScripShortName = params['id4'];
		});
		// Exch type will remain same pass from market list page

		//this.commodityDetails(this.Exch,this.ExchType,this.ScripCode);
		this.urlExchParameter = this.ScripFullName.slice(-1);

		if (this.urlExchParameter == 'U') {
			this.segmentButtons = [{
				Name: 'Future',
				Value: 'future'
			},
			{
				Name: 'Options',
				Value: 'options'
			},
			];
			this.hideChart = true;
		}
		else if ((this.urlExchParameter == 'X') || this.Exch == 'M') {
			this.segmentButtons = [{
				Name: 'Future',
				Value: 'future'
			},];
			this.isCommodityValueVisible = true;
			this.hideChart = true;
		}

		else {
			this.hideChart = false;
			this.segmentButtons = [{
				Name: 'Cash',
				Value: 'cash'
			},
			{
				Name: 'Future',
				Value: 'future'
			},
			{
				Name: 'Options',
				Value: 'options'
			}
			];
		}

		// function for super star stock

		const optionType = this.ScripFullName;
		if (this.urlExchParameter !== 'C') {
			clearTimeout(this.clearCashDetails);
			if (this.Exch == 'B') {
				this.changeUrl('B');
				this.changeBtn = true;
			}
			this.cashScripName = this.ScripShortName;
			const optionType = this.ScripFullName;
			// console.log(optionType.includes('CE'));
			if (optionType.includes('-CE-')) {
				this.optionChain = true;
				this.cashBlockTabValue = 'options';
				this.splitCE = optionType.split('CE');

				// console.log(this.splitCE[1].slice(1))
				this.expiryDateOptionValue = this.splitCE[0].slice(0, -1);
				this.compareExpiryDate = this.expiryDateOptionValue;
				// console.log('CE case', this.compareExpiryDate);

				this.strikericeOptionValue = this.splitCE[1].slice(1).slice(0, -1);
				this.callPutBtn = false;
				this.callPutValue = 'CALL'
				this.expiryDateOption(this.Exch, this.ExchType, this.ScripShortName);
			}
			else if (optionType.includes('-PE-')) {
				this.optionChain = true;
				this.cashBlockTabValue = 'options';
				this.splitPE = optionType.split('PE');

				this.expiryDateOptionValue = this.splitPE[0].slice(0, -1);
				this.compareExpiryDate = this.expiryDateOptionValue;
				// console.log('PE case', this.compareExpiryDate);
				this.strikericeOptionValue = this.splitPE[1].slice(1).slice(0, -1);
				// console.log(this.splitPE[1].slice(1))

				this.callPutBtn = true;
				this.callPutValue = 'PUT'

				this.expiryDateOption(this.Exch, this.ExchType, this.ScripShortName);
			}
			else {
				this.optionChain = false;
				this.cashBlockTabValue = 'future'
				this.compareExpiryDate = this.ScripFullName.slice(0, -1);
				// console.log('Future case', this.compareExpiryDate);
				// console.log(this.cashScripName);

				if (this.Exch == 'B') {
					this.changeUrl('B');
					this.changeBtn = true;
				}
				this.futureChartRenderInit = "1"
				// this.CashScripCodeFuture(this.Exch, this.ScripShortName, this.ScripFullName.slice(0, -1));
				this.getExpiryDates(this.Exch, this.ExchType, this.ScripShortName, this.futureChartRenderInit);
			}
		}
		else {
			clearTimeout(this.updateFutureOptValue);
			this.getSuperStarStock();
			this.optionChain = false;
			this.cashBlockTabValue = 'cash'
			//this.compareExpiryDate = this.ScripFullName;

			if (this.Exch == 'B') {
				this.changeUrl('B', 'C', this.ScripCode);
				this.changeBtn = true;

			} else {
				this.changeUrl('N', 'C', this.ScripCode);
			}
			//cash filter api
			this.cashFilter(this.Exch, this.ExchType, this.ScripCode);
			//cash tab details api
			this.cashDetails(this.Exch, this.ExchType, this.ScripCode);
			this.marketDepthtableData(this.Exch, this.ExchType, this.ScripCode);
			this.chartsRender('basic', this.Exch, this.ScripShortName, this.ScripCode);
		}
		// change minimum width for segment native button
		const ionSegment = document.querySelectorAll('.circle');
		ionSegment.forEach((sel: any) => {
			sel.shadowRoot.querySelectorAll('.button-native').forEach((elem: any) => {
				elem.setAttribute('style', 'min-width: 34px');
			});
		});

		// provide font white color for segment native button
		const segmentStyle = document.querySelectorAll('.segmentStyle');
		segmentStyle.forEach((sel: any) => {
			sel.shadowRoot.querySelectorAll('.button-native').forEach((elem: any) => {
				elem.setAttribute('style', 'color: #fff');
			});
		});

	}
	
	chartsRender(chartType: any, ExchType: any, shortName: any, scripCode: any) {

		if (chartType == 'basic') {
			this.displayBasicChart = this.graphBaseUrl + 'TV_Sw/basic-tv.html?type=overview&period=1&exchange=' + (ExchType.toLowerCase()) + 'se&exchType=C&range=d&symbol=' + shortName + '&scripCode=' + scripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0';
			//this.iframe.nativeElement.attr()
			// console.log(this.graphBaseUrl + 'TV_Sw/index.html?type=overview&period=1&exchange=' + (ExchType.toLowerCase()) + 'se&exchType=C&range=d&symbol=' + shortName + '&scripCode=' + scripCode + '&appName=AAA_Web&appVer=1.0.22.0&osName=Android&loginId=2');
		}
		else if (chartType == 'advance') {
			this.displayAdvanceChart = this.graphBaseUrl + 'TV_Sw/index.html?type=overview&period=1&exchange=' + (ExchType.toLowerCase()) + 'se&exchType=C&range=d&symbol=' + shortName + '&scripCode=' + scripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0'
			const url = this.displayAdvanceChart;
			const browser = this.iab.create(url, '_self', 'clearsessioncache=no,clearcache=no,location=no');
			// window.open(url, '_blank');
		}
	}


	// first api to call to get cash title and Exch type
	cashFilter(exch: any, exchtype: any, code: any) {
		var cashFilterObj: any = {
			"Exch": exch,
			"ExchType": exchtype,
			"ScripCode": code
		}
		// console.log(cashFilterObj);
		this.companyService.getCashFiler(cashFilterObj).subscribe((res: any) => {
			if (res['Status'] === 0 && res['lstCashScrip'].length > 0) {
				this.cashFilterData = res['lstCashScrip'];
				this.cashScripName = res['lstCashScrip'][0].DisplayName;
				this.ScripCode = res['lstCashScrip'][0].ScripCode;
				this.nscBscCode = res['lstCashScrip'][0].NseBseCode;
				// console.log(this.ScripCode);
			} 
			else if(res['Status'] === 1 && res['lstCashScrip'].length == 0 && exch == 'N'){
				this.nscBscCode = code;
				this.cashScripName = this.ScripShortName;
			}
			else {
				this.cashScripName = this.ScripShortName;
				// console.log(this.cashScripName);
			}
		})
	}
	// Api to get the details of cash tab
	cashDetails(exch: any, exchtype: any, code: any) {
		var cashDetailsObj = {
			"Exch": exch,
			"ExchType": exchtype,
			"ScripCode": code
		}

		this.companyService.getCashTabDetails(cashDetailsObj).subscribe((res: any) => {
			// this.dataLoad = false;
			this.companyDetailCatcheTime = res['CacheTime'] + '000'
			if (res['Status'] === 0) {
				// this.dataLoad = true;
				this.cashDetailsList = res['Data'][0];
				this.cashLastRate = res['Data'][0].LastRate;
				this.cashPClose = res['Data'][0].PClose;
				this.ltpDetails = [{
					name: 'Open',
					value: this.transformDecimal(res['Data'][0].OpenRate)
				},
				{
					name: 'Day High (₹)',
					value: this.transformDecimal(res['Data'][0].High)
				},
				{
					name: 'Day Low (₹)',
					value: this.transformDecimal(res['Data'][0].Low)
				},
				{
					name: 'Volume',
					value: this.formatNumber.transform(res['Data'][0].TotalQty)
				},
				{
					name: 'Mkt. Cap (Cr)',
					value: this.transformDecimal(res['Data'][0].MarketCapital)
				},
				{
					name: '52 W High (₹)',
					value: this.transformDecimal(res['Data'][0].AHigh)
				},
				{
					name: 'P. Close',
					value: this.transformDecimal(res['Data'][0].PClose)
				},
				{
					name: '52 W Low (₹)',
					value: this.transformDecimal(res['Data'][0].ALow)
				}
				];
			}
		})
		clearTimeout(this.clearCashDetails);
		this.clearCashDetails = setTimeout(() => {
			// console.log(this.companyDetailCatcheTime)
			this.cashDetails(exch, exchtype, code);
		}, 2000);
	}

	transformDecimal(num: any) {
		var convertnum
		if (this.urlExchParameter == "U") {
			convertnum = this._decimalPipe.transform(num, '1.2-2') + '00';
		}
		else {
			convertnum = this._decimalPipe.transform(num, '1.2-2');
		}
		return convertnum
	}



	// Api to get the Market Depth 
	marketDepthtableData(exch: any, exchtype: any, code: any) {
		this.dataLoad = false;
		var marketDepthObj = {
			"Exch": exch,
			"ExchType": exchtype,
			"ScripCode": code
		}
		// console.log('mDepth',marketDepthObj);
		this.companyService.getMarketDepthList(marketDepthObj).subscribe((res: any) => {
			if (res['Status'] === 0 && marketDepthObj.ScripCode !== undefined) {
				setTimeout(() => {
					this.dataLoad = true;
				}, 500);
				this.marketDepthData = res['Data'].Details;
				this.totalBidQ = res['Data'].TBidQ;
				this.totalOffQ = res['Data'].TOffQ;

				this.bidList = this.marketDepthData.filter(function (e: any) {
					return e.BbBuySellFlag == 66;
				});
				this.askList = this.marketDepthData.filter(function (e: any) {
					return e.BbBuySellFlag == 83;
				});
			} else {
				this.dataLoad = true;
				// console.log('No data Table');
				this.marketDepthData = [];
			}
		})

		clearTimeout(this.clearTableData);
		this.clearTableData = setTimeout(() => {
			this.marketDepthtableData(exch, exchtype, code);
			this.dataLoad = true;
		}, 2000);
	}
	// Function to get scrip code in future case
	CashScripCode(exch: any, name: any, date: any) {
		var cashScripCodeObj = {
			"Exch": exch,
			"Symbol": name + ' ' + date
		}
		this.companyService.CashScripFuture(cashScripCodeObj).subscribe((res: any) => {
			this.ScripCode = res['body'].ScripCode;
		})
	}
	
	changeUrl(passExch = this.Exch, passExchType = this.ExchType, scripCode = this.nscBscCode || 0) {
		//passExch = this.Exch, passExchType = this.ExchType, scripCode = this.nscBscCode || 0, changeDate = this.compareExpiryDate
		let urlBreak = null;
		urlBreak = location.pathname.split('/');
		urlBreak[2] = passExch;
		urlBreak[3] = passExchType;
		urlBreak[4] = scripCode;
		//urlBreak[5] = changeDate+this.ExchType ;
		urlBreak = urlBreak.join('/');
		this.location.replaceState(urlBreak);
		this.urlParameter = this.route.params.subscribe(params => {
			this.Exch = passExch;
			this.ExchType = passExchType;
		});
		this.ScripCode = this.ScripCode;

	}
	toggleNscButton(event: any) {
		if (this.cashBlockTabValue == 'cash') {
			if (this.changeBtn == true) {
				this.changeUrl('B', undefined, this.ScripCode);
				this.chartsRender('basic', this.Exch, this.ScripShortName, this.ScripCode);
				// console.log('cashgraphUrl',this.graphBaseUrl+'TV_Sw/index.html?type=overview&period=1&exchange='+(this.Exch.toLowerCase())+'se&exchType=C&range=d&symbol=' +this.ScripShortName+ '&scripCode='+this.ScripCode+'&appName=AAA_Web&appVer=1.0.22.0&osName=Android&loginId=2')
				this.cashFilter(this.Exch, this.ExchType, this.ScripCode);
				this.cashDetails(this.Exch, this.ExchType, this.ScripCode);
				this.marketDepthtableData(this.Exch, this.ExchType, this.ScripCode);
			}
			if (this.changeBtn == false) {
				this.changeUrl('N', undefined, this.ScripCode);
				this.chartsRender('basic', this.Exch, this.ScripShortName, this.ScripCode);
				// console.log('cashgraphUrl',this.graphBaseUrl+'TV_Sw/index.html?type=overview&period=1&exchange='+(this.Exch.toLowerCase())+'se&exchType=C&range=d&symbol=' +this.ScripShortName+ '&scripCode='+this.ScripCode+'&appName=AAA_Web&appVer=1.0.22.0&osName=Android&loginId=2')
				this.cashFilter(this.Exch, this.ExchType, this.ScripCode);
				this.cashDetails(this.Exch, this.ExchType, this.ScripCode);
				this.marketDepthtableData(this.Exch, this.ExchType, this.ScripCode);
			}
		}
		if (this.cashBlockTabValue == 'future') {
			if (this.changeBtn == true) {
				clearTimeout(this.updateFutureOptValue);
				this.changeUrl('B');
				this.getExpiryDates(this.Exch, this.ExchType, this.ScripShortName);
			}
			if (this.changeBtn == false) {
				this.changeUrl('N');
				this.getExpiryDates(this.Exch, this.ExchType, this.ScripShortName);
			}

		}
		if (this.cashBlockTabValue == 'options') {
			if (this.changeBtn == true) {
				this.changeUrl('B');
				this.expiryDateOption(this.Exch, this.ExchType, this.ScripShortName);
				// console.log(this.optionList.length);

			}
			if (this.changeBtn == false) {
				this.changeUrl('N');
				this.expiryDateOption(this.Exch, this.ExchType, this.ScripShortName);
			}
		}
	}
	// go to calculaor page
	goToCalculator() {
		this.navCtrl.navigateForward('/price-calculator');
	}

	// segment changed method
	segmentTab(event: any) {
		// console.log(event);
		this.dataLoad = false;
		this.changeBtn = false;
		if (event == 'cash') {
			// console.log(this.ScripCode);
			this.changeUrl(undefined, 'C');
			clearTimeout(this.updateFutureOptValue);
			// console.log(this.ScripFullName);
			this.optionChain = false;
			this.scripCodeUnavailable = true;
			this.getSuperStarStock();
			if (this.Exch == 'N') {
				this.changeUrl('N');
			}
			if (this.Exch == 'B') {
				this.changeUrl('B');
				this.changeBtn = true;
			}

			if (this.ScripFullName.includes('CE') || this.ScripFullName.includes('PE')) {
				this.CashScripCode(this.Exch, this.ScripShortName, this.selectdateOption);
			}
			else {
				this.CashScripCode(this.Exch, this.ScripShortName, this.selectdate);
			}

			setTimeout(() => {
				this.changeUrl(this.Exch, 'C', this.ScripCode);
				this.cashFilter(this.Exch, 'C', this.ScripCode);
				this.cashDetails(this.Exch, 'C', this.ScripCode);
				this.marketDepthtableData(this.Exch, 'C', this.ScripCode);
				this.chartsRender('basic', this.Exch, this.ScripShortName, this.ScripCode);
			}, 1000);
		}
		if (event == 'future') {
			// console.log(this.urlExchParameter);
			if (this.urlExchParameter == 'C') {
				this.changeUrl(undefined, 'D')
			} else {
				this.changeUrl(undefined, this.urlExchParameter);
			}
			this.optionChain = false;
			clearTimeout(this.clearCashDetails);
			// clearTimeout(this.clearTableData);
			if (this.Exch == 'B') {
				this.changeUrl('B');
				this.changeBtn = true;
			}

			if (this.Exch == 'N') {
				this.changeUrl('N');
				this.changeBtn = false;

			}
			this.getExpiryDates(this.Exch, this.ExchType, this.ScripShortName);

		}
		if (event == 'news') {
			this.optionChain = false;
			clearTimeout(this.clearCashDetails);
			clearTimeout(this.updateFutureOptValue);
			clearTimeout(this.clearTableData);
		}
		if (event == 'options') {
			clearTimeout(this.clearCashDetails);
			// console.log(this.ScripShortName);
			this.optionChain = true;
			if (this.urlExchParameter == 'C') {
				this.changeUrl(undefined, 'D')
			} else {
				this.changeUrl(undefined, this.urlExchParameter);
			}
			// clearTimeout(this.clearCashDetails);
			// this.changeBtn = false;
			if (this.Exch == 'B') {
				this.changeUrl('B');
				this.changeBtn = true;
			}
			if (this.Exch == 'N') {
				this.changeUrl('N');
			}

			if (this.selectdateOption == true) {
				this.callPutValue = "PUT"
			} else {
				this.callPutValue = "CALL"
			}
			this.expiryDateOption(this.Exch, this.ExchType, this.ScripShortName);
		}
	}

	// Function for Expiry date list in future
	getExpiryDates(exch: any, exchtype: any, scripname: any, checkRender?: any) {

		this.dataLoad = false;
		var exporyDateObj = {
			'Exch': exch,
			'ExchType': exchtype,
			'Symbol': scripname
		}
		this.expiryDates = [];
		this.clientService.getExipry(exporyDateObj).subscribe((response: any) => {
			if (response['Status'] === 0) {
				const responseData = response['Data'];
				if (responseData.length > 0) {
					setTimeout(() => {
						this.dataLoad = true;
					}, 500);
					// console.log(responseData);
					responseData.forEach((element: any) => {
						const formattedDate = this.commonservice.getDate(element['Expiry']);
						// console.log(formattedDate);

						this.expiryDates.push({
							Expiry: formattedDate,
							MarketLot: element['MarketLot'],
							ScripCode: element['ScripCode'],
							TickSize: element['TickSize']
						})
					});

					this.selectdate = this.expiryDates[0]['Expiry'];
					this.futureScripCode = this.expiryDates[0]['ScripCode'];
					// // console.log('compare',this.ScripFullName.slice(0, -1).split('-').join(' ').toLowerCase());
					// console.log(this.expiryDates);
					// console.log(this.compareExpiryDate);
					if (this.compareExpiryDate !== undefined) {
						this.expiryDates.forEach(element => {
							// console.log(this.removeFirstZero(this.compareExpiryDate.split('-').join(' ')));
							if (element['Expiry'].toUpperCase() === this.removeFirstZero(this.compareExpiryDate.split('-').join(' '))) {
								// console.log(element);
								this.selectdate = element['Expiry'];
								this.futureScripCode = element['ScripCode'];
							}

						})
					}
					this.scripCodeUnavailable = true;
					
				
					this.displayOptionDataOneTime(this.futureScripCode);
					this.FutureOptionDetails(this.futureScripCode);
					this.marketDepthtableData(this.Exch, this.ExchType, this.futureScripCode);
						
					
				
					this.showSetTimeGraph = false
					
					// console.log(this.hideChart);

					
					if(checkRender == '1'){
						setTimeout(() => {
							this.showSetTimeGraph = true;
							if (this.hideChart == false) {
								this.displayBasicChart = this.graphBaseUrl + 'TV_Sw/basic-tv.html?type=futures&exchange=' + (this.Exch.toLowerCase()) + 'se&exchType=D&period=1&range=d&expiry_date=' + (this.selectdate.split(' ').join('-')) + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0';
		
							}
							else if (this.hideChart == true) {
								if (this.urlExchParameter == 'U') {
									this.displayfuCoChart = ChartLink['Chart']['basic'] + this.Exch.toLowerCase() + 'se&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.selectdate.split(' ').join('-') + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0'
									// console.log('display Chart',this.displayfuCoChart);
								}
								else {
									this.displayfuCoChart = ChartLink['Chart']['basic'] + this.Exch + '&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.selectdate.split(' ').join('-') + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0'
									// console.log(this.displayfuCoChart);
								}
							}	
						}, 250);
					}

					else{
						this.showSetTimeGraph = true;
						if (this.hideChart == false) {
							this.displayBasicChart = this.graphBaseUrl + 'TV_Sw/basic-tv.html?type=futures&exchange=' + (this.Exch.toLowerCase()) + 'se&exchType=D&period=1&range=d&expiry_date=' + (this.selectdate.split(' ').join('-')) + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0';
	
						}
						else if (this.hideChart == true) {
							if (this.urlExchParameter == 'U') {
								this.displayfuCoChart = ChartLink['Chart']['basic'] + this.Exch.toLowerCase() + 'se&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.selectdate.split(' ').join('-') + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0'
								// console.log(this.displayfuCoChart);
							}
							else {
								this.displayfuCoChart = ChartLink['Chart']['basic'] + this.Exch + '&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.selectdate.split(' ').join('-') + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0'
								// console.log(this.displayfuCoChart);
							}
						}	
					}
					
			
			
				}
				else {
					this.expiryDates = [];
					this.futureScripCode = undefined;
					this.scripCodeUnavailable = false;
					this.futureOptDetails = [];
					clearTimeout(this.clearCashDetails);
					clearTimeout(this.updateFutureOptValue);
					clearTimeout(this.clearTableData);
					this.marketDepthtableData(this.Exch, this.ExchType, undefined);
				}

			} else {
				setTimeout(() => {
					this.dataLoad = true;
				}, 1500);
				this.expiryDates = [];
				this.futureScripCode = undefined;
				this.scripCodeUnavailable = false;
				this.futureOptDetails = [];
				this.marketDepthtableData(this.Exch, this.ExchType, undefined);
				//this.selectdate = this.expiryDates[0]['Expiry'];
			}
		})
	}


	expiryDateChange(event: any) {
		const selected = event;
		//this.compareExpiryDate = event.toUpperCase().split(' ').join('-');
		//this.changeUrl(undefined, undefined, undefined,this.compareExpiryDate)
		this.expiryDates.forEach(element => {
			if (element['Expiry'] === selected) {
				this.futureScripCode = element['ScripCode'];
				this.displayOptionDataOneTime(element['ScripCode']);
				this.FutureOptionDetails(element['ScripCode']);
				this.marketDepthtableData(this.Exch, this.ExchType, element['ScripCode']);
				
				// console.log(this.hideChart);
				if (this.hideChart == false) {
					this.displayBasicChart = this.graphBaseUrl + 'TV_Sw/basic-tv.html?type=futures&exchange=' + (this.Exch.toLowerCase()) + 'se&exchType=D&period=1&range=d&expiry_date=' + (this.selectdate.split(' ').join('-')) + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0';
				}
				else if (this.hideChart == true) {
					if (this.urlExchParameter == 'U') {
						this.displayfuCoChart = ChartLink['Chart']['basic'] + this.Exch.toLowerCase() + 'se&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.selectdate.split(' ').join('-') + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=1.0&osName=Android&loginId=survinha'
						// console.log(this.displayfuCoChart);
					}

				}	
			}

		});
	}

	expiryDateOption(exch: any, exchtype: any, scripname: any) {
		this.dataLoad = false;
		var expiryOptionsObj = {
			"Exch": exch,
			"ExchType": exchtype,
			"Symbol": scripname
		}
		// console.log(expiryOptionsObj);
		this.clientService.getOptionsExpiryDate(expiryOptionsObj).subscribe((response: any) => {
			this.expiryDateOptionList = response['data'];
			const responseData = response['Data'];
			this.expiryDatesOption = [];
			if (responseData.length > 0) {
				setTimeout(() => {
					this.dataLoad = true;
				}, 1500);
				responseData.forEach((element: any) => {
					const formattedDate = this.commonservice.getDate(element['Expiry']);
					this.expiryDatesOption.push({
						eposExpiry: element['Expiry'],
						Expiry: formattedDate
					})
				});

				this.selectdateOption = this.expiryDatesOption[0]['Expiry'];
				this.eposeExpiryDate = this.expiryDatesOption[0]['eposExpiry'];

				// console.log('this.compareExpiryDate' + this.compareExpiryDate)
				if (this.compareExpiryDate !== undefined) {
					this.expiryDatesOption.forEach(element => {
						if (element['Expiry'].toUpperCase() == this.removeFirstZero(this.compareExpiryDate.split('-').join(' '))) {
							this.selectdateOption = element['Expiry'];
							this.eposeExpiryDate = element['eposExpiry'];
						}
					})
				}

				this.scripCodeUnavailable = true;
				this.getOptionalSymbolData(this.Exch, this.ScripShortName, this.eposeExpiryDate.replace("+0530", ""))
				this.optionScripDetails(this.Exch, expiryOptionsObj.Symbol, this.selectdateOption);
			}
			else {
				setTimeout(() => {
					this.dataLoad = true;
				}, 1500);
				this.expiryDatesOption = [];
				this.futureOptDetails = [];
				this.marketDepthtableData(this.Exch, this.ExchType, undefined);
				this.scripCodeUnavailable = false;
				clearTimeout(this.clearCashDetails);
				clearTimeout(this.updateFutureOptValue);
				// console.log(this.expiryDatesOption.length);
			}

		})
	}
	// Expiry date change for option tab
	expiryDateChangeOption(event: any) {
		const selected = event;
		// console.log(selected);
		//this.compareExpiryDate = event.toUpperCase().split(' ').join('-');
		//this.changeUrl(undefined, undefined, undefined,this.compareExpiryDate)
		this.expiryDatesOption.forEach(element => {
			if (element['Expiry'] === selected) {
				this.selectedExpiryDate = element['Expiry']
				this.eposeExpiryDate = element['eposExpiry'];
				this.optionScripDetails(this.Exch, this.cashScripName, element['Expiry'], '1');
				this.getOptionalSymbolData(this.Exch, this.cashScripName, element['eposExpiry'].replace("+0530", ""));
			}
		});
	}
	
	renderAdvanceChart() {
		this.commonservice.setClevertapEvent('AdvanceCharts');
		if (this.cashBlockTabValue == 'cash') {
			this.chartsRender('advance', this.Exch, this.ScripShortName, this.nscBscCode);
		}
		else if (this.cashBlockTabValue == 'future') {
			this.displayAdvanceChart = this.graphBaseUrl + 'TV_Sw/index.html?type=futures&exchange=' + (this.Exch.toLowerCase()) + 'se&exchType=D&period=1&range=d&expiry_date=' + (this.selectdate.split(' ').join('-')) + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0'
			// console.log(this.displayAdvanceChart);
			const url = this.displayAdvanceChart;
			window.open(url, '_blank');
			//const browser = this.iab.create(this.displayAdvanceChart, '_blank', 'location=no,clearsessioncache=no,clearcache=no');
		}
		else if (this.cashBlockTabValue == 'options') {
			this.displayAdvanceChart = this.graphBaseUrl + 'TV_Sw/index.html?type=options&exchange=' + this.Exch.toLowerCase() + 'se&exchType=D&option_type=' + this.optionInGraph + '&strike_price=' + this.selectStrikePrice + '&expiry_date=' + this.eposeExpiryDate + '&symbol=' + this.ScripShortName + '&range=d&period=1&scripCode=' + this.optionScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0';
			// console.log(this.displayAdvanceChart);
			const url = this.displayAdvanceChart;
			window.open(url, '_blank');
			//const browser = this.iab.create(this.displayAdvanceChart, '_blank', 'location=no,clearsessioncache=no,clearcache=no');
		}

	}

	/* renderAdvanceFuCoChart() {
		if(this.cashBlockTabValue == 'future'){
			if (this.urlExchParameter == 'U') {
				this.displayfuCoChart = ChartLink['Chart']['advanced'] + this.Exch.toLowerCase() + 'se&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.selectdate.split(' ').join('-') + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=1.0&osName=Android&loginId=survinha'
				window.open(this.displayfuCoChart, '_blank');
			}
			else {
				this.displayfuCoChart = ChartLink['Chart']['advanced'] + this.Exch + '&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.selectdate.split(' ').join('-') + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=1.0&osName=Android&loginId=survinha'
				window.open(this.displayfuCoChart, '_blank');
			}
		}
		else if(this.cashBlockTabValue == 'options'){
			if (this.urlExchParameter == 'U') {
				this.displayfuCoChart = ChartLink['Chart']['advanced'] + this.Exch.toLowerCase() + 'se&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.eposeExpiryDate+ '&option_type='+this.optionInGraph +'&strike_price='+this.selectStrikePrice+'&symbol=' + this.ScripShortName + '&scripCode=' + this.optionScripCode + '&appName=IIFLMarkets&appVer=1.0&osName=Android&loginId=survinha'
				window.open(this.displayfuCoChart, '_blank');
			}	
		}
	
	} */
	
	renderAdvanceFuCoChart() {
		this.commonservice.setClevertapEvent('AdvanceCharts');
		if(this.cashBlockTabValue == 'future'){
			if (this.urlExchParameter == 'U') {
				this.displayfuCoChart = ChartLink['Chart']['advanced'] + this.Exch.toLowerCase() + 'se&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.selectdate.split(' ').join('-') + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=1.0&osName=Android&loginId=survinha'
				//window.open(this.displayfuCoChart, '_blank');
				const browser = this.iab.create(this.displayfuCoChart, '_blank', 'location=no,clearsessioncache=no,clearcache=no');
			}
			else {
				this.displayfuCoChart = ChartLink['Chart']['advanced'] + this.Exch + '&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.selectdate.split(' ').join('-') + '&symbol=' + this.ScripShortName + '&scripCode=' + this.futureScripCode + '&appName=IIFLMarkets&appVer=1.0&osName=Android&loginId=survinha'
				//window.open(this.displayfuCoChart, '_blank');
				const browser = this.iab.create(this.displayfuCoChart, '_blank', 'location=no,clearsessioncache=no,clearcache=no');
			}
		}
		else if(this.cashBlockTabValue == 'options'){
			if (this.urlExchParameter == 'U') {
				this.displayfuCoChart = ChartLink['Chart']['advanced'] + this.Exch.toLowerCase() + 'se&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.eposeExpiryDate+ '&option_type='+this.optionInGraph +'&strike_price='+this.selectStrikePrice+'&symbol=' + this.ScripShortName + '&scripCode=' + this.optionScripCode + '&appName=IIFLMarkets&appVer=1.0&osName=Android&loginId=survinha'
				//window.open(this.displayfuCoChart, '_blank');
				const browser = this.iab.create(this.displayfuCoChart, '_blank', 'location=no,clearsessioncache=no,clearcache=no');
			}	
		}
	
	}
	// click to change Expiry Date

	// call and put value on toogle change
	changeBtnValueontoggle() {
		if (this.callPutBtn == true) {
			this.callPutValue = "PUT"
		} else {
			this.callPutValue = "CALL"
		}
	}
	// call and put value function call
	toggleCallPutBtn() {
		this.changeBtnValueontoggle();
		if (this.selectedExpiryDate == undefined) {
			this.optionScripDetails(this.Exch, this.cashScripName, this.selectdateOption);

		} else {
			this.optionScripDetails(this.Exch, this.cashScripName, this.selectedExpiryDate);
		}
	}

	// display scrip details in options tab
	optionScripDetails(exch: any, exchname: any, expirydata: any, passParams?: any) {
		var scripOptionDate = {
			"Exch": exch,
			"CallPut": this.callPutValue,
			"Symbol": exchname,
			"Expiry": expirydata
		}
		// console.log(scripOptionDate);
		this.clientService.getOptionsScripDetails(scripOptionDate).subscribe((response: any) => {
			// console.log(response['Data'])
			this.strikePriceList = response['Data'];
			let optionStrikePrice;
			let optionScripCode;

			if (passParams == '1') {
				optionStrikePrice = this.strikePriceList[0]['StrikeRate'];
				optionScripCode = this.strikePriceList[0]['ScripCode'];
				this.strikePriceList.forEach(element => {
					if (element['StrikeRate'] == this.selectStrikePrice) {
						optionStrikePrice = element['StrikeRate'];
						optionScripCode = element['ScripCode'];

					}
				})
				this.selectStrikePrice = optionStrikePrice;
				this.optionScripCode   = optionScripCode
			}
			else {
				this.strikePriceList.forEach(element => {
					if (element['StrikeRate'] == this.selectStrikePrice) {
						this.selectStrikePrice = element['StrikeRate'];
						this.optionScripCode = element['ScripCode'];

					}
				})
			}
			this.displayOptionDataOneTime(this.optionScripCode)
			this.FutureOptionDetails(this.optionScripCode);
			this.marketDepthtableData(this.Exch, this.ExchType, this.optionScripCode);
			this.checkforCePe();
			if (this.hideChart == false) {
				this.displayBasicChart = this.graphBaseUrl + 'TV_Sw/basic-tv.html?type=options&exchange=' + this.Exch.toUpperCase() + 'se&exchType=D&option_type=' + this.optionInGraph + '&strike_price=' + this.selectStrikePrice + '&expiry_date=' + this.eposeExpiryDate + '&symbol=' + this.ScripShortName + '&range=d&period=1&scripCode=' + this.optionScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0';
			}
			
			else if (this.hideChart == true) {
				if (this.urlExchParameter == 'U') {
					this.displayfuCoChart = ChartLink['Chart']['basic'] + this.Exch.toLowerCase() + 'se&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.eposeExpiryDate+ '&option_type='+this.optionInGraph +'&strike_price='+this.selectStrikePrice+'&symbol=' + this.ScripShortName + '&scripCode=' + this.optionScripCode + '&appName=IIFLMarkets&appVer=1.0&osName=Android&loginId=survinha'
					// console.log(this.displayfuCoChart);
				}

			}
		})
	}

	checkforCePe() {
		if (this.callPutBtn == true) {
			this.optionInGraph = 'pe'
		}
		else {
			this.optionInGraph = 'ce'
		}
	}
	// select change in strike rate
	strikeRateChangeOption(event: any) {
		const selected = event;
		this.strikePriceList.forEach(element => {
			if (element['StrikeRate'] === selected) {
				// console.log(element['ScripCode'])
				this.selectStrikePrice = element['StrikeRate'];
				this.optionScripCode = element['ScripCode'];
				// this.cashFilter(this.Exch, this.ExchType, element['ScripCode']);
				this.displayOptionDataOneTime(element['ScripCode']);
				this.FutureOptionDetails(element['ScripCode']);
				// this.cashDetails(this.Exch, this.ExchType, element['ScripCode']);
				this.marketDepthtableData(this.Exch, this.ExchType, element['ScripCode']);
				this.checkforCePe();

				if (this.hideChart == false) {
					this.displayBasicChart = this.graphBaseUrl + 'TV_Sw/basic-tv.html?type=options&exchange=' + this.Exch.toUpperCase() + 'se&exchType=D&option_type=' + this.optionInGraph + '&strike_price=' + this.selectStrikePrice + '&expiry_date=' + this.eposeExpiryDate + '&symbol=' + this.ScripShortName + '&range=d&period=1&scripCode=' + this.optionScripCode + '&appName=IIFLMarkets&appVer=5.63&osName=iOS&loginId=0';
				}
				
				else if (this.hideChart == true) {
					if (this.urlExchParameter == 'U') {
						this.displayfuCoChart = ChartLink['Chart']['basic'] + this.Exch.toLowerCase() + 'se&exchType=' + (this.urlExchParameter) + '&expiry_date=' + this.eposeExpiryDate+ '&option_type='+this.optionInGraph +'&strike_price='+this.selectStrikePrice+'&symbol=' + this.ScripShortName + '&scripCode=' + this.optionScripCode + '&appName=IIFLMarkets&appVer=1.0&osName=Android&loginId=survinha'
						// console.log(this.displayfuCoChart);
					}
	
				}
				
			}
		});
	}


	// display call and put data when click or init option tab
	getOptionalSymbolData(exch: any, symbol: any, expiry: any) {
		var optionalSymbolObj = {
			"Exch": exch,
			"Symbol": symbol,
			//"ExpiryDate": '/Date(' + 1600938000000 +')/'
			"ExpiryDate": expiry
		}
		this.dataLoad = false;
		this.loader.present();
		// console.log(optionalSymbolObj);
		this.companyService.getOptionalSymbol(optionalSymbolObj).subscribe((response: any) => {
			// console.log(response);
			// console.log('stopload')
			this.loader.dismiss();
			if (response['Status'] == 0) {
				setTimeout(() => {
					this.dataLoad = true;
				}, 500);
				if (response['Options'].length > 0) {
					this.cashScripName = optionalSymbolObj.Symbol;
					//has to toogle
					this.optionList = response['Options'];
					this.ascendic();
				}
				else {
					this.optionList = [];
				}
			}
			else {
				this.optionList = [];
				this.noDataOptionList = response['Message']

			}

		})
	}

	// sort strike price in option 
	sortByStrikeRate() {
		this.isAscendic ? this.ascendic() : this.descendic()
	}
	ascendic() {
		this.isAscendic = false;
		this.optionList.sort((a, b) => (a.StrikeRate > b.StrikeRate) ? 1 : -1)
		this.callDataList = this.optionList.filter(function (e) {
			return e.CPType == 'CE';
		});
		this.putDataList = this.optionList.filter(function (e) {
			return e.CPType == 'PE';
		});
	}

	descendic() {
		this.isAscendic = true;
		this.optionList.sort((a, b) => (a.StrikeRate > b.StrikeRate) ? -1 : 1)
		this.callDataList = this.optionList.filter(function (e) {
			return e.CPType == 'CE';
		});
		this.putDataList = this.optionList.filter(function (e) {
			return e.CPType == 'PE';
		});
	
	}

	// go to  news detail page
	goToDetailedNews() {
		this.router.navigate(['/detailed-news']);
	}
	// go to client list page with data parameter
	gotoClientList() {
		this.commonservice.setClevertapEvent('Scrip_ClientHoldings');
		if (this.cashBlockTabValue == 'options') {
			let convertUpperCaseDate = this.selectdateOption.toUpperCase();
			if (this.callPutBtn == true) {
				this.router.navigate(['/client-list', this.Exch, this.ExchType + '-' + convertUpperCaseDate.split(' ').join('-') + '-PE-' + this.selectStrikePrice, this.optionScripCode, this.ScripShortName]);
			} else {
				this.router.navigate(['/client-list', this.Exch, this.ExchType + '-' + convertUpperCaseDate.split(' ').join('-') + '-CE-' + this.selectStrikePrice, this.optionScripCode, this.ScripShortName]);
			}

		} else if (this.cashBlockTabValue == 'future') {

			this.router.navigate(['/client-list', this.Exch, this.ExchType + '-' + this.selectdate.split(' ').join('-').toUpperCase(), this.futureScripCode, this.ScripShortName]);
		} else {
			if(this.nscBscCode !== undefined){
				this.router.navigate(['/client-list', this.Exch, this.ExchType, this.nscBscCode, this.ScripShortName]);
			}
			else{
				this.toast.showToaster("Scrip code is not availble for Client List");
			}
		}
	}
	// display the option detail tab and hide the call put table page
	optionsDetails(data: any) {
		this.optionChain = false;
		this.selectStrikePrice = data.StrikeRate;
		if (data.CPType == "PE") {

			this.callPutBtn = true;
			this.callPutValue = "PUT"
		}
		if (data.CPType == "CE") {
			this.callPutBtn = false;
			this.callPutValue = "CALL"
		}
		// console.log(this.callPutValue);
		if (this.selectedExpiryDate == undefined) {
			this.optionScripDetails(this.Exch, this.cashScripName, this.selectdateOption);
		} else {
			this.optionScripDetails(this.Exch, this.cashScripName, this.selectedExpiryDate);
		}
		this.optionScripCode = data.ScripCode;

	}

	// on click show option chain screen
	optionChainVisible() {
		this.optionChain = true;
	}

	//function will appy only in commodity case future 
	commodityChange(data: any) {
		var DprObj = {
			name: 'DPR',
			value: data
		}
		if (this.Exch == 'M' && this.ExchType == 'D') {
			this.commodityName = 'MCX'
			this.futureOptDetails.push(DprObj)
			this.ContractInfoList();
		}
		else if (this.Exch == 'N' && (this.ExchType == 'X' || this.ExchType == 'Y')) {
			if (this.Exch == 'N' && this.ExchType == 'X') {
				this.commodityName = 'NCDEX'

			}
			else if (this.Exch == 'N' && this.ExchType == 'Y') {
				this.commodityName = 'NSE'
			}
			this.ContractInfoList();

		}
	}
	// function for update the detils for future and option recursive
	changeNumerAfterDecimal(value: any) {
		if (isNaN(value)) {
			if (value == '-') {
				return "-"
			}
			return 0;
		}
		else if (this.urlExchParameter == 'U') {
			return this.commonservice.formatNumberComma(parseFloat(value).toFixed(4));
		}
		else {
			return this.commonservice.formatNumberComma(parseFloat(value).toFixed(2));
		}
	}

	displayOptionDataOneTime(scripCode: any) {
		this.companyService.getFutureOptionDetails(scripCode).subscribe(res => {

			// console.log(res.response.data);
			// console.log(res.response.data.FutOptIndvidualStockDetaillist);
			if (res.response.data.FutOptIndvidualStockDetaillist === undefined) {
				this.commodityDetails = res.response.data.FutOptIndvidualStockList.FutOptIndvidualStock;
				// console.log(this.commodityDetails);
			}
			else {
				this.commodityDetails = [{ "Spot": "-", "RollOver": "-", "RollCost": "-", "LotSize": "-", "DelVolume": "-" }];
				// console.log(this.commodityDetails);
			}

		})
	}

	FutureOptionDetails(scripCode: any) {
		this.storage.get('userID').then((token) => {
			var fuOptionUpdateObj = {
				"Exch": this.Exch,
				"ExchType": this.ExchType,
				"ScripCode": scripCode,
				"clientCode": token
			}

			

			// // console.log('fuOptObj',fuOptionUpdateObj);
			this.companyService.futureOptgetDetailsUpdate(fuOptionUpdateObj).subscribe((res) => {
				if (res['body'].status == 0) {
					this.futureOptUpdatedData = res['body'].Data;
					this.cashLastRate = this.futureOptUpdatedData[0].LastRate;
					this.cashPClose = this.futureOptUpdatedData[0].PClose;

					setTimeout(() => {
						this.futureOptDetails = [{
							name: 'Spot',
							value: this.changeNumerAfterDecimal(this.commodityDetails[0].Spot)
						},
						{
							name: 'Roll Over',
							value: this.changeNumerAfterDecimal(this.commodityDetails[0].RollOver)
						},
						{
							name: 'Roll Over Cost',
							value: this.changeNumerAfterDecimal(this.commodityDetails[0].RollCost)
						},
						{
							name: 'Open',
							value: this.changeNumerAfterDecimal(this.futureOptUpdatedData[0].OpenRate)
						},
						{
							name: 'Day High (₹)',
							value: this.changeNumerAfterDecimal(this.futureOptUpdatedData[0].High)
						},
						{
							name: 'Day Low (₹)',
							value: this.changeNumerAfterDecimal(this.futureOptUpdatedData[0].Low)
						},
						{
							name: 'P. Close',
							value: this.changeNumerAfterDecimal(this.futureOptUpdatedData[0].PClose)
						},
						{
							name: 'Volume',
							value: this.formatNumber.transform(this.futureOptUpdatedData[0].TotalQty)
						},
						{
							name: 'Lot Size',
							value: this.commodityDetails[0].LotSize
						},
						{
							name: 'OI (% OI CHG)',
							value: this.formatNumber.transform(this.futureOptUpdatedData[0].OpenInterest) + ' (' + this.changeNumerAfterDecimal(this.commodityDetails[0].OIPercChange) + '%)'
						},
						{
							name: 'Delivery (% CHG)',
							value: this.formatNumber.transform(this.commodityDetails[0].DelVolume) + ' (' + this.changeNumerAfterDecimal(this.commodityDetails[0].DelVolumePerc) + '%)'
						}

						];
						this.commodityChange(this.futureOptUpdatedData[0].LowerCircuitLimit + '-' + this.futureOptUpdatedData[0].UpperCircuitLimit);
					}, 500);
					
					clearTimeout(this.updateFutureOptValue);
					this.updateFutureOptValue = setTimeout(() => {
						this.FutureOptionDetails(scripCode);
					}, 2000);
				}
				else {
					this.futureOptDetails = [];
					clearTimeout(this.clearCashDetails);
					clearTimeout(this.updateFutureOptValue);
					clearTimeout(this.clearTableData);
					// console.log(this.futureOptDetails);
					this.noDetailsFutureOpt();
					this.commodityChange("-");
				}

			})

		})
	}

	

	// whenever no data is coming from API in case of future and option 
	noDetailsFutureOpt() {
		this.cashLastRate = 0;
		this.cashPClose = 0;
		this.futureOptDetails = [{
			name: 'Spot',
			value: "-"
		},
		{
			name: 'Roll Over',
			value: "-"
		},
		{
			name: 'Roll Over Cost',
			value: "-"
		},
		{
			name: 'Open',
			value: "-"
		},
		{
			name: 'Day High (₹)',
			value: "-"
		},
		{
			name: 'Day Low (₹)',
			value: "-"
		},
		{
			name: 'P. Close',
			value: "-"
		},
		{
			name: 'Volume',
			value: '-'
		},
		{
			name: 'Lot Size',
			value: "-"
		},
		{
			name: 'OI (% OI CHG)',
			value: "-"
		},
		{
			name: 'Delivery (% CHG)',
			value: "-"
		}

		];

	}

	// ContractInfoList will display in case of Commodity
	ContractInfoList() {
		var contractObj = {
			"Exch": this.Exch,
			"ExchType": this.ExchType,
			"ScripCode": this.futureScripCode
		}
		// console.log(contractObj);
		this.companyService.getContractInfo(contractObj).subscribe(data => {
			this.contractList = data;
		})

	}
	
	// commodity contract info popup
	async contractInfo() {
		const modal = await this.modalController.create({
			component: CommodityContractInfoComponent,
			cssClass: 'superstars contract-info',
			componentProps: {
				"contractInfoData": this.contractList
			}
		});
		return await modal.present();
	}

	// superstars popup
	async superstars() {
		this.commonservice.setClevertapEvent('Superstars');
		const modal = await this.modalController.create({
			component: SuperstarsComponent,
			cssClass: 'superstars',
			componentProps: {
				stockData: this.superStarStockData
			}
		});
		return await modal.present();
	}
	
	// send value to watchlist button according to tab
	passValueToWatchList(tabname: any, watchlistScrip: any) {
		if (this.cashBlockTabValue == tabname) {
			this.passToWatchList = {
				scripcode: watchlistScrip,
				exchcode: this.Exch,
				exchtypecode: this.ExchType
			}
			if (tabname == 'future') {
				if (this.expiryDates.length > 0) {
					this.passToWatchList.futurevalue = this.selectdate;
				}
				else {
					this.passToWatchList.futurevalue = 0;
				}

			}
			if (tabname == 'options') {
				this.passToWatchList.futurevalue = this.selectdateOption + ' | ';
				if (this.callPutValue == 'CALL') {
					this.passToWatchList.btnName = 'CE';
				}
				else {
					this.passToWatchList.btnName = 'PE';
				}
				this.passToWatchList.strikePriceValue = this.selectStrikePrice;
			}
		}
	}

	// add to watchlist popup
	async addToWatchlist() {
		this.commonservice.setClevertapEvent('Scrip_AddToWatchlist');
		this.passValueToWatchList('cash', this.nscBscCode);
		this.passValueToWatchList('future', this.futureScripCode);
		this.passValueToWatchList('options', this.optionScripCode);
		if (this.passToWatchList.scripcode !== undefined) {
			const modal = await this.modalController.create({
				component: AddToWatchlistComponent,
				cssClass: 'add-to-watchlist',
				componentProps: {
					"addWatchName": this.ScripShortName,
					"addWatchLTP": this.cashLastRate,
					"addWatchPclose": this.cashPClose,
					"addWatchScripCode": this.passToWatchList
				}
			});
			return await modal.present();
		}
		else {
			this.toast.showToaster("Scrip code is not availble to add the watchlist");
		}
	}

	public getSuperStarStock() {
		this.subscription = new Subscription();

		this.subscription.add(
			this.companyService
				.getSuperStarStock(this.ScripShortName)
				.subscribe((response: any) => {
					// console.log(response);
					if (response['head']['status'] == 0) {
						if (response['body']['tableData'].length) {
							this.superStarStockData = response['body']['tableData'];
						}
					}
					else {
						this.superStarStockData = [];
					}

				})
		)
	}
	// news link to redirect on new tab
	newsLink() {
		const url = 'https://www.indiainfoline.com/search/news/' + this.ScripShortName.toLowerCase();
		if (this.commonservice.isApp() && this.platform.is('ios')) {
			var ref = cordova.InAppBrowser.open(url, '_blank');

			ref.addEventListener('loadstart', this.loadstartCallback);
			ref.addEventListener('loadstop', this.loadstopCallback);
			ref.addEventListener('loaderror', this.loaderrorCallback);
			ref.addEventListener('exit', this.exitCallback);
		} else {
			window.open(url, '_blank');
		}
	}

	// on back to to markets page
	goToPrevious() {
		window.history.back();
	}
	//for now not using this is function for reference
	// Urlfunction(url) {
	// 	return this.sanitizer.bypassSecurityTrustHtml('<iframe>' + url + '</iframe>')
	// }

	addZeroDecimal(value: any) {
		if (value == 0 || value == Math.round(value)) {
			return value
		}
		else {
			if (this.urlExchParameter == 'U') {
				return value.toFixed(4);
			}
			else {
				return value.toFixed(2);
			}
		}
	}
	// remove the first zero of expiry date to make equal to router date
	removeFirstZero(number: any) {
		if (number.substr(0, 1) == "0") {
			number = number.substr(1);
		}
		return number
	}

	//convert the value of volume
	displayDecimalDigits(value: any) {
		if (value == 0 || value == Math.round(value)) {
			return value
		}
		else {
			return value.toFixed(2);
		}

	}

	ionViewWillLeave() {
		clearTimeout(this.updateFutureOptValue);
		this.displayBasicChart = null;
		clearTimeout(this.clearCashDetails);
		clearTimeout(this.clearTableData);
	}
	ngOnDestroy() {
		this.displayBasicChart = null;
		clearTimeout(this.clearCashDetails);
		clearTimeout(this.clearTableData);
		clearTimeout(this.updateFutureOptValue);
		this.loader.dismiss();
	}

	public loadstartCallback(event: any) {
		console.log('Loading started: ' + event.url)
	}

	public loadstopCallback(event: any) {
		console.log('Loading finished: ' + event.url)
	}

	public loaderrorCallback(error: any) {
		console.log('Loading error: ' + error.message)
	}

	public exitCallback() {
		console.log('Browser is closed...')
	}

}


