import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiltersComponent } from '../filters/filters.component';
import { OrderPipe } from 'ngx-order-pipe';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { CommonService } from '../../helpers/common.service';
import { SplitNameDate } from '../../helpers/splitNameDate.pipe';
import { Router } from '@angular/router';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-consolidated-tradebook',
  providers: [SplitNameDate],
  templateUrl: './consolidated-tradebook.component.html',
  styleUrls: ['./consolidated-tradebook.component.scss'],
})
export class ConsolidatedTradebookComponent implements OnInit {

  @Input() consTradeBook: any[] = [];
  @Input() userID:any;
  public isAtoZSorting: boolean = false;
  public isRefresh: boolean = false;
  public filterOption: any = 'client_code';
  public mobilefilterOption: any = 'client_code';
  public order: string = 'clientCode';
  public reverse: boolean = false;
  public colorFilterIcon: boolean = false;
  public orderbookFilter: any;
  public statusSegmentValue: any = 'delivery';
  consTradeBookDetails:any[] = [];
  consTradeBookData: any[] = [];
  searchTerm: string = '';
  public ascending: boolean = true;
  public val: string = 'asc';
  isAscendic!: boolean;
  SearchPlaceHolder:string = "Search by Client Code"
  segmentSelect:any = null;
  tokenValue:any;
  productChange:boolean = false;
  endIndex: number = 100;
  enableNextMobile: boolean = false;
  public productSegmentButton: any[] = [
    { button: 'Delivery', value: 'delivery' },
    { button: 'Intraday', value: 'intraday' },
  ];

  constructor(private modalController: ModalController, private orderPipe: OrderPipe,private storage: StorageServiceAAA, private clientService: ClientTradesService, private commonservice: CommonService,private router: Router, private splitNameFromDate: SplitNameDate) { }

