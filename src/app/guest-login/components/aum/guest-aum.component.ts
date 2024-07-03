import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-guest-aum',
	providers: [],
	templateUrl: './guest-aum.component.html',
	styleUrls: ['./guest-aum.component.scss'],
})
export class GuestAumComponent implements OnInit {
	sendDataToChild: boolean | undefined;
	ngOnInit(){
        this.route.queryParams.subscribe(params => {
            if(params['Tab'] == 'MF'){
                this.equityBlockTabValue = 'mutualFund';
            }
            else if(params['Tab'] == 'FD'){
                this.equityBlockTabValue = 'fd';
            }
            else{
                this.equityBlockTabValue = 'equity';
                }
          }
      );
	}
    

	ngOnDestroy(): void {
		
	}
    constructor(private router: Router,private route: ActivatedRoute,) { }


    public equityBlockTabValue = 'equity';
    public cardSegments: any[] = [
        {name: 'Equity', segmentValue:'equity', dataValue: '24.00 Cr', perValue: '(5.21%)'},
        {name: 'Mutual Funds', segmentValue:'mutualFund', dataValue: '10.00 Cr', perValue: '(5.21%)'},
        {name: 'FD/Bonds/NCD', segmentValue:'fd', dataValue: '6.00 Cr', perValue: '(5.21%)'},
        {name: 'PMS/AIF', segmentValue:'pms', dataValue: '8.00 Cr', perValue: '(5.21%)'},
    ]
	mutualFundSegmentValue: string = "totalAum";   // mutual fund segment default value;
    // segment option for mutual fund
    mutualFundBlock: any[] = [
        { Name: 'Total AUM', Value: 'totalAum'},
        { Name: 'SIP Book', Value: 'sipBook'},
    ];
    afypSegmentValue: string = "life";   // afyp segment default value;
    // segment option for afyp
    afypBlock: any[] = [
        { Name: 'Life Insurance', Value: 'life'},
        { Name: 'Health Insurance', Value: 'health'},
        { Name: 'General Insurance', Value: 'general'},
    ];
	back() {
		// this.storage.set('hierarchyList', this.selectOptionArr);
        window.history.back();
	}

	// go to global search page
    goToAddScript() {
		//this.router.navigate(['/add-script']);
		this.router.navigate(['/dashboard-clients']);
	 }

	goToDashboard() {
        this.router.navigate(['/guest/guest-dashboard']);
    }

}
