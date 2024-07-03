import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';
import { TotalClientsComponent } from '../components/total-clients/total-clients.component';
import { AccountDetailsComponent } from '../components/client-account-details/client-account-details.component';
import { AnalyticsComponent } from '../components/analytics/analytics.component';
import { BrokerageComponent } from '../components/brokerage/brokerage.component';
import { AumComponent } from '../components/aum/aum.component';
import { ExposureScripDetailsComponent } from '../components/exposure-scrip-details/exposure-scrip-details.component';
import { PayDetailsWithViewComponent } from '../components/pay-details-with-view/pay-details-with-view.component';
import { PayDetailsInsuranceComponent } from '../components/pay-details-insurance/pay-details-insurance.component';
import { PayDetailsMutualFundComponent } from '../components/pay-details-mutual-fund/pay-details-mutual-fund.component';
import { ClientInteractionsComponent } from '../client-interactions/client-interactions.component';
import { PaydetailModelComponent } from '../components/paydetail-model/paydetail-model.component';
import { RiskProfileComponent } from '../risk-profile/risk-profile.component';
import { LimitInsertFormComponent } from '../components/limit-insert-form/limit-insert-form.component';
import { JvInsertFormComponent } from '../components/jv-insert-form/jv-insert-form.component';
import { BrokerageInsertFormComponent } from '../components/brokerage-insert-form/brokerage-insert-form.component';
import { ProductActivateDeactivateComponent } from '../components/product-activate-deactivate/product-activate-deactivate.component';
import { CmsEntryComponent } from '../components/cms-entry/cms-entry.component';
import { CmsEntryDetailComponent } from '../components/cms-entry-detail/cms-entry-detail.component';
import { PayoutHistoryComponent } from '../components/payout-history/payout-history.component';
import { DpTransactionComponent } from '../components/dp-transaction/dp-transaction.component';
import { MutualFundComponent } from '../components/mutual-fund/mutual-fund.component';
import { AccStatementComponent } from '../components/acc-statement/acc-statement.component';
import { RealisedPnlComponent } from '../components/realised-pnl/realised-pnl.component';
import { SimplifiedLedgerComponent } from '../components/simplified-ledger/simplified-ledger.component';
import { UnrealizedPnlComponent } from '../components/unrealized-pnl/unrealized-pnl.component';
import { TradeListingComponent } from '../components/trade-listing/trade-listing.component';
import { DigiContractMobileComponent } from '../components/digital-contract-mobile/digital-contract-mobile.component';
import { AmcReportComponent } from '../components/amc-report/amc-report.component';
import { CommodityRealTimeReportComponent } from '../components/commodity-real-time-report/commodity-real-time-report.component';
import { EmiCalculatorComponent } from '../components/emi-calculator/emi-calculator.component';
import { SipCalculatorComponent } from '../components/sip-calculator/sip-calculator.component';
import { SipRevenueCalculatorComponent } from '../components/sip-revenue-calculator/sip-revenue-calculator.component';
import { SpanMarginCalculatorComponent } from '../components/span-margin-calculator/span-margin-calculator.component';
import { GoalCalculatorComponent } from '../components/goal-calculator/goal-calculator.component';
import { HelpFaqComponent } from '../components/help-faq/help-faq.component';
import { HelpFaqRootComponent } from '../components/help-faq-root/help-faq-root.component';
import { HelpFaqSubrootComponent } from '../components/help-faq-subroot/help-faq-subroot.component';
import { HelpPartnerQueryComponent } from '../components/help-partner-query/help-partner-query.component';
import { HelpSearchQuesComponent } from '../components/help-search-ques/help-search-ques.component';
import { FaqDetailsComponent } from '../components/faq-details/faq-details.component';
import { BodHoldingComponent } from '../components/bod-holding/bod-holding.component';
import { BodHoldingMobileComponent } from '../components/bod-holding-mobile/bod-holding-mobile.component';
import { JvRequestComponent } from '../components/jv-request/jv-request.component';
import { ConsolidatedTradeListingComponent } from '../components/consolidated-trade-listing/consolidated-trade-listing.component';
import { LimitRequestStatusPage } from '../components/limit-request-status/limit-request-status.component';
import { ShareDepositReportComponent } from '../components/share-deposit-report/share-deposit-report.component';
import { CommoditySummaryComponent } from '../components/commodity-summary/commodity-summary.component';
import { PayoutSummaryReportComponent } from '../components/payout-summary-report/payout-summary-report.component';
import { BrokerageRequestsStatusComponent } from '../components/brokerage-requests-status/brokerage-requests-status.component';
import { EquityDepositDetailsComponent } from '../components/equity-deposit-details/equity-deposit-details.component';
import { BrokerageLedgerReportComponent } from '../components/brokerage-ledger-report/brokerage-ledger-report.component';
import { NfdcRiskReportComponent } from '../components/nfdc-risk-report/nfdc-risk-report.component';
import { NfdcRiskReportMobileComponent } from '../components/nfdc-risk-report-mobile/nfdc-risk-report-mobile.component';
import { HoldPhysicalFnoReportMobileComponent } from '../components/hold-physical-fno-report-mobile/hold-physical-fno-report-mobile.component';
import { ClientSummaryComponent } from '../components/client-summary/client-summary.component';
import { ClientSummaryMobileComponent } from '../components/client-summary-mobile/client-summary-mobile.component';
import { DpScriptPayoutMobileComponent } from '../components/dp-script-payout-mobile/dp-script-payout-mobile.component';
import { RealTimeMarginShortfallComponent } from '../components/real-time-margin-shortfall/real-time-margin-shortfall.component';
import { ScriptwiseSummaryComponent } from '../components/scriptwise-summary/scriptwise-summary.component';
import { CommodityClientScripSummaryComponent } from '../components/commodity-client-scrip-summary/commodity-client-scrip-summary.component';
import { FreezeDetailsComponent } from '../components/freeze-details/freeze-details.component';
import { DpModificationDetailsComponent } from '../components/dp-modification-details/dp-modification-details.component';
import { VasDetailedReportComponent } from '../components/vas-detailed-report/vas-detailed-report.component';
import { BrokInsertMobileComponent } from '../components/brok-insert-mobile/brok-insert-mobile.component';
import { ClientMappingMobileComponent } from '../components/client-mapping-mobile/client-mapping-mobile.component';
import { LeadDetailsComponent } from '../components/lead-details/lead-details.component';
import { MfOrderbookComponent } from '../components/mf-orderbook/mf-orderbook.component';
import { BusinessOppsListComponent } from '../components/business-opps-list/business-opps-list.component';
import { SettlementPayoutReportComponent } from '../components/settlement-payout-report/settlement-payout-report.component';
import { PayDetailsEquityComponent } from '../components/pay-details-equity/pay-details-equity.component';
import { DpHoldingReportsComponent } from '../components/dp-holding-reports/dp-holding-reports.component';
import { DematRequestStatusComponent } from '../components/demat-request-status/demat-request-status.component';
import { DemapClientMappingComponent } from '../components/demap-client-mapping/demap-client-mapping.component';

