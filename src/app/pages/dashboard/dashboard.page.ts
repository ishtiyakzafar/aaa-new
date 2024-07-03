import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import {IonSlides , ModalController, Platform } from '@ionic/angular';	review. removed IonSlides
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
// import {SipBookComponent} from 'src/app/components/sip-book/sip-bounced.component'
// import { Subscription } from 'rxjs';
import { MarketService } from '../markets/markets.service';
import { Subscription,Subject, BehaviorSubject, ReplaySubject, timer, NEVER } from 'rxjs';
// import { DashBoardService } from '../dashboard/dashboard.service';
import * as _ from 'lodash';    
import axios from 'axios';
import { HttpClient } from '@angular/common/http';
import { catchError, concatMap, debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { BrokerageService } from '../../components/brokerage/brokerage.service';
import { LoginService } from '../login/login.service';
import { URLS } from '../../../config/api.config';
import moment from 'moment';
import { ModalController, Platform } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { FormFormatComponent } from '../../components/form-format/form-format.component';
import { LeadsStatusModalComponent } from '../../components/leads-status-modal/leads-status-modal.component';
import { YourKpiModalComponent } from '../../components/your-kpi-modal/your-kpi-modal.component';
import { SearchComponent } from '../../components/search/search.component';
import { DashbordSipComponent } from '../../components/dashbord-sip/dashbord-sip.component';
import { BusinessOpportunitiesDetailsComponent } from '../../components/business-opportunities-details/business-opportunities-details.component';
import { BrokerageAccessControlModalComponent } from '../../components/brokerage-access-control-modal/brokerage-access-control-modal.component';
import { NewLoginService } from '../new-login/new-login.service';


import { RaiseQueryService } from '../../pages/raise-query/raise-query.service';
declare const jsonData: any; 
declare var cordova: any;

@Component({
	selector: 'app-dashboard-revamp',
	providers: [MarketService, DashBoardService, BrokerageService, LoginService,NewLoginService,RaiseQueryService],
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
})
export class DashboardRevampPage implements OnInit,OnDestroy {
	// @ViewChild('bannerSlides', { static: false }) bannerSlides: IonSlides;
	// @ViewChild('leadSlides', { static: false }) leadSlides: IonSlides;
	// @ViewChild('investSlides', { static: false }) investSlides: IonSlides;
	
	//@ViewChild('bannerSlides', { static: false }) bannerSlides: any;
	//@ViewChild('leadSlides', { static: false }) leadSlides: any;
	//@ViewChild('investSlides', { static: false }) investSlides: any;

	@ViewChild('leadSlides') leadSlides: ElementRef | undefined;
	@ViewChild('bannerSlides') bannerSlides : ElementRef | undefined;
	@ViewChild('investSlides') investSlides : ElementRef | undefined;
	showEarnmsg: Boolean = false;
	isHidden: Boolean = false;
	earnlock2: Boolean = false;
	earnlock3: Boolean = false;
	earnlock4: Boolean = false;
	isHiddenmb: Boolean = false;
	earnlock2mb: Boolean = false;
	earnlock3mb: Boolean = false;
	earnlock4mb: Boolean = false;
	public isHierarchyshow: boolean = false;
	public isApplyClick: boolean = false;
	public isHierarchyLoad: boolean = false;
	public loginUserName: any;
	public showIcon: any = 'Overall';
	public showHidedashValue:boolean = true;
	 //@ViewChild('autoSlides', { static: false }) autoSlides: IonSlides;
	searchHierarchyList : any;
	selectOptionArrCopy: any[] = [];
	public placeholderInput: string = 'Search RM / FAN';
	isShowCross: boolean = false;
	isShowDrop: boolean = false;
	showFlyHighSection: boolean = true;
	isPlatformMobile: boolean = false;
	isPeopleLikeVisible: boolean = true;
	leadTime: any;
	isBrokeragePartner:any;
	clientCount = URLS.clientCount;
	iglcList: any = [];
	isBrokerageVisible: boolean = true;
	public isFanChild: boolean = false;
	displayIGLCScore: any = 0;
	public Cards: any[] = [
		{
			type: 'aum', heading: 'AUM', value: '', img: 'aum_rupee.svg', cardMarker: 'card_marker.svg', title: 'MOM Increase',
			lowerValue: 'MOM Increase 10.38Cr (5.21%)', cardMessage: '', link: 'dashboard-aum'
		},
		{
			type: 'clients', heading: 'Clients', value: '', img: 'das_clients.svg', cardMarker: 'card_marker.svg', title: 'MOM Increase',
			lowerValue: 'MOM Increase 10.38Cr (5.21%)', cardMessage: '', link: 'dashboard-clients'
		},
		{
			type: 'brokerage', heading: 'Brokerage (YTD)', value: '', img: 'das_brokerage.svg', cardMarker: 'card_marker.svg', title: 'MOM Increase',
			lowerValue: 'MOM Increase 10.38Cr (5.21%)', cardMessage: 'Brokerage shown above is the Gross brokerage of current financial year', link: 'dashboard-brokerage'
		},
		{
			type: 'afyp', value: ''
		}
	]
	public topCarousel: any[] = [
		{ title: 'Margin Money', heading: 'Contest', des: 'Stand chance to with iPhone 12' },
		{ title: 'Margin Money', heading: 'Contest', des: 'Stand chance to with iPhone 10' },
		{ title: 'Margin Money', heading: 'Contest', des: 'Stand chance to with iPhone 12' },
		{ title: 'Margin Money', heading: 'Contest', des: 'Stand chance to with iPhone 10' },
		{ title: 'Margin Money', heading: 'Contest', des: 'Stand chance to with iPhone 12' },
		{ title: 'Margin Money', heading: 'Contest', des: 'Stand chance to with iPhone 10' },
	]
	public carouselCard: any[] = [
		{ date: '16 Jul - 20 Jul 2021', price: '₹1073 - ₹1098' },
		{ date: '16 Jul - 20 Jul 2021', price: '₹1073 - ₹1097' },
		{ date: '16 Jul - 20 Jul 2021', price: '₹1073 - ₹1098' },
		{ date: '16 Jul - 20 Jul 2021', price: '₹1073 - ₹1097' },
		{ date: '16 Jul - 20 Jul 2021', price: '₹1073 - ₹1098' },
		{ date: '16 Jul - 20 Jul 2021', price: '₹1073 - ₹1098' },
		{ date: '16 Jul - 20 Jul 2021', price: '₹1073 - ₹1097' },
		{ date: '16 Jul - 20 Jul 2021', price: '₹1073 - ₹1098' }
	]
	public opportunities: any[] = [
		{ option: 'activeFO', value: '2400', type: 'clients', des: 'With active F&O but not traded', icon: 'active_fo.svg' },
		{ option: 'loggedIn', value: '2400', type: 'clients', des: 'Clients logged in today but not traded', icon: 'logged_in.svg' },
		{ option: 'notInvestedMutual', value: '2400', type: 'clients', des: 'Not invested in mutual funds', icon: 'not_invested_mutual.svg' },
		{ option: 'notInvestedSIP', value: '2400', type: 'clients', des: 'Not invested in through SIP', icon: 'not_invested_sip.svg' },
		{ option: 'nfoMaturing', value: '2400', type: 'clients', des: 'NFO/FMP maturing', icon: 'nfo_maturing.svg' },
		{ option: 'highNetworth', value: '2400', type: 'clients', des: 'High net worth (above 25L equity holdings)', icon: 'high_networth.svg' },
	]

	helpToken:any= Subscription;
	timerCtrl = new BehaviorSubject<number>(0);
	closeTimer = new ReplaySubject<any>(1);
	public bodyParam: any;

	// public performance: any[] = [
	// 	{ type: 'New Acquisition', value1: '1566', value2: '1566' },
	// 	{ type: 'Brokerage', value1: '₹ 1566', value2: '₹ 1566' },
	// 	{ type: 'Broking Margin', value1: '₹ 1566', value2: '₹ 1566' },
	// 	{ type: 'Cross Sell AUM', value1: '₹ 1566', value2: '₹ 1566' },
	// 	{ type: 'Premium Collected', value1: '₹ 1566', value2: '₹ 1566' },
	// ]
	currentDate: Date = new Date();
	isNegativebarNBAUM: boolean = false;
	public performance: any[] = [
			{ type: 'New Acquisition', value1: '0', value2: '0'},
			{ type: 'Brokerage', value1: '0', value2: '0'},
			{ type: 'Broking Margin', value1: '0', value2: '0'},
			{ type: 'Cross Sell AUM', value1: '0', value2: '0'},
			{ type: 'Premium Collected', value1: '0', value2: '0'},
	]
	sliderIndex: number = 0;
	isLastIndex: boolean = false;
	slideLeadWeb: any = {
		pagination: {
			el: ".swiper-pagination",
			type: "bullets",
			clickable: true
		  },
		slidesPerView: 1,
		spaceBetween: 5,
		pager:true,
		// autoplay : true,
		// loop: true
	}
	slidebannerWeb: any = {
		pagination: {
			el: ".swiper-pagination",
			type: "bullets",
			clickable: true
		  },
		slidesPerView: 1,
		spaceBetween: 5,
		pager:true,
		autoplay : true,
		// loop: true
	}

	slideOptsWeb: any = {
		slidesPerView: 3,
		spaceBetween: 20,
		// autoplay : true,
		// loop: true
	}
	slideOptsMob: any = {
		slidesPerView: 1.2,
		spaceBetween: 20,
		// autoplay : true,
		// loop: true
	}
	autoOptions: any = {
		slidesPerView: 1,
		autoplay: true,
		loop: true
	}
	leadSlidesBreakpoints = {
		slidesPerView : 1,
		768: {
			slidesPerView: 2.2,
		},
		576: {
			slidesPerView: 1,
		}
	};
	showQuickLink = false;
	dashSwitch = false;
	moment: any = moment;
	ClientName: any;
	clientCategory: any = null;
	IpoCards: any[] = [];
	topLeadData:any[]=[];
	platform: any;
	searchNameList: any;
	selectedClientCode: any;
	businessOppCard: any = [];
	NCDorDebtHoldingsValue:any;
	objectKeys = Object.keys;
	tokenValue: any;
	// userIdValue: any;
	tableData: any[] = [];
	businessOppCard1: any;
	loader: boolean = false;
	clearHeaderDetails: any;
	displayHeader: any[] = [];
	timerCall: any;
	leadTimer: any;
	businessOppsCard: any[] = [];
	kpiDashboardObj: any;
	widthProgressBar:any = 0;
	public isConstruct: boolean = false;
	iglcRmSection: boolean = false;
	flyHighRmSection: boolean = false;
	barIncrementa: any;
	barNBAUM: any;
	barKyc: any;
	barBooster2: any;
	brokerageRmSection: boolean = false;
	iscategoriestypeRm: boolean = false;
	
	

	userID: any = null;
	userType: any = null;
	userChannel: any = null;
	clientCode: any = null;
	hightestLabel: any = null;
	public isSaveList: any = 'empty';
	public selectOptionArr: any[] = [];
	public isDropDownVisible: boolean = false;
	dueAmount:any;
	dueDate:any;
	displayViewAll:boolean = true;
	peopleLikeYouData:any[] = [];
	businessCardsMobile:any;
	Score:any = 0;
	iglcScoreProgress:any = 0;
	imgPreview!:string;
	imgPreview_1!:string;
	imgPreview_2!:string;
	imgPreview_3!:string;
	isComplete_1: boolean = false;
	isComplete_2: boolean = false;
	isComplete_3: boolean = false;
	isComplete_4: boolean = false;
	isPoint_1: boolean = true;
	isPoint_2: boolean = true;
	isPoint_3: boolean = true;
	isPoint_4: boolean = true;
	isUnlock_1: boolean = true;
	isUnlock_2: boolean = false;
	isUnlock_3: boolean = false;
	isUnlock_4: boolean = false;
	isUnlock_5: boolean = false;  
	filteredData: any;
	externalVariable: any[];
	noRecord:boolean=false;
	isAccessMaker: boolean = false;
	isChildAccess: boolean = false;

	//peopleLikeTable:any[] = [];
	private subscription: any;
	private searchRmhierarchyTerms = new Subject<string>();
	dataLoad: boolean = false;
	isdownloadPartner: boolean = true;
	flyHighData: any;
	latestCircularsData: any[] = [];
	showCircularsSection: boolean = true;
	recentCircularsCount: number = 0;
	toggleParam = 'Hierarchy';
	//   Dashboard tab
	equityBlockTabValue: any = 'Overall';
	equityBlockButton: any[] = [
		{ Name: 'Overall', Value: 'Overall', active: 1 },
		{ Name: 'Mutual Funds', Value: 'Mutual Funds', active: 0 },
		{ Name: 'Equity', Value: 'Equity', active: 0 },
		{ Name: 'Cross-Sell', Value: 'Cross-Sell', active: 0 }
	  ];
	notChildFan: boolean = false;
	showBrokerage!: boolean;    // use this
	showHideDashboardValue = true;
	buttonName= 'Hide';
	eyeMessage = false;
	showMyValue: boolean = false;
	constructor(private http: HttpClient, private router: Router,
		private modalController: ModalController,
		private serviceFileRaise: RaiseQueryService,
		//private dashBoardRevampService: DashBoardRevampService,
		private storage: StorageServiceAAA,
		private commonService: CommonService,
		private dashBoardService: DashBoardService,
		private marService: MarketService,
		private brokSer: BrokerageService,
		private route:ActivatedRoute,
		private platfrm: Platform, public serviceFile: LoginService, 
		public toast: ToasterService, public serviceFile1: NewLoginService) {
			route.params.subscribe(val => {
				this.viewBrokerageAccessFunc();
				this.showBrokerage = false;
				this.hideBrokerage();
				this.showQuickLink = !this.showQuickLink;
				if(localStorage.getItem("isFirstLogin") == 'first'){
					localStorage.setItem("isFirstLogin", 'second');
					this.storage.get('userType').then(type => {
						if(type === 'RM'){
							this.iglcRmSection = true;
							this.flyHighRmSection = true;
							this.brokerageRmSection =true;
							this.iscategoriestypeRm = true;
						}
						if(type === 'FAN'){
							this.iglcRmSection = false;
							this.brokerageRmSection =false;
							this.iscategoriestypeRm = false;
						}
						if (type === 'RM' || type === 'FAN') {
							this.storage.get('bToken').then(token => {
									this.tokenValue = token;
									this.storage.set('tokenValue', token);
									this.dashApiCalls(token);
									this.iglcContest(token);
									this.flyHighDetails(token);
							})
						} else {
							this.storage.get('subToken').then(token => {
									this.tokenValue = token;
									this.storage.set('tokenValue', token);
									this.dashApiCalls(token);
									this.iglcRmSection = false;
									this.flyHighRmSection = false;
									this.brokerageRmSection = false;
									this.iscategoriestypeRm = false;
									this.iglcContest(token);
									this.flyHighDetails(token);
							})
						}
					});
			}
			else{
				this.getHierarchyList();
				this.storage.get('userType').then(type => {
					if(type === 'RM'){
						this.iglcRmSection = true;
						this.flyHighRmSection = true;
						this.brokerageRmSection = true;
						this.iscategoriestypeRm = true;
					}
					if(type === 'FAN'){
						this.iglcRmSection = false;
						this.brokerageRmSection =false;
						this.iscategoriestypeRm = false;
					}
					if (type === 'RM' || type === 'FAN') {
						this.storage.get('bToken').then(token => {
								this.tokenValue = token;
								this.storage.set('tokenValue', token);
								this.dashApiCalls(token);
								this.iglcContest(token);
								this.flyHighDetails(token);
						})
					} else {
						this.storage.get('subToken').then(token => {
								this.tokenValue = token;
								this.storage.set('tokenValue', token);
								this.dashApiCalls(token);
								this.iglcRmSection = false;
								this.flyHighRmSection = false;
								this.brokerageRmSection = false;
								this.iscategoriestypeRm = false;
								this.iglcContest(token);
								this.flyHighDetails(token);
						})
					}
				});
			}

			this.isHierarchyshow = false;
			this.isShowCross = false;
			this.selectOptionArr = [];
			this.selectOptionArrCopy = [];
			this.searchHierarchyList = '';
			
			  });
			  this.externalVariable = jsonData;

		}

	ngOnInit() {
	   if(!localStorage.getItem('numberBlinkerShown')){
			this.showMyValue = true;
			setTimeout(() => {
				this.showMyValue = false;
				localStorage.setItem('numberBlinkerShown','true');
			},25000);
		}
		const toggleState = localStorage.getItem('toggleSwitch');
		if(toggleState){
			this.toggleParam = toggleState;
		}
		
		this.loginUserName = '';
		this.ClientName = '';
		this.isHierarchyshow = false;
		
		this.viewBrokerageAccessFunc();
		this.loadCircularsData();
		// if (!localStorage.getItem('crmToken')) {
		// 	this.createHelpToken();
		// }
		this.createHelpToken();
 		this.storage.get('isFanChild').then(isChild => {
			if(isChild == 'true'){
				this.isFanChild = true;
			}
		});
		this.storage.remove('topLeads');
		//this.storage.remove('realTimeMargin');
		//this.storage.remove('riskReportLink');
		this.subscription = new Subscription();
		this.storage.get('userID').then((userID) => {
			this.userID = userID;
			// this.getDataFromStorage(true);
			// this.storage.get('userType').then(type => {
			// 	// this.userIdValue = userID
			// 	if (type === 'RM' || type === 'FAN') {
			// 		this.storage.get('bToken').then(token => {
			// 			this.tokenValue = token;

			// 			this.getPartnerPoint(token);
			// 			this.dashBoardDetails(token);
			// 			this.IpoList(token)
			// 			this.businessOppsCards(token)
			// 			this.storage.get('mappingDetails').then((details) => {
			// 				this.searchNameList = details;
			// 			});
			// 		})
			// 	} else {
			// 		this.storage.get('subToken').then(token => {
			// 			this.tokenValue = token;
			// 			this.getPartnerPoint(token);
			// 			this.IpoList(token);
			// 			this.dashBoardDetails(token);
			// 			this.businessOppsCards(token)
			// 			this.storage.get('subBrokermapping').then((details) => {
			// 				this.searchNameList = details;
			// 			});
			// 		})
			// 	}
			// })
		})
		this.storage.get('userType').then(type => {
			this.userType = type;
			if (type === 'RM') {
				 this.iscategoriestypeRm = true;
			}
		})

		let token = localStorage.getItem('jwt_token');
		const rmUserID = localStorage.getItem('userId1');
		this.searchRmhierarchyTerms
		.pipe(
		  debounceTime(500),
		  switchMap((textSerach) => this.dashBoardService.fetchRMHierarchyNew(this.userType, rmUserID, token, textSerach)) // Perform the search operation
		)
		.subscribe(results => {
			this.setHierarchyList(results); 
		});

		// CHECK AND SET DEFAULT DASHBOARD TAB ON PAGE REFRESS
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getDefaultDashboardTab(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getDefaultDashboardTab(token)
				})
			}
		})
	}

    ngAfterViewInit() {
        // var wzrk = document.createElement('script');
        // wzrk.type = 'text/javascript';
        // wzrk.async = true;
        // wzrk.src = 'https://images.indiainfoline.com/AAA_banner/aaa_banner.js';
        // var s = document.getElementsByTagName('script')[0];
        // s.parentNode.insertBefore(wzrk, s);
    }

	public loadCircularsData() {
		// ... (existing code)
	
		// Filter circulars for the last 3 days
		const threeDaysAgo = new Date();
		threeDaysAgo.setDate(threeDaysAgo.getDate() - 30);
		const formattedDate = threeDaysAgo.toISOString().split('T')[0];
    let obj = {
      portalId: '',
      searchStr: ''
    };
    obj.portalId = 'edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57';
    obj.searchStr = 'circular';
    this.serviceFileRaise.zohoSearch(obj).subscribe(
      (response: any) => {
        const allCirculars = response.data;
        this.latestCircularsData = allCirculars.filter((circular:any) => new Date(circular.modifiedTime) >= threeDaysAgo);
		this.recentCircularsCount = this.latestCircularsData.length;
            // Hide the component if no circulars in the last 7 days
            if (this.recentCircularsCount === 0) {
                this.showCircularsSection = false;
            }
	},
      error => {
        console.error('Error fetching circulars:', error);
        this.dataLoad = true; 
      }
    );
	//this.recentCircularsCount = this.latestCircularsData.length;
    // Hide the component if no circulars in the last 3 days
    // if (this.recentCircularsCount === 0) {
    //   this.showCircularsSection = false;
    // }
	  }
	  onCircularsClose(){
		this.showCircularsSection = false;
	  }

	  onViewClick(){
		this.router.navigate(['/circulars']);
	}
	/**
	 * To get token for help section after every 30 mins.
	 */
	createHelpToken() {
		this.helpToken = this.timerCtrl
			.asObservable()
			.pipe(
				switchMap((time: number) =>
					timer(time, 1800000).pipe(
						concatMap(() =>
							this.serviceFile.getCrmToken()
						),
						catchError(() => {
							this.timerCtrl.next(1800000);
							return NEVER;
						})
					)
				),
				takeUntil(this.closeTimer)
			)
			.subscribe({
				next: (data: any) => {
					if (data && data['Body'] && data['Body']['Token']) {
						localStorage.setItem('crmToken', data['Body']['Token']);
					}
				}
			});
	}

	
	public dashApiCalls(token: any){
		
		this.storage.get('partnerDetails').then((value: any) => {
			let clientChange = localStorage.getItem('clientChange') ? localStorage.getItem('clientChange') : localStorage.getItem('userId1');
			let userID = localStorage.getItem('userId1');
			if(clientChange != userID){
				this.storage.get('empCode').then(code => {
					if(code){
						this.ClientName = code;
						this.loginUserName = code;
					}
					else{
						this.ClientName = localStorage.getItem('userName');
						this.loginUserName = localStorage.getItem('userName');
					}
				});
				this.dashBoardDetails(token,'first');
			}
			else{
			if(value){
				this.dashBoardDetails(token,'first',value);
			} else {
				this.dashBoardDetails(token,'first');
			}
		}});
		this.hierarchyList(token);
		this.getPartnerPoint(token);
		this.IpoList(token)
		this.businessOppsCards(token);
		this.brokerageDueDetails(token);
		this.loadSlides();
		localStorage.setItem('isNewClientTab', 'NO');
	}

	public viewBrokerageAccessFunc(){
		setTimeout(() => {
			this.isChildAccess = false;
			this.storage.get('setAccessMaker').then((maker) => {
				// this.equityBlockTabValue = "Overall";
				// this.showIcon = 'Overall';
				
				// if(maker){
				// 	this.showIcon = maker && (maker.includes('OVERALL') ? this.equityBlockTabValue = "Overall" : maker.includes('MF') ? this.equityBlockTabValue = "Mutual Funds" : maker.includes('EQUITY') ? this.equityBlockTabValue = "Equity" : maker.includes('CROSSCELL') ? this.equityBlockTabValue = "Cross-Sell" : this.equityBlockTabValue = "Overall")
				// }
				// localStorage.setItem('DashTabSelect',this.equityBlockTabValue);

				if(maker && !maker.includes('DashboardBrokerage') && (localStorage.getItem("userType") == 'FAN' || localStorage.getItem("userType") == 'SUB BROKER')){
					this.isChildAccess = true;
					const isBrokerageLoginid = localStorage.getItem('userId1');
					this.serviceFile.getAccessControlData().subscribe((res: any) => {
						if (res['body']['Head']['ErrorCode'] === 0) {
						//   this.isBrokeragePartner = res['body']['Body'][0]['PartnerCode'];
						//   this.isBrokerageVisible = res['body']['Body'][0]['DashboardBrkgRights'] == 'Y' ? true : false;
						this.isBrokerageVisible = res['body']['Body'].some((item:any) => 
							item.Loginid === item.PartnerCode && item.DashboardBrkgRights === 'Y'
						  );
						  if(this.isChildAccess && !this.isBrokerageVisible){
							  this.Cards = this.Cards.filter(obj => {
								  return obj.type != 'brokerage'
							  });					
						  }
					  }
				  });
				}
				this.isAccessMaker = false;
				if(maker && maker.includes('DashboardBrokerage') && localStorage.getItem("userType") != 'RM'){
					this.isAccessMaker = true;
				}
			});
		}, 100);
	}

	public getDataFromStorage(onLoad?: any, clicked?: any) {
		this.loader = true;
		this.loadCircularsData();
		this.storage.get('userType').then(type => {
			if(type === 'RM'){
				this.iglcRmSection = true;
				this.flyHighRmSection = true;
				this.brokerageRmSection = true;
			}
			if(type === 'FAN'){
				this.iglcRmSection = false;
				this.brokerageRmSection =false;
				this.iscategoriestypeRm = false;
			}
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenValue = token;
					// this.dashBoardDetails(token);
					this.getPartnerPoint(token);
					this.IpoList(token)
					this.businessOppsCards(token);
					this.brokerageDueDetails(token);
					this.iglcContest(token);
					this.flyHighDetails(token);
					// setTimeout(() => {
					// 	this.loader = false;
					// }, 1500);
					if (onLoad) {
						this.storage.get('mappingDetails').then((details) => {
							this.searchNameList = details;
						});
					
						this.hierarchyList(token);
						// this.dashBoardDetails(token);
					}
					if (clicked) {

					}
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					// this.dashBoardDetails(token);
					this.getPartnerPoint(token);
					this.IpoList(token)
					this.businessOppsCards(token);
					this.brokerageDueDetails(token);
					this.iglcRmSection = false;
					this.flyHighRmSection = false;
					this.brokerageRmSection = false;
					this.iscategoriestypeRm = false;
					this.iglcContest(token);
					this.flyHighDetails(token);
					if (onLoad) {
					
						this.storage.get('subBrokermapping').then((details) => {
							this.searchNameList = details;
						});
					
						this.hierarchyList(token);
						// this.dashBoardDetails(token);
					}
					if (clicked) {

					}
				})
			}
		})
	}

	async loadSlides() {
		let userType = localStorage.getItem('userType');
		let Channel = localStorage.getItem('userChannel');
		if (userType === 'RM') {
			if(Channel === 'Premia'){
				this.filteredData = this.filterByExpiryDate(this.externalVariable[0].RM.Premia);
			}else{
				this.filteredData = this.filterByExpiryDate(this.externalVariable[0].RM.Franchise);
			}
		} else if (userType === 'FAN') {
			this.filteredData = this.filterByExpiryDate(this.externalVariable[0].FAN);
		  } else {
			this.filteredData = this.filterByExpiryDate(this.externalVariable[0].SubBorker); // Invalid user type, set to null or handle it differently
		  }
	}
  
	filterByExpiryDate(data: any) {
		//const currentDate = new Date(); // Get current date as a Date object
	
		return data.filter((banner: any) => {
			let expiryDate: Date | null = null;;
	
			if (banner.imgExpiryDate !== '00/00/0000') {
				const [day, month, year] = banner.imgExpiryDate.split('/').map(Number);
				expiryDate = new Date(year, month - 1, day); // Month is zero-based in JavaScript Date
			}
	
			// Include banners with '00/00/0000' expiry date or greater than current date or null expiry date
			return (expiryDate === null || expiryDate >= this.currentDate);
		});
	}
	  


	typeHierarchyText(event: any) {
		const textSerach = event.target.value;

		if (textSerach && textSerach.length > 3) {
			this.isShowCross = true;
			this.isShowDrop = true;
			this.noRecord = false;
			this.searchRmhierarchyTerms.next(textSerach);
		} else {
			this.selectOptionArr = [];
			this.selectOptionArrCopy = [];
			// this.ClientName = null;
			// this.clientCode = null;
			this.isShowCross = false;
			this.isShowDrop = false;
		}

		this.isHierarchyLoad = false;


		// this.selectOptionArrCopy = this.selectOptionArr;
		// if(event.target.value == ''){
		// 	
		// 	this.selectOptionArrCopy = this.selectOptionArr;
		// }
		// else{
		// 	
		// 	this.selectOptionArrCopy = this.selectOptionArrCopy.filter(function (el) {
		// 		return el.EmployeeName.toLowerCase().includes(event.target.value.toLowerCase()) || el.EmployeeCode.toLowerCase().includes(event.target.value.toLowerCase());
		// 	}
		// 	);
		// }
	}

	setHierarchyList(res: any) {
		let details:any = [];
		for (const item of res[0]) {
			details.push({
				EmployeeName: item.employeeName,
				EmployeeCode: item.employeeId,
				EmployeeLevel: item.level,
				ManagerCode: '',
				ManagerName: '',
			})
		}
		const listToTree = (arr: any = []) => {
			let map: any = {}, node: any, res: any = [], i;
			for (i = 0; i < arr.length; i += 1) {
				map[arr[i].EmployeeCode] = i;
				arr[i]['isChecked'] = true;
				arr[i]['type'] = 'Individual';
				arr[i]['innerDetail'] = [];
			};
			for (i = 0; i < arr.length; i += 1) {
				node = arr[i];
				if (node.ManagerCode !== "" && arr.length > 1 && node.ManagerCode !== arr[map[node.ManagerCode]].ManagerCode) {
					arr[map[node.ManagerCode]].innerDetail.push(node);
					arr[map[node.ManagerCode]].innerDetail = arr[map[node.ManagerCode]].innerDetail.sort((a: any, b: any) => {
						return b.EmployeeLevel - a.EmployeeLevel;
					})
				}
				else {
					node['isVisible'] = true;
					node['isChecked'] = true;
					res.push(node);
				};
			};
			return res;
		};
		let x = listToTree(details);
		x = x.sort((a: any, b: any) => {
			return b.EmployeeLevel - a.EmployeeLevel;
		});
		var result = x.filter((obj: any) => {
			return obj.EmployeeLevel !== ''
		})
		var logid = result.filter((obj: any) => {
			return obj.EmployeeCode == localStorage.getItem('userId1')
		})
		var notlogid = result.filter((obj: any) => {
			return obj.EmployeeCode != localStorage.getItem('userId1')
		})
		result = logid.concat(notlogid);
		var result1 = x.filter((obj: any) => {
			return obj.EmployeeLevel == ''
		})
		let y = result.concat(result1);
		this.selectOptionArr = y;
		this.selectOptionArrCopy = y;
		// setTimeout(() => {
		// 	this.ClientName = this.selectOptionArr[0]['EmployeeName'];
		// 	// this.clientType = 'All Accounts';
		// 	this.clientCode = this.selectOptionArr[0]['EmployeeCode'];
		// 	this.storage.set('empCode', this.selectOptionArr[0]['EmployeeCode']);
		// 	this.storage.set('hierarchyList', this.selectOptionArr);
		// }, 100);

		if (res[0].length === 0) {
			this.noRecord = true;
		}
	}

	dismiss(){
		this.isShowCross = false;
		this.isShowDrop = false;
		this.selectOptionArr = [];
		this.selectOptionArrCopy = [];
		this.searchHierarchyList = '';
	}

	public getMappingRM(cookieValue: any) {
		// this.dataLoad = false;
		this.storage.get('userID').then((userId) => {
			this.subscription = new Subscription();
			const params = {
				AdminCode: userId
			}
			this.subscription.add(
				this.serviceFile
					.getRMMapping(params, userId, cookieValue)
					.subscribe((response: any) => {
						// this.dataLoad = true;
						if (response['body'].status == 0) {
							this.searchNameList = response['body'].details;
							this.storage.set('mappingDetails', response['body'].details);
						}
						else{
							this.searchNameList = [];
						}
					})
			)
		})
	}
	/**
	 * On Click of Top Lead's card.
	 * @param top 
	 */
	leadClick(top: any) {
		this.storage.set('leadData',{logo:top.logo,pdfReport:top.pdfReport});
		this.router.navigate(['/lead-details', top.id]);
		let ctProp = {
			'Category':top.productType,
			'IPO Name':top.name
		}
		this.commonService.setClevertapEvent('Top Leads card clicked',ctProp);
	}

	/**
		 * On Click of Real Time Margin Shortfall link.
		 */
	redirectToExchReport() {
		this.commonService.setClevertapEvent('Dashboard_MarginShortfall_Clicked');
		//this.storage.set('realTimeMargin',{rtm:true});
		this.router.navigate(['/view-reports']);
	}
	riskReportlink() {
		//this.storage.set('riskReportLink',{rpl:true});
		this.router.navigate(['/view-reports']);
	}
	helpclick(){
		if(localStorage.getItem('userType') == 'RM'){
			this.router.navigate(['/help-partner-query']);
		}
		else{
			this.router.navigate(['/help-support']);
		}
			
	}

	async clickOnFormFormat() {
		const modal = await this.modalController.create({
			component: FormFormatComponent,
			cssClass: 'ipo-modal'
		});

		modal.onDidDismiss().then(data => {
			// console.log(data);
		})
		return await modal.present();
	}

	public hierarchyList(token: any) {
		this.isConstruct = true;
		this.subscription = new Subscription();
		this.storage.get('tokenValue').then(val => {
			// this.dashBoardDetails(val,true);
			this.storage.get('userType').then(type => {
				this.userType = type;
				
			});
			this.userChannel = localStorage.getItem('userChannel');	
			if(this.userChannel === 'Premia'){
				this.kpiDashboard();
	
			}
			else if(this.userChannel === 'Franchisee'){
				this.kpiDashboard();
	
			}
			
		});
		this.storage.get('hierarchyList').then( list => {
			if(list && list.length > 0){
				this.getHierarchyList();
			}
			else{
				this.subscription.add(
					this.dashBoardService
						.getHierarchyList(token, localStorage.getItem('userId1'))
						.subscribe((res: any) => {
							if (res['Head']['ErrorCode'] == 0) {
								//const Details = res['Body']['Details'];
								const Details1 = this.commonService.getGzipData(res['Body']);
							//this.clientCodeList = Details1.objGetClientCodesResBody;
								this.storage.set('RMHierarchy', Details1.Details);
								const listToTree = (arr: any = []) => {
									let map: any = {}, node, res: any = [], i;
									for (i = 0; i < arr.length; i += 1) {
										map[arr[i].EmployeeCode] = i;
										// if (arr[i]['EmployeeLevel'] === '') arr[i]['EmployeeLevel'] = "1";
										arr[i]['isChecked'] = true;
										arr[i]['type'] = 'Individual';
										arr[i]['innerDetail'] = [];
									};
									for (i = 0; i < arr.length; i += 1) {
										node = arr[i];
										// Added extra check to avoid error while reading Manager code: arr[map[node.ManagerCode]] 
										if (node.ManagerCode !== "" && arr.length > 1 && arr[map[node.ManagerCode]] && node.ManagerCode !== arr[map[node.ManagerCode]].ManagerCode) {
											arr[map[node.ManagerCode]].innerDetail.push(node);
											arr[map[node.ManagerCode]].innerDetail = arr[map[node.ManagerCode]].innerDetail.sort((a: any, b: any) => {
												return b.EmployeeLevel - a.EmployeeLevel;
											})
										}
										else {
											// (node['EmployeeLevel'] !== '' && node['EmployeeLevel'] !== null || arr.length === 1) ? node['isChecked'] = true : node['isChecked'] = false;
											node['isVisible'] = true;
											node['isChecked'] = true;
											res.push(node);
										};
									};
									return res;
								};
		
								
								let x = listToTree(Details1.Details);
								x = x.sort((a: any, b: any) => {
									return b.EmployeeLevel - a.EmployeeLevel;
								});
								var result = x.filter((obj: any) => {
									return obj.EmployeeLevel !== ''
								})
								var logid = result.filter((obj: any) => {
									return obj.EmployeeCode == localStorage.getItem('userId1')
								})
								var notlogid = result.filter((obj: any) => {
									return obj.EmployeeCode != localStorage.getItem('userId1')
								})
								result = logid.concat(notlogid); 
								var result1 = x.filter((obj: any) => {
									return obj.EmployeeLevel == ''
								})
								let y = result.concat(result1);
								this.selectOptionArr = y;
								this.selectOptionArrCopy = y;
								// this.selectOptionArr[0]['isVisible'] = true;
		
								this.storage.get('empCode').then(code => {
									if(code){
										this.ClientName = code;
										this.loginUserName = code;
									}
									else{
										this.ClientName = this.selectOptionArr[0]['EmployeeName'];
										this.loginUserName = this.selectOptionArr[0]['EmployeeName'];
									}
								});
								// this.clientType = 'All Accounts';
								this.clientCode = this.selectOptionArr[0]['EmployeeCode'];
								this.storage.set('empCode', this.selectOptionArr[0]['EmployeeCode']);
								this.storage.set('hierarchyList', this.selectOptionArr);
							} else {
								this.selectOptionArr = [];
								this.selectOptionArrCopy = [];
								this.ClientName = null;
								this.clientCode = null;
							}
						})
				)
			}
			this.isHierarchyLoad = false;
		})
	}




	public applyFilter(value: any,listVal?: any) {
		let list: any;
		if(value == false){
			this.storage.remove('listVal');
			this.storage.set('listVal', listVal);
		}
		let recursiveList = (listArray: any, flag?: any) => {
			listArray.forEach((element: any) => {
				// element.collapsed = arr['collapsed'];
				// element['hideChildren'] = arr['collapsed'] ? false : true;
				element['isChecked'] = (flag === false ? flag : list['isChecked']);
				if (element['innerDetail'] && element['innerDetail'].length > 0) {
					recursiveList(element['innerDetail'], flag);
				}
			});
		}
		recursiveList(this.selectOptionArr, false);
		if(value == true){
			// setTimeout(() => {
			this.storage.get('listVal').then(val => {
				list = listVal;
				this.ClientName = list['EmployeeName'] ? list['EmployeeName'] : list['EmployeeCode'];
			this.clientCode = list['EmployeeCode'];
			this.storage.set('empCode', list['EmployeeCode']);
			setTimeout(() => {
				this.isHierarchyshow = false;
				this.isApplyClick = true;
				if (list['innerDetail'] && list['innerDetail'].length > 0) {
					recursiveList(list['innerDetail']);
				}
			});

		this.isDropDownVisible = !this.isDropDownVisible;
		const obj = {
			clientCode: this.clientCode
		}
		this.storage.set('empCode', this.clientCode);
		this.userID = this.clientCode;
		this.storage.get('tokenValue').then(val => {
			this.dashBoardDetails(val);
		});
			});
			
	// },500);
	}
		// this.getDataFromStorage(false);
		// if (this.aumBlockTabValue === 'aum') {
		// 	obj['key'] = this.aumBlockTabValue,
		// 		obj['value'] = this.aumTabData;
		// 	obj['chartData'] = this.chartData;
		// 	const event = this.commonService.getData();
		// 	if (event && (event['value'] || event['detail']['value']) === 'equity') {
		// 		this.commonService.setEvent('equityEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'mutualFund') {
		// 		this.commonService.setEvent('mutualFundEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'fd') {
		// 		this.commonService.setEvent('fdEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'pms') {
		// 		this.commonService.setEvent('pmsEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'mlds') {
		// 		this.commonService.setEvent('mldsEvent', obj);
		// 	}
		// 	this.commonService.setEvent('aumEvent', obj);
		// } else if (this.aumBlockTabValue === 'sipBook') {
		// 	obj['key'] = this.aumBlockTabValue,
		// 		obj['value'] = this.sipBookTabData;
		// 	const event = this.commonService.getData();
		// 	if (event && (event['value'] || event['detail']['value']) === 'liveSips') {
		// 		this.commonService.setEvent('liveSipsEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'newSips') {
		// 		this.commonService.setEvent('newSipsEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'bouncedSips') {
		// 		this.commonService.setEvent('bouncedSipsEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'ceasedSips') {
		// 		this.commonService.setEvent('ceasedSipsEvent', obj);
		// 	}
		// 	/* else if (event && (event['value'] || event['detail']['value']) === 'fd') {
		// 		this.commonService.setEvent('fdEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'pms') {
		// 		this.commonService.setEvent('pmsEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'mlds') {
		// 		this.commonService.setEvent('mldsEvent', obj);
		// 	} */
		// 	this.commonService.setEvent('sipEvent', obj);
		// } else if (this.aumBlockTabValue === 'totalAfyp') {
		// 	obj['key'] = this.aumBlockTabValue,
		// 		obj['value'] = this.totalAFYPTabData;
		// 	obj['chartData'] = this.totalAFYPChartData;
		// 	const event = this.commonService.getData();
		// 	console.log(event);
		// 	if (event && (event['value'] || event['detail']['value']) === 'life') {
		// 		this.commonService.setEvent('totalAfypLifeEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'health') {
		// 		this.commonService.setEvent('totalAfypHealthEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'general') {
		// 		this.commonService.setEvent('totalAfypGeneralEvent', obj);
		// 	}
		// 	this.commonService.setEvent('totalAfypEvent', obj);
		// } else if (this.aumBlockTabValue === 'totalClients') {
		// 	obj['key'] = this.aumBlockTabValue,
		// 		obj['value'] = this.totalClientsTabData;
		// 	const event = this.commonService.getData();
		// 	if (event && (event['value'] || event['detail']['value']) === 'newClients') {
		// 		this.commonService.setEvent('newClientsEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'mtdClients') {
		// 		this.commonService.setEvent('mtdClientsEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'ytdClients') {
		// 		this.commonService.setEvent('ytdClientsEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'uniqueClients') {
		// 		this.commonService.setEvent('uniqueClientsEvent', obj);
		// 	}
		// 	this.commonService.setEvent('totalClientEvent', obj);
		// } else if (this.aumBlockTabValue === 'brokerage') {
		// 	obj['key'] = this.aumBlockTabValue,
		// 		obj['value'] = this.brokerageTabData
		// 	obj['charData'] = this.brokerageChartData;
		// 	const event = this.commonService.getData();
		// 	if (event && (event['value'] || event['detail']['value']) === 'equity') {
		// 		this.commonService.setEvent('brokerageEquityEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'mutual') {
		// 		this.commonService.setEvent('mutualEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'others') {
		// 		this.commonService.setEvent('othersEvent', obj);
		// 	}
		// 	this.commonService.setEvent('brokerageEvent', obj);
		// } else if (this.aumBlockTabValue === 'fds') {
		// 	const event = this.commonService.getData();
		// 	if (event && (event['value'] || event['detail']['value']) === 'fdsBooked') {
		// 		this.commonService.setEvent('fdsBookedEvent', obj);
		// 	} else if (event && (event['value'] || event['detail']['value']) === 'fdsMatured') {
		// 		this.commonService.setEvent('fdsMaturedEvent', obj);
		// 	}
		// 	this.commonService.setEvent('fdsEvent', obj);
		// }

	}

	selectUnselectChildAll2(list: any) {
		let recursiveList = (listArray: any, flag?: any) => {
			listArray.forEach((element: any) => {
				// element.collapsed = arr['collapsed'];
				// element['hideChildren'] = arr['collapsed'] ? false : true;
				element['isChecked'] = (flag === false ? flag : list['isChecked']);
				if (element['innerDetail'] && element['innerDetail'].length > 0) {
					recursiveList(element['innerDetail'], flag);
				}
			});
		}
		recursiveList(this.selectOptionArr, false);
		this.ClientName = list['EmployeeName'] ? list['EmployeeName'] : list['EmployeeCode'];
		this.clientCode = list['EmployeeCode'];
		this.storage.set('empCode', list['EmployeeCode']);
		setTimeout(() => {
			if (list['innerDetail'] && list['innerDetail'].length > 0) {
				recursiveList(list['innerDetail']);
			}
		});
		// }, 100);
	}

	openHide(index: any, arr: any, item: any) {
		this.isShowDrop = false;
		this.isShowCross = false;
		localStorage.setItem('clientChange',item.EmployeeCode);
		arr.forEach((element: any, ind: any) => {
			// if ((index) === ind) {
				element['isVisible'] = element['isVisible'] ? false : true;
			// }
		});
		this.storage.set('empCode', item['EmployeeCode']);
		this.dashSwitch = !this.dashSwitch;
		this.applyFilter(true, item)
	}

	businessOppsCards(token: any) {
		this.storage.get('businessOpportunitiesValue').then((value) => {
			if(value){
				this.businessOppCard = value;
				this.businessOptionCardsHelper();
			} else {
				this.subscription.add(
					this.dashBoardService
						.getBusinessCount(token, localStorage.getItem('userId1'))
						.subscribe((response: any) => {
							if (response['Head']['ErrorCode'] == 0) {
								this.businessOppCard = response['Body']['AAADashBoardCountlist'][0];
								this.NCDorDebtHoldingsValue = this.businessOppCard['NCDorDebtHoldings'];
								this.storage.set("businessOpportunitiesValue", this.businessOppCard);
								this.businessOptionCardsHelper();
								// else {
								// 	console.log('mobile');
								// }
							}
							else {
								this.businessOppsCard = [];
								this.displayViewAll = false;
							}
						}));
					}
				});
					
			}

	businessOptionCardsHelper = () => {
		var businessOppsList: any = []
		Object.entries(this.businessOppCard).forEach(([key, value]: any) => {
			var res = {};	
			res = {
			'key': key, 
			'value': value.toString().length == 0 ? 0 : parseInt(value.toString())
			}
			businessOppsList.push(res);
		});
		// this.businessOppsList1 = businessOppsList.sort((a, b) => (a.key > b.key) ? -1 : 1);
		// let allowZeroValueParameter = []
		// businessOppsList.forEach(element => {
		// 	if((element.key == 'BouncedSIPs' || element.key == 'CeasedSIPs' || element.key == 'MaturingFDCount') && (element.value == 0)){
		//  		console.log(element);
		// 		 allowZeroValueParameter.push(element);
		// 	}
		// });
		this.businessOppsCard = businessOppsList.filter(function (el: any) {
		return el.value != 0 && (el.key != 'DormantClientCount' && el.key != 'ClientsNotTradedCount');
		
		});
		// let consCards =  this.businessOppsCard.concat(allowZeroValueParameter)
		this.businessOppsCard = this.businessOppsCard.sort((a, b) => (a.value > b.value) ? -1 : 1);
		this.businessCardsMobile = this.businessOppsCard
		if (!this.platfrm.is('desktop') && window.innerWidth <800) {
			if(this.businessOppsCard.length > 3){
				this.displayViewAll = true
				this.businessOppsCard = this.businessOppsCard.slice(0,3);
			}
			else{
				this.displayViewAll = false;
			}
		}
		this.storage.get('userType').then(type => {
			if (type != 'RM') {
				this.businessOppsCard = this.businessOppsCard.filter(function (el) {
					return el.key != 'P1P2Clients' && el.key != 'otherclients';
				});
			}
		});
	}

	public overlayClicked(event: any) {
		event.preventDefault();
		this.isDropDownVisible = false;
	}

	defaultClick(val: any){
			this.bodyParam = {
				"LoginId": localStorage.getItem('userId1'),  
        		"Default_Dashboard_Name": val == "Overall" ? "Overall" : val == "Mutual Funds" ? "MF" : val == "Equity" ? "Equity" : val == "Cross-Sell" ? "Crosscell" : ''
      		};

			this.commonService.setClevertapEvent('Setdefault_Clicked', { 'Login ID': localStorage.getItem('userId1') });

		this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.initDefault(token,this.bodyParam);
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.initDefault(token,this.bodyParam);
					})
				}
			})
	}

	getDefaultDashboardTab(token: any) {
		this.storage.get('userID').then(ID => {
			this.serviceFile.
				accessProductActivation(token, ID).
				subscribe((response) => {
					if (response['Head']['ErrorCode'] == 0) {
						this.storage.set('setAccessChecker', response['Body']['FeatureAccessChecker']);
						this.storage.set('setAccessMaker', response['Body']['FeatureAccessMaker']);
						this.equityBlockTabValue = "Overall"
						this.showIcon = 'Overall';
						if (response['Body']['FeatureAccessMaker']) {
							this.showIcon = response['Body']['FeatureAccessMaker'] && (response['Body']['FeatureAccessMaker'].includes('OVERALL') ? this.equityBlockTabValue = "Overall" : response['Body']['FeatureAccessMaker'].includes('MF') ? this.equityBlockTabValue = "Mutual Funds" : response['Body']['FeatureAccessMaker'].includes('EQUITY') ? this.equityBlockTabValue = "Equity" : response['Body']['FeatureAccessMaker'].includes('CROSSCELL') ? this.equityBlockTabValue = "Cross-Sell" : this.equityBlockTabValue = "Overall")
						}
						localStorage.setItem('DashTabSelect', this.equityBlockTabValue);
					} else {
						this.storage.set('setAcessChecker', null);
						this.storage.set('setAcessMaker', null);
					}
				})
		})
	}

	initDefault(token: any, body: any){
		this.dashBoardService.getDefaultDashboard(token, body)
		.subscribe((res: any) => {
		  if (res['Head']['ErrorCode'] == 0) {
			this.toast.displayToast(res['Body'][0]['Msg']);
			
			this.getDefaultDashboardTab(token);

		  }
		  else{
			this.toast.displayToast(res['Head']['ErrorDescription']);
		  }
		})
	  }

	public brokerageDueDetails(token: any) {

		// this.storage.get('userID').then(ID => {
			const subscription = new Subscription();
			const passObj = {
				Loginid: this.clientCode ? this.clientCode : this.userID
			}
			subscription.add(
				this.brokSer
					.getBrokerageDue(token, passObj)
					.subscribe((res: any) => {
						if (res['Head']['ErrorCode'] === 0) {
							const response = res['Body']['objGetAAABrokerageduedetailsDataBody'][0];
							const tempDate = response['DueDate'].split('-');
							var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
							let mm = months[tempDate[1] - 1];
							this.dueAmount = this.commonService.numberFormatWithCommaUnit(response['BrokerageAmount']);
							this.dueDate = tempDate[0] + ' ' + mm + ' ' + tempDate[2];
							if(!(this.isChildAccess && !this.isBrokerageVisible)){
								this.Cards[2] = 
								{
									type: 'brokerage', heading: 'Brokerage (YTD)', value: this.Cards[2]['value'], img: 'das_brokerage.svg', cardMarker: 'card_marker.svg', title: 'MOM Increase',
									lowerValue: 'MOM Increase 10.38Cr (5.21%)', cardMessage: `Brokerage shown above is the Gross brokerage of current financial year`, link: 'dashboard-brokerage'
								}
							}
								
						}
					})
			)
		// })
	}
	titleBusinessOpps(key: any, nameOrIcon: string) {
		return this.commonService.displayTitleForBusinessOpps(key,nameOrIcon)
	}

	ionViewWillEnter() {
		this.storage.get('isFanChild').then(isChild => {
			if(isChild == 'true'){
				this.isFanChild = true;
			}
		});
		localStorage.setItem('indexAPI', "true");

		if (!localStorage.getItem('toggleSwitch')) {
			localStorage.setItem('toggleSwitch', this.toggleParam);
		}

		const toggleState = localStorage.getItem('toggleSwitch');
		if (toggleState) {
			this.toggleParam = toggleState;
		}

		let userID = localStorage.getItem('userId1');
		this.storage.get('empCode').then(val => {
		if(val && userID && val != userID){
			this.loginUserName = val;
			this.ClientName = val;
		}
		});

		var b = document.getElementsByTagName('script')[0];
		if(localStorage.getItem('isHierarchySave') == null && localStorage.getItem('isHierarchySave') != 'fill' && localStorage.getItem("isFirstLogin") != 'second'){
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
							this.tokenValue = token;
							this.dashApiCalls(token);
					})
				} else {
					this.storage.get('subToken').then(token => {
							this.tokenValue = token;
							this.dashApiCalls(token);
					})
				}
			});
	}

		this.getCommHeaderDetail();
	}

	public getHierarchyList(){
		setTimeout(() => {
		this.storage.get('hierarchyList').then( list => {
			if (list) {
				this.userID = null;
				this.selectOptionArr = list;
				this.selectOptionArrCopy = list;
				let recursiveList = (listArray: any, flag?: any) => {
					listArray.forEach((element: any) => {
						// element.collapsed = arr['collapsed'];
						// element['hideChildren'] = arr['collapsed'] ? false : true;
						if (element['isChecked'] && this.userID === null) {
							this.userID = element['EmployeeCode'];
							this.clientCode = element['EmployeeCode'];
							this.storage.get('empCode').then(val => {
								let userID = localStorage.getItem('userId1');
								if(val && userID && val != userID){
									this.loginUserName = val;
									this.ClientName = val;
								}
							});
							// this.ClientName = element['EmployeeName'] ? element['EmployeeName'] : element['EmployeeCode'];
							// this.storage.set('empCode', element['EmployeeCode']);
						}
						if (element['innerDetail'] && element['innerDetail'].length > 0) {
							recursiveList(element['innerDetail'], flag);
						}
					});
				}
				recursiveList(this.selectOptionArr, false);
				// this.ClientName = list['EmployeeName'] ? list['EmployeeName'] : list['EmployeeCode'];
				// console.log(this.ClientName, list['EmployeeName'])
				// this.clientCode = list['EmployeeCode'];
				// this.storage.set('empCode', list['EmployeeCode']);
				setTimeout(() => {
					if (list['innerDetail'] && list['innerDetail'].length > 0) {
						recursiveList(list['innerDetail']);
					}
				});
				setTimeout(() => {
					// this.getDataFromStorage(false);
				}, 500);
				const obj: any = {
					clientCode: this.userID,
				}
				this.commonService.setData(obj);
			} 
			else {
				// this.getDataFromStorage(true);
			}
		})
		this.isHierarchyLoad = false;
		}, 500);
	}

	public dashBoardDetails(token: any,first?: any,exsistingValue?: any) {
		// this.loader = true;
		let response: any;
		this.subscription = new Subscription();
		if(first=='first' || this.userID == null){
			this.storage.get('empCode').then(code => {
				this.dashSwitch = !this.dashSwitch;
				this.isApplyClick = false;
				if(code){
					this.ClientName = code == localStorage.getItem('userId1') ? localStorage.getItem('userName') : code;
					this.loginUserName = code == localStorage.getItem('userId1') ? localStorage.getItem('userName') : code;
				}
				else{
					this.loginUserName = localStorage.getItem('userName');
					this.ClientName = localStorage.getItem('userName');
				}
			});
			this.userID = localStorage.getItem('userId1');
		}

		if(!exsistingValue){
			this.subscription.add(
				this.dashBoardService
					.dashBoardDetail(this.tokenValue, this.userID)
					.subscribe((res: any) => {
						setTimeout(() => {
							// this.loader = false;
						}, 500);
						if (res['Head']['ErrorCode'] == 0) {
							response = res['Body'];
							this.bindDashboardCardValue(response['objGetAAADashboardDataBody'][0]);
							this.storage.set('partnerDetails', response);
	
							// this.cardDatas.forEach(element => {
							//     if (element['value'] === 'aum') element['valueOne'] = this.commonService.numberFormatWithCommaUnit(response['TotalAum']);
							//     if (element['value'] === 'sipBook') {
							//         element['valueOne'] = this.commonService.numberFormatWithCommaUnit(response['SipValuePerMonth']);
							//         element['valueTwo'] = this.commonService.numberFormatWithCommaUnit(response['ActiveSIPClient']);
							//     }
							//     if (element['value'] === 'totalAfyp') {
							//         element['valueOne'] = this.commonService.numberFormatWithCommaUnit(response['MTD']);
							//         element['valueTwo'] = this.commonService.numberFormatWithCommaUnit(response['YTD']);
							//     }
							//     if (element['value'] === 'totalClients') element['valueOne'] = this.commonService.numberFormatWithCommaUnit(response['TotalClient']);
							//     if (element['value'] === 'brokerage') {
							//         element['valueOne'] = this.commonService.numberFormatWithCommaUnit(response['YTDBrokerage']);
							//         element['valueTwo'] = this.commonService.numberFormatWithCommaUnit(response['TotalBrokerage']);
							//     }
							//     if (element['value'] === 'fds') {
							//         element['valueOne'] = this.commonService.numberFormatWithCommaUnit(response['MaturityFDValue']);
							//         element['valueTwo'] = this.commonService.numberFormatWithCommaUnit(response['MaturityFDCount']);
							//         // element['valueOne'] = '40.23 L';
							//         // element['valueTwo'] = '20.10 Cr.';
							//     }
							// });
						} else {
							this.Cards.forEach(element => {
								element['value'] = this.commonService.numberFormatWithCommaUnit(0);
								element['title'] = '';
								element['lowerValue'] = '';
							});
							this.storage.set('partnerDetails', undefined);
							
						}
					})
			);
			// })
		} else{
			response = exsistingValue;
			setTimeout(() => {
				// this.loader = false;
			}, 500);
			this.bindDashboardCardValue(response['objGetAAADashboardDataBody'][0]);
			// this.bindDashboardCardValue(response);
		}
	}

	bindDashboardCardValue = (value: any) => {
		this.Cards.forEach(element => {
			if (element['type'] == 'aum') {
				element['value'] = this.commonService.numberFormatWithCommaUnit(value['TotalAum']);
				element['title'] = '';
				element['lowerValue'] = '';
			} else if (element['type'] == 'clients') {
				element['value'] = this.commonService.numberFormatWithCommaUnit(value['TotalClient']);
				element['title'] = '';
				element['lowerValue'] = '';
			} else if (element['type'] == 'brokerage') {
				element['value'] = this.commonService.numberFormatWithCommaUnit(value['YTDBrokerage']);
				element['title'] = '';
				element['lowerValue'] = '';
			} else if (element['type'] == 'afyp') {
				element['value'] = this.commonService.numberFormatWithCommaUnit(+value['MTD'] + +value['YTD']);
				element['title'] = '';
				element['lowerValue'] = '';
			} else {
				element['value'] = this.commonService.numberFormatWithCommaUnit(0);
				element['title'] = '';
				element['lowerValue'] = '';
			}
		});
	}

	async displyPopupLeadsStats() {
		this.commonService.setClevertapEvent('Lead Stats Clicked', { 'PartnerCode': localStorage.getItem('userId1') });
		const modal = this.modalController.create({
			component: LeadsStatusModalComponent,
			cssClass: 'leads_status_modal',
			backdropDismiss: true
		});
		return (await modal).present();
	}

	async kpiDashboard() {
		this.userChannel = localStorage.getItem('userChannel');
		this.storage.get('userID').then((userID) => {
			this.storage.get('bToken').then(token => {
				if(this.userChannel === 'Premia'){
				this.subscription.add(this.dashBoardService
					.incentivesPremiaRMs(token, userID)
					.subscribe((res: any) => {
						if (res['Head']['ErrorCode'] == 0) {
							this.kpiDashboardObj = res['Body'][0];
							this.widthProgressBar = (this.kpiDashboardObj['newmeetachv'] / this.kpiDashboardObj['newmeettarget']) * 100;
						}
						else{
							this.kpiDashboardObj=[];
						}
					}))
				}
				else if(this.userChannel === 'Franchisee'){
					this.subscription.add(this.dashBoardService
						.kpiDashboardBDM(token, userID)
						.subscribe((res: any) => {
							if (res['Head']['ErrorCode'] == 0) {
								this.kpiDashboardObj = res['Body'][0];
								this.widthProgressBar = (this.kpiDashboardObj['newmeetachv'] / this.kpiDashboardObj['newmeettarget']) * 100;
							}
							else{
								this.kpiDashboardObj=[];
							}
						}))
					}
			})
		})
	}

	async displyPopupYourKPI() {
		//console.log('YourKPI_clicked', 'YourKPI_clicked');
		this.commonService.setClevertapEvent('Your KPI Clicked', { 'PartnerCode': localStorage.getItem('userId1') });
		const modal = this.modalController.create({
			component: YourKpiModalComponent,
			componentProps: {datas: this.kpiDashboardObj},
			cssClass: 'your_kpi_modal',
			  backdropDismiss: true
		  });
		  return (await modal).present();
		}
		
	async openSearchOption() {
		if(this.searchNameList == null){
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.tokenValue = token;
						this.getMappingRM(token)
					})
				}
				else{
					this.storage.get('subToken').then(token => {
						this.tokenValue = token;
						this.getMappingRM(token)
					})
				}
			})
		}
	
		this.commonService.setClevertapEvent('Investment_Opportunities');
		const modal = await this.modalController.create({
			component: SearchComponent,
			cssClass: 'search-modal',
			componentProps: {
				HealthCheckupList: this.searchNameList
				//smallCase: smallCase ? smallCase : false
			}
		});
		modal.onDidDismiss().then(data => {
			if (data["data"]) {
				const response = data['data'];
				if (response['selectedValue'] === null) return;

				this.selectedClientCode = response['selectedValue'];
				this.storage.get('userID').then((userID) => {
					this.storage.get('userType').then(type => {
						if (type === 'RM' || type === 'FAN') {
							this.storage.get('bToken').then(token => {
								this.tokenValue = token;
								this.getIpoDataLink(token, this.selectedClientCode, userID)
							})
						} else {
							this.storage.get('subToken').then(token => {
								this.tokenValue = token;
								this.getIpoDataLink(token, this.selectedClientCode, userID)
							})
						}
					})
				})
			}
		})
		return await modal.present();
	}

	/**
	 * To get oneUp IPO details url.
	 * @param token 
	 * @param clientCode 
	 * @param issueCode 
	 */
	getIpoDataLink(token: any, clientCode: any, issueCode: any) {
		this.dashBoardService.getOneUpIPOLink(token, clientCode, issueCode).subscribe((res: any) => {
 			if (res['statusCode'] == 0) {
				this.commonService.setClevertapEvent('Investment_Opportunities');
				this.addEventsListenerFun(res['resultData']['url'])
			} else {
				if (res['resultData']) {
					this.toast.displayToast(res['resultData']);
				}
			}
		},
			// error => {
			// 		console.error(error);
			// 		this.toast.displayToast(error);
			// }
		)
	}

	
	addEventsListenerFun(url: any) {
		if (this.commonService.isApp()) {
			var ref = cordova.InAppBrowser.open(url, '_blank');
			ref.addEventListener('loadstart', this.loadstartCallback);
			ref.addEventListener('loadstop', this.loadstopCallback);
			ref.addEventListener('loaderror', this.loaderrorCallback);
			ref.addEventListener('exit', this.exitCallback);
		} else {
			window.open(url, '_blank');
		}
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

	onFeedClick(){
		window.open("https://docs.google.com/forms/d/1o2hHuWsOSV6yVQYxormJQu3iYVMFY8VAsRsyTjdJj5w/edit", '_blank');
	}

	getPartnerPoint(token: any) {
		this.clientCategory = null;
		this.dashBoardService.getPartnerDetail(token, this.userID).subscribe((res: any) => {
		    if (res['Head']['ErrorCode'] == 0) {
				this.storage.get('empCode').then(code => {
					if(code){
						this.ClientName = code == localStorage.getItem('userId1') ? localStorage.getItem('userName') : code;
						this.loginUserName = code == localStorage.getItem('userId1') ? localStorage.getItem('userName') : code;
					}
					else{
						this.ClientName = res['Body'][0].PartnerName;
						this.loginUserName = res['Body'][0].PartnerName;
					}
				});
				// this.ClientName = res['Body'][0].PartnerName
				this.clientCategory = res['Body'][0].Category
				this.getPeopleLike(token,this.userID,res['Body'][0])
			}
			else{
				this.performance = [
					{ type: 'New Acquisition', value1: '0', value2: '0' },
					{ type: 'Brokerage', value1: '0', value2: '0' },
					{ type: 'Broking Margin', value1: '0', value2: '0' },
					{ type: 'Cross Sell AUM', value1: '0', value2: '0' },
					{ type: 'Premium Collected', value1: '0', value2: '0' },
				]
			}
		})
		/* const res = {
			"Head": {
				"ResponseCode": "GetPartnerPoints",
				"ErrorCode": 0,
				"ErrorDescription": ""
			},
			"Body": [
				{
					"PartnerType": "RM",
					"PartnerCode": "C66350",
					"PartnerName": "Jiaul Seikh",
					"PartnerState": "WEST BENGAL",
					"PartnerCity": "BURDWAN",
					"PartnerPin": "",
					"DOJ": "9/2/2020 12:00:00 AM",
					"Tier": 3,
					"Year": 2021,
					"Quarter": 2,
					"KYC": 0,
					"PayIN": 0,
					"GrossIR": 0,
					"InsurancePremium": 7,
					"CrossSales": 0,
					"TotalPoints": 7,
					"Vintage": 15,
					"Category": "Bronze"
				}
			]
		}

		if (res['Head']['ErrorCode'] == 0) {
			this.ClientName = res['Body'][0].PartnerName
			this.clientCategory = res['Body'][0].Category
		} */

	}

	getPeopleLike(token: any, userId: any, resData: any) {
		//this.peopleLikeTable = []
		const passObj = {
			"PartnerCode": userId,
			"Tops": "5",
			"Tier": resData['Tier'],
			"Category": resData['Category'],
			"VintageMonth": resData['Vintage']
		}
		this.dashBoardService.getPeerPoints(token, passObj).subscribe((res: any) => {
 			if (res['Head']['ErrorCode'] == 0) {
				this.peopleLikeYouData = res['Body'];
 				//`/Date(${prev})/`  `Projected brok. by. ${this.dueDate}  ${this.dueAmount}`
				this.performance = [
					{ type: 'New Acquisition', value1: resData['KYC'], value2: res['Body'][0]['PeerKYC']},
					{ type: 'Brokerage', value1: resData['GrossIRAMT'], value2: res['Body'][0]['PeerGrossBrokerage']},
					{ type: 'Broking Margin', value1: resData['PayINOUTAMT'], value2: res['Body'][0]['PeerNetBrokingMargin']},
					{ type: 'Cross Sell AUM', value1: resData['CrossSalesAMT'], value2: res['Body'][0]['PeerCrossSellAUM']},
					{ type: 'Premium Collected', value1: resData['InsurancePremiumAMT'], value2: res['Body'][0]['PeerInsuranceAFYP']},
				]
			}
		})
	}

	IpoList(token: any) {
		this.IpoCards = [];
		this.subscription.add(
			this.dashBoardService
				.getIPOList(token)
				.subscribe((res: any) => {				 
					if (res['statusCode'] == 200 && res['isSuccess'] == true) {
						if (res['resultData'] && res['resultData'].length > 0) {
							let obj = { "PartnerCode": localStorage.getItem('userId1'), "ProductName": 'all', "ProductType": 'all' };
							this.dashBoardService.getClientCount(token, obj)
								.subscribe((countRes: any) => {
									if (countRes) {
										this.topLeadData = res['resultData'].map((ele: any) => {
											const lead = {
												id: ele.ipid,
												name: ele.schname,
												productType: ele.category === 'BOND' ?  'NCD' : ele.category,
												issueCode: ele.issuecode,
												clientCount:countRes && countRes.Body ? _.find(countRes.Body, function (i: any) {
													if (i.product_Name === ele.issuecode) {
														return i
													}
												}) : undefined,
												isPreBid : new Date() < new Date(ele.opndt),
												date: new Date() < new Date(ele.opndt) ? ele.opndt : ele.clsdt,
												bidsClose: this.commonService.getToday(new Date(ele.clsdt)),
												lotSize: ele.lotsize,
												cutOff: ele.cutoff * ele.lotsize,
												lowPrice: ele.lowprice,
												highPrice: ele.highprice,
												minInvestAmt: this.commonService.numberFormatWithCommaUnit(ele.noOfMandatoryBonds * ele.highprice),
												maxYield:ele.maxYield,
												issueSize: this.calculateIssueQty(ele.issueQty,ele.highprice),
												agency: ele.ratingAgency,
												rating: ele.bondRating,
												bidsOpen: this.commonService.getToday(new Date(ele.opndt)),

											}
											return lead;
										})
										let arr: any= [];
										let arr1: any = [];
										this.topLeadData.forEach(element => {
											if (element && element.clientCount && element.clientCount.client_interested_Count) {
												arr.push(element);
											} else {
												arr1.push(element);
											}
										});
										arr.sort((a: any, b: any) => {
											return a.clientCount.client_interested_Count < b.clientCount.client_interested_Count ? 1 : -1
										});
										this.topLeadData = arr.concat(arr1);
										this.getLogo();
										this.timerCalculation(this.topLeadData);
										this.storage.set('topLeads', this.topLeadData);
									}
								});
							// ----------------------------//
							let today = moment(new Date(), "M/D/YYYY H:mm").valueOf();
							let closingDates = moment(new Date("2023-11-22T23:50:00")).valueOf();
							res['resultData'].forEach((element: any) => {
								let timeDiff = moment(new Date(element['clsdt'])).valueOf() - today;
								this.IpoCards.push({
									opndt: element['opndt'] ? moment(element['opndt']).format("Do MMM") : '',
									clsdt: element['clsdt'] ? moment(element['clsdt']).format("Do MMM") : '',
									maxYield: element['maxYield'],
									minInvest: element && element['lowprice'] && element['noOfMandatoryBonds'] ? element['lowprice'] * element['noOfMandatoryBonds'] : '0',
									category: element['category'],
									schname: element['schname'],
									lotsize: element['lotsize'],
									lowprice: element['lowprice'],
									timeDiff: Math.floor((timeDiff) / 1000),
									issueCode: element['issuecode'] ? element['issuecode'] : undefined
								})
							});
							// this.timerDataCall(this.IpoCards);		res was removed from function
							this.timerDataCall();
						}
						else {

						}
					}
					else {
						this.topLeadData = [];
						this.IpoCards = [];
					}
				}))
	}

	



	/**
	 * To calculate issue size on lead-details page.
	 * @param qty 
	 * @param hp 
	 * @returns 
	 */
	calculateIssueQty(qty: any, hp: number) {
		let unit = qty.split(" ")[1];
		let res;
		if (unit && unit === 'cr.') {
			res = this.commonService.numberFormatWithCommaUnit((qty.split(" ")[0] * 10000000) * hp);
		} else if (unit === 'l') {
			res = this.commonService.numberFormatWithCommaUnit((qty.split(" ")[0] * 100000) * hp);
		} else if (unit === 'k') {
			res = this.commonService.numberFormatWithCommaUnit((qty.split(" ")[0] * 1000) * hp);
		} else {
			res = this.commonService.numberFormatWithCommaUnit(parseInt(qty.split(" ")[0]) * hp);
		}
		return res;
	}

	/**
	 * Calculate timer string for top lead's card. 
	 * @param date 
	 */
	timerCalculation(leads: any):any {
		leads.forEach((element: any) => {
			var date_now = new Date().getTime()
			element.date = new Date(element.date);
			var delta = element.isPreBid ? Math.abs(date_now - element.date) / 1000 : Math.abs(element.date - date_now) / 1000;
			// calculate (and subtract) whole days
			var days: any = Math.floor(delta / 86400);
			delta -= days * 86400;
			// calculate (and subtract) whole hours
			var hours: any = Math.floor(delta / 3600) % 24;
			delta -= hours * 3600;
			// calculate (and subtract) whole minutes
			var minutes: any = Math.floor(delta / 60) % 60;
			delta -= minutes * 60;
			// what's left is seconds
			var seconds:any = delta % 60;

			if (days >= 1) {	
				element.isDay = true;
				element.timerText = element.isPreBid ? `Open in ${parseInt(days)} days` : `Ends in ${parseInt(days)} days`;
			}
			else {
				element.isDay = false;		
				element.timerText = element.isPreBid ? `Open in ${parseInt(hours)}:${parseInt(minutes)}:${parseInt(seconds)}` : `${parseInt(hours)}:${parseInt(minutes)}:${parseInt(seconds)}`;
			}
			
		});
		clearInterval(this.leadTimer);
		this.leadTimer = setInterval(() => {
			this.timerCalculation(this.topLeadData);
		}, 1000);		 
	};		
	
	/**
	 * To get logo for top leads
	 */
	getLogo() {
		this.topLeadData.forEach(ele => {
			axios.get(this.clientCount.onupUrl + ele.issueCode)
				.then(function (response) {
					// handle success		
					if (response && response.data && response.data.statusCode == 200) {
						ele.logo = response.data.result.logo;
						ele.pdfReport = response.data.result.report_file;
					}
				})
				.catch(function (error) {
					// handle error
					// console.log(error);
				})
		})
	}
	
	//Timeer display for IPO Cards
	// timerDataCall(res) {		res is never used
	timerDataCall() {
		this.IpoCards.forEach(element => {
			if (element.timeDiff > 0) {
				element.timeDiff = (Math.round(element.timeDiff) - 1);
				element.h = Math.floor(element.timeDiff / 3600);
				element.m = Math.floor(element.timeDiff % 3600 / 60) < 10 ? "0" + Math.floor(element.timeDiff % 3600 / 60) : Math.floor(element.timeDiff % 3600 / 60);
				element.s = Math.floor(element.timeDiff % 3600 % 60) < 10 ? "0" + Math.floor(element.timeDiff % 3600 % 60) : Math.floor(element.timeDiff % 3600 % 60);
			}

		});
		clearTimeout(this.timerCall);

		this.timerCall = setTimeout(() => {
			// this.timerDataCall(this.IpoCards);	res was removed from function
			this.timerDataCall();
		}, 1000);


	}

	getCommHeaderDetail() {
		this.marService.getCommonHead().subscribe((res: any) => {
			if (res && res['Data'] && res['Data'].length > 0) {
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
		}
		})
		clearTimeout(this.clearHeaderDetails);
		
			if(localStorage.getItem('indexAPI') == "true"){
				this.clearHeaderDetails = setTimeout(() => {
				this.getCommHeaderDetail();
			}, 2000);
		}
			
		
	}

	onHelpClick(){
		if (localStorage.getItem('crmToken')) {
			this.commonService.setClevertapEvent('Help_Clicked');
			this.router.navigate(['/help-support']);
		} else {
			this.serviceFile.getCrmToken().subscribe((res:any) => {
				localStorage.setItem('crmToken', res['Body']['Token']);
				this.commonService.setClevertapEvent('Help_Clicked');
				this.router.navigate(['/help-support']);
			});
		}
	}

	goToNotification() {
		this.router.navigate(['/notification']);
	}

	goToSearch() {
		//this.router.navigate(['/add-script']);
		this.router.navigate(['/dashboard-clients']);
		
	}

	goToProfile(){
		this.router.navigate(['/my-profile'])
	}

	goBack() {
		window.history.back();
	}

	businessListRedirect(){
		this.commonService.setData(JSON.stringify(this.businessCardsMobile));
		this.router.navigate(['/business-opps-list'])
	}

	// toggle people like table visibility for mobile
	togglePeopleLike() {
		this.isPeopleLikeVisible = !this.isPeopleLikeVisible;
	}


	// redirect to relevant pages
	redirect(path: any) {
		if (path == 'dashboard-aum') {
			this.commonService.setClevertapEvent('Dashboard_AUM', { 'Login ID': localStorage.getItem('userId1') });
		} else if (path == 'dashboard-clients') {
			this.commonService.setClevertapEvent('Dashboard_Clients', { 'Login ID': localStorage.getItem('userId1') });
		} else if (path == 'dashboard-brokerage') {
			this.commonService.setClevertapEvent('Dashboard_Brokerage', { 'Login ID': localStorage.getItem('userId1') });
		}
		this.isSaveList = 'fill';
		this.router.navigate([path]);
		this.storage.set('hierarchyList', this.selectOptionArr);
		localStorage.setItem('isHierarchySave', this.isSaveList);
	}

	// Business opportunities pop up 
	async opportunitiesDetails(type: any, passIndex: any) {
		let modal;
		if (type == 'BouncedSIPs' || type == 'CeasedSIPs' || type == 'MaturingFDCount') {
				modal = await this.modalController.create({
					component: DashbordSipComponent,
					componentProps: { option: type, srNo: passIndex },
					cssClass: 'superstars score business-opportunities',
					// swipeToClose: true,		review. was getting error. deprecated
					mode:  this.platfrm.is('desktop') == true ? "md": "ios"
			});
		}

		else {
			if (type == 'Last30bday') {
				//console.log('HavingBirthdaypast30days_Clicked', 'HavingBirthdaypast30days_Clicked');
        		this.commonService.setClevertapEvent('HavingBirthdaypast30days_Clicked', { 'PartnerCode': localStorage.getItem('userId1') });
			}else if(type == 'P1P2Clients'){
				//console.log('P1P2clientsnotmet_clicked', 'P1P2clientsnotmet_clicked');
				this.commonService.setClevertapEvent('P1P2clientsnotmet_clicked', { 'PartnerCode': localStorage.getItem('userId1') });
			}
			else if(type == 'otherclients'){
				//console.log('Otherclientsnotmet_clicked', 'Otherclientsnotmet_clicked');
				this.commonService.setClevertapEvent('Otherclientsnotmet_clicked', { 'PartnerCode': localStorage.getItem('userId1') });
			}

			modal = await this.modalController.create({
				component: BusinessOpportunitiesDetailsComponent,
				componentProps: { option: type, srNo: passIndex },
				cssClass: 'superstars score business-opportunities',
				// swipeToClose: true,		review. was getting error. deprecated
				mode:  this.platfrm.is('desktop') == true ? "md": "ios"
			});
		}

		modal.present();
	}

	select() {
		if(this.toggleParam == 'Self'){
			return;
		}
		this.selectOptionArr = [];
		this.selectOptionArrCopy = [];
		this.searchHierarchyList = '';

		this.isHierarchyLoad = true;
		this.isHierarchyshow = !this.isHierarchyshow;
		this.isDropDownVisible = true;
		this.storage.get('hierarchyList').then( list => {
			if (!list) {
				this.hierarchyList(this.tokenValue);
			}
			else{
				this.isHierarchyLoad = false;
			}
		}
	)
	}

	toggleSwitch(val: any){
		this.toggleParam = 'Hierarchy';
		localStorage.setItem('toggleSwitch','Hierarchy');
		this.commonService.setClevertapEvent('SelfTeam_Clicked', { 'Login ID': localStorage.getItem('userId1') });
		if(val == 'Self'){
			this.toggleParam = 'Self';
			localStorage.setItem('toggleSwitch','Self');
		}
	}

	closeBtn(){
		this.isHierarchyshow = false;
		this.isShowCross = false;
		this.isShowDrop = false;
		
	}

	async leadslideChanged(event: any) {
	// async leadslideChanged() {
		this.sliderIndex = await this.leadSlides?.nativeElement.swiper.activeIndex;
		if(this.leadSlides?.nativeElement.swiper.isEnd) {
			this.isLastIndex = true;
		};
	}

	async bannerChanged(ev: any) {
		this.sliderIndex = await this.bannerSlides?.nativeElement.swiper.activeIndex;
		if(this.bannerSlides?.nativeElement.swiper.isEnd) {
			this.isLastIndex = true;
		};
	}

	// bottom carousel
	async slideChanged(ev: any) {
		this.sliderIndex = await this.investSlides?.nativeElement.swiper.activeIndex;
		if(this.investSlides?.nativeElement.swiper.isEnd) {
			this.isLastIndex = true;
		};
	}

	nextBtn() {
		//this.leadSlides.slideNext();
	}

	prevBtn() {
		//this.leadSlides.slidePrev();
	}

	

	next() {
		//this.investSlides.slideNext();
	}

	prev() {
		//this.investSlides.slidePrev();
	}

	ionViewWillLeave() {
		clearTimeout(this.clearHeaderDetails);
		clearTimeout(this.timerCall);
		this.isDropDownVisible = false;
		localStorage.removeItem('indexAPI')
	}

	ngOnDestroy() {
		this.commonService.backbuttonUnsubscribeMethod();
		clearTimeout(this.timerCall);
		this.subscription = this.subscription.unsubscribe()
		this.helpToken.unsubscribe();
	}

	/**
	 * On click on IPO cards.
	 * @param data 
	 */
	onClickIPO(data: any) {
		let clientCode = localStorage.getItem("userId1");
		if (data && data.issueCode && clientCode) {
			this.storage.get('userID').then((userID) => {
				this.storage.get('userType').then(type => {
					if (type === 'RM' || type === 'FAN') {
						this.storage.get('bToken').then(token => {
							this.tokenValue = token;
							this.getIpoDataLink(token, clientCode, data.issueCode)
						})
					} else {
						this.storage.get('subToken').then(token => {
							this.tokenValue = token;
							this.getIpoDataLink(token, clientCode, data.issueCode)
						})
					}
				})
			})
		}
	}
	
	public iglcContest(token: any){
		this.dashBoardService
				.getIglcScoredetails(token, localStorage.getItem('userId1'))
				.subscribe((res: any) => {
					this.iglcList = res['Body'] && res['Body']['IGCLScoreMaster'] ? res['Body']['IGCLScoreMaster'] : [];

					this.imgPreview ="assets/svg/earning_lock.svg";
					this.imgPreview_1 ="assets/svg/earning_lock.svg";
					this.imgPreview_2 ="assets/svg/earning_lock.svg";
					this.imgPreview_3 ="assets/svg/earning_lock.svg";
 				
					if (res['Body'] == null) {
						this.Score = 0;	
						this.iglcScoreProgress = 0;
					}else{
						this.Score = parseFloat(res['Body']['IGCLScoreMaster'][0]['Score']);
						this.displayIGLCScore = this.convertFunc(this.iglcList[0]['Score']);
						this.iglcScoreProgress = this.Score/15000;
						
					}
						if(this.Score<0){
							this.Score = 0;
						} else if(this.Score == 15000){
							this.imgPreview ="assets/svg/earn_complete.svg";
							this.imgPreview_1 ="assets/svg/earn_complete.svg";
							this.imgPreview_2 ="assets/svg/earn_complete.svg";
							this.imgPreview_3 ="assets/svg/earn_complete.svg";
							this.isComplete_1 = true;
							this.isComplete_2 = true;
							this.isComplete_3 = true;
							this.isComplete_4 = true;
							this.isPoint_1 = false;
							this.isPoint_2 = false;
							this.isPoint_3 = false;
							this.isPoint_4 = false;
							this.isUnlock_1 = false;
							this.isUnlock_2 = false;
							this.isUnlock_3 = false;
							this.isUnlock_4 = false;
							this.isUnlock_5 = true;
							
						} else if(this.Score >=3000 && this.Score < 8000) {
							
							this.imgPreview_1 ="assets/svg/earn_complete.svg";
							this.isComplete_1 = true;
							this.isPoint_1 = false;
							this.isUnlock_1 = false;
							this.isUnlock_2 = false;
							this.isUnlock_3 = true;
							this.isUnlock_4 = false;
							this.isUnlock_5 = false;
							
						
						} 
						
						// else if(this.Score >=5000 && this.Score < 8000) {
						// 	this.imgPreview_1 ="assets/svg/earn_complete.svg";
						// 	this.imgPreview_2 ="assets/svg/earn_complete.svg";
						// 	this.isPoint_1 = false;
						// 	this.isComplete_1 = true;
						// 	this.isPoint_2 = false;
						// 	this.isComplete_2 = true;
						// 	this.isUnlock_1 = false;
						// 	this.isUnlock_2 = false;
						// 	this.isUnlock_3 = true;
						// 	this.isUnlock_4 = false;
						// 	this.isUnlock_5 = false;
							
						// }
						
						else if(this.Score >=8000 && this.Score < 15000 ){
						
							this.imgPreview_1 ="assets/svg/earn_complete.svg";
							this.imgPreview_2 ="assets/svg/earn_complete.svg";
							this.imgPreview_3 ="assets/svg/earn_complete.svg";
							this.isPoint_1 = false;
							this.isComplete_1 = true;
							this.isPoint_2 = false;
							this.isComplete_2 = true;
							this.isPoint_3 = false;
							this.isComplete_3 = true;
							this.isUnlock_1 = false;
							this.isUnlock_2 = false;
							this.isUnlock_3 = false;
							this.isUnlock_4 = true;
							this.isUnlock_5 = false;

						} else if(this.Score > 15000){
							this.Score = 15000;
							this.imgPreview ="assets/svg/earn_complete.svg";
							this.imgPreview_1 ="assets/svg/earn_complete.svg";
							this.imgPreview_2 ="assets/svg/earn_complete.svg";
							this.imgPreview_3 ="assets/svg/earn_complete.svg";
							this.isPoint_1 = false;
							this.isComplete_1 = true;
							this.isPoint_2 = false;
							this.isComplete_2 = true;
							this.isPoint_3 = false;
							this.isComplete_3 = true;
							this.isComplete_4 = true;
							this.isUnlock_1 = false;
							this.isUnlock_2 = false;
							this.isUnlock_3 = false;
							this.isUnlock_4 = false;
							this.isUnlock_5 = true;
							this.isPoint_4 = false;
						}
						
						return false;
					}						
					
                );
	}

	/**
	 * To get Fly High Contest Details
	 */
	public flyHighDetails(token: any) {
		this.dashBoardService.getFlyHighdetails(token, localStorage.getItem('userId1'), localStorage.getItem('userType'))
			.subscribe((res: any) => {
				if (res && res['Head'] && res['Head']['ErrorCode'] == 0) {
					this.showFlyHighSection = true;
					if (res['Body'] && res['Body']) {
						this.flyHighData = res['Body'];
						if (!this.flyHighRmSection) {
							this.isNegativebarNBAUM = Math.sign(this.flyHighData[0].EquityAUM) === -1 ? true : false;
							this.barIncrementa = parseInt(this.flyHighData[0].IncrementalGrossBrokerage) >= parseInt(this.flyHighData[0].IncrementalGrossBrokerageTarget) ? 100 : (this.flyHighData[0].IncrementalGrossBrokerage / this.flyHighData[0].IncrementalGrossBrokerageTarget) * 100;
							this.barNBAUM = this.isNegativebarNBAUM ? 0 : parseInt(this.flyHighData[0].EquityAUM) >= parseInt(this.flyHighData[0].EquityAUMTarget) ? 100 : (this.flyHighData[0].EquityAUM / this.flyHighData[0].EquityAUMTarget) * 100;
							this.barKyc = parseInt(this.flyHighData[0].Booster1Score) >= parseInt(this.flyHighData[0].Booster1Target) ? 100 : (this.flyHighData[0].Booster1Score / this.flyHighData[0].Booster1Target) * 100;
							this.barBooster2 = parseInt(this.flyHighData[0].Booster2Score) >= parseInt(this.flyHighData[0].Booster2Target) ? 100 : (this.flyHighData[0].Booster2Score / this.flyHighData[0].Booster2Target) * 100;
						}
					}
				} else {
					this.showFlyHighSection = false;
					this.barIncrementa = 0;
					this.barNBAUM = 0;
					this.barKyc = 0;
					this.barBooster2 = 0;
					this.flyHighData = [];
					// this.toast.displayToast(res['Head']['ErrorDescription']);
				}
			});
	}

	/**
	 * On click of download report from Fly High section.
	 */
	downloadFlyHighReport() {
		let info: any = [];
		if (this.flyHighData && this.flyHighData.length > 0) {
			let head = [["Partner Code", "Fan Name", "E2 Code", "E2 Name", "Incremental Gross Brokerage", "Incremental Gross Brokerage Target", "Net Equity AUM", "Net Equity AUM Target", "X Sell Collection", "X Sell Collection Target", "Wellness Score", "Wellness Target"]];
			this.flyHighData.forEach((element: any) => {
				info.push([element.FanCode, element.FanName, element.E2Code, element.E2Name, this.convertFunc(element.IncrementalGrossBrokerage), this.convertFunc(element.IncrementalGrossBrokerageTarget), this.convertFunc(element.EquityAUM), this.convertFunc(element.EquityAUMTarget), this.convertFunc(element.Booster1Score), this.convertFunc(element.Booster1Target),this.convertFunc(element.Booster2Score), this.convertFunc(element.Booster2Target)]);
			});
			this.commonService.exportDataToExcel(head[0], info, 'Fly High Report');
		} else {
			this.toast.displayToast('No Data Found');
		}
	}

	/* on click of download report from IGLC section.*/
	
	downloadIGLCReport() {
		let info: any = [];
		if (this.iglcList && this.iglcList.length > 0) {
			let head = [["Partner Code","IGLC Score"]];
			this.iglcList.forEach((element: any) => {
				info.push([element.FanCode, this.convertFunc(element.Score)]);
			});
			this.commonService.exportDataToExcel(head[0], info, 'IGLC-report');
		} else {
			this.toast.displayToast('No Data Found');
		}
	}

	convertFunc(val: any){
        if(val){
            let value = parseFloat(val);
            return parseFloat(value.toFixed(0));
        }
		return;
    }


	async displyPopupBrokerageControl() {
		const modal = this.modalController.create({
			component: BrokerageAccessControlModalComponent,
			cssClass: 'brokerage_access_panel_modal',
		  	backdropDismiss: true
		  });
		  return (await modal).present();
		}

		onMappingClick(){
			this.router.navigate(['manage-custom-mapping']);
		}

		/**
	 * on click of download report from Download Partner Categories section.
	 */
	downloadPartnerCategoriesReport() {
		let info: any = [];
		this.dataLoad = true;
		this.storage.get('RMHierarchy').then( list => {
			if (list && list.length > 0) {
				//console.log(list);
				let head = [["Partner Code", "‘Partner Name",  "Category"]];
				list.forEach((element: any) => {
					info.push([element.EmployeeCode, element.EmployeeName,  element.Category]);
				})
				this.commonService.exportDataToExcel(head[0], info, 'download-partner-categories-report');
				this.dataLoad = false;
			} else {
				this.toast.displayToast('No Data Found');
				this.dataLoad = false;
			}
		 })
		
	}

	shouldHideDiv(): boolean {
		const cutoffDate: Date = new Date('2023-12-15T05:59:59'); // Set the cutoff date and time
	
		return this.currentDate.getTime() > cutoffDate.getTime();
	  }

	equityBlockSegmentChanged(event: any) {
		//this.checkSegmentValue();
		 if(event == 'Overall'){
			localStorage.setItem('DashTabSelect','Overall');
		}
		else if (event == 'Mutual Funds') {
			localStorage.setItem('DashTabSelect','Mutual Funds');
		}
		else if (event == 'Equity') {
		 localStorage.setItem('DashTabSelect','Equity');
		}
		else if (event == 'Cross-Sell') {
		  localStorage.setItem('DashTabSelect','Cross-Sell');
		}
		
	
	  }
	
	  hideBrokerage(){
		this.storage.get('isFanChild').then(isChild => {
			if(isChild == 'true'){
			  this.notChildFan = true;
			  if(this.notChildFan){
				this.serviceFile.getAccessControlData().subscribe((res: any) => {
				  if (res['body']['Head']['ErrorCode'] === 0) {
					this.isBrokerageVisible = res['body']['Body'].some((item:any) => 
					item.Loginid === item.PartnerCode && item.DashboardBrkgRights === 'Y'
					);
				  }
				//   setTimeout(() => {
					if(this.isBrokerageVisible){
					  this.showBrokerage = true				
					} else {
						this.showBrokerage = false;
					}
				// },100)
				});
			  }
			}else{
			  this.showBrokerage = true;
			}
		  });
	  }
	  maskDashValueicon(){
		this.showHideDashboardValue = !this.showHideDashboardValue;
		this.showHidedashValue = this.showHideDashboardValue
		if(this.showHideDashboardValue) {
			this.buttonName = 'Hide';
			}
			else {
			this.buttonName = 'Show';
			}
	  }
}
