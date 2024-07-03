import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bod-holding-breakdownn-modal',
  templateUrl: './bod-holding-breakdownn-modal.component.html',
  styleUrls: ['./bod-holding-breakdownn-modal.component.scss'],
})
export class BodHoldingBreakdownnModalComponent implements OnInit {

  @Input() bodBreakdownData: any;

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
