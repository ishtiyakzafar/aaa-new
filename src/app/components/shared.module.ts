
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DaterangepickerModule } from 'angular-2-daterangepicker';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { cleverTapService } from '../helpers/clevertap.service';
import { CharturlDirective } from '../directives/charturl.directive';
import { PreventDoubleClickDirective } from '../directives/preventdoubleclick.directive';
import { FormatUnitNumberPipe } from '../helpers/formatnumberunit.pipe';
import { FormatDatePipe } from '../helpers/dateformat.pipe';
import { FormatNumberDecimalPipe } from '../helpers/decimalNumber.pipe';
import { FormatTime } from '../helpers/timeFormat.pipe';
import { SortDatePipe } from '../helpers/sortDate.pipe';
import { DateSortingPipe } from '../helpers/date-sorting.pipe';
import { SplitNameDate } from '../helpers/splitNameDate.pipe';
import { ArraySortPipe } from '../helpers/sortalphabet.pipe';
import { KeysPipe } from '../helpers/keyValue.pipe';
import { filterSerchPipe } from '../helpers/filterSearch.pipe';
import { FilterClientCodePipe } from '../helpers/filter-client-code.pipe';
import { ScrollbarThemeDirective } from '../directives/scrollbar-theme.directive';
import { InputRestrictionDirective } from '../directives/specialchar.directive';

// -- -- COMMENTED FROM HERE UNCOMMENT LATER
// import { SuccessfullComponent } from './successfull/successfull.component';
// import { OrderModule } from 'ngx-order-pipe';
// import { NgChartsModule } from 'ng2-charts';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';
// //import {ChartsComponent} from 'src/app/components/charts/charts.component'
// import { CharturlDirective } from '../directives/charturl.directive'

// import { SortDatePipe } from '../helpers/sortDate.pipe';
// import {FormatUnitNumberPipe} from '../helpers/formatnumberunit.pipe'
// import {FormatDatePipe} from '../helpers/dateformat.pipe'
// import {FormatNumberDecimalPipe} from '../helpers/decimalNumber.pipe'
// import {FormatTime} from '../helpers/timeFormat.pipe'
// import {SplitNameDate} from '../helpers/splitNameDate.pipe'
// import {ArraySortPipe} from '../helpers/sortalphabet.pipe'
// import { NewClientComponent } from './new-client/new-client.component';
// import { MtdClientsComponent } from './mtd-clients/mtd-clients.component';
// import { YtdClientsComponent } from './ytd-clients/ytd-clients.component';
// import { FdsBookedComponent } from './fds-booked/fds-booked.component';
// import { FdsMaturedComponent } from './fds-matured/fds-matured.component';
// import {KeysPipe} from '../helpers/keyValue.pipe';
// import {FilterClientCodePipe} from '../helpers/filter-client-code.pipe'
// import { ReportDetailsComponent } from './report-details/report-details.component';
// import { RaaDebitComponent } from './raa-debit/raa-debit.component';
// import {filterSerchPipe} from '../helpers/filterSearch.pipe'
// import {ScrollbarThemeDirective} from 'src/app/directives/scrollbar-theme.directive'
// import {InputRestrictionDirective} from 'src/app/directives/specialchar.directive'
import { NgSelectModule } from '@ng-select/ng-select';
// import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { CodeInputModule } from 'angular-code-input';

