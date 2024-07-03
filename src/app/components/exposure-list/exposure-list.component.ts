import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MarketService } from '../../pages/markets/markets.service';
import { CommonService } from '../../helpers/common.service';
import { ExposureScripDetailsComponent } from '../exposure-scrip-details/exposure-scrip-details.component';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';


@Component({
	selector: 'app-exposure-list',
	templateUrl: './exposure-list.component.html',
	styleUrls: ['./exposure-list.component.scss'],
})
export class ExposureListComponent implements OnInit {
	public dataLoad: boolean = false;
	toogleExpoTable:boolean = false
	public equityDerList: any[] = [
		{ Category: 'Future & Options', type: 'Selling', Intraday: '1 Times', Delivery: '1 Times' },
		{ Category: 'Options', type: 'Buying', Intraday: '1 Times', Delivery: '1 Times' },
		
	];

	public currencyDerList: any[] = [
		{ Category: 'Future & Options', type: 'Selling', Intraday: '1 Times', Delivery: '1 Times' },
		{ Category: 'Options', type: 'Buying', Intraday: '1 Times', Delivery: '1 Times' },
	];
	equityList:any[] = [];
	derivativeEqList:any[] = [];
	derivativeCurrList:any[] = [];

	constructor(private modalController: ModalController, private router: Router, private storage: StorageServiceAAA, private marService: MarketService, private commonService: CommonService) { }

	ngOnInit() { 
		this.commonService.analyticEvent('Market_Exposure', 'Market Exposure');
		this.storage.get('userID').then((userID) => {
			this.passExchType('C',userID)
			this.passExchType('D',userID)
			this.passExchType('U',userID)
		})
	}
	//function for pass exch type and userID to call API 
	passExchType(exchType: any,userID: any){
        this.dataLoad = false;
		this.marService.getExpoList(exchType,userID).subscribe((res: any) => {
            setTimeout(() => {
                this.dataLoad = true;
            }, 1000);
			if(exchType == 'C'){
				this.equityList = res['body']['Data'];
				// console.log(this.equityList);
			}
			else if(exchType == 'D'){
				this.derivativeEqList = [
					{
						"Intraday": this.calculateValue(res['body']['Data'][0].SellMgnIntra),
						"Delivery": this.calculateValue(res['body']['Data'][0].SellMgnDel),
						"Category": "Future & Options",
						"type": 'Selling'
					},
					{
						"Intraday": this.calculateValue(res['body']['Data'][0].BuyMgnIntra),
						"Delivery": this.calculateValue(res['body']['Data'][0].BuyMgnDel),
						"Category": "Options",
						"type": 'Buying'
					}
				];

			}
			else{
				this.derivativeCurrList = [
					{
						"Intraday": this.calculateValue(res['body']['Data'][0].SellMgnIntra),
						"Delivery": this.calculateValue(res['body']['Data'][0].SellMgnDel),
						"Category": "Future & Options",
						"type": 'Selling'
					},
					{
						"Intraday": this.calculateValue(res['body']['Data'][0].BuyMgnIntra),
						"Delivery": this.calculateValue(res['body']['Data'][0].BuyMgnDel),
						"Category": "Options",
						"type": 'Buying'
					}
	
				];
			}
		})
	}
	// function to convert full name of catagory
	catagotyFullName(catagory: any){
		var catagoryName;
		if(catagory == 'A'){
			catagoryName = 'A - Popular'
		}
		else if(catagory == 'B'){
			catagoryName = 'B - Good'
		}
		else if(catagory == 'C'){
			catagoryName = 'C - Common'
		}
		else if(catagory == 'D'){
			catagoryName = 'D - Normal'
		}
		else if(catagory == 'E'){
			catagoryName = 'E - Excellent'
		}
		else if(catagory == 'Z'){
			catagoryName = 'Z - Black Listed'
		}
		else if(catagory == 'L'){
			catagoryName = 'L - Unknown'
		}
		else{
			catagoryName = "Unknown"
		}
		return catagoryName
	}
	// function to convert value of intra and delivery in times
	calculateValue(value: any){
		return Math.floor(1 / value)+' '+"Times"  
	}
	// open popup
	async openScripDetails(obj: any) {
		const modal = this.modalController.create({
			component: ExposureScripDetailsComponent,
			componentProps: { "expoCatagory": obj },
			cssClass: 'superstars indices-details exposure-list'
		});
		return (await modal).present();
	}

	toogleValue(event: any) {
		// console.log(event);
	}
	// go to catagory Details list in mobile
	goToDetails(passCatagory: any){
		this.router.navigate(['/exposurelist',passCatagory]);
	}
}
