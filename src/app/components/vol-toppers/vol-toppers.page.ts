import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../modal/modal.service';
import { MarketService } from '../../pages/markets/markets.service';
import {Router} from "@angular/router";
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-vol-toppers',
  templateUrl: './vol-toppers.page.html',
  providers: [MarketService],
  styleUrls: ['./vol-toppers.page.scss'],
})
export class VolToppersPage implements OnInit {
  @Input() volToppersList: any[] = [];
  @Input() volumeDataLoad: any;
  public dataLoad: boolean = false;
  topvoltersData:any;
  NscToppers:any = [] ;
  BscToppers:any = [];
  voltopper:boolean = false;
  ExchTypeCompanyDetail!:string;

  constructor(private modalService: ModalService, private marService: MarketService, private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.topVolters('N');
    this.topVolters('B');

    setTimeout(() => {
      this.changeVolValue(false);
      }, 1000);
      this.ExchTypeCompanyDetail = 'N';
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

  // call the function for NSC & BSC
  topVolters(exch: any){
    this.dataLoad = false;
    this.marService.getVolToppers(exch).subscribe((res: any) => {
      this.topvoltersData = res['body']['Data'];
      if(res['head']['status'] === '0'){
        setTimeout(() => {
          this.dataLoad = true;
        }, 1100);
        
        if(exch === 'N'){
          this.NscToppers = this.topvoltersData;
        }
        else if(exch === 'B'){
          this.BscToppers = this.topvoltersData;
        }
      }
      else{
        //this.dataLoad = true;
        this.NscToppers = [];
        this.BscToppers = [];
      }
     
     //  this.displayVol(this.NscToppers);
    })
  

  }

  changeVolNumberFormat(value: any){
    value = Math.round(value / 1000)
    return (parseFloat(value).toLocaleString('en-IN'))
  }
  // ionViewWillEnter(){
   
   
  // }

// nsc bsc value will change according to toogle
  changeVolValue(event: any){
    if(event == true){
      this.ExchTypeCompanyDetail = 'B';
      if(this.BscToppers.length > 0){
        this.volToppersList = this.BscToppers;
       }
       else{
        this.volToppersList = [];
       }
    }
    else if(event == false){
      this.ExchTypeCompanyDetail = 'N';
      if(this.NscToppers.length > 0){
        this.volToppersList = this.NscToppers;
       }
       else{
        this.volToppersList = [];
       }
    }
  }
 
  openModal(id?: any , arr?: any) {
    if (!arr.length) {
      return;
    }
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }
  goToCompanydetail(data: any){
    this.router.navigate(['/company-details', this.ExchTypeCompanyDetail, 'C', data.Token, data.FullName.split(' ').join('-') + 'C', data.Symbol]);
  }
  fromModelToCompanydetail(data: any, id: any){
    this.closeModal(id);
    this.router.navigate(['/company-details', this.ExchTypeCompanyDetail, 'C', data.Token, data.FullName.split(' ').join('-') + 'C', data.Symbol]);
  }
}
