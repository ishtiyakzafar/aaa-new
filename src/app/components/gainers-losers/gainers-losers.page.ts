import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { MarketService } from '../../pages/markets/markets.service';
import { ModalService } from '../modal/modal.service';


@Component({
	selector: 'app-gainers-losers',
	providers: [ MarketService ],
	templateUrl: './gainers-losers.page.html',
	styleUrls: ['./gainers-losers.page.scss'],
})
export class GainersLosersPage implements OnInit {
	@Input() gainerLoserData: any;
	gainerDataLoad: any;
	@Input() loosersData: any;
	@Input() childMessage: any;
	// @Input() passtodata2:any;
	@Input() bseLosers: any;
	@Input() bseGainers: any;
	public gainerDataForWEB: any = [];
	public loserDataForWEB: any = [];
	public gainersLosers: any = false;

	constructor(private modalService: ModalService, private router: Router,
		private marService: MarketService) { }

	ngOnInit() {

		// console.log(this.gainerDataLoad);
		/* setTimeout(() => {
			this.optionCheckValue(false);
		}, 1000); */
		/* const exchType = 'N';
		this.getGainersLosersData(exchType);
		const exchType2 = 'B';
		this.getGainersLosersData(exchType2); */
		this.gainersLosers = false;
		const exchType = 'N';
		this.getGainersLosersData(exchType);
		const exchType2 = 'B';
		this.getGainersLosersData(exchType2);
	}

	public getGainersLosersData(exchType: any) {
		//this.gainerDataLoad = false;
		let subscription = null;
		subscription = new Subscription();

		const params = {
			Exchange: exchType,
			ClientLoginType: 0
		}
		subscription.add(
			this.marService
				.getGainersLosers(params)
				.subscribe((response) => {
					if (response['Status'] === 0 && response['Gainer'] && response['Gainer'].length) {
						setTimeout(() => {
							this.gainerDataLoad = true;
							this.optionCheckValue(false);
						}, 1200);
						if (exchType === 'N') {
							this.gainerLoserData = response['Gainer'];
							this.loosersData = response['Looser'];
						} else if (exchType === 'B') {
							this.bseGainers = response['Gainer'];
							this.bseLosers = response['Looser'];
						}
					} else {
						this.gainerDataLoad = true;
						if (exchType === 'N') {
							this.gainerLoserData = response['Gainer'];
							this.loosersData = response['Looser'];
						} else if (exchType === 'B') {
							this.bseGainers = [];
							this.bseLosers = [];
						}
					}
				})
		)
	}


	ionViewWillEnter() {
		/* this.gainerLoserData.forEach((element, index) => {
			// if (index <= 5) {
			this.gainerDataForWEB.push(element);
			// }
		});

		this.loosersData.forEach((element, index) => {
			// if (index <= 5) {
			this.loserDataForWEB.push(element);
			// }
		});
		console.log(this.gainerDataForWEB); */
		/* this.gainersLosers = false;
		const exchType = 'N';
		this.getGainersLosersData(exchType);
		const exchType2 = 'B';
		this.getGainersLosersData(exchType2); */

	}

	public goBack() {
		window.history.back();
	}

	goToAddScript() {
		//this.router.navigate(['/add-script'])
		this.router.navigate(['/dashboard-clients']);
	}

	goToNotification() {
		this.router.navigate(['/notification'])
	}

	goToDashboard() {
        this.router.navigate(['/dashboard']);
    }

	public optionCheckValue(event: any) {
		// console.log(event);
		this.gainerDataLoad = true;
		if (event === true) {
			this.gainerDataForWEB = [];
			this.loserDataForWEB = [];
			this.bseGainers.forEach((element: any, index: any) => {
				// if (index <= 5) {
				this.gainerDataForWEB.push(element);
				// }
			});
			this.bseLosers.forEach((element: any, index: any) => {
				// if (index <= 5) {
				this.loserDataForWEB.push(element);
				// }
			});
			setTimeout(() => {
				this.gainerDataLoad = true;
			}, 1200);
		} else {
			this.gainerDataLoad = true;
			this.gainerDataForWEB = [];
			this.loserDataForWEB = [];
			this.gainerLoserData.forEach((element: any, index: any) => {
				// if (index <= 5) {
				this.gainerDataForWEB.push(element);
				// }
			});
			this.loosersData.forEach((element: any, index: any) => {
				// if (index <= 5) {
				this.loserDataForWEB.push(element);
				// }
			});
			setTimeout(() => {
				this.gainerDataLoad = true;
			}, 1200);
		}

	}

	openModal(id?: any, arrGainer?: any, arrLoser?: any) {
		if (!arrGainer.length && !arrLoser.length) {
			return;
		}
		this.modalService.open(id);
	}

	closeModal(id: string) {
		this.modalService.close(id);
	}

	goToCompanydetail(data: any) {
		this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, data.FullName.split(' ').join('-') + data.ExchType, data.Symbol]);
	}
	// click on scrip and redirect to company-details page
	fromModelToCompanyDetails(data: any, id: any) {
		this.closeModal(id);
		this.router.navigate(['/company-details', data.Exch, data.ExchType, data.ScripCode, data.FullName.split(' ').join('-') + data.ExchType, data.Symbol]);
	}
}