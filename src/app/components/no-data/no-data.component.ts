import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-no-data',
    templateUrl: './no-data.component.html',
    styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent implements OnInit {

    constructor(private modalController: ModalController) { }

    ngOnInit() { }

    async dismiss() {
        return await this.modalController.dismiss();
    }

}
