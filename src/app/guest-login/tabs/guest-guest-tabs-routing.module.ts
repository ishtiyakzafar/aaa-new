import { GuestMarketsPageModule } from './../pages/markets/guest-markets.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestTotalClientsComponent } from '../components/total-clients/guest-total-clients.component';
import { GuestBrokerageComponent } from '../components/brokerage/guest-brokerage.component';
import { GuestTabsPage } from './guest-tabs.page';
import { GuestAumComponent } from '../components/aum/guest-aum.component';

const routes: Routes = [
	{
		path: '',
		component: GuestTabsPage,
 		children: [
			{
				path: 'guest-dashboard',
				loadChildren: () => import('../pages/dashboard/guest-dashboard.module').then( m => m.GusetDashboardRevampPageModule)
			},
			{
				path: 'guest-markets',
				loadChildren: () => import('../pages/markets/guest-markets.module').then(m => m.GuestMarketsPageModule)
			},
			{
				path: 'guest-reports',
				loadChildren: () => import('../pages/report-menu/guest-report-menu.module').then(m => m.GuestReportMenuModule)
			},
			{
				path: 'guest-invest',
				loadChildren: () => import('../pages/invest/guest-invest.module').then(m => m.GuestInvestModule)
			},
			{
				path: 'guest-client-trades',
				loadChildren: () => import('../pages/recently-viewed-client-list/guest-recently-viewed-client-list.module').then(m => m.GuestRecentlyViewedClientListPageModule)
			},
			{
				path: 'guest-more',
				loadChildren: () => import('../pages/more-menu/guest-more-menu.module').then( m => m.GuestMoreRevampPageModule)
			},
			{
				path: 'guest-dashboard-aum',
				component: GuestAumComponent
			   },
			   {
				path: 'guest-dashboard-clients',
				component: GuestTotalClientsComponent
			   },
			   {
				path: 'guest-dashboard-brokerage',
				component: GuestBrokerageComponent
			   }		
    ],
  },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GuestTabsPageRoutingModule { }
