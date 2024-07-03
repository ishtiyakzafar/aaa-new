import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  addUserTabValue = null;  
  addUserButton: any[] = [
    { user: 'Individual Client Account', icon: 'nri_user.svg', userType: 'Sole account holder', value: 'ICA',  active: 1 },
    { user: 'Joint Account holder', icon: 'nri_user.svg', userType: 'Joint Account holder', value: 'addClient', active: 0 },
    // { user: 'Register Advisor', icon: 'add_user.svg', userType: 'Marketing associate, etc', value: 'advisor', active: 0 },
    { user: 'NRI User', icon: 'register_adviser.svg', userType: 'NRI (NRE/NRO) client', value: 'NRI', active: 0 }
  ];
  constructor( public modalController: ModalController) { }

  ngOnInit() {}

  // close popup
  async dismiss(type?: any) {
    // if ( type === 'ICA' ) return;
    this.modalController.dismiss({
      type: type
    });
  }
}
