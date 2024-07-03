
import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Platform, NavController, ModalController, IonSlides, IonContent } from '@ionic/angular';		review. removed IonSlides
import { Platform, NavController, ModalController, IonContent } from '@ionic/angular';
import { MarketService } from './markets.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { EditWatchlistDesktopComponent } from '../../components/edit-watchlist-desktop/edit-watchlist-desktop.component';
import { EditWatchlistMobileComponent } from '../../components/edit-watchlist-mobile/edit-watchlist-mobile.component';
import { IndicesDetailsComponent } from '../../components/indices-details/indices-details.component';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
// import { AddScriptPage } from '../pages/add-script/add-script.page';

@Component({
	selector: 'app-markets',
	providers: [MarketService, ToasterService],
	templateUrl: 'markets.page.html',
	styleUrls: ['markets.page.scss']
})
export class MarketsPage {
	//@ViewChild('slides', { static: false }) slider: any;// IonSlides;
	//@ViewChild('snapSlides', { static: false }) snapSlider: any;// IonSlides;
	//@ViewChild('indiceSlides', { static: false }) indiceSlider: any;// IonSlides;
	@ViewChild('slides') slider: ElementRef | undefined;

	@ViewChild('snapSlides') snapSlider: ElementRef | undefined;
	@ViewChild('indiceSlides') indiceSlider: ElementRef | undefined;


	@ViewChild(IonContent, { static: false }) content: any;// IonContent;
	
	
	private subscription: any;
	//public gainerDataLoad: boolean = false;
	public dealDataLoad: boolean = false;
	public weekDataLoad: boolean = false;
	public volumeDataLoad: boolean = false;
	public canAddDeleteScrip = true;
	public canRenameScrip = false;
	public editWatchListOption = null;
	public isDefaultTab = true;
	public showDeleteScripMob = false;
	public showDeleteScripDesk = false;
	public buttonDataSegment: any= [];
	public mainObj: any = {};

	public tabNames: any = [];

	public dataLoad = false;
	//parentMessage:string= "message from parent";
	//dummy data array from json
	lowHighList:any[] = [];
	gainersdata:any= [];
	public losersData = [];
	public bseGainers = [];
	public bseLosers = [];
	volumeList:any[] = [];
	dealsList:any[] = [];
	arrayName: any[] = [{ name: 'John'} , { name: 'Mary' }, { name: 'Adam' }];
	displaytoolbar!:boolean;
	// NOTE: this class is default class for getting tab into viewport DO NOT CHANGE
	public defaultClass = 'mobile-default';

	public overlayVisible = false;
	public displayHeader: any = [];
	public clearHeaderDetails: any = null;

	device: any;
	segmentOne;
	segmentTwo: any;
	niftyBlockTabValue: any = null;
	snapshotBlockTabValue: any = null;
	niftyBlockTabValueDesktop: any = null;
	desktopWatchlistBlockTabValue: any;
	mobileWatchlistBlockTabValue: any = 'watchlist';
	jsonData: any;
	feedJsonData: any;
	displayDataonSwitch:boolean = true;
	buttonData: any;
	buttonDataTwo: any[] = [];
	selectLink: any = "market"
	marketwatchData: any = [];
	public getFeed: any;
	// marketFeedData;

	dropBtn = false;
	
	
	format = 'dd/MM/yy';
	formattedDate: any;
	urlParameter:any;
	segmentID:any;

    public timeStamp: any = null;
    public indicesSegmentValue = 'indices';
    public indicesSegmentOptions: any[] = [
        {name: 'Indices', value: 'indices'},
        {name: 'Currency', value: 'currency'},
        {name: 'Commodity', value: 'commodity'},
        {name: 'Global Markets', value: 'global'}
    ]

    // skeleton height for watchlist
    public skeletonHight:any [] = [
        {}, {}, {}, {}, {}, {}, {}
    ]

