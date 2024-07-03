import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-snapshot-view-all',
    templateUrl: './snapshot-view-all.component.html',
    styleUrls: ['./snapshot-view-all.component.scss'],
})
export class SnapshotViewAllComponent implements OnInit {
    @Input() nscBscValue: boolean = false;
    constructor(public modalController: ModalController) { }

    ngOnInit() { 
        // console.log(this.nscBscValue);
    }

    closeModal() {
        const passData: any = {};
        passData['nscBscValue'] = this.nscBscValue;
        this.modalController.dismiss({
          dismissed: true,
          passData
        });
     }

}
