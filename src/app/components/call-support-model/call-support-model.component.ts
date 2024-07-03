import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-call-support-model',
  templateUrl: './call-support-model.component.html',
  styleUrls: ['./call-support-model.component.scss'],
})
export class CallSupportModelComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {}
  
  dismiss(){
    this.modalController.dismiss();
  }

}
