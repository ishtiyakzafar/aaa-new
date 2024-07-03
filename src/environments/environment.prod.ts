export const environment: any = {
	production: true,
	gatewayBaseUrl: "https://broking-apigateway.indiainfoline.com/",
	//aaa
    aaaBase: "aaa/api/AAA/",
    aaa360: "aaa/api/Client360/",
    aaaBackOffice: "aaa/api/BackOffice/",
	aaaSearch: "aaa/",
    aaaDashboard: "AAA/api/Dashboard/",
	//mf
	mfApp: "MFApp/",
    //ipo
	ipo: "ipo/",
    //zoho (iiflcrm)
	iiflCRM: "iiflcrm/",
    iiflCRMWebAPI: "iiflcrm/ZohoCRMAPI/api/ZohoCRMWebAPI/",
	iiflCRMFunctions: "iiflcrm/crm/v2/functions/",
	iiflCRMKbArticles: "iiflcrm/portal/api/kbArticles/",
    //tt
	ttUserActivity: "tt/TT/Broking/UserActivity/",
	ttTrading: "tt/TT/Broking/TradingRelatedAPI/",
	ttClient: "tt/TT/Broking/Client/",
	ttScrip: "tt/TT/Broking/Scrip/",
	ttCompanyInfo: "tt/TT/Broking/CompanyInfo/",
	ttStockDetail: "tt/TT/Broking/StockDetail/",
	ttDataInfo: "tt/TT/Broking/DataInfo/",
	ttFundTransfer: "tt/TT/Broking/FundTransfer/",
	ttAppBo: "tt/Mob/Service1.svc/",
	//papi
	papiDerivative: "papi/IIFL/Derivative/Derivative.svc/",
	papiMarket: "papi/IIFL/Equity/market.svc/",
	papiMobileAPI: "papi/IIFL/mobileapi/mobapi.svc/",
	// subscription Key
	gatewaySubscriptionKey: {
		aaa: "3ad8f2a045f249c698d963306b3ea429",
		tt: "7bf52985ac5d4d96a3140eb429cf202f",
		papi: "62de6972c56a486c99d18854010b7a85",
		iiflcrm: "e31d1bbb2d814ceea79b43b9b10b01f2",
		mf: "19ac39d53cab4a73bdbb660269c511a6",
		ipo: "80821536e75444f9abcb09a4ec9558aa"
	},

	apiUrl: 'http://swarajuat.iifl.in/',
	baseUrl: 'https://dataservice.iifl.in/aaa/prod/',
	tradeStURL:'https://swaraj.indiainfoline.com/MFAPP/Service1.svc/',
	forgotPasswordURL: 'https://attendance.indiainfoline.com/OTPGeneration/frmOTPGeneration.aspx',
	newsinfoUrl: 'https://api.indiainfoline.com/',
	oneUrl: 'https://aaapreprod.indiainfoline.com/',
	oneLoginUrl: 'https://iifl.onelogin.com/oidc/2',
	oneLoginKey: '343c66c0-042d-013c-9294-4e2b35e631b538188',
	gaKey: 'G-E2MG30GF1R',
	paramsAPIKey: '94970AAAWEB1237ab394d176612',
	ledgerKey: '2cccc59bdab77bace6189d001f96487e',
	boAppName: 'AAAWEB',
	app_version:1,
	mobile_app_version: '2.0.5',
	clevertap_Key: 'R59-K79-6W6Z',
	gstInvoiceRptId:'239',
	oneLoginOidc:'https://iifl.onelogin.com/',
	checkSumKEY: "AAA$2@RNEAP23PD!",
	genTokKEY: "21521eb341554d6786940cea7f80cc94",
	influencerKEY: {
		'Ocp-Apim-Subscription-Key': '473f9dc89d2148c09cbb319a935d77ae',
	},
	influencerUrl:{
		'url':"https://aaaclippreprod.indiainfoline.com/influencer",
		'authkey': "IndiaInfoline_CliPbE8LRqhCs457F827kfkSRvMYblaZ4kH"
	},
	imageBranding:{
		url: 'https://iifl.anchoredgetechno.com/Home/AAALogin'
	},
	panNoCookieKEY:{
		'Ocp-Apim-Subscription-Key': '19ac39d53cab4a73bdbb660269c511a6'
	},
	cookieKEYclientInteractionToken: 'Basic N0FFNzI1RTgtOThCOS00MUQ3LUE2RkUtOUZFN0MxNjcyRjFGOk9ESCVFS0hGQHdlJUpG',
	cookieKEYclientInteraction: {
		'UserKey': 'rhfs67r237yhbfgtrufgindjksfhieforet438909u2rnvb6746tgfb74r357425642rqdrd3'
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
			// Clientcode: "ckv000rm",
			// MWName: "NIFTY50",
			// ClientLoginType: 0
		}
	},
	optionalHeaders: {
		UserId: 'YaP29KW2g56',
        Password: 'H63prL2Nm8'
	},
	headersParams: {
		UserId: 'YaP29KW2g56',
		Password: 'H63prL2Nm8',
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
		'UserKey': 'rhfs67r237yhbfgtrufgindjksfhieforet438909u2rnvb6746tgfb74r357425642rqdrd3'
	},
	nativePanNoHeaders: {
		'Content-Type': 'application/json',
		'origin': 'http://iiflaaadev.brainvire.net',
		'clientID': localStorage.getItem('userID') ? localStorage.getItem('userID') : 'NA',
		'Pragma': 'no-cache',
		'Cache-Control': 'no-cache',
		'Ocp-Apim-Subscription-Key': '19ac39d53cab4a73bdbb660269c511a6',
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
		link: 'https://ttweb.indiainfoline.com/Trade/ExchangeMessages.aspx?App=0',
	}
}


