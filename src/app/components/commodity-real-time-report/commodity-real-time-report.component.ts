import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-commodity-real-time-report',
  templateUrl: './commodity-real-time-report.component.html',
  styleUrls: ['./commodity-real-time-report.component.scss'],
  providers: [ ShareReportService],
})
export class CommodityRealTimeReportComponent implements OnInit, OnChanges {

  @Input() cCode: any;
  clientCode:any;
  commodityRealtimeData:any = [];
  tableLoader: boolean = false;
  isShow: boolean = false;
  isShowToday: boolean = false;
  dataLoader: boolean = false;
	@Input() callFromDesktop: boolean = false;

  constructor(private shareReportSer: ShareReportService,private storage: StorageServiceAAA,  private commonservice: CommonService,
    public toast: ToasterService) { }

  ngOnChanges(): void {
		if (this.callFromDesktop) {
			this.callCommodityRealtimeReportApi();
		}
	}


	ngOnInit(): void {
		if (!this.callFromDesktop) {
			this.cCode = this.commonservice.getData();
			this.callCommodityRealtimeReportApi();
		}
		// console.log('enter')
		// this.displayLedgerdata(this.ledgerData);
	}

  callCommodityRealtimeReportApi = () => {

    this.clientCode = this.cCode;
    this.dataLoader = true;
      this.storage.get('userType').then(type => {
        if (type === 'RM' || type === 'FAN') {
          this.storage.get('bToken').then(token => {
            this.getCommodityrealtimereport(token,this.clientCode);
          })
        } else {
          this.storage.get('subToken').then(token => {
            this.getCommodityrealtimereport(token,this.clientCode);
          })
        }
      });
    // this.route.params.subscribe(params => {
		// 	this.clientCode = params['id'] ? params['id'] : this.cCode ;
    //   this.storage.get('userType').then(type => {
    //     if (type === 'RM' || type === 'FAN') {
    //       this.storage.get('bToken').then(token => {
    //         this.getCommodityrealtimereport(token,this.clientCode);
    //       })
    //     } else {
    //       this.storage.get('subToken').then(token => {
    //         this.getCommodityrealtimereport(token,this.clientCode);
    //       })
    //     }
    //   })
    // });
  }

  public getCommodityrealtimereport(cookievalue: any,loginid: any){
    this.tableLoader = true;
    this.shareReportSer.getCommodityrealtimereport(cookievalue,loginid).subscribe((res) => {
			if (res['Head']['ErrorCode'] == 0) {
        this.tableLoader = false;
        this.commodityRealtimeData = res['Body'];
        this.dataLoader = false;
      }
      else{
        this.tableLoader = false;
        this.commodityRealtimeData = [];
        this.toast.displayToast(res['Head']['ErrorDescription']);
        this.dataLoader = false;
      }
    });
  }

  toggleFlag(){
    this.isShow = !this.isShow;
  }

  toggleFlagToday(){
    this.isShowToday = !this.isShowToday;
  }

  goBack() {
    window.history.back();
  }

}
