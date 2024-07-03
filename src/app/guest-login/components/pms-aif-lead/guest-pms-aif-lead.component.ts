import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-guest-pms-aif-lead',
  standalone: true,
  imports: [],
  templateUrl: './guest-pms-aif-lead.component.html',
  styleUrl: './guest-pms-aif-lead.component.scss'
})
export class GuestPmsAifLeadComponent {
  constructor(private modalController: ModalController) { }
 
  dismiss(){
		this.modalController.dismiss();
	}

  ngOnInit() {
		
	}
}
