import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../pages/markets/markets.service';
import { Router } from '@angular/router';
import { SplitNameDate } from '../../helpers/splitNameDate.pipe'
import { ModalController } from '@ionic/angular';
import { NoDataComponent } from '../no-data/no-data.component';

@Component({
	selector: 'app-indices-commodity',
	providers: [MarketService, SplitNameDate],
	templateUrl: './indices-commodity.component.html',
	styleUrls: ['./indices-commodity.component.scss'],
})
export class IndicesCommodityComponent implements OnInit {
	public dataLoad: boolean = false;
    public skeletonHight:any [] = [
        {}, {}, {}, {}, {}, {}, {}
    ]
	commDataList: any[] = [];
	constructor(private marService: MarketService, private modalController: ModalController, private router: Router, private splitNameData: SplitNameDate) { }

	ngOnInit() {
		this.marService.getCommIndices().subscribe((res: any) => {
			this.commDataList = res['response'].data.CommodityDashboardList.CommodityDashboard;
			setTimeout(() => {
				this.dataLoad = true;
			}, 1000);
		})

	}

	goToCommDetail(dataObj: any) {
		if ((dataObj.Exch == "M" || dataObj.Exch == "N") && (dataObj.ExchType == "D" || dataObj.ExchType == "X" || dataObj.ExchType == "Y") && dataObj.ScripCode != "0") {
			this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, this.splitNameData.transform(dataObj.Symbol, 'date').trim().split(' ').join('-').toUpperCase() + dataObj.ExchType, this.splitNameData.transform(dataObj.Symbol, 'name')]);
		}
		else {
			// alert("Sorry no data to show");
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
