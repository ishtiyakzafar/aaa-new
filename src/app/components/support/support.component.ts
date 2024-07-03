import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
    public datas: any[] = [
        {type: 'FSD & IT helpdesk', detail: 'for tech related queries', mobileNumbers: ['022 62663400']},
        {type: 'Risk Queries', detail: '', mobileNumbers: ['022 66810176', '022 68563668']},
        {type: 'Research & Advisory', detail: '', mobileNumbers: ['022 66117561', '022 61086433']},
      ];
    constructor(public modalController: ModalController) { }

    ngOnInit() { }

    // close popup
    async dismiss() {
        this.modalController.dismiss();
    }

    goToDial(number: any){
        window.location.href = 'tel:'+number
    }


}
