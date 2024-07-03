export const environment: any = {
    production: false,
    gatewayBaseUrl: "https://broking-uat-apigateway.indiainfoline.com/",
    //aaa
    aaaBase: "aaa/api/AAA/",
    aaa360: "aaa/api/Client360/",
    aaaBackOffice: "aaa/api/BackOffice/",
	  aaaSearch: "aaa/",
    aaaDashboard: "AAA/api/Dashboard/",
    //mf
	  mfApp: "MFApp/",
    //ipo -tt
  	ipo: "ipo/",
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
    tradeStURL:'https://tradestation-uat.azure-api.net/tradeapi/',
    forgotPasswordURL: 'http://boservicesuat.iifl.in/OTPGeneration/frmOTPGeneration.aspx',
    newsinfoUrl: 'https://api.indiainfoline.com/',
    app_version:1,
    mobile_app_version: '2.0.5',
    gstInvoiceRptId:'228',
    oneLoginOidc:'https://iifl-dev.onelogin.com/',
    bodyParams: {
        head: {
            appName: "IIFLMarkets",
            appVer: "1.0.20.0",
            key: "dL8mG4UwCfVYjzPWu8Rp",
            osName: "Android",
            requestCode: "IIFLMarRQGetNewMarketWatchV5"
        },
        body: {
			// Clientcode: 'ckv000rm',
			//MWName: "NIFTY50",
			// ClientLoginType: 0
			}
    },
  optionalHeaders: {
    UserId: 'Hek68PU5r76',
    Password: 'D86utK8Mn7'
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
  influencerKEY: {
		'Ocp-Apim-Subscription-Key': '7ae0a07b98074dfd8f040798f93b91fe',
	},
  panNoCookieKEY:{
		'Ocp-Apim-Subscription-Key': '9f898d142e8d4425971850273c2e3fc9'
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
}

/* FOR INVEST SCREEN  */
export const investObj: any = {
	fdUrl : {
		shriram: 'http://cos.stfc.me/cos/affiliate/Cos_SchemeDetails.aspx',
		icici: 'https://myicicihfcfd.com/index.jsp',
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
        // businessLoan: 'https://www.iifl.com/securities/business-partners/aaa/business-loan/', /* LIVE URL */
        personalLoan: 'https://uat.iifl.com/securities/business-partners/aaa/personal-loan/',
        // personalLoan: 'https://www.iifl.com/securities/business-partners/aaa/personal-loan/',
        homeLoan: 'https://uat.iifl.com/securities/business-partners/aaa/home-loan/index.php'
        // homeLoan: 'https://www.iifl.com/securities/business-partners/aaa/home-loan/'
	},
  narnolia: {
    url: 'https://broking-uat-apigateway.indiainfoline.com/tt/GenerateSessionIdForTTWeb',
  },
  nps:{
		url:'https://uatcra.kfintech.com/poponlineV2/POPAuthenticate'
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
  addUser: {
		getTokenURL: 'https://broking-uat-apigateway.indiainfoline.com/refernearn/TokenGenerate',
		vid: 'HK20SR5AC30',
		addClientURL: 'https://eauataz.iifl.in/Dashboard/RMDashboard_V1',
		addSubbrokerURL: 'https://subbrokeruataz.iifl.in/Dashboard/RMDashboard_V1',
		addNRI: 'https://nri-eaccount.indiainfoline.com/login',
		addICA: 'https://fankycuat.iifl.in/Login/RMDashboard_V1'
	},
}

/* FOR SUPER STAR */
export const superStarObj: any = {
	userID: 'shF24178l4Ksdj74Android219fff7sjktWue2qr4rrhdkd',
	password: 'thbmdsggjsd7e886ds5821kdhxgkrkbmqdudeklsse6d',
	key: 'eab16d83a9d0f05f9dd9d003a51a816781a67632'
}

export const researchReport: any = {
	morningMantra: {
		url: 'https://content.indiainfoline.com/_media/iifl/img/research_reports/pdf/morning-note.pdf'
	}
}

export const notification: any = {
	notificationLink : {
		link: 'http://swarajuat.iifl.in/tradeWeb/ExchangeMessages.aspx?App=0',
	}
}

export const ChartLink: any = {
	Chart : {
		basic: 'https://chartsuat.iiflsecurities.com/TV_Sw/basic-tv.html?type=future-curcom&period=1&range=d&exchange=',
		advanced:'https://chartsuat.iiflsecurities.com/TV_Sw/index.html?type=future-curcom&period=1&range=d&exchange=',
		detailIndChart:'https://chartsuat.iiflsecurities.com/TV_Sw/basic-tv.html?type=overview&period=1&exchange='
	},

}