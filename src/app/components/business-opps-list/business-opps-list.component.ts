import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { DashbordSipComponent } from '../dashbord-sip/dashbord-sip.component';
import { BusinessOpportunitiesDetailsComponent } from '../business-opportunities-details/business-opportunities-details.component';

@Component({
  selector: 'app-business-opps-list',
  templateUrl: './business-opps-list.component.html',
  styleUrls: ['./business-opps-list.component.scss'],
})
export class BusinessOppsListComponent implements OnInit {
  businessOppsCard:any;

  constructor(private commonService: CommonService, private modalController: ModalController) { }

  ngOnInit() {
    this.businessOppsCard = JSON.parse(this.commonService.getData() || "{}");
    // console.log(this.businessOppsCard);
    //this.goBack();
  }

  titleBusinessOpps(key: any, nameOrIcon: string) {
		return this.commonService.displayTitleForBusinessOpps(key, nameOrIcon);
	}

  goBack() {
		window.history.back();
  }
  
  async opportunitiesDetails(type: any, passIndex: any) {
		let modal;
		if (type == 'BouncedSIPs' || type == 'CeasedSIPs' || type == 'MaturingFDCount') {
				modal = await this.modalController.create({
					component: DashbordSipComponent,
					componentProps: { option: type, srNo: passIndex },
					cssClass: 'superstars score business-opportunities'
				});
		
		}

		else {
			modal = await this.modalController.create({
				component: BusinessOpportunitiesDetailsComponent,
				componentProps: { option: type, srNo: passIndex },
				cssClass: 'superstars score business-opportunities'
			});
		}

		modal.present();
	}

}
