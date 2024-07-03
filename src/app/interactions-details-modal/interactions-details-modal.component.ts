import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-interactions-details-modal',
  templateUrl: './interactions-details-modal.component.html',
  styleUrls: ['./interactions-details-modal.component.scss'],
})
export class InteractionsDetailsModalComponent implements OnInit {

  @Input() clientData: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismisss(){
		this.modalController.dismiss();
	}

}
