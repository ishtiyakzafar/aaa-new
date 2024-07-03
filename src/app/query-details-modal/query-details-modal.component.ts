import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-query-details-modal',
  templateUrl: './query-details-modal.component.html',
  styleUrls: ['./query-details-modal.component.scss'],
})
export class QueryDetailsModalComponent implements OnInit {

  @Input() clientData: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss(){
		this.modalController.dismiss();
	}

}
