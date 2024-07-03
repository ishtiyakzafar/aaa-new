import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-total-clients',
  providers: [],
  templateUrl: './guest-total-clients.component.html',
  styleUrls: ['./guest-total-clients.component.scss'],
})
export class GuestTotalClientsComponent implements OnInit {
    constructor(private router: Router) { }
    public equityBlockTabValue: any = 'allClients';
    public cardSegments: any[] = [
        {name: 'All Clients', segmentValue:'allClients', clients: 200},
        {name: 'Clients not traded', segmentValue:'clientsNotTraded', clients: 90},
        {name: 'Dormant Clients', segmentValue:'dormatClients', clients: 110},
    ]
	ngOnInit(){
	
	}

	ngOnDestroy(): void {
		
	}

	back() {
		 window.history.back();
	}


	goToDashboard() {
        this.router.navigate(['/guest/guest-dashboard']);
    }
}
