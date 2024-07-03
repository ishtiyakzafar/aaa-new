import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import saveAs from 'file-saver';
@Component({
  selector: 'app-client-mapping-fail-modal',
  templateUrl: './client-mapping-fail-modal.component.html',
  styleUrls: ['./client-mapping-fail-modal.component.scss'],
})
export class ClientMappingFailModalComponent implements OnInit {
  @Input() ClientList: any;
  dataLoad = false;
  constructor(private modalController: ModalController) { }
  ngOnInit() {}
    dismiss(){
		  this.modalController.dismiss();
	  }
    SaveDemo() {
      this.dataLoad = true;
      let file = new Blob([this.ClientList], { type: 'text/csv;charset=utf-8' });
      saveAs(file, 'ErrorFile.csv');
      this.dataLoad = false;
    }
}