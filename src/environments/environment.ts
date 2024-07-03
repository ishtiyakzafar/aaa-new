// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: any = {
	production: false,
	gatewayBaseUrl: "https://broking-uat-apigateway.indiainfoline.com/",
	//aaa
    aaaBase: "aaa/api/AAA/",
    aaa360: "aaa/api/Client360/",
    aaaBackOffice: "aaa/api/BackOffice/",
	aaaSearch: "aaa/",
    aaaDashboard: "AAA/api/Dashboard/",
    //ipo -tt
	ipo: "ipo/",
	//mf
	mfApp: "MFApp/",
    //zoho (iiflcrm)
	iiflCRM: "iiflcrm/",
    iiflCRMWebAPI: "iiflcrm/ZohoCRMAPI/api/ZohoCRMWebAPI/",
	iiflCRMFunctions: "iiflcrm/crm/v2/functions/",
	iiflCRMKbArticles: "iiflcrm/portal/api/kbArticles/",
    //tt
	ttUserActivity: "tt/TTWebAPIServices/UserActivity/",
	ttTrading: "tt/TTWebAPIServices/TradingRelatedAPI/",
	ttClient: "tt/TTWebAPIServices/Client/",
	ttScrip: "tt/TTWebAPIServices/Scrip/",
	ttCompanyInfo: "tt/TTWebAPIServices/CompanyInfo/",
	ttStockDetail: "tt/TTWebAPIServices/StockDetail/",
	ttDataInfo: "tt/TTWebAPIServices/DataInfo/",
	ttFundTransfer: "tt/TTWebAPIServices/FundTransfer/",
	ttAppBo: "tt/TTAppBo/Service1.svc/",
	//papi
	papiDerivative: "papi/IIFL/Derivative/Derivative.svc/",
	papiMarket: "papi/IIFL/Equity/market.svc/",
	papiMobileAPI: "papi/IIFL/mobileapi/mobapi.svc/",
	// subscription Key
	gatewaySubscriptionKey: {
		aaa: "b8aaa01e38b34007a02b4c8b7727271c",
		tt: "0b1b89fa022c47e08121b0144b1b305b",
		papi: "cd2744e3c6d14a1d90a849af907d158e",
		iiflcrm: "e33d222660f546a3be58421ca9a242dc",
		mf: "9f898d142e8d4425971850273c2e3fc9",
		ipo: "e6c610d5100f4b37b94381f61045a5f2"
	},
	
	apiUrl: 'http://swarajuat.iifl.in/',
	baseUrl: 'https://dataservice.iifl.in/aaa/uat/',
	// crmUrl: 'https://dataservice.iifl.in/aaa/uat/Zoho',
	crmUrl: 'https://ttavatar.iifl.in/ZohoCRMAPI/api/ZohoCRMWebAPI/',
	tradeStURL:'https://tradestation-uat.azure-api.net/tradeapi/',
	forgotPasswordURL: 'http://boservicesuat.iifl.in/OTPGeneration/frmOTPGeneration.aspx',
	newsinfoUrl: 'https://api.indiainfoline.com/',
	oneUrl: 'https://aaauat.indiainfoline.com/',
	oneLoginUrl: 'https://iifl-dev.onelogin.com/oidc/2',
	oneLoginKey: '4e39ee20-d6cf-013b-56ea-0684ad8f4d8e38189',
	gaKey: 'G-0SE9B30YMJ',
	paramsAPIKey: '446794970AAA1237ab394d176612f8c6',
	ledgerKey: 'dL8mG4UwCfVYjzPWu8Rp',
	boAppName: 'AAA',
	app_version:1,
	mobile_app_version: '2.0.5',
	clevertap_Key: 'TEST-K59-K79-6W6Z',
	gstInvoiceRptId:'228',
	oneLoginOidc:'https://iifl-dev.onelogin.com/',
	checkSumKEY: "AAA$2@RNEAP23!",
	genTokKEY: "ec6d5883c59c46768b6a1431913ab654",
	influencerKEY: {
		'Ocp-Apim-Subscription-Key': '7ae0a07b98074dfd8f040798f93b91fe',
	},
	imageBranding:{
		url: 'https://iifl.anchoredgebranding.com/home/AAALogin'
	},
	influencerUrl:{
	  'url':"https://bvnodestorage04.z23.web.core.windows.net/influencer",
	  'authkey': "IndiaInfoline_CliPlGtW3YlDElmt7Ed9kYXEJAHsvzMWA4L0V"
	},
	panNoCookieKEY:{
		'Ocp-Apim-Subscription-Key': '9f898d142e8d4425971850273c2e3fc9'
	},
	cookieKEYclientInteractionToken: 'Basic RTVEOEVBMEMtRjA5Ny00NUIzLUI0MzctRTkzQzMxQzJCNEZGOldXRVdFVFVFQEBGS0pG',
	cookieKEYclientInteraction: {
		'UserKey': 'aqwqeeqwhgywee3478290euryfgvbsncbvgt6437829iefjbvnjytyr3ueqidknjcfhgt783r'
	},
	bodyParams: {
		head: {
			appName: "IIFLMarkets",
			appVer: "1.0.20.0",
			key: "dL8mG4UwCfVYjzPWu8Rp",
			osName: "Android",
			requestCode: "IIFLMarRQGetNewMarketWatchV5"
		},
	body: {
			// Clientcode: localStorage.getItem('userID'),
			// Clientcode: 'ckv000rm',
			//MWName: "NIFTY50",
			// ClientLoginType: 0
			}
	},
	optionalHeaders: {
		UserId: 'Hek68PU5r76',
        Password: 'D86utK8Mn7',
	},
	headersParams: {
		UserId: 'Hek68PU5r76',
		Password: 'D86utK8Mn7',
	},
	nativeHeaders: {
		'Content-Type': 'application/json',
		'origin': 'http://iiflaaadev.brainvire.net',
		'clientID': localStorage.getItem('userID') ? localStorage.getItem('userID') : 'NA',
		'Pragma': 'no-cache',
		'Cache-Control': 'no-cache',
		'withCredentials': 'true',
	},
	nativeHeadersClientInteraction: {
		'Content-Type': 'application/json',
		'origin': 'http://iiflaaadev.brainvire.net',
		'clientID': localStorage.getItem('userID') ? localStorage.getItem('userID') : 'NA',
		'Pragma': 'no-cache',
		'Cache-Control': 'no-cache',
		'withCredentials': 'true',
		'UserKey': 'aqwqeeqwhgywee3478290euryfgvbsncbvgt6437829iefjbvnjytyr3ueqidknjcfhgt783r'
	},
	nativePanNoHeaders: {
		'Content-Type': 'application/json',
		'origin': 'http://iiflaaadev.brainvire.net',
		'clientID': localStorage.getItem('userID') ? localStorage.getItem('userID') : 'NA',
		'Pragma': 'no-cache',
		'Cache-Control': 'no-cache',
		'Ocp-Apim-Subscription-Key': '9f898d142e8d4425971850273c2e3fc9',
		'withCredentials': 'true'
	}
	
};

