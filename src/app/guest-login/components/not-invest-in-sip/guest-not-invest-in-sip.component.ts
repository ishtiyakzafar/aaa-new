import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-guest-not-invest-in-sip',
  standalone: true,
  imports: [],
  templateUrl: './guest-not-invest-in-sip.component.html',
  styleUrl: './guest-not-invest-in-sip.component.scss'
})
export class GuestNotInvestInSipComponent {
  constructor(private modalController: ModalController) { }
 
  dismiss(){
		this.modalController.dismiss();
	}

  ngOnInit() {
		
	}
}
