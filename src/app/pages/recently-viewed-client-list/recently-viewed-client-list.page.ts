import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientTradesService } from './client-trades.service';
import { CommonService } from '../../helpers/common.service';
import { Platform, ModalController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
// import { investObj, environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { LoginService } from '../login/login.service';
import * as CryptoJS from 'crypto-js';
import { environment, investObj } from '../../../environments/environment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { IndicesDetailsComponent } from '../../components/indices-details/indices-details.component';
import { MarketService } from '../markets/markets.service';
import { AddUserComponent } from '../../components/add-user/add-user.component';
import { InvestService } from '../invest/invest.service';
declare var cordova: any;


@Component({
	selector: 'app-recently-viewed-client-list',
	providers: [ClientTradesService, CommonService, LoginService,MarketService, InvestService],
	templateUrl: './recently-viewed-client-list.page.html',
	styleUrls: ['./recently-viewed-client-list.page.scss'],
})
export class RecentlyViewedClientListPage implements OnInit, OnDestroy {
	public dataLoad: boolean = false;
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
	constructor(private router: Router, private clientService: ClientTradesService, private storage: StorageServiceAAA, private commonservice: CommonService, private platform: Platform, public modalController: ModalController,
		 private investService: InvestService,
		 private route: ActivatedRoute,
		private marService: MarketService,
		private locationn: Location, public serviceFile: LoginService) { }


	ngOnInit() {
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;
		this.commonservice.analyticEvent('Home_Clients_Trades', 'Clients Trades');
		this.getOfflineClients();
		localStorage.setItem('typeOC','IIFL_CLIENTS_');

		this.storage.get('userType').then(type => {
			if (type == 'RM' || type == 'FAN') {
				this.storage.get('mappingDetails').then((details) => {
				this.clientType = type
				this.clientList = details;
				});
			}
			else{
				this.storage.get('subBrokermapping').then((details) => {
					this.clientType = type
					this.clientList = details;
				});
			}	
			
		})
		this.storage.get('userID').then((userID) => {
			this.passUserID = userID
		})

	}



	// go to client details for mobile
	goToClientDetail(data: any) {
		this.commonservice.setClevertapEvent('Client&Trades_ClientDetails');
		if(this.clientType == 'RM' || this.clientType == 'FAN' ){
			this.router.navigate(['/client-details', data.ClientCode, data.ClientName.split(' ').join('-')]);
		}
		else{
			this.router.navigate(['/client-details', data.ClientCode, '-']);
		}
	}	

	goToDashboard() {
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
        this.router.navigate(['/dashboard']);
	}, 300);
    }

    goToNotification(){
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
			this.router.navigate(['/notification']);
		}, 300);
	}

	ionViewWillEnter() {
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
			if(!this.platform.is('desktop') && this.typeOfClient != 'offlineClients'){
				this.typeOfClient = 'iiflClients';	
			}
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
		this.locationn.replaceState('/client-trades/' + event);


	}
	//Function to get client details
	clientHoldingMarginList(clientID: any) {
		// this.dataLoad = false;
		this.storage.get('userID').then((token) => {
			var holdingMarginObj =
			{
				"UserCode": token,
				"ProductType": "",
				"ClientID": [clientID],
				"DetailSummaryView": 1
			}

			this.clientService.getClientHoldingMargin(holdingMarginObj).subscribe((res: any) => {

				//this.clientDetails = res;
				if (res['head']['status'] === '0') {
					this.clientDetails = res['body']['list_of_getclientholdingandmargin'];
					this.isResponseReady = true;
					//   setTimeout(() => {
					//     this.dataLoad = true;
					//   }, 500);
				}
			})
		})
	}
	// select the client ID from dropdown
	displayClientDetails(data: any, value?: any) {
		//localStorage.removeItem('select_client');
		if(this.selectedClientTab != 'rmView'){
			this.clientTabChange('rmView');
			this.selectedClientTab = "rmView";
		}

		localStorage.setItem('select_client', JSON.stringify(data))
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
		//console.log(JSON.parse(localStorage.getItem('select_client')));
		this.clientSearchValue = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || "")['ClientCode'] : "{}";
		this.clientName = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || "")['ClientName'] : "{}";
		if (value != '1') {
			this.SaveDataToLocalStorage(data);
		}

		if (this.platform.is('desktop') || this.screenWidth > 1360) {
			this.clientHoldingMarginList(this.clientSearchValue);

			//this.SaveDataToLocalStorage(this.clientSearchValue); 
			// call all the functions for tab in web View
			setTimeout(() => {
				this.storage.get('JwtToken').then(token => {
					this.OrderBookNow(this.clientSearchValue, token);
					this.marginV2(this.clientSearchValue, token);
					this.tradeBook(this.clientSearchValue, token);
					this.clientHolding(this.clientSearchValue, token);
					this.clientNetPosition(this.clientSearchValue, token);
				})
				this.clientLedger(this.clientSearchValue, this.tokenValue);
			}, 200);
		
			//this.clientHoldingPL(this.clientSearchValue);
			this.commonservice.analyticEvent('CnT_Client_Search', 'Client Search');
			
			this.commonservice.setClevertapEvent('Client&Trades_ClientSearch');

			this.isClientDetailsWebVisible = false;
			setTimeout(() => {
				this.isClientDetailsWebVisible = true;
				this.commonservice.setClevertapEvent('Client&Trades_ClientDetails');
			}, 100);
		}
		else {
			this.goToClientDetail(data);
		}

	}

	getOfflineClients(){
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getDetails(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getDetails(token);
				})
			}
		})
	}

	/**
	 * To get offline client list.
	 * @param token 
	 */
	getDetails(token: any) {
		this.clientService.getOfflineMfClients(token, { 'Partnercode': localStorage.getItem('userId1') })
			.subscribe((res: any) => {
				if (res && res['Body']) {
					this.cliList = res['Body'];
					this.storage.set('offlineClientList', res['Body']);
				} else {
					this.cliList = [];
				}
				this.dataLoad = true;
			})
	}

	//Function for Client OrderBook Tab
	OrderBookNow(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
			this.clientService.getOrderBookNow(token, clientID).subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.orderBookDetails = res['body']['OrderBookDetail'];
				}
			})
		// })
	}
	//Function for Client Hoilding Tab
	clientHolding(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
			this.clientService.getclientHolding(token, clientID).subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.clientHoldingDetails = res['body']['Data'];
				}
			})
		// })
	}
	//Function for Trade Book Tab
	tradeBook(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
			this.clientService.getTradeBook(token, clientID).subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.tradeBookDetails = res['body']['tradelist'];
				}
			})
		// })
	}

	//Function for Margin Tab
	marginV2(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
			this.clientService.getMarginV2(token, clientID).subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.marginTabDetails = res['body'];
				}
			})
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

			this.storage.get('userID').then((token) => {
				var holdingMarginObj =
				{
					"UserCode": token,
					"ProductType": "",
					"ClientID": arrayData,
					"DetailSummaryView": 1
				}

				this.clientService.getClientHoldingMargin(holdingMarginObj).subscribe((res: any) => {
					if (res['head']['status'] === '0') {
						setTimeout(() => {
							this.recentViewList = res['body']['list_of_getclientholdingandmargin'];
							this.recentListUniqueCode.forEach((data, index) => {
								this.recentViewList.forEach((element, index) => {
									if (data.ClientCode == element.ClientID) {
										data.Holding = element.EquityHoldingValue;
										data.Margin = element.AvailableEquityMargin;
									}
								})

							})
							// console.log(this.recentListUniqueCode);
						}, 500);
					}
				})
			})
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
			this.clientService.getclientLedger1(token, clientID, this.DateDisplay('previous'), this.DateDisplay('current'))
			.subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.ladgerId = clientID
					this.LedgerTabDetails = res['body'];
					this.isLedgerResponseReady = true;
				}
			})
		// })
	}
	//Function for Conslidate Holding Tab
	consHoldingData(clientID: any, token: any) {
		// this.storage.get('sToken').then((token) => {
			this.clientService.getconsolidateHolding(token, clientID).subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.consHoldingDetails = res['body'];
				}
			})
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
			let eqNetPosition = this.clientService.getNetPositioneq(token, clientID);
			let CommNetPosition = this.clientService.getNetPositioncomm(token, clientID);
			forkJoin([eqNetPosition, CommNetPosition]).subscribe((response: any) => {
				this.netPositionDetails = response[0]['body']['TradeData'].concat(response[1]['body']['TradeData']);
				setTimeout(() => {
					this.dataLoad = true;
				}, 500);
			})
		// })
	}

	// function for holding P&L
	clientHoldingPL(clientID: any) {
		this.dataLoad = false;
		this.storage.get('sToken').then((token) => {
			this.clientService.getHoldingPl(token, clientID).subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.consHoldingPlData = res['body']['Lst_HoldingPL'];
					//   console.log(this.consHoldingPlData);
					setTimeout(() => {
						this.dataLoad = true;
					}, 500);

				}
			})
		})
	}

	//Function for Conslidate Commodity Holding Tab
	consCommodityHoldingData(clientID: any) {
		this.storage.get('sToken').then((token) => {
			this.clientService.getconsolidateCommodityHolding(token, clientID).subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.consCommHoldingDetails = res['body'];
				}
			})
		})
	}
	//Function for Conslidate Trade Book Tab
	consTradeBookData(clientID: any) {
		this.storage.get('sToken').then((token) => {
			this.clientService.getConsTradeBook(token, clientID).subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.consTradeBookDetails = res['body'];
				}
			})
		})
	}
	//Function for Conslidate Order Book Tab
	consOrderBookData(clientID: any) {
		// this.storage.get('sToken').then((token) => {
			this.clientService.getConsOrderBook(this.passUserID).subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.consOrderBookDetails = res['body']['OrderBookDetailAAA'];
				}
			})
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
			return this.commonservice.formatDate(d)
		}
		else if (monthValue == "current") {
			d.setDate(d.getDate());
			return this.commonservice.formatDate(d)
		}
		return;
	}

	showDropDown() {
		this.isDropDownVisible = true;
		this.clientSearchValue = '';
		this.dataLoad = true;

		if(this.clientList == null){
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('sToken').then(token => {
						this.getMappingRM(token)
						
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.getMappingRM(token)
					})
				}
			})	
			
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
		this.storage.get('offlineClientList').then((list) => {
			this.cliList = list;
		})
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
		this.storage.get('userID').then((userId) => {
			this.subscription = new Subscription();
			const params = {
				AdminCode: userId
			}
			this.subscription.add(
				this.serviceFile
					.getRMMapping(params, userId, cookieValue)
					.subscribe((response: any) => {
						this.dataLoad = true;
						if (response['body'].status == 0) {
							this.clientList = response['body'].details;
							this.storage.set('mappingDetails', response['body'].details);
						}
						else{
							this.clientList = [];
						}
					})
			)
		})
	}

	//add new User Function
	async addUser() {
		const modal = await this.modalController.create({
			component: AddUserComponent,
			cssClass: 'add-user'
		});

		modal.onDidDismiss().then((data) => {
			
			if (data['data']) {
				const type = data['data']['type'];
				this.getClientAuthToken(type);
			}
		})
		return await modal.present();
	}

	public getClientAuthToken(addUser: any) {
		this.subscription = new Subscription();
		this.storage.get('userID').then((ID) => {
			var todayValue: any;
			var today = new Date();
			let dd = String(today.getUTCDate());
			let ddate = today.getUTCDate();
			let mm = String(today.getUTCMonth() + 1);
			let month = today.getUTCMonth() + 1;
			let yyyy = today.getUTCFullYear().toString().substring(2, 4);
			if (ddate < 10) {
				dd = '0' + dd;
			}
			if (month < 10) {
				mm = '0' + mm;
			}
        	todayValue = dd.toString() + mm.toString() + yyyy;
			let IP = "10.150.10.1";
			let appSource = "AAA";
			let parameter = this.encryptCode(ID).trim() + IP.trim() + appSource.trim() + todayValue;
			this.storage.get('userType').then((type) => {
				let userValue = null;
				if (type === 'RM' || type === 'FAN') {
					userValue = type;
				} else if (type === 'SUB BROKER') {
					userValue = 'SubBroker';
				}
				const obj = {
					"head": {
						"checkSum": this.genCheckSum(environment['checkSumKEY'] + parameter),
						"appSource": "AAA"
					},
					"body": {
						"ip": "10.150.10.1",
    					"LoginId": this.encryptCode(ID)
					}
				}
				this.subscription.add(

					this.investService
						.getUserAuthe(obj)
						.subscribe((response: any) => {
							if (response && response['data'] && response['data'].length) {
								let paramStr = this.encryptCode(ID).trim() + appSource.trim() + todayValue;
											let param = {
												"LoginId": this.encryptCode(ID),
												"Token": response['data'],
												"AppSource": appSource,
												"Checksum": this.genCheckSum(environment['checkSumKEY'] + paramStr),
											}
										if (addUser === 'addClient') {
											this.commonservice.setClevertapEvent('OpenAccount_NonIndividualClient');
											this.OpenWindowWithPost(investObj['addUser']['addClientURL'], '_blank', param);
										} else if (addUser === 'ICA') {
											this.commonservice.setClevertapEvent('OpenAccount_IndividualClient');
											this.OpenWindowWithPost(investObj['addUser']['addICA'], '_blank', param);
										} else if (addUser === 'advisor') {
											this.commonservice.setClevertapEvent('OpenAccount_RegisterAdvisor');
											this.OpenWindowWithPost(investObj['addUser']['addSubbrokerURL'], '_blank', param);
										} else if (addUser === 'NRI') {
											this.commonservice.setClevertapEvent('OpenAccount_NRIClient');
											const url = investObj['addUser']['addNRI'];
											window.open(url);
										} else {
											return;
										}
			}})
								
							
						)
				
			})
		})
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
		if (this.commonservice.isApp()) {
			var pageContent = '<html><head></head><body><form id="loginForm1" action="'+ url +'" method="post">' +
				'<input type="hidden" name="LoginId" value="' + params.LoginId + '">' +
				'<input type="hidden" name="Token" value="' + params.Token + '">' +
				'<input type="hidden" name="AppSource" value="' + params.AppSource + '">' +
				'<input type="hidden" name="Checksum" value="' + params.Checksum + '">' +
				'</form> <script type="text/javascript">document.getElementById("loginForm1").submit();</script></body></html>';
			var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
			var ref = cordova.InAppBrowser.open(
				pageContentUrl,
				"_blank",
				"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
			);
		}
		else{
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
	}

	public encryptTest(clientCode: any){
		let clearText = clientCode;
			let encryptionKey = CryptoJS.enc.Utf8.parse('IIFV2SPBNI11888');
			let salt = CryptoJS.enc.Base64.parse('SXZhbiBNZWR2ZWRldg=='); 
			let iterations = 1000; 
			let keyAndIv = CryptoJS.PBKDF2(encryptionKey, salt, { keySize: 256/32 + 128/32, iterations: iterations, hasher: CryptoJS.algo.SHA1 }); 
			let hexKeyAndIv = CryptoJS.enc.Hex.stringify(keyAndIv);
			let key = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(0, 64));
			let iv = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(64, hexKeyAndIv.length));
			let encryptedStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf16LE.parse(clearText), key, {iv: iv}).toString();
			return encryptedStr;
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
			componentProps: { "IndParams": objPass },
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
			if (!this.platform.is('desktop')) { 				
				localStorage.setItem('cliData', JSON.stringify({'type':this.typeOfClient,'search':this.searchValue}));
				this.router.navigate(['/amc-report']);
			}
		}
	}
	/**
	 * On iifl/offline tab select
	 * @param ev 
	 */
	onIIFLTabClick(ev: any) {
		this.searchValue = '';
		this.panSearchValue = '';
		if(!this.platform.is('desktop')){
			this.clientSearchValue = ''
		}
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


}