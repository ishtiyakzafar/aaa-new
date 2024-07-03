import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToasterService {
  
  public toast: any;

  public toasterCtrl: any;

  constructor(public toastController: ToastController) { }

  async showToaster(msg: any) {
    this.toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      cssClass: "textaligntoast"
    });
    this.toast.present();
  }


  //toast message
  async displayToast(message: string, position?: any) {
    if (this.toasterCtrl) {
      this.toasterCtrl.dismiss();
    }
    this.toasterCtrl = await this.toastController.create({
      header: message,
      position: position ? position : 'bottom',
      duration: 2000,
      color: 'dark',
      buttons: [
        {
          side: 'end',
          text: 'Close',
          role: 'cancel'
        }
      ]
    });
    this.toasterCtrl.present();
  }

}
