import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-status-request',
  templateUrl: './status-request.component.html',
  styleUrls: ['./status-request.component.scss'],
})
export class StatusRequestComponent implements OnInit {
  msgContent:any;
  titleClass:any;
  buttonVisibility?:number
  title:any;
  iconType:any
  constructor(private modalController: ModalController, private navParams:NavParams) { }

  ngOnInit() {
    this.msgContent = this.navParams.data['msgContent'];
    
  }

  async dismiss() {
      await this.modalController.dismiss();
  }

  async dismissPopup(){
    await this.modalController.dismiss();
  }

}
