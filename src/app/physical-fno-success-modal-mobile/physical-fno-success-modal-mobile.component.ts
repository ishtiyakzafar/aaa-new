import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-physical-fno-success-modal-mobile',
  templateUrl: './physical-fno-success-modal-mobile.component.html',
  styleUrls: ['./physical-fno-success-modal-mobile.component.scss'],
})
export class PhysicalFnoSuccessModalMobileComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}
  dismiss(){
    this.modalController.dismiss();
    window.location.reload();
	}

    

}
