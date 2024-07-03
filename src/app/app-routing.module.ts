import { GuestTabsPageModule } from './guest-login/tabs/guest-tabs.module';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NoPortfolioDataComponent } from './no-portfolio-data/no-portfolio-data.component';
import { Portfolio360AuthGuard } from './guards/portfolio360.guard';
import { AccountDetailsComponent } from './components/client-account-details/client-account-details.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

const routes: Routes = [
  {
    path: 'demo',
    loadChildren: () => import('./guest-login/pages/login/guest-login.module').then( m => m.GuestLoginPageModule)
  },
  {
    path: 'guest',
    loadChildren: () => import('./guest-login/tabs/guest-tabs.module').then( m => m.GuestTabsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  // {
  //   path: 'sign-in',
  //   loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)
  // },
  // {
  //   path: 'nifty-script',
  //   loadChildren: () => import('./pages/nifty-script/nifty-script.module').then( m => m.NiftyScriptPageModule)
  // },
  {
    path: 'login',
    canActivate: [ Portfolio360AuthGuard ],
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {        
    path: 'new-login',
    loadChildren: () => import('./pages/new-login/new-login.module').then( m => m.NewLoginPageModule)
  },
  {
    path: 'client-portfolio-details/:id', 
    component: AccountDetailsComponent
  },
  {        
    path: 'portfolio-analytics',
    component: AnalyticsComponent
  },
  // {
  //   path: 'change-password-mobile',
  //   loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  // },
  // {
  //   path: 'client-list/:id/:id1/:id2/:id3',
  //   loadChildren: () => import('./pages/client-list/client-list.module').then( m => m.ClientListPageModule)
  // },
  // {
  //   path: 'vol-toppers',
  //   loadChildren: () => import('./components/vol-toppers/vol-toppers.module').then( m => m.VolToppersPageModule)
  // },
  // {
  //   path: 'bulk-block-deals',
  //   loadChildren: () => import('./components/bulk-block-deals/bulk-block-deals.module').then( m => m.BulkBlockDealsPageModule)
  // },
  // {
  //   path: 'aum-equity',
  //   loadChildren: () => import('./pages/aum-equity/aum-equity.module').then( m => m.AumEquityPageModule)
  // },
  // {
  //   path: 'aum-mutual-fund',
  //   loadChildren: () => import('./pages/aum-mutual-fund/aum-mutual-fund.module').then( m => m.AumMutualFundPageModule)
  // },
  // {
  //   path: 'aum-fd',
  //   loadChildren: () => import('./pages/aum-fd/aum-fd.module').then( m => m.AumFdPageModule)
  // },
  // {
  //   path: 'aum-pms',
  //   loadChildren: () => import('./pages/aum-pms/aum-pms.module').then( m => m.AumPmsPageModule)
  // },
  // {
  //   path: 'aum-mlds',
  //   loadChildren: () => import('./pages/aum-mlds/aum-mlds.module').then( m => m.AumMldsPageModule)
  // },
  // {
  //   path: 'sip-live',
  //   loadChildren: () => import('./pages/sip-live/sip-live.module').then( m => m.SipLivePageModule)
  // },
  // {
  //   path: 'sip-new',
  //   loadChildren: () => import('./pages/sip-new/sip-new.module').then( m => m.SipNewPageModule)
  // },
  // {
  //   path: 'sip-bounced',
  //   loadChildren: () => import('./pages/sip-bounced/sip-bounced.module').then( m => m.SipBouncedPageModule)
  // },
  // {
  //   path: 'sip-ceased',
  //   loadChildren: () => import('./pages/sip-ceased/sip-ceased.module').then( m => m.SipCeasedPageModule)
  // },
  
  // {
  //   path: 'new-clients',
  //   loadChildren: () => import('./pages/new-clients/new-clients.module').then( m => m.NewClientsPageModule)
  // },
  // {
  //   path: 'mtd-clients',
  //   loadChildren: () => import('./pages/mtd-clients/mtd-clients.module').then( m => m.MtdClientsPageModule)
  // },
  // {
  //   path: 'ytd-clients',
  //   loadChildren: () => import('./pages/ytd-clients/ytd-clients.module').then( m => m.YtdClientsPageModule)
  // },
  
  // {
  //   path: 'fds-booked',
  //   loadChildren: () => import('./pages/fds-booked/fds-booked.module').then( m => m.FdsBookedPageModule)
  // },
  // {
  //   path: 'fds-matured',
  //   loadChildren: () => import('./pages/fds-matured/fds-matured.module').then( m => m.FdsMaturedPageModule)
  // },
  // {
  //   path: 'superstart-shares',
  //   loadChildren: () => import('./pages/superstart-shares/superstart-shares.module').then( m => m.SuperstartSharesPageModule)
  // },
  // {
  //   path: 'my-profile',
  //   loadChildren: () => import('./pages/my-profile/my-profile.module').then( m => m.MyProfilePageModule)
  // },
  // {
  //   path: 'fut-gainer-loser',
  //   loadChildren: () => import('./pages/fut-gainer-loser/fut-gainer-loser.module').then( m => m.FutGainerLoserPageModule)
  // },
  // {
  //   path: 'fut-oi-gainer-loser',
  //   loadChildren: () => import('./pages/fut-oi-gainer-loser/fut-oi-gainer-loser.module').then( m => m.FutOiGainerLoserPageModule)
  // },
  // {
  //   path: 'rollover-delivery',
  //   loadChildren: () => import('./pages/rollover-delivery/rollover-delivery.module').then( m => m.RolloverDeliveryPageModule)
  // },
  // {
  //   path: 'premium-discount',
  //   loadChildren: () => import('./pages/premium-discount/premium-discount.module').then( m => m.PremiumDiscountPageModule)
  // },
  // {
  //   path: 'most-active-stock-index',
  //   loadChildren: () => import('./pages/most-active-stock-index/most-active-stock-index.module').then( m => m.MostActiveStockIndexPageModule)
  // },
  // {
  //   path: 'option-chain',
  //   loadChildren: () => import('./pages/option-chain/option-chain.module').then( m => m.OptionChainPageModule)
  // },
  // {
  //   path: 'share-reports',
  //   loadChildren: () => import('./pages/share-reports/share-reports.module').then( m => m.ShareReportsPageModule)
  // },
  {
    path: 'family-portfolio', 
    loadChildren: () => import('./components/family-portfolio/family-portfolio.module').then( m => m.FamilyPortfolioModule)
  },
  {
    path: 'not-found',
    component: NoPortfolioDataComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },

  
  
   
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

 
