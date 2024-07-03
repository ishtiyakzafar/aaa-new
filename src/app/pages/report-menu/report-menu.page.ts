import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../helpers/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NewLoginService } from '../new-login/new-login.service';
import moment from 'moment';
import { DashBoardService } from '../dashboard/dashboard.service';
import { URLS } from '../../../config/api.config';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../helpers/authentication.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { AppLoaderService } from '../../app-loader/app-loader.service';

@Component({
  selector: 'app-report-menu',
  providers: [NewLoginService, DashBoardService],
  templateUrl: './report-menu.page.html',
  styleUrls: ['./report-menu.page.scss'],
})
export class ReportMenuComponent implements OnInit,OnDestroy  {
  public backOfficeLogout = URLS.backofficeLogout;
  private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
  public subscription: any;
   tabs: any[] = [
		{
      icon: 'summaries-icon.svg',
		  title: 'Summaries',
      	  isMobOpen:false,
		  innerItems: [
			{
        isOpen:true,
				innerOption:[
				
					{ option: 'Risk Report', routeTo: '/view-reports', value: 'riskReport' , newWindow: false },
					{ option: 'Real Time Margin Shortfall', routeTo: '/view-reports', value: 'realTimeMargin', newWindow: false },
					{ option: 'Scrip Summary', routeTo: '/ScriptwiseSummary', newWindow: false },
					{ option: 'Fan Payout Summary', routeTo: '/view-reports', value: 'FanPayoutSummary' , newWindow: false },
					{ option: 'Foliowise Client Details', routeTo: '/folio-wise-details',  newWindow: false },
					{ option: 'DP Scrip Payout', routeTo: '/view-reports', value: 'DPScripPayout' , newWindow: false },
					{ option: 'Commodity Client Summary', routeTo: '/view-reports', value: 'CommodityClientSummary' , newWindow: false },
					{ option: 'Deposit Ledger', routeTo: '/view-reports', value: 'DepositLedger' , newWindow: false },
					{ option: 'Fan Brokerage Ledger', routeTo: '/view-reports', value: 'FanBrokerageLedger' , newWindow: false },	
					{ option: 'Commodity Client Scrip Summary', routeTo: '/commodity-client-scrip-summary' , newWindow: false },
					{ option: 'Outstanding Position', routeTo: '/view-reports', value: 'OutstandingReport' , newWindow: false },	
					{ option: 'Consolidated Trade Listing', routeTo: '/view-reports', value: 'consolidatedTradeList' , newWindow: false },
					{ option: 'Freeze Details', routeTo: '/view-reports', value: 'FreezeDetails' , newWindow: false },
					{ option: 'VAS Detailed Report', routeTo: '/VasDetailedReport', newWindow: false },
					{ option: 'DP Modification Details', routeTo: '/view-reports', value: 'DpModificationDetails' , newWindow: false },
					{ option: 'Account Closure Status', routeTo: '/view-reports', value: 'AccountClosureStatus' , newWindow: false },
					{ option: 'Detailed Clients Report', value: 'DetailedClientsReport', downloadFlag: true, newWindow: false },
					{ option: 'Settlement Payout Report', routeTo: '/settlement-payout-report', newWindow: false },
					{ option: 'DRF Status', routeTo: '/view-reports', value: 'DematRequestStatus' , newWindow: false }
				]
			}
		  ]
		},
		{
      icon: 'individual-client-icon.svg',
			title: 'Individual Clients',
      isMobOpen:false,
			innerItems: [
				{
					innerTitle: 'Trading',
          isOpen:true,
					innerOption:[
						{ option: 'Realized PnL', routeTo: '/share-reports', newWindow: false, value: 'realised' },
						{ option: 'Unrealized PnL', routeTo: '/share-reports', newWindow: false, value: 'unrealised'},
						{ option: 'BOD Holding', routeTo: '/view-reports', newWindow: false, value: 'bodHolding' },
						{ option: 'DP Holding', routeTo: '/share-reports', newWindow: false, value: 'dpholding' }
					]
				},
				
				{
					innerTitle: 'Daily Reports',
          isOpen:false,
					innerOption:[
						{ option: 'DP Transaction', routeTo: '/share-reports', newWindow: false, value: 'dpTransaction' },
						{ option: 'Trade Listing', routeTo: '/share-reports', newWindow: false, value: 'tradeListing' },
						{ option: 'STT Certificate', routeTo: '/share-reports', newWindow: false, value: 'sttCertificate' },
						{ option: 'Daily Bills', routeTo: '/share-reports', newWindow: false, value: 'dailyBills' },
						{ option: 'Digital Contract Notes', routeTo: '/share-reports', newWindow: false, value: 'digitalContract' },
					]
				},
				{
					innerTitle: 'MF',
          isOpen:false,
					innerOption:[
						{ option: 'MF Capital Gain', routeTo: '/share-reports', newWindow: false, value: 'mfCapital' },
						{ option: 'MF Account Statement', routeTo: '/share-reports', newWindow: false, value: 'mfAccount' },
						{ option: 'AMC Statement', routeTo: '/share-reports', newWindow: false, value: 'amcStmt' },
					]
				},
				{
					innerTitle: 'Others',
          isOpen:false,
					innerOption:[
						{option: 'Commodity Realtime', routeTo: '/share-reports', newWindow: false ,value:'crtr'},
						{option: 'Simplified Ledger', routeTo: '/share-reports', newWindow: false ,value:'simplified'},
						// {option: 'Client 360', routeTo: '/share-reports', newWindow: false ,value:'360Client'},
						{option: 'Interest on Delayed Payment', routeTo: '/share-reports', newWindow: false ,value:'interestOnDelayedPayment'},	
					]
				}
				
       ]
		},
		{
			icon: 'other-icon.svg',
      title: 'Others',
      isMobOpen:false,
			innerItems: [{
        isOpen:true,
				innerOption:[
				{option: 'Scrip Master', routeTo: '/view-reports', value: 'ScripMaster' , newWindow: false },
				{option: 'Shares Deposit', routeTo: '/view-reports',  value: 'SharesDeposit' , newWindow: false },
				{option: 'GST Invoice', routeTo: '/view-reports',  value: 'GSTInvoice' , newWindow: false },
				{option: 'Pay Details', routeTo: '/pay-details', newWindow: false },
				]
			}
			]
		}
		// Add more tabs as needed
	  ];
  tabsFanChildData: any[] = [
		{
		  icon: 'summaries-icon.svg',
		  title: 'Summaries',
      	  isMobOpen:false,
			innerItems: [
			{
				isOpen:true,
				innerOption:[
				
					{ option: 'Risk Report', routeTo: '/view-reports', value: 'riskReport' , newWindow: false },
					{ option: 'Real Time Margin Shortfall', routeTo: '/view-reports', value: 'realTimeMargin', newWindow: false },
					{ option: 'Commodity Client Summary', routeTo: '/view-reports', value: 'CommodityClientSummary' , newWindow: false },
					{ option: 'Consolidated Trade Listing', routeTo: '/view-reports', value: 'consolidatedTradeList' , newWindow: false },
					{ option: 'DP Scrip Payout', routeTo: '/view-reports', value: 'DPScripPayout' , newWindow: false },
					{ option: 'Scrip Summary', routeTo: '/ScriptwiseSummary',  newWindow: false },
					{ option: 'Foliowise Client Details', routeTo: '/folio-wise-details',  newWindow: false },
					{ option: 'Commodity Client Scrip Summary', routeTo: '/commodity-client-scrip-summary' , newWindow: false },
					{ option: 'Outstanding Report', routeTo: '/view-reports', value: 'OutstandingReport' , newWindow: false },
					{ option: 'Freeze Details', routeTo: '/view-reports', value: 'FreezeDetails' , newWindow: false },	
					{ option: 'VAS Detailed Report', routeTo: '/VasDetailedReport',  newWindow: false },
					{ option: 'DP Modification Details', routeTo: '/view-reports', value: 'DpModificationDetails' , newWindow: false },
					{ option: 'Detailed Clients Report', value: 'DetailedClientsReport', downloadFlag: true, newWindow: false }	
		
				]
			}
			]
		},
		{
			icon: 'individual-client-icon.svg',
			title: 'Individual Clients',
     		isMobOpen:false,
			innerItems: [
				{
					innerTitle: 'Trading',
					isOpen:true,
					innerOption:[
						{ option: 'Realized PnL', routeTo: '/share-reports', newWindow: false, value: 'realised' },
						{ option: 'Unrealized PnL', routeTo: '/share-reports', newWindow: false, value: 'unrealised'},
						{ option: 'BOD Holding', routeTo: '/view-reports', newWindow: false, value: 'bodHolding' },
					]
				},
				
				{
					innerTitle: 'Daily Reports',
					isOpen:false,
					innerOption:[
						{ option: 'DP Transaction', routeTo: '/share-reports', newWindow: false, value: 'dpTransaction' },
				{ option: 'Trade Listing', routeTo: '/share-reports', newWindow: false, value: 'tradeListing' },
				{ option: 'STT Certificate', routeTo: '/share-reports', newWindow: false, value: 'sttCertificate' },
				{ option: 'Daily Bills', routeTo: '/share-reports', newWindow: false, value: 'dailyBills' },
				{ option: 'Digital Contract Notes', routeTo: '/share-reports', newWindow: false, value: 'digitalContract' },
					]
				},
				{
					innerTitle: 'MF',
					isOpen:false,
					innerOption:[
						{ option: 'MF Capital Gain', routeTo: '/share-reports', newWindow: false, value: 'mfCapital' },
						{ option: 'MF Account Statement', routeTo: '/share-reports', newWindow: false, value: 'mfAccount' },
						{ option: 'AMC Statement', routeTo: '/share-reports', newWindow: false, value: 'amcStmt' },
					]
				},
				{
					innerTitle: 'Others',
					isOpen:false,
					innerOption:[
						{option: 'Commodity Realtime', routeTo: '/share-reports', newWindow: false ,value:'crtr'},
				{option: 'Simplified Ledger', routeTo: '/share-reports', newWindow: false ,value:'simplified'},
				// {option: 'Client 360', routeTo: '/share-reports', newWindow: false ,value:'360Client'},
				{option: 'Interest on Delayed Payment', routeTo: '/share-reports', newWindow: false ,value:'interestOnDelayedPayment'},
						
					]
				}
				
		]
		},
		{
			icon: 'other-icon.svg',
			title: 'Others',
			isMobOpen:false,
			innerItems: [{
				isOpen:true,
				innerOption:[
				{option: 'Scrip Master', routeTo: '/view-reports', value: 'ScripMaster' , newWindow: false },
				// {option: 'Pay Details', routeTo: '/pay-details', newWindow: false },
				]
			}
			]
		}
		// Add more tabs as needed
		];  	  
  constructor(private commonService: CommonService,  
    private http: HttpClient, 
    private authService: AuthenticationService,
    private cookieService: CookieService,
    private storage: StorageServiceAAA, 
	private route: ActivatedRoute,
    private toast: ToasterService,
    private router: Router,
	public serviceFile: NewLoginService,
	public dashBoardService: DashBoardService,
	private _appLoaderService: AppLoaderService,
    public alertController: AlertController) { }

