import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-not-clickable-tabs-modal',
  templateUrl: './not-clickable-tabs-modal.component.html',
  styleUrl: './not-clickable-tabs-modal.component.scss'
})
export class NotClickableTabsModalComponent {
  constructor(private modalController: ModalController, private commonService: CommonService) { }
 
  dismiss(){
  this.modalController.dismiss();
  }

  ngOnInit() {}
}
