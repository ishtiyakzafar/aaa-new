import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {
    public scoreDetails: any[] = [
        {   totalPoints: 1000, pointsType: 'IGLC Points', des: 'Knowledge session at local place + Certificate of appreciation.',
            qualifyMessage: '', qualifyStatus: true
        },
        {   totalPoints: 2000, pointsType: 'IGLC Points', des: 'Knowledge session at Sardar Sarovar dam 1 day + 1 night',
            qualifyMessage: '800 more points to qualify', qualifyStatus: false
        },
        {   totalPoints: 5000, pointsType: 'IGLC Points', des: 'Knowledge session at Hyderabad 2 days + 2 Nights',
            qualifyMessage: '1300 more points to qualify', qualifyStatus: false
        },
        {   totalPoints: 7500, pointsType: 'IGLC Points', des: 'Knowledge session at Kasoli 3 days + 2 Nights',
            qualifyMessage: '1550 more points to qualify', qualifyStatus: false
        },
    ]
    constructor(public modalController: ModalController) { }

    ngOnInit() { }

    async dismiss() {
        return this.modalController.dismiss();
    }

}
