import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../modal/modal.service';
import { MarketService } from '../../pages/markets/markets.service';
import { CommonService } from '../../helpers/common.service';
import {Router } from "@angular/router";

@Component({
  selector: 'app-bulk-block-deals',
  providers: [MarketService],
  templateUrl: './bulk-block-deals.page.html',
  styleUrls: ['./bulk-block-deals.page.scss'],
})
export class BulkBlockDealsPage implements OnInit {
  @Input() bulkBlockDealsList: any;
  @Input() dealDataLoad: any;
  public dataLoad!: boolean;
  public bulkBlockDealsListSecond: any[] = [];
  NscBulk:any = [];
  NscBlock:any = [];
  BscBulk:any = [];
  BscBlock:any = [];
  bulkBlockBtn:any;
  bulkList:any = []; 
  blockList:any = []; 
  ExchTypeCompanyDetail!:string;

  constructor(private modalService: ModalService, private marService: MarketService, private commonservice: CommonService, private router: Router) { }

  ngOnInit() {
    this.initBulkBlockData('N');
    this.initBulkBlockData('B');
    
    setTimeout(() => {
      this.bulkBlockBtnToggle(false);
    }, 1000);
    this.ExchTypeCompanyDetail = 'N';
  }
// Data of bulk and block on init
  initBulkBlockData(Exch: any){
    if(Exch === 'N'){
      this.marService.bulkBlock('n','bulk').subscribe(data => {
        if(data['status'] == 0) {
          setTimeout(() => {
            this.dataLoad = true;
          }, 1200);
        } else {
          setTimeout(() => {
            this.dataLoad = true;
          }, 1200);
        }
        this.NscBulk = data.response.data.SectorIndexConstituentStocksList.DealData;
        ////console.log('Nsc bulk',this.NscBulk);
      })
      this.marService.bulkBlock('n','block').subscribe(data => {
        if(data['status'] == 0) {
          setTimeout(() => {
            this.dataLoad = true;
          }, 1200)
        } else {
          setTimeout(() => {
            this.dataLoad = true;
          }, 1200)
        }
        this.NscBlock = data.response.data.SectorIndexConstituentStocksList.DealData;
        //console.log('Nsc block',this.NscBlock);
      })
    }
    if(Exch === 'B'){
      this.marService.bulkBlock('b','bulk').subscribe(data => {
        if(data['status'] == 0) {
          setTimeout(() => {
            this.dataLoad = true;
          }, 1200)
        } else {
          setTimeout(() => {
            this.dataLoad = true;
          }, 1200)
        }
        this.BscBulk = data.response.data.SectorIndexConstituentStocksList.DealData;
        //console.log('Bsc bulk',this.BscBulk);
      })
      this.marService.bulkBlock('b','block').subscribe(data => {
        if(data['status'] == 0) {
          setTimeout(() => {
            this.dataLoad = true;
          }, 1200)
        } else {
          setTimeout(() => {
            this.dataLoad = true;
          }, 1200)
        }
        this.BscBlock = data.response.data.SectorIndexConstituentStocksList.DealData;
        //console.log('Bsc block',this.BscBlock);
      })
    }
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

  // toogle to change NSC BSC
  bulkBlockBtnToggle(event: any){
    if(event == true){
      this.ExchTypeCompanyDetail = 'B';
      //console.log('true');
      if(this.BscBulk.length > 0 && this.BscBlock.length > 0){
        this.bulkList = this.BscBulk;
        this.blockList = this.BscBlock;
      }
      else if(this.BscBulk.length > 0 && this.BscBlock.length == 0){
        this.bulkList = this.BscBulk;
        this.blockList = [];
      }
      else if(this.BscBulk.length == 0 && this.BscBlock.length > 0){
        this.bulkList = [];
        this.blockList = this.BscBlock;
      }
      else{
        this.bulkList = [];
        this.blockList = [];
      }
    }

    else if(event == false){
      this.ExchTypeCompanyDetail = 'N';
      //console.log('false');
      if(this.NscBulk.length > 0 && this.NscBlock.length > 0){
        this.bulkList = this.NscBulk;
        this.blockList = this.NscBlock;
      }
      else if(this.NscBulk.length > 0 && this.NscBlock.length == 0){
        this.bulkList = this.NscBulk;
        this.blockList = [];
      }
      else if(this.NscBulk.length == 0 && this.NscBlock.length > 0){
        this.bulkList = [];
        this.blockList = this.NscBlock;
      }
      else{
        this.bulkList = [];
        this.blockList = [];
      }
    }
 
   
  }

  openModal(id?: any, bulkList?: any, blockList?: any) {
    if (!bulkList.length && !blockList.length) {
      return;
    }
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }
  // Change Number Format to Normal
  changeQtyNumberFormat(value: any){
		return this.commonservice.numberFormatWithOnly_K(value);
  }
  
  goToCompnayDetail(data: any){
    this.router.navigate(['/company-details', this.ExchTypeCompanyDetail, 'C', data.ScripCode, data.ScripName.split(' ').join('-') + 'C', data.Symbol]);
  }
  fromModelToCompanyDetails(data: any, id: any){
    this.closeModal(id);
    this.router.navigate(['/company-details', this.ExchTypeCompanyDetail, 'C', data.ScripCode, data.ScripName.split(' ').join('-') + 'C', data.Symbol]);
  }
}
