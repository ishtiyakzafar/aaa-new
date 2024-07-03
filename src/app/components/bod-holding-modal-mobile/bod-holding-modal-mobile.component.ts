import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bod-holding-modal-mobile',
  templateUrl: './bod-holding-modal-mobile.component.html',
  styleUrls: ['./bod-holding-modal-mobile.component.scss'],
})
export class BodHoldingModalMobileComponent implements OnInit {

  @Input() dataObj: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}
  dismiss(){
		this.modalController.dismiss();
	  }

}
