import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URLS } from '../../../../config/api.config';
import { environment } from '../../../../environments/environment';
import { ToasterService } from '../../../helpers/toaster.service';
import { CommonService } from '../../../helpers/common.service';


@Component({
  selector: 'app-guest-report-menu',
  templateUrl: './guest-report-menu.page.html',
  styleUrls: ['./guest-report-menu.page.scss'],
})
export class GuestReportMenuComponent implements OnInit,OnDestroy  {
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
				
					{ option: 'Risk Report' },
					{ option: 'Real Time Margin Shortfall'},
					{ option: 'Scrip Summary'},
					{ option: 'Fan Payout Summary'},
					{ option: 'Foliowise Client Details'},
					{ option: 'DP Scrip Payout'},
					{ option: 'Commodity Client Summary'},
					{ option: 'Deposit Ledger'},
					{ option: 'Fan Brokerage Ledger'},	
					{ option: 'Commodity Client Scrip Summary'},
					{ option: 'Outstanding Position'},	
					{ option: 'Consolidated Trade Listing'},
					{ option: 'Freeze Details'},
					{ option: 'VAS Detailed Report' },
					{ option: 'DP Modification Details'},
					{ option: 'Account Closure Status'},
					{ option: 'Detailed Clients Report' },
					{ option: 'Settlement Payout Report' },
					{ option: 'DRF Status'}
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
						{ option: 'Realized PnL' },
						{ option: 'Unrealized PnL'},
						{ option: 'BOD Holding'},
						{ option: 'DP Holding'}
					]
				},
				
				{
					innerTitle: 'Daily Reports',
          isOpen:false,
					innerOption:[
						{ option: 'DP Transaction'},
						{ option: 'Trade Listing'},
						{ option: 'STT Certificate'},
						{ option: 'Daily Bills'},
						{ option: 'Digital Contract Notes'},
					]
				},
				{
					innerTitle: 'MF',
          isOpen:false,
					innerOption:[
						{ option: 'MF Capital Gain'},
						{ option: 'MF Account Statement'},
						{ option: 'AMC Statement'},
					]
				},
				{
					innerTitle: 'Others',
          isOpen:false,
					innerOption:[
						{option: 'Commodity Realtime'},
						{option: 'Simplified Ledger'},
						{option: 'Interest on Delayed Payment'},	
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
				{option: 'Scrip Master'},
				{option: 'Shares Deposit'},
				{option: 'GST Invoice'},
				{option: 'Pay Details'},
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
				
					{ option: 'Risk Report'},
					{ option: 'Real Time Margin Shortfall' },
					{ option: 'Commodity Client Summary'},
					{ option: 'Consolidated Trade Listing'},
					{ option: 'DP Scrip Payout'},
					{ option: 'Scrip Summary'},
					{ option: 'Foliowise Client Details'},
					{ option: 'Commodity Client Scrip Summary'},
					{ option: 'Outstanding Report'},
					{ option: 'Freeze Details'},	
					{ option: 'VAS Detailed Report'},
					{ option: 'DP Modification Details'},
					{ option: 'Detailed Clients Report'}	
		
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
						{ option: 'Realized PnL'},
						{ option: 'Unrealized PnL'},
						{ option: 'BOD Holding'},
					]
				},
				
				{
					innerTitle: 'Daily Reports',
					isOpen:false,
					innerOption:[
						{ option: 'DP Transaction'},
				{ option: 'Trade Listing'},
				{ option: 'STT Certificate'},
				{ option: 'Daily Bills'},
				{ option: 'Digital Contract Notes'},
					]
				},
				{
					innerTitle: 'MF',
					isOpen:false,
					innerOption:[
						{ option: 'MF Capital Gain'},
						{ option: 'MF Account Statement'},
						{ option: 'AMC Statement'},
					]
				},
				{
					innerTitle: 'Others',
					isOpen:false,
					innerOption:[
						{option: 'Commodity Realtime'},
				{option: 'Simplified Ledger'},
				{option: 'Interest on Delayed Payment'},
						
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
				{option: 'Scrip Master'},
				]
			}
			]
		}
		// Add more tabs as needed
		];  	  
  constructor(   
    private toast: ToasterService,
    private router: Router,
	private commonService: CommonService) { }

  ngOnInit() {
	
  }

  goToNotification() {
    this.router.navigate(['/notification'])
  }

  goToDashboard() {
    this.router.navigate(['/guest/guest-dashboard']);
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
  

	ngOnDestroy(): void {
		
	}

	showToast() {
		this.commonService.becomePartnerModal();
	}
	

}