    // snapshot option
    public snapshotOpton: any[] = [
        {equity: [
            {option: 'Gainers & Losers', value: 'gainersLosers', icon: 'gainer_loser.svg'},
            {option: 'Bulk & Block Deals', value: 'bulkBlockDeals', icon: 'bulk_block.svg'},
            {option: '52 Week High & Low', value: 'weekHighLow', icon: 'week_high_low.svg'},
            {option: 'Volume Toppers', value: 'volToppers', icon: 'volume_toppers.svg'},
        ]},
        {derivatives: [
            {option: 'FUT Gainers & Losers', value: 'futGainersLosers', icon: 'fut_gainer_loser.svg'},
            {option: 'FUT OI Gainers & Losers', value: 'futOiGainersLosers', icon: 'fut_oi_gainer_loser.svg'},
            {option: 'Rollover & Delivery (%)', value: 'rolloverDelivery', icon: 'rollover_delivery.svg'},
            {option: 'Premium & Discount (%)', value: 'premiumDiscount', icon: 'premium_discount.svg'},
            {option: 'Most Active Stock & Index Option', value: 'stockIndexOption', icon: 'active_stock.svg'},
			{option: 'Option Chain', value: 'optionChain', icon: 'fut_gainer_loser.svg'},
        ]}
    ]
	constructor(
		private platform: Platform, private http: HttpClient,
		public modalController: ModalController,
		public toast: ToasterService,
		private marService: MarketService,
		public navCtrl: NavController,
		private router: Router,
		private storage: StorageServiceAAA,
		private ngZone: NgZone,
		private commonService: CommonService,
		private route: ActivatedRoute,
		private locationn: Location
	) {
		
		if (this.platform.is('desktop')) {
			this.device = 'desktop';
		}
		if (this.platform.is('mobile')) {
			this.device = 'mobile';
		}
		this.segmentOne = 'watchlist';
		// console.log('constructor markets');
		this.marketwatchData = [];
		this.getFeed = null;
		this.buttonData = null;
		this.buttonDataTwo = [];
		this.niftyBlockTabValue = null;
		this.niftyBlockTabValueDesktop = null;

		//this.desktopWatchlistBlockTabValue = 'watchlist';
		// this.niftyBlockTabValueDesktop = 'NIFTY50';
		this.mobileWatchlistBlockTabValue = 'watchlist';
		//this.desktopWatchlistBlockTabValue = 'watchlist';
		// if(localStorage.getItem('saveChangeTab') == null || localStorage.getItem('saveChangeTab') == undefined){
		// 	this.desktopWatchlistBlockTabValue = 'watchlist';
		// 	this.segmentChanged("watchlist", this.buttonData, this.buttonDataTwo);
		// }
		// else{
		// 	this.desktopWatchlistBlockTabValue = localStorage.getItem('saveChangeTab');
		// 	this.segmentChanged(localStorage.getItem('saveChangeTab'),);
		// }
		//this.segmentOne = 'watchlist';
		// ion-select drop down style
		const ionSelect = document.querySelectorAll('ion-select');
		ionSelect.forEach((sel: any) => {
			sel.shadowRoot.querySelectorAll('.select-text').forEach((elem: any) => {
				elem.setAttribute('style', 'flex: initial');
			});
			sel.shadowRoot.querySelectorAll('.select-icon').forEach((elem: any) => {
				elem.setAttribute('style', 'height: 17px;width:16px; right:-5px; bottom:0px; opacity:1');
			});
			sel.shadowRoot.querySelectorAll('.select-icon-inner').forEach((elem: any) => {
				elem.setAttribute('style', 'opacity: 1; left: 0px; border-top: 8px solid #fff; border-right: 5px solid transparent; border-left: 5px solid transparent;');
			});
		});

		this.ngZone.run( () => {
			this.storage.get('userID').then( (token) => {
				this.getButtons();
				this.getButtonsTwo(token);
				this.getSegmantSnapshot();
			})
		})
		// this.storage.get('userID').then((token) => {
		if(this.router.url == '/markets'){
			this.selectLink = 'market';
		}
		
	}

    // navigate from snapshot page
    navigateFromSnapshot(option: any){
		if(option === 'gainersLosers'){
			this.router.navigate(['/gainers-losers']);
		}
		else if(option === 'bulkBlockDeals'){
			this.router.navigate(['/bulk-block-deals']);
		}                                   
		else if(option === 'weekHighLow'){
			this.router.navigate(['/52-week-high-low']);
		}
		else if(option === 'volToppers'){
			this.router.navigate(['/volume-toppers']);
		}
        else if(option === 'futGainersLosers'){
			this.router.navigate(['/fut-gainer-loser']);
		}                                   
		else if(option === 'futOiGainersLosers'){
			this.router.navigate(['/fut-oi-gainer-loser']);
		}
		else if(option === 'rolloverDelivery'){
			this.router.navigate(['/rollover-delivery']);
		}
        else if(option === 'premiumDiscount'){
			this.router.navigate(['/premium-discount']);
		}                                   
		else if(option === 'stockIndexOption'){
			this.router.navigate(['/most-active-stock-index']);
		} else if(option === 'optionChain'){
			this.router.navigate(['/option-chain']);
		}
	}

	selectLinkPage(events: any){
		if(events == 'Home'){
			this.router.navigate(['/dashboard']);
		}
		else if(events == 'markets'){
			this.router.navigate(['/markets']);
		}
		else if(events == 'Invest'){
			this.router.navigate(['/invest']);
		}
		else if(events == 'c&t'){
			this.router.navigate(['/client-trades']);
		}
		else if(events == 'more'){
			this.router.navigate(['/mobile-more-option']);
		}
	}

	// for mobile when segment change, get segment value, and do functionality on base that
	async mobileNiftyBlockSegmentChanged(ev: any) {
		ev.preventDefault();
		ev.stopPropagation();
		let sliderIndex = 0;
		clearTimeout(this.getFeed);

		this.marketwatchData = [];
		this.buttonDataTwo.forEach((element,index) => {
			if (this.niftyBlockTabValue === element['Name']) {
				sliderIndex = index;
			}
		});
		if(ev == "indices"){
			console.log('apply 1');
		}
		await this.slider?.nativeElement.swiper.slideTo(sliderIndex);
	}

	async mobileSnapshotChange(ev: any, val: any) {
		ev.preventDefault();
		ev.stopPropagation();
		let sliderIndex = 0;
	
		this.snapshotBlockTabValue = val;
		
		this.buttonDataSegment.forEach((element: any,index: any) => {
			if (this.snapshotBlockTabValue === element['Value']) {
				sliderIndex = index;
			}
		});
		await this.snapSlider?.nativeElement.swiper.slideTo(sliderIndex);
	}

	async mobileIndiceChange(ev: any) {
		ev.preventDefault();
		ev.stopPropagation();
		let sliderIndex = 0;
		clearTimeout(this.getFeed);
		
		this.marketwatchData = [];
		this.indicesSegmentOptions.forEach((element,index) => {
			if (this.indicesSegmentValue === element['value']) {
				sliderIndex = index;
			}
		});
		await this.indiceSlider?.nativeElement.swiper.slideTo(sliderIndex);
	}

	public ngDoCheck() {
		this.commonService.eventObservable.subscribe((obj) => {
			if (obj && obj['event'] === 'logout') {
			  clearInterval(this.getFeed);
			  clearTimeout(this.getFeed);
			}
		})
	}


