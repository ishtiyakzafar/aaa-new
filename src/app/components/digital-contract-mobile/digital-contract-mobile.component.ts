import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import * as _ from 'lodash';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-digital-contract-mobile',
  providers: [ShareReportService],
  templateUrl: './digital-contract-mobile.component.html',
  styleUrls: ['./digital-contract-mobile.component.scss'],
})
export class DigiContractMobileComponent implements OnInit {

  private subscription: any;
  public isProd = environment['production'];
  moment: any = moment;
  @Input() dailyBillsParams: any;
  @Input() digitalContractParams: any;
  settlementList: any = [];
  dataLoad: boolean = false;
  listLoad!: boolean;
  dailyBillReport: any;
  list: any = [
    { option: 'Normal', value: 'N' },
    { option: 'Odd Lot / T2T', value: 'T' },
    { option: 'Physical Delivery', value: 'P' },
    { option: 'Normal T+1', value: 'M' },
    { option: 'Oddlot/T2T T+1', value: 'Z' },
    { option: 'Buyback', value: 'B' },
    { option: 'OFS', value: 'H' },
    { option: 'ITP', value: 'I' }
  ]
  constructor(private storage: StorageServiceAAA, private platform: Platform, private router: Router, private commonService: CommonService, private toast: ToasterService, private shareReportSer: ShareReportService) { }
  
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.dailyBillsParams && this.dailyBillsParams.reportType == 'dailyBills') {
  //     this.dailyBillReport = true;
  //   } else if (this.digitalContractParams && this.digitalContractParams.reportType == 'digitalContract') {
  //     this.dailyBillReport = false;
  //   }
  //   this.getSettlementList();
  // }
  
  ngOnInit() {
    // if (!this.platform.is('desktop')) {
      let data: any = this.commonService.getData();
      if (data && data['reportType'] == 'dailyBills') {
        this.dailyBillReport = true;
        this.dailyBillsParams = data;
      } else if (data && data['reportType'] == 'digitalContract') {
        this.dailyBillReport = false;
        this.digitalContractParams = data;
      }
      this.getSettlementList();
    // }
  }

  /**
   * To get token for SettlementDetails 
   */
  getSettlementList() {
    this.settlementList = [];
    this.storage.get('userType').then(type => {
      if (type === 'RM' || type === 'FAN') {
        this.storage.get('bToken').then(token => {
          this.getList(token)
        })
      } else {
        this.storage.get('subToken').then(token => {
          this.getList(token)
        })
      }
    })
  }

  /**
   * To get settlement list
   */
  getList(token: any) {
    this.listLoad = false;
    let exchange;
    let obj;
    if (this.dailyBillReport) {
      obj = {
        'ClientCode': this.dailyBillsParams.clientCode,
        'FromDate': this.dailyBillsParams.fromDate,
        'ToDate': this.dailyBillsParams.ToDate,
        'Exchange': this.dailyBillsParams.exchange
      }
    } else {
      exchange = this.digitalContractParams.exchange == 'NSE-Physical' ? 'NF' : this.digitalContractParams.exchange == 'BSE-Physical' ? 'BF' : this.digitalContractParams.exchange == 'MCX' ? 'MCX' : this.digitalContractParams.exchange == 'NCDEX' ? 'IND' : this.digitalContractParams.exchange;
      obj = {
        'ClientCode': this.digitalContractParams.clientCode,
        'FromDate': this.digitalContractParams.fromDate,
        'ToDate': this.digitalContractParams.ToDate,
        'Exchange': exchange == 'NF' || exchange == 'BF' || exchange == 'MCX' || exchange == 'IND' ? exchange : this.digitalContractParams.exchange.split('-')[0] + this.digitalContractParams.exchange.split('-')[1].toUpperCase()
      }
    }
    this.shareReportSer.getSettlementList(token, obj).subscribe((res) => {
      if (res['Head']['ErrorCode'] == 0) {
        this.settlementList = res['Body']['SettlementDetailsMasterBody'].map((item: any) => {
          const container: any = {};
          container['Exchange'] = item.Exchange;
          container['SettlementNo'] = item.td_STLMNT;
          container['clientCode'] = this.dailyBillReport ? this.dailyBillsParams.clientCode : this.digitalContractParams.clientCode;
          container['Date'] = item.td_dt == "" ? '-' : moment(item.td_dt).format("DD/MM/YYYY");
          container['Type'] = _.find(this.list, function (i) {
            if (i.value === item.Type) {
              return i.option;
            }
          });
          container['td_dt'] = item.td_dt;

          return container;
        })
        this.listLoad = true;
      }
      else {
        this.toast.displayToast(res.Head.ErrorDescription);
        this.settlementList = [];
        this.listLoad = true;
      }
    })
  }
  /**
   * On click of download pdf
   */
  download(data: any) {
    let ob = {
      action: 'download',
      date: data.td_dt,
      type: data.Type.value,
      settlementNo: data.SettlementNo
    }
    this.getToken(ob);
  }

  /**
   * On click of email 
   */
  email(data: any) {
    let ob = {
      action: 'email',
      date: data.td_dt,
      type: data.Type.value,
      settlementNo: data.SettlementNo
    }
    this.getToken(ob);
  }

  goBack() {
    window.history.back();
  }

  goToNotification() {
		this.router.navigate(['/notification']);
	}

	goToSearch() {
		//this.router.navigate(['/add-script']);
    this.router.navigate(['/dashboard-clients']);
	}

  getToken(data: any) {
    var tokenValue: any;
    this.dataLoad = true;
    // this.storage.get('userID').then((userID) => {
      this.storage.get('userType').then(type => {
        if (type === 'RM' || type === 'FAN') {
          this.storage.get('bToken').then(token => {
            tokenValue = token;
            if (data.action == 'download') {
              this.downLoadPassObj(tokenValue, data)
            } else {
              this.sendEmailPayload(tokenValue, data);
            }
          })
        } else {
          this.storage.get('subToken').then(token => {
            tokenValue = token;
            if (data.action == 'download') {
              this.downLoadPassObj(tokenValue, data)
            } else {
              this.sendEmailPayload(tokenValue, data);
            }
          })
        }
      // })
    });
  }
  downLoadPassObj(token: string, settlementObj: any) {
    var downloadObj: any;
    if (this.dailyBillReport) {
      downloadObj = {
        rptId: this.dailyBillsParams.exchangeDailyBillsValue == 'BSE CASH' || this.dailyBillsParams.exchangeDailyBillsValue == 'NSE CASH' ? '187' : '183',
        SendEmail: "N",
        clientCode: this.dailyBillsParams.clientCode,
        ClientCode: this.dailyBillsParams.clientCode,
        Date: settlementObj && settlementObj.date ? settlementObj.date : undefined,
        ExchangeType: this.dailyBillsParams.exchangeDailyBillsValue.split(' ')[1] == 'CASH' ? 'C' : this.dailyBillsParams.exchangeDailyBillsValue.split(' ')[1] == 'CURRENCY' ? 'U' : 'D',
        Exchange: this.dailyBillsParams.exchangeDailyBillsValue.split(' ')[0].charAt(0),
        Settlement: settlementObj && settlementObj.settlementNo ? settlementObj.settlementNo : undefined
      }
      downloadObj = this.dailyBillsParams.exchangeDailyBillsValue == 'BSE CASH' || this.dailyBillsParams.exchangeDailyBillsValue == 'NSE CASH' ? _.omit(downloadObj, ['ExchangeType', 'Exchange', 'ClientCode']) : _.omit(downloadObj, ['Settlement', 'clientCode']);
    }
    else {
      downloadObj = {
        rptId: this.digitalContractParams.detailedSummarisedValue == 'Detailed' ? '182' : '186',
        SendEmail: "N",
        ClientCode: this.digitalContractParams.clientCode,
        Date: settlementObj && settlementObj.date ? settlementObj.date : undefined,
        ExchType: this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase() == 'CASH' ? 'C' : this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase() == 'CURRENCY' ? 'U' : this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase() == 'FNO' ? 'D' : (this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase() == 'MCX' || this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase() == 'NCDEX') ? 'Y' : this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase(),
        Exch: this.digitalContractParams.digitalContactExchValue.split('-')[0].charAt(0),
        SettlementType: settlementObj && settlementObj.type ? settlementObj.type : undefined,
        BuySellFlag: ""
      }
      if (this.digitalContractParams.digitalContactExchValue.split('-')[0] == 'MCX') {
        downloadObj = {
          rptId: this.isProd ? '448' : '13355',
          Client: this.digitalContractParams.clientCode,
          TradeDt: settlementObj && settlementObj.date ? settlementObj.date : undefined,
          SendEmail: 'N'
        }
      } else if (this.digitalContractParams.digitalContactExchValue.split('-')[0] == 'NCDEX') {
        downloadObj = {
          rptId: this.isProd ? '449' : '13361',
          Client: this.digitalContractParams.clientCode,
          TradeDt: settlementObj && settlementObj.date ? settlementObj.date : undefined,
          SendEmail: 'N'
        }
      }
    }
    downloadObj.CallFrom= "AAA";

    this.getDownloadData(token, downloadObj)
  }

  getDownloadData(token: any, obj: any) {
    this.subscription = new Subscription();
    this.subscription.add(
      this.shareReportSer
        .sharedDownloadReport(token, obj)
        .subscribe((res) => {
          this.dataLoad = false;
          this.commonService.downLoadReportFun(res)
        }))
  }

  sendEmailPayload(token: string, settlementObj: any) {
    this.subscription = new Subscription();
    var obj: any;
    if (this.dailyBillReport) {
      obj = {
        rptId: this.dailyBillsParams.exchangeDailyBillsValue == 'BSE CASH' || this.dailyBillsParams.exchangeDailyBillsValue == 'NSE CASH' ? '187' : '183',
        SendEmail: "Y",
        clientCode: this.dailyBillsParams.clientCode,
        ClientCode: this.dailyBillsParams.clientCode,
        Date: settlementObj && settlementObj.date ? settlementObj.date : undefined,
        ExchangeType: this.dailyBillsParams.exchangeDailyBillsValue.split(' ')[1] == 'CASH' ? 'C' : this.dailyBillsParams.exchangeDailyBillsValue.split(' ')[1] == 'CURRENCY' ? 'U' : 'D',
        Exchange: this.dailyBillsParams.exchangeDailyBillsValue.split(' ')[0].charAt(0),
        Settlement: settlementObj && settlementObj.settlementNo ? settlementObj.settlementNo : undefined
      }
      obj = this.dailyBillsParams.exchangeDailyBillsValue == 'BSE CASH' || this.dailyBillsParams.exchangeDailyBillsValue == 'NSE CASH' ? _.omit(obj, ['ExchangeType', 'Exchange', 'ClientCode']) : _.omit(obj, ['Settlement', 'clientCode']);
    } else {
      obj = {
        rptId: this.digitalContractParams.detailedSummarisedValue == 'Detailed' ? '182' : '186',
        SendEmail: "Y",
        ClientCode: this.digitalContractParams.clientCode,
        Date: settlementObj && settlementObj.date ? settlementObj.date : undefined,
        ExchType: this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase() == 'CASH' ? 'C' : this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase() == 'CURRENCY' ? 'U' : this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase() == 'FNO' ? 'D' : (this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase() == 'MCX' || this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase() == 'NCDEX') ? 'Y' : this.digitalContractParams.digitalContactExchValue.split('-')[1].toUpperCase(),
        Exch: this.digitalContractParams.digitalContactExchValue.split('-')[0].charAt(0),
        SettlementType: settlementObj && settlementObj.type ? settlementObj.type : undefined,
        BuySellFlag: ""
      }
      if (this.digitalContractParams.digitalContactExchValue.split('-')[0] == 'MCX') {
        obj = {
          rptId: this.isProd ? '448' : '13355',
          Client: this.digitalContractParams.clientCode,
          TradeDt: settlementObj && settlementObj.date ? settlementObj.date : undefined,
          SendEmail: "Y",
        }
      } else if (this.digitalContractParams.digitalContactExchValue.split('-')[0] == 'NCDEX') {
        obj = {
          rptId: this.isProd ? '449' : '13361',
          Client: this.digitalContractParams.clientCode,
          TradeDt: settlementObj && settlementObj.date ? settlementObj.date : undefined,
          SendEmail: 'Y'
        }
      }
    }
    obj.CallFrom = "AAA";
    this.subscription.add(
      this.shareReportSer
        .sharedDownloadReport(token, obj)
        .subscribe((res) => {
          if (res && res.Body && res.Body.Msg) {
            this.toast.displayToast(res.Body.Msg);
          }
          else {
            this.toast.displayToast(res.Head.ErrorDescription);
          }
          this.dataLoad = false;
        }
        ))
  }
}