export const ChartLink: any = {
	Chart : {
		basic: 'https://charts.iiflsecurities.com/TV_Sw/basic-tv.html?type=future-curcom&period=1&range=d&exchange=',
		advanced:'https://charts.iiflsecurities.com/TV_Sw/index.html?type=future-curcom&period=1&range=d&exchange=',
		detailIndChart:'https://charts.iiflsecurities.com/TV_Sw/basic-tv.html?type=overview&period=1&exchange='
	},

}
// exchange msg button click on notification center
export const notification: any = {
	notificationLink : {
		link: 'http://swarajuat.iifl.in/tradeWeb/ExchangeMessages.aspx?App=0',
	}
}

/* FOR INVEST SCREEN  */
export const investObj: any = {
	fdURL : {
		shriram: 'http://cos.stfc.me/cos/affiliate/Cos_SchemeDetails.aspx',
		icici: 'https://www.icicihfc.com/fixed-deposit/fd-online-application-form/broker-details.html',
		bajaj: 'https://cont-sites.bajajfinserv.in/fixed-deposit-application-form'
	},
	bondURL: {
		irfc: 'https://kosmic.kfintech.com/IRFC/Brokers/default.aspx?k=A354A4',
		recBond: 'https://kosmic.kfintech.com/REC/brokers/default.aspx?k=C9AED7',
		pfcBond: 'https://kosmic.kfintech.com/PFC/Brokers/default.aspx?k=B6ACC6'
	},
	loans: {
		encryptKey: 'IIFLLead349898ii',
		ivs: 'IIFLLead349898ii',
		businessLoan: 'https://uat.iifl.com/securities/business-partners/aaa/business-loan/',
		personalLoan: 'https://uat.iifl.com/securities/business-partners/aaa/personal-loan/',
		homeLoan: 'https://uat.iifl.com/securities/business-partners/aaa/home-loan/index.php'
	},
	addUser: {
		getTokenURL: 'https://broking-uat-apigateway.indiainfoline.com/refernearn/TokenGenerate',
		vid: 'HK20SR5AC30',
		addClientURL: 'https://eauataz.iifl.in/Dashboard/RMDashboard_V1',
		addSubbrokerURL: 'https://subbrokeruataz.iifl.in/Dashboard/RMDashboard_V1',
		addNRI: 'https://nri-eaccount.indiainfoline.com/login',
		addICA: 'https://fankycuat.iifl.in/Login/RMDashboard_V1'
	},
	fp360 : {
		url: 'https://azbharat.indiainfoline.com/MoneywarePortal/ClientPortal/UI/SSOFPLogin',
	},
	smallCase : {
		// url: 'https://smallcases-dev.indiainfoline.com/',
		apiURL: 'https://portfolio.indiainfoline.com/smallcase/Home/GetAuthorize',
		redirectURL: 'https://smallcases-dev.indiainfoline.com'
	},
	
	narnolia: {
		url: 'https://broking-uat-apigateway.indiainfoline.com/tt/GenerateSessionIdForTTWeb',
	},
	nps:{
		url:'https://cra.kfintech.com/poponline/POPAuthenticate'
	},
	goldenPi: {
		url: 'https://uat.dealers.goldenpi.com',
		pid: '8b28d6ed6e84a28260f7ad791ad0a489'
	},
	narnoheader: {
		ocpKey: '0b1b89fa022c47e08121b0144b1b305b'
	},	
	narnoliaRealTimeMap: {
		url: 'https://broking-uat-apigateway.indiainfoline.com/tt/InsertClientCodeAppSourceMob',
	},
	offlineIPO : {
		url: 'http://internaladminuat.iifl.in/OfflineIPO/OfflineIPOEntry.aspx',
	},
	onlineIPO : {
		apiURL: 'https://portfolio.indiainfoline.com/ipocookie/api/Home/GetAuthorize',
		url: 'https://myaccountuat.iifl.in/myaccount/IPO.aspx',
		domain: '.iifl.in'
	},
	offlineNCD : {
		url: 'https://internaladminuat.iifl.in/offlineipo/OfflineBondEntry.aspx',
		domain: '.iifl.in'
	},
	downloadNCD : {
		url: 'https://appserver.indiainfoline.com/ncd/IIFLBondBrokerID.aspx?id=IIFL'
	},
	financialHealth : {
		url: 'https://swarajuat.iifl.in/CIBILWeb?business=securities&utm_source=iiflmarketsapp',
		// appFinancialKey: 'Ap!Cib!lWEb@pR0d7294',
		// encryptKey: 'Nq6tK2Jy^2Md#73v'
		appFinancialKey: 'Ap!C!bilWeB@Uat6379',
		encryptKey: 'Mt5zD9Hh$6mA@87t'
	},
	mutualFund: {
		url: 'http://mfapps.iifl.in/MFOnline/Login/MFDeeplink'
	},
	insurance: {
		url: 'https://iifl.riskcovry.com/',
		encryptKey: 'c5e00c8bed59e6b7eaaf1593fbc28793',
		ivs: 'dea11e5bc57f9c9d',
		partnerCode: 'IFAAA'
	},
	goalCalculator:{
		url: 'http://mfapps.iifl.in/MFOnline/Goal',	
	},
	iiflBuzz:{
		url: 'http://beta.indiainfoline.com/buzz-web' 
	}
}

export const researchReport: any = {
	morningMantra: {
		url: 'https://content.indiainfoline.com/_media/iifl/img/research_reports/pdf/morning-note.pdf'
	}
}

/* FOR SUPER STAR */
export const superStarObj: any = {
	userID: 'shF24178l4Ksdj74Android219fff7sjktWue2qr4rrhdkd',
	password: 'thbmdsggjsd7e886ds5821kdhxgkrkbmqdudeklsse6d',
	key: 'eab16d83a9d0f05f9dd9d003a51a816781a67632'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