	// for mobile when slide change get slide index value, and do functionality on base that
	async slideChanged(ev: any) {
		ev.preventDefault();
		ev.stopPropagation();
		const sliderIndex = await this.slider?.nativeElement.swiper.activeIndex;
		const selectedValue = this.buttonDataTwo[sliderIndex]['Name'];
		this.marketwatchData = [];

		if (sliderIndex === 0) {
			this.niftyBlockTabValue = selectedValue;
			this.segmentTwo = selectedValue;
		} else if (sliderIndex === 1) {
			this.niftyBlockTabValue = selectedValue;
			this.segmentTwo = selectedValue;
		} else if (sliderIndex === 2) {
			this.niftyBlockTabValue = selectedValue;
			this.segmentTwo = selectedValue;
		} else if (sliderIndex === 3) {
			this.niftyBlockTabValue = selectedValue;
			this.segmentTwo = selectedValue;
		} else if (sliderIndex === 4) {
			this.niftyBlockTabValue = selectedValue;
			this.segmentTwo = selectedValue;
		} else if (sliderIndex === 5) {
			this.niftyBlockTabValue = selectedValue;
			this.segmentTwo = selectedValue;
		} else if (sliderIndex === 6) {
			this.niftyBlockTabValue = selectedValue;
			this.segmentTwo = selectedValue;
		}

		this.showDeleteScripMob = false;
		this.showDeleteScripDesk = false;
		this.canAddDeleteScrip = this.buttonDataTwo[sliderIndex]['CanEditOrDelete'];
		this.canRenameScrip = this.buttonDataTwo[sliderIndex]['CanRenMW'];
		this.isDefaultTab = this.buttonDataTwo[sliderIndex]['isDefault'];
		this.editWatchListOption = this.buttonDataTwo[sliderIndex]['Name'];

		const tester = document.querySelectorAll( '.'+this.defaultClass );
		tester[sliderIndex].scrollIntoView();
		clearTimeout(this.getFeed);
		this.getTableData(this.segmentTwo);
	}

	async snapSlideChanged(ev: any) {
		ev.preventDefault();
		ev.stopPropagation();
		const sliderIndex = await this.snapSlider?.nativeElement.swiper.activeIndex;
		const selectedValue = this.buttonDataSegment[sliderIndex]['Value'];
		this.snapshotBlockTabValue = selectedValue; 

		const tester = document.querySelectorAll( '.'+this.defaultClass );
		tester[sliderIndex].scrollIntoView();
	}

	async indiceSlideChanged(ev: any) {
		// console.log('slides Indices');
		ev.preventDefault();
		ev.stopPropagation();
		const sliderIndex = await this.indiceSlider?.nativeElement.swiper.activeIndex;
		const selectedValue = this.indicesSegmentOptions[sliderIndex]['value'];
		this.indicesSegmentValue = selectedValue; 

		const tester = document.querySelectorAll( '.'+this.defaultClass );
		tester[sliderIndex].scrollIntoView();
	}

	// getDate(val) {
	// 	let sliceddate = val.slice(6, 19);
	// 	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	// 	let date = new Date(sliceddate * 1000);

	// 	let date1 = date.getDate();

	// 	let month = months[date.getMonth()];

	// 	return this.formattedDate = date1 + ' ' + month;
	// }

	getDate(val: any) {
		let sliceddate = val.slice(6, 19);
		let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		// let date = new Date(sliceddate * 1000);

		// let date1 = date.getDate();

    
    let utcSeconds = sliceddate / 1000;
    let date1 = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date1.setUTCSeconds(utcSeconds);
    
    let date = date1.getDate();
    let month = months[date1.getMonth()];
    let year = date1.getFullYear();
    

		return this.formattedDate = date + ' ' + month;
	}

	ionViewWillEnter() {
		this.overlayVisible = false;
		this.marketwatchData = [];
		this.getFeed = null;
		this.buttonData = null;
		this.buttonDataTwo = [];
		this.niftyBlockTabValue = null;
		this.niftyBlockTabValueDesktop = null;
		this.urlParameter = this.route.params.subscribe(params => {
			this.segmentID = params['id'] || 'watchlist';
		});
		// console.log(this.segmentID);
		if(this.segmentID == 'watchlist'){
			this.commonService.analyticEvent('Market_Watchlist', 'Market WatchList Desktop');
			this.desktopWatchlistBlockTabValue = 'watchlist';
			this.mobileWatchlistBlockTabValue = 'watchlist';
		}
		else if(this.segmentID == 'snapshot'){
			this.desktopWatchlistBlockTabValue = 'snapshot';
			this.mobileWatchlistBlockTabValue = 'snapshot';	
		}
		else if(this.segmentID == 'indices'){
			this.desktopWatchlistBlockTabValue = 'indices';
			this.mobileWatchlistBlockTabValue = 'indices';
		}
		else if(this.segmentID == 'status'){
			this.desktopWatchlistBlockTabValue = 'status';
			this.mobileWatchlistBlockTabValue = 'status';
		}
		else if(this.segmentID == 'exposure'){
			this.desktopWatchlistBlockTabValue = 'exposure';
			this.mobileWatchlistBlockTabValue = 'exposure';	
		} else {
			this.mobileWatchlistBlockTabValue = 'watchlist';
		}

		this.segmentChanged(this.segmentID);

	//	this.desktopWatchlistBlockTabValue = 'watchlist';
		//this.desktopWatchlistBlockTabValue = 'watchlist';
		// this.niftyBlockTabValueDesktop = 'NIFTY50';
		// this.mobileWatchlistBlockTabValue = 'watchlist';

		//this.segmentChanged(this.segmentID)

		// if(localStorage.getItem('saveChangeTab') == null || localStorage.getItem('saveChangeTab') == undefined){
		// 	this.desktopWatchlistBlockTabValue = 'watchlist';
		// 	this.segmentChanged("watchlist", this.buttonData, this.buttonDataTwo);
		// }
		// else{
		// 	this.desktopWatchlistBlockTabValue = localStorage.getItem('saveChangeTab');
		// 	this.segmentChanged(localStorage.getItem('saveChangeTab'),);
		// 	//this.segmentChanged(this.segmentID);
		// }
		//this.segmentOne = 'watchlist';
		// ion-select drop down style
		const ionSelect = document.querySelectorAll('ion-select');
		ionSelect.forEach((sel: any) => {
			sel.shadowRoot.querySelectorAll('.select-text').forEach((elem: any) => {
				elem.setAttribute('style', 'flex: initial');
			});
			sel.shadowRoot.querySelectorAll('.select-icon').forEach((elem: any) => {
				elem.setAttribute('style', 'height: 17px;width:16px; right:-5px; bottom:0px; opacity:1');
			});
			sel.shadowRoot.querySelectorAll('.select-icon-inner').forEach((elem: any) => {
				elem.setAttribute('style', 'opacity: 1; left: 0px; border-top: 8px solid #fff; border-right: 5px solid transparent; border-left: 5px solid transparent;');
			});
		});

		// this.storage.get('userID').then((token) => {
		this.storage.get('userID').then( (token) => {
			this.getButtons();
			this.getButtonsTwo(token);
			this.getSegmantSnapshot();
			this.getCommHeaderDetail();
		})
		if(this.router.url == '/markets'){
			this.selectLink = 'market';
		}
		//localStorage.setItem('tabChange', this.desktopWatchlistBlockTabValue);
		//console.log(localStorage.getItem('tabChange'));
	}

