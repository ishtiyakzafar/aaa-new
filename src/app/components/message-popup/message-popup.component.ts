import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
	selector: 'app-message-popup',
	providers: [],
	templateUrl: './message-popup.component.html',
	styleUrls: ['./message-popup.component.scss'],
})
export class MessagePopup implements OnInit {
	@Input() msgList: any;
	constructor(
		public modalController: ModalController
	) { }

	ngOnInit() {
		console.log(this.msgList);

	}

	public loadstartCallback(event: any) {
		console.log('Loading started: ' + event.url)
	}

	public loadstopCallback(event: any) {
		console.log('Loading finished: ' + event.url)
	}

	public loaderrorCallback(error: any) {
		console.log('Loading error: ' + error.message)
	}

	public exitCallback() {
		console.log('Browser is closed...')
	}

	/**
	 * To close popup.
	 */
	async dismisss() {
		this.modalController.dismiss();
	}
}