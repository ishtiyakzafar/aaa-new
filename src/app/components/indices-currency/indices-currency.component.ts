import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../pages/markets/markets.service';
import { Router } from '@angular/router';
import { SplitNameDate } from '../../helpers/splitNameDate.pipe'
import { ModalController } from '@ionic/angular';
import { NoDataComponent } from '../no-data/no-data.component';


@Component({
	selector: 'app-indices-currency',
	templateUrl: './indices-currency.component.html',
	providers: [MarketService, SplitNameDate],
	styleUrls: ['./indices-currency.component.scss'],
})
export class IndicesCurrencyComponent implements OnInit {
	public dataLoad: boolean = false;
    public skeletonHight:any [] = [
        {}, {}, {}, {}, {}, {}, {}
    ]
	currencyDataList: any[] = [];
	constructor(private marService: MarketService, private modalController: ModalController, private router: Router, private splitNameData: SplitNameDate) { }

	ngOnInit() {
		this.marService.getCurrIndices().subscribe((data: any) => {
			this.currencyDataList = data['response']['data']['CurrencyDashboardList']['CurrencyDashboard'];
			setTimeout(() => {
				this.dataLoad = true;
			}, 1000);
		})
	}
	goToDetails(dataObj: any) {
		if ((dataObj.Exch == "N" || dataObj.Exch == "B") && dataObj.ExchType == "U" && dataObj.ScripCode != "0") {
			this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, this.splitNameData.transform(dataObj.Symbol, 'date').trim().split(' ').join('-').toUpperCase() + dataObj.ExchType, this.splitNameData.transform(dataObj.Symbol, 'name')]);
		}
		else {
			// alert("Sorry no data to show")
            this.noDataModal();
		}
	}

    async noDataModal() {
        const modal = await this.modalController.create(
            {
                component: NoDataComponent,
                cssClass: 'superstars no-data-modal',
                componentProps: {}
            });
        return await modal.present();
    }
}