	// edit watchlist for mobile
	async editWatchlistMobile() {
		const modal = await this.modalController.create({
			component: EditWatchlistMobileComponent,
			cssClass: 'edit-popup-mobile',
			componentProps: {
				editWatchListOption: this.segmentTwo,
				scripLength: this.mainObj[this.segmentTwo] ? this.mainObj[this.segmentTwo].length : 0,
				canAddDelete: this.canAddDeleteScrip,
				canRename: this.canRenameScrip,
				isDefault: this.isDefaultTab
			}
		});
		modal.onDidDismiss().then((data) => {
			if (data['data']['passData'] && Object.keys(data['data']['passData']).length) {
				const recievedData = data['data']['passData'];
				const renameValue = recievedData['watchListName'];
				if(recievedData['setDefault']) {
					this.setAsDefault(this.editWatchListOption);
				}
				if (recievedData['renameWatchList']) {
					this.renameWatchList(recievedData['watchListName'],recievedData['watchListValue']);
				}
				if (recievedData['deleteScrip']) this.showDeleteScripMob = recievedData['deleteScrip'];
				if (recievedData['addScrip']) this.navCtrl.navigateForward('/add-script');
			}
		})
		return await modal.present();
	}

	// edit watchlist for desktop
	async editWatchlistDesktop() {
		const modal = await this.modalController.create({
			component: EditWatchlistDesktopComponent,
			cssClass: 'edit-popup-desktop',
			componentProps: {
				editWatchListOption: this.editWatchListOption,
				scripLength: this.marketwatchData.length,
				canAddDelete: this.canAddDeleteScrip,
				canRename: this.canRenameScrip,
				isDefault: this.isDefaultTab
			}
		});
		modal.onDidDismiss().then((data) => {
			if (data['data']['passData'] && Object.keys(data['data']['passData']).length) {
				const recievedData = data['data']['passData'];
				if(recievedData['setDefault']) {
					this.setAsDefault(this.editWatchListOption);
				}
				if (recievedData['renameWatchList']) {
					this.renameWatchList(recievedData['watchListName'],recievedData['watchListValue']);
				}
				if (recievedData['deleteScrip']) this.showDeleteScripDesk = recievedData['deleteScrip'];
				if (recievedData['addScrip']) this.navCtrl.navigateForward('/add-script');
			}
		})
		return await modal.present();
	}

	getButtons() {
		this.http.get('./assets/buttons.json').subscribe(res => {
			this.buttonData = res;
		})
	}
	// dummy data from json file for snapshot tabs
	getSegmantSnapshot(){
		this.http.get('./assets/datafile.json').subscribe((res: any) => {
			this.buttonDataSegment = res['snapshots'];
		})

		// this.http.get('./assets/datafile.json').subscribe(res => {
		// 	this.gainersdata = res['gainersdata'];
		// })

		this.http.get('./assets/datafile.json').subscribe((res: any) => {
			this.lowHighList = res['lowhighdata'];
		})

		// this.http.get('./assets/datafile.json').subscribe(res => {
		// 	this.volumeList = res['volume'];
		// })

		this.http.get('./assets/datafile.json').subscribe((res: any) => {
			this.dealsList = res['deals'];
		})
	}

	getButtonsTwo(id: any) {
		this.subscription = new Subscription();
		try {
			const params = id;
			this.subscription.add(this.marService
				.getMList(params)
				.subscribe( (response: any) => {
					let selectedTab: any = null;
					this.buttonDataTwo = response['MWName'];
					response['MWName'].forEach((element: any, index: any) => {
						if (element['IsDefault']) {
							selectedTab = element['MwatchName'];
							// Initially true in case of NIFTY50 it will always be false
							if (selectedTab === 'NIFTY50') {
								this.canAddDeleteScrip = false;
							}
						}
						this.buttonDataTwo[index] = {
							Name: element['MwatchName'],
							Value: element['MwatchName'],
							active: element['IsDefault'],
							isDefault: element['IsDefault'],
							CanEditOrDelete: element['CanEditOrDelete'],
							CanRenMW: element['CanRenMW']
						}
					});

					this.buttonDataTwo.forEach((element: any) => {
						this.tabNames.push(element['Name']);
						this.mainObj[element['Name']] = [];
					});
					
					this.niftyBlockTabValue = selectedTab;
					this.niftyBlockTabValueDesktop = selectedTab;
					this.editWatchListOption = selectedTab;
					this.segmentTwo = selectedTab;
					this.buttonDataTwo.forEach((element,index) => {
						if (element['Name'] === selectedTab) {
							if(this.slider && this.slider?.nativeElement.swiper.slideTo){
								this.slider?.nativeElement.swiper.slideTo(index,500);
							}
						}
					});
					this.getTableData(selectedTab);
				}))
		} catch (error) {
			console.log(error);
		}
	}
    

