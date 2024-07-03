import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { Router} from '@angular/router';


@Component({
  selector: 'app-superstars',
  templateUrl: './superstars.component.html',
  providers: [CommonService],
  styleUrls: ['./superstars.component.scss'],
})
export class SuperstarsComponent implements OnInit {

  @Input() stockData: any;
  showDetails:boolean = false;

  datas: any[] = [
    // {name: 'Government of Singapore-E', held: '4.51%', value: '7,634.29 Cr'},
    // {name: 'SBI Mutual Funds', held: '4.51%', value: '7,634.29 Cr'},
    // {name: 'HDFC Trustee Co. LTD. A/C HDFC Equity OpportunitiesFund - II - 1100D June 2017 (1)', held: '4.51%', value: '7,634.29 Cr'},
  ];
  constructor(public modalController: ModalController, public navCtrl: NavController, private commonservice: CommonService, private router:Router) { }

  ngOnInit() {}

  ionViewWillEnter() {
    // console.log(this.stockData.length);
    this.datas = [];
    if (this.stockData.length > 0) {
      this.showDetails = true;
      this.stockData.forEach((element: any) => {
        this.datas.push({
          name: element[0],
          held: element[1],
          value: element[2],
          link:element[3].split('/clientapi/superstar-shareholders/custom/?superStarName=').join('')
        })
      });
      this.datas = this.datas.sort((a, b) => (a.value > b.value) ? -1 : 1);
    }
    else{
      this.datas = [];
      this.showDetails = false;
    }
    
    
  }

changeFormatData(data: any){
  return this.commonservice.displayDecimalDigits(data);
}

  // close popup
  async dismiss() {
    this.modalController.dismiss();
  }
// redirect to click on names
  goToCompanyShare(dataObj: any){
    this.modalController.dismiss();
    this.router.navigate(['/superstart-shares',"1", dataObj.name.split(' ').join('-'),1]);
  }
  // redirect to other superstars page
  OtherSuperstars() {
    this.dismiss();
    this.router.navigate(['/company-details-superstars']);
  }

}