  ngOnInit() {
	this.storage.get('isFanChild').then(isChild => {
		if(isChild == 'true'){
			this.tabs = [];
			this.tabs = this.tabsFanChildData;
			
		}
	});

  }
  
  ionViewWillEnter(){
	this.storage.get('isFanChild').then(isChild => {
		if(isChild == 'true'){
			this.tabs = [];
			this.tabs = this.tabsFanChildData;
			
		}
	});
  }
 
  
  goToAddScript() {
    this.router.navigate(['/add-script'])
  }

  goToNotification() {
    this.router.navigate(['/notification'])
  }

  goToFamilyPortfolio() {
	this.router.navigate(['/client-portfolio']);
}
  goToDashboard() {
    this.router.navigate(['/dashboard']);
}

  toggleTabItem(clickedTab: any) {
    // Close all inner items except the clicked one

    this.tabs.forEach((tab) => {

        if (tab !== clickedTab) {
          tab.isMobOpen = false;
        }

    });
   
    // Toggle the clicked inner item
    clickedTab.isMobOpen = !clickedTab.isMobOpen;
  }


  toggleInnerItem(innerItem: any) {
    innerItem.isOpen = true;

    // Close other innerItems within the same tab
    const tab = this.tabs.find(t => t.innerItems.includes(innerItem));
    if (tab) {
      tab.innerItems.forEach((item: any) => {
        if (item !== innerItem) {
          item.isOpen = false;
        }
      });
    }
  }
  