// import {cleverTapService} from 'src/app/helpers/clevertap.service'
// import { PhysicalFnoConfirmModalMobileComponent } from '../physical-fno-confirm-modal-mobile/physical-fno-confirm-modal-mobile.component';
// import { PhysicalFnoSuccessModalMobileComponent } from '../physical-fno-success-modal-mobile/physical-fno-success-modal-mobile.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NumberFormatPipe } from './pipes.module';
// import { DateSortingPipe } from '../helpers/date-sorting.pipe';
// import { PreventDoubleClickDirective } from '../directives/preventdoubleclick.directive';
// import { NumberFormatPipe } from 'src/app/components/pipes.module';
// // import {FamilyPortfolioComponent} from './family-portfolio/family-portfolio.component'
import { NgApexchartsModule } from "ng-apexcharts";
import { SessionExpiredComponent } from './session-expired/session-expired.component';
import { PayDetailsEquityComponent } from './pay-details-equity/pay-details-equity.component';
import { PayDetailsInsuranceComponent } from './pay-details-insurance/pay-details-insurance.component';
import { PayDetailsMutualFundComponent } from './pay-details-mutual-fund/pay-details-mutual-fund.component';
import { PaydetailModelComponent } from './paydetail-model/paydetail-model.component';
import { StatusRequestComponent } from './status-request/status-request.component';
import { PayDetailsWithViewComponent } from './pay-details-with-view/pay-details-with-view.component';
import { TotalClientsComponent } from './total-clients/total-clients.component';
import { DormantClientsComponent } from './dormant-clients/dormant-clients.component';
import { ClientsNotTradedComponent } from './clients-not-traded/clients-not-traded.component';
import { ClientsDetailsModelComponent } from './clients-details-model/clients-details-model.component';
import { AccountDetailsComponent } from './client-account-details/client-account-details.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ForgotPasswordDesktopComponent } from './forgot-password-desktop/forgot-password-desktop.component';
import { ForgotPasswordMobileComponent } from './forgot-password-mobile/forgot-password-mobile.component';
import { AgreeComponent } from './agree/agree.component';
import { BusinessOpportunitiesDetailsComponent } from './business-opportunities-details/business-opportunities-details.component';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import { SearchComponent } from './search/search.component';
import { PopoverComponent } from './popover/popover.component';
import { SipBookComponent } from './sip-book/sip-book.component';
import { FdsMaturingComponent } from './fds-maturing/fds-maturing.component';
import { DashbordSipComponent } from './dashbord-sip/dashbord-sip.component';
import { EditWatchlistDesktopComponent } from './edit-watchlist-desktop/edit-watchlist-desktop.component';
import { EditWatchlistMobileComponent } from './edit-watchlist-mobile/edit-watchlist-mobile.component';
import { IndicesDetailsComponent } from './indices-details/indices-details.component';
import { BrokerageComponent } from './brokerage/brokerage.component';
import { YourKpiModalComponent } from './your-kpi-modal/your-kpi-modal.component';
import { LeadsStatusModalComponent } from './leads-status-modal/leads-status-modal.component';
import { FormFormatComponent } from './form-format/form-format.component';
import { BrokerageAccessControlModalComponent } from './brokerage-access-control-modal/brokerage-access-control-modal.component';
import { AddToWatchlistComponent } from './add-to-watchlist/add-to-watchlist.component';
import { SuperstarsComponent } from './superstars/superstars.component';
import { CommodityContractInfoComponent } from './commodity-contract-info/commodity-contract-info.component';
import { AumComponent } from './aum/aum.component';
import { UniqueClientsComponent } from './unique-clients/unique-clients.component';
import { BrokerageEquityComponent } from './brokerage-equity/brokerage-equity.component';
import { BrokerageOthersComponent } from './brokerage-others/brokerage-others.component';
import { BrokerageMutualFundComponent } from './brokerage-mutual-fund/brokerage-mutual-fund.component';
import { AumEquityComponent } from './aum-equity/aum-equity.component';
import { AumMutualFundComponent } from './aum-mutual-fund/aum-mutual-fund.component';
import { DetailsComponent } from './details/details.component';
import { SipLiveComponent } from './sip-live/sip-live.component';
import { AumFdComponent } from './aum-fd/aum-fd.component';
import { AumPmsComponent } from './aum-pms/aum-pms.component';
import { AumMldsComponent } from './aum-mlds/aum-mlds.component';
import { TotalAfypComponent } from './total-afyp/total-afyp.component';
import { AfypLifeInsuranceComponent } from './afyp-life-insurance/afyp-life-insurance.component';
import { AfypHealthInsuranceComponent } from './afyp-health-insurance/afyp-health-insurance.component';
import { AfypGeneralInsuranceComponent } from './afyp-general-insurance/afyp-general-insurance.component';
import { ScoreComponent } from './score/score.component';
import { CommonHeaderComponent } from './common-header/common-header.component';
import { CommonHeaderRevampComponent } from './common-header-revamp/common-header-revamp.component';
import { AddUserComponent } from './add-user/add-user.component';
import { MutualFundProductsMoreComponent } from './mutual-fund-products-more/mutual-fund-products-more.component';
import { ComingSoonPopoverComponent } from './coming-soon-popover/coming-soon-popover.component';
import { IpoComponent } from './ipo/ipo.component';
import { DeleteScripComponent } from './delete-scrip/delete-scrip.component';
import { MarketStatusComponent } from './market-status/market-status.component';
import { ExposureListComponent } from './exposure-list/exposure-list.component';
import { ExposureScripDetailsComponent } from './exposure-scrip-details/exposure-scrip-details.component';
import { SnapshotViewAllComponent } from './snapshot-view-all/snapshot-view-all.component';
import { ClientInteractionsComponent } from '../client-interactions/client-interactions.component';
import { RiskProfileComponent } from '../risk-profile/risk-profile.component';
import { IndicesIndicesComponent } from './indices-indices/indices-indices.component';
import { IndicesMarketsComponent } from './indices-markets/indices-markets.component';
import { NoDataComponent } from './no-data/no-data.component';
import { IndicesCommodityComponent } from './indices-commodity/indices-commodity.component';
import { IndicesCurrencyComponent } from './indices-currency/indices-currency.component';
import { SupportComponent } from './support/support.component';
import { LimitInsertFormComponent } from './limit-insert-form/limit-insert-form.component';
import { JvInsertFormComponent } from './jv-insert-form/jv-insert-form.component';
import { EpiSharesStatusComponent } from './epi-shares-status/epi-shares-status.component';
import { EpiSharesFormComponent } from './epi-shares-form/epi-shares-form.component';
import { BrokerageInsertFormComponent } from './brokerage-insert-form/brokerage-insert-form.component';
import { MessagePopup } from './message-popup/message-popup.component';
import { ProductActivateDeactivateComponent } from './product-activate-deactivate/product-activate-deactivate.component';
import { ClientMappingComponent } from './client-mapping/client-mapping.component';
import { ClientMappingFailModalComponent } from './client-mapping-fail-modal/client-mapping-fail-modal.component';
import { CmsEntryComponent } from './cms-entry/cms-entry.component';
import { CmsEntryDetailComponent } from './cms-entry-detail/cms-entry-detail.component';
import { MoveFundsComponent } from './move-funds/move-funds.component';
import { SendtoBankComponent } from './sendto-bank/sendto-bank.component';
import { PayoutHistoryComponent } from './payout-history/payout-history.component';
import { DpTransactionComponent } from './dp-transaction/dp-transaction.component';
import { MutualFundComponent } from './mutual-fund/mutual-fund.component';
import { AccStatementComponent } from './acc-statement/acc-statement.component';
import { RealisedPnlComponent } from './realised-pnl/realised-pnl.component';
import { SimplifiedLedgerComponent } from './simplified-ledger/simplified-ledger.component';
import { UnrealizedPnlComponent } from './unrealized-pnl/unrealized-pnl.component';
import { TradeListingComponent } from './trade-listing/trade-listing.component';
import { DpcWorkingComponent } from './dpc-working/dpc-working.component';
import { DpcWorkingMobileComponent } from './dpc-working-mobile/dpc-working-mobile.component';
import { DigiContractNotesComponent } from './digital-contract-notes/digital-contract-notes.component';
import { DigiContractMobileComponent } from './digital-contract-mobile/digital-contract-mobile.component';
import { AmcReportComponent } from './amc-report/amc-report.component';
import { CommodityRealTimeReportComponent } from './commodity-real-time-report/commodity-real-time-report.component';
import { EmiCalculatorComponent } from './emi-calculator/emi-calculator.component';
import { SipCalculatorComponent } from './sip-calculator/sip-calculator.component';
import { SipRevenueCalculatorComponent } from './sip-revenue-calculator/sip-revenue-calculator.component';
import { SpanMarginCalculatorComponent } from './span-margin-calculator/span-margin-calculator.component';
import { GoalCalculatorComponent } from './goal-calculator/goal-calculator.component';
import { ClientHoldingsComponent } from './client-holdings/client-holdings.component';
import { ClientLivePlComponent } from './client-live-pl/client-live-pl.component';
import { ClientNetPositionComponent } from './client-net-position/client-net-position.component';
import { ClientMarginComponent } from './client-margin/client-margin.component';
import { ClientOrderbookComponent } from './client-orderbook/client-orderbook.component';
import { ClientTradebookComponent } from './client-tradebook/client-tradebook.component';
import { ClientLedgerComponent } from './client-ledger/client-ledger.component';
import { ClientProfileCaptureModalComponent } from './client-profile-capture-modal/client-profile-capture-modal.component';
import { ClientRMPortfolioComponent } from './client-rm-portfolio/client-rm-portfolio.component';
import { ClientDetailsWebComponent } from './client-details-web/client-details-web.component';
import { FiltersComponent } from './filters/filters.component';
import { ConsolidatedHoldingsComponent } from './consolidated-holdings/consolidated-holdings.component';
import { ConsolidatedOrderbookComponent } from './consolidated-orderbook/consolidated-orderbook.component';
import { ConsolidatedTradebookComponent } from './consolidated-tradebook/consolidated-tradebook.component';
import { FundPayinPayoutComponent } from './fund-payinout/fund-payinout.component';
import { HelpFaqComponent } from './help-faq/help-faq.component';
import { HelpFaqRootComponent } from './help-faq-root/help-faq-root.component';
import { HelpFaqSubrootComponent } from './help-faq-subroot/help-faq-subroot.component';
import { HelpPartnerQueryComponent } from './help-partner-query/help-partner-query.component';
import { HelpSearchQuesComponent } from './help-search-ques/help-search-ques.component';
import { FaqDetailsComponent } from './faq-details/faq-details.component';
import { SummaryConfirmModalComponent } from './summary-confirm-modal/summary-confirm-modal.component';
import { SummaryReasonsModalComponent } from './summary-reasons-modal/summary-reasons-modal.component';
import { BodHoldingComponent } from './bod-holding/bod-holding.component';
import { BodHoldingBreakdownnModalComponent } from './bod-holding-breakdownn-modal/bod-holding-breakdownn-modal.component';
import { BodHoldingModalMobileComponent } from './bod-holding-modal-mobile/bod-holding-modal-mobile.component';
import { BodCollateralModalComponent } from './bod-collateral-modal/bod-collateral-modal.component';
import { BodHoldingMobileComponent } from './bod-holding-mobile/bod-holding-mobile.component';
import { JvRequestComponent } from './jv-request/jv-request.component';
import { ConsolidatedTradeListingComponent } from './consolidated-trade-listing/consolidated-trade-listing.component';
import { LimitRequestStatusPage } from './limit-request-status/limit-request-status.component';
import { ShareDepositReportComponent } from './share-deposit-report/share-deposit-report.component';
import { CommoditySummaryComponent } from './commodity-summary/commodity-summary.component';
import { PayoutSummaryReportComponent } from './payout-summary-report/payout-summary-report.component';
import { BrokerageRequestsStatusComponent } from './brokerage-requests-status/brokerage-requests-status.component';
import { EquityDepositDetailsComponent } from './equity-deposit-details/equity-deposit-details.component';
import { BrokerageLedgerReportComponent } from './brokerage-ledger-report/brokerage-ledger-report.component';
import { NfdcRiskReportComponent } from './nfdc-risk-report/nfdc-risk-report.component';
import { NfdcRiskReportMobileComponent } from './nfdc-risk-report-mobile/nfdc-risk-report-mobile.component';
import { HoldPhysicalFnoReportComponent } from './hold-physical-fno-report/hold-physical-fno-report.component';
import { HoldPhysicalFnoReportMobileComponent } from './hold-physical-fno-report-mobile/hold-physical-fno-report-mobile.component';
import { PhysicalFnoConfirmModalMobileComponent } from '../physical-fno-confirm-modal-mobile/physical-fno-confirm-modal-mobile.component';
import { PhysicalFnoSuccessModalMobileComponent } from '../physical-fno-success-modal-mobile/physical-fno-success-modal-mobile.component';
import { ClientSummaryComponent } from './client-summary/client-summary.component';
import { ClientSummaryMobileComponent } from './client-summary-mobile/client-summary-mobile.component';
import { ClientSummaryRemarksComponent } from './client-summary-remarks/client-summary-remarks.component';
import { DpScripPayoutComponent } from './dp-scrip-payout/dp-scrip-payout.component';
import { DpScriptPayoutMobileComponent } from './dp-script-payout-mobile/dp-script-payout-mobile.component';
import { RealTimeMarginShortfallComponent } from './real-time-margin-shortfall/real-time-margin-shortfall.component';
import { ScriptwiseSummaryComponent } from './scriptwise-summary/scriptwise-summary.component';
import { CommodityClientScripSummaryComponent } from './commodity-client-scrip-summary/commodity-client-scrip-summary.component';
import { VasDetailedReportComponent } from './vas-detailed-report/vas-detailed-report.component';
import { FreezeDetailsComponent } from './freeze-details/freeze-details.component';
import { DpModificationDetailsComponent } from './dp-modification-details/dp-modification-details.component';
import { AccountClosureStatusComponent } from './account-closure-status/account-closure-status.component';
import { BrokInsertMobileComponent } from './brok-insert-mobile/brok-insert-mobile.component';
import { GenerateOtpComponent } from './generate-otp/generate-otp.component';
import { ClientMappingMobileComponent } from './client-mapping-mobile/client-mapping-mobile.component';
import { BrokerageTotalComponent } from './brokerage-total/brokerage-total.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { TableDropdownComponent } from './table-dropdown/table-dropdown.component';
import { LedgerPopoverComponent } from './ledger-popover/ledger-popover.component';
import { MutualFundHoldingsComponent } from './mutual-fund-holdings/mutual-fund-holdings.component';
import { SipRegistrationBookComponent } from './sip-registration-book/sip-registration-book.component';
import { MfOrderbookComponent } from './mf-orderbook/mf-orderbook.component';
import { PayDetailsSearchHeaderComponent } from './pay-details-search-header/pay-details-search-header.component';
import { SipBouncedComponent } from './sip-bounced/sip-bounced.component';
import { SipCeasedComponent } from './sip-ceased/sip-ceased.component';
import { SipNewComponent } from './sip-new/sip-new.component';
import { PayDetailsWithDropdownComponent } from './pay-details-with-dropdown/pay-details-with-dropdown.component';
import { BusinessOppsListComponent } from './business-opps-list/business-opps-list.component';
import { CustomFilterPipe } from '../helpers/custom-filter.pipe';
import { SettlementPayoutReportComponent } from './settlement-payout-report/settlement-payout-report.component';
import { IPDetailsComponent } from './ip-details/ip-details.component';
import { OrderByPipe } from '../helpers/order-by.pipe';
import { AccountActivationModelComponent } from './account-activation-model/account-activation-model.component';
import { DpHoldingReportsComponent } from './dp-holding-reports/dp-holding-reports.component';
import { DematRequestStatusComponent } from './demat-request-status/demat-request-status.component';
import { DemapClientMappingComponent } from './demap-client-mapping/demap-client-mapping.component';
import { DemapListComponent } from './demap-list/demap-list.component';
import { DematRequestFormsComponent } from './demat-request-forms/demat-request-forms.component';
import { GuestTotalClientsComponent } from '../guest-login/components/total-clients/guest-total-clients.component';
import { GuestBrokerageComponent } from '../guest-login/components/brokerage/guest-brokerage.component';
import { AddQuickLinkComponent } from './add-quick-link/add-quick-link.component';
import { QuickLinkModalComponent } from './quick-link-modal/quick-link-modal.component';
import { DashboardOverallTabComponent } from './dashboard-overall-tab/dashboard-overall-tab.component';
import { DashboardMfTabComponent } from './dashboard-mf-tab/dashboard-mf-tab.component';
import { DashboardEquityTabComponent } from './dashboard-equity-tab/dashboard-equity-tab.component';
import { DashboardCrossSellTabComponent } from './dashboard-cross-sell-tab/dashboard-cross-sell-tab.component';
import { GuestAumComponent } from '../guest-login/components/aum/guest-aum.component';
import { BecomePartnerModalComponent } from '../guest-login/components/become-partner-modal/become-partner-modal.component';
import { NotClickableTabsModalComponent } from './not-clickable-tabs-modal/not-clickable-tabs-modal.component';
// -- COMMENTED TILL HERE UNCOMMENT LATER

