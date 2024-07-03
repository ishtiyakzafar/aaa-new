import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-agree',
  templateUrl: './agree.component.html',
  styleUrls: ['./agree.component.scss'],
})
export class AgreeComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  dissmiss() {
    this.modalController.dismiss();
  }

}