  redirectReportsItem(item: any) {
	
	if(item.downloadFlag){

		if(item.value.toString().toLowerCase() == "detailedclientsreport"){
			this._appLoaderService.showLoader();
			this.commonService.setClevertapEvent('WebwireReport_Download', { 'PartnerCode': localStorage.getItem('userId1') });
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.downloadReport({ReportName: item.value.toString(), Token: token});
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.downloadReport({ReportName: item.value.toString(), Token: token});
					})
				}
			})
		}

	} else {
		// Define the query parameters you want to pass
	
		const queryParams = { report: item.value };
	  
		// Navigate to the desired route with the query parameters
		this.router.navigate([item.routeTo], { queryParams });
	
	  }
	}

  async confirmLogout() {
		const alert = await this.alertController.create({
			cssClass: 'confirm-logout-alert',
			// header: 'Alert',
			// subHeader: 'Subtitle',
			message: 'Are you sure you want to logout?',
			// buttons: ['No', 'Yes'],
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Yes',
					handler: () => {
						this.commonService.setClevertapEvent('Logout');
						const userType = localStorage.getItem('userType');
						let obj = {
							'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
							'appID': localStorage.getItem('appID') || ''
						}
						if (userType === 'RM' || userType === 'FAN') {
							this.storage.get('bToken').then((bToken: any) => {
								const backOffice = {
									'token': bToken
								}
								const boData = {
									"EmployeeId": "",
									"Password": "",
									"AppName": "",
									"MachinId": "",
									"MacAdd": ""
								};
								this.http.post<any>(`${this.backOfficeLogout.url}`, boData, { headers: new HttpHeaders(Object.assign(bToken !== null ? backOffice : {}, obj)) }).subscribe(res => {
									const userType = localStorage.getItem('userType');
									if (userType === 'RM' || userType === 'FAN') {
										this.storage.get('userID').then((ID) => {
											this.storage.get('sToken').then((tokenValue) => {
												const obj = {
													"head": {
														"requestCode": "IIFLMarRQLO01",
														"key": URLS.swarajLogout.key,
														"appVer": "1.0.18.0",
														"appName": "AAA",
														"osName": "Android",
														"LoginId": ID,
														"userType": localStorage.getItem('userType')
													},
													"body": {
														"MachineID": "3303a03ea0e97f0d",
														"ServerIP": "155.223.53.156",
														"ClientIP": "192.168.84.196"
													}
												}
												this.authService.logout(obj, tokenValue).subscribe((response) => {
													if (response['body']['status'] === 0) {
														this.storage.clear();
														window.localStorage.clear();
														indexedDB.deleteDatabase('_ionicstorage');
														// this.authService.deleteAllCookies();
														if (window.location.hostname == 'localhost') {
															this.cookieService.deleteAll();
														} else {
															this.cookieService.deleteAll('/', '.indiainfoline.com');
														}
														this.toast.displayToast('Logout successful');
														// this.loading = false;
														this.router.navigate(['/login']);
														// this.navCtrl.navigateRoot('/login');
													}
												})
											})
										})
									} else {
										this.toast.displayToast('Logout successful');
										this.commonService.analyticEvent('Logout', 'Logout');
										// document.cookie = "WZRK_S_" + environment.clevertap_Key + "=" + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
										this.storage.clear();
										window.localStorage.clear();
										indexedDB.deleteDatabase('_ionicstorage');
										// this.authService.deleteAllCookies();
										if (window.location.hostname == 'localhost') {
											this.cookieService.deleteAll();
										} else {
											this.cookieService.deleteAll('/', '.indiainfoline.com');
										}
										// this.loading = false;
										this.router.navigate(['/login']);
										// this.navCtrl.navigateRoot('/login');
									}
								},
									error => {
										console.log(error, 'error');

									})
							})
						} else {
							const boData = {
								"EmployeeId": "",
								"Password": "",
								"AppName": "",
								"MachinId": "",
								"MacAdd": ""
							};
							this.http.post<any>(`${this.backOfficeLogout.url}`, boData, { headers: new HttpHeaders(Object.assign(obj)) }).subscribe(res => {
								this.toast.displayToast('Logout successful');
								// document.cookie = "WZRK_S_" + environment.clevertap_Key + "=" + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
								this.storage.clear();
								window.localStorage.clear();
								indexedDB.deleteDatabase('_ionicstorage');
								if (window.location.hostname == 'localhost') {
									this.cookieService.deleteAll();
								} else {
									this.cookieService.deleteAll('/', '.indiainfoline.com');
								}
								// this.authService.deleteAllCookies();
								// this.loading = false;
								this.router.navigate(['/login']);
							})
						}
					}
				}
			]
		});

		await alert.present();
	}

	ngOnDestroy(): void {
		if(this.subscription){
			this.subscription = this.subscription.unsubscribe();
		}
	}

	
	private downloadReport = (reportDeatails: any) => {

		if(reportDeatails.ReportName && reportDeatails.ReportName.toString().toLowerCase() == "detailedclientsreport"){
			this.downloadDetailedClientsReport(reportDeatails);
		}
	}

	private downloadDetailedClientsReport = (reportDeatails: any) => {

		this.dashBoardService.clientWireDashboardReport(reportDeatails.Token, { PartnerCode: localStorage.getItem("userId1") })
			.subscribe((res: any) => {
				if (res && res.Body && res.Body.length > 0) {
					let unzippedData = this.commonService.getGzipData(res['Body']);
					let reportData = unzippedData;
					let info: any = [];
					let head = [["Login Id", "Name", "BRANCH", "Category", "Unclear Chque", "Undelivered", "ALB", "Gross", "BMFD Balance", "AGHV", "GHV", "GHVC", "AHV", "AHVC", "ZHV", "THV", "THVC",  "SPAN", "Net worth", "FD and BG", "Collateral Value", "Short Option Premium Value", "FO Value", "Currency Value", "BMFD Funded Stock", "BMFD Earmarked Stock", "DPC frequency", "MF Ledger", "Margin THV", "Margin AHV", "Margin GHV", "Cash Coll", "NonCash Coll", "ApplblNonCash", "Coll Benefit", "Cashbalanceincludingunsettledbills", "PMUL Loan Amount", "Trading Exch Selected", "IsDormant", "account open date", "Nominee", "Freeze", "LTD"]];
					reportData.forEach((element: any) => {
						info.push([element.Loginid, element.Name, element.BRANCH, element.Category, element.UnclearChque, element.Undelivered, element.ALB, element.Gross, element.BMFDBalance, element.AGHV, element.GHV, element.GHVC, element.AHV, element.AHVC, element.ZHV, element.THV, element.THVC, element.SPAN, element.Networth, element.FDandBG, element.CollateralValue, element.ShortOptionPremiumValue, element.FOValue, element.CurrencyValue, element.BMFDFundedStock, element.BMFDEarmarkedStock, element.DPCfrequency, element.MFLedger, element.MarginTHV, element.MarginAHV, element.MarginGHV, element.CashColl, element.NonCashColl, element.ApplblNonCash, element.CollBenefit, element.Cashbalanceincludingunsettledbills, element.PMULLoanAmount, element.TradingExchSelected, element.IsDormant, moment(element.accountopendate).format('DD/MM/YYYY'), element.IsNominee, element.IsFreeze, element.LTD]);
					});
					this.commonService.exportDataToExcel(head[0], info, 'Web Wire Dashboard Report');
					this._appLoaderService.hideLoader();
				} else {
					this.toast.displayToast('No Data Found');
					this._appLoaderService.hideLoader();
				}
			});
	}

}
