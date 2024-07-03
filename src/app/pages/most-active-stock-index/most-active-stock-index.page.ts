import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { MarketService } from '../markets/markets.service';
import { ModalService } from '../../components/modal/modal.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-most-active-stock-index',
  providers: [ MarketService ],
  templateUrl: './most-active-stock-index.page.html',
  styleUrls: ['./most-active-stock-index.page.scss'],
})
export class MostActiveStockIndexPage implements OnInit {

    public loader = true;
    public allMostActiveStock = [];
    public allMostActiveIndex = [];
    public mostActiveStock = [];
    public mostActiveIndex = [];
    public optionValue = false;

    moment: any= moment;

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
        const stockSubscription = new Subscription();

        stockSubscription.add(
            this.serviceFile
            .mostActiveStock()
            .subscribe( (response: any) => {
                if (+(response['response']['status']) === 0) {
                    const res = response['response']['data'];
                    this.allMostActiveStock = res['MostActiveStockAndIndexList']['MostActiveData'];
                    this.mostActiveStock = res['MostActiveStockAndIndexList']['MostActiveData'];
                } else {
                    // this.dataLoad = false;
					this.toast.displayToast(response['Head']['ErrorDescription'] ? response['Head']['ErrorDescription'] : response['Body']['Message'] ? response['Body']['Message'] : 'No record found.');
                }
            })
        )

        const indexSubscription = new Subscription();

        indexSubscription.add(
            this.serviceFile
            .mostActiveStockIndex()
            .subscribe( (response: any) => {
                if (+(response['response']['status']) === 0) {
                    const res = response['response']['data'];
                    this.allMostActiveIndex = res['MostActiveStockAndIndexList']['MostActiveData'];
                    this.mostActiveIndex = res['MostActiveStockAndIndexList']['MostActiveData'];
                    this.optionCheckValue(false);
                } else {
                    // this.dataLoad = false;
					this.toast.displayToast(response['Head']['ErrorDescription'] ? response['Head']['ErrorDescription'] : response['Body']['Message'] ? response['Body']['Message'] : 'No record found.');
                }
            })
        )
    }

    public optionCheckValue(event: any) {
        setTimeout(() => {
            if (event) {
                this.mostActiveStock = this.allMostActiveStock.filter(function (el: any) {
                    return el.OptType == "PE"
                });
                this.mostActiveIndex = this.allMostActiveIndex.filter(function (el: any) {
                    return el.OptType == "PE"
                });
                setTimeout(() => {
                    this.loader = false;
                }, 1500);
            } else {
                this.mostActiveStock = this.allMostActiveStock.filter(function (el: any) {
                    return el.OptType == "CE"
                });
                this.mostActiveIndex = this.allMostActiveIndex.filter(function (el: any) {
                    return el.OptType == "CE"
                });
    
                setTimeout(() => {
                    this.loader = false;
                }, 1500);
            }
        }, 500);
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
        if (!this.mostActiveStock.length && !this.mostActiveIndex.length) {
          return;
        }
        this.modalService.open(id);
    }

    // to close modal
    closeModal(id: string) {
        this.modalService.close(id);
    }
    // FullName: "25 NOV 2021 CE 18.00"         review. no idea

    goToCompanydetail(data: any, id?: any) {
		if (id) this.closeModal(id);
		this.router.navigate(['/company-details', 'N', "D", data.ScripCode, moment(data['Expiry']).format("DD-MMM-YYYY") + '-' + data['OptType'] + 'D', data.Symbol]);
	}
}
