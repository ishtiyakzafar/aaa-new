import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import * as _ from 'lodash';
import { Platform } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-digital-contract-notes',
  providers: [ShareReportService],
  templateUrl: './digital-contract-notes.component.html',
  styleUrls: ['./digital-contract-notes.component.scss'],
})
export class DigiContractNotesComponent implements OnInit, OnChanges {
  moment: any = moment;
  @Input() dailyBillsParams: any;
  @Input() digitalContractParams: any;
  @Output() downloadPdf = new EventEmitter;
  @Output() emailToClient = new EventEmitter;
  settlementList: any = [];
  dataLoad!: boolean;
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
  constructor(private storage: StorageServiceAAA, private platform: Platform, private commonService: CommonService, private toast: ToasterService, private shareReportSer: ShareReportService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.dailyBillsParams && this.dailyBillsParams.reportType == 'dailyBills') {
      this.dailyBillReport = true;
    } else if (this.digitalContractParams && this.digitalContractParams.reportType == 'digitalContract') {
      this.dailyBillReport = false;
    }
    this.getSettlementList();
  }
  ngOnInit() {
    if (!this.platform.is('desktop')) {
      let data: any = this.commonService.getData();
      if (data && data['reportType'] == 'dailyBills') {
        this.dailyBillReport = true;
        this.dailyBillsParams = data;
      } else if (data && data['reportType'] == 'digitalContract') {
        this.dailyBillReport = false;
        this.digitalContractParams = data;
      }
      this.getSettlementList();
    }
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
    this.dataLoad = false;
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
        this.dataLoad = true;
      }
      else {
        this.toast.displayToast(res.Head.ErrorDescription);
        this.settlementList = [];
        this.dataLoad = true;
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
    this.downloadPdf.emit(ob);
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
    this.emailToClient.emit(ob);
  }

  goBack() {
    window.history.back();
  }
}