import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-guest-brokerage',
	providers: [],
	templateUrl: './guest-brokerage.component.html',
	styleUrls: ['./guest-brokerage.component.scss'],
})
export class GuestBrokerageComponent implements OnInit {
	constructor(private router: Router,private route: ActivatedRoute,) { }
	ngOnInit(){
		this.route.queryParams.subscribe(params => {
			if(params['Tab'] == 'MF'){
				this.equityBlockTabValue = 'mutual';
		}
			else if(params['Tab'] == 'FD'){
				this.equityBlockTabValue = 'others';
			}
			else{
				this.equityBlockTabValue = 'equity';
			}
		  }
	  );
	}

	ngOnDestroy(): void {
		
	}
	public equityBlockTabValue: any = 'equity';
	public cardSegments: any[] = [
		{ name: 'Equity (YTD)', segmentValue: 'equity', dataValue: '200 K' },
		{ name: 'Mutual Funds (YTD)', segmentValue: 'mutual', dataValue: '110 K' },
		{ name: 'Others (YTD)', segmentValue: 'others', dataValue: '90 K' },

	]

	back() {
		window.history.back();
   }

   

   goToDashboard() {
	   this.router.navigate(['/guest/guest-dashboard']);
   }
}