  ngOnInit() {
    this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('sToken').then(token => {
					this.tokenValue = token;
					
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					// console.log(this.tokenValue);
				})
			}
		})
    this.isRefresh = true;
    // this.storage.get('sToken').then((token) => {
      setTimeout(() => {
        this.clientService.getConsTradeBook(this.tokenValue, this.userID).subscribe((res: any) => {
          if (res['head']['status'] == 0) {
            this.consTradeBookDetails = res['body']['OrderBookAAA'];
            this.consTradeBookDetails.forEach((element, index) => {
              element.srNo = index;
            })
           
          this.consTradeBookData = this.consTradeBookDetails;
            if(this.consTradeBookData.length > 100) this.enableNextMobile = true;
            setTimeout(() => {
              this.isRefresh = false;
            }, 500);
          }
        })
      // })
       this.orderPipe.transform(this.consTradeBookData, 'ClientCode');
      }, 400);
      this.commonservice.setClevertapEvent('ConsolidatedTradebook');
  }


  //sorting function for column
  setOrder(value: string) {
    this.enableNextMobile = false;
    if(this.consTradeBookData.length > 100){
			this.isRefresh = true;
		}
    this.reverse = !this.reverse;
    this.order = value;
    if (this.reverse) {
        this.ascending = false;
        this.val = 'desc';
    } else {
        this.ascending = true;
        this.val = 'asc';
    }
    if(this.consTradeBookData.length > 100){
			setTimeout(() => {
				this.enableNextMobile = true;
				this.endIndex = 100;
				this.desktopTablescrollToTop();
				this.isRefresh = false;
			}, 400);
		}
  }
  
  sortByStatus() {
    this.isAtoZSorting = true;
    this.statusSegmentValue = null;
    this.consTradeBookData = this.consTradeBookDetails;
    this.consTradeBookDetails.forEach((element, index) => {
        if(element.DelvIntra == 'S'){
          element.DelvIntra = 'BO'
        }
    })
    
    this.setOrder('DelvIntra');
  }

  dropClick(sr: any, arr: any) {
    arr.forEach((element: any, ind: any) => {
      if (sr !== element.srNo) {
        element['isVisible'] = false;
      } else {
        element['isVisible'] = element['isVisible'] ? false : true;
      }
    });
  }
 

  // filter popup scrip name, code, requested by and quantity
  async filterPopup() {
    this.colorFilterIcon = true;
    const modal = await this.modalController.create({
      component: FiltersComponent,
      cssClass: 'filter tradebook',
      componentProps: {
        orderbookFilter: [
          { option: 'Client Code' },
          { option: 'Scrip Name' },
          { option: 'Product' },
        ]
      }
    });
    modal.onDidDismiss().then(data => {
      if (data['data']) {
        const response = data['data'];
        this.searchTerm = '';
        this.resetData();
        if (response['result']['option'] === 'Client Code') {
          this.mobilefilterOption = 'client_code';
          this.SearchPlaceHolder= "Search by Client Code"
        }else if (response['result']['option'] === 'Scrip Name') {
          this.mobilefilterOption = 'scrip_name';
          this.SearchPlaceHolder= "Search by Scrip Name"
        } else if (response['result']['option'] === 'Status') {
          this.mobilefilterOption = 'status';
        } else if (response['result']['option'] === 'Product') {
          this.mobilefilterOption = 'product';
          this.changeStatus('delivery');
        }
      }
      this.enableNextMobile = false;
			setTimeout(() => {
				this.enableNextMobile = true;
				if(this.consTradeBookData.length > 100) this.enableNextMobile = true;
				this.desktopTablescrollToTop();
			}, 400);
    });
    return await modal.present();
  }


 
  resetData(flag?: any) {
    // console.log(flag);
    this.searchTerm = '';
    this.isRefresh = true;
    this.reverse = false;
    this.order = "srNo"
   
     if(flag == '2'){
      this.statusSegmentValue = 'delivery';
      this.consTradeBookData = this.consTradeBookDetails;
      this.consTradeBookData = this.consTradeBookData.filter(function (el) {
        return el.DelvIntra == "D"
      });
    }
    else{
      this.consTradeBookData = this.consTradeBookDetails;
    }
    setTimeout(() => {
      this.isRefresh = false;
    }, 500);


   // this.statusSegmentValue = 'delivery';
  }

  selectFilterOption(event: any) {
    if (event == 'client_code') {
      if(this.searchTerm.length > 0 || this.productChange){
        this.resetData();
        this.searchTerm = '';
        this.productChange = false;
      }
      
    }
    else if(event == 'scrip_name'){
      if(this.searchTerm.length > 0 || this.productChange){
        this.resetData();
        this.searchTerm = '';
        this.productChange = false;
      }
    }
    if (event == 'product') {
      this.changeStatus('delivery');
    }
  }
  // filter with search on select
  searchType(event: any, type: any){
    this.isRefresh = true;
		this.enableNextMobile = false;
    this.consTradeBookData = this.consTradeBookDetails;
    if(type == '1'){
      this.consTradeBookData = this.consTradeBookData.filter((item) => {
        return item.ClientCode.toLowerCase().includes(event.toLowerCase());
        });
    }
    if(type == '2'){
      this.consTradeBookData = this.consTradeBookData.filter((item) => {
        return item.ScripName.toLowerCase().includes(event.toLowerCase());
        });
    }
    setTimeout(() => {
			this.endIndex = 100;
			this.enableNextMobile = true;
			this.desktopTablescrollToTop();
			this.isRefresh = false;
		}, 400);
  }

  changeStatus(status: any) {
    this.isAtoZSorting = false;
    if (status == 'delivery') {
      this.resetData('2');
      // console.log(this.statusSegmentValue);
      this.productChange = true;
      this.consTradeBookData = this.consTradeBookData.filter(function (el) {
        return el.DelvIntra == "D"
      });
    }
    if (status == 'intraday') {
      this.resetData();
      this.productChange = true;
      this.consTradeBookData = this.consTradeBookData.filter(function (el) {
        return el.DelvIntra == "I"
      });
    }
  }

  goToClientDetails(dataObj: any){
		if(this.splitNameFromDate.transform(dataObj.ScripName,"date").length == 0){
			this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, dataObj.ScripName.split(' ')[0] + dataObj.ExchType, dataObj.ScripName.split(' ')[0]]);
		}
		else{
			if(dataObj.ScripName.includes('CE') || dataObj.ScripName.includes('PE')){
				this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, this.splitNameFromDate.transform(dataObj.ScripName,"date").split(' ').join('-').toUpperCase().substring(1) + dataObj.ExchType, dataObj.ScripName.split(' ')[0]])
			}
			else{
				this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, this.splitNameFromDate.transform(dataObj.ScripName,"date").split(' ').join('-').toUpperCase().substring(1) + dataObj.ExchType, dataObj.ScripName.split(' ')[0]])
			}
		}

	}

  tableScroll = (event: any) => {


		if(this.consTradeBookData.length > this.endIndex){
			const tableHeight = event.target.offsetHeight;
			const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;
      

	
			if (tableScrollTop >= scrollerEndPoint - 100) {
				this.endIndex += 100;
     
			}
		}
		
	}
  desktopTablescrollToTop = () => {

		let table: any = document.getElementById("desktopTableContainer");
		if(table) table.scrollTop = 0;       
		
		let dataMobile: any = document.getElementById("mobileTableContainer");
		if(dataMobile) dataMobile.scrollTop = 0;    
	}

  loadDataMobile = (event: any) => {

		this.enableNextMobile = false;
		if(this.consTradeBookData.length > this.endIndex) this.enableNextMobile = true;

		if(this.enableNextMobile){

				this.endIndex += 100;
				event.target.complete();
				if(this.endIndex > this.consTradeBookData.length){
					event.target.disabled = true;
				}

		}		
	}
}