// import { CreateEventPopupComponent } from './create-event-popup/create-event-popup.component';
// import { EventinfodrawerComponent } from './eventinfodrawer/eventinfodrawer.component';
// import { QrcodePopupComponent } from './qrcode-popup/qrcode-popup.component';
// import { DateAgoPipe } from '../pipes/date-ago.pipe';
// import { NgxQRCodeModule } from 'ngx-qrcode2';
// import { CancelRequestComponent } from './cancel-request/cancel-request.component';
// import { FormatTimePipe } from '../pipes/formatTime.pipe';
// import { GoogleMapComponent } from './google-map/google-map.component';

const COMPONENTS: any = [

    // -- COMMENTED TILL HERE UNCOMMENT LATER
    // CreateEventPopupComponent,
    // GoogleMapComponent,
    // QrcodePopupComponent,
    // EventinfodrawerComponent,
    // CancelRequestComponent
    AddUserComponent,
    DetailsComponent,
    SnapshotViewAllComponent,
    ClientsNotTradedComponent,
    DormantClientsComponent,
    MutualFundHoldingsComponent,
    SipRegistrationBookComponent,
    UnrealizedPnlComponent,
    StatusRequestComponent,
    BrokerageTotalComponent,
    PayDetailsEquityComponent,
    HoldPhysicalFnoReportComponent,
    FilterPopupComponent,
    PayDetailsInsuranceComponent,
    PayDetailsWithDropdownComponent,
    PayDetailsWithViewComponent,
    PayDetailsSearchHeaderComponent,
    PayDetailsMutualFundComponent,
    AumEquityComponent,
    AumMutualFundComponent,
    AumFdComponent,
    AumPmsComponent,
    NoDataComponent,
    SupportComponent,
    AumMldsComponent,
    SipLiveComponent,
    BusinessOpportunitiesDetailsComponent,
    SipNewComponent,
    SipBouncedComponent,
    SipCeasedComponent,
    ClientHoldingsComponent,
    ClientLivePlComponent,
    AumComponent,
    MutualFundComponent,
    SipBookComponent,
    TotalAfypComponent,
    AfypLifeInsuranceComponent,
    AfypHealthInsuranceComponent,
    AfypGeneralInsuranceComponent,
    // NewClientComponent,
    // MtdClientsComponent,
    // YtdClientsComponent,
    UniqueClientsComponent,
    TotalClientsComponent,
    GuestAumComponent,
    GuestTotalClientsComponent,
    GuestBrokerageComponent,
    BrokerageComponent,
    BrokerageEquityComponent,
    BrokerageMutualFundComponent,
    BrokerageOthersComponent,
    FdsMaturingComponent,
    // FdsBookedComponent,
    // FdsMaturedComponent,
    ClientNetPositionComponent,
    ComingSoonPopoverComponent,
    ClientMarginComponent,
    AgreeComponent,
    ClientOrderbookComponent,
    EmiCalculatorComponent,
    SipCalculatorComponent,
    SipRevenueCalculatorComponent,
    SpanMarginCalculatorComponent,
    GoalCalculatorComponent,
    ClientTradebookComponent,
    SearchComponent,
    FiltersComponent,
    AmcReportComponent,
    CommoditySummaryComponent,
    CommodityRealTimeReportComponent,
    IndicesIndicesComponent,
    IndicesCommodityComponent,
    IndicesCurrencyComponent,
    IndicesMarketsComponent,
    ClientLedgerComponent,
    ClientDetailsWebComponent,
    ConsolidatedOrderbookComponent,
    ConsolidatedTradebookComponent,
    ConsolidatedHoldingsComponent,
    SessionExpiredComponent,
    EditWatchlistMobileComponent,
    EditWatchlistDesktopComponent,
    ForgotPasswordDesktopComponent,
    ForgotPasswordMobileComponent,
    SuperstarsComponent,
    IndicesDetailsComponent,
    CommonHeaderRevampComponent,
    AddToWatchlistComponent,
    MutualFundProductsMoreComponent,
    // SuccessfullComponent,
    CommodityContractInfoComponent,
    DeleteScripComponent,
    NfdcRiskReportComponent,
    // RaaDebitComponent,
    DigiContractNotesComponent,
    DigiContractMobileComponent,
    BodHoldingComponent,
    RealisedPnlComponent,
    ClientSummaryComponent,
    PopoverComponent,
    CommonHeaderComponent,
    MarketStatusComponent,
    ExposureListComponent,
    ProductActivateDeactivateComponent,
    ExposureScripDetailsComponent,
    FundPayinPayoutComponent,
    PaydetailModelComponent,
    LeadsStatusModalComponent,
    CmsEntryComponent,
    CmsEntryDetailComponent,
    IpoComponent,
    MessagePopup,
    FormFormatComponent,
    JvRequestComponent,
    YourKpiModalComponent,
    BrokerageInsertFormComponent,
    BrokerageRequestsStatusComponent,
    LimitRequestStatusPage,
    LimitInsertFormComponent,
    JvInsertFormComponent,
    ShareDepositReportComponent,
    // ReportDetailsComponent,
    EquityDepositDetailsComponent,
    BrokerageLedgerReportComponent,
    PayoutSummaryReportComponent,
    ClientSummaryRemarksComponent,
    SimplifiedLedgerComponent,
    TradeListingComponent,
    ClientsDetailsModelComponent,
    DpTransactionComponent,
    MoveFundsComponent,
    ScoreComponent,
    SendtoBankComponent ,
    PayoutHistoryComponent,
    AccStatementComponent,
    MfOrderbookComponent,
    BrokInsertMobileComponent,
    GenerateOtpComponent,
    DashbordSipComponent,
    BusinessOppsListComponent,
    ClientSummaryMobileComponent,
    SummaryReasonsModalComponent,
    SummaryConfirmModalComponent,
    BodCollateralModalComponent,
    BodHoldingBreakdownnModalComponent,
    BodHoldingModalMobileComponent,
    PhysicalFnoConfirmModalMobileComponent,
    PhysicalFnoSuccessModalMobileComponent,
    HoldPhysicalFnoReportMobileComponent,
    DpcWorkingMobileComponent,
    BodHoldingMobileComponent,
    DpcWorkingComponent,
    ClientMappingComponent,
    DpScriptPayoutMobileComponent,
    DpScripPayoutComponent,
    ClientMappingFailModalComponent,
    ClientMappingMobileComponent,
    LeadDetailsComponent,
    HelpFaqComponent,
    HelpPartnerQueryComponent,
    HelpSearchQuesComponent,
    FaqDetailsComponent,
    HelpFaqRootComponent,
    HelpFaqSubrootComponent,
    RealTimeMarginShortfallComponent,
    NfdcRiskReportMobileComponent,
    ClientInteractionsComponent,
    RiskProfileComponent,
    ClientProfileCaptureModalComponent,
    ScriptwiseSummaryComponent,
    // RiskProfileComponent,            already there
    ClientRMPortfolioComponent,
    AccountDetailsComponent,
    BrokerageAccessControlModalComponent,
    AnalyticsComponent,
    // // FamilyPortfolioComponent,
    ConsolidatedTradeListingComponent,
    CommodityClientScripSummaryComponent,
    VasDetailedReportComponent,
    AddQuickLinkComponent,
    TableDropdownComponent,
    FreezeDetailsComponent,
    DpModificationDetailsComponent,
    EpiSharesFormComponent,
    EpiSharesStatusComponent,
    AccountActivationModelComponent,
    LedgerPopoverComponent,
    AccountClosureStatusComponent,
    SettlementPayoutReportComponent,
    DpHoldingReportsComponent,
    DematRequestStatusComponent,
    DemapClientMappingComponent,
    DematRequestFormsComponent,
    BecomePartnerModalComponent,
    DemapListComponent,
    QuickLinkModalComponent,
    DashboardOverallTabComponent,
    DashboardMfTabComponent,
    DashboardEquityTabComponent,
    DashboardCrossSellTabComponent,
    IPDetailsComponent,
    NotClickableTabsModalComponent
    // -- COMMENTED TILL HERE UNCOMMENT LATER


   // ChartsComponent
    
];