// -- COMMENTED FROM HERE
// import { PayDetailsWithDropdownComponent } from '../components/pay-details-with-dropdown/pay-details-with-dropdown.component';
// import { PayDetailsEquityComponent } from '../components/pay-details-equity/pay-details-equity.component';
// import { ReportDetailsComponent } from '../components/report-details/report-details.component';
// import { RaaDebitComponent } from '../components/raa-debit/raa-debit.component';
// import { FamilyPortfolioComponent } from '../components/family-portfolio/family-portfolio.component';
// -- COMMENTED TILL HERE

const routes: Routes = [
	{
		path: '',
		component: TabsPage,
		// canActivate: [ AuthGuard ],
		children: [
			// {
			//   path: 'subscription',
			//   canActivate: [ AuthGuard ],
			//   loadChildren: () => import('../pages/subscrip/subscrip.module').then( m => m.SubscripPageModule)
			// },
			/* {
				path: 'dashboard',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
			},
			{
				path: 'dashboard/:id',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
			}, */

			// -- // -- COMMENTED FROM HERE
			{
				path: 'markets',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/markets/markets.module').then(m => m.MarketsPageModule)
			},
			{
				path: 'markets/:id',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/markets/markets.module').then(m => m.MarketsPageModule)
			},
			{
				path: 'invest',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/invest/invest.module').then(m => m.investModule)
			},
			{
				path: 'invest/:id',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/invest/invest.module').then(m => m.investModule)
			},
			{
				path: 'invest/:id/:id',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/invest/invest.module').then(m => m.investModule)
			},
			// PREVIOUSLY COMMENTED
			// {
			//   path: 'client-trades',
			// canActivate: [ AuthGuard ],
			//   loadChildren: () => import('../pages/clients-trades/clients-trades.module').then( m => m.clientsTradesModule)
			// },
			// {
			// 	path: 'more',
			// 	// canActivate: [ AuthGuard ],
			// 	loadChildren: () => import('../pages/more/more.module').then(m => m.MoreModule)
			// },
			// {
			// 	path: 'calculators',
			// 	// canActivate: [ AuthGuard ],
			// 	loadChildren: () => import('../pages/calculators/calculators.module').then(m => m.CalculatorsPageModule)
			// },
			// PREVIOUSLY COMMENTED
			{
				path: 'calculators/:id',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/calculators/calculators.module').then(m => m.CalculatorsPageModule)
			},
	// 		{
	// 			path: 'upload-cas',
	// 			loadChildren: () => import('../pages/upload-cas/upload-cas.module').then(m => m.UploadCasPageModule)
	// 		},
			{
				path: 'research-reports',
				loadChildren: () => import('../pages/research-reports/research-reports.module').then(m => m.ResearchReportsPageModule)
			},
			{
				path: 'pay-details',
				loadChildren: () => import('../pages/pay-details/pay-details.module').then(m => m.PayDetailsPageModule)
			},
			{
				path: 'folio-wise-details',
				loadChildren: () => import('../pages/folio-wise/folio-wise.module').then(m => m.FolioWisePageModule)
			},
			// PREVIOUSLY COMMENTED
			// {
			//   path: 'limit-request-status',
			//   loadChildren: () => import('../pages/limit-request-status/limit-request-status.module').then( m => m.LimitRequestStatusPageModule)
			// },
			// PREVIOUSLY COMMENTED
			{
				path: 'wire-requests/:id',
				loadChildren: () => import('../pages/wire-requests/wire-requests.module').then(m => m.WireRequestsPageModule)
			},
			{
				path: 'wire-requests',
				loadChildren: () => import('../pages/wire-requests/wire-requests.module').then(m => m.WireRequestsPageModule)
			},
			// PREVIOUSLY COMMENTED
			//   {
			//     path: 'brokerage-modification',
			//     loadChildren: () => import('../pages/brokerage-modification/brokerage-modification.module').then( m => m.BrokerageModificationPageModule)
			//   },
			// PREVIOUSLY COMMENTED
			{
				path: 'brokerage-modification',
				loadChildren: () => import('../pages/brokerage-modification/brokerage-modification.module').then(m => m.BrokerageModificationPageModule)
			},
			{
				path: 'add-script',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/add-script/add-script.module').then(m => m.AddScriptPageModule)
			},
			{
				path: 'notification',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/notification/notification.module').then(m => m.NotificationPageModule)
			},
			{
				path: 'gainers-losers',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../components/gainers-losers/gainers-losers.module').then(m => m.GainersLosersPageModule)
			},
			{
				path: 'bulk-block-deals',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../components/bulk-block-deals/bulk-block-deals.module').then(m => m.BulkBlockDealsPageModule)
			},
			{
				path: 'fut-gainer-loser',
				loadChildren: () => import('../pages/fut-gainer-loser/fut-gainer-loser.module').then(m => m.FutGainerLoserPageModule)
			},
			{
				path: 'fut-oi-gainer-loser',
				loadChildren: () => import('../pages/fut-oi-gainer-loser/fut-oi-gainer-loser.module').then(m => m.FutOiGainerLoserPageModule)
			},
			{
				path: 'partner-code',
				loadChildren: () => import('../pages/partner-code/partner-code.module').then(m => m.PartnerCodePageModule)
			},
			{
				path: 'rollover-delivery',
				loadChildren: () => import('../pages/rollover-delivery/rollover-delivery.module').then(m => m.RolloverDeliveryPageModule)
			},
			{
				path: 'premium-discount',
				loadChildren: () => import('../pages/premium-discount/premium-discount.module').then(m => m.PremiumDiscountPageModule)

			},
			{
				path: '52-week-high-low',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../components/week-hl/week-hl.module').then(m => m.WeekHlPageModule)
			},
			{
				path: 'volume-toppers',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../components/vol-toppers/vol-toppers.module').then(m => m.VolToppersPageModule)
			},
	// 		{
	// 			path: 'company-details-superstars',
	// 			// canActivate: [ AuthGuard ],
	// 			loadChildren: () => import('../pages/company-details-superstars/company-details-superstars.module').then(m => m.CompanyDetailsSuperstarsPageModule)
	// 		},
			{
				path: 'company-details/:id/:id1/:id2/:id3/:id4',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/company-details/company-details.module').then(m => m.CompanyDetailsPageModule)
			},
			{
				path: 'client-list/:id/:id1/:id2/:id3',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/client-list/client-list.module').then(m => m.ClientListPageModule)
			},
			// PREVIOUSLY COMMENTED
			// {
			// 	path: 'change-password',
			// 	// canActivate: [ AuthGuard ],
			// 	loadChildren: () => import('../pages/change-password/change-password.module').then(m => m.ChangePasswordPageModule)
			// },
			// {
			// 	path: 'mobile-more-option',
			// 	// canActivate: [ AuthGuard ],
			// 	loadChildren: () => import('../pages/mobile-more-option/mobile-more-option.module').then(m => m.MobileMoreOptionPageModule)
			// },
			// PREVIOUSLY COMMENTED
	// 		{
	// 			path: 'settings',
	// 			// canActivate: [ AuthGuard ],
	// 			loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsPageModule)
	// 		},
	// 		{
	// 			path: 'detailed-news/:id',
	// 			// canActivate: [ AuthGuard ],
	// 			loadChildren: () => import('../pages/detailed-news/detailed-news.module').then(m => m.DetailedNewsPageModule)
	// 		},
			{
				path: 'invest-fixed-deposit',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/invest-fixed-deposit/invest-fixed-deposit.module').then(m => m.InvestFixedDepositPageModule)
			},
			{
				path: 'invest-bond',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/invest-bond/invest-bond.module').then(m => m.InvestBondPageModule)
			},
	// 		{
	// 			path: 'price-calculator',
	// 			// canActivate: [ AuthGuard ],
	// 			loadChildren: () => import('../pages/price-calculator/price-calculator.module').then(m => m.PriceCalculatorPageModule)
	// 		},
			{
				path: 'client-trades',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/recently-viewed-client-list/recently-viewed-client-list.module').then(m => m.RecentlyViewedClientListPageModule)
			},
			{
				path: 'client-trades/:id',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/recently-viewed-client-list/recently-viewed-client-list.module').then(m => m.RecentlyViewedClientListPageModule)
			},
			// PREVIOUSLY COMMENTED
			// {
			//   path: 'client-trades',
			//   canActivate: [ AuthGuard ],
			//   loadChildren: () => import('../pages/recently-viewed-client-list/recently-viewed-client-list.module').then( m => m.RecentlyViewedClientListPageModule)
			// },
			// PREVIOUSLY COMMENTED
	 		{
	 			path: 'client-details/:id/:id1',
	 			// canActivate: [ AuthGuard ],
	 			loadChildren: () => import('../pages/client-details/client-details.module').then(m => m.ClientDetailsPageModule)
	 		},
			{
				path: 'client-equity-commodity/:id',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/client-equity-commodity/client-equity-commodity.module').then(m => m.ClientEquityCommodityPageModule)
			},
	// 		{
	// 			path: 'superstart-shares/:id/:id1/:id2',
	// 			// canActivate: [ AuthGuard ],
	// 			loadChildren: () => import('../pages/superstart-shares/superstart-shares.module').then(m => m.SuperstartSharesPageModule)
	// 		},
	// 		{
	// 			path: 'superstars-history/:id/:id1/:id2',
	// 			// canActivate: [ AuthGuard ],
	// 			loadChildren: () => import('../pages/superstars-history/superstars-history.module').then(m => m.SuperstarsHistoryPageModule)
	// 		},
	// 		{
	// 			path: 'support-feedback',
	// 			// canActivate: [ AuthGuard ],
	// 			loadChildren: () => import('../pages/support-feedback/support-feedback.module').then(m => m.SupportFeedbackPageModule)
	// 		},
	// 		{
	// 			path: 'terms-condition',
	// 			// canActivate: [ AuthGuard ],
	// 			loadChildren: () => import('../pages/terms-condition/terms-condition.module').then(m => m.TermsConditionPageModule)
	// 		},
			{
				path: 'my-profile',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/my-profile/my-profile.module').then(m => m.MyProfilePageModule)
			},
			{
				path: 'brokerage-information/:id',
				loadChildren: () => import('../pages/brokerage-information/brokerage-information.module').then(m => m.BrokerageInformationPageModule)
			},
            {
                path: 'dashboard',
                loadChildren: () => import('../pages/dashboard/dashboard.module').then( m => m.DashboardRevampPageModule)
            },
			{
                path: 'manage-custom-mapping',
                loadChildren: () => import('../pages/manage-custom-mapping/manage-custom-mapping.module').then( m => m.ManageCustomMappingPageModule)
            },
			{
				path: 'view-reports',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/view-report-list/view-report-list.module').then(m => m.ViewReportListPageModule)
			},
			{
				path: 'reports',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/report-menu/report-menu.module').then(m => m.ReportMenuModule)
			},
			{
				path: 'circulars',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/circulars-menu/circulars-menu.module').then(m => m.CircularsMenuModule)
			},
			{ 
				path: 'raise-query',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/raise-query/raise-query.module').then(m => m.RaiseQueryPageModule)
			},
	// 		{ 
	// 			path: 'partner-query',
	// 			// canActivate: [ AuthGuard ],
	// 			loadChildren: () => import('../pages/partner-query/partner-query.module').then(m => m.PartnerQueryPageModule)
	// 		},
			{ 
				path: 'help-support',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/help-support/help-support-query.module').then(m => m.HelpSupportPageModule)
			},
			{
				path: 'share-reports/:id/:id1',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/share-reports/share-reports.module').then(m => m.ShareReportsPageModule)
			},
			{
				path: 'share-reports',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/share-reports/share-reports.module').then(m => m.ShareReportsPageModule)
			},
            {
                path: 'more',
                loadChildren: () => import('../pages/more-menu/more-menu.module').then( m => m.MoreRevampPageModule)
            },
			{
				path: 'fund-transfer',
				// canActivate: [ AuthGuard ],
				loadChildren: () => import('../pages/fund-transfer/fund-transfer.module').then(m => m.FundTransferPageModule)
			},
			{
				path: 'pay-more-details/:id/:id1',
				component: PayDetailsWithViewComponent
			},
			{
				path: 'pay-details-insurance/:id',
				component: PayDetailsInsuranceComponent
			},
			{
				path: 'pay-details-mf/:id',
				component: PayDetailsMutualFundComponent
			},
			{
				path: 'jv-request',
				component: JvRequestComponent
			},
			// {
			// 	path: 'nfdc-risk',					// below routing is used for nfdc routing ('nfdc-risk-mobile')
			// 	component: NfdcRiskReportComponent
			// },
			{
				path: 'nfdc-risk-mobile',
				component: NfdcRiskReportMobileComponent
			},
			{
				path: 'client-summary-mobile',
				component: ClientSummaryMobileComponent
			},
			{
				path: 'help-faq',
				component: HelpFaqComponent
			},
			{
				path: 'help-faq-root',
				component: HelpFaqRootComponent
			},
			{
				path: 'help-faq-subroot',
				component: HelpFaqSubrootComponent
			},
			{
				path: 'faq-details',
				component: FaqDetailsComponent
			},
			{
				path: 'client-interactions',
				component: ClientInteractionsComponent
			},
			{
				path: 'help-partner-query',
				component: HelpPartnerQueryComponent
			},
			{
				path: 'help-search-ques',
				component: HelpSearchQuesComponent
			},
			{
				path: 'bod-holding',
				component: BodHoldingMobileComponent
			},
			{
				path: 'dpc-script',
				component: DpScriptPayoutMobileComponent
			},
			{
				path: 'physical-fno',
				component: HoldPhysicalFnoReportMobileComponent
			},
	// 		{
	// 			path: 'raa-debit',
	// 			component: RaaDebitComponent
	// 		},
			{
				path: 'realised-pnl',
				component: RealisedPnlComponent
			},
			{
				path: 'unrealised-pnl',
				component: UnrealizedPnlComponent
			},
			{
				path: 'digital-contract-mobile',
				component: DigiContractMobileComponent
			},
			{
				path: 'bod-holding',
				component: BodHoldingComponent
			},
			{
				path: 'amc-report',
				component: AmcReportComponent
			},
			{
				path: 'client-summary',				// review. check routing
				component: ClientSummaryComponent
			},
			{
				path: 'trade-list',
				component: TradeListingComponent
			},
			{
				path: 'dp-transaction',
				component: DpTransactionComponent
			},
			{
				path: 'limit-insert',
				component: LimitInsertFormComponent
			},
            {
				path: 'cms-entry',
				component: CmsEntryComponent
			},
            {
				path: 'cms-entry-detail/:id',
				component: CmsEntryDetailComponent
			},
			{
				path: 'jv-insert',
				component: JvInsertFormComponent
			},

       { 
        path: 'brokerage-insert/:id', 
        component: BrokerageInsertFormComponent
       },
	   { 
        path: 'brokerage-insert', 
        component: BrokerageInsertFormComponent
       },
       { 
        path: 'brokerage-request', 
        component: BrokerageRequestsStatusComponent
       },
    	{ 
        path: 'product-activation', 
        component: ProductActivateDeactivateComponent
       }, 
        {
        path: 'limit-request-status',
        component: LimitRequestStatusPage
      },
       { 
        path: 'share-deposit-report', 
        component: ShareDepositReportComponent 
       },
    //    { 
    //     path: 'report-details', 
    //     component: ReportDetailsComponent
    //    },
       { 
        path: 'equity-deposit-details', 
        component: EquityDepositDetailsComponent
       },
       {
        path: 'brokerage-ledger-report',
        component: BrokerageLedgerReportComponent
       },
       {
        path: 'simplified-ladger',
        component: SimplifiedLedgerComponent
       },
       {
        path: 'payout-history',
        component: PayoutHistoryComponent   
       },
       {
        path: 'fan-payout-summary',
        component: PayoutSummaryReportComponent   
       },
	   {
		path:'ScriptwiseSummary',
		component:ScriptwiseSummaryComponent
	   },
	   {
        path: 'commodity-client-summary',
        component: CommoditySummaryComponent   
       },
       {
        path: 'mutual-fund/:id/:id1',
        component: MutualFundComponent   
       },
       {
        path: 'acc-statement',
        component: AccStatementComponent   
       },
       {
        path: 'mf-orderbook',
        component: MfOrderbookComponent   
	   },
	   {
        path: 'emi-calculator',
        component: EmiCalculatorComponent   
	   },
	   {
        path: 'sip-calculator',
        component: SipCalculatorComponent   
	   },
	   {
        path: 'sip-revenue-calculator',
        component: SipRevenueCalculatorComponent   
	   },
	   {
        path: 'span-margin-calculator',
        component: SpanMarginCalculatorComponent   
	   }, 
	   {
        path: 'goal-calculator',
        component: GoalCalculatorComponent   
       },
       {
        path: 'dashboard-aum',
        component: AumComponent
       },
       {
        path: 'dashboard-clients',
        component: TotalClientsComponent
       },
       {
        path: 'dashboard-brokerage',
        component: BrokerageComponent
	   },
	   {
        path: 'business-opps-list',
        component: BusinessOppsListComponent
	   },
	   // PREVIOUSLY COMMENTED
	//    //  { 
    //   //   path: 'modal-details', 
    //   //   component: PaydetailModelComponent
    //   //  },
    //   // {
    //   //   path: 'subscription',
    //   //   loadChildren: () => import('../pages/subscrip/subscrip.module').then( m => m.SubscripPageModule)
    //   // },
	   // PREVIOUSLY COMMENTED
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      { 
      path: 'exposurelist/:id', 
      component: ExposureScripDetailsComponent 
     },
     { 
      path: 'equity-pay-details/:id', 
      component: PayDetailsEquityComponent 
     },
     { 
      path: 'pay-list-details/:id', 
      component: PaydetailModelComponent 
     },
     { 
      path: 'brok-insert-mobile', 
      component: BrokInsertMobileComponent 
     },
	 { 
		path: 'client-mapping', 
		component: ClientMappingMobileComponent 
	 },
	 { 
		path: 'lead-details/:id', 
		component: LeadDetailsComponent 
	 },
	 { 
        path: 'real-time-margin-shortfall', 
        component: RealTimeMarginShortfallComponent
     },
	 { 
        path: 'risk-profile', 
        component: RiskProfileComponent
	 },
	 { 
        path: 'client-account-details/:id', 
        component: AccountDetailsComponent
	 },
	 {
		path: 'analytics',
		component: AnalyticsComponent
	 },
	 { 
        path: 'client-portfolio', 
		loadChildren: () => import('../components/family-portfolio/family-portfolio.module').then( m => m.FamilyPortfolioModule)
     },
	 {
		path: 'consolidated-trade-listing',
		component: ConsolidatedTradeListingComponent   
	 },
	 {
		path: 'commodity-client-scrip-summary',
		component: CommodityClientScripSummaryComponent
	 },
	 {
		path: 'commodity-realtime-report',
		component: CommodityRealTimeReportComponent
     }
	// -- COMMENTED TILL HERE
	,
	 {
		path: 'freeze-details',
		component: FreezeDetailsComponent
	 },
	 {
		path: 'settlement-payout-report',
		component: SettlementPayoutReportComponent
	 },
	 {
		path: 'dp-holding-report',
		component: DpHoldingReportsComponent
	 },
	 {
		path: 'dp-modification-details',
		component: DpModificationDetailsComponent
     },
	 {
		path: 'VasDetailedReport',
		component: VasDetailedReportComponent
	 },
	 {
		path: 'demat-request-status',
		component: DematRequestStatusComponent
	 },
	 {
		path: 'demap-client-mapping',
		component: DemapClientMappingComponent
	 },
    ],
  },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TabsPageRoutingModule { }
