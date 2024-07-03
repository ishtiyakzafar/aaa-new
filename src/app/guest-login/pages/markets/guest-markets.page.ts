
import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform, NavController, ModalController, IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { EditWatchlistDesktopComponent } from '../../../components/edit-watchlist-desktop/edit-watchlist-desktop.component';
import { EditWatchlistMobileComponent } from '../../../components/edit-watchlist-mobile/edit-watchlist-mobile.component';
import { IndicesDetailsComponent } from '../../../components/indices-details/indices-details.component';
import { ToasterService } from '../../../helpers/toaster.service';
import { CommonService } from '../../../helpers/common.service';

@Component({
	selector: 'app-guest-markets',
	providers: [ToasterService],
	templateUrl: 'guest-markets.page.html',
	styleUrls: ['guest-markets.page.scss']
})
export class GuestMarketsPage {
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
 		public navCtrl: NavController,
		private router: Router,
 		private route: ActivatedRoute,
		private locationn: Location,
		private commonService: CommonService
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

		this.mobileWatchlistBlockTabValue = 'watchlist';
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
		if(this.router.url == '/guest/guest-markets'){
			this.selectLink = 'market';
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

		 
		if(this.router.url == '/guest/guest-markets'){
			this.selectLink = 'market';
		}
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
 
		this.http.get('./assets/datafile.json').subscribe((res: any) => {
			this.lowHighList = res['lowhighdata'];
		})

		this.http.get('./assets/datafile.json').subscribe((res: any) => {
			this.dealsList = res['deals'];
		})
	}

	getButtonsTwo(id: any) {
		this.subscription = new Subscription();
		try {
			const params = id;
		 
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
			niftySegmentArray.forEach((element: any) => {
				if (element['active']) {
					this.niftyBlockTabValue = element['Value'];
					this.segmentTwo = element['Value'];
					// this.segmentTwo = 'NIFTY50';
				} 
			});
		}
		if (val === 'snapshot') {
			this.snapshotBlockTabValue= "gainers";
			const exchType = 'N';
			this.getGainersLosersData(exchType);
			const exchType2 = 'B';
			this.getGainersLosersData(exchType2);
		}
		this.segmentOne = val;
		
		if(val == 'indices'){
			this.indicesSegmentValue = 'indices';
		}
	}


	segmentChanged(val?: any, arr?: any, niftySegmentArray?: any) {
		// console.log(val);
		this.router.navigateByUrl(this.router.url.replace(this.segmentID, val));
		//	localStorage.setItem('saveChangeTab', val)
	this.toast.displayToast('Markets/Trades are not available for Guest Login');
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
 	// set as default tab from pop up
	public setAsDefault(selectTab: any) {
		this.subscription = new Subscription();
		 
	}

	public renameWatchList(watchName: any, watchNameValue: any) {
		this.subscription = new Subscription();
		 
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

	public addToRecent(exch: any, exchType: any, code: any, fName: any, shortName: any) {
		 
	}


	public getGainersLosersData(exchType: any) {
		//this.gainerDataLoad = false;
		clearTimeout(this.getFeed);
		this.subscription = new Subscription();

		const params = {
			Exchange: exchType,
			ClientLoginType: 0
		}
		 
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
		 
		clearTimeout(this.clearHeaderDetails);
		this.clearHeaderDetails = setTimeout(() => {
			this.getCommHeaderDetail();
		}, 2000);
	}

	goToDashboard(){
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
			this.router.navigate(['/guest/guest-dashboard'])
		}, 300);
	}

	 
	 
	public hideDeleteData(showMobScip: any,showDeleteScripDesk: any) {
		this.showDeleteScripMob = !showMobScip;
		this.showDeleteScripDesk = !showDeleteScripDesk;
		this.getTableData(this.segmentTwo, true);
	}

	changeNumerAfterDecimal(exchtype: any, value: any){
	 return;
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

	/**
	 * @param redirectFor accepts param to redirect for new user 
	 */
	public redirectTo(redirectFor: any) {
		if (redirectFor === 'register') {
			this.commonService.setClevertapEvent('Guest_Onboarding_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
			//this.commonService.triggerAppsflyerLogEvent('Guest_Onboarding_Clicked', { 'Mobile Number': localStorage.getItem("GuestMobileNumber") });
			window.open('https://epartner.iifl.com/Referral');

		}
	}
}
