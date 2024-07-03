import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'app-no-internet-popup',
	templateUrl: './no-internet-popup.component.html',
	styleUrls: ['./no-internet-popup.component.scss'],
})
export class NoInternetPopupComponent implements OnInit {

	constructor(private modalController: ModalController) { }

	ngOnInit() { }

	/**
	 * @description : Pop Dimiss Method
	 */
	public dismiss(isTrue: any) {
		// using the injected ModalController this page
		// can "dismiss" itself and optionally pass back data
		this.modalController.dismiss(isTrue);
	}

}
