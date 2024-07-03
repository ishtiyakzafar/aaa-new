import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../modal/modal.service';
import { MarketService } from '../../pages/markets/markets.service';
import { CommonService } from '../../helpers/common.service';
import {Router} from "@angular/router";
import { ModalController } from '@ionic/angular';
import { SnapshotViewAllComponent } from '../snapshot-view-all/snapshot-view-all.component';

@Component({
  selector: 'app-week-hl',
  templateUrl: './week-hl.page.html',
  providers: [MarketService, CommonService],
  styleUrls: ['./week-hl.page.scss'],
})
export class WeekHlPage implements OnInit {
  nscBschigh:any;
  nscBscLow:any;
  nscBscWeb:any;
  public dataLoad: boolean = false;
  @Input() weekHighLowList: any;
  @Input() weekDataLoad: any;
  public weekHighLowListSecond: any[] = [];
  weekHighLowExchN:any;
  weekHighLowExchB:any;
  displayBscHlData:any;
  displayNscHlData:any;
  highWeekDataN:any = [];
  LowWeekDataN:any = [];
  highWeekDataB:any = [];
  LowWeekDataB:any = [];
  weekListHigh:any = [];
  weekLowList:any = [];
  webHighList:any = [];
  webLowList:any = [];
  previousdate:any;
  ExchTypeCompanyDetail!:string;

  constructor(private modalService: ModalService, public modalController: ModalController, private marService: MarketService, private commonservice: CommonService, private router: Router) { }

  ngOnInit() {
    // console.log('week hl');
    
    this.previousdate = this.commonservice.getToday(new Date());
    this.weekhlWithExch('N', this.previousdate);
    this.weekhlWithExch('B', this.previousdate);
    setTimeout(() => {
      this.changehighBtn(false);
      this.changeLowBtn(false);
      this.nscBscToogleWeb(false);
    }, 1500);

   this.ExchTypeCompanyDetail = 'N';
 
  }

  // view all modal
	async viewDetails() {
		const modal = await this.modalController.create({
			component: SnapshotViewAllComponent,
			cssClass: 'edit-popup-mobile view-all-popup',
			componentProps: { nscBscValue: this.nscBscLow }
		});
        modal.onDidDismiss().then((data) => {
            if (data['data']['passData']) {
                this.nscBscLow = data['data']['passData']['nscBscValue'];
            }
		})
		return await modal.present();
	}

  ionViewWillEnter() {
    console.log('week hl will enter');
  }

  ionViewDidEnter() {
    console.log('week hl did enter');
  }

  public goBack() {
    window.history.back();
  }

  goToAddScript() {
    //this.router.navigate(['/add-script'])
    this.router.navigate(['/dashboard-clients']);
  }

  goToNotification() {
    this.router.navigate(['/notification'])
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
}

  weekhlWithExch(Exch: any,previousdate: any){
    this.dataLoad = false;
      if(Exch == 'N'){
        this.marService.weekHighLow('n', previousdate).subscribe((data: any) => {
          if(data['status'] == 0) {
            setTimeout(() => {
              this.dataLoad = true;
            }, 1600);
          } else {
            setTimeout(() => {
              this.dataLoad = true;
            }, 1600);
          }
          this.weekHighLowExchN  = data['response'].data.CompanyList;
          this.highWeekDataN = this.weekHighLowExchN.High;
          this.LowWeekDataN = this.weekHighLowExchN.Low;
        })
      }
      else if (Exch == 'B'){
        
        this.marService.weekHighLow('b', previousdate).subscribe((data: any) => {if(data['status'] == 0) {
          setTimeout(() => {
            this.dataLoad = true;
          }, 1600);
        } else {
        }

          this.weekHighLowExchB = data['response'].data.CompanyList;
          this.highWeekDataB = this.weekHighLowExchB.High;
          this.LowWeekDataB = this.weekHighLowExchB.Low;

        })

      }
    }
 // 52 week high in Mobile
  changehighBtn(event: any){
    if(event == true){
      this.ExchTypeCompanyDetail = 'B';
      if(this.highWeekDataB.length > 0){
          this.weekListHigh = this.highWeekDataB;
      }
      else{
        this.weekListHigh = [];
      }
    }
    else if(event == false){
      this.ExchTypeCompanyDetail = 'N';
      if(this.highWeekDataN.length > 0){
        this.weekListHigh = this.highWeekDataN;
      }
      else{
        this.weekListHigh = [];
      }
    } 

  }
   // 52 week Low in Mobile
  changeLowBtn(event: any){
    if(event == true){
      this.ExchTypeCompanyDetail = 'B';
      if(this.LowWeekDataB.length > 0){
        this.weekLowList = this.LowWeekDataB;
      }
      else{
        this.weekLowList = [];
      }
    }
    else if(event == false){
      this.ExchTypeCompanyDetail = 'N';
      if(this.LowWeekDataN.length > 0){
        this.weekLowList = this.LowWeekDataN;
      }
      else{
        this.weekLowList = [];
      }
    } 

  }
 // 52 week high nd Low in Mobile
  nscBscToogleWeb(event: any){
    if(event == true){
      this.ExchTypeCompanyDetail = 'B';
      if(this.highWeekDataB.length > 0 && this.LowWeekDataB.length > 0){
          this.webHighList = this.highWeekDataB;
          this.webLowList = this.LowWeekDataB;
      }
      else if(this.highWeekDataB.length > 0 && this.LowWeekDataB.length == 0){
        this.webHighList = this.highWeekDataB;
        this.webLowList = [];
      }
      else if(this.highWeekDataB.length == 0 && this.LowWeekDataB.length > 0){
        this.webHighList = [];
        this.webLowList = this.LowWeekDataB;
      }
      else{
        this.webHighList = [];
        this.webLowList = [];
      }
    }
    else if(event == false){
      this.ExchTypeCompanyDetail = 'N';

      if(this.highWeekDataN.length > 0 && this.LowWeekDataN.length > 0){
        this.webHighList = this.highWeekDataN;
        this.webLowList = this.LowWeekDataN;
      }
      else if(this.highWeekDataN.length > 0 && this.LowWeekDataN.length == 0){
        this.webHighList = this.highWeekDataN;
        this.webLowList = [];
      }
      else if(this.highWeekDataN.length == 0 && this.LowWeekDataN.length > 0){
        this.webHighList = [];
        this.webLowList = this.LowWeekDataN;
      }
      else{
        this.webHighList = [];
        this.webLowList = [];
      }
    }
  }
  openModal(id: string, array?: any) {
    if (!array.length) {
      return;
    }
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }
  goToCompanydetail(data: any){
    this.router.navigate(['/company-details', this.ExchTypeCompanyDetail, 'C', data.ScripCode, data.FullName.split(' ').join('-') + 'C', data.Symbol.trim()]);
  }
  fromModelToCompanydetail(data: any, id: any){
    this.closeModal(id);
    this.router.navigate(['/company-details', this.ExchTypeCompanyDetail, 'C', data.ScripCode, data.FullName.split(' ').join('-') + 'C', data.Symbol.trim()]);
  }
}
