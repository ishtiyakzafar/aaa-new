import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    @Input() datas: any;
    constructor(private modalController: ModalController) { }

    ngOnInit() { }

    dismiss() {
        this.modalController.dismiss();
    }


}