const PIPES: any = [
    
    // DateAgoPipe,
    // FormatTimePipe
    // DateSuffixPipe
    CustomFilterPipe,
    OrderByPipe
];

const MODULES: any = [
    CommonModule,
    IonicModule,
    FormsModule,
    NgChartsModule,
    // NgxQRCodeModule,
    ReactiveFormsModule,
    // DaterangepickerModule,
    // OrderModule,     review
    // Ng2SearchPipeModule,     review
    NgSelectModule,
    // AngularMyDatePickerModule,   review
    CodeInputModule,
    NgxDaterangepickerMd.forRoot(),
    NumberFormatPipe,
    NgApexchartsModule
];

@NgModule({
    imports: [
        ...MODULES,
        // TranslateModule.forChild({
        //     extend: true
        // }),
    ],
    declarations: [CharturlDirective,PreventDoubleClickDirective,FormatUnitNumberPipe,FormatDatePipe,FormatNumberDecimalPipe,FormatTime,SortDatePipe,DateSortingPipe,SplitNameDate,ArraySortPipe,KeysPipe,filterSerchPipe,FilterClientCodePipe,ScrollbarThemeDirective, InputRestrictionDirective,...COMPONENTS,  ...PIPES],
    // entryComponents: [...COMPONENTS],        commented as entryComponents has been deprecated since 9 
    exports: [
        CharturlDirective,
        PreventDoubleClickDirective,
        FormatUnitNumberPipe,
        FormatDatePipe,
        FormatNumberDecimalPipe,
        FormatTime,
        SplitNameDate,
        ArraySortPipe,
        SortDatePipe,
        DateSortingPipe,
        KeysPipe,
        filterSerchPipe,
        ScrollbarThemeDirective,
        InputRestrictionDirective,
      //  ChartsComponent,
        ...MODULES,
        ...COMPONENTS,
        ...PIPES,
    ],
    providers: [
        cleverTapService
        // CreateNewsFeedService,
        // AppVersion
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class SharedModule {}
