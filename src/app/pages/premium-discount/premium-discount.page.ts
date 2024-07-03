import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MarketService } from '../markets/markets.service';
import { ModalService } from '../../components/modal/modal.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-premium-discount',
  providers: [ MarketService ],
  templateUrl: './premium-discount.page.html',
  styleUrls: ['./premium-discount.page.scss'],
})
export class PremiumDiscountPage implements OnInit {
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

    public loader = true;
    public premiuimPerList: any[] = [];
    public discountPerList: any[] = [];

    constructor(private router: Router, private modalService: ModalService,
        private toast: ToasterService,
        private serviceFile: MarketService) { }

    ngOnInit() {
        this.getData();
    }

    public getData() {
        const preSubscription = new Subscription();

        preSubscription.add(
            this.serviceFile
            .premiumPer()
            .subscribe( (response: any) => {
                if (+(response['response']['status']) === 0) {
                    const res = response['response']['data'];
                    this.premiuimPerList = res['PremiumPercentList']['PercentDetails'];
                    this.loader = false;
                    // this.gainer = res['GetFOOGainerLooserList']['Gainer'];
                    // this.looser = res['GetFOOGainerLooserList']['Looser'];
                } else {
                    // this.dataLoad = false;
                    this.loader = false;
					this.toast.displayToast(response['Head']['ErrorDescription'] ? response['Head']['ErrorDescription'] : response['Body']['Message'] ? response['Body']['Message'] : 'No record found.');
                }
            })
        )

        const disSubscription = new Subscription();

        disSubscription.add(
            this.serviceFile
            .discountPer()
            .subscribe( (response: any) => {
                if (+(response['response']['status']) === 0) {
                    const res = response['response']['data'];
                    this.discountPerList = res['PremiumPercentList']['PercentDetails'];
                    this.loader = false;
                    // this.gainer = res['GetFOOGainerLooserList']['Gainer'];
                    // this.looser = res['GetFOOGainerLooserList']['Looser'];
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
    openModal(id?: any) {
        if (!this.premiuimPerList.length && !this.discountPerList.length) {
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
