import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-guest-having-birthday-modal',
  standalone: true,
  imports: [],
  templateUrl: './guest-having-birthday-modal.component.html',
  styleUrl: './guest-having-birthday-modal.component.scss'
})
export class GuestHavingBirthdayModalComponent implements OnInit {
  constructor(private modalController: ModalController) { }
 
  dismiss(){
		this.modalController.dismiss();
	}

  ngOnInit() {
		
	}

}