	addScript() {
		this.overlayVisible = false;
		this.navCtrl.navigateForward(['/add-script']);
	}

	/**
	 * on load get selected tab data
	 */
	public getTableData(selectTab: any, changeSlide?: any) {
		// this.marketwatchData = [];
		this.subscription = new Subscription();
		this.storage.get('userID').then( (token) => {
			const bodyParams = {
				MWName: selectTab,
				ClientLoginType: 0,
				Clientcode: token
			}
			try {
				this.subscription.add(this.marService
					.getMarketList(bodyParams)
					.subscribe((response: any) => {
						this.marketwatchData = [];
						clearTimeout(this.getFeed);
						if (response && response['Status'] === 0) {
							this.marketwatchData = response['Data'].sort(this.dynamicSort("ShortName"));
							
							this.mainObj[selectTab] = response['Data'];
							this.dataLoad = true;
							
							let marketFeedData: any = [];
							this.mainObj[selectTab].forEach((element: any) => {
								marketFeedData.push({
									Exch: element['Exch'],
									ExchType: element['ExchType'],
									ScripCode: element['ScripCode'],
									ClientLoginType: 0,
									LastRequestTime: '/Date(0)/',
									// LastRequestTime: element['LastTradeTime'],
									RequestType: 0
								})
							});
							if (changeSlide) {
								let sliderIndex = 0;
								this.buttonDataTwo.forEach((element,index) => {
									if (this.niftyBlockTabValue === element['Name']) {
										sliderIndex = index;
									}
								});
								this.slider?.nativeElement.swiper.slideTo(sliderIndex);
							}
							setTimeout(() => {
								this.getMarketFeedList(marketFeedData,this,selectTab);
							}, 2000);
						} else {
							this.dataLoad = true;
							clearTimeout(this.getFeed);
							// this.toast.displayToast(response['body']['Message'])
						}
					}))
			} catch (error) {
				clearTimeout(this.getFeed);
				// console.log(error);
				// this.toast.displayToast(error);
			}		
		})
	}

