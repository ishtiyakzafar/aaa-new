import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MarketService } from '../markets/markets.service';
import { ModalService } from '../../components/modal/modal.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
	selector: 'app-rollover-delivery',
	providers: [MarketService],
	templateUrl: './rollover-delivery.page.html',
	styleUrls: ['./rollover-delivery.page.scss'],
})
export class RolloverDeliveryPage implements OnInit {

	public loader = true;
	public rollOverData = [];
	public deliveryData = [];

	/* public details: any[] = [
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
		{Symbol: 'GUJGASLTD', LTP: '51.18', PerChange: ' 2.99%'},
	] */
	constructor(private router: Router, private modalService: ModalService,
		private toast: ToasterService,
		private serviceFile: MarketService) { }

	ngOnInit() {
		this.getData();
	}

	public getData() {
		const subscription = new Subscription();

		subscription.add(
			this.serviceFile
				.rollOverPercent()
				.subscribe((response: any) => {
					if (+(response['response']['status']) === 0) {
						const res = response['response']['data'];

						this.rollOverData = res['RollOverPercentageList']['RollOverData'];
						this.loader = false;
					} else {
						// this.dataLoad = false;
						this.loader = false;
						this.toast.displayToast(response['Head']['ErrorDescription'] ? response['Head']['ErrorDescription'] : response['Body']['Message'] ? response['Body']['Message'] : 'No record found.');
					}
				})
		)

		const subscription2 = new Subscription();

		subscription2.add(
			this.serviceFile
				.deliveryPercent()
				.subscribe((response: any) => {
					if (+(response['response']['status']) === 0) {
						const res = response['response']['data'];

						this.deliveryData = res['GetDeliveryPercList']['DeliveryPercData'];
						this.loader = false;
					} else {
						// this.dataLoad = false;
						this.loader = false;
						this.toast.displayToast(response['Head']['ErrorDescription'] ? response['Head']['ErrorDescription'] : response['Body']['Message'] ? response['Body']['Message'] : 'No record found.');
					}
				})
		)
	}

	public goBack() {
		window.history.back();
	}

	goToAddScript() {
		//this.router.navigate(['/add-script']);
		this.router.navigate(['/dashboard-clients']);
		
	}

	goToNotification() {
		this.router.navigate(['/notification'])
	}
	goToDashboard() {
        this.router.navigate(['/dashboard']);
    }

	// to open modal
	openModal(id?: any, arr?: any) {
		if (!this.rollOverData.length && !this.deliveryData.length) {
			return;
		}
		this.modalService.open(id);
	}

	// to close modal
	closeModal(id: string) {
		this.modalService.close(id);
	}

	goToCompanydetail(data: any, id?: any) {
		if (id) this.closeModal(id);
		this.router.navigate(['/company-details', 'N', "D", data.ScripCode, data.Symbol + 'D', data.Symbol]);
	}

}
