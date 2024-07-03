import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-query-thankyou',
  templateUrl: './query-thankyou.component.html',
  styleUrls: ['./query-thankyou.component.scss'],
})
export class QueryThankyouComponent implements OnInit {
  @Input() ticketID: any;

  constructor(public modalController: ModalController, private router: Router) { }

  ngOnInit() {}

  dismiss(){
    this.modalController.dismiss();
  }

  goHome(){
    this.modalController.dismiss();
    this.router.navigate(['/help-support']);
  }

  prevQuery(){
    this.modalController.dismiss();
    this.router.navigate(['/help-partner-query']);
  }

}
