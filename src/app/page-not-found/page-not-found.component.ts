import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {}

  public home() {
    // this.navCtrl.navigateForward('/markets');
    this.navCtrl.navigateForward('/dashboard');
  }

}
