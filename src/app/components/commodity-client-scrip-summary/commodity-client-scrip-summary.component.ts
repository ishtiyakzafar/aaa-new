import { Component, OnInit } from '@angular/core';
import { DateSortingPipe } from '../../helpers/date-sorting.pipe';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-commodity-client-scrip-summary',
  templateUrl: './commodity-client-scrip-summary.component.html',
  styleUrls: ['./commodity-client-scrip-summary.component.scss'],
})
export class CommodityClientScripSummaryComponent implements OnInit {

  dataLoad = false;
  commodityClientScripData: any[] = [];
  clonedArr: any[] = [];
  public order: string = 'ExpiryDate';
  public reverse: boolean = false;
  public ascendingOrder: boolean = true;
  public dateSorting: any = DateSortingPipe;
  searchValue:any;
  visible: boolean = false;
  isDiv = false;
  public val: string = 'asc';

  constructor(public toast: ToasterService,private commonService: CommonService,private wireReqService: WireRequestService,private storage: StorageServiceAAA) { }

  ngOnInit() {
    this.storage.get('userType').then(type => {
      if (type === 'RM' || type === 'FAN') {
        this.storage.get('bToken').then(token => {
          this.getScripData(token);
        })
      } else {
        this.storage.get('subToken').then(token => {
          this.getScripData(token);
        })
      }
    });
  }

  getScripData(token: any){
    this.commonService.setClevertapEvent('CommodityClientScripSummary_Report_Clicked', { 'Login ID': localStorage.getItem('userId1') });
    this.dataLoad = true;
    this.wireReqService.getCommodityClientScripSummary(token).subscribe((res: any) => {
        if(res['Head']['ErrorCode'] == 0){
          
          this.commodityClientScripData = res['Body'];
          this.clonedArr = res['Body'];
          this.dataLoad = false;
        }
      });
  }

  setOrder(value: string){ 	
      this.order = value;
      this.reverse = !this.reverse;
      if (this.reverse) {
        this.ascendingOrder = false;
        this.val = 'desc';
      } else {
        this.ascendingOrder = true;
        this.val = 'asc';
      }
  }

  downloadReport() {
    this.commonService.setClevertapEvent('CommodityClientScripSummary_Download_Clicked', { 'Login ID': localStorage.getItem('userId1') });
    if (this.commodityClientScripData.length > 0) {
        let info = [];
        let head = [["ClientID", "Symbol", "Description", "Expiry Date", "Buy", "Sell", "Net Qty", "Average Rate", "Close Price"]];

        for(let i=0; i<this.commodityClientScripData.length;i++){
          info.push([this.commodityClientScripData[i]['ClientId'], this.commodityClientScripData[i]['Symbol'], this.commodityClientScripData[i]['Description'], this.commodityClientScripData[i]['ExpiryDate'], this.commodityClientScripData[i]['Buy'],this.commodityClientScripData[i]['Sell'],this.commodityClientScripData[i]['NetQty'],this.commodityClientScripData[i]['AverageRate'],this.commodityClientScripData[i]['ClosePrice']]);
        }
        
        this.commonService.exportDataToExcel(head[0], info, 'Commodity Client Scrip Summary');
    } else {
        this.toast.displayToast('No Data Found');
    }
}

public searchText(txt: any) {
  if (txt) {
      this.searchValue = txt.trim();
      this.commodityClientScripData = this.clonedArr.filter((item) => {
          return item.ClientId.toLowerCase().includes(this.searchValue.toLowerCase()) || item.Symbol.toLowerCase().includes(this.searchValue.toLowerCase());
      });
  }
  else {
    this.commodityClientScripData = this.clonedArr;
  }
}

  close() {
    this.isDiv = false;
    this.visible = false;
  }

  goBack() {
    window.history.back();
  }
  
}
