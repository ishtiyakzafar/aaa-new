import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bod-collateral-modal',
  templateUrl: './bod-collateral-modal.component.html',
  styleUrls: ['./bod-collateral-modal.component.scss'],
})
export class BodCollateralModalComponent implements OnInit {

  @Input() bodCollateralData: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  convertFunc(val: any){
    let value = parseFloat(val);
    return parseFloat(value.toFixed(2));
  }

  dismiss(){
		this.modalController.dismiss();
	  }

}
