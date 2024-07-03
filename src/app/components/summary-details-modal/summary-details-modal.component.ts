import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-summary-details-modal',
  templateUrl: './summary-details-modal.component.html',
  styleUrls: ['./summary-details-modal.component.scss'],
})
export class SummaryDetailsModalComponent implements OnInit {

  @Input() dataObj: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}
  dismiss(){
		this.modalController.dismiss();
	  }
}