/* FOR INVEST SCREEN  */
export const investObj: any = {
	fdURL : {
		shriram: 'https://cos.stfc.in/cos/affiliate/cos_schemedetails.aspx',
		icici: 'https://www.icicihfc.com/fixed-deposit/fd-online-application-form/broker-details.html',
		bajaj: 'https://cont-sites.bajajfinserv.in/fixed-deposit-application-form'
	},
	// FDUrl : {
	// 	shriram: 'https://cos.stfc.in/cos/affiliate/cos_schemedetails.aspx',
	// 	icici: 'https://myicicihfcfd.com/index.jsp',
	// 	bajaj: 'https://cont-sites.bajajfinserv.in/fixed-deposit-application-form'
	// }
	bondURL: {
		irfc: 'https://kosmic.kfintech.com/IRFC/Brokers/default.aspx?k=A354A4',
		recBond: 'https://kosmic.kfintech.com/REC/brokers/default.aspx?k=C9AED7',
		pfcBond: 'https://kosmic.kfintech.com/PFC/Brokers/default.aspx?k=B6ACC6'
	},
	loans: {
		encryptKey: 'IIFLLead349898ii',
		ivs: 'IIFLLead349898ii',
		businessLoan: 'https://www.iifl.com/securities/business-partners/aaa/business-loan/',
		personalLoan: 'https://www.iifl.com/securities/business-partners/aaa/personal-loan/', /* LIVE URL */
		homeLoan: 'https://www.iifl.com/securities/business-partners/aaa/home-loan/' /* LIVE URL */
	},
	addUser: {
		getTokenURL: 'https://broking-apigateway.indiainfoline.com/refernearn/TokenGenerateForCOBD',
		vid: 'AS30RH5KC20',
		addClientURL: 'https://eaccount.indiainfoline.com/Dashboard/RMDashboard_V1',
		addSubbrokerURL: 'https://subbroker-franchisee.iifl.com/Dashboard/RMDashboard_V1',
		addNRI: 'https://nri-eaccount.indiainfoline.com/login',
		addICA: 'https://fankyc.iifl.in/Login/RMDashboard_V1'
	},
	fp360 : {
		url: 'https://fp360.iifl.com/ClientPortal/UI/SSOFPLogin',
	},
	smallCase : {
		// url: 'https://smallcases.indiainfoline.com/brokerLogin?params=agent%3Ddealer_2',
		apiURL: 'https://portfolio.indiainfoline.com/smallcase/Home/GetAuthorize',
		redirectURL: 'https://smallcases.indiainfoline.com/brokerLogin?params=agent%3Ddealer_2'
	},
	narnolia: {
		url: 'https://broking-apigateway.indiainfoline.com/tt/TT/Broking/UserActivity/GenerateSessionIdForTTWeb'
	},
	nps:{
		url:'https://cra.kfintech.com/poponline/POPAuthenticate'
	},
	goldenPi: {
		url: 'https://dealers.goldenpi.com',
		pid: 'f64d6b4e8f11f013421e2b128841bcee'
	},
	narnoheader: {
		ocpKey: '7bf52985ac5d4d96a3140eb429cf202f'		// review. UAT
	},	
	narnoliaRealTimeMap: {
		url: 'https://broking-apigateway.indiainfoline.com/tt/TT/Broking/Client/InsertClientCodeAppSourceMob',	// review. UAT URL
	},
	offlineIPO : {
		url: 'https://ipo.iifl.in/IILIPO/offlineIPOentry.aspx',
	},
	onlineIPO : {
		apiURL: 'https://portfolio.indiainfoline.com/ipocookie/api/Home/GetAuthorize',
		url: 'https://reports.indiainfoline.com/Myaccount/IPO.aspx',
		domain: '.indiainfoline.com'
	},
	offlineNCD : {
		url: 'https://ipo.iifl.in/IILIPO/offlineBONDentry.aspx',
		domain: '.iifl.in'
	},
	downloadNCD : {
		url: 'https://appserver.indiainfoline.com/ncd/IIFLBondBrokerID.aspx?id=IIFL'
	},
	financialHealth : {
		url: 'https://financialhealth.iifl.com?business=securities&utm_source=iiflmarketsapp',
		appFinancialKey: 'Ap!Cib!lWEb@pR0d7294',
		encryptKey: 'Nq6tK2Jy^2Md#73v'
	},
	mutualFund: {
		url: 'https://mf.indiainfoline.com/MFOnline/Login/MFDeeplink'
	},
	insurance: {
		url: 'https://iiflinsurance.com',
		encryptKey: 'c5e00c8bed59e6b7eaaf1593fbc28793',
		ivs: 'dea11e5bc57f9c9d',
		partnerCode: 'IFAAA'
	},
	goalCalculator:{
		url: 'https://mf.indiainfoline.com/MFOnline/Goal',	
	},
	iiflBuzz:{
		url: 'https://www.indiainfoline.com/buzz-web' 
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