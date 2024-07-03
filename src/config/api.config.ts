import { environment } from '../environments/environment';


export const URLS = Object({
	
	checkSubscription: {			// not being used
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}AAASubscriptionStatus`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	addSpan: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}AddMarginDetails`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	calculateSpan: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}SpanMarginCalculation`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	marginDetails: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GetMarginDetails`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	delMargin: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}DeleteMarginDetails`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	resetMargin: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}ResetMargin`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	forgotPass: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}ForgotManagerPassword`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	swarajLogout: {
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}LogOut`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	backofficeLogout: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBackOffice}EmployeeLogoutV1`,
		key: ''
	},
	swarajCookie: {			// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}LoginRequestv2`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	backofficeCookie: {		// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}LoginAAAV2`,
		key: ''
	},
	mfAccountReportDownload: {
		url: `${environment.gatewayBaseUrl}${environment.mfApp}GetAccountStatementOfSD`,			//  MF
		vid: 'HK20SR5AC30'
	},
	narnolia:{
		key:'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl',
		appSourceNarnolia:'4612',
		appSource:'298'
	},
	grobox: {
		appSource: '274',
		url:'https://grobox-uat.trendlyne.com/grobox/api/auth/login/iifl/dealer/'
	},
	isAgreeCookie: {			// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ISAgreed`,
		key: ''
	},
	holdingCookie: {			// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}MyHolding`,
		key: ''
	},
	marketWatchList: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v3/GetNewMarketWatch`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	getMWatchList: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GetMWatchList`,
		key: ''
	},
	getMFeedList: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v4/MarketFeed`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	deleteScrip: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}SaveMWV1`,
		key: ''
	},
	setDefault: {				// code present, but not called. check
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}ChangeWLAttribute`,
		key: ''
	},
	clientList: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}ManagerWiseClientHoldingTrades`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	userType: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetUserTypeRequestV1`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	request1: {					// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}LoginRequestV2`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	request2: {					// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}LoginAAAV2`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	rmProfile: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ProfileDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	foliowise: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ClientMFIIFLData`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	dashboardReport: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ClientWireDashboardreport`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	mapRM: {
		url: `${environment.gatewayBaseUrl}${environment.ttClient}ManagerMappingv1`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	request3: {
		url: `${environment.gatewayBaseUrl}ClientLogin`,		// review. less hits confirm with aaa backend, not configured
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	subBroker: {				// no usage in code. check		
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}SubBrokerLoginRequestV4`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	subBrokerMap: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetClientSubBrokerMappingRequestV1`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	gainers: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GainerLooser`,
		key: ''
	},
	changePswd: {		// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}ChangePassword`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	isAgree: {			// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ISAgreed`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	getDates: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}FutureScripDetails`,
		key: ''
	},
	getOptionsDate: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}OptionsScripExpiry`,
		key: ''
	},
	getOptionsDetails: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}OptionScripDetails`,
		key: ''
	},
	holding: {			// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}HoldingAAA`,
		key: ''
	},
	tradeFor: {			// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.ttTrading}TradeBookV1`,
		key: '' 
	},
	superstar: {
		url: `${environment.gatewayBaseUrl}${environment.aaaSearch}superstarsStock/`,
		key: 'eab16d83a9d0f05f9dd9d003a51a816781a67632'
	},
	superStarIndex: {
		url: `${environment.gatewayBaseUrl}getSuperStarIndex/`,			// not in use, not configured on new gateway
		key: 'eab16d83a9d0f05f9dd9d003a51a816781a67632'
	},
	superStarShares: {
		url: `${environment.gatewayBaseUrl}custom/?superStarName=`,		// not in use, not configured on new gateway
		key: '2cccc59bdab77bace6189d001f96487e'
	},
	superStarportfolio: {
		url: `${environment.gatewayBaseUrl}`,							// not in use, not configured on new gateway
		key: 'eab16d83a9d0f05f9dd9d003a51a816781a67632'		
	},
	superStarHistory: {													// not in use, not configured on new gateway
		url: `${environment.gatewayBaseUrl}`,
		key: 'eab16d83a9d0f05f9dd9d003a51a816781a67632'
	},
	cashfilter: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}CashFilter`,
		key: ''
	},
	cashtabdetails: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}CompanyDetailPage`,
		key: ''
	},
	marketdepth: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}MarketDepth`,
		key: ''
	},
	futureOptDetails: {
		url: `${environment.gatewayBaseUrl}${environment.papiDerivative}FutOptIndvidualStockDetail-version2/`,
		key: ''
	},
	updateFutureOptDetails: {
		url: `${environment.gatewayBaseUrl}${environment.ttCompanyInfo}CompanyDetailPageV1`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	cashscripcode: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GetCashScripCode`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	getoptionforsymbol: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GetOptionsForSymbol`,
		key: ''
	},
	contractinfo: {
		url: `${environment.gatewayBaseUrl}${environment.ttScrip}ScripDetailsFoFOOrderV3`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	newstabList: {
		url: `${environment.newsinfoUrl}core/home-page/company-news1/page/1/perpage/15/symbol/`,
		key: ''
	},
	newstabDetails: {
		url: `${environment.newsinfoUrl}core/home-page/article-content/articleid/`,
		key: ''
	},

	weekhighlow: {
		url: `${environment.gatewayBaseUrl}${environment.papiMarket}52weekhighlow-version2/`,
		key: ''
	},
	futGain: {
		url: `${environment.gatewayBaseUrl}${environment.papiDerivative}fogainerlooser-version2`,
		key: ''
	},
	futOIGain: {
		url: `${environment.gatewayBaseUrl}${environment.papiDerivative}FOOGainerLooser-version2`,
		key: ''
	},
	rollOver: {
		url: `${environment.gatewayBaseUrl}${environment.papiDerivative}RollOverPercentage-version2`,
		key: ''
	},
	deliveryPer: {
		url: `${environment.gatewayBaseUrl}${environment.papiMarket}DeliveryPerc-version2`,
		key: ''
	},
	iglScore: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetSubBrokerIGLCScore`,
		key: ''
	},
	premiumPercent: {
		url: `${environment.gatewayBaseUrl}${environment.papiDerivative}PremiumPercent-Version2`,
		key: ''
	},
	mostActiveSTK: {
		url: `${environment.gatewayBaseUrl}${environment.papiDerivative}mostactivestockandindex-version2`,
		key: ''
	},
	scripSymbol: {				// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GetScripsNDSymbol`,
		key: ''
	},
	getExpiryForsymbol: {		// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GetExpiryForSymbolOptions`,
		key: ''
	},
	getScripListForSymbol: {	// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GetCompanyNameForSymbol`,
		key: ''
	},
	bulkblockdeal: {
		url: `${environment.gatewayBaseUrl}${environment.papiMobileAPI}bulkdeals-version2/`,
		key: ''
	},
	voltopper: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v3/TopTraded`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	// searchURL
	equityCash: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v2/SearchScrip`,
		key: ''
	},
	equityFutureOpt: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v2/SearchFOScrip`,
		key: ''
	},
	marketfeedsearch: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v3/MarketFeed`,
		key: ''
	},
	commodityMarketfeed: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}MarketFeed`,
		key: ''
	},
	currencyFutureOpt: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}FOCurrencyScripList`,
		key: ''
	},
	commodityFuture: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}CommodityScripListIPAD`,
		key: ''
	},
	// Details for future
	searchFutureDetails: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}FutureScripDetails`,
		key: ''
	},
	searchFutCommoDetails: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}CommScripDetails`,
		key: ''
	},
	// Details for future
	searchOptionExpiry: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}OptionsScripExpiry`,
		key: ''
	},
	searchOptionScripDetail: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}OptionScripDetails`,
		key: ''
	},
	// Client & Trades API
	clientHoldingMargin: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GetClientHoldingAndMarginDetails`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	amcReport: {
		url: `${environment.gatewayBaseUrl}${environment.mfApp}ConsolidatedAccountStmt`,				// MF
		vid: 'HK20SR5AC30',
		authHeader: 'Basic ' + btoa('+Ziie2ZAI4Y=:wEBYb4fMPXalOE/vdth5Tg==')
	},
	orderBook: {
		url: `${environment.gatewayBaseUrl}${environment.ttTrading}OrderBookNew`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	tradeBook: {
		url: `${environment.gatewayBaseUrl}${environment.ttTrading}TradeBookV1`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	marginV2: {
		url: `${environment.gatewayBaseUrl}${environment.ttTrading}MarginV2`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	clientLedger1: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v1/Ledger`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	clientHolding: {
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}MyHolding`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	clientNetPositioneq: {
		url: `${environment.gatewayBaseUrl}${environment.ttStockDetail}GetEquityTradeData`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	clientNetPositioncomm: {
		url: `${environment.gatewayBaseUrl}${environment.ttStockDetail}GetCommodityTradedata`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	clientHoldingPL: {
		url: `${environment.gatewayBaseUrl}${environment.ttClient}HoldingPLSummaryV2`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	
	// Client & Trades for Consolidate
	consolidateHolding: {
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}HoldingAAA`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	consolidateCommodityHolding: {
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}HoldingCommAAA`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	consolidateTradeBook: {
		url: `${environment.gatewayBaseUrl}${environment.ttTrading}TradeBookForAAA`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	consolidateOrderBook: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}OrderBookForAAA`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	fundsPayinOut: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}PayinPayoutDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	offlineClients: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}OfflineMFClients`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	amcData: {
		url: `${environment.gatewayBaseUrl}${environment.mfApp}GetAMCData`						// MF
	},
	dashboarddetail: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}DashboardDetail`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	aumdetail: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}AUMdetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	aumEquity: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}EquityAUMClientwise`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	aumMutualFund: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}MFAUMClientwise`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	aumFDBond: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetFDBondNCDAUMClientwiseDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	aumPMS: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetPMSAIFAUMClientwiseDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	aumMLDS: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetMLDPTCAUMClientwiseDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	sipBook: {			// no usage in code. Check
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}SIPDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	sipLive: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}SIPClientwiseDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	bouncedCeased: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAABouncedCeasedSIP`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	insuranceSummary: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAAInsuranceSummary`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	insuranceDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAAInsuranceDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	FDSMatureDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAABookedMaturedFD`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	clientDetail: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}TotalClientsDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	clientDetailList: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ViewAllClients`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	fetchClientDashboardDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaDashboard}FetchClientDashBoardDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	brokerageDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}BrokerageDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	brokerageDetailsList: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ClientWiseBrokerage`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	commSummaryList: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetCommClientSummary`
	},
	brokerageDue: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}BrokerageDue`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	hierarchyList: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetRMHierarchyV1`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	// Indices
	indiceMaster: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v2/IndiceMasterNew`,
		key: ''
	},
	currCommoIndices: {
		url: `${environment.gatewayBaseUrl}${environment.papiMarket}CurrencyDashboardList`,
		key: ''
	},
	globalMarketIndices: {
		url: `${environment.gatewayBaseUrl}aaa/WebApi/indices#global_indices`,
		key: ''
	},
	dashHeader: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}LoginDashboard`,
		key: ''
	},
	indiDetails: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}IndicesDetailPage`,
		key: ''
	},
	//Notification center
	notification: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v3/NotificationCenter`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	// Market Status
	exchStatus: {
		url: `${environment.gatewayBaseUrl}${environment.ttStockDetail}GetExchengeStatus`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	pledgeSecurity: {
		url: `https://swarajuat.iifl.in/TradeWeb/frmPledgeSecurities.aspx`
	},
	// Terms & Condition
	termCondition: {
		url: `${environment.gatewayBaseUrl}${environment.ttDataInfo}TermsAndConditionV1`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	//Exposure List
	exposureList: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GetCategoryExposure`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	exposureDescription: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}GetCategoryScriptInfo`,
		key: 'dL8mG4UwCfVYjzPWu8Rp'
	},
	payoutFDDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAAFDPayoutDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	payoutBondsDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetBondPayout`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	payoutPmsDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAAPMSPayout`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	payoutMfDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetMFPayout`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	payoutMldDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAAMLDPayout`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	payoutNcdDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAANCDPayout`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	payoutInsuranceDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAANewRenewInsurancePayout`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	payoutAifDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAAAIFPayout`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	payoutPtcDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAAPTCPayout`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	totalPayoutDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}TotalPayoutDetails`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	eqPayoutDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAAEquityPayout`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	summaryReport: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetFanSubBrokerPayoutDetailsV1`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`,
		Authkey:"53D7AE755B82D5C2"
	},
	dpTransaction: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}DPTransaction`,
		key: `${environment.paramsAPIKey}`,
		appName: `${environment.boAppName}`
	},
	// limit request status
	limitReqStatus: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}LimitReqStatus`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	// jv request status
	jvReqStatus: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}JVRequestStatus`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	// client Code for limit and Jv Status
	clientCodesList: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetClientCodes`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	//limit insert
	limitInsert: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}LimitReqInsert`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	limitValidate: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}LimitReqValidate`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	//jv validate
	jvValidate: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}JVValidate`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	editIpDetail: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}EditFetchStaticIP`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	getIpDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}FetchStaticIP`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	jvInsert: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}JVInsert`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	//borkerge Request
	brokerageApprove: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}JVBrokeragApprovalRights`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	brokergeRequest:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}BrokerageRequestStatus`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},

	//share-deposit
	subBrokerShareDepositDetailsV1:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetFanSubBrokerShareDepositDetailsV1`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	equityDeposit: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetFanSubBrokerEquityDepositDetailsV1`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`,
		Authkey:"53D7AE755B82D5C2",
	},
	brokerageLedger: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetPartnerLedgerDetailsV1`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`,
		Authkey:"APIBO52UCVDWFY",
	},
	// brokerge Insert
	brokerageReqInsert:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}BrokerageRequestInsert`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	//NFDCRiskReport
	nfdcRiskReport:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}NFDCRiskReport`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	scriptExcel:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ScripMasterDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	//RaaDebit
	RaaDebit:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}RAADebitReport`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	//BOD Holding
	BodHolding:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}HoldingDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	//BOD Header
	BodHeader:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}Clientdetailsheader`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	FnoPositions:{			// no usage in code. Check
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}FNOPositions`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	SlbmHoldings:{			// no usage in code. Check
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}SLBMHoldings`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	//client-summary
	clientSummary:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ClientSummary`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	editClientSummary:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}EditClientSummary`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	//client-details-profile-data
	profileDetailsV1:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ProfileDetailsV1`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	//client-pan 
	clientPanNo:{
		url: `${environment.gatewayBaseUrl}${environment.mfApp}GetClientPanNoV1`,
		vid:'HK20SR5AC30',
		appName: `${environment.boAppName}`	
	},
	//Brokerage-Info
	brokerageInformation:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetBrokerageInformation`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	//TradeListing
	tradeListing:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}TradeListing`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	settlement: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetSettlementDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	//unrealized p&l
	unRealizedPL:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}PnLSummaryUnRealized`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	// realized p&l
	realizedPL:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}PnLSummaryRealized`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`	
	},
	//Fund-transfer Module
	//AvailableAmountForPayout
	availableFund: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}AvailableAmountForPayout`,
		key: '3dddd60bdab77bace6189d001f96498f',
		appName: "IIFLMFMOB",	
	},
	// Inter Ledger Transfer
	interLedgerTransfer: {			// no usage in code. Check
		url: `${environment.gatewayBaseUrl}${environment.ttFundTransfer}RequestInterLedgerTransferAAA`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl',
		appName: "IIFLMarkets",	
	},
	//FundPayoutDetails
	fundPayoutDetail: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v2/FundPayoutDetails`,
	},
	//AvailableAmountForInterTransfer
	amountForInterTransfer: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}AvailableAmountForInterTransfer`,
		key: '3dddd60bdab77bace6189d001f96498f',
		appName: "IIFLMFMOB",	
	},

	//dpScript
	dpScript: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetDpScriptPayout`,
		key: '446794970AAA1237ab394d176612f8c6'
	},

	//PayoutRequestAAA
	payOutRequest: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}SavePayoutRequestV1`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: "AAA",	
	},
	//PayoutHistory
	payoutHistory: {
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}PayoutHistory`
	},
	//Branch List in Client Summary
	BranchMapping: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetRMBranchMapping`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	//approved and reject in brokerage Request List
	brokApproRej: {				// no usage in code. Check
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}BrokerageApproveReject`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: `${environment.boAppName}`
	},
	
	sipOrderBook: {
		url: `${environment.gatewayBaseUrl}${environment.mfApp}v3/SIPOrderBook`,
		vid: 'HK20SR5AC30',
		appName: `${environment.boAppName}`
	},

	orderBookMf: {
		url: `${environment.gatewayBaseUrl}${environment.mfApp}v3/OrderBook`,
		vid: 'HK20SR5AC30',
		appName: 'Mutual Funds by IIFL'
	},
	statAcc: {
		url: `${environment.gatewayBaseUrl}${environment.mfApp}AccountStatementCall`,
		vid: 'HK20SR5AC30',
		appName: 'AAA'
	},
	dpHolding: {
		url: `${environment.gatewayBaseUrl}${environment.mfApp}GetDPHolding`,
		vid: 'HK20SR5AC30',
		appName: 'AAA'
	},
	// API to check for product activation flag in wire request
	productActivationRights: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ActiveDeactiveRightsBase`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	// API for brokerage Request Insert V1
	hybridBrokRequest: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}CurrentBrokerage`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	// hybrid brok on submit
	brokerageRequestInsertV1: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}BrokerageRequestInsertV1`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	//prod Activation
	actDecProduct: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ActiveDeactiveProduct`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	//portfolio MF
	portfolioMf: {
		url: `${environment.gatewayBaseUrl}${environment.mfApp}V2/PortfolioAPICall`,			// MF
		vid: 'AS30RH5KC20',
		appName: 'AAA'
	},
	loginAppInfo: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}IAppInfo`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	loginValidateUser: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}validateUser`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	guestValidateOtp: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GuestLoginValidateOTP`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	guestGenerateOtp: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GuestLogin`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	loginVerifyUserOTP: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}VerifyUserOTP`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	loginVerifyUserCred: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}VerifyUserCredential`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	loginResetCredential: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ResetCredential`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	loginForgetCred: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ForgetCredential`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	loginForgetCredVarifyOTP: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ForgetCredentialVarifyOTP`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	generateTokenForAAA: {
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}GenerateTokenForAAA`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl',
		appName: 'IIFLMarkets'
	},
	// dashbord revamp
	partnerPoints: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetPartnerPoints`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	ipoList: {
		url: `${environment.gatewayBaseUrl}${environment.ipo}open-issues/ALL`,
	},
	clientCount: {
		onupUrl:'https://oneupuatcb.indiainfoline.com/issue/detail/code/',
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}FetchClevertapCounts`,
	},
	cmsDeposit: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetCMSDepositBankV1`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	equityCms: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetEquityCMSStatusV1`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	saveCmsEntry: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}SaveCMSEntryV1`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'	
	},
	oneUploginThrowApp: {
		url: `${environment.gatewayBaseUrl}${environment.ipo}OneUpLoginthrowOtherAppV1`,
	},
	ipoClientList: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}FetchClevertapDetails`,
	},
	getClientHoldingAbove25L: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetClientHoldingAbove25L`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	BusinessOppsFao: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetBusinessOpportunitiesFAO`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	clientWithoutSip: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetMFClientWithOutSIP`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	reportDownload: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBackOffice}reportEmailingv2`,
	},
	clientNotTraded: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAAClientNotTraded`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	clientTobeDormant: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetClientTobeDormant`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	getBrokeragePerformance: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetBrokeragePerformanceDetailsV1`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	getNcdMfDebtHolding: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAANCDorMFDebtHolding`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	dayWiseBrokerageGraph: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetDayWiseBrokerageGraph`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	dashBoardCount: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetAAADashBoardCount`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	incentivesPremiaRMs:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}IncentivesPremiaRMs`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	peerPoints: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetPeerPoints`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	ClientNotInMF: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}CllientsNotInvestedInMF`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	equityMfLeads: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}EquityMFLeads`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	bDayToday: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetListofBdayNext30day`,
		key: "446794970AAA1237ab394d176612f8c6"
	},
	p1p2p3Clients: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetListofP1P2P3Clients`,
		key: "446794970AAA1237ab394d176612f8c6"
	},
	leadStats: {
		url: `${environment.gatewayBaseUrl}${environment.iiflCRM}AAAClientSummaryDetails`,
		key: 'e33d222660f546a3be58421ca9a242dc'
	},
	fixedIncomeLeads: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}FixedIncomeLeads`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	PmsAifLeads: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}PMSAIFLeads`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	//Jv Request Status Option
	jvStatusOption: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}JVApproveReject`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	inflSendOtp: {
		url: `${environment.gatewayBaseUrl}${environment.ipo}SendOTP`,
	},
	inflVerifyOtp: {
		url: `${environment.gatewayBaseUrl}${environment.ipo}VerifyOTP`,
	},
	getInfluDetail: {
		url: `${environment.gatewayBaseUrl}GetInfluencerDetails`,		// not in use, not configured
	},
	crmToken: {
		// url: `${environment.baseUrl}ZohoToken`		old endpoint
		url: `${environment.gatewayBaseUrl}${environment.iiflCRM}Token`
	},
	createTicket: {
		url: `${environment.gatewayBaseUrl}${environment.iiflCRMWebAPI}CreateTicketinCRMCMMultiAttach`
	},
	searchTicket: {
		url: `${environment.gatewayBaseUrl}${environment.iiflCRMWebAPI}SearchTicketsinBRCS`
	},
	updateTkt: {
		url: `${environment.gatewayBaseUrl}${environment.iiflCRM}CreateTicketinCRMCustomModule`
	},
	brokingBot: {
		url: `${environment.gatewayBaseUrl}${environment.iiflCRMWebAPI}BrokingBotRequest`
	},
	clientLedgerDetails: {			// no usage in code. check
		url: `${environment.gatewayBaseUrl}${environment.ttAppBo}v1/Ledger`,
		// key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	holdPhysicalFNOReports: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}SubmitHoldPhysicalFnOReport`,
		// key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},

	getPhysicalFNOReports: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetHoldPhysicalFnOReport`,
		// key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	getDPSchemeDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}DPSchemeChargesDetails`,
		 key: '446794970AAA1237ab394d176612f8c6'
	},
	ttMapping: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}TTNowmapping`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	scripSummaryReport: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ScriptSummaryReport`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	clientProfileCap: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetCaptEngandProfCapt`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	searchZoho: {
		url: `${environment.gatewayBaseUrl}${environment.iiflCRMKbArticles}search`,
	},
	listZoho: {
		url: `${environment.gatewayBaseUrl}${environment.iiflCRMKbArticles}`,		// not being used, not configured in new gateway
	},
	getLivlong: {
		url: `https://api-uat.iiflinsurance.com/authentication.web.api/api/v2/auth/verifyApiKey`,
		key: 'LL.655598262a94ecec7ec888cae32d4054c4e.AAA'
	},
	deskGetArticle: {
		// url: `${environment.baseUrl}execute`,		old endpoint
		url: `${environment.gatewayBaseUrl}${environment.iiflCRMFunctions}desk_get_article/actions/execute`,
	},
	iglcScore: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}IGLCScore`,
		key: '446794970AAA1237ab394d176612f8c6' //prod
	},
	flyhighData: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}FlyHigh`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	getRootCategoreTree: {
		// url: `${environment.baseUrl}executeV1`,		old endpoint
		url: `${environment.gatewayBaseUrl}${environment.iiflCRMFunctions}desk_get_categoretree/actions/execute`,
	},
	clientOutstanding: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetClientOutstandingReport`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	clientRiskProfileScore: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ClientRiskProfileScore`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	getMarginShortfall:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}MarginShortFall`,
	},
	clientInteractionToken:{
		url: `${environment.gatewayBaseUrl}${environment.iiflCRM}login`
	},
	clientTicketDetails:{
		url: `${environment.gatewayBaseUrl}${environment.iiflCRM}AAAPastClientTicketDetails`
	},
	clientInteractionDetails:{
		url: `${environment.gatewayBaseUrl}${environment.iiflCRM}AAAPastClientInteractionDetails`
	},
	verifyOneLogin:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}VerifyOneLoginUserCredential`
	},
	userInfoOneLogin: {
		url: `${environment.oneLoginOidc}oidc/2/me`
	},
	commodityrealtimereport:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetCommodityrealtimereport`
	},
	//shared reports download 
	clientPortfolio: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}ClientPortfolioSummary`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	familyMapp: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}FamilyMapping`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	clientEqDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}ClientEquityDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	clientPmsDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}ClientPMSDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	clientMfDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}MutualFundDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	clientProductDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}ClientProductSummary`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	clientFdDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}GetClientFDDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	clientBonds: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}GetClientBondDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	clientAif: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}ClientAIFDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	clientPms: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}ClientPMSDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	familyMember: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}AddUpdateDeleteResendVerifyFamilyMapping`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	viewBrokerageRights: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}Get_AAA_ViewBrokerageRight`,
	},
	addMenuRights: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}AddUpdateMenuRights`,
	},
	clientMappingTableData:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetClientTTMappingClientStatus`,
	},
	mappedClient:{			// cm. check configuration
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetMappedClientList`,
	},
	demapClient:{			// cm. check configuration
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}DemapClient`,
	},
	getQuickLink: {
		url: `${environment.gatewayBaseUrl}${environment.aaaDashboard}FetchQuickLinks`
	},
	addQuickLink: {
		url: `${environment.gatewayBaseUrl}${environment.aaaDashboard}AddDeleteQuickLinks`
	},
	crossSellDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaDashboard}GetCrossSellDetails`
	},
	mfDashboard: {
		url: `${environment.gatewayBaseUrl}${environment.aaaDashboard}GetMFDashBoard`
	},
	equityDashboard: {
		url: `${environment.gatewayBaseUrl}${environment.aaaDashboard}GetEquityDashBoard`
	},
	overallDashboard: {
		url: `${environment.gatewayBaseUrl}${environment.aaaDashboard}GetOverAllDashboradCount`
	},
	defaultDashboard: {
		url: `${environment.gatewayBaseUrl}${environment.aaaDashboard}GetDefaultDashboard`
	},
	productWiseClient: {
		url: `${environment.gatewayBaseUrl}${environment.aaaDashboard}GetProductWiseClientCount`
	},
	tradingListRepo:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ConsolidateTradingReport`,
	},
	commodityScripSum:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}CommodityClientScriptSummary`,
	},
	vasDetailedReport:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}VASDetailReport`,
	},
	clientBreakDown: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}GetClientStockBreakdownDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	GetRMHierarchyNew:{
		url: `${environment.gatewayBaseUrl}${environment.aaaSearch}GetRMHierarchyNew`,
		'Ocp-Apim-Subscription-Key': environment.gatewaySubscriptionKey.aaa
	},
	GetClientCodes:{
		url: `${environment.gatewayBaseUrl}${environment.aaaSearch}GetClientCodes`,
		'Ocp-Apim-Subscription-Key': environment.gatewaySubscriptionKey.aaa
	},	
	freezeDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ListFreezeDetail`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	dpModificationDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}DPModificationReport`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	searchScripDetails: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}SearchScripDetails`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	sessionTransfer: {
		url: `${environment.gatewayBaseUrl}${environment.ttUserActivity}SessionAuthForChatBotLogin`,
		key: 'PMVHB5wpK7LCCYBkl6APNYMqvyNWMZKl'
	},
	wireMappedCode:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}FetchWireMappedCode`,
	},
	removeClientAccess:{
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}DeactiveWireParentChild`,
	},
	kpiDashboardBDM: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}KPIDashBoardBDM`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	epiReqStatus: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}FetchEPIRequest`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	clientDematHoldings: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}FetchClientDematHoldings`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	SubmitEPIRequest: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}SubmitEPIRequest`,
		key: '446794970AAA1237ab394d176612f8c6'
	},
	clientMarginReport: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}ClientMarginReport`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	accountClosureStatus: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}AccountClosureStatus`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	settlementPayoutReport: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetSettlementPayoutReport`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	dpHoldingStatement: {
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}DPHoldingStatement`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	dematRequestStatus: {			// cm. check configuration
		url: `${environment.gatewayBaseUrl}${environment.aaaBase}GetDematRequestStatus`,
		Key: "446794970C360ab394d176612f8c6",
		appName: 'Customer360'
	},
	offlineIpo: {			// cm. check configuration
		url: `${environment.gatewayBaseUrl}${environment.ipo}IPO/RMLoginthrowOtherApp`,
		'Ocp-Apim-Subscription-Key': 'e6c610d5100f4b37b94381f61045a5f2',
		'Authorization':'IMN05OPLoDvbTTaIQkqLNMI7cPLguaRyHzyg7n5qNBVjQmtBhzF4SzYh4NBVCXi3KJHlSXKP+oi2+bXr6CUYTRL'
	},
	offlineNcd: {			// cm. check configuration
		url: `https://ttavatar.iifl.in/IIFLServices/IPONCDCoreAPI/api/IPO/RMLoginthrowOtherApp`,
		'Ocp-Apim-Subscription-Key': 'e6c610d5100f4b37b94381f61045a5f2',
		'Authorization':'IMN05OPLoDvbTTaIQkqLNMI7cPLguaRyHzyg7n5qNBVjQmtBhzF4SzYh4NBVCXi3KJHlSXKP+oi2+bXr6CUYTRL'
	},
	MFPNLStatement: {			// cm. check configuration
		url: `${environment.gatewayBaseUrl}${environment.aaa360}MFPNLStatement`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	},
	getTotalEquityDividend: {
		url: `${environment.gatewayBaseUrl}${environment.aaa360}GetTotalEquityDividend`,
		key: '446794970AAA1237ab394d176612f8c6',
		appName: 'AAA'
	}
})

// export const SECRET_KEY: string = '$2a$10$e.oPc.dyrwRoQCpDvO9Rhe';