	 dynamicSort(property: any) {
		var sortOrder = 1;
		if(property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a: any,b: any) {
			/* next line works with strings and numbers, 
			 * and you may want to customize it to your needs
			 */
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	}


	watchlistSegmentBlockMobile(val?: any, arr?: any, niftySegmentArray?: any) {
		
		// this.router.navigateByUrl(this.router.url.replace(this.segmentID, val));
		this.locationn.replaceState(this.router.url.replace(this.segmentID, val));
		location.href.replace(this.segmentID, val);
		// console.log(this.locationn, this.router, this.router.url, 'Segment -> ' + this.segmentID, 'VAL -> ' + val);
		if (val === 'watchlist') {
			this.commonService.setClevertapEvent('Market_Watchlist');
			this.commonService.analyticEvent('Market_Watchlist', 'Market WatchList for Mobile');
			niftySegmentArray.forEach((element: any) => {
				if (element['active']) {
					this.niftyBlockTabValue = element['Value'];
					this.segmentTwo = element['Value'];
					// this.segmentTwo = 'NIFTY50';
				} 
			});
		}
		if (val === 'snapshot') {
			this.commonService.setClevertapEvent('Market_Snapshot');
			this.commonService.analyticEvent('Market_Snapshot', 'Market Snapshot Mobile');
			this.snapshotBlockTabValue= "gainers";
			const exchType = 'N';
			this.getGainersLosersData(exchType);
			const exchType2 = 'B';
			this.getGainersLosersData(exchType2);
		}
		this.segmentOne = val;
		
		if(val == 'indices'){
			this.commonService.setClevertapEvent('Market_Indices');
			this.indicesSegmentValue = 'indices';
		}
	}


	segmentChanged(val?: any, arr?: any, niftySegmentArray?: any) {
		// console.log(val);
		this.router.navigateByUrl(this.router.url.replace(this.segmentID, val));
	// 	let urlBreak = null;
	// 	urlBreak = location.pathname.split('/');
  
    // urlBreak = urlBreak.join('/');
    // this.location.replaceState(urlBreak);
    // this.urlParameter = this.route.params.subscribe(params => {
    //   this.Exch = passExch;
    //   this.ExchType = passExchType;
    // });
		// this.urlParameter = this.route.params.subscribe(params => {
		// 	this.segmentID = val;
		// });
	//	localStorage.setItem('saveChangeTab', val)
		if (val === 'watchlist') {
			this.commonService.analyticEvent('Market_Watchlist', 'Market WatchList for Desktop');
			this.commonService.setClevertapEvent('Market_Watchlist');
			// niftySegmentArray.forEach(element => {
			// 	if (element['Name'] === 'NIFTY50') {
			// 		element['active'] = 1;
			// 		this.niftyBlockTabValue = 'NIFTY50';
			// 		this.segmentTwo = 'NIFTY50';
			// 	} else {
			// 		element['active'] = 0;
			// 	}
			// });
			// arr.forEach(element => {
			// 	element['active'] = 0;
			// });
		}
		if (val === 'snapshot') {
			this.commonService.setClevertapEvent('Market_Snapshot');
			clearTimeout(this.getFeed);
			this.commonService.analyticEvent('Market_Snapshot', 'Market Snapshot Desktop');
			this.snapshotBlockTabValue= "gainers";
			const exchType = 'N';
			this.getGainersLosersData(exchType);

			const exchType2 = 'B';
			this.getGainersLosersData(exchType2);
		}
		if(val == 'exposure' || val == 'status'){
			val === 'exposure' ? this.commonService.setClevertapEvent('Markets_Exposure') : this.commonService.setClevertapEvent('Market_Market Status');
			clearTimeout(this.getFeed);
		}
		if (val === 'indices') this.commonService.setClevertapEvent('Market_Indices');
		this.segmentOne = val;
	
	}

	async segmentChangedTwo(canAddDel: any,canRename: any, isDefault: any,val?: any, arr?: any,index?: any, selectedBtnValue?: any) {
		
		this.dataLoad = false;
		if(this.marketwatchData.length > 0){
			this.displayDataonSwitch = true;
		}
		else{
			this.displayDataonSwitch = false;
		}
		clearTimeout(this.getFeed);
		this.showDeleteScripMob = false;
		this.showDeleteScripDesk = false;
		this.canAddDeleteScrip = canAddDel;
		this.canRenameScrip = canRename;
		this.isDefaultTab = isDefault;
		this.editWatchListOption = val;
		this.segmentTwo = val;
		if (index || index === 0) {
			const tester = document.querySelectorAll( '.'+this.defaultClass );
			tester[index].scrollIntoView();
		}
		arr.forEach((element: any) => {
			element['active'] = 0;
		});
		if (selectedBtnValue === 'watchlist') {
			this.getTableData(val);
		} else if (selectedBtnValue === 'snapshot') {
			let sliderIndex = 0;
			this.snapshotBlockTabValue = val;
			this.buttonDataSegment.forEach((element: any,index: any) => {
				if (this.snapshotBlockTabValue === element['Value']) {
					sliderIndex = index;
				}
			});
			await this.snapSlider?.nativeElement.swiper.slideTo(sliderIndex);
		}
	}

	async indiceSegmentClick(val?: any, index?: any) {

		if (index || index === 0) {
			const tester = document.querySelectorAll( '.'+this.defaultClass );
			tester[index].scrollIntoView();
		}

		let sliderIndex = 0;
		this.indicesSegmentValue = val;
		this.indicesSegmentOptions.forEach((element,index) => {
			if (this.indicesSegmentValue === element['value']) {
				sliderIndex = index;
			}
		});
		await this.indiceSlider?.nativeElement.swiper.slideTo(sliderIndex);
	}

	// dropClick(val, index, arr){
	dropClick(index: any, arr: any) {
		// event.preventDefault();
		arr.forEach((element: any, ind: any) => {
			if ((index) !== ind) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
	}

	dropClose() {
		this.dropBtn = false;
	}

	/**
	 * Call function on repsonse cache time
	 */
	public getMarketFeedList(marketFeedData: any,self: any,selectedTab: any) {
		self.subscription = new Subscription();

		if (marketFeedData.length) {
			const passObj: any = {};
			passObj['Count'] = marketFeedData.length;
			passObj['MarketFeedData'] = marketFeedData;
			passObj['ClientLoginType'] = 0;
			passObj['RefreshRate'] = "H";
			passObj['date'] = this.timeStamp ? this.timeStamp : marketFeedData[0]['LastRequestTime'];
			passObj['Date'] = this.timeStamp ? this.timeStamp : marketFeedData[0]['LastRequestTime'];
			try {
				self.subscription.add(self.marService.getMFeedList(passObj)
					.subscribe((response: any) => {
						if (selectedTab !== this.segmentTwo) return;
						if (response['body']['Status'] === 0 && response['head']['status'] === '0') {
							this.timeStamp = response['body']['TimeStamp'];
							this.timeStamp = this.timeStamp.replace('+0530', '');
							
							// this.marketwatchData = response['body']['Data'];
							// let marketNewFeedData = [];
							if (self.mainObj[this.segmentTwo].length) {
								// self.marketwatchData.forEach(element => {
								// 	marketNewFeedData.push({
								// 		Exch: element['Exch'],
								// 		ExchType: element['ExchType'],
								// 		ScripCode: element['ScripCode'],
								// 		ClientLoginType: 0,
								// 		// LastRequestTime: new Date(0),
								// 		LastRequestTime: '/Date(0)/',
								// 		RequestType: 0
								// 	})
								// });
								
								// self.marketwatchData.forEach(element => {
									if (response['body']['Data'] && self.mainObj[this.segmentTwo].length) {
										response['body']['Data'].forEach((innerEle: any,index: any) => {
											// element['Exch'] = innerEle['Exch'],
											// element['ExchType'] = innerEle['ExchType'],
											self.mainObj[this.segmentTwo][index]['High'] = innerEle['High'],
											self.mainObj[this.segmentTwo][index]['LastTradePrice'] = innerEle['LastRate'],
											self.mainObj[this.segmentTwo][index]['Low'] = innerEle['Low'],
											self.mainObj[this.segmentTwo][index]['OpenRate'] = innerEle['OpenRate'],
											self.mainObj[this.segmentTwo][index]['PClose'] = innerEle['PClose'],
											self.mainObj[this.segmentTwo][index]['PriceAsk'] = innerEle['PriceAsk'],
											self.mainObj[this.segmentTwo][index]['PriceBid'] = innerEle['PriceBid'],
											self.mainObj[this.segmentTwo][index]['QtyAsk'] = innerEle['QtyAsk'],
											self.mainObj[this.segmentTwo][index]['QtyBid'] = innerEle['QtyBid'],
											self.mainObj[this.segmentTwo][index]['Time'] = innerEle['Time'],
											self.mainObj[this.segmentTwo][index]['Token'] = innerEle['Token'],
											self.mainObj[this.segmentTwo][index]['TotalQty'] = innerEle['TotalQty'],
											self.mainObj[this.segmentTwo][index]['TickDt'] = innerEle['TickDt']

											self.marketwatchData[index]['High'] = innerEle['High'],
											self.marketwatchData[index]['LastTradePrice'] = innerEle['LastRate'],
											self.marketwatchData[index]['Low'] = innerEle['Low'],
											self.marketwatchData[index]['OpenRate'] = innerEle['OpenRate'],
											self.marketwatchData[index]['PClose'] = innerEle['PClose'],
											self.marketwatchData[index]['PriceAsk'] = innerEle['PriceAsk'],
											self.marketwatchData[index]['PriceBid'] = innerEle['PriceBid'],
											self.marketwatchData[index]['QtyAsk'] = innerEle['QtyAsk'],
											self.marketwatchData[index]['QtyBid'] = innerEle['QtyBid'],
											self.marketwatchData[index]['Time'] = innerEle['Time'],
											self.marketwatchData[index]['Token'] = innerEle['Token'],
											self.marketwatchData[index]['TotalQty'] = innerEle['TotalQty'],
											self.marketwatchData[index]['TickDt'] = innerEle['TickDt']
										});
									}
								// });
								clearTimeout(this.getFeed);
								this.getFeed = setTimeout(() => {
									this.getMarketFeedList(marketFeedData, self,selectedTab);
								}, +(response['body']['CacheTime']+'000'))
		
								// clearInterval(self.getFeed);
								// self.getFeed = setInterval(self.getMarketFeedList, +(response['body']['CacheTime']+'000'), marketFeedData, self)
							}
						} else {
							this.toast.displayToast(response['head']['statusDescription'])
						}
					}))
			} catch (error) {
				// console.log(error);
				// this.toast.displayToast(error);
			}
		}
	}
	

	// set as default tab from pop up
	public setAsDefault(selectTab: any) {
		this.subscription = new Subscription();
		this.storage.get('userID').then( (token) => {
			const bodyParams = {
				AttributeAction: "SetDefaultMW",
				AttributeName: selectTab,
				AttributeValue: "Y",
				// ClientLoginType: 0,
				Clientcode: token
			}
			try {
				this.subscription.add(this.marService.setAsDefault(bodyParams)
					.subscribe((response) => {
						if (response['Status'] === 0) {
							this.buttonDataTwo.forEach(element => {
								if (element['Name'] === selectTab) element['isDefault'] = true;
								else element['isDefault'] = false;
							});
							this.isDefaultTab = true;
							this.toast.displayToast(response['Message'])
						} else {
							this.toast.displayToast(response['Message'])
						}
					}))
			} catch (error) {
				console.log(error);
				// this.toast.displayToast(error);
			}
		})
	}

	public renameWatchList(watchName: any, watchNameValue: any) {
		this.subscription = new Subscription();
		this.storage.get('userID').then( (token) => {
			const bodyParams = {
				AttributeAction: "ReNameWL",
				AttributeName: watchName,
				AttributeValue: watchNameValue,
				ClientLoginType: 0,
				Clientcode: token
			}
			try {
				this.subscription.add(this.marService
					.setAsDefault(bodyParams)
					.subscribe((response) => {
						if (response['Status'] === 0) {
							this.buttonDataTwo.forEach(element => {
								if (element['Name'] === watchName) {
									element['Name'] = watchNameValue;
									element['Value'] = watchNameValue;
	
									this.editWatchListOption = watchNameValue;
									this.segmentTwo = watchNameValue;
								}
							});
							this.toast.displayToast(response['Message'])
						} else {
							this.toast.displayToast(response['Message'])
						}
					}))
			} catch (error) {
				console.log(error);
				// this.toast.displayToast(error);
			}
		})
	}
	
	clientList(clientlistdata: any){
	
		this.overlayVisible = false;
		clearTimeout(this.getFeed);
		event?.preventDefault();
		// console.log(clientlistdata, '  clientlistdata  ');
		
		if (clientlistdata["ExchType"] !== 'C') {
			const optionType = clientlistdata["FullName"];
			if (optionType.includes(' CE ')) {
				this.router.navigate(['/client-list', clientlistdata["Exch"] , clientlistdata["ExchType"]+'-'+clientlistdata["FullName"].split(' ').join('-'), clientlistdata["ScripCode"], clientlistdata["Name"]]);
			} else if (optionType.includes(' PE ')) {
				this.router.navigate(['/client-list', clientlistdata["Exch"] , clientlistdata["ExchType"]+'-'+clientlistdata["FullName"].split(' ').join('-'), clientlistdata["ScripCode"], clientlistdata["Name"]]);
			} else {
				this.router.navigate(['/client-list', clientlistdata["Exch"] , clientlistdata["ExchType"]+'-'+clientlistdata["FullName"].split(' ').join('-'), clientlistdata["ScripCode"], clientlistdata["Name"]]);
			}
		} else {
			this.router.navigate(['/client-list', clientlistdata["Exch"] , clientlistdata["ExchType"], clientlistdata["ScripCode"], clientlistdata["Name"]]);
		}
	}

	ionPull(event: any) {
		//Emitted while the user is pulling down the content and exposing the refresher.
		// console.log('ionPull Event Triggered!');
	  }
	  ionStart(event: any) {
		//Emitted when the user begins to start pulling down.
		// console.log('ionStart Event Triggered!');
	  }

	public ionRefresh(event: any) {
		clearTimeout(this.getFeed);
		setTimeout(() => {
			this.getTableData(this.segmentTwo);
			event.target.complete();
		  }, 2000);
	}

	// go to company detail page:
	goToCompanyDetail(clientlistdata: any) {
		this.overlayVisible = false;
		clearTimeout(this.getFeed);
		if (this.segmentTwo !== 'RECENTVIEWED') {
			this.addToRecent(clientlistdata["Exch"] , clientlistdata["ExchType"],clientlistdata["ScripCode"], clientlistdata["FullName"], clientlistdata["Name"]);
		} else {
			this.router.navigate(['/company-details', clientlistdata["Exch"] , clientlistdata["ExchType"],clientlistdata["ScripCode"], clientlistdata["FullName"].split(' ').join('-') + clientlistdata["ExchType"], clientlistdata["Name"]]);
		}
	}

	public addToRecent(exch: any, exchType: any, code: any, fName: any, shortName: any) {
		this.storage.get('userID').then( (token) => {
			const params = {
				"Clientcode": token,
				"MWname": "RECENTVIEWED",
				"ClientLoginType":0,
				"Data": [
					{
						"Exch": exch,
						"ExchType": exchType,
						"ScripCode": code,
						"Action":"A"
					}
				]
			}
	
			this.subscription = new Subscription();
	
			this.subscription.add(
				this.marService
				.recentScrip(params)
				.subscribe( (response) => {
					this.router.navigate(['/company-details', exch , exchType, code, fName.split(' ').join('-') + exchType, shortName]);
					
				})
			)
		})
	}


	public getGainersLosersData(exchType: any) {
		//this.gainerDataLoad = false;
		clearTimeout(this.getFeed);
		this.subscription = new Subscription();

		const params = {
			Exchange: exchType,
			ClientLoginType: 0
		}
		this.subscription.add(
			this.marService
			.getGainersLosers(params)
			.subscribe((response) => {
				if (response['Status'] === 0 && response['Gainer'] && response['Gainer'].length) {
					// setTimeout(() => {
					// 	this.gainerDataLoad = true;
					// }, 1200);
					if (exchType === 'N') {
						this.gainersdata = response['Gainer'];
						this.losersData = response['Looser'];
					} else if (exchType === 'B') {
						this.bseGainers = response['Gainer'];
						this.bseLosers = response['Looser'];
					}
				} else {
					//this.gainerDataLoad = true;
					if (exchType === 'N') {
						this.gainersdata = [];
						this.losersData = [];
					} else if (exchType === 'B') {
						this.bseGainers = [];
						this.bseLosers = [];
					}
				}
			})
		)
	}

	async headerClick(event: any, value: any) {
		event.stopPropagation();
		this.overlayVisible = !this.overlayVisible;
		var objPass = {
			symbol: value.Symbol,
			scripCode: value.ScripCode,
			exch: value.Exch,
			exchType: value.ExchType
		  }
		const modal = this.modalController.create({
			component: IndicesDetailsComponent,
			componentProps: {"IndParams": objPass},
			cssClass: 'superstars indices-details'
		});
		return (await modal).present();
		
	}

	public titleClick(event: any) {
		event.stopPropagation();
		this.overlayVisible = !this.overlayVisible;
	}

	getCommHeaderDetail() {
		this.marService.getCommonHead().subscribe((res: any) => {
			this.displayHeader = [
				{
					"Exch": res['Data'][1].Exch,
					"ExchType": res['Data'][1].ExchType,
					"LastRate": res['Data'][1].LastRate,
					"PerChange": res['Data'][1].PerChange,
					"ScripCode": res['Data'][1].ScripCode,
					"Change": res['Data'][1].Change,
					"Symbol": res['Data'][1].Symbol
				},
				{
					"Exch": res['Data'][2].Exch,
					"ExchType": res['Data'][2].ExchType,
					"LastRate": res['Data'][2].LastRate,
					"PerChange": res['Data'][2].PerChange,
					"ScripCode": res['Data'][2].ScripCode,
					"Change": res['Data'][2].Change,
					"Symbol": res['Data'][2].Symbol
				},
				{
					"Exch": res['Data'][0].Exch,
					"ExchType": res['Data'][0].ExchType,
					"LastRate": res['Data'][0].LastRate,
					"PerChange": res['Data'][0].PerChange,
					"ScripCode": res['Data'][0].ScripCode,
					"Change": res['Data'][0].Change,
					"Symbol": res['Data'][0].Symbol,
				}

			]
		})
		clearTimeout(this.clearHeaderDetails);
		this.clearHeaderDetails = setTimeout(() => {
			this.getCommHeaderDetail();
		}, 2000);
	}

	goToDashboard(){
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
			this.router.navigate(['/dashboard'])
		}, 300);
	}

	goToNotification(){
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
			this.router.navigate(['/notification'])
		}, 300);
	}
	goToAddScript(){
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
			//this.router.navigate(['/add-script'])
			this.router.navigate(['/dashboard-clients']);
		}, 300);
	}
	public hideDeleteData(showMobScip: any,showDeleteScripDesk: any) {
		this.showDeleteScripMob = !showMobScip;
		this.showDeleteScripDesk = !showDeleteScripDesk;
		this.getTableData(this.segmentTwo, true);
	}

	changeNumerAfterDecimal(exchtype: any, value: any){
		if(exchtype == 'U'){
		  return this.commonService.formatNumberComma(parseFloat(value).toFixed(4));
		}
		else if(isNaN(value)){
			return 0;
		}
		else{
		  return this.commonService.formatNumberComma(parseFloat(value).toFixed(2));
		}
	  }

	ionViewWillLeave() {
		const self = this;
		self.subscription.unsubscribe();
		this.subscription.unsubscribe();
		this.marketwatchData = [];
		this.getFeed = null;
		this.buttonData = null;
		this.buttonDataTwo = [];
		this.niftyBlockTabValue = null;
		this.niftyBlockTabValueDesktop = null;
		clearTimeout(this.getFeed);
		clearInterval(this.getFeed);
		clearInterval(self.getFeed);
		clearTimeout(this.clearHeaderDetails) 
		this.overlayVisible = false;
		clearTimeout(this.clearHeaderDetails);
	}
	ngOnDestroy() {
		this.overlayVisible = false;
		clearInterval(this.clearHeaderDetails);
		clearTimeout(this.getFeed);
		clearTimeout(this.clearHeaderDetails);
	}

}
