import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { ToasterService } from '../../../helpers/toaster.service';
import { CommonService } from '../../../helpers/common.service';
declare var cordova: any;


@Component({
	selector: 'app-guest-recently-viewed-client-list',
	providers: [ToasterService],
	templateUrl: './guest-recently-viewed-client-list.page.html',
	styleUrls: ['./guest-recently-viewed-client-list.page.scss'],
})
export class GuestRecentlyViewedClientListPage implements OnInit, OnDestroy {
	public dataLoad: boolean = true;
	public isClientDetailsWebVisible: boolean = false;
	public clientBlockTabValue: any;
	public clientType: any;
	public panSearchValue: any = null;
	public showAMCForm = false;
	public isDropDownVisible: boolean = false;
	public clientSearchValue: any = null;
	public isResponseReady: boolean = false;
	public isLedgerResponseReady: boolean = false;
	public md5: any;
	public isPanDropDownVisible: boolean = false;
	validPAN: any;
	clientList: any[] = [];
	marginTabDetails: any = [];
	LedgerTabDetails: any = [];
	tradeBookDetails: any = [];
	orderBookDetails: any = [];
	clientHoldingDetails: any = [];
	consHoldingDetails: any[] = [];
	consCommHoldingDetails: any[] = [];
	consTradeBookDetails: any[] = [];
	consOrderBookDetails: any[] = [];
	netPositionDetails: any[] = [];
	consHoldingPlData: any[] = [];
	recentViewList: any[] = [];
	selectedValue = null;
	ladgerId: any;
	passUserID: any;
	clientName: any;
	urlParameter: any;
	clientTradeSegID: any;
	selectedClientTab:any = "rmView";
	public tableData: any[] = [
		{ code: 'PC123456', name: 'Prashanjeet Chakravarty', value: '1.23 Cr', margin: '22.32 L' },
		{ code: 'PC123456', name: 'Prashanjeet Chakravarty', value: '1.23 Cr', margin: '22.32 L' },
		{ code: 'PC123456', name: 'Prashanjeet Chakravarty', value: '1.23 Cr', margin: '22.32 L' },
		{ code: 'PC123456', name: 'Prashanjeet Chakravarty', value: '1.23 Cr', margin: '22.32 L' },
	];
	clientDetails: any;
	searchValue: any;
	private subscription = new Subscription();
	public clientAuthObj = null;
	localStoreData: any[] = [];
	recentListUniqueCode: any[] = [];
	cliList: any = [];
	public overlayVisible = false;
	public displayHeader: any = [];
	public clearHeaderDetails: any = null;
	tokenValue:any;
	typeOfClient: any = 'iiflClients';
	changeRmView:number = 0;
	screenWidth:any;
	screenHeight:any;
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private toast: ToasterService,
		private commonService: CommonService) {}


	ngOnInit() {
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;
	}

	ngOnChanges(changes: SimpleChanges): void {
		
	}



	// go to client details for mobile
	goToClientDetail(data: any) {
		 
	}	

	goToDashboard() {
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
        this.router.navigate(['/guest/guest-dashboard']);
	}, 300);
    }

    goToNotification(){
	
	}

	ionViewWillEnter() {
		this.toast.displayToast('Markets/Trades are not available for Guest Login');
		if(this.selectedClientTab == 'portfolio'){
			this.changeRmView = this.changeRmView + 1;
		}
		
		if(localStorage.getItem('clientDetail') == 'true'){
			//this.isClientDetailsWebVisible = true;
		}
		else{
			this.isClientDetailsWebVisible = false;
		}
		this.overlayVisible = false;
		this.urlParameter = this.route.params.subscribe(params => {
			this.clientTradeSegID = params['id'] || 'clients';
		});
		// console.log(this.clientTradeSegID);
		if (this.clientTradeSegID == 'clients') {
			this.recentViewedList();
			this.clientBlockTabValue = 'clients';
			
			this.showAMCForm = false;
		}
		else if (this.clientTradeSegID == 'orderbook') {
			this.clientBlockTabValue = 'orderbook';
		}
		else if (this.clientTradeSegID == 'tradebook') {
			this.clientBlockTabValue = 'tradebook';
		}
		else if (this.clientTradeSegID == 'holdings') {
			this.clientTab('holdings')
			this.clientBlockTabValue = 'holdings';
		}
		else if (this.clientTradeSegID == 'fundPayinOut') {
			this.clientTab('fundPayinOut')
			this.clientBlockTabValue = 'fundPayinOut';
		}
		if(this.clientTradeSegID != 'clients'){
			this.clientSearchValue = '';
		}
		this.searchValue = '';
		this.panSearchValue = '';
		this.showAMCForm = false;
		this.recentViewedList();
		this.getCommHeaderDetail();
		
		if(localStorage.getItem('searchKey') == "true"){
			this.displayClientDetails(JSON.parse(localStorage.getItem('searchObj') || "{}"),'1');		// review
		}
	}
	// show client details for web
	showClientDetailsWeb(value: any) {
		this.displayClientDetails(value, '1')
		//this.isClientDetailsWebVisible = true;
	}
	clientTradeSegChanged(event: any) {
		this.showAMCForm = false;
		this.searchValue = '';
		this.panSearchValue = '';
		this.typeOfClient = 'iiflClients';
		// console.log(event);
		// this.clientTab(event)
		//this.router.navigateByUrl(this.router.url.replace(this.clientTradeSegID, event));
		// this.locationn.replaceState('/guest/guest-client-trades/' + event);
		this.toast.displayToast('Markets/Trades are not available for Guest Login');
	}
	//Function to get client details
	clientHoldingMarginList(clientID: any) {
		// this.dataLoad = false;
	
	}
	// select the client ID from dropdown
	displayClientDetails(data: any, value?: any) {
		//localStorage.removeItem('select_client');
		if(this.selectedClientTab != 'rmView'){
			this.clientTabChange('rmView');
			this.selectedClientTab = "rmView";
		}

		localStorage.setItem('select_client', JSON.stringify(data))
		
		//console.log(JSON.parse(localStorage.getItem('select_client')));
		this.clientSearchValue = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || "")['ClientCode'] : "{}";
		this.clientName = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || "")['ClientName'] : "{}";
		if (value != '1') {
			this.SaveDataToLocalStorage(data);
		}
	}

	getOfflineClients(){
		
	}

	/**
	 * To get offline client list.
	 * @param token 
	 */
	getDetails(token: any) {
		
	}

	//Function for Client OrderBook Tab
	OrderBookNow(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
		
		// })
	}
	//Function for Client Hoilding Tab
	clientHolding(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
			
		// })
	}
	//Function for Trade Book Tab
	tradeBook(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
			
		// })
	}

	//Function for Margin Tab
	marginV2(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
			
		// })
	}
	//Function to get recentViewed List
	recentViewedList() {

		this.localStoreData = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session') || '{}') : null;
		//  this.dataLoad = false;   

		var arrayData: any = []
		if (this.localStoreData == undefined || this.localStoreData == null) {
			arrayData = [];
			//this.dataLoad = true;
		}
		else {
			this.localStoreData.forEach((data, index) => {
				// console.log(data.ClientCode)
				arrayData.push(data.ClientCode);
			})

			// console.log(this.removeDuplicateValue(arrayData));
			this.recentListUniqueCode = Array.from(new Set(this.localStoreData.map(a => a.ClientCode)))
				.map(ClientCode => {
					return this.localStoreData.find(a => a.ClientCode === ClientCode)
				})
			// console.log(this.recentListUniqueCode);
			// uniqueObjCode.forEach(e => e.c = +e.b - +e.a);
			this.recentListUniqueCode.forEach(obj => obj.Holding = obj.Margin = 0);
			// console.log(this.recentListUniqueCode);

		
			setTimeout(() => {
				this.dataLoad = true;
			}, 1000);
		}


	}
	//Function to remove the duplicate data from array in locallost
	removeDuplicateValue(data: any) {
		return data.reduce((acc: any, curr: any) => acc.includes(curr) ? acc : [...acc, curr], [])
	}
	//Function for client Ledger Tab
	clientLedger(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
		
		// })
	}
	//Function for Conslidate Holding Tab
	consHoldingData(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
			
		// })
	}
	// save the client ID in localstorage after select client ID in dropdown
	SaveDataToLocalStorage(data: any) {
		var a = [];
		var b = []
		// Parse the serialized data back into an aray of objects
		a = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session') || "{}") : undefined || [];		// review
		// Push the new data (whether it be an object or anything else) onto the array
		a.push(data);
		// Alert the array value
		//  alert(a);  // Should be something like [Object array]
		// Re-serialize the array back into a string and store it in localStorage
		localStorage.setItem('session', JSON.stringify(a));
	}

	// function for net position in equity and commodity
	clientNetPosition(clientID: any, token: any) {
		this.dataLoad = false;
		// this.storage.get('sToken').then((token) => {
			
		// })
	}

	// function for holding P&L
	clientHoldingPL(clientID: any) {
		this.dataLoad = false;
		
	}

	//Function for Conslidate Commodity Holding Tab
	consCommodityHoldingData(clientID: any) {
		
	}
	//Function for Conslidate Trade Book Tab
	consTradeBookData(clientID: any) {
		
	}
	//Function for Conslidate Order Book Tab
	consOrderBookData(clientID: any) {
		// this.storage.get('sToken').then((token) => {
			
		// })
	}

	clientTab(value: any) {
	}

	// function for fetch the of date and to from today to last month
	// last one month dates
	DateDisplay(monthValue: any) {
		var d = new Date();
		if (monthValue == "previous") {
			d.setDate(d.getDate() - 30);
			return  
		}
		else if (monthValue == "current") {
			d.setDate(d.getDate());
			return  
		}
		return;
	}

	showDropDown() {
		this.isDropDownVisible = true;
		this.clientSearchValue = '';
		this.dataLoad = true;

		if(this.clientList == null){
			 
			
			console.log("reload API")
		}
	
		
	}

	hideDropDown() {
		setTimeout(() => {
			this.isDropDownVisible = false;
		}, 500);
	}

	showPanDropDown() {
		this.isPanDropDownVisible = true;
		this.panSearchValue = '';
		this.dataLoad = true;
		 
		if (this.cliList == null) {
			this.getOfflineClients();
		}
	}

	hidePanDropDown() {
		setTimeout(() => {
			this.isPanDropDownVisible = false;
		}, 500);
	}

	public getMappingRM(cookieValue: any) {
		this.dataLoad = false;
		 
	}

	//add new User Function
	async addUser() {
		this.commonService.becomePartnerModal();
	}

	public getClientAuthToken(addUser: any) {
		this.subscription = new Subscription();
		 
	}

	public encryptCode(clientCode: any){
		let clearText = clientCode;
			let encryptionKey = CryptoJS.enc.Utf8.parse('IIFV2AAAAP0223PD');
			let salt = CryptoJS.enc.Base64.parse('SXZhbiBNZWR2ZWRldg=='); 
			
			let iterations = 1000; 
			let keyAndIv = CryptoJS.PBKDF2(encryptionKey, salt, { keySize: 256/32 + 128/32, iterations: iterations, hasher: CryptoJS.algo.SHA1 }); 
			let hexKeyAndIv = CryptoJS.enc.Hex.stringify(keyAndIv);
			let key = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(0, 64));
			let iv = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(64, hexKeyAndIv.length));
			let encryptedStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf16LE.parse(clearText), key, {iv: iv}).toString();
			return encryptedStr;
	}

	private genCheckSum(blob: any) {
		blob = blob.trim();
		const newblob = CryptoJS.enc.Utf8.parse(blob);
		const hash = CryptoJS.MD5(newblob);
		const md5 = hash.toString(CryptoJS.enc.Hex)
		this.md5 = md5;
		this.md5 = this.md5.slice(0,this.md5.length / 2);
		return this.md5.toUpperCase();
	  }

	  OpenWindowWithPost(url: any, name: any, params: any) {
		 
							var mapForm = document.createElement("form");
                            mapForm.target = "_blank";
                            mapForm.method = "POST";
                            mapForm.action = url;
                            Object.keys(params).forEach(function (param) {
                                var mapInput = document.createElement("input");
                                mapInput.type = "hidden";
                                mapInput.name = param;
                                mapInput.setAttribute("value", params[param]);
                                mapForm.appendChild(mapInput);
                            });
                            document.body.appendChild(mapForm);
                            mapForm.submit();
	
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
	 

	}

	public titleClick(event: any) {
		event.stopPropagation();
		this.overlayVisible = !this.overlayVisible;
	}

	getCommHeaderDetail() {

		


		clearTimeout(this.clearHeaderDetails);
		// this.clearHeaderDetails = setTimeout(() => {
		// 	this.getCommHeaderDetail();
		// }, 2000);
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



	ionViewWillLeave() {
		clearTimeout(this.clearHeaderDetails)
		this.overlayVisible = false;
		localStorage.removeItem('searchKey')
	}

	ngOnDestroy() {
		clearTimeout(this.clearHeaderDetails);
		this.overlayVisible = false;
		localStorage.removeItem('searchKey')
	}

	/**
	 * On click of search btn in client tab.
	 */
	onSearchBtnClick(value: any) {
		this.searchValue = value.clientpan
		this.panSearchValue = value.clientpan;
		// let regex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
		// this.validPAN = regex.test(this.searchValue) == true ? true : false;
		// if (!this.validPAN) return;
		if (this.searchValue == '' || this.searchValue == undefined) {
			this.showAMCForm = false;
		} else {
			this.showAMCForm = true;
			 
		}
	}
	/**
	 * On iifl/offline tab select
	 * @param ev 
	 */
	onIIFLTabClick(ev: any) {
		this.searchValue = '';
		this.panSearchValue = '';
		 
		if (ev === 'iiflClients') {
			localStorage.setItem('typeOC','IIFL_CLIENTS_');
			this.showAMCForm = false;
		} else if (ev === 'offlineClients' && this.searchValue) {
			localStorage.setItem('typeOC','OFFLINE_CLIENTS_');
			this.showAMCForm = true;
		} else if (ev === 'offlineClients') {
			localStorage.setItem('typeOC','OFFLINE_CLIENTS_');
		}
	}

	clientTabChange(event: any){
		this.selectedClientTab = event;